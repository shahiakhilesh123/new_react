import React, {useContext, useEffect, useState} from "react";

import EmailCampaignAPIs from "../../../apis/Email/email.campaigns.apis";
import {iApiBasicResponse} from "../../../types/api";
import {Card, Col, Form, Row, Spinner} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import {Formik} from "formik";
import {NotificationContext} from "../../../App";
import {BreadCrumbContext, BreadCrumbLink,} from "../../../components/Breadcrumbs/WithBreadcrumb";
import CardDeck from "react-bootstrap/CardDeck";

function EmailCampaignsCreate() {
    useEffect(() => {
        document.title = "Create New Campaign | Emailwish";
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [response, setResponse] = useState<iApiBasicResponse>();
    const history = useHistory();

    const notificationContext = useContext(NotificationContext);

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = [];
            links.push({
                link: "/email/campaigns",
                text: "Campaigns",
            });
            links.push({
                link: ``,
                text: "Create New Campaign",
            });
            breadcrumb.setLinks(links);
        }
    }, []);
    return (
        <div className="mt-2">
            <Row>
                <Col xl={6} lg={6} md={8} sm={12}>
                    <div className="d-inline-block w-100">
                        <h5
                            className="app-dark-color mt-3 u500"
                            style={{letterSpacing: "0.5px"}}
                        >
                            Create New Campaigns
                        </h5>
                        <p className="app-dark-color u300">Select A Campaign Type</p>
                    </div>
                    <div className="mt-2">
                        <CardDeck>
                            <Row>
                                <Card>
                                    <Formik
                                        initialValues={{
                                            type: "regular",
                                        }}
                                        onSubmit={(values: any) => {
                                            setLoading(true);

                                            setError("");
                                            new EmailCampaignAPIs()
                                                .create(values)
                                                .then((response) => {
                                                    if (
                                                        EmailCampaignAPIs.hasError(
                                                            response,
                                                            notificationContext
                                                        ) ||
                                                        !response.uid
                                                    ) {
                                                        setLoading(false);
                                                        setError(EmailCampaignAPIs.getError(response));
                                                    } else {
                                                        setError("");
                                                        setResponse(response);
                                                        setLoading(false);
                                                        history.push(
                                                            "/email/campaigns/" + response.uid + "/view"
                                                        );
                                                    }
                                                });
                                        }}
                                    >
                                        {({
                                              handleSubmit,
                                              handleChange,
                                              values,
                                              touched,
                                              isSubmitting,
                                              errors,
                                          }: any) => {
                                            return (
                                                <div>
                                                    <Card.Body>
                                                        <Card.Title>Regular</Card.Title>
                                                        <Card.Text>
                                                            Campaign with HTML email content as well as
                                                            images, links. This is the most common type.
                                                        </Card.Text>
                                                        <Form onSubmit={handleSubmit}>
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                className="positive-button"
                                                                type="submit"
                                                                disabled={loading}
                                                            >
                                                                {isSubmitting && (
                                                                    <>
                                                                        <Spinner animation="border" size="sm"/>
                                                                        &nbsp;
                                                                    </>
                                                                )}
                                                                Create
                                                            </Button>
                                                        </Form>
                                                    </Card.Body>
                                                </div>
                                            );
                                        }}
                                    </Formik>
                                </Card>

                                <Card>
                                    <Card.Body>
                                        <Formik
                                            initialValues={{
                                                type: "plain-text",
                                            }}
                                            onSubmit={(values: any) => {
                                                setLoading(true);

                                                setError("");
                                                new EmailCampaignAPIs()
                                                    .create(values)
                                                    .then((response) => {
                                                        if (
                                                            EmailCampaignAPIs.hasError(
                                                                response,
                                                                notificationContext
                                                            ) ||
                                                            !response.uid
                                                        ) {
                                                            setLoading(false);
                                                            setError(EmailCampaignAPIs.getError(response));
                                                        } else {
                                                            setError("");
                                                            setResponse(response);
                                                            setLoading(false);
                                                            history.push(
                                                                "/email/campaigns/" + response.uid + "/view"
                                                            );
                                                        }
                                                    });
                                            }}
                                        >
                                            {({handleSubmit, isSubmitting}: any) => {
                                                return (
                                                    <div>
                                                        <Card.Title>Plain-text</Card.Title>
                                                        <Card.Text>
                                                            Send a plain-text email without link tracking,
                                                            images, or HTML.
                                                        </Card.Text>

                                                        <Form onSubmit={handleSubmit}>
                                                            <Form.Control
                                                                name="type"
                                                                type="hidden"
                                                                value="plain-text"
                                                            />
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                className="positive-button"
                                                                type="submit"
                                                                disabled={loading}
                                                            >
                                                                {isSubmitting && (
                                                                    <>
                                                                        <Spinner animation="border" size="sm"/>
                                                                        &nbsp;
                                                                    </>
                                                                )}
                                                                Create
                                                            </Button>
                                                        </Form>
                                                    </div>
                                                );
                                            }}
                                        </Formik>
                                    </Card.Body>
                                </Card>

                                <Col md={12} className="mt-1">
                                    <Link to="/email/campaigns">
                                        <Button variant="outlined" color="secondary" type="button">
                                            Cancel
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </CardDeck>
                    </div>
                </Col>
            </Row>
        </div>
    );
}

export default EmailCampaignsCreate;
