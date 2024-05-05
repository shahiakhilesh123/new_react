import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../../../../components/Loader/AppLoader";
import EmailListSubscribersExport from "./Email.Lists.Subscribers.Export";

const EmailMailingListsSubscribersList = lazy(
    () => import("./Email.Lists.Subscribers.List")
);
const EmailMailingListsSubscribersCreate = lazy(() => import("./Email.Lists.Subscribers.Create"));
const EmailMailingListsSubscribersEdit = lazy(() => import("./Email.Lists.Subscribers.Edit"));
const EmailMailingListsSubscribersView = lazy(() => import("./Email.Lists.Subscribers.View"));
const EmailListSubscribersImport = lazy(() => import("./Email.Lists.Subscribers.Import"));

function EmailMailingListsSubscribersController() {
    return <Suspense fallback={<AppLoader/>}>
        <Switch>
            <Route
                path="/email/lists/:list_uid/overview/subscribers/create"
                component={EmailMailingListsSubscribersCreate}
            />
            <Route
               path="/email/lists/:list_uid/overview/subscribers/import"
               component={EmailListSubscribersImport}
            />
            <Route
               path="/email/lists/:list_uid/overview/subscribers/export"
               component={EmailListSubscribersExport}
            />
            <Route
                path="/email/lists/:list_uid/overview/subscribers/:subscriber_uid/edit"
                component={EmailMailingListsSubscribersEdit}
            />
            <Route
                path="/email/lists/:list_uid/overview/subscribers/:subscriber_uid/view"
                component={EmailMailingListsSubscribersView}
            />
            <Route
                path="/email/lists/:list_uid/overview/subscribers"
                component={EmailMailingListsSubscribersList}
            />
            <Redirect to="/email/lists"/>
        </Switch>
    </Suspense>;
}

export default EmailMailingListsSubscribersController;
