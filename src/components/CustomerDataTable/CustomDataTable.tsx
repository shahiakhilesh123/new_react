import React from "react";
import DataTable, {IDataTableProps} from "react-data-table-component";
import Checkbox from "@material-ui/core/Checkbox";
import SortIcon from "@material-ui/icons/ArrowDownward";
import {Col, Form, Row} from "react-bootstrap";
import AppCard from "../Card/AppCard";
import {customStyles} from "../common/common";
import {Grid} from "@material-ui/core";
import CustomMenu from "../CustomMenu/CustomMenu";

interface Props extends IDataTableProps {
    onKeywordChange: (keyword: any) => void,
    actionButtons: Array<React.ReactNode>,
    multiActionButton?: Array<React.ReactNode>,
    moreActionButton?: Array<{ child: React.ReactNode, onClick: any }>,
    noSearchFilter?: boolean
    onHelpLinkClick?: () => void,
    content_between_search_add?: any
}


export default function CustomDataTable(props: Props) {
    const selectableRowsComponentProps = {indeterminate: false};

    return <>
        <Row>
            {
                !props.noSearchFilter  && <Col md className="d-flex justify-content-start mb-2">
                    <div style={{width: 220, marginLeft: "1.6rem"}}>
                        <Form.Control type="text" style={{border: 0, boxShadow: 'var(--box-shadow-low)'}}
                                      placeholder="Type to search"
                                      className="search-box data-table-search"
                                      onChange={(e: any) => props.onKeywordChange(e.target.value)}
                        />
                    </div>
                </Col>
            }


            {
                (props.moreActionButton || props.onHelpLinkClick ||    props.actionButtons) && <Col md="auto" className="d-flex justify-content-end mb-2">
                    <Grid container spacing={1} justifyContent={"flex-end"} alignItems={"center"}>

                        {
                            props.moreActionButton && props.moreActionButton.length > 0 && <Grid item>
                                <Grid item container>
                                    <CustomMenu
                                        options={props.moreActionButton}
                                    />
                                </Grid>

                            </Grid>
                        }
                        {
                            props.multiActionButton && props.multiActionButton.map((button, index) => {

                                return <Grid key={index} item>
                                    {button}
                                </Grid>
                            })
                        }
                        {
                            props.onHelpLinkClick && <Grid item>
                                <a onClick={props.onHelpLinkClick} className="app-link">
                                    Learn How?
                                </a>
                            </Grid>
                        }
                        {
                            props.actionButtons && props.actionButtons.map((button, index) => {

                                return <Grid key={index} item>
                                    {button}
                                </Grid>
                            })
                        }
                    </Grid>


                </Col>
            }
        </Row>
        <AppCard>
            <DataTable
                key={props.data && props.data.map(value => value.id).join(",")||""}
                highlightOnHover
                responsive
                pointerOnHover
                sortIcon={<SortIcon/>}
                selectableRowsComponent={Checkbox}
                selectableRowsComponentProps={selectableRowsComponentProps}
                paginationRowsPerPageOptions={[10, 20, 50, 100, 500]}
                customStyles={customStyles}
                {
                    ...props
                }
            />

        </AppCard>

    </>
}
