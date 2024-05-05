import {Button, Grid,} from "@material-ui/core";
import Axios, {CancelTokenSource} from "axios";
import useIsMounted from "ismounted";
import React, {Dispatch, useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Alert, Badge, Col, Modal, Row} from "react-bootstrap";
import {FaTrash} from "react-icons/fa";
import {useHistory} from "react-router-dom";
import ShopifyReviewsAPIs, {iShopifyReviewListingResponse,} from "../../apis/Reviews/shopify.reviews.apis";
import CustomDataTable from "../../components/CustomerDataTable/CustomDataTable";
import HeadingCol from "../../components/heading/HeadingCol";
import AppLoader from "../../components/Loader/AppLoader";
import {iShopifyReview} from "../../types/internal";
import {customStyles} from "../../components/common/common";
// @ts-ignore
import FormattedDate from "../../components/Utils/FormattedDate";
import {AppDispatchContext, AppStateContext, NotificationContext} from "../../App";
import UserAPIs from "../../apis/user.apis";
import {
    current_page_change_action,
    failed_action,
    iListResource,
    iListResponseActions,
    iStoreAction,
    listReducer,
    loading_action,
    onSortAction,
    per_page_row_change_action,
    search_action,
    success_action
} from "../../redux/reducers";
import EditIcon from "@material-ui/icons/Edit";
import IconLabelButtons from "../../components/IconLabelButtons/IconLabelButtons";
import {Done} from "@material-ui/icons";
import {AppModalContext} from "../../components/Modal/CustomModal";
import {Reducer} from "redux";
import SyntaxHighlighter from "react-syntax-highlighter";
import {docco} from "react-syntax-highlighter/dist/esm/styles/hljs";
import {getSortOrder, saveSortOrder} from "../../components/utils";
import HelpVideo from "../../components/HelpVideo/HelpVideo";

const list_sort_key = "ew_review_list_sort";

