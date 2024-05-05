import {iEmailAutomation} from "../../types/internal";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams, iListingQuery} from "../../types/api";
import ResourceAPIs, {ObjectFlatter} from "../resource.apis";
import axios, {CancelTokenSource} from "axios";
import {iEmailCampaignRecipientsResponse} from "./email.campaigns.apis";


export interface iEmailAutomationsListingResponse extends iApiBasicResponse {
    automations?: iBasicListingResponse<iEmailAutomation>
}

export interface iEmailAutomationViewResponse extends iApiBasicResponse {
    automation?: iEmailAutomation
}

export interface iDiscountCoupon {
    code?: string,
    discount?: string,
    label?: string
    id?: string
}


export interface iDiscountCouponResponse extends iApiBasicResponse {
    default_discounts?: {
        abandoned_cart_10: iDiscountCoupon
        abandoned_cart_20: iDiscountCoupon
        apology: iDiscountCoupon
        popup_discount_20: iDiscountCoupon
        review_with_no_image_10: iDiscountCoupon
        review_with_image_20: iDiscountCoupon
    }
}

export interface iExplorePublicAutomations extends iApiBasicResponse {
    public_automations:iBasicListingResponse<iEmailAutomation>
}

export interface iEmailAutomationCreateParams extends iBasicResourceCreationParams {
    name: string
    mail_list_uid: string
}

export interface AutomationCreationResponse extends iApiBasicResponse {
    url?: string,
    uid?: string,
    status?: string,
}

export default class EmailAutomationAPIs extends ResourceAPIs<iEmailAutomationCreateParams,
    iEmailAutomationsListingResponse, iEmailAutomationViewResponse> {
    getResourceIdentifier = () => "/automation2";
    getResourceCreationURL = () => this.getResourceURL() + "/create";
    getExternalEditorURL = (uid: string) => this.getResourceURL() + `/${uid}/edit`;

    create = async (creationParams: any): Promise<AutomationCreationResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter(creationParams);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceCreationURL(), fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    update_name = async (uid: string, values: any): Promise<AutomationCreationResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter(values);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getApiBaseURL() + "/automation2/" + uid + "/update", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    copy_automation = async (automation_id: string, copy_name: string): Promise<iEmailCampaignRecipientsResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("copy_automation_name", copy_name);
        return axios
            .post(this.getResourceURL() + `/${automation_id}/copy`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    delete = async (uids: Array<string>): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .delete<iApiBasicResponse>(this.getResourceDeletionURL(), {
                withCredentials: true,
                params: {
                    uids: uids.join(',')
                },
                data: {
                    _token: csrfToken
                }
            })
            // @ts-ignore
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    enable_disable = async (uids: Array<string>, is_enable: boolean): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};


        return axios
            .post(is_enable ? this.getResourceEnableURL() : this.getResourceDisableURL(),
                {_token: csrfToken, "_method": "PATCH"},
                {
                    withCredentials: true,
                    params: {
                        uids: uids.join(',')
                    }
                })
            // @ts-ignore
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    load_default_discount_coupons = async (): Promise<iDiscountCouponResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/default_automations/discount_coupons",
                {
                    withCredentials: true,
                    params: {
                        ts: new Date().getTime()
                    }
                })
            // @ts-ignore
            .then((res): iDiscountCouponResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    load_public_automations= async (listingQuery: iListingQuery, cancel_token?: CancelTokenSource): Promise<iExplorePublicAutomations> => {
        return axios
            .get(this.getApiBaseURL() + "/automation2/public_automations",
                {
                    withCredentials: true,
                    params: {
                        ...listingQuery,
                        ts: new Date().getTime()
                    },
                    cancelToken: cancel_token && cancel_token.token,
                })
            // @ts-ignore
            .then((res): iExplorePublicAutomations => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    skip_automations = async (): Promise<iDiscountCouponResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        return axios
            .post(this.getApiBaseURL() + "/default_automations/skip_automations",
                {_token: csrfToken},
                {
                    withCredentials: true,
                })
            // @ts-ignore
            .then((res): iDiscountCouponResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    automations_imported = async (): Promise<any> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        return axios
            .post(this.getApiBaseURL() + `/automations_imported`,
                {_token: csrfToken},
                {
                    withCredentials: true,
                })
            // @ts-ignore
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    mark_available_to_public = async (uid:string,data:any): Promise<any> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        return axios
            .post(this.getApiBaseURL() + `/automation2/${uid}/update_public_flag`,
                {_token: csrfToken,...data},
                {
                    withCredentials: true,
                })
            // @ts-ignore
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    default_automations_create_automations = async (values: any): Promise<iDiscountCouponResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        return axios
            .post(this.getApiBaseURL() + "/default_automations/create_automations",
                {_token: csrfToken, ...values},
                {
                    withCredentials: true,
                }
            )
            // @ts-ignore
            .then((res): iDiscountCouponResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    default_discount_coupons = async (values: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};


        return axios
            .post(this.getResourceIdentifier() + "/default_discount_coupons",
                {_token: csrfToken, ...values},

                {
                    withCredentials: true,
                }
            )
            // @ts-ignore
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
