import React from "react";
import {iSideBarNavigation} from "../types/props";
import {Dashboard, ImportExport, RateReview, Settings} from "@material-ui/icons";
import ShopTwoIcon from '@material-ui/icons/ShopTwo';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import FilterListIcon from '@material-ui/icons/FilterList';
import DomainIcon from '@material-ui/icons/Domain';
import ChatIcon from '@material-ui/icons/Chat';
import ImportantDevicesIcon from '@material-ui/icons/ImportantDevices';

export const getMenuNameFromPath = (path: string, at_index: number) => {
    let name = path.split("/");
    if (at_index < name.length) {
        return name[at_index];
    }
    return "";
};


export function HideBetterDoc() {
    let ele = document.getElementById("betterdocs-ia");
    if (ele) {
        ele.style.display = "none";
    }
}

export function ShowEWChat() {
    let EW_bot = document.getElementById("ew-widgets");
    if (EW_bot) {
        EW_bot.setAttribute("data-client-id", process.env.REACT_APP_TALK_TO_AGENT_KEY || "");
    }
    let myScript = document.createElement("script");
    myScript.setAttribute("src",
        process.env.REACT_APP_WIDGET_ADDRESS +
        "/embed.emailwish.js?v=0.3&client-id=" + process.env.REACT_APP_TALK_TO_AGENT_KEY + "&shop=ankit-dev.myshopify.com");
    document.body.appendChild(myScript);

}

export function hideChat() {
    let EW_bot = document.getElementById("ew-widgets");
    if (EW_bot) {
        EW_bot.remove();
    }

}

export function HideChatWithEmailwish() {
    let ele = document.getElementsByClassName("ew-widgets");
    if (ele) {
        for (let i = 0; i < ele.length; i++) {
            let a = ele[i] as HTMLElement;
            a.style.display = "none";
        }

    }
}

export function ShowChatWithEmailwish() {
    let ele = document.getElementsByClassName("ew-widgets");
    if (ele) {
        for (let i = 0; i < ele.length; i++) {
            let a = ele[i] as HTMLElement;
            a.style.display = "block";
        }

    }
}

export function ShowBetterDoc() {
    let ele = document.getElementById("betterdocs-ia");
    if (ele) {
        ele.style.display = "unset";
    }
}

export const isSubMenuActive = (path: string, link: string) => {
    let current_path = path.split("/");
    let temp_path = link.split("/");
    current_path = current_path.filter(function (el) {
        return el.length > 0;
    });
    temp_path = temp_path.filter(function (el) {
        return el.length > 0;
    });
    if (current_path.length >= 2 && temp_path.length >= 2) {
        return current_path[1] === temp_path[1];
    } else if (current_path.length === 1 && temp_path.length === 1) {
        return current_path[0] === temp_path[0];
    }
    return false;
};
const dashboard_icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <path id="Icon_material-dashboard"
          d="M4.5,13.389h7.111V4.5H4.5Zm0,7.111h7.111V15.167H4.5Zm8.889,0H20.5V11.611H13.389Zm0-16V9.833H20.5V4.5Z"
          transform="translate(-4.5 -4.5)" fill="#6500ff" className="svg-icon"/>
</svg>;
const brand_icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <g id="my-business" transform="translate(0 -30)">
        <path id="Path_1"
              data-name="Path 1"
              fill="#6500ff"
              className="svg-icon"
              d="M13.989,30H2.011L0,36.521v.621a2.793,2.793,0,0,0,.938,2.127V46H15.063V39.268A2.793,2.793,0,0,0,16,37.142v-.621Zm.882,6.08H12.16l-.774-5.018h1.938ZM.938,37.142H3.766a1.518,1.518,0,0,1-1.414,1.6A1.518,1.518,0,0,1,.938,37.142Zm6.594,0a1.518,1.518,0,0,1-1.414,1.6,1.518,1.518,0,0,1-1.414-1.6ZM4.792,36.08l.774-5.018H7.531V36.08Zm3.677,0V31.062h1.965l.774,5.018ZM11.3,37.142a1.518,1.518,0,0,1-1.414,1.6,1.518,1.518,0,0,1-1.414-1.6Zm-8.62-6.08H4.614L3.84,36.08H1.129ZM14.125,44.938H1.875V39.75a2.088,2.088,0,0,0,.477.055,2.272,2.272,0,0,0,1.883-1.07,2.272,2.272,0,0,0,1.883,1.07A2.272,2.272,0,0,0,8,38.736a2.192,2.192,0,0,0,3.766,0,2.272,2.272,0,0,0,1.883,1.07,2.088,2.088,0,0,0,.477-.055Zm-.477-6.195a1.518,1.518,0,0,1-1.414-1.6h2.828A1.518,1.518,0,0,1,13.648,38.743Z"/>
    </g>
