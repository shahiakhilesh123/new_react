import BaseAPIs from "../base.apis";
import {GuestSession} from "../../types/internal";
import axios from "axios";

export default class SignatureApis extends BaseAPIs {
    get_signature = async (client_id: string): Promise<GuestSession> => {
        return axios
            .get(this.getApiBaseURL() + "/_shopify/chat/sessions/get_or_create", {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    client_uid: client_id,
                    ts: new Date().getTime()

                }
            })
            .then((res): GuestSession => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
