import React, {useCallback, useContext, useEffect, useReducer, useRef, useState} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";
import {Formik} from "formik";
import UserAPIs, {iSignatureResponse} from "../../../apis/user.apis";
import {Alert, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {Button, Grid} from "@material-ui/core";
import * as yup from "yup";
import {
    FaFacebookSquare,
    FaIdBadge,
    FaInstagramSquare,
    FaLink,
    FaLinkedinIn,
    FaPhoneAlt,
    FaSkype,
    FaTwitter,
    FaUser,
} from "react-icons/all";
import {Reducer} from "redux";
import {
    failed_block_action_response,
    iResource,
    iResponseActions,
    loading_action_response,
    responseReducer,
    success_action_response
} from "../../../redux/reducers";
import ChatAPIs from "../../../apis/chat.apis";
import useIsMounted from "ismounted";
import {NotificationContext} from "../../../App";
import AppLoader from "../../../components/Loader/AppLoader";
import {HandleErrors} from "../../../components/helper/form.helper";
import HelpVideo from "../../../components/HelpVideo/HelpVideo";

export default function Signature() {

    const [{
        response,
        error,
        loading,
        error_block
    }, dispatchResponse] = useReducer<Reducer<iResource<iSignatureResponse>, iResponseActions<iSignatureResponse>>>
    (responseReducer<iResource<iSignatureResponse>, any>({}), {loading: true});
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);

    const [image, setImage] = useState({preview: "", raw: ""});
    const inputRef = useRef([]);
    const loadResource = useCallback(() => {
        dispatchResponse(loading_action_response())
        new UserAPIs().fetch_user_signature().then(response => {
            if (isMounted.current) {
                if (ChatAPIs.hasError(response, notificationContext)) {
                    dispatchResponse(failed_block_action_response(response.message))
                } else {
                    dispatchResponse(success_action_response(response))
                }
            }
        })
    }, [isMounted]);

    useEffect(() => {
        loadResource();
    }, [])

    const [showHelpVideo, setShowHelpVideo] = useState(false);
    if (loading) {
        return <AppLoader/>
    }
    if (error_block) {
        return <Alert>{error_block}</Alert>
    }
    return <AppCard>
        <AppCardBody className="p-3">
            <div className="mt-2">
                <Formik
                    initialValues={{
                        full_name: (response && response.signature && response.signature.full_name)||"",
                        designation: (response && response.signature && response.signature.designation)||"",
                        website: (response && response.signature && response.signature.website)||"",
                        phone: (response && response.signature && response.signature.phone)||"",
                        facebook: (response && response.signature && response.signature.facebook)||"",
                        instagram: (response && response.signature && response.signature.instagram)||"",
                        linkedin: (response && response.signature && response.signature.linkedin)||"",
                        twitter: (response && response.signature && response.signature.twitter)||"",
                        skype: (response && response.signature && response.signature.skype)||"",
                        logo: ""
                    }}
                    onSubmit={(values: any, helpers) => {
                        new UserAPIs().update_user_signature(values).then((res) => {
                            if (isMounted.current) {
                                helpers.setSubmitting(false)
                                if (UserAPIs.hasError(res, notificationContext)) {
                                    HandleErrors(res, helpers);
                                } else {

                                }
                            }

                        })
                    }}
                    validationSchema={yup.object({
                        full_name: yup.string(),
                        designation: yup.string(),
                        website: yup.string(),
                        phone: yup.string(),
                        facebook: yup.string(),
                        instagram: yup.string(),
                        linkedin: yup.string(),
                        twitter: yup.string(),
                        skype: yup.string(),
                        logo: yup.mixed(),
                    })}
                >
                    {({
                          handleSubmit,
                          handleChange,
                          values,
                          isSubmitting,
                          touched,
                          errors,
                          setFieldValue,
                          setFieldTouched
                      }: any) => {
                        return <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={6} lg={6} md={12} sm={12}>
                                    <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                                               helpLink={"https://www.youtube.com/embed/yzmef6JMwZQ"}/>

                                    <div className="d-flex">
                                        <h5>
                                            Signature
                                        </h5>
                                        <div className="p-1"/>
                                        <a className="app-link" onClick={() => {
                                            setShowHelpVideo(true)
                                        }}>Learn How?</a>

                                    </div>
                                    <p>
                                        This will be used in your email templates and email builder by default
                                    </p>

                                    <Grid container spacing={2}>
                                        <Grid item xs={6}>
                                            <Row>

                                                <Col md={12}>

                                                    <div className="chat-settings-photo">
                                                        <div className="chat-settings-photo__image">
                                                            <div>
                                                                {
                                                                    image && image.preview &&
                                                                    <img src={image.preview} alt="profile"/>
                                                                }
                                                                {
                                                                    response && response.signature && response.signature.logo_url && (!image || !image.preview) &&
                                                                    <img
                                                                        src={response && response.signature && response.signature.logo_url}
                                                                        alt="avatar"/>

                                                                }
                                                            </div>


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

                                                                        setFieldValue("logo", e.target.files[0])
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
                                                                              touched.logo &&
                                                                              !!(errors &&
                                                                                  errors.logo)
                                                                          }/>
                                                            <Form.Control.Feedback
                                                                className="text-center"
                                                                type="invalid">
                                                                {errors && errors.logo}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <span>

                                                                                        Max Size 1MB
                                                                                    </span>
                                                        <div
                                                            className="chat-settings-photo__button2">
                                                            <Button color="secondary"
                                                                    variant="contained"
                                                                    type="button"
                                                                    className="mt-1"
                                                                    onClick={() => {
                                                                        setFieldTouched("logo", true)
                                                                        // @ts-ignore
                                                                        inputRef.current[0].click()
                                                                    }}>
                                                                Change logo
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaUser
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Full name"
                                                        name="full_name"
                                                        value={values.full_name}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.full_name &&
                                                            errors &&
                                                            !!errors.full_name
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.full_name}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaIdBadge
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Designation"
                                                        name="designation"
                                                        value={values.designation}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.designation &&
                                                            errors &&
                                                            !!errors.designation
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.designation}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaLink
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Website"
                                                        name="website"
                                                        value={values.website}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.website &&
                                                            errors &&
                                                            !!errors.website
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.website}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaPhoneAlt
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Phone Number"
                                                        name="phone"
                                                        value={values.phone}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.phone &&
                                                            errors &&
                                                            !!errors.phone
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.phone_number}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaFacebookSquare
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Facebook URL"
                                                        name="facebook"
                                                        value={values.facebook}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.facebook &&
                                                            errors &&
                                                            !!errors.facebook
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.facebook}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>


                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaInstagramSquare
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Instagram URL"
                                                        name="instagram"
                                                        value={values.instagram}
                                                        onChange={handleChange}

                                                        isInvalid={
                                                            touched &&
                                                            touched.instagram &&
                                                            errors &&
                                                            !!errors.instagram
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.instagram}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>


                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaSkype
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Skype URL"
                                                        name="skype"
                                                        value={values.skype}
                                                        onChange={handleChange}
                                                        isInvalid={
                                                            touched &&
                                                            touched.skype &&
                                                            errors &&
                                                            !!errors.skype
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.skype}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>


                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaLinkedinIn
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Linkedin URL"
                                                        name="linkedin"
                                                        value={values.linkedin}
                                                        onChange={handleChange}

                                                        isInvalid={
                                                            touched &&
                                                            touched.linkedin &&
                                                            errors &&
                                                            !!errors.linkedin
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.linkedin}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>


                                        </Grid>
                                        <Grid item xs={6}>
                                            <Form.Group>
                                                <InputGroup className="align-items-center">
                                                    <InputGroup.Prepend className="pr-3">
                                                        <FaTwitter
                                                            className="icon"/>
                                                    </InputGroup.Prepend>
                                                    <Form.Control
                                                        placeholder="Twitter URL"
                                                        name="twitter"
                                                        value={values.twitter}
                                                        onChange={handleChange}

                                                        isInvalid={
                                                            touched &&
                                                            touched.twitter &&
                                                            errors &&
                                                            !!errors.twitter
                                                        }
                                                    >
                                                    </Form.Control>
                                                    <Form.Control.Feedback
                                                        type="invalid">
                                                        {errors && errors.twitter}
                                                    </Form.Control.Feedback>
                                                </InputGroup>
                                            </Form.Group>


                                        </Grid>
                                    </Grid>
                                </Col>
                                <Col sm={12}>
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        className="float-right positive-button"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}
                                        Save
                                    </Button>
                                </Col>
                            </Row>
                        </Form>;
                    }}
                </Formik>
            </div>
        </AppCardBody>
    </AppCard>
}