</svg>;

const report_icon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16">
    <path id="Icon_awesome-file-alt"
          d="M7,4.25V0H.75A.748.748,0,0,0,0,.75v14.5A.748.748,0,0,0,.75,16h10.5a.748.748,0,0,0,.75-.75V5H7.75A.752.752,0,0,1,7,4.25Zm2,7.375A.376.376,0,0,1,8.625,12H3.375A.376.376,0,0,1,3,11.625v-.25A.376.376,0,0,1,3.375,11h5.25A.376.376,0,0,1,9,11.375Zm0-2A.376.376,0,0,1,8.625,10H3.375A.376.376,0,0,1,3,9.625v-.25A.376.376,0,0,1,3.375,9h5.25A.376.376,0,0,1,9,9.375Zm0-2.25v.25A.376.376,0,0,1,8.625,8H3.375A.376.376,0,0,1,3,7.625v-.25A.376.376,0,0,1,3.375,7h5.25A.376.376,0,0,1,9,7.375Zm3-3.566V4H8V0h.191a.749.749,0,0,1,.531.219l3.059,3.063A.748.748,0,0,1,12,3.809Z"
          fill="#000000" className="svg-icon"/>
</svg>;
const agents_icon = <svg xmlns="http://www.w3.org/2000/svg" width="13.714" height="12.19" viewBox="0 0 13.714 12.19">
    <path id="Icon_metro-users"
          d="M10.286,11.46v-.628A3.4,3.4,0,0,0,11.81,8c0-1.894,0-3.429-2.286-3.429S7.238,6.106,7.238,8a3.4,3.4,0,0,0,1.524,2.831v.628c-2.585.211-4.571,1.481-4.571,3.017H14.857c0-1.535-1.987-2.805-4.571-3.017Zm-5.248.294A7.239,7.239,0,0,1,7.416,10.8a4.3,4.3,0,0,1-.482-.7A4.363,4.363,0,0,1,6.381,8a6.765,6.765,0,0,1,.364-2.783,2.481,2.481,0,0,1,1.9-1.422c-.2-.91-.737-1.509-2.165-1.509C4.19,2.286,4.19,3.821,4.19,5.714A3.4,3.4,0,0,0,5.714,8.546v.628c-2.585.211-4.571,1.481-4.571,3.017H4.464a4.88,4.88,0,0,1,.574-.437Z"
          transform="translate(-1.143 -2.286)" fill="#000000" className="svg-icon"/>
</svg>;
const help_icon = <svg xmlns="http://www.w3.org/2000/svg" width="13.333" height="13.333" viewBox="0 0 13.333 13.333">
    <path id="Icon_material-help"
          d="M8,1.333A6.667,6.667,0,1,0,14.667,8,6.669,6.669,0,0,0,8,1.333Zm.667,11.333H7.333V11.333H8.667ZM10.047,7.5l-.6.613A2.27,2.27,0,0,0,8.667,10H7.333V9.667a2.683,2.683,0,0,1,.78-1.887l.827-.84A1.3,1.3,0,0,0,9.333,6,1.333,1.333,0,1,0,6.667,6H5.333a2.667,2.667,0,1,1,5.333,0,2.121,2.121,0,0,1-.62,1.5Z"
          transform="translate(-1.333 -1.333)" fill="#000000" className="svg-icon"/>
