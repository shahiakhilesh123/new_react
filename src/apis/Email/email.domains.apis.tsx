import {iEmailSendingDomain, iEmailSendingDomainDNSRecord} from "../../types/internal";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams} from "../../types/api";
import ResourceAPIs from "../resource.apis";
import axios from "axios";

export interface iEmailDomainListingResponse extends iApiBasicResponse {
    items?: iBasicListingResponse<iEmailSendingDomain>
}

export interface iEmailDomainViewResponse extends iApiBasicResponse {
    server?: iEmailSendingDomain
    records?: iEmailSendingDomainDNSRecord[]
}

export interface iEmailDomainCreateParams extends iBasicResourceCreationParams {
    name: string
    signing_enabled: string
}

export default class EmailDomainAPIs extends ResourceAPIs<iEmailDomainCreateParams,
    iEmailDomainListingResponse, iEmailDomainViewResponse> {
    getResourceIdentifier = () => "/sending_domains";

    getDeleteSingleUrl = (id: number) => this.getResourceURL() + "/" + id;
    reloadShopDomains = async () => {
        return axios.get(this.getResourceURL() + "/reload_shop_domains", {
                withCredentials: true
            }).then((res) => ({statusCode: res.status, ...res.data}));
    }
    verifyRecords = async (uid: string): Promise<iEmailDomainViewResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        return axios
            .post(this.getResourceURL() + `/${uid}/verify`, fd, {
                withCredentials: true
            })
            .then((res) => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
