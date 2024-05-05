import * as React from "react";
import {Dispatch, useCallback, useContext, useEffect, useReducer, useState} from "react";
import {
    automation_icon,
    email_icon,
    getMenuNameFromPath,
    getSubMenuFromMainMenu,
    list_icon
} from "../components/common";
import {Alert, Col, Form, Nav, Navbar, NavDropdown, Row} from "react-bootstrap";
import MenuLinkButton from "../components/Button/MenuLinkButton";
import {IconButton, List, ListItem, Popover} from "@material-ui/core";
import {Link, useHistory, useLocation} from "react-router-dom";
import {iSideBarNavigation} from "../types/props";
import {Duo, HelpSharp, Notifications} from "@material-ui/icons";
import UserAPIs from "../apis/user.apis";
import useIsMounted from 'ismounted';
import {
    failed_action_response,
    iResource,
    iResponseActions,
    iStoreAction,
    loading_action_response,
    responseReducer,
    success_action_response
} from "../redux/reducers";
import {AppDispatchContext, AppStateContext, ChatAppStateContext} from "../App";
import NotificationAPIs, {iNotification} from "../apis/notification.apis";
import AppLoader from "../components/Loader/AppLoader";
import classNames from "classnames";
import CommonApis, {SearchResponse} from "../apis/common.apis";
import {Reducer} from "redux";
import RenderError from "../components/Error/Error";
import Axios, {CancelTokenSource} from "axios";
import {iEmailAutomation} from "../types/internal";
import {iEmailCampaign} from "../types/internal/email/campaign";
import {iEmailMailingList} from "../types/internal/email/mailinglist";
import {iEmailSegment} from "../apis/Email/email.segmentation";

import EmailAutomationAPIs from "../apis/Email/email.automations.apis";
import {Scrollbar} from "../components/CustomScroll/ScrollBars";
import FormattedDate from "../components/Utils/FormattedDate";
import TimeFromNow from "../components/Utils/FromNow";
import {_HomeConfig} from "../components/Tour/Pages/Home.Tour";
import {useTour} from "@reactour/tour";
import New from '../assets/icons/megaphone.png';
import ChatLogo from '../assets/icons/feedback.png';

export function ProfileOptions() {

    const {loggedInUser} = useContext(AppStateContext);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMounted = useIsMounted();
    const history = useHistory()

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

        setAnchorEl(null);
    };

    function logout() {
        new UserAPIs().logout().then(() => {
            if (isMounted.current) {

                dispatch({type: "logout"});
                history.replace("/login");
            }
        });
    }

    function myAccount() {
        history.replace("/account");
        setAnchorEl(null);
    }

    return <>
        <IconButton
            aria-label="more"
            aria-controls="long-menu"
            aria-haspopup="true"
            onClick={handleClick}
        >
            <img
                src={(loggedInUser && loggedInUser.customers && loggedInUser.customers.length > 0) ?
                    new UserAPIs().getCustomerAvatarURL(loggedInUser.customers[0].uid, loggedInUser.customers[0].updated_at) : ""}
                alt="Avatar" className="profile-photo-header"/>
        </IconButton>
        <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}

            onClose={handleClose}
        >
            <div className="app-popover_wrapper">
                <List component="nav" className="app-popover">

                    <ListItem button className="app-popover_item" onClick={myAccount}>
                        My Account
                    </ListItem>
                    <ListItem button className="app-popover_item" onClick={logout}>
                        Logout
                    </ListItem>
                </List>
            </div>
        </Popover>
    </>
}

