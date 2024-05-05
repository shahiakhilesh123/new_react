import {
    TYPE_REMOVE_LOGGED_IN_USER,
    TYPE_SET_ACTIVE_SHOP,
    TYPE_SET_LOGGED_IN_USER,
    TYPE_SET_OVERVIEW_CAMPAIGN,
    TYPE_SET_SHOPS
} from "../constants";

import {iEmailCampaignOverviewState, iShopifyShop, iUser} from "../../types/internal";


export interface iSetLoggedInUser {
    type: TYPE_SET_LOGGED_IN_USER,
    user: iUser
}

export interface iRemoveLoggedInUser {
    type: TYPE_REMOVE_LOGGED_IN_USER,
}

export interface iSetActiveShop {
    type: TYPE_SET_ACTIVE_SHOP,
    active_shop?: iShopifyShop
}

export interface iSetOverViewCampaign {
    type: TYPE_SET_OVERVIEW_CAMPAIGN,
    overview_campaign?: iEmailCampaignOverviewState
}

export interface iSetShops {
    type: TYPE_SET_SHOPS,
    shops: iShopifyShop[]
}




