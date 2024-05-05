import * as React from "react";

import rect from "../../../../assets/images/rect.png"

function InboxTile() {
    return <div className="main_list active_chat">
        <div className="list_card">
            <div className="inbox_img"><img src={rect} alt={""}/></div>
            <div className="inbox_ib">
                <h5>Helena Jonas <span>5:05 PM</span></h5>

                <h6>New Purchase Order</h6>
                <p className="list-text">I liked you MI Band Product. I have placed order for that. Make sure I
                    receive the quality
                    product. I have paid…….</p>
            </div>
        </div>
    </div>;
}


export default InboxTile;
