import * as React from "react";
import {useContext, useEffect, useState} from "react";
import EmailHomePerformance from "./Email.Home.Performance";
import {Grid} from "@material-ui/core";
import {Alert, Col, Row} from "react-bootstrap";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";
import Box from '@material-ui/core/Box';
import {
    iEmailDashboardActivity,
    iEmailDashboardTopClick,
    iEmailDashboardTopLink,
    iEmailDashboardTopOpen
} from "../../../types/internal";
import {iEmailCampaign, iEmailCampaignCache} from "../../../types/internal/email/campaign";
import EmailDashboardAPIs, {iCreditUsage} from "../../../apis/Email/email.dashboard.apis";
import useIsMounted from "ismounted";
import AppLoader from "../../../components/Loader/AppLoader";
import Select from "react-select";
import {useStyles} from "../../../style";
import {BorderLinearProgress} from "../../../components/Progress/BorderLinearProgress";
import EmailCampaignAPIs, {iEmail24Performance, iEmailSummery} from "../../../apis/Email/email.campaigns.apis";
import Axios from "axios";
import EmailTop5 from "./Email.Top5";
import ActivityHelper from "../../../components/Utils/ActivityHelper";
import DashboardCardInfo from "../../../components/DashboardCardInfo/DashboardCardInfo";
import {NotificationContext} from "../../../App";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import {getStatus, getStatusColor} from "../../../components/helper/common";
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import {Link, useHistory} from "react-router-dom";
import TableContainer from "@material-ui/core/TableContainer";
import Typography from "@material-ui/core/Typography";
import TimeFromNow from "../../../components/Utils/FromNow";


