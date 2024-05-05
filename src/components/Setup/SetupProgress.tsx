import React from "react";
import RadioCheckBox from "../RadioButton/RadioCheckBox";
import {Col, Row} from "react-bootstrap";
import {iSetupProgressProps} from "../../types/props";


function SetupProgress(props: iSetupProgressProps) {

    return <div className="p-4">
        {props.progress.map((progress, index) => {
            return <Row key={index}>
                <Col md={12} sm={12}>
                    <h2>{progress.category}</h2>
                </Col>
                {
                    progress.sub_category.map(sub_category => {
                        return <Col md={12} sm={12} className="ml-5">
                            <div className="d-inline-block">
                                <RadioCheckBox/>
                                <span>{sub_category.title}</span>
                            </div>
                        </Col>
                    })
                }
            </Row>
        })}
    </div>;

}

export default SetupProgress;