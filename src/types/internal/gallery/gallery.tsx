import {iCollectionElement} from "../index";

export interface iGallery extends iCollectionElement {
    customer_id: string,
    path: string,
    public_path: string,
    public_thumbnail_path: string,
}
