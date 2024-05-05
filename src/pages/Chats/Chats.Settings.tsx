import * as React from "react";
import {useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";
import {Button, Checkbox, FormControlLabel, Grid, IconButton, Typography} from "@material-ui/core";
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import AppCard from "../../components/Card/AppCard";
import AppCardBody from "../../components/Card/AppCardBody";
import ChatAPIs, {iChatSettingsResponse} from "../../apis/chat.apis";
import FontPicker from "font-picker-react";
import {Reducer} from "redux";
import {
    failed_block_action_response,
    iResource,
    iResponseActions,
    loading_action_response,
    responseReducer,
    success_action_response
} from "../../redux/reducers";
import useIsMounted from "ismounted";
import AppLoader from "../../components/Loader/AppLoader";
import {AppStateContext, NotificationContext} from "../../App";
import HeadingCol from "../../components/heading/HeadingCol";
import ChatController from "../../components/ChatClient/chat/components/chat/Chat.Controller";
import {Formik} from "formik";
import * as yup from "yup";
import ColorSketchPicker from "../../components/ColorPicker/colorPicker";
import FormGroup from "../../components/FormGroup/CustomFormGroup";
import {HideBetterDoc, hideChat, ShowBetterDoc, ShowEWChat} from "../../components/common";
import {HandleErrors} from "../../components/helper/form.helper";
import UserAPIs from "../../apis/user.apis";
import v4 from "uuid/v4";
import HtmlTooltip from "../../components/Tooltip/HtmlTooltip";
import InfoIcon from '@material-ui/icons/Info';
import UpgradePlanRequired from "../../components/UpgradePlanWrapper/UpgradePlanWrapper";

function ChatsSettings() {
    useEffect(() => {
        document.title = "Chat settings | Emailwish";
    }, []);
    const [{
        response,
        error,
        loading,
        error_block
    }, dispatchResponse] = useReducer<Reducer<iResource<iChatSettingsResponse>, iResponseActions<iChatSettingsResponse>>>
    (responseReducer<iResource<iChatSettingsResponse>, any>({}), {loading: true});
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);
    useEffect(() => {
        fetchSettings();
    }, []);
    const [fonts, setFonts] = useState({
        activeFontFamily: "Open Sans"
    });

    const fetchSettings = useCallback(() => {
        dispatchResponse(loading_action_response())
        new ChatAPIs().settings().then(response => {
            if (isMounted.current) {
                if (ChatAPIs.hasError(response, notificationContext)) {
                    dispatchResponse(failed_block_action_response(response.message))
                } else {
                    dispatchResponse(success_action_response(response))
                }
            }
        })
    }, [isMounted]);

    const ref = useRef<any>();

    const [image, setImage] = useState({preview: "", raw: ""});
    const inputRef = useRef([]);
    useEffect(() => {
        HideBetterDoc();
        hideChat()
        return () => {
            ShowBetterDoc();
            ShowEWChat();
        }
    }, [])
    if (loading) {
        return <AppLoader/>
    }
    if (error_block) {
        return <Alert>{error_block}</Alert>
    }
    if (!response || !response.chat_settings) return <AppLoader/>
    const {chat_settings} = response;

    return <Grid container spacing={2} justifyContent="space-between" className="mt-2 widget-setting">

        <Grid item md={12} sm={12}>
            <Formik
                validateOnChange={false}
                initialValues={{
                    welcome_message: (response.chat_settings && response.chat_settings.welcome_message) || "Please provide some info so that we can reach you.",
                    info_message: (response.chat_settings && response.chat_settings.info_message) || "",
                    bot_name: (response.chat_settings && response.chat_settings.bot_name) || "",
                    bot_image_file: "",
                    offline_message: (response.chat_settings && response.chat_settings.offline_message) || "",
                    bot_image: (response.chat_settings && response.chat_settings.bot_image) || "",
                    primary_background_color: (response.chat_settings && response.chat_settings.primary_background_color) || "",
                    primary_text_color: (response.chat_settings && response.chat_settings.primary_text_color) || "",
                    secondary_background_color: (response.chat_settings && response.chat_settings.secondary_background_color) || "",
                    secondary_text_color: (response.chat_settings && response.chat_settings.secondary_text_color) || "",
                    font_family: (response.chat_settings && response.chat_settings.font_family) || "Open Sans",
                    guest_message_background_color: (response.chat_settings && response.chat_settings.guest_message_background_color) || "",
                    guest_message_text_color: (response.chat_settings && response.chat_settings.guest_message_text_color) || "",
                    admin_message_background_color: (response.chat_settings && response.chat_settings.admin_message_background_color) || "",
                    admin_message_text_color: (response.chat_settings && response.chat_settings.admin_message_text_color) || "",
                    hide_branding: (response.chat_settings && response.chat_settings.hide_branding) || false,
                    input_background_color: (response.chat_settings && response.chat_settings.input_background_color) || "",
                    input_text_color: (response.chat_settings && response.chat_settings.input_text_color) || "",
                    file_sharing_enabled: (response.chat_settings && response.chat_settings.file_sharing_enabled) || false,
                    preview: true
                }}
                onSubmit={(values: any, helpers) => {

                    new ChatAPIs().store_settings(values).then(response => {
                        if (isMounted.current) {
                            helpers.setSubmitting(false)
                            if (ChatAPIs.hasError(response, notificationContext)) {
                                if (!HandleErrors(response, helpers)) {
                                    dispatchResponse(failed_block_action_response(response.message))
                                }
                            } else {
                            }
                        }

                    })
                }}
                validationSchema={yup.object({
                    info_message: yup
                        .string()
                        .required("Please enter info text"),
                    bot_name: yup
                        .string()
                        .required("Please enter chat agent name"),
                    offline_message: yup
                        .string()
                        .required("Please enter offline message"),

                    primary_background_color: yup
                        .string()
                        .required("Please enter primary background color"),
                    primary_text_color: yup
                        .string()
                        .required("Please enter primary text color"),
                    secondary_background_color: yup
                        .string()
                        .required("Please enter secondary background color"),
                    secondary_text_color: yup
                        .string()
                        .required("Please enter secondary text color"),
                    guest_message_background_color: yup
                        .string()
                        .required("Please enter secondary text color"),
                    guest_message_text_color: yup
                        .string()
                        .required("Please enter secondary text color"),
                    admin_message_background_color: yup
                        .string()
                        .required("Please enter secondary text color"),
                    admin_message_text_color: yup
                        .string()
                        .required("Please enter secondary text color"),
                    input_background_color: yup
                        .string()
                        .required("Please enter secondary text color"),
                    input_text_color: yup
                        .string()
                        .required("Please enter secondary text color"),
                    font_family: yup
                        .string().required("Please select font family"),
                    bot_image_file: yup
                        .mixed().test('fileSize', "Image is too large", value => {
                            if (!value) return true;
                            return value && value.size < (1024 * 1024)
                        }),

                    preview: yup
                        .boolean(),
                })}
            >
                {({
                      handleSubmit,
                      handleChange,
                      values,
                      isSubmitting,
                      setFieldTouched,
                      touched,
                      errors,
                      setFieldValue
                  }: any) => {
                    return <>
                        <form onSubmit={handleSubmit}>
                            <Row>
                                <HeadingCol title="Chat Widget Settings"
                                            description={""}/>
                            </Row>

                            <Grid container spacing={1}>
                                <Grid item xs={8}>
                                    <AppCard>
                                        <AppCardBody>
                                            <Row className="row">
                                                <Col md={12}>
                                                    <Row>
                                                        <Col md={3}>
                                                            <Row>
                                                                <Col md={12}>
                                                                    <div
                                                                        className="w-100">
                                                                        <div className="chat-settings-photo"
                                                                             data-tut="reactour__chat_settings_photo">
                                                                            <div className="chat-settings-photo__image">
                                                                                <div>
                                                                                    {
                                                                                        image && image.preview &&
                                                                                        <img src={image.preview}
                                                                                             alt="profile"/>
                                                                                    }
                                                                                    {
                                                                                        (!image || !image.preview) &&
                                                                                        <img
                                                                                            src={response.chat_settings && response.chat_settings.bot_image}
                                                                                            alt="avatar"/>

                                                                                    }
                                                                                </div>
                                                                                <span style={{
                                                                                    paddingLeft: "8px",
                                                                                    fontSize: "12px",
                                                                                    textAlign: "left",
                                                                                    display: "flex",
                                                                                    alignItems: "center",
                                                                                    justifyItems: "end"
                                                                                }}>
                                                                                            Max Size 1MB <br/>
                                                                                                250px250px
                                                                                    </span>


                                                                            </div>

                                                                            <Form.Group className="m-0">
                                                                                <input

                                                                                    // @ts-ignore
                                                                                    ref={el => inputRef.current[0] = el}
                                                                                    type="file"
                                                                                    id="upload-button"
                                                                                    style={{display: "none"}}
                                                                                    onChange={(e: any) => {
                                                                                        if (e.target.files.length) {

                                                                                            setFieldValue("bot_image_file", e.target.files[0])
                                                                                            setImage({
                                                                                                preview: URL.createObjectURL(e.target.files[0]),
                                                                                                raw: e.target.files[0]
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                />
                                                                                <Form.Control hidden
                                                                                              isInvalid={
                                                                                                  touched &&
                                                                                                  touched.bot_image_file &&
                                                                                                  !!(errors &&
                                                                                                      errors.bot_image_file)
                                                                                              }/>
                                                                                <Form.Control.Feedback
                                                                                    className="text-center"
                                                                                    type="invalid">
                                                                                    {errors && errors.bot_image_file}
                                                                                </Form.Control.Feedback>
                                                                            </Form.Group>

                                                                            <div
                                                                                className="chat-settings-photo__button">
                                                                                <Button color="secondary"
                                                                                        variant="contained"
                                                                                        type="button"
                                                                                        style={{width: "100%"}}
                                                                                        className="mt-1"
                                                                                        onClick={() => {
                                                                                            setFieldTouched("bot_image_file", true)
                                                                                            // @ts-ignore
                                                                                            inputRef.current[0].click()
                                                                                        }}>
                                                                                    Change
                                                                                </Button>
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                        <Col md={9}>
                                                            <Row>

                                                                <Col md={6}>
                                                                    <FormGroup
                                                                        formGroupProps={{"data-tut": "reactour__chat_settings_info_message"}}
                                                                        onChange={handleChange}
                                                                        type="text"
                                                                        name="info_message"
                                                                        label="Info Message"
                                                                        errors={errors}
                                                                        touched={touched}
                                                                        values={values}
                                                                        placeholder=""
                                                                    />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <FormGroup
                                                                        formGroupProps={{"data-tut": "reactour__chat_settings_bot_name"}}
                                                                        onChange={handleChange}
                                                                        type="text"
                                                                        name="bot_name"
                                                                        label="Agent Name"
                                                                        errors={errors}
                                                                        touched={touched}
                                                                        values={values}
                                                                        placeholder=""
                                                                    />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <FormGroup
                                                                        formGroupProps={{"data-tut": "reactour__chat_settings_offline_message"}}
                                                                        onChange={handleChange}
                                                                        type="text"
                                                                        name="offline_message"
                                                                        label="Offline Message"
                                                                        errors={errors}
                                                                        touched={touched}
                                                                        values={values}
                                                                        placeholder=""
                                                                    />
                                                                </Col>
                                                                <Col md={6}>
                                                                    <FormGroup
                                                                        formGroupProps={{"data-tut": "reactour__chat_settings_welcome_message"}}
                                                                        onChange={handleChange}
                                                                        type="text"
                                                                        name="welcome_message"
                                                                        label="Welcome Message"
                                                                        errors={errors}
                                                                        touched={touched}
                                                                        values={values}
                                                                        placeholder=""
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Row>
                                                </Col>

                                                <Col md={12} className="mt-3">

                                                    <Row>
                                                        <Col md={12}>
                                                            <Form.Group className="m-0">
                                                                <Form.Label>
                                                                    Colors
                                                                </Form.Label>
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_primary_background_color">
                                                                <Form.Label>
                                                                    Primary Background color
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.primary_background_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("primary_background_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_primary_text_color">
                                                                <Form.Label>
                                                                    Primary text/icon color
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.primary_text_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("primary_text_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_secondary_background_color">
                                                                <Form.Label>
                                                                    Secondary background color
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.secondary_background_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("secondary_background_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_secondary_text_color">
                                                                <Form.Label>
                                                                    Secondary text color
                                                                </Form.Label>
                                                                <ColorSketchPicker

                                                                    defaultValue={values.secondary_text_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("secondary_text_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>

                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_guest_message_background_color">
                                                                <Form.Label>
                                                                    Guest message background
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.guest_message_background_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("guest_message_background_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_guest_message_text_color">
                                                                <Form.Label>
                                                                    Guest message text
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.guest_message_text_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("guest_message_text_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_admin_message_background_color">
                                                                <Form.Label>
                                                                    Admin message background
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.admin_message_background_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("admin_message_background_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_admin_message_text_color">
                                                                <Form.Label>
                                                                    Admin message text
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.admin_message_text_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("admin_message_text_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_input_background_color">
                                                                <Form.Label>
                                                                    Input background
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.input_background_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("input_background_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group
                                                                data-tut="reactour__chat_settings_input_text_color">
                                                                <Form.Label>
                                                                    Input text/icon
                                                                </Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={values.input_text_color}
                                                                    onChange={(v) => {
                                                                        setFieldValue("input_text_color", v);
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group data-tut="reactour__chat_settings_font_family">
                                                                <Form.Label>
                                                                    Font Family </Form.Label>
                                                                <div>
                                                                    <FontPicker
                                                                        ref={ref}
                                                                        apiKey={process.env.REACT_APP_FONT_API_KEY || ""}
                                                                        activeFontFamily={values.font_family}
                                                                        onChange={(nextFont) => {
                                                                            setFieldValue("font_family", nextFont.family);
                                                                        }}
                                                                    >
                                                                        {
                                                                            (d: any) => {
                                                                            }
                                                                        }

                                                                    </FontPicker>
                                                                </div>
                                                            </Form.Group>
                                                        </Col>

                                                    </Row>

                                                </Col>
                                                <Col md={12}>
                                                    <Row className="justify-content-md-center">
                                                        <Form.Group data-tut="reactour__chat_settings_file_sharing_enabled">
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    color="primary"
                                                                    checked={values.file_sharing_enabled}
                                                                    onChange={(e: any) => {
                                                                        setFieldValue("file_sharing_enabled", e.target.checked)
                                                                    }} name="file_sharing_enabled"/>}

                                                                label="Allow File Sharing"
                                                            />
                                                            <Form.Control
                                                                name="file_sharing_enabled"
                                                                hidden
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.file_sharing_enabled &&
                                                                    errors &&
                                                                    !!errors.file_sharing_enabled
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.file_sharing_enabled}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Form.Group data-tut="reactour__chat_settings_hide_branding">
                                                            <UpgradePlanRequired feature_name="hide_branding" plan_required_text="Upgrade Plan">
                                                                <FormControlLabel
                                                                    control={<Checkbox
                                                                        color="primary"
                                                                        checked={values.hide_branding}
                                                                        onChange={(e: any) => {
                                                                            console.log(values.hide_branding);
                                                                            setFieldValue("hide_branding", e.target.checked)
                                                                        }} name="hide_branding"
                                                                        />}

                                                                    label="Hide Branding"
                                                                />
                                                            </UpgradePlanRequired>

                                                            <Form.Control
                                                                name="hide_branding"
                                                                hidden
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.hide_branding &&
                                                                    errors &&
                                                                    !!errors.hide_branding
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.hide_branding}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <div className="d-flex align-items-center">
                                                <Button color="primary"
                                                        variant="contained"
                                                        onClick={() => {
                                                            setFieldValue("preview", !values.preview)
                                                        }}
                                                        className="positive-button">
                                                    {
                                                        values.preview && "Hide"
                                                    }
                                                    {
                                                        !values.preview && "Preview"
                                                    }
                                                </Button>
                                                <div className="p-1"/>
                                                <Button color="primary"
                                                        data-tut="reactour__chat_settings_save_button"
                                                        type="submit"
                                                        disabled={isSubmitting}
                                                        variant="contained"
                                                        className="positive-button">
                                                    {isSubmitting && <Spinner animation="border" size="sm"/>}
                                                    Save Settings
                                                </Button>

                                            </div>

                                        </AppCardBody>
                                    </AppCard>
                                </Grid>
                            </Grid>
                        </form>

                        <Grid container spacing={1}>

                            <Grid item xs={6}>
                                <ChatController
                                    ui_test_messages={[
                                        {
                                            id: Math.random(),
                                            uid: v4(),
                                            message_type: "bot_message",
                                            message: "Hi",

                                            from_guest: "0"
                                        },
                                        {
                                            id: Math.random(),
                                            uid: v4(),
                                            message_type: "bot_message",
                                            message: (values.welcome_message || "Please provide some info so that we can reach you."),
                                            from_guest: "0"
                                        },
                                        {
                                            id: Math.random(),
                                            uid: v4(),
                                            message_type: "email_user_form",
                                            message: "",
                                            from_guest: "0"
                                        },
                                        {
                                            message_type: "email_user_form",
                                            message: "Hi!",
                                            uid: v4(),
                                            id: Math.random(),
                                            updated_at: new Date().getDate().toString(),
                                            created_at: new Date().getDate().toString(),
                                            from_guest: "1",
                                            status: ""
                                        },
                                        {
                                            message_type: undefined,
                                            message: "Hi, How I Help you!",
                                            uid: v4(),
                                            id: Math.random(),
                                            updated_at: new Date().getDate().toString(),
                                            created_at: new Date().getDate().toString(),
                                            from_guest: "0",
                                            status: ""
                                        },
                                        {
                                            message_type: "end_chat",
                                            message: "Do you want to end the conversation now?",
                                            uid: v4(),
                                            id: Math.random(),
                                            updated_at: new Date().getDate().toString(),
                                            created_at: new Date().getDate().toString(),
                                            from_guest: "0",
                                            status: ""
                                        },
                                    ]}
                                    restart_session={() => {

                                    }}
                                    logo_image={image && image.preview || chat_settings.bot_image}
                                    chat_settings={values}
                                    guest_session={{
                                        uid: "",
                                        updated_at: "",
                                        status: "",
                                        created_at: "",
                                        email: "",
                                        name: "",
                                        user_id: 2,
                                        shop_name: "",
                                        guest_unread_messages: 0,
                                        secret_key: "",
                                        agent_unread_messages: 0,
                                        customer_id: 2,
                                        id: 2,
                                        last_message: {
                                            created_at: "",
                                            status: "",
                                            updated_at: "",
                                            uid: "",
                                            id: 2,
                                        }
                                    }}
                                    ui_testing={true}
                                    preview={values.preview}/>
                            </Grid>
                        </Grid>
                    </>;
                }}
            </Formik>
        </Grid>
    </Grid>

}

export default ChatsSettings;
