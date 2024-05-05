import React, {useContext, useEffect, useReducer, useState} from "react";
import UserAPIs, {iContactUpdateParams,} from "../../../apis/user.apis";
import {iContact, iCountry, iSelectOption,} from "../../../types/internal";
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import Select from "react-select";
import * as yup from "yup";
import {Formik} from "formik";
import {HandleErrors} from "../../../components/helper/form.helper";
import AppLoader from "../../../components/Loader/AppLoader";
import {iResource, iResponseActions, responseReducer} from "../../../redux/reducers";
import {Reducer} from "redux";
import useIsMounted from "ismounted";
import {NotificationContext} from "../../../App";
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";

function AccountContact() {
    useEffect(() => {
        document.title = "Contact | Emailwish";
    }, []);
    const [countries, setCountries] = useState<Array<iCountry>>([]);
    const isMounted = useIsMounted();
    const [{
        response,
        error,
        loading,
        error_block
    }, dispatchResponse] = useReducer<Reducer<iResource<iContact>, iResponseActions<iContact>>>
    (responseReducer<iResource<iContact>, any>({}), {loading: true});

    const notificationContext = useContext(NotificationContext);
    const createNewSchema = yup.object({
        first_name: yup.string().required("Please enter first name"),
        last_name: yup.string().required("Please enter last name"),
        tax_number: yup
            .number(),
        company: yup.string().required("Please enter company"),
        state: yup.string().required("Please enter state"),
        address_1: yup.string().required("Please enter address1 "),
        city: yup.string().required("Please enter city "),
        address_2: yup.string().required("Please enter address2 "),
        zip: yup
            .number()
            .required("Please enter zip code")
            .typeError("Please enter valid number"),
        country_id: yup.string().required("Please select country"),
        phone: yup
            .string()
            .matches(
                /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
                "Please enter at least 10 digits"
            )
            .max(10, "Please enter at most 10 digits")
            .min(10, "Please enter at least 10 digits")
            .required("Please enter phone no."),
        email: yup
            .string()
            .email("Please enter valid email")
            .required("Please enter email"),
        url: yup
            .string()
            .url("Please enter a valid url")
            .required("Please enter some home page url"),
        billing_address: yup.string(),
    });

    const fetchContact = () => {
        dispatchResponse({type: "loading"});
        new UserAPIs()
            .fetch_contact()
            .then((response) => {
                if (isMounted.current) {
                    if (UserAPIs.hasError(response, notificationContext) || !response.contact) {
                        dispatchResponse({type: "failed_to_load", error: UserAPIs.getError(response)});
                    } else {
                        dispatchResponse({type: "success", response: response.contact});

                    }
                }
            });
    };


    const fetchCountries = () => {
        new UserAPIs().getCountries().then((r) => onCountriesResponse(r));
    };

    const onCountriesResponse = (countries: Array<iCountry>) => {
        setCountries(countries);
    };

    useEffect(() => {
        fetchCountries();
        fetchContact();
    }, []);

    if (loading) {
        return <AppLoader/>
    }
    return (
        <AppCard>
            <AppCardBody className="p-3">
                <div className="mt-2">
                    <Formik
                        initialValues={{
                            first_name: (response && response.first_name) || "",
                            last_name: (response && response.last_name) || "",
                            email: (response && response.email) || "",
                            address_1: (response && response.address_1) || "",
                            city: (response && response.city) || "",
                            zip: (response && response.zip) || "",
                            country_id: (response && response.country_id) || "",
                            url: (response && response.url) || "",
                            company: (response && response.company) || "",
                            phone: (response && response.phone) || "",
                            address_2: (response && response.address_2) || "",
                            state: (response && response.state) || "",
                            tax_number: (response && response.tax_number) || "",
                            billing_address: (response && response.billing_address) || "",
                        }}
                        onSubmit={(values: iContactUpdateParams, helpers) => {
                            new UserAPIs().update_contact(values).then((response) => {
                                if (UserAPIs.hasError(response, notificationContext)) {
                                    if (!HandleErrors(response, helpers)) {

                                    }
                                    helpers.setSubmitting(false);
                                } else {
                                    fetchContact();
                                }
                            });
                        }}
                        validationSchema={createNewSchema}
                    >
                        {({
                              handleSubmit,
                              handleChange,
                              values,
                              isSubmitting,
                              touched,
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
                                    <h6>
                                        Primary Account Contact
                                    </h6>
                                    <Row>
                                        <Col xl={6} sm={12}>
                                            <Row>
                                                <Col lg={6}>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            First Name <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            name="first_name"
                                                            value={values && values.first_name}
                                                            onChange={handleChange}
                                                            isInvalid={
                                                                touched &&
                                                                touched.first_name &&
                                                                errors &&
                                                                !!errors.first_name
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors && errors.first_name}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col lg={6}>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            Last Name <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            name="last_name"
                                                            value={values && values.last_name}
                                                            onChange={handleChange}
                                                            isInvalid={
                                                                touched &&
                                                                touched.last_name &&
                                                                errors &&
                                                                !!errors.last_name
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors && errors.last_name}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group>
                                                <Form.Label>
                                                    Email address <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    onChange={handleChange}
                                                    name="email"
                                                    type="email"
                                                    value={values && values.email}
                                                    isInvalid={
                                                        touched && touched.email && errors && !!errors.email
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.email}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>
                                                    Address 1 <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    onChange={handleChange}
                                                    name="address_1"
                                                    value={values && values.address_1}
                                                    isInvalid={
                                                        touched &&
                                                        touched.address_1 &&
                                                        errors &&
                                                        !!errors.address_1
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.address_1}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Row>
                                                <Col lg={6}>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            City <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            onChange={handleChange}
                                                            name="city"
                                                            value={values && values.city}
                                                            isInvalid={
                                                                touched && touched.city && errors && !!errors.city
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors && errors.city}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col lg={6}>
                                                    <Form.Group>
                                                        <Form.Label>
                                                            ZIP / Postal Code{" "}
                                                            <span className="text-danger">*</span>
                                                        </Form.Label>
                                                        <Form.Control
                                                            onChange={handleChange}
                                                            name="zip"
                                                            value={values && values.zip}
                                                            isInvalid={
                                                                touched && touched.zip && errors && !!errors.zip
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors && errors.zip}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                            <Form.Group>
                                                <Form.Label>Website URL</Form.Label>
                                                <Form.Control
                                                    onChange={handleChange}
                                                    name="url"
                                                    type="text"
                                                    value={values && values.url}
                                                    isInvalid={
                                                        touched && touched.url && errors && !!errors.url
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.url}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                        <Col xl={6} sm={12}>
                                            <Form.Group>
                                                <Form.Label>
                                                    Country <span className="text-danger">*</span>
                                                </Form.Label>
                                                {!!country_select_options.length && response && (
                                                    <Select
                                                        onChange={(_value: any) => {
                                                            if (_value && _value.value)
                                                                setFieldValue("country_id", _value.value);
                                                        }}
                                                        className="selectDropdown"
                                                        name="country_id"
                                                        options={country_select_options}
                                                    />
                                                )}
                                                <Form.Control
                                                    hidden
                                                    isInvalid={
                                                        touched &&
                                                        touched.country_id &&
                                                        errors &&
                                                        !!errors.country_id
                                                    }
                                                    name="country_id"
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.country_id}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>
                                                    Company / Organization{" "}
                                                    <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    name="company"
                                                    onChange={handleChange}
                                                    value={values && values.company}
                                                    isInvalid={
                                                        touched && touched.company && errors && !!errors.company
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.company}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Office phone</Form.Label>
                                                <Form.Control
                                                    name="phone"
                                                    onChange={handleChange}
                                                    value={values && values.phone}
                                                    isInvalid={
                                                        touched && touched.phone && errors && !!errors.phone
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.phone}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Address 2</Form.Label>
                                                <Form.Control
                                                    name="address_2"
                                                    value={values && values.address_2}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        touched &&
                                                        touched.address_2 &&
                                                        errors &&
                                                        !!errors.address_2
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.address_2}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>State / Province / Region</Form.Label>
                                                <Form.Control
                                                    name="state"
                                                    value={values && values.state}
                                                    onChange={handleChange}
                                                    isInvalid={
                                                        touched && touched.state && errors && !!errors.state
                                                    }
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {errors && errors.state}
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-end">
                                        <Button
                                            variant="primary"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {isSubmitting && <Spinner animation="border" size="sm"/>} Save
                                        </Button>
                                    </div>

                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </AppCardBody>
        </AppCard>
    );
}

export default AccountContact;
