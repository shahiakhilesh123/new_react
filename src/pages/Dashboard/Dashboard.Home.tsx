import * as React from "react";
import {createContext, useContext, useEffect, useReducer} from "react";
import DashboardHomeAnalytics from "./DashboardHome/Dashboard.Home.Analytics";
import DashboardHomeChat from "./DashboardHome/Dashboard.Home.Chat";
import DashboardHomeReviews from "./DashboardHome/Dashboard.Home.Reviews";

import {Col, Row} from "react-bootstrap";
import {AppStateContext, NotificationContext} from "../../App";
import UserAPIs, {DashboardHomeResponse, iDashboardReportResponse} from "../../apis/user.apis";
import {Reducer} from "redux";
import {iResource, iResponseActions, responseReducer} from "../../redux/reducers";
import useIsMounted from "ismounted";
import moment from "moment";
import {Box, Button, IconButton, Popover} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";
import {DateRangePicker} from "materialui-daterange-picker";
import {DefinedRange} from "materialui-daterange-picker/src/types";
import {AiFillDollarCircle, AiOutlineFall, AiOutlineStock} from "react-icons/ai";
import {HiShoppingCart} from "react-icons/all";
import DashboardHomeRevenueBreakDown from "./DashboardHome/Dashboard.Home.RevenueBreakDown";
import DashboardHomeEmailSent from "./DashboardHome/Dashboard.Home.EmailSent";
import DashboardHomeSubscriberChart from "./DashboardHome/Dashboard.Home.SubscriberChart";
import getSymbolFromCurrency from "currency-symbol-map";
import banner from "../../assets/images/banner.png"
import BannerCard from '../../components/Card/BannerCard'
import OnboardButton from "../../components/Button/OnboardButton";


export const DashboardHomeStateContext = createContext<iResource<DashboardHomeResponse>>({});
export const DashboardHomeDispatchContext = createContext<any>({});

const getLast7thDayDate = () => {
    let a = new Date();
    a.setDate(new Date().getDate() - 7)
    return a;
}

