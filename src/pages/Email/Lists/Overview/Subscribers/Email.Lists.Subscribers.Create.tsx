import React, {useContext, useEffect, useState} from "react";
import {Link, useHistory, useParams} from "react-router-dom";

import {iSelectOption} from "../../../../../types/internal";
import {iEmailMailingList, iEmailMailingListField,} from "../../../../../types/internal/email/mailinglist";
import EmailMailingListFieldsAPIs, {iEmailMailingListFieldsIndexResponse,} from "../../../../../apis/Email/email.mailinglists.fields.apis";
import EmailMailingListSubscriberAPIs from "../../../../../apis/Email/email.mailinglists.subscribers.apis";
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import {Button} from "@material-ui/core";
import Select from "react-select";
import DatePickerUncontrolled from "../../../../../components/DatePickerUncontrolled/DatePickerUncontrolled";
import AppLoader from "../../../../../components/Loader/AppLoader";
import {NotificationContext} from "../../../../../App";
import useIsMounted from "ismounted";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../../components/Breadcrumbs/WithBreadcrumb";
import HeadingCol from "../../../../../components/heading/HeadingCol";
import AppCard from "../../../../../components/Card/AppCard";
import AppCardBody from "../../../../../components/Card/AppCardBody";
import * as yup from "yup";
import {Formik} from "formik";
import {HandleErrors} from "../../../../../components/helper/form.helper";

export const convertArrayToObject = (array: any[]) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item.key]: item.value,
        };
    }, initialValue);
};

