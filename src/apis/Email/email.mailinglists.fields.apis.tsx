import {iEmailMailingList, iEmailMailingListField} from "../../types/internal/email/mailinglist";
import {iApiBasicResponse, iBasicResourceCreationParams} from "../../types/api";
import ResourceAPIs, {ObjectFlatter} from "../resource.apis";
import axios from "axios";


export interface iEmailMailingListFieldListingResponse extends iApiBasicResponse {
}

export interface iEmailMailingListFieldShowResponse extends iApiBasicResponse {
}

export interface iEmailMailingListFieldCreateParams extends iBasicResourceCreationParams {
}

export interface iEmailMailingListFieldsIndexResponse extends iApiBasicResponse {
    fields?: iEmailMailingListField[]
    list?: iEmailMailingList
}

export default class EmailMailingListFieldsAPIs extends ResourceAPIs<iEmailMailingListFieldCreateParams,
    iEmailMailingListFieldListingResponse, iEmailMailingListFieldShowResponse> {
    list_uid: string = "";

    setMailingListUid = (uid: string) => {
        this.list_uid = uid;
        return this;
    };

    getResourceIdentifier = () => `/lists/${this.list_uid}/fields`;


    index = async (): Promise<iEmailMailingListFieldsIndexResponse> => {
        return axios
            .get(this.getResourceIndexURL(), {
                withCredentials: true, params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmailMailingListFieldsIndexResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    storeAll = async (fields: iEmailMailingListField[]): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);

        let fields_with_uids: {
            [key: string]: iEmailMailingListField
        } = {};
        fields.forEach((field, index) => {
            fields_with_uids[field.uid || index] = field;
        });

        let flattenedParams = new ObjectFlatter({fields: fields_with_uids});
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceStoreURL(), fd, {
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
