import React, {Dispatch, useContext} from 'react';
import {useSnackbar} from 'notistack';
import {AppDispatchContext, AppStateContext} from "../App";
import {iStoreAction} from "../redux/reducers";

let displayed: any[] = [];

export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';

export const enqueueSnackbar = (notification: any): any => {
    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
            key: key || new Date().getTime() + Math.random(),
        },
    };
};

export const closeSnackbar = (key: any): any => ({
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
});

export const removeSnackbar = (key: any): any => ({
    type: "REMOVE_SNACKBAR",
    key: key,
});


const Notifier = () => {


    const {notifications} = useContext(AppStateContext);

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);

    const {enqueueSnackbar, closeSnackbar} = useSnackbar();

    const storeDisplayed = (id: any) => {
        displayed = [...displayed, id];
    };

    const removeDisplayed = (id: any) => {
        displayed = [...displayed.filter(key => id !== key)];
    };

    React.useEffect(() => {
        notifications && notifications.forEach(({key, message, options = {}, dismissed = false}) => {
            if (dismissed) {
                // dismiss snackbar using notistack
                closeSnackbar(key);
                return;
            }

            // do nothing if snackbar is already displayed
            if (displayed.includes(key)) return;

            // display snackbar using notistack
            enqueueSnackbar(message, {
                key,
                ...options,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    // remove this snackbar from redux store
                    dispatch({
                        type: "REMOVE_SNACKBAR",
                        key: myKey,
                    });
                    removeDisplayed(myKey);
                },
            });

            // keep track of snackbars that we've displayed
            storeDisplayed(key);
        });
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);

    return null;
};

export default Notifier;
