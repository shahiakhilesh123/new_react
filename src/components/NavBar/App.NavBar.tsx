import * as React from "react";
import {Nav} from "react-bootstrap";
import cn from "classnames";
import {useHistory} from "react-router-dom";
import MenuLinkButton from "../Button/MenuLinkButton";
import AppCard from "../Card/AppCard";
import CustomMenu2 from "../CustomMenu/CustomMenu2";

export interface AppNavBarMenu {
    name: string,
    link?: string,
    active?: boolean,
    submenus?: AppNavBarMenu[]
}

interface AppNavBarProps {
    menus: AppNavBarMenu[],
    onHelpClick?: any
}

export default function AppNavBar({menus, onHelpClick}: AppNavBarProps) {

    const history = useHistory();

    return <AppCard>
        <div className="d-flex justify-content-between align-items-center">
            <Nav>
                {
                    menus && menus.map(((value, index) => {
                        if (!value.submenus) {
                            return <MenuLinkButton
                                key={index}
                                link={value.link}
                                className={cn(
                                    "nav-button", "mr-2", "u500",
                                    value.active ? "active" : ""
                                )}
                            >
                                {value.name}
                            </MenuLinkButton>
                        }
                        return <CustomMenu2 key={index} options={value.submenus.map((submenu) => {
                            return {
                                child: <>{submenu.name}</>,
                                onClick: () => {
                                    history.push(submenu.link || "");
                                }
                            }
                        })} menu={value}>

                        </CustomMenu2>
                    }))
                }
            </Nav>
            {
                onHelpClick && <a className="app-link" onClick={() => {
                    onHelpClick && onHelpClick()
                }}>Learn How?</a>
            }
        </div>

    </AppCard>

}