</svg>;
const email_canned_icon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
    <g id="chat" transform="translate(0 -16.996)">
        <path id="Path_1"
              d="M9.111,19.867A4.771,4.771,0,0,0,4.813,17,4.982,4.982,0,0,0,0,22.121a5.373,5.373,0,0,0,.458,2.191l-.45,2.409a.426.426,0,0,0,.482.517l2.277-.482a4.513,4.513,0,0,0,.95.356,5.921,5.921,0,0,1,5.394-7.245Z"
              transform="translate(0)"/>
        <path id="Path_2"
              d="M170.634,152.318a5.324,5.324,0,0,0,.205-.542h-.015a5.107,5.107,0,0,0-4.308-6.767h0a5.129,5.129,0,0,0-.23,10.245,4.473,4.473,0,0,0,2.039-.49c2.494.528,2.3.491,2.357.491a.432.432,0,0,0,.4-.525Z"
              transform="translate(-157.092 -124.257)"/>
    </g>
</svg>;
const email_department_icon = <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
        <g id="department" transform="translate(0)">
            <path id="Path_3"
                  d="M184.249,346h-2.685a.712.712,0,0,0-.712.711v3.828h4.11v-3.828A.712.712,0,0,0,184.249,346Zm0,0"
                  transform="translate(-175.907 -336.539)"/>
            <path id="Path_4"
                  d="M363.805,392h-1.873a.716.716,0,0,0-.719.711c0,2.28,0,2.143,0,2.176v.395h3.313v-2.57A.716.716,0,0,0,363.805,392Zm0,0"
                  transform="translate(-351.335 -381.281)"/>
            <path id="Path_5"
                  d="M14,3.309V1.5A1.506,1.506,0,0,0,12.5,0H1.5A1.506,1.506,0,0,0,0,1.5v1.8ZM11.921,1.668a.41.41,0,1,1-.41.41A.41.41,0,0,1,11.921,1.668Zm-1.64,0a.41.41,0,1,1-.41.41A.41.41,0,0,1,10.28,1.668Zm-1.64,0a.41.41,0,1,1-.41.41A.41.41,0,0,1,8.64,1.668Zm0,0"
                  transform="translate(0)"/>
            <path id="Path_6" d="M76.052,302a.41.41,0,1,0,.411.41A.411.411,0,0,0,76.052,302Zm0,0"
                  transform="translate(-73.573 -293.742)"/>
            <path id="Path_7" d="M32.15,392H30.275a.716.716,0,0,0-.72.711v2.57H32.87v-2.57a.716.716,0,0,0-.72-.711Zm0,0"
                  transform="translate(-28.747 -381.281)"/>
            <path id="Path_8" d="M407.712,302a.41.41,0,1,0,.411.41A.411.411,0,0,0,407.712,302Zm0,0"
                  transform="translate(-396.164 -293.742)"/>
            <path id="Path_9"
                  d="M0,151v7.1a1.54,1.54,0,0,1,1.528-1.33h.951a1.23,1.23,0,1,1,1.233-1.23,1.233,1.233,0,0,1-1.233,1.23c.963,0,1.226-.044,1.647.179a1.535,1.535,0,0,1,1.531-1.437H7.014a1.436,1.436,0,1,1,1.438-1.436,1.439,1.439,0,0,1-1.438,1.436H8.343a1.535,1.535,0,0,1,1.531,1.438c.416-.221.663-.18,1.674-.18a1.23,1.23,0,1,1,1.233-1.23,1.233,1.233,0,0,1-1.233,1.23h.923A1.539,1.539,0,0,1,14,158.115V151Zm0,0"
                  transform="translate(0 -146.871)"/>
            <path id="Path_10" d="M234.573,241a.615.615,0,1,0,.617.615A.617.617,0,0,0,234.573,241Zm0,0"
                  transform="translate(-227.56 -234.41)"/>
        </g>
    </svg>
;

