import * as React from "react";
import {lazy, Suspense} from "react";
import {Route, Switch} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";

const ChatsCanned = lazy(() => import("./Chats.Canned.List"));
const ChatsCannedCreate = lazy(() => import("./Chats.Canned.Create"));

function CannedMessagesRoute() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route path="/chats/canned/create" component={ChatsCannedCreate}/>
                <Route path="/chats/canned" component={ChatsCanned}/>
            </Switch>
        </Suspense>
    );
}

export default CannedMessagesRoute;
