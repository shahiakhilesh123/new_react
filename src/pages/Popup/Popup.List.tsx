import {
    Button,
    FormControlLabel,
    Grid,
    IconButton,
    ListItemIcon,
    ListItemText,
    Slider,
    Switch,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import SettingsIcon from '@material-ui/icons/Settings';
import Axios, {CancelTokenSource} from "axios";
import useIsMounted from "ismounted";
import React, {Dispatch, useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Alert, Badge, Col, Dropdown, Form, Modal, Row, Spinner} from "react-bootstrap";
import {FaMinus, FaPlus, FaTrash} from "react-icons/fa";
import {Link, useHistory, useLocation} from "react-router-dom";
import PopupAPIs, {iExplorePublicPopups, iPopupListingResponse} from "../../apis/Popup/popup.apis";
import CustomDataTable from "../../components/CustomerDataTable/CustomDataTable";
import AppLoader from "../../components/Loader/AppLoader";
import {iPopup} from "../../types/internal/popup/popup";
import EditIcon from "@material-ui/icons/Edit";
import {customStyles} from "../../components/common/common";
import {FieldArray, Formik} from "formik";
import * as yup from "yup";
import VisibilityIcon from '@material-ui/icons/Visibility';
import {AppDispatchContext, AppStateContext, NotificationContext} from "../../App";
import {
    current_page_change_action,
    failed_action,
    failed_action_response,
    iListResource,
    iListResponseActions,
    iResource,
    iResponseActions,
    iStoreAction,
    listReducer,
    loading_action,
    loading_action_response,
    onSortAction,
    per_page_row_change_action,
    responseReducer,
    search_action,
    success_action,
    success_action_response
} from "../../redux/reducers";
import UserAPIs, {iDashboardPopupSummaryResponse} from "../../apis/user.apis";
import EmailAutomationAPIs from "../../apis/Email/email.automations.apis";
import popup_image_1 from "../../assets/images/popup_1.png";
import popup_image_2 from "../../assets/images/popup_2.png";
import popup_image_4 from "../../assets/images/popup_4.png";
import popup_image_3 from "../../assets/images/popup_3.png";
import popup_image_5 from "../../assets/images/popup_5.png";
import popup_image_6 from "../../assets/images/popup_6.png";
import popup_image_7 from "../../assets/images/popup_7.png";
import popup_image_8 from "../../assets/images/popup_8.png";
import popup_image_9 from "../../assets/images/popup_9.jpeg";
import popup_image_10 from "../../assets/images/popup_10.jpeg";
import popup_image_11 from "../../assets/images/popup_11.jpeg";
import popup_image_12 from "../../assets/images/popup_12.jpeg";
import popup_image_13 from "../../assets/images/popup_13.jpeg";
import popup_image_14 from "../../assets/images/popup_14.jpg";
import popup_image_15 from "../../assets/images/popup_15.jpg";
import popup_image_16 from "../../assets/images/popup_16.jpg";
import popup_image_17 from "../../assets/images/popup_17.jpg";
import popup_image_18 from "../../assets/images/popup_18.jpg";
import popup_image_19 from "../../assets/images/popup_19.jpg";
import popup_image_20 from "../../assets/images/popup_20.jpg";
import popup_image_21 from "../../assets/images/popup_21.jpg";
import {PopupContext, PopupProps} from "../../components/popups/popup_props/props";
import {HandleErrors} from "../../components/helper/form.helper";
import BaseAPIs from "../../apis/base.apis";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import {a11yProps, TabPanel} from "../Email/Templates/Email.Templates.Create";
import SwipeableViews from "react-swipeable-views";
import {PopupCreateCard} from "./Popup.Create.Card";
import {Scrollbar} from "../../components/CustomScroll/ScrollBars";
import {AppModalContext} from "../../components/Modal/CustomModal";
import FileCopyIcon from '@material-ui/icons/FileCopy';
import FormattedDate from "../../components/Utils/FormattedDate";
import {MoreHoriz} from "@material-ui/icons";
import {CustomToggle} from "../Email/Campaigns/Email.Campaigns.List";
import Hidden from "@material-ui/core/Hidden";
import {Reducer} from "redux";
import Typography from "@material-ui/core/Typography";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import theme from "../../AppThemePopup";
import PopupPreview from "./PopupPreview";
import WindowSize from "@reach/window-size";
import {useTour} from "@reactour/tour";
import {_HomeConfig} from "../../components/Tour/Pages/Home.Tour";
import {getSortOrder, saveSortOrder} from "../../components/utils";
import HelpVideo from "../../components/HelpVideo/HelpVideo";
import {AiFillDollarCircle, AiOutlineFall} from "react-icons/ai";
import getSymbolFromCurrency from "currency-symbol-map";
import {AiOutlineInfoCircle, HiCursorClick, HiDownload, TiEye} from "react-icons/all";
import {IDataTableColumn} from "react-data-table-component";
import import_automations from "../../assets/images/import_automations.jpeg";
import Public from "@material-ui/icons/Public";

export const default_popup_data: PopupProps = {

    ...{
        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "backgroundOverlayColor": "#00000000",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff00",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff00",
        "NegativeButtonHoverBorderColor": "#ffffff00",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff00",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff00",
        "PositiveButtonShadowColor": "#ffffff00",
        "firstTextFormBorderColor": "#ffffff00",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff00",
        "firstTextFormShadowColor": "#ffffff00",
        "secondTextFormBorderColor": "#ffffff00",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff00",
        "secondTextFormShadowColor": "#ffffff00",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Copy of Popup Template 2",
        "popup_thumbnail": "/static/media/popup_5.96b0cb9d.png",
        "title": "Here's a little gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#fef8f8ff",
        "titleTextColor": "#000",
        "titleTextSize": "20",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/8VkoAqRrbeQbt6BMESdBbQKGH1aEBbJQUShd6mZa.jpeg",
        "hideImage": false,
        "popup_id": "5",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#000000",
        "PositiveButtonBackgroundColor": "#000",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "477",
        "popup_width": "754",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": true,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#ffffff00",
        "PositiveButtonBorderColor": "#ffffff00",
        "thirdTextFormShadowColor": "#ffffff00",
        "thirdTextFormBorderColor": "#ffffff00",
        "thirdTextFormFocusShadowColor": "#ffffff00",
        "formAlignment": "center"
    },
    PositiveButtonTextAlignment: 'center',
    PositiveButtonAlignment: "center",
    PositiveButtonWidth: "auto",
    PositiveButtonHeight: "auto",
    backgroundImage: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/default_popup_bg.jpeg",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    hasBackgroundImage: false,
    imageBackgroundPosition: "center",
    imageBackgroundRepeat: "no-repeat",
    imageBackgroundSize: "cover",
    imageHeightPercentAge: 100,
    imageWidthPercentAge: 100,

    popup_title: "",
    popup_thumbnail: popup_image_1,
    image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/popup_default_gallery_image.jpeg",
    creationMode: true,
    aspect_ratio: true,
}
const popupTrigger = [
    {
        id: "on-load",
        name: "On-load"
    },
    {
        id: "scroll-start",
        name: "Scroll Start"
    },
    {
        id: "scroll-middle",
        name: "Scroll Middle"
    },
    {
        id: "scroll-end",
        name: "Scroll End"
    },
    {
        id: "idle",
        name: "Idle"
    },
    {
        id: "leaving",
        name: "Leaving"
    },
]


const popups_layouts: PopupProps[] = [
    {
        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_1,
        title: "Subscribe",
        body: "Be the First to know by subscribing to the email to us. We will send you an update to the email you registered.",

        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/popup_default_gallery_image.jpeg",
        hideImage: false,
        popup_id: "1",
        PositiveButtonText: "SUBSCRIBE",
        PositiveButtonTextSize: "12",
        PositiveButtonRadius: "0",

        popup_height: "250",
        popup_width: "300",
        popup_position: "center",
        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: false,
        hideSecondTextFormField: false,
        titleAlign: "right",
        bodyAlign: "center",
        footerAlign: "center",
        hideBody: false,
        hideFooter: false,
        hideTitle: false,
        hidePositiveButton: false,
        NegativeButtonText: "",
        NegativeButtonTextSize: "",
        NegativeButtonRadius: "",
        hideNegativeButton: true,

        hasImageUploadOption: false,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true,

    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_2,
        title: "Subscribe",
        body: "Be the First to know by subscribing to the email to us. We will send you an update to the email you registered.",

        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/popup_default_gallery_image.jpeg",
        hideImage: false,
        popup_id: "2",
        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "270",
        popup_width: "700",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,

        hideFirstTextFormField: false,
        hideSecondTextFormField: false,
        titleAlign: "center",
        bodyAlign: "center",
        footerAlign: "center",
        hideBody: false,
        hideFooter: false,
        hideTitle: false,
        hidePositiveButton: false,
        hideNegativeButton: true,


        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true,


    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_4,
        title: "Subscribe",
        body: "Be the First to know by subscribing to the email to us. We will send you an update to the email you registered.",
        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/popup_default_gallery_image.jpeg",
        hideImage: false,
        popup_id: "3",

        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "320",
        popup_width: "700",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,

        hideFirstTextFormField: false,
        hideSecondTextFormField: false,

        titleAlign: "center",
        bodyAlign: "center",
        footerAlign: "center",

        hideBody: false,
        hideFooter: false,
        hideTitle: false,
        hidePositiveButton: false,
        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true

    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_3,
        title: "Subscribe",
        body: "Be the First to know by subscribing to the email to us. We will send you an update to the email you registered.",
        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/popup_default_gallery_image.jpeg",
        hideImage: false,
        popup_id: "4",
        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "650",
        popup_width: "300",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,

        hideFirstTextFormField: false,
        hideSecondTextFormField: false,

        titleAlign: "center",
        bodyAlign: "center",
        footerAlign: "center",


        hideBody: false,
        hideFooter: false,
        hideTitle: false,

        hidePositiveButton: false,

        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true

    },
]
const popups_templates: PopupProps[] = [
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_5,
        title: "This is Sample Default Popup",
        body: "You get full freedom to design your own popup or choose from our wide range of beautiful popups",

        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/fashion_1.jpg",
        hideImage: false,
        popup_id: "5",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",

        popup_height: "298",
        popup_width: "410",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "left",
        bodyAlign: "left",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,

        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_7,
        title: "The Latest Offers,",
        body: "Direct to Your Inbox.",

        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/popup_default_gallery_image.jpeg",
        hideImage: true,
        popup_id: "7",
        borderWidth: "1",
        borderRadius: "5",
        PositiveButtonText: "SUBMIT",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "200",
        popup_width: "500",
        popup_position: "center",
        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "left",
        bodyAlign: "left",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,
        hideNegativeButton: true,

        hasImageUploadOption: false,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_6,
        title: "Hello there!",
        body: "This is a sample Popup",
        titleTextSize: "20",
        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/coffe_cup.png",
        hideImage: false,
        popup_id: "6",
        PositiveButtonText: "SAMPLE BUTTON",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "200",
        popup_width: "374",
        popup_position: "center",
        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "center",
        bodyAlign: "center",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,
        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },
    {

        ...default_popup_data,
        imageBackgroundSize: "contain",
        popup_title: "",
        popup_thumbnail: popup_image_8,
        title: "We use cookies",
        body: "Please, accept these sweeties to continue enjoying our site!",
        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/cookie.png",
        hideImage: false,
        popup_id: "8",
        thirdTextFormFieldTextSize: "12",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "300",
        popup_width: "300",
        popup_position: "center",
        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "center",
        bodyAlign: "center",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,

        NegativeButtonText: "Nope... I am on a diet",
        NegativeButtonTextColor: "#70bcf8",
        NegativeButtonBackgroundColor: "#ffffff",
        NegativeButtonHoverBackgroundColor: "#ffffff",
        NegativeButtonTextSize: "12",
        NegativeButtonRadius: "0",
        hideNegativeButton: false,

        hasImageUploadOption: true,
        hasNegativeButtonOption: true,
        emailFieldRequired: true,
        hasForm: false
    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_9,
        title: "This is Sample Default Popup",
        body: "You get full freedom to design your own popup or choose from our wide range of beautiful popups",
        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/wall_girl.jpeg",
        hideImage: false,
        popup_id: "9",
        borderWidth: "1",
        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "250",
        popup_width: "500",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "left",
        bodyAlign: "left",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,

        NegativeButtonText: "",

        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_10,
        title: "This is Sample Default Popup",
        body: "You get full freedom to design your own popup or choose from our wide range of beautiful popups",
        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/orange_girl.jpeg",
        hideImage: false,
        popup_id: "10",
        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "250",
        popup_width: "500",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "left",
        bodyAlign: "left",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,

        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_11,
        title: "Never miss the latest news",
        body: "We promise to be careful with your time.",
        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/blue_yellow.jpeg",
        hideImage: false,
        popup_id: "11",
        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "250",
        popup_width: "408",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "left",
        bodyAlign: "left",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,
        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_12,
        title: "This is Sample Default Popup",
        body: "You get full freedom to design your own popup or choose from our wide range of beautiful popups",

        firstTextFormFieldHint: "First name",
        footer: "We promise not to spam",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/ice_cream.jpeg",
        hideImage: false,
        popup_id: "12",
        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "Email",
        secondTextFormFieldHint: "Last name",
        popup_height: "250",
        popup_width: "500",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "left",
        bodyAlign: "left",
        footerAlign: "center",
        hideBody: false,
        hideFooter: true,
        hideTitle: false,
        hidePositiveButton: false,
        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },
    {

        ...default_popup_data,
        popup_title: "",
        popup_thumbnail: popup_image_13,
        title: "SAVE 10%",
        body: "with your first order",
        firstTextFormFieldHint: "First name",
        footer: "By subscribing to our newsletter you agree to our Privacy Policy",
        image: new BaseAPIs().getPopupImageHostURL() + "/ew-front/popup/assets/Products.jpeg",
        hideImage: false,
        popup_id: "13",
        PositiveButtonText: "SUBSCRIBE",
        thirdTextFormFieldHint: "your@email.com",
        secondTextFormFieldHint: "Last name",
        popup_height: "250",
        popup_width: "500",
        popup_position: "center",

        creationMode: true,
        aspect_ratio: true,
        hideFirstTextFormField: true,
        hideSecondTextFormField: true,
        titleAlign: "center",
        bodyAlign: "center",
        footerAlign: "center",
        hideBody: false,
        hideFooter: false,
        hideTitle: false,
        hidePositiveButton: false,

        hideNegativeButton: true,

        hasImageUploadOption: true,
        hasNegativeButtonOption: false,

        emailFieldRequired: true,
        hasForm: true
    },

    {

        ...default_popup_data,

        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff",
        "PositiveButtonShadowColor": "#00000000",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Template Yellow Suit Man on Chair",

        popup_thumbnail: popup_image_14,
        "title": "Here's a little gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#fcf3e7ff",
        "titleTextColor": "#000",
        "titleTextSize": "20",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/Bei02SUIZCahk2HEZWYayiQdQPHEvY8TA1S1ppOs.jpeg",
        "hideImage": false,
        "popup_id": "14",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#ffdc2fff",
        "PositiveButtonBackgroundColor": "#000",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "517",
        "popup_width": "768",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": false,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000000ff",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#f5a623ff",
        "PositiveButtonBorderColor": "#070707e8",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "center"
    },
    {

        ...default_popup_data,

        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff",
        "PositiveButtonShadowColor": "#ffffff",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Template Gift Box",

        popup_thumbnail: popup_image_15,
        "title": "Here's a little Christmas gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#fefbf8ff",
        "titleTextColor": "#000",
        "titleTextSize": "20",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/wX9xWOVWS8GB1WIyjtyac42L3q4t5kPKeWZvsz9O.jpeg",
        "hideImage": false,
        "popup_id": "15",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#b8956aff",
        "PositiveButtonBackgroundColor": "#000000ff",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "477",
        "popup_width": "754",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": true,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000000ff",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#ffffff",
        "PositiveButtonBorderColor": "#ffffff",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "center"
    },
    {
        ...default_popup_data,
        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff",
        "PositiveButtonShadowColor": "#ffffff",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Template Muesli In Bowl",

        popup_thumbnail: popup_image_16,
        "title": "Here's a little gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#faf8feff",
        "titleTextColor": "#000",
        "titleTextSize": "20",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/MPrjMMa3635z1hZDFveAe6HZCwVkg9mOle7J23U3.jpeg",
        "hideImage": false,
        "popup_id": "16",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#d6e4ffff",
        "PositiveButtonBackgroundColor": "#2b9cd8ff",
        "PositiveButtonTextColor": "#ffffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "477",
        "popup_width": "754",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": true,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#1aa9f6ff",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#ffffff",
        "PositiveButtonBorderColor": "#ffffff",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "center"
    },
    {
        ...default_popup_data,
        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff",
        "PositiveButtonShadowColor": "#ffffff",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Template Strawberries",

        popup_thumbnail: popup_image_17,
        "title": "Here's a little gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#fef8f8ff",
        "titleTextColor": "#000",
        "titleTextSize": "20",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/oPjxrLEHBrDYmRztgyBBkb2tLd6m5WefZexS8Zfa.jpeg",
        "hideImage": false,
        "popup_id": "17",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#ffd6d6ff",
        "PositiveButtonBackgroundColor": "#000",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "470",
        "popup_width": "750",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": false,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#ffffff",
        "PositiveButtonBorderColor": "#ffffff",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "center"
    },
    {
        ...default_popup_data,
        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff",
        "PositiveButtonShadowColor": "#00000000",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Template Women on Chair",

        popup_thumbnail: popup_image_18,
        "title": "Here's a little gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#fcf3e7ff",
        "titleTextColor": "#000",
        "titleTextSize": "20",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/V9qlEPKtJioCLmCUtEqK1ymzajE2l0EbzmwzNZ7p.jpeg",
        "hideImage": false,
        "popup_id": "18",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#ffecd6ff",
        "PositiveButtonBackgroundColor": "#000",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "470",
        "popup_width": "750",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": false,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000000ff",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#f5a623ff",
        "PositiveButtonBorderColor": "#070707e8",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "center"
    },
    {
        ...default_popup_data,
        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "center",
        "PositiveButtonWidth": "38",
        "PositiveButtonHeight": "45",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/H9pmlS9TS5z8pLFhe8fxbVw9R0sfg6cupRFPT906.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": true,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 0,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#00000000",
        "PositiveButtonFocusShadowColor": "#0000003a",
        "PositiveButtonShadowColor": "#00000038",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Vertical Template In Yellow",
        popup_thumbnail: popup_image_19,
        "title": "10% Off",
        "body": "Be the First to know by subscribing to the email to us. We will send you an update to the email you registered.",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#ffffff",
        "titleTextColor": "#ffffffff",
        "titleTextSize": "34",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/CrbEK3gxN5GQH2nrKkmgYxHEiYU2bXUOZeTvXbxP.jpeg",
        "hideImage": false,
        "popup_id": "19",
        "borderWidth": "1",
        "borderRadius": "5",
        "borderColor": "#eee",
        "PositiveButtonBackgroundColor": "#000000",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "Subscribe",
        "PositiveButtonTextSize": "15",
        "PositiveButtonRadius": "3",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "650",
        "popup_width": "375",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": false,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "center",
        "bodyAlign": "center",
        "footerAlign": "center",
        "hideBody": true,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000000",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#fdb543",
        "PositiveButtonHoverBorderColor": "#00000000",
        "PositiveButtonBorderColor": "#00000000",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "flex-end"
    },
    {
        ...default_popup_data,
        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff",
        "PositiveButtonShadowColor": "#ffffff",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Template Candy Bar",

        popup_thumbnail: popup_image_20,
        "title": "Here's a little gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#f8fefdff",
        "titleTextColor": "#000",
        "titleTextSize": "23",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/KZONTA5K52nR0mbwxQbEDsHOrZImtijIuUQoN5x1.jpeg",
        "hideImage": false,
        "popup_id": "20",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#d6faffff",
        "PositiveButtonBackgroundColor": "#000",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "470",
        "popup_width": "750",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": false,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#ffffff",
        "PositiveButtonBorderColor": "#ffffff",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "center"
    },
    {

        ...default_popup_data,
        "PositiveButtonTextAlignment": "center",
        "PositiveButtonAlignment": "flex-start",
        "PositiveButtonWidth": "44",
        "PositiveButtonHeight": "52",
        "backgroundImage": process.env.REACT_APP_SERVER_PATH+"/ew-front/popup/assets/default_popup_bg.jpeg",
        "backgroundPosition": "center",
        "backgroundRepeat": "no-repeat",
        "backgroundSize": "cover",
        "hasBackgroundImage": false,
        "imageBackgroundPosition": "center",
        "imageBackgroundRepeat": "no-repeat",
        "imageBackgroundSize": "cover",
        "imageHeightPercentAge": 100,
        "imageWidthPercentAge": 100,
        "NegativeButtonBorderColor": "#ffffff",
        "NegativeButtonFocusBorderColor": "#a8a8a8",
        "NegativeButtonFocusShadowColor": "#ffffff",
        "NegativeButtonHoverBorderColor": "#ffffff",
        "NegativeButtonHoverTextColor": "#ffffff",
        "NegativeButtonShadowColor": "#ffffff",
        "PositiveButtonFocusBorderColor": "#a8a8a8",
        "PositiveButtonFocusShadowColor": "#ffffff",
        "PositiveButtonShadowColor": "#ffffff",
        "firstTextFormBorderColor": "#ffffff",
        "firstTextFormFocusBorderColor": "#a8a8a8",
        "firstTextFormFocusShadowColor": "#ffffff",
        "firstTextFormShadowColor": "#ffffff",
        "secondTextFormBorderColor": "#ffffff",
        "secondTextFormFocusBorderColor": "#a8a8a8",
        "secondTextFormFocusShadowColor": "#ffffff",
        "secondTextFormShadowColor": "#ffffff",
        "thirdTextFormFocusBorderColor": "#a8a8a8",
        "popup_title": "Popup Template Girl In Pink",

        popup_thumbnail: popup_image_21,
        "title": "Here's a little gift!",
        "body": " Enter your email address and enjoy 20% OFF on your next order!",
        "bodyTextSize": "12",
        "footerTextSize": "12",
        "backgroundColor": "#fef8f8ff",
        "titleTextColor": "#000",
        "titleTextSize": "20",
        "firstTextFormFieldHint": "First name",
        "footer": "We promise not to spam",
        "image": process.env.REACT_APP_SERVER_PATH+"/storage/gallery/Yr7r8x247WQkKf70zY383aAKtGGXwArkaRAKbUr6.jpeg",
        "hideImage": false,
        "popup_id": "21",
        "borderWidth": "11",
        "borderRadius": "3",
        "borderColor": "#ffd6d6ff",
        "PositiveButtonBackgroundColor": "#000",
        "PositiveButtonTextColor": "#ffffff",
        "PositiveButtonText": "SUBSCRIBE",
        "PositiveButtonTextSize": "12",
        "PositiveButtonRadius": "0",
        "firstTextFormFieldTextSize": "12",
        "firstTextFormFieldTextColor": "#bfbfbf",
        "bodyTextColor": "#898788",
        "firstTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldBackgroundColor": "#ffffff",
        "secondTextFormFieldTextColor": "#bfbfbf",
        "secondTextFormFieldTextSize": "12",
        "thirdTextFormFieldBackgroundColor": "#ffffff",
        "thirdTextFormFieldTextColor": "#bfbfbf",
        "thirdTextFormFieldTextSize": "12",
        "thirdTextFormFieldHint": "Email",
        "secondTextFormFieldHint": "Last name",
        "footerTextColor": "#898788",
        "popup_height": "470",
        "popup_width": "750",
        "popup_position": "center",
        "creationMode": false,
        "aspect_ratio": false,
        "hideFirstTextFormField": true,
        "hideSecondTextFormField": true,
        "titleAlign": "left",
        "bodyAlign": "left",
        "footerAlign": "center",
        "hideBody": false,
        "hideFooter": true,
        "hideTitle": false,
        "PositiveButtonHoverBackgroundColor": "#000",
        "hidePositiveButton": false,
        "NegativeButtonText": "",
        "NegativeButtonTextColor": "",
        "NegativeButtonBackgroundColor": "",
        "NegativeButtonHoverBackgroundColor": "",
        "NegativeButtonTextSize": "",
        "NegativeButtonRadius": "",
        "hideNegativeButton": true,
        "hasImageUploadOption": true,
        "hasNegativeButtonOption": false,
        "emailFieldRequired": true,
        "hasForm": true,
        "PositiveButtonHoverTextColor": "#ffffff",
        "PositiveButtonHoverBorderColor": "#ffffff",
        "PositiveButtonBorderColor": "#ffffff",
        "thirdTextFormShadowColor": "#ffffff",
        "thirdTextFormBorderColor": "#ffffff",
        "thirdTextFormFocusShadowColor": "#ffffff",
        "formAlignment": "center"
    }

]
const list_sort_key = "ew_popup_list_sort";

