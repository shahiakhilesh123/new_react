import React from "react";
import {Modal} from "react-bootstrap";

export default function HelpVideo({show, setShow, helpLink}: { show: boolean, setShow: any, helpLink: any }) {
    return <Modal show={show} onHide={() => {
        setShow(false)
    }} size={"lg"} centered>
        <Modal.Header closeButton>
            <h4>
                Learn How?
            </h4>

        </Modal.Header>
        <Modal.Body>
            <iframe width="100%" height="400" src={helpLink}
                    title="YouTube video player" frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen></iframe>
        </Modal.Body>
    </Modal>
}