function EmailMailingListsSegmentsCreate() {
    useEffect(() => {
        document.title = "Create New Subscriber | Emailwish";
    }, []);
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState("");
    const [mailingList, setMailingList] = useState<iEmailMailingList>();
    const [fields, setFields] = useState<iEmailMailingListField[]>();
    const params: any = useParams<any>();
    const history = useHistory();


    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);


    const renderForm = () => {

        const list: iEmailMailingList | undefined = mailingList;
        const list_fields: iEmailMailingListField[] | undefined = fields;
        if (!list || !list_fields || !fields) return <AppLoader/>;

        return (
            <Formik
                initialValues={convertArrayToObject(
                    fields.map((field, index) => {
                        return {
                            key: field.tag,
                            value: field.default_value || ""
                        }
                    }),
                )}

                validationSchema={
                    yup.object(convertArrayToObject(
                        fields.map((field, index) => {
                            let value = yup.string();
                            if (field.type === "text") {
                                if (field.required === "0") {
                                    value = yup.string()
                                } else {
                                    value = yup
                                        .string()
                                        .required()
                                }
                            }
                            return {
                                key: field.tag,
                                value: value,
                            }
                        }),
                    ))
                }
                onSubmit={(values: any, formikHelpers: any) => {
                    new EmailMailingListSubscriberAPIs()
                        .setMailingListUid(params.list_uid)
                        .create_subscriber(values)
                        .then((response) => {
                            if (isMounted.current) {
                                formikHelpers.setSubmitting(false)
                                if (EmailMailingListSubscriberAPIs.hasError(response, notificationContext) || !response.uid) {
                                    if (!HandleErrors(response, formikHelpers)) {
                                        setErrorMessage(response.message);
                                    }
                                } else {
                                    history.replace("/email/lists/" + params.list_uid + "/overview/subscribers")
                                }
                            }

                        });
                }}
            >
                {({
                      handleSubmit,
                      isSubmitting,
                      errors,
                      touched,
                      handleChange,
                      values
                  }: any) => {
                    return <Form onSubmit={handleSubmit}>
                        {list_fields.map((field, field_index) =>
                            renderField(field, field_index, errors, values, handleChange, touched)
                        )}
                        <>
                            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting}>
                                {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}Save
                            </Button>
                            <Link to={`/email/lists/${params.list_uid}/overview/subscribers`}>
                                <Button variant="outlined" color="secondary" type="button" className="ml-2">
                                    Cancel
                                </Button>
                            </Link>
                                &nbsp;&nbsp;or
                            <Link to={`/email/lists/${params.list_uid}/overview/subscribers/import`} className="justify-content-end">
                                <Button variant="outlined" color="secondary" type="button" className="ml-2">
                                    Import
                                </Button>
                            </Link>
                        </>
                    </Form>
                }}
            </Formik>
        );
    };

    const renderField = (field: iEmailMailingListField,
                         field_index: number,
                         errors: any,
                         values: any,
                         handleChange: any,
                         touched: any
    ) => {
        let variable_field = null;
        switch (field.type) {
            case "text":
                variable_field = (
                    <Form.Group>
                        <Form.Label>{field.label}</Form.Label>
                        <Form.Control
                            name={field.tag}
                            onChange={handleChange}
                            value={values[field.tag]}
                            isInvalid={touched && touched[field.tag] && errors && !!errors[field.tag]}

                        />
                        <Form.Control.Feedback type="invalid">
                            {errors && errors[field.tag]}
                        </Form.Control.Feedback>
                    </Form.Group>

                );
                break;
            case "number":
                variable_field = <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                        type="number"
                        name={field.tag}
                        onChange={handleChange}
                        value={values[field.tag]}
                        isInvalid={touched && touched[field.tag] && errors && !!errors[field.tag]}

                    />
                    <Form.Control.Feedback type="invalid">
                        {errors && errors[field.tag]}
                    </Form.Control.Feedback>
                </Form.Group>;
                break;
            case "textarea":
                variable_field = <Form.Group>
                    <Form.Label>{field.label}</Form.Label>
                    <Form.Control
                        as={"textarea"}
                        name={field.tag}
                        onChange={handleChange}
                        value={values[field.tag]}
                        isInvalid={touched && touched[field.tag] && errors && !!errors[field.tag]}

                    />
                    <Form.Control.Feedback type="invalid">
                        {errors && errors[field.tag]}
                    </Form.Control.Feedback>
                </Form.Group>;
                break;
            case "dropdown":
                const dd_options: iSelectOption[] = [];
                if (!!field.options) {
                    field.options.forEach((option) =>
                        dd_options.push({label: option.label, value: option.value})
                    );
                }

                variable_field = (
                    <Select
                        required={field.required === "1"}
                        name={field.tag}
                        options={dd_options}
                    />
                );
                break;
            case "multiselect":
                const ms_options: iSelectOption[] = [];
                if (!!field.options) {
                    field.options.forEach((option) =>
                        ms_options.push({label: option.label, value: option.value})
                    );
                }

                variable_field = (
                    <Select
                        required={field.required === "1"}
                        name={field.tag + "[]"}
                        isMulti={true}
                        options={ms_options}
                    />
                );
                break;
            case "datetime":
                variable_field = (
                    <div style={{display: "block"}}>
                        <DatePickerUncontrolled
                            onChange={() => {
                            }}
                            name={field.tag + "[]"}
                            className="form-control"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="yyyy-MM-dd, HH:mm"
                        />
                    </div>
                );
                break;
            case "date":
                variable_field = (
                    <div style={{display: "block"}}>
                        <DatePickerUncontrolled
                            onChange={() => {
                            }}
                            name={field.tag + "[]"}
                            className="form-control"
                            dateFormat="yyyy-MM-dd"
                        />
                    </div>
                );
                break;
            case "radio":
                variable_field = (
                    <div style={{display: "block"}}>
                        {!!field.options &&
                        field.options.map((option, option_index) => {
                            return (
                                <Form.Check
                                    inline
                                    key={option_index}
                                    type="radio"
                                    label={option.label}
                                    name={field.tag}
                                    value={option.value}
                                />
                            );
                        })}
                    </div>
                );
                break;
            case "checkbox":
                variable_field = (
                    <div style={{display: "block"}}>
                        {!!field.options &&
                        field.options.map((option, option_index) => {
                            return (
                                <Form.Check
                                    inline
                                    key={option_index}
                                    type="checkbox"
                                    label={option.label}
                                    name={field.tag + "[]"}
                                    value={option.value}
                                />
                            );
                        })}
                    </div>
                );
                break;
        }

        return (
            <Row key={field_index}>
                <Col xl={6} lg={6} md={6} sm={12}>
                    {variable_field}
                </Col>
            </Row>
        );
    };

    const fetchListAndFields = () => {
        new EmailMailingListFieldsAPIs()
            .setMailingListUid(params.list_uid)
            .index()
            .then((r) => onFieldsResponse(r));
    };

    const onFieldsResponse = (response: iEmailMailingListFieldsIndexResponse) => {
        if (
            EmailMailingListFieldsAPIs.hasError(response, notificationContext) ||
            !response.list ||
            !response.fields
        ) {
            setLoading(false);
            setErrorMessage(EmailMailingListFieldsAPIs.getError(response));
        } else {
            setLoading(false);
            setErrorMessage("");
            setMailingList(response.list);
            setFields(response.fields);
        }
    };

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (mailingList) {
                links.push({
                    link: `/email/lists/${mailingList.uid}/overview`,
                    text: mailingList.name
                })
                links.push({
                    link: `/email/lists/${mailingList.uid}/overview/subscribers`,
                    text: "Subscribers"
                })
                links.push({
                    link: `/email/lists/${mailingList.uid}/overview/subscribers/create`,
                    text: "Create"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [mailingList])


    useEffect(() => {
        fetchListAndFields();
    }, []);
    if (loading) {
        return <AppLoader/>
    }
    return <Row>

        <HeadingCol title="+ New subscriber"
                    description={""}/>
        <Col xl={6} lg={6} md={6} sm={12}>

            <div className="mt-2">
                {error_message ? (
                    <Alert variant="danger">{error_message}</Alert>
                ) : null}
            </div>
        </Col>
        <Col md={12}>
            <AppCard>
                <AppCardBody>

                    {renderForm()}
                </AppCardBody>
            </AppCard>
        </Col>
    </Row>;

}

export default EmailMailingListsSegmentsCreate;
