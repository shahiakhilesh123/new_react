import React from "react";
import {Col, Row} from "react-bootstrap";
import SetupProgress from "./SetupProgress";
import SetupInfo from "./SetupInfo";
import {iSetupProps} from "../../types/props";

function Setup(props: iSetupProps) {

    return <Row>
        <Col sm="12" md="8" lg="8">
            <SetupInfo/>
        </Col>
        <Col sm="12" md="4" lg="4">
            <SetupProgress progress={props.progress}/>
        </Col>
    </Row>;

}

export default Setup;