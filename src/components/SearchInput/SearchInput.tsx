import React from 'react';
import clsx from 'clsx';
import {makeStyles} from '@material-ui/styles';
import {Input, Paper} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles((theme: any) => ({
    root: {
        borderRadius: '4px',
        alignItems: 'center',
        padding: theme.spacing(1),
        display: 'flex',
        flexBasis: 420
    },
    icon: {
        marginRight: theme.spacing(1),
        color: theme.palette.text.secondary
    },
    input: {
        flexGrow: 1,
        fontSize: '14px',
        lineHeight: '16px',
        letterSpacing: '-0.05px'
    }
}));

const SearchInput = (props: any) => {
    const {className, onChange, style, ...rest} = props;

    const classes = useStyles();

    return (
        <Paper
            {...rest}
            className={clsx(classes.root, className)}
            style={style}
        >
            <SearchIcon className={classes.icon}/>
            <Input
                {...rest}
                className={classes.input}
                disableUnderline
                onChange={onChange}
            />
        </Paper>
    );
};


export default SearchInput;
