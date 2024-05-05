import {iEmailTemplate, iEmailTemplateLayout} from "../../types/internal";
import {
    getEmptyApiListingQuery,
    iApiBasicResponse,
    iBasicListingResponse,
    iBasicResourceCreationParams
} from "../../types/api";
import ResourceAPIs, {ObjectFlatter} from "../resource.apis";
import axios from "axios";

export interface iEmailTemplateListingResponse extends iApiBasicResponse {
    templates?: iBasicListingResponse<iEmailTemplate>
}

export interface iEmailTemplateViewResponse extends iApiBasicResponse {
    template?: iEmailTemplate
}

export interface iEmailTemplateLayoutsResponse extends iApiBasicResponse {
    template_layouts?: iEmailTemplateLayout[]
}

export interface iEmailTemplateCreateParams extends iBasicResourceCreationParams {
    name: string
    layout: string
    template: string
}

export interface iEmailTemplateUploadParams {
    name: string
    file: File
}

export default class EmailTemplateAPIs extends ResourceAPIs<iEmailTemplateCreateParams,
    iEmailTemplateListingResponse, iEmailTemplateViewResponse> {
    getResourceIdentifier = () => "/templates";
    getExternalEditorURL = (uid: string) => this.getResourceURL() + `/${uid}/builder/edit`;
    getEditURL = (uid: string) => this.getResourceURL() + `/${uid}/edit`;
    getExternalCampaignEditorURL = (uid: string) => this.getApiBaseURL() + `/campaigns/${uid}/template/edit`;
    getPreviewURL = (uid: string) => this.getResourceURL() + `/${uid}/preview`;

    create_template = async (creationParams: iEmailTemplateCreateParams): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        let flattenedParams = new ObjectFlatter(creationParams);
        flattenedParams.get_form_data().forEach(entry => {
            fd.set(entry.key, entry.value);
        });
        return axios
            .post(this.getResourceURL() + "/builder/create", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    upload_template = async (uploadParams: any): Promise<iApiBasicResponse> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("name", uploadParams.name);
        fd.set("file", uploadParams.file);
        return axios
            .post(this.getResourceURL() + "/upload", fd, {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

    getTemplatesFromGallery = (page: number) => {
        const query = getEmptyApiListingQuery();
        query.filters.from = "gallery";
        query.page = page;
        return this.listing(query);
    };

    getTemplateLayouts = async (): Promise<iEmailTemplateLayoutsResponse> => {
        return axios
            .get(this.getResourceURL() + "/builder/templateLayouts", {
                headers: {"Content-Type": "application/x-www-form-urlencoded"},
                withCredentials: true,
                params: {
                    ts: new Date().getTime()
                }
            })
            .then((res): iEmailTemplateLayoutsResponse => ({statusCode: res.status, ...res.data}))
            .catch((): iEmailTemplateLayoutsResponse => ({statusCode: 999, errors: {network: "Network error!"}}))
    };

    getLayoutImage = (layout: string): string => {
        return this.getApiBaseURL() + `/images/template_styles/${layout}.png`
    };

    getTemplateImage = (template_id: string): string => {
        return this.getApiBaseURL() + `/templates/${template_id}/image?v=1`
    }

    getTemplateThumbImage = (template_id: string): string => {
        return this.getApiBaseURL() + `/assets/templates/${template_id}/thumb.png?v=2`
    }


}
