import * as React from "react";
import {useCallback} from "react";
import {Nav} from "react-bootstrap";
import MenuLinkButton from "../../../../components/Button/MenuLinkButton";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {useHistory} from "react-router";
import {useLocation} from "react-router-dom";
import cn from "classnames";

interface iProps {
    uid: string
}

export default function EmailCampaignOverViewNavbar(props: iProps) {
    const history = useHistory();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    let location = useLocation()
    const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }, []);

    const handleClose = useCallback((link: string) => {
        history.push(link)
        setAnchorEl(null);
    }, []);
    let path = location.pathname.split("/");
    let active_menu = path[path.length - 1];

    return <Nav>
        <MenuLinkButton
            link={`/email/campaigns/${props.uid}/overview`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                active_menu.includes("overview") ? "active" : ""
            )}
        >
            Overview
        </MenuLinkButton>
        <MenuLinkButton
            link={`/email/campaigns/${props.uid}/overview/subscribers`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                active_menu.includes("subscribers") ? "active" : ""
            )}>
            Subscribers
        </MenuLinkButton>
        <Button aria-controls="log-menu" aria-haspopup="true" onClick={handleClick}>
            Logs
        </Button>
        <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={() => handleClose(`/email/campaigns/${props.uid}/overview/logs/tracking-log`)}>
                Tracking log</MenuItem>
            <MenuItem onClick={() => handleClose(`/email/campaigns/${props.uid}/overview/logs/bounce-log`)}>Bounce
                log</MenuItem>
            <MenuItem onClick={() => handleClose(`/email/campaigns/${props.uid}/overview/logs/feedback-log`)}>Feedback
                log</MenuItem>
            <MenuItem onClick={() => handleClose(`/email/campaigns/${props.uid}/overview/logs/open-log`)}>Open
                log</MenuItem>
            <MenuItem onClick={() => handleClose(`/email/campaigns/${props.uid}/overview/logs/click-log`)}>Click
                log</MenuItem>
            <MenuItem onClick={() => handleClose(`/email/campaigns/${props.uid}/overview/logs/unsubscribe-log`)}>Unsubscribe
                log</MenuItem>
        </Menu>
        <MenuLinkButton link={`/email/campaigns/${props.uid}/overview/review`}
                        className={cn(
                            "nav-button",
                            "mr-2", "u500",
                            active_menu.includes("review") ? "active" : ""
                        )}>
            Email review
        </MenuLinkButton>
    </Nav>
}

