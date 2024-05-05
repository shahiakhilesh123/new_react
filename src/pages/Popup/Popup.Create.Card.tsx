import React from "react";
import AppCard from "../../components/Card/AppCard";
import classNames from "classnames";
import {PopupProps} from "../../components/popups/popup_props/props";

export function PopupCreateCard({setFieldValue, popup, selected_popup_id}: {
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void,
    popup: PopupProps,
    selected_popup_id: string

}) {
    return <a onClick={() => {
        setFieldValue("data", JSON.stringify(popup));
        setFieldValue("width", popup.popup_width);
        setFieldValue("height", popup.popup_height);
        setFieldValue("type", popup.popup_id);
    }}
    >

        <div className="popup-template-chooser__item__wrapper">
            <div
                className="popup-template-chooser__item">
                <div
                    className="popup-template-chooser__item__inner">
                    <div
                        className="popup-template-chooser__item__img">
                        <AppCard
                            className="popup-template-chooser__item__img__wrapper">
                            <div
                                className={classNames("generic-select-child select-template-layout", popup.popup_id === selected_popup_id ? "active" : "")}>

                                <img
                                    src={popup.popup_thumbnail}
                                    alt={popup.popup_id}
                                />

                            </div>
                        </AppCard>
                    </div>
                </div>
            </div>

        </div>
    </a>
}