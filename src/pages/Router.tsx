import * as React from "react";
import {Dispatch, lazy, Suspense, useCallback, useContext, useEffect, useState} from "react";
import {Redirect, Route, Switch, useHistory, useLocation} from "react-router-dom";
import UpgradePlanDialog from "../components/UpgradePlan/UpgradePlanDialog";

import useIsMounted from "ismounted";

// @ts-ignore
import Tooltip from "../components/Tour/Tooltip";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AppLoader from "../components/Loader/AppLoader";
import UserAPIs from "../apis/user.apis";
import ScrollController from "./ScrollController";
import {iStoreAction} from "../redux/reducers";
import {AppDispatchContext, AppStateContext, NotificationContext} from "../App";
import {Scrollbar} from "../components/CustomScroll/ScrollBars";
import Axios from "axios";
import ResetPassword from "./Login/Forgot/ResetPassword";
import Register from "./Login/Register/Register";
import {HideBetterDoc, ShowBetterDoc} from "../components/common";

import {askForPermissionToReceiveNotifications} from "../push-notification";
import GettingStarted from "../components/GettingStarted/GettingStarted";
import {HomeTour} from "../components/Tour/Pages/Home.Tour";
import ShopifyPermissionRequired from "../components/ShopifyPermissionRequired/ShopifyPermissionRequired";
import qs from 'qs';


const TalkToAnAgent = lazy(() => import('./TalkToAnAgent/TalkToAnAgent'));
const Videos = lazy(() => import('./Help/Videos'));
const Temp = lazy(() => import('./temp/Temp'));
const DashboardRoutes = lazy(() => import('./Dashboard/Dashboard.Routes'));
const EmailRoutes = lazy(() => import('./Email/Email.Routes'));
const ChatRoutes = lazy(() => import('./Chats/Chats.Routes'));
const ShopifyRoutes = lazy(() => import('./Shopify/Shopify.Routes'));
const PopupRoutes = lazy(() => import('./Popup/Popup.Routes'));
const AccountRoutes = lazy(() => import('./Account/Account.Routes'));
const ReviewsRoutes = lazy(() => import('./Reviews/Reviews.Routes'));

const CreateNewPassword = lazy(() => import('./Login/CreateNewPassword'));
const ForgotPassword = lazy(() => import('./Login/Forgot/ForgotPassword'));

const Reload = lazy(() => import('./Reload'));
const RegisterComplete = lazy(() => import('./Login/Register/Register.Complete'));
const Login = lazy(() => import('./Login/Login/Login'));
const ReviewUpdate = lazy(() => import('./Public/ReviewUpdate/Review.Update'));


