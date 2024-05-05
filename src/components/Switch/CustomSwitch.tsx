import React from "react";
import "./style.css";


export default function CustomSwitch(props: any) {
    return <label className="switch">
        <input type="checkbox" checked={true} onChange={() => {

        }}/>
        <span className="slider round"></span>
    </label>;
}
