import React, {createContext, useCallback, useEffect, useReducer, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import Router from "./pages/Router";
import {ThemeProvider} from "@material-ui/core/styles";
import theme from "./AppTheme";
import {appReducer, State} from "./redux/reducers";
import {SnackbarProvider} from "notistack";
import Notifier, {
    closeSnackbar as closeSnackbarAction,
    enqueueSnackbar as enqueueSnackbarAction
} from "./components/Notifier";
import {iApiBasicResponse} from "./types/api";
import BaseAPIs from "./apis/base.apis";
import CustomModal from "./components/Modal/CustomModal";
import {BreadCrumbContext} from "./components/Breadcrumbs/WithBreadcrumb";
import WebsocketHandler from './components/Websocket/WebsockerHandler';
import {chatReducer, ChatState} from "./redux/reducers/chatReducer";
import {TourProvider} from "@reactour/tour";
import {TOUR_SKIP} from "./components/Tour/Pages/Home.Tour";
import {hideChat, ShowEWChat} from "./components/common";

export const AppStateContext = createContext<State>({
    notifications: [],
    userInteracted: false,
    server_notifications: {loading: false, resource: undefined, query: {per_page: 10, page: 1}}
});
export const AppDispatchContext = createContext<any>({});
export const ChatAppStateContext = createContext<ChatState>({});
export const ChatAppDispatchContext = createContext<any>({});

export interface NotificationDispatch {
    pushSuccessNotification: (message?: string) => void,
    pushErrorNotification: (message?: string) => void,
    pushNotification: (response: iApiBasicResponse) => void,
}

export const NotificationContext = createContext<NotificationDispatch>({
    pushSuccessNotification: message => {
    },
    pushErrorNotification: message => {
    },
    pushNotification: response => {
    },
});


export default function App() {
    const [state, dispatch] = useReducer(appReducer, {
        notifications: [],
        userInteracted: false,
        popup_tour_shown: true,
        server_notifications: {loading: false, resource: undefined, query: {per_page: 10, page: 1}}
    },);
    const {tour} = state;
    const [chatState, chatDispatch] = useReducer(chatReducer, {});

    // @ts-ignore
    const enqueueSnackbar = (...args: any[]) => dispatch(enqueueSnackbarAction(...args));
    // @ts-ignore
    const closeSnackbar = (...args: any[]) => dispatch(closeSnackbarAction(...args));

    const pushSuccessNotification = (message?: string) => {
        if (message) {
            // NOTE:
            // if you want to be able to dispatch a `closeSnackbar` action later on,
            // you SHOULD pass your own `key` in the options. `key` can be any sequence
            // of number or characters, but it has to be unique for a given snackbar.
            enqueueSnackbar({
                message: message,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },

                },

            });
        }

    };
    const pushErrorNotification = (message?: string) => {
        if (message) {
            // NOTE:
            // if you want to be able to dispatch a `closeSnackbar` action later on,
            // you SHOULD pass your own `key` in the options. `key` can be any sequence
            // of number or characters, but it has to be unique for a given snackbar.
            enqueueSnackbar({
                message: message,
                options: {
                    key: new Date().getTime() + Math.random(),
                    variant: 'danger',

                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },
                },

            });
        }

    };
    const pushNotification = (response: iApiBasicResponse) => {
        if (BaseAPIs.hasErrorNotification(response)) {
            pushErrorNotification(response.message);
        } else {
            pushSuccessNotification(response.message)
        }
    };
    const [links, setLinks] = useState<Array<{
        text: string,
        link: string
    }>>([]);
    const onBreadCrumbChange = useCallback((links_temp: any) => {
        setLinks(links_temp);
    }, [])

    function closeTour() {
        if (tour) {
            if (tour.tour_type !== TOUR_SKIP) {
                dispatch({type: "set_tour", tour: {...tour, tour_type: TOUR_SKIP}})
            } else {
                dispatch({type: "set_tour", tour: {...tour, tour_active: false}})
            }
        }
    }

    useEffect(() => {
        console.log("Emailwish")
        ShowEWChat()
        return () => {
            hideChat()
        }
    }, []);

    return <ThemeProvider theme={theme}>
        <BrowserRouter>
            <AppDispatchContext.Provider value={dispatch}>
                <AppStateContext.Provider value={state}>
                    <TourProvider
                        showCloseButton={false}
                        steps={[]}
                        maskClassName="tour-mask"
                        inViewThreshold={5}
                        showBagde={false}
                        showNavigation={false}
                        className="helper"
                        beforeClose={closeTour}>
                        <ChatAppDispatchContext.Provider value={chatDispatch}>
                            <ChatAppStateContext.Provider value={chatState}>
                                <WebsocketHandler/>
                                <SnackbarProvider>
                                    <NotificationContext.Provider value={{
                                        pushErrorNotification: pushErrorNotification,
                                        pushSuccessNotification: pushSuccessNotification,
                                        pushNotification: pushNotification,
                                    }}>
                                        <BreadCrumbContext.Provider value={{
                                            links: links,
                                            setLinks: onBreadCrumbChange
                                        }}>

                                            <CustomModal>

                                                <Router/>
                                            </CustomModal>
                                        </BreadCrumbContext.Provider>
                                    </NotificationContext.Provider>
                                    <Notifier/>
                                </SnackbarProvider>
                            </ChatAppStateContext.Provider>
                        </ChatAppDispatchContext.Provider>
                    </TourProvider>
                </AppStateContext.Provider>
            </AppDispatchContext.Provider>
        </BrowserRouter>
    </ThemeProvider>
};