export function NotificationPopupOver() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMounted = useIsMounted();

    const history = useHistory();
    const {server_notifications} = useContext(AppStateContext);
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {

        dispatch({type: "current_page_notification", page_number: 1})
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

        setAnchorEl(null);
    };

    function NotificationItems({notification}: { notification: iNotification }) {

        const {loggedInUser} = useContext(AppStateContext);
        return <div
            className={classNames("notification-popup_content", notification.visibility === "1" ? "active" : "")}
            onClick={() => {
                console.log("click")
                console.log(notification.type)
                if (notification.type === "new_automations") {
                    history.push("/email/automations",{open_import:true})
                }
                if (notification.type === "new_popups") {
                    history.push("/popups",{open_import:true})
                }
                handleClose()
            }}>
            <div className="notification-popup_content_img">
                <img
                    src={(loggedInUser && loggedInUser.customers && loggedInUser.customers.length > 0) ?
                        new UserAPIs().getCustomerAvatarURL(loggedInUser.customers[0].uid, loggedInUser.customers[0].updated_at) : ""}
                    alt="Avatar"/>
            </div>
            <div className="notification-popup_content_message">
                <span className="notification-popup_content_message__span">{notification.title}</span>
                <span className="notification-popup_content_message__message">{notification.message}</span>
                {
                    notification.created_at && <span className="notification-popup_content_message__date"> <TimeFromNow
                        date_string={notification.created_at}/></span>
                }
            </div>
            <div className="notification-popup_content_actions">
                {/*<span>clear</span>*/}

            </div>
        </div>
    }

    const loadResource = useCallback(() => {
            dispatch({type: "loading_notification"})
            new NotificationAPIs().list(server_notifications.query).then((response) => {
                if (isMounted.current) {
                    if (NotificationAPIs.hasError(response)) {
                        dispatch({type: "error_notification", error: response.message})
                    } else {
                        dispatch({type: "response_notification", server_notification: response})
                    }
                }
            });
        },
        [isMounted, server_notifications.query]
    );


    useEffect(() => {
        loadResource()
    }, [server_notifications.query])
    if (!server_notifications) return null;

    return <>
        <IconButton
            color="primary"
            aria-label="Notifications"
            aria-controls="Notifications-menu"
            aria-haspopup="true"
            onClick={handleClick}
            component="span">
            <Notifications color="action"/>
        </IconButton>
        <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            style={{
                boxShadow: "var(--box-shadow-low)"
            }}
            onClose={handleClose}
        >
            <div className="notification-popup">
                <div className="notification-popup__heading">
                    <span>Notifications</span>
                </div>
                {
                    server_notifications.error_block && <div className="notification-popup__notifications__error">
                        <Alert>{server_notifications.error_block}</Alert>
                    </div>
                }
                {
                    !server_notifications.error_block && server_notifications.resource &&
                    <div className="notification-popup__notifications">

                        <Scrollbar removeTrackYWhenNotUsed permanentTrackY={true}
                                   style={{height: "300px"}}>
                            <h2 className="notification-popup__notifications__header">
                                <span>Latest</span>
                                {/*<a className="notification-popup__notifications__header_clear"*/}
                                {/*   href="#"><span>Clear all</span></a>*/}
                            </h2>
                            {
                                server_notifications.resource && !!server_notifications.resource.new_automations_count &&
                                <NotificationItems notification={{
                                    uid: "new_automations_count",
                                    id: 12,
                                    updated_at: "",
                                    created_at: "",
                                    title: server_notifications.resource.new_automations_count > 1 ? `${server_notifications.resource.new_automations_count} new automations are available` : "1 new automation is available",
                                    message: "Click here to show automations in gallery",
                                    type: "new_automations",

                                }}/>
                            }
                            {
                                server_notifications.resource && !!server_notifications.resource.new_popups_count &&
                                <NotificationItems notification={{
                                    uid: "new_popups_count",
                                    id: 12,
                                    updated_at: "",
                                    created_at: "",
                                    title: server_notifications.resource.new_popups_count > 1 ? `${server_notifications.resource.new_popups_count} new popups are available` : "1 new popup is available",
                                    message:"Click here to show popups in gallery",
                                    type: "new_popups",

                                }}/>
                            }
                            {
                                server_notifications.resource && server_notifications.resource.items && server_notifications.resource.items.data &&
                                server_notifications.resource.items.data.map((notification, index) => {
                                    return <NotificationItems notification={notification} key={index}/>
                                })
                            }
                            {
                                server_notifications.loading &&
                                <div className="notification-popup__notifications__loading">
                                    <AppLoader/>
                                </div>
                            }
                        </Scrollbar>

                    </div>
                }
            </div>
        </Popover>
    </>
}

export interface iSearchGroup {
    title?: string,
    automations?: iEmailAutomation[],
    campaigns?: iEmailCampaign[],
    mail_lists?: iEmailMailingList[],
    segments?: iEmailSegment[],
}

export interface iSearchGroupContent {
    title?: string,
    body?: string,
    link?: string,
    icon: any
}

