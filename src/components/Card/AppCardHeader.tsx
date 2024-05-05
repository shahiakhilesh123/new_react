import React from "react";
import {Card} from "react-bootstrap";
import cn from "classnames";

function AppCardHeader(props: any) {

    let classname = cn(
        "app-card-header",
        props.className
    );
    return <Card.Header className={classname}>{props.children}</Card.Header>;
}

export default AppCardHeader;