function EmailHome() {
    useEffect(() => {
        document.title = "Email Dashboard | EmailWish";
    }, []);
    const [value, setValue] = React.useState(0);
    const [topOpens, setTopOpens] = useState<iEmailDashboardTopOpen[]>();
    const [topClicks, setTopClicks] = useState<iEmailDashboardTopClick[]>();
    const [topLinks, setTopLinks] = useState<iEmailDashboardTopLink[]>();
    const [recentCampaigns, setRecentCampaigns] = useState<iEmailCampaign[]>();
    const [selectedCampaign, setSelectedCampaign] = useState<{ label: string, value: string }>();
    const [activities, setActivities] = useState<iEmailDashboardActivity[]>();
    const [loading, setLoading] = useState<boolean>(false);
    const classes = useStyles();
    const [error, setError] = useState<string | undefined>("");
    const [performance24Hour, setPerformance24Hour] = useState<iEmail24Performance | undefined>();
    const [campaignSummery, setCampaignSummery] = useState<iEmailSummery | undefined>();
    const [creditUsage, setCreditUsage] = useState<iCreditUsage | undefined>();

    const notificationContext = useContext(NotificationContext);
    const isMounted = useIsMounted();
    const history = useHistory();
    useEffect(() => {
        if (isMounted.current) {
            setLoading(true)
            new EmailDashboardAPIs().dashboard().then((res) => {
                if (isMounted.current) {
                    if (EmailDashboardAPIs.hasError(res, notificationContext)) {
                        setError(res.message)
                    } else {
                        setTopOpens(res.top_opens)
                        setTopClicks(res.top_clicks)
                        setTopLinks(res.top_links)
                        setRecentCampaigns(res.recent_campaigns)
                        setActivities(res.activities)
                        setCreditUsage(res.credit_usage)
                        if (res.recent_campaigns && res.recent_campaigns.length > 0) {
                            setSelectedCampaign({
                                value: res.recent_campaigns[0].uid,
                                label: res.recent_campaigns[0].name
                            });
                        }
                    }
                    setLoading(false)
                }
            })
        }
    }, [isMounted])

    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };
    useEffect(() => {
        let source_summery_req = Axios.CancelToken.source();
        let source_24_performance_req = Axios.CancelToken.source();
        if (selectedCampaign && selectedCampaign.value) {
            new EmailCampaignAPIs().summary(selectedCampaign.value, source_summery_req).then((res) => {
                if (isMounted.current) {
                    if (!EmailCampaignAPIs.hasError(res, notificationContext)) {
                        setCampaignSummery(res.summary)
                    }
                }
            });
            new EmailCampaignAPIs().performance_24_hour(selectedCampaign.value, source_24_performance_req).then((res) => {
                if (isMounted.current) {
                    if (!EmailCampaignAPIs.hasError(res, notificationContext)) {
                        setPerformance24Hour(res)
                    }
                }
            });
        }
        return () => {
            source_summery_req.cancel();
            source_24_performance_req.cancel();
        }
    }, [selectedCampaign, isMounted])
    return <Row className="email-dashboard ">
        <Col xl={6} lg={12} className="email-dashboard__campaign">
            <EmailTop5
                loading={loading}
                error={error}
                topClicks={topClicks}
                topLinks={topLinks}
                topOpens={topOpens}
            />
        </Col>
        <Col xl={6} lg={6} className="email-dashboard__credit-used ">
            <AppCard>
                <AppCardHeader>
                    <AppCardTitle>
                        Credit Used
                    </AppCardTitle>
                </AppCardHeader>
                <AppCardBody className="p-0">
                    {
                        loading && <AppLoader/>
                    }
                    {
                        error && <div style={{height: "300px"}}>
                            <DashboardCardInfo text={"Something went wrong!"}/></div>
                    }
                    {
                        creditUsage && <div className="p-3">
                            {
                                creditUsage && creditUsage.sending_limit &&
                                <>
                                    <p className="mt-5">Sending Limit<span className="float-right">
                                    {
                                        creditUsage.sending_limit.quota !== "∞" && <>
                                            {creditUsage.sending_limit.used}/{creditUsage.sending_limit.quota} &nbsp;{parseFloat(creditUsage.sending_limit.progress.toString()).toFixed(2)}%
                                        </>
                                    }
                                        {
                                            creditUsage.sending_limit.quota === "∞" && <>
                                                {creditUsage.sending_limit.used}/ ∞
                                            </>
                                        }
                                   </span>
                                    </p>
                                    <Box component="div" className="credit-progress">
                                        <ProgressBar now={creditUsage.sending_limit.progress}/>
                                    </Box>
                                </>
                            }
                            {
                                creditUsage && creditUsage.lists &&
                                <>
                                    <p className="mt-5">Mail List <span className="float-right">
                                    {
                                        creditUsage.lists.quota !== "∞" && <>
                                            {creditUsage.lists.used}/{creditUsage.lists.quota} &nbsp;{parseFloat(creditUsage.lists.progress.toString()).toFixed(2)}%
                                        </>
                                    }
                                        {
                                            creditUsage.lists.quota === "∞" && <>
                                                {creditUsage.lists.used}/ ∞
                                            </>
                                        }
                                   </span>
                                    </p>
                                    <Box component="div" className="credit-progress">
                                        <ProgressBar now={creditUsage.lists.progress}/>
                                    </Box>
                                </>
                            }
                            {
                                creditUsage && creditUsage.campaigns &&
                                <>
                                    <p className="mt-5">Campaigns <span className="float-right">
                                    {
                                        creditUsage.campaigns.quota !== "∞" && <>
                                            {creditUsage.campaigns.used}/{creditUsage.campaigns.quota} &nbsp;{parseFloat(creditUsage.campaigns.progress.toString()).toFixed(2)}%
                                        </>
                                    }
                                        {
                                            creditUsage.campaigns.quota === "∞" && <>
                                                {creditUsage.campaigns.used}/ ∞
                                            </>
                                        }
                                   </span>
                                    </p>
                                    <Box component="div" className="credit-progress">
                                        <ProgressBar now={creditUsage.campaigns.progress}/>
                                    </Box>
                                </>
                            }
                            {
                                creditUsage && creditUsage.subscribers &&
                                <>
                                    <p className="mt-5">Subscribers <span className="float-right">
                                    {
                                        creditUsage.subscribers.quota !== "∞" && <>
                                            {creditUsage.subscribers.used}/{creditUsage.subscribers.quota} &nbsp;{parseFloat(creditUsage.subscribers.progress.toString()).toFixed(2)}%
                                        </>
                                    }
                                        {
                                            creditUsage.subscribers.quota === "∞" && <>
                                                {creditUsage.subscribers.used}/ ∞
                                            </>
                                        }
                                   </span>
                                    </p>
                                    <Box component="div" className="credit-progress">
                                        <ProgressBar now={creditUsage.subscribers.progress}/>
                                    </Box>
                                </>
                            }
                        </div>
                    }
                </AppCardBody>
            </AppCard>
        </Col>

        <Col xl={6} lg={12} className="email-dashboard__recent-campaign">
            <AppCard>
                <AppCardHeader>
                    <AppCardTitle>
                        Recently Sent Campaign
                    </AppCardTitle>
                </AppCardHeader>
                <AppCardBody className="p-0 h-100">
                    {
                        loading && <AppLoader/>
                    }
                    {
                        error && <div style={{height: "300px"}}>
                            <DashboardCardInfo text={"Something went wrong!"}/></div>
                    }
                    {
                        recentCampaigns && recentCampaigns.length === 0 && <div style={{height: "300px"}}>
                            <DashboardCardInfo text={"There are no records to display."}/></div>

                    }
                    {recentCampaigns && recentCampaigns.length > 0 && <Scrollbar style={{height: "400px"}}>
                        <TableContainer className="recent-campaign-table"><Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Delivery Rate</TableCell>
                                    <TableCell>Open Rate</TableCell>
                                    <TableCell>Click Rate</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Total sales (USD)</TableCell>
                                </TableRow>
                            </TableHead>


                            {
                                recentCampaigns && recentCampaigns.length !== 0 && <TableBody>
                                    {recentCampaigns.map((row) => {
                                            let cache: iEmailCampaignCache | undefined = undefined;

                                            try {
                                                if (row.cache) {
                                                    cache = JSON.parse(row.cache);
                                                }
                                            } catch (e) {
                                                cache = undefined;
                                            }

                                            return <TableRow key={row.id}>
                                                <TableCell>
                                                    <Link to={`/email/campaigns/${row.uid}/overview`}>
                                                        <Typography color="secondary" variant="body2">
                                                            {row.name}
                                                        </Typography>
                                                    </Link>
                                                </TableCell>
                                                <TableCell>
                                                    {cache && "DeliveredRate" in cache && (
                                                        <>
                                                            <span>{(cache["DeliveredRate"]*100).toFixed(2)} %</span>
                                                            <BorderLinearProgress variant="determinate"
                                                                                  value={parseFloat(cache["DeliveredRate"].toString()) * 100}/>
                                                        </>
                                                    )}
                                                </TableCell>
                                                <TableCell>{row.type === "regular" && (
                                                    <>
                                                        {cache && "UniqOpenRate" in cache && (
                                                            <>
                                                                <span>{(cache["UniqOpenRate"]*100).toFixed(2)} %</span>
                                                                <BorderLinearProgress variant="determinate"
                                                                                      value={parseFloat(cache["UniqOpenRate"].toString()) * 100}/>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                                </TableCell>

                                                <TableCell>
                                                    {cache && "ClickedRate" in cache && (
                                                        <>
                                                            <span>{(cache["ClickedRate"]*100).toFixed(2)} %</span>
                                                            <BorderLinearProgress variant="determinate"
                                                                                  value={parseFloat(cache["ClickedRate"].toString()) * 100}/>
                                                        </>
                                                    )}</TableCell>
                                                <TableCell>
                                                    <div>

                                                        <div style={{
                                                            background: getStatusColor(row.status),
                                                        }}
                                                             className="campaign-status-badge"
                                                        >
                                                            {getStatus(row.status)}
                                                        </div>
                                                    </div>
                                                </TableCell><TableCell>
                                                {(row.sales_total && parseFloat(row.sales_total.toString()).toFixed(2)) || "0"}
                                            </TableCell>
                                            </TableRow>
                                        }
                                    )}
                                </TableBody>
                            }
                        </Table>
                        </TableContainer></Scrollbar>}
                </AppCardBody>
            </AppCard>
        </Col>
        <Col xl={6} lg={12} className="email-dashboard__activities">
            <AppCard>
                <AppCardHeader>
                    <AppCardTitle>
                        Activity
                    </AppCardTitle>
                </AppCardHeader>
                <AppCardBody className="p-0">


                    <Scrollbar className="email-dashboard__activities__list" removeTrackYWhenNotUsed
                               permanentTrackY={true} style={{height: "350px"}}>


                        {
                            loading && <AppLoader/>
                        }
                        {
                            error && <Alert>Something went wrong!</Alert>
                        }
                        {
                            activities && activities.length === 0 && <Alert>
                                <div style={{height: "300px"}}>
                                    <DashboardCardInfo text={"There are no records to display."}/></div>
                            </Alert>

                        }

                        {activities && activities.length > 0 && activities.map((doc, index) => {
                            if (ActivityHelper({activity: doc})) {
                                return <div className="email-dashboard__activities__list-item" key={index}>
                                    <div className="email-dashboard__activities__list-item-sub">

                                        <div className="email-dashboard__activities__list-item__checkbox">
                                            <input type="checkbox"/>
                                        </div>
                                        <div className="email-dashboard__activities__list-item__message">
                                            <div>
                                                <p><ActivityHelper activity={doc}/></p>
                                                <span className="email-dashboard__activities__list-item__date">
                                                    <TimeFromNow date_string={doc.created_at}/>
                                            </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            return null;
                        })}
                    </Scrollbar>
                </AppCardBody>
            </AppCard>
        </Col>
        <Col md={12} className="email-dashboard__campaign-performance">
            <AppCard>
                <AppCardHeader>
                    <AppCardTitle>
                        Campaign Performance
                        {
                            recentCampaigns && recentCampaigns.length > 0 && <div className="float-right">
                                <div className="campaign-chooser">
                                    <Select
                                        value={selectedCampaign}
                                        options={
                                            (recentCampaigns &&
                                                recentCampaigns.length !== null &&
                                                recentCampaigns.map((recent) => {
                                                    return {value: recent.uid, label: recent.name}
                                                })) || []}
                                        onChange={(e: any) => {
                                            setSelectedCampaign(e);
                                        }}
                                    >

                                    </Select>
                                </div>
                            </div>
                        }
                    </AppCardTitle>
                </AppCardHeader>
                <AppCardBody className="email-dashboard__campaign-performance__body">
                    {
                        recentCampaigns && recentCampaigns.length === 0 &&
                        <Alert><DashboardCardInfo text={"There are no records to display."}/></Alert>

                    }
                    {
                        selectedCampaign && <>
                            <Row className="email-dashboard__campaign-performance__body_rate mt-2">
                                <Col lg={12} className="open-click-rate">
                                    <AppCard>
                                        <AppCardBody style={{maxHeight: "300px"}}>
                                            <h6 className="u500 color1">Open and Click Rate</h6>
                                            <Row>
                                                <Col lg={6} sm={12} className="open-rate">
                                                    <Row>
                                                        <Col md={12}>
                                                            <div className="progress-heading">Open
                                                                Rate: <span>{(campaignSummery && campaignSummery.unique_open_rate && (campaignSummery.unique_open_rate.toFixed(2))) || 0}%</span>
                                                                <button
                                                                    className="float-right"
                                                                    onClick={() => {
                                                                        history.push(`/email/campaigns/${selectedCampaign && selectedCampaign.value}/overview/logs/open-log`)
                                                                    }}
                                                                >Open Log
                                                                </button>
                                                            </div>
                                                        </Col>
                                                        <Col md={12}>
                                                            <div className="d-block w-100">
                                                                <ProgressBar
                                                                    now={(campaignSummery && campaignSummery.unique_open_rate && parseFloat(campaignSummery.unique_open_rate.toString()) * 100) || 0}/>
                                                                <p>Total
                                                                    Opens: {(campaignSummery && campaignSummery.open_count && campaignSummery.open_count.toFixed(2)) || 0}</p>
                                                                <p>Unique
                                                                    Opened: {(campaignSummery && campaignSummery.unique_open_count && campaignSummery.unique_open_count.toFixed(2)) || 0}</p>
                                                                <Grid container>
                                                                    <Grid item xs={6} md={6}>
                                                                        <p>Last Opened: -</p>
                                                                    </Grid>

                                                                </Grid>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col lg={6} sm={12} className="click-rate">
                                                    <Row>
                                                        <Col md={12}>
                                                            <div className="progress-heading">Click Rate: <span
                                                            >{(campaignSummery && campaignSummery.click_rate && campaignSummery.unique_open_count.toFixed(2)) || 0}%</span>
                                                                <button className="float-right"
                                                                        onClick={() => {
                                                                            history.push(`/email/campaigns/${selectedCampaign && selectedCampaign.value}/overview/logs/click-log`)
                                                                        }}
                                                                >Open Log
                                                                </button>
                                                            </div>
                                                        </Col>
                                                        <Col md={12}>
                                                            <div className="d-block w-100">
                                                                <ProgressBar
                                                                    now={(campaignSummery && campaignSummery.click_rate && parseFloat(campaignSummery.click_rate.toString()) * 100) || 0}/>
                                                                <p>Total
                                                                    Click: {(campaignSummery && campaignSummery.click_count && campaignSummery.click_count.toFixed(2)) || 0}</p>
                                                                <p>Total
                                                                    Reports: {(campaignSummery && campaignSummery.reported_count && campaignSummery.reported_count.toFixed(2)) || 0}</p>
                                                                <Grid container spacing={1}>
                                                                    <Grid item xs={6} md={6}>
                                                                        <p>Last Opened: -</p>
                                                                    </Grid>
                                                                </Grid>
                                                            </div>
                                                        </Col>
                                                    </Row>


                                                </Col>
                                            </Row>
                                        </AppCardBody>
                                    </AppCard>
                                </Col>
                                {/*<Col lg={6}>*/}
                                {/*    <Row>*/}
                                {/*        <Col lg={6} sm={12} className="list-country">*/}
                                {/*            <AppCard>*/}
                                {/*                <AppCardBody style={{maxHeight: "300px"}}>*/}
                                {/*                    <h6 className="u500 color1">Open and Click Rate</h6>*/}
                                {/*                    <EmailHomeCountries/>*/}
                                {/*                </AppCardBody>*/}
                                {/*            </AppCard>*/}
                                {/*        </Col>*/}
                                {/*        <Col lg={6} sm={12} className="list-growth">*/}
                                {/*            <AppCard>*/}
                                {/*                <AppCardBody style={{maxHeight: "300px"}}>*/}
                                {/*                    <h6 className="u500 color1">List Growth</h6>*/}
                                {/*                    <EmailHomeGrowth/>*/}
                                {/*                </AppCardBody>*/}
                                {/*            </AppCard>*/}
                                {/*        </Col>*/}
                                {/*    </Row>*/}
                                {/*</Col>*/}
                            </Row>
                            <Row>
                                <Col lg={12} className="email-dashboard__campaign-performance__body_performance">
                                    {performance24Hour &&
                                    <EmailHomePerformance
                                        data={performance24Hour.data}
                                        columns={performance24Hour.columns}
                                        bar_names={performance24Hour.bar_names}
                                    />}
                                </Col>
                            </Row>
                        </>
                    }

                </AppCardBody>
            </AppCard>
        </Col>


    </Row>
}

export default EmailHome;
