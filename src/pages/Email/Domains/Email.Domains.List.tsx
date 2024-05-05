import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import useIsMounted from "ismounted";
import {Button, Grid, IconButton, ListItemIcon, ListItemText} from "@material-ui/core";
import HeadingCol from "../../../components/heading/HeadingCol";
import {Alert, Col, Dropdown, Form, Modal, Row, Spinner} from "react-bootstrap";
import {FaTrash} from "react-icons/fa";
import * as yup from "yup";
import {Formik} from "formik";
import {Link, useHistory} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";
import Axios, {CancelTokenSource} from "axios";
import {NotificationContext} from "../../../App";
import {AppModalContext} from "../../../components/Modal/CustomModal";
import EditIcon from "@material-ui/icons/Edit";
import FingerprintIcon from "@material-ui/icons/Fingerprint";
import {CustomToggle} from "../Campaigns/Email.Campaigns.List";
import {MoreHoriz} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
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
import FormattedDate from "../../../components/Utils/FormattedDate";
import {getSortOrder, saveSortOrder} from "../../../components/utils";
import EmailDomainAPIs, { iEmailDomainListingResponse } from "../../../apis/Email/email.domains.apis";
import { iEmailSendingDomain } from "../../../types/internal";
import VerifiedIcon from "@material-ui/icons/Done";
import UnverifiedIcon from "@material-ui/icons/ErrorOutline";
import SyncIcon from "@material-ui/icons/Sync";

