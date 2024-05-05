import React from "react";
import "./style.css";
import cn from "classnames";

interface MenuActionProps {
    className?: string,
    onClick?: any,
    style?: any,
    children?: any
}

function AppButton(props: MenuActionProps) {


    let classes = cn(
        "app-button",
        props.className
    );
    return <button className={classes}>{props.children}</button>;

}

export default AppButton;