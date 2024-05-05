import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";

const EmailMailingLists = lazy(() => import('./Email.Lists.List'));
const EmailMailingListCreate = lazy(() => import('./Overview/Email.Lists.Create'));
const EmailMailingOverviewRoutes = lazy(() => import('./Overview/Email.Lists.Overview.Routes'));

class EmailListsRoutes extends React.Component<any, any> {
    render() {
        return <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route exact path="/email/lists/create" component={EmailMailingListCreate}/>
                <Route exact path="/email/lists" component={EmailMailingLists}/>
                <Route path="/email/lists/:list_uid/overview" component={EmailMailingOverviewRoutes}/>
                <Redirect to="/email/lists"/>
            </Switch>
        </Suspense>;
    }
}

export default EmailListsRoutes;