export function TourMenu() {
    const tourProps = useTour();
    const {setSteps, setIsOpen, setCurrentStep} = tourProps;
    const history = useHistory();

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    return <span data-tut="reactour__skip_tour">
        <IconButton onClick={() => {
            setCurrentStep(0)
            setSteps(_HomeConfig(history, tourProps, dispatch))
            setIsOpen(true)
        }}>
        <Duo/>
    </IconButton>
    </span>
}

export function ProduktlyFeedback() {

    return <span>
        <IconButton onClick={() => (window as any).Produktly.openFeedback({ id: 400 })}>
        <img src={ChatLogo} style={{ width: '20px' }} alt="Chat logo"/>
    </IconButton>
    </span>
}

export function ProduktlyNew() {

    return <span>
        <IconButton onClick={() => (window as any).Produktly.openChangelog({id: 165})}>
        <img className="" src={New} style={{ width: '20px'}} alt="Chat logo"/>
    </IconButton>
    </span>
}


export function SearchPopupOver() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMounted = useIsMounted();
    const history = useHistory();
    const [searchQuery, setSearchQuery] = useState<string>();
    const [{
        response,
        error,
        loading,
        error_block
    }, dispatchResponse] = useReducer<Reducer<iResource<SearchResponse>, iResponseActions<SearchResponse>>>
    (responseReducer<iResource<SearchResponse>, any>({}), {loading: false});
    const handleClick = (event: any) => {

        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const loadSearchResult = useCallback((source: CancelTokenSource) => {
        dispatchResponse(loading_action_response());
        new CommonApis().search(searchQuery, source).then((res) => {
            if (isMounted.current) {
                if (CommonApis.hasError(res)) {
                    dispatchResponse(failed_action_response(res.message))
                } else {
                    dispatchResponse(success_action_response(res))
                }
            }
        })
    }, [searchQuery])

    useEffect(() => {

        const source = Axios.CancelToken.source()
        loadSearchResult(source);

        return () => {
            source.cancel()
        }
    }, [searchQuery])

    function SearchResultGroup(props: iSearchGroup) {
        return <div className="search-popover__content__results__group">
            <div className="search-popover__content__results__heading">
                <span>
                {props.title}
                </span>
            </div>
            {
                props.campaigns && props.campaigns.length > 0 && props.campaigns.map((value, index) => {
                    return <SearchResultCampaignContent key={index} {...value}/>
                })
            }
            {
                props.automations && props.automations.length > 0 && props.automations.map((value, index) => {
                    return <SearchResultAutomationContent key={index} {...value}/>
                })
            }
            {
                props.mail_lists && props.mail_lists.length > 0 && props.mail_lists.map((value, index) => {
                    return <SearchResultMailingListContent key={index} {...value}/>
                })
            }
            {
                props.segments && props.segments.length > 0 && props.segments.map((value, index) => {
                    return <SearchResultSegmentContent key={index} {...value}/>
                })
            }
        </div>
    }

    function SearchResultCampaignContent(props: iEmailCampaign) {
        return <div className="search-popover__content__results__content">
            <div className="search-popover__content__results__content_icon">
                {email_icon}
            </div>
            <div className="search-popover__content__results__content_result">
                <a href={`/email/campaigns/${props.uid}/overview`}
                   className="search-popover__content__results__content_result__link">
                    {props.name}

                </a>
                <span className="search-popover__content__results__content_result__date">
                    <FormattedDate date_string={props.created_at} format={'MMMM D, YYYY'}/>

                </span>
            </div>
        </div>
    }

    function SearchResultAutomationContent(props: iEmailAutomation) {
        return <div className="search-popover__content__results__content">
            <div className="search-popover__content__results__content_icon">
                {automation_icon}
            </div>
            <div className="search-popover__content__results__content_result">
                <a href={new EmailAutomationAPIs().getExternalEditorURL(props.uid)}
                   className="search-popover__content__results__content_result__link">
                    {props.name}
                </a>
                <span className="search-popover__content__results__content_result__date">

                    <FormattedDate date_string={props.created_at} format={'MMMM D, YYYY'}/>

                </span>
            </div>
        </div>
    }

    function SearchResultMailingListContent(props: iEmailMailingList) {
        return <div className="search-popover__content__results__content">
            <div className="search-popover__content__results__content_icon">
                {list_icon}
            </div>
            <div className="search-popover__content__results__content_result">
                <a href={`/email/lists/${props.uid}/view`}
                   className="search-popover__content__results__content_result__link">
                    {props.name}
                </a>
                <span className="search-popover__content__results__content_result__date">

                    <FormattedDate date_string={props.created_at} format={'MMMM D, YYYY'}/>

                </span>
            </div>
        </div>
    }

    function SearchResultSegmentContent(props: iEmailSegment) {
        return <div className="search-popover__content__results__content">
            <div className="search-popover__content__results__content_icon">
                {automation_icon}
            </div>
            <div className="search-popover__content__results__content_result">
                <a href={`/email/segments/${props.id}`}
                   className="search-popover__content__results__content_result__link">
                    {props.name}
                </a>
                <span className="search-popover__content__results__content_result__date">

                    <FormattedDate date_string={props.created_at} format={'MMMM D, YYYY'}/>

                </span>
            </div>
        </div>
    }


    return <>
        <div className="d-inline-flex"
             color="primary"
             aria-label="Search"
             aria-controls="Search-menu"
             aria-haspopup="true"
             onClick={handleClick}
        >
            <Form.Control type="text"
                          value={searchQuery}
                          style={{border: 0, boxShadow: 'none'}}
                          placeholder="Type to search"
                          className="search-box header-search-box"
                          onChange={(e) => {
                              setSearchQuery(e.target.value)
                              handleClick(e)
                          }}
            />
        </div>
        <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            disableScrollLock
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transitionDuration={100}
            onClose={handleClose}

        >
            <div className="search-popover">
                <div className="search-popover__input">
                    <Form.Control type="text"
                                  style={{border: 0, boxShadow: 'none'}}
                                  value={searchQuery}
                                  placeholder="Type to search"
                                  className="search-box header-search-box"
                                  autoFocus
                                  onChange={(e: any) => {

                                      setSearchQuery(e.target.value)
                                  }}
                    />
                </div>
                <div className="search-popover__content__results">
                    {RenderError({error: error})}
                    {
                        loading && <AppLoader/>
                    }
                    {(!loading && !error &&
                        !(response && response.campaigns &&
                            response.campaigns.length > 0)
                        &&
                        !(response && response.automations &&
                            response.automations.length > 0)
                        &&
                        !(response && response.mail_lists &&
                            response.mail_lists.length > 0)
                        &&
                        !(response && response.segments &&
                            response.segments.length > 0)
                    ) && <div className="search-popover__content__results__no_results">No Result Found!</div>
                    }
                    {!loading && !error &&

                    <Scrollbar removeTrackYWhenNotUsed permanentTrackY={true} style={{height: "400px"}}>
                        {
                            response && response.campaigns &&
                            response.campaigns.length > 0 &&
                            <SearchResultGroup title="Campaigns" campaigns={response.campaigns}/>
                        }
                        {
                            response && response.automations &&
                            response.automations.length > 0 &&
                            <SearchResultGroup title="Automations" automations={response.automations}/>
                        }
                        {
                            response && response.mail_lists &&
                            response.mail_lists.length > 0 &&
                            <SearchResultGroup title="Mail Lists" mail_lists={response.mail_lists}/>
                        }
                        {
                            response && response.segments &&
                            response.segments.length > 0 &&
                            <SearchResultGroup title="Segments" segments={response.segments}/>
                        }

                    </Scrollbar>
                    }
                </div>

            </div>
        </Popover>
    </>
}

