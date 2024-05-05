import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../components/Loader/AppLoader";
import AccountNavBar from "../../components/Account.NavBar";
import {Col, Row} from "react-bootstrap";
import AppCard from "../../components/Card/AppCard";

const AccountContact = lazy(() => import('./Contact/Account.Contact'));
const AccountLogs = lazy(() => import('./Logs/Account.Logs'));
const AccountProfile = lazy(() => import('./Profile/Account.Profile'));
const AccountSubscription = lazy(() => import('./Subscription/Account.Subscription'));
const Signature = lazy(() => import('./Signature/Signature'));

export default function AccountRoutes() {
    return <Row>
        <Col md={12} className="mt-2 mb-2">
            <AppCard>
                <AccountNavBar/>
            </AppCard>
        </Col>
        <Col md={12}>
            <Suspense fallback={<AppLoader/>}>
                <Switch>
                    <Route path="/account/profile" component={AccountProfile}/>
                    <Route path="/account/contact" component={AccountContact}/>
                    <Route path="/account/signature" component={Signature}/>
                    <Route path="/account/subscription" component={AccountSubscription}/>
                    <Route path="/account/logs" component={AccountLogs}/>
                    <Redirect to="/account/profile"/>
                </Switch>
            </Suspense>
        </Col>
    </Row>

}
