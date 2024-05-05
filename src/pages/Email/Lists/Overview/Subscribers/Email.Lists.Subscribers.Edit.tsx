import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";


import EmailMailingListAPIs from "../../../../../apis/Email/email.mailinglists.apis";
import EmailMailingListFieldsAPIs, {iEmailMailingListFieldsIndexResponse} from "../../../../../apis/Email/email.mailinglists.fields.apis";

import EmailMailingListSubscriberAPIs, {iEmailMailingListSubscriberShowResponse,} from "../../../../../apis/Email/email.mailinglists.subscribers.apis";
import {iEmailMailingListField, iEmailMailingListSubscriber,} from "../../../../../types/internal/email/mailinglist";
import {Link, useHistory, useParams} from "react-router-dom";
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import AppContentLoader from "../../../../../components/ContentLoader/AppContentLoader";
import {Button} from "@material-ui/core";
import {iSelectOption} from "../../../../../types/internal";
import Select from "react-select";
import DatePickerUncontrolled from "../../../../../components/DatePickerUncontrolled/DatePickerUncontrolled";
import {Reducer} from "redux";
import {iListResource, iListResponseActions, listReducer} from "../../../../../redux/reducers";
import useIsMounted from "ismounted";
import AppLoader from "../../../../../components/Loader/AppLoader";
import {NotificationContext} from "../../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../../components/Breadcrumbs/WithBreadcrumb";
import AppCard from "../../../../../components/Card/AppCard";
import HeadingCol from "../../../../../components/heading/HeadingCol";
import AppCardBody from "../../../../../components/Card/AppCardBody";
import {Formik} from "formik";
import * as yup from "yup";
import {convertArrayToObject} from "./Email.Lists.Subscribers.Create";
import {HandleErrors} from "../../../../../components/helper/form.helper";

function EmailMailingListEditController() {
    const [response, dispatchResponse] = useReducer<Reducer<iListResource<iEmailMailingListSubscriberShowResponse>, iListResponseActions<iEmailMailingListSubscriberShowResponse>>>
    (listReducer<iListResource<iEmailMailingListSubscriberShowResponse>, any>({}), {
        query: {per_page: 20},
        loading: true
    });
    const {error, loading} = response;
    const params: any = useParams<any>();
    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const history = useHistory();

    const [fields, setFields] = useState<iEmailMailingListField[]>();

    useEffect(() => {
        fetchListAndFields();
    }, []);


    const fetchResource = useCallback(() => {
        dispatchResponse({type: "loading"})
        new EmailMailingListSubscriberAPIs()
            .setMailingListUid(params.list_uid)
            .edit_view(params.subscriber_uid)
            .then((response) => {
                if (isMounted.current) {
                    if (EmailMailingListFieldsAPIs.hasError(response, notificationContext)
                        || !response.subscriber
                        || !response.list
                        || !response.values) {
                        dispatchResponse({
                            type: "failed",
                            error: EmailMailingListFieldsAPIs.getError(response)
                        })
                    } else {
                        dispatchResponse({
                            type: "success",
                            resource: response
                        })
                    }
                }
            });
    }, []);

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/lists",
                text: "Lists"
            })
            if (response && response.resource && response.resource.list) {
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview`,
                    text: response.resource.list.name
                })
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview/subscribers`,
                    text: "Subscribers"
                })
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview/subscribers/${params.subscriber_uid}/edit`,
                    text: "Edit"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [response])


    useEffect(() => {
        fetchResource();
    }, []);


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


    const onFieldsResponse = (response: iEmailMailingListFieldsIndexResponse) => {
        if (
            EmailMailingListFieldsAPIs.hasError(response, notificationContext) ||
            !response.list ||
            !response.fields
        ) {
        } else {
            setFields(response.fields);
        }
    };


    const fetchListAndFields = () => {
        new EmailMailingListFieldsAPIs()
            .setMailingListUid(params.list_uid)
            .index()
            .then((r) => onFieldsResponse(r));
    };


    const renderForm = () => {
        if (!response || !response.resource) return null;
        const {values, list, subscriber,} = response.resource
        const res: iEmailMailingListSubscriber | undefined = subscriber;
        const list_fields: iEmailMailingListField[] | undefined = list && list.get_fields;
        if (!subscriber || !values || !list_fields || !fields) return <AppContentLoader type="dashboard"/>;
        return <Formik
            initialValues={values}

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
                    .update_subscriber(params.subscriber_uid, values)
                    .then((response) => {
                        if (isMounted.current) {
                            formikHelpers.setSubmitting(false);
                            if (EmailMailingListAPIs.hasError(response, notificationContext) || !response.uid) {
                                if (!HandleErrors(response, formikHelpers)) {
                                    dispatchResponse({
                                        type: "failed",
                                        error: response.message
                                    })
                                }

                            } else {
                                history.push(`/email/lists/${params.list_uid}/overview/subscribers`)
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
                    {list_fields && list_fields.map((field, field_index) =>
                        renderField(field, field_index, errors, values, handleChange, touched))
                    }
                    <Row>
                        <Col xl={6}>
                            <Button color="primary" variant="contained"
                                    disabled={isSubmitting}
                                    type="submit" className="mr-2 positive-button">
                                {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}Save
                            </Button>
                            <Link to={`/email/lists/${params.list_uid}/overview/subscribers`}>
                                <Button variant="outlined" color="secondary"
                                        type="button">
                                    Cancel
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                </Form>
            }}
        </Formik>
    };

    if (loading || !fields) {
        return <AppLoader/>
    }
    return <Row>
        <HeadingCol title="Edit Subscriber"
                    description={""}/>
        <Col xl={6} lg={6} md={8} sm={12}>
            <div className="mt-2">
                {error && <Alert variant="danger">{error}</Alert>}
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

export default EmailMailingListEditController;
