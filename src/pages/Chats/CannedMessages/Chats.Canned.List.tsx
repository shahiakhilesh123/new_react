import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Button,Grid, IconButton} from "@material-ui/core";
import {Alert, Col, Modal, Row} from "react-bootstrap";
import HeadingCol from "../../../components/heading/HeadingCol";
import {iChatCanned, iChatCannedResponse} from "../../../types/internal";
import ChatsCannedCreate from "./Chats.Canned.Create";
import {Reducer} from "redux";
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
import FormattedDate from "../../../components/Utils/FormattedDate";
import CustomDataTable from "../../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../../components/Loader/AppLoader";
import {FaPlus} from "react-icons/fa";
import {customStyles} from "../../../components/common/common";
import {CancelTokenSource} from "axios";
import ChatAPIs from "../../../apis/chat.apis";
import useIsMounted from "ismounted";
import {NotificationContext} from "../../../App";
import { Delete, Edit } from "@material-ui/icons";
import {AppModalContext} from "../../../components/Modal/CustomModal";

function ChatsCanned() {
    
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iChatCannedResponse>, iListResponseActions<iChatCannedResponse>>>
    (listReducer<iListResource<iChatCannedResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 20},
        loading: true,
    });
    const isMounted = useIsMounted()

    const notificationContext = useContext(NotificationContext);
    let [showModal, setShowModal] = useState<boolean>(false);
    let [newName, setNewName] = useState<string>("");
    let [newMessage, setNewMessage] = useState<string>("");
    let [errorName, setErrorName] = useState<string>("");
    let [errorMessage, setErrorMessage] = useState<string>("");
    let [showEditModal, setShowEditModal] = useState<boolean>(false);
    let [editModalObject, setEditModalObject] = useState<iChatCanned>();

    const modalContext = useContext(AppModalContext);
    
    const loadResource = useCallback(
        (source?: CancelTokenSource) => {
            dispatchList(loading_action())
            new ChatAPIs().get_canned_list(query, source).then((response) => {
                if (isMounted.current) {
                    if (ChatAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message))
                    } else {
                        dispatchList(success_action(response))
                    }
                }
            });
        },
        [isMounted, query, notificationContext]
    );
    const columns = [
        {
            name: "Name",
            selector: "name",
        },
        {
            name: "Message",
            selector: "message",
        },

        {
            name: "Update at",
            selector: "updated_at",
            grow: 0.5,
            sortable: true,
            cell: (row: iChatCanned) => {
                return (
                    <>
                        {
                            row.updated_at && <FormattedDate date_string={row.updated_at}/>
                        }
                    </>
                );
            },
        },
        {
            name: "Actions",
            grow: 1,
            cell: (row: iChatCanned) => {
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
                                    modalContext.showActionModal &&
                                    modalContext.showActionModal({
                                            route: new ChatAPIs().getResourceDeletionURL(),
                                            values: [{
                                                value: row.id.toString(),
                                                label: ""
                                            }],
                                            title: "",
                                            body: "Do you really want to delete this canned message?"
                                        },
                                        (reload) => {
                                            if (reload) {
                                                loadResource();
                                            }
                                        })
                                }}>
                                    <Delete/>
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <IconButton color="secondary" component="span" onClick={() => {
                                    setEditModalObject(row);
                                    setShowEditModal(true)
                                }}>
                                    <Edit/>
                                </IconButton>
                            </Grid>
                            </Grid>
                    </div>
                );
            },
        },
    ];

    function onshowModal() {
        setShowModal(!showModal);
        setErrorMessage("")
        setErrorName("")
    }
    function onshowEditModal() {
        setShowEditModal(!showEditModal);
        setErrorMessage("")
        setErrorName("")
    }
    
    const onChangeName = (e:any) => {
        setEditModalObject((setEditModalObject:any) => ({
            ...setEditModalObject,
            name: e.target.value
        }))
    }
    const onChangeMessage = (e:any) => {
        setEditModalObject((setEditModalObject:any) => ({
            ...setEditModalObject,
            message: e.target.value
        }))
    }
    const onCreateName = (e:any) => {
        setErrorName("")
        setNewName(e.target.value)
    }
    const onCreateMessage = (e:any) => {
        setErrorMessage("")
        setNewMessage(e.target.value)
    }
    const cannedErrorHandler = (response:any) => {
        let keys = Object.keys(response.validation_errors)
        for (let i = 0; i < keys.length; i++) {
            if(keys[i] === 'name'){
                setErrorName(response.validation_errors[keys[i]][0])
            }else{
                setErrorMessage(response.validation_errors[keys[i]][0])
            }
        }
    }
    useEffect(() => {
        loadResource()
    }, [query,loadResource]);

    return <>
        <Row>
            <HeadingCol title={"Canned Messages"} description=""/>
            <Col md={12}>
                <CustomDataTable
                    columns={columns}
                    progressPending={loading}
                    progressComponent={<AppLoader/>}
                    noSearchFilter={false}
                    data={(resource && resource.cannedChatResponse && resource.cannedChatResponse.data) || []}
                    sortServer
                    onSort={(column, sortDirection) => {
                        if (typeof column.selector === "string")
                            dispatchList(onSortAction(column.selector, sortDirection))
                    }}
                    noHeader
                    actionButtons={[
                        <Button
                            variant="contained"
                            color="primary"
                            type="button"
                            className="positive-button"
                            onClick={() => {
                                setShowModal(true)
                            }}
                        >
                            <FaPlus/>
                            &nbsp;Add New
                        </Button>,
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
                            There are no Canned Messages.
                            <br/>
                            <Button
                            variant="text"
                            type="button"
                            className="btn-link btn"
                            onClick={() => {
                                setShowModal(true)
                            }}
                        >
                            &nbsp;Click Here
                        </Button>{" "}
                            to create one.
                        </Alert>
                        )
                    }

                    pagination
                    paginationTotalRows={resource && resource.cannedChatResponse && resource.cannedChatResponse.total}
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
        <div className="justify-content-md-center">
            <div className={"position-absolute modal-sub-div"}>
                <Modal show={showModal}
                       onHide={() => {
                           onshowModal();
                       }}>
                    {
                        //@ts-ignore
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Create Canned Chat
                            </Modal.Title>
                        </Modal.Header>
                        
                    }
                    <Modal.Body>
                        {<ChatsCannedCreate 
                        onChangeName={(e:any) => onCreateName(e)} 
                        onChangeMessage={(e:any) => onCreateMessage(e)} 
                        btnText="Save" 
                        messageValue={newMessage && newMessage} 
                        nameValue={newName && newName}
                        messageError={errorMessage && errorMessage} 
                        nameError={errorName && errorName}
                        onshowModal={onshowModal}
                        onSubmit={(e: any) => {
                            
                                new ChatAPIs().addCanned({name:newName,message:newMessage}).then(response => {
                                    if (isMounted.current) {
                                        if (ChatAPIs.hasError(response, notificationContext)) {
                                            setErrorMessage("")
                                            setErrorName("")
                                            cannedErrorHandler(response)
                                        } else {
                                            dispatchList(loading_action())
                                            setNewMessage("")
                                            setNewName("")
                                            setShowModal(!showModal)
                                            loadResource();
                                        }
                                    }
            
                                })
                            }}
                        />}
                    </Modal.Body>
                </Modal>
                <Modal show={showEditModal}
                       onHide={() => {
                           onshowEditModal();
                       }}>
                    {
                        //@ts-ignore
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Update Canned Chat
                            </Modal.Title>
                        </Modal.Header>
                        
                    }
                    <Modal.Body>
                        {<ChatsCannedCreate 
                        onChangeName={(e:any) => onChangeName(e)} 
                        onChangeMessage={(e:any) => onChangeMessage(e)} 
                        btnText="Update"  
                        messageValue={editModalObject && editModalObject.message}  
                        nameValue={editModalObject && editModalObject.name} 
                        messageError={errorMessage && errorMessage} 
                        nameError={errorName && errorName}
                        onshowModal={onshowEditModal}
                        onSubmit={(e: any) => {
                            new ChatAPIs().editCanned({name:editModalObject && editModalObject.name,message:editModalObject && editModalObject.message,id:editModalObject && editModalObject.id}).then(response => {
                                if (isMounted.current) {
                                    if (ChatAPIs.hasError(response, notificationContext)) {
                                        setErrorMessage("")
                                        setErrorName("")
                                        cannedErrorHandler(response)
                                    } else {
                                        dispatchList(loading_action())
                                        setNewMessage("")
                                        setNewName("")
                                        setShowEditModal(!showEditModal)
                                        loadResource();
                                    }
                                }
        
                            })
                        }}
                    />}
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    </>;
}

export default ChatsCanned;