export function HelpPopupOver() {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const isMounted = useIsMounted();
    const history = useHistory()

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

        setAnchorEl(null);
    };

    return <>
        <IconButton
            color="primary"
            aria-label="Help"
            aria-controls="Help-menu"
            aria-haspopup="true"
            onClick={handleClick}
            component="span">
            <HelpSharp color="action"/>
        </IconButton>
        <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            onClose={handleClose}
        >
            <div className="app-popover_wrapper">
                <List component="nav" className="app-popover">
                    {/*<a href="https://emailwish.com/about/" target="_blank" rel="noopener noreferrer"><ListItem button*/}
                    {/*                                                                                           className="app-popover_item">*/}
                    {/*    Why Emailwish?*/}
                    {/*</ListItem>*/}
                    {/*</a>*/}
                    <a href="https://blog.emailwish.com/category/case-study/" target="_blank"
                       rel="noopener noreferrer">
                        <ListItem button className="app-popover_item">
                            Case Studies
                        </ListItem></a>
                    <a href="https://www.youtube.com/channel/UCsZsVmPUNnvJblHDURUbWMQ/videos" target="_blank"
                       rel="noopener noreferrer">
                        <ListItem button className="app-popover_item">
                            Learn by Videos
                        </ListItem></a>
                    <a href="https://blog.emailwish.com/" target="_blank" rel="noopener noreferrer"><ListItem button
                                                                                                              className="app-popover_item">
                        Blog
                    </ListItem></a>
                    <a href="https://help.emailwish.com/" target="_blank" rel="noopener noreferrer"> <ListItem button
                                                                                                               className="app-popover_item">
                        Knowledge
                        base
                    </ListItem></a>


                    <Link to="/support" onClick={handleClose}>
                        <ListItem button
                                  className="app-popover_item">
                            Talk to an
                            agent
                        </ListItem></Link>

                    <a href="https://emailwish.com/terms-and-conditions/" target="_blank"
                       rel="noopener noreferrer"><ListItem button
                                                           className="app-popover_item">

                        Terms of use
                    </ListItem></a>
                    <a href="https://emailwish.com/privacy-policy/" target="_blank" rel="noopener noreferrer"><ListItem
                        button
                        className="app-popover_item">

                        Privacy
                        Policy
                    </ListItem></a>
                </List>
            </div>
        </Popover>
    </>
}

