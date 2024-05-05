import React from 'react';
import Button from '@material-ui/core/Button';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {PropTypes} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
    }),
);

interface IconLabelButtonsProps {
    text?: string,
    variant?: 'text' | 'outlined' | 'contained',
    icon: any,
    color?: PropTypes.Color,
    onClick?: any
}

export default function IconLabelButtons(props: IconLabelButtonsProps) {
    const classes = useStyles();

    return (
        <Button
            disableElevation={false}
            onClick={props.onClick}
            size="small"
            variant={props.variant ? props.variant : "outlined"}
            color={props.color ? props.color : "inherit"}
            className={classes.button}
            startIcon={props.icon}
        >
            {props.text}
        </Button>
    );
}
