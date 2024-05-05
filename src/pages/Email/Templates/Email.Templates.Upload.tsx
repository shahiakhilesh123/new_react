import React, {useContext, useEffect, useState} from "react";

import EmailTemplateAPIs, {iEmailTemplateUploadParams} from "../../../apis/Email/email.templates.apis";
import {iApiBasicResponse} from "../../../types/api";
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import {Button} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import * as yup from "yup";
import {Formik} from "formik";
import FormGroup from "../../../components/FormGroup/CustomFormGroup";
import useIsMounted from "ismounted";
import {HandleErrors} from "../../../components/helper/form.helper";
import {NotificationContext} from "../../../App";
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";


function EmailTemplatesUpload() {
    useEffect(() => {
        document.title = "Upload Templates | Emailwish";
    }, []);
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState<string | undefined>("");
    const [errors, setErrors] = useState<any>({});
    const [response, setResponse] = useState<iApiBasicResponse>();
    const isMounted = useIsMounted();
    const history = useHistory();

    const notificationContext = useContext(NotificationContext);

    function uploadResource(uploadParams: iEmailTemplateUploadParams) {
        setLoading(true);
        setErrorMessage("");
        new EmailTemplateAPIs().upload_template(uploadParams).then(response => onUploadResourceResponse(response));
    }

    function onUploadResourceResponse(response: iApiBasicResponse) {
        if (EmailTemplateAPIs.hasError(response, notificationContext) || !response.uid) {
            setLoading(false);
            setErrorMessage(EmailTemplateAPIs.getError(response));
            setErrors(response.errors || {});
            setResponse(undefined);
        } else {
            setLoading(false);
            setErrorMessage("");
            setResponse(response);
        }
    }


    function onFormSubmit(event: any) {
        if (!event) return;
        event.preventDefault();

        if (!event.target.template_name
            || event.target.template_file
            || event.target.template_file.files
            || event.target.template_file.files.length
        )
            return;
        uploadResource({
            name: event.target.template_name.value,
            file: event.target.template_file.files[0],
        });
    }

    function getUid() {
        if (!response) return null;
        if (!response.uid) return null;
        return response.uid;
    }

    function renderErrorMessage() {
        if (!error_message) return null;
        return <Alert variant="danger">{error_message}</Alert>
    }


    return <div className="mt-2">
        <AppCard>
            <AppCardBody className="p-3">
                <Row>
                    <Col xl={6} lg={6} md={8} sm={12}>
                        <h5 className="app-dark-color mt-3 u500" style={{letterSpacing: "0.5px"}}>Upload Email
                            Template</h5>
                        <Alert variant="info">
                            <p className="app-dark-color dashboard-data u300">Please upload your HTML template bundle.
                                Normally,
                                it should be a .zip file containing:</p>
                            <ul>
                                <li>One single .html file and</li>
                                <li>One directory at the same level containing asset files (JS, CSS, Images, etc.)</li>
                            </ul>
                        </Alert>
                        <div className="mt-2">
                            {renderErrorMessage()}
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col xl={6} lg={6} md={8} sm={12}>
                        <Formik
                            initialValues={{
                                name: "",
                                file: "",
                            }}
                            onSubmit={((values, formikHelpers) => {
                                new EmailTemplateAPIs().upload_template(values)
                                    .then(response => {
                                        if (isMounted.current) {
                                            formikHelpers.setSubmitting(false)
                                            if (EmailTemplateAPIs.hasError(response, notificationContext) || !response.uid) {
                                                if (HandleErrors(response, formikHelpers)) {
                                                    setErrorMessage(response.message);
                                                }
                                            } else {
                                                history.push("/email/templates");
                                            }
                                        }
                                    });
                            })}
                            validationSchema={yup.object({
                                name: yup.string().required("Please enter a name"),
                                file: yup.object().nullable()
                            })}>
                            {({
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  touched,
                                  isSubmitting,
                                  errors,
                                  setFieldValue
                              }: any) => {
                                return <Form onSubmit={handleSubmit}>
                                    <FormGroup label="Enter your template's name here *"
                                               name="name"
                                               type="text"
                                               formGroupProps={{style: {maxWidth: "300px"}}}
                                               onChange={handleChange}
                                               touched={touched}
                                               errors={errors}
                                               values={values}/>
                                    <Form.Group>
                                        <Form.File
                                            className="position-relative"
                                            required
                                            accept={".zip"}
                                            name="file"
                                            label="File"
                                            onChange={(e: any) => {
                                                if (e.target && e.target.files && e.target.files.length) {
                                                    setFieldValue("file", e.target.files[0])
                                                }
                                            }}
                                            isInvalid={!!errors.file}
                                            feedback={errors.file}
                                        />
                                    </Form.Group>
                                    <Button color="primary" variant="contained" className="positive-button"
                                            type="submit" disabled={isSubmitting}>
                                        {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}
                                        Save
                                    </Button>
                                    <Link to="/email/templates">
                                        <Button variant="outlined" color="secondary" type="button" className="ml-2">
                                            Cancel
                                        </Button>
                                    </Link>
                                </Form>
                            }}
                        </Formik>
                    </Col>
                </Row>
            </AppCardBody>
        </AppCard>

    </div>;

}


export default EmailTemplatesUpload;
