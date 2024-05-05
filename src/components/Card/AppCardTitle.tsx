import React from "react";
import {Card} from "react-bootstrap";

function AppCardTitle(props: any) {

    return <Card.Title className="d-inline u500"
                       style={{fontSize: "1.25rem"}}>
        <h6 className="u500 color1">
            {props.children}
        </h6>
    </Card.Title>;

}

export default AppCardTitle;