function Header() {
    const location = useLocation();

    const {chat_stats} = useContext(ChatAppStateContext);
    const [menu_options, setMenuOptions] = useState<iSideBarNavigation[]>([])

    useEffect(() => {
        let menus = [{link: "/dashboard", text: "Home", svg_node: undefined, "data-tut": "reactour__header_dashboard"},
            {link: "/email", text: "Email", svg_node: undefined, "data-tut": "reactour__header_email"},
            {link: "/chats", text: "Chats", badgeCount: "", svg_node: undefined, "data-tut": "reactour__header_chats"},
            {link: "/reviews", text: "Reviews", svg_node: undefined, "data-tut": "reactour__header_reviews"},
            {link: "/popups", text: "Popup", svg_node: undefined, "data-tut": "reactour__header_popups"},];


        setMenuOptions([...menus]);
    }, [chat_stats])

    const [width, setWidth] = useState<number>(window.innerWidth);

    const {loggedInUser} = useContext(AppStateContext);

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, []);

    let isMobile: boolean = (width <= 768);
    const opened_menu: string = getMenuNameFromPath(location.pathname, 1);

    return <>
    <Navbar bg="light" expand="lg" className="bg-white box-shadow sticky-top">
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                {!isMobile && menu_options.map((menu, i) => {
                    let link = menu.link.replace("/", "");
                    let isActive = link === opened_menu;

                    return <MenuLinkButton link={menu.link}
                                           key={((menu && menu.badgeCount && menu.badgeCount.toString()) || "-") + i}
                                           badgeCount={menu.badgeCount}
                                           data-tut={menu["data-tut"]}
                                           className={"nav-button mr-4 u500 " + (isActive ? "active" : "")}>
                        {menu.text}
                    </MenuLinkButton>
                })}
                {isMobile && menu_options.map((menu, i) => {
                    let link = menu.link.replace("/", "");
                    return <NavDropdown title={menu.text} key={i} id="basic-nav-dropdown">
                        {getSubMenuFromMainMenu(link).map((sub_menu, j) => {
                            return <NavDropdown.Item href={sub_menu.link} key={j} data-tut={sub_menu["data-tut"]}>
                                {sub_menu.text}
                            </NavDropdown.Item>
                        })}
                    </NavDropdown>
                })}
            </Nav>


            {
                !isMobile && <div className="pull-right">
                    <Row>
                        <Col className="d-flex justify-content-end">
                            <div className="d-inline-block">

                                <SearchPopupOver/>
                                <TourMenu/>
                                <NotificationPopupOver/>
                                <HelpPopupOver/>
                                <ProduktlyFeedback />
                                <ProduktlyNew />

                                <ProfileOptions/>
                            </div>
                        </Col>
                    </Row>
                </div>
            }
            {
                isMobile && <Row>
                    <Col className="d-flex justify-content-end">
                        <div className="d-inline-block">

                            <SearchPopupOver/>
                            <TourMenu/>
                            <NotificationPopupOver/>
                            <HelpPopupOver/>
                            <ProduktlyFeedback />
                            <ProduktlyNew />

                            <ProfileOptions/>
                        </div>
                    </Col>
                </Row>
            }
        </Navbar.Collapse>
    </Navbar>
    </>;

}

export default Header;
