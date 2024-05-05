import * as React from "react";
import profile from "../../../../assets/images/demo-avatar.jpg";
import CustomSwitch from "../../../../components/Switch/CustomSwitch";

function SuggestionTile() {
    return <div className="main_list active_chat">
        <div className="list_card">
            <div className="chat_img"><img src={profile} alt={""}/></div>
            <div className="chat_ib">
                <h5>Schedule Monthly offers<span className="chat_date"> <CustomSwitch/></span></h5>
                <p className="list-text">Share this month offers.</p>
            </div>
        </div>
    </div>;

}

export default SuggestionTile;
