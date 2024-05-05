import {iCollectionElement} from "../internal";

export interface iLog extends iCollectionElement {
    customer_id: string
    type: string
    name: string
    data: string
}
