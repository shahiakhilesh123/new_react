import axios from 'axios';
import {GuestSession, iCollectionElement} from "../../types/internal";
import {iApiBasicResponse} from "../../types/api";
import BaseAPIs from "../base.apis";

export interface iChatSessionLocation {
    areaCode?: string
    cityName?: string
    countryCode?: string
    countryName?: string
    driver?: string
    ip?: string
    isoCode?: string
    latitude?: string
    longitude?: string
    metroCode?: string
    postalCode?: string
    regionCode?: string
    regionName?: string
    zipCode?: string
}

export interface iClientChatMessage extends iCollectionElement {
    id: number
    customer_id?: number
    user_id?: number
    session_id?: number
    from_guest?: string
    message?: string
    attachment_size?: number
    attachment_full_url?: string
    attachment_mime_type?: string,
    message_type?: undefined | "bot_message" | "email_user_form" | "end_chat" | "products",
    form_submitted?: boolean,
}

export interface iChatSession extends iCollectionElement {
    id: number
    customer_id: number
    user_id: number
    name: string
    email: string
    secret_key: string
    guest_unread_messages: number
    agent_unread_messages: number
    shop_name: string,
    last_message: iClientChatMessage,
    location?: iChatSessionLocation

}

export interface iSendMessage extends iApiBasicResponse {
    message_id: number
}

export interface iReadMessagesResponse extends iApiBasicResponse {
    messages: iClientChatMessage[]
}

export default class ChatApis extends BaseAPIs {
    getCustomerAvatarURL = (uid: string | undefined, updated_at: string | undefined) => {
        return this.getApiBaseURL() + `/assets/images/avatar/customer-${uid}.jpg?t=${updated_at}`;
    };
    update_form = async (values: any, chat_session: iChatSession): Promise<iApiBasicResponse> => {
        let fd = new FormData();
        fd.set("name", values.name);
        fd.set("email", values.email);
        fd.set("session_id", (chat_session && chat_session.id.toString()) || "");
        fd.set("secret_key", (chat_session && chat_session.secret_key.toString()) || "");
        return axios
            .post(this.getApiBaseURL() + "/_shopify/chat/sessions/update", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    end_chat = async (chat_session: iChatSession): Promise<iApiBasicResponse> => {
        let fd = new FormData();
        fd.set("session_id", (chat_session && chat_session.id.toString()) || "");
        fd.set("secret_key", (chat_session && chat_session.secret_key.toString()) || "");
        return axios
            .post(this.getApiBaseURL() + "/_shopify/chat/sessions/end_chat", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    no_end_chat = async (chat_session: iChatSession): Promise<iApiBasicResponse> => {
        let fd = new FormData();
        fd.set("session_id", (chat_session && chat_session.id.toString()) || "");
        fd.set("secret_key", (chat_session && chat_session.secret_key.toString()) || "");
        return axios
            .post(this.getApiBaseURL() + "/_shopify/chat/sessions/no_end_chat", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    get_session = async (client_id: string): Promise<GuestSession> => {
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
    end_session = async (chat_session: iChatSession, feedback_rating: number, feedback_message: string): Promise<iApiBasicResponse> => {
        let fd = new FormData();
        fd.set("session_id", (chat_session && chat_session.id.toString()) || "");
        fd.set("secret_key", (chat_session && chat_session.secret_key.toString()) || "");
        fd.set("feedback_rating", feedback_rating.toString() || "");
        fd.set("feedback_message", feedback_message.toString() || "");
        return axios
            .post(this.getApiBaseURL() + "/_shopify/chat/sessions/end", fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    read_messages = async (chat_session: iChatSession, last_message_id?: number,): Promise<iReadMessagesResponse> => {
        return axios
            .post(this.getApiBaseURL() + "/_shopify/chat/messages/read", {
                session_id: chat_session && chat_session.id,
                secret_key: chat_session && chat_session.secret_key,
                last_id: last_message_id
            }, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iReadMessagesResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    send_messages = async (message: string,
                           file: any,
                           chat_session: iChatSession, onUploadProgress?: (progressEvent: ProgressEvent) => void): Promise<iSendMessage> => {
        let fd = new FormData();

        fd.set("message", message);
        file && fd.set("attachment", file);
        fd.set("session_id", (chat_session && chat_session.id.toString()) || "");
        fd.set("secret_key", (chat_session && chat_session.secret_key) || "");
        return axios
            .post(this.getApiBaseURL() + "/_shopify/chat/messages/send", fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
                onUploadProgress: file && onUploadProgress
            })
            .then((res): iSendMessage => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
