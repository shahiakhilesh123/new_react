import * as React from "react";
import {Col, Row} from "react-bootstrap";
import AppCard from "../../components/Card/AppCard";
import thought from "../../assets/icons/thought.svg"
import chat from "../../assets/icons/chat.svg"
import community from "../../assets/icons/community.svg"

function DashboardHelp() {

    return <Row className="help-dashboard">
        {
            [
                {
                    link: "https://help.emailwish.com/",
                    image: thought,
                    title: "Knowledge base",
                    text: "Best way to understand features"
                },
                {
                    link: "https://community.emailwish.com/",
                    image: community,
                    title: "Ask Community",
                    text: "Large community for your support"
                },
                {
                    link: "https://help.emailwish.com/",
                    image: chat,
                    title: "Talk to an agent",
                    text: "Agent can help resolve your issue."
                }
            ].map((doc, index) => {
                return <Col md={4} key={index}>
                    <a href={doc.link}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="help-dashboard-card-box-post">
                        <AppCard className="help-dashboard-card">

                            <div className="help-dashboard-card-cat-icon">
                                <img src={doc.image}
                                     alt="help-dashboard-card-category-box-icon"/>
                            </div>
                            <h2 className="help-dashboard-card-cat-title">{doc.title}</h2>
                            <div className="help-dashboard-card-cat-text">
                                <span>{doc.text}</span>
                            </div>

                        </AppCard>
                    </a>
                </Col>
            })
        }

    </Row>;

}

export default DashboardHelp;
