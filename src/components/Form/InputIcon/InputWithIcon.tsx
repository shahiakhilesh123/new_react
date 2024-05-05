import React from "react";
import {FormControl, FormControlProps} from "react-bootstrap";
import cn from "classnames";
import "./style.css";

interface InputIconProps extends FormControlProps {
    icon?: string,
    placeholder?: string,
}

function InputIcon(props: InputIconProps) {

    const {icon, ...formProps} = props;
    const icon_classes = cn("fa", "icon", icon);
    return <div className="input-container">
        <i className={icon_classes}/>
        <FormControl {...formProps}/>
    </div>;

}

export default InputIcon;