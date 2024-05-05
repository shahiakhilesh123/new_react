import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";

import EmailMailingListAPIs from "../../../../../apis/Email/email.mailinglists.apis";
import EmailMailingListFieldsAPIs from "../../../../../apis/Email/email.mailinglists.fields.apis";
import EmailMailingListSegmentAPIs, {
    iEmailMailingListSegmentCreateParams,
    iEmailMailingListSegmentShowResponse,
} from "../../../../../apis/Email/email.mailinglists.segments.apis";
import EmailMailingListsSegmentsEdit
    from "../../../../../views/Email/MailingLists/MailingLists.Segments/Email.MailingLists.Segments.Edit";
import {useParams} from "react-router-dom";
import {NotificationContext} from "../../../../../App";
import {Reducer} from "redux";
import {
    failed_action_response,
    iResource,
    iResponseActions,
    loading_action_response,
    responseReducer,
    success_action_response
} from "../../../../../redux/reducers";
import AppLoader from "../../../../../components/Loader/AppLoader";
import {Alert} from "react-bootstrap";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../../components/Breadcrumbs/WithBreadcrumb";

function EmailMailingListEditController() {

    const [{
        response,
        error,
        loading,
        error_block
    }, dispatchResponse] = useReducer<Reducer<iResource<iEmailMailingListSegmentShowResponse>,
        iResponseActions<iEmailMailingListSegmentShowResponse>>>
    (responseReducer<iResource<iEmailMailingListSegmentShowResponse>, any>({}), {loading: true});

    const [errors, setErrors] = useState<any>({});
    const params: any = useParams<any>();

    const notificationContext = useContext(NotificationContext);
    const fetchResource = useCallback(() => {
        dispatchResponse(loading_action_response());
        new EmailMailingListSegmentAPIs()
            .setMailingListUid(params.list_uid)
            .view(params.segment_uid)
            .then((response) => {
                if (
                    EmailMailingListFieldsAPIs.hasError(response, notificationContext)
                ) {
                    dispatchResponse(failed_action_response(response.message));
                } else {
                    dispatchResponse(success_action_response(response));
                }
            });
    }, [params]);


    const updateResource = (
        creationParams: iEmailMailingListSegmentCreateParams
    ) => {
        new EmailMailingListSegmentAPIs()
            .setMailingListUid(params.list_uid)
            .update(params.segment_uid, creationParams)
            .then((response) => {
                if (EmailMailingListAPIs.hasError(response, notificationContext) || !response.uid) {
                } else {

                }
            });
    };

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (response && response.list) {
                links.push({
                    link: `/email/lists/${response.list.uid}/overview`,
                    text: response.list.name
                })
                links.push({
                    link: `/email/lists/${response.list.uid}/overview/segments`,
                    text: "Segments"
                })
                if (response && response.segment) {
                    links.push({
                        link: `/email/lists/${response.list.uid}/overview/segments/${response.segment.uid}/edit`,
                        text: response.segment.name
                    })
                }

            }
            breadcrumb.setLinks(links);
        }
    }, [response])


    useEffect(() => {
        fetchResource();
    }, []);

    if (loading) {
        return <AppLoader/>
    }
    if (error_block) {
        return <Alert>{error_block}</Alert>
    }
    if (!response || !response.list) {
        return <Alert>Mailing list not found</Alert>
    }
    if (!response || !response.list) {
        return <Alert>Mailing list not found</Alert>
    }
    return (
        <EmailMailingListsSegmentsEdit
            updateResource={updateResource}
            mailing_list_id={params.list_uid}
            mailing_list={response.list}
            fields={response.fields}
            error_message={error || ""}
            errors={errors}
            loading={!!loading}
        />
    );

}

export default EmailMailingListEditController;
