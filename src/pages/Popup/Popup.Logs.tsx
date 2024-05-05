import * as React from "react";
import {useCallback, useContext, useEffect, useReducer} from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import HeadingCol from "../../components/heading/HeadingCol";
import CustomDataTable from "../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../components/Loader/AppLoader";
import {customStyles} from "../../components/common/common";
import PopupAPIs, {PopupLogBasicResponse} from "../../apis/Popup/popup.apis";
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
} from "../../redux/reducers";
import {Reducer} from "redux";
import {Grid} from "@material-ui/core";

import AsyncSelect from "react-select/async";
import {useHistory, useLocation} from "react-router-dom";
import Axios, {CancelTokenSource} from "axios";
import v4 from "uuid/v4";
import {NotificationContext} from "../../App";

function PopupLogs() {
    useEffect(() => {
        document.title = "Popup Logs | Emailwish";
    }, []);
    const location = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(location.search)

    const [logs, dispatchList] = useReducer<Reducer<iListResource<PopupLogBasicResponse>, iListResponseActions<PopupLogBasicResponse>>>
    (listReducer<iListResource<PopupLogBasicResponse>, any>({}), {query: {per_page: 20}, loading: true});
    const [selectedPopup, setSelectedPopup] = React.useState<any>([]);

    const notificationContext = useContext(NotificationContext);
    const loadPopups = useCallback((query: any, cancel_token: CancelTokenSource) => {
        dispatchList(loading_action())
        new PopupAPIs().popup_logs(query, cancel_token).then((res) => {
            if (PopupAPIs.hasError(res, notificationContext)) {
                dispatchList(failed_action(res.message))
            } else {
                dispatchList(success_action(res))
                setSelectedPopup(res.selected_popups)
            }
        })
    }, [])
    const showNoOptionsMessage = useCallback((val: any) => {
        let iVal = val.inputValue;
        if (!iVal.length) return "Type to search...";
        else return "No results";
    }, []);
    const loadTitles = useCallback((title: string) => {
        return new PopupAPIs().search_popup_title(title).then((res) => {
            if (PopupAPIs.hasError(res, notificationContext)) {
                return []
            } else {
                return res.results
            }
        });
    }, []);
    useEffect(() => {
        let source = Axios.CancelToken.source();
        const query = new URLSearchParams(location.search)
        loadPopups({query,...logs.query}, source)
        return () => {
            source.cancel();
        }
    }, [logs.query, location.search])
    const columns = [
        {
            name: "Popup Name",
            selector: "popup_title"
        },
        {
            name: "Email",
            selector: "email"
        },
        {
            name: "First name",
            selector: "first_name"
        },
        {
            name: "Last name",
            selector: "last_name"
        },
    ];
    return <Row className="popup-list">
        <HeadingCol title="Popup Logs" description={"All the popup subscription logs can be managed here"}/>
        <Col md={12}>
            <Form>
                <Grid direction="row" container>
                    <Grid direction="row" container item md={6}>
                        <Grid item>
                            <div className="ml-2 " style={{width: 220}}>
                                <div>
                                    <AsyncSelect

                                        value={selectedPopup}
                                        isMulti
                                        cacheOptions
                                        noOptionsMessage={showNoOptionsMessage}

                                        onChange={(item: any) => {
                                            let _a: string[] = [];
                                            if (item) {
                                                item.forEach((value: any) => {
                                                    _a.push(value.value.toString());
                                                })
                                                if (_a.length) {
                                                    query.set("popup_ids", _a.join(","));
                                                    history.push({
                                                        pathname: location.pathname,
                                                        key: v4(),
                                                        search: "?" + query.toString()
                                                    })
                                                }
                                                setSelectedPopup(item)
                                            } else {
                                                query.set("popup_ids", "");
                                                history.push({
                                                    pathname: location.pathname,
                                                    key: v4(),
                                                    search: "?" + query.toString()
                                                })
                                                setSelectedPopup(item)
                                            }

                                        }
                                        }
                                        loadOptions={loadTitles}
                                        name="Titles"
                                        className="basic-multi-select"
                                        classNamePrefix="select"/>
                                </div>
                            </div>
                        </Grid>
                    </Grid>

                </Grid>
            </Form>
        </Col>
        <Col md={12}>
            <CustomDataTable
                columns={columns}
                noSearchFilter={true}
                progressPending={logs.loading}
                progressComponent={<AppLoader/>}
                data={(logs && logs.resource && logs.resource.items && logs.resource.items.data) || []}
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
                    logs.error ? (
                        <Alert variant="danger" className="w-100 mb-0">
                            {logs.error}
                        </Alert>
                    ) : (
                        <Alert variant="dark" className="w-100 mb-0">
                            There are no Popup responses.
                        </Alert>
                    )
                }
                paginationTotalRows={logs.resource && logs.resource.items && logs.resource.items.total}
                pagination
                paginationPerPage={logs.query.per_page}
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

export default PopupLogs;
