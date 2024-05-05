import * as React from "react";
import {Nav} from "react-bootstrap";
import {LinkContainer} from "react-router-bootstrap";
import {iEmailCampaign} from "../../../../types/internal/email/campaign";

interface iProps {
    uid: string,
    campaign?: iEmailCampaign
}

function EmailCampaignNavBar(props: iProps) {
    const {uid} = props;
    return <Nav>
        <Nav.Item>
            <LinkContainer to={`/email/campaigns/${uid}/view/recipients`}>
                <Nav.Link>Recipients</Nav.Link>
            </LinkContainer>
        </Nav.Item>
        <Nav.Item>
            <LinkContainer to={`/email/campaigns/${uid}/view/setup`}>
                <Nav.Link disabled>Setup</Nav.Link>
            </LinkContainer>
        </Nav.Item>
        <Nav.Item>
            <LinkContainer to={`/email/campaigns/${uid}/view/template`}>
                <Nav.Link>Template</Nav.Link>
            </LinkContainer>
        </Nav.Item>
        <Nav.Item>
            <LinkContainer to={`/email/campaigns/${uid}/view/schedule`}>
                <Nav.Link>Schedule</Nav.Link>
            </LinkContainer>
        </Nav.Item>
        <Nav.Item>
            <LinkContainer to={`/email/campaigns/${uid}/view/confirm`}>
                <Nav.Link>Confirm</Nav.Link>
            </LinkContainer>
        </Nav.Item>
    </Nav>
}

export default EmailCampaignNavBar;
