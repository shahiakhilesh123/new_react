import React from "react";
import {Pagination} from "react-bootstrap";
import "./style.css";
import {iAppPaginationProps} from "../../types/props";


function AppPagination(props: iAppPaginationProps) {

    let current_page_count = props.current_page ? props.current_page : 1;
    let total_count = props.total_pages ? props.total_pages : 1;

    //if(current_page > total_count)  total_count = current_page;
    return <div>
        <div style={{display: "inline-block"}} className={"ml-5 mr-2"}>{current_page_count} of {total_count}</div>
        <div style={{display: "inline-block"}}><Pagination>
            {current_page_count !== 1 ? <Pagination.First onClick={() => {
                props.onPageChange && props.onPageChange(1)
            }}/> : undefined}
            {current_page_count !== 1 ? <Pagination.Prev onClick={() => {
                props.onPageChange && props.onPageChange(current_page_count - 1);
            }}/> : undefined}

            {((current_page_count - 2) >= 1) ? <Pagination.Item onClick={() => {
                props.onPageChange && props.onPageChange(current_page_count - 2)
            }}>{current_page_count - 2}</Pagination.Item> : undefined}

            {((current_page_count - 1) >= 1) ? <Pagination.Item onClick={() => {
                props.onPageChange && props.onPageChange(current_page_count - 1);
            }}>{current_page_count - 1}</Pagination.Item> : undefined}

            <Pagination.Item active onClick={() => {
                props.onPageChange && props.onPageChange(current_page_count)
            }}>{current_page_count}</Pagination.Item>

            {((current_page_count + 1) >= 1 && total_count >= (current_page_count + 1)) ?
                <Pagination.Item onClick={() => {
                    props.onPageChange && props.onPageChange(current_page_count + 1)
                }}>{current_page_count + 1}</Pagination.Item> : undefined}

            {((current_page_count + 2) >= 2 && total_count >= (current_page_count + 2)) ?
                <Pagination.Item onClick={() => {
                    props.onPageChange && props.onPageChange(current_page_count + 2);
                }}>{current_page_count + 2}</Pagination.Item> : undefined}

            {current_page_count < total_count ? <Pagination.Next onClick={() => {
                props.onPageChange && props.onPageChange(current_page_count + 1)
            }}/> : undefined}

            {current_page_count < total_count ? <Pagination.Last onClick={() => {
                props.onPageChange && props.onPageChange(total_count);
            }}/> : undefined}
        </Pagination></div>
    </div>;

}

export default AppPagination;