import React, {useCallback, useContext, useEffect, useState} from "react";

import EmailMailingListAPIs from "../../../../apis/Email/email.mailinglists.apis";
import {iCountry, iSelectOption} from "../../../../types/internal";
import UserAPIs from "../../../../apis/user.apis";
import {Col, Form, Row, Spinner} from "react-bootstrap";
import {useHistory} from "react-router";
import {Button} from "@material-ui/core";
import {Link} from "react-router-dom";
import * as yup from "yup";
import {Formik} from "formik";
import FormGroup from "../../../../components/FormGroup/CustomFormGroup";
import {AppStateContext, NotificationContext} from "../../../../App";
import AppCard from "../../../../components/Card/AppCard";
import AppCardBody from "../../../../components/Card/AppCardBody";
import AppLoader from "../../../../components/Loader/AppLoader";
import HelpVideo from "../../../../components/HelpVideo/HelpVideo";

function EmailMailingListCreateHooksController() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState("");
    const [errors, setErrors] = useState<any>({});
    const [countries, setCountries] = useState<Array<iCountry>>([]);
    const history = useHistory();
    const createNewSchema = yup.object({
        name: yup.string().required("Please enter List name"),
        from_email: yup
            .string()
            .email("Please enter valid email")
            .required("Please enter From email"),
        from_name: yup.string().required("Please enter Default From name"),
        default_subject: yup
            .string()
            .required("Please enter Default email subject"),
    });

    const onCountriesResponse = useCallback((countries: Array<iCountry>) => {
        setCountries(countries);
    }, []);

    const fetchCountries = useCallback(() => {
        new UserAPIs().getCountries().then((r) => onCountriesResponse(r));
    }, [onCountriesResponse]);

    const notificationContext = useContext(NotificationContext);
    const {loggedInUser, shop} = useContext(AppStateContext)
    useEffect(() => {
        fetchCountries();
    }, []);

    const [showHelpVideo, setShowHelpVideo] = useState(false);
    if (!loggedInUser || !shop) return <AppLoader/>
    console.log(loggedInUser)
    return (
        <div className="mt-2">
            <Row>
                <Col md={12}>
                    <AppCard>
                        <AppCardBody className="p-3">
                            <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                                       helpLink={"https://www.youtube.com/embed/ZJfVUPHxCq8"}/>

                            <div className="d-flex">
                                <h5>Create Mailing List</h5>
                                <div className="p-1"/>
                                <a className="app-link" onClick={() => {
                                    setShowHelpVideo(true)
                                }}>Learn How?</a>
                            </div>


                            <div className="mt-2">
                                <Formik
                                    initialValues={{
                                        name: "",
                                        from_email: (loggedInUser && loggedInUser.email) || "",
                                        from_name: (shop && shop.name) || "",
                                        default_subject: "",
                                        subscribe_confirmation: false,
                                        send_welcome_email: false,
                                        unsubscribe_notification: false,
                                    }}
                                    onSubmit={(values: any, formikHelpers) => {
                                        setLoading(true);
                                        setErrorMessage("");
                                        new EmailMailingListAPIs().create(values).then((response) => {
                                            formikHelpers.setSubmitting(false)
                                            if (EmailMailingListAPIs.hasError(response, notificationContext)) {
                                                setLoading(false);
                                                setErrorMessage(EmailMailingListAPIs.getError(response));
                                                setErrors(response.errors || {});
                                            } else {
                                                setLoading(false);
                                                setErrorMessage("");
                                                setErrors({});
                                                history.push("/email/lists/view/" + response.uid);
                                            }
                                        });
                                    }}
                                    validationSchema={createNewSchema}
                                >
                                    {({
                                          handleSubmit,
                                          handleChange,
                                          values,
                                          touched,
                                          isSubmitting,
                                          setFieldValue,
                                          errors,
                                      }: any) => {
                                        const country_select_options: Array<iSelectOption> = countries.map(
                                            (c) => ({
                                                value: c.id,
                                                label: c.name,
                                            })
                                        );
                                        return (
                                            <Form onSubmit={handleSubmit}>
                                                <Row>
                                                    <Col xl={6} lg={6} md={8} sm={12}>
                                                        <h6>
                                                            <i>Identity</i>
                                                        </h6>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="List name"
                                                            name="name"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            placeholder="Newsletter"
                                                            values={values}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="From email"
                                                            name="from_email"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="Default From name"
                                                            name="from_name"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="Default email subject"
                                                            name="default_subject"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    type="submit"
                                                    className="positive-button"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting && <><Spinner animation="border"
                                                                                size="sm"/>&nbsp;</>}
                                                    Save
                                                </Button>
                                                <Link to="/email/lists">
                                                    <Button
                                                        variant="outlined" color="secondary"
                                                        type="button"
                                                        className="ml-2"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </Link>
                                            </Form>
                                        );
                                    }}
                                </Formik>
                            </div>
                        </AppCardBody>
                    </AppCard>
                </Col>
            </Row>
        </div>
    );
}

export default EmailMailingListCreateHooksController;
