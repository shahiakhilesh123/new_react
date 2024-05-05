import {iShopifyShop, iUser} from '../../types/internal';
import {iListingQuery, iPlan} from "../../types/api";
import {Reducer} from "redux";
import {NotificationListResponse} from "../../apis/notification.apis";


export type iListResponseActions<T> =
    | { type: "loading" }
    | { type: "failed", error?: string }
    | { type: "failed_to_load", error?: string }
    | { type: "success", resource?: T }
    | { type: "query", query: iListingQuery }
    | { type: "on_sort_change", query: iListingQuery }
    | { type: "go_to_page", page: number }
    | { type: "search", keyword: string }
    | { type: "per_page", per_page: number }

export interface iListResource<T> {
    loading: boolean,
    error?: string,
    resource?: T,
    error_block?: string,
    query: iListingQuery
}

export const listReducer: <TS extends iListResource<T>,
    T extends iListResponseActions<T>>(initialEntity: T) => Reducer<iListResource<T>, iListResponseActions<T>> = (initialEntity) => {
    return (state, action) => {
        if (!state) return {query: {}, loading: true};
        switch (action.type) {
            case 'loading':
                return {...state, loading: true};
            case 'failed':
                return {...state, loading: false, error: action.error};
            case 'failed_to_load':
                return {...state, loading: false, error_block: action.error};
            case 'success':
                return {...state, resource: action.resource, loading: false};
            case 'query':
                return {...state, query: {...action.query}};
            case 'on_sort_change':
                return {...state, query: {...state.query, ...action.query}};
            case 'go_to_page':
                return {...state, query: {...state.query, page: action.page}};
            case 'per_page':
                return {...state, query: {...state.query, per_page: action.per_page}};
            case 'search':
                return {...state, query: {...state.query, keyword: action.keyword}};
            default:
                return {...state, loading: true};
        }
    }
}


export const loading_action = (): iListResponseActions<any> => {
    return {type: "loading"}
};

export const onSortAction = (sort_order: string, sort_direction: "asc" | "desc"): iListResponseActions<any> => {
    return {type: "on_sort_change", query: {sort_order: sort_order, sort_direction: sort_direction}}
};

export const per_page_row_change_action = (number: any): iListResponseActions<any> => {
    return {type: "per_page", per_page: number}
};
export const search_action = (keyword: string): iListResponseActions<any> => {
    return {type: "search", keyword: keyword}
};
export const current_page_change_action = (number: any): iListResponseActions<any> => {
    return {type: "go_to_page", page: number}
};

export const failed_action = (error?: string): iListResponseActions<any> => {
    return {type: "failed", error: error}
};
export const failed_block_action = (error: string): iListResponseActions<any> => {
    return {type: "failed_to_load", error: error}
};
export const success_action = (resource: any): iListResponseActions<any> => {
    return {type: "success", resource: resource}
};

interface iAppTour {
    tour_type: string,
    tour_active: boolean
}

export type State = {
    userInteracted: boolean,
    loggedInUser?: iUser;
    logging?: boolean;
    notifications: any[];
    shop?: iShopifyShop,
    shops?: iShopifyShop[],
    popup_enabled?: boolean
    chat_enabled?: boolean
    review_enabled?: boolean,
    plans?: iPlan[]
    server_notifications: iListResource<NotificationListResponse>
    tour?: iAppTour
    popup_tour_shown?: boolean
    app_tour_shown?: boolean
}
export type iStoreAction =
    | { type: 'verifying_user' }
    | { type: 'failed_to_user' }
    | { type: 'ENQUEUE_SNACKBAR', notification: any, key: any }
    | { type: 'CLOSE_SNACKBAR', dismissAll: boolean, key: any }
    | { type: 'REMOVE_SNACKBAR', key: any }
    | { type: 'set_logged_in_user', loggedInUser: iUser | undefined }
    | { type: 'set_plans', plans: iPlan[] | undefined }
    | { type: 'logout', }
    | { type: 'set_active_shop', shop: iShopifyShop }
    | { type: 'popup_enabled', enabled?: boolean }
    | { type: 'chat_enabled', enabled?: boolean }
    | { type: 'review_enabled', enabled?: boolean }
    | { type: 'loading_notification' }
    | { type: 'error_notification', error?: string }
    | { type: 'current_page_notification', page_number: number }
    | { type: 'response_notification', server_notification: NotificationListResponse }
    | { type: 'set_shops', shops: iShopifyShop[] }
    | { type: 'popup_tour_shown', popup_tour_shown: boolean }
    | { type: 'app_tour_shown', app_tour_shown: boolean }
    | { type: 'set_tour', tour: iAppTour }
    | { type: 'user_interacted', };

