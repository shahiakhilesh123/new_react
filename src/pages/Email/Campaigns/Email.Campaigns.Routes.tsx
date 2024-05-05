import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";
import WithBreadCrumb from "../../../components/Breadcrumbs/WithBreadcrumb";

const CampaignsCreate = lazy(() => import('./Email.Campaigns.Create'));
const CampaignsList = lazy(() => import('./Email.Campaigns.List'));
const CampaignsView = lazy(() => import('./View/Email.Campaigns.View'));
const CampaignsOverview = lazy(() => import('./Overview/Email.Campaigns.Overview.Routes'));

function EmailCampaignsRoutes() {
    return <Suspense fallback={<AppLoader/>}>
        <Switch>
            <Route path="/email/campaigns/create"
                   render={() => <WithBreadCrumb><CampaignsCreate/></WithBreadCrumb>}/>
            <Route path="/email/campaigns/:uid/view"
                   component={CampaignsView}/>
            <Route path="/email/campaigns/:uid/overview"
                   render={() => <WithBreadCrumb><CampaignsOverview/></WithBreadCrumb>}
            />
            <Route path="/email/campaigns"
                   component={CampaignsList}/>
            <Redirect to="/email/campaigns"/>
        </Switch></Suspense>;

}

export default EmailCampaignsRoutes;
