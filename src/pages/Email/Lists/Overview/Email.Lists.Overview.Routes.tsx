import React, {lazy, Suspense, useState} from "react";
import AppLoader from "../../../../components/Loader/AppLoader";
import {Redirect, Route, Switch, useLocation, useParams} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import WithBreadCrumb from "../../../../components/Breadcrumbs/WithBreadcrumb";
import AppNavBar from "../../../../components/NavBar/App.NavBar";
import {matchPath} from "react-router";
import HelpVideo from "../../../../components/HelpVideo/HelpVideo";

const MailingListsEdit = lazy(() => import('./Email.Lists.Edit'));
const MailingListsView = lazy(() => import('./Email.Lists.View'));
const MailingListsVerification = lazy(() => import('./Email.Lists.Verification'));
const MailingListsFields = lazy(() => import('./Email.Lists.Fields'));
const MailingListsSubscribers = lazy(() => import('./Subscribers/Email.Lists.Subscribers.Routes'));
const MailingListsSegments = lazy(() => import('./Segments/Email.Lists.Segments.Routes'));

function EmailMailListsOverviewRoutes() {
    const {list_uid} = useParams<any>();
    const location = useLocation();

    const [showHelpVideo, setShowHelpVideo] = useState(false);
    return <WithBreadCrumb>
        <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                   helpLink={"https://www.youtube.com/embed/4duB4kLV670"}/>

        <Row>
            <Col md={12}>
                <AppNavBar
                    onHelpClick={() => {
                        setShowHelpVideo(true)
                    }}
                    menus={
                        [
                            {
                                name: "Overview",
                                link: `/email/lists/${list_uid}/overview`,
                                active: !!matchPath(
                                    location.pathname,
                                    {
                                        path: '/email/lists/:list_uid/overview',
                                        exact: true
                                    },
                                )
                            },
                            {
                                name: "Edit",
                                link: `/email/lists/${list_uid}/overview/edit`,
                                active: !!matchPath(
                                    location.pathname,
                                    '/email/lists/:list_uid/overview/edit'
                                )
                            },
                            {
                                name: "Subscribers",
                                link: `/email/lists/${list_uid}/overview/subscribers`,
                                active: !!matchPath(
                                    location.pathname,
                                    '/email/lists/:list_uid/overview/subscribers'
                                ),
                                submenus: [
                                    {
                                        name: "View All",
                                        link: `/email/lists/${list_uid}/overview/subscribers`,
                                    },
                                    {
                                        name: "Add new",
                                        link: `/email/lists/${list_uid}/overview/subscribers/create`,
                                    },
                                    {
                                        name: "Import",
                                        link: `/email/lists/${list_uid}/overview/subscribers/import`,
                                    },
                                    {
                                        name: "Export",
                                        link: `/email/lists/${list_uid}/overview/subscribers/export`,
                                    },
                                ]
                            },
                            // {
                            //     name: "Segments",
                            //     link: `/email/lists/${list_uid}/overview/segments`,
                            //     active: !!matchPath(
                            //         location.pathname,
                            //         '/email/lists/:list_uid/overview/segments'
                            //     ),
                            //     submenus: [
                            //         {
                            //             name: "View All",
                            //             link: `/email/lists/${list_uid}/overview/segments`,
                            //         },
                            //         {
                            //             name: "Add new",
                            //             link: `/email/lists/${list_uid}/overview/segments/create`,
                            //         },
                            //     ]
                            // },
                            {
                                name: "Fields",
                                link: `/email/lists/${list_uid}/overview/fields`,
                                active: !!matchPath(
                                    location.pathname,
                                    '/email/lists/:list_uid/overview/fields'
                                )
                            },
                            // {
                            //     name: "Email Verification",
                            //     link: `/email/lists/${list_uid}/overview/verification`,
                            //     active: !!matchPath(
                            //         location.pathname,
                            //         '/email/lists/:list_uid/overview/verification'
                            //     )
                            // },
                        ]
                    }/>
            </Col>
            <Col md={12}><Suspense fallback={<AppLoader/>}>
                <Switch>
                    <Route path="/email/lists/:list_uid/overview/edit"
                           component={MailingListsEdit}
                    />

                    <Route path="/email/lists/:list_uid/overview/fields"
                          component={MailingListsFields}
                    />
                    {/*<Route path="/email/lists/:list_uid/overview/verification"*/}
                    {/*       component={MailingListsVerification}*/}
                    {/*/>*/}
                    <Route path="/email/lists/:list_uid/overview/subscribers"
                           component={MailingListsSubscribers}
                    />
                    {/*<Route path="/email/lists/:list_uid/overview/segments"*/}
                    {/*       component={MailingListsSegments}*/}
                    {/*/>*/}
                    <Route path="/email/lists/:list_uid/overview"
                           component={MailingListsView}
                    />
                    <Redirect to="/email/lists"
                    />
                </Switch>
            </Suspense>
            </Col>
        </Row>
    </WithBreadCrumb>
}

export default EmailMailListsOverviewRoutes;
