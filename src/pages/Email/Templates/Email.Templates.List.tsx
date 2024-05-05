import {Button, FormControlLabel, Switch, Grid, IconButton, ListItemIcon, ListItemText,} from "@material-ui/core";
import {MoreHoriz, ZoomIn} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios, {CancelTokenSource} from "axios";
import useIsMounted from "ismounted";
import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Alert, Col, Dropdown, Row} from "react-bootstrap";
import {FaPlus, FaTrash, FaUpload} from "react-icons/fa";
import {LinkContainer} from "react-router-bootstrap";
import {Link, useHistory} from "react-router-dom";
import EmailTemplateAPIs, {iEmailTemplateListingResponse,} from "../../../apis/Email/email.templates.apis";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import HeadingCol from "../../../components/heading/HeadingCol";
import AppLoader from "../../../components/Loader/AppLoader";
import FormattedDate from "../../../components/Utils/FormattedDate";
import {iEmailTemplate} from "../../../types/internal";
import {customStyles} from "../../../components/common/common";
import {NotificationContext} from "../../../App";
import {AppModalContext} from "../../../components/Modal/CustomModal";
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
} from "../../../redux/reducers";
import {Reducer} from "redux";
import {getSortOrder, saveSortOrder} from "../../../components/utils";

const list_sort_key = "ew_template_list_sort";

