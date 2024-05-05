import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import EmailSegmentationAPIs, {
    iEmailSegment,
    iEmailSegmentationListingResponse
} from "../../../apis/Email/email.segmentation";
import useIsMounted from "ismounted";
import {Button, Grid, IconButton, ListItemIcon, ListItemText} from "@material-ui/core";
import HeadingCol from "../../../components/heading/HeadingCol";
import {Alert, Col, Dropdown, Form, Modal, Row, Spinner} from "react-bootstrap";
import {FaPlus, FaTrash} from "react-icons/fa";
import * as yup from "yup";
import {Formik} from "formik";
import {Link, useHistory} from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";
import Axios, {CancelTokenSource} from "axios";
import {NotificationContext} from "../../../App";
import {AppModalContext} from "../../../components/Modal/CustomModal";
import EditIcon from "@material-ui/icons/Edit";
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
import HelpVideo from "../../../components/HelpVideo/HelpVideo";

const list_sort_key = "ew_segment_list_sort";
export default function EmailSegmentList() {
    useEffect(() => {
        document.title = "Segments | Emailwish";
    }, []);
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iEmailSegmentationListingResponse>, iListResponseActions<iEmailSegmentationListingResponse>>>
    (listReducer<iListResource<iEmailSegmentationListingResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 20, ...getSortOrder(list_sort_key)},
        loading: true,
    });

    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const isMounted = useIsMounted();
    const createNewSchema = yup.object({
        name: yup.string().required("Please enter some name"),
    });

    const notificationContext = useContext(NotificationContext);
    const history = useHistory();
    const loadResource = useCallback((source?: CancelTokenSource) => {
        dispatchList(loading_action())
        new EmailSegmentationAPIs().listing(query, source).then((response) => {
            if (isMounted.current) {
                if (EmailSegmentationAPIs.hasError(response, notificationContext)) {
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

    const [selectedRow, setSelectedRow] = useState<iEmailSegment[]>();
    const columns = [
        {
            name: "Name",
            cell: (row: iEmailSegment) => {
                return (
                    <div>
                        <Link to={`/email/segments/${row.id}/overview/edit`}>
                            <h6 className={"u500 color1"}>{row.name}</h6>
                        </Link>
                    </div>
                );
            },
        },
        {
            name: "Sync Pending",
            selector: "synced_pending",
            cell: ((row: iEmailSegment) => {
                return <>
                    {row.sync_needed?"Yes":"No"}
                </>
            })
        },
        {
            name: "Synced at",
            selector: "synced_at",
            cell: ((row: iEmailSegment) => {
                return <FormattedDate date_string={row.synced_at} format={'L LT'}/>
            })
        },
        {
            name: "Created at",
            selector: "created_at",
            sortable: true,
            cell: ((row: iEmailSegment) => {
                return <FormattedDate date_string={row.created_at} format={'L LT'}/>
            })
        },
        {
            name: "Actions",
            button: true,
            cell: (row: iEmailSegment) => {
                return <Grid container justifyContent={"flex-end"}>
                    <Grid item>

                        <Link to={`/email/segments/${row.id}/overview/edit`}>
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
                                                           route: (row.id && new EmailSegmentationAPIs().getDeleteSingleUrl(row.id)) || "",
                                                           values: [],
                                                           request_type: "DELETE",
                                                           title: "",
                                                           body: "Do you really want to delete this segmentation?"
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
                            </Dropdown.Menu>
                        </Dropdown>

                    </Grid>
                </Grid>
            }
        }
    ];
    const [showHelpVideo, setShowHelpVideo] = useState(false);
    return <Row>
        <HeadingCol title="Segmentation"
                    description={"Create segments to target a subset of your contacts that meet your specific criteria for a particular marketing campaign"}/>
        <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                   helpLink={"https://www.youtube.com/embed/mkKRazcrwpI"}/>
        <Col md={12}>
            <CustomDataTable
                selectableRows
                onSelectedRowsChange={(e) => {
                    setSelectedRow(e.selectedRows);

                }}
                onHelpLinkClick={() => {
                    setShowHelpVideo(true)
                }}


                multiActionButton={
                    (selectedRow && selectedRow.length > 0) && [<Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={() => {

                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new EmailSegmentationAPIs().getResourceDeletionURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid || "",
                                            label: ""
                                        }

                                    })) || [],
                                    title: "",
                                    request_type: "POST",
                                    body: "Do you really want to delete these segments?"
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
                data={(resource && resource.segment2s && resource.segment2s.data) || []}
                sortServer
                onSort={((column, sortDirection) => {

                    if (typeof column.selector === "string")
                        dispatchList(onSortAction(column.selector, sortDirection))
                })}
                noHeader
                actionButtons={[
                    <Button variant="contained" color="primary" type="button" className="positive-button"
                            onClick={() => {
                                setShowAddDialog(true)
                            }}>
                        <FaPlus/>&nbsp;Add New
                    </Button>
                ]}
                onKeywordChange={(a) => {

                    dispatchList(search_action(a))
                }}
                noDataComponent={
                    error ? <Alert variant="dark" className="w-100 mb-0">{error}</Alert> :
                        <Alert variant="dark" className="w-100 mb-0">
                            There are no segmentation.<br/>
                            <Alert.Link onClick={() => {
                                setShowAddDialog(true)
                            }}>Click here</Alert.Link>
                            &nbsp;to create one.
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

                paginationTotalRows={resource && resource.segment2s && resource.segment2s.total}
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
                    <Modal.Title>Create New Segmentation</Modal.Title>
                </Modal.Header>
            } <Modal.Body>
            <div className="mt-2">
                <Formik
                    initialValues={{
                        name: "",
                    }}
                    onSubmit={(values: any) => {
                        new EmailSegmentationAPIs().create(values).then((response) => {
                            if (isMounted.current) {
                                if (EmailSegmentationAPIs.hasError(response, notificationContext)) {

                                } else if (response && response.segment2) {
                                    history.push(`/email/segments/${response.segment2.id}/overview/edit`);
                                }
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
                                <Form.Label className="text-box-label">Segmentation
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
