import * as React from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import {Alert} from "react-bootstrap";
import AppLoader from "../../../components/Loader/AppLoader";
import {iDashboardReportResponse} from "../../../apis/user.apis";
import {iResource} from "../../../redux/reducers";

function DashboardHomeEmailSent({state}: { state: iResource<iDashboardReportResponse> }) {

    const {loading, response, error} = state;

    return <AppCard className="email-sent-dashboard">
        <AppCardHeader>
            <AppCardTitle>
                Total email sent
                <div style={{fontSize: "20px"}}>
                    {response && response.emails && response.emails.total_emails || 0}
                </div>
            </AppCardTitle>
        </AppCardHeader>
        <AppCardBody className="p-0 email-sent-dashboard__card-body">
            {
                loading && <AppLoader/>
            }
            {
                error && <div className="mt-2"><Alert variant="danger">{error}</Alert></div>
            }
            {
                !loading && !error && response && <div className="pl-3 pr-3">
                    {
                        [
                            {
                                label: "Delivered",
                                value: (response && response.emails && response.emails.delivered_email) || 0,
                                bgColor: "#ffd8db",
                                color: "#fb78a0"
                            },
                            {
                                label: "Clicked",
                                value: (response && response.emails && response.emails.clicked_email) || 0,
                                bgColor: "#fff6e5",
                                color: "#f9c86c"
                            },
                            {
                                label: "Opened",
                                value: (response && response.emails && response.emails.opened_email) || 0,
                                bgColor: "#f8f3ff",
                                color: "#6500ff"
                            },
                        ].map((value, index) => {
                            let total = response && response.emails && response.emails.total_emails || 1;
                            let total_per = (value.value * 100 / total).toFixed(0)
                            return <div key={index}>
                                <div style={{fontWeight: 400, fontSize: "18px"}}>
                                    {value.label}
                                </div>
                                <div className="d-flex align-items-center">
                                    <div style={{
                                        width: "100%",
                                        background: value.bgColor,
                                        height: "12px",
                                    }}>
                                        <div style={{
                                            width: `${total_per}%`,
                                            background: value.color,
                                            height: "12px",
                                            borderBottomRightRadius: "4px",
                                            borderTopRightRadius: "4px"
                                        }}>

                                        </div>
                                    </div>
                                    <div className="p-1"/>
                                    <div>
                                        {`${total_per}%`}
                                    </div>
                                </div>

                            </div>
                        })
                    }
                </div>
            }

        </AppCardBody>
    </AppCard>;

}

export default DashboardHomeEmailSent;
