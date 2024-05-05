import React, {lazy, Suspense} from 'react';
import AppLoader from "../../../components/Loader/AppLoader";
import {Redirect, Route, Switch} from 'react-router-dom';

const EmailSegmentList = lazy(() => import("./Email.Segment.List"));
const EmailSegmentationOverview = lazy(() => import("./Overview/Email.Segmentation.Overview.Routes"));

function EmailSegmentRoutes() {
    return <Suspense fallback={<AppLoader/>}>
        <Switch>
            <Route path="/email/segments/:segment_uid/overview" component={EmailSegmentationOverview}/>
            <Route path="/email/segments" component={EmailSegmentList}/>
            <Redirect to="/email/segments"/>
        </Switch>
    </Suspense>
}

export default EmailSegmentRoutes;