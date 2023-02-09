import { MouseEvent } from 'react'
import SvgIcon from './SvgIcon';

type IconBtnPropsType = {
    iconName: string,
    size?: number,
    className?: string
    id?: string
    onClick?: () => void,
    display?: string
}

export default (props: IconBtnPropsType) => {
    const { iconName, id, className, onClick, display, size } = props;

    function handleClick(event: MouseEvent) {
        event.preventDefault();
        if (onClick) onClick();
    }

    return <a className={className} onClick={handleClick} href=""
        style={{
            textDecoration: 'none',
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
        <span style={{ position: 'absolute' }}>{display}</span>
        <SvgIcon id={id} name={iconName} size={size}></SvgIcon>
    </a>
}