function ReviewsList() {
    useEffect(() => {
        document.title = "Reviews | Emailwish";
    }, []);
    const isMounted = useIsMounted();

    const [{
        loading,
        query,
        resource,
        error
    }, dispatchList] = useReducer<Reducer<iListResource<iShopifyReviewListingResponse>, iListResponseActions<iShopifyReviewListingResponse>>>
    (listReducer<iListResource<iShopifyReviewListingResponse>, any>({}), {
        query: {per_page: 20, ...getSortOrder(list_sort_key)},
        loading: true
    });
    const [selectedPopup, setSelectedPopup] = React.useState<any>([]);
    const [showEmbedGuide, setEmbedGuide] = useState<boolean>(false)
    const {review_enabled} = useContext(AppStateContext);
    const history = useHistory();
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    const notificationContext = useContext(NotificationContext);
    const loadResource = useCallback(
        (source?: CancelTokenSource) => {
            dispatchList(loading_action());
            new ShopifyReviewsAPIs().listing(query, source).then((response) => {
                if (isMounted.current) {
                    if (ShopifyReviewsAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message));
                    } else {
                        dispatchList(success_action(response));
                    }
                }
            });
        },
        [isMounted, query]
    );
    const [selectedRow, setSelectedRow] = useState<iShopifyReview[]>();


    const modalContext = useContext(AppModalContext);
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
    const columns = [
        {
            name: "Reviewer",
            selector: "reviewer_name",
            cell: (row: iShopifyReview) => {
                return (
                    <div>
                        <h6 className="p-0">{row.reviewer_name}</h6>
                        <span>{row.reviewer_email}</span>
                    </div>
                );
            },
        },
        {
            name: "Review",
            cell: (row: iShopifyReview) => {
                return (
                    <div>
                        <p className="p-0">{row.title}</p>
                        <p className="p-0">{row.message}</p>
                        <div className="review-images-in-list">
                            {
                                row.images && row.images.map((image) => {
                                    return <img src={image.full_path} alt={row.title} key={image.id}/>
                                })
                            }
                        </div>

                    </div>
                );
            },
        },
        {
            name: "Stars",
            cell: (row: iShopifyReview) => {
                return <p>{parseInt(row.stars)}</p>;
            },
        },
        {
            name: "Product",
            cell: (row: iShopifyReview) => {
                return (
                    <div>
                        <p className="p-0 m-0">{row.product_title}</p>
                    </div>
                );
            },
        },
        {
            name: "Verified Purchase",
            center: true,
            cell: (row: iShopifyReview) => {
                return (
                    <div>
                        {
                            row.verified_purchase && <Done color="primary"/>
                        }

                    </div>
                );
            },
        },
        {
            name: "Status",
            center: true,
            cell: (row: iShopifyReview) => {
                return (
                    <div>
                        {
                            row.approved && <Badge variant="primary">Approved</Badge>
                        }
                        {
                            !row.approved && <Badge variant="secondary">Not Approved</Badge>
                        }

                    </div>
                );
            },
        },
        {
            name: "Created on",
            selector: "created_at",
            sortable: true,

            cell: (row: iShopifyReview) => {
                return (
                    <div>
                        <FormattedDate date_string={row.created_at}/>
                    </div>
                );
            },
        },
        {
            name: "Actions",
            grow: 2,
            cell: (row: iShopifyReview) => {
                return <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid
                        item
                    >
                        <IconLabelButtons
                            text="Edit"
                            icon={<EditIcon fontSize="small" color="secondary" name="Edit Review" cursor={"pointer"}/>}
                            color="secondary"
                            onClick={() => {
                                history.push("/reviews/edit/" + row.uid)
                            }}
                        />
                    </Grid>
                    {/*<Grid*/}
                    {/*    item*/}
                    {/*>*/}

                    {/*    <Dropdown>*/}
                    {/*        <Dropdown.Toggle*/}
                    {/*            as={CustomToggle}*/}
                    {/*            id="dropdown-custom-components"*/}
                    {/*        >*/}
                    {/*            <IconButton>*/}
                    {/*                <MoreHoriz/>*/}
                    {/*            </IconButton>*/}
                    {/*        </Dropdown.Toggle>*/}
                    {/*        <Dropdown.Menu className="position-fixed">*/}
                    {/*            <Dropdown.Item*/}
                    {/*                onClick={() => {*/}
                    {/*                    modalContext.showActionModal &&*/}
                    {/*                    modalContext.showActionModal({*/}
                    {/*                            route: new ShopifyReviewsAPIs().getResourceDeletionURL(),*/}
                    {/*                            values: [{*/}
                    {/*                                value: row.uid,*/}
                    {/*                                label: ""*/}
                    {/*                            }],*/}
                    {/*                            title: "",*/}
                    {/*                            body: "Do you really want to delete this review?"*/}
                    {/*                        },*/}
                    {/*                        (reload) => {*/}
                    {/*                            if (reload) {*/}
                    {/*                                loadResource();*/}
                    {/*                            }*/}
                    {/*                        })*/}
                    {/*                }}*/}
                    {/*            >*/}
                    {/*                <div*/}
                    {/*                    style={{display: "inline-flex", width: "100%"}}*/}
                    {/*                >*/}
                    {/*                    <ListItemIcon*/}
                    {/*                        style={{display: "flex", alignItems: "center"}}*/}
                    {/*                    >*/}
                    {/*                        <DeleteIcon color="error" onClick={() => {*/}
                    {/*                        }} name="Delete " cursor={"pointer"}/>*/}
                    {/*                    </ListItemIcon>*/}
                    {/*                    <ListItemText primary="Delete"/>*/}
                    {/*                </div>*/}
                    {/*            </Dropdown.Item>*/}

                    {/*        </Dropdown.Menu>*/}
                    {/*    </Dropdown>*/}
                    {/*</Grid>*/}
                </Grid>
                    ;
            },
        },
    ];

    return <><Row>
        <HeadingCol
            title="Reviews"
            description={
                "You can manage the reviews for the products in your shop here."
            }
            enable_button_text_data_tut="reactour__review_enable"
            enable_button_text="Enable Review"
            checked={review_enabled}
            onCheckChanged={(value => {
                dispatch({type: "review_enabled", enabled: value})
                new UserAPIs().review_module_status(value).then((response) => {
                    if (isMounted.current) {
                        if (UserAPIs.hasError(response, notificationContext)) {
                            dispatch({type: "review_enabled", enabled: !value})
                        } else {
                            dispatch({type: "review_enabled", enabled: response.review_module_enabled})
                        }
                    }
                })
            })}
        />
        <Col md={12}>
            <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                       helpLink={"https://www.youtube.com/embed/WHpF1BFjnFA"}/>

            <CustomDataTable
                selectableRows
                onSelectedRowsChange={(e) => {
                    setSelectedRow(e.selectedRows);

                }}
                onHelpLinkClick={() => {
                    setShowHelpVideo(true)
                }}
                paginationTotalRows={resource && resource.items && resource.items.data && resource.items.total}


                noHeader
                moreActionButton={(selectedRow && selectedRow.length > 0) && [
                    {
                        child: <>Mark as verified</>,
                        onClick: () => {

                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new ShopifyReviewsAPIs().getResourceVerifiedURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid,
                                            label: ""
                                        }
                                    })) || [],
                                    title: "",
                                    body: "Do you really want to mark these reviews as verified?", request_type: "POST"
                                },
                                (reload) => {
                                    if (reload) {

                                        loadResource();
                                    }
                                })
                        }
                    },
                    {
                        child: <>Mark as not verified</>,
                        onClick: () => {

                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new ShopifyReviewsAPIs().getResourceUnVerifiedURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid,
                                            label: ""
                                        }
                                    })) || [],
                                    title: "",
                                    body: "Do you really want to mark these reviews as not verified?", request_type: "POST"
                                },
                                (reload) => {
                                    if (reload) {

                                        loadResource();
                                    }
                                })
                        }
                    },
                    {
                        child: <>Mark as Approved</>,
                        onClick: () => {

                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new ShopifyReviewsAPIs().getResourceApproveURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid,
                                            label: ""
                                        }
                                    })) || [],
                                    title: "",
                                    body: "Do you really want to mark these reviews as approved?", request_type: "POST"
                                },
                                (reload) => {
                                    if (reload) {

                                        loadResource();
                                    }
                                })
                        }
                    },
                    {
                        child: <>Mark as not Approved</>,
                        onClick: () => {

                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new ShopifyReviewsAPIs().getResourceDisApproveURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid,
                                            label: ""
                                        }
                                    })) || [],
                                    title: "",
                                    body: "Do you really want to mark these reviews as not approved?",
                                    request_type: "POST"
                                },
                                (reload) => {
                                    if (reload) {

                                        loadResource();
                                    }
                                })
                        }
                    },
                ] || []}
                multiActionButton={
                    (selectedRow && selectedRow.length > 0) && [<Button
                        variant="contained"
                        color="secondary"
                        type="button"

                        onClick={() => {

                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new ShopifyReviewsAPIs().getResourceDeletionURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid,
                                            label: ""
                                        }
                                    })) || [],
                                    title: "",
                                    body: "Do you really want to delete these reviews?"
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
                actionButtons={[
                    <Button
                        variant="contained"
                        color="primary"
                        type="button"
                        className="positive-button"
                        onClick={() => {
                            setEmbedGuide(true)
                        }}
                    >Embed Guide
                    </Button>
                ]}
                columns={columns}
                progressPending={loading}
                progressComponent={<AppLoader/>}
                data={(resource && resource.items?.data) || []}
                sortServer
                onSort={(column, sortDirection) => {
                    if (typeof column.selector === "string")
                        dispatchList(onSortAction(column.selector, sortDirection))
                }}

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
                            There are no reviews.
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
        <Modal show={showEmbedGuide}
               onHide={() => {
                   setEmbedGuide(false)
               }} aria-labelledby="contained-modal-title-vcenter"
               centered>
            {
                //@ts-ignore
                <Modal.Header closeButton>
                    <Modal.Title>Embed Guide</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                <div>
                    <h6>
                        Product Page Review
                    </h6>
                    <p>
                        Product page reviews will be automatically embedded when you turn on "Enable Review" switch. No
                        extra configuration is required.
                    </p>
                    <h6>
                        All Products Reviews
                    </h6>
                    <p>
                        You can use the following snippet to embed all products reviews in any page. You also need to
                        turn on "Enable Review" switch to make the review appear.
                        <SyntaxHighlighter language="html" style={docco}>
                            {"<div id=\"ew-all-products-reviews\"></div>"}
                        </SyntaxHighlighter>
                        If you are using wordpress you can embed using the following shortcode
                        <SyntaxHighlighter language="html" style={docco}>
                            {"[ew_all_reviews]"}
                        </SyntaxHighlighter>
                    </p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    setEmbedGuide(false)
                }}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>

}

export default ReviewsList;
