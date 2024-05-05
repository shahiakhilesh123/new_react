import React from "react";
import Card from '@material-ui/core/Card';
import cn from "classnames";
import "./style.css";

function BannerCard(props: any) {

    let classname = cn(
        "app-card",
        "app-card-2",
        "wide-card",
        props.className
    );
    return <Card className={classname} style={props.style}>{props.children}</Card>;

}

export default BannerCard;
