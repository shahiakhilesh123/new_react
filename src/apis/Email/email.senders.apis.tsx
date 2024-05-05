import {iEmailSender, iEmailSenderVerificationOptions} from "../../types/internal";
import {
    iApiBasicResponse,
    iBasicListingResponse,
    iBasicResourceCreationParams,
    iDropboxResponse
} from "../../types/api";
import ResourceAPIs from "../resource.apis";
import axios from "axios";


export interface iEmailSenderListingResponse extends iApiBasicResponse {
    senders?: iBasicListingResponse<iEmailSender>
}

export interface iEmailSenderViewResponse extends iApiBasicResponse {
    sender?: iEmailSender
    verificationOptions?: iEmailSenderVerificationOptions[]
}

export interface iEmailSenderCreateParams extends iBasicResourceCreationParams {
    name: string
    email: string
}


export default class EmailSenderAPIs extends ResourceAPIs<iEmailSenderCreateParams,
    iEmailSenderListingResponse, iEmailSenderViewResponse> {
    getResourceIdentifier = () => "/senders";
    getResourceUpdateURL = (uid: string) => this.getResourceURL() + `/${uid}`;

    dropbox = async (keyword: string): Promise<iDropboxResponse> => {
        return axios
            .get(this.getResourceURL + "/dropbox", {
                withCredentials: true,
                params: {
                    keyword: keyword,
                    ts: new Date().getTime()
                }
            })
            .then((res): iDropboxResponse => ({statusCode: res.status, dropbox: res.data}))
            .catch((): iDropboxResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    };


    verifySender = async (uid: string, type: string): Promise<iEmailSenderViewResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("type", type);
        return axios
            .post(this.getResourceURL() + `/${uid}/verify`, fd, {
                withCredentials: true
            })
            .then((res) => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
