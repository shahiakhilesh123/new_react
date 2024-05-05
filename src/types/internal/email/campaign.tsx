import {iCollectionElement} from "../index";

export interface iEmailCampaignCache {
    ActiveSubscriberCount: number
    ClickedRate: number
    DeliveredCount: number
    DeliveredRate: number
    FailedDeliveredCount: number
    FailedDeliveredRate: number
    NotDeliveredCount: number
    NotDeliveredRate: number
    NotOpenCount: number
    NotOpenRate: number
    SubscriberCount: number
    UniqOpenCount: number
    UniqOpenRate: number
}

export interface iEmailCampaign extends iCollectionElement {
    customer_id: string,
    type: string,
    status: string
    name: string,
    subject: string,
    html: string,
    plain: string,
    step: number,
    from_email: string,
    from_name: string,
    reply_to: string,
    sign_dkim: string,
    track_open: string,
    track_click: string,
    resend: string,
    pause: boolean,
    custom_order: string,
    run_at: string,
    delivery_at: string,
    template_source: string,
    last_error: string,
    is_auto: string,
    image: string,
    default_mail_list_id: string,
    cache: string,
    tracking_domain_id: string,
    use_default_sending_server_from_email: string,
    checked?: boolean,
    cache_object?: iEmailCampaignCache
    default_mail_list: { uid: string },
    sales_total?: number,
}

export interface iEmailCampaignRecipient {
    mail_list_uid: string
    is_default: boolean
    segment2_uids: string[]
}


export interface iEmailCampaignListSegmentOption {
    id: number
    value: string
    text: string
    label: string
    segments: Array<{
        value: string
        text: string
        label: string
    }>
    segment2s: Array<{
        value: string
        text: string
        label: string
    }>
}

export interface iEmailCampaignConfirm {
    recipients_count: number
    recipients: string
    subject: string
    reply_to: string
    track_open: string
    track_click: string
    run_at: string
    score: string
}

export interface iEmailCampaignOverview {
    info: {
        from: string
        subject: string
        from_email: string
        from_name: string
        reply_to: string
        updated_at: string
        run_at: string
        delivery_at: string
    }
    statistics: {
        unique_open_rate: number
        unique_open_count: number
        open_count: number
        not_open_rate: number
        not_open_count: number
        subscriber_count: number
        clicked_rate: number
        clicked_count: number
        unsubscribe_rate: number
        unsubscribe_count: number
        bounce_rate: number
        bounce_count: number
        feedback_rate: number
        feedback_count: number
        delivery_rate: number
        delivery_count: number
        last_open: number
        last_click: number
        abuse_reports: number
    }
}
