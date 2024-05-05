import * as React from "react";
import {useCallback} from "react";
import {Nav} from "react-bootstrap";
import MenuLinkButton from "../../../../components/Button/MenuLinkButton";
import cn from "classnames";
import {Button, Menu, MenuItem} from "@material-ui/core";
import {useHistory, useLocation, useParams} from "react-router-dom";
import {matchPath} from 'react-router';

interface iProps {
    uid: string
}

export default function EmailMailingListNavBar() {
    let location = useLocation()
    let path = location.pathname.split("/");
    let active_menu = path[path.length - 1];
    const history = useHistory();
    const [SubscriberAnchorEl, setSubscriberAnchorEl] = React.useState<null | HTMLElement>(null);
    const [segmentAnchorEl, setSegmentAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClose = useCallback((link: string) => {
        history.push(link)
        setSubscriberAnchorEl(null);
        setSegmentAnchorEl(null);
    }, []);
    const params: any = useParams<any>();
    return <Nav>
        <MenuLinkButton
            link={`/email/lists/${params.list_uid}/view`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                !!matchPath(
                    location.pathname,
                    '/email/lists/:list_uid/view'
                ) ? "active" : ""
            )}
        >
            Overview
        </MenuLinkButton>
        <MenuLinkButton
            link={`/email/lists/${params.list_uid}/edit`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                !!matchPath(
                    location.pathname,
                    '/email/lists/:list_uid/edit'
                ) ? "active" : ""
            )}
        >
            Edit
        </MenuLinkButton>
        <Button aria-controls="log-menu" aria-haspopup="true" onClick={(e: any) => {
            setSubscriberAnchorEl(e.currentTarget);
        }}
                className={cn(
                    "nav-button",
                    "mr-2", "u500",
                    !!matchPath(
                        location.pathname,
                        '/email/lists/:list_uid/subscribers'
                    ) ? "active" : ""
                )}
        >
            Subscribers
        </Button>
        <Menu
            id="simple-menu"
            anchorEl={SubscriberAnchorEl}
            keepMounted
            open={Boolean(SubscriberAnchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={() => handleClose(`/email/lists/${params.list_uid}/subscribers`)}>View All</MenuItem>
            <MenuItem onClick={() => handleClose(`/email/lists/${params.list_uid}/subscribers/create`)}>Add
                new</MenuItem>
            <MenuItem
                onClick={() => handleClose(`/email/lists/${params.list_uid}/subscribers/import`)}>Import</MenuItem>
        </Menu>
        <Button aria-controls="log-menu" aria-haspopup="true" onClick={(e: any) => {
            setSegmentAnchorEl(e.currentTarget);
        }
        } className={cn(
            "nav-button",
            "mr-2", "u500",
            !!matchPath(
                location.pathname,
                '/email/lists/:list_uid/segments'
            ) ? "active" : ""
        )}>
            Segments
        </Button>
        <Menu
            id="simple-menu-1"
            anchorEl={segmentAnchorEl}
            keepMounted
            open={Boolean(segmentAnchorEl)}
            onClose={handleClose}
        >
            <MenuItem onClick={() => handleClose(`/email/lists/${params.list_uid}/segments`)}>View All</MenuItem>
            <MenuItem onClick={() => handleClose(`/email/lists/${params.list_uid}/segments/create`)}>Add new</MenuItem>
        </Menu>
        <MenuLinkButton
            link={`/email/lists/${params.list_uid}/fields`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                !!matchPath(
                    location.pathname,
                    '/email/lists/:list_uid/fields'
                ) ? "active" : ""
            )}
        >
            Fields
        </MenuLinkButton>
        <MenuLinkButton
            link={`/email/lists/${params.list_uid}/verification`}
            className={cn(
                "nav-button",
                "mr-2", "u500",
                !!matchPath(
                    location.pathname,
                    '/email/lists/:list_uid/verification'
                ) ? "active" : ""
            )}
        >
            Email verification
        </MenuLinkButton>
    </Nav>;

}
