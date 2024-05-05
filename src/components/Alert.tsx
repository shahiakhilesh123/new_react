import React from "react";
import {Alert} from "@material-ui/lab";

export function AppAlert({error_message}: { error_message: string | undefined }) {
    if (!error_message) return null;
    return <Alert severity="error" className="my-1">{error_message}</Alert>;
}
