import {iCollectionElement} from "../index";
import {PopupProps} from "../../../components/popups/popup_props/props";

export interface iPopupTrigger {
    type: string,
    delay_seconds: number
}

export interface iPopup extends iCollectionElement {
    title: string,
    default_for_new_customers: string,
    data: PopupProps | string
    checked?: boolean
    active: string
    active_mobile: string
    behaviour: string
    customer_id: string
    triggers: iPopupTrigger[]
    width: string
    height: string
    responses_count: number,
    impression_count: number,
    click_through_rate: number,
    revenue: number,
    conversion_rate: number,
    fired?: boolean,
    thumbnail_full_url: string
}
