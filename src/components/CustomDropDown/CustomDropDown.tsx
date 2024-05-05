import React, {useState} from "react";
import {Box, IconButton, List, ListItem, Popover} from "@material-ui/core";
import {ExpandMore} from "@material-ui/icons";
import {makeStyles} from "@material-ui/styles";
import {createStyles, Theme} from "@material-ui/core/styles";

interface CustomDropDownProps {
    value: any,
    onChange: (value: string) => void,
    options: Array<{ label: string, value: string }>
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        selected_dropdown: {
            display: "flex",
            width: "100%",
            height: "calc(1.5em + 0.75rem + 5px)",
            padding: "8px",
            border: "none",
            backgroundColor: "var(--color-surface)",
            boxShadow: "var(--box-shadow-low)",
            justifyContent: "space-between",
            alignItems: "center"
        },
        noShadow: {
            boxShadow: "none",
        },
    }),
);

export default function CustomDropDown(
    {value, onChange, options}: CustomDropDownProps
) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setWidth(event.currentTarget.offsetWidth)
        setAnchorEl(event.currentTarget);
    };
    const [width, setWidth] = useState(150);

    const handleClose = () => {

        setAnchorEl(null);
    };

    return <div>
        <div className={` form-control ${classes.selected_dropdown} ${classes.noShadow} `} style={{cursor: "pointer"}}
             onClick={handleClick}>
            <div>
                {
                    options && options.find((e) => e.value === value)?.label
                }
            </div>
            <Box>
                <IconButton
                    color="primary"
                    aria-label="Help"
                    aria-controls="Help-menu"
                    aria-haspopup="true"
                    size={"small"}
                    onClick={handleClick}
                    component="span">
                    <ExpandMore color="action"/>
                </IconButton>
            </Box>
        </div>
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
            <Box className="app-popover_wrapper" style={{width: width}}>
                <List component="nav" className="app-popover">
                    {
                        options && options.map((e, index) => {
                            return <ListItem button className="app-popover_item" key={index} onClick={() => {
                                onChange(e.value)
                                handleClose()
                            }}>
                                {e.label}
                            </ListItem>

                        })
                    }
                </List>
            </Box>
        </Popover>
    </div>
}
