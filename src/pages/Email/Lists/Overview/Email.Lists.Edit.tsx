import React, {useCallback, useContext, useEffect, useState} from "react";

import EmailMailingListAPIs from '../../../../apis/Email/email.mailinglists.apis';
import {iCountry, iSelectOption} from "../../../../types/internal";
import {getMailingListWithCache, iEmailMailingList,} from "../../../../types/internal/email/mailinglist";
import UserAPIs from "../../../../apis/user.apis";
import * as yup from "yup";
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import {Formik} from "formik";
import FormGroup from "../../../../components/FormGroup/CustomFormGroup";
import Select from "react-select";
import {Button} from "@material-ui/core";
import {Link, useParams} from "react-router-dom";
import useIsMounted from "ismounted";
import AppLoader from "../../../../components/Loader/AppLoader";
import {HandleErrors} from "../../../../components/helper/form.helper";
import {NotificationContext} from "../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";
import AppCard from "../../../../components/Card/AppCard";
import HeadingCol from "../../../../components/heading/HeadingCol";
import AppCardBody from "../../../../components/Card/AppCardBody";


export default function EmailMailingListEdit() {
    useEffect(() => {
        document.title = "Mailing List Edit | Emailwish";
    }, []);
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState("");
    const [resource, setResource] = useState<iEmailMailingList>();
    const [countries, setCountries] = useState<Array<iCountry>>([]);

    const notificationContext = useContext(NotificationContext);
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
        contact: yup.object({
            company: yup.string().required("Please enter company"),
            state: yup.string().required("Please enter state"),
            address_1: yup.string().required("Please enter address 1 "),
            city: yup.string().required("Please enter city "),
            address_2: yup.string().required("Please enter address 2 "),
            zip: yup
                .number()
                .required("Please enter zip code")
                .typeError("Please enter valid number"),
            country_id: yup.string().required("Please enter country"),
            phone: yup
                .string().required("Please enter phone number"),
            email: yup
                .string()
                .email("Please enter valid email")
                .required("Please enter email"),
            url: yup
                .string()
                .required("Please enter some home page url"),
        }),
    });
    const params: any = useParams<any>();
    const isMounted = useIsMounted();
    const fetchCountries = useCallback(() => {
        new UserAPIs().getCountries().then((countries) => {
            if (isMounted.current) {
                setCountries(countries);
            }
        });
    }, [isMounted]);
    const fetchResource = useCallback(() => {
        setLoading(true);
        new EmailMailingListAPIs().view(params.list_uid).then(response => {
                if (isMounted.current) {

                    if (EmailMailingListAPIs.hasError(response, notificationContext) || !response.list) {
                        setLoading(false);
                        setResource(undefined);
                        setErrorMessage(EmailMailingListAPIs.getError(response))

                    } else {
                        setLoading(false);
                        setResource(getMailingListWithCache(response.list));
                        setErrorMessage("")
                    }
                }
            }
        )
    }, []);


    const breadcrumb = useContext(BreadCrumbContext);

    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (resource) {
                links.push({
                    link: `/email/lists/${resource.uid}/overview`,
                    text: resource.name
                })
                links.push({
                    link: `/email/lists/${resource.uid}/overview/edit`,
                    text: "Edit"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [resource])


    useEffect(() => {
        fetchCountries();
        fetchResource();
    }, []);
    if (loading || !resource) {
        return <AppLoader/>
    }
    if (error_message) {
        return <Alert variant="danger">{error_message}</Alert>
    }

    return (
        <div className="mt-2">
            <Row>

                <HeadingCol title="Edit Mailing List"
                            description={""}/>
                <Col md={12}>
                    <AppCard>
                        <AppCardBody>
                            <div className="">
                                <Formik
                                    initialValues={{
                                        name: resource.name || "",
                                        from_email: resource.from_email || "",
                                        from_name: resource.from_name || "",
                                        default_subject: resource.default_subject || "",
                                        contact: {
                                            company: (resource && resource.contact && resource.contact.company) || "",
                                            state: (resource && resource.contact && resource.contact.state) || "",
                                            address_1: (resource && resource.contact && resource.contact.address_1) || "",
                                            city: (resource && resource.contact && resource.contact.city) || "",
                                            address_2: (resource && resource.contact && resource.contact.address_2) || "",
                                            zip: (resource && resource.contact && resource.contact.zip) || "",
                                            country_id: (resource && resource.contact && resource.contact.country_id) || "",
                                            phone: (resource && resource.contact && resource.contact.phone) || "",
                                            email: (resource && resource.contact && resource.contact.email) || "",
                                            url: (resource && resource.contact && resource.contact.url) || "",
                                        },
                                        subscribe_confirmation: (resource.subscribe_confirmation == "1" ? true : false),
                                        send_welcome_email: (resource.send_welcome_email == "1" ? true : false),
                                        unsubscribe_notification: (resource.unsubscribe_notification == "1" ? true : false),
                                    }}
                                    onSubmit={(values: any, formikHelpers) => {
                                        formikHelpers.setSubmitting(true);
                                        new EmailMailingListAPIs().update(params.list_uid, values).then((response) => {
                                            if (EmailMailingListAPIs.hasError(response, notificationContext)) {
                                                if (!HandleErrors(response, formikHelpers)) {
                                                    setErrorMessage(EmailMailingListAPIs.getError(response));
                                                }
                                            }
                                            formikHelpers.setSubmitting(false);
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
                                                        <h5>
                                                            <p>Identity</p>
                                                        </h5>
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
                                                            required={true}
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
                                                            required={true}
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
                                                            required={true}
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
                                                <Row>
                                                    <Col xl={6} lg={6} md={8} sm={12}>
                                                        <h5>
                                                            <p>Contact Information</p>
                                                        </h5>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <div>
                                                            <FormGroup
                                                                label="Company / Organization"
                                                                name="contact.company"
                                                                errors={errors}
                                                                touched={touched}
                                                                type="text"
                                                                onChange={handleChange}
                                                                values={values}
                                                                formGroupProps={{}}
                                                                required={true}
                                                                formControlProps={{className: "text-field"}}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="State / Province / Region"
                                                            name="contact.state"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            required={true}
                                                            formGroupProps={{}}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="Address 1"
                                                            name="contact.address_1"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            required={true}
                                                            formGroupProps={{}}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="City"
                                                            name="contact.city"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            required={true}
                                                            formGroupProps={{}}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="Address 2"
                                                            name="contact.address_2"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            formGroupProps={{}}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="ZIP / Postal Code"
                                                            name="contact.zip"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="number"
                                                            onChange={handleChange}
                                                            values={values}
                                                            required={true}
                                                            formGroupProps={{}}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <Form.Group>
                                                            <Form.Label>Country<b
                                                                style={{color: "red"}}>*</b></Form.Label>
                                                            <Select
                                                                onChange={(_value: any) => {
                                                                    if (_value && _value.value)
                                                                        setFieldValue(
                                                                            "contact.country_id",
                                                                            _value.value
                                                                        );
                                                                }}
                                                                className="selectDropdown"
                                                                name="contact.country_id"
                                                                options={country_select_options}
                                                            />
                                                            <Form.Control
                                                                hidden
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.contact &&
                                                                    touched.contact.country_id &&
                                                                    errors &&
                                                                    errors.contact &&
                                                                    !!errors.contact.country_id
                                                                }
                                                                name="contact.country_id"
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors &&
                                                                errors.contact &&
                                                                errors.contact.country_id}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="Phone"
                                                            name="contact.phone"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            formGroupProps={{}}
                                                            required={true}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="Email"
                                                            name="contact.email"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            formGroupProps={{}}
                                                            required={true}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                    <Col xl={6} lg={6} md={6} sm={12}>
                                                        <FormGroup
                                                            label="Home Page URL"
                                                            name="contact.url"
                                                            errors={errors}
                                                            touched={touched}
                                                            type="text"
                                                            onChange={handleChange}
                                                            values={values}
                                                            formGroupProps={{}}
                                                            required={true}
                                                            formControlProps={{className: "text-field"}}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    type="submit"
                                                    className="positive-button"
                                                    disabled={loading}
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
