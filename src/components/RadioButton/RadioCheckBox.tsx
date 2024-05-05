import React from "react";
import {FaCheck} from 'react-icons/fa';
import "./style.css";

function RadioCheckBox(props: any) {

    return <label className="label">
        <input className="label__checkbox" type="checkbox"/>
        <span className="label__text">
      <span className="label__check">
        <FaCheck className="icon"/>
      </span>
    </span>
    </label>;

}

export default RadioCheckBox;