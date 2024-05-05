import React, {useCallback, useContext, useEffect, useState} from "react";

import EmailMailingListFieldsAPIs, {iEmailMailingListFieldsIndexResponse} from "../../../../apis/Email/email.mailinglists.fields.apis";
import {
    getMailingListWithCache,
    iEmailMailingList,
    iEmailMailingListField,
} from "../../../../types/internal/email/mailinglist";
import EmailMailingListsFieldsView from "../../../../views/Email/MailingLists/EmailMailingListsFieldsView";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";
import EmailMailingListAPIs from "../../../../apis/Email/email.mailinglists.apis";
import {NotificationContext} from "../../../../App";
import useIsMounted from "ismounted";
import {useParams} from "react-router-dom";

interface iState {
    loading: boolean,
    error: string
    mailing_list?: iEmailMailingList
    fields?: iEmailMailingListField[]
}

function EmailListsFieldsHook(props: any) {


    const [resource, setResource] = useState<iEmailMailingList>();
    const notificationContext = useContext(NotificationContext);
    const breadcrumb = useContext(BreadCrumbContext);

    const params: any = useParams<any>();
    const isMounted = useIsMounted();
    const fetchResource = useCallback(() => {

        new EmailMailingListAPIs().view(params.list_uid).then(response => {
                if (isMounted.current) {

                    if (EmailMailingListAPIs.hasError(response, notificationContext) || !response.list) {

                        setResource(undefined);

                    } else {
                        setResource(getMailingListWithCache(response.list));

                    }
                }
            }
        )
    }, []);

    useEffect(() => {
        fetchResource();
    }, []);


    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (resource) {
                links.push({
                    link: `/email/lists/${resource.uid}/overview`,
                    text: resource.name
                })
                links.push({
                    link: `/email/lists/${resource.uid}/overview/fields`,
                    text: "Fields"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [resource])

    return <EmailListsFields {...props}/>
}

class EmailListsFields extends React.Component<any, iState> {
    uid: string = "";
    state: iState = {
        loading: false,
        error: ""
    };

    fetchResource = () => {
        this.setState({loading: true, error: ""});
        new EmailMailingListFieldsAPIs().setMailingListUid(this.uid).index().then(r => this.onFetchMailingListResponse(r))
    };

    updateFields = (fields: iEmailMailingListField[]) => {
        this.setState({loading: true, error: ""});
        new EmailMailingListFieldsAPIs().setMailingListUid(this.uid).storeAll(fields).then(r => this.onFetchMailingListResponse(r))
    };

    onFetchMailingListResponse = (response: iEmailMailingListFieldsIndexResponse) => {
        if (EmailMailingListFieldsAPIs.hasError(response, undefined) || !response.list || !response.fields) {
            this.setState({
                loading: false,
                error: !response.errors ? "" : EmailMailingListFieldsAPIs.getError(response),
                mailing_list: undefined,
                fields: undefined
            });
        } else {
            this.setState({
                loading: false,
                error: "",
                mailing_list: getMailingListWithCache(response.list),
                fields: response.fields
            });
        }
    };

    render() {
        const {mailing_list, fields} = this.state;
        if (!mailing_list || !fields) return null;
        return <EmailMailingListsFieldsView mailing_list={mailing_list}
                                            fields={fields}
                                            updateFields={this.updateFields}
                                            error={this.state.error}
                                            loading={this.state.loading}/>;
    }

    componentDidMount(): void {
        const uid: string | undefined = this.props.match.params.list_uid;
        if (!uid) {
            window.alert("Invalid route!");
            return;
        }
        this.uid = uid;
        this.fetchResource();
    }
}

export default EmailListsFieldsHook
