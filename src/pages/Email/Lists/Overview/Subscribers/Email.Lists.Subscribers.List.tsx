import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";
import {Button, Grid, IconButton, ListItemIcon, ListItemText,} from "@material-ui/core";
import EmailMailingListSubscriberAPIs, {iEmailMailingListSubscriberListingResponse,} from "../../../../../apis/Email/email.mailinglists.subscribers.apis";
import {MoreHoriz} from "@material-ui/icons";
import {Alert, Badge, Col, Dropdown, Row} from "react-bootstrap";
import AppLoader from "../../../../../components/Loader/AppLoader";
import {LinkContainer} from "react-router-bootstrap";
import {FaPlus} from "react-icons/fa";
import HeadingCol from "../../../../../components/heading/HeadingCol";
import CustomDataTable from "../../../../../components/CustomerDataTable/CustomDataTable";
import {customStyles} from "../../../../../components/common/common";
import {Reducer} from "redux";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  current_page_change_action,
  iListResource,
  iListResponseActions,
  listReducer,
  onSortAction,
  per_page_row_change_action,
  search_action,
} from "../../../../../redux/reducers";
import useIsMounted from "ismounted";
import FormattedDate from "../../../../../components/Utils/FormattedDate";
import {iEmailMailingListField, iEmailMailingListSubscriber} from "../../../../../types/internal/email/mailinglist";
import EditIcon from "@material-ui/icons/Edit";
import {NotificationContext} from "../../../../../App";
import {BreadCrumbContext, BreadCrumbLink,} from "../../../../../components/Breadcrumbs/WithBreadcrumb";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import GroupIcon from "@material-ui/icons/Group";
import Axios from "axios";
import EmailMailingListFieldsAPIs from "../../../../../apis/Email/email.mailinglists.fields.apis";

