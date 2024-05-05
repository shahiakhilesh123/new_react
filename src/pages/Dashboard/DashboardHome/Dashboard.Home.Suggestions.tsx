import * as React from "react";
import {useContext} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import setting_icon from "../../../assets/images/settings-dark.svg";
import DashboardCardInfo from "../../../components/DashboardCardInfo/DashboardCardInfo";
import AppLoader from "../../../components/Loader/AppLoader";
import {DashboardHomeStateContext} from "../Dashboard.Home";
import {Alert} from "react-bootstrap";

function DashboardHomeSuggestions() {

    const {loading, error, response} = useContext(DashboardHomeStateContext);

    return <AppCard className="h-auto" style={{maxHeight: "450px", minHeight: "450px"}}>
        <AppCardHeader>
            <div className="d-flex justify-content-between">
                <AppCardTitle>
                    Suggestions
                </AppCardTitle>
                <div>
                    <img className="app-dark-bg-color-1 app-icon" src={setting_icon} alt="Settings"/>
                </div>
            </div>
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
                    <DashboardCardInfo text={"Coming soon..."}/>
                </div>
            }
        </AppCardBody>
    </AppCard>;

}

export default DashboardHomeSuggestions;
