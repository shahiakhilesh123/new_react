import axios from 'axios';
import BaseAPIs from "../base.apis";
import {
    iEmailDashboardActivity,
    iEmailDashboardTopClick,
    iEmailDashboardTopLink,
    iEmailDashboardTopOpen
} from "../../types/internal";
import {iApiBasicResponse} from "../../types/api";
import {iEmailCampaign} from "../../types/internal/email/campaign";

export interface iCredUsageStats {
    progress: number
    progress_text: string
    quota: string
    used: number
}

export interface iCreditUsedLimit {
    progress: number
    progress_text: string
    quota: string
    used: number
}

export interface iCreditUsage {
    campaigns: iCredUsageStats,
    lists: iCreditUsedLimit,
    sending_limit: iCredUsageStats,
    subscribers: iCredUsageStats
}

export interface iEmailDashboardResponse extends iApiBasicResponse {
    top_opens?: iEmailDashboardTopOpen[]
    top_clicks?: iEmailDashboardTopClick[]
    top_links?: iEmailDashboardTopLink[]
    recent_campaigns?: iEmailCampaign[]
    activities?: iEmailDashboardActivity[],
    credit_usage?: iCreditUsage
}

export default class EmailDashboardAPIs extends BaseAPIs {
    dashboard = async (): Promise<iEmailDashboardResponse> => {
        return axios
            .get(this.getApiBaseURL() + "/email_dashboard", {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmailDashboardResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };
    credits_usage = async (): Promise<iCreditUsage> => {
        return axios.get(this.getApiBaseURL() + "/credits_usage", {
            withCredentials: true,
        })
        .then((res): iCreditUsage => ({statusCode: res.status, ...res.data}))
        .catch((error): any => {
            return this.handleCatch(error);
        });
    }
}
