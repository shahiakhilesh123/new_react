//@packages
import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Alert, Badge, Col, Modal, Row} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Reducer} from "redux";

//@scripts
import AppCard from "../../../../components/Card/AppCard";
import AppCardBody from "../../../../components/Card/AppCardBody";
import {CampaignOverViewStateContext} from "./Email.Campaigns.Overview.Routes";
import EmailMailingListSubscriberAPIs, {iEmailMailingListSubscriberListingResponse} from "../../../../apis/Email/email.mailinglists.subscribers.apis";
import AppLoader from "../../../../components/Loader/AppLoader";
import CustomDataTable from "../../../../components/CustomerDataTable/CustomDataTable";
import {iEmailMailingListSubscriber} from "../../../../types/internal/email/mailinglist";
import {customStyles} from "../../../../components/common/common";
import {NotificationContext} from "../../../../App";
import {
    current_page_change_action,
    iListResource,
    iListResponseActions,
    listReducer,
    onSortAction,
    per_page_row_change_action,
    search_action
} from "../../../../redux/reducers";
import {EmailCampaignListResponse} from '../../../../apis/Email/email.campaigns.apis';
import FormattedDate from "../../../../components/Utils/FormattedDate";
import DashboardCardInfo from "../../../../components/DashboardCardInfo/DashboardCardInfo";

export interface iSubscriberListingResource {
    loading: boolean,
    error?: string,
    resource?: iEmailMailingListSubscriberListingResponse
}

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
export type iSubscriberListingAction =
    | { type: "loading" }
    | { type: "failed", error?: string }
    | { type: "success", resource: iEmailMailingListSubscriberListingResponse }

