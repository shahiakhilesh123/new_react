import * as React from "react";
import {Form} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";

function ChatsDepartmentCreate(props: any) {


    function renderForm() {
        return <Form>
            <Form.Group>
                <Form.Label>Department Name</Form.Label>
                <Form.Control required={true}
                              name="department_name"
                              type="text"
                              placeholder="Department Name"/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Description</Form.Label>
                <Form.Control required={true}
                              name="description"
                              type="text"
                              placeholder="Description"/>
            </Form.Group>
            <Button color="primary" variant="contained"
                    className="positive-button" type="submit" onClick={() => props.onshowModal()}>
                Save
            </Button>
            <Link to="/chats/department">
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

export default ChatsDepartmentCreate;
