import React from "react";
import {IconButton, List, ListItem, Popover} from "@material-ui/core";
import MoreIcon from '@material-ui/icons/More';

interface CustomMenuProps {
    options: Array<{ child: React.ReactNode, onClick: any }>,
    children?: any
}

export default function CustomMenu({options, children}: CustomMenuProps) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return <>

        <IconButton onClick={handleClick} style={{padding: "8px"}} color="secondary">
            <MoreIcon/>
        </IconButton>

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
                horizontal: 'right',
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
