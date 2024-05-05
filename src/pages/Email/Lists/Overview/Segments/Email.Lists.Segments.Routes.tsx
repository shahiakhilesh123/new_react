import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../../../../components/Loader/AppLoader";

const EmailMailingListsSegmentsView = lazy(
    () => import("./Email.Lists.Segments.View")
);
const EmailMailingListsSegmentsEdit = lazy(
    () => import("./Email.Lists.Segments.Edit")
);
const EmailMailingListsSegmentsCreate = lazy(
    () => import("./Email.Lists.Segments.Create")
);
const EmailMailingListsSegmentsSubscribers = lazy(
    () => import("./Email.Lists.Segments.Subscribers.List")
);
const EmailMailingListsSegmentsList = lazy(
    () => import("./Email.Lists.Segments.List")
);

function EmailMailingListsSegmentsController() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route
                    path="/email/lists/:list_uid/overview/segments/create"
                    component={EmailMailingListsSegmentsCreate}
                />
                <Route
                    path="/email/lists/:list_uid/overview/segments/:segment_uid/edit"
                    component={EmailMailingListsSegmentsEdit}
                />
                <Route
                    path="/email/lists/:list_uid/overview/segments/:segment_uid/view"
                    component={EmailMailingListsSegmentsView}
                />
                <Route
                    path="/email/lists/:list_uid/overview/segments/:segment_uid/subscribers"
                    component={EmailMailingListsSegmentsSubscribers}
                />
                <Route
                    path="/email/lists/:list_uid/overview/segments"
                    component={EmailMailingListsSegmentsList}
                />
                <Redirect to="/email/lists"/>
            </Switch>
        </Suspense>
    );
}

export default EmailMailingListsSegmentsController;
