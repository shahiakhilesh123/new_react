import React, {createContext, lazy, Suspense, useCallback, useContext, useEffect, useReducer} from "react";
import EmailCampaignAPIs, {iBarChartResponse} from "../../../../apis/Email/email.campaigns.apis";
import {Route, Switch, useHistory, useLocation, useParams} from "react-router-dom";
import {Alert, Col, Row} from "react-bootstrap";
import AppLoader from "../../../../components/Loader/AppLoader";
import useIsMounted from "ismounted";
import {iEmailCampaign, iEmailCampaignOverview} from "../../../../types/internal/email/campaign";
import {NotificationContext} from "../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";
import HeadingCol from "../../../../components/heading/HeadingCol";
import AppNavBar from "../../../../components/NavBar/App.NavBar";
import {matchPath} from "react-router";

const EmailCampaignsReview = lazy(() => import('./Email.Campaigns.Review'));
const EmailCampaignsStatistics = lazy(() => import('./Email.Campaigns.Statistics'));
const EmailCampaignSubscriber = lazy(() => import('./Email.Campaign.Subscriber'));
const EmailCampaignLogs = lazy(() => import('./Email.Campaign.Logs'));

export type iEmailCampaignOverviewAction =
    | { type: 'load_campaign' }
    | { type: 'campaign_loaded', campaign: iEmailCampaign }
    | { type: 'campaign_load_failed', error: string }
    | { type: 'load_campaign_overview', }
    | { type: 'campaign_overview_loaded', overview: iEmailCampaignOverview }
    | { type: 'campaign_overview_failed', error: string }
    | { type: 'overview_chart', overview_chart: iBarChartResponse }
    | { type: 'loading_overview_chart' }

export type iEmailCampaignOverviewState = {
    campaign?: iEmailCampaign;
    campaign_overview?: iEmailCampaignOverview
    loading_campaign?: boolean;
    error_campaign?: string;
    loading_overview_campaign?: boolean;
    error_overview_campaign?: string;
    overview_chart?: iBarChartResponse
    loading_overview_chart?: boolean
}

export function campaign_overview_reducer(state: iEmailCampaignOverviewState, action: iEmailCampaignOverviewAction): iEmailCampaignOverviewState {
    switch (action.type) {
        case 'load_campaign':
            return {...state, loading_campaign: true};
        case 'campaign_loaded':
            return {...state, loading_campaign: false, error_campaign: "", campaign: action.campaign};
        case 'campaign_load_failed':
            return {...state, loading_campaign: false, error_campaign: action.error, campaign: undefined};
        case 'load_campaign_overview':
            return {...state, loading_overview_campaign: true};
        case 'campaign_overview_loaded':
            return {
                ...state,
                loading_overview_campaign: false,
                error_overview_campaign: "",
                campaign_overview: action.overview
            };
        case 'campaign_overview_failed':
            return {
                ...state,
                loading_overview_campaign: false,
                error_overview_campaign: action.error,
                campaign_overview: undefined
            };
        case 'loading_overview_chart':
            return {
                ...state,
                loading_overview_chart: true
            };
        case 'overview_chart':
            return {
                ...state,
                loading_overview_chart: false,
                overview_chart: action.overview_chart
            };
        default:
            return {loading_campaign: true, loading_overview_campaign: true};
    }
}

export const CampaignOverViewStateContext = createContext<iEmailCampaignOverviewState>({});
export const CampaignOverViewDispatchContext = createContext<any>({});