export function appReducer(state: State, action: iStoreAction): State {
    switch (action.type) {
        case 'set_logged_in_user':
            return {...state, loggedInUser: action.loggedInUser};
        case 'set_plans':
            return {...state, plans: action.plans};
        case 'logout':
            return {...state, loggedInUser: undefined};
        case 'set_tour':
            return {...state, tour: action.tour};
        case 'popup_tour_shown':
            return {...state, popup_tour_shown: action.popup_tour_shown};
        case 'app_tour_shown':
            return {...state, app_tour_shown: action.app_tour_shown};
        case 'popup_enabled':
            return {...state, popup_enabled: action.enabled};
        case 'chat_enabled':
            return {...state, chat_enabled: action.enabled};
        case 'review_enabled':
            return {...state, review_enabled: action.enabled};
        case 'user_interacted':
            return {...state, userInteracted: true};
        case 'set_active_shop':
            window.localStorage.setItem('set_active_shop_uid', action.shop && action.shop.uid);
            return {...state, shop: action.shop};
        case 'loading_notification':
            return {...state, server_notifications: {...state.server_notifications, loading: true}};
        case 'error_notification':
            return {
                ...state,
                server_notifications: {...state.server_notifications, loading: false, error_block: action.error}
            };
        case 'response_notification':
            return {
                ...state,
                server_notifications: {
                    ...state.server_notifications,
                    loading: false,
                    error_block: "",
                    resource: action.server_notification
                }
            };
        case 'current_page_notification':
            return {
                ...state,
                server_notifications: {
                    ...state.server_notifications,
                    loading: false,
                    error_block: "",
                    query: {
                        ...state.server_notifications.query,
                        page: action.page_number
                    }
                }
            };
        case 'set_shops':
            return {...state, shops: action.shops};
        case 'ENQUEUE_SNACKBAR':
            return {
                ...state, notifications: [
                    ...state.notifications,
                    {
                        key: action.key,
                        ...action.notification,
                    },
                ],
            };
        case 'CLOSE_SNACKBAR':
            return {
                ...state, notifications: state.notifications.map(notification => (
                    (action.dismissAll || notification.key === action.key)
                        ? {...notification, dismissed: true}
                        : {...notification}
                )),
            };
        case "REMOVE_SNACKBAR":
            return {
                ...state,
                notifications: state.notifications.filter(
                    notification => notification.key !== action.key,
                ),
            };
        default:
            return {...state};
    }
}

export const loading_action_response = (): iResponseActions<any> => {
    return {type: "loading"}
};


export const failed_action_response = (error?: string): iResponseActions<any> => {
    return {type: "failed", error: error}
};
export const failed_block_action_response = (error?: string): iResponseActions<any> => {
    return {type: "failed_to_load", error: error}
};
export const success_action_response = (resource: any): iResponseActions<any> => {
    return {type: "success", response: resource}
};

export type iResponseActions<T> =
    | { type: "loading" }
    | { type: "failed_to_load", error?: string }
    | { type: "failed", error?: string }
    | { type: "success", response?: T }

export interface iResource<T> {
    loading?: boolean,
    error_block?: string,
    error?: string,
    response?: T,
}

export const responseReducer: <TS extends iResource<T>,
    T extends iResponseActions<T>>(initialEntity: T) => Reducer<iResource<T>, iResponseActions<T>> = (initialEntity) => {
    return (state, action) => {
        if (!state) return {loading: true};
        switch (action.type) {
            case 'loading':
                return {...state, loading: true};
            case 'failed_to_load':
                return {...state, loading: false, error_block: action.error};
            case 'failed':
                return {...state, loading: false, error: action.error};
            case 'success':
                return {...state, response: action.response, loading: false};
            default:
                return {...state, loading: false};
        }
    }
};
