import { AnimationFeaturePropsType } from "./FeatureTypes";
import { Animation } from '@babylonjs/core'
import { useEffect, useState } from "react";

export function ModelFall(props: AnimationFeaturePropsType & { originY: number }) {
    const { className, scene, meshes, originY, frameRate, startFrame, time } = props;
    const [isPaused, setIsPaused] = useState(false);
    const [animations, setAnimations] = useState<Array<Animation>>(createAnimations());

    useEffect(() => {

        //删除所有mesh
        meshes.forEach(mesh => scene.removeMesh(mesh));

        //开始动画
        beginAnimation(0);
    }, [animations])

    function createAnimations() {
        return meshes.map((mesh, index) => {
            let ret = new Animation(`meshAnimation_${index}`, "position.y", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            ret.setKeys([
                {
                    frame: startFrame,
                    value: originY
                }, {
                    frame: frameRate * time,
                    value: mesh.position.y
                }
            ])

            return ret;
        })
    }

    function beginAnimation(index: number) {
        if (!animations) {
            console.error("animations of mode-fall init error!");
            return;
        }
        const mesh = meshes[index];
        if (mesh) {
            scene.beginDirectAnimation(mesh, [animations[index]], startFrame, frameRate * time, false, undefined, () => beginAnimation(index + 1));
            scene.addMesh(mesh);
        } else {
            setTimeout(() => {
                meshes.forEach(mesh => scene.removeMesh(mesh));
                beginAnimation(0);
            }, 3000)
        }
    }

    function handleClick() {
        if (isPaused) {
            scene.animatables.forEach(animatable => animatable.restart());
        } else {
            scene.animatables.forEach(animatable => animatable.pause());
        }

        setIsPaused(!isPaused);
    }

    return <a className={className} onClick={handleClick}>{isPaused ? "继 续" : "暂 停"}</a>
}

type direction = 'x' | 'y' | 'z';

export function ModelStretch(props: AnimationFeaturePropsType & { dert: number, direction: direction }) {
    const { className, scene, meshes, dert, direction, frameRate, startFrame, time } = props;
    const destFrame = frameRate * time;
    const [isStretch, setIsStretch] = useState(false);
    const [animations, setAnimations] = useState<Array<Animation>>();

    useEffect(() => {
        setAnimations(meshes.map((mesh, index) => {
            let ret = new Animation(`meshAnimation_${index}`, `position.${direction}`, frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);
            ret.setKeys([
                {
                    frame: startFrame,
                    value: mesh.position.y
                }, {
                    frame: destFrame,
                    value: dert * (index - meshes.length / 2)
                }
            ])

            return ret;
        }))
    }, [])

    function handleClick() {
        if (!animations) {
            console.error("animations 初始化失败!");
            return;
        }
        meshes.forEach((mesh, index) => {
            let from = isStretch ? destFrame : startFrame;
            let to = isStretch ? startFrame : destFrame;
            scene.beginDirectAnimation(mesh, [animations[index]], from, to, false);
        })
        setIsStretch(!isStretch);
    }

    return <a className={className} onClick={handleClick}>{isStretch ? "还 原" : "展 开"}</a>
}