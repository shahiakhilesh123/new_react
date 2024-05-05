import {iApiBasicResponse, iApiListingQuery, iBasicListingResponse, iPlan} from "../api";
import {OptionTypeBase} from "react-select";
import {iEmailMailingList} from "./email/mailinglist";
import {iEmailCampaign} from "./email/campaign";
import {iShopifyProduct} from "../../apis/Reviews/shopify.reviews.apis";

export interface iMultilevelStringOrNumber {
    [key: string]: undefined | string | string[] | number | number[] | boolean | boolean[] | iMultilevelStringOrNumber | iMultilevelStringOrNumber[]
}

export interface iBasicErrorParameters {
    error_message: string
    errors: {
        [key: string]: string | Array<string>
    }
    loading: boolean
}
export interface iChatCannedMessage {
    id: number
    user_id: number
    name: string
    message: string
    created_at: string
    updated_at: string
}
export interface iCollectionElement {
    id: number
    uid: string
    status?: string
    created_at: string
    updated_at: string,
}

export interface iCollectionElement2 {
    id: number
    uid?: string
    status?: string
    created_at?: string
    updated_at?: string,
}

export interface iLanguage extends iCollectionElement {
    name: string
    code: string
    region_code: string
    is_default: string
}

export interface iCountry extends iCollectionElement {
    name: string
    code: string
}

export interface iSelectOption extends OptionTypeBase {
    label: string
    value: any
    children?: iSelectOption[]
    isDisabled?: boolean
}

export interface iTimezone extends iSelectOption {
}

export interface iContact extends iCollectionElement {
    first_name: string
    last_name: string
    company: string
    address_1: string
    address_2: string
    country_id: string
    state: string
    zip: string
    phone: string
    url: string
    email: string
    city: string
    tax_number: string
    billing_address: string
}

export interface iCustomer extends iCollectionElement {
    user_id: string
    admin_id: string
    contact_id: string | null
    contact: iContact
    language_id: string
    first_name: string
    last_name: string
    image: string | null
    timezone: string
    color_scheme: string
    quota: any //todo: make it stricter
    cache: string | null
    language: iLanguage,
    plan?: iPlan
}

export interface iUser extends iCollectionElement {
    api_token: string
    admin?: any
    creator_id: string | null
    email: string
    timezone: string
    quota: any      //todo: make it stricter
    activated: string
    customers: iCustomer[],
    first_name: string,
    last_name: string
}

export interface iNotification {
    id?: string
    type?: string,
    body?: string
}

export interface iCsrfToken {
    token: string
    expiry: Date
}

export interface iCsrfToken {
    token: string
    expiry: Date
}

export interface iEmailSender extends iCollectionElement {
    customer_id: string
    type: string
    name: string
    email: string,
    checked?: boolean
}

export interface iEmailSenderVerificationOptions {
    value: string
    text: string
}

export interface iEmailAutomation extends iCollectionElement {
    name: string
    customer_id: string
    default_for_new_customers: boolean
    mail_list_id: string
    mail_list: iEmailMailingList
    time_zone: string
    data: string
    _briefIntro: string
    _countEmails: number
    _totalEmailCount: number
    _summaryStats: {
        total: number
        involed: number
        complete: number
    }
    checked?: boolean
}

export interface iEmailSendingDomain extends iCollectionElement {
    admin_id: string
    customer_id: string
    name: string
    dkim_private: string
    dkim_public: string
    signing_enabled: string
    custom_order: string
    verification_token: string
    domain_verified: string
    spf_verified: string
    dkim_verified: string
    verification_hostname: string
    dkim_selector: string,
    checked?: boolean
}

export interface iEmailSendingDomainDNSRecord {
    host_name: string
    value: string
    verified: boolean
}


export interface iEmailTemplate extends iCollectionElement {
    customer_id: string
    admin_id: string
    name: string
    content: string
    image: string
    custom_order: string
    shared: any // todo: make it stricter
    source: any // todo: make it stricter
    checked?: boolean
}

export interface iEmailTemplateLayout {
    name: string
    title: string
}

export interface iResourceViewProps<iResponse, iExtraData = {}> extends iBasicErrorParameters {
    deleteResources: (uids: Array<string>) => void
    enableDisableResources?: (uids: Array<string>, is_enable: boolean) => void
    updateFilter: (listingQuery: iApiListingQuery) => void
    response?: iResponse
    defaultFilters?: iApiListingQuery
    extra_data: iExtraData,
    handleSelectAll?: (checked: boolean) => void,
    selectAll?: boolean
}

export interface iEmailCampaignOverviewState {
    loading: boolean,
    error?: string,
    campaign?: iEmailCampaign
}

export interface iStoreState {
    loggedInUser: iUser | undefined;
    notification?: iNotification;
    shop?: iShopifyShop,
    shops: iShopifyShop[],
}

