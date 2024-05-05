import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";

const EmailDomains = lazy(() => import('./Email.Domains.List'));
const EmailDomainsEdit = lazy(() => import('./Email.Domains.Edit'));

class EmailListsRoutes extends React.Component<any, any> {
    render() {
        return <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route exact path="/email/domains" component={EmailDomains}/>
                <Route exact path="/email/domains/:domain_uid/edit" component={EmailDomainsEdit}/>
                <Redirect to="/email/domains"/>
            </Switch>
        </Suspense>;
    }
}

export default EmailListsRoutes;