function PopupList() {
    useEffect(() => {
        document.title = "Popups | Emailwish";
    }, []);
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iPopupListingResponse>, iListResponseActions<iPopupListingResponse>>>
    (listReducer<iListResource<iPopupListingResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 20, ...getSortOrder(list_sort_key)},
        loading: true,
    });

    const [popupSummaryState, dispatchPopupSummaryResponse] = useReducer<Reducer<iResource<iDashboardPopupSummaryResponse>,
        iResponseActions<iDashboardPopupSummaryResponse>>>
    (responseReducer<iResource<iDashboardPopupSummaryResponse>, any>({}), {loading: true});


    const isMounted = useIsMounted();
    const [setting, setSetting] = useState<iPopup | undefined>();
    const [showSetting, setShowSetting] = useState<boolean>(false);

    const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
    const [showDuplicateDialog, setShowDuplicateDialog] = useState<boolean>(false);
    const [showDuplicateDialogPopup, setShowDuplicateDialogPopup] = useState<iPopup>();
    const {popup_enabled} = useContext(AppStateContext);
    const notificationContext = useContext(NotificationContext);
    const location = useLocation<any>()
    useEffect(() => {
        if (location.state && location.state.open_import) {
            setExplorePopups(true)
        }
    }, [location.state])
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    const loadResource = useCallback(
        (source?: CancelTokenSource, silently?: boolean) => {
            if (!silently) {

                dispatchList(loading_action());
            }
            new PopupAPIs().listing(query, source).then((response) => {
                if (isMounted.current) {
                    if (PopupAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message))
                    } else {
                        dispatchList(success_action(response))
                    }
                }
            });
        },
        [isMounted, query]
    );
    const [showPreview, setShowPreview] = useState<boolean>(false);
    const [showPreviewPopup, setShowPreviewPopup] = useState<PopupProps>(default_popup_data);

    const history = useHistory();

    const {loggedInUser} = useContext(AppStateContext)
    const loadPopupResource = useCallback(
        (source?: CancelTokenSource, silently?: boolean) => {
            if (!silently) {
                dispatchPopupSummaryResponse(loading_action_response());
            }
            new PopupAPIs().popup_summary(source).then((response) => {
                if (isMounted.current) {
                    if (PopupAPIs.hasError(response, notificationContext)) {
                        dispatchPopupSummaryResponse(failed_action_response(response.message))
                    } else {
                        dispatchPopupSummaryResponse(success_action_response(response))
                    }
                }
            });
        },
        [isMounted,]
    );
    const [value, setValue] = React.useState(0);
    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            saveSortOrder(list_sort_key, query)
            loadResource(source);
        }
        return () => {
            source.cancel();
        };
    }, [query]);

    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            loadPopupResource(source);
        }
        return () => {
            source.cancel();
        };
    }, []);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };
    const handleTabChangeIndex = (index: number) => {
        setValue(index);
    };

    const modalContext = useContext(AppModalContext);

    const [selectedRow, setSelectedRow] = useState<iPopup[]>();

    function toDataUrl(url: string, callback: any) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    const columns = [
        {
            name: "Title",
            selector: "title",
            sortable: true,
            width: "180px",
            cell: (row: iPopup) => {
                return (
                    <div className="d-flex flex-column">
                        <Hidden mdDown>
                            <div className="m-1">
                                <Link to={`/popups/edit/${row.uid}`}>
                                    {
                                        row.thumbnail_full_url &&
                                        parseInt(row.height) > parseInt(row.width) &&
                                        <img src={row.thumbnail_full_url} style={{height: "100px", width: "auto"}}/>
                                    }
                                    {
                                        row.thumbnail_full_url &&
                                        parseInt(row.width) > parseInt(row.height) &&
                                        <img src={row.thumbnail_full_url} style={{width: "140px", height: "auto"}}/>
                                    }
                                </Link>
                            </div>
                        </Hidden>


                        <div className="d-flex flex-column mt-1">
                            <div>
                                <Link to={`/popups/edit/${row.uid}`}>

                                    <h6 className="u500 color1">{row.title}</h6>
                                </Link>
                            </div>


                        </div>

                    </div>
                );
            },
        },
        {
            name: "Impressions",
            selector: "impression_count"
        },
        {
            name: "Signups",
            cell: (row: iPopup) => {
                return (
                    <div>
                        <Link to={'/popups/logs?popup_ids=' + row.id}>
                            <p className={"color1 m-0 text-center"}>{row.responses_count}</p>
                            <span className="text-center">View</span>
                        </Link>
                    </div>
                );
            },
        },
        {
            name: "Signup Rate",
            cell: (row: iPopup) => {
                return (
                    <p className={"color1 m-0 text-center"}>{row.click_through_rate && row.click_through_rate.toFixed(2) || "0"}%</p>
                );
            },
        },
        {
            name: "Revenue",
            cell: (row: iPopup) => {
                return (
                    <p className={"color1 m-0 text-center"}>{currency + " " + (row && row.revenue && row.revenue.toFixed(2) || "0")}</p>
                );
            },
        },
        {
            name: "CR",
            cell: (row: iPopup) => {
                return (
                    <p className={"color1 m-0 text-center"}>{(row && row.conversion_rate && row.conversion_rate.toFixed(2) || "0")}%</p>
                );
            },
        },
        {
            name: "Created Date",
            selector: "created_at",
            sortable: true,
            cell: (row: iPopup) => {
                return <FormattedDate date_string={row.created_at}/>
            },
        },
        {
            name: "Status",
            cell: (row: iPopup) => {
                if (row.active && row.active_mobile) {
                    return <Badge variant="success">Active</Badge>
                }
                if (!row.active && row.active_mobile) {
                    return <Badge variant="success">Active in mobile</Badge>
                }
                if (row.active && !row.active_mobile) {
                    return <Badge variant="success">Active in Web</Badge>
                } else {
                    return <Badge variant="danger">Inactive</Badge>
                }
            },
        },
        ...(loggedInUser && loggedInUser.admin) ? [
            {
                name: "Available to public",
                selector: "default_for_new_customers",
                grow: 1,
                cell: (row: iPopup) => {
                    return row.default_for_new_customers ? <p>YES</p> : <p>NO</p>;
                },
            },
        ] : [],
        {
            name: "Actions",
            cell: (row: iPopup) => {
                return (
                    <Grid container>
                        <Grid item>
                            <IconButton aria-label="popup-settings" onClick={() => {
                                setSetting(row)
                                setShowSetting(true)
                            }}>
                                <SettingsIcon color={"secondary"}/>
                            </IconButton>
                        </Grid>
                        <Grid item>

                            <Link to={`/popups/edit/${row.uid}`}>
                                <IconButton aria-label="edit" onClick={() => {
                                }
                                }>
                                    <EditIcon color={"secondary"}/>
                                </IconButton>
                            </Link>

                        </Grid>
                        <Grid item>


                            <Dropdown>
                                <Dropdown.Toggle
                                    as={CustomToggle}
                                    id="dropdown-custom-components"
                                >
                                    <IconButton>
                                        <MoreHoriz color={"secondary"}/>
                                    </IconButton>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="position-fixed">
                                    <Dropdown.Item eventKey="1" key={1}
                                                   onClick={() => {
                                                       if (typeof row.data === "string") {
                                                           let popup_data = JSON.parse(row.data);
                                                           setShowPreviewPopup(popup_data);
                                                           setShowPreview(true)
                                                       }
                                                   }}
                                    >
                                        <div
                                            style={{display: "inline-flex", width: "100%"}}
                                        >
                                            <ListItemIcon
                                                style={{display: "flex", alignItems: "center"}}
                                            >
                                                <VisibilityIcon fontSize="small" color={"secondary"}/>
                                            </ListItemIcon>
                                            <ListItemText primary="Preview"/>
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="2" key={2}
                                                   onClick={() => {
                                                       modalContext.showActionModal &&
                                                       modalContext.showActionModal({
                                                               route: new PopupAPIs().getResourceDeletionURL(),
                                                               values: [
                                                                   {
                                                                       value: row.uid,
                                                                       label: ""
                                                                   }
                                                               ],
                                                               title: "",
                                                               body: "Do you really want to delete this popup?"
                                                           },
                                                           (reload) => {
                                                               if (reload) {
                                                                   loadResource();
                                                               }
                                                           })
                                                   }}
                                    >
                                        <div
                                            style={{display: "inline-flex", width: "100%"}}
                                        >
                                            <ListItemIcon
                                                style={{display: "flex", alignItems: "center"}}
                                            >
                                                <DeleteIcon fontSize="small" color={"secondary"}/>
                                            </ListItemIcon>
                                            <ListItemText primary="Delete"/>
                                        </div>
                                    </Dropdown.Item>
                                    <Dropdown.Item eventKey="3" key={3}
                                                   onClick={() => {
                                                       setShowDuplicateDialogPopup(row)
                                                       setShowDuplicateDialog(true);
                                                   }
                                                   }
                                    >
                                        <div
                                            style={{display: "inline-flex", width: "100%"}}
                                        >
                                            <ListItemIcon
                                                style={{display: "flex", alignItems: "center"}}
                                            >
                                                <FileCopyIcon fontSize="small" color={"secondary"}/>
                                            </ListItemIcon>
                                            <ListItemText primary="Make a Copy"/>
                                        </div>
                                    </Dropdown.Item>
                                    {
                                        loggedInUser && loggedInUser.admin && <Dropdown.Item
                                            eventKey="4"
                                            key={4}
                                            onClick={() => {
                                                if (row.default_for_new_customers) {
                                                    let confirm = window.confirm("Do you really want to hide this popup from public?");
                                                    if (confirm) {
                                                        new PopupAPIs().mark_available_to_public(row.uid, {default_for_new_customers: false}).then(response => {
                                                            let source = Axios.CancelToken.source();
                                                            if (isMounted.current) {
                                                                if (PopupAPIs.hasError(response, notificationContext)) {
                                                                } else {
                                                                    loadResource(source);
                                                                }
                                                            }
                                                        })
                                                    }
                                                } else {
                                                    let confirm = window.confirm("Do you really want to mark this popup available to public?");
                                                    if (confirm) {
                                                        new PopupAPIs().mark_available_to_public(row.uid, {default_for_new_customers: true}).then(response => {
                                                            let source = Axios.CancelToken.source();
                                                            if (isMounted.current) {
                                                                if (PopupAPIs.hasError(response, notificationContext)) {
                                                                } else {
                                                                    loadResource(source);
                                                                }
                                                            }
                                                        })
                                                    }
                                                }

                                            }}
                                        >
                                            {
                                                !row.default_for_new_customers && <div
                                                    style={{display: "inline-flex", width: "100%"}}

                                                >
                                                    <ListItemIcon
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Public color="secondary" onClick={() => {
                                                        }} name="Public " cursor={"pointer"}/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Mark Available to Public"
                                                    />
                                                </div>
                                            }
                                            {
                                                row.default_for_new_customers && <div
                                                    style={{display: "inline-flex", width: "100%"}}

                                                >
                                                    <ListItemIcon
                                                        style={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <Public color="error" onClick={() => {
                                                        }} name="Delete " cursor={"pointer"}/>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary="Hide From Public"
                                                    />
                                                </div>
                                            }
                                        </Dropdown.Item>
                                    }
                                </Dropdown.Menu>
                            </Dropdown>

                        </Grid>
                    </Grid>
                );
            },
        },
    ];
    const tour = useTour();
    const [showHelpVideo, setShowHelpVideo] = useState(false);

    const [explorePopups, setExplorePopups] = useState<boolean>(false);
    const {shop} = useContext(AppStateContext);
    const currency = getSymbolFromCurrency((shop && shop.primary_currency) || "USD") || "$";
    const popupSummary = popupSummaryState && popupSummaryState.response && popupSummaryState.response.popup_summary;
    return <Row className="popup-list">
        <Col md="12" className="mt-1 heading-col">
            <Row>
                <Col md={2} sm={12} className="d-flex align-items-center">
                    <div>
                        <div className="d-flex mt-3 ">
                            <h5 className="app-dark-color u500" style={{letterSpacing: "0.5px"}}>Popups </h5>

                        </div>
                        <div style={{width: "100%",}}>
                            <Form.Control type="text" style={{border: 0, boxShadow: 'var(--box-shadow-low)'}}
                                          placeholder="Type to search"
                                          className="search-box data-table-search"
                                          onChange={(e: any) => {
                                              dispatchList(search_action(e.target.value))
                                          }}
                            />
                        </div>

                    </div>
                </Col>
                <Col md className="mt-2">
                    <Row className="p-2">
                        {
                            [
                                {
                                    name: "Revenue From Popups",
                                    value: currency + " " + (popupSummary && popupSummary.sales_total && popupSummary.sales_total.toFixed(2) || "0"),
                                    background: "#fafae2",
                                    icon: <AiFillDollarCircle size={28}/>,
                                    change_24: (popupSummary && popupSummary.sales_total_change_last_24 && popupSummary.sales_total_change_last_24.toFixed(0)) || "0"
                                },
                                {
                                    name: "Total Impressions",
                                    value: popupSummary && popupSummary.impressions || "0",
                                    background: "#ebf5fc",
                                    icon: <TiEye size={28}/>,
                                    change_24: (popupSummary && popupSummary.impressions_change_last_24 && popupSummary.impressions_change_last_24.toFixed(0)) || "0"
                                },
                                {
                                    name: "Total Signups",
                                    value: popupSummary && popupSummary.responses || "0",
                                    background: "#f0fcf0",
                                    icon: <HiCursorClick size={28}/>,
                                    change_24: (popupSummary && popupSummary.responses_change_last_24 && popupSummary.responses_change_last_24.toFixed(0)) || "0"
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
                </Col>
                <Col md={"auto"} sm={12} className="d-flex justify-content-center flex-column">
                    <div className="d-flex justify-content-end mb-2">
                        {
                            (popup_enabled === undefined ?
                                <Spinner animation="border"/> : <FormControlLabel
                                    data-tut={'reactour__popup_enable_button'}
                                    value="start"
                                    control={<Switch color="primary"
                                                     checked={popup_enabled}
                                                     onChange={(e) => {
                                                         let value = e.target.checked;
                                                         dispatch({type: "popup_enabled", enabled: value})
                                                         new UserAPIs().popup_module_status(value).then((response) => {
                                                             if (isMounted.current) {
                                                                 if (UserAPIs.hasError(response, notificationContext)) {
                                                                     dispatch({type: "popup_enabled", enabled: !value})
                                                                 } else {
                                                                     dispatch({
                                                                         type: "popup_enabled",
                                                                         enabled: response.popup_module_enabled
                                                                     })
                                                                 }
                                                             }
                                                         })
                                                     }}/>}
                                    label='Enable Popup'
                                    labelPlacement="start"
                                />)
                        }
                    </div>
                    <div>
                        <Grid container spacing={1} justifyContent={"flex-end"} alignItems={"center"}>
                            <Grid item>
                                <a onClick={() => {
                                    setShowHelpVideo(true)
                                }} className="app-link">
                                    Learn How?
                                </a>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    type="button"
                                    className="app-button"
                                    onClick={() => {
                                        setExplorePopups(true);
                                    }}
                                >
                                    Import Popups
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    data-tut="reactour__popup_add_button"
                                    type="button"
                                    className="positive-button"
                                    onClick={() => {
                                        let index = _HomeConfig(history, tour).findIndex(value1 => value1.selector === '[data-tut="reactour__popup_add__dialog_1"]');

                                        tour.setCurrentStep(index)
                                        setShowAddDialog(true)
                                    }}
                                >
                                    <FaPlus/>
                                    &nbsp;Add New
                                </Button>
                            </Grid>
                        </Grid>
                    </div>
                </Col>
            </Row>
        </Col>
        <Modal
            show={explorePopups}
            onHide={() => {
                setExplorePopups(false);
            }}
            size="lg"
        >
            <Modal.Header closeButton style={{background: "white", border: "none"}}>
                <Modal.Title className="text-center w-100">
                    Import Popups
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>


                <ExplorePopups onRefresh={() => {
                    loadResource()
                }}/>
            </Modal.Body>
        </Modal>
        <Col md={12} style={{marginTop: "-16px"}}>
            <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                       helpLink={"https://www.youtube.com/embed/sLsDp4S96P8"}/>
            <CustomDataTable
                //help_link={"https://www.youtube.com/watch?v=j3LHGPk9lDQ&t"}
                selectableRows
                onSelectedRowsChange={(e) => {
                    setSelectedRow(e.selectedRows);
                }}
                columns={columns}
                progressPending={loading}
                progressComponent={<AppLoader/>}
                data={(resource && resource.items?.data) || []}
                sortServer
                onSort={(column, sortDirection) => {
                    if (typeof column.selector === "string")
                        dispatchList(onSortAction(column.selector, sortDirection))
                }}
                noHeader

                actionButtons={[]}
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
                            There are no Popups.<br/>
                            <span onClick={() => {
                                setShowAddDialog(true)
                            }}>
                                <Alert.Link>Click here</Alert.Link>
                            </span>{" "}
                            to create one.
                        </Alert>
                    )
                }
                multiActionButton={
                    (selectedRow && selectedRow.length > 0) && [<Button
                        variant="contained"
                        color="secondary"
                        type="button"
                        onClick={() => {
                            modalContext.showActionModal &&
                            modalContext.showActionModal({
                                    route: new PopupAPIs().getResourceDeletionURL(),
                                    values: (selectedRow && selectedRow.map(e => {
                                        return {
                                            value: e.uid || "",
                                            label: ""
                                        }
                                    })) || [],
                                    title: "",
                                    body: "Do you really want to delete these popups?"
                                },
                                (reload) => {
                                    if (reload) {
                                        setSelectedRow([])
                                        loadResource();
                                    }
                                })
                        }}
                    >
                        <FaTrash/>
                        &nbsp;Delete&nbsp;{selectedRow.length}
                    </Button>] || []
                }
                pagination
                paginationTotalRows={resource && resource.items && resource.items.total}
                paginationPerPage={query.per_page}
                onChangeRowsPerPage={(per_page) => {

                    dispatchList(per_page_row_change_action(per_page))
                }}
                paginationServer
                onChangePage={(page) => {

                    dispatchList(current_page_change_action(page))
                }}

                noSearchFilter
                customStyles={customStyles}
                defaultSortAsc={query.sort_direction === "asc"}
                defaultSortField={query.sort_order}
            />
        </Col>
        <Modal show={showSetting} onHide={() => {
            setSetting(undefined)
            setShowSetting(false);
        }}>
            {
                //@ts-ignore
                <Modal.Header closeButton>
                    <Modal.Title>Manage Popup</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                <Formik
                    initialValues={{
                        active: (setting && setting.active) || false,
                        active_mobile: (setting && setting.active_mobile) || false,
                        behaviour: (setting && setting.behaviour) || "",
                        triggers: (setting && setting.triggers && setting.triggers.length > 0 && setting.triggers) || [
                            {
                                type: "",
                                delay_seconds: 5
                            }
                        ]
                    }}
                    validateOnChange={false}
                    onSubmit={async (values: any, helpers) => {
                        if (setting) {
                            helpers.setSubmitting(true);
                            new PopupAPIs().popup_setting(setting.uid, values).then(value => {
                                if (isMounted.current) {
                                    if (PopupAPIs.hasError(value, notificationContext)) {
                                        helpers.setSubmitting(false);
                                    } else {
                                        setSetting(undefined)
                                        setShowSetting(false);
                                        let source = Axios.CancelToken.source();
                                        loadResource(source)
                                    }
                                }
                            })
                        }

                    }}
                    validationSchema={yup.object({
                        active: yup.string(),
                        active_mobile: yup.string(),
                        behaviour: yup.string(),
                        triggers: yup.array(yup.object({
                            type: yup.string().required("Please select type"),
                            delay_seconds: yup.string().required("Please select delay"),
                        })),
                    })}
                >{({
                       handleSubmit,
                       handleBlur,
                       values,
                       touched,
                       errors,
                       isSubmitting,
                       setFieldValue,
                       handleChange
                   }: any) => {
                    return <form onSubmit={handleSubmit}>


                        <Typography>
                            You need to configure an <a href="/email/automations" target="_blank">automation</a> to
                            handle popup submissions emails.
                        </Typography>
                        <div className="mt-2">
                            <FormControlLabel
                                control={<Switch checked={values.active} onChange={((event, checked) => {
                                    setFieldValue("active", checked)
                                })} name="active"/>}
                                label="Active in Web"
                            />
                            <FormControlLabel
                                control={<Switch checked={values.active_mobile} onChange={((event, checked) => {
                                    setFieldValue("active_mobile", checked)
                                })} name="active_mobile"/>}
                                label="Active in Mobile"
                            />

                            <Form.Group>
                                <Form.Label>Behaviour *</Form.Label>
                                <Form.Control
                                    type={"text"}
                                    name={`behaviour`}
                                    as={"select"}
                                    value={values.behaviour}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    isInvalid={(touched &&
                                        touched.behaviour && !!(
                                            errors &&
                                            errors.behaviour
                                        )
                                    )}
                                >
                                    <option value={""} disabled>Select Behaviour</option>
                                    <option value={"once"}>Show once</option>
                                    <option value={"till_submission"}
                                    >Show till submission
                                    </option>
                                </Form.Control>
                                <Form.Control.Feedback type="invalid">
                                    {errors &&
                                    errors.behaviour}
                                </Form.Control.Feedback>
                            </Form.Group>


                            <h6>Triggers</h6>
                            <FieldArray name="triggers">
                                {
                                    (triggers_props => {
                                        return <div>
                                            {values.triggers && values.triggers.length > 0 &&
                                            values.triggers.map((_trigger: any, index: number) => {
                                                return <div key={index.toString() + values.triggers.length.toString()}
                                                            className="mb-2 edit-trigger">
                                                    <p>Trigger {index + 1}</p>
                                                    <Row>
                                                        <Form.Group as={Col}>
                                                            <Form.Label>When to trigger *</Form.Label>
                                                            <Form.Control
                                                                type={"text"}
                                                                name={`triggers[${index}].type`}
                                                                as="select"
                                                                value={_trigger.type}
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                isInvalid={(touched &&
                                                                    touched.triggers &&
                                                                    touched.triggers.length > index &&
                                                                    touched.triggers[index] &&
                                                                    touched.triggers[index].type && !!(
                                                                        errors &&
                                                                        errors.triggers &&
                                                                        errors.triggers.length > index &&
                                                                        errors.triggers[index] &&
                                                                        errors.triggers[index].type
                                                                    )
                                                                )}
                                                            >
                                                                <option value={""} disabled>Select trigger type</option>
                                                                {
                                                                    popupTrigger.map((option: any) => {
                                                                        return <option value={option.id}
                                                                                       key={option.id}>{option.name}</option>
                                                                    })
                                                                }
                                                            </Form.Control>
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors &&
                                                                errors.triggers &&
                                                                errors.triggers.length > index &&
                                                                errors.triggers[index] &&
                                                                errors.triggers[index].type}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        {
                                                            _trigger.type !== "leaving" && <Form.Group as={Col}>
                                                                <Form.Label>
                                                                    Delay *
                                                                </Form.Label>
                                                                <Slider
                                                                    value={_trigger.delay_seconds}
                                                                    getAriaValueText={(value, index) => {
                                                                        return value.toString() + " seconds"
                                                                    }}
                                                                    onChange={(event, value) => {
                                                                        setFieldValue(`triggers[${index}].delay_seconds`, value)
                                                                    }}
                                                                    aria-labelledby="discrete-slider"
                                                                    valueLabelDisplay="auto"
                                                                    step={1}
                                                                    marks
                                                                    min={0}
                                                                    max={10}
                                                                />
                                                            </Form.Group>
                                                        }
                                                    </Row>
                                                    {values.triggers.length > 1 &&
                                                    <div className="d-flex justify-content-end">
                                                        <Button className="" variant="text" color="inherit"
                                                                onClick={() => {
                                                                    triggers_props.remove(index)
                                                                }}>
                                                            Remove Trigger&nbsp;<FaMinus/>
                                                        </Button>
                                                    </div>
                                                    }

                                                </div>
                                            })}
                                            <Button variant="contained" color="primary" onClick={() => {
                                                triggers_props.push({
                                                    type: "",
                                                    delay_seconds: 5
                                                })
                                            }}>
                                                Add Trigger&nbsp;<FaPlus/>
                                            </Button>

                                        </div>
                                    })
                                }
                            </FieldArray>

                        </div>

                        <div className="float-right">
                            <Button color="secondary" onClick={() => {
                                setSetting(undefined)
                                setShowSetting(false);
                            }}>
                                Close
                            </Button>
                            <Button color="primary" type="submit">
                                {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}Save
                            </Button>
                        </div>
                    </form>
                }}
                </Formik>
            </Modal.Body>
        </Modal>

        <Modal show={showAddDialog} size="xl"
               aria-labelledby="contained-modal-title-vcenter"
               centered

               onHide={() => {
                   setShowAddDialog(false)
               }}>
            {
                //@ts-ignore
                <Modal.Header closeButton>
                    <h4>Create new Popup</h4>
                </Modal.Header>
            }
            <Modal.Body>
                <div className="mt-2">
                    <Row>
                        <Col sm={12}>
                            <div className="mt-2">
                                {error ? <Alert variant="danger">{error}</Alert> : null}
                                <Formik
                                    initialValues={{
                                        title: "",
                                        data: "",
                                        width: "",
                                        height: "",
                                        type: "",
                                        popup_position: "center"
                                    }}
                                    onSubmit={(values: any, formikHelpers) => {
                                        new PopupAPIs()
                                            .create(values)
                                            .then((response: any) => {
                                                if (isMounted.current) {
                                                    formikHelpers.setSubmitting(false)
                                                    if (EmailAutomationAPIs.hasError(response, notificationContext) || !response.uid) {
                                                        if (!HandleErrors(response, formikHelpers)) {

                                                        }
                                                    } else {
                                                        history.push("/popups/edit/" + response.uid)
                                                    }
                                                }

                                            });
                                    }}
                                    validationSchema={yup.object({
                                        title: yup.string().required("Please enter popup title"),
                                        data: yup.string(),
                                        width: yup.string(),
                                        height: yup.string(),
                                        type: yup.string().required("Please choose one template or layout"),
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
                                        let templates = [...popups_templates]
                                        templates.reverse();

                                        return (
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Group data-tut="reactour__popup_add__dialog_title">
                                                    <Form.Label className="text-box-label">
                                                        Popup Title
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter popup title"
                                                        name="title"
                                                        style={{
                                                            border: 0,
                                                            boxShadow: "var(--box-shadow-low)",
                                                        }}
                                                        value={values.name}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.title &&
                                                            errors &&
                                                            !!errors.title
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors && errors.title}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                                <Tabs
                                                    value={value}
                                                    onChange={handleTabChange}
                                                    indicatorColor="primary"
                                                    textColor="secondary"
                                                    aria-label="full width tabs example"
                                                    variant="scrollable"
                                                >
                                                    <Tab label="Templates"  {...a11yProps(0)}/>
                                                    <Tab label="Layouts"  {...a11yProps(1)}/>
                                                </Tabs>
                                                <SwipeableViews
                                                    axis='x'
                                                    index={value}
                                                    onChangeIndex={handleTabChangeIndex}
                                                >
                                                    <TabPanel value={value} index={0} dir="ltr">
                                                        <Form.Group>
                                                            <Form.Label className="text-box-label">
                                                                Please choose a template
                                                            </Form.Label>
                                                            <Scrollbar style={{height: "450px"}}>

                                                                <div className="p-2">

                                                                    <Grid container direction="row" spacing={2}
                                                                          justifyContent="flex-start"
                                                                          alignItems="flex-start"
                                                                          className="popup-template-chooser">

                                                                        {
                                                                            templates && templates.map((popup, index) => {
                                                                                return <Grid item md={6} key={index}>
                                                                                    <PopupCreateCard
                                                                                        setFieldValue={setFieldValue}
                                                                                        popup={popup}
                                                                                        selected_popup_id={values.type}/>
                                                                                </Grid>
                                                                            })}

                                                                    </Grid>
                                                                </div>
                                                            </Scrollbar>
                                                            <Form.Control
                                                                type="text"
                                                                name="templates"
                                                                hidden
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.type &&
                                                                    errors &&
                                                                    !!errors.type
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.type}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </TabPanel>
                                                    <TabPanel value={value} index={1} dir="ltr">
                                                        <Form.Group>
                                                            <Form.Label className="text-box-label">
                                                                Please choose a layout
                                                            </Form.Label>
                                                            <Scrollbar removeTrackYWhenNotUsed permanentTrackY={true}
                                                                       style={{height: "450px"}}>


                                                                <div className="p-2">
                                                                    <Grid container direction="row" spacing={2}
                                                                          justifyContent="flex-start"
                                                                          alignItems="flex-start"
                                                                          className="popup-template-chooser">

                                                                        <Grid item container direction="column" md={6}>
                                                                            {
                                                                                popups_layouts && popups_layouts.length >= 1 &&
                                                                                <Grid item>
                                                                                    <PopupCreateCard
                                                                                        setFieldValue={setFieldValue}
                                                                                        popup={popups_layouts[0]}
                                                                                        selected_popup_id={values.type}/>
                                                                                </Grid>
                                                                            }
                                                                            {
                                                                                popups_layouts && popups_layouts.length >= 2 &&
                                                                                <Grid item>

                                                                                    <PopupCreateCard
                                                                                        setFieldValue={setFieldValue}
                                                                                        popup={popups_layouts[1]}
                                                                                        selected_popup_id={values.type}/>
                                                                                </Grid>
                                                                            }
                                                                            {
                                                                                popups_layouts && popups_layouts.length >= 3 &&
                                                                                <Grid item>

                                                                                    <PopupCreateCard
                                                                                        setFieldValue={setFieldValue}
                                                                                        popup={popups_layouts[2]}
                                                                                        selected_popup_id={values.type}/>
                                                                                </Grid>
                                                                            }
                                                                        </Grid>

                                                                        {
                                                                            popups_layouts && popups_layouts.length >= 4 &&
                                                                            <Grid item md={6}>
                                                                                <PopupCreateCard
                                                                                    setFieldValue={setFieldValue}
                                                                                    popup={popups_layouts[3]}
                                                                                    selected_popup_id={values.type}/>
                                                                            </Grid>
                                                                        }


                                                                    </Grid>
                                                                </div>
                                                            </Scrollbar>
                                                            <Form.Control
                                                                type="text"
                                                                name="templates"
                                                                hidden
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.type &&
                                                                    errors &&
                                                                    !!errors.type
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.type}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </TabPanel>
                                                </SwipeableViews>


                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="positive-button"
                                                >
                                                    {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}
                                                    Save
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outlined" color="secondary"
                                                    className="ml-2"
                                                    onClick={() => {
                                                        setShowAddDialog(false);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
        </Modal>

        <Modal show={showDuplicateDialog} size="lg"
               aria-labelledby="contained-modal-title-vcenter"
               centered
               onHide={() => {
                   setShowDuplicateDialog(false)
               }}>
            {
                //@ts-ignore
                <Modal.Header closeButton>
                    <h4>Make a copy</h4>
                </Modal.Header>
            }
            <Modal.Body>
                <div className="mt-2">
                    <Row>
                        <Col sm={12}>
                            <div className="mt-2">
                                {error ? <Alert variant="danger">{error}</Alert> : null}
                                <Formik<any>
                                    key={showDuplicateDialogPopup && showDuplicateDialogPopup.uid}
                                    initialValues={{
                                        ...showDuplicateDialogPopup,
                                        title: "Copy of " + showDuplicateDialogPopup?.title
                                    }}
                                    onSubmit={(values: any, formikHelpers) => {
                                        toDataUrl(values.thumbnail_full_url, function (myBase64: string) {
                                            values["thumbnail_file"] = myBase64
                                            new PopupAPIs()
                                                .create(values)
                                                .then((response: any) => {
                                                    if (isMounted.current) {
                                                        formikHelpers.setSubmitting(false)
                                                        if (EmailAutomationAPIs.hasError(response, notificationContext) || !response.uid) {
                                                            if (!HandleErrors(response, formikHelpers)) {

                                                            }
                                                        } else {
                                                            loadResource();
                                                            setShowDuplicateDialog(false);
                                                        }
                                                    }

                                                });
                                        });

                                    }}
                                    validationSchema={yup.object({
                                        title: yup.string().required("Please enter popup title"),
                                        data: yup.string(),
                                        width: yup.string(),
                                        height: yup.string(),
                                        type: yup.string().required("Please choose one template or layout"),
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
                                                <Form.Group>
                                                    <Form.Label className="text-box-label">
                                                        Popup Title
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Enter popup title"
                                                        name="title"
                                                        style={{
                                                            border: 0,
                                                            boxShadow: "var(--box-shadow-low)",
                                                        }}
                                                        value={values.title}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.title &&
                                                            errors &&
                                                            !!errors.title
                                                        }
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors && errors.title}
                                                    </Form.Control.Feedback>
                                                </Form.Group>

                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="positive-button"
                                                >
                                                    {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}
                                                    Save
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outlined" color="secondary"
                                                    className="ml-2"
                                                    onClick={() => {
                                                        setShowDuplicateDialog(false);
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Modal.Body>
        </Modal>

        <ThemeProvider theme={theme}>
            {
                showPreview && <div className="popup-overlay"
                                    style={{
                                        justifyContent:
                                            (
                                                showPreviewPopup.popup_position === "center" ||
                                                showPreviewPopup.popup_position === "top-middle" ||
                                                showPreviewPopup.popup_position === "bottom-middle"
                                            ) ? "center" :
                                                (
                                                    showPreviewPopup.popup_position === "top-left" ||
                                                    showPreviewPopup.popup_position === "middle-left" ||
                                                    showPreviewPopup.popup_position === "bottom-left"
                                                ) ? "flex-start" : (
                                                    showPreviewPopup.popup_position === "top-right" ||
                                                    showPreviewPopup.popup_position === "middle-right" ||
                                                    showPreviewPopup.popup_position === "bottom-right"
                                                ) ? "flex-end" : "center",
                                        alignItems: (
                                            showPreviewPopup.popup_position === "top-left" ||
                                            showPreviewPopup.popup_position === "top-middle" ||
                                            showPreviewPopup.popup_position === "top-right"
                                        ) ? "flex-start" :
                                            (
                                                showPreviewPopup.popup_position === "middle-left" ||
                                                showPreviewPopup.popup_position === "center" ||
                                                showPreviewPopup.popup_position === "middle-right"
                                            ) ? "center" : (
                                                showPreviewPopup.popup_position === "bottom-right" ||
                                                showPreviewPopup.popup_position === "bottom-middle" ||
                                                showPreviewPopup.popup_position === "bottom-left"
                                            ) ? "flex-end" : "center"
                                    }}

                >
                    <div className="popup-wrapper">
                        <WindowSize>
                            {(size) => {
                                return <div><PopupContext.Provider value={{isMobile: size.width < 800}}>
                                    <PopupPreview {...showPreviewPopup}/>
                                </PopupContext.Provider></div>
                            }}
                        </WindowSize>

                        <button className="popup-close-btn" onClick={() => {
                            let popup1 = showPreviewPopup;
                            if (popup1 !== null) {
                                popup1.creationMode = true;
                                setShowPreviewPopup(popup1);
                            }
                            setShowPreview(false)
                        }}> ✕
                        </button>
                    </div>
                </div>
            }
        </ThemeProvider>
    </Row>;
}

export default PopupList;

function ExplorePopups({onRefresh}: { onRefresh: any }) {
    const [{
        error, resource, loading, query
    }, dispatchList] = useReducer<Reducer<iListResource<iExplorePublicPopups>, iListResponseActions<iExplorePublicPopups>>>
    (listReducer<iListResource<iExplorePublicPopups>, any>({}), {
        query: {sort_order: "id", sort_direction: "desc", per_page: 20, ...getSortOrder(list_sort_key)},
        loading: true,
    });

    const notificationContext = useContext(NotificationContext);
    const isMounted = useIsMounted();
    const loadResource = useCallback((source?: CancelTokenSource) => {
            new PopupAPIs().popups_imported().then()
            dispatchList(loading_action())
            new PopupAPIs().load_public_popups(query, source).then((response) => {
                if (isMounted.current) {
                    if (PopupAPIs.hasError(response, notificationContext)) {
                        dispatchList(failed_action(response.message))
                    } else {

                        dispatchList(success_action(response))
                    }
                }
            });
        },
        [isMounted, query,]);

    useEffect(() => {
        let source = Axios.CancelToken.source();
        if (isMounted.current) {
            loadResource(source);
        }
        return () => {
            source.cancel();
        };
    }, [query]);

    const location = useLocation<any>();

    const public_popups = resource && resource.public_popups;
    const [importing, setImporting] = useState("");
    const [imported, setImported] = useState<string[]>([]);
    const columns: IDataTableColumn[] = [
        {
            name: "Title",
            selector: "title",
            width: "180px",
            cell: (row: iPopup) => {
                return (
                    <div className="d-flex flex-column">
                        <Hidden mdDown>
                            <div className="m-1">
                                <Link to={`/popups/edit/${row.uid}`}>
                                    {
                                        row.thumbnail_full_url &&
                                        parseInt(row.height) > parseInt(row.width) &&
                                        <img alt={row.title} src={row.thumbnail_full_url}
                                             style={{height: "100px", width: "auto"}}/>
                                    }
                                    {
                                        row.thumbnail_full_url &&
                                        parseInt(row.width) > parseInt(row.height) &&
                                        <img alt={row.title} src={row.thumbnail_full_url}
                                             style={{width: "140px", height: "auto"}}/>
                                    }
                                </Link>
                            </div>
                        </Hidden>


                        <div className="d-flex flex-column mt-1">
                            <div>
                                <h6 className="u500 color1">{row.title}</h6>
                            </div>


                        </div>

                    </div>
                );
            },
        },
        {
            name: "Date Modified",
            selector: "updated_at",
            grow: 1,
            center: true,
            cell: (row: iPopup) => {
                return (
                    <div className="u400">
                        <FormattedDate date_string={row.updated_at} format="DD/MM/YYY"/>
                    </div>
                );
            },
        },
        {
            name: "Action",
            selector: "action",
            right: true,
            cell: (row: iPopup) => {
                return (
                    <div>
                        {
                            imported.includes(row.uid) && <div>
                                Imported
                            </div>
                        }
                        {
                            !imported.includes(row.uid) && <Button variant={"contained"}
                                                                   type={"submit"}
                                                                   className="positive-button"
                                                                   disabled={!!importing}
                                                                   color={"primary"} onClick={() => {
                                copyResources(row.uid, row.title)
                            }}>
                                {importing === row.uid && (
                                    <>
                                        <Spinner animation="border" size="sm"/>
                                        &nbsp;
                                    </>
                                )}
                                <div className="d-flex align-items-center">
                                    <HiDownload size="16"/>&nbsp;<span style={{marginTop: "2px"}}>Import</span>
                                </div>

                            </Button>
                        }
                    </div>
                );
            },
        },

    ];

    const copyResources = (uid: string, copy_name: string) => {
        setImporting(uid)
        new PopupAPIs().copy_popup(uid, copy_name).then((response) => {
            if (isMounted.current) {
                setImporting("")
                if (PopupAPIs.hasError(response, notificationContext)) {
                } else {
                    notificationContext.pushSuccessNotification("Successfully imported " + copy_name + " popup")
                    onRefresh();
                    setImported(prevState => [
                        ...prevState,
                        uid
                    ])
                }
            }
        });
    };
    return <div>
        <div className="d-flex justify-content-center">
            <img src={import_automations} style={{width: "350px"}}/>
        </div>

        <CustomDataTable
            columns={columns}
            progressPending={loading}
            progressComponent={<AppLoader/>}
            data={(public_popups && public_popups.data) || []}
            sortServer
            onSort={(column, sortDirection) => {
                if (typeof column.selector === "string")
                    dispatchList(onSortAction(column.selector, sortDirection))
            }}
            noSearchFilter
            customStyles={customStyles}
            noHeader
            actionButtons={[]}
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
                        There are no public popups.
                    </Alert>
                )
            }

            pagination
            paginationTotalRows={public_popups && public_popups.total}
            paginationPerPage={query.per_page}
            onChangeRowsPerPage={(per_page) => {
                dispatchList(per_page_row_change_action(per_page))
            }}
            paginationServer
            onChangePage={(page) => {
                dispatchList(current_page_change_action(page))
            }}
            defaultSortAsc={query.sort_direction === "asc"}
            defaultSortField={query.sort_order}
        />
        <Alert variant="info" style={{
            background: "#e4f4e3",
            color: "#2e7408",
            marginTop: "8px",
            borderRadius: "4px",
            paddingBlock: "20px",
            borderColor: "#e4f4e3"
        }}>
            <AiOutlineInfoCircle/> These Popups will be imported from Emailwish to your account.No Previous data
            will be overwritten.
        </Alert>
    </div>
}