function EmailDomains() {
    useEffect(() => {
        document.title = "Domains | Emailwish";
    }, []);

    const list_sort_key = "ew_domain_list_sort";
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iEmailDomainListingResponse>, iListResponseActions<iEmailDomainListingResponse>>>
    (listReducer<iListResource<iEmailDomainListingResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 20, ...getSortOrder(list_sort_key)},
        loading: true,
    });

    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const isMounted = useIsMounted();
    const createNewSchema = yup.object({
        // TODO: verify domain format
        name: yup.string().required("Please enter some name"),
    });

    const notificationContext = useContext(NotificationContext);
    const history = useHistory();
    const loadResource = useCallback((source?: CancelTokenSource) => {
        dispatchList(loading_action())
        new EmailDomainAPIs().listing(query, source).then((response) => {
            if (isMounted.current) {
                if (EmailDomainAPIs.hasError(response, notificationContext)) {
                    dispatchList(failed_action(response.message))
                } else {

                    dispatchList(success_action(response))
                }
            }
        })
    }, [isMounted, query]);

    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            saveSortOrder(list_sort_key, query)
            loadResource(source);
        }
        return () => {
            source.cancel();
        }
    }, [query])

    const modalContext = useContext(AppModalContext);
    const [selectedRow, setSelectedRow] = useState<iEmailSendingDomain[]>();
    const columns = [
        {
            name: "Name",
            cell: (row: iEmailSendingDomain) => {
                return (
                    <div>
                        <Link to={`/email/domains/${row.uid}/edit`}>
                            <h6 className={"u500 color1"}>{row.name}</h6>
                        </Link>
                    </div>
                );
            },
        },
        {
            name: "Created at",
            selector: "created_at",
            sortable: true,
            cell: ((row: iEmailSendingDomain) => {
                return <FormattedDate date_string={row.created_at} format={'L LT'}/>
            })
        },
        {
            name: "Verified SPF",
            selector: "verified",
            sortable: true,
            cell: ((row: iEmailSendingDomain) => {
                console.log(typeof row.spf_verified);
                return row.spf_verified === "1" ? <VerifiedIcon color="action"/> : <UnverifiedIcon color="error"/>;
            })
        },
        {
            name: "Verified DKIM",
            selector: "verified",
            sortable: true,
            cell: ((row: iEmailSendingDomain) => {
                return row.dkim_verified === "1" ? <VerifiedIcon color="action"/> : <UnverifiedIcon color="error"/>;
            })
        },
        {
            name: "Verified Domain",
            selector: "verified",
            sortable: true,
            cell: ((row: iEmailSendingDomain) => {
                return row.domain_verified === "1" ? <VerifiedIcon color="action"/> : <UnverifiedIcon color="error"/>;
            })
        },

        {
            name: "Actions",
            button: true,
            cell: (row: iEmailSendingDomain) => {
                return <Grid container justifyContent={"flex-end"}>
                    <Grid item>

                        <Link to={`/email/domains/${row.uid}/edit`}>
                            <IconButton aria-label="edit" onClick={() => {
                            }
                            }>
                                <EditIcon color={"secondary"}/>
                            </IconButton>
                        </Link>

                    </Grid>
                    <Grid item>
                        <Dropdown>
                            <Dropdown.Toggle
                                as={CustomToggle}
                                id="dropdown-custom-components"
                            >
                            <IconButton>
                                <MoreHoriz color={"secondary"}/>
                            </IconButton>
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="position-fixed">
                                <Dropdown.Item eventKey="1" key={1}
                                               onClick={() => {
                                                   modalContext.showActionModal &&
                                                   modalContext.showActionModal({
                                                           route: (row.id && new EmailDomainAPIs().getDeleteSingleUrl(row.id)) || "",
                                                           values: [],
                                                           request_type: "DELETE",
                                                           title: "",
                                                           body: "Do you really want to delete this Domain?"
                                                       },
                                                       (reload) => {
                                                           if (reload) {
                                                               loadResource();
                                                           }
                                                       })
                                               }}
                                >
                                    <div
                                        style={{display: "inline-flex", width: "100%"}}
                                    >
                                        <ListItemIcon
                                            style={{display: "flex", alignItems: "center"}}
                                        >
                                            <DeleteIcon fontSize="small" color={"secondary"}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Delete"/>
                                    </div>
                                </Dropdown.Item>
                                <Dropdown.Item eventKey="2" key={2}
                                               onClick={() => {
                                                    new EmailDomainAPIs().verifyRecords(row.uid).then((res) => {
                                                        console.log(res);
                                                    });
                                               }}
                                >
                                    <div
                                        style={{display: "inline-flex", width: "100%"}}
                                    >
                                        <ListItemIcon
                                            style={{display: "flex", alignItems: "center"}}
                                        >
                                            <FingerprintIcon fontSize="small" color={"secondary"}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Verify"/>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </Grid>
                </Grid>
            }
        }
    ];

    return <Row>
        <HeadingCol title="Domains"
                    description={"Use custom Domains registered with your Shop"}/>
        <Col md={12}>
            <CustomDataTable
                selectableRows
                onSelectedRowsChange={(e) => {
                    setSelectedRow(e.selectedRows);
                }}

                multiActionButton={
                    (selectedRow && selectedRow.length > 0) && [<Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={() => {

                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new EmailDomainAPIs().getResourceDeletionURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid || "",
                                            label: ""
                                        }

                                    })) || [],
                                    title: "",
                                    request_type: "POST",
                                    body: "Do you really want to delete these Domains?"
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
                    </Button>] || []
                }
                columns={columns}
                progressPending={loading}
                progressComponent={<AppLoader/>}
                data={(resource && resource.items && resource.items.data) || []}
                sortServer
                onSort={((column, sortDirection) => {

                    if (typeof column.selector === "string")
                        dispatchList(onSortAction(column.selector, sortDirection))
                })}
                noHeader
                actionButtons={[
                    <Button variant="contained" color="primary" type="button" className="positive-button"
                            onClick={() => {
                                //setShowAddDialog(true)
                                new EmailDomainAPIs().reloadShopDomains().then((res) => {
                                    loadResource();
                                });
                            }}>
                        <SyncIcon/>&nbsp;Sync Domains
                    </Button>
                ]}
                onKeywordChange={(a) => {
                    dispatchList(search_action(a))
                }}
                noDataComponent={
                    error ? <Alert variant="dark" className="w-100 mb-0">{error}</Alert> :
                        <Alert variant="dark" className="w-100 mb-0">
                            There are no Domains.<br/>
                            <b>Add a Domain to you Shop and press the Sync Button above.</b>
                        </Alert>
                }

                pagination
                paginationPerPage={
                    query.per_page
                }
                onChangeRowsPerPage={(per_page) => {
                    dispatchList(per_page_row_change_action(per_page))
                }}
                paginationServer

                paginationTotalRows={resource && resource.items && resource.items.total}
                onChangePage={(page => {

                    dispatchList(current_page_change_action(page))
                })}

                defaultSortAsc={query.sort_direction === "asc"}
                defaultSortField={query.sort_order}
            />

        </Col>
        <Modal show={showAddDialog}
               centered
               onHide={() => {
                   setShowAddDialog(false)
               }}>
            {
                //@ts-ignore
                <Modal.Header closeButton>
                    <Modal.Title>Add new Domain</Modal.Title>
                </Modal.Header>
            } <Modal.Body>
            <div className="mt-2">
                <Formik
                    initialValues={{
                        name: "",
                    }}
                    onSubmit={(values: any) => {
                        new EmailDomainAPIs().create(values).then((response) => {
                            if (isMounted.current) {
                                if (EmailDomainAPIs.hasError(response, notificationContext)) {
                                } else {
                                    console.log(response);
                                    setSelectedRow([])
                                    loadResource();
                                    setShowAddDialog(false);
                                }
                                    //else if (response && response.segment2) {
                                   // history.push(`/email/segments/${response.segment2.id}/overview/edit`);
                                //}
                            }
                        });
                    }}
                    validationSchema={createNewSchema}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          values,
                          touched,
                          isSubmitting,

                          errors,
                      }: any) => {
                        return <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label className="text-box-label">Domain
                                    name</Form.Label>
                                <Form.Control type="text"
                                              placeholder="Name"
                                              name="name"
                                              style={{
                                                  border: 0,
                                                  boxShadow: 'var(--box-shadow-low)'
                                              }}
                                              value={values.name}
                                              onChange={handleChange}
                                              isInvalid={touched && touched.name && errors && !!errors.name}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors && errors.name}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button color="primary"
                                    variant="contained"
                                    type="submit"
                                    disabled={loading} className="positive-button">
                                {isSubmitting && <Spinner animation="border" size="sm"/>}
                                Save
                            </Button>
                            <Button type="button" variant="outlined" color="secondary" className="ml-2" onClick={() => {
                                setShowAddDialog(false)
                            }}>
                                Cancel
                            </Button>
                        </Form>;
                    }
                    }</Formik>
            </div>
        </Modal.Body>
        </Modal>
    </Row>
}

export default EmailDomains;
