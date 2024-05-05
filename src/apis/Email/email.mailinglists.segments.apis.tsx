import {
    iEmailMailingList,
    iEmailMailingListField,
    iEmailMailingListSegment,
    iEmailMailingListSegmentCondition
} from "../../types/internal/email/mailinglist";
import {iApiBasicResponse, iBasicListingResponse, iBasicResourceCreationParams} from "../../types/api";
import ResourceAPIs from "../resource.apis";


export interface iEmailMailingListSegmentListingResponse extends iApiBasicResponse {
    segments?: iBasicListingResponse<iEmailMailingListSegment>
    list?: iEmailMailingList
}

export interface iEmailMailingListSegmentShowResponse extends iApiBasicResponse {
    segment?: iEmailMailingListSegment
    fields?: iEmailMailingListField[]
    list?: iEmailMailingList
}

export interface iEmailMailingListSegmentCreateParams extends iBasicResourceCreationParams {
    // @ts-ignore
    conditions: iEmailMailingListSegmentCondition[]
}


export default class EmailMailingListSegmentAPIs extends ResourceAPIs<iEmailMailingListSegmentCreateParams,
    iEmailMailingListSegmentListingResponse, iEmailMailingListSegmentShowResponse> {
    list_uid: string = "";

    setMailingListUid = (uid: string) => {
        this.list_uid = uid;
        return this;
    };

    getResourceIdentifier = () => `/lists/${this.list_uid}/segments`;
    getResourceCreationURL = () => this.getResourceURL() + `/store`;
}
