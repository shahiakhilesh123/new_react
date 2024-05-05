import React, {useCallback, useEffect, useRef, useState} from "react";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grow from "@material-ui/core/Grow";
import {createTheme} from '@material-ui/core/styles'
import {Box} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';
import {Formik} from "formik";
import * as yup from "yup";
import {Scrollbar} from "../CustomScroll/ScrollBars";
import dayjs from "dayjs";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"
import updateLocale from "dayjs/plugin/updateLocale"
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CloseIcon from '@material-ui/icons/Close';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import Sound from "react-sound"
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import useTheme from "@material-ui/core/styles/useTheme";
import classNames from "classnames";
import {iChatSettings, iClientChatMessage} from "../../../../../types/internal";
import v4 from "uuid/v4";
import {useChatStyles} from "./ChatStyles";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import useInterval from "use-interval";
import ChatApis, {iChatSession} from "../../../../../apis/ChatGuest/chat.client";
import useIsMounted from "ismounted";
import {Rating} from "@material-ui/lab";
import webfontloader from "webfontloader";

dayjs.extend(relativeTime)
dayjs.extend(utc)
dayjs.extend(updateLocale)
dayjs.updateLocale('en', {
    relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: 'a few seconds',
        m: "a minute",
        mm: "%d mins",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }
})


const labels: { [index: string]: string } = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};


