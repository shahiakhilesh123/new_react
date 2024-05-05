import * as React from "react";
import {useContext} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import DashboardCardInfo from "../../../components/DashboardCardInfo/DashboardCardInfo";
import {DashboardHomeStateContext} from "../Dashboard.Home";
import AppLoader from "../../../components/Loader/AppLoader";
import {Alert} from "react-bootstrap";

function DashboardHomeInbox() {
    const {loading, error, response} = useContext(DashboardHomeStateContext);

    return <AppCard className="h-auto" style={{maxHeight: "450px", minHeight: "450px"}}>
        <AppCardHeader>
            <AppCardTitle>
                Inbox
            </AppCardTitle>


        </AppCardHeader>
        <AppCardBody className="p-0">
            {
                loading && <AppLoader/>
            }
            {
                error && <div className="mt-2"><Alert variant="danger">{error}</Alert></div>
            }
            {
                !loading && !error && response &&
                <div style={{height: "300px"}}>
                    <DashboardCardInfo text={"Coming soon..."}/></div>
            }
        </AppCardBody>
    </AppCard>;

}

export default DashboardHomeInbox;
