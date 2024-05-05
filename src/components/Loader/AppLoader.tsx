import React from "react";
import {Spinner as BsSpinner} from "react-bootstrap";

export default function AppLoader() {
    return <div className="d-inline-block w-100 text-center p-5 app-loader">
        <BsSpinner animation="border" variant="primary"/>
    </div>

}
