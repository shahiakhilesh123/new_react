import React, {useCallback, useContext, useEffect, useReducer} from "react";
import {Link, useParams} from "react-router-dom";

import EmailMailingListSubscriberAPIs, {iEmailMailingListSubscriberListingResponse,} from "../../../../../apis/Email/email.mailinglists.subscribers.apis";

import {NotificationContext} from "../../../../../App";
import {Reducer} from "redux";
import {
    current_page_change_action,
    failed_action,
    iListResource,
    iListResponseActions,
    listReducer,
    loading_action,
    onSortAction,
    per_page_row_change_action,
    search_action,
    success_action
} from "../../../../../redux/reducers";
import useIsMounted from "ismounted";
import {iEmailMailingListSubscriber} from "../../../../../types/internal/email/mailinglist";
import FormattedDate from "../../../../../components/Utils/FormattedDate";
import {Button, Grid} from "@material-ui/core";
import IconLabelButtons from "../../../../../components/IconLabelButtons/IconLabelButtons";
import EditIcon from "@material-ui/icons/Edit";
import HeadingCol from "../../../../../components/heading/HeadingCol";
import {Alert, Col, Row} from "react-bootstrap";
import CustomDataTable from "../../../../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../../../../components/Loader/AppLoader";
import {FaPlus} from "react-icons/fa";
import {LinkContainer} from "react-router-bootstrap";
import {customStyles} from "../../../../../components/common/common";

function EmailMailingListsSubscribersList() {
    const [response, dispatchList] = useReducer<Reducer<iListResource<iEmailMailingListSubscriberListingResponse>,
        iListResponseActions<iEmailMailingListSubscriberListingResponse>>>
    (listReducer<iListResource<iEmailMailingListSubscriberListingResponse>, any>({}),
        {query: {per_page: 20}, loading: true});
    const params: any = useParams<any>();
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);

    const loadResource = useCallback(() => {
        dispatchList(loading_action());
        new EmailMailingListSubscriberAPIs()
            .setMailingListUid(params.list_uid)
            .setSegmentUid(params.segment_uid)
            .listing(response?.query)
            .then((response) => {
                if (isMounted.current) {
                    if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message));
                    } else {
                        dispatchList(success_action(response));
                    }
                }
            });
    }, [response?.query, params]);

    useEffect(() => {
        loadResource()
    }, [response?.query]);

    const columns = [
        {
            name: "Name",
            cell: (row: iEmailMailingListSubscriber) => {
                return <Link to={`/email/lists/${params.list_uid}/segments/${row.uid}/subscribers`}>

                </Link>
            }
        },
        {
            name: "Created At",
            cell: (row: iEmailMailingListSubscriber) => {
                return <FormattedDate date_string={row.created_at}/>
            }
        },
        {
            name: "Actions",
            grow: 2,
            cell: (row: iEmailMailingListSubscriber) => {
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

                                }}
                            /></Grid>


                        </Grid>


                    </div>
                );
            },
        },


    ];

    return <Row>
        <HeadingCol title="Segments Subscriber" description={""}/>
        <Col md={12}>
            <CustomDataTable
                columns={columns}
                progressPending={response.loading}
                progressComponent={<AppLoader/>}
                data={(response && response.resource && response.resource.subscribers && response.resource.subscribers.data) || []}
                sortServer
                onSort={(column, sortDirection) => {
                    if (typeof column.selector === "string")
                        dispatchList(onSortAction(column.selector, sortDirection))
                }}
                noHeader
                actionButtons={[
                    <Link to={`/email/lists/${params.list_uid}/subscribers/create`}>
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
                            <LinkContainer to={`/email/lists/${params.list_uid}/segments/create`}>
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
    </Row>;

}

export default EmailMailingListsSubscribersList;
