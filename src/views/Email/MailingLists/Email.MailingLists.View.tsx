import * as React from "react";
import {Alert, Card, Col, ProgressBar, Row} from "react-bootstrap";
import {iEmailMailingList} from "../../../types/internal/email/mailinglist";
import GrowthGraph from "./Graphs/GrowthGraph";
import StatisticsGraph from "./Graphs/StatisticsGraph";


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

interface iProps {
    mailing_list: iEmailMailingList
    error: string
    loading: boolean
}

class EmailMailingListsView extends React.Component<iProps> {

    renderErrorMessage = () => {
        if (!this.props.error) return null;
        return <Alert variant="danger">{this.props.error}</Alert>
    };

    render() {
        const list = this.props.mailing_list;
        const cache = this.props.mailing_list.cache_object;
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
            <h5><b>List Performance</b></h5>
            <Row>
                <Col className="p-4">
                    <Row>
                        <Col>
                            <h6>Average Open Rate</h6>
                            <ProgressBar now={cache && cache.UniqOpenRate}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="p-4">
                            <Card bg="primary">
                                <InfoCard title="Average subscribe rate" value={cache && cache.SubscribeRate}/>
                            </Card>
                        </Col>
                        <Col className="p-4">
                            <InfoCard title="Average unsubscribe rate" value={cache && cache.UnsubscribeRate}/>
                        </Col>
                    </Row>
                </Col>
                <Col className="p-4">
                    <Row>
                        <Col>
                            <h6>Average Click Rate</h6>
                            <ProgressBar now={cache && cache.ClickedRate}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="p-4">
                            <Card bg="primary">
                                <InfoCard title="Total unsubscribers" value={cache && cache.UnsubscribeCount}/>
                            </Card>
                        </Col>
                        <Col className="p-4">
                            <InfoCard title="Total unconfirmed" value={cache && cache.UnconfirmedCount}/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <h5><i>List Growth</i></h5>
            <Row>
                <Col xl={6} xs={12}>
                    <GrowthGraph uid={list.uid}/>
                </Col>
                <Col xl={6} xs={12}>
                    {!!cache && !!cache.SubscriberCount && <StatisticsGraph uid={list.uid}/>}
                </Col>
            </Row>

        </div>;
    }
}

export default EmailMailingListsView;