function EmailListsSubscribersList() {
    useEffect(() => {
        document.title = "Subscriber Lists | Emailwish";
    }, []);
    const params: any = useParams<any>();
    const isMounted = useIsMounted();
    const [columns, updateColumns] = useState<object[]>([]);
    const [response, dispatchList] = useReducer<Reducer<iListResource<iEmailMailingListSubscriberListingResponse>,
        iListResponseActions<iEmailMailingListSubscriberListingResponse>>>(
        listReducer<iListResource<iEmailMailingListSubscriberListingResponse>, any>(
            {}
        ),
        {query: {per_page: 20}, loading: true}
    );
    const {query} = response;
    const notificationContext = useContext(NotificationContext);
    const history = useHistory();

    const loadResource = useCallback(() => {
        dispatchList({type: "loading"});
        new EmailMailingListSubscriberAPIs()
            .setMailingListUid(params.list_uid)
            .listing(query)
            .then((response) => {
                if (isMounted.current) {
                    if (
                        EmailMailingListSubscriberAPIs.hasError(
                            response,
                            notificationContext
                        ) ||
                        !response.subscribers
                    ) {
                        dispatchList({type: "failed", error: response.message});
                    } else {
                        dispatchList({type: "success", resource: response});
                    }
                }
            });
        new EmailMailingListFieldsAPIs()
            .setMailingListUid(params.list_uid)
            .index()
            .then((response) => {
                assembleColumns(response.fields!);
            });
    }, [isMounted, query]);


    const assembleColumns = (response: iEmailMailingListField[]) => {
        console.log(response);
        let tmp_columns: any[] = []
        tmp_columns.push(
            {
                name: "Email",

                sortable: true,
                selector: "email",
                cell: (row: iEmailMailingListSubscriber) => {
                    return (
                        <div>
                            <p>{row.email}</p>
                            <Badge variant={row.status === "unsubscribed" ? "danger" : "info"}>
                                {row.status}
                            </Badge>
                        </div>
                    );
                },
            },
        );
        for(let i = 1; i < response.length; i++) {
            let elem : iEmailMailingListField = response[i];
            if(elem.visible === "0") continue;
            tmp_columns.push({
                name: elem.label,
                selector: elem.tag,

                cell: (row: iEmailMailingListSubscriber) => {

                    if (row && row.subscriber_fields && row.subscriber_fields.length > 0) {
                        let field = row.subscriber_fields.find(value => {
                            if (value.field) {
                                if (value.field.tag === elem.tag) {
                                    return true
                                }
                            }
                            return false
                        })
                        return <p>{field && field.value}</p>
                    }
                    return null;
                }
                });
        }
        tmp_columns.push(
            {
                name: "Created at",
                sortable: true,
                selector: "created_at",
                cell: (row: iEmailMailingListSubscriber) => (
                    <div style={{margin: "0px 0px 14.4px"}}><FormattedDate date_string={row.created_at}/></div>
                ),
            },
            {
                name: "Updated at",
                sortable: true,
                selector: "updated_at",
                cell: (row: iEmailMailingListSubscriber) => (
                    <div style={{margin: "0px 0px 14.4px"}}><FormattedDate date_string={row.updated_at}/></div>
                ),
            },
            {
                name: "Actions",
                grow: 2,
                cell: (row: iEmailMailingListSubscriber) => {
                    return (
                        <>
                            <Grid
                                container
                                direction="row"
                                alignItems="center"
                                spacing={1}
                            >
                                <Grid item>
                                    <IconButton
                                        aria-label="edit"
                                        color="secondary"
                                        onClick={() => {
                                            history.push(
                                                `/email/lists/${params.list_uid}/overview/subscribers/${row.uid}/edit`
                                            );
                                        }}
                                    >
                                        <EditIcon color="secondary"/>
                                    </IconButton>
                                </Grid>

                                <Dropdown>
                                    <Dropdown.Toggle
                                        as={CustomToggle}
                                        id="dropdown-custom-components"
                                    >
                                        <IconButton>
                                            <MoreHoriz/>
                                        </IconButton>
                                    </Dropdown.Toggle>
                                    <DropdownMenu className="position-fixed">
                                        {row.status === "unsubscribed"
                                            ? [
                                                <Dropdown.Item
                                                    eventKey="1"
                                                    key={1}
                                                    onClick={() => {
                                                        subscribe(row.uid, [row.uid])
                                                    }}
                                                >
                                                    <div
                                                        style={{display: "inline-flex", width: "100%"}}
                                                    >
                                                        <ListItemIcon
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <GroupIcon fontSize="small" color="secondary"/>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Subscribe"
                                                        />
                                                    </div>
                                                </Dropdown.Item>,
                                            ]
                                            : [
                                                <Dropdown.Item
                                                    eventKey="1"
                                                    key={1}
                                                    onClick={() => {
                                                        unsubscribe(row.uid, [row.uid])
                                                    }}
                                                >
                                                    <div
                                                        style={{display: "inline-flex", width: "100%"}}
                                                    >
                                                        <ListItemIcon
                                                            style={{
                                                                display: "inline-flex",
                                                                alignItems: "center",
                                                            }}
                                                        >
                                                            <GroupIcon fontSize="small" color="secondary"/>
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary="Unsubscribe"
                                                            onClick={() => {
                                                                row.status = "unsubscribed";
                                                            }}
                                                        />
                                                    </div>
                                                </Dropdown.Item>,
                                            ]}
                                        {/*<Dropdown.Item*/}
                                        {/*  eventKey="2"*/}
                                        {/*  key={2}*/}
                                        {/*  onClick={() => {*/}
                                        {/*    copy_subscriber(row.uid)*/}
                                        {/*  }}*/}
                                        {/*>*/}
                                        {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                                        {/*    <ListItemIcon*/}
                                        {/*      style={{ display: "flex", alignItems: "center" }}*/}
                                        {/*    >*/}
                                        {/*      <FileCopyIcon fontSize="small" />*/}
                                        {/*    </ListItemIcon>*/}
                                        {/*    <ListItemText primary="Copy" />*/}
                                        {/*  </div>*/}
                                        {/*</Dropdown.Item>*/}
                                        {/*<Dropdown.Item eventKey="3" key={3}>*/}
                                        {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                                        {/*    <ListItemIcon*/}
                                        {/*      style={{ display: "flex", alignItems: "center" }}*/}
                                        {/*    >*/}
                                        {/*      <ArrowRightAltIcon fontSize="default" />*/}
                                        {/*    </ListItemIcon>*/}
                                        {/*    <ListItemText*/}
                                        {/*      primary="Move To"*/}
                                        {/*      onClick={() => {*/}
                                        {/*       move_subscriber(row.uid)*/}
                                        {/*      }}*/}
                                        {/*    />*/}
                                        {/*  </div>*/}
                                        {/*</Dropdown.Item>*/}
                                        {/*<Dropdown.Item eventKey="4" key={4}*/}
                                        {/*onClick={() => {*/}
                                        {/*  send_confirmation_mail(row.uid)*/}
                                        {/*}}>*/}
                                        {/*  <div style={{ display: "inline-flex", width: "100%" }}>*/}
                                        {/*    <ListItemIcon*/}
                                        {/*      style={{ display: "flex", alignItems: "center" }}*/}
                                        {/*    >*/}
                                        {/*      <Mail fontSize="small" />*/}
                                        {/*    </ListItemIcon>*/}
                                        {/*    <ListItemText*/}
                                        {/*      primary="Send Confirmation Mail"*/}
                                        {/*    />*/}
                                        {/*  </div>*/}
                                        {/*</Dropdown.Item>*/}
                                        <Dropdown.Item
                                            eventKey="5"
                                            key={5}
                                            onClick={() => {
                                                delete_subscriber(row.uid, [row.uid])
                                            }}
                                        >
                                            <div style={{display: "inline-flex", width: "100%"}}>
                                                <ListItemIcon
                                                    style={{
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                    }}
                                                >
                                                    <DeleteIcon
                                                        color="secondary"
                                                        onClick={() => {
                                                        }}
                                                        name="Delete "
                                                        cursor={"pointer"}
                                                    />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Delete"
                                                />
                                            </div>
                                        </Dropdown.Item>
                                    </DropdownMenu>
                                </Dropdown>
                            </Grid>
                        </>
                    );
                },
            },
        );
        console.log(tmp_columns);
        updateColumns(tmp_columns);

    };

    const subscribe = useCallback((list_uid: string, uids: string[]) => {
        new EmailMailingListSubscriberAPIs().subscribe(list_uid, uids).then((response) => {
            let source = Axios.CancelToken.source();
            if (isMounted.current) {
                if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {

                } else {
                    loadResource();
                }
            }
        })
    }, []);

    const copy_subscriber = useCallback((list_uid: string) => {
        new EmailMailingListSubscriberAPIs().copy_subscriber(list_uid).then((response) => {
            let source = Axios.CancelToken.source();
            if (isMounted.current) {
                if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {

                } else {
                    loadResource();
                }
            }
        })
    }, []);

    const move_subscriber = useCallback((list_uid: string) => {
        new EmailMailingListSubscriberAPIs().move_subscriber(list_uid).then((response) => {
            let source = Axios.CancelToken.source();
            if (isMounted.current) {
                if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {

                } else {
                    loadResource();
                }
            }
        })
    }, []);

    const send_confirmation_mail = useCallback((list_uid: string) => {
        new EmailMailingListSubscriberAPIs().send_confirmation_mail(list_uid).then((response) => {
            let source = Axios.CancelToken.source();
            if (isMounted.current) {
                if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {

                } else {
                    loadResource();
                }
            }
        })
    }, []);

    const unsubscribe = useCallback((list_uid: string, uids: string[]) => {
        new EmailMailingListSubscriberAPIs().unsubscribe(list_uid, uids).then((response) => {

            if (isMounted.current) {
                if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {

                } else {
                    loadResource();

                }
            }
        })

    }, []);

    const delete_subscriber = useCallback((list_uid: string, uids: string[]) => {
        new EmailMailingListSubscriberAPIs().delete_subscriber(list_uid, uids).then((response) => {
            let source = Axios.CancelToken.source();
            if (isMounted.current) {
                if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {

                } else {
                    loadResource();
                }
            }
        })
    }, []);

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = [];
            links.push({
                link: "/email/lists",
                text: "Lists",
            });
            if (response && response.resource && response.resource.list) {
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview`,
                    text: response.resource.list.name,
                });
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview/subscribers`,
                    text: "Subscribers",
                });
            }
            breadcrumb.setLinks(links);
        }
    }, [response]);

    //@ts-ignore
    const CustomToggle = React.forwardRef(
        ({children, onClick}: any, ref: any) => (
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

    useEffect(() => {
        loadResource();
    }, [query]);

    return (
        <>
            <Row>
                <HeadingCol title="Subscribers" description={""}/>
                <Col md={12}>
                    <CustomDataTable
                        columns={columns}
                        progressPending={response.loading}
                        progressComponent={<AppLoader/>}
                        data={
                            (response &&
                                response.resource &&
                                response.resource.subscribers &&
                                response.resource.subscribers.data) ||
                            []
                        }
                        sortServer
                        onSort={(column, sortDirection) => {
                            if (typeof column.selector === "string")
                                dispatchList(onSortAction(column.selector, sortDirection));
                        }}
                        noHeader
                        actionButtons={[
                            <Link
                                to={`/email/lists/${params.list_uid}/overview/subscribers/create`}
                            >
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    className="positive-button"
                                >
                                    <FaPlus/>
                                    &nbsp;Add New
                                </Button>
                            </Link>,
                        ]}
                        onKeywordChange={(a) => {
                            dispatchList(search_action(a));
                        }}
                        noDataComponent={
                            response.error ? (
                                <Alert variant="danger" className="w-100 mb-0">
                                    {response.error}
                                </Alert>
                            ) : (
                                <Alert variant="dark" className="w-100 mb-0">
                                    There are no Subscribers.
                                    <br/>
                                    <LinkContainer
                                        to={`/email/lists/${params.list_uid}/overview/subscribers/create`}
                                    >
                                        <Alert.Link>Click here</Alert.Link>
                                    </LinkContainer>{" "}
                                    to create one.
                                </Alert>
                            )
                        }
                        pagination
                        paginationTotalRows={response && response.resource &&
                        response.resource.subscribers && response.resource.subscribers.total}
                        paginationPerPage={response.query.per_page}
                        onChangeRowsPerPage={(per_page) => {
                            dispatchList(per_page_row_change_action(per_page));
                        }}
                        paginationServer
                        onChangePage={(page) => {
                            dispatchList(current_page_change_action(page));
                        }}
                        customStyles={customStyles}
                    />
                </Col>
            </Row>

        </>
    );
}

export default EmailListsSubscribersList;
