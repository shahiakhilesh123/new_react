import React from "react";

import EmailMailingListAPIs, {iEmailMailingListVerificationResponse} from "../../../../apis/Email/email.mailinglists.apis";
import {
    getMailingListWithCache,
    iEmailMailingList,
    iEmailMailingListVerification,
} from "../../../../types/internal/email/mailinglist";
import EmailMailingListsVerificationView from "../../../../views/Email/MailingLists/Email.MailingLists.Verification";

interface iState {
    loading: boolean,
    error: string
    mailing_list?: iEmailMailingList
    verification?: iEmailMailingListVerification
}

class EmailListsVerification extends React.Component<any, iState> {
    uid: string = "";
    state: iState = {
        loading: false,
        error: ""
    };

    fetchMailingList = () => {
        this.setState({loading: true, error: ""});
        new EmailMailingListAPIs().verification(this.uid).then(r => this.onFetchMailingListResponse(r))
    };

    resetVerification = () => {
        this.setState({loading: true, error: ""});
        new EmailMailingListAPIs().resetVerification(this.uid).then(r => this.onFetchMailingListResponse(r))
    };

    startVerification = (email_server_id: string) => {
        this.setState({loading: true, error: ""});
        new EmailMailingListAPIs().startVerification(this.uid, email_server_id).then(r => this.onFetchMailingListResponse(r))
    };

    onFetchMailingListResponse = (response: iEmailMailingListVerificationResponse, silent: boolean = false) => {
        if (EmailMailingListAPIs.hasError(response, undefined) || !response.list) {
            this.setState({
                loading: false,
                error: (silent || !response.errors) ? "" : EmailMailingListAPIs.getError(response),
                mailing_list: undefined,
                verification: undefined
            });
        } else {
            this.setState({
                loading: false,
                error: "",
                mailing_list: getMailingListWithCache(response.list),
                verification: response.verification
            });
        }
    };

    render() {
        const {mailing_list, verification} = this.state;
        if (!mailing_list || !verification) return null;
        return <EmailMailingListsVerificationView mailing_list={mailing_list}
                                                  verification={verification}
                                                  resetVerification={this.resetVerification}
                                                  startVerification={this.startVerification}
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
        this.fetchMailingList();
    }
}


export default EmailListsVerification
