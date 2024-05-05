import React, {useContext} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CloseIcon from '@material-ui/icons/Close';
import {IconButton} from "@material-ui/core";
import ChatWindow from "./ChatWindow";
import {AppChatStateContext} from "../../pages/Chats/Chats.Home";

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;

}

function TabPanel(props: any) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-auto-tabpanel-${index}`}
            aria-labelledby={`scrollable-auto-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: any) {
    return {
        id: `scrollable-auto-tab-${index}`,
        'aria-controls': `scrollable-auto-tabpanel-${index}`,
    };
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: "#ffffff",
    },
    tab: {
        display: "flex",
        alignItems: "center",
        paddingRight: "12px",
        cursor: "pointer"
    },
    tabActive: {
        background: "#fff",
    },
    appbar: {
        padding: 0,
        boxShadow: "none",
        borderBottom: "1px solid #eee",
    },
    tabPanel: {
        padding: "10px"
    },
    closeIcon: {
        color: theme.palette.primary.main
    },
    header_name: {
        fontSize: "12px",
        textTransform: "capitalize"
    }
}));


export default function ChatBodyPanel() {
    const {closeSession, open_session, active_sessions, openSession} = useContext(AppChatStateContext)

    const classes = useStyles();
    return (
        <div className={classes.root}>
            {
                open_session && <>
                    <AppBar position="static" color="transparent" className={classes.appbar}>
                        <Tabs
                            value={active_sessions.findIndex((e => {
                                return open_session.id === e.id
                            }))}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="on"
                            aria-label="scrollable auto "

                        >
                            {
                                active_sessions && active_sessions.length > 0 && active_sessions.map((session) => {
                                    return <div className={`${classes.tab}`} key={session.id} onClick={() => {
                                        console.log("103")
                                        openSession(session)
                                    }}>
                                        <div
                                            style={{width: "100px"}}
                                            className={`${session.id === open_session.id && classes.tabActive}`}
                                            {...a11yProps(session.id)}
                                            key={session.id}>
                                            <div>
                                                <Typography color="primary" className={classes.header_name} noWrap>
                                                    #{session.id} {session.name}
                                                </Typography>
                                            </div>
                                        </div>
                                        <div>
                                            <IconButton onClick={(e) => {
                                                e.stopPropagation();
                                                closeSession(session);

                                            }}>
                                                <CloseIcon color="primary"/>
                                            </IconButton>
                                        </div>
                                    </div>

                                })
                            }
                        </Tabs>

                    </AppBar>

                    {open_session && active_sessions.map((session, index) =>
                        <TabPanel
                            value={active_sessions.findIndex((e => {
                                return open_session.id === e.id
                            }))} index={index} key={session.id.toString()}>
                            <ChatWindow
                                key={session.ended_at + session.id.toString()}
                                session={session}
                            />
                        </TabPanel>
                    )}


                </>}
            {
                !open_session && <div style={{width: "100%", height: "100%", paddingTop: 22, textAlign: "center"}}>
                    <h5 className='app-info-text'>Select a session from left to begin chat</h5>
                </div>
            }
        </div>
    );
}
