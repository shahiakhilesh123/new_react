import * as React from "react";
import {Form} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";


function ChatsCannedCreate(props: any) {
   
    function renderForm() {
        
        return <Form>
            <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={props.onChangeName} required={true} className={props.nameError !== "" ? "is-invalid" : ""}
                              name="name"
                              type="text"
                              placeholder="Name"
                              value={props.nameValue || ""}/>
                              <div className="invalid-feedback">{props.nameError}</div>
            </Form.Group>
            <Form.Group>
                <Form.Label>Message</Form.Label>
                <Form.Control onChange={props.onChangeMessage} required={true} className={props.messageError !== "" ? "is-invalid" : ""}
                              name="message"
                              type="text"
                              placeholder="Message"
                              value={props.messageValue || ""}/>
                              <div className="invalid-feedback">{props.messageError}</div>
            </Form.Group>
            <Button color="primary" variant="contained" type="submit" onClick={(e) => {
                e.preventDefault()
                props.onSubmit()
            }}
                
                className="positive-button">
                    {props.btnText}
            </Button>
            <Link to="/chats/canned">
                <Button variant="outlined" color="secondary" type="button" className="ml-2"
                        onClick={() => props.onshowModal()}>
                    Cancel
                </Button>
            </Link>
        </Form>
    }

    return <div className="mt-2">
        {renderForm()}
    </div>;
}

export default ChatsCannedCreate;