function EmailCampaignsOverViewRoutes() {
    useEffect(() => {
        document.title = "Campaign Logs / Emailwish";
    }, []);
    const [state, dispatch] = useReducer(campaign_overview_reducer, {
        loading_campaign: true, loading_overview_chart: true,
        loading_overview_campaign: true
    });
    const {
        campaign,
        loading_campaign,
        error_campaign
    } = state;
    const params: any = useParams<any>();
    const isMounted = useIsMounted();
    const history = useHistory();

    const notificationContext = useContext(NotificationContext);

    const breadcrumb = useContext(BreadCrumbContext);
    const location = useLocation();
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/campaigns",
                text: "Campaigns"
            })
            links.push({
                link: ``,
                text: "Overview"
            })
            breadcrumb.setLinks(links);
        }
    }, [])

    const fetchResource = useCallback(() => {
        dispatch({
            type: "load_campaign",
        })
        new EmailCampaignAPIs().view(params.uid).then((response) => {
            if (isMounted.current) {
                if (EmailCampaignAPIs.hasError(response, notificationContext,) || !response.campaign) {

                    dispatch({
                        type: "campaign_load_failed",
                        error: EmailCampaignAPIs.getError(response)
                    })
                } else {
                    if (response.campaign.status !== "new") {
                        try {
                            response.campaign.cache_object = JSON.parse(response.campaign.cache)
                        } catch (e) {

                        }
                        dispatch({
                            type: "campaign_loaded", campaign: response.campaign
                        })
                    } else {
                        history.replace(`/email/campaigns/${params.uid}/view`)
                    }
                }
            }
        });
    }, [isMounted]);

    useEffect(() => {
        fetchResource();
    }, []);


    if (loading_campaign) {
        return <AppLoader/>;
    }
    return <div>
        {error_campaign ? <Alert variant="danger">{error_campaign}</Alert> : null}
        <Row>
            <HeadingCol title={(campaign && campaign.name) || ""}
                        data-tut="reactour__state"/>

            <Col md={12}>
                {
                    campaign && <AppNavBar menus={
                        [
                            {
                                name: "Overview",
                                link: `/email/campaigns/${campaign.uid}/overview`,
                                active: !!matchPath(
                                    location.pathname,
                                    {
                                        exact: true,
                                        path: '/email/campaigns/:uid/overview'
                                    }
                                )
                            },
                            {
                                name: "Subscribers",
                                link: `/email/campaigns/${campaign.uid}/overview/subscribers`,
                                active: !!matchPath(
                                    location.pathname,
                                    '/email/campaigns/:uid/overview/subscribers'
                                )
                            },
                            {
                                name: "Logs",
                                link: `/email/campaigns/${campaign.uid}/overview/logs`,
                                active: !!matchPath(
                                    location.pathname,
                                    '/email/campaigns/:uid/overview/logs'
                                ),
                                submenus: [
                                    {
                                        name: "Bounce log",
                                        link: `/email/campaigns/${campaign.uid}/overview/logs/bounce-log`,
                                    },
                                    {
                                        name: "Click log",
                                        link: `/email/campaigns/${campaign.uid}/overview/logs/click-log`,
                                    },

                                    {
                                        name: "Feedback log",
                                        link: `/email/campaigns/${campaign.uid}/overview/logs/feedback-log`,
                                    },
                                    {
                                        name: "Open log",
                                        link: `/email/campaigns/${campaign.uid}/overview/logs/open-log`,
                                    },
                                    {
                                        name: "Tracking log",
                                        link: `/email/campaigns/${campaign.uid}/overview/logs/tracking-log`,
                                    },
                                    {
                                        name: "Unsubscribe log",
                                        link: `/email/campaigns/${campaign.uid}/overview/logs/unsubscribe-log`,
                                    },
                                ]
                            },
                            {
                                name: "Email review",
                                link: `/email/campaigns/${campaign.uid}/overview/review`,
                                active: !!matchPath(
                                    location.pathname,
                                    '/email/campaigns/:uid/overview/review'
                                )
                            },
                        ]
                    }/>
                }
            </Col>
        </Row>
        <CampaignOverViewDispatchContext.Provider value={dispatch}>
            <CampaignOverViewStateContext.Provider value={state}>
                <Suspense fallback={<AppLoader/>}>
                    <Switch>
                        <Route path="/email/campaigns/:uid/overview/links"
                               render={(props) => "Links"}/>
                        <Route path="/email/campaigns/:uid/overview/subscribers"
                               component={EmailCampaignSubscriber}/>
                        <Route path="/email/campaigns/:uid/overview/logs/:log_type"
                               component={EmailCampaignLogs}/>
                        <Route path="/email/campaigns/:uid/overview/review"
                               component={EmailCampaignsReview}/>
                        <Route path="/email/campaigns/:uid/overview"
                               component={EmailCampaignsStatistics}/>
                    </Switch>
                </Suspense>
            </CampaignOverViewStateContext.Provider>
        </CampaignOverViewDispatchContext.Provider>
    </div>;
}

export default EmailCampaignsOverViewRoutes;
