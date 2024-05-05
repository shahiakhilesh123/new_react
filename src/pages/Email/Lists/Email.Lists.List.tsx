import { Button, Grid, IconButton, ListItemIcon, ListItemText, } from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import Axios, { CancelTokenSource } from "axios";
import useIsMounted from "ismounted";
import React, { useCallback, useContext, useEffect, useReducer, useState } from "react";
import { Alert, Col, Dropdown, Modal as Modal2, Row } from "react-bootstrap";
import { FaPlus, FaTrash } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useHistory } from "react-router-dom";
import EmailMailingListAPIs, { iEmailMailingListListingResponse, } from "../../../apis/Email/email.mailinglists.apis";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import HeadingCol from "../../../components/heading/HeadingCol";
import IconLabelButtons from "../../../components/IconLabelButtons/IconLabelButtons";
import AppLoader from "../../../components/Loader/AppLoader";
import { BorderLinearProgress } from "../../../components/Progress/BorderLinearProgress";
import FormattedDate from "../../../components/Utils/FormattedDate";
import { iEmailMailingList } from "../../../types/internal/email/mailinglist";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import TimelineIcon from "@material-ui/icons/Timeline";
import GroupIcon from "@material-ui/icons/Group";
import EditIcon from "@material-ui/icons/Edit";
import VerticalAlignBottomIcon  from "@material-ui/icons/VerticalAlignBottom";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import { customStyles } from "../../../components/common/common";
import { NotificationContext } from "../../../App";
import { AppModalContext } from "../../../components/Modal/CustomModal";
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
import { Reducer } from "redux";
import { getSortOrder, saveSortOrder } from "../../../components/utils";
import HelpVideo from "../../../components/HelpVideo/HelpVideo";
import { OpenRateWithTooltip } from "../../../components/Tooltip/HtmlTooltip";

const list_sort_key = "ew_list_list_sort";