export function subscriberReducer(state: iSubscriberListingResource, action: iSubscriberListingAction): iSubscriberListingResource {
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

function EmailCampaignSubscriber() {

    useEffect(() => {
        document.title = "Campaign Subscriber | Emailwish";
    }, []);
    const [subscriberOptions, setSubscriberOptions] = useState<any | undefined>();
    const [copyMailingSubscriber, setCopyMailingSubscriber] = useState<iEmailMailingListSubscriber | undefined>();
    const {campaign} = useContext(CampaignOverViewStateContext);
    //const [query, queryDispatch] = useReducer(queryReducer, {});
    const [subscriberResource, subscriberDispatch] = useReducer(subscriberReducer, {loading: true});

    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<EmailCampaignListResponse>, iListResponseActions<EmailCampaignListResponse>>>
    (listReducer<iListResource<EmailCampaignListResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 20},
        loading: true,
    });


    const notificationContext = useContext(NotificationContext);
    const loadSubscriber = useCallback(() => {
        if (campaign) {
            subscriberDispatch({
                type: "loading",
            });
            new EmailMailingListSubscriberAPIs()
                .setCampaignUid(campaign.uid)
                .listing(query)
                .then(response => {
                    if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext)) {
                        subscriberDispatch({
                            type: "failed",
                            error: response.message
                        });
                    } else {
                        subscriberDispatch({
                            type: "success",
                            resource: response
                        });
                    }
                });
        }
    }, [query, campaign]);
    const getMailingSubscriberOptions = useCallback(async (list_uid: string, uid: string) => {
        await new EmailMailingListSubscriberAPIs().get_mailing_subscriber_options(list_uid, uid).then((response) => {
            setSubscriberOptions(response);
        })
    }, [])
    const copyCampaignSubscriber = (uid: string, copy_name: string) => {
        //   new EmailCampaignAPIs().copy_campaign(uid, copy_name).then((response) => {
        //     let source = Axios.CancelToken.source();
        //     if (isMounted.current) {
        //       if (EmailCampaignAPIs.hasError(response,notificationContext)) {

        //       } else {
        //         loadResource(source);
        //       }
        //     }
        //   });
    };
    useEffect(() => {
        loadSubscriber();
    }, [loadSubscriber])
    const columns = [
        {
            name: "Email",
            cell: (row: iEmailMailingListSubscriber) => {
                return (
                    <div className="campaign-subscriber-email">
                        {
                            row.email
                        }
                        <br/>
                        <Badge variant="success">{row.status}</Badge>
                    </div>
                );
            },
        },
        {
            name: "Last open",
            cell: (row: iEmailMailingListSubscriber) => {
                return (
                    <div className="campaign-subscriber-email">


                        {
                            (row.extra_stats && row.extra_stats.last_open_at && row.extra_stats.last_open_at.date &&
                                <FormattedDate date_string={row.extra_stats.last_open_at.date}
                                               format={'MMMM D, YYYY HH:mm'}/>) || "--"
                        }
                    </div>
                );
            },
        },
        {
            name: "Last click",
            cell: (row: iEmailMailingListSubscriber) => {
                return (
                    <div className="campaign-subscriber-email">
                        {
                            (row.extra_stats && row.extra_stats.last_click_at && row.extra_stats.last_click_at.date &&
                                <FormattedDate date_string={row.extra_stats.last_click_at.date}
                                               format={'MMMM D, YYYY HH:mm'}/>) || "--"
                        }
                    </div>
                );
            },
        },
        // {
        //     name: "Actions",
        //     grow: 1,
        //     cell: (row: iEmailMailingListSubscriber) => {
        //         return (
        //             <div>
        //                 <Grid
        //                     container
        //                     direction="row"
        //                     justifyContent="center"
        //                     alignItems="center"
        //                     spacing={1}
        //                 >
        //                     <a href={new EmailAutomationAPIs().getExternalEditorURL(row.uid)}>
        //                         <IconLabelButtons
        //                             text="Edit"
        //                             icon={<EditIcon/>}
        //                              color="secondary"
        //                         />
        //                     </a>
        //                     <span>
        //         <Dropdown>
        //           <Dropdown.Toggle
        //               as={CustomToggle}
        //               id="dropdown-custom-components"
        //           >
        //             <IconButton>
        //               <MoreHoriz/>
        //             </IconButton>
        //           </Dropdown.Toggle>
        //
        //           <Dropdown.Menu className="position-fixed">
        //                 <Dropdown.Item eventKey="1" key={1}>
        //                     {
        //                         row.status === "unsubscribed" && <div
        //                             style={{display: "inline-flex", width: "100%"}}
        //                             className="rdicon"
        //                             onClick={() => {
        //                                 if (campaign) {
        //                                     new EmailMailingListSubscriberAPIs()
        //                                         .subscribe(campaign.uid, [row.uid])
        //                                         .then((res) => {
        //                                             if (EmailMailingListSubscriberAPIs.hasError(res,notificationContext)) {
        //
        //                                             } else {
        //                                                 loadSubscriber();
        //                                             }
        //                                         })
        //                                 }
        //                             }}
        //                         >
        //                             <ListItemIcon
        //                                 style={{
        //                                     display: "flex",
        //                                     alignItems: "center",
        //                                 }}
        //                             >
        //                                 <FaPauseCircle fontSize="small"/>
        //                             </ListItemIcon>
        //                             <ListItemText
        //                                 primary="Unsubscribe"
        //                             />
        //                         </div>
        //                     }
        //                     {
        //                         row.status === "subscribed" && <div
        //                             style={{display: "inline-flex", width: "100%"}}
        //                             className="rdicon"
        //                             onClick={() => {
        //                                 if (campaign) {
        //                                     new EmailMailingListSubscriberAPIs()
        //                                         .unsubscribe(campaign.uid, [row.uid])
        //                                         .then((res) => {
        //                                             if (EmailMailingListSubscriberAPIs.hasError(res,notificationContext)) {
        //
        //                                             } else {
        //                                                 loadSubscriber();
        //                                             }
        //                                         })
        //                                 }
        //                             }}
        //                         >
        //                             <ListItemIcon
        //                                 style={{
        //                                     display: "flex",
        //                                     alignItems: "center",
        //                                 }}
        //                             >
        //                                 <FaPlayCircle fontSize="small"/>
        //                             </ListItemIcon>
        //                             <ListItemText
        //                                 primary="Subscribe"
        //                             />
        //                         </div>
        //                     }
        //                     </Dropdown.Item>,
        //                     <Dropdown.Item eventKey="2" key={2} onClick={() =>{
        //                         if(campaign){
        //                             getMailingSubscriberOptions(campaign.default_mail_list.uid, row.uid)
        //                             setCopyMailingSubscriber(row)
        //                         }
        //
        //                     }}>
        //                         <div
        //                             style={{display: "inline-flex", width: "100%"}}
        //                         >
        //                             <ListItemIcon
        //                                 style={{
        //                                     display: "inline-flex",
        //                                     alignItems: "center",
        //                                 }}
        //                             >
        //                                 <FileCopy fontSize="small"/>
        //                             </ListItemIcon>
        //                             <ListItemText
        //                                 primary="Copy to"
        //                             />
        //                         </div>
        //                     </Dropdown.Item>,
        //                     <Dropdown.Item eventKey="3" key={3}>
        //                         <div
        //                             style={{display: "inline-flex", width: "100%"}}
        //                         >
        //                             <ListItemIcon
        //                                 style={{
        //                                     display: "inline-flex",
        //                                     alignItems: "center",
        //                                 }}
        //                             >
        //                                 <MoveToInbox fontSize="small"/>
        //                             </ListItemIcon>
        //                             <ListItemText
        //                                 primary="Move to"
        //                             />
        //                         </div>
        //                     </Dropdown.Item>,
        //                     <Dropdown.Item eventKey="4" key={4}>
        //                         <div
        //                             style={{display: "inline-flex", width: "100%"}}
        //                         >
        //                             <ListItemIcon
        //                                 style={{
        //                                     display: "inline-flex",
        //                                     alignItems: "center",
        //                                 }}
        //                             >
        //                                   <DeleteIcon color="secondary" onClick={() => {
        //                                   }} name="Delete " cursor={"pointer"} />
        //                             </ListItemIcon>
        //                             <ListItemText
        //                                 primary="Delete to"
        //                             />
        //                         </div>
        //                     </Dropdown.Item>,
        //           </Dropdown.Menu>
        //         </Dropdown>
        //       </span>
        //                 </Grid>
        //             </div>
        //         );
        //     },
        // },
    ];
    return <Row className="mt-2 campaign-subscriber">
        {
            campaign && campaign.cache_object && <Col md={12} className="mt-2">
                <AppCard>
                    <AppCardBody>
                        <h5 className="mt-10"> Subscribers</h5>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="panel panel-white bg-teal-400">
                                    <div className="panel-body text-center">
                                        <h2 className="text-semibold mb-10 mt-0">
                                            {campaign.cache_object.ActiveSubscriberCount} / {campaign.cache_object.SubscriberCount}
                                        </h2>
                                        <div className="text-muted">
                                            Active subscribers
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="panel panel-white bg-teal-400">
                                    <div className="panel-body text-center">
                                        <h2 className="text-semibold mb-10 mt-0">
                                            {campaign.cache_object &&
                                            campaign.cache_object.DeliveredRate &&
                                            parseFloat((campaign.cache_object.DeliveredRate * 100).toString()).toFixed(2)}%
                                        </h2>
                                        <div className="text-muted">
                                            {campaign.cache_object && campaign.cache_object.DeliveredCount} Successfully
                                            delivered
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="panel panel-white bg-teal-400">
                                    <div className="panel-body text-center">
                                        <h2 className="text-semibold mb-10 mt-0">
                                            {campaign.cache_object &&
                                            campaign.cache_object.FailedDeliveredRate &&
                                            parseFloat((campaign.cache_object.FailedDeliveredRate * 100).toString())
                                                .toFixed(2)}%
                                        </h2>
                                        <div className="text-muted">
                                            {campaign.cache_object.FailedDeliveredCount} Failed delivery attempt
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="panel panel-white bg-teal-400">
                                    <div className="panel-body text-center">
                                        <h2 className="text-semibold mb-10 mt-0">{
                                            campaign.cache_object &&
                                            campaign.cache_object.NotDeliveredRate &&
                                            parseFloat((campaign.cache_object.NotDeliveredRate * 100).toString())
                                                .toFixed(2)}%</h2>
                                        <div className="text-muted">
                                            {

                                                campaign.cache_object.NotDeliveredCount} Pending delivery
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AppCardBody>
                </AppCard>
            </Col>
        }
        <Col md={12} className="mt-2">
            <CustomDataTable
                columns={columns}
                progressPending={subscriberResource.loading}
                progressComponent={<AppLoader/>}
                data={(subscriberResource.resource &&
                    subscriberResource.resource.subscribers &&
                    subscriberResource.resource.subscribers.data) || []}
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
                    subscriberResource.error ? (
                        <Alert variant="danger" className="w-100 mb-0">
                            {subscriberResource.error}
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

        </Col>
        <Col md={12}>
            <Modal
                show={!!subscriberOptions} onHide={() => {
                //setCopyMailingSubscriber(undefined)
                setSubscriberOptions(undefined);
            }}>
                {
                    //@ts-ignore
                    <Modal.Header closeButton/>
                }
                <Modal.Body>
                    <h4>Copy subscriber</h4>
                    <p>You're about to copy 1 subscriber(s) </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" onClick={() => {
                        setCopyMailingSubscriber(undefined)
                    }}
                    >
                        Submit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={() => {
                        setCopyMailingSubscriber(undefined);
                        setSubscriberOptions(undefined);
                    }}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>
    </Row>
}

export default EmailCampaignSubscriber;
