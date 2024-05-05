import {iEmailMailingList, iEmailMailingListVerification} from "../../types/internal/email/mailinglist";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams} from "../../types/api";
import ResourceAPIs from "../resource.apis";
import axios from "axios";


export interface iEmailMailingListListingResponse extends iApiBasicResponse {
    lists?: iBasicListingResponse<iEmailMailingList>
}

export interface iEmailMailingListShowResponse extends iApiBasicResponse {
    list?: iEmailMailingList
}

export interface iEmailMailingListVerificationResponse extends iApiBasicResponse {
    list?: iEmailMailingList
    verification?: iEmailMailingListVerification
}

export interface iEmailMailingListCreateParams extends iBasicResourceCreationParams {
    name: string
    from_email: string
    from_name: string
    default_subject: string
    email_subscribe: string
    email_unsubscribe: string
    subscribe_confirmation: string
    unsubscribe_notification: string
    send_welcome_email: string
    contact: {
        company: string
        state: string
        address_1: string
        address_2: string
        city: string
        zip: string
        country_id: string
        phone: string
        email: string
        url: string
    }
}


export default class EmailMailingListAPIs extends ResourceAPIs<iEmailMailingListCreateParams,
    iEmailMailingListListingResponse, iEmailMailingListShowResponse> {
    getResourceIdentifier = () => "/lists";

    list_growth = async (uid: string): Promise<any> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/list-growth`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res) => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    list_statistics_chart = async (uid: string): Promise<any> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/list-statistics-chart`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res) => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    verification = async (uid: string): Promise<iEmailMailingListVerificationResponse> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/verification`, {
                withCredentials: true, params: {
                    ts: new Date().getTime()
                }
            })
            .then((res) => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    resetVerification = async (uid: string): Promise<iEmailMailingListVerificationResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("_method", 'POST');
        return axios
            .post(this.getResourceURL() + `/${uid}/verification/reset`, fd, {
                withCredentials: true
            })
            .then((res) => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    startVerification = async (uid: string, email_server_id: string): Promise<iEmailMailingListVerificationResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("email_server_id", email_server_id);
        return axios
            .post(this.getResourceURL() + `/${uid}/verification/start`, fd, {
                withCredentials: true
            })
            .then((res) => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
