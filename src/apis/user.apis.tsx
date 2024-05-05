import axios from 'axios';
import BaseAPIs from "./base.apis";
import {iChatSession, iCollectionElement, iContact, iShopifyReview, iShopifyShop, iUser} from "../types/internal";
import {iApiBasicResponse, iBasicListingResponse, iListingQuery, iPlan} from "../types/api";
import {iEmailCampaign} from "../types/internal/email/campaign";
import {ObjectFlatter} from "./resource.apis";
import {removeToken} from "../push-notification";


export interface iUserLoginResponse extends iApiBasicResponse {
    authenticated?: boolean
}

export interface iFetchUserResponse extends iApiBasicResponse {
    user?: iUser,
    plans?: iPlan[],
    shops?: iShopifyShop[]
    redirectURL?: string
}

export interface iSignature extends iCollectionElement {

    designation: string
    full_name: string
    logo_url: string
    logo: string
    phone: string
    skype: string
    website: string
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
}

export interface iFetchContactResponse extends iApiBasicResponse {
    contact?: iContact
}

export interface iProfileUpdateParams {
    image?: any
    _remove_image?: string
    first_name: string
    last_name: string
    timezone: string
    language_id?: string
    color_scheme?: string
    email: string
    password: string
    password_confirmation: string
}

export interface iContactUpdateParams {
    first_name: string
    last_name: string
    email: string
    address_1: string
    city: string
    zip: string
    url: string
    country_id: string
    company: string
    phone: string
    address_2: string
    state: string
    tax_number: string
    billing_address: string
}

export interface AnalyticsData {
    total_price: string,
    date: string
}

export interface iSubscriberGraphData {
    number_of_subscribers: string,
    date: string
}

export interface iReviewGraphData {
    number_of_reviews: string,
    date: string
}

export interface DashboardHomeResponse extends iApiBasicResponse {
    recent_chats: iChatSession[],
    recent_reviews: iShopifyReview[],
}

export interface iDashboardReportResponse extends iApiBasicResponse {
    revenue_report: iRevenueReport,
    subscribers: {
        items: iSubscriberGraphData[],
        total_subscriber: number
    },
    reviews: {
        items: iReviewGraphData[],
        total_reviews: number
        total_reviews_within_timeframe: number
    },
    emails?: EmailStats
    shopify_orders: iAnalyticsDataWrapper
    emailwish_shopify_orders: iAnalyticsDataWrapper
    sales_breakdown?: SalesChannels
}
export interface iDashboardPopupSummaryResponse extends iApiBasicResponse {
    popup_summary:{
        impressions: number
        impressions_change_last_24: number
        impressions_last_24_hours: number
        impressions_last_48_to_24_hours: number
        number_of_sales: number
        number_of_sales_48_to_24_hours: number
        number_of_sales_change_last_24: number
        number_of_sales_last_24_hours: number
        responses: number
        responses_change_last_24: number
        responses_last_24_hours: number
        responses_last_48_to_24_hours: number
        sales_total: number
        sales_total_change_last_24: number
        sales_total_last_24_hours: number
        sales_total_last_48_to_24_hours: number
    }
}

export interface iRevenueReport {
    cost_change_last_24: number
    cost_last_24_hours: number
    cost_last_48_to_24_hours: number
    cost_total: number
    count_change_last_24: number
    count_last_24_hours: number
    count_last_48_to_24_hours: number
    count_total: number
    revenue_change_last_24: number
    revenue_last_24_hours: number
    revenue_last_48_to_24_hours: number
    revenue_total: number
    roi_change_last_24: number
    roi_last_24_hours: number
    roi_last_48_to_24_hours: number
    roi_total: number
}

export interface iAnalyticsDataWrapper {
    total_sales: number,
    total_orders: number,
    items: AnalyticsData[]
}

export interface iDashboardHomeAnalytics extends iApiBasicResponse {
    shopify_orders: iAnalyticsDataWrapper
    emailwish_shopify_orders: iAnalyticsDataWrapper
}

export interface ModuleSettings extends iApiBasicResponse {
    chat_module_enabled?: boolean
    popup_module_enabled?: boolean
    review_module_enabled?: boolean
}

export interface PopupSettings extends iApiBasicResponse {
    popup_module_enabled?: boolean
}

export interface ReviewSettings extends iApiBasicResponse {
    review_module_enabled?: boolean
}

export interface ChatSettings extends iApiBasicResponse {
    chat_module_enabled?: boolean
}

export interface SalesChannels {
    number_of_sales:number
    number_of_sales_from_chats: number
    number_of_sales_from_emails: number
    number_of_sales_from_emailwish: number
    number_of_sales_from_popups: number
    sales_total: number
    sales_total_from_chats: number
    sales_total_from_emails: number
    sales_total_from_emailwish: number
    sales_total_from_popups:number
}

export interface SalesBreakDownResponse extends iApiBasicResponse {
    campaigns: iBasicListingResponse<iEmailCampaign>,
    sales_channels?: SalesChannels
}

export interface EmailStats extends iApiBasicResponse {
    clicked_email: number
    delivered_email: number
    opened_email: number
    total_emails: number
}

export interface EmailStatsResponse extends iApiBasicResponse {
    emails?: EmailStats
}

export interface iSignatureResponse extends iApiBasicResponse {
    signature?: iSignature
}

export interface iSubscriberGraphResponse extends iApiBasicResponse {
    subscriber: {
        items: iSubscriberGraphData[],
        total_subscriber: number
    }
}

export interface iReviewStatsResponse extends iApiBasicResponse {
    reviews: {
        items: iReviewGraphData[],
        total_reviews: number
        total_reviews_within_timeframe: number
    }
}

