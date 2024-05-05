import {closeSnackbar as closeSnackbarAction, enqueueSnackbar as enqueueSnackbarAction} from "./Notifier";
import {Dispatch, useContext} from "react";
import {iStoreAction} from "../redux/reducers";
import {AppDispatchContext} from "../App";

export default function Notification() {

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    // @ts-ignore
    const enqueueSnackbar = (...args: any[]) => dispatch(enqueueSnackbarAction(...args));
    // @ts-ignore
    const closeSnackbar = (...args: any[]) => dispatch(closeSnackbarAction(...args));


    return null;
}