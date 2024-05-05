import * as React from "react";
import {useContext} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import {Alert, Table} from "react-bootstrap";
import AppLoader from "../../../components/Loader/AppLoader";
import {iDashboardReportResponse} from "../../../apis/user.apis";
import {iResource} from "../../../redux/reducers";
import getSymbolFromCurrency from "currency-symbol-map";
import {AppStateContext} from "../../../App";

function DashboardHomeRevenueBreakDown({state}: { state: iResource<iDashboardReportResponse> }) {

    const {loading, error_block, response, error} = state;

    const {shop} = useContext(AppStateContext)
    const currency = getSymbolFromCurrency((shop && shop.primary_currency) || "USD") || "$";

    return <AppCard className="revenue-breakdown-dashboard">
        <AppCardHeader>
            <AppCardTitle>
                Emailwish Revenue Breakdown
            </AppCardTitle>
        </AppCardHeader>
        <AppCardBody className="p-0 revenue-breakdown-dashboard__card-body">
            {
                loading && <AppLoader/>
            }
            {
                error && <div className="mt-2"><Alert variant="danger">{error}</Alert></div>
            }
            {
                !loading && !error && response && <>
                    <div>

                        <div className="revenue-breakdown-dashboard-wrapper">
                            <div className="revenue-breakdown-dashboard-wrapper__item">
                                <div>

                                    <div className="table-responsive">
                                        <Table>
                                            <thead>
                                            <tr className="u500">
                                                <th className="u500">Module</th>
                                                <th className="u500">Orders</th>
                                                <th className="u500">Revenue</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr className="">
                                                <td className="" style={{fontWeight: 400, fontSize: "18px"}}>Popups</td>
                                                <td className="" style={{
                                                    fontWeight: 400,
                                                    fontSize: "18px"
                                                }}>{(response && response.sales_breakdown && response.sales_breakdown.number_of_sales_from_popups)||"0"}</td>
                                                <td className="" style={{
                                                    fontWeight: 400,
                                                    fontSize: "18px"
                                                }}>{currency} {(response && response.sales_breakdown && response.sales_breakdown.sales_total_from_popups)||"0"}</td>
                                            </tr>
                                            <tr className="">
                                                <td className="" style={{fontWeight: 400, fontSize: "18px"}}>Chats</td>
                                                <td className="" style={{
                                                    fontWeight: 400,
                                                    fontSize: "18px"
                                                }}>{(response && response.sales_breakdown && response.sales_breakdown.number_of_sales_from_chats)||"0"}</td>
                                                <td className="" style={{
                                                    fontWeight: 400,
                                                    fontSize: "18px"
                                                }}>{currency} {(response && response.sales_breakdown && response.sales_breakdown.sales_total_from_chats)||"0"}</td>
                                            </tr>
                                            <tr className="">
                                                <td className="" style={{fontWeight: 400, fontSize: "18px"}}>Emails</td>
                                                <td className="" style={{
                                                    fontWeight: 400,
                                                    fontSize: "18px"
                                                }}>{(response && response.sales_breakdown && response.sales_breakdown.number_of_sales_from_emails)||"0"}</td>
                                                <td className="" style={{
                                                    fontWeight: 400,
                                                    fontSize: "18px"
                                                }}>{currency} {(response && response.sales_breakdown && response.sales_breakdown.sales_total_from_emails)||"0"}</td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }

        </AppCardBody>
    </AppCard>;

}

export default DashboardHomeRevenueBreakDown;