export interface iPermission extends iApiBasicResponse {
    unsubscribe_required: boolean,
    access_offline: boolean,
    import: boolean,
    export: boolean,
    hide_branding: boolean,
    api: boolean
}

export default class UserAPIs extends BaseAPIs {


    fcm_token = async (token: string): Promise<iUserLoginResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("token", token);
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/fcm_token", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iUserLoginResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    login = async (email: string, password: string): Promise<iUserLoginResponse> => {
        removeToken().then();
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("email", email);
        fd.set("password", password);
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/login", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iUserLoginResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    popup_module_status = async (enabled: boolean): Promise<PopupSettings> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("action", enabled ? "install" : "uninstall");
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/popup_module_status", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): PopupSettings => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    review_module_status = async (enabled: boolean): Promise<ReviewSettings> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("action", enabled ? "install" : "uninstall");
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/review_module_status", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iUserLoginResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    chat_module_status = async (enabled: boolean): Promise<ChatSettings> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("action", enabled ? "install" : "uninstall");
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/chat_module_status", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): ChatSettings => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    logout = async (): Promise<iApiBasicResponse> => {
        removeToken().then();
        return axios
            .get(this.getApiBaseURL() + "/logout", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    modules_status = async (): Promise<ModuleSettings> => {
        return axios
            .get(this.getApiBaseURL() + "/modules_status", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): ModuleSettings => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    fetch_user = async (): Promise<iFetchUserResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/current_user", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iFetchUserResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    fetch_user_signature = async (): Promise<iSignatureResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/signature", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iSignatureResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    update_user_signature = async (values: any): Promise<iSignatureResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        let flattenedParams = new ObjectFlatter(values);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        fd.delete("logo");
        fd.set("logo", values.logo);

        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/signature", fd, {
                withCredentials: true,
            })
            .then((res): iSignatureResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    fetch_contact = async (): Promise<iFetchContactResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/account/contact", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iFetchContactResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    update_profile = async (updateParams: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("first_name", updateParams.first_name);
        fd.set("last_name", updateParams.last_name);
        fd.set("timezone", updateParams.timezone);
        fd.set("email", updateParams.email);
        fd.set("image", updateParams.image);
        fd.set("password", updateParams.password);
        fd.set("password_confirmation", updateParams.password_confirmation);
        fd.set("language_id", "1");
        fd.set("color_scheme", "blue");
        if (updateParams._remove_image) {
            fd.set("_remove_image", "true");
        }
        return axios
            .post(this.getApiBaseURL() + "/account/profile", fd, {
                withCredentials: true,
                headers: {"Content-Type": "multipart/form-data"},
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    update_contact = async (updateParams: iContactUpdateParams): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("first_name", updateParams.first_name);
        fd.set("last_name", updateParams.last_name);
        fd.set("email", updateParams.email);
        fd.set("address_1", updateParams.address_1);
        fd.set("address_2", updateParams.address_2);
        fd.set("city", updateParams.city);
        fd.set("state", updateParams.state);
        fd.set("zip", updateParams.zip);
        fd.set("url", updateParams.url);
        fd.set("country_id", updateParams.country_id);
        fd.set("company", updateParams.company);
        fd.set("phone", updateParams.phone);
        fd.set("tax_number", updateParams.tax_number);
        fd.set("billing_address", updateParams.billing_address);
        return axios
            .post(this.getApiBaseURL() + "/account/contact", fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    fetch_online_users = async (): Promise<any> => {
        let data = {
            is_typing: 0
        };
        return axios
            .post(this.getApiBaseURL() + "/users/update_user_activity", data, {
                withCredentials: true
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((): any => ({statusCode: 999, errors: {network: "Network error!"}}))
    };

    fetch_chat = async (chat_request_id: any): Promise<any> => {
        return axios
            .get(this.getApiBaseURL() + "/message/get_messages/" + chat_request_id + "", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ([...res.data]))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    send_message = async (data: any): Promise<any> => {
        // let data = {
        //     chat_request_id: 0
        // };
        return axios
            .post(this.getApiBaseURL() + "/message/send_message", data, {
                withCredentials: true
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    home_dashboard = async (): Promise<DashboardHomeResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/home_dashboard", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    report = async (start_date: string, end_date: string): Promise<iDashboardReportResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/reports", {
                withCredentials: true,
                params: {
                    start_date: start_date,
                    end_date: end_date,
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    sales_breakdown = async (query: iListingQuery): Promise<SalesBreakDownResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/sales_breakdown", {
                withCredentials: true,
                params: {
                    ...query,
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    daily_order_report = async (start_date: string, end_date: string): Promise<iDashboardHomeAnalytics> => {
        return axios
            .get(this.getApiBaseURL() + "/daily_order_report", {
                withCredentials: true,
                params: {
                    start_date: start_date,
                    end_date: end_date,
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    daily_subscriber_report = async (start_date: string, end_date: string): Promise<iSubscriberGraphResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/daily_subscriber_report", {
                withCredentials: true,
                params: {
                    start_date: start_date,
                    end_date: end_date,
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    daily_review_report = async (start_date: string, end_date: string): Promise<iReviewStatsResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/daily_review_report", {
                withCredentials: true,
                params: {
                    start_date: start_date,
                    end_date: end_date,
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    daily_email_report = async (start_date: string, end_date: string): Promise<SalesBreakDownResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/daily_email_report", {
                withCredentials: true,
                params: {
                    start_date: start_date,
                    end_date: end_date,
                    ts: new Date().getTime()
                }
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    permission = async (): Promise<iPermission> => {
        return axios
            .get(this.getApiBaseURL() + "/account/permission", {
                withCredentials: true,
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
