import {iShopifyShop} from "../../types/internal";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams} from "../../types/api";
import ResourceAPIs from "../resource.apis";
import axios, {CancelTokenSource} from 'axios';


export interface iShopifyShopListingResponse extends iApiBasicResponse {
    items?: iBasicListingResponse<iShopifyShop>
}

export interface iShopifyShopViewResponse extends iApiBasicResponse {
    shop?: iShopifyShop
}

export interface iShopifyShopCreationParams extends iBasicResourceCreationParams {
    shop: string
}

export default class ShopifyShopAPIs extends ResourceAPIs<iShopifyShopCreationParams,
    iShopifyShopListingResponse,
    iShopifyShopViewResponse> {
    getResourceIdentifier = () => "/shopify_shops";
    getOauthURL = (uid: string) => this.getResourceURL() + `/${uid}/oauth`;

    getResourceDeletionURL = () => this.getApiBaseURL() + "/shop/delete";
    

    deleteShop = async (customer_id: string): Promise<iApiBasicResponse> => {
        console.log(this.getResourceDeletionURL() + "/" + customer_id);
        return axios
            .get((this.getResourceDeletionURL() + "/" + customer_id), {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                },
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    }
    
}

