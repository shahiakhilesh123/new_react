import React from "react";
import {Alert} from "@material-ui/lab";

interface ErrorProps {
    error: string | undefined
}

export default function RenderError(props: ErrorProps) {
    if (props.error) {
        return <Alert color={"error"} severity="error">{props.error}</Alert>
    }
    return null;
}