export const email_icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16.473" viewBox="0 0 16 16.473">
    <g id="email" transform="translate(-4 -2.344)">
        <path id="Path_269" d="M56,30.121v1.417l.95-.623Z" transform="translate(-37.143 -19.841)"
              fill="#000000" className="svg-icon"/>
        <path id="Path_270" d="M5.625,30.121l-.95.795.95.623Z"
              transform="translate(-0.482 -19.841)"
              fill="#000000" className="svg-icon"/>
        <path id="Path_271"
              d="M12.157,39.99a.3.3,0,0,1-.314,0L4,34.85v6.329a.86.86,0,0,0,.857.857H19.143A.86.86,0,0,0,20,41.179V34.85Zm-7.871-.24h.571v.571H4.286Zm1.143,2H5.143a.86.86,0,0,1-.857-.857v-.286h.571v.286a.286.286,0,0,0,.286.286h.286Zm.857,0H5.714v-.571h.571Z"
              transform="translate(0 -23.219)" fill="#000000" className="svg-icon"/>
        <path id="Path_272" d="M14.571,23.329a.858.858,0,0,0,.857,1.486l.743-.429L15.314,22.9Z"
              transform="translate(-7.244 -14.683)" fill="#000000" className="svg-icon"/>
        <path id="Path_273" d="M20.761,12.384l5.482-.79L23.237,6.387,19.812,10.74Z"
              transform="translate(-11.294 -2.888)" fill="#000000" className="svg-icon"/>
        <path id="Path_274"
              d="M36.655,10.114a.852.852,0,0,0-.086-.651L34.283,5.5a.846.846,0,0,0-.9-.411l3.09,5.353A.849.849,0,0,0,36.655,10.114Z"
              transform="translate(-20.99 -1.952)" fill="#000000" className="svg-icon"/>
        <path id="Path_275"
              d="M22.571,17.54V12.286H20.123l.237.409a1.42,1.42,0,0,1,.143,1.083,1.435,1.435,0,0,1-.666.869.312.312,0,0,1-.1.034l-3.643.526.531.794a1.439,1.439,0,0,0,.394.394l1.717,1.3A.855.855,0,0,1,18.849,19l-.311.314a.866.866,0,0,1-1.214,0l-3.649-3.751-.92.529a1.429,1.429,0,0,1-.711.191,1.507,1.507,0,0,1-.371-.049,1.429,1.429,0,0,1-.346-2.617l.943-.543L14.689,10h-4.4a.286.286,0,0,0-.286.286V17.54l6.286,4.117Z"
              transform="translate(-4.286 -5.469)" fill="#000000" className="svg-icon"/>
        <path id="Path_276"
              d="M29.038,32.15l.314-.314a.277.277,0,0,0,.083-.229.286.286,0,0,0-.126-.21l-1.718-1.3a1.964,1.964,0,0,1-.537-.543l-.683-1.022-1.1.159,3.367,3.461a.286.286,0,0,0,.4,0Z"
              transform="translate(-15.192 -18.705)" fill="#000000" className="svg-icon"/>
        <path id="Path_277" d="M0,0H1.714V.571H0Z"
              transform="matrix(0.866, -0.5, 0.5, 0.866, 15.282, 4.712)" fill="#000000" className="svg-icon"/>
        <path id="Path_278" d="M0,0H1.714V.571H0Z"
              transform="matrix(0.5, -0.866, 0.866, 0.5, 14.608, 3.828)" fill="#000000" className="svg-icon"/>
        <path id="Path_279" d="M45.99,13.964H47.7v.571H45.99Z" transform="translate(-29.993 -8.3)"
              fill="#000000" className="svg-icon"/>
    </g>
