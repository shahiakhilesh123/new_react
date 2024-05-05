import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../components/Loader/AppLoader";

const ShopifyShopsCreateHooksController = lazy(() => import("./Shopify.Shops.Create"));
const ShopifyShopsListHooksController = lazy(() => import("./Shopify.Shops.List"));

function ShopifyController() {
    return <Suspense fallback={<AppLoader/>}><Switch>
        <Route
            path="/shopify/shops/create"
            component={ShopifyShopsCreateHooksController}
        />
        <Route
            path="/shopify/shops"
            component={ShopifyShopsListHooksController}
        />
        <Redirect to="/shopify/shops"/>
    </Switch></Suspense>;
}

export default ShopifyController;
