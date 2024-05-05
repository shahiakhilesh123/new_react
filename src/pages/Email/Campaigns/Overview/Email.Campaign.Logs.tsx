import React, {useCallback, useEffect, useReducer, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import EmailCampaignAPIs, {iEmailListResponse, iEmailLog} from "../../../../apis/Email/email.campaigns.apis";
import {Alert, Badge, Col, Row} from "react-bootstrap";
import AppCard from "../../../../components/Card/AppCard";
import AppCardBody from "../../../../components/Card/AppCardBody";
import AppLoader from "../../../../components/Loader/AppLoader";
import {customStyles} from "../../../../components/common/common";
import CustomDataTable from "../../../../components/CustomerDataTable/CustomDataTable";
import FormattedDate from "../../../../components/Utils/FormattedDate";
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
} from "../../../../redux/reducers";
import {Reducer} from "redux";
import DashboardCardInfo from "../../../../components/DashboardCardInfo/DashboardCardInfo";

export type iLogListingAction =
    | { type: "loading" }
    | { type: "failed", error?: string }
    | { type: "success", resource: iEmailListResponse }

export interface iLogListingResource {
    loading: boolean,
    error?: string,
    resource?: iEmailListResponse
}

export function logReducer(state: iLogListingResource, action: iLogListingAction): iLogListingResource {
    switch (action.type) {
        case 'loading':
            return {loading: true};
        case 'failed':
            return {loading: false, error: action.error};
        case 'success':
            return {resource: action.resource, loading: false};
        default:
            return {loading: true};
    }
}

function EmailCampaignLogs() {
    useEffect(() => {
        document.title = "Campaign Logs | Emailwish";
    }, []);
    const params: any = useParams<any>();

    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iEmailListResponse>, iListResponseActions<iEmailListResponse>>>
    (listReducer<iListResource<iEmailListResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 20},
        loading: true,
    });

    const [log_type, setLogType] = useState("");
    const history = useHistory();
    const loadLogs = useCallback((log_type: string) => {
        dispatchList(loading_action())
        new EmailCampaignAPIs()
            .get_log(
                log_type,
                params.uid,
                query).then((res) => {
            if (EmailCampaignAPIs.hasError(res)) {
                dispatchList(failed_action(res.message))
            } else {
                dispatchList(success_action(res))
            }
        })
    }, [query, params])
    useEffect(() => {
        if (["tracking-log",
            "bounce-log",
            "feedback-log",
            "open-log",
            "click-log",
            "unsubscribe-log"
        ].includes(params.log_type) && log_type !== params.log_type) {
            let name = params.log_type;
            name = name.replace("-", " ");
            setLogType(name);
            loadLogs(params.log_type);
        } else {
            history.replace("/email/campaigns/")
        }
    }, [params, query]);

    const columns = [
        {
            name: "Recipient",
            cell: (row: iEmailLog) => {
                return (
                    <div className="">
                        {
                            row.subscriber_name
                        }
                    </div>
                );
            },
        },
        {
            name: "IP Address",
            cell: (row: iEmailLog) => {
                return (
                    <div className="">
                        {
                            row.ip_address
                        }
                    </div>
                );
            },
        },
        {
            name: "Status",
            cell: (row: iEmailLog) => {
                return (
                    <div className="">

                        <Badge variant="success">{row.status}</Badge>
                    </div>
                );
            },
        },
        {
            name: "User Agent",
            cell: (row: iEmailLog) => {
                return (
                    <div className="">
                        {
                            row.user_agent
                        }
                    </div>
                );
            },
        },
        {
            name: "Created at",
            cell: (row: iEmailLog) => {
                return (
                    <div className="">


                        {row.created_at && <FormattedDate date_string={row.created_at} format='MMMM D, YYYY HH:mm'/>}
                    </div>
                );
            },
        },
    ];

    return <Row className="mt-2 campaign-logs">
        <Col md={12} className="mt-2">
            <AppCard>
                <AppCardBody>
                    <h5 className="mt-10 campaign-logs-type">{log_type}</h5>
                    <CustomDataTable
                        columns={columns}
                        progressPending={loading}
                        progressComponent={<AppLoader/>}
                        data={(resource &&
                            resource.logs &&
                            resource.logs.data) || []}
                        sortServer
                        onSort={(column, sortDirection) => {
                            if (typeof column.selector === "string")
                                dispatchList(onSortAction(column.selector, sortDirection))
                        }}
                        noHeader
                        actionButtons={[]}
                        onKeywordChange={(a) => {

                            dispatchList(search_action(a))
                        }}
                        noDataComponent={
                            error ? (
                                <Alert variant="danger" className="w-100 mb-0">
                                    {error}
                                </Alert>
                            ) : (
                                <Alert variant="dark" className="w-100 mb-0">
                                    <DashboardCardInfo text={"There are no records to display."}/>
                                </Alert>
                            )
                        }

                        pagination
                        paginationPerPage={query.per_page}
                        onChangeRowsPerPage={(per_page) => {

                            dispatchList(per_page_row_change_action(per_page))
                        }}
                        customStyles={customStyles}
                        paginationServer
                        onChangePage={(page) => {

                            dispatchList(current_page_change_action(page))
                        }}
                    />
                </AppCardBody>
            </AppCard>
        </Col>

    </Row>
}

export default EmailCampaignLogs;
