import axios, {CancelTokenSource} from 'axios';
import BaseAPIs from "./base.apis";
import {iChatCannedResponse, iChatMessage, iChatSession, iChatSettings, iCannedResponse, iCustomerOrders, iShopProducts} from "../types/internal";
import {iApiBasicResponse, iBasicListingResponse, iListingQuery} from "../types/api";
import {ObjectFlatter} from "./resource.apis";


export interface iSessionsResponse extends iApiBasicResponse {
    sessions?: iBasicListingResponse<iChatSession>
}

export interface iChatMessagesResponse extends iApiBasicResponse {
    messages?: iChatMessage[]
}

export interface iChatSettingsResponse extends iApiBasicResponse {
    chat_settings?: iChatSettings
}


export interface iAttachment {
    attachment_full_url: string
    attachment_mime_type: string
    attachment_path: string
    attachment_size: string
    created_at: string
    customer_id: string
    from_guest: string
    id: number
    message: string
    session_id: string
    updated_at: string
    user_id: string
}
export interface iDashboardChatSummaryResponse extends iApiBasicResponse {
    chat_summary:{
        chats: number
        chats_change_last_24: number
        chats_last_24_hours: number
        chats_last_48_to_24_hours: number
        missed: number
        missed_change_last_24: number
        missed_last_24_hours: number
        missed_last_48_to_24_hours: number
        sales_total: number
        sales_total_change_last_24: number
        sales_total_last_24_hours: number
        sales_total_last_48_to_24_hours: number
    }
}
export interface AttachmentListResponse extends iApiBasicResponse {
    attachments: iBasicListingResponse<iAttachment>
}

export interface iSendMessage extends iApiBasicResponse {
    chat_message?: iChatMessage
}

export default class ChatAPIs extends BaseAPIs {
    getResourceDeletionURL = () => this.getApiBaseURL() + "/chatCanned/delete";
    settings = async (): Promise<iChatSettingsResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/chat/settings", {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iSessionsResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    store_settings = async (settings: any): Promise<iChatSettingsResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter(settings);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        fd.set("bot_image_file", settings.bot_image_file)
        return axios
            .post(this.getApiBaseURL() + "/chat/settings", fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iSessionsResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    chat_summary = async ( cancel_token?: CancelTokenSource): Promise<iDashboardChatSummaryResponse> => {

        return axios
            .get(this.getApiBaseURL()+"/chat/summary", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                },
                cancelToken: cancel_token && cancel_token.token,
            })
            .then((res): iDashboardChatSummaryResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    engaged_sessions = async (query: iListingQuery, source?: CancelTokenSource): Promise<iSessionsResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/chat/sessions", {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime(),
                    ...query
                },
                cancelToken: source && source.token
            })
            .then((res): iSessionsResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    active_sessions = async (query: iListingQuery, source?: CancelTokenSource): Promise<iSessionsResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/chat/liveSessions", {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime(),
                    ...query
                },
                cancelToken: source && source.token
            })
            .then((res): iSessionsResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    get_attachments = async (id: number, source: CancelTokenSource): Promise<AttachmentListResponse> => {
        return axios
            .get(this.getApiBaseURL() + `/chat/sessions/${id}/attachments`, {
                withCredentials: true,
                cancelToken: source.token,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): AttachmentListResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    messages = async (session: iChatSession, last_id?: string): Promise<iChatMessagesResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/chat/messages/list", {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    session_id: session.id,
                    last_id: last_id,
                    ts: new Date().getTime()
                }
            })
            .then((res): iChatMessagesResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })

    }

    send_message = async (session: iChatSession,
                          message: string,
                          file: any,
                          onUploadProgress?: (progressEvent: ProgressEvent) => void): Promise<iSendMessage> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("session_id", session.id + '');
        fd.set("message", message);
        file && fd.set("attachment", file);
        return axios
            .post(this.getApiBaseURL() + "/chat/messages/store", fd, {
                withCredentials: true,
                onUploadProgress: file && onUploadProgress
            })
            .then((res): iSendMessage => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    send_products = async (session: iChatSession, products: string): Promise<iSendMessage> => {
            let csrfToken: string = await new BaseAPIs().getCsrfToken();
            if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
            let fd = new FormData();
            fd.set("_token", csrfToken);
            fd.set("session_id", session.id + '');
            fd.set("message_type", "products");
            fd.set("products", products);
            return axios
            .post(this.getApiBaseURL() + "/chat/messages/store", fd, {
                withCredentials: true
            })
            .then((res): iSendMessage => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
        };
    send_message_end_conversation = async (message: string, session: iChatSession): Promise<iSendMessage> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("session_id", session.id.toString());
        fd.set("message_type", 'end_chat');
        fd.set("message", message);
        return axios
            .post(this.getApiBaseURL() + "/chat/messages/store", fd, {
                withCredentials: true,
            })
            .then((res): iSendMessage => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    update_session_detail = async (session_id: number, values: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        values["_token"] = csrfToken;
        values["_method"] = "PATCH";
        return axios
            .post(this.getApiBaseURL() + "/chat/sessions/" + session_id, values, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    get_canned_list = async (listingQuery: any, source?: CancelTokenSource): Promise<iChatCannedResponse> => {

        return axios
            .get(this.getApiBaseURL() + "/chatCanned/list", {
                withCredentials: true,
                params: {
                    ...listingQuery,
                    ts: new Date().getTime()
                },
                cancelToken: source && source.token
            })
            .then((res): iChatCannedResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    addCanned = async (canned: any): Promise<iCannedResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.append('message',canned.message)
        fd.append('name',canned.name)
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/chatCanned/add", fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iCannedResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    editCanned = async (canned: any): Promise<iCannedResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.append('message',canned.message)
        fd.append('name',canned.name)
        fd.append('id',canned.id)
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/chatCanned/edit", fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iCannedResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    get_customer_orders = async (ordersQuery: any, source?: CancelTokenSource): Promise<iCustomerOrders> => {
        return axios

            .get(this.getApiBaseURL() + "/_shopify/orders", {
                withCredentials: true,
                params: {
                    ...ordersQuery
                },
                cancelToken: source && source.token
            })
            .then((res): iCustomerOrders => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    get_products = async (productsQuery: any): Promise<iShopProducts> => {
        return axios
            .get(this.getApiBaseURL() + "/_shopify/products", {
                withCredentials: true,
                params: {
                    ...productsQuery
                }
            })
            .then((res): iShopProducts => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

}
