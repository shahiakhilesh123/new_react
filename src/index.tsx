import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import "./custom-bootstrap.scss";
import "./assets/css/index.scss";
import "react-datepicker/dist/react-datepicker.css";
import App from "./App";
import initializeFirebase from "./push-notification";

initializeFirebase()
ReactDOM.render(
    <App/>,
    document.getElementById('root'));
serviceWorkerRegistration.unregister();

