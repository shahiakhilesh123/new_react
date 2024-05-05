import React, {useCallback, useContext, useEffect, useReducer} from "react";

import AccountLogsAPIs, {iLogListingResponse,} from "../../../apis/Account/logs.apis";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../../components/Loader/AppLoader";
import {Alert} from "react-bootstrap";
import {iLog} from "../../../types/Account/logs";
import FormattedDate from "../../../components/Utils/FormattedDate";
import {Reducer} from "redux";
import {iListResource, iListResponseActions, listReducer} from "../../../redux/reducers";
import useIsMounted from "ismounted";
import {NotificationContext} from "../../../App";

function AccountLogs() {
    useEffect(() => {
        document.title = "Logs | Emailwish";
    }, []);
    const [response, dispatchResponse] = useReducer<Reducer<iListResource<iLogListingResponse>, iListResponseActions<iLogListingResponse>>>
    (listReducer<iListResource<iLogListingResponse>, any>({}), {query: {per_page: 20}, loading: true});
    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const columns = [
        {
            name: "Date and Time",
            selector: "created_at",
            sortable: true,
            grow: 1,
            cell: (row: iLog) => <FormattedDate date_string={row.created_at}/>,
        },
        {
            name: "Event",
            selector: "type",
            sortable: true,
            grow: 1,
        },
        {
            name: "Name",
            selector: "name",
            sortable: true,
            grow: 1,
        },
    ];
    const listResource = useCallback(() => {
        dispatchResponse({type: "loading"})
        new AccountLogsAPIs()
            .listing(response.query)
            .then((response) => {
                if (isMounted.current) {
                    if (AccountLogsAPIs.hasError(response, notificationContext) || !response.logs) {
                        dispatchResponse({type: "failed", error: AccountLogsAPIs.getError(response)})
                    } else {
                        dispatchResponse({type: "success", resource: response})
                    }
                }
            });
    }, [isMounted]);
    useEffect(() => {
        listResource()
    }, [])
    const {loading, resource, query, error} = response;
    return (
        <div className="mt-2">
            <CustomDataTable
                columns={columns}
                progressPending={loading}
                progressComponent={<AppLoader/>}
                data={(resource && resource.logs?.data) || []}
                sortServer
                onSort={(column, sortDirection) => {

                }}
                actionButtons={[]}
                noHeader
                onKeywordChange={(a) => {

                }}
                noDataComponent={
                    error ? (
                        <Alert variant="danger" className="w-100 mb-0">
                            {error}
                        </Alert>
                    ) : (
                        <Alert variant="dark" className="w-100 mb-0">
                            There are no logs.
                            <br/>
                        </Alert>
                    )
                }

                pagination
                paginationPerPage={query.per_page}
                onChangeRowsPerPage={(per_page) => {

                }}
                paginationServer
                onChangePage={(page) => {

                }}
            />
        </div>

    );
}

export default AccountLogs;
