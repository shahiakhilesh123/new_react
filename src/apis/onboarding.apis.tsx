import axios from 'axios';
import BaseAPIs from "./base.apis";
import {iApiBasicResponse, iPlan, iShopDetails} from "../types/api";
import {iShopifyShop} from "../types/internal";
import { platform } from 'os';

export interface iRegisterFormResponse extends iApiBasicResponse {
    shop?: iShopifyShop
}

export interface iStepOneResponse extends iApiBasicResponse {
    store?: iShopDetails
    plans?: iPlan[]
    currencies?: string[]
}

export interface iCouponResponse extends iApiBasicResponse {
    plan?: iPlan[],
}

export interface paypalApprovalUrl extends iApiBasicResponse {
    approval_url?: string
}
export interface iWooCommerce extends iApiBasicResponse {
    plans?: iPlan[]
    currencies?: string[]
}
export interface iChangePlanResponse extends iApiBasicResponse {
    redirectURL?: string
}
export type tStorePlatform = {
    [key: string]: any
}

export const storePlatform = {
    currency: "",
    email: "",
    myshopify_domain: "",
    shop_owner_email: "",
    name: "",
    owner_first_name: "",
    owner_last_name: "",
    password: "",
    password_required: false,
    primary_domain: "",
    selected_plan_id: 0,
    selected_plan_price: 0,

    font_family: "Open Sans",
    primary_background_color: "#000000ff",
    primary_text_color: "#ffffffff",
    secondary_background_color: "#ffffffff",
    secondary_text_color: "#000000ff",

    logo_path: "",
    full_name: "",
    phone: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    skype: "",
    website: "",
    designation: "",
    logo: "",
    api_key: "",
    api_secret: "",
    isShopify: true,
    platform: "woocommerce",

    coupon: ""
}
export default class OnBoardingApis extends BaseAPIs {


    forgot_password = async (email: string): Promise<iRegisterFormResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        return axios
            .post(this.getApiBaseURL() + "/password/email", {
                email: email,
                _token: csrfToken
            }, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iRegisterFormResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    reset_password = async (values: any): Promise<iRegisterFormResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        values["_token"] = csrfToken;
        return axios
            .post(this.getApiBaseURL() + "/password/reset", values, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iRegisterFormResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    change_plan = async (myshopify_domain: string, selected_plan_id: number): Promise<iChangePlanResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("myshopify_domain", myshopify_domain);
        fd.set("selected_plan_id", selected_plan_id.toString());
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/onboarding/change_plan", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    register_form = async (domain: string, platform: string, api_key: string, api_secret: string, email: string): Promise<iRegisterFormResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("myshopify_domain", domain);
        fd.set("platform", platform);
        fd.set("api_key", api_key);
        fd.set("api_secret", api_secret);
        fd.set("email", email);
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/onboarding/register_form", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iRegisterFormResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                console.log(error)
                return this.handleCatch(error);
            })
    };
    re_authorize = async (myshopify_domain: string): Promise<iRegisterFormResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("myshopify_domain", myshopify_domain);
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/onboarding/re_authorize", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iRegisterFormResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    users_aff = async (af_id: string): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("af_id", af_id);
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/users/aff", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    step_one = async (platform: string, state: string, code: string, hmac: string, shop: string, timestamp: string, api_key: string, api_secret: string, secret: string, email: string): Promise<iStepOneResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("platform", platform);
        fd.set("api_key", api_key);
        fd.set("api_secret", api_secret);
        fd.set("secret", secret);
        fd.set("email", email);
        fd.set("state", state);
        fd.set("code", code);
        fd.set("hmac", hmac);
        fd.set("shop", shop);
        fd.set("timestamp", timestamp);
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/onboarding/step_one", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iStepOneResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    use_coupon = async (coupon: string): Promise<iCouponResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("coupon", coupon);
        return axios
            .post(this.getApiBaseURL() + "/onboarding/coupon", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iPlan => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })

    };

    onboarding_abort = async (shop_id: string): Promise<iStepOneResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();

        fd.set("_token", csrfToken);
        fd.set("shop", shop_id);
        return axios
            .post(this.getApiBaseURL() + "/onboarding/abort", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iStepOneResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    onboarding_settings = async (): Promise<iWooCommerce> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/_woocommerce/onboarding_settings", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iWooCommerce => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    complete_plan = async (charge_id: string, shop: string): Promise<iStepOneResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("shop", shop);
        fd.set("charge_id", charge_id);
        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + "/onboarding/complete_plan", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iStepOneResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    select_plan = async (store: iShopDetails): Promise<iStepOneResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("name", store.name || "");
        fd.set("primary_domain", store.primary_domain || "");
        fd.set("myshopify_domain", store.myshopify_domain || "");
        fd.set("font_family", store.font_family || "");
        fd.set("primary_background_color", store.primary_background_color || "");
        fd.set("primary_text_color", store.primary_text_color || "");
        fd.set("secondary_background_color", store.secondary_background_color || "");
        fd.set("secondary_text_color", store.secondary_text_color || "");
        fd.set("password", store.password || "");
        fd.set("owner_first_name", store.owner_first_name || "");
        fd.set("owner_last_name", store.owner_last_name || "");
        fd.set("currency", store.currency || "");
        fd.set("platform", store.platform || "shopify");
        fd.set("api_key", store.api_key || "");
        fd.set("api_secret", store.api_secret || "");
        fd.set("email", store.email || "");


        fd.set("phone", store.phone || "");
        fd.set("logo", store.logo || "");
        fd.set("facebook", store.facebook || "");
        fd.set("instagram", store.instagram || "");
        fd.set("linkedin", store.linkedin || "");
        fd.set("skype", store.skype || "");
        fd.set("twitter", store.twitter || "");
        fd.set("full_name", store.full_name || "");
        fd.set("designation", store.designation || "");
        fd.set("website", store.website || "");


        fd.set("selected_plan_id", store.selected_plan_id + '');
        fd.set("coupon", store.coupon || "");
        return axios
            .post(this.getApiBaseURL() + "/onboarding/select_plan", fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iStepOneResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    paypal_approval_url = async (plan_id: string): Promise<paypalApprovalUrl> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken()
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}}
        return axios
            .get(this.getApiBaseURL() + "/_paypal/approval-url/" + plan_id)
            .then((res): paypalApprovalUrl => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error)
            })
    };
}
