import React from "react";
import {Pagination} from "react-bootstrap";
import "./style.css";
import {iAppPaginationProps} from "../../types/props";


function SimplePagination(props: iAppPaginationProps) {

    let current_page_count = props.current_page ? props.current_page : 1;
    let total_count = props.total_pages ? props.total_pages : 1;

    //if(current_page > total_count)  total_count = current_page;
    return <div>
        <div
            className="d-flex justify-content-center align-items-center mb-2">{current_page_count} of {total_count}</div>
        <div className="d-flex justify-content-center align-items-center">
            <Pagination>
                <Pagination.Prev
                    disabled={!(current_page_count !== 1)}
                    onClick={() => {
                        props.onPageChange && props.onPageChange(current_page_count - 1);
                    }}/>
                <Pagination.Next
                    disabled={current_page_count >= total_count}
                    onClick={() => {
                        props.onPageChange && props.onPageChange(current_page_count + 1)
                    }}/>
            </Pagination></div>
    </div>;

}

export default SimplePagination;