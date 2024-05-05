import * as React from "react";
import {Dispatch, useCallback, useContext, useEffect, useRef, useState, useReducer} from "react";
import {iChatSession} from "../../types/internal";
import {ChatAppDispatchContext, ChatAppStateContext, NotificationContext} from "../../App";
import ChatAPIs from "../../apis/chat.apis";
import {Scrollbar} from "../CustomScroll/ScrollBars";
import TimeFromNow from "../Utils/FromNow";
import {AttachmentWidget} from "../../pages/Chats/Chats.Home";
import {Form, Modal, Spinner} from "react-bootstrap";
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Typography from "@material-ui/core/Typography";
import useIsMounted from "ismounted";
import useInterval from "use-interval";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import {IconButton,Grid, Button} from "@material-ui/core";
import {Formik} from "formik";
import * as yup from "yup";
import {iChatAction} from "../../redux/reducers/chatReducer";
import {v4} from "uuid";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import {iChatCannedResponse} from "../../types/internal";
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
import {Reducer} from "redux";
import {CancelTokenSource} from "axios";
import {FaStopCircle,GrSend,FaPaperPlane} from "react-icons/all";
const {v4: uuid4} = require('uuid');

interface iChatWindowProps {
    session: iChatSession
}


export default function ChatWindow(props: iChatWindowProps) {

    const [fetching, setFetching] = useState<boolean>(false);
    const [fetchingCanned, setFetchingCanned] = useState<boolean>(false);
    //const [cannedMessages, setCannedMessages] = useState<any>();
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);
    const messageRef = useRef<any>();
    const chatDispatch: Dispatch<iChatAction> = useContext(ChatAppDispatchContext);
    const {sessions} = useContext(ChatAppStateContext);
    const fetchMessages = useCallback(() => {
        if (fetching) return;
        setFetching(true);
        new ChatAPIs().messages(props.session).then(response => {
            if (isMounted.current) {
                setFetching(false);
                if (response.messages && response.messages.length > 0) {
                    chatDispatch({type: "messages", messages: response.messages, session: props.session})
                }
            }

        })
    }, [isMounted, fetching,])
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iChatCannedResponse>, iListResponseActions<iChatCannedResponse>>>
    (listReducer<iListResource<iChatCannedResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 999},
        loading: true,
    });
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
        [isMounted, query]
    );
    // const fetchCannedMessages = useCallback(() => {
    //     new ChatAPIs().get_canned_list({sort_order: "created_at", sort_direction: "desc", per_page: 1000}).then(response => {
    //         if (isMounted.current) {
    //             if (ChatAPIs.hasError(response, notificationContext)) {
    //                 console.log('error')
    //             } else {
    //                 //setCannedMessages(response.cannedChatResponse?.data)
    //                 console.log('success')
    //                 console.log(response.cannedChatResponse?.data)
    //                 console.log(cannedMessages)
    //             }
    //         }
    //     })
    // }, [isMounted, fetching,])
    // if(!fetchingCanned){

    //     setFetchingCanned(true)
    //     fetchCannedMessages()

    // }
    const messageChange = (e:any) => {
        if(e.nativeEvent.data === "/"){
           document.querySelector('.chatCannedPopup')?.classList.remove('d-none')
           return
        }
        document.querySelector('.chatCannedPopup')?.classList.add('d-none')
    }
    const addCannedMessage = (e:any) => {
        console.log('yo')
        e.message = "hey"
        console.log(e)
        //var addCannedMessage = document.getElementById('addCannedMessage')
    }
    const [showEndModal, setShowEndModal] = useState<boolean>(false);
    const onHideEndModal = () => {
        setShowEndModal(false)
    }
    useInterval(() => {
        fetchMessages();
    }, 50000, true);
    useEffect(() => {
        loadResource()
        var data = resource && resource.cannedChatResponse && resource.cannedChatResponse.data
    }, [query]);
    useEffect(() => {


        if (messageRef && messageRef.current) {
            messageRef.current.scrollIntoView(
                {
                    behavior: 'smooth',
                    block: 'end',
                    inline: 'start'
                })
        }


    }, [sessions && sessions.find(value => value.id.toString() === props.session.id.toString()) &&
    sessions.find(value => value.id.toString() === props.session.id.toString())?.messages && query])


    const inputFile = useRef(null);
    return <div><Formik
        initialValues={{
            message: "",
            file: ""
        }}
        onSubmit={(values: any, helpers) => {
            let _values = {...values}
            let id = Math.round(Math.random()*1000000000000000000);
            let message_text = values.message.trim();
            if (!message_text && !_values["file"]) return;
            helpers.resetForm()
            chatDispatch({
                type: "message",
                message: {
                    id: id,
                    uid: v4(),
                    message: message_text,
                    from_guest: "0",
                    session_id: props.session.id
                },
                session: props.session
            })

            new ChatAPIs().send_message(props.session, message_text, _values["file"] && _values["file"]["file"], (e: any) => {
                try {
                    const percentage = Math.round(e.loaded / e.total * 100);
                    helpers.setFieldValue(`file.uploading`, percentage.toString());
                } catch (e) {

                }
            }).then((response) => {
                if (isMounted.current) {
                    helpers.resetForm();
                    if (!ChatAPIs.hasError(response, notificationContext)) {
                        if (response.chat_message) {
                            chatDispatch({
                                type: "replace_message",
                                message: response.chat_message,
                                replace_with_id: id,
                                session: props.session
                            })
                            if (messageRef && messageRef.current) {
                                messageRef.current.scrollIntoView(
                                    {
                                        behavior: 'smooth',
                                        block: 'end',
                                        inline: 'nearest'
                                    })
                            }
                        }
                    }
                }
            })
        }}
        validationSchema={yup.object({
            message: yup
                .string(),
            file: yup.object({
                id: yup.string(),
                uploading: yup.string(),
                is_uploading: yup.boolean(),
                has_uploading_error: yup.boolean(),
                error: yup.string(),
                file: yup.object({}).nullable()
            })
        })}
    >
        {({
              handleSubmit,
              handleChange,
              values,
              isSubmitting,
              touched,
              errors,
              setFieldValue
          }: any) => {
            let session = sessions && sessions.find(value => value.id.toString() === props.session.id.toString());
            return <form onSubmit={handleSubmit}>
                <div className="chat-area-wrapper position-relative">
                    <div className="chatCannedPopup d-none">
                        <Scrollbar className="chat-area-scrollbar">
                            {

                                resource && resource.cannedChatResponse && resource.cannedChatResponse.data
                            .map((value, i) => {
                                return <div className="cannedMessage" onClick={
                                    (e) => {
                                    setFieldValue('message', value.message)
                                    document.querySelector('.chatCannedPopup')?.classList.add('d-none')
                                }
                                }>
                                    {value.message}
                                </div>
                            })
                        }
                        </Scrollbar>
                    </div>
                    <div className="chat-area-scroll-wrapper">

                        <Scrollbar style={{height: "calc(100vh - 455px)"}} className="chat-area-scrollbar">
                            <ul className="chat-area" ref={messageRef}>
                                {session && session.messages && session.messages.map((message) => {
                                    let message_from = message.from_guest == "0" ? "me" : "you"
                                    return <li key={message.id.toString()}
                                               className={message.message_type !== "products" ? message_from : ""}>
                                        <div className={message.message_type !== "products" ? "message" : ""}>
                                            {message.message_type === "end_chat" &&
                                            <div className=""><strong>Asked to end Chat!</strong><br/></div>}
                                            {message.message_type !== "products" && message.message}
                                            {message.message_type === "products" &&
                                                <div className="row">
                                                    {message && message.products && message.products.map((product:any) => {
                                                        return <div className="col-xl-4 col-lg-6 p-3">
                                                        <div>
                                                        <div className="product-recommends pt-3 pl-3 pr-3" title={product.title}>
                                                        <img src={product.image} alt={product.title}/>
                                                        <div><p>{product.title}</p></div>
                                                        </div>
                                                        <a target="_blank" rel="noreferrer" href={product.link}>
                                                        <div className="product-view p-3">View Product</div>
                                                        </a>
                                                        </div>
                                                        </div>
                                                    })}
                                                </div>
                                            }
                                            <AttachmentWidget chatMessage={message}/>
                                        </div>
                                        {/*<img src={demo_image} alt="" className="profile-pic"/>*/}
                                        <div className="sender-info">
                                            {
                                                !message.created_at && <AccessTimeIcon style={{width: "14px"}}/>
                                            }
                                            {
                                                message.created_at && <span style={{fontSize: "12px"}}><TimeFromNow
                                                    date_string={message.created_at}/></span>
                                            }
                                        </div>
                                    </li>;
                                })}
                            </ul>
                        </Scrollbar>
                    </div>
                    <div className="chat-area__input_area">

                        {
                            !!values.file && <div className="chat-area__input_file_upload">
                                <div className="chat-area__input_file_upload_sub">
                                    <div className="flex-grow-1">
                                        <div>
                                            <Typography className="text-truncate">
                                                {
                                                    !!values.file && values.file.file && values.file.file.name
                                                }
                                            </Typography>
                                        </div>
                                        <div>
                                            {
                                                !!values.file && values.file.uploading && parseInt(values.file.uploading) > 0 &&
                                                <div>
                                                    <LinearProgress variant="determinate"
                                                                    value={parseInt(values.file.uploading)}/>
                                                </div>
                                            }
                                        </div>
                                    </div>

                                    <div>
                                        <Button color="primary"
                                                type="submit"
                                                disabled={values.file && values.file.uploading && parseInt(values.file.uploading) > 0}
                                                variant="contained"
                                                onClick={() => {
                                                    setFieldValue('file', "");
                                                }}
                                        >
                                            <CloseIcon/>
                                        </Button>
                                    </div>

                                </div>

                            </div>
                        }
                        {props.session && !props.session.ended_at && resource &&
                        <div>
                            <div className="flex-grow-1">


                                <Form.Control type="text"
                                            id="messageInput"
                                              style={{border: 0, boxShadow: 'var(--box-shadow-low)'}}
                                              placeholder="Type something..."
                                              name="message"
                                              value={values.message}
                                              onChange={(e) => {messageChange(e)
                                                handleChange(e)
                                            }}
                                              className="app_input_box"

                                />
                            </div>
                        <div className="d-flex chat-area__input_area__form">
                            <div>
                                <input type='file' name="file"
                                       hidden
                                       onClick={(e: any) => {
                                           e.target.value = null
                                       }}
                                       onChange={(e: any) => {
                                           if (e.target && e.target.files && e.target.files.length) {
                                               setFieldValue("file", {
                                                   id: uuid4(),
                                                   uploading: "0",
                                                   is_uploading: false,
                                                   has_uploading_error: false,
                                                   file: e.target.files[0]
                                               })
                                           }
                                       }}
                                       accept={".png,.jpg,.jpeg"}
                                       ref={inputFile}/>


                                <IconButton color="inherit" disabled={false} onClick={() => {
                                        setShowEndModal(true)
                                    }}>
                                        <FaStopCircle/>
                                    </IconButton>
                                <IconButton color="inherit" disabled={false} onClick={() => {
                                    // `current` points to the mounted file input element
                                    // @ts-ignore
                                    inputFile.current.click();
                                }}>
                                    <AttachFileIcon/>
                                </IconButton>
                            </div>


                            <div style={{ marginLeft: 'auto'}}>
                                <button type="submit" disabled={(!values.message && !values.file) || isSubmitting} className="btn-square btn btn-black">
                                    <img src="/assets/images/img-icons/paper-plane.png" alt=""/>Send
                                </button>
                            </div>
                        </div>
                        </div>
                        }
                    </div>
                </div>


            </form>;
        }}

    </Formik>
    <Modal show={showEndModal}
    onHide={() => {
        onHideEndModal();
    }}>
 {
     //@ts-ignore
     <Modal.Header closeButton>
         <Modal.Title>
             End Conversation
         </Modal.Title>
     </Modal.Header>

 }
 <Modal.Body>
     {
 (props.session) &&
     <Formik
         initialValues={{
             message: "Do you really want to end conversation now?",
         }}
         onSubmit={(values: any, helpers: any) => {
             if (props.session) {
                 new ChatAPIs().send_message_end_conversation(values.message, props.session).then(response => {
                     if (isMounted.current) {
                        let message:any = response.chat_message ?? ""
                        chatDispatch({
                            type: "message",
                            message: message,
                            session: props.session
                        })
                         document.getElementsByClassName('chat-area')[0].scrollIntoView(
                             {
                                 behavior: 'smooth',
                                 block: 'end',
                                 inline: 'nearest'
                             })
                         setShowEndModal(false)
                         helpers.setSubmitting(false);
                     }
                 })
             }
         }}
         validationSchema={yup.object({
             message: yup
                 .string()
                 .required("Please enter message"),
         })}
     >
         {({
                 handleSubmit,
                 handleChange,
                 values,
                 touched,
                 setFieldValue,
                 isSubmitting,

                 errors,
             }: any) => {
             return (
                 <Form onSubmit={handleSubmit}>
                     <div className="mb-2">
                         <h6>
                             End Conversation Action
                         </h6>
                         <Form.Group>
                             <Form.Control
                                 name="message"
                                 value={values && values.message}
                                 onChange={handleChange}
                                 isInvalid={
                                     touched &&
                                     touched.message &&
                                     errors &&
                                     !!errors.message
                                 }
                             />
                             <Form.Control.Feedback
                                 type="invalid">
                                 {errors && errors.message}
                             </Form.Control.Feedback>
                         </Form.Group>
                     </div>
                     <Grid container spacing={1}>
                         <Grid item>
                             <Button
                                 variant="contained"
                                 type="submit"
                                 disabled={isSubmitting}
                                 color="primary"
                                 className="positive-button"
                             >
                                 {isSubmitting && <><Spinner
                                     animation="border"
                                     size="sm"/>&nbsp;</>}Ask to
                                 End</Button>
                                 </Grid>
                                                <Grid item className="d-flex">
                                <Button variant="outlined" color="secondary" onClick={() => {
                                    setShowEndModal(false)
                                }
                                }>Cancel</Button>
                            </Grid>
                        </Grid>
                 </Form>
             )
         }}
     </Formik>
}
 </Modal.Body>
</Modal>
</div>

}
