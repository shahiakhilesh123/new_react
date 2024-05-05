import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {useParams} from "react-router-dom";
import {Alert, Col, Row} from "react-bootstrap";
import HeadingCol from "../../../../components/heading/HeadingCol";
import CustomDataTable from "../../../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../../../components/Loader/AppLoader";
import {LinkContainer} from "react-router-bootstrap";
import {customStyles} from "../../../../components/common/common";
import useIsMounted from "ismounted";
import {Reducer} from "redux";
import {
    current_page_change_action,
    failed_action,
    iListResource,
    iListResponseActions,
    listReducer,
    loading_action,
    per_page_row_change_action,
    search_action,
    success_action
} from "../../../../redux/reducers";
import {NotificationContext} from "../../../../App";
import {iEmailMailingListSubscriber} from "../../../../types/internal/email/mailinglist";
import FormattedDate from "../../../../components/Utils/FormattedDate";
import EmailSegmentationAPIs, {iEmailSegment} from "../../../../apis/Email/email.segmentation";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";
import Axios, {CancelTokenSource} from "axios";
import {iApiBasicResponse, iBasicListingResponse} from "../../../../types/api";
import sync from "../../../../assets/images/syncing.gif";

export interface iSegmentSubscriber {
    subscriber?: iEmailMailingListSubscriber
}

export interface iSegmentSubscriberListing extends iApiBasicResponse {
    customers?: iBasicListingResponse<iSegmentSubscriber>
}

function EmailSegmentationSubscribersList() {
    useEffect(() => {
        document.title = "Segmentation Subscriber Lists | Emailwish";
    }, []);
    const params: any = useParams<any>();
    const isMounted = useIsMounted();
    const [{
        loading,
        query,
        error,
        resource
    }, dispatchList] = useReducer<Reducer<iListResource<iSegmentSubscriberListing>, iListResponseActions<iSegmentSubscriberListing>>>
    (listReducer<iListResource<iSegmentSubscriberListing>, any>({}), {query: {per_page: 20}, loading: true});

    const notificationContext = useContext(NotificationContext);

    const loadResource = useCallback((source?: CancelTokenSource) => {
        dispatchList(loading_action())
        new EmailSegmentationAPIs().loadSubscribers(params.segment_uid, query).then((response) => {
            if (isMounted.current) {
                if (EmailSegmentationAPIs.hasError(response, notificationContext)) {
                    dispatchList(failed_action(response.message))
                } else {

                    dispatchList(success_action(response))
                    setSegment2(response.segment2)
                }
            }
        })
    }, [isMounted, query]);


    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            loadResource(source);
        }
        return () => {
            source.cancel();
        }
    }, [query])


    const columns = [
        {
            name: "Email",
            selector: "email"
        },
        {
            name: "Created at",
            cell: (row: iEmailMailingListSubscriber) => <FormattedDate date_string={row.created_at}/>,
        },
        {
            name: "Updated at",
            cell: (row: iEmailMailingListSubscriber) => <FormattedDate date_string={row.updated_at}/>,
        },
    ];

    useEffect(() => {
        loadResource();
    }, []);

    const [segment2, setSegment2] = useState<iEmailSegment | undefined>();

    const breadcrumb = useContext(BreadCrumbContext);

    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/segments",
                text: "Segments"
            })
            if (segment2) {
                links.push({
                    link: `/email/segments/${segment2.id}/overview`,
                    text: segment2.name
                })
                links.push({
                    link: `/email/segments/${segment2.id}/overview/subscribers`,
                    text: "Subscribers"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [segment2])

    return (
        <Row>
            <HeadingCol title="Subscribers" description={""}
                        right={segment2 && segment2.sync_needed && <div style={{paddingTop: "8px"}}>
                  <span>
                    Syncing...
                </span>
                            <img src={sync} alt="Syncing.." style={{width: "30px", objectFit: "contain"}}/>
                        </div>}/>
            <Col md={12}>
                <CustomDataTable
                    columns={columns}
                    progressPending={loading}
                    progressComponent={<AppLoader/>}
                    data={(resource && resource.customers && resource.customers.data) || []}
                    sortServer
                    noHeader

                    paginationTotalRows={resource && resource.customers && resource.customers.total}
                    onKeywordChange={(a) => {

                        dispatchList(search_action(a))
                    }}
                    actionButtons={[]}
                    noDataComponent={
                        error ? (
                            <Alert variant="danger" className="w-100 mb-0">
                                {error}
                            </Alert>
                        ) : (
                            <Alert variant="dark" className="w-100 mb-0">
                                There are no Subscribers.
                                <br/>
                                <LinkContainer to={`/email/segments/${params.segment_uid}/overview/edit`}>
                                    <Alert.Link>Change Segmentation conditions</Alert.Link>
                                </LinkContainer>{" "}
                                to see subscribers
                            </Alert>
                        )
                    }

                    pagination
                    paginationPerPage={query.per_page}
                    onChangeRowsPerPage={(per_page) => {

                        dispatchList(per_page_row_change_action(per_page))
                    }}
                    paginationServer
                    onChangePage={(page) => {

                        dispatchList(current_page_change_action(page))
                    }}

                    customStyles={customStyles}
                />
            </Col>
        </Row>
    );
}

export default EmailSegmentationSubscribersList;