export const getInitialStoreState = (): iStoreState | iEmailCampaignOverviewState => {
    return {
        loggedInUser: undefined,
        notification: undefined,
        shop: undefined,
        shops: []
    }
};

export interface iControllerProps {
    loggedInUser: iUser | undefined
    match: {
        params: {
            [key: string]: string | undefined
        }
    }
}

export interface iShopifyShop extends iCollectionElement {
    customer_id: string
    active: string
    name: string
    token_refresh_required?: boolean,
    initializing: string
    default_automations_created: string
    initialized: string,
    customer_uid: string,
    customer?: iCustomer,
    myshopify_domain: string
    shop_owner_email: string
    primary_currency: string
}

export interface iShopifyReview extends iCollectionElement {
    customer_id: string
    shop: string
    shop_name: string
    shopify_product_id: string
    product?: iShopifyProduct
    product_title: string
    stars: string
    reviewer_email: string
    reviewer_name: string
    title: string
    message: string
    ip_address: string
    verified_purchase: boolean
    approved: boolean,
    active: string,
    images?: ImageObject[]

}

export interface iChatDepartment {
    department: string
    description: string
}

export interface iChatDepartmentResponse {
    departments?: iBasicListingResponse<iChatDepartment>
}

export interface ImageObject extends iCollectionElement {
    full_path?: string
}

export interface iChatCanned extends iCollectionElement {
    name: string
    message: string
}
export interface iCanned {
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
export interface iChatCannedResponse extends iApiBasicResponse {
    cannedChatResponse?: iBasicListingResponse<iChatCanned>
}

export interface iCannedResponse extends iApiBasicResponse {
    cannedResponse?: iBasicListingResponse<iCanned>
}
export interface iCustomerOrders extends iApiBasicResponse{
    orders?: any
}
export interface iShopProducts extends iApiBasicResponse{
    items?: any
    last_page: any
    current_page: any
}
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
export interface iChatSessionCart {
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

export interface iChatSession extends iCollectionElement {
    customer_id: number
    user_id: number
    name: string
    email: string
    cart?: any
    pages?: string
    secret_key: string
    guest_unread_messages: number
    agent_unread_messages: number
    shop_name: string,
    last_message: iChatMessage,
    location?: iChatSessionLocation
    ended_at?: string
    feedback_message: string
    feedback_rating: string,
    messages?: iChatMessage[],
    shopify_customer_id: string

}
export interface iClientChatMessage extends iCollectionElement2 {
    id: number
    customer_id?: number
    user_id?: number
    session_id?: number
    from_guest?: string
    message?: string
    attachment_size?: number
    attachment_full_url?: string
    attachment_mime_type?: string,
    message_type?: undefined | "bot_message" | "email_user_form" | "end_chat" | "feedback" | "products",
    form_submitted?: boolean,
}

export interface iChatMessage extends iCollectionElement2 {
    customer_id?: number
    user_id?: number
    session_id?: number
    from_guest?: string
    message: string
    attachment_size?: number
    attachment_full_url?: string
    attachment_mime_type?: string,
    message_type?: undefined | "bot_message" | "email_user_form" | "end_chat" | "products",
    products?:any,
}

export interface GuestSession extends iApiBasicResponse {
    chat_session?: iChatSession,
    chat_settings?: iChatSettings
    
}
export interface iChatSettings {
    info_message: string,
    welcome_message: string,
    bot_name: string,
    bot_image: string,

    primary_background_color: string
    primary_text_color: string
    secondary_background_color: string
    secondary_text_color: string

    guest_message_background_color: string,
    guest_message_text_color: string,
    admin_message_background_color: string,
    admin_message_text_color: string,
    hide_branding: boolean,

    input_background_color: string,
    input_text_color: string,
    font_family: string,
    offline_message: string
    file_sharing_enabled: boolean
    file_sharing_max_size_kb: number
    file_sharing_extensions: string
}

export interface iEmailDashboardTopOpen {
    name: string
    uid: string
    recipients: string
    opens: number
    opens_unique: number
    last_open: string
}

export interface iEmailDashboardTopClick {
    name: string
    recipients: string
    clicks: number
    urls: number
    last_click: string
}

export interface iEmailDashboardTopLink {
    url: string
    campaigns: number
    clicks: number
    last_click: string
}

export interface iEmailDashboardActivity extends iCollectionElement {
    customer_id: string
    type: string
    name: string
    data: string
    extra_data: {
        id: number
        uid: string // Add this
        email: string // Add this
        name: string // Add this
        count: string // Add this
        error: string // Add this
        list_id: number
        list_name: number
        list_uid: string // Add this
        from_uid: string
        to_uid: string
    }
}
