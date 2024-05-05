import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../components/Loader/AppLoader";

const ReviewsCreate = lazy(() => import("./Reviews.Create"));
const ReviewsList = lazy(() => import("./Review.List"));
const ReviewSettings = lazy(() => import("./Review.Settings"));
const ReviewImport = lazy(() => import("./Review.Import"));

function ReviewsController() {
    return <Suspense fallback={<AppLoader/>}>
        <Switch>
            <Route path="/reviews/create"
                   component={ReviewsCreate}/>
            <Route path="/reviews/edit/:id"
                   component={ReviewsCreate}/>
            <Route path="/reviews/settings"
                   component={ReviewSettings}/>
            <Route path="/reviews/import"
                   component={ReviewImport}/>
            <Route path="/reviews"
                   component={ReviewsList}/>
            <Redirect to="/reviews"/>
        </Switch></Suspense>;
}

export default ReviewsController;
