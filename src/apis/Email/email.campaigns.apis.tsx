import {
    iEmailCampaign,
    iEmailCampaignConfirm,
    iEmailCampaignListSegmentOption,
    iEmailCampaignOverview,
    iEmailCampaignRecipient
} from "../../types/internal/email/campaign";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams, iListingQuery} from "../../types/api";
import ResourceAPIs, {ObjectFlatter} from "../resource.apis";
import axios, {CancelTokenSource} from "axios";


export interface EmailCampaignListResponse extends iApiBasicResponse {
    campaigns?: iBasicListingResponse<iEmailCampaign>
}

export interface iEmailCampaignViewResponse extends iApiBasicResponse {
    campaign?: iEmailCampaign
}

export interface iEmailCampaignCreateParams extends iBasicResourceCreationParams {
    type: "regular" | "plain-text"
}

export interface iEmailCampaignRecipientsResponse extends iApiBasicResponse {
    campaign?: iEmailCampaign,
    recipients?: iEmailCampaignRecipient[]
    list_segment2_select_options?: iEmailCampaignListSegmentOption[]
}

export interface iEmailCampaignSetupResponse extends iApiBasicResponse {
    campaign?: iEmailCampaign
}

export interface iEmailCampaignScheduleResponse extends iApiBasicResponse {
    campaign?: iEmailCampaign
    schedule?: iEmailCampaignScheduleParams
    confirm?: iEmailCampaignConfirm
}

export interface iEmailCampaignTemplateResponse extends iApiBasicResponse {
    campaign?: iEmailCampaign
    thumb_url?: string
}

export interface iEmailCampaignConfirmResponse extends iApiBasicResponse {
    campaign?: iEmailCampaign
    confirm?: iEmailCampaignConfirm
}

export interface iEmailCampaignAttachment {
    name: string,
    size: string
}

export interface iEmailCampaignAttachmentResponse extends iApiBasicResponse {
    attachments?: iEmailCampaignAttachment[]
}

export interface iEmailCampaignOverviewResponse extends iApiBasicResponse {
    campaign?: iEmailCampaign
    overview?: iEmailCampaignOverview
}

export interface iEmailCampaignSetupParams extends iBasicResourceCreationParams {
    name: string
    subject: string
    from_name: string
    from_email: string
    use_default_sending_server_from_email: string
    reply_to: string
    track_open: string
    track_click: string
    sign_dkim: string
}

export interface iEmailCampaignScheduleParams extends iBasicResourceCreationParams {
    delivery_date: string
    delivery_time: string
}

export interface iEmailSummery {
    bounce_count: number
    click_count: number,
    click_rate: number
    delivered_count: number
    not_open_count: number
    open_count: number
    reported_count: number
    subscriber_count: number
    top_click_countries: []
    top_open_countries: []
    unique_open_count: number
    unique_open_rate: number
    unsubscribe_count: number
}

export interface iEmailSummeryResponse extends iApiBasicResponse {
    summary: iEmailSummery
}

export interface iEmailPerformanceData {
    type: string,
    name: string,
    smooth: boolean,
    data: number[],

}

export interface iEmail24Performance extends iApiBasicResponse {
    bar_names: string[],
    columns: string[],
    data: iEmailPerformanceData[],
}

export interface iBarChartResponse extends iApiBasicResponse {
    bar_names?: string[]
    columns?: string[]
    data?: Array<{
        name: string,
        data: number[],
        itemStyle: any,
        smooth: boolean,
        type: string
    }>,

}

interface iFileUploadCallback {
    path: string,
    onUploadProgress?: (progressEvent: ProgressEvent) => void
}

export interface iEmailListResponse extends iApiBasicResponse {
    logs: iBasicListingResponse<iEmailLog>
}

export interface iEmailLog {
    auto_trigger_id: string
    campaign_id: string
    sending_server_name: string
    subscriber_name: string
    ip_address: string
    campaign_name: string
    created_at: string
    customer_id: string
    email_id: string
    error: string
    id: number
    message_id: string
    runtime_message_id: string
    sending_server_id: string
    status: string
    sub_account_id: string
    subscriber_id: string
    updated_at: string
    user_agent: string
}

