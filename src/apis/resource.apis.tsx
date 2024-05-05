import BaseAPIs from "./base.apis";
import axios, {CancelTokenSource} from "axios";
import {iApiBasicResponse, iBasicResourceCreationParams, iListingQuery} from "../types/api";
import {iMultilevelStringOrNumber} from "../types/internal";

interface iFormData {
    key: string
    value: string | any
}

/**
 * This class is used to 'flatten' the incoming objects:
 * Example CreationParams:
 * {
 *     name: John
 *     address:{
 *         country: Germany
 *         city: Munich
 *         location: {
 *             lat: 33.5445
 *             lng: 46.9956
 *         }
 *     }
 * }
 *
 * Example 'flattened' output:
 * [
 *  {key: 'name', value: 'John'},
 *  {key: 'address[country]', value: 'Germany'},
 *  {key: 'address[city]', value: 'Munich'},
 *  {key: 'address[location][lat]', value: '33.5445'},
 *  {key: 'address[location][lng]', value: '46.9956'},
 * ]
 */

export class ObjectFlatter {
    private readonly flattened_data: Array<iFormData>;

    constructor(params: iMultilevelStringOrNumber) {
        this.flattened_data = [];
        this.process_params(params, "");
    }

    process_params = (params: iMultilevelStringOrNumber, suffix: string) => {
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const key_with_suffix = suffix ? (suffix + '[' + key + ']') : key;
                const value = params[key];
                if (typeof value === 'string') {
                    this.flattened_data.push({key: key_with_suffix, value: value});
                } else if (typeof value === 'number') {
                    this.flattened_data.push({key: key_with_suffix, value: value + ""});
                } else if (typeof value === 'boolean') {
                    this.flattened_data.push({key: key_with_suffix, value: (value ? "1" : "0")});
                } else if (typeof value === 'undefined') {
                    // Do nothing.
                } else {
                    // Check for arrays.
                    let value_object: iMultilevelStringOrNumber;
                    if (Array.isArray(value)) {
                        value_object = {};
                        value.forEach((val: any, index: number) => value_object[index + ''] = val);
                    } else {
                        value_object = value;
                    }
                    this.process_params(value_object, key_with_suffix);
                }
            }
        }
    };

    get_form_data = (): Array<iFormData> => {
        return this.flattened_data
    };
}

export default abstract class ResourceAPIs<iCreationParams extends iBasicResourceCreationParams,
    iResourceList extends iApiBasicResponse,
    iSingleResource extends iApiBasicResponse> extends BaseAPIs {

    // This will be overridden by base classes
    getResourceIdentifier = (): string => "/resource";

    getResourceURL = () => this.getApiBaseURL() + this.getResourceIdentifier();
    getResourceListingURL = () => this.getResourceURL() + "/listing";
    getResourceCreationURL = () => this.getResourceURL();
    getResourceDeletionURL = () => this.getResourceURL() + "/delete";
    getResourceIndexURL = () => this.getResourceURL();
    getResourceStoreURL = () => this.getResourceURL() + "/store";
    getResourceUpdateURL = (uid: string) => this.getResourceURL() + `/${uid}/update`;
    getResourceEnableURL = () => this.getResourceURL() + "/enable";
    getResourceDisableURL = () => this.getResourceURL() + "/disable";

    view = async (uid: string): Promise<iSingleResource> => {
        return axios
            .get(this.getResourceURL() + `/${uid}`, {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iSingleResource => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    listing = async (listingQuery: iListingQuery, cancel_token?: CancelTokenSource): Promise<iResourceList> => {

        return axios
            .get(this.getResourceListingURL(), {
                withCredentials: true,
                params: {
                    ...listingQuery,
                    ts: new Date().getTime()
                },
                cancelToken: cancel_token && cancel_token.token,
            })
            .then((res): iResourceList => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    popup_summary = async ( cancel_token?: CancelTokenSource): Promise<iResourceList> => {

        return axios
            .get(this.getApiBaseURL()+"/popup_summary", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                },
                cancelToken: cancel_token && cancel_token.token,
            })
            .then((res): iResourceList => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    create = async (creationParams: iCreationParams): Promise<iApiBasicResponse> => {
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
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    update = async (uid: string, creationParams: iCreationParams): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("_method", "PATCH");
        let flattenedParams = new ObjectFlatter(creationParams);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceUpdateURL(uid), fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    delete = async (uids: Array<string>): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        const deletionQuery = {
            _token: csrfToken,
            uids: uids.join(',')
        };

        return axios
            .get(this.getResourceDeletionURL(), {
                withCredentials: true,
                params: {
                    ...deletionQuery,
                    ts: new Date().getTime()
                }
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, message: res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
}
