import React from "react";
import classNames from "classnames";
import {CardContent} from "@material-ui/core";

function AppCardBody(props: any) {
    let classes = classNames(props.className);
    return <CardContent className={classes}>{props.children}</CardContent>;
}

export default AppCardBody;
