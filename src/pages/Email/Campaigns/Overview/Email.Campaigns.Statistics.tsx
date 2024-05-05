import React, {Dispatch, useCallback, useContext, useEffect} from "react";
import EmailCampaignAPIs from "../../../../apis/Email/email.campaigns.apis";
import {Link, useParams} from "react-router-dom";
import {Alert, Col, Row} from "react-bootstrap";
import AppLoader from "../../../../components/Loader/AppLoader";
import useIsMounted from "ismounted";
import AppCard from "../../../../components/Card/AppCard";
import AppCardBody from "../../../../components/Card/AppCardBody";
import ReactEcharts from "echarts-for-react";
import {FaArrowRight} from "react-icons/all";
import Axios, {CancelTokenSource} from "axios";
import {
  CampaignOverViewDispatchContext,
  CampaignOverViewStateContext,
  iEmailCampaignOverviewAction
} from "./Email.Campaigns.Overview.Routes";
import {NotificationContext} from "../../../../App";


export default function EmailCampaignsStatistics() {
    useEffect(() => {
        document.title = "Campaign Overview | Emailwish";
    }, []);
    const {
        campaign,
        loading_overview_campaign,
        error_overview_campaign,
        campaign_overview,
        overview_chart,
        loading_overview_chart
    } = useContext(CampaignOverViewStateContext);
    const dispatch: Dispatch<iEmailCampaignOverviewAction> = useContext(CampaignOverViewDispatchContext);

    const notificationContext = useContext(NotificationContext);
    const isMounted = useIsMounted();
    const params: any = useParams<any>();

    useEffect(() => {
        let source_req = Axios.CancelToken.source();
        if (!campaign_overview) {
            fetchResource(source_req);
        }
        let source_chart_req = Axios.CancelToken.source();
        if (!overview_chart) {
            loadChart(source_chart_req);
        }

        return () => {
            source_chart_req.cancel();
            source_req.cancel();
        }
    }, []);
    const loadChart = useCallback((source_chart_req: CancelTokenSource) => {
        dispatch({
            type: "loading_overview_chart"
        })
        new EmailCampaignAPIs()
            .chart(params.uid, source_chart_req)
            .then(res => {
                if (!EmailCampaignAPIs.hasError(res, notificationContext)) {
                    dispatch({
                        type: "overview_chart",
                        overview_chart: res
                    })
                }
            });
    }, []);

    const fetchResource = useCallback((source_chart_req: CancelTokenSource) => {
        dispatch({
            type: "load_campaign_overview"
        })
        new EmailCampaignAPIs()
            .overview(params.uid, source_chart_req)
            .then((response) => {
                if (isMounted.current) {
                    if (EmailCampaignAPIs.hasError(response, notificationContext) || !response.campaign) {
                        dispatch({
                            type: "campaign_overview_failed",
                            error: EmailCampaignAPIs.getError(response)
                        })
                    } else if (response.overview) {
                        dispatch({
                            type: "campaign_overview_loaded",
                            overview: response.overview
                        })
                    }
                }
            });
    }, []);

    let cache_object: any = {};

    if (campaign && campaign.cache) {
        try {
            cache_object = JSON.parse(campaign.cache);
        } catch (e) {

        }
    }
    if (loading_overview_campaign) return <AppLoader/>;

    if (error_overview_campaign) return <Alert variant="danger">{error_overview_campaign}</Alert>;
    return <Row className="mt-2 campaign-overview">
        <Col md={12} className="mt-2">
            <AppCard>
                <AppCardBody>
                    <h5 className="mt-10"><span
                        className="text-teal text-bold">{cache_object && cache_object.SubscriberCount}</span> Recipients
                    </h5>
                    {
                        campaign_overview && <Row>
                            <Col md={6} className="campaigns-summary">
                                <div className="mb-10">
                                    <span className="text-bold text-muted">From: </span>
                                    {campaign_overview.info.from}
                                </div>
                                <div className="mb-10">
                                    <span className="text-bold text-muted">Subject: </span>
                                    {campaign_overview.info.subject}
                                </div>
                                <div className="mb-10">
                                    <span className="text-bold text-muted">From email: </span>
                                    {campaign_overview.info.from_email}
                                </div>
                                <div className="mb-10">
                                    <span className="text-bold text-muted">From name: </span>
                                    {campaign_overview.info.from_name}
                                </div>

                            </Col>
                            <Col md={6}>
                                <div className="mb-10">
                                    <span className="text-bold text-muted">Reply to: </span>
                                    {campaign_overview.info.reply_to}
                                </div>
                                <div className="mb-10">
                                    <span className="text-bold text-muted">Updated at: </span>
                                    {campaign_overview.info.updated_at}
                                </div>
                                <div className="mb-10">
                                    <span className="text-bold text-muted">Run at: </span>
                                    {campaign_overview.info.run_at}
                                </div>
                                <div className="mb-10">
                                    <span className="text-bold text-muted">Delivery at: </span>
                                    {campaign_overview.info.delivery_at}
                                </div>
                            </Col>
                        </Row>
                    }
                </AppCardBody>
            </AppCard>

        </Col>
        <Col md={12} className="mt-2">
            <AppCard>
                <AppCardBody>

                    <h5 className="mt-10">Statistics</h5>
                    <div className="sub-h3">The key email marketing metrics of your campaign are visualized in the
                        tables/charts
                        below. You can look at those metrics to assess the overall success of your email marketing
                        campaigns.
                    </div>

                    <Row>
                        <Col md={6}>
                            <div className="chart-container">
                                {
                                    loading_overview_chart && <AppLoader/>
                                }
                                {
                                    !loading_overview_chart && overview_chart &&
                                    <div className="chart has-fixed-height" id="d3-bar-horizontal">
                                        <ReactEcharts
                                            option={
                                                {
                                                    grid: {
                                                        x: 45,
                                                        x2: 10,
                                                        y: 85,
                                                        y2: 25
                                                    },
                                                    tooltip: {
                                                        trigger: 'axis',
                                                        axisPointer: {
                                                            type: 'shadow'
                                                        }
                                                    },
                                                    legend: {
                                                        data: overview_chart.bar_names
                                                    },
                                                    calculable: true,
                                                    xAxis: [{
                                                        type: 'value',
                                                        boundaryGap: [0, 0.01]
                                                    }],
                                                    yAxis: [{
                                                        type: 'category',
                                                        data: overview_chart.columns
                                                    }],
                                                    series: overview_chart.data,
                                                }
                                            }
                                        />
                                    </div>
                                }

                            </div>
                        </Col>
                        {
                            campaign_overview && campaign_overview.statistics && <Col md={6}>
                                <div className="badge-row">
                  <span
                      className="badge badge-info bg-slate badge-big">{campaign_overview.statistics.unique_open_rate}</span>
                                    Opened
                                    <span className="badge badge-info bg-grey-400 badge-medium">
                    {campaign_overview.statistics.unique_open_count} unique / opened {campaign_overview.statistics.open_count} times
            </span>
                                    <Link to={`/email/campaigns/${params.uid}/overview/logs/open-log`}>
                                        <FaArrowRight/>
                                        View log</Link>
                                </div>


                                <div className="badge-row">
                  <span
                      className="badge badge-info bg-orange badge-big">{campaign_overview.statistics.not_open_rate}</span>
                                    Not opened
                                    <span className="badge badge-info bg-grey-400 badge-medium">
                    {campaign_overview.statistics.not_open_count} / {campaign_overview.statistics.subscriber_count} subscribers
            </span>
                                    <Link to={`/email/campaigns/${params.uid}/overview/subscribers?open=not_opened`}>
                                        <FaArrowRight/> View log</Link>
                                </div>

                                <div className="badge-row">
                  <span
                      className="badge badge-info bg-blue badge-big">{campaign_overview.statistics.clicked_rate}</span>
                                    Clicked emails rate
                                    <span className="badge badge-info bg-grey-400 badge-medium">
                {campaign_overview.statistics.clicked_count} / {campaign_overview.statistics.unique_open_count} opens
            </span>
                                    <Link to={`/email/campaigns/${params.uid}/overview/logs/click-log`}>
                                        <FaArrowRight/> View log</Link>
                                </div>

                                <div className="badge-row">
                  <span
                      className="badge badge-info bg-violet badge-big">{campaign_overview.statistics.unsubscribe_rate}</span>
                                    Unsubscribed
                                    <span className="badge badge-info bg-grey-400 badge-medium">
                {campaign_overview.statistics.unsubscribe_count} unsubscribed
            </span>
                                    <Link to={`/email/campaigns/${params.uid}/overview/logs/unsubscribe-log`}>
                                        <FaArrowRight/> View
                                        log</Link>
                                </div>

                                <div className="badge-row">
                  <span
                      className="badge badge-info bg-brown badge-big">{campaign_overview.statistics.bounce_rate}</span>
                                    Bounced
                                    <span className="badge badge-info bg-grey-400 badge-medium">
                {campaign_overview.statistics.bounce_count} bounced
            </span>
                                    <Link to={`/email/campaigns/${params.uid}/overview/logs/bounce-log`}>
                                        <FaArrowRight/> View log</Link>
                                </div>

                                <div className="badge-row">
                                    <span className="badge badge-info bg-teal badge-big">--%</span>
                                    Reported
                                    <span className="badge badge-info bg-grey-400 badge-medium">
                {campaign_overview.statistics.abuse_reports} reported
            </span>
                                    <Link to={`/email/campaigns/${params.uid}/overview/logs/feedback-log`}>
                                        <FaArrowRight/> View
                                        log</Link>
                                </div>

                            </Col>
                        }
                    </Row>
                </AppCardBody>
            </AppCard>
        </Col>
    </Row>;
}