</svg>;
export const automation_icon = <svg xmlns="http://www.w3.org/2000/svg" width="14.341" height="15.989"
                                    viewBox="0 0 14.341 15.989">
    <path id="Icon_simple-automatic"
          d="M8,4.512H8V3.689a.778.778,0,0,0-.66.473L3.913,11.147H5.556l-.5-.64L5.49,9.6l0,0L8,4.516v0ZM7.017,8.749H8.981L8,6.717M5.489,9.611H5.5L5.493,9.6m3.489-.853h0m5.349-5.373L8.84.205a1.864,1.864,0,0,0-1.68,0L1.669,3.377a1.859,1.859,0,0,0-.84,1.455V11.17a1.857,1.857,0,0,0,.84,1.453L7.16,15.795a1.864,1.864,0,0,0,1.68,0l5.49-3.179a1.851,1.851,0,0,0,.84-1.449V4.831a1.861,1.861,0,0,0-.84-1.453Zm-4.044,8.033-.458-.923H6.162l-.449.923H3.525l3.6-7.355A.968.968,0,0,1,8,3.455a.994.994,0,0,1,.877.593l3.6,7.362ZM8,4.513V6.163L9.679,9.611H5.5l.505.627H9.987l.449.9h1.649l-1.139-.66V10.5L8,4.513"
          transform="translate(-0.829 -0.005)" fill="#000000" className="svg-icon"/>
</svg>;
export const list_icon = <svg xmlns="http://www.w3.org/2000/svg" width="16" height="14" viewBox="0 0 16 14">
    <path id="Icon_awesome-list-alt"
          d="M14.5,15H1.5A1.5,1.5,0,0,1,0,13.5V2.5A1.5,1.5,0,0,1,1.5,1h13A1.5,1.5,0,0,1,16,2.5v11A1.5,1.5,0,0,1,14.5,15ZM4,3.75A1.25,1.25,0,1,0,5.25,5,1.25,1.25,0,0,0,4,3.75Zm0,3A1.25,1.25,0,1,0,5.25,8,1.25,1.25,0,0,0,4,6.75Zm0,3A1.25,1.25,0,1,0,5.25,11,1.25,1.25,0,0,0,4,9.75ZM13,5.5v-1a.375.375,0,0,0-.375-.375H6.375A.375.375,0,0,0,6,4.5v1a.375.375,0,0,0,.375.375h6.25A.375.375,0,0,0,13,5.5Zm0,3v-1a.375.375,0,0,0-.375-.375H6.375A.375.375,0,0,0,6,7.5v1a.375.375,0,0,0,.375.375h6.25A.375.375,0,0,0,13,8.5Zm0,3v-1a.375.375,0,0,0-.375-.375H6.375A.375.375,0,0,0,6,10.5v1a.375.375,0,0,0,.375.375h6.25A.375.375,0,0,0,13,11.5Z"
          transform="translate(0 -1)" fill="#000000" className="svg-icon"/>
</svg>;
const template_icon = <svg xmlns="http://www.w3.org/2000/svg" width="14.71" height="14.71" viewBox="0 0 14.71 14.71">
    <path id="Icon_metro-insert-template"
          d="M6.284,3.428H8v.857H6.284Zm2.571,0h1.714v.857H8.855Zm4.285,0V6.855H10.568V6h1.714V4.285h-.857V3.428ZM5.427,6H7.141v.857H5.427ZM8,6H9.712v.857H8ZM3.713,4.285V6H4.57v.857H2.856V3.428H5.427v.857ZM6.284,8.569H8v.857H6.284Zm2.571,0h1.714v.857H8.855Zm4.285,0V12H10.568V11.14h1.714V9.426h-.857V8.569ZM5.427,11.14H7.141V12H5.427ZM8,11.14H9.712V12H8ZM3.713,9.426V11.14H4.57V12H2.856V8.569H5.427v.857ZM14,1.714H2v12H14Zm.857-.857v13.71H1.143V.857Z"
          transform="translate(-0.643 -0.357)" fill="#000000" className="svg-icon"/>
</svg>;
const location_icon = <svg xmlns="http://www.w3.org/2000/svg" width="8.569" height="13.71" viewBox="0 0 8.569 13.71">
    <path id="Icon_metro-location"
          d="M8,.857A4.285,4.285,0,0,0,3.713,5.141C3.713,9.426,8,14.567,8,14.567s4.285-5.141,4.285-9.426A4.285,4.285,0,0,0,8,.857ZM8,7.766a2.624,2.624,0,1,1,2.624-2.624A2.624,2.624,0,0,1,8,7.766ZM6.338,5.141A1.66,1.66,0,1,1,8,6.8,1.66,1.66,0,0,1,6.338,5.141Z"
          transform="translate(-3.713 -0.857)" fill="#a7a7a7" className="svg-icon"/>
