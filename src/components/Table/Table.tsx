import React from "react";
import cn from "classnames";

function Table(props: any) {

    const classes = cn(
        "app-table",
        props.className
    );
    return <table className={classes}>{props.children}</table>;
}

export default Table;
