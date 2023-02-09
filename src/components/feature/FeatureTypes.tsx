import { Mesh ,Scene} from "@babylonjs/core";

export interface FeaturePropsType{
    id?:string;
    className?:string;
    meshes : Array<Mesh>,
    scene:Scene,
}

export interface AnimationFeaturePropsType extends FeaturePropsType{
    frameRate: number,
    startFrame:number,
    time:number,
}