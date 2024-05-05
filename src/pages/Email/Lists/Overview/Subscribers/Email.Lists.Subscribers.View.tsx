import React, {useContext, useEffect, useState} from "react";

import {useParams} from "react-router-dom";

import EmailMailingListAPIs, {iEmailMailingListShowResponse,} from "../../../../../apis/Email/email.mailinglists.apis";
import {getMailingListWithCache, iEmailMailingList,} from "../../../../../types/internal/email/mailinglist";
import {Alert, Card, Col, ProgressBar, Row} from "react-bootstrap";
import GrowthGraph from "../../../../../views/Email/MailingLists/Graphs/GrowthGraph";
import StatisticsGraph from "../../../../../views/Email/MailingLists/Graphs/StatisticsGraph";
import {NotificationContext} from "../../../../../App";

interface iInfoCardProps {
    title: string,
    value?: number
}


const InfoCard: React.FunctionComponent<iInfoCardProps> = (props) => {
    return <Card bg="primary">
        <Card.Header>{props.title}</Card.Header>
        <Card.Body>
            <Card.Title className="text-center"><h2>{props.value}</h2></Card.Title>
        </Card.Body>
    </Card>;
};


function EmailMailingListViewController() {
    const [uid, setUid] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState("");
    const [mailingList, setMailingList] = useState<iEmailMailingList>();
    const params: any = useParams<any>();

    const notificationContext = useContext(NotificationContext);
    const fetchMailingList = () => {
        setLoading(true);
        setErrorMessage("");
        new EmailMailingListAPIs()
            .view(uid)
            .then((r) => onFetchMailingListResponse(r));
    };

    const onFetchMailingListResponse = (
        response: iEmailMailingListShowResponse,
        silent: boolean = false
    ) => {
        if (EmailMailingListAPIs.hasError(response, notificationContext) || !response.list) {
            setLoading(false);
            setErrorMessage(
                silent || !response.errors
                    ? ""
                    : EmailMailingListAPIs.getError(response)
            );
        } else {
            setLoading(false);
            setErrorMessage("");
            setMailingList(getMailingListWithCache(response.list));
        }
    };

    useEffect(() => {
        const uid: string | undefined = params.list_uid;
        if (!uid) {
            window.alert("Invalid route!");
            return;
        }
        setUid(uid);
        fetchMailingList();
    }, []);

    if (!mailingList) return null;
    return (
        <div className="mt-2">
            <Row>
                <Col xl={6} lg={6} md={8} sm={12}>
                    <h4>{mailingList.name}</h4>
                    {mailingList.cache_object && <h6>{mailingList.cache_object.SubscriberCount} Subscribers</h6>}
                    <div className="mt-2">
                        {error_message ? <Alert variant="danger">{error_message}</Alert> : null}
                    </div>
                </Col>
            </Row>

            <h5><i>List Performance</i></h5>
            <Row>
                <Col className="p-4">
                    <Row>
                        <Col>
                            <h6>Average Open Rate</h6>
                            <ProgressBar now={mailingList.cache_object && mailingList.cache_object.UniqOpenRate}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="p-4">
                            <Card bg="primary">
                                <InfoCard title="Average subscribe rate"
                                          value={mailingList.cache_object && mailingList.cache_object.SubscribeRate}/>
                            </Card>
                        </Col>
                        <Col className="p-4">
                            <InfoCard title="Average unsubscribe rate"
                                      value={mailingList.cache_object && mailingList.cache_object.UnsubscribeRate}/>
                        </Col>
                    </Row>
                </Col>
                <Col className="p-4">
                    <Row>
                        <Col>
                            <h6>Average Click Rate</h6>
                            <ProgressBar now={mailingList.cache_object && mailingList.cache_object.ClickedRate}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="p-4">
                            <Card bg="primary">
                                <InfoCard title="Total unsubscribers"
                                          value={mailingList.cache_object && mailingList.cache_object.UnsubscribeCount}/>
                            </Card>
                        </Col>
                        <Col className="p-4">
                            <InfoCard title="Total unconfirmed"
                                      value={mailingList.cache_object && mailingList.cache_object.UnconfirmedCount}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <h5><i>List Growth</i></h5>
            <Row>
                <Col xl={6} xs={12}>
                    <GrowthGraph uid={mailingList.uid}/>
                </Col>
                <Col xl={6} xs={12}>
                    {!!mailingList.cache_object && !!mailingList.cache_object.SubscriberCount &&
                    <StatisticsGraph uid={mailingList.uid}/>}
                </Col>
            </Row>

        </div>
    );
}

export default EmailMailingListViewController;
