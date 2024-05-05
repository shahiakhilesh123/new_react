import {iLog} from "../../types/Account/logs";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams} from "../../types/api";
import ResourceAPIs from "../resource.apis";


export interface iLogListingResponse extends iApiBasicResponse {
    logs?: iBasicListingResponse<iLog>
}

export interface iLogViewResponse extends iApiBasicResponse {
    log?: iLog
}

export interface iLogCreateParams extends iBasicResourceCreationParams {
}

export default class AccountLogsAPIs extends ResourceAPIs<iLogCreateParams,
    iLogListingResponse, iLogViewResponse> {
    getResourceIdentifier = () => "/account/logs";
}
