import React from "react";
import {Col, Row} from "react-bootstrap";
import HeadingCol from "../../components/heading/HeadingCol";
import ProductsSummary from "./Products.Summary";


export default function ReviewSettings() {


    return <>
        <Row>
            <HeadingCol
                title="Reviews Import"
                description={
                    "Summary of reviews imported from older review app."
                }
            />
            <Col md={12}>
                <ProductsSummary/>
            </Col>
        </Row>

    </>;
}