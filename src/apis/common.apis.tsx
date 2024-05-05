import React from "react";
import BaseAPIs from "./base.apis";
import axios, {CancelTokenSource} from "axios";
import {iApiBasicResponse} from "../types/api";
import {iEmailAutomation} from "../types/internal";
import {iEmailCampaign} from "../types/internal/email/campaign";
import {iEmailMailingList} from "../types/internal/email/mailinglist";
import {iEmailSegment} from "./Email/email.segmentation";
import {iShopifyReview} from "./review.apis";
import {iChatSession, iSendMessage} from "./ChatGuest/chat.client";
import {ObjectFlatter} from "./resource.apis";

export interface SearchResponse extends iApiBasicResponse {
    automations?: iEmailAutomation[],
    campaigns?: iEmailCampaign[],
    mail_lists?: iEmailMailingList[],
    segments?: iEmailSegment[],
}

export interface iReviewResponse extends iApiBasicResponse {
    review?: iShopifyReview
}

export default class CommonApis extends BaseAPIs {
    search = async (keyword: string | undefined, source: CancelTokenSource): Promise<SearchResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/global_search", {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                cancelToken: source.token,
                params: {
                    search: keyword,
                    ts: new Date().getTime()
                }
            })
            .then((res): SearchResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    get_review = async (uid: string, secret_key: string): Promise<iApiBasicResponse> => {

        return axios
            .get(this.getApiBaseURL() + `/_shopify/review/${uid}/${secret_key}`, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    update_review = async (uid: string, secret_key: string,values:any,onUploadProgress?: (progressEvent: ProgressEvent) => void): Promise<iReviewResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
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
        fd.set(`_token`, csrfToken);
        return axios
            .post(this.getApiBaseURL() + `/_shopify/review/${uid}/${secret_key}`, fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
                onUploadProgress: values.images && values.images.length>0 && onUploadProgress
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
