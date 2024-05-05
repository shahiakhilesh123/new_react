import BaseAPIs from "./base.apis";
import {iApiBasicResponse, iBasicListingResponse, iListingQuery} from "../types/api";
import axios from "axios";
import {iCollectionElement} from "../types/internal";

export interface iNotification extends iCollectionElement {
    type?: string,
    title: string,
    message: string,
    level?: string,
    admin_id?: string,
    customer_id?: string,
    visibility?: string
}

export interface NotificationListResponse extends iApiBasicResponse {
    items?: iBasicListingResponse<iNotification>
    new_automations_count?: number
    new_popups_count?: number
}

export default class NotificationAPIs extends BaseAPIs {
    list = async (query: iListingQuery): Promise<NotificationListResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/notifications", {
                withCredentials: true,
                params: {
                    ...query,
                    ts: new Date().getTime()
                }
            })
            .then((res): NotificationListResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
