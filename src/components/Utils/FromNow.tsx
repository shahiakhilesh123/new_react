import moment from "moment-timezone";

import {AppStateContext} from "../../App";
import React, {useContext} from "react";


export default function TimeFromNow(props: any) {
    const {loggedInUser} = useContext(AppStateContext);
    let timezone = 'UTC';
    if (loggedInUser
        && loggedInUser.customers
        && loggedInUser.customers.length) {
            timezone = loggedInUser.customers[0].timezone !== "" ? loggedInUser.customers[0].timezone : timezone;
    }
    return <>{
        moment.tz(props.date_string, 'UTC').tz(timezone).fromNow()
    }</>
}