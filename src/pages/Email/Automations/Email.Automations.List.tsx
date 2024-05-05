import {Button, Grid, IconButton, ListItemIcon, ListItemText,} from "@material-ui/core";
import {Edit, MoreHoriz, MultilineChart, Pause, PlayArrow} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import Public from "@material-ui/icons/Public";
import Axios, {CancelTokenSource} from "axios";
import useIsMounted from "ismounted";
import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Alert, Badge, Col, Dropdown, Form, Modal, Row, Spinner,} from "react-bootstrap";
import {FaPlus, FaTrash} from "react-icons/fa";
import EmailAutomationAPIs, {
    iEmailAutomationsListingResponse,
    iExplorePublicAutomations,
} from "../../../apis/Email/email.automations.apis";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import HeadingCol from "../../../components/heading/HeadingCol";
import IconLabelButtons from "../../../components/IconLabelButtons/IconLabelButtons";
import AppLoader from "../../../components/Loader/AppLoader";

import FormattedDate from "../../../components/Utils/FormattedDate";
import {getEmptyApiListingQuery, iApiBasicResponse,} from "../../../types/api";
import {iEmailAutomation, iSelectOption} from "../../../types/internal";
import {getMailingListWithCache, iEmailMailingList} from "../../../types/internal/email/mailinglist";
import {Formik} from "formik";
import * as yup from "yup";
import {customStyles} from "../../../components/common/common";
import Select from "react-select";
import EmailMailingListAPIs from "../../../apis/Email/email.mailinglists.apis";

import {AppStateContext, NotificationContext} from "../../../App";
import {AppModalContext} from "../../../components/Modal/CustomModal";
import import_automations from "../../../assets/images/import_automations.jpeg"
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
import Typography from "@material-ui/core/Typography";
import FormGroup from "../../../components/FormGroup/CustomFormGroup";
import EmailCampaignAPIs from "../../../apis/Email/email.campaigns.apis";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import {getSortOrder, saveSortOrder} from "../../../components/utils";
import {IDataTableColumn} from "react-data-table-component";
import {AiOutlineInfoCircle, HiDownload} from "react-icons/all";
import {useLocation} from "react-router-dom";
import AsyncSelect from "react-select/async";
import PopupAPIs from "../../../apis/Popup/popup.apis";
import EmailSegmentationAPIs, {iEmailSegment} from "../../../apis/Email/email.segmentation";

const list_sort_key = "ew_automation_list_sort";

