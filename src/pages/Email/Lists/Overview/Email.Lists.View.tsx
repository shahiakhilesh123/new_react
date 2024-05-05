import React, {useCallback, useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import EmailMailingListAPIs from "../../../../apis/Email/email.mailinglists.apis";
import {iEmailMailingList} from "../../../../types/internal/email/mailinglist";
import useIsMounted from "ismounted";
import {Card, Col, ProgressBar, Row} from "react-bootstrap";
import GrowthGraph from "../../../../views/Email/MailingLists/Graphs/GrowthGraph";
import StatisticsGraph from "../../../../views/Email/MailingLists/Graphs/StatisticsGraph";
import AppLoader from "../../../../components/Loader/AppLoader";
import {AppAlert} from "../../../../components/Alert";
import {NotificationContext} from "../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";
import HeadingCol from "../../../../components/heading/HeadingCol";
import HelpVideo from "../../../../components/HelpVideo/HelpVideo";
import AppCard from "../../../../components/Card/AppCard";


const InfoCard = (props: any) => {
    return <Card>
        <Card.Header>{props.title}</Card.Header>
        <Card.Body>
            <Card.Title className="text-center"><h2>{props.value || 0}</h2></Card.Title>
        </Card.Body>
    </Card>;
};


export default function EmailMailingListView() {
    useEffect(() => {
        document.title = "Mailing Lists Overview | Emailwish";
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | undefined>();
    const params: any = useParams<any>();
    const [mailingList, setMailingList] = useState<iEmailMailingList | undefined>();
    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const loadMailList = useCallback(() => {
        setLoading(true);
        setError("");
        new EmailMailingListAPIs().view(params.list_uid).then((res) => {
            if (isMounted.current) {
                if (EmailMailingListAPIs.hasError(res, notificationContext)) {
                    setError(res.message)
                } else {
                    setMailingList(res.list)
                }
                setLoading(false);
            }
        });

    }, [isMounted, params]);

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (mailingList) {
                links.push({
                    link: `/email/lists/${mailingList.uid}/overview`,
                    text: mailingList.name
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [mailingList])

    const [showHelpVideo, setShowHelpVideo] = useState(false);
    useEffect(() => {
        loadMailList();
    }, [])

    if (loading) {
        return <AppLoader/>
    }
    if (error) {
        return <AppAlert error_message={error}/>
    }

    if (mailingList) {
        let cache_object = JSON.parse(mailingList.cache);
        return <div className="mt-2">
            <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                       helpLink={"https://www.youtube.com/embed/yzmef6JMwZQ"}/>

            <Row>
                <Col md={12}>
                    <HeadingCol title={mailingList.name}
                                description={""}/>
                </Col>

            </Row>
            <AppCard className="p-4">
                {cache_object && <h6>{cache_object.SubscriberCount} Subscribers</h6>}
                <Row>
                    <Col className="p-4">
                        <Row>
                            <Col>
                                <h6>Average Open Rate</h6>
                                <ProgressBar now={cache_object && cache_object.UniqOpenRate}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="p-4">
                                <InfoCard title="Average subscribe rate"
                                          value={cache_object && cache_object.SubscribeRate}
                                />
                            </Col>
                            <Col className="p-4">
                                <InfoCard title="Average unsubscribe rate"
                                          value={cache_object && cache_object.UnsubscribeRate}
                                />
                            </Col>
                        </Row>
                    </Col>
                    <Col className="p-4">
                        <Row>
                            <Col>
                                <h6>Average Click Rate</h6>
                                <ProgressBar now={cache_object && cache_object.ClickedRate}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="p-4">
                                <InfoCard title="Total unsubscribers"
                                          value={cache_object && cache_object.UnsubscribeCount}/>
                            </Col>
                            <Col className="p-4">
                                <InfoCard title="Total unconfirmed"
                                          value={cache_object && cache_object.UnconfirmedCount}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </AppCard>

            <AppCard className="p-4">
                <h5>List Growth</h5>
                <Row>
                    <Col xl={6} xs={12}>
                        <GrowthGraph uid={params.list_uid}/>
                    </Col>
                    <Col xl={6} xs={12}>
                        {!!cache_object && !!cache_object.SubscriberCount &&
                        <StatisticsGraph uid={params.list_uid}/>}
                    </Col>
                </Row>
            </AppCard>


        </div>;
    }
    return null;

}
