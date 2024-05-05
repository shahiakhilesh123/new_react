import axios from 'axios';
import {iApiBasicResponse} from "../types/api";
import {iCountry, iTimezone} from "../types/internal";
import {NotificationDispatch} from "../App";

axios.defaults.validateStatus = () => true;

export interface iCsrfTokenResponse extends iApiBasicResponse {
    token?: string
}

export interface iCountryListResponse extends iApiBasicResponse {
    countries?: Array<iCountry>
}

export interface iTimezoneListResponse extends iApiBasicResponse {
    timezones?: Array<iTimezone>
}

export default class BaseAPIs {
    static timezones: Array<iTimezone> = [];
    static countries: Array<iCountry> = [];

    static hasError = (response: iApiBasicResponse, notificationDispatcher?: NotificationDispatch) => {
        notificationDispatcher && notificationDispatcher.pushNotification(response);
        if (response && response.statusCode >= 400) return true;
        if (response && response.errors) return true;
    };
    static hasErrorNotification = (response: iApiBasicResponse) => {
        if (response && response.statusCode >= 400) return true;
        if (response && response.errors) return true;
    };

    static getError = (response: iApiBasicResponse): string => {
        if (response.message) return response.message;
        if (!response.errors) return BaseAPIs.getErrorFromStatusCode(response);
        if (response.errors.csrf) return BaseAPIs.getErrorString(response.errors.csrf);
        if (response.errors.network) return BaseAPIs.getErrorString(response.errors.network);

        if (response.errors.email) return BaseAPIs.getErrorString(response.errors.email);
        if (response.errors.password) return BaseAPIs.getErrorString(response.errors.password);

        if (response.errors.name) return BaseAPIs.getErrorString(response.errors.name);
        return "Unknown error!";
    };

    static getErrorFromStatusCode = (response: iApiBasicResponse): string => {
        switch (response.statusCode) {
            case 400:
                return "Request error: Bad Request";
            case 401:
                return "Request error: Unauthorized";
            case 402:
                return "Request error: Payment Required";
            case 403:
                return "Request error: Forbidden";
            case 404:
                return "Request error: Not Found";
            case 405:
                return "Request error: Method Not Allowed";
            case 500:
                return "Server error: Internal error";
            case 501:
                return "Server error: Not Implemented";
            case 502:
                return "Server error: Bad Gateway";
            case 503:
                return "Server error: Service Unavailable";
            case 504:
                return "Server error: Gateway Timeout";
            default:
                return "Unknown error";
        }
    };

    private static getErrorString(error: string | Array<string>) {
        if (typeof error === "string") return error;
        else return error.join(" ");
    }

    handleCatch = (error: any) => {

        if (error && error.response && error.response.status && error.response.data) {
            return {
                ...error.response.data, statusCode: error.response.status
            }
        } else if (error instanceof axios.Cancel) {
            return {statusCode: 999, message: undefined};
        } else {
            return {statusCode: 999, message: "Network Error"};
        }
    }

    getApiBaseURL = () => {
        return process.env.REACT_APP_SERVER_PATH;
    };

    getFrontEndApiBaseURL = () => {
        const DEBUG = process.env.NODE_ENV !== 'production';
        const DEBUG_URL = process.env.REACT_APP_SERVER_PATH+":3000";
        const PROD_URL = process.env.REACT_APP_FRONTEND_PATH;
        return DEBUG ? DEBUG_URL : PROD_URL;
    };

    getPopupImageHostURL = () => {
        return "https://builder.emailwish.com"
    };

    getCsrfToken = async (): Promise<string> => {
        return this.fetchCsrfToken().then((r: iCsrfTokenResponse) => {

            if (BaseAPIs.hasError(r, undefined) || !r.token) {
                return "";
            } else {
                return r.token;
            }
        })
    };

    post = async (url: string, fd?: any): Promise<any> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, message: "Network error!"};
        let data: any = {};
        if (fd) {
            data = {...fd}
            data["_token"] = csrfToken;
        } else {
            data["_token"] = csrfToken;
        }
        return axios
            .post(this.getApiBaseURL() + url, data, {
                headers: {"Content-Type": "application/json"},
                withCredentials: true,
            })
            .then((res): any => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                if (error && error.response && error.response.status && error.response.data) {
                    return {
                        message: "Network Error", ...error.response.data, statusCode: error.response.status
                    }
                } else {
                    return {statusCode: 999, message: "Network Error"};
                }
            })
    };

    fetchCsrfToken = (): Promise<iCsrfTokenResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/common-resources/csrf-token", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iCsrfTokenResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iCsrfTokenResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    };

    getTimeZones = async (): Promise<Array<iTimezone>> => {
        if (BaseAPIs.timezones.length > 0) {
            return BaseAPIs.timezones;
        } else {
            return this.fetchTimeZones().then((r: iTimezoneListResponse) => {
                if (BaseAPIs.hasError(r, undefined) || !r.timezones) {
                    return [];
                } else {
                    BaseAPIs.timezones = r.timezones;
                    return BaseAPIs.timezones;
                }
            })
        }
    };

    fetchTimeZones = (): Promise<iTimezoneListResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/common-resources/timezones", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iTimezoneListResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iTimezoneListResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    };

    getCountries = async (): Promise<Array<iCountry>> => {
        if (BaseAPIs.countries.length > 0) {
            return BaseAPIs.countries;
        } else {
            return this.fetchCountries().then((r: iCountryListResponse) => {
                if (BaseAPIs.hasError(r, undefined) || !r.countries) {
                    return [];
                } else {
                    BaseAPIs.countries = r.countries;
                    return BaseAPIs.countries;
                }
            })
        }
    };

    fetchCountries = (): Promise<iCountryListResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/common-resources/countries", {
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iCountryListResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iCountryListResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    };

    getCustomerAvatarURL = (uid: string | undefined, updated_at: string | undefined) => {
        return this.getApiBaseURL() + `/assets/images/avatar/customer-${uid}.jpg?t=${updated_at}`;
    };

    // noinspection JSUnusedGlobalSymbols
    getSubscriberAvatarURL = (uid: string) => {
        return this.getApiBaseURL() + `/assets/images/avatar/subscriber-${uid}.jpg`;
    };

    // noinspection JSUnusedGlobalSymbols
    getAdminAvatarURL = (uid?: string) => {
        return this.getApiBaseURL() + `/assets/images/avatar/admin-${uid}.jpg`;
    };
}
