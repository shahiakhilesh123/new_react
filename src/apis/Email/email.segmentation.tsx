import ResourceAPIs, {ObjectFlatter} from "../resource.apis";

import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams, iListingQuery} from "../../types/api";
import {iCollectionElement, iCollectionElement2} from "../../types/internal";
import axios from "axios";


export interface iEmailSegmentGroupCondition extends iCollectionElement2 {
    location: {
        location_type_id: number
    },
    action: {
        action_type_id: number,
        count_type: string,
        date_type: string,
        date_period: string,
        date_value_int_one: number,
        date_value_int_two: number,
        date_value_date_one: string,
        date_value_date_two: string,
    },
    property: {
        property_type_id: number
        property_data_type: string
        comparison_type: string
        comparison_value_date: string
        comparison_value_number: string
        comparison_value_text: string
    }
    condition_type?: string,
    lid: string

}

export interface iEmailSegmentGroup extends iCollectionElement2 {
    conditions?: iEmailSegmentGroupCondition[],
    lid?: string
}

export interface iEmailSegment extends iCollectionElement2 {
    customer_id?: number,
    name: string,
    synced_at?: string,
    sync_needed?: boolean,
    groups?: iEmailSegmentGroup[]
}

interface iEmailSegmentationCreateParamsDEPRECATED extends iBasicResourceCreationParams {
}

export interface iEmailSegmentationListingResponse extends iApiBasicResponse {
    segment2s?: iBasicListingResponse<iEmailSegment>
}

export interface iEmailSegmentationShowResponse extends iApiBasicResponse {
    segment2?: iEmailSegment
}

export interface CreationResponse extends iApiBasicResponse {
    segment2?: iEmailSegment
}

export interface iEmailSegmentationLocationType extends iCollectionElement {
    code: string,
    name: string
}

export interface iEmailSegmentationPropertyTypes extends iCollectionElement {
    code: string,
    name: string,
    data_type: string,
}

export interface iEmailSegmentationActionTypes extends iCollectionElement {
    code: string,
    name: string
}


export interface iEmailSegmentationConditionTypes extends iApiBasicResponse {
    location_types?: iEmailSegmentationLocationType[]
    property_types?: iEmailSegmentationPropertyTypes[]
    action_types?: iEmailSegmentationActionTypes[]
    action_count_types?: string[]
    action_count_types__value_required_fields?: string[]
    action_date_types?: string[]
    action_date_types__value_one_date_required_fields?: string[]
    action_date_types__value_two_date_required_fields?: string[]
    action_date_types__value_one_int_required_fields?: string[]
    action_date_types__value_two_int_required_fields?: string[]
    action_date_types__period_required_fields?: string[]
    property_text_comparison_types?: string[]
    property_number_comparison_types?: string[]
    property_boolean_comparison_types?: string[]
    property_date_comparison_types?: string[]
    action_date_periods?: string[]
}

export default class EmailSegmentationAPIs extends ResourceAPIs<iEmailSegmentationCreateParamsDEPRECATED,
    iEmailSegmentationListingResponse, iEmailSegmentationShowResponse> {

    getResourceIdentifier = () => "/segment2";
    getDeleteSingleUrl = (id: number) => this.getResourceURL() + "/" + id;
    create = async (creationParams: iEmailSegmentationCreateParamsDEPRECATED): Promise<CreationResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter(creationParams);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceCreationURL(), fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): CreationResponse => ({statusCode: res.status, ...res.data}))
            .catch((): CreationResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    };


    deleteSingle = async (id: number): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("_method", "DELETE");

        return axios
            .post(`${this.getResourceURL()}/${id}`, fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    loadConditionTypeOptions = async (): Promise<iEmailSegmentationConditionTypes> => {

        return axios
            .get(`${this.getResourceURL()}/condition_type_options`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iEmailSegmentationConditionTypes => ({statusCode: 999, errors: {network: "Network error!"}}))
    };
    updateSegmentation = async (id: number, values: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};
        values["_token"] = csrfToken;
        values["_method"] = "PATCH";

        return axios
            .post(this.getResourceURL() + "/" + id.toString(), values, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((): CreationResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    };

    loadSubscribers = async (id: number, query: iListingQuery): Promise<any> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};


        return axios
            .get(this.getResourceURL() + "/" + id.toString() + "/customers", {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
                params: {
                    ...query,
                    ts: new Date().getTime()
                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((): CreationResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    }
}
