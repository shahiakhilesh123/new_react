import {iShopifyReview} from "../../types/internal";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams, iListingQuery} from "../../types/api";
import ResourceAPIs, {ObjectFlatter} from "../resource.apis";
import BaseAPIs from "../base.apis";
import axios, {CancelTokenSource} from "axios";


export interface iShopifyReviewListingResponse extends iApiBasicResponse {
    items?: iBasicListingResponse<iShopifyReview>
}

export interface iShopifyProduct extends iApiBasicResponse {
    created_at: string
    review_fetch_complete: boolean
    shop_id: string
    reviews_count: string
    shopify_id: string
    shopify_title: string
    submitted_for_review: boolean
}

export interface iProductReviewListingResponse extends iApiBasicResponse, iBasicListingResponse<iShopifyProduct> {

}

export interface iShopifyReviewViewResponse extends iApiBasicResponse {
    review?: iShopifyReview
}


export interface iShopifyReviewCreationParams extends iBasicResourceCreationParams {
    shop_name: string
    stars: number
    product_id: string
    reviewer_email: string
    reviewer_name: string
    title: string
    message: string
    verified_purchase: string
    approved: string
}

export interface iShopifyProductListResponse extends iApiBasicResponse {
    products?: Array<{
        label: string,
        value: number
    }>
}

export default class ShopifyReviewsAPIs extends ResourceAPIs<iShopifyReviewCreationParams,
    iShopifyReviewListingResponse,
    iShopifyReviewViewResponse> {
    getResourceIdentifier = () => "/shopify_reviews";
    getResourceUpdateURL = (uid: string) => this.getResourceURL() + `/${uid}`;
    getResourceApproveURL = () => this.getResourceURL() + "/approve?action=approve";
    getResourceDisApproveURL = () => this.getResourceURL() + "/approve?action=disapprove";
    getResourceVerifiedURL = () => this.getResourceURL() + "/verify?action=verify";
    getResourceUnVerifiedURL = () => this.getResourceURL() + "/verify?action=un-verify";

    create_review = async (data: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();

        let flattenedParams = new ObjectFlatter(data);
        flattenedParams.get_form_data().forEach(entry => {

            fd.set(entry.key, entry.value);
        });
        fd.delete("images");
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                fd.set(`images[${i}]`, data.images[i]);
            }
        }


        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + `/shopify_reviews`, fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    update_review = async (uid: string, data: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();

        let flattenedParams = new ObjectFlatter(data);
        flattenedParams.get_form_data().forEach(entry => {

            fd.set(entry.key, entry.value);
        });
        fd.delete("images");
        if (data.images && data.images.length > 0) {
            for (let i = 0; i < data.images.length; i++) {
                fd.set(`images[${i}]`, data.images[i]);
            }
        }

        fd.set("_token", csrfToken);

        fd.set("_method", "PATCH");
        return axios
            .post(this.getApiBaseURL() + `/shopify_reviews/` + uid, fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    view_review = async (id: number): Promise<iShopifyReviewViewResponse> => {
        return axios
            .get(this.getApiBaseURL() + `/shopify_reviews/` + id, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    list_products_select = async (keyword: string): Promise<iShopifyProductListResponse> => {
        return axios
            .get(this.getApiBaseURL() + `/shopify_data/products_select`, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime(),
                    keyword: keyword
                }
            })
            .then((res): iShopifyProductListResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    list_products = async (query: iListingQuery, source?: CancelTokenSource): Promise<iProductReviewListingResponse> => {
        return axios
            .get(this.getApiBaseURL() + `/shopify_reviews/products`, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime(),
                    ...query
                },
                cancelToken: source && source.token
            })
            .then((res): iProductReviewListingResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    shopify_reviews_refetch = async (): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();

        fd.set("_token", csrfToken);
        return axios
            .post(this.getApiBaseURL() + `/shopify_reviews/refetch`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
}
