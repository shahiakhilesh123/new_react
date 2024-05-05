import {
    iEmailMailingList,
    iEmailMailingListField,
    iEmailMailingListSubscriber
} from "../../types/internal/email/mailinglist";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams, iListingQuery} from "../../types/api";
import ResourceAPIs from "../resource.apis";
import axios from "axios";
import {iCollectionElement, iSelectOption} from "../../types/internal";


export interface iEmailMailingListSubscriberListingResponse extends iApiBasicResponse {
    subscribers?: iBasicListingResponse<iEmailMailingListSubscriber>
    list?: iEmailMailingList
    fields?: iEmailMailingListField[]
}

export interface iEmailMailingListSubscriberShowResponse extends iApiBasicResponse {
    subscriber?: iEmailMailingListSubscriber
    list?: iEmailMailingList
    values?: iEmailMailingListField[]
}

interface iEmailMailingListSubscriberCreateParamsDEPRECATED extends iBasicResourceCreationParams {
}

export interface iEmailMailingListSubscriberCreateParams {
    params: iSelectOption[]
}

export interface SystemJobLog {
    log?: string,
    mail_list_uid?: string,
    customer_id?: string,
    status?: string,
    total?: string,
    processed?: string,
}

export interface SystemJob extends iCollectionElement {
    data: string | SystemJobLog
    end_at: string
    job_id: string
    last_error: string
    object_id: string
    object_name: string
    start_at: string
}

export interface SystemJobResponseList extends iApiBasicResponse {
    system_jobs: iBasicListingResponse<SystemJob>,
    list?: iEmailMailingList
}

export default class EmailMailingListSubscriberAPIs extends ResourceAPIs<iEmailMailingListSubscriberCreateParamsDEPRECATED,
    iEmailMailingListSubscriberListingResponse, iEmailMailingListSubscriberShowResponse> {
    list_uid: string = "";
    segment_uid: string = "";
    campaign_uid: string = "";

    setMailingListUid = (uid: string) => {
        this.list_uid = uid;
        return this;
    };

    setSegmentUid = (uid: string) => {
        this.segment_uid = uid;
        return this;
    };

    setCampaignUid = (uid: string) => {
        this.campaign_uid = uid;
        return this;
    };

    getResourceIdentifier = () => {
        if (this.campaign_uid) return `/campaigns/${this.campaign_uid}/subscribers`;
        if (this.segment_uid) return `/lists/${this.list_uid}/segments/${this.segment_uid}`;
        return `/lists/${this.list_uid}/subscribers`;
    };

    getResourceListingURL = () => {
        if (!this.segment_uid) return this.getResourceURL() + `/listing`;
        else return this.getResourceURL() + `/listing_subscribers`;
    };

    getResourceCreationURL = () => this.getResourceURL() + `/store`;

    create = async (): Promise<iApiBasicResponse> => {
        return {statusCode: 999, errors: {network: "Call to depreciated function. Use create_subscriber() instead!"}};
    };


    create_subscriber = async (creationParams: any) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        creationParams["_token"] = csrfToken;
        return axios
            .post(this.getResourceCreationURL(), creationParams, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    update_subscriber = async (uid: string, creationParams: any) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        creationParams["_token"] = csrfToken;
        creationParams["_method"] = "PATCH";

        return axios
            .post(this.getResourceUpdateURL(uid), creationParams, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    delete_subscriber = async (list_uid: string, uids: string[]) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("uids", uids.join(","));

        return axios
            .get(this.getApiBaseURL() + `/lists/${list_uid}/subscribers/delete`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    "uids": list_uid,
                    "_token": csrfToken,

                    ts: new Date().getTime()

                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    send_confirmation_mail = async (list_uid: string) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + `/lists/6086d5ef988e7/subscribers/resend/confirmation-email/${list_uid}`, fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    copy_subscriber = async (list_uid: string) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .get(this.getApiBaseURL() + `/lists/6086d5ef988e7/copy-move-from/copy`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    "uids": list_uid,
                    ts: new Date().getTime()

                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    copy = async (list_uid: string) => {
        let fd = new FormData();
        return axios
            .get(this.getApiBaseURL() + `/lists/6086d5ef988e7/copy-move-from/copy`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    "uids": list_uid,
                    ts: new Date().getTime()

                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    move_subscriber = async (list_uid: string) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .get(this.getApiBaseURL() + `/lists/6086d5ef988e7/copy-move-from/move`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    "uids": list_uid,
                    ts: new Date().getTime()

                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    subscribe = async (list_uid: string, uids: string[]) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("uids", uids.join(","));
        return axios
            .get(this.getApiBaseURL() + `/lists/${list_uid}/subscribers/subscribe`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    "uids": list_uid,
                    "_token": csrfToken,
                    ts: new Date().getTime()

                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    unsubscribe = async (list_uid: string, uids: string[]) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("uids", uids.join(","));
        return axios
            .get(this.getApiBaseURL() + `/lists/${list_uid}/subscribers/unsubscribe`, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    "uids": list_uid,
                    "_token": csrfToken,
                    ts: new Date().getTime()

                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    export = async (list_uid: string) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + `/lists/${list_uid}/subscribers/export`, fd, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            });
    }
    export_list = async (list_uid: string, query: iListingQuery): Promise<SystemJobResponseList> => {
        return axios
            .get(this.getApiBaseURL() + `/lists/${list_uid}/subscribers/export/list`, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ...query,
                    ts: new Date().getTime()
                }
            })
            .then((res): Promise<SystemJobResponseList> => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    export_download = async (job_id: number) => {
        console.log(`Job_iD: ${job_id}`);
        return axios.get(this.getApiBaseURL() + `/systems/jobs/${job_id}/download/csv`, {
            withCredentials: true,
            responseType: 'blob',
        })
        .then((res) => {
            const href = URL.createObjectURL(res.data);

            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', 'export.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        })
        .catch((err) => {
            return this.handleCatch(err);
        });
        
    };
    import = async (list_uid: string, file: any) => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("file", file);
        return axios
            .post(this.getApiBaseURL() + `/lists/${list_uid}/subscribers/import`, fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    import_list = async (list_uid: string, query: iListingQuery): Promise<SystemJobResponseList> => {
        return axios
            .get(this.getApiBaseURL() + `/lists/${list_uid}/subscribers/import/list`, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ...query,
                    ts: new Date().getTime()
                }
            })
            .then((res): Promise<SystemJobResponseList> => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    get_mailing_subscriber_options = async (list_uid: string, uids: string): Promise<SystemJobResponseList> => {

        return axios
            .get(this.getApiBaseURL() + `/lists/${list_uid}/copy-move-from/copy`, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {uids: uids, ts: new Date().getTime()}
            })
            .then((res): Promise<SystemJobResponseList> => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    edit_view = async (uid: string): Promise<iEmailMailingListSubscriberShowResponse> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/edit`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmailMailingListSubscriberShowResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
