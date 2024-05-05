import * as React from "react";
import {Alert, Button, Col, Form, ProgressBar, Row} from "react-bootstrap";
import {iEmailMailingList, iEmailMailingListVerification} from "../../../types/internal/email/mailinglist";
import {iSelectOption} from "../../../types/internal";
import Select from "react-select";


interface iProps {
    mailing_list: iEmailMailingList
    verification: iEmailMailingListVerification
    resetVerification: () => void
    startVerification: (email_server_id: string) => void
    error: string
    loading: boolean
}

class EmailMailingListsVerification extends React.Component<iProps> {

    renderErrorMessage = () => {
        if (!this.props.error) return null;
        return <Alert variant="danger">{this.props.error}</Alert>
    };

    onFormSubmit = (event: any) => {
        if (!event) return;
        event.preventDefault();
        if (!event.target.list_verification_server.value) {
            return;
        }
        this.props.startVerification(event.target.list_verification_server.value);
    };

    render() {
        const list = this.props.mailing_list;
        const cache = this.props.mailing_list.cache_object;
        const verification = this.props.verification;
        let verification_server_options: Array<iSelectOption> = [];
        if (verification && verification.verification_servers) {
            verification_server_options = verification.verification_servers.map(c => ({
                value: c.value + "",
                label: c.text
            }));
        }
        return <div className="mt-2">
            <Row>
                <Col xl={6} lg={6} md={8} sm={12}>
                    <h4>{list.name}</h4>
                    {cache && <h6>{cache.SubscriberCount} Subscribers</h6>}
                    <div className="mt-2">
                        {this.renderErrorMessage()}
                    </div>
                </Col>
            </Row>
            <h5><p>Verification Status</p></h5>
            <Row>
                <Col className="p-4" xl={6} xs={12}>
                    <Row>
                        <Col>
                            <h6>
                                {
                                    verification.is_verification_running
                                        ? "Verification is in progress."
                                        : "Verification is not running."
                                }
                            </h6>
                            <ProgressBar now={verification.verified} max={verification.total}/>
                            {verification.verified > 0 &&
                            <Button variant="secondary"
                                    onClick={this.props.resetVerification}>
                                Reset Verification Data
                            </Button>}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <h5><p>List Verification</p></h5>
            <Row>
                <Col className="p-4" xl={6} xs={12}>
                    <Form onSubmit={this.onFormSubmit}>
                        <Row>
                            <Col>
                                <p>To verify your list, choose a verification service below and click "Start
                                    Verification"</p>

                                <Form.Group>
                                    <Form.Label>Verification Server</Form.Label>
                                    <Select required={true}
                                            name="list_verification_server"
                                            options={verification_server_options}/>
                                </Form.Group>
                                <Button variant="primary"
                                        type="submit">
                                    Start Verification
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

        </div>;
    }
}

export default EmailMailingListsVerification;
