import * as React from "react";
import {Dispatch, useContext} from "react";
import {Col, Row} from "react-bootstrap";
import {IconButton, List, ListItem, ListItemIcon, ListItemText, Popover} from "@material-ui/core";
import {Link, useLocation} from "react-router-dom";

import {getMenuNameFromPath, getSubMenuFromMainMenu, isSubMenuActive} from "../components/common";
import logo from "../assets/images/logo-tilted-small.png";

import {iStoreAction} from "../redux/reducers";
import {AppDispatchContext, AppStateContext} from "../App";
import {Add, ExpandMore, OpenInNew} from "@material-ui/icons";

function Sidebar(props: any): any {
    const location = useLocation();
    const opened_menu: string = getMenuNameFromPath(location.pathname, 1);
    const links = getSubMenuFromMainMenu(opened_menu);

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const {shop, shops} = useContext(AppStateContext);

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {

        setAnchorEl(null);
    };

    function ListItemLink(props: any) {
        return <ListItem button component={Link} {...props} />;
    }

    return <div className="wrapper">
        <div id="sidebar">
            <Row>
                <Col>
                    <Row className="logo-row ">
                        <Col>
                            <div className="sidebar-header">
                                <div className="logo">
                                    <img src={logo} alt="Emailwish Logo"/>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <div className={"selector-div mt-3"}>
                        <div className="selected_dropdown">
                            <div className="selected_value__name">
                                {shop && shop.name}
                            </div>
                            <div className="selected_value__change_icon">
                                <IconButton
                                    color="primary"
                                    aria-label="Help"
                                    aria-controls="Help-menu"
                                    aria-haspopup="true"
                                    onClick={handleClick}
                                    component="span">
                                    <ExpandMore color="action"/>
                                </IconButton>
                            </div>

                        </div>

                        {
                            shop && <Popover
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
                                    horizontal: 'right',
                                }}
                                onClose={handleClose}
                            >
                                <div className="app-popover_wrapper">
                                    <List component="nav" className="app-popover">
                                        {
                                            shops && shops.map((shop, index) => {
                                                return <ListItem button className="app-popover_item" key={index}
                                                                 onClick={() => {
                                                                     dispatch({
                                                                         type: "set_active_shop",
                                                                         shop: shop
                                                                     })
                                                                 }}>
                                                    {shop.name}
                                                    {" "}
                                                    <a
                                                        href={`https://${shop.myshopify_domain}`}
                                                        rel="noreferrer noopener"
                                                        target="_blank"
                                                    >
                                                        <OpenInNew/>
                                                    </a>
                                                </ListItem>
                                            })
                                        }
                                        <a href="https://apps.shopify.com/emailmarketing_emailwish_abandonedcart_popup_chat_reviews"
                                           target="_blank" rel="noopener noreferrer">
                                            <ListItem button className="app-popover_item">
                                                <Add color="action"/>Add New Shop
                                            </ListItem>
                                        </a>
                                    </List>
                                </div>
                            </Popover>
                        }
                        {/*<Select required={true}*/}
                        {/*        name="shops-selector"*/}
                        {/*        options={shops && shops.map(s => ({value: s.id, label: s.name}))}*/}
                        {/*        value={shop && {value: shop.id, label: shop.name}}*/}
                        {/*        onChange={(e: any) => {*/}
                        {/*            if(shops){*/}
                        {/*                const selected: any = shops.find(s => s.id === parseInt(e.value));*/}
                        {/*                dispatch({*/}
                        {/*                    type: "set_active_shop", shop: selected*/}
                        {/*                });*/}
                        {/*            }*/}

                        {/*        }}*/}
                        {/*/>*/}
                    </div>
                </Col>
                <Col md={12} xs={12}>
                    <div className="list-col pl-3 w-100">
                        <div className="vertical-center w-100">
                            <List>
                                {links.map((i, index: any) => {
                                    let isActive = isSubMenuActive(location.pathname, i.link);
                                    return <ListItemLink className={"sub-menu " + (isActive ? "active" : "")}
                                                         key={index} to={i.link} data-tut={i["data-tut"]}>
                                        <ListItemIcon style={{minWidth: '20px',}}>
                                            {
                                                isActive && i.active_node
                                            }
                                            {(!isActive || !i.active_node) && i.svg_node}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<div
                                                className={"list-text"}
                                                style={{width: 90, paddingLeft: "4px", whiteSpace: "initial"}}>
                                                {i.text}
                                            </div>}/>
                                    </ListItemLink>
                                })}
                            </List>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>


        <div id="content">
            {
                props.children
            }
        </div>

    </div>;
}

export default Sidebar;
