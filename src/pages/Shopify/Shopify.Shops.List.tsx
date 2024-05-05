import { Button, IconButton } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import Axios, { CancelTokenSource } from "axios";
import useIsMounted from "ismounted";
import React, { Dispatch, useCallback, useContext, useEffect, useReducer } from "react";
import { Alert, Col, Row } from "react-bootstrap";
import { FaExternalLinkAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import ShopifyShopAPIs, { iShopifyShopListingResponse, } from "../../apis/Shopify/shopify.shops.apis";
import CustomDataTable from "../../components/CustomerDataTable/CustomDataTable";
import HeadingCol from "../../components/heading/HeadingCol";
import AppLoader from "../../components/Loader/AppLoader";
import { iShopifyShop } from "../../types/internal";
import { customStyles } from "../../components/common/common";
import { NotificationContext, AppDispatchContext } from "../../App";
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
    iStoreAction
} from "../../redux/reducers";
import { Reducer } from "redux";
import { AppModalContext } from "../../components/Modal/CustomModal";

function ShopifyShopsList() {
    const modalContext = useContext(AppModalContext);
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    useEffect(() => {
        document.title = "Brands | EmailWish";
    }, []);
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iShopifyShopListingResponse>, iListResponseActions<iShopifyShopListingResponse>>>
            (listReducer<iListResource<iShopifyShopListingResponse>, any>({}), {
                query: { sort_order: "created_at", sort_direction: "desc", per_page: 20 },
                loading: true,
            });

    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);


    const loadResource = useCallback(
        (source?: CancelTokenSource) => {
            dispatchList(loading_action());
            new ShopifyShopAPIs().listing(query, source).then((response) => {
                if (isMounted.current) {
                    if (ShopifyShopAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message));
                    } else {

                        dispatchList(success_action(response));
                    }
                }
            });
        },
        [isMounted, query]
    );

    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            loadResource(source);
        }
        return () => {
            source.cancel();
        };
    }, [query]);

    const columns = [
        {
            name: "Shop name",
            selector: "name",
            sortable: true,
            cell: (row: iShopifyShop) => {
                return (
                    <Link to={"/shopify/shops/view/" + row.uid}>

                        <h6 className="u500 color1"> {row.name}</h6>

                    </Link>
                );
            },
        },
        {
            name: "Active",
            selector: "active",
            sortable: true,
            cell: (row: iShopifyShop) => {
                return row.active === "1" ? (
                    "Yes"
                ) : (
                    <a
                        href={new ShopifyShopAPIs().getOauthURL(row.uid)}
                        rel="noreferrer noopener"
                        target="_blank"
                    >
                        <Button color="primary" variant="contained">
                            Authorize
                        </Button>
                    </a>
                );
            },
        },
        {
            name: "Actions",
            selector: "actions",
            sortable: true,
            cell: (row: iShopifyShop) => {
                return (
                    <>

                        <IconButton data-test={row.id.toString()} color="secondary" component="span" onClick={() => {
                            modalContext.showActionModal &&
                                modalContext.showActionModal({
                                    route: new ShopifyShopAPIs().getResourceDeletionURL(),
                                    values: [{
                                        value: row.uid.toString(),
                                        label: ""
                                    }],
                                    title: "",
                                    body: "Do you really want to delete " + row.name + " shop?"
                                },
                                    (reload) => {
                                        if (reload) {
                                            loadResource();

                                            const allShops = (resource && resource.items?.data) || [];
                                            const currentIndex = allShops.findIndex(shop => shop.uid === row.uid);
                                            let newActiveShop;

                                            if (currentIndex === 0 && allShops.length > 1) {
                                                newActiveShop = allShops[1];
                                            } else if (currentIndex !== -1) {
                                                newActiveShop = allShops[0];
                                            }

                                            if (newActiveShop) {
                                                dispatch({
                                                    type: "set_active_shop",
                                                    shop: newActiveShop
                                                });
                                            }

                                            window.location.reload();
                                        }
                                    })
                        }}>
                            <Delete />
                        </IconButton>
                        <a
                            href={`https://${row.myshopify_domain}`}
                            rel="noreferrer noopener"
                            target="_blank"
                        >
                            {row.myshopify_domain} <FaExternalLinkAlt />
                        </a>
                    </>
                );
            },
        },
    ];

    return (
        <Row>
            <HeadingCol
                title={"Brands"}
                description={
                    "Shops are to be added here to authorize us to access the shop data and create automations for\n" +
                    "                    you."
                }
            />
            <Col md={12}>
                <CustomDataTable
                    columns={columns}
                    progressPending={loading}
                    progressComponent={<AppLoader />}
                    data={(resource && resource.items?.data) || []}
                    sortServer
                    onSort={(column, sortDirection) => {
                        if (typeof column.selector === "string")
                            dispatchList(onSortAction(column.selector, sortDirection))
                    }}
                    noHeader
                    actionButtons={[
                        <a href="https://apps.shopify.com/emailmarketing_emailwish_abandonedcart_popup_chat_reviews"
                            target="_blank" rel="noopener noreferrer">
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                className="positive-button"
                            >
                                <FaPlus />
                                &nbsp;Add New
                            </Button>
                        </a>,
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
                                There are no shops
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
                />
            </Col>
        </Row>
    );
}

export default ShopifyShopsList;