</svg>;
const history_icon = <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13">
    <path id="Icon_awesome-history"
          d="M13.25,6.738A6.5,6.5,0,0,1,2.671,11.811a.629.629,0,0,1-.048-.933l.3-.3a.63.63,0,0,1,.836-.052,4.823,4.823,0,1,0-.308-7.294l1.33,1.33a.419.419,0,0,1-.3.716H.669A.419.419,0,0,1,.25,4.863V1.053a.419.419,0,0,1,.716-.3L2.26,2.05A6.5,6.5,0,0,1,13.25,6.738ZM8.508,8.8l.257-.331a.629.629,0,0,0-.11-.883l-1.067-.83V4.024A.629.629,0,0,0,6.96,3.4H6.54a.629.629,0,0,0-.629.629V7.58L7.626,8.913A.629.629,0,0,0,8.508,8.8Z"
          transform="translate(-0.25 -0.25)" fill="#a7a7a7" className="svg-icon"/>
</svg>;
const settings_icon = <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12.003" viewBox="0 0 12 12.003">
    <path id="Icon_ionic-ios-settings"
          d="M13.009,8A1.544,1.544,0,0,1,14,6.559a6.121,6.121,0,0,0-.741-1.784,1.565,1.565,0,0,1-.628.134,1.541,1.541,0,0,1-1.409-2.169A6.1,6.1,0,0,0,9.441,2,1.543,1.543,0,0,1,6.559,2a6.121,6.121,0,0,0-1.784.741A1.541,1.541,0,0,1,3.366,4.909a1.514,1.514,0,0,1-.628-.134A6.256,6.256,0,0,0,2,6.563,1.544,1.544,0,0,1,2,9.444a6.121,6.121,0,0,0,.741,1.784,1.541,1.541,0,0,1,2.034,2.034A6.156,6.156,0,0,0,6.563,14a1.54,1.54,0,0,1,2.875,0,6.121,6.121,0,0,0,1.784-.741,1.543,1.543,0,0,1,2.034-2.034A6.156,6.156,0,0,0,14,9.444,1.552,1.552,0,0,1,13.009,8ZM8.028,10.5a2.5,2.5,0,1,1,2.5-2.5A2.5,2.5,0,0,1,8.028,10.5Z"
          transform="translate(-2 -2)" fill="#000000" className="svg-icon"/>
</svg>;
const chats_icon = <svg xmlns="http://www.w3.org/2000/svg" width="13.333" height="13.333" viewBox="0 0 13.333 13.333">
    <path id="Icon_material-chat"
          d="M13.333,1.333H2.667A1.332,1.332,0,0,0,1.34,2.667l-.007,12L4,12h9.333a1.337,1.337,0,0,0,1.333-1.333v-8A1.337,1.337,0,0,0,13.333,1.333ZM4,6h8V7.333H4ZM9.333,9.333H4V8H9.333Zm2.667-4H4V4h8V5.333Z"
          transform="translate(-1.333 -1.333)" fill="#6500ff" className="svg-icon"/>
