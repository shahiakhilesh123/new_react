import * as React from "react";
import {Nav} from "react-bootstrap";
import MenuLinkButton from "./Button/MenuLinkButton";
import cn from "classnames";
import {useLocation} from "react-router-dom";

export default function AccountNavBar() {
    const location = useLocation()
    const path = location.pathname.split("/");
    const active_menu = path[path.length - 1];

    return <Nav>
        <MenuLinkButton
            link={`/account/profile`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                active_menu.includes("profile") ? "active" : ""
            )}
        >
            Profile
        </MenuLinkButton>
        <MenuLinkButton
            link={`/account/contact`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                active_menu.includes("contact") ? "active" : ""
            )}
        >
            Contact
        </MenuLinkButton>
        <MenuLinkButton
            link={`/account/signature`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                active_menu.includes("signature") ? "active" : ""
            )}
        >
            Signature
        </MenuLinkButton>
        <MenuLinkButton
            link={`/account/subscription`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                active_menu.includes("subscription") ? "active" : ""
            )}
        >
            Subscription
        </MenuLinkButton>
        <MenuLinkButton
            link={`/account/logs`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                active_menu.includes("logs") ? "active" : ""
            )}
        >
            Logs
        </MenuLinkButton>
    </Nav>
}
