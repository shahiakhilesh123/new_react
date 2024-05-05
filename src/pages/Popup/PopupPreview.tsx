import Popup1 from "../../components/popups/popup1/popup1";
import Popup2 from "../../components/popups/popup2/popup2";
import Popup3 from "../../components/popups/popup3/popup3";
import Popup4 from "../../components/popups/popup4/popup4";
import Popup5 from "../../components/popups/popup5/popup5";
import Popup6 from "../../components/popups/popup6/popup6";
import Popup7 from "../../components/popups/popup7/popup7";
import Popup8 from "../../components/popups/popup8/popup8";
import Popup9 from "../../components/popups/popup9/popup9";
import Popup10 from "../../components/popups/popup10/popup10";
import Popup11 from "../../components/popups/popup11/popup11";
import Popup12 from "../../components/popups/popup12/popup12";
import Popup13 from "../../components/popups/popup13/popup13";
import Popup14 from "../../components/popups/popup14/popup14";
import Popup15 from "../../components/popups/popup15/popup15";
import Popup16 from "../../components/popups/popup16/popup16";
import Popup17 from "../../components/popups/popup17/popup17";
import Popup18 from "../../components/popups/popup18/popup18";
import Popup19 from "../../components/popups/popup19/popup19";
import Popup20 from "../../components/popups/popup20/popup20";
import Popup21 from "../../components/popups/popup21/popup21";
import React from "react";
import {PopupProps} from "../../components/popups/popup_props/props";

export default function PopupPreview(popup: PopupProps) {
    return <>
        {
            popup.popup_id == "1"
                ?
                <Popup1 {...popup}/> :
                popup.popup_id == "2"
                    ?
                    <Popup2 {...popup}/> :
                    popup.popup_id == "3"
                        ?
                        <Popup3 {...popup}/> :
                        popup.popup_id == "4"
                            ?
                            <Popup4 {...popup}/> :
                            popup.popup_id == "5"
                                ?
                                <Popup5 {...popup}/> :
                                popup.popup_id == "6"
                                    ?
                                    <Popup6 {...popup}/> :
                                    popup.popup_id == "7"
                                        ?
                                        <Popup7 {...popup}/> :
                                        popup.popup_id == "8"
                                            ?
                                            <Popup8 {...popup}/> :
                                            popup.popup_id == "9"
                                                ?
                                                <Popup9 {...popup}/> :
                                                popup.popup_id == "10"
                                                    ?
                                                    <Popup10 {...popup}/> :
                                                    popup.popup_id == "11"
                                                        ?
                                                        <Popup11 {...popup}/> :
                                                        popup.popup_id == "12"
                                                            ?
                                                            <Popup12 {...popup}/> :
                                                            popup.popup_id == "13"
                                                                ?
                                                                <Popup13 {...popup}/> :
                                                                popup.popup_id == "14"
                                                                    ?
                                                                    <Popup14 {...popup}/> :
                                                                    popup.popup_id == "15"
                                                                        ?
                                                                        <Popup15 {...popup}/> :
                                                                        popup.popup_id == "16"
                                                                            ?
                                                                            <Popup16 {...popup}/> :
                                                                            popup.popup_id == "17"
                                                                                ?
                                                                                <Popup17 {...popup}/> :
                                                                                popup.popup_id == "18"
                                                                                    ?
                                                                                    <Popup18 {...popup}/> :
                                                                                    popup.popup_id == "19"
                                                                                        ?
                                                                                        <Popup19 {...popup}/> :
                                                                                        popup.popup_id == "20"
                                                                                            ?
                                                                                            <Popup20 {...popup}/> :
                                                                                            popup.popup_id == "21"
                                                                                                ?
                                                                                                <Popup21 {...popup}/> : ""

        }
    </>
}
