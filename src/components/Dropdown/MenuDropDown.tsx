import React from "react";

import {Dropdown, DropdownButton} from "react-bootstrap";
import uuid from "uuid";
import "./style.css";

function MenuDropDown(props: any) {
    return <div className="menu-link-button">
        <DropdownButton
            size="sm"
            variant="secondary"
            title="Option Button"
            id={uuid.v4()}
        >
            <Dropdown.Item eventKey="1">Option 1</Dropdown.Item>
            <Dropdown.Item eventKey="2">Option 2</Dropdown.Item>
            <Dropdown.Item eventKey="3">Option 1</Dropdown.Item>
        </DropdownButton></div>
        ;

}

export default MenuDropDown;