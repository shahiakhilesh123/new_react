import * as React from "react";
import {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../components/Loader/AppLoader";

const PopupCreate = lazy(() => import("./Popup.Create"));
const PopupCreateCampaign = lazy(
    () => import("./Popup.CreateCampaign")
);
const PopupLogs = lazy(() => import("./Popup.Logs"));
const PopupLibrary = lazy(() => import("./Popup.Library"));
const PopupSettings = lazy(() => import("./Popup.Settings"));
const PopupList = lazy(() => import("./Popup.List"));

function PopupRoutes() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route path="/popups/edit/:uid" component={PopupCreate}/>
                <Route path="/popups/campaign" component={PopupCreate}/>
                <Route path="/popups/create-campaign" component={PopupCreateCampaign}/>
                <Route path="/popups/logs" component={PopupLogs}/>
                <Route path="/popups/library" component={PopupLibrary}/>
                <Route path="/popups/settings" component={PopupSettings}/>
                <Route path="/popups" component={PopupList}/>
                <Redirect to="/popups"/>
            </Switch>
        </Suspense>
    );
}

export default PopupRoutes;
