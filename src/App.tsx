import { ArcRotateCamera, Color4, HemisphericLight, Mesh, Scene, SceneLoader, Sound, Vector3, Animation, Animatable, SimplificationQueue } from '@babylonjs/core'
import React, { useState } from 'react'
import './App.css'
import SceneComponent from './components/SceneComponent'
import ModelClip from './components/feature/ModelClip'
import { ModelStretch, ModelFall } from './components/feature/ModelSimpleAnimation'
import Loader from './components/ui/Loader'
import { groupby } from './utils/ArrayExtension'

import modelUrl from './assets/model/888.glb?url'
//import musicUrl from './assets/music/1.MP3?url'

/** @type {Scene} 场景 */
let scene: Scene;

/** @type {Array<Mesh>} 存储所有mesh*/
let meshes: Array<Mesh> = new Array<Mesh>();

/** @type {number} 帧速率 fps*/
const frameRate: number = 60;

/** @type {number} 开始帧 */
const startFrame: number = 0;

/** @type {*} 动画时间*/
const time: number = 2.5;

/** @type {*} mesh 初始 y轴位置 */
const originY: number = 5;

/** @type {*} 当前加载mesh的index*/
let currentLoadMeshIndex: number = 0;

type modeType = {
  name: string,
  component: JSX.Element
}

function App() {

  const [isLoading, setLoading] = useState(true);
  const [modes, setModes] = useState<Array<modeType>>(new Array<modeType>());
  const [modeIndex, setModeIndex] = useState(0);

  const onSceneReady = (s: Scene) => {
    scene = s;
    scene.clearColor = new Color4(0, 0, 0, 0);

    //const music = new Sound("cello", musicUrl, scene, null, { loop: true, autoplay: true });

    const camera = new ArcRotateCamera("camera", Math.PI / 2, Math.PI / 2.5, 100, new Vector3(0, 0, 0), scene);
    camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
    camera.lowerRadiusLimit = camera.radius * 0.1;
    camera.upperRadiusLimit = camera.radius * 1;
    // camera.upperBetaLimit = camera.beta;
    // camera.lowerBetaLimit = camera.beta;

    const light = new HemisphericLight("light", new Vector3(0, 1, 0), scene);
    //const light2 = new HemisphericLight("light", new Vector3(0, -1, 0), scene);

    //加载模型并分析称meshes
    SceneLoader.LoadAssetContainer(modelUrl, undefined, scene, container => {
      let meshMap = groupby(container.meshes, v => v.name.split('_')[0], v => v as Mesh);

      meshMap.forEach((meshGroup, key) => {
        let num = key.match(/(\d+)$/g);
        if (!num) {
          console.warn("mesh map exist key not end with number", { key, meshGroup });
          return;
        }

        try {
          let mesh = Mesh.MergeMeshes(meshGroup, true, true, undefined, false, true);
          if (mesh) {
            meshes[Number.parseInt(num[0])] = mesh;
          }
        } catch (error) {
          console.error(error);
        }
      })
      meshes = meshes.filter(mesh => mesh);

      setModes([{
        name: "落 叶",
        component: <ModelFall className="btn" meshes={meshes} scene={scene} originY={40} frameRate={frameRate} startFrame={startFrame} time={time} ></ModelFall>
      }, {
        name: "伸 展",
        component: <ModelStretch className="btn" meshes={meshes} scene={scene} dert={5} direction='y' frameRate={frameRate} startFrame={startFrame} time={time} ></ModelStretch>
      }, {
        name: "切 面",
        component: <ModelClip scene={scene} meshes={meshes}></ModelClip>
      }]);

      document.getElementById("loader")?.style.setProperty('display', 'none');

      setLoading(false);
    });
  }

  const onRender = (scene: Scene) => {

    //控制镜头旋转
    //const camera = scene.cameras[0] as ArcRotateCamera;
    //if (camera !== undefined) {
    var deltaTimeInMillis = scene.getEngine().getDeltaTime();
    const rpm = 10;
    meshes.forEach(mesh => {
      mesh.rotation.y += (rpm / 60) * Math.PI * 2 * (deltaTimeInMillis / 1000);
    })
    //}
  };

  function handleModeClick() {
    scene.stopAllAnimations();
    scene.animations.length = 0;

    meshes.forEach(mesh => {
      scene.removeMesh(mesh);
      mesh.position.y = 0;
      scene.addMesh(mesh);
    });

    if (modeIndex === modes.length - 1) {
      setModeIndex(0);
    } else {
      setModeIndex(modeIndex + 1);
    }
  }

  return (
    <div className="App">
      {/* {
        isLoading ? <div className="loader">
          <div className="g-container">
            <div className="g-progress" style={{ width: `${processNum}%` }}></div>
          </div>
        </div> : <></>
      } */}
      <div id="model-name">嘉 荫 堂</div>
      <div id="mode-switch" onClick={handleModeClick}>
        {isLoading ? "" : modes[modeIndex].name}
      </div>
      <SceneComponent
        className="scene-container"
        onSceneReady={onSceneReady}
        onRender={undefined}
        antialias={true}
        adaptToDeviceRatio></SceneComponent>
      <div id="contorl">
        {isLoading ? <></> : modes[modeIndex].component}
      </div>
    </div>
  )
}

export default App
