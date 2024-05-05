import React, {lazy, Suspense} from "react";
import AppLoader from "../../../../components/Loader/AppLoader";
import {Redirect, Route, Switch, useLocation, useParams} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import WithBreadCrumb from "../../../../components/Breadcrumbs/WithBreadcrumb";
import AppNavBar from "../../../../components/NavBar/App.NavBar";
import {matchPath} from "react-router";

const SegmentationEdit = lazy(() => import('./Email.Segmentation.Create'));
const SegmentationView = lazy(() => import('./Email.Segmentation.View'));
const SegmentationSubscribers = lazy(() => import('./Email.Segmentation.Subscribers.List'));

function EmailMailListsOverviewRoutes() {
    const {segment_uid} = useParams<any>();
    const location = useLocation();
    return <WithBreadCrumb>
        <Row>
            <Col md={12}>
                <AppNavBar menus={
                    [
                        // {
                        //     name: "Overview",
                        //     link: `/email/segments/${segment_uid}/overview`,
                        //     active: !!matchPath(
                        //         location.pathname,
                        //         {
                        //             path: '/email/segments/:segment_uid/overview',
                        //             exact: true
                        //         },
                        //     )
                        // },
                        {
                            name: "Edit",
                            link: `/email/segments/${segment_uid}/overview/edit`,
                            active: !!matchPath(
                                location.pathname,
                                '/email/segments/:segment_uid/overview/edit'
                            )
                        },
                        {
                            name: "Subscribers",
                            link: `/email/segments/${segment_uid}/overview/subscribers`,
                            active: !!matchPath(
                                location.pathname,
                                '/email/segments/:segment_uid/overview/subscribers'
                            )
                        },
                    ]
                }/>
            </Col>
            <Col md={12}>
                <Suspense fallback={<AppLoader/>}>
                    <Switch>
                        <Route path="/email/segments/:segment_uid/overview/edit"
                               component={SegmentationEdit}
                        />

                        <Route path="/email/segments/:segment_uid/overview/subscribers"
                               component={SegmentationSubscribers}
                        />
                        {/*<Route path="/email/segments/:segment_uid/overview"*/}
                        {/*       component={SegmentationView}*/}
                        {/* >*/}
                        <Redirect to="/email/segments"
                        />
                    </Switch>
                </Suspense>
            </Col>
        </Row>
    </WithBreadCrumb>
}

export default EmailMailListsOverviewRoutes;
