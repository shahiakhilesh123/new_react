import React, {useContext, useEffect, useCallback, useReducer, useState} from "react";
import { Button } from "@material-ui/core";
import {Alert, Col, Row, Spinner, Badge} from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import EmailMailingListSubscriberAPIs, {
    SystemJob,
    SystemJobResponseList,
} from "../../../../../apis/Email/email.mailinglists.subscribers.apis";
import {AppStateContext, NotificationContext} from "../../../../../App";
import useIsMounted from "ismounted";
import FormattedDate from "../../../../../components/Utils/FormattedDate";
import CustomDataTable from "../../../../../components/CustomerDataTable/CustomDataTable";
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
    success_action,
} from "../../../../../redux/reducers";
import AppLoader from "../../../../../components/Loader/AppLoader";
import useInterval from "use-interval";
import {customStyles} from "../../../../../components/common/common";
import UserAPIs from "../../../../../apis/user.apis";
import { UpgradePlanWarning } from "../../../../../components/UpgradePlanWrapper/UpgradePlanWrapper";

export default function EmailListSubscribersExport() {
    useEffect(() => {
        document.title = "Export Subscriber | Emailwish";
    }, []);
    const {shop} = useContext(AppStateContext);
    let [can_export, setExport] = useState(true);
    useEffect(() => {
        if (shop && shop.customer && shop.customer.plan) {
            const options = JSON.parse(shop.customer.plan.options)
            if (options && options["list_export"] === "no") {
                setExport(false);
            }
        }
    }, [shop]);
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);
    const params: any = useParams<any>();

    const [response, dispatchList] = useReducer<Reducer<iListResource<SystemJobResponseList>,
        iListResponseActions<SystemJobResponseList>>>(listReducer<iListResource<SystemJobResponseList>, any>({}), {
        query: {sort_direction: "desc", sort_order: "created_at"},
        loading: true,
    });

    const loadResource = useCallback(() => {
        dispatchList(loading_action());

        new EmailMailingListSubscriberAPIs()
            .export_list(params.list_uid, response?.query)
            .then((res) => {
                if (isMounted.current) {
                    if (EmailMailingListSubscriberAPIs.hasError(res)) {
                        dispatchList(failed_action(res.message));
                    } else {
                        dispatchList(success_action(res));
                    }
                }
            });
    }, [isMounted, params, response?.query]);


    useInterval(
        () => {
            loadResource();
        },
        5000,
        true
    );
    const columns = [
        {
            name: "Created at",
            cell: (row: SystemJob) => <FormattedDate date_string={row.created_at}/>,
        },
        {
            name: "Updated at",
            cell: (row: SystemJob) => <div style={{fontSize: "12px"}}><FormattedDate date_string={row.updated_at}/>
            </div>,
        },
        {
            name: "Status",
            cell: (row: SystemJob) => (
                <Badge variant={row.status === "failed" ? "danger" : "info"}>
                    {row.status}
                </Badge>
            ),
        },
        {
            name: "Download",
            cell: (row: SystemJob) =>
                    row.status === "done" ?
                    <Button
                        color="primary"
                        onClick={() => new EmailMailingListSubscriberAPIs().export_download(row.id) }>
                        Download
                    </Button> : 
                    <Spinner animation="border" size="sm" />
        }
    ];
    return (
        <div className="mt-2">
            <div style={{
                marginLeft: "50px"
            }}>
                <Row>
                    <Col xl={6} lg={6} md={6} sm={12}>
                        <h4>+ Export Subscribers</h4>
                    </Col>
                </Row>
                <Alert variant="info">
                    Export subscriber list in CSV format.
                </Alert>
                <UpgradePlanWarning feature_name="list_export" />
            </div>
            <Col md={12} className="mt-2">
                <Row className="justify-content-end">
                    <Button
                        data-tut="reactour__export_subscriber"
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => {
                            new EmailMailingListSubscriberAPIs()
                                .export(params.list_uid)
                                .then((res) => {
                                    if (isMounted.current) {
                                        if (
                                            EmailMailingListSubscriberAPIs.hasError(
                                                res,
                                                notificationContext
                                            )
                                        ) {
                                            console.log("Error Response"); 
                                        } else {
                                            console.log("Success Response");
                                        }
                                    }
                                });
                        }}
                        disabled={!can_export}
                    >
                       Create Export
                    </Button>
                </Row>
                <CustomDataTable
                    columns={columns}
                    progressComponent={<AppLoader/>}
                    data={
                        (response &&
                            response.resource &&
                            response.resource.system_jobs &&
                            response.resource.system_jobs.data) ||
                        []
                    }
                    sortServer
                    onSort={(column, sortDirection) => {
                        if (typeof column.selector === "string")
                            dispatchList(onSortAction(column.selector, sortDirection));
                    }}
                    actionButtons={[
                    ]}
                    onKeywordChange={(a) => {
                        dispatchList(search_action(a));
                    }}
                    noSearchFilter
                    noDataComponent={
                        response.error ? (
                            <Alert variant="danger" className="w-100 mb-0">
                                {response.error}
                            </Alert>
                        ) : (
                            <Alert variant="dark" className="w-100 mb-0 text-center">
                                There are no export logs.
                            </Alert>
                        )
                    }
                    pagination
                    paginationPerPage={response.query.per_page}
                    onChangeRowsPerPage={(per_page) => {
                        dispatchList(per_page_row_change_action(per_page));
                    }}
                    paginationServer
                    onChangePage={(page) => {
                        dispatchList(current_page_change_action(page));
                    }}
                    subHeaderComponent={<h5>Recent Exports</h5>}
                    subHeader
                    subHeaderAlign="left"
                    noHeader={true}
                    customStyles={customStyles}
                />
            </Col>
        </div>
    );
}
