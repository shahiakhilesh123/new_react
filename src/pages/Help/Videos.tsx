import React, {useEffect} from "react";
import "./style.css"
import {Col, Row} from "react-bootstrap";

export default function Videos() {
    useEffect(() => {

    }, [])
    return <div className="app-videos">
        <Row>
            {
                [
                    {
                        video: <iframe width="560" height="315" src="https://www.youtube.com/embed/yzmef6JMwZQ"
                                       title="YouTube video player" frameBorder="0"
                                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                       allowFullScreen/>
                    },
                    {
                        video: <iframe width="560" height="315" src="https://www.youtube.com/embed/j3LHGPk9lDQ"
                                       title="YouTube video player" frameBorder="0"
                                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                       allowFullScreen/>
                    },
                    {
                        video: <iframe width="560" height="315" src="https://www.youtube.com/embed/QK7mIupUnC8"
                                       title="YouTube video player" frameBorder="0"
                                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                       allowFullScreen/>
                    },
                ].map((v, i) => {
                    return <Col key={i} md={12} xl={6} sm={12}>
                        {v.video}
                    </Col>
                })
            }
        </Row>

    </div>
}
