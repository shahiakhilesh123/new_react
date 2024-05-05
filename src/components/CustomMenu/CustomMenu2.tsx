import React from "react";
import {List, ListItem, Popover} from "@material-ui/core";
import MenuLinkButton from "../Button/MenuLinkButton";
import cn from "classnames";
import {AppNavBarMenu} from "../NavBar/App.NavBar";

interface CustomMenu2Props {
    menu: AppNavBarMenu,
    options: Array<{ child: React.ReactNode, onClick: any }>,
    children?: any
}

export default function CustomMenu2({menu, options, children}: CustomMenu2Props) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return <>

        <MenuLinkButton
            className={cn(
                "nav-button", "mr-2", "u500",
                menu.active ? "active" : ""
            )}
            onClick={handleClick}

        >
            {menu.name}
        </MenuLinkButton>

        <Popover
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            style={{
                boxShadow: "var(--box-shadow-low)"
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
            }}
            onClose={handleClose}
        >
            <div className="app-popover_wrapper">
                <List component="nav" className="app-popover">
                    {
                        options && options.map((e, index) => {
                            return <ListItem button className="app-popover_item" key={index} onClick={() => {
                                e.onClick();
                                handleClose()
                            }}>
                                {
                                    e.child
                                }
                            </ListItem>
                        })
                    }
                </List>
            </div>
        </Popover>
    </>
}
