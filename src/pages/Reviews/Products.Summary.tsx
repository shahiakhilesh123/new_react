import React, {useCallback, useContext, useEffect, useReducer} from "react";
import ShopifyReviewsAPIs, {
    iProductReviewListingResponse,
    iShopifyProduct
} from "../../apis/Reviews/shopify.reviews.apis";
import AppLoader from "../../components/Loader/AppLoader";
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
} from "../../redux/reducers";
import {Alert} from "react-bootstrap";
import {customStyles} from "../../components/common/common";
import CustomDataTable from "../../components/CustomerDataTable/CustomDataTable";
import useIsMounted from "ismounted";
import {Reducer} from "redux";
import Axios, {CancelTokenSource} from "axios";
import {Button} from "@material-ui/core";
import {NotificationContext} from "../../App";

export default function ProductsSummary() {

    const isMounted = useIsMounted();

    const [{
        loading,
        query,
        resource,
        error
    }, dispatchList] = useReducer<Reducer<iListResource<iProductReviewListingResponse>, iListResponseActions<iProductReviewListingResponse>>>
    (listReducer<iListResource<iProductReviewListingResponse>, any>({}), {query: {per_page: 20}, loading: true});

    const loadResource = useCallback(
        (source?: CancelTokenSource) => {
            dispatchList(loading_action());
            new ShopifyReviewsAPIs().list_products(query, source).then((response) => {
                if (isMounted.current) {
                    if (ShopifyReviewsAPIs.hasError(response)) {
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
            name: "Product",
            selector: "name",
            sortable: true,
            cell: (row: iShopifyProduct) => {
                return (
                    <div>
                        <h6 className="p-0">{row.shopify_title}</h6>
                    </div>
                );
            },
        },
        {
            name: "Total Reviews",
            selector: "name",
            sortable: true,
            cell: (row: iShopifyProduct) => {
                return (
                    <div>
                        {row.reviews_count}
                    </div>
                );
            },
        },
        {
            name: "Automatic Scraped From Older App",
            center: true,
            cell: (row: iShopifyProduct) => {
                return (
                    <div>
                        {row.review_fetch_complete ? "Yes" : "No"}
                    </div>
                );
            },
        },

    ];

    const notificationContext = useContext(NotificationContext);
    return <CustomDataTable

        paginationTotalRows={resource && resource.data && resource.total}


        noHeader
        moreActionButton={[]}
        actionButtons={[
            <Button
                variant="contained"
                color="primary"
                type="button"
                className="positive-button"
                onClick={() => {
                    new ShopifyReviewsAPIs().shopify_reviews_refetch().then((res) => {
                        if (ShopifyReviewsAPIs.hasError(res, notificationContext)) {

                        }
                    });
                }}
            >Import Again
            </Button>
        ]}

        columns={columns}
        progressPending={loading}
        progressComponent={<AppLoader/>}
        data={(resource && resource?.data) || []}
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
    />
}