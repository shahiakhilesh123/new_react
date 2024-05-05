import {iCollectionElement, iMultilevelStringOrNumber} from "./internal";

export interface iApiListingQuery extends iMultilevelStringOrNumber {
    page: number
    per_page: number
    sort_order: any
    sort_direction: "desc" | "asc"
    keyword: string
    columns: any,
    filters: {
        'sort-order'?: string
        type?: string
        search_keyword?: string
        total_items_count?: number
        from?: string
    }
}

export const getEmptyApiListingQuery = (): iApiListingQuery => {
    return {
        filters: {},
        columns: undefined,
        sort_direction: "desc",
        sort_order: "created_at",
        keyword: "",
        per_page: 25,
        page: 1,
    }
};

export interface iApiBasicResponse {
    statusCode: number
    message?: string
    redirectURL?: string
    reactURL?: string
    redirectAction?: string
    view?: string
    errors?: {
        [key: string]: string | Array<string>
    }
    validation_errors?: {
        [key: string]: string | Array<string>
    }
    uid?: string
}

export interface iShopDetails {
    email: string
    shop_owner_email: string
    myshopify_domain: string
    primary_domain: string
    name: string
    owner_first_name: string
    owner_last_name: string
    font_family: string
    primary_background_color: string
    primary_text_color: string
    secondary_background_color: string
    secondary_text_color: string

    password_required: boolean
    password: string
    currency: string

    selected_plan_id: number,
    selected_plan_price: number,

    designation: string
    full_name: string
    logo_path: string
    logo: string
    phone: string
    skype: string
    website: string
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
    api_key: string
    api_secret: string
    isShopify: boolean
    platform: string

    coupon: string
}

export interface iPlanSendingServerType {

    "amazon-smtp": string,
    "amazon-api": string,
    "sendgrid-smtp": string,
    "sendgrid-api": string,
    "mailgun-api": string,
    "mailgun-smtp": string,
    "elasticemail-api": string,
    "elasticemail-smtp": string,
    "sparkpost-api": string,
    "sparkpost-smtp": string,
    "smtp": string,
    "sendmail": string

}

export interface iPlanOptions {
    email_max_free: string,
    email_max: string,
    list_max: string,
    subscriber_max: string
    subscriber_per_list_max: string,
    segment_per_list_max: string,
    campaign_max: string,
    automation_max: string,
    billing_cycle: string,
    sending_limit: string,
    "sending_quota": number,
    "sending_quota_time": number,
    "sending_quota_time_unit": string,
    "max_process": string,
    "all_sending_servers": string,
    "max_size_upload_total": string,
    "max_file_size_upload": string,
    "unsubscribe_url_required": string,
    "access_when_offline": string,
    "create_sending_domains": string,
    "sending_servers_max": string,
    "sending_domains_max": string,
    "all_email_verification_servers": string,
    "create_email_verification_servers": string,
    "email_verification_servers_max": string,
    "list_import": string,
    "list_export": string,
    "all_sending_server_types": string,
    "sending_server_types": iPlanSendingServerType,
    "sending_server_option": string,
    "sending_server_subaccount_uid": string,
    "api_access": string,
    "email_footer_enabled": string,
    "email_footer_trial_period_only": string,
    "html_footer": string,
    "plain_text_footer": string,
    "payment_gateway": string,
    "popup_branding": string
}

export interface iPlan extends iCollectionElement {
    color: string
    name: string
    description: string

    price: string
    usage_rate: string
    frequency_amount: string
    frequency_unit: string
    maximum_usage_charge: number,
    options: string,
    options_object?: iPlanOptions

}

export interface iBasicListingResponse<T> {
    current_page: number
    data: Array<T>
    length?: number
    first_page_url?: string
    from?: number
    last_page: number
    last_page_url?: string
    next_page_url?: string
    path?: string
    per_page: number | string,
    prev_page_url?: string | null
    to?: number
    total: number,
}

export interface iBasicResourceCreationParams {
    [key: string]: string | number | iBasicResourceCreationParams | iBasicResourceCreationParams[]
}

export interface iDropboxResponse extends iApiBasicResponse {
    dropbox?: Array<{
        text: string
        desc: string
        value?: string
        subfix?: string
    }>
}

export interface iListingQuery extends iMultilevelStringOrNumber {
    page?: number
    per_page?: number
    sort_order?: string
    sort_direction?: "desc" | "asc"
    keyword?: string
}

export type iRequestQuery =
    | { type: "query", query: iListingQuery }
    | { type: "go_to_page", page: number }
    | { type: "per_page", per_page: number }

export function queryReducer(state: iListingQuery, action: iRequestQuery): iListingQuery {
    switch (action.type) {
        case 'query':
            return {...state, ...action.query};
        case 'go_to_page':
            return {...state, page: action.page};
        case 'per_page':
            return {...state, per_page: action.per_page};
        default:
            return {};
    }
}