function EmailAutomationsList() {
    useEffect(() => {
        document.title = "Automations | Emailwish";
    }, []);
    const {shop} = useContext(AppStateContext);
    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [showRenameDialog, setShowRenameDialog] = useState<boolean>(false);
    const [renameDialogObject, setRenameDialogObject] = useState<iEmailAutomation>();
    const isMounted = useIsMounted();

    const modalContext = useContext(AppModalContext);
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iEmailAutomationsListingResponse>, iListResponseActions<iEmailAutomationsListingResponse>>>
    (listReducer<iListResource<iEmailAutomationsListingResponse>, any>({}), {
        query: {sort_order: "id", sort_direction: "desc", per_page: 20, ...getSortOrder(list_sort_key)},
        loading: true,
    });
    const notificationContext = useContext(NotificationContext);
    const [response, setResponse] = useState<iApiBasicResponse>();
    const [mailing_lists, setMailingList] = useState<iEmailMailingList[]>([]);
    const createNewSchema = yup.object({
        name: yup.string().required("Please enter automation name"),
        mail_list_uid: yup.string().required("Please select mailing list"),
        use_segment:yup.boolean(),
        segment2_id:yup.string().when("use_segment",{
            is:true,
            then:yup.string().required("Please select segment"),
            otherwise:yup.string()
        })
    });
    const location = useLocation<any>();
    useEffect(() => {
        if (location.state && location.state.open_import) {
            setExploreAutomations(true)
        }
    }, [location.state])

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

    const fetchSamples = useCallback(() => {
        dispatchList(loading_action())
        new EmailMailingListAPIs()
            .listing(getEmptyApiListingQuery())
            .then((response) => {
                if (isMounted.current) {
                    if (EmailMailingListAPIs.hasError(response, notificationContext) || !response.lists) {
                        dispatchList(failed_action(response.message))
                        setMailingList([]);
                    } else {
                        setMailingList(response.lists.data || []);
                    }
                }

            });
    }, [isMounted])


    const loadResource = useCallback((source?: CancelTokenSource) => {
            dispatchList(loading_action())
            new EmailAutomationAPIs().listing(query, source).then((response) => {
                if (isMounted.current) {
                    if (EmailAutomationAPIs.hasError(response, notificationContext) || !response.automations) {
                        dispatchList(failed_action(response.message))
                    } else {
                        response.automations.data = response.automations.data.map((r) => ({
                            ...r,
                            mail_list: getMailingListWithCache(r.mail_list),
                        }));
                        dispatchList(success_action(response))
                    }
                }
            });
        },
        [isMounted, query, shop]
    );
    const [copyAutomation, setCopyAutomation] = useState<iEmailAutomation | undefined>();
    const [exploreAutomations, setExploreAutomations] = useState<boolean>(false);


    const enableDisableResources = useCallback((uids: Array<string>, is_enable: boolean) => {

        dispatchList(loading_action())
        new EmailAutomationAPIs()
            .enable_disable(uids, is_enable)
            .then((response) => {
                let source = Axios.CancelToken.source();
                if (isMounted.current) {
                    if (EmailAutomationAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message))
                    } else {
                        loadResource(source);
                    }
                }
            });
    }, [isMounted]);

    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            saveSortOrder(list_sort_key, query)
            loadResource(source);
            fetchSamples();
        }
        return () => {
            source.cancel();
        };
    }, [query, shop]);


    const [selectedRow, setSelectedRow] = useState<iEmailAutomation[]>();
    const {loggedInUser} = useContext(AppStateContext)
    const copyResources = (uid: string, copy_name: string) => {
        new EmailAutomationAPIs().copy_automation(uid, copy_name).then((response) => {
            let source = Axios.CancelToken.source();
            if (isMounted.current) {
                if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                } else {
                    loadResource(source);
                }
            }
        });
    };
    const columns = [
        {
            name: "Name",
            selector: "name",
            sortable: true,
            grow: 0.5,
            cell: (row: iEmailAutomation) => {
                return (
                    <div>
                        <a href={new EmailAutomationAPIs().getExternalEditorURL(row.uid)}>
                            <h6 className={"u500 color1"}>{row.name}</h6>
                        </a>
                        {row._briefIntro}
                    </div>
                );
            },
        },
        {
            name: "Contact",
            grow: 0.5,
            center: true,
            cell: (row: iEmailAutomation) => {
                return (
                    (row._summaryStats &&
                        row._summaryStats.involed) ||
                    0
                );
            },
        },
        {
            name: "Email",
            grow: 0.5,
            center: true,
            selector: "_countEmails",
            sortable: true,
            cell: (row: iEmailAutomation) => {
                return row._countEmails || 0;
            },
        },
        {
            name: "Complete",
            grow: 0.5,
            center: true,
            cell: (row: iEmailAutomation) => {
                let total_email = row._countEmails || 0;
                total_email = (row._summaryStats &&
                    row._summaryStats.involed) ? (row._summaryStats.involed * total_email) : 0;
                let total_sent = row._totalEmailCount || 0;
                let percentage = total_sent * 100 / total_email

                    if (isNaN(percentage)) {
                        percentage = 0
                    }

                return percentage.toFixed(2) + "%" || 0;
            },
        },
        {
            name: "Created At",
            selector: "created_at",
            grow: 1,
            sortable: true,
            cell: (row: iEmailAutomation) => {
                return <FormattedDate date_string={row.created_at}/>;
            },
        },
        ...(loggedInUser && loggedInUser.admin) ? [
            {
                name: "Available to public",
                selector: "default_for_new_customers",
                grow: 1,
                cell: (row: iEmailAutomation) => {
                    return row.default_for_new_customers ? <p>YES</p> : <p>NO</p>;
                },
            },
        ] : [],
        {
            name: "Status",
            selector: "status",
            sortable: true,
            grow: 0.5,
            cell: (row: iEmailAutomation) => {
                return row.status === "active" ? (
                    <Badge variant="success">RUNNING</Badge>
                ) : (
                    <Badge variant="secondary">INACTIVE</Badge>
                );
            },
        },
        {
            name: "Actions",
            /* button: true, */
            grow: 1,
            cell: (row: iEmailAutomation) => {
                return (
                    <div>
                        <Grid
                            container
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <a href={new EmailAutomationAPIs().getExternalEditorURL(row.uid)}>
                                <IconLabelButtons
                                    text="Configure"
                                    icon={<MultilineChart/>}
                                    color="secondary"
                                />
                            </a>
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
                       <Dropdown.Item
                           eventKey="1"
                           key={1}
                           onClick={() => {
                               setCopyAutomation(row);
                           }}
                       >
                        <div style={{display: "inline-flex", width: "100%"}}>
                          <ListItemIcon
                              style={{display: "flex", alignItems: "center"}}
                          >
                            <FileCopyIcon fontSize="small" color="secondary"/>
                          </ListItemIcon>
                          <ListItemText primary="Copy"/>
                        </div>
                      </Dropdown.Item>
                      {row.status === "active"
                          ? [
                              <Dropdown.Item eventKey="1" key={1} onClick={() => {
                                  enableDisableResources(
                                      [row.uid],
                                      row.status !== "active"
                                  )
                              }

                              }>
                                  <div
                                      style={{display: "inline-flex", width: "100%"}}
                                      className="rdicon"
                                  >
                                      <ListItemIcon
                                          style={{
                                              display: "flex",
                                              alignItems: "center",
                                          }}
                                      >
                                          <Pause color="secondary"/>
                                      </ListItemIcon>
                                      <ListItemText
                                          primary="Inactivate"

                                      />
                                  </div>
                              </Dropdown.Item>,
                          ]
                          : [
                              <Dropdown.Item eventKey="3" key={3} onClick={() => {
                                  enableDisableResources(
                                      [row.uid],
                                      row.status !== "active"
                                  )
                              }

                              }>
                                  <div
                                      style={{display: "inline-flex", width: "100%"}}
                                  >
                                      {" "}
                                      <ListItemIcon
                                          style={{
                                              display: "flex",
                                              alignItems: "center",
                                          }}
                                      >
                                          <PlayArrow color="secondary"/>
                                      </ListItemIcon>
                                      <ListItemText
                                          primary="Activate"

                                      />
                                  </div>
                              </Dropdown.Item>,

                          ]}
                      <Dropdown.Item
                          eventKey="5"
                          key={5}
                          onClick={() => {
                              setRenameDialogObject(row);
                              setShowRenameDialog(true)
                          }}
                      >
                                <div
                                    style={{display: "inline-flex", width: "100%"}}

                                >
                                    <ListItemIcon
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >

                                        <Edit color="secondary" onClick={() => {
                                        }} name="Rename " cursor={"pointer"}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Rename"
                                    />
                                </div>
                            </Dropdown.Item>
                      <Dropdown.Item
                          eventKey="4"
                          key={4}
                          onClick={() => {
                              modalContext.showActionModal &&
                              modalContext.showActionModal({
                                      route: new EmailAutomationAPIs().getResourceDeletionURL(),
                                      values: [{
                                          value: row.uid,
                                          label: ""
                                      }],
                                      title: "",
                                      body: "Do you really want to delete this automation?"
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
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                        }}
                                    >
                                        <DeleteIcon color="secondary" onClick={() => {
                                        }} name="Delete " cursor={"pointer"}/>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Delete"
                                    />
                                </div>
                            </Dropdown.Item>
                      {
                          loggedInUser && loggedInUser.admin && <Dropdown.Item
                              eventKey="6"
                              key={6}
                              onClick={() => {
                                  if (row.default_for_new_customers) {
                                      let confirm = window.confirm("Do you really want to hide this automation from public?");
                                      if (confirm) {
                                          new EmailAutomationAPIs().mark_available_to_public(row.uid, {default_for_new_customers: false}).then(response => {
                                              let source = Axios.CancelToken.source();
                                              if (isMounted.current) {
                                                  if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                                                  } else {
                                                      loadResource(source);
                                                  }
                                              }
                                          })
                                      }
                                  } else {
                                      let confirm = window.confirm("Do you really want to mark this automation available to public?");
                                      if (confirm) {
                                          new EmailAutomationAPIs().mark_available_to_public(row.uid, {default_for_new_customers: true}).then(response => {
                                              let source = Axios.CancelToken.source();
                                              if (isMounted.current) {
                                                  if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                                                  } else {
                                                      loadResource(source);
                                                  }
                                              }
                                          })
                                      }
                                  }

                              }}
                          >
                              {
                                  !row.default_for_new_customers && <div
                                      style={{display: "inline-flex", width: "100%"}}

                                  >
                                      <ListItemIcon
                                          style={{
                                              display: "flex",
                                              alignItems: "center",
                                          }}
                                      >
                                          <Public color="secondary" onClick={() => {
                                          }} name="Public " cursor={"pointer"}/>
                                      </ListItemIcon>
                                      <ListItemText
                                          primary="Mark Available to Public"
                                      />
                                  </div>
                              }
                              {
                                  row.default_for_new_customers && <div
                                      style={{display: "inline-flex", width: "100%"}}

                                  >
                                      <ListItemIcon
                                          style={{
                                              display: "flex",
                                              alignItems: "center",
                                          }}
                                      >
                                          <Public color="error" onClick={() => {
                                          }} name="Delete " cursor={"pointer"}/>
                                      </ListItemIcon>
                                      <ListItemText
                                          primary="Hide From Public"
                                      />
                                  </div>
                              }
                          </Dropdown.Item>
                      }

                  </Dropdown.Menu>
                </Dropdown>
              </span>
                        </Grid>
                    </div>
                );
            },
        },
    ];
    const showNoOptionsMessage = useCallback((val: any) => {
        let iVal = val.inputValue;
        if (!iVal.length) return "Type to search...";
        else return "No results";
    }, []);
    const [segment2Default, setSegment2Default] = useState<any[]>([])
    const loadTitles = useCallback((title: string) => {
        return new EmailSegmentationAPIs().listing({keyword: title}).then((res) => {
            if (PopupAPIs.hasError(res, notificationContext)) {
                return []
            } else {
                return (res.segment2s && res.segment2s.data && res.segment2s.data.map(value => {
                    return {value: value.id, label: value.name}
                }))
            }
        });
    }, []);

    useEffect(() => {
         new EmailSegmentationAPIs().listing({keyword: ""}).then((res) => {
            if (PopupAPIs.hasError(res, notificationContext)) {
                return []
            } else {
                let values= (res.segment2s && res.segment2s.data && res.segment2s.data.map(value => {
                    return {value: value.id, label: value.name}
                }))||[]
                setSegment2Default(values);
            }
        });
    }, [])
    console.log("SelectedRow",selectedRow)
    return (
        <Row>
            <HeadingCol
                title={"Email Automations"}
                description={"Manage action triggered emails to your subscribers"}
            />
            <Col md={12}>
                <CustomDataTable
                    selectableRows
                    onSelectedRowsChange={(e) => {
                        setSelectedRow(e.selectedRows);
                    }}
                    columns={columns}
                    progressPending={loading}
                    progressComponent={<AppLoader/>}
                    data={(resource && resource.automations?.data) || []}
                    sortServer
                    onSort={(column, sortDirection) => {
                        if (typeof column.selector === "string")
                            dispatchList(onSortAction(column.selector, sortDirection))
                    }}
                    multiActionButton={
                        (selectedRow && selectedRow.length > 0) && [<Button
                            variant="contained"
                            color="secondary"
                            type="button"
                            onClick={() => {

                                modalContext.showActionModal &&
                                modalContext.showActionModal({
                                        route: new EmailAutomationAPIs().getResourceDeletionURL(),
                                        values: (selectedRow && selectedRow.map(e => {
                                            return {
                                                value: e.uid,
                                                label: ""
                                            }
                                        })) || [],
                                        title: "",
                                        body: "Do you really want to delete these automations?"
                                    },
                                    (reload) => {
                                        if (reload) {
                                            console.log("reload",reload)
                                            setSelectedRow([])
                                            loadResource();
                                        }
                                    })
                            }}
                        >
                            <FaTrash/>
                            &nbsp;Delete&nbsp;{selectedRow.length}
                        </Button>] || [
                            <Button
                                variant="outlined"
                                color="primary"
                                type="button"
                                className="app-button"
                                onClick={() => {
                                    setExploreAutomations(true);
                                }}
                            >
                                Import Email Automations
                            </Button>
                        ]
                    }
                    customStyles={customStyles}
                    noHeader
                    actionButtons={[
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            data-tut="reactour__create_automations"
                            className="positive-button"
                            onClick={() => setShowAddDialog(true)}
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
                                There are no automations.
                                <br/>
                                <span
                                    onClick={() => setShowAddDialog(true)}>

                                <Alert.Link>Click here</Alert.Link>&nbsp;
                            </span>
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
                    defaultSortAsc={query.sort_direction === "asc"}
                    defaultSortField={query.sort_order}
                />
            </Col>
            <Modal
                show={exploreAutomations}
                onHide={() => {
                    setExploreAutomations(false);
                }}
                size="lg"
            >
                <Modal.Header closeButton style={{background: "white", border: "none"}}>
                    <Modal.Title className="text-center w-100">
                        Import Automations
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>


                    <ExploreAutomations onRefresh={() => {
                        loadResource()
                    }}/>
                </Modal.Body>
            </Modal>
            <Modal
                show={!!copyAutomation}
                onHide={() => {
                    setCopyAutomation(undefined);
                }}
            >
                {
                    //@ts-ignore
                    <Modal.Header closeButton>
                        <Modal.Title>Name your new Automation</Modal.Title>
                    </Modal.Header>
                }
                <Modal.Body>
                    <Formik
                        initialValues={{
                            name: "Copy Of " + (copyAutomation && copyAutomation.name),
                        }}
                        validateOnChange={false}
                        onSubmit={(values: any, helpers) => {
                            if (copyAutomation) {
                                copyResources(copyAutomation.uid, values.name);
                                setCopyAutomation(undefined);
                            }
                        }}
                        validationSchema={yup.object({
                            name: yup.string().required("Please enter new name"),
                        })}
                    >
                        {({handleSubmit, values, touched, errors, handleChange}: any) => {
                            return (
                                <form onSubmit={handleSubmit}>
                                    <FormGroup
                                        onChange={handleChange}
                                        values={values}
                                        touched={touched}
                                        errors={errors}
                                        type="text"
                                        name="name"
                                        label="What would you like to name your automation? *"
                                    />
                                    <div className="float-right">
                                        <Button
                                            color="secondary"
                                            onClick={() => {
                                                setCopyAutomation(undefined);
                                            }}
                                        >
                                            Close
                                        </Button>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            className="positive-button ml-1"
                                            type="submit"
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </form>
                            );
                        }}
                    </Formik>
                </Modal.Body>
            </Modal>
            <Modal
                show={showAddDialog}
                centered
                onHide={() => {
                    setShowAddDialog(false);
                }}
            >
                {
                    //@ts-ignore
                    <Modal.Header closeButton>
                        <div className="d-flex flex-column">
                            <Modal.Title>

                                Create Email Automations

                            </Modal.Title>
                            <Typography>
                                For Popup, Chat, Review triggers you need to choose Shopify Customers Mailing list.
                            </Typography>
                        </div>

                    </Modal.Header>
                }
                <Modal.Body>
                    <div className="mt-2">
                        {error ? <Alert variant="danger">{error}</Alert> : null}
                        <Formik
                            key={(mailing_lists && mailing_lists.length > 0 && mailing_lists.length) || ""}
                            initialValues={{
                                name: "",
                                mail_list_uid: (mailing_lists && mailing_lists.length > 0 && mailing_lists[mailing_lists.length - 1].uid) || "",
                                use_segment: false,
                                segment2_id: "",
                                segment2: undefined
                            }}
                            onSubmit={(values: any,formikHelpers) => {
                                new EmailAutomationAPIs()
                                    .create(values)
                                    .then((response) => {
                                        formikHelpers.setSubmitting(false)
                                        if (EmailAutomationAPIs.hasError(response, notificationContext) || !response.uid) {
                                            setResponse(undefined);
                                        } else {
                                            setResponse(response);
                                            loadResource();
                                            if (response && response.uid) {
                                                setShowAddDialog(false);
                                                setTimeout(() => {
                                                    window.open(response.url,);
                                                }, 2000)
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
                                  setFieldValue,
                                  isSubmitting,

                                  errors,
                              }: any) => {
                                const mailing_list_options: Array<iSelectOption> = mailing_lists.map(
                                    (ml) => ({
                                        label: ml.name,
                                        value: ml.uid,
                                    })
                                );
                                return (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label className="text-box-label">
                                                Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Name"
                                                name="name"
                                                style={{
                                                    border: 0,
                                                    boxShadow: "var(--box-shadow-low)",
                                                }}
                                                value={values.name}
                                                onChange={handleChange}
                                                isInvalid={
                                                    touched &&
                                                    touched.name &&
                                                    errors &&
                                                    !!errors.name
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors && errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label className="text-box-label">
                                                Mailing List
                                            </Form.Label>
                                            <Select
                                                name="mail_list_uid"
                                                onChange={(_value: any) => {
                                                    if (_value && _value.value)
                                                        setFieldValue(
                                                            "mail_list_uid",
                                                            _value.value
                                                        );
                                                }}
                                                value={mailing_list_options && mailing_list_options.find((value => {
                                                    return value.value === values.mail_list_uid
                                                }))}
                                                options={mailing_list_options}
                                            />
                                            <Form.Control
                                                hidden
                                                isInvalid={
                                                    touched &&
                                                    touched.mail_list_uid &&
                                                    errors &&
                                                    errors.mail_list_uid
                                                }
                                                name="mail_list_uid"
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors &&
                                                errors.mail_list_uid
                                                }
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group controlId="use_segment" className="mb-3">

                                            <Form.Check
                                                onChange={handleChange}
                                                value={values.use_segment}
                                                type="checkbox"
                                                name="use_segment"
                                                label="Restrict this automation to a segment?"
                                                checked={values.use_segment}
                                            />
                                        </Form.Group>
                                        {
                                            values.use_segment && <Form.Group className="mb-3">
                                                <Form.Label className="text-box-label">
                                                    Segment
                                                </Form.Label>
                                                <AsyncSelect
                                                    value={values.segment2}
                                                    cacheOptions
                                                    noOptionsMessage={showNoOptionsMessage}
                                                    onChange={(item: any) => {
                                                        setFieldValue("segment2", item)
                                                        setFieldValue("segment2_id", item.value)
                                                    }
                                                    }
                                                    defaultOptions={segment2Default}
                                                    loadOptions={loadTitles}
                                                    name="Titles"
                                                    className="basic-multi-select"
                                                    classNamePrefix="select"/>

                                                <Form.Control
                                                    hidden
                                                    isInvalid={
                                                        touched &&
                                                        touched.segment2_id &&
                                                        errors &&
                                                        errors.segment2_id
                                                    }
                                                    name="segment2_id"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors &&
                                                    errors.segment2_id
                                                    }
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        }
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                            disabled={loading}

                                            className="positive-button"
                                        >
                                            {isSubmitting && (
                                                <Spinner animation="border" size="sm"/>
                                            )}
                                            Save
                                        </Button>
                                        <Button
                                            type="button"
                                            color="secondary"
                                            variant="outlined"
                                            className="ml-2"
                                            onClick={() => {
                                                setShowAddDialog(false);
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal
                show={showRenameDialog}
                centered
                onHide={() => {
                    setShowRenameDialog(false);
                }}
            >
                {
                    //@ts-ignore
                    <Modal.Header closeButton>
                        <div className="d-flex flex-column">
                            <Modal.Title>Rename Email Automations</Modal.Title>
                        </div>

                    </Modal.Header>
                }
                <Modal.Body>
                    <div className="mt-2">
                        {error ? <Alert variant="danger">{error}</Alert> : null}
                        <Formik
                            key={renameDialogObject && renameDialogObject.uid}
                            initialValues={{
                                name: (renameDialogObject && renameDialogObject.name) || "",
                            }}
                            onSubmit={(values: any, formikHelpers) => {
                                if (renameDialogObject) {
                                    new EmailAutomationAPIs()
                                        .update_name(renameDialogObject.uid, values)
                                        .then((response) => {
                                            if (isMounted.current) {
                                                if (EmailAutomationAPIs.hasError(response, notificationContext)) {
                                                    setResponse(undefined);
                                                } else {
                                                    setResponse(response);
                                                    loadResource();
                                                    setShowRenameDialog(false);
                                                    formikHelpers.setSubmitting(false)
                                                }
                                            }

                                        });
                                }

                            }}
                            validationSchema={yup.object({
                                name: yup.string().required("Please enter automation name"),
                            })}
                        >
                            {({
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  touched,
                                  setFieldValue,
                                  isSubmitting,
                                  errors,
                              }: any) => {

                                return (
                                    <Form onSubmit={handleSubmit}>
                                        <Form.Group>
                                            <Form.Label className="text-box-label">
                                                Name
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Name"
                                                name="name"
                                                style={{
                                                    border: 0,
                                                    boxShadow: "var(--box-shadow-low)",
                                                }}
                                                value={values.name}
                                                onChange={handleChange}
                                                isInvalid={
                                                    touched &&
                                                    touched.name &&
                                                    errors &&
                                                    !!errors.name
                                                }
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors && errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Button
                                            color="primary"
                                            variant="contained"
                                            type="submit"
                                            disabled={loading}

                                            className="positive-button"
                                        >
                                            {isSubmitting && (
                                                <Spinner animation="border" size="sm"/>
                                            )}
                                            Save
                                        </Button>
                                        <Button
                                            variant="outlined" color="secondary"
                                            type="button"
                                            className="ml-2"
                                            onClick={() => {
                                                setShowRenameDialog(false)
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Form>
                                );
                            }}
                        </Formik>
                    </div>
                </Modal.Body>
            </Modal>
        </Row>
    );
}

export default EmailAutomationsList;

function ExploreAutomations({onRefresh}: { onRefresh: any }) {
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iExplorePublicAutomations>, iListResponseActions<iExplorePublicAutomations>>>
    (listReducer<iListResource<iExplorePublicAutomations>, any>({}), {
        query: {sort_order: "id", sort_direction: "desc", per_page: 20, ...getSortOrder(list_sort_key)},
        loading: true,
    });

    const notificationContext = useContext(NotificationContext);
    const isMounted = useIsMounted();
    const loadResource = useCallback((source?: CancelTokenSource) => {
            new EmailAutomationAPIs().automations_imported().then()
            dispatchList(loading_action())
            new EmailAutomationAPIs().load_public_automations(query, source).then((response) => {
                if (isMounted.current) {
                    if (EmailAutomationAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message))
                    } else {

                        dispatchList(success_action(response))
                    }
                }
            });
        },
        [isMounted, query,]);

    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            loadResource(source);
        }
        return () => {
            source.cancel();
        };
    }, [query]);
    const public_automations = resource && resource.public_automations;
    const [importing, setImporting] = useState("");
    const [imported, setImported] = useState<string[]>([]);
    const columns: IDataTableColumn[] = [
        {
            name: "Name",
            selector: "name",
            grow: 10,
            cell: (row: iEmailAutomation) => {
                return (
                    <div>

                        <h5 className="u400">  {row.name}     </h5>
                        <p>
                            {row._briefIntro}
                        </p>
                    </div>
                );
            },
        },
        {
            name: "Date Modified",
            selector: "updated_at",
            grow: 0,
            minWidth: "150px",
            cell: (row: iEmailAutomation) => {
                return (
                    <div className="u400">
                        <FormattedDate date_string={row.updated_at} format="DD/MM/YYY"/>
                    </div>
                );
            },
        },
        {
            name: "Action",
            selector: "action",
            grow: 0,
            minWidth: "150px",
            cell: (row: iEmailAutomation) => {
                return (
                    <div>
                        {
                            imported.includes(row.uid) && <div>
                                Imported
                            </div>
                        }
                        {
                            !imported.includes(row.uid) && <Button variant={"contained"}
                                                                   type={"submit"}
                                                                   className="positive-button"
                                                                   disabled={!!importing}
                                                                   color={"primary"} onClick={() => {
                                copyResources(row.uid, row.name)
                            }}>
                                {importing === row.uid && (
                                    <>
                                        <Spinner animation="border" size="sm"/>
                                        &nbsp;
                                    </>
                                )}
                                <div className="d-flex align-items-center">
                                    <HiDownload size="16"/>&nbsp;<span style={{marginTop: "2px"}}>Import</span>
                                </div>

                            </Button>
                        }
                    </div>
                );
            },
        },

    ];

    const copyResources = (uid: string, copy_name: string) => {
        setImporting(uid)
        new EmailAutomationAPIs().copy_automation(uid, copy_name).then((response) => {
            if (isMounted.current) {
                setImporting("")
                if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                } else {
                    notificationContext.pushSuccessNotification("Successfully imported " + copy_name + " automation")
                    onRefresh();
                    setImported(prevState => [
                        ...prevState,
                        uid
                    ])
                }
            }
        });
    };
    return <div>
        <div className="d-flex justify-content-center">
            <img src={import_automations} style={{width: "350px"}}/>
        </div>

        <CustomDataTable
            columns={columns}
            progressPending={loading}
            progressComponent={<AppLoader/>}
            data={(public_automations && public_automations.data) || []}
            sortServer
            onSort={(column, sortDirection) => {
                if (typeof column.selector === "string")
                    dispatchList(onSortAction(column.selector, sortDirection))
            }}
            noSearchFilter
            customStyles={customStyles}
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
                        There are no public automations.
                    </Alert>
                )
            }

            pagination
            paginationTotalRows={public_automations && public_automations.total}
            paginationPerPage={query.per_page}
            onChangeRowsPerPage={(per_page) => {
                dispatchList(per_page_row_change_action(per_page))
            }}
            paginationServer
            onChangePage={(page) => {
                dispatchList(current_page_change_action(page))
            }}
            defaultSortAsc={query.sort_direction === "asc"}
            defaultSortField={query.sort_order}
        />
        <Alert variant="info" style={{
            background: "#e4f4e3",
            color: "#2e7408",
            marginTop: "8px",
            borderRadius: "4px",
            paddingBlock: "20px",
            borderColor: "#e4f4e3"
        }}>
            <AiOutlineInfoCircle/> These automations will be imported from Emailwish to your account.No Previous data
            will be overwritten.
        </Alert>
    </div>
}
