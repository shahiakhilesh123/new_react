import React, {createContext, useCallback, useContext, useReducer, useState} from "react";
import {Reducer} from "redux";
import {Modal} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {iApiBasicResponse} from "../../types/api";
import axios from "axios";
import BaseAPIs from "../../apis/base.apis";
import {NotificationContext} from "../../App";


export interface iActionResource {
    values: Array<{
        label: string,
        value: string
    }>,
    title: string,
    body: string,
    route: string,
    request_type?: "GET" | "POST" | "DELETE"
}


export type iModalActions =
    | { type: "show_action_modal", action_resource: iActionResource }
    | { type: "hide_action_modal" }

export interface iModalResource {
    resource?: iActionResource,
    show_action_modal?: boolean,
}

export const modalReducer: Reducer<iModalResource, iModalActions> = (state, action) => {

    switch (action.type) {
        case "show_action_modal":
            return {...state, resource: action.action_resource, show_action_modal: true}
        case "hide_action_modal":
            return {...state, show_action_modal: false, resource: undefined};
        default:
            return {...state, show_action_modal: false};
    }

}

export const delete_modal_action = (action_resource: iActionResource): iModalActions => {
    return {type: "show_action_modal", action_resource: action_resource}
};


export const delete_modal_hide = (): iModalActions => {
    return {type: "hide_action_modal"}
};

export interface AppModalContextProps {
    showActionModal?: (actionResource: iActionResource, callback: (reload: boolean) => void) => void;
}

export const AppModalContext = createContext<AppModalContextProps>({});

export default function CustomModal(props: any) {
    const [response, dispatchResponse] = useReducer(modalReducer, {});
    const [callback, setCallback] = useState<(reload: boolean) => void>();

    const notificationContext = useContext(NotificationContext);
    const actionResources = async (uids: Array<string>, route: string, request_type?: "GET" | "POST" | "DELETE"): Promise<iApiBasicResponse | null> => {
        let csrfToken: string = await new BaseAPIs().getCsrfToken();
        if (!csrfToken) return {statusCode: 999, errors: {network: "Network error!"}};

        const deletionQuery = {
            _token: csrfToken,
            uids: uids.join(',')
        };
        if (!request_type) {
            request_type = "GET";
        }
        if (request_type === "GET") {
            return axios
                .get(route, {
                    withCredentials: true,
                    params: {
                        ...deletionQuery,
                        ts: new Date().getTime()
                    }
                })
                .then((res): iApiBasicResponse => ({...res.data, statusCode: res.status,}))
                .catch((error): any => {
                    return new BaseAPIs().handleCatch(error);
                })
        } else if (request_type === "POST") {
            return axios
                .post(route, {}, {
                    withCredentials: true,
                    params: deletionQuery
                })
                .then((res): iApiBasicResponse => ({...res.data, statusCode: res.status,}))
                .catch((error): any => {
                    return new BaseAPIs().handleCatch(error);
                })
        } else if (request_type === "DELETE") {
            return axios
                .delete(route, {
                    withCredentials: true,
                    params: deletionQuery
                })
                .then((res): iApiBasicResponse => ({...res.data, statusCode: res.status,}))
                .catch((error): any => {
                    return new BaseAPIs().handleCatch(error);
                })
        }
        return null;

    };

    const showDeleteModal = useCallback((deleteResource: iActionResource, callback: (reload: boolean) => void) => {
        setCallback(() => callback);
        dispatchResponse(delete_modal_action(deleteResource))
    }, []);

    return <AppModalContext.Provider value={{showActionModal: showDeleteModal,}}>
        {
            props.children
        }
        {
            response && !!response.resource && <Modal
                show={response.show_action_modal} onHide={() => {

            }}>
                <Modal.Body>{response.resource.body}</Modal.Body>
                <Modal.Footer>
                    <Button variant="outlined" color="secondary" onClick={() => {
                        dispatchResponse(delete_modal_hide())
                    }}>
                        No
                    </Button>
                    <Button color="primary" variant="contained" className="positive-button ml-2" onClick={async () => {
                        if (response && response.resource && response.resource.values) {

                            dispatchResponse(delete_modal_hide())
                            let res = await actionResources(
                                response.resource.values.map((v => v.value)),
                                response.resource.route,
                                response.resource.request_type,
                            );
                            if (res) {

                                let reload = !BaseAPIs.hasError(res, notificationContext)
                                callback && callback(reload);
                            }
                        }

                    }}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        }

    </AppModalContext.Provider>
}

