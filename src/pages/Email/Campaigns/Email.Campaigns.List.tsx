import useIsMounted from "ismounted";
import React, { useCallback, useContext, useEffect, useReducer, useState, } from "react";
import capitalize from "capitalize";
import { Alert, Col, Dropdown, Form as ResendForm, Modal, Row, } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import HeadingCol from "../../../components/heading/HeadingCol";
import AppLoader from "../../../components/Loader/AppLoader";
import Axios, { CancelTokenSource } from "axios";
import { Link, useHistory, useLocation } from "react-router-dom";
import EmailCampaignAPIs, { EmailCampaignListResponse, } from "../../../apis/Email/email.campaigns.apis";
import { LinkContainer } from "react-router-bootstrap";
import { Button, Grid, IconButton, ListItemIcon, ListItemText, Theme } from "@material-ui/core";
import { iEmailCampaign, iEmailCampaignCache } from "../../../types/internal/email/campaign";
import { BorderLinearProgress } from "../../../components/Progress/BorderLinearProgress";
import FormattedDate from "../../../components/Utils/FormattedDate";
import IconLabelButtons from "../../../components/IconLabelButtons/IconLabelButtons";
import EditIcon from "@material-ui/icons/Edit";
import TimelineIcon from "@material-ui/icons/Timeline";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import DeleteIcon from "@material-ui/icons/Delete";
import PauseCircleOutlineIcon from "@material-ui/icons/PauseCircleOutline";
import RefreshIcon from "@material-ui/icons/Refresh";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import { MoreHoriz } from "@material-ui/icons";
import { customStyles } from "../../../components/common/common";
import { Formik } from "formik";
import * as yup from "yup";
import FormGroup from "../../../components/FormGroup/CustomFormGroup";
import { AppStateContext, NotificationContext } from "../../../App";
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
} from "../../../redux/reducers";
import { Reducer } from "redux";
import { getStatus, getStatusColor } from "../../../components/helper/common";
import { AppModalContext } from "../../../components/Modal/CustomModal";
import { getSortOrder, saveSortOrder } from "../../../components/utils";
import { OpenRateWithTooltip } from "../../../components/Tooltip/HtmlTooltip";

interface iOptions {
  text: string;
  value: string;
}

export const CustomToggle = React.forwardRef(
  ({ children, onClick }: any, ref: any) => (
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
  )
);
const list_sort_key = "ew_campaign_list_sort";

