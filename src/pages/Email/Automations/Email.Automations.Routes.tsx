import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";

const EmailAutomationsList = lazy(() => import('./Email.Automations.List'))

function EmailAutomationsController() {

    return <Suspense fallback={<AppLoader/>}><Switch>
        <Route path="/email/automations"
               component={EmailAutomationsList}
        />
        <Redirect to="/email/automations"/>
    </Switch></Suspense>;

}

export default EmailAutomationsController;