function EmailTemplatesList() {
    useEffect(() => {
        document.title = "Templates | Emailwish";
    }, []);

    const [showDefaults, setShowDefaults] = useState("gallery");
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iEmailTemplateListingResponse>, iListResponseActions<iEmailTemplateListingResponse>>>
    (listReducer<iListResource<iEmailTemplateListingResponse>, any>({}), {
        query: {
            from: "gallery",
            sort_order: "created_at",
            sort_direction: "desc",
            per_page: 20, ...getSortOrder(list_sort_key)
        },
        loading: true,
    });

    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const history = useHistory();

    const modalContext = useContext(AppModalContext);
    //@ts-ignore
    const CustomToggle = React.forwardRef(({children, onClick}, ref: any) => (
        <a
            href=""
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
        >
            {children}
        </a>
    ));

    const loadResource = useCallback(
        (source?: CancelTokenSource) => {
            dispatchList(loading_action())
            new EmailTemplateAPIs().listing(query, source).then((response) => {
                if (isMounted.current) {
                    if (EmailTemplateAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message))
                    } else {
                        dispatchList(success_action(response))
                    }
                }
            });
        },
        [isMounted, query]
    );


    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {

            saveSortOrder(list_sort_key, query)
            loadResource(source);
        }
        return () => {
            source.cancel();
        };
    }, [query]);

    const [selectedRow, setSelectedRow] = useState<iEmailTemplate[]>();
    const columns = [
        {
            name: "Name",
            selector: "name",
            grow: 2,
            cell: (row: iEmailTemplate) => {
                return (
                    <Grid
                        container
                        spacing={2}
                        direction="row"
                        justifyContent="flex-start"
                        alignItems="center"
                    >
                        <Grid item>
                            <a
                                href={new EmailTemplateAPIs().getPreviewURL(row.uid)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    style={{width: "100px", height: "auto"}}
                                    src={
                                        new EmailTemplateAPIs().getApiBaseURL() + (row.image ? row.image : "/assets/images/placeholder.jpg")
                                    }
                                    alt="Image"
                                    width={100}
                                    height={100}
                                />
                            </a>
                        </Grid>
                        <Grid item>
                            <a
                                href={new EmailTemplateAPIs().getPreviewURL(row.uid)}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <h6 className="u500 color1">{row.name}</h6>
                            </a>
                        </Grid>
                    </Grid>
                );
            },
        },
        {
            name: "Created at",
            selector: "created_at",
            grow: 0.5,
            cell: (row: iEmailTemplate) => {
                return (
                    <>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            <FormattedDate date_string={row.created_at}/>
                        </Grid>

                    </>
                );
            },
        },
        {
            name: "Update at",
            selector: "updated_at",
            grow: 0.5,
            cell: (row: iEmailTemplate) => {
                return (
                    <>
                        <Grid
                            container
                            direction="row"
                            justifyContent="flex-start"
                            alignItems="flex-start"
                        >
                            <FormattedDate date_string={row.updated_at}/>
                        </Grid>

                    </>
                );
            },
        },
        {
            name: "Actions",
            grow: 1,
            cell: (row: iEmailTemplate) => {
                return (
                    <div>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={2}
                        >
                            <Button
                                color="primary"
                                variant="outlined"
                                className="mr-1"
                                onClick={() => {
                                    if(row.customer_id == null) {
                                        // copy template to customer
                                        new EmailTemplateAPIs().create_template({
                                            name: row.name,
                                            layout: "",
                                            template: row.uid,
                                        }).then((res) => {
                                            if (EmailTemplateAPIs.hasError(res, notificationContext)) { }
                                            if(res.uid)
                                                window.location.href = new EmailTemplateAPIs().getEditURL(res.uid);
                                        })
                                    } else {
                                        window.location.href = new EmailTemplateAPIs().getEditURL(row.uid);
                                    }

                                }}
                            >
                                { row.customer_id == null ? 'Import' : 'Design' }
                            </Button>
                            <span>
              <Dropdown>
                <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-custom-components"
                >
                  <IconButton>
                    <MoreHoriz/>
                  </IconButton>
                </Dropdown.Toggle>

                <Dropdown.Menu className="position-fixed">

                  <Dropdown.Item eventKey="1" onClick={() => {
                      let win = window.open(new EmailTemplateAPIs().getPreviewURL(row.uid), '_blank');
                      win && win.focus();
                  }}>

                               <div
                                   style={{display: "inline-flex", width: "100%"}}
                               >
                      <ListItemIcon
                          style={{
                              display: "inline-flex",
                              alignItems: "center",
                          }}
                      >
                        <ZoomIn fontSize="small" color="secondary"/>
                      </ListItemIcon>
                      <ListItemText primary="Preview" onClick={() => {
                      }}/>
                    </div>


                  </Dropdown.Item>

                    {/*<Dropdown.Item eventKey="3">*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*        style={{*/}
                    {/*            display: "inline-flex",*/}
                    {/*            alignItems: "center",*/}
                    {/*        }}*/}
                    {/*    >*/}
                    {/*      <FileCopyIcon fontSize="small"/>*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Copy"/>*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    <Dropdown.Item eventKey="4"
                                   onClick={() => {
                                       modalContext.showActionModal &&
                                       modalContext.showActionModal({
                                               route: new EmailTemplateAPIs().getResourceDeletionURL(),
                                               values: [{
                                                   value: row.uid,
                                                   label: ""
                                               }],
                                               title: "",
                                               body: "Do you really want to delete this template?"
                                           },
                                           (reload) => {
                                               if (reload) {
                                                   loadResource();
                                               }
                                           })
                                   }}>
                    <div style={{display: "inline-flex", width: "100%"}}>
                      <ListItemIcon
                          style={{
                              display: "inline-flex",
                              alignItems: "center",
                          }}
                      >
                         <DeleteIcon color="secondary" name="Delete " cursor={"pointer"}/>
                      </ListItemIcon>
                      <ListItemText primary="Delete"/>
                    </div>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </span>
                        </Grid>
                    </div>
                );
            },
        },
    ];

    return (
        <Row>
            <HeadingCol
                title={"Email Templates"}
                description={"Manage different email templates using the beautiful builder"}
            />
            <Col md={12}>
                <CustomDataTable
                    columns={columns}
                    progressPending={loading}
                    selectableRows
                    onSelectedRowsChange={(e) => {
                        setSelectedRow(e.selectedRows);

                    }}
                    progressComponent={<AppLoader/>}
                    multiActionButton={
                        (selectedRow && selectedRow.length > 0) && [<Button
                            variant="contained"
                            color="secondary"
                            type="button"
                            onClick={() => {
                                modalContext.showActionModal &&
                                modalContext.showActionModal({
                                        route: new EmailTemplateAPIs().getResourceDeletionURL(),
                                        values: (selectedRow && selectedRow.map(e => {
                                            return {
                                                value: e.uid || "",
                                                label: ""
                                            }
                                        })) || [],
                                        title: "",
                                        body: "Do you really want to delete these templates?"
                                    },
                                    (reload) => {
                                        if (reload) {
                                            setSelectedRow([])
                                            loadResource();
                                        }
                                    })
                            }}
                        >
                            <FaTrash/>
                            &nbsp;Delete&nbsp;{selectedRow.length}
                        </Button>
                        ] || []
                    }
                    data={(resource && resource.templates?.data) || []}
                    sortServer
                    onSort={(column, sortDirection) => {
                        if (typeof column.selector === "string")
                            dispatchList(onSortAction(column.selector, sortDirection))
                    }}
                    noHeader
                    actionButtons={[
                        <FormControlLabel
                            control={<Switch color="primary" checked={showDefaults === "gallery" ? true : false} onChange={(event, checked) => {
                                if(checked) {
                                    setShowDefaults("gallery");
                                    dispatchList({ type: 'query', query: {
                                        from: "gallery",
                                        sort_order: "created_at",
                                        sort_direction: "desc",
                                        per_page: 20, ...getSortOrder(list_sort_key)
                                    }});
                                }
                                else {
                                    setShowDefaults("mine");
                                    dispatchList({ type: 'query', query: {
                                        from: "mine",
                                        sort_order: "created_at",
                                        sort_direction: "desc",
                                        per_page: 20, ...getSortOrder(list_sort_key)
                                    }});
                                }
                            }} name="showDefaults" size="small" />}
                            label="Show Defaults"
                        />,
                        <Link to="/email/templates/upload">
                            <Button color="primary" type="button" className="upload-button">
                                <FaUpload/>
                                &nbsp;Upload New
                            </Button>
                        </Link>,
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            className="positive-button"
                            onClick={() => {
                                history.push("/email/templates/create");
                            }}
                        >
                            <FaPlus/>
                            &nbsp;Add New
                        </Button>,
                    ]}
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
                                There are no templates.
                                <br/>
                                <LinkContainer to="/email/templates/create">
                                    <Alert.Link>Click here</Alert.Link>
                                </LinkContainer>{" "}
                                to create one.
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
                    defaultSortAsc={query.sort_direction === "asc"}
                    defaultSortField={query.sort_order}
                />
            </Col>
        </Row>
    );
}

export default EmailTemplatesList;