function DashboardHome() {
    useEffect(() => {
        document.title = "Summary | Emailwish";
    }, []);

    const [dateRange, setDateRange] = React.useState<DefinedRange>({
        label: 'Last 7 Days',
        startDate: getLast7thDayDate(),
        endDate: new Date(),
    });
    const toggle = (event?: any) => {
        if (anchorEl === null && event) {
            setAnchorEl(event.currentTarget);
        } else {
            setAnchorEl(null);
        }
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);


    const {loggedInUser, shop} = useContext(AppStateContext);
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);
    const [state, dispatchResponse] = useReducer<Reducer<iResource<DashboardHomeResponse>,
        iResponseActions<DashboardHomeResponse>>>
    (responseReducer<iResource<DashboardHomeResponse>, any>({}), {loading: true});

    const [reportState, dispatchReportResponse] = useReducer<Reducer<iResource<iDashboardReportResponse>,
        iResponseActions<iDashboardReportResponse>>>
    (responseReducer<iResource<iDashboardReportResponse>, any>({}), {loading: true});

    const handleClose = () => {

        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {

        setAnchorEl(event.currentTarget);
    };


    const getGreetingTime = (): string => {
        const now = moment()
        const currentHour = now.hour()
        if (currentHour >= 12 && currentHour <= 17) return "Good Afternoon,"
        else if (currentHour <= 18) return "Good Evening,"
        else return "Good Morning,"
    }

    useEffect(() => {
        dispatchResponse({type: "loading"});
        new UserAPIs().home_dashboard().then((value => {
            if (isMounted.current) {
                if (UserAPIs.hasError(value, notificationContext)) {
                    dispatchResponse({type: "failed", error: UserAPIs.getError(value)});
                } else {
                    dispatchResponse({type: "success", response: value})
                }
            }
        }))
    }, [])

    useEffect(() => {
        dispatchReportResponse({type: "loading"});
        let start_date = moment(dateRange.startDate).format('YYYY-MM-DD')
        let end_date = moment(dateRange.endDate).format('YYYY-MM-DD')
        new UserAPIs().report(start_date, end_date).then((value => {
            if (isMounted.current) {
                if (UserAPIs.hasError(value, notificationContext)) {
                    dispatchReportResponse({type: "failed", error: UserAPIs.getError(value)});
                } else {
                    dispatchReportResponse({type: "success", response: value})
                }
            }
        }))
    }, [dateRange])
    const currency = getSymbolFromCurrency((shop && shop.primary_currency) || "USD") || "$";
    const revenue_report = reportState && reportState.response && reportState.response.revenue_report;
    return <>
    <DashboardHomeDispatchContext.Provider value={dispatchResponse}>
        <DashboardHomeStateContext.Provider value={state}>
            <Row>
                <Col md={12} className="mb-3">
                    <div className="heading-col dashboard-header">
                        <Row className="w-100">
                            <Col className="dashboard-header-name" xl={2} lg={6} md={12} sm={12}>
                                <div className="dashboard-header-greeting">
                                    {getGreetingTime()}
                                </div>
                                <div className="dashboard-header-first-name">
                                    {(loggedInUser && loggedInUser.first_name)}
                                </div>
                            </Col>
                            { (!revenue_report || (revenue_report && revenue_report.revenue_total <= 0)) ? (
                            <BannerCard>
                            <div style={{display: 'block'}}>
                              <p className="text-white" style={{fontSize: '1.5rem'}}>Get The Best out of Emailwish</p>
                              <OnboardButton>Continue Onboarding</OnboardButton>
                              </div>
                              <img className="rounded-lg" style={{width: '500px'}} src={banner} alt="banner"/>
                            </BannerCard> ) :

                                [
                                    {
                                        name: "Revenue From Emailwish",
                                        value: currency + " " + (revenue_report && revenue_report.revenue_total && revenue_report.revenue_total.toFixed(2) || "0"),
                                        background: "#fafae2",
                                        icon: <AiFillDollarCircle size={28}/>,
                                        change_24: (revenue_report && revenue_report.revenue_change_last_24 && revenue_report.revenue_change_last_24.toFixed(0)) || "0"
                                    },
                                    {
                                        name: "Orders From Emailwish",
                                        value: (revenue_report && revenue_report.count_total && revenue_report.count_total.toFixed(0)) || "0",
                                        background: "#ebf5fc",
                                        icon: <HiShoppingCart size={28}/>,
                                        change_24: (revenue_report && revenue_report.count_change_last_24 && revenue_report.count_change_last_24.toFixed(0)) || "0"
                                    },
                                    {
                                        name: "ROI",
                                        value: ((revenue_report && revenue_report.roi_total && revenue_report.roi_total.toFixed(0)) || "0") + "%",
                                        background: "#f0fcf0",
                                        icon: <AiOutlineStock size={28}/>,
                                        change_24: (revenue_report && revenue_report.roi_change_last_24 && revenue_report.roi_change_last_24.toFixed(0)) || "0"
                                    },
                                ].map((value, i) => {
                                    return <Col xl={3} lg={12} md={12} sm={12} key={i}
                                                className="dashboard-header-card-wrapper">
                                        <div className="dashboard-header-card" style={{background: value.background}}>
                                            <div className="d-flex justify-content-between">
                                            <span className="dashboard-header-card-label">
                                                {value.name}
                                            </span>
                                                <span>
                                                    {value.icon}
                                            </span>
                                            </div>
                                            <div style={{fontWeight: "bold", fontSize: "24px", marginBottom: "4px"}}>
                                                {value.value}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                  <span
                                                      style={parseInt(value.change_24) >= 0 ? {transform: "rotate(-75deg)"} : {transform: "rotate(-0deg)"}}>
                                                    <AiOutlineFall color={parseInt(value.change_24) >= 0 ?"#57b758":"red"} size={20}/>
                                                </span>
                                                <span className="p-1"/>

                                                <span style={{
                                                    color: parseInt(value.change_24) >= 0 ?"#57b758":"red",
                                                    fontWeight: "500",
                                                    fontSize: "14px"
                                                }}>{value.change_24 || "0"}%</span>&nbsp;<span
                                                style={{fontWeight: "500", fontSize: "12px"}}>since yesterday</span>
                                            </div>
                                        </div>
                                    </Col>
                                })
                            }

                        </Row>
                        <div>
                            <div className="dashboard-header-date">
                                <div className="d-flex align-items-center" onClick={(e) => {
                                    handleClick(e)
                                }}>
                                    <Box fontSize={"1rem"} fontWeight={"normal"} color="#4f4f4f">
                                        {
                                            dateRange.label && dateRange.label
                                        }
                                        {
                                            !dateRange.label && <>{moment(dateRange.startDate).format("DD-MM-YYYY")} to {moment(dateRange.endDate).format("DD-MM-YYYY")}</>
                                        }
                                    </Box>
                                    <IconButton
                                        color="primary"
                                        aria-label="Help"
                                        aria-controls="Help-menu"
                                        aria-haspopup="true"
                                        size={"small"}
                                        component="span">
                                        <ExpandMore color="action"/>
                                    </IconButton>
                                </div>
                                <Popover
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    anchorOrigin={{
                                        vertical: 'center',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    transitionDuration={100}
                                    onClose={handleClose}
                                >
                                    <div>
                                        <DateRangePicker


                                            wrapperClassName={"ew"}
                                            open={Boolean(anchorEl)}
                                            toggle={toggle}
                                            maxDate={new Date()}
                                            initialDateRange={dateRange}
                                            closeOnClickOutside
                                            onChange={(range) => {
                                                // @ts-ignore
                                                setDateRange(range)
                                            }}

                                        />
                                        <div className="d-flex justify-content-end p-2">
                                            <Button variant={"outlined"}
                                                    type={"submit"}
                                                    onClick={handleClose}
                                                    color={"primary"}>
                                                Close
                                            </Button>
                                        </div>

                                    </div>


                                </Popover>
                            </div>
                        </div>

                    </div>
                </Col>
                <Col lg={5} sm={12} data-tut="reactour__dashboard_analytics">
                    <DashboardHomeAnalytics dateRange={dateRange} state={reportState}/>
                </Col>
                <Col lg={7} sm={12}>
                    <Row>
                        <Col xl={6} lg={6} sm={12} data-tut="reactour__dashboard_reviews">
                            <DashboardHomeReviews state={reportState}/>
                        </Col>
                        <Col lg={6} sm={12} data-tut="reactour__dashboard_chat" className="chat-in-dashboard_wrapper">
                            <DashboardHomeChat/>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className="mt-2 mb-5">
                <Col sm={4} data-tut="reactour__dashboard_email_campaigns">
                    <DashboardHomeRevenueBreakDown state={reportState}/>
                </Col>
                <Col sm={4} data-tut="reactour__dashboard_email_campaigns">
                    <DashboardHomeEmailSent state={reportState}/>
                </Col>
                <Col sm={4} data-tut="reactour__dashboard_email_campaigns">
                    <DashboardHomeSubscriberChart state={reportState} dateRange={dateRange}/>
                </Col>
            </Row>

        </DashboardHomeStateContext.Provider>
    </DashboardHomeDispatchContext.Provider>
    </>;

}

export default DashboardHome;
