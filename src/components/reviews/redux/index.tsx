export interface MetaData {
    client_id: string,
    product_id: string,
    shop_name: string
}

export type State = {
    meta_data?: MetaData;
}
export type iStoreAction =
    | { type: 'meta_data', meta_data?: MetaData };

export function reviewAppReducer(state: State, action: iStoreAction): State {
    switch (action.type) {
        case 'meta_data':
            return {...state, meta_data: action.meta_data};
        default:
            return {...state};
    }
}
