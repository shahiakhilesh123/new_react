import React, {useContext, useEffect, useState} from "react";

import {useParams} from "react-router-dom";

import {iApiBasicResponse} from "../../../../../types/api";

import {iEmailMailingList, iEmailMailingListField,} from "../../../../../types/internal/email/mailinglist";
import EmailMailingListFieldsAPIs, {iEmailMailingListFieldsIndexResponse,} from "../../../../../apis/Email/email.mailinglists.fields.apis";
import EmailMailingListSegmentAPIs, {iEmailMailingListSegmentCreateParams,} from "../../../../../apis/Email/email.mailinglists.segments.apis";
import EmailMailingListsSegmentsCreateView
  from "../../../../../views/Email/MailingLists/MailingLists.Segments/EmailMailingListsSegmentsCreateView";
import {NotificationContext} from "../../../../../App";
import AppCard from "../../../../../components/Card/AppCard";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../../components/Breadcrumbs/WithBreadcrumb";


function EmailListsSegmentsCreate() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [response, setResponse] = useState<iApiBasicResponse>();
    const [mailingList, setMailingList] = useState<iEmailMailingList>();
    const [fields, setFields] = useState<iEmailMailingListField[]>();
    const params: any = useParams<any>();

    const notificationContext = useContext(NotificationContext);
    const createResource = (
        creationParams: iEmailMailingListSegmentCreateParams
    ) => {
        setLoading(true);
        setErrorMessage("");
        new EmailMailingListSegmentAPIs()
            .setMailingListUid(params.list_uid)
            .create(creationParams)
            .then((response) => onCreateResourceResponse(response));
    };

    const onCreateResourceResponse = (response: iApiBasicResponse) => {
        if (EmailMailingListSegmentAPIs.hasError(response, notificationContext) || !response.uid) {
            setLoading(false);
            setErrorMessage(EmailMailingListSegmentAPIs.getError(response));
            setErrors(response.errors || {});
        } else {
            setLoading(false);
            setErrorMessage("");
            setErrors({});
            setResponse(response);
        }
    };

    const fetchListAndFields = () => {
        new EmailMailingListFieldsAPIs()
            .setMailingListUid(params.list_uid)
            .index()
            .then((r) => onFieldsResponse(r));
    };

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (mailingList) {
                links.push({
                    link: `/email/lists/${mailingList.uid}/overview`,
                    text: mailingList.name
                })
                links.push({
                    link: `/email/lists/${mailingList.uid}/overview/segments`,
                    text: "Segments"
                })
                links.push({
                    link: `/email/lists/${mailingList.uid}/overview/segments/create`,
                    text: "Create"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [mailingList])

    const onFieldsResponse = (response: iEmailMailingListFieldsIndexResponse) => {
        if (
            EmailMailingListFieldsAPIs.hasError(response, notificationContext) ||
            !response.list ||
            !response.fields
        ) {
            setLoading(false);
            setErrorMessage(EmailMailingListFieldsAPIs.getError(response));
            setErrors(response.errors || {});
        } else {
            setLoading(false);
            setErrorMessage("");
            setErrors({});
            setMailingList(response.list);
            setFields(response.fields);
        }
    };

    useEffect(() => {

        fetchListAndFields();
    }, []);

    return (
        <AppCard>
            <EmailMailingListsSegmentsCreateView
                createResource={createResource}
                response={response}
                error_message={error_message}
                errors={errors}
                mailing_list_id={params.list_uid}
                mailing_list={mailingList}
                fields={fields}
                loading={loading}
            />
        </AppCard>
    );

}

export default EmailListsSegmentsCreate;
