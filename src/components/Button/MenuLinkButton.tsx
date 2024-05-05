import React from "react";
import "./style.css";
import cn from "classnames";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import Badge from "@material-ui/core/Badge";

interface MenuButtonProps {
    className?: string,
    style?: any,
    link?: any,
    "data-tut"?: string
    children: any,
    onClick?: any,
    badgeCount?: any
}

function MenuLinkButton(props: MenuButtonProps) {

    let classes = cn(
        "menu-button",
        props.className
    );
    if (!!props.badgeCount && props.badgeCount != "0") {
        return <Button component={Link}
                       to={props.link}

                       style={{textTransform: "uppercase", ...props.style}} className={classes}
                       data-tut={props["data-tut"]}>
            <Badge badgeContent={props.badgeCount}
                   color="primary" style={{padding: "4px"}}>
                {props.children}
            </Badge>
        </Button>
            ;
    }
    if (props.link) {
        return <Button component={Link}
                       to={props.link}

                       style={{textTransform: "uppercase", ...props.style}} className={classes}
                       data-tut={props["data-tut"]}>{props.children}</Button>;
    }


    return <Button
        style={{textTransform: "uppercase", ...props.style}} className={classes}
        data-tut={props["data-tut"]} onClick={props.onClick}>{props.children}</Button>;


}

export default MenuLinkButton;
