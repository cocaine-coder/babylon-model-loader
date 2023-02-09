import { Plane } from "@babylonjs/core";
import { useEffect, useState } from "react";
import { FeaturePropsType } from "./FeatureTypes"

export default (props: FeaturePropsType) => {
    const { scene, meshes } = props;
    const [value, setValue] = useState(-15);

    useEffect(()=>{
        scene.clipPlane4 = new Plane(0, 1, 0, -15);

        return ()=>{
            scene.clipPlane4 = null;
        }
    },[])

    function handleSliderChange(event: React.ChangeEvent<HTMLInputElement>) {
        let newValue = Number.parseFloat(event.target.value);
        scene.clipPlane4 = new Plane(0, 1, 0, newValue);
        setValue(newValue);
    }

    return <div>
        <input type="range" id="slide" value={value} min="-15" max="0" step = "0.1" onChange={handleSliderChange}></input>
    </div>
}