function EmailListsList() {
  useEffect(() => {
    document.title = "Mailing Lists | Emailwish";
  }, []);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string[]>();
  const history = useHistory();

  const [{
    error, resource, loading, query
  }, dispatchList] = useReducer<Reducer<iListResource<iEmailMailingListListingResponse>, iListResponseActions<iEmailMailingListListingResponse>>>
      (listReducer<iListResource<iEmailMailingListListingResponse>, any>({}), {
        query: { per_page: 20, ...getSortOrder(list_sort_key) },
        loading: true
      });

  const modalContext = useContext(AppModalContext);

  const notificationContext = useContext(NotificationContext);

  const isMounted = useIsMounted();

  //@ts-ignore
  const CustomToggle = React.forwardRef(({ children, onClick }, ref: any) => (
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
      new EmailMailingListAPIs().listing(query, source).then((response) => {
        if (isMounted.current) {
          if (EmailMailingListAPIs.hasError(response, notificationContext)) {
            dispatchList(failed_action(response.message))
          } else {
            dispatchList(success_action(response))
          }
        }
      });
    },
    [isMounted, query]
  );

  const deleteResources = (uids: Array<string>) => {
    if (!window.confirm("Click 'OK' to confirm deletion:")) return;

    dispatchList(loading_action())
    new EmailMailingListAPIs().delete(uids).then((response) => {
      let source = Axios.CancelToken.source();
      if (isMounted.current) {
        if (EmailMailingListAPIs.hasError(response, notificationContext)) {
          dispatchList(failed_action(response.message))
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
  }, [query]);

  const [showHelpVideo, setShowHelpVideo] = useState(false);
  const [selectedRow, setSelectedRow] = useState<iEmailMailingList[]>();
  const columns = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
      grow: 1,
      cell: (row: iEmailMailingList) => {
        return (
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignItems="flex-start"
          >
            <Grid item>
              <Link to={"/email/lists/" + row.uid + "/overview"}>
                <h6 className="u500 color1">{row.name}</h6>
              </Link>
            </Grid>
            {row.created_at ? (
              <Grid
                container
                direction="row"
                justifyContent="flex-start"
                alignItems="flex-start"
              >
                Created At: <FormattedDate date_string={row.created_at} />
              </Grid>
            ) : (
              ""
            )}
          </Grid>
        );
      },
    },
    {
      name: "Subscribers",
      selector: "subscribers",
      center: true,
      grow: 0.5,
      cell: (row: iEmailMailingList) => {
        let cache_object: any = {};

        if (row && row.cache) {
          try {
            cache_object = JSON.parse(row.cache);
          } catch (e) {

          }
        }
        return (
          <div>
            {cache_object && (
              <div>{cache_object.SubscriberCount}</div>
            )}
          </div>
        );
      },
    },
    {
      name: <OpenRateWithTooltip />,
      selector: "open_rate",
      center: true,
      grow: 0.5,
      cell: (row: iEmailMailingList) => {
        return (
          <Grid
            container
            direction="column"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item>0%</Grid>
            <Grid item>
              <BorderLinearProgress variant="determinate" value={0} />
            </Grid>
          </Grid>
        );
      },
    },
    {
      name: "Click Rate",
      selector: "click_rate",
      center: true,

      grow: 0.5,
      cell: (row: iEmailMailingList) => {
        return (
          <Grid
            container
            direction="column"
            justifyContent="flex-end"
            alignItems="center"
          >
            <Grid item>0%</Grid>
            <Grid item>
              <BorderLinearProgress variant="determinate" value={0} />
            </Grid>
          </Grid>
        );
      },
    },
    {
      name: "Actions",
      grow: 1,
      cell: (row: iEmailMailingList) => {
        return (
          <div>
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <IconButton color="secondary" component="span" onClick={() => {
                  history.push(`/email/lists/${row.uid}/overview/subscribers/create`)
                }}>
                  <PersonAddIcon />
                </IconButton>
              </Grid>
              <Grid item>
                <IconLabelButtons
                  text="Statistics"
                  icon={<TimelineIcon />}
                  color="secondary"
                  onClick={() => {
                    history.push(`/email/lists/${row.uid}/overview`)
                  }}
                />
              </Grid>
              <span>
                <Dropdown drop="left">
                  <Dropdown.Toggle
                    as={CustomToggle}
                    id="dropdown-custom-components"
                  >
                    <IconButton>
                      <MoreHoriz />
                    </IconButton>
                  </Dropdown.Toggle>

                  <Dropdown.Menu draggable={true} className="position-fixed">
                    <Dropdown.Item eventKey="1" onClick={() => {
                      history.push(`/email/lists/${row.uid}/overview/subscribers`)
                    }}>
                      <div
                        style={{ display: "inline-flex", width: "100%" }}
                      >
                        <ListItemIcon
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <GroupIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Subscribers" />
                      </div>
                    </Dropdown.Item>
                    {/*<Dropdown.Item eventKey="2" onClick={()=>{*/}
                    {/*  history.push(`/email/lists/${row.uid}/overview/segments`)*/}
                    {/*}}>*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <CategoryIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary=" Segments" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    {/*<Dropdown.Item eventKey="3" onClick={()=>{*/}
                    {/*  history.push(`/email/lists/${row.uid}/overview/fields`)*/}
                    {/*}}>*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <PostAddIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Embedded form" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    {/*<Dropdown.Item eventKey="4" onClick={()=>{*/}
                    {/*  history.push(`/email/lists/${row.uid}/overview/fields`)*/}
                    {/*}}>*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <MenuBookIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Forms/Pages" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    {/*<Dropdown.Item eventKey="5" onClick={()=>{*/}
                    {/*  history.push(`/email/lists/${row.uid}/overview/fields`)*/}
                    {/*}}>*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <ListAltIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Manage list fields" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    {/*<Dropdown.Item eventKey="6" onClick={()=>{*/}
                    {/*  history.push(`/email/lists/${row.uid}/overview/verification`)*/}
                    {/*}}>*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <MailIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Email verification" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    <Dropdown.Item eventKey="7" onClick={() => {
                      history.push(`/email/lists/${row.uid}/overview/edit`)
                    }}>
                      <div style={{ display: "inline-flex", width: "100%" }}>
                        <ListItemIcon
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <EditIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Edit list" />
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="8" onClick={() => {
                      history.push(`/email/lists/${row.uid}/overview/subscribers/export`)
                    }}>
                      <div style={{ display: "inline-flex", width: "100%" }}>
                        <ListItemIcon
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <VerticalAlignTopIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Export" />
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="8" onClick={() => {
                      history.push(`/email/lists/${row.uid}/overview/subscribers/import`)
                    }}>
                      <div style={{ display: "inline-flex", width: "100%" }}>
                        <ListItemIcon
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                          }}
                        >
                          <VerticalAlignBottomIcon fontSize="small" color="secondary" />
                        </ListItemIcon>
                        <ListItemText primary="Import" />
                      </div>
                    </Dropdown.Item>
                    {/*<Dropdown.Item eventKey="9">*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <VerticalAlignTopIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Export" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    {/*<Dropdown.Item eventKey="10">*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <FileCopyIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Copy" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    {/*<Dropdown.Item eventKey="11">*/}
                    {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                    {/*    <ListItemIcon*/}
                    {/*      style={{*/}
                    {/*        display: "inline-flex",*/}
                    {/*        alignItems: "center",*/}
                    {/*      }}*/}
                    {/*    >*/}
                    {/*      <PeopleOutlineIcon fontSize="small" />*/}
                    {/*    </ListItemIcon>*/}
                    {/*    <ListItemText primary="Clone for other users" />*/}
                    {/*  </div>*/}
                    {/*</Dropdown.Item>*/}
                    {
                      !row.shopify_shop_id && <Dropdown.Item eventKey="11" onClick={() => {
                        modalContext.showActionModal &&
                          modalContext.showActionModal({
                            route: new EmailMailingListAPIs().getResourceDeletionURL(),
                            values: [{
                              value: row.uid,
                              label: ""
                            }],
                            title: "",
                            body: "Do you really want to delete this mail listing?"
                          },
                            (reload) => {
                              if (reload) {
                                loadResource();
                              }
                            })
                      }}
                      >
                        <div style={{ display: "inline-flex", width: "100%" }}>
                          <ListItemIcon
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                            }}
                          >
                            <DeleteIcon color="secondary" onClick={() => {
                            }} name="Delete " cursor={"pointer"} />
                          </ListItemIcon>
                          <ListItemText primary="Delete" />
                        </div>
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

  return <Row>
    <HeadingCol
      title={"Mailing Lists"}
      description={"Manage all your email addresses to use them in the automations and campaigns"}
    />
    <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
      helpLink={"https://www.youtube.com/embed/95yUBJDk_4U"} />

    <Col md={12}>
      <CustomDataTable
        selectableRows
        onSelectedRowsChange={(e) => {
          setSelectedRow(e.selectedRows);

        }}
        columns={columns}
        progressPending={loading}
        progressComponent={<AppLoader />}
        data={(resource && resource.lists?.data) || []}
        sortServer
        onSort={(column, sortDirection) => {
          if (typeof column.selector === "string")
            dispatchList(onSortAction(column.selector, sortDirection))
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
                  route: new EmailMailingListAPIs().getResourceDeletionURL(),
                  values: (selectedRow && selectedRow.map(e => {
                    return {
                      value: e.uid,
                      label: ""
                    }
                  })) || [],
                  title: "",
                  body: "Do you really want to delete these mailing list?"
                },
                  (reload) => {
                    if (reload) {
                      setSelectedRow([])
                      loadResource();
                    }
                  })
            }}
          >
            <FaTrash />
            &nbsp;Delete&nbsp;{selectedRow.length}
          </Button>] || []
        }
        noHeader
        actionButtons={[
          <Link to="/email/lists/create">
            <Button
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
          dispatchList(search_action(a))
        }}
        noDataComponent={
          error ? (
            <Alert variant="danger" className="w-100 mb-0">
              {error}
            </Alert>
          ) : (
            <Alert variant="dark" className="w-100 mb-0">
              There are no mailing lists.
              <br />
              <LinkContainer to="/email/lists/create">
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
    <Modal2 isOpen={deleteDialogOpen}
      className="modal-delete modal-lg modal-dialog-centered">
      <Modal2.Body>
        Are You Sure You Want To Delete Permanently?
      </Modal2.Body>
      <Modal2.Footer className="justify-content-center pt-4">
        <Link className="action-button" to="#"
          onClick={() => {
            setDeleteDialogOpen(false)
            if (deleteId)
              deleteResources(deleteId)
          }}>Yes</Link>
        <Link className="action-button no" to="#" onClick={() => setDeleteDialogOpen(false)}>No</Link>
      </Modal2.Footer>
    </Modal2>
  </Row>;
}

export default EmailListsList;
