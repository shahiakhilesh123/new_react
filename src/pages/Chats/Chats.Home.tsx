import * as React from "react";
import {createContext, Dispatch, useCallback, useContext, useEffect, useReducer, useState} from "react";
import AppCardBody from "../../components/Card/AppCardBody";
import AppCard from "../../components/Card/AppCard";
import {Button, Grid, IconButton} from "@material-ui/core";
import {iChatMessage, iChatSession, iCustomerOrders} from "../../types/internal";
import ChatAPIs, {iAttachment, iDashboardChatSummaryResponse} from "../../apis/chat.apis";
import {FaFile, AiFillStar, FaStopCircle, BiArrowBack, FaSearch, FaChevronRight} from "react-icons/all";
import {Badge, Col, Form, Row, Spinner, Modal} from "react-bootstrap";
import useIsMounted from "ismounted";
import HeadingCol from "../../components/heading/HeadingCol";
import {
    AppDispatchContext,
    AppStateContext,
    ChatAppDispatchContext,
    ChatAppStateContext,
    NotificationContext
} from "../../App";
import {Reducer} from "redux";
import UserAPIs from "../../apis/user.apis";
import {
    iStoreAction, iResource,
    listReducer,
    iListResponseActions,
    iListResource,
    iResponseActions,
    responseReducer,
    loading_action,
    failed_action,
    success_action,
    loading_action_response,
    failed_action_response,
    success_action_response
} from "../../redux/reducers";
import {useLocation} from "react-router-dom";
import Axios, {CancelTokenSource} from "axios";
// @ts-ignore
import ReactCountryFlag from "react-country-flag"
import {Scrollbar} from "../../components/CustomScroll/ScrollBars";
import TimeFromNow from "../../components/Utils/FromNow";
import ChatBodyPanel from "../../components/chat/ChatBodyArea";
import useInterval from "use-interval";
import {Formik} from "formik";
import * as yup from "yup";
import SaveIcon from '@material-ui/icons/Save';
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {iChatAction} from "../../redux/reducers/chatReducer";
import {iListingQuery} from "../../types/api";
import HelpVideo from "../../components/HelpVideo/HelpVideo";
import {AiFillDollarCircle, AiOutlineFall, AiOutlineArrowLeft} from "react-icons/ai";
import {HiCursorClick} from "react-icons/all";
import {TiEye} from "react-icons/ti";
import getSymbolFromCurrency from "currency-symbol-map";
import {ShoppingCart} from "@material-ui/icons";
import {v4} from "uuid";
import InfiniteScroll from "react-infinite-scroll-component";
import SimplePagination from "../../components/AppPagination/SimplePagination";

//import ChatWindow from "../../components/chat/ChatWindow";

export interface ChatSessionLocationState {
    open_chat: number
}

export interface iShopifyShop {
    shop?: iShopifyShop
}

