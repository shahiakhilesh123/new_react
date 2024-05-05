import * as React from "react";
import {useContext} from "react";
import moment from "moment-timezone";
import {AppStateContext} from "../../App";

export default function FormattedDate({date_string, format}: { date_string: string | undefined, format?: string }) {

    const {loggedInUser} = useContext(AppStateContext);
    let timezone = 'UTC';
    if (loggedInUser
        && loggedInUser.customers
        && loggedInUser.customers.length) {
        timezone = loggedInUser.customers[0].timezone !== "" ? loggedInUser.customers[0].timezone : timezone;
    }
    if (!date_string) {
        return null;
    }
    return <>{
         moment.tz(date_string, 'UTC').tz(timezone).format(format ? format : "MMM Do, YYYY H:mm a")
     }</>
}

