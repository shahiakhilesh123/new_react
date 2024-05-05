import * as React from "react";
import {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../components/Loader/AppLoader";

const ChatsDepartment = lazy(
    () => import("./Departments/Chats.Department")
);
const ChatsCanned = lazy(
    () => import("./CannedMessages/Chats.Canned.Routes")
);

const ChatsSettings = lazy(() => import("./Chats.Settings"));
const ChatsHome = lazy(() => import("./Chats.Home"));

function ChatsRoutes() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route path="/chats/settings" component={ChatsSettings}/>
                <Route path="/chats/canned" component={ChatsCanned} />
                {/*<Route path="/chats/departments" component={ChatsDepartment} />*/}
                <Route path="/chats" component={ChatsHome}/>
                <Redirect to="/chats"/>
            </Switch>
        </Suspense>
    );
}

export default ChatsRoutes;
