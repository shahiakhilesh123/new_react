import React, {useContext, useEffect, useState} from "react";
import {useParams} from "react-router-dom";

import EmailMailingListAPIs, {iEmailMailingListShowResponse,} from "../../../../../apis/Email/email.mailinglists.apis";
import EmailMailingListsView from "../../../../../views/Email/MailingLists/Email.MailingLists.View";
import {getMailingListWithCache, iEmailMailingList,} from "../../../../../types/internal/email/mailinglist";
import {NotificationContext} from "../../../../../App";

function EmailMailingListViewController() {
    const [uid, setUid] = useState("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState("");
    const [mailingList, setMailingList] = useState<iEmailMailingList>();
    const params: any = useParams<any>();

    const notificationContext = useContext(NotificationContext);
    const fetchMailingList = () => {
        setLoading(true);
        setErrorMessage("");
        new EmailMailingListAPIs()
            .view(uid)
            .then((r) => onFetchMailingListResponse(r));
    };

    const onFetchMailingListResponse = (
        response: iEmailMailingListShowResponse,
        silent: boolean = false
    ) => {
        if (EmailMailingListAPIs.hasError(response, notificationContext) || !response.list) {
            setLoading(false);
            setErrorMessage(
                silent || !response.errors
                    ? ""
                    : EmailMailingListAPIs.getError(response)
            );
        } else {
            setLoading(false);
            setErrorMessage("");
            setMailingList(getMailingListWithCache(response.list));
        }
    };

    useEffect(() => {
        const uid: string | undefined = params.list_uid;
        if (!uid) {
            window.alert("Invalid route!");
            return;
        }
        setUid(uid);
        fetchMailingList();
    }, []);

    if (!mailingList) return null;
    return (
        <EmailMailingListsView
            mailing_list={mailingList}
            error={error_message}
            loading={loading}
        />
    );
}

export default EmailMailingListViewController;
