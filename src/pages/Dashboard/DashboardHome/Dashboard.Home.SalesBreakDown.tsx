import * as React from "react";
import {useCallback, useEffect, useReducer} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import {Alert, Table} from "react-bootstrap";
import AppLoader from "../../../components/Loader/AppLoader";
import {getStatus, getStatusColor} from "../../../components/helper/common";
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import UserAPIs, {SalesBreakDownResponse} from "../../../apis/user.apis";
import {Reducer} from "redux";
import {iListResource, iListResponseActions, listReducer} from "../../../redux/reducers";
import useIsMounted from "ismounted";
import {iEmailCampaignCache} from "../../../types/internal/email/campaign";
import {Pagination} from "@material-ui/lab";
import {useHistory} from "react-router-dom";

function DashboardHomeSalesBreakDown() {
    const [response, dispatchResponse] = useReducer<Reducer<iListResource<SalesBreakDownResponse>,
        iListResponseActions<SalesBreakDownResponse>>>
    (listReducer<iListResource<SalesBreakDownResponse>, any>({}), {query: {per_page: 20}, loading: true});

    const {loading, query, error_block, resource, error} = response;
    const isMounted = useIsMounted();
    const history = useHistory();
    const loadSalesBreakDown = useCallback(() => {
        new UserAPIs().sales_breakdown(query).then(res => {
            if (isMounted.current) {
                if (UserAPIs.hasError(res)) {
                    dispatchResponse({type: "failed", error: res.message});
                } else {

                    dispatchResponse({type: "success", resource: res});
                }
            }
        })
    }, [query])
    useEffect(() => {
        dispatchResponse({type: "loading"});
        loadSalesBreakDown()
    }, [query])
    return <AppCard className="sales-breakdown-dashboard">
        <AppCardHeader>
            <AppCardTitle>
                Sales Breakdown
            </AppCardTitle>
        </AppCardHeader>
        <AppCardBody className="p-0 sales-breakdown-dashboard__card-body">
            {
                loading && <AppLoader/>
            }
            {
                error && <div className="mt-2"><Alert variant="danger">{error}</Alert></div>
            }
            {
                !loading && !error && response && <>
                    <div>

                        <Scrollbar removeTrackYWhenNotUsed permanentTrackY={true} style={{height: "350px"}}>

                            <div className="sales-breakdown-dashboard-wrapper">
                                <div className="sales-breakdown-dashboard-wrapper__item">
                                    <div>

                                        <div className="table-responsive">
                                            <Table>
                                                <thead>
                                                <tr className="u500">
                                                    <th className="u500"></th>
                                                    <th className="u500">Sales in Number</th>
                                                    <th className="u500">Total Sales (USD)</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr className="">
                                                    <td className="">Popups</td>
                                                    <td className="">{resource && resource.sales_channels && resource.sales_channels.number_of_sales_from_popups}</td>
                                                    <td className="">{resource && resource.sales_channels && resource.sales_channels.sales_total_from_popups}</td>
                                                </tr>
                                                <tr className="">
                                                    <td className="">Chats</td>
                                                    <td className="">{resource && resource.sales_channels && resource.sales_channels.number_of_sales_from_chats}</td>
                                                    <td className="">{resource && resource.sales_channels && resource.sales_channels.sales_total_from_chats}</td>
                                                </tr>
                                                <tr className="">
                                                    <td className="">Emails</td>
                                                    <td className="">{resource && resource.sales_channels && resource.sales_channels.number_of_sales_from_emails}</td>
                                                    <td className="">{resource && resource.sales_channels && resource.sales_channels.sales_total_from_emails}</td>
                                                </tr>
                                                </tbody>
                                            </Table>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <Table>
                                            <thead>
                                            <tr className="u500">
                                                <th className="u500">Email title</th>
                                                <th className="u500">Click rate</th>
                                                <th className="u500">Open rate</th>
                                                <th className="u500">Conversion</th>
                                                <th className="u500">Total sales (USD)</th>
                                                <th className="u500">Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                resource &&
                                                resource.campaigns &&
                                                resource.campaigns.data &&
                                                resource.campaigns.data.map((res, i) => {
                                                    let cache_object: iEmailCampaignCache;
                                                    try {
                                                        cache_object = JSON.parse(res.cache);
                                                    } catch (e) {
                                                        return null;
                                                    }

                                                    return <tr key={i} onClick={() => {
                                                        history.push(`/email/campaigns/${res.uid}/overview/`)
                                                    }}>
                                                        <td>{res.name}</td>
                                                        <td>{(cache_object && cache_object.ClickedRate
                                                            && cache_object.ClickedRate.toFixed(2) + "%") || "0%"}</td>
                                                        <td>
                                                            {(cache_object && cache_object.UniqOpenRate
                                                                && cache_object.UniqOpenRate.toFixed(2) + "%") || "0%"}
                                                        </td>
                                                        <td>
                                                            {(cache_object && cache_object.DeliveredRate
                                                                && cache_object.DeliveredRate.toFixed(2) + "%") || "0%"}
                                                        </td>
                                                        <td>{(res.sales_total && parseFloat(res.sales_total.toString()).toFixed(2)) || "0"}</td>
                                                        <td>
                                                            <div>
                                                                <div style={{
                                                                    background: getStatusColor(res.status),
                                                                }}
                                                                     className="campaign-status-badge"
                                                                >
                                                                    {getStatus(res.status)}
                                                                </div>
                                                                <span>
                                                       {(cache_object && cache_object.DeliveredCount) || "0"} sent
                                                    </span>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                })
                                            }
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </Scrollbar>
                    </div>
                    <div className="float-right mt-1">
                        <Pagination
                            count={resource?.campaigns?.last_page}
                            page={resource?.campaigns?.current_page}
                            onChange={((event, page) => {
                                dispatchResponse({type: "go_to_page", page})
                            })}
                        />
                    </div>
                </>
            }

        </AppCardBody>
    </AppCard>;

}

export default DashboardHomeSalesBreakDown;