function Router() {


    let [firstTime, setFirstTime] = useState(true);

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);

    const history = useHistory();
    const location = useLocation();

    const isMounted = useIsMounted();
    const [loading, setLoading] = useState(true);


    const notificationContext = useContext(NotificationContext);

    const {shop, loggedInUser} = useContext(AppStateContext);
    const load_modules_settings = useCallback(() => {
        new UserAPIs().modules_status().then((res) => {
            if (isMounted.current) {
                if (UserAPIs.hasError(res, undefined)) {

                } else {
                    dispatch({type: "popup_enabled", enabled: res.popup_module_enabled})
                    dispatch({type: "chat_enabled", enabled: res.chat_module_enabled})
                    dispatch({type: "review_enabled", enabled: res.review_module_enabled})
                }
            }

        })
    }, []);


    useEffect(() => {
        const handleInvalidToken = (e: any) => {
            if (e.key === 'set_active_shop_uid' && e.oldValue && !e.newValue) {
                window.location.reload();
            }
        }
        window.addEventListener('storage', handleInvalidToken)
        return function cleanup() {
            window.removeEventListener('storage', handleInvalidToken)
        }
    }, [])


    useEffect(() => {
        if (shop && shop.customer_uid) {
            Axios.defaults.headers["X-Emailwish-Customer-UID"] = shop?.customer_uid;
            if (!firstTime) {
                history.push({pathname: "/reload"});
                setTimeout(() => {
                    history.goBack();
                }, 150)
            }
            setFirstTime(false)
        }

    }, [shop])


    const onFetchUser = useCallback(() => {
        setLoading(true);
        new UserAPIs().fetch_user().then((response) => {
            if (isMounted.current) {
                if (UserAPIs.hasError(response)) {
                    setLoading(false);
                } else {
                    if (response.user) {
                        let plans = response.plans && response.plans.map((value => {
                            let options_object = JSON.parse(value.options);
                            return {...value, options_object: options_object}
                        }))
                        dispatch({
                            type: "set_plans",
                            plans: plans,
                        })
                        if (response.shops && response.shops.length > 0) {
                            let set_active_shop_uid = window.localStorage.getItem("set_active_shop_uid");
                            if (set_active_shop_uid) {
                                let shop = response.shops.find(value => {
                                    return value.uid === set_active_shop_uid;
                                })
                                if (shop) {
                                    dispatch({
                                        type: "set_active_shop",
                                        shop: shop
                                    })
                                } else {
                                    dispatch({
                                        type: "set_active_shop",
                                        shop: response.shops[0]
                                    })
                                }
                            } else {
                                dispatch({
                                    type: "set_active_shop",
                                    shop: response.shops[0]
                                })
                            }

                            dispatch({
                                type: "set_shops",
                                shops: response.shops
                            })
                            dispatch({
                                type: "set_logged_in_user",
                                loggedInUser: response.user,
                            })
                        } else {
                            dispatch({
                                type: "set_logged_in_user",
                                loggedInUser: response.user,
                            })
                        }

                    }
                    const qsParams = qs.parse(location.search, {ignoreQueryPrefix: true});
                    const redirect = qsParams.redirect;
                    if(redirect){
                        delete qsParams.redirect;
                    
                        const newQueryString = qs.stringify(qsParams);

                        const redirect_url = redirect + "?" + newQueryString;
                        response.redirectURL = redirect_url
                    }
                    
                    if (response.redirectURL) {
                        const pathHasRegister = location.pathname.includes("/register");
                        if (!pathHasRegister) {
                            history.push(response.redirectURL)
                        }
                    }
                    setLoading(false);
                }
            }
        });
    }, [isMounted,]);

    useEffect(() => {
        if (loggedInUser && shop && shop.customer_uid) {
            load_modules_settings();

            askForPermissionToReceiveNotifications().then((value => {
                if (value) {
                    new UserAPIs().fcm_token(value).then((value => {

                    }))
                } else {

                }
            }));


        }
    }, [loggedInUser, shop])

    useEffect(() => {
        onFetchUser();


    }, []);

    if (loading) {
        return null;
    }
    return <ScrollController>
        <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route path="/register/complete" component={RegisterComplete}/>
                <Route path="/register" component={Register}/>
                <Route path="/reload" component={Reload}/>
                <Route path="/tmp" component={Temp}/>

                <Route path="/review/update/:uid/:secret" component={ReviewUpdate}/>
                {/*<NotLoggedRoutes path="/create-new-password"><CreateNewPassword/></NotLoggedRoutes>*/}
                <NotLoggedRoutes path="/forgot-password"><ForgotPassword/></NotLoggedRoutes>
                <NotLoggedRoutes path="/password/reset/:token"><ResetPassword/></NotLoggedRoutes>
                <NotLoggedRoutes path="/login"><Login/></NotLoggedRoutes>

                <PrivateRoute path="/">
                    <UpgradePlanDialog />
                    <Scrollbar removeTrackYWhenNotUsed permanentTrackY={false} style={{width: "100%", height: "100vh"}}>
                        <Sidebar>
                            <div className="app-content">
                                <Header/>
                                <div className="container p-0">
                                    <GettingStarted/>
                                    <ShopifyPermissionRequired/>
                                    <Suspense fallback={<AppLoader/>}>
                                        <Switch>
                                            <Route path="/dashboard" component={DashboardRoutes}/>
                                            <Route path="/email" component={EmailRoutes}/>
                                            <Route path="/chats" component={ChatRoutes}/>
                                            <Route path="/reviews" component={ReviewsRoutes}/>
                                            <Route path="/popups" component={PopupRoutes}/>
                                            <Route path="/account" component={AccountRoutes}/>
                                            <Route path="/shopify" component={ShopifyRoutes}/>
                                            <Route path="/support" component={TalkToAnAgent}/>
                                            <Route path="/videos" component={Videos}/>
                                            <Redirect to={"/dashboard"}/>
                                        </Switch>
                                    </Suspense>
                                </div>

                            </div>
                            <HomeTour/>
                        </Sidebar>
                    </Scrollbar>
                </PrivateRoute>
            </Switch>
        </Suspense>
    </ScrollController>;
}

function PrivateRoute({children, ...rest}: any) {
    const {loggedInUser, shops}: any = useContext(AppStateContext);

    useEffect(() => {
        if (loggedInUser && shops && shops.length > 0) {
            ShowBetterDoc();
        } else {
            HideBetterDoc();
        }
        return () => {
            HideBetterDoc();
        }
    }, [loggedInUser, shops])

    if (!loggedInUser) {
        return <Route {...rest}
                      render={({location}) =>
                          <Redirect to={{
                              pathname: "/login",
                              state: {from: location}
                          }}
                          />

                      }
        />;
    }
    if (loggedInUser && shops && shops.length > 0) {
        return <Route {...rest}
                      render={({location}) =>
                          children
                      }
        />;
    } else {
        return <Route {...rest}
                      render={({location}) =>
                          <Redirect to={{
                              pathname: "/register",
                              state: {from: location}
                          }}
                          />
                      }
        />
    }

}

function NotLoggedRoutes({children, ...rest}: any) {
    const {loggedInUser} = useContext(AppStateContext);
    return (
        <Route {...rest}
               render={() =>
                   !loggedInUser ? (children) : (
                       <Redirect to={{
                           pathname: "/",
                       }}
                       />
                   )
               }
        />
    );
}

export default Router;