</svg>;
const dashboard_side_bar_options: iSideBarNavigation[] = [
    {
        link: "/dashboard",
        text: "Summary",
        svg_node: <Dashboard/>,
        active_node: <Dashboard color="primary"/>,
        "data-tut": "reactour__sidebar_dashboard_home"
    },
    {
        link: "/dashboard/brands",
        text: "Brands",
        svg_node: <ShopTwoIcon/>, active_node: <ShopTwoIcon color="primary"/>,
        "data-tut": "reactour__sidebar_dashboard_shopify"
    },
    // {
    //     link: "/dashboard/reports",
    //     text: "Reports",
    //     svg_node: report_icon,
    //     "data-tut": "reactour__sidebar_dashboard_home"
    // },
    // {link: "/dashboard/members", text: "Members", svg_node: agents_icon, "data-tut": "reactour__sidebar_dashboard_home"},
];
const email_side_bar_options: iSideBarNavigation[] = [
    {
        link: "/email", text: "Summary",
        svg_node: <Dashboard/>,
        active_node: <Dashboard color="primary"/>,
        "data-tut": "reactour__sidebar_email_summary"
    },
    {
        link: "/email/campaigns",
        text: "Campaigns",
        svg_node: <AllInboxIcon/>,
        active_node: <AllInboxIcon color="primary"/>,
        "data-tut": "reactour__sidebar_email_campaigns"
    },
    {
        link: "/email/automations",
        text: "Automations",
        svg_node: <AutorenewIcon/>, active_node: <AutorenewIcon color="primary"/>,
        "data-tut": "reactour__sidebar_email_automations"
    },
    {
        link: "/email/lists",
        text: "Lists",
        svg_node: <FormatListBulletedIcon/>,
        active_node: <FormatListBulletedIcon color="primary"/>,
        "data-tut": "reactour__sidebar_email_lists"
    },
    {
        link: "/email/templates",
        text: "Templates",
        svg_node: <ContactMailIcon/>, active_node: <ContactMailIcon color="primary"/>,
        "data-tut": "reactour__sidebar_email_templates"
    },
    {
        link: "/email/segments",
        text: "Segments",
        svg_node: <FilterListIcon/>, active_node: <FilterListIcon color="primary"/>,
        "data-tut": "reactour__sidebar_email_segments"
    },
    {
        link: "/email/domains",
        text: "Domains",
        svg_node: <DomainIcon/>, active_node: <DomainIcon  color="primary"/>,
        "data-tut": "reactour__sidebar_email_domains"
    }

    // {link: "/email/inbox", text: "Inbox", image_link: email_icon,"data-tut":"reactour__sidebar_dashboard_home"},
];

const chat_side_bar_options: iSideBarNavigation[] = [
    {
        link: "/chats",
        text: "All Chats",
        svg_node: <ChatIcon/>,
        active_node: <ChatIcon color="primary"/>,
        "data-tut": "reactour__sidebar_chat_home"
    },
    {link: "/chats/canned", text: "Canned", svg_node: email_canned_icon, "data-tut": "reactour__sidebar_dashboard_home"},
    // {link: "/chats/departments", text: "Department", svg_node: email_department_icon, "data-tut": "reactour__sidebar_dashboard_home"},
    {
        link: "/chats/settings",
        text: "Settings",
        svg_node: <Settings/>,
        active_node: <Settings color="primary"/>,
        "data-tut": "reactour__sidebar_chat_settings"
    },
];
const popups_side_bar_options: iSideBarNavigation[] = [
    {
        link: "/popups",
        text: "All Popups",
        svg_node: <ImportantDevicesIcon/>, active_node: <ImportantDevicesIcon color="primary"/>,
        "data-tut": "reactour__sidebar_dashboard_home"
    },
    {
        link: "/popups/logs",
        text: "Logs",
        svg_node: <Settings/>, active_node: <Settings color="primary"/>,
        "data-tut": "reactour__sidebar_dashboard_home"
    },
];
const reviews_side_bar_options: iSideBarNavigation[] = [
    {
        link: "/reviews", text: "All Reviews", svg_node: <RateReview/>, active_node: <RateReview color="primary"/>,
        "data-tut": "reactour__sidebar_review_home",
    }, {
        link: "/reviews/import",
        text: "Import",
        svg_node: <ImportExport/>,
        active_node: <ImportExport color="primary"/>,
        "data-tut": "reactour__sidebar_review_import",
    },
    {
        link: "/reviews/settings", text: "Settings", svg_node: <Settings/>, active_node: <Settings color="primary"/>,
        "data-tut": "reactour__sidebar_review_settings",
    },
];

export const getSubMenuFromMainMenu = (opened_main_menu: string) => {
    switch (opened_main_menu) {
        case "dashboard":
            return dashboard_side_bar_options;
        case "email":
            return email_side_bar_options;
        case "chats":
            return chat_side_bar_options;
        case "popups":
            return popups_side_bar_options;
        case "reviews":
            return reviews_side_bar_options;
        default:
            return dashboard_side_bar_options;

    }
};
