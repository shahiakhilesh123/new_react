import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams} from "../../types/api";
import {iGallery} from "../../types/internal/gallery/gallery";
import ResourceAPIs from "../resource.apis";
import axios from "axios";

export interface iGalleryListingResponse extends iApiBasicResponse {
    images?: iBasicListingResponse<iGallery>
}

export interface iGalleryViewResponse extends iApiBasicResponse {
    image?: iGallery
}

export interface iGalleryCreateParams extends iBasicResourceCreationParams {
    image: any
}

export default class GalleryAPIs extends ResourceAPIs<iGalleryCreateParams,
    iGalleryListingResponse, iGalleryViewResponse> {

    getResourceIdentifier = () => "/gallery_images";
    create = async (image: any): Promise<any> => {
        let csrfToken: string = await this.getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        let fd = new FormData();
        fd.set("_token", csrfToken);
        fd.set("image", image);

        return axios
            .post(this.getResourceCreationURL(), fd, {
                headers: {"Content-Type": "multipart/form-data"},
                withCredentials: true,
            })
            .then((res): iApiBasicResponse => ({statusCode: res.status, ...res.data}))
            .catch((error): any => {
                return this.handleCatch(error);
            })
    };

}