function EmailCampaignsList() {
  useEffect(() => {
    document.title = "Campaigns | EmailWish";
  }, []);

  const { shop } = useContext(AppStateContext);
  const [{
    error,
    resource,
    loading,
    query
  }, dispatchList] = useReducer<Reducer<iListResource<EmailCampaignListResponse>,
    iListResponseActions<EmailCampaignListResponse>>>(listReducer<iListResource<EmailCampaignListResponse>, any>({}), {
      query: { sort_order: "created_at", sort_direction: "desc", per_page: 20, ...getSortOrder(list_sort_key) },
      loading: true,
    });
  const modalContext = useContext(AppModalContext);

  const [pauseCampaign, setPauseCampaign] = useState<iEmailCampaign | undefined>();
  const [resumeCampaign, setResumeCampaign] = useState<iEmailCampaign | undefined>();
  const [copyCampaign, setCopyCampaign] = useState<iEmailCampaign | undefined>();
  const [resendCampaign, setResendCampaign] = useState<iEmailCampaign | undefined>();
  const [callback, setCallback] = useState<(reload: boolean) => void>();
  const [resendOptions, setResendOptions] = useState<any>({});
  const [values, setValues]: any = React.useState("");
  const history = useHistory();
  const isMounted = useIsMounted();
  const location = useLocation();

  const notificationContext = useContext(NotificationContext);

  const loadResource = useCallback(
    (source?: CancelTokenSource) => {
      dispatchList(loading_action());

      new EmailCampaignAPIs()
        .listing_campaigns(query, source)
        .then((response) => {
          if (isMounted.current) {
            if (EmailCampaignAPIs.hasError(response, notificationContext)) {
              dispatchList(failed_action(response.message));
            } else {
              dispatchList(success_action(response));
            }
          }
        });
    },
    [isMounted, shop, query]
  );

  const copyResources = (uid: string, copy_name: string) => {
    new EmailCampaignAPIs().copy_campaign(uid, copy_name).then((response) => {
      let source = Axios.CancelToken.source();
      if (isMounted.current) {
        if (EmailCampaignAPIs.hasError(response, notificationContext)) {
        } else {
          loadResource(source);
        }
      }
    });
  };

  const getResendOptions = useCallback((campaign_id: string) => {
    new EmailCampaignAPIs()
      .get_compaign_options(campaign_id)
      .then((response) => {
        setResendOptions(response);
      });
  }, []);

  const postCampaignResume = useCallback(async (campaign_id: string) => {
    await new EmailCampaignAPIs()
      .compaign_resume(campaign_id)
      .then((response) => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
          if (EmailCampaignAPIs.hasError(response, notificationContext)) {
          } else {
            loadResource(source);
          }
        }
      });
  }, []);

  const postCampaignPause = useCallback(async (campaign_id: string) => {
    await new EmailCampaignAPIs()
      .compaign_pause(campaign_id)
      .then((response) => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
          if (EmailCampaignAPIs.hasError(response, notificationContext)) {
          } else {
            loadResource(source);
          }
        }
      });
  }, []);
  const postResendCampaign = (campaign_id: string, selected_value: string) => {
    new EmailCampaignAPIs()
      .resend_compaign(campaign_id, selected_value)
      .then((response) => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
          if (EmailCampaignAPIs.hasError(response, notificationContext)) {
          } else {
            loadResource(source);
          }
        }
      });
  };
  useEffect(() => {
    let source = Axios.CancelToken.source();
    if (isMounted.current) {
      saveSortOrder(list_sort_key, query)
      loadResource(source);
    }
    return () => {
      source.cancel();
    };
  }, [query, isMounted, shop]);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    setValues(event.target.value);
  };
  const columns = [
    {
      name: "Name",
      selector: "name",
      grow: 1,
      sortable: true,
      cell: (row: iEmailCampaign) => {
        return (
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <Link
                to={
                  row.status === "new"
                    ? `/email/campaigns/${row.uid}/view/`
                    : `/email/campaigns/${row.uid}/overview/`
                }
              >
                <h6 className={"u500 color1"}>{row.name}</h6>
              </Link>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="flex-start"
              alignItems="flex-start"
            >
              {row.type === "regular" ? "HTML" : capitalize.words(row.type)}
            </Grid>
          </Grid>
        );
      },
    },
    {
      name: "Progress",
      grow: 0.8,
      cell: (row: iEmailCampaign) => {
        let cache: iEmailCampaignCache | undefined = undefined;
        try {
          if (row.cache !== null) {
            cache = JSON.parse(row.cache);
          }
        } catch (e) {
          cache = undefined;
        }
        if (!cache) return null;
        let percentage = (cache["DeliveredCount"] * 100) /
          cache["SubscriberCount"];
        if (isNaN(percentage)) {
          percentage = 0
        }

        return (
          <div className="w-100">
            {row.status !== "new" &&
              cache &&
              "SubscriberCount" in cache &&
              "DeliveredCount" in cache ? (
              <div className="campaign-list-progress">
                <span className="campaign-list-progress_1">
                  <span>
                    {
                      (percentage).toFixed(2)}{" "}%
                  </span>

                  <span>
                    {cache["DeliveredCount"]}/{cache["SubscriberCount"]}{" "}
                  </span>
                </span>
                <BorderLinearProgress
                  variant="determinate"
                  value={
                    percentage
                  }
                />
              </div>
            ) : (
              ""
            )}
            {row.status === "new" &&
              cache &&
              "SubscriberCount" in cache &&
              cache.SubscriberCount &&
              cache.SubscriberCount! === 0 ? (
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                {cache.SubscriberCount} Recipients
              </Grid>
            ) : (
              ""
            )}
          </div>
        );
      },
    },
    {
      name: <OpenRateWithTooltip />,
      grow: 0.5,
      cell: (row: iEmailCampaign) => {
        let cache: iEmailCampaignCache | undefined = undefined;
        try {
          if (row.cache !== null) {
            cache = JSON.parse(row.cache);
          }
        } catch (e) {
          cache = undefined;
        }
        return row.run_at ? (
          <div className="campaign-list-open-rate">
            {cache && "UniqOpenRate" in cache && (
              <>
                <span>{cache["UniqOpenRate"].toFixed(2)} %</span>
                <BorderLinearProgress variant="determinate"
                  value={parseFloat(cache["UniqOpenRate"].toString()) * 100} />
              </>
            )}
          </div>
        ) : (
          ""
        );
      },
    },
    {
      name: "Click Rate",
      grow: 0.5,
      cell: (row: iEmailCampaign) => {
        let cache: iEmailCampaignCache | undefined = undefined;
        try {
          if (row.cache !== null) {
            cache = JSON.parse(row.cache);
          }
        } catch (e) {
          cache = undefined;
        }
        return row.run_at ? (
          <div className="campaign-list-close-rate">
            {cache && "ClickedRate" in cache && (
              <>
                <span>{cache["ClickedRate"].toFixed(2)} %</span>
                <BorderLinearProgress variant="determinate"
                  value={parseFloat(cache["ClickedRate"].toString()) * 100} />
              </>
            )}
          </div>
        ) : (
          ""
        );
      },
    },
    {
      name: "Status",
      grow: 0.5,
      selector: "status",
      cell: (row: iEmailCampaign) => {
        return (
          <div
            style={{
              background: getStatusColor(row.status),
            }}
            className="campaign-status-badge"
          >
            {getStatus(row.status)}
          </div>
        );
      },
    },
    {
      name: "Created at",
      selector: "created_at",
      grow: 0.7,
      sortable: true,
      cell: (row: iEmailCampaign) => {
        return <FormattedDate date_string={row.created_at} />;
      },
    },
    {
      name: "Actions",
      grow: 1,
      cell: (row: iEmailCampaign) => {
        return (
          <div>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              {(row.status === "new" ||
                row.status === "ready" ||
                row.status === "error") && (
                  <Grid item>
                    <IconButton
                      aria-label="edit"
                      onClick={() => {
                        history.push(`/email/campaigns/${row.uid}/view/`);
                      }}
                    >
                      <EditIcon color="secondary" />
                    </IconButton>
                  </Grid>
                )}
              {row.status !== "new" && (
                <Grid item>
                  <IconLabelButtons
                    text="Stats"
                    color={"secondary"}
                    onClick={() => {
                      history.push(`/email/campaigns/${row.uid}/overview/`);
                    }}
                    icon={<TimelineIcon fontSize="small" color="secondary" />}
                  />
                </Grid>
              )}
              <Grid item>
                <Dropdown>
                  <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-custom-components"
                  >
                    <IconButton>
                      <MoreHoriz />
                    </IconButton>
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="position-fixed">
                    {[
                      (row.status === "done") && (
                        <Dropdown.Item
                          eventKey="6"
                          key={6}
                          onClick={() => {
                            getResendOptions(row.uid);
                            setResendCampaign(row);
                          }}
                        >
                          <div
                            style={{ display: "inline-flex", width: "100%" }}
                          >
                            <ListItemIcon
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <RefreshIcon fontSize="small" color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Resend" />
                          </div>
                        </Dropdown.Item>
                      ),
                      (row.status === "paused" || row.status === "error") && (
                        <Dropdown.Item
                          eventKey="6"
                          key={6}
                          onClick={() => {
                            setResumeCampaign(row);
                          }}
                        >
                          <div
                            style={{ display: "inline-flex", width: "100%" }}
                          >
                            <ListItemIcon
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <PlayArrowIcon fontSize="small" color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Resume" />
                          </div>
                        </Dropdown.Item>
                      ),
                      (row.status === "sending") && (
                        <Dropdown.Item
                          eventKey="6"
                          key={6}
                          onClick={() => {
                            setPauseCampaign(row);
                          }}
                        >
                          <div
                            style={{ display: "inline-flex", width: "100%" }}
                          >
                            <ListItemIcon
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <PauseCircleOutlineIcon fontSize="small" color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Pause" />
                          </div>
                        </Dropdown.Item>
                      ),
                      (row.status === "ready") && (
                        <Dropdown.Item
                          eventKey="3"
                          key={3}
                          onClick={() => {
                            setPauseCampaign(row);
                          }}
                        >
                          <div
                            style={{ display: "inline-flex", width: "100%" }}
                          >
                            <ListItemIcon
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <PauseCircleOutlineIcon fontSize="small" color="secondary" />
                            </ListItemIcon>
                            <ListItemText primary="Pause" />
                          </div>
                        </Dropdown.Item>
                      ),
                      <Dropdown.Item
                        eventKey="1"
                        key={1}
                        onClick={() => {
                          setCopyCampaign(row);
                        }}
                      >
                        <div style={{ display: "inline-flex", width: "100%" }}>
                          <ListItemIcon
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <FileCopyIcon fontSize="small" color="secondary" />
                          </ListItemIcon>
                          <ListItemText primary="Copy" />
                        </div>
                      </Dropdown.Item>,
                      <Dropdown.Item
                        eventKey="2"
                        key={2}
                        onClick={() => {
                          modalContext.showActionModal &&
                            modalContext.showActionModal(
                              {
                                route: new EmailCampaignAPIs().getResourceDeletionURL(),
                                values: [
                                  {
                                    value: row.uid,
                                    label: "",
                                  },
                                ],
                                title: "",
                                body:
                                  "Do you really want to delete this campaign?",
                              },
                              (reload) => {
                                if (reload) {
                                  loadResource();
                                }
                              }
                            );
                        }}
                      >
                        <div style={{ display: "inline-flex", width: "100%" }}>
                          <ListItemIcon
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <DeleteIcon
                              color="secondary"
                              onClick={() => {
                              }}
                              name="Delete "
                              cursor={"pointer"}
                            />
                          </ListItemIcon>
                          <ListItemText primary="Delete" />
                        </div>
                      </Dropdown.Item>,
                    ]}
                  </Dropdown.Menu>
                </Dropdown>
              </Grid>
            </Grid>
          </div>
        );
      },
    },
  ];

  const [selectedRow, setSelectedRow] = useState<iEmailCampaign[]>();

  return (
    <>
      <Row data-tut="reactour___campaigns">
        <HeadingCol title="Campaigns" description={""} />
        <Col md={12}>
          <CustomDataTable
            columns={columns}
            selectableRows
            onSelectedRowsChange={(e) => {
              setSelectedRow(e.selectedRows);
            }}
            progressPending={loading}
            progressComponent={<AppLoader />}
            data={
              (resource && resource.campaigns && resource.campaigns.data) || []
            }
            sortServer
            onSort={(column, sortDirection) => {
              if (typeof column.selector === "string")
                dispatchList(onSortAction(column.selector, sortDirection));
            }}
            multiActionButton={
              (selectedRow &&
                selectedRow.length > 0 && [
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"

                    onClick={() => {
                      modalContext.showActionModal &&
                        modalContext.showActionModal(
                          {
                            route: new EmailCampaignAPIs().getResourceDeletionURL(),
                            values:
                              (selectedRow &&
                                selectedRow.map((e) => {
                                  return {
                                    value: e.uid,
                                    label: "",
                                  };
                                })) ||
                              [],
                            title: "",
                            body:
                              "Do you really want to delete these campaigns?",
                          },
                          (reload) => {
                            if (reload) {
                              setSelectedRow([]);
                              loadResource();
                            }
                          }
                        );
                    }}
                  >
                    <FaTrash />
                    &nbsp;Delete&nbsp;{selectedRow.length}
                  </Button>,
                ]) ||
              []
            }
            noHeader
            actionButtons={[
              <Link to={"/email/campaigns/create"}>
                <Button
                  data-tut="reactour__create_campaigns"
                  variant="contained"
                  color="primary"
                  type="button"
                  className="positive-button"
                >
                  <FaPlus />
                  &nbsp;Add New
                </Button>
              </Link>,
            ]}
            onKeywordChange={(a) => {
              dispatchList(search_action(a));
            }}
            noDataComponent={
              error ? (
                <Alert variant="danger" className="w-100 mb-0">
                  {error}
                </Alert>
              ) : (
                <Alert variant="dark" className="w-100 mb-0">
                  There are no campaigns.
                  <br />
                  <LinkContainer to="/email/campaigns/create">
                    <Alert.Link>Click here</Alert.Link>
                  </LinkContainer>{" "}
                  to create one.
                </Alert>
              )
            }
            pagination
            paginationTotalRows={
              resource && resource.campaigns && resource.campaigns.total
            }
            paginationPerPage={query.per_page}
            onChangeRowsPerPage={(per_page) => {
              dispatchList(per_page_row_change_action(per_page));
            }}
            paginationServer
            onChangePage={(page) => {
              dispatchList(current_page_change_action(page));
            }}
            customStyles={customStyles}

            defaultSortAsc={query.sort_direction === "asc"}
            defaultSortField={query.sort_order}
          />
        </Col>
      </Row>
      <Modal
        show={!!copyCampaign}
        onHide={() => {
          setCopyCampaign(undefined);
        }}
      >
        {
          //@ts-ignore
          <Modal.Header closeButton>
            <Modal.Title>Name your new campaign</Modal.Title>
          </Modal.Header>
        }
        <Modal.Body>
          <Formik
            initialValues={{
              name: "Copy Of " + (copyCampaign && copyCampaign.name),
            }}
            validateOnChange={false}
            onSubmit={(values: any, helpers) => {
              if (copyCampaign) {
                copyResources(copyCampaign.uid, values.name);
                setCopyCampaign(undefined);
              }
            }}
            validationSchema={yup.object({
              name: yup.string().required("Please enter new name"),
            })}
          >
            {({ handleSubmit, values, touched, errors, handleChange }: any) => {
              return (
                <form onSubmit={handleSubmit}>
                  <FormGroup
                    onChange={handleChange}
                    values={values}
                    touched={touched}
                    errors={errors}
                    type="text"
                    name="name"
                    label="What would you like to name your campaign? *"
                  />
                  <div className="float-right">
                    <Button
                      color="secondary"
                      onClick={() => {
                        setCopyCampaign(undefined);
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
        show={!!resendCampaign}
        onHide={() => {
          setResendCampaign(undefined);
        }}
      >
        {
          //@ts-ignore
          <Modal.Header closeButton>
            {/*<Modal.Title>Name your new campaign</Modal.Title>*/}
          </Modal.Header>
        }
        <Modal.Body>
          <h4>Resend campaign</h4>
          <p>Send this campaign again, but only, to subscribers who:</p>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (resendCampaign) {
                postResendCampaign(resendCampaign.uid, values);
                setResendCampaign(undefined);
              }
            }}
          >
            {resendOptions.options && resendOptions.options.length > 0
              ? resendOptions.options.map((option: iOptions) => {
                return (
                  <ResendForm.Check
                    key={option.value}
                    custom
                    type={"radio"}
                    onChange={changeHandler}
                    checked={values === option.value}
                    value={option.value}
                    id={`${option.value}`}
                    label={`${option.text}`}
                  />
                );
              })
              : ""}
            <div className="float-right">
              <Button
                variant="outlined" color="secondary"
                onClick={() => {
                  setResendCampaign(undefined);
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                variant="contained"
                className="positive-button ml-1"
                type="submit"
              >
                Resend
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Modal
        show={!!pauseCampaign}
        onHide={() => {
          setPauseCampaign(undefined);
        }}
      >
        <Modal.Body>Do you really want to pause this campaign ?</Modal.Body>
        <Modal.Footer>
          <div className="float-right">
            <Button
              color="primary"
              onClick={() => {
                setPauseCampaign(undefined);
              }}
            >
              No
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                //getCampaignPause(pauseCampaign.uid);
                // setPauseCampaign(pauseCampaign?.uid)
                if (pauseCampaign) {
                  postCampaignPause(pauseCampaign.uid).then()
                }

                setPauseCampaign(undefined);
              }}
            >
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
      <Modal
        show={!!resumeCampaign}
        onHide={() => {
          setResumeCampaign(undefined);
        }}
      >
        <Modal.Body>Do you really want to resume this campaign ?</Modal.Body>
        <Modal.Footer>
          <div className="float-right">
            <Button
              color="primary"
              onClick={() => {
                setResumeCampaign(undefined);
              }}
            >
              No
            </Button>
            <Button
              color="secondary"
              onClick={() => {
                //getCampaignPause(pauseCampaign.uid);
                // setPauseCampaign(pauseCampaign?.uid)
                if (resumeCampaign) {
                  postCampaignResume(resumeCampaign.uid).then()
                }

                setResumeCampaign(undefined);
              }}
            >
              Yes
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EmailCampaignsList;
