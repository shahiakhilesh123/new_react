import * as React from "react";
import {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../components/Loader/AppLoader";

const DashboardReports = lazy(() => import("./Dashboard.Reports"));
const DashboardMembers = lazy(() => import("./Dashboard.Members"));
const DashboardHelp = lazy(() => import("./Dashboard.Help"));
const DashboardHome = lazy(() => import("./Dashboard.Home"));
const ShopifyShopsCreate = lazy(() => import("./../Shopify/Shopify.Shops.Create"));
const ShopifyShopsList = lazy(() => import("./../Shopify/Shopify.Shops.List"));

function DashboardRoutes() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Switch>
                {/*<Route path="/dashboard/reports" component={DashboardReports} />*/}
                {/*<Route path="/dashboard/members" component={DashboardMembers} />*/}
                <Route path="/dashboard/brands/create" component={ShopifyShopsCreate}/>
                <Route path="/dashboard/brands" component={ShopifyShopsList}/>
                <Route path="/dashboard" component={DashboardHome}/>
                <Redirect to="/dashboard"/>
            </Switch>
        </Suspense>
    );
}

export default DashboardRoutes;
