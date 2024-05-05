import React, {Dispatch, useContext, useEffect, useState} from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import {AppDispatchContext, AppStateContext, NotificationContext} from "../../App";
import {iShopifyShop} from "../../types/internal";
import OnBoardingApis from "../../apis/onboarding.apis";
import useIsMounted from "ismounted";
import {useHistory} from "react-router-dom";
import UserAPIs from "../../apis/user.apis";
import {iStoreAction} from "../../redux/reducers";

export default function ShopifyPermissionRequired() {
    const isMounted = useIsMounted();
    const {shops} = useContext(AppStateContext);
    const [shopPermissionRequired, setShopPermissionRequired] = useState<iShopifyShop>();
    useEffect(() => {
        if (shops) {
            for (let i = 0; i < shops.length; i++) {
                if (shops[i].token_refresh_required) {
                    setShopPermissionRequired(shops[i])
                    break;
                }
            }

        }
    }, [shops])
    const history = useHistory();
    const notificationContext = useContext(NotificationContext);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    return <Modal show={!!shopPermissionRequired} size="xl" centered>
        <Modal.Header>
            <Modal.Title>Shopify Re-authorization
                for {shopPermissionRequired && shopPermissionRequired.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            It looks like something changed and we need to refresh our installation.
            Please click "Continue" to re-authorize with shopify, your data will not be lost.
        </Modal.Body>
        <Modal.Footer>
            <div className="d-flex align-items-center">
                <Button variant="primary" onClick={() => {
                    new UserAPIs().logout().then(() => {
                        if (isMounted.current) {

                            dispatch({type: "logout"});
                            history.replace("/login");
                        }
                    });
                }}>Logout</Button>
                <div className="p-2"/>
                <Button variant="primary" onClick={() => {
                    if (shopPermissionRequired) {
                        setIsSubmitting(true)
                        new OnBoardingApis().re_authorize(shopPermissionRequired.myshopify_domain).then((res) => {
                            if (isMounted.current) {
                                setIsSubmitting(false)
                                if (OnBoardingApis.hasError(res, notificationContext)) {

                                } else {
                                    if (res.redirectURL) {
                                        window.location.href = res.redirectURL;
                                    } else if (res.reactURL) {
                                        history.replace(res.reactURL);
                                    }
                                }
                            }
                        })
                    }
                }}>{isSubmitting && <><Spinner animation="border"
                                               size="sm"/>&nbsp;</>} Continue</Button>
            </div>

        </Modal.Footer>
    </Modal>
}
