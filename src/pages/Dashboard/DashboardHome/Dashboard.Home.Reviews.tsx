import * as React from "react";
import {useContext} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import {Alert} from "react-bootstrap";
import {Link, useHistory} from "react-router-dom";
import {FaAngleDoubleRight} from 'react-icons/fa';
import {DashboardHomeStateContext} from "../Dashboard.Home";
import AppLoader from "../../../components/Loader/AppLoader";
import DashboardCardInfo from "../../../components/DashboardCardInfo/DashboardCardInfo";

import RatingStars from "../../../components/Rating/RatingStars";
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import FormattedDate from "../../../components/Utils/FormattedDate";
import {iResource} from "../../../redux/reducers";
import {iDashboardReportResponse} from "../../../apis/user.apis";


function DashboardHomeReviews({state}: { state: iResource<iDashboardReportResponse> }) {
    const {loading, error, response} = useContext(DashboardHomeStateContext);

    const stateResponse = state;

    const history = useHistory();
    return <AppCard className="h-auto reviews-dashboard" style={{maxHeight: "360px", minHeight: "360px"}}>
        <AppCardHeader>
            <div className="d-flex justify-content-between">
                <AppCardTitle>
                    <div style={{fontSize: "20px"}}>
                        {stateResponse && stateResponse.response && stateResponse.response.reviews && stateResponse.response.reviews.total_reviews_within_timeframe}
                    </div>
                    New Reviews
                </AppCardTitle>
            </div>

        </AppCardHeader>
        <AppCardBody className="p-0 chat-in-dashboard__card-body">
            {
                loading && <AppLoader/>
            }
            {
                error && <div className="mt-2"><Alert variant="danger">{error}</Alert></div>
            }
            {
                !loading && !error && response && response.recent_reviews && response.recent_reviews.length > 0 && <>
                    <div className="chat-in-dashboard__card-body__chat_list">

                        <Scrollbar removeTrackYWhenNotUsed permanentTrackY={true} style={{height: "320px"}}>
                            {response.recent_reviews.map((review, idx) => {
                                return <div className="review_wrapper__tile" key={review.id} onClick={() => {
                                    history.push("/reviews/edit/" + review.uid);
                                }}>
                                    <div className="review-item-wrapper">
                                        <div className="review-item-wrapper__sub">
                                            <div className="review-item">
                                                <h6 className="u500 color1">{review.reviewer_name} <span
                                                    className="review-item__date">

                                                            <FormattedDate date_string={review.created_at}
                                                                           format={'L LT'}/>
                                            </span>
                                                </h6>
                                                <RatingStars star={review.stars}/>
                                                <p className="review-item__message">{review.message}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </Scrollbar>

                        {/* <div className="float-right mt-1">
                        <Link to={"/reviews"} className="app-light-color-2 ">See More&nbsp;
                            <FaAngleDoubleRight/></Link>
                    </div> */}
                    </div>
                    <div className="float-right chat-in-dashboard__card-body__see_more">
                        <Link to={"/reviews"}
                              className="app-light-color-2 chat-in-dashboard__card-body__see_more__link">See More&nbsp;
                            <FaAngleDoubleRight/></Link>
                    </div>
                </>

            }
            {
                !loading && !error && response && response.recent_reviews && response.recent_reviews.length === 0 &&
                <div style={{height: "300px"}}>
                    <DashboardCardInfo text={"No Review is available yet..."}/>
                </div>
            }

        </AppCardBody>
    </AppCard>;

}

export default DashboardHomeReviews;
