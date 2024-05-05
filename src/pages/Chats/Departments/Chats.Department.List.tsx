import * as React from "react";
import {useEffect, useState} from "react";
import {Button, Grid, IconButton, ListItemIcon, ListItemText, Typography,} from "@material-ui/core";
import HeadingCol from "../../../components/heading/HeadingCol";
import {Alert, Col, Dropdown, Modal, Row} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {getEmptyApiListingQuery} from "../../../types/api";
import {MoreHoriz} from "@material-ui/icons";
import DeleteIcon from "@material-ui/icons/Delete";
import ChatsDepartmentCreate from "./Chats.Department.Create";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../../components/Loader/AppLoader";
import {FaPlus} from "react-icons/fa";
import {Link} from "react-router-dom";
import {customStyles} from "../../../components/common/common";

function ChatsDepartmentList() {
    const [query, setQuery] = useState(getEmptyApiListingQuery());
    const [error, setError] = useState<string | undefined>();
    const [loading, setLoading] = useState<boolean>(false);

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
    const columns = [
        {
            selector: "department",
            name: "Department",
            sortable: true,
            cell: (row: any) => (
                <Typography color="secondary"> {row.department} </Typography>
            ),
        },
        {
            selector: "description",
            name: "Description",
            sortable: true,
            cell: (row: any) => (
                <Typography color="secondary"> {row.description}</Typography>
            ),
        }, //change id
        {
            name: "Action",
            cell: (row: any) => {
                return (
                    <Grid container direction="row" alignItems="center" spacing={2}>
                        <Button color="primary" variant="outlined" className="mr-1">
                            Edit
                        </Button>
                        <Dropdown>
                            <Dropdown.Toggle
                                as={CustomToggle}
                                id="dropdown-custom-components"
                            >
                                <IconButton>
                                    <MoreHoriz/>
                                </IconButton>
                            </Dropdown.Toggle>
                            <Dropdown.Menu draggable={true} className="position-fixed">
                                <Dropdown.Item eventKey="1">
                                    <div style={{display: "inline-flex", width: "100%"}}>
                                        <ListItemIcon
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <DeleteIcon color="secondary" onClick={() => {
                                            }} name="Delete " cursor={"pointer"}/>
                                        </ListItemIcon>
                                        <ListItemText primary="Delete"/>
                                    </div>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Grid>
                );
            },
        },
    ];
    const data = [
        {department: "Sales Department", description: "Description 1"},
        {department: "General Department", description: "Description 2"},
    ];

    let [showModal, setShowModal] = useState<boolean>(false);

    function getDepartments() {
        //setDepartmentListResponse(data);
    }

    function upDateFilter() {
        //setQuery(query);
    }

    function onshowModal() {
        setShowModal(!showModal);
    }

    useEffect(() => {
        //setQuery(getEmptyApiListingQuery);
        getDepartments();
    }, []);

    return (
        <>
            <Row>
                <HeadingCol
                    title="Departments"
                    description={"Some more Description"}
                />
                <Col md={12}>
                    <CustomDataTable
                        columns={columns}
                        progressPending={loading}
                        progressComponent={<AppLoader/>}
                        data={data || []}
                        sortServer
                        onSort={(column, sortDirection) => {
                            let _query = {...query};
                            // @ts-ignore
                            _query.filters["sort-order"] = column.selector;
                            _query.sort_direction = sortDirection;

                            setQuery(_query);
                        }}
                        noHeader
                        actionButtons={[
                            <Link to="/chats/department/create">
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="button"
                                    className="positive-button"
                                >
                                    <FaPlus/>
                                    &nbsp;Add New
                                </Button>
                            </Link>
                        ]}
                        onKeywordChange={(a) => {
                            let _query = {...query};
                            setQuery(_query);
                        }}
                        noDataComponent={
                            error ? (
                                <Alert variant="dark" className="w-100 mb-0">
                                    {error}
                                </Alert>
                            ) : (
                                <Alert variant="dark">
                                    There are no departments.
                                    <br/>
                                    <LinkContainer to="/chat/departments/create">
                                        <Alert.Link>Click here</Alert.Link>
                                    </LinkContainer>{" "}
                                    to create one.
                                </Alert>
                            )
                        }

                        pagination
                        paginationPerPage={query.per_page}
                        onChangeRowsPerPage={(per_page) => {
                            let _query = {...query};
                            _query.per_page = per_page;
                            setQuery(_query);
                        }}
                        paginationServer
                        onChangePage={(page) => {
                            let _query = {...query};
                            _query.page = page;
                            setQuery(_query);
                        }}
                        customStyles={customStyles}
                    />
                    {/* <Filter2
                add_new_link="/chats/department/create"
                defaultFilters={query}
                updateFilter={upDateFilter}
                table_headers={headers}
                addButton={onshowModal}
            >
                {renderTable(headers.length)}
            </Filter2> */}
                </Col>
            </Row>
            <div className="justify-content-md-center">
                <div className={"position-absolute modal-sub-div"}>
                    <Modal
                        show={showModal}
                        onHide={() => {
                            onshowModal();
                        }}
                    >
                        {
                            //@ts-ignore
                            <Modal.Header closeButton>
                                <Modal.Title>Create Chat Department</Modal.Title>
                            </Modal.Header>
                        }
                        <Modal.Body>
                            {<ChatsDepartmentCreate onshowModal={onshowModal}/>}
                        </Modal.Body>
                    </Modal>
                </div>
            </div>
        </>
    );

    // return <TableContainer >
    //     <Table style={{ width: '100%' }}>
    //         <TableHead>
    //             <TableRow>
    //                 <TableCell>
    //                     <Typography variant="h6" color="secondary">
    //                         Department
    //                     </Typography>
    //                 </TableCell>
    //                 <TableCell>
    //                     <Typography variant="h6" color="secondary">
    //                         Description
    //                     </Typography>
    //                 </TableCell>
    //                 <TableCell>
    //                     <Typography variant="h6" color="secondary" align="center" >
    //                         Action
    //                     </Typography>
    //                 </TableCell>
    //             </TableRow>
    //             <TableRow>
    //                 <TableCell>
    //                     <Typography color="secondary">
    //                         Sales Department
    //                     </Typography>
    //                 </TableCell>
    //                 <TableCell>
    //                     <Typography color="secondary">
    //
    //                     </Typography>
    //                 </TableCell>
    //                 <TableCell align="center">
    //
    //                     <Button color="primary" variant="outlined" className="mr-1" >
    //                         Edit
    //                         </Button>
    //                     <Button color="primary" variant="outlined" className="mr-1" >
    //                         View
    //                         </Button>
    //                     <Button color="primary" variant="outlined" className="mr-1" >
    //                         Delete
    //                         </Button>
    //
    //                 </TableCell>
    //             </TableRow>
    //         </TableHead>
    //         <TableBody>
    //             <TableRow>
    //                 <TableCell>
    //                     <Typography color="secondary">
    //                         General Department
    //             </Typography>
    //                 </TableCell>
    //                 <TableCell>
    //                     <Typography color="secondary">
    //
    //                     </Typography>
    //                 </TableCell>
    //                 <TableCell align="center">
    //
    //                     <Button color="primary" variant="outlined" className="mr-1" >
    //                         Edit
    //                 </Button>
    //                     <Button color="primary" variant="outlined" className="mr-1" >
    //                         View
    //                 </Button>
    //                     <Button color="primary" variant="outlined" className="mr-1" >
    //                         Delete
    //                 </Button>
    //
    //                 </TableCell>
    //             </TableRow>
    //         </TableBody>
    //     </Table>
    // </TableContainer>
}

export default ChatsDepartmentList;
