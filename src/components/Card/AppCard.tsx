import React from "react";
import Card from '@material-ui/core/Card';
import cn from "classnames";
import "./style.css";

function AppCard(props: any) {

    let classname = cn(
        "mt-2",
        "p-2",
        "app-card",
        "app-card-2",
        props.className
    );
    return <Card className={classname} style={props.style}>{props.children}</Card>;

}

export default AppCard;