export default function ChatController({
                                           chat_settings,
                                           preview,
                                           logo_image,
                                           guest_session,
                                           ui_testing,
                                           restart_session,
                                           ui_test_messages
                                       }: {
    chat_settings: iChatSettings,
    preview: boolean,
    logo_image: string,
    guest_session: iChatSession,
    ui_testing: boolean,
    restart_session: any,
    ui_test_messages: iClientChatMessage[]
}) {
    const chatClasses = useChatStyles(chat_settings);
    const [showChat, setShowChat] = useState<boolean>(preview);
    useEffect(() => {
        setShowChat(preview);
    }, [preview])
    const [message, setMessage] = useState<string>(ui_testing ? "Hi, I need Help!" : "");
    const [attachmentMessage, setAttachMessage] = useState<any>(ui_testing ? {
        name: "image.png",
        size: 200023
    } : undefined);


    const myRef = useRef<any>();
    const INTERVAL = 2500;

    const [isFirstTimeOpenAndFreshSession, setIsFirstTimeOpenAndFreshSession] = useState<boolean>(
        !(guest_session && guest_session.last_message)
    );

    const isMounted = useIsMounted();
    const [messages, setMessages] = useState<iClientChatMessage[]>([]);

    const [lastMessageId, setLastMessageId] = useState<number>();
    const [loadingBotMessage, setLoadingMessage] = useState<boolean>(true);
    const [currentBotWelcomeMessageIndex, setCurrentBotWelcomeMessageIndex] = useState<number>(0);
    const [currentBotRestartMessageIndex, setCurrentRestartMessageIndex] = useState<number>(0);
    const [uploadPercentage, setUploadPercentage] = useState<number>(0);
    const sessionRestartMessages: iClientChatMessage[] = [
        {
            id: Math.random(),
            uid: v4(),
            message_type: "bot_message",
            message: "Hi " + (guest_session && guest_session.name) + "!",
            from_guest: "0"
        },
        {
            id: Math.random(),
            uid: v4(),
            message_type: "bot_message",
            message: "How can we help you today!",
            from_guest: "0"
        },
    ];

    const [staticMessages, setStaticMessages] = useState<iClientChatMessage[]>([
        {
            id: Math.random(),
            uid: v4(),
            message_type: "bot_message",
            message: "Hi",
            from_guest: "0",

        },
        {
            id: Math.random(),
            uid: v4(),
            message_type: "bot_message",
            message: (chat_settings && chat_settings.welcome_message) || "Please tell us more about you.",
            from_guest: "0",
        },
        {
            id: Math.random(),
            uid: v4(),
            message_type: "email_user_form",
            message: "",
            from_guest: "0"
        },
    ])

    useEffect(() => {
        if (chat_settings.font_family) {
            webfontloader.load(
                {
                    google: {
                        families: [chat_settings.font_family]
                    }
                }
            )
        }

    }, [chat_settings])


    useEffect(() => {
        if (ui_testing) {
            setMessages(ui_test_messages);
        }
    }, [ui_testing, ui_test_messages])
    useEffect(() => {
        if (ui_testing) {
            return
        }
        if (showChat) {
            setIsFirstTimeOpenAndFreshSession(false);
        }
    }, [ui_testing, showChat])

    useInterval(() => {
        if (ui_testing) {
            return
        }
        if (chatEnded) return;
        if (!isFirstTimeOpenAndFreshSession) {
            if (!(guest_session && guest_session.last_message)
                && (currentBotRestartMessageIndex < sessionRestartMessages.length)
                && currentBotWelcomeMessageIndex < staticMessages.length
            ) {
                if (currentBotWelcomeMessageIndex < staticMessages.length &&
                    guest_session &&
                    guest_session &&
                    !guest_session.email) {
                    setLoadingMessage(true);
                    setMessages(prevState => [...prevState, staticMessages[currentBotWelcomeMessageIndex]]);
                    if (currentBotWelcomeMessageIndex >= staticMessages.length - 1) {
                        setLoadingMessage(false);
                    }
                    //setPlayNotificationMessageRecieved("PLAYING")
                    setCurrentBotWelcomeMessageIndex(prevState => prevState + 1);
                    scrollDown();

                } else if (currentBotRestartMessageIndex < sessionRestartMessages.length &&
                    guest_session &&
                    guest_session &&
                    guest_session.email) {
                    setLoadingMessage(true);
                    setMessages(prevState => [...prevState, sessionRestartMessages[currentBotRestartMessageIndex]]);
                    if (currentBotRestartMessageIndex >= sessionRestartMessages.length - 1) {
                        setLoadingMessage(false);
                    }
                    //setPlayNotificationMessageRecieved("PLAYING")
                    setCurrentRestartMessageIndex(prevState => prevState + 1);
                    scrollDown();
                }
            } else {

                setLoadingMessage(false);
                new ChatApis().read_messages(guest_session, lastMessageId).then((res) => {
                    if (isMounted.current) {
                        if (ChatApis.hasError(res)) {
                            if (res.validation_errors) {
                                if (res.validation_errors["session_ended"]) {
                                    setChatEnded(true)
                                } else {
                                    setChatEnded(false)
                                }
                            }
                        } else {
                            setChatEnded(false)
                            if (res && res.messages && res.messages.length > 0) {

                                if (res.messages && res.messages.length > 0) {
                                    let admin_message = res.messages && res.messages.find(value => {
                                        return value.from_guest === "0"
                                    });
                                    if (admin_message && messages.length !== 0)
                                        setPlayNotificationMessageRecieved("PLAYING")
                                    setMessages(prevState => [...prevState, ...res.messages]);
                                    let last_id = res.messages[res.messages.length - 1].id
                                    setLastMessageId(last_id)
                                    scrollDown();
                                }


                            }
                        }
                    }
                });
            }
        }
    }, INTERVAL, true);

    const scrollDown = useCallback(() => {
        setTimeout(() => {
            if (myRef && myRef.current) {
                //@ts-ignore
                myRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "end"
                });
            }
        }, 50)

    }, [myRef])
    const sendMessage = useCallback((message: string) => {
        if (ui_testing) return;
        setMessage("")
        new ChatApis().send_messages(message, attachmentMessage, guest_session, progressEvent => {
            try {
                const percentage = Math.round(progressEvent.loaded / progressEvent.total * 100);
                setUploadPercentage(percentage)
            } catch (e) {

            }
        }).then((res) => {
            if (isMounted.current) {
                setUploadPercentage(0)
                setAttachMessage(undefined);
                //setPlayNotificationMessageSent("PLAYING")
                if (ChatApis.hasError(res)) {

                } else {

                }
            }

        })
    }, [ui_testing, guest_session, attachmentMessage, isMounted])

    const inputFile = useRef(null)

    const [playNotificationMessageRecieved, setPlayNotificationMessageRecieved] = useState<'PLAYING' | 'STOPPED' | 'PAUSED'>("STOPPED")
    const [playNotificationMessageSent, setPlayNotificationMessageSent] = useState<'PLAYING' | 'STOPPED' | 'PAUSED'>("STOPPED")
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const [chatEnded, setChatEnded] = useState<boolean>(false);

    function chatBody() {
        return <div className={chatClasses.chatBodyMessageItemWrapper}>
            {
                messages && messages.map((message, index) => {
                    return <Box key={message.id}
                                className={chatClasses.chatBodyMessageItem}
                                alignItems={message.from_guest === "1" ? "flex-end" : "flex-start"}
                    >
                        {
                            message.from_guest === "1" &&
                            <div className={chatClasses.chatBodyMessageItemGuest}>
                                <div className={chatClasses.chatBodyMessageItemGuestText}>

                                    <AttachmentWidget chatMessage={message}/>
                                    <Typography
                                        className={chatClasses.chatBodyMessageItemGuestTextTypo}>
                                        {message.message}
                                    </Typography>
                                </div>
                                <div className={chatClasses.chatBodyMessageItemGuestInfo}>
                                    <div
                                        className={chatClasses.chatBodyMessageItemGuestInfoDate}>
                                        {
                                            message.created_at && <div
                                                className={chatClasses.chatBodyMessageItemGuestInfoDateTypo}>
                                                {
                                                    dayjs(message.created_at).utc(true).fromNow()
                                                }
                                            </div>
                                        }
                                    </div>
                                    {
                                        message.created_at !== "" && <div
                                            className={chatClasses.chatBodyMessageItemGuestInfoIcon}>
                                            {
                                                message.created_at && <DoneAllIcon
                                                    className={chatClasses.chatBodyMessageItemGuestInfoIconItem}/>
                                            }
                                            {
                                                !message.created_at && <AccessTimeIcon
                                                    className={chatClasses.chatBodyMessageItemGuestInfoIconItem}/>
                                            }
                                        </div>
                                    }
                                </div>
                            </div>
                        }

                        {
                            message.from_guest === "0" &&
                            <div className={chatClasses.chatBodyMessageItemAdmin}>
                                {
                                    message.message_type === "email_user_form" &&
                                    <div className={chatClasses.chatBodyMessageItemAdminForm}>
                                        <Formik
                                            initialValues={{
                                                email: "",
                                                name: "",
                                                submitted: false
                                            }}
                                            onSubmit={(values: any, helpers) => {
                                                if (!ui_testing) {
                                                    new ChatApis().update_form(values, guest_session).then((res) => {
                                                        if (isMounted.current) {
                                                            helpers.setSubmitting(false);
                                                            if (ChatApis.hasError(res)) {

                                                            } else {
                                                                helpers.setFieldValue("submitted", true);
                                                                setMessages(prevState => [...prevState, {
                                                                    id: Math.random(),
                                                                    uid: v4(),
                                                                    message_type: "bot_message",
                                                                    message: "Thank you for providing your details.",
                                                                    from_guest: "0"
                                                                }]);
                                                                scrollDown();

                                                            }
                                                        }
                                                    })
                                                }

                                            }}
                                            validationSchema={yup.object({
                                                email: yup
                                                    .string()
                                                    .email("Please enter valid email")
                                                    .required("Please enter email"),
                                                name: yup
                                                    .string()
                                                    .required("Please enter your name"),
                                            })}
                                        >
                                            {({
                                                  handleSubmit,
                                                  handleChange,
                                                  values,
                                                  isSubmitting,
                                                  touched,
                                                  errors,
                                                  setFieldValue
                                              }: any) => {
                                                return <form onSubmit={handleSubmit}>
                                                    <Grid container spacing={1}>
                                                        <Grid xs={12} item>
                                                            <TextField
                                                                label={"Name"}
                                                                name={"name"}
                                                                variant={"outlined"}
                                                                inputProps={
                                                                    {
                                                                        className: chatClasses.textEdit
                                                                    }
                                                                }
                                                                disabled={values.submitted}
                                                                value={values.name}
                                                                onChange={handleChange}
                                                                placeholder={"Enter your name"}
                                                                fullWidth
                                                                error={touched && touched.name && !!(
                                                                    errors && errors.name
                                                                )}
                                                                helperText={touched && touched.name && (
                                                                    errors && errors.name
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid xs={12} item>
                                                            <TextField
                                                                color={"primary"}
                                                                label={"Email"}
                                                                name={"email"}
                                                                inputProps={
                                                                    {
                                                                        className: chatClasses.textEdit
                                                                    }
                                                                }
                                                                value={values.email}
                                                                disabled={values.submitted}
                                                                onChange={handleChange}
                                                                variant={"outlined"}
                                                                placeholder={"Enter your email address"}
                                                                fullWidth
                                                                error={touched && touched.email && !!(
                                                                    errors && errors.email
                                                                )}
                                                                helperText={touched && touched.email && (
                                                                    errors && errors.email
                                                                )}

                                                            />
                                                        </Grid>
                                                        <Grid xs={12} item
                                                              justifyContent={"flex-end"}
                                                              container>
                                                            <div>
                                                                <Button variant={"contained"}
                                                                        type={"submit"}
                                                                        className={chatClasses.SubmitButton}
                                                                        disabled={isSubmitting || values.submitted}
                                                                        color={"primary"}>
                                                                    {isSubmitting && "Submitting"}
                                                                    {
                                                                        !isSubmitting && values.submitted && "Submitted"
                                                                    }
                                                                    {
                                                                        !isSubmitting && !values.submitted && "Submit"
                                                                    }
                                                                </Button>
                                                            </div>


                                                        </Grid>
                                                    </Grid>

                                                </form>;
                                            }}
                                        </Formik>

                                    </div>
                                }

                                {message.message &&
                                <div className={chatClasses.chatBodyMessageItemAdminText}>

                                    <AttachmentWidget chatMessage={message}/>

                                    <Typography
                                        className={chatClasses.chatBodyMessageItemAdminTextTypo}>
                                        {message.message}

                                    </Typography>

                                    <div
                                        className={chatClasses.chatBodyMessageItemAdminTextAfter}/>
                                </div>
                                }
                                {
                                    message.message_type === "end_chat" &&
                                    <div className={chatClasses.chatBodyMessageItemAdminForm}>
                                        <Formik
                                            initialValues={{
                                                submitted: false,
                                                yes: false,
                                                feedback_stars: 5,
                                                hover_feedback_stars: -1,
                                                feedback_text: ""
                                            }}
                                            onSubmit={(values: any, helpers) => {


                                            }}
                                            validationSchema={yup.object({})}
                                        >
                                            {({
                                                  handleSubmit,
                                                  handleChange,
                                                  values,
                                                  isSubmitting,
                                                  touched,
                                                  errors,
                                                  setFieldValue
                                              }: any) => {
                                                return <form onSubmit={handleSubmit}>
                                                    <Grid container spacing={1}>
                                                        {
                                                            !values.submitted &&
                                                            <Grid xs={12} item
                                                                  justifyContent={"flex-end"}
                                                                  container>
                                                                <div style={{
                                                                    display: "flex",
                                                                    marginTop: "8px"
                                                                }}>
                                                                    <Button
                                                                        variant={"contained"}
                                                                        type={"button"}
                                                                        className={chatClasses.SubmitButton}
                                                                        disabled={values.submitted}
                                                                        color={"primary"}
                                                                        onClick={() => {
                                                                            setMessages(prevState => [...prevState, {
                                                                                message_type: undefined,
                                                                                message: "No",
                                                                                uid: v4(),
                                                                                id: Math.random(),
                                                                                updated_at: "",
                                                                                created_at: "",
                                                                                from_guest: "1",
                                                                                status: ""
                                                                            }]);
                                                                            scrollDown();

                                                                        }}
                                                                    >
                                                                        No
                                                                    </Button>
                                                                    <div
                                                                        style={{padding: "8px"}}>

                                                                    </div>
                                                                    <Button
                                                                        variant={"contained"}
                                                                        type={"button"}
                                                                        className={chatClasses.SubmitButton}
                                                                        disabled={values.submitted}
                                                                        color={"primary"}
                                                                        onClick={() => {
                                                                            setMessages(prevState => [...prevState, {
                                                                                message_type: undefined,
                                                                                message: "Yes",
                                                                                uid: v4(),
                                                                                id: Math.random(),
                                                                                updated_at: "",
                                                                                created_at: "",
                                                                                from_guest: "1",
                                                                                status: ""
                                                                            }, {
                                                                                message_type: "feedback",
                                                                                message: "",
                                                                                uid: v4(),
                                                                                id: Math.random(),
                                                                                updated_at: "",
                                                                                created_at: "",
                                                                                from_guest: "0",
                                                                                status: ""
                                                                            }]);
                                                                            scrollDown();
                                                                        }}
                                                                    >
                                                                        Yes
                                                                    </Button>
                                                                </div>

                                                            </Grid>
                                                        }
                                                    </Grid>

                                                </form>;
                                            }}
                                        </Formik>

                                    </div>
                                }
                                {
                                    message.message_type === "feedback" &&
                                    <div className={chatClasses.chatBodyMessageItemAdminForm}>
                                        <Formik
                                            initialValues={{
                                                submitted: false,
                                                feedback_stars: 5,
                                                hover_feedback_stars: -1,
                                                feedback_text: ""
                                            }}
                                            onSubmit={(values: any, helpers) => {

                                            }}
                                            validationSchema={yup.object({})}
                                        >
                                            {({
                                                  handleSubmit,
                                                  handleChange,
                                                  values,
                                                  isSubmitting,
                                                  touched,
                                                  errors,
                                                  setFieldValue
                                              }: any) => {
                                                return <form onSubmit={handleSubmit}>
                                                    <Grid container spacing={1}>
                                                        {
                                                            !values.submitted &&
                                                            <Grid xs={12} item
                                                                  justifyContent={"flex-end"}
                                                                  container>

                                                                <div style={{marginTop: "8px"}}>
                                                                    <Typography
                                                                        className={chatClasses.rateUsText}>Rate
                                                                        us</Typography>
                                                                    <div
                                                                        className={chatClasses.ratingWrapper}>

                                                                        <Rating
                                                                            name="hover-feedback"
                                                                            value={values.feedback_stars}
                                                                            precision={1}
                                                                            onChange={(event, newValue) => {
                                                                                setFieldValue("feedback_stars", newValue);
                                                                            }}
                                                                            onChangeActive={(event, newHover) => {
                                                                                setFieldValue("hover_feedback_stars", newHover);
                                                                            }}

                                                                        />
                                                                        {values.feedback_stars !== null &&
                                                                        <Box
                                                                            className={chatClasses.ratingText}
                                                                            ml={2}>{labels[values.hover_feedback_stars !== -1 ? values.hover_feedback_stars : values.feedback_stars]}</Box>}
                                                                    </div>
                                                                    <TextField
                                                                        variant={"standard"}
                                                                        fullWidth
                                                                        name="feedback_text"
                                                                        placeholder={"Type your feedback message"}
                                                                        inputProps={{
                                                                            className: chatClasses.chatFooterInputBox,
                                                                        }}
                                                                        value={values.feedback_text}
                                                                        onChange={handleChange}
                                                                    />
                                                                    <Button
                                                                        variant={"contained"}
                                                                        type={"button"}
                                                                        className={`${chatClasses.SubmitButton}`}
                                                                        disabled={values.submitted}
                                                                        color={"primary"}
                                                                        onClick={() => {
                                                                            if (!ui_testing) {
                                                                                setMessages(prevState => [...prevState, {
                                                                                    message_type: undefined,
                                                                                    message: "Rating :" + values.feedback_stars + " \n " + values.feedback_text,
                                                                                    uid: v4(),
                                                                                    id: Math.random(),
                                                                                    updated_at: "",
                                                                                    created_at: "",
                                                                                    from_guest: "1",
                                                                                    status: ""
                                                                                }]);
                                                                                scrollDown();

                                                                                new ChatApis().end_session(guest_session, values.feedback_stars, values.feedback_text).then((res) => {
                                                                                    if (isMounted.current) {
                                                                                        if (ChatApis.hasError(res)) {

                                                                                        } else {
                                                                                            setFieldValue("submitted", true);
                                                                                            setMessages(prevState => [...prevState, {
                                                                                                id: Math.random(),
                                                                                                uid: v4(),
                                                                                                message_type: "bot_message",
                                                                                                message: "Thank you for chatting with us!",
                                                                                                from_guest: "0"
                                                                                            }]);
                                                                                            scrollDown();
                                                                                            setShowChat(false)

                                                                                        }
                                                                                    }
                                                                                });
                                                                            }
                                                                        }}
                                                                    >
                                                                        Submit Feedback
                                                                    </Button>
                                                                </div>


                                                            </Grid>
                                                        }
                                                    </Grid>

                                                </form>;
                                            }}
                                        </Formik>

                                    </div>
                                }
                                {
                                    (message.message_type !== "email_user_form" &&
                                        message.message_type !== "bot_message" &&
                                        message.message_type !== "end_chat" &&
                                        message.message_type !== "feedback"
                                    ) && <>
                                        <div
                                            className={chatClasses.chatBodyMessageItemAdminInfoDate}>
                                            {
                                                message.created_at !== "" && <Typography
                                                    className={chatClasses.chatBodyMessageItemAdminInfoDateTypo}>
                                                    {
                                                        dayjs(message.created_at).utc(true).fromNow()
                                                    }
                                                </Typography>
                                            }
                                        </div>
                                        <div
                                            className={chatClasses.chatBodyMessageItemAdminInfo}>
                                            <div
                                                className={chatClasses.chatBodyMessageItemAdminSenderInfo}>
                                                <img alt=""
                                                     src={logo_image}
                                                     className={chatClasses.chatBodyMessageItemAdminSenderImageInfo}/>
                                            </div>
                                            <div
                                                className={chatClasses.chatBodyMessageItemAdminSenderInfoName}>
                                                <Typography
                                                    className={chatClasses.chatBodyMessageItemAdminSenderInfoNameTypo}>
                                                    {
                                                        chat_settings.bot_name
                                                    }

                                                </Typography>
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>
                        }
                    </Box>
                })
            }

            {
                (loadingBotMessage) &&
                <Box
                    className={chatClasses.chatBodyMessageItem}
                    alignItems={"flex-start"}
                >
                    <div>
                        <Box>
                            <Loader
                                type="ThreeDots"
                                color={chat_settings.primary_background_color}
                                height={40}
                                width={40}
                            />
                        </Box>
                    </div>
                </Box>
            }
            <div ref={myRef}/>
        </div>
    }

    return <ThemeProvider theme={createTheme({
        ...{
            typography: {
                fontFamily: 'FuturaPT',
                fontSize: "14px",
                subtitle1: {
                    color: "black"
                },
                htmlFontSize: 14,
                body1: {
                    fontSize: "18px",
                },
                button: {
                    textTransform: "capitalize"
                },
            },
            palette: {
                primary: {
                    main: chat_settings.primary_background_color,
                    dark: chat_settings.primary_background_color,
                    contrastText: chat_settings.primary_text_color,
                },
                secondary: {
                    main: chat_settings.secondary_background_color,
                    contrastText: chat_settings.secondary_text_color,
                },
            },
        },
        typography: {
            htmlFontSize: 14,
            fontFamily: chat_settings.font_family,
        },
    })}>
        <div
            data-tut="reactour__chat-widget"
            className={classNames("ew-chat-widget", !isMobile ? chatClasses.root : showChat ? chatClasses.mobileChatOpenRoot : chatClasses.root)}
            style={{pointerEvents: showChat ? "all" : "none"}}>
            <Sound
                url={"https://dashboard.emailwish.com/sounds/client_message_recieved.mp3"}
                playStatus={playNotificationMessageRecieved}
                loop={false}
                onFinishedPlaying={() => {
                    setPlayNotificationMessageRecieved("STOPPED")
                }}

            />
            <Sound
                url={"https://dashboard.emailwish.com/sounds/client_message_send.wav"}
                playStatus={playNotificationMessageSent}
                loop={false}
                onFinishedPlaying={() => {
                    setPlayNotificationMessageSent("STOPPED")
                }}
            />
            <Grow in={showChat} timeout={100}>
                <div className={chatClasses.chatWindow}>
                    <div className={chatClasses.chatWindowInnerWrapper}>
                        <div className={chatClasses.chatWindowHeader}>
                            <div className={chatClasses.chatWindowHeader_1}>
                                <img src={
                                    logo_image
                                } className={chatClasses.chatHeaderImage} alt={"user"}/>
                                <Box flexGrow={1} p={1} paddingLeft={2}>
                                    <Typography gutterBottom={false}
                                                className={`${chatClasses.chatHeaderName}`}>
                                        {chat_settings.bot_name}
                                    </Typography>

                                    <Box display={"flex"} alignItems={"center"}>
                                        <Box marginRight={1}>
                                            <Typography className={chatClasses.chatHeaderStatusText}>
                                                Active
                                            </Typography>
                                        </Box>
                                        <div className={chatClasses.chatHeaderActiveIcon}>
                                        </div>

                                    </Box>
                                </Box>
                                <Box display="flex">
                                    {
                                        !chatEnded && <IconButton

                                            onClick={() => {

                                                if (messages && messages.length > 0 && messages[messages.length - 1].message_type !== "feedback") {
                                                    if (messages.find(value => {
                                                        return value.from_guest === "1"
                                                    })) {
                                                        setMessages(prevState => [...prevState, {
                                                            message_type: "feedback",
                                                            message: "",
                                                            uid: v4(),
                                                            id: Math.random(),
                                                            updated_at: "",
                                                            created_at: "",
                                                            from_guest: "0",
                                                            status: ""
                                                        }]);
                                                        scrollDown();
                                                    } else {
                                                        setShowChat(false)
                                                    }
                                                }

                                            }}

                                            className={chatClasses.chatWindowHeader_endChatButton}

                                        >
                                            <CloseIcon className={chatClasses.chatHeaderExpandIcon}/>
                                        </IconButton>
                                    }
                                    <IconButton
                                        onClick={() => {
                                            setShowChat(false);
                                            setTimeout(function delay() {
                                            }, 100);
                                        }}
                                        className={chatClasses.chatWindowHeader_endChatButton}
                                    >

                                        <ExpandMoreIcon
                                            className={chatClasses.chatHeaderExpandIcon}/>
                                    </IconButton>
                                </Box>
                            </div>

                            <div className={chatClasses.chatWindowHeader_InfoWrapper}>
                                <Typography align={"left"}
                                            className={`${chatClasses.chatWindowHeader_Info_type}`}>
                                    {chat_settings.info_message}
                                </Typography>
                                {
                                    chatEnded && <Button
                                        className={chatClasses.chatWindowHeader_restartChatButton}
                                        onClick={() => {
                                            restart_session();
                                            setChatEnded(false);
                                        }}
                                    >
                                        Restart Chat
                                    </Button>
                                }
                            </div>
                        </div>
                        <div className={chatClasses.chatBody}>
                            {
                                isMobile && <div style={{height: "100%", overflowY: "auto"}}>
                                    {
                                        chatBody()
                                    }
                                </div>
                            }
                            {
                                !isMobile && <Scrollbar style={{height: "100%"}}>
                                    {
                                        chatBody()
                                    }
                                </Scrollbar>
                            }


                        </div>
                        <div className={chatClasses.chatFooter}>
                            {
                                attachmentMessage && <div className={chatClasses.chatFooterInputAttachment}>
                                    <div className={chatClasses.chatFooterInputAttachmentTextWrapper}>
                                        <div>
                                            <Typography className={chatClasses.chatFooterInputAttachmentText}>
                                                {
                                                    attachmentMessage.name
                                                }
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography className={chatClasses.chatFooterInputAttachmentFileSize}>
                                                {(parseFloat((attachmentMessage.size / 1024).toString())).toFixed(2)} KB
                                            </Typography>

                                        </div>
                                    </div>


                                    <div className={chatClasses.chatFooterInputAttachment}>
                                        <div>
                                            <IconButton onClick={() => {
                                                setAttachMessage(undefined)
                                            }}>
                                                <CloseIcon/>
                                            </IconButton>
                                        </div>

                                    </div>
                                </div>

                            }
                            {
                                uploadPercentage > 0 && <div>
                                    <LinearProgress variant="determinate" value={50}/>
                                </div>
                            }
                            {
                                !chatEnded && <div className={chatClasses.chatFooterInput}>
                                    <input type='file' id='file'
                                           onChange={(e: any) => {
                                               e.target && e.target.files && e.target.files.length > 0 && setAttachMessage(e.target.files[0]);
                                           }}
                                           accept={".png,.jpg,.jpeg"} ref={inputFile} style={{display: 'none'}}/>

                                    <TextField
                                        variant={"standard"}
                                        fullWidth
                                        placeholder={"Type a message"}
                                        inputProps={{
                                            className: chatClasses.chatFooterInputBox,
                                        }}
                                        value={message}
                                        onChange={event => {
                                            if (ui_testing) {
                                                return;
                                            }
                                            setMessage(event.target.value);
                                        }}
                                        onKeyPress={event => {
                                            if (ui_testing) {
                                                return;
                                            }
                                            if (event.key === "Enter") {
                                                sendMessage(message);
                                            }
                                        }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    {
                                                        !attachmentMessage && message.trim().length === 0 &&
                                                        <Grow in={message.trim().length === 0} unmountOnExit>
                                                            <IconButton onClick={() => {
                                                                // `current` points to the mounted file input element
                                                                // @ts-ignore
                                                                inputFile.current.click();
                                                            }}>
                                                                <AttachFileIcon
                                                                    className={chatClasses.chatFooterInputIcon}/>
                                                            </IconButton>
                                                        </Grow>
                                                    }
                                                    {
                                                        (message.trim().length !== 0 || attachmentMessage) &&
                                                        <Grow in={message.trim().length !== 0 || attachmentMessage}
                                                              mountOnEnter>
                                                            <IconButton onClick={() => {
                                                                sendMessage(message);
                                                            }} disabled={uploadPercentage !== 0}>
                                                                <SendIcon className={chatClasses.chatFooterInputIcon}/>
                                                            </IconButton>
                                                        </Grow>
                                                    }
                                                </InputAdornment>
                                            ),
                                            className: chatClasses.chatFooterInputBoxInputAdornment,

                                            disableUnderline: true
                                        }}
                                    />
                                </div>
                            }
                            <div>
                                <a href={"https://www.emailwish.com/"} target={"_blank"} rel="noopener noreferrer"
                                   className={chatClasses.chatFooterTextLink}
                                >
                                    <div>
                                        <img className={chatClasses.chatFooterTextImage}
                                             src={"https://dashboard.emailwish.com/assets/widgets/dist/assets/images/ew-logo-small.png"}
                                             alt={"Emailwish logo"}/>
                                    </div>
                                    {
                                        !chat_settings.hide_branding && <div>
                                            <Typography className={chatClasses.chatFooterText}>We run on
                                                EmailWish</Typography>
                                        </div>
                                    }
                                </a>
                            </div>
                        </div>
                    </div>
                </div>


            </Grow>
            {
                (!showChat || !isMobile) && <div className={chatClasses.chatButtonWrapper}>
                    <div className={chatClasses.chatButton} onClick={() => {
                        setShowChat(prevState => !prevState);
                        setTimeout(function delay() {
                        }, 100);
                    }}>
                        {
                            !showChat && <ChatBubbleIcon className={chatClasses.chatIcon}/>
                        }

                        {
                            showChat && <ExpandMoreIcon className={chatClasses.chatIconMin}/>
                        }
                    </div>
                </div>
            }

        </div>
    </ThemeProvider>
}


export const AttachmentWidget = (props: { chatMessage: iClientChatMessage }) => {
    const {chatMessage} = props;
    if (!chatMessage.attachment_full_url) return null;
    if (chatMessage && chatMessage.attachment_mime_type && chatMessage.attachment_mime_type.startsWith("image")) {
        return <a href={chatMessage.attachment_full_url} target="_blank" rel="noopener noreferrer">
            <img alt="attachment" src={chatMessage.attachment_full_url} style={{width: 250, height: "auto"}}/>
            <br/>
            <Typography style={{color: "white"}}>
                Size: {chatMessage.attachment_size}
            </Typography>
        </a>
    }
    return <a href={chatMessage.attachment_full_url} target="_blank" rel="noopener noreferrer">
        <Typography>
            Attachment Size: {chatMessage.attachment_size}
        </Typography>
    </a>
}
