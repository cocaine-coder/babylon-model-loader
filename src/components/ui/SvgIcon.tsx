import { useEffect, useRef, useState } from "react";

interface SvgIconPropsType {
    name: string,
    prefix?: string
    id?: string,
    size?: number,
    onLoaded?:(svg:SVGSVGElement)=>void,
}

export default (props: SvgIconPropsType) => {
    let { name, prefix, id, size ,onLoaded} = props
    prefix = prefix || "icon";
    const symbolId = `#${prefix}-${name}`;

    const svg = useRef<SVGSVGElement>(null);
    const [width,setWidth] = useState<undefined|number>();
    const [height,setHeight] = useState<undefined|number>();

    useEffect(()=>{
        if(svg.current){
            if(!size) size = 1;
            setWidth(svg.current.clientWidth * size );
            setHeight(svg.current.clientHeight * size );
            if(onLoaded) onLoaded(svg.current);
        }
    },[size])

    return <svg aria-hidden="true" width={width} height={height} ref={svg}>
        <use xlinkHref={symbolId} id={id} />
    </svg>
}