import * as React from "react";
import {lazy, Suspense} from "react";
import {Route, Switch} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";

const ChatsDepartmentList = lazy(
    () => import("./Chats.Department.List")
);
const ChatsDepartmentCreate = lazy(
    () => import("./Chats.Department.Create")
);

function DepartmentRoutes() {
    return (
        <Suspense fallback={<AppLoader/>}>
            <Switch>
                <Route path="/chats/departments/create" component={ChatsDepartmentCreate}/>
                <Route path="/chats/departments" component={ChatsDepartmentList}/>
            </Switch>
        </Suspense>
    );
}

export default DepartmentRoutes;
