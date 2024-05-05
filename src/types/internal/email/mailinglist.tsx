import {iCollectionElement, iContact} from "../index";
import {iApiBasicResponse} from "../../api";

export interface iEmailMailingListVerification {
    is_verification_running: boolean,
    verified: number,
    total: number,
    verification_servers: Array<{
        text: string,
        value: string
    }>
}

export interface iEmailMailingListCache {
    SubscriberCount: number
    VerifiedSubscriberCount: number
    ClickedRate: number
    UniqOpenRate: number
    SubscribeRate: number
    SubscribeCount: number
    UnsubscribeRate: number
    UnsubscribeCount: number
    UnconfirmedCount: number
    BlacklistedCount: number
    SpamReportedCount: number
    SegmentSelectOptions: Array<iEmailMailingListSegment>,
    LongName: string
    VerifiedSubscribersPercentage: number
}

export interface iEmailMailingList extends iCollectionElement {
    customer_id: string
    contact_id: string
    name: string
    default_subject: string
    from_email: string
    from_name: string
    remind_message: string
    email_subscribe: string
    email_unsubscribe: string
    email_daily: string
    shopify_shop_id: string
    send_welcome_email: string
    unsubscribe_notification: string
    custom_order: string
    subscribe_confirmation: string
    cache: string
    cache_object?: iEmailMailingListCache
    all_sending_servers: string
    contact?: iContact
    checked?: boolean,
    get_fields: iEmailMailingListField[]
}

export const getMailingListWithCache = (inputList: iEmailMailingList): iEmailMailingList => {
    if (inputList && inputList.cache) {
        try {
            const cache_object: iEmailMailingListCache = JSON.parse(inputList.cache);
            return {cache_object, ...inputList};
        } catch (e) {
            // Do nothing.
        }
    }
    return inputList;
};

export interface iEmailMailingListSubscriberField extends iCollectionElement {
    subscriber_id: string
    field_id: string
    value: string,
    field?: iSubscriberField
}

export interface iSubscriberField extends iApiBasicResponse {
    created_at: string
    custom_order: string
    default_value: string
    label: string
    mail_list_id: string
    required: string
    tag: string
    type: string
    visible: string
}

export interface iEmailMailingListSubscriber extends iCollectionElement {
    mail_list_id: string
    email: string
    from: string
    ip: string
    subscription_type: string
    tags: string
    verify_result: string
    subscriber_fields: iEmailMailingListSubscriberField[],
    extra_stats?: {
        click_count: number
        last_click_at?: {
            date: string
            timezone: string
            timezone_type: number
        }
        last_open_at?: {
            date: string
            timezone: string
            timezone_type: number
        }
        open_count: number
    }
}


export interface iEmailMailingListSegmentCache {
    SubscriberCount: number
}

export interface iEmailMailingListSegmentCondition extends iCollectionElement {
    special_condition: string
    field_id: string
    operator: string
    value: string
    time_period: string
    time_period_in_last_days: string

    [key: string]: any
}

export interface iEmailMailingListSegment extends iCollectionElement {
    mail_list_id: string
    name: string
    matching: string
    cache: string
    cache_object?: iEmailMailingListSegmentCache
    mail_list: iEmailMailingList
    segment_conditions: iEmailMailingListSegmentCondition[]
}

export const getMailingListSegmentWithCache = (segment: iEmailMailingListSegment): iEmailMailingListSegment => {
    if (segment && segment.cache) {
        try {
            const cache_object: iEmailMailingListSegmentCache = JSON.parse(segment.cache);
            return {cache_object, ...segment};
        } catch (e) {
            // Do nothing.
        }
    }
    return segment;
};

export type iEmailMailingListFieldType =
    "text"
    | "number"
    | "dropdown"
    | "multiselect"
    | "checkbox"
    | "radio"
    | "date"
    | "datetime"
    | "textarea";

export interface iEmailMailingListField extends iCollectionElement {
    mail_list_id: number
    label: string
    type: iEmailMailingListFieldType;
    tag: string
    default_value: string
    visible: string
    required: string
    custom_order: string
    options?: iEmailMailingListFieldOption[]

    [key: string]: string | number | iEmailMailingListFieldOption[] | undefined
}

export interface iEmailMailingListFieldOption extends iCollectionElement {
    field_id?: string
    label: string
    value: string

    [key: string]: string | number | undefined
}
