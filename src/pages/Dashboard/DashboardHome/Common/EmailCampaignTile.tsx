import * as React from "react";
import RatingStars from "../../../../components/Rating/RatingStars";
import RatingDemoImage from "../../../../assets/images/demo-rating-img.png";

function EmailCampaignTile() {

    return <div className="main_list active_chat">
        <div className="list_card">
            <div className="inbox_ib">
                <h5>Helena Jonas <span className="chat_date">5:05 PM</span></h5>
                <RatingStars star={"3"}/>
                <p className="list-text">I liked you MI Band Product. I have placed order for that. Make sure I
                    receive the quality
                    product. I have paid…….</p>
                <div className="d-inline">
                    {[1, 2].map(i => {
                        return <img className="rating-ref-small-img" src={RatingDemoImage} alt="i" key={i}/>
                    })}

                </div>
            </div>
        </div>
    </div>;
}

export default EmailCampaignTile;