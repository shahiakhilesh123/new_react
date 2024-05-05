import BaseAPIs from "./base.apis";
import axios from 'axios';
import {iCollectionElement, iCollectionElement2} from "../types/internal";
import {iApiBasicResponse, iBasicListingResponse, iListingQuery} from "../types/api";
import {ObjectFlatter} from "./resource.apis";
import {iChatSettingsResponse, iSessionsResponse} from "./chat.apis";
import {iShopifyProduct} from "./Reviews/shopify.reviews.apis";


export interface ReviewStats extends iApiBasicResponse {
    average_score: number
    stars_1: number
    stars_2: number
    stars_3: number
    stars_4: number
    stars_5: number
    total_reviews: number
}


export interface ImageObject extends iCollectionElement2 {
    full_path?: string,

    [key: string]: any
}

export interface iTheme {
    add_to_cart_btn_color: string
    add_to_cart_btn_text_color: string
    buy_now_btn_color: string
    buy_now_btn_text_color: string
    theme_font_family: string
}

export interface iShopifyReview extends iCollectionElement {
    customer_id: string
    shop?: string
    shop_id: string
    subscriber_id?: string | null
    shop_name: string
    shopify_product_id: string
    product_title: string
    stars: number | string
    reviewer_email: string
    reviewer_name: string
    title: string
    message: string
    ip_address: string
    verified_purchase?: string | boolean
    approved?: string | boolean,
    active?: string,
    product?: iShopifyProduct | null,
    images?: ImageObject[]

}

export interface ReviewBasicListResponse extends iApiBasicResponse {
    items: iBasicListingResponse<iShopifyReview>,
    product_id?: string,
    shop_name?: string,
    theme?: iTheme
}

export interface iReviewSettings {
    font_family: string
    secondary_font_family: string
    primary_background_color: string
    primary_text_color: string
    secondary_background_color: string
    secondary_text_color: string
    active_star_color: string
    inactive_star_color: string
    separator_color: string
    star_size: number
    star_size_units: string
}

export interface iReviewSettingsResponse extends iApiBasicResponse {
    review_settings?: iReviewSettings
}


export default class ReviewApis extends BaseAPIs {

    settings = async (): Promise<iReviewSettingsResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/review/settings", {
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
       
        return axios
            .post(this.getApiBaseURL() + "/review/settings", fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iSessionsResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    get_summary = async (client_uid: string, product_id: string, shop_name: string): Promise<ReviewStats> => {
        return axios
            .get(this.getApiBaseURL() + "/_shopify/reviewStats", {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    client_uid: client_uid,
                    product_id: product_id,
                    shop_name: shop_name,
                    ts: new Date().getTime()
                }
            })
            .then((res: any) => ({statusCode: res.status, ...res.data}))
            .catch((error: any) => {
                return this.handleCatch(error);
            })
    }

    get_all_reviews = async (client_uid: string, query: iListingQuery): Promise<ReviewBasicListResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/_shopify/embedAllShopifyReviews", {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ...query,
                    client_uid: client_uid,
                    ts: new Date().getTime()
                }
            })
            .then((res: any) => ({statusCode: res.status, ...res.data}))
            .catch((error: any) => {
                return this.handleCatch(error);
            })
    }

    embedShopifyReviews = async (client_uid: string, product_id: string, shop_name: string, query: iListingQuery): Promise<ReviewBasicListResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/_shopify/embedShopifyReviews", {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ...query,
                    client_uid: client_uid,
                    product_id: product_id,
                    shop_name: shop_name,
                    ts: new Date().getTime()
                }
            })
            .then((res: any) => ({statusCode: res.status, ...res.data}))
            .catch((error: any) => {
                return this.handleCatch(error);
            })
    }
    storeFromReviewer = async (values: any, onUploadProgress?: (progressEvent: ProgressEvent) => void): Promise<ReviewBasicListResponse> => {
        let fd = new FormData();
        let flattenedParams = new ObjectFlatter(values);
        flattenedParams.get_form_data().forEach(entry => {

            fd.set(entry.key, entry.value);
        });
        fd.delete("images");
        if (values.images && values.images.length > 0) {
            for (let i = 0; i < values.images.length; i++) {
                fd.set(`images[${i}]`, values.images[i]);
            }
        }
        return axios
            .post(this.getApiBaseURL() + "/_shopify/storeFromReviewer", fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
                onUploadProgress: onUploadProgress
            })
            .then((res: any) => ({statusCode: res.status, ...res.data}))
            .catch((error: any) => {
                return this.handleCatch(error);
            })
    }
}
