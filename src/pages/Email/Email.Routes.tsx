import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import AppLoader from "../../components/Loader/AppLoader";

const EmailHome = lazy(() => import('./Home/Email.Home'));
const EmailCampaigns = lazy(() => import('./Campaigns/Email.Campaigns.Routes'));
const EmailAutomations = lazy(() => import('./Automations/Email.Automations.Routes'));
const EmailMailingList = lazy(() => import('./Lists/Email.Lists.Routes'));
const EmailTemplates = lazy(() => import('./Templates/Email.Templates.Routes'));
const EmailSegment = lazy(() => import("./Segment/Email.Segment.Routes"));
const EmailDomains = lazy(() => import("./Domains/Email.Domains.Routes"));

class EmailRoutes extends React.Component {
    render() {
        return <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route path="/email/campaigns" component={EmailCampaigns}/>
                <Route path="/email/automations" component={EmailAutomations}/>
                <Route path="/email/lists" component={EmailMailingList}/>
                <Route path="/email/templates" component={EmailTemplates}/>
                <Route path="/email/segments" component={EmailSegment}/>
                <Route path="/email/domains" component={EmailDomains}/>
                <Route path="/email" component={EmailHome}/>
                <Redirect to="/email"/>
            </Switch>
        </Suspense>;
    }
}

export default EmailRoutes;
