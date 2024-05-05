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

// @ts-ignore
import ReactCountryFlag from "react-country-flag"
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import FormattedDate from "../../../components/Utils/FormattedDate";


function DashboardHomeChat() {
    const {loading, error, response} = useContext(DashboardHomeStateContext);
    const history = useHistory();
    return <AppCard className="chat-in-dashboard">
        <AppCardHeader>
            <div className="d-flex justify-content-between">
                <AppCardTitle>
                    <div style={{fontSize: "20px"}}>
                        0
                    </div>
                    Missed Chats
                </AppCardTitle>
                {/*<div >*/}
                {/*    <img className="app-dark-bg-color-1 app-icon" src={setting_icon} alt="Settings"/>*/}
                {/*</div>*/}
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
                !loading && !error && response && response.recent_chats && response.recent_chats.length > 0 && <>

                    <div className="chat-in-dashboard__card-body__chat_list">

                        <Scrollbar removeTrackYWhenNotUsed permanentTrackY={true} style={{height: "320px"}}>
                            {response.recent_chats.map((chat_session, idx) => {

                                let region = (chat_session.location && chat_session.location.cityName)
                                let country = (chat_session.location && chat_session.location.countryName)
                                let country_code = (chat_session.location && chat_session.location.countryCode)
                                let location = "";
                                if (region) {
                                    location = region;
                                }
                                if (country) {
                                    if (region) {
                                        location = region + ", " + country;
                                    } else {
                                        location = country
                                    }
                                }
                                return <div key={chat_session.id} className="chat-in-dashboard-wrapper" onClick={() => {
                                    history.push({pathname: "/chats", state: {open_chat: chat_session.id}})
                                }}>
                                    <div className="chat-in-dashboard-wrapper__sub">
                                        <div className="chat-in-dashboard-wrapper__item">

                                            <div className="chat-in-dashboard-wrapper__item__img_col_1">
                                                <div className="chat-in-dashboard-wrapper__item__image">
                                                    {
                                                        country_code && <ReactCountryFlag
                                                            className="emojiFlag"
                                                            countryCode={country_code}
                                                            style={{
                                                                fontSize: '2em',
                                                                lineHeight: '2em',
                                                                width: "100%",
                                                                height: "100%",
                                                            }}
                                                            svg
                                                            aria-label={location}/>
                                                    }
                                                    {
                                                        !country_code && <img src="/assets/images/unknown-country.png" alt="unknown"/>
                                                    }


                                                </div>
                                            </div>
                                            <div className="chat-in-dashboard-wrapper__item__img_col_2">
                                                <div className="chat-in-dashboard-wrapper__item__content">
                                                    <div className="chat-in-dashboard-wrapper__item__content_name">
                                                        <h6 className="u500 color1">#{chat_session.id} {chat_session.name}</h6>
                                                    </div>
                                                    <div
                                                        className="chat-in-dashboard-wrapper__item__content_message_wrapper">
                                                            <p
                                                                className="chat-in-dashboard-wrapper__item__content__message">
                                                               {chat_session.last_message && chat_session.last_message.message}
                                                            </p>
                                                        <p
                                                            className="chat-in-dashboard-wrapper__item__content__date">
                                                            <FormattedDate date_string={chat_session.created_at}
                                                                           format={'L LT'}/>
                                                        </p>

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            })}
                        </Scrollbar>

                    </div>

                    <div className="chat-in-dashboard__card-body__see_more">
                        <Link to={"/chats"} className="app-light-color-2 chat-in-dashboard__card-body__see_more__link">See
                            More&nbsp;
                            <FaAngleDoubleRight/></Link>
                    </div>
                </>
            }
            {
                !loading && !error && response && response.recent_chats && response.recent_chats.length === 0 &&
                <div style={{height: "300px"}}>
                    <DashboardCardInfo text={"No Chat session is available..."}/>
                </div>
            }

        </AppCardBody>
    </AppCard>;
}

export default DashboardHomeChat;
