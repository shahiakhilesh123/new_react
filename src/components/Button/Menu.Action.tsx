import React from "react";
import "./style.css";
import cn from "classnames";
import {Button} from "@material-ui/core";

interface MenuActionProps {
    classname?: string,
    onClick?: any,
    text: string,
    style?: any
}

function MenuAction(props: MenuActionProps) {

    let classes = cn(
        "menu-action-button",
        props.classname
    );
    return <Button aria-controls="simple-menu" className={classes} aria-haspopup="true"
                   style={props.style}
                   onClick={props.onClick}>{props.text}</Button>;
}

export default MenuAction;