export default class EmailCampaignAPIs extends ResourceAPIs<iEmailCampaignCreateParams,
    EmailCampaignListResponse, iEmailCampaignViewResponse> {
    getResourceIdentifier = () => "/campaigns";
    getPreviewURL = (uid: string) => this.getResourceURL() + `/${uid}/preview`;
    getTemplateReviewURL = (uid: string) => this.getResourceURL() + `/${uid}/template/review-iframe`;

    // Create is just a GET method
    create = async (creationParams: iEmailCampaignCreateParams): Promise<iApiBasicResponse> => {
        return axios
            .get(this.getResourceURL() + "/create", {
                params: {
                    ...creationParams,
                    ts: new Date().getTime()
                },
                withCredentials: true,

            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    listing_campaigns = async (listingQuery: any, cancel_token?: CancelTokenSource): Promise<EmailCampaignListResponse> => {

        return axios
            .get(this.getResourceListingURL(), {
                withCredentials: true,
                params: {
                    ...listingQuery,
                    ts: new Date().getTime()
                },
                cancelToken: cancel_token && cancel_token.token,
            })
            .then((res): EmailCampaignListResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    get_recipients = async (campaign_id: string): Promise<iEmailCampaignRecipientsResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/recipients`, {
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

    save_recipients = async (campaign_id: string, values: any): Promise<iEmailCampaignRecipientsResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter({'lists_segments': values.lists_segments});
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/recipients`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    get_setup = async (campaign_id: string): Promise<iEmailCampaignSetupResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/setup`, {
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

    save_setup = async (campaign_id: string, params: iEmailCampaignSetupParams): Promise<iEmailCampaignRecipientsResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter(params);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/setup`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    get_schedule = async (campaign_id: string): Promise<iEmailCampaignScheduleResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/schedule`, {
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

    save_schedule = async (campaign_id: string, params: iEmailCampaignScheduleParams): Promise<iEmailCampaignRecipientsResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter(params);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/schedule`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    get_template = async (campaign_id: string): Promise<iEmailCampaignTemplateResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/template`, {
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

    save_template_layout = async (campaign_id: string, layout_name: string): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("layout", layout_name);
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/template/layout`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    save_plain_text_campaign = async (campaign_id: string, plain_text: string): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("plain", plain_text);
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/plain`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    save_template_theme = async (campaign_id: string, template_uid: string): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("template", template_uid);
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/template/theme`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    upload_attachment = async (files: any[], campaign_id: string, onUploadProgress?: (progressEvent: ProgressEvent) => void): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        files.forEach((value, index) => {
            fd.set(`file[${index}]`, value);
        })
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/upload-attachment`, fd, {
                withCredentials: true,
                headers: {"Content-Type": "multipart/form-data"},
                onUploadProgress: onUploadProgress
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    get_confirm = async (campaign_id: string): Promise<iEmailCampaignConfirmResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/confirm`, {
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

    get_attachments = async (campaign_id: string): Promise<iEmailCampaignAttachmentResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/get-attachments`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmailCampaignAttachmentResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    save_confirm = async (campaign_id: string): Promise<iEmailCampaignRecipientsResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/confirm`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };


    overview = async (uid: string, cancelToken: CancelTokenSource): Promise<iEmailCampaignOverviewResponse> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/overview`, {
                withCredentials: true,
                cancelToken: cancelToken.token,
                // params:{
                //     ts: new Date().getTime()
                // }
            })
            .then((res): iEmailCampaignOverviewResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iEmailCampaignOverviewResponse => {
                // @ts-ignore
                return {statusCode: 999, errors: {network: "Network error!"}}
            })
    };
    summary = async (uid: string, cancelToken: CancelTokenSource): Promise<iEmailSummeryResponse> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/summary`, {
                withCredentials: true,
                cancelToken: cancelToken.token,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmailSummeryResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iEmailSummeryResponse => {
                // @ts-ignore
                return {statusCode: 999, errors: {network: "Network error!"}}
            })
    };
    chart = async (uid: string, cancelToken: CancelTokenSource): Promise<iBarChartResponse> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/chart`, {
                withCredentials: true,
                cancelToken: cancelToken.token,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iBarChartResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iBarChartResponse => {
                // @ts-ignore
                return {statusCode: 999, errors: {network: "Network error!"}}
            })
    };
    performance_24_hour = async (uid: string, cancelToken: CancelTokenSource): Promise<iEmail24Performance> => {
        return axios
            .get(this.getResourceURL() + `/${uid}/chart24h`, {
                withCredentials: true,
                cancelToken: cancelToken.token,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmail24Performance => ({statusCode: res.status, ...res.data}))
            .catch((): iEmail24Performance => {
                // @ts-ignore
                return {statusCode: 999, errors: {network: "Network error!"}}
            })
    };
    copy_campaign = async (campaign_id: string, copy_name: string): Promise<iEmailCampaignRecipientsResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("copy_campaign_uid", campaign_id);
        fd.set("copy_campaign_name", copy_name);
        return axios
            .post(this.getResourceURL() + `/copy`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    remove_attachment = async (campaign_id: string, file_name: string): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/remove-attachment`, fd, {
                withCredentials: true,
                params: {
                    name: file_name,
                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    getDownloadAttachmentLink = (campaign_id: string, file_name: string): string => {
        return this.getApiBaseURL() + `/assets/templates/${campaign_id}/download-attachment?name=` + file_name
    }

    get_subscribers = async (campaign_id: string): Promise<iEmailCampaignAttachmentResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/subscribers`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmailCampaignAttachmentResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    get_log = async (type_log: string, campaign_id: string, listingQuery: iListingQuery, cancel_token?: CancelTokenSource): Promise<iEmailListResponse> => {
        let flattenedParams = new ObjectFlatter(listingQuery);
        let requestParams: { [key: string]: string } = {};
        flattenedParams.get_form_data().forEach(entry => {
            requestParams[entry.key] = entry.value;
        });
        return axios
            .get(this.getApiBaseURL() + `/campaigns/${campaign_id}/${type_log}/listing`, {
                withCredentials: true,
                params: {
                    ...requestParams,
                    ts: new Date().getTime()
                },
                cancelToken: cancel_token && cancel_token.token,
            })
            .then((res): iEmailListResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iEmailListResponse => {
                // @ts-ignore
                return {statusCode: 999, errors: {network: "Network error!"}}
            })
    };

    get_compaign_options = async (campaign_id: string): Promise<EmailCampaignListResponse> => {
        return axios
            .get(this.getResourceURL() + `/${campaign_id}/resend`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                },
                headers: {"Content-Type": "application/json"},
            })
            .then((res): EmailCampaignListResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    resend_compaign = async (campaign_id: string, selected_value: string): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("option", selected_value);
        return axios
            .post(this.getResourceURL() + `/${campaign_id}/resend`, fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    compaign_pause = async (campaign_id: string): Promise<EmailCampaignListResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        return axios
            .post(this.getResourceURL() + `/pause`, {
                    uids: campaign_id,
                    _token: csrfToken,
                    ts: new Date().getTime()
                }, {
                    withCredentials: true,
                    headers: {"Content-Type": "application/json"},
                }
            )
            .then((res): EmailCampaignListResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    compaign_resume = async (campaign_id: string): Promise<EmailCampaignListResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        return axios
            .post(this.getResourceURL() + `/restart`, {
                    uids: campaign_id,
                    _token: csrfToken,
                    ts: new Date().getTime()
                }, {
                    withCredentials: true,
                    headers: {"Content-Type": "application/json"},
                }
            )
            .then((res): EmailCampaignListResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