export const AppChatStateContext = createContext<{
    active_sessions: iChatSession[],
    open_session?: iChatSession,
    closeSession: (session: iChatSession) => void
    openSession: (session: iChatSession) => void
}>({
    active_sessions: [],
    closeSession: () => {
    },
    openSession: () => {
    },
});
export default function ChatsHome() {
    useEffect(() => {
        document.title = "Chats | Emailwish";
    }, []);
    const [chatState, setChatState] = useState<{
        active_sessions: iChatSession[],
        open_session?: iChatSession,
    }>({
        active_sessions: [],

    });
    const formatDate = (dateString: any) => {
        var options = {year: "numeric", month: "long", day: "numeric"} as const
        return new Date(dateString).toLocaleDateString(undefined, options)
    }
    const [engagedSessions, setEngagedSessions] = useState<iChatSession[]>([]);
    const isMounted = useIsMounted();
    const location = useLocation<ChatSessionLocationState>();
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    const notificationContext = useContext(NotificationContext);
    const {chat_enabled} = useContext(AppStateContext);
    const [attachments, setAttachments] = useState<iAttachment[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);
    const [products, setProducts] = useState([]);
    const [HasMoreProducts, setHasMoreProducts] = useState<boolean>(true)
    const [scrollHover, setScrollHover] = useState<boolean>(false)
    const [orders, setOrders] = useState<iCustomerOrders>();
    const [activeTab, setActiveTab] = useState<number>(1);
    const [sessionId, setSessionId] = useState<number>(0);
    const [showProducts, setShowProducts] = useState(false);
    const [engagedSessionQuery, setEngagedSessionQuery] = useState<iListingQuery>({
        sort_order: "created_at",
        sort_direction: "desc",
        per_page: 20
    });
    const [productsQuery, setProductsQuery] = useState<iListingQuery>({
        page: 0,
        q: ""
    });
    const [activeSessionQuery, setActiveSessionQuery] = useState<iListingQuery>({
        sort_order: "created_at",
        sort_direction: "desc",
        per_page: 20
    });
    let [ordersTotal, setOrdersTotal] = useState<string>("0");

    const [showEditModal, setShowEditModal] = useState<boolean>(false);
    const addSelectedProduct = (e: any, product: any) => {
        e.currentTarget.classList.toggle('active')
        if (e.currentTarget.classList.contains('active')) {
            let _product = {id: product.id, image: product.image_url, link: product.product_url, title: product.title}
            setSelectedProducts([...selectedProducts, _product])
            return
        }
        setSelectedProducts(selectedProducts.filter(item => item.id !== product.id));
    }
    const makeProductArr = (productsSelected: any) => {
        let array = []

        for (let i = 0; i < productsSelected.length; i++) {
            array.push({
                image: productsSelected[i].image,
                title: productsSelected[i].title,
                link: productsSelected[i].link
            })
        }
        return JSON.stringify(array)
    }
    const {v4: uuid4} = require('uuid');
    const sendProducts = () => {
        if (selectedProducts.length < 1) {
            return
        }
        let selected = makeProductArr(selectedProducts);
        let session: any = chatState.open_session
        new ChatAPIs().send_products(session, selected).then((response) => {
            if (isMounted.current) {
                if (!ChatAPIs.hasError(response, notificationContext)) {
                    if (response.chat_message) {
                        chatDispatch({
                            type: "message",
                            message: response.chat_message,
                            session: session
                        })
                        document.getElementsByClassName('chat-area')[0].scrollIntoView(
                            {
                                behavior: 'smooth',
                                block: 'end',
                                inline: 'nearest'
                            })

                    }
                }
            }
        })
    }
    const fetchProducts = useCallback(async () => {
        new ChatAPIs().get_products(productsQuery).then(response => {
            if (isMounted.current) {
                if (!ChatAPIs.hasError(response)) {

                    setProducts(products.concat(response.items))
                    let _productsQuery = productsQuery
                    _productsQuery.page = response.current_page + 1
                    setProductsQuery(_productsQuery)
                    if (response.last_page === response.current_page) {
                        setHasMoreProducts(false)
                    }
                }
            }
        })
    }, []);

    useEffect(() => {
        if (!showProducts) {
            let _productsQuery = productsQuery
            _productsQuery.page = 1
            setProductsQuery(_productsQuery)
            setProducts([])
            setHasMoreProducts(true)
        } else {
            fetchProducts()
        }
    }, []);

    useEffect(() => {
        if (!products.length) {
            fetchProducts()
        }
    }, []);

    const style = {
        height: 30,
        border: "1px solid green",
        margin: 6,
        padding: 8,
        width: "100%"
    };
    const [chatSummaryState, dispatchChatSummaryResponse] = useReducer<Reducer<iResource<iDashboardChatSummaryResponse>,
        iResponseActions<iDashboardChatSummaryResponse>>>
    (responseReducer<iResource<iDashboardChatSummaryResponse>, any>({}), {loading: true});

    const chatDispatch: Dispatch<iChatAction> = useContext(ChatAppDispatchContext);
    const {
        sessions,
        active_sessions,
        active_total,
        active_page,
        sessions_total,
        sessions_page
    } = useContext(ChatAppStateContext);
    useEffect(() => {
        fetchFirstSessions();

    }, []);
    //const orders = ordersState && ordersState.response && ordersState.response.orders[0];
    const fetchEngagedSessions = useCallback((source?: CancelTokenSource) => {
        new ChatAPIs().engaged_sessions(engagedSessionQuery, source).then(response => {
            if (isMounted.current) {
                if (response.sessions && response.sessions.data) {
                    chatDispatch({
                        type: "sessions",
                        sessions: response.sessions.data,
                        total: response.sessions.last_page,
                        page: response.sessions.current_page,
                        per_page: parseInt(response.sessions.per_page.toString())
                    })
                    let index = response.sessions.data.findIndex((value => {
                        return value.id === sessionId;
                    }))
                    if (index !== -1) {
                        if (response && response.sessions && response.sessions.data) {
                            openSession(response.sessions.data[index])
                        }
                    }
                }
            }
        })
    }, [engagedSessionQuery, sessionId])
    const loadChatResource = useCallback(
        (source?: CancelTokenSource, silently?: boolean) => {
            if (!silently) {
                dispatchChatSummaryResponse(loading_action_response());
            }
            new ChatAPIs().chat_summary(source).then((response) => {
                if (isMounted.current) {
                    if (ChatAPIs.hasError(response, notificationContext)) {
                        dispatchChatSummaryResponse(failed_action_response(response.message))
                    } else {
                        dispatchChatSummaryResponse(success_action_response(response))
                    }
                }
            });
        },
        [isMounted,]
    );

    function onshowEditModal() {
        setShowEditModal(!showEditModal);

    }

    const fetchActiveSessions = useCallback((source?: CancelTokenSource) => {
        new ChatAPIs().active_sessions(activeSessionQuery, source).then(response => {
            if (!ChatAPIs.hasError(response)) {
                if (response.sessions && response.sessions.data) {
                    chatDispatch({
                        type: "active_sessions",
                        sessions: response.sessions.data,
                        total: response.sessions.last_page, page: response.sessions.current_page,
                        per_page: parseInt(response.sessions.per_page.toString())
                    })
                    let index = response.sessions.data.findIndex((value => {
                        return value.id === sessionId;
                    }))
                    if (index !== -1) {
                        if (response && response.sessions && response.sessions.data) {
                            openSession(response.sessions.data[index])
                        }
                    }


                }
            }
        })
    }, [activeSessionQuery, sessionId])

    useInterval(() => {
        if (activeTab === 1) {
            fetchEngagedSessions();
        }
    }, 20000, true);
    useInterval(() => {
        if (activeTab === 0) {
            fetchActiveSessions();
        }
    }, 20000, true);
    useEffect(() => {
        let source_active = Axios.CancelToken.source();
        fetchActiveSessions(source_active);
        return () => {
            source_active.cancel()
        }
    }, [activeSessionQuery, activeTab]);
    useEffect(() => {
        let source_engaged = Axios.CancelToken.source();
        fetchEngagedSessions(source_engaged);
        return () => {
            source_engaged.cancel()
        }
    }, [engagedSessionQuery, activeTab]);
    useEffect(() => {
        let source = Axios.CancelToken.source();
        setSelectedProducts([])
        if (isMounted.current) {
            loadChatResource(source);
        }
        return () => {
            source.cancel();
        };
    }, []);
    const fetchFirstSessions = useCallback(() => {
        new ChatAPIs().engaged_sessions(engagedSessionQuery).then(response => {
            if (isMounted.current) {
                if (response.sessions) {
                    setEngagedSessions(response.sessions.data)
                    if (location.state && location.state.open_chat) {
                        let index = response.sessions.data.findIndex((value => {
                            return value.id === location.state.open_chat;
                        }))
                        if (index !== -1) {
                            if (response && response.sessions && response.sessions.data) {
                                openSession(response.sessions.data[index])
                                setChatState({
                                    active_sessions: [response.sessions.data[index]],
                                    open_session: response.sessions.data[index]
                                })
                            }
                        }
                    }
                }
            }
        })
    }, [location]);

    const openSession = useCallback((session: iChatSession) => {
        Array.from(document.querySelectorAll('.products .active')).forEach((el) => el.classList.remove('active'));
        setSessionId(session.id);
        let session_is_in_list = false;
        chatState.active_sessions.forEach(as => {
            if (as.id === session.id) {

                session.agent_unread_messages = 0;
                session_is_in_list = true;
            }
        });


        if (!session_is_in_list) {
            session.agent_unread_messages = 0;
            const newSessions = [session, ...chatState.active_sessions];
            setChatState({
                active_sessions: newSessions,
                open_session: session
            })
        } else {
            setChatState({
                ...chatState,
                open_session: session
            })
        }

    }, [chatState.active_sessions, orders]);

    useEffect(() => {
        let source = Axios.CancelToken.source();

        if (chatState && chatState.open_session) {
            fetchAttachmentsMessages(source);
            fetchOrders(source)
            setSelectedProducts([])
        }
        return () => {
            source.cancel();
        }
    }, [chatState.open_session])

    // useEffect(()=>{
    //     console.log("active_sessions length",active_sessions?.length)
    //     if(active_sessions && active_sessions.length>0){
    //         openSession(active_sessions[0])
    //         if(active_sessions.findIndex(value => {
    //             return openedSession && value.id===openedSession.id
    //         })===-1){
    //             openSession(active_sessions[0])
    //         }
    //     }
    //
    // },[active_sessions && active_sessions.length])
    const closeSession = useCallback((session: iChatSession) => {
        //console.log("close", session)

        let newSessions = [...chatState.active_sessions];
        //console.log("active_sessions", newSessions)
        newSessions = newSessions.filter(value => {
            return value.id !== session.id
        })
        //console.log("newSessions", newSessions)

        if (newSessions.length > 0) {
            setChatState({
                active_sessions: [...newSessions],
                open_session: newSessions[0]
            })
        } else {
            setChatState({
                active_sessions: newSessions,
                open_session: undefined
            })
        }
    }, [chatState])
    const fetchOrders = useCallback((source: CancelTokenSource) => {
        setOrdersTotal("0.00")
        if (chatState && chatState.open_session) {
            new ChatAPIs().get_customer_orders({
                'shopify_email': chatState.open_session.email,
                'shopify_customer_id': chatState.open_session.shopify_customer_id ?? ""
            }, source).then(response => {
                if (isMounted.current) {
                    if (!ChatAPIs.hasError(response)) {
                        var total: number = 0
                        for (let i = 0; i < response?.orders.length; i++) {
                            total += parseFloat(response?.orders[i]?.total_price)
                        }
                        setOrdersTotal(total.toFixed(2).toString())
                        setOrders(response)
                    }
                }
            })
        }
    }, [chatState.open_session])

    const fetchAttachmentsMessages = useCallback((source: CancelTokenSource) => {
        setAttachments([])
        if (chatState && chatState.open_session) {

            new ChatAPIs().get_attachments(chatState.open_session.id, source).then(response => {
                if (isMounted.current) {
                    if (!ChatAPIs.hasError(response)) {
                        setAttachments(response.attachments.data)
                    }
                }
            })
        }
    }, [chatState.open_session])

    const [showHelpVideo, setShowHelpVideo] = useState(false);
    const [showCart, setShowCart] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const [showActivity, setShowActivity] = useState(false);

    const {loggedInUser, shop} = useContext(AppStateContext);
    const chatSummary = chatSummaryState && chatSummaryState.response && chatSummaryState.response.chat_summary;
    const currency = getSymbolFromCurrency((shop && shop.primary_currency) || "USD") || "$";
    const cartContent = () => {
        setShowCart(true)
    }
    const openActivity = () => {
        setShowActivity(true)
    }
    const ordersContent = () => {
        setShowOrders(true)
    }
    const openProducts = () => {
        setShowProducts(true)
    }

    const productSearch = (e: any) => {

        if (e.target.value.length > 2) {
            let _productsQuery = productsQuery
            _productsQuery.q = e.target.value
            _productsQuery.page = 1
            setProductsQuery(_productsQuery)
            setProducts([])
            setHasMoreProducts(true)
        } else {
            if (e.target.value.length === 0) {
                let _productsQuery = productsQuery
                _productsQuery.q = e.target.value
                _productsQuery.page = 1
                setProductsQuery(_productsQuery)
                setProducts([])
                setHasMoreProducts(true)
            }
        }

    }
    const updateScroll = (e: any) => {
        if (e.currentTarget.getElementsByClassName('ScrollbarsCustom-Content')[0].clientHeight > e.currentTarget.clientHeight) {
            setScrollHover(true)
        }

    }
    return <Row>
        <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                   helpLink={"https://www.youtube.com/embed/aN-dBGbhsmM"}/>

        <HeadingCol
            title="Chats"
            description={<>

            </>
            }
            onHelpClick={() => {
                setShowHelpVideo(true)
            }}
            content_between_search_add={
                <Row className="w-100" style={{justifyContent: "center"}}>
                    {
                        [
                            {
                                name: "Revenue From Chats",
                                value: currency + " " + ((chatSummary && chatSummary.sales_total && chatSummary.sales_total.toFixed(2)) || "0"),
                                background: "#fafae2",
                                icon: <AiFillDollarCircle size={28}/>,
                                change_24: (chatSummary && chatSummary.sales_total_change_last_24 && chatSummary.sales_total_change_last_24.toFixed(0)) || "0"
                            },
                            {
                                name: "Total Chats",
                                value: (chatSummary && chatSummary.chats) || "0",
                                background: "#ebf5fc",
                                icon: <TiEye size={28}/>,
                                change_24: (chatSummary && chatSummary.chats_change_last_24 && chatSummary.chats_change_last_24.toFixed(0)) || "0"
                            },
                            {
                                name: "Missed Chats",
                                value: (chatSummary && chatSummary.missed) || "0",
                                background: "#f0fcf0",
                                icon: <HiCursorClick size={28}/>,
                                change_24: (chatSummary && chatSummary.missed_change_last_24 && chatSummary.missed_change_last_24.toFixed(0)) || "0"
                            },
                        ].map((value, i) => {
                            return <Col xl={4} lg={4} md={12} sm={12} key={i}
                                        className="dashboard-header-card-wrapper">
                                <div className="dashboard-header-card" style={{background: value.background}}>
                                    <div className="d-flex justify-content-between">
                                            <span className="dashboard-header-card-label">
                                                {value.name}
                                            </span>
                                        <span>
                                                    {value.icon}
                                            </span>
                                    </div>
                                    <div style={{fontWeight: "bold", fontSize: "24px", marginBottom: "4px"}}>
                                        {value.value}
                                    </div>
                                    <div className="d-flex align-items-center">
                                                  <span
                                                      style={parseInt(value.change_24) >= 0 ? {transform: "rotate(-75deg)"} : {transform: "rotate(-0deg)"}}>
                                                    <AiOutlineFall
                                                        color={parseInt(value.change_24) >= 0 ? "#57b758" : "red"}
                                                        size={20}/>
                                                </span>
                                        <span className="p-1"/>

                                        <span style={{
                                            color: parseInt(value.change_24) >= 0 ? "#57b758" : "red",
                                            fontWeight: "500",
                                            fontSize: "14px"
                                        }}>{value.change_24 || "0"}%</span>&nbsp;<span
                                        style={{fontWeight: "500", fontSize: "12px"}}>since yesterday</span>
                                    </div>
                                </div>
                            </Col>
                        })
                    }
                </Row>

            }
            enable_button_text_data_tut="reactour__chat_enable"
            enable_button_text="Enable Chat"
            checked={chat_enabled}
            onCheckChanged={(value => {
                dispatch({type: "chat_enabled", enabled: value})
                new UserAPIs().chat_module_status(value).then((response) => {
                    if (isMounted.current) {
                        if (UserAPIs.hasError(response, notificationContext)) {
                            dispatch({type: "chat_enabled", enabled: !value})
                        } else {
                            dispatch({type: "chat_enabled", enabled: response.chat_module_enabled})
                        }
                    }
                })
            })}
            chat_ads
        />
        <Col md={12}>

            <Grid container className="chat" spacing={1}>
                <Grid item sm={3} xs={12} className="chat-customer-list">
                    <AppCard className="chat-customer-list__wrapper">
                        <AppCardBody style={{padding: "18px"}}>
                            <div className="chat-customer-list__search row">
                                <Tabs
                                    className="col-6"
                                    value={activeTab}
                                    indicatorColor="primary"
                                    textColor="primary"
                                    onChange={(event, value) => {
                                        setActiveTab(value);
                                    }}
                                    centered

                                >
                                    <Tab label="Active"/>
                                    <Tab label="Engaged"/>
                                </Tabs>
                                <Form.Control type="text" style={{border: 0, boxShadow: 'var(--box-shadow-low)'}}
                                              placeholder="Type to search"
                                              className="search-box col-6"
                                              onChange={(e: any) => {
                                                  let _engagedSessionQuery = {...engagedSessionQuery};
                                                  let _activeSessionQuery = {...activeSessionQuery};
                                                  if (_engagedSessionQuery)
                                                      _engagedSessionQuery.keyword = e.target.value || ""
                                                  if (_activeSessionQuery)
                                                      _activeSessionQuery.keyword = e.target.value || ""
                                                  setActiveSessionQuery(_activeSessionQuery)
                                                  setEngagedSessionQuery(_engagedSessionQuery)
                                              }}
                                />
                            </div>
                            <Scrollbar style={{height: "calc(100vh - 250px)"}} no_margin>
                                {
                                    activeTab === 0 && <ul className="chat-customer-list__ul">
                                        {
                                            active_sessions && active_sessions.length === 0 &&
                                            <div className="d-flex justify-content-center">
                                                No Session is active
                                            </div>
                                        }
                                        {active_sessions && active_sessions.map((session) => {
                                            let region = (session.location && session.location.cityName)
                                            let country = (session.location && session.location.countryName)
                                            let country_code = (session.location && session.location.countryCode)
                                            let location = "";
                                            if (region) {
                                                location = region;
                                            }
                                            if (country) {
                                                if (region) {
                                                    location = region + ", " + country;
                                                } else {
                                                    location = country
                                                }
                                            }
                                            return <li key={session.id} className="chat-list-item"
                                                       onClick={() => openSession(session)}>
                                                <div className="chat-list-item__wrapper">
                                                    <div className="chat-list-wrapper_sub">
                                                        <div className="chat-list-wrapper_sub_line_1">
                                                            <div className="chat-list-wrapper_image">
                                                                {
                                                                    country_code &&
                                                                    <ReactCountryFlag
                                                                        className="emojiFlag"
                                                                        countryCode={country_code || "ssss"}
                                                                        style={{
                                                                            fontSize: '2em',
                                                                            lineHeight: '2em',
                                                                            width: "100%",
                                                                            height: "100%",
                                                                        }}
                                                                        svg
                                                                        aria-label={location}/>

                                                                }
                                                                {
                                                                    !country_code &&
                                                                    <img src="/assets/images/unknown-country.png"
                                                                         alt="unknown"/>
                                                                }
                                                            </div>
                                                            <div className="chat-list-wrapper_name_wrapper">
                                                                <div className="chat-list-wrapper_name">
                                                                    <span>#{session.id} {session.name}</span>
                                                                </div>
                                                                <div className="chat-list-wrapper_unread">
                                                            <span>
                                                                    {session.agent_unread_messages !== 0 && <Badge
                                                                        variant="primary">{session.agent_unread_messages}</Badge>
                                                                    }
                                                            </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="chat-list-wrapper_sub_line_2">
                                                            <div className="chat-list-item-message__wrapper">
                                                            <span>
                                                            {
                                                                session.last_message
                                                                && session.last_message
                                                                && session.last_message.attachment_mime_type && "File"
                                                            }
                                                                {
                                                                    session.last_message
                                                                    && session.last_message
                                                                    && !session.last_message.attachment_mime_type && session.last_message.message
                                                                }
                                                        </span>
                                                            </div>
                                                            <div className="chat-list-item-message__time">
                                                            <span className="chat-list-item-time">
                                                                {
                                                                    session.last_message
                                                                    && session.last_message.created_at && <TimeFromNow
                                                                        date_string={session.last_message.created_at}/>
                                                                }
                                                                {
                                                                    (!session.last_message
                                                                        || !session.last_message.created_at) &&
                                                                    <TimeFromNow date_string={session.updated_at}/>
                                                                }
                                                            </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        })}
                                        {
                                            active_sessions && active_sessions.length !== 0 && <li>
                                                <SimplePagination onPageChange={(page_number) => {
                                                    setActiveSessionQuery({
                                                        ...activeSessionQuery,
                                                        page: page_number
                                                    })
                                                }} current_page={active_page || 0} total_pages={active_total || 0}/>
                                            </li>
                                        }
                                    </ul>
                                }
                                {
                                    activeTab === 1 && <ul className="chat-customer-list__ul">
                                        {
                                            sessions && sessions.length === 0 &&
                                            <div className="d-flex justify-content-center">
                                                No engaged session found
                                            </div>
                                        }
                                        {sessions && sessions.map((session) => {
                                            let region = (session.location && session.location.cityName)
                                            let country = (session.location && session.location.countryName)
                                            let country_code = (session.location && session.location.countryCode)
                                            let location = "";
                                            if (region) {
                                                location = region;
                                            }
                                            if (country) {
                                                if (region) {
                                                    location = region + ", " + country;
                                                } else {
                                                    location = country
                                                }
                                            }
                                            return <li key={session.id} className="chat-list-item"
                                                       onClick={() => openSession(session)}>
                                                <div className="chat-list-item__wrapper">
                                                    <div className="chat-list-wrapper_sub">
                                                        <div className="chat-list-wrapper_sub_line_1">
                                                            <div className="chat-list-wrapper_image">
                                                                {
                                                                    country_code &&
                                                                    <ReactCountryFlag
                                                                        className="emojiFlag"
                                                                        countryCode={country_code || "ssss"}
                                                                        style={{
                                                                            fontSize: '2em',
                                                                            lineHeight: '2em',
                                                                            width: "100%",
                                                                            height: "100%",
                                                                        }}
                                                                        svg
                                                                        aria-label={location}/>

                                                                }
                                                                {
                                                                    !country_code &&
                                                                    <img src="/assets/images/unknown-country.png"
                                                                         alt="unknown"/>
                                                                }
                                                            </div>
                                                            <div className="chat-list-wrapper_name_wrapper">
                                                                <div className="chat-list-wrapper_name">
                                                                    <span>#{session.id} {session.name}</span>
                                                                </div>
                                                                <div className="chat-list-wrapper_unread">
                                                            <span>
                                                                    {session.agent_unread_messages !== 0 && <Badge
                                                                        variant="primary">{session.agent_unread_messages}</Badge>
                                                                    }
                                                            </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="chat-list-wrapper_sub_line_2">
                                                            <div className="chat-list-item-message__wrapper">
                                                            <span>
                                                            {
                                                                session.last_message
                                                                && session.last_message
                                                                && session.last_message.attachment_mime_type && "File"
                                                            }
                                                                {
                                                                    session.last_message
                                                                    && session.last_message
                                                                    && !session.last_message.attachment_mime_type && session.last_message.message
                                                                }
                                                        </span>
                                                            </div>
                                                            <div className="chat-list-item-message__time">
                                                            <span className="chat-list-item-time">
                                                                 {
                                                                     session.last_message
                                                                     && session.last_message.created_at && <TimeFromNow
                                                                         date_string={session.last_message.created_at}/>
                                                                 }
                                                                {
                                                                    (!session.last_message
                                                                        || !session.last_message.created_at) &&
                                                                    <TimeFromNow date_string={session.updated_at}/>
                                                                }
                                                            </span>
                                                            </div>

                                                        </div>
                                                        <div className="d-flex">

                                                            {
                                                                session.shop_name && <div className="pr-1">
                                                                    <Badge pill
                                                                           variant="secondary">{session.shop_name}</Badge>
                                                                </div>
                                                            }
                                                            {
                                                                session.ended_at && <div className="pr-1">
                                                                    <Badge pill variant="info">Session closed</Badge>
                                                                </div>
                                                            }
                                                        </div>

                                                    </div>
                                                </div>
                                            </li>
                                        })}
                                        {
                                            sessions && sessions.length !== 0 && <li>
                                                <SimplePagination onPageChange={(page_number) => {
                                                    setEngagedSessionQuery({
                                                        ...activeSessionQuery,
                                                        page: page_number
                                                    })
                                                }} current_page={sessions_page || 0} total_pages={sessions_total || 0}/>
                                            </li>
                                        }
                                    </ul>
                                }
                            </Scrollbar>
                        </AppCardBody>
                    </AppCard>
                </Grid>
                <Grid item md sm={9} xs={12} className="chat-body">
                    <AppCard className="chat-body-root">
                        <AppChatStateContext.Provider value={{
                            ...chatState,
                            closeSession: closeSession,
                            openSession: openSession
                        }}>
                            <ChatBodyPanel
                            />
                        </AppChatStateContext.Provider>

                    </AppCard>
                </Grid>

                <Grid item md={3} sm={12} xs={12} className="chat-detail">
                    <AppCard className={ showProducts ? "products-card details-card" : "details-card" }>
                    <Box display={"flex"} flexDirection={"column"} style={{marginLeft:"24px",marginRight: "24px"}}>
                    {
                    chatState.open_session && showCart && <Box flexGrow={1}>
                                <div className="h4 itemTop" onClick={(e) => setShowCart(false)}>
                                    <BiArrowBack/> <span>Cart</span>
                                </div>
                                <div className="mt-4 mb-5 h4 itemTop">
                                    <ShoppingCart/> <span>{(chatState.open_session.cart && chatState.open_session.cart.item_count) || 0} items</span>
                                    <span className="float-right">${(chatState.open_session.cart && chatState.open_session.cart.total_price && (chatState.open_session.cart.total_price / 100).toFixed(2)) || "0.00"}</span>
                                </div>
                            </Box>
                    }
                    {
                    chatState.open_session && showOrders && <Box flexGrow={1}>
                    <div className="h4 itemTop" onClick={(e) => setShowOrders(false)}>
                    <BiArrowBack/> <span>Orders</span>
                    </div>
                    <div className="mt-4 mb-5 h4 itemTop">
                        <ShoppingCart/> <span>{orders?.orders.length} orders</span>
                        <span className="float-right">${ordersTotal}</span>
                    </div>
                    </Box>
                    }
                    {
                    chatState.open_session && showActivity && <Box flexGrow={1}>
                    <div className="h4 itemTop mb-4" onClick={(e) => setShowActivity(false)}>
                                                    <BiArrowBack/> <span>User Activity</span>
                                                </div>
                    </Box>
                    }
                    {
                        chatState.open_session && showProducts && <Box flexGrow={1}>
                        <div className="h4 itemTop mb-4" onClick={(e) => setShowProducts(false)}>
                        <BiArrowBack/> <span>Products</span>
                    </div>
                    <div className="row">
                        <div className="col-12">
                        <div className="form-group has-search">
                            <span className="form-control-feedback"><FaSearch/></span>
                            <input type="text" className="form-control" placeholder="Search" onChange={(e) => productSearch(e)}/>
                        </div>
                        </div>
                    </div>
                    </Box>
                    }
                    </Box>
                        <Scrollbar style={showProducts ? {height: "calc(100% - 100px)"} : {}} className={scrollHover && "activeScroll"} onMouseEnter={(e:any)=>{updateScroll(e)}} onMouseLeave={()=>{setScrollHover(false)}} id="scrollableProducts">
                            <Box display={"flex"} flexDirection={"column"} height={"100%"}>
                                {
                                    chatState.open_session && chatState.active_sessions && chatState.active_sessions.length > 0 && !showCart && !showOrders && !showProducts && !showActivity &&
                                    <Box flexGrow={1}>

                                        <AppCardBody className={"mt-0 pt-0 pb-3 customer-detail-chat"}>

                                            <Grid className="customer-detail-chat_wrap" item container
                                                  direction="column" md>
                                                <Grid item container justifyContent="space-between" className={"pb-2"}>

                                                    {
                                                        chatState.open_session &&
                                                        <Grid item md={12} className="contact-area">


                                                            <div
                                                                className="customer-detail-chat__text overflow-ellipsis">
                                                                <img className="img-icon"
                                                                     src="/assets/images/img-icons/user.png" alt=""/>
                                                                {(chatState.open_session && chatState.open_session.name) || ""}
                                                            </div>
                                                            <div className="customer-detail-chat__text row">
                                                                <div className="col-9 overflow-ellipsis">
                                                                    <img className="img-icon"
                                                                         src="/assets/images/img-icons/email.png"
                                                                         alt=""/>
                                                                    {(chatState.open_session && chatState.open_session.email) || ""}
                                                                </div>
                                                                <div className="col-3">
                                                                    <img style={{cursor: "pointer"}} onClick={() => {
                                                                        setShowEditModal(true)
                                                                    }} className="img-icon float-right"
                                                                         src="/assets/images/img-icons/edit-icon.png"
                                                                         alt=""/>
                                                                </div>
                                                            </div>
                                                            <div className="customer-detail-chat__text row">
                                                                <div className="col-6 overflow-ellipsis">
                                                                    <img className="img-icon"
                                                                         style={{width: "13px!important"}}
                                                                         src="/assets/images/img-icons/place.png"
                                                                         alt=""/>
                                                                    {(chatState.open_session.location && chatState.open_session.location.cityName) || (chatState.open_session.location && chatState.open_session.location.countryName) || "Unknown"}
                                                                </div>
                                                                <div className="col-6 overflow-ellipsis">
                                                                    <img className="img-icon"
                                                                         src="/assets/images/img-icons/ip.png" alt=""/>
                                                                    {chatState.open_session.location && chatState.open_session.location.ip}
                                                                </div>
                                                            </div>
                                                            {
                                                                chatState.open_session && chatState.open_session.pages && chatState.open_session.pages.toString().split(",").length &&
                                                                <div
                                                                    className="customer-detail-chat__text user-activity mb-0"
                                                                    title={chatState.open_session.pages && chatState.open_session.pages.toString().split(",").pop()}>
                                                                    <img className="img-icon"
                                                                         src="/assets/images/img-icons/page.png"
                                                                         alt=""/>
                                                                    <span style={{cursor: "pointer"}} onClick={() => {
                                                                        window.open(chatState?.open_session?.pages?.toString().split(",").pop())
                                                                    }}>
                                                                    {chatState.open_session.pages && chatState.open_session.pages.toString().split(",").pop()}
                                                                    </span><br/>
                                                                    <p onClick={() => openActivity()}
                                                                       className="mt-2 mb-0 text-center">Show user's
                                                                        visit path</p>
                                                                </div>
                                                            }


                                                        </Grid>
                                                    }
                                                </Grid>
                                            </Grid>

                                        </AppCardBody>
                                        <div className="ml-3 mr-3 mb-4 chat-panel-items">
                                            <div className="chat-panel-item" onClick={() => cartContent()}>
                                                <img className="img-icon"
                                                     src="/assets/images/img-icons/shopping-cart.png" alt=""/>
                                                <p className="mb-0">
                                                    <h5 className="p-0 m-0">Cart Content</h5>
                                                </p>
                                                <p>{(chatState.open_session.cart && chatState.open_session.cart.item_count) || 0} items</p>
                                                <h3>${(chatState.open_session.cart && chatState.open_session.cart.total_price && (chatState.open_session.cart.total_price / 100).toFixed(2)) || "0.00"}
                                                    <FaChevronRight/>
                                                </h3>
                                            </div>
                                            <div className="chat-panel-item" onClick={() => ordersContent()}>
                                                <img className="img-icon" src="/assets/images/img-icons/invoice.png"
                                                     alt=""/>
                                                <p className="mb-0">
                                                    <h5 className="p-0 m-0">Orders</h5>
                                                </p>
                                                <p>{(orders && orders.orders && orders.orders.length) || "0"} orders</p>
                                                <h3>${ordersTotal || "0.00"}
                                                    <FaChevronRight/>
                                                </h3>
                                            </div>
                                            {
                                                chatState.open_session && !chatState.open_session.ended_at && <div className="cart-products text-center mt-3"
                                                 onClick={() => openProducts()}>
                                                <button className="btn btn-black btn-square"
                                                        onClick={() => openProducts()}>
                                                    <img src="/assets/images/img-icons/box.png" alt=""/>
                                                    Recommend Products
                                                </button>
                                            </div>
                                            }
                                        </div>
                                        <AppCardBody
                                            className={"mt-0 pt-0 border-top border-secondary pt-2 details-grid"}>
                                            {
                                                chatState.open_session && chatState.open_session.ended_at &&
                                                <div className="mb-2">
                                                    <div>
                                                        <h6>
                                                            Session Ended
                                                        </h6>
                                                    </div>
                                                    <div>
                                                        Rating: {chatState.open_session && chatState.open_session.feedback_rating && Array.from(Array(parseInt(chatState.open_session.feedback_rating)).keys()).map(() => {
                                                        return <AiFillStar/>
                                                    })}
                                                    </div>
                                                    <div>
                                                        Feedback: {chatState.open_session && chatState.open_session.feedback_message}
                                                    </div>

                                                </div>
                                            }
                                            <Grid item container justifyContent="space-between" className={"mt-3"}>

                                                <Grid item md={6}>
                                                    <h6 className="chat-list-item-message">Attachments</h6>
                                                </Grid>
                                                <Grid item md={6} className="text-right">
                                                    {/*<small className="see-more">See More</small>*/}
                                                </Grid>
                                                {
                                                    attachments && attachments.length > 0 &&
                                                    <ul className={"attachment-ul mt-3 mb-0"}>
                                                        {attachments && attachments.map((doc, index) => {
                                                            if (doc.attachment_mime_type.includes("image")) {
                                                                return <li key={index} className="attachment-li">
                                                                    <div className="p-2">
                                                                        <a href={doc.attachment_full_url}
                                                                           target="_blank"
                                                                           rel="noopener noreferrer">
                                                                            <img src={doc.attachment_full_url}
                                                                                 alt="attachement_img"/>
                                                                        </a>
                                                                    </div>

                                                                </li>
                                                            } else {
                                                                return <li key={index} className="attachment-li">
                                                                    <div className="p-2">
                                                                        <a href={doc.attachment_full_url}
                                                                           target="_blank"
                                                                           rel="noopener noreferrer"
                                                                           style={{width: "100px"}}>
                                                                            <FaFile style={{
                                                                                width: "100px",
                                                                                height: "auto"
                                                                            }}/>
                                                                        </a>
                                                                    </div>

                                                                </li>
                                                            }

                                                        })}
                                                    </ul>
                                                }
                                                {
                                                    attachments && attachments.length === 0 &&
                                                    <small className="see-more">No Attachments</small>
                                                }
                                            </Grid>
                                        </AppCardBody>

                                    </Box>
                                }
                                {
                                    chatState.open_session && showCart && <Box flexGrow={1}>
                                        <AppCardBody
                                             className={"mt-0 pt-0 pb-5 itemsWrap"}>
                                                <Grid>
                                                {chatState.open_session.cart && chatState.open_session.cart.items?.map((item:any) => {
                                                    return <div className="cartItem" onClick={() => {
                                                        window.open(item.url)
                                                    }}>
                                                        <div className="image">
                                                            <img src={item.featured_image.url}
                                                                 alt={item.featured_image.alt}/>
                                                        </div>
                                                        <div className="info">
                                                            <p className="title"
                                                               title={item.product_title}>{item.product_title}</p>
                                                            <p className="description"
                                                               title={item.product_description}>{item.product_description}</p>
                                                        </div>
                                                        <div className="price">
                                                            <p>${item.price / 100}</p>
                                                            <p className="text-muted">{item.quantity} x
                                                                ${item.price / 100}</p>
                                                        </div>
                                                    </div>
                                                })}
                                            </Grid>
                                        </AppCardBody>
                                    </Box>
                                }
                                {
                                    chatState.open_session && showOrders && <Box flexGrow={1}>
                                        <AppCardBody
                                             className={"mt-0 pt-0 pb-5 itemsWrap"}>
                                                <Grid>
                                                {orders?.orders?.map((item:any) => {
                                                    return <div className="orderItem" onClick={() => {
                                                        window.open(item.order_status_url)
                                                    }}>
                                                        <div className="orderStatus">
                                                            <div title={item.order_number}>#{item.order_number}</div>
                                                            <div><span
                                                                className={item.financial_status === "paid" ? "badge badge-success" : "badge badge-secondary"}>{item.financial_status}</span>
                                                            </div>
                                                        </div>
                                                        <div className="datePrice">
                                                            <div
                                                                className="text-muted">{formatDate(item.created_at)}</div>
                                                            <div>${item.total_price}</div>
                                                        </div>
                                                    </div>
                                                })}
                                            </Grid>
                                        </AppCardBody>
                                    </Box>
                                }
                                {
                                    chatState.open_session && showActivity && <Box flexGrow={1}>
                                        <AppCardBody
                                             className={"mt-0 pt-0 pb-5 itemsWrap"}>
                                                <Grid>
                                                    {chatState.open_session.pages?.toString().split(",").reverse().map((pageUrl:any) => {
                                                        return <div className="orderItem" onClick={() => {
                                                            window.open(pageUrl)
                                                            }}>
                                                                {pageUrl}
                                                        </div>
                                                    })}

                                                </Grid>
                                        </AppCardBody>
                                    </Box>
                                }
                            </Box>
                            {
                                chatState.open_session && showProducts && <Box flexGrow={1}>
                                    <Box>
                                        <AppCardBody
                                             className={"mt-0 pt-0 pb-5 itemsWrap products"}>
                                                <Grid>
                                                <div className="">
                                                    <InfiniteScroll className="row"
                                                                    dataLength={products.length}
                                                                    next={fetchProducts}
                                                                    hasMore={HasMoreProducts}
                                                                    loader={<h4>Loading...</h4>}
                                                                    scrollableTarget={document.querySelector('#scrollableProducts .ScrollbarsCustom-Scroller')}
                                                                    endMessage={
                                                                        <p style={{textAlign: 'center', width: '100%'}}>
                                                                            <b>No more items</b>
                                                                        </p>
                                                                    }
                                                    >
                                                        {products.map((itemData: any) => {
                                                            let item = itemData
                                                            return <div data-product_id={item.product_id}
                                                                        onClick={e => addSelectedProduct(e, item)}
                                                                        className="col-4" title={item.title}>
                                                                <img alt={item.title}
                                                                     src={(item.image_url && item.image_url) || "/assets/images/no_image.png"}/>
                                                                <p className="title">{item.title}</p>
                                                            </div>
                                                        })}
                                                    </InfiniteScroll>
                                                </div>
                                            </Grid>

                                        </AppCardBody>

                                    </Box>
                                </Box>
                            }
                        </Scrollbar>
                        {

                            chatState.open_session && showProducts &&
                            <Box display={"flex"} flexDirection={"column"} height={"100%"}>

                                <div className="products-actions">
                                    <button onClick={() => {
                                        sendProducts()
                                    }} className="btn btn-primary">Send Products
                                    </button>
                                </div>
                            </Box>
                        }
                    </AppCard>

                </Grid>

            </Grid>

        </Col>
        <Modal show={showEditModal}
               onHide={() => {
                   onshowEditModal();
               }}>
            {
                //@ts-ignore
                <Modal.Header closeButton>
                    <Modal.Title>
                        Update Contacter
                    </Modal.Title>
                </Modal.Header>

            }
            <Modal.Body>
                {chatState && chatState.open_session &&
                <Formik
                    key={chatState.open_session.id +
                    (chatState.open_session && chatState.open_session.email) || ""
                    + (chatState.open_session && chatState.open_session.name) || ""}
                    initialValues={{
                        email: (chatState.open_session && chatState.open_session.email) || "",
                        name: (chatState.open_session && chatState.open_session.name) || ""
                    }}
                    onSubmit={(values: any, helpers) => {
                        helpers.setSubmitting(true)
                        if (chatState.open_session) {
                            new ChatAPIs()
                                .update_session_detail(chatState.open_session.id, values)
                                .then((res) => {
                                    if (isMounted.current) {

                                        helpers.setSubmitting(false);
                                        if (ChatAPIs.hasError(res, notificationContext)) {
                                            if (res.validation_errors) {
                                                helpers.setErrors(res.validation_errors)
                                            }
                                        } else {
                                            let openSession = chatState.open_session
                                            if (openSession) {
                                                openSession.name = values.name
                                                openSession.email = values.email
                                                setChatState({
                                                    ...chatState,
                                                    open_session: openSession
                                                })
                                                setShowEditModal(false)
                                            }

                                        }
                                    }
                                }).finally(() => {
                                helpers.setSubmitting(false)
                            })
                        }
                    }}
                    validationSchema={yup.object({
                        email: yup.string(),
                        name: yup.string()
                    })}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          values,
                          isSubmitting,
                          touched,
                          setFieldValue,
                          errors,
                      }: any) => {

                        return (
                            <Form onSubmit={handleSubmit}>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Form.Group>
                                            <Form.Control
                                                name="name"
                                                value={values && values.name}
                                                onChange={handleChange}
                                                isInvalid={
                                                    touched &&
                                                    touched.name &&
                                                    errors &&
                                                    !!errors.name
                                                }
                                            />
                                            <Form.Control.Feedback
                                                type="invalid">
                                                {errors && errors.name}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <Form.Group
                                            className="flex-grow-1">
                                            <Form.Control
                                                name="email"
                                                value={values && values.email}
                                                onChange={handleChange}
                                                isInvalid={
                                                    touched &&
                                                    touched.email &&
                                                    errors &&
                                                    !!errors.email
                                                }
                                            />
                                            <Form.Control.Feedback
                                                type="invalid">
                                                {errors && errors.email}
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                    </Grid>
                                    <Grid item>

                                        <Button variant="contained" color="primary"
                                                className="positive-button"
                                                disabled={isSubmitting}
                                                type="submit"> {isSubmitting && <><Spinner animation="border"
                                                                                           size="sm"/>&nbsp;</>}Save</Button>
                                    </Grid>
                                    <Grid item className="d-flex">
                                        <Button variant="outlined" color="secondary" onClick={() => {
                                            setShowEditModal(false)
                                        }
                                        }>Cancel</Button>
                                    </Grid>
                                </Grid>


                            </Form>
                        );
                    }}
                </Formik>
                }
            </Modal.Body>
        </Modal>
    </Row>

}

export const AttachmentWidget = (props: { chatMessage: iChatMessage }) => {
    const {chatMessage} = props;
    if (!chatMessage.attachment_full_url) return null;
    if (chatMessage && chatMessage.attachment_mime_type && chatMessage.attachment_mime_type.startsWith("image")) {
        return <a href={chatMessage.attachment_full_url} target="_blank" rel="noopener noreferrer">
            <img alt="attachment" src={chatMessage.attachment_full_url} style={{width: 250, height: "auto"}}/>
            <br/>
            Size: {chatMessage.attachment_size}
        </a>
    }
    return <a href={chatMessage.attachment_full_url} target="_blank" rel="noopener noreferrer">
        Attachment Size: {chatMessage.attachment_size}
    </a>
}
