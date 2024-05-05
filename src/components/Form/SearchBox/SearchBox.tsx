import * as React from "react";
import {FormControl, InputGroup} from "react-bootstrap";
import cn from "classnames";
import {FaSearch} from 'react-icons/fa';
import "./style.css";

function SearchBox(props: any) {

    const classes = cn(
        props.className
    );
    return <InputGroup style={props.style} className={classes}>
        <FormControl
            className="search-box"
            placeholder="Search here"
        />
        <FaSearch className="app-light-color search-icon"
                  style={{marginLeft: "-20px", marginTop: "10px", zIndex: 10}}/>
    </InputGroup>;

}

export default SearchBox;
