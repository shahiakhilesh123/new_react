import React from "react";
import {Form} from "react-bootstrap";

interface iProps {
    feedback: undefined | string | string[]
    valid?: boolean
}

function FormControlFeedback(props: iProps) {

    function generateFeedbackList(feedback: string | Array<string>) {
        if (typeof feedback === "string") {
            return feedback;
        }
        if (feedback.length === 1) {
            return feedback[0];
        }
        return <ul>
            {feedback.map((f, i) => <li key={i}>{f}</li>)}
        </ul>
    }


    if (!props.feedback) return null;
    return <Form.Control.Feedback style={{display: "block"}} type={props.valid ? "valid" : "invalid"}>
        {generateFeedbackList(props.feedback)}
    </Form.Control.Feedback>

}

export default FormControlFeedback;
