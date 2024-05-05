import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams, iListingQuery} from "../../types/api";
import {iPopup} from "../../types/internal/popup/popup";
import ResourceAPIs from "../resource.apis";
import BaseAPIs from "../base.apis";
import axios, {CancelTokenSource} from "axios";
import {iCollectionElement,} from "../../types/internal";
import {iEmailCampaignRecipientsResponse} from "../Email/email.campaigns.apis";

export interface iPopupListingResponse extends iApiBasicResponse {
    items?: iBasicListingResponse<iPopup>
}

export interface iPopupViewResponse extends iApiBasicResponse {
    popup?: iPopup
}

export interface iPopupCreateParams extends iBasicResourceCreationParams {
    data: string,
    title: string,
    popup_position: string,
    thumbnail_file: string
}

export interface iPopupLog extends iCollectionElement {
    email: string,
    extra_data: any[]
    first_name: string
    last_name: string
    popup_id: string,
    popup_title: string
}

export interface PopupLogBasicResponse extends iApiBasicResponse {
    items?: iBasicListingResponse<iPopupLog>,
    selected_popups?: Array<{
        label: string,
        value: number
    }>
}

export interface SearchResult extends iApiBasicResponse {
    results?: Array<{
        label: string,
        value: number
    }>
}


export interface iExplorePublicPopups extends iApiBasicResponse {
    public_popups:iBasicListingResponse<iPopup>
}

export default class PopupAPIs extends ResourceAPIs<iPopupCreateParams,
    iPopupListingResponse, iPopupViewResponse> {

    getResourceUpdateURL = (uid: string) => this.getResourceURL() + `/${uid}`;
    getResourceIdentifier = () => "/popups";


    popup_setting = async (uid: string, data: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        data["_token"] = csrfToken;
        data["_method"] = "PATCH";
        return axios
            .post(this.getApiBaseURL() + `/popups/${uid}/trigger`, data, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    copy_popup = async (popup_id: string, copy_name: string): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("copy_popup_name", copy_name);
        return axios
            .post(this.getResourceURL() + `/${popup_id}/copy`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    popup_logs = (query: iListingQuery, cancel_token: CancelTokenSource): Promise<PopupLogBasicResponse> => {

        return axios
            .get(this.getApiBaseURL() + `/popups/responses`, {
                headers: {"Content-Type": "application/json"},
                params: {
                    ...query,
                    ts: new Date().getTime()
                },
                withCredentials: true,
                cancelToken: cancel_token.token
            })
            .then((res): PopupLogBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

    mark_available_to_public = async (uid:string,data:any): Promise<any> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        return axios
            .post(this.getApiBaseURL() + `/popups/${uid}/update_public_flag`,
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
    popups_imported = async (): Promise<any> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        return axios
            .post(this.getApiBaseURL() + `/popups_imported`,
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
    load_public_popups= async (listingQuery: iListingQuery, cancel_token?: CancelTokenSource): Promise<iExplorePublicPopups> => {
        return axios
            .get(this.getApiBaseURL() + "/popups/public_popups",
                {
                    withCredentials: true,
                    params: {
                        ...listingQuery,
                        ts: new Date().getTime()
                    },
                    cancelToken: cancel_token && cancel_token.token,
                })
            // @ts-ignore
            .then((res): iExplorePublicPopups => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    search_popup_title = (search: string): Promise<SearchResult> => {
        return axios
            .get(this.getApiBaseURL() + "/popups/search", {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    search: search,
                    ts: new Date().getTime()
                },
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }

}
