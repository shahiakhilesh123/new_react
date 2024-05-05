import React, {useEffect, useState} from "react";
import {HideBetterDoc, hideChat, ShowBetterDoc, ShowEWChat} from "../../components/common";
import "./support.scss"

import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Email from "@material-ui/icons/Email";
import {Grid} from "@material-ui/core";

export default function TalkToAnAgent() {

    const [showChat, setShowChat] = useState<boolean>(false);
    useEffect(() => {
        HideBetterDoc();


        ShowEWChat();

        return () => {
            ShowBetterDoc();
            hideChat()
        }
    }, [])


    return <div className="app-support">
        <div className="app-support-heading">

            <div>
                <h6>

                    Get In touch
                </h6>
            </div>
            <div>
                <p>
                    Want to get in touch? We'd love to hear from you. Here's how you can reach us..
                </p>
            </div>

        </div>
        <Grid container spacing={2} className="support-card-wrapper" justifyContent="space-around">
            <Grid item md={4} className="talk-to-sales">
                <div className="talk-to-sales-icon">
                    <Email style={{color: "white"}}/>
                </div>
                <div>
                    Customer Support via Email
                </div>
                <div>
                    write us at: <strong>support@emailwish.com</strong>
                </div>
            </Grid>
            <Grid item md={4} className="contact-customer-support">
                <div className="contact-customer-support-icon">
                    <ChatBubbleIcon style={{color: "white"}}/>
                </div>
                <div>
                    Customer Support via Chat
                </div>
                <div>
                </div>
            </Grid>
        </Grid>
    </div>
}
