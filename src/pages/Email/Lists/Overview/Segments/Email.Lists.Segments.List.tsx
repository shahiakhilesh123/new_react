import React, {useCallback, useContext, useEffect, useReducer} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import EmailMailingListSegmentAPIs, {iEmailMailingListSegmentListingResponse,} from "../../../../../apis/Email/email.mailinglists.segments.apis";

import {iApiBasicResponse,} from "../../../../../types/api";
import {Alert, Col, Row} from "react-bootstrap";
import FormattedDate from "../../../../../components/Utils/FormattedDate";
import {iEmailMailingListSegment} from "../../../../../types/internal/email/mailinglist";
import {Button, Grid} from "@material-ui/core";
import IconLabelButtons from "../../../../../components/IconLabelButtons/IconLabelButtons";
import EditIcon from "@material-ui/icons/Edit";
import HeadingCol from "../../../../../components/heading/HeadingCol";
import CustomDataTable from "../../../../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../../../../components/Loader/AppLoader";
import {FaPlus} from "react-icons/fa";
import {LinkContainer} from "react-router-bootstrap";
import {customStyles} from "../../../../../components/common/common";
import {Reducer} from "redux";
import {
    current_page_change_action,
    iListResource,
    iListResponseActions,
    listReducer,
    onSortAction,
    per_page_row_change_action,
    search_action
} from "../../../../../redux/reducers";
import useIsMounted from "ismounted";
import {NotificationContext} from "../../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../../components/Breadcrumbs/WithBreadcrumb";


function EmailMailingListsSubscribersListController() {

    const [response, dispatchList] = useReducer<Reducer<iListResource<iEmailMailingListSegmentListingResponse>, iListResponseActions<iEmailMailingListSegmentListingResponse>>>
    (listReducer<iListResource<iEmailMailingListSegmentListingResponse>, any>({}), {
        query: {per_page: 20},
        loading: true
    });


    const isMounted = useIsMounted();
    const history = useHistory();
    const params: any = useParams<any>();

    const notificationContext = useContext(NotificationContext);
    const loadResource = useCallback(() => {
        dispatchList({type: "loading"})
        new EmailMailingListSegmentAPIs()
            .setMailingListUid(params.list_uid)
            .listing(response.query)
            .then((response) => {
                if (isMounted.current) {
                    if (EmailMailingListSegmentAPIs.hasError(response, notificationContext) || !response.segments) {
                        dispatchList({type: "failed", error: EmailMailingListSegmentAPIs.getError(response)})
                    } else {
                        dispatchList({type: "success", resource: response})
                    }
                }
            });
    }, [isMounted]);

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (response && response.resource && response.resource.list) {
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview`,
                    text: response.resource.list.name
                })
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview/segments`,
                    text: "Segments"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [response])

    const deleteResources = (uids: Array<string>) => {
        if (!window.confirm("Click 'OK' to confirm deletion:")) return;

        new EmailMailingListSegmentAPIs()
            .setMailingListUid(params.list_uid)
            .delete(uids)
            .then((response) => onDeleteResourcesResponse(response));
    };

    const onDeleteResourcesResponse = (response: iApiBasicResponse) => {
        if (EmailMailingListSegmentAPIs.hasError(response, notificationContext) || !response.message) {

        } else {
            // Deletion completed successfully
            loadResource();
        }
    };

    useEffect(() => {
        loadResource()
    }, []);
    const columns = [
        {
            name: "Name",
            cell: (row: iEmailMailingListSegment) => {
                return <div>
                    <Link to={`/email/lists/${params.list_uid}/overview/segments/${row.uid}/edit`}>
                        <h6 className={"u500 color1"}>{row.name}</h6>
                    </Link>
                </div>
            }
        },
        {
            name: "Created At",

            cell: (row: iEmailMailingListSegment) => {
                return <FormattedDate date_string={row.created_at}/>
            }
        },
        {
            name: "Actions",
            grow: 2,
            cell: (row: iEmailMailingListSegment) => {
                return (
                    <div>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1}
                        >

                            <Grid item
                            ><IconLabelButtons
                                text="Edit"
                                icon={<EditIcon fontSize="small" color="secondary"/>}
                                color="secondary"
                                onClick={() => {
                                    history.push(`/email/lists/${params.list_uid}/overview/segments/${row.uid}/edit`)
                                }}
                            /></Grid>


                        </Grid>


                    </div>
                );
            },
        },


    ];

    return <Row>
        <HeadingCol title="Segments" description={""}/>
        <Col md={12}>
            <CustomDataTable
                columns={columns}
                progressPending={response.loading}
                progressComponent={<AppLoader/>}
                data={(response && response.resource && response.resource.segments && response.resource.segments.data) || []}
                sortServer
                onSort={(column, sortDirection) => {
                    if (typeof column.selector === "string")
                        dispatchList(onSortAction(column.selector, sortDirection))
                }}
                noHeader
                actionButtons={[
                    <Link to={`/email/lists/${params.list_uid}/overview/segments/create`}>
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            className="positive-button"
                        >
                            <FaPlus/>
                            &nbsp;Add New
                        </Button>
                    </Link>,
                ]}
                onKeywordChange={(a) => {

                    dispatchList(search_action(a))
                }}
                noDataComponent={
                    response.error ? (
                        <Alert variant="danger" className="w-100 mb-0">
                            {response.error}
                        </Alert>
                    ) : (
                        <Alert variant="dark" className="w-100 mb-0">
                            There are no Subscribers.
                            <br/>
                            <LinkContainer to={`/email/lists/${params.list_uid}/overview/segments/create`}>
                                <Alert.Link>Click here</Alert.Link>
                            </LinkContainer>{" "}
                            to create one.
                        </Alert>
                    )
                }

                pagination
                paginationPerPage={response.query.per_page}
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
        ;

}

export default EmailMailingListsSubscribersListController;
