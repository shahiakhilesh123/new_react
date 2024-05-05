import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";


const EmailTemplatesList = lazy(() => import('./Email.Templates.List'));
const EmailTemplatesCreate = lazy(() => import('./Email.Templates.Create'));
const EmailTemplatesUpload = lazy(() => import('./Email.Templates.Upload'));

function EmailTemplatesController() {
    return <Suspense fallback={<AppLoader/>}><Switch>
        <Route path="/email/templates/create"
               component={EmailTemplatesCreate}
        />
        <Route path="/email/templates/upload"
               component={EmailTemplatesUpload}
        />
        <Route path="/email/templates"
               component={EmailTemplatesList}
        />
        <Redirect to="/email/templates"/>
    </Switch>
    </Suspense>;
}

export default EmailTemplatesController;
