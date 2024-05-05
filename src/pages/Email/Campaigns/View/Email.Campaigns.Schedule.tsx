import React, {useCallback, useContext, useEffect, useState} from "react";
import EmailCampaignAPIs, {iEmailCampaignScheduleParams} from "../../../../apis/Email/email.campaigns.apis";
import {iEmailCampaign, iEmailCampaignConfirm} from "../../../../types/internal/email/campaign";
import {Col, Form, Row, Spinner} from "react-bootstrap";
import {AppAlert} from "../../../../components/Alert";
import {FaArrowRight, FaEdit, FaEye} from "react-icons/all";
import {Formik} from "formik";
import {HandleErrors} from "../../../../components/helper/form.helper";
import * as yup from "yup";
import useIsMounted from "ismounted";
import {Button} from "@material-ui/core";
import {EmailCampaignsViewContext} from "./Email.Campaigns.View";
import AppLoader from "../../../../components/Loader/AppLoader";
import DatePicker from "react-datepicker";

import {NotificationContext} from "../../../../App";
import Table from "../../../../components/Table/Table";
import {useHistory} from "react-router-dom";
import moment from "moment";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";


export default function EmailCampaignSchedule1(props: { uid: string, }) {
    const [loading, setLoading] = useState(false);
    const [error_message, setErrorMessage] = useState<string | undefined>("");
    const [resource, setResource] = useState<iEmailCampaign | undefined>();
    const [schedule, setSchedule] = useState<iEmailCampaignScheduleParams | undefined>();
    const isMounted = useIsMounted();

    const [confirm, setConfirm] = useState<iEmailCampaignConfirm | undefined>();
    const notificationContext = useContext(NotificationContext);
    const viewContext = useContext(EmailCampaignsViewContext);
    const history = useHistory();
    const fetchResource = useCallback(() => {
        setLoading(true);
        setErrorMessage("");
        new EmailCampaignAPIs().get_schedule(props.uid)
            .then(response => {
                if (EmailCampaignAPIs.hasError(response, notificationContext) || !response.campaign || !response.schedule) {
                    setLoading(false);
                    setErrorMessage(EmailCampaignAPIs.getError(response))
                    setSchedule(undefined);
                    setResource(undefined)
                } else {
                    setLoading(false);
                    setErrorMessage("")
                    setSchedule(response.schedule);
                    setConfirm(response.confirm)
                    setResource(response.campaign)
                }
            })
    }, [])
    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/campaigns",
                text: "Campaigns"
            })
            links.push({
                link: ``,
                text: "Create New Campaign"
            })
            breadcrumb.setLinks(links);
        }
    }, [])

    useEffect(() => {
        fetchResource();
    }, [])
    if (loading) return <AppLoader/>;
    if (!resource) return null;
    return <div className="mt-2">
        <Row>
            <Col xl={12}>
                <div className="d-inline-block w-100">
                    <h5>Configure your campaign</h5>
                </div>
                <div className="mt-2">
                    <AppAlert error_message={error_message}/>
                    <Formik
                        initialValues={{
                            delivery_date: (schedule && new Date(schedule.delivery_date + ", " + schedule.delivery_time)) || new Date(),
                            delivery_time: (schedule && new Date(schedule.delivery_date + ", " + schedule.delivery_time)) || new Date(),
                        }}
                        key={(schedule && schedule.delivery_time) || "1"}
                        validateOnChange={false}
                        onSubmit={(values: any, helpers) => {
                            let _values: any = {};
                            _values["delivery_date"] = moment(values.delivery_date.toISOString()).format("YYYY-MM-DD")
                            _values["delivery_time"] = moment(values.delivery_time.toISOString()).format("HH:mm")
                            new EmailCampaignAPIs().save_schedule(props.uid, _values)
                                .then(response => {
                                    if (isMounted.current) {
                                        if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                                            if (!HandleErrors(response, helpers)) {
                                                setErrorMessage(EmailCampaignAPIs.getError(response));
                                            }
                                        } else {
                                            history.replace("/email/campaigns")
                                        }
                                        helpers.setSubmitting(false);
                                    }
                                });

                        }}
                        validationSchema={yup.object({
                            delivery_date: yup.string().required("Please enter delivery date"),
                            delivery_time: yup.string().required("Please enter delivery date"),
                        })}
                    >{({
                           handleSubmit,
                           values,
                           touched,
                           errors,
                           isSubmitting,
                           setFieldValue
                       }: any) => {
                        return <form onSubmit={handleSubmit}>

                            <Row>
                                <Col xl={12}>
                                    <div className="d-inline-block w-100">
                                        <p className="mb-0">You're all set to send!</p>
                                        <p className="mb-0">Review the feedback below before sending your campaign</p>
                                    </div>
                                    <div className="mt-2">
                                        <AppAlert error_message={error_message}/>
                                        {
                                            confirm && resource && <Table>
                                                <tbody>
                                                <tr>
                                                    <td>
                                                        <h5>{confirm.recipients_count} Recipients</h5>
                                                        <p>{confirm.recipients}</p>
                                                    </td>
                                                    <td>
                                                        <Button variant="contained"
                                                                color="primary"
                                                                type="button"
                                                                className="positive-button"
                                                                onClick={() => {
                                                                    // @ts-ignore
                                                                    viewContext.setActiveStep(0)
                                                                }}>
                                                            <FaEdit/>&nbsp;  Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h5>Email Subject</h5>
                                                        <p>{confirm.subject}</p>
                                                    </td>
                                                    <td>

                                                        <Button variant="contained"
                                                                color="primary"
                                                                type="button"
                                                                className="positive-button"
                                                                onClick={() => {
                                                                    // @ts-ignore
                                                                    viewContext.setActiveStep(1)
                                                                }}>
                                                            <FaEdit/>&nbsp;  Edit
                                                        </Button>

                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h5>Reply to</h5>
                                                        <p>{confirm.reply_to}</p>
                                                    </td>
                                                    <td>
                                                        <Button variant="contained"
                                                                color="primary"
                                                                type="button"
                                                                className="positive-button"
                                                                onClick={() => {
                                                                    // @ts-ignore
                                                                    viewContext.setActiveStep(1)
                                                                }}>
                                                            <FaEdit/>&nbsp;  Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h5>Tracking</h5>
                                                        <p>{confirm.track_open === "1" ? "Opens" : ""} {confirm.track_click === "1" ? "Clicks" : ""}</p>
                                                    </td>
                                                    <td>
                                                        <Button variant="contained"
                                                                color="primary"
                                                                type="button"
                                                                className="positive-button"
                                                                onClick={() => {
                                                                    // @ts-ignore
                                                                    viewContext.setActiveStep(1)
                                                                }}>
                                                            <FaEdit/>&nbsp;  Edit
                                                        </Button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <h5>Run at</h5>
                                                        <p>{confirm.run_at}</p>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex">
                                                            <Form.Group className="mr-1" style={{width: "100px"}}>
                                                                <Form.Label>Delivery Date</Form.Label>
                                                                <div style={{display: "block"}}>
                                                                    <DatePicker

                                                                        onChange={(e) => {
                                                                            if (e) {
                                                                                setFieldValue("delivery_date", e)
                                                                            } else {
                                                                                setFieldValue("delivery_time", new Date())
                                                                            }
                                                                        }}

                                                                        selected={values.delivery_date}
                                                                        name="delivery_date"
                                                                        minDate={new Date()}
                                                                        placeholderText="Select other date"
                                                                        className="form-control"
                                                                        dateFormat="yyyy-MM-dd"/>

                                                                </div>
                                                                <Form.Control type={"hidden"} isInvalid={
                                                                    touched && touched.delivery_date &&
                                                                    !(errors && errors.delivery_date)}/>
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors && errors.delivery_date}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                            <Form.Group style={{width: "100px"}}>
                                                                <Form.Label>Delivery Time</Form.Label>
                                                                <div style={{display: "block"}}>
                                                                    <DatePicker
                                                                        onChange={(e) => {
                                                                            if (e) {
                                                                                setFieldValue("delivery_time", e)
                                                                            } else {
                                                                                setFieldValue("delivery_time", new Date())
                                                                            }
                                                                        }}
                                                                        selected={values.delivery_time}
                                                                        name="delivery_time"
                                                                        className="form-control"
                                                                        showTimeSelect
                                                                        showTimeSelectOnly
                                                                        timeFormat="HH:mm"
                                                                        timeIntervals={15}
                                                                        dateFormat="HH:mm"
                                                                        dropdownMode="select"/>

                                                                </div>
                                                                <Form.Control type={"hidden"} isInvalid={
                                                                    touched && touched.delivery_time &&
                                                                    !(errors && errors.delivery_time)}/>
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors && errors.delivery_time}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </Table>
                                        }
                                        <Row>
                                            <Col xs={12} className="d-flex justify-content-end">

                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} className="d-flex justify-content-end mt-2">
                                    {
                                        resource &&

                                        <a href={new EmailCampaignAPIs().getPreviewURL(resource.uid)}
                                           target="popup"
                                           onClick={() => {
                                               window.open(new EmailCampaignAPIs().getPreviewURL(resource.uid), 'popup', 'width=1000,height=600,scrollbars=yes,resizable=yes')
                                               return false;
                                           }}>
                                            <Button variant="outlined"
                                                    type="button"
                                                    color="primary"
                                                    className="ml-2"
                                            >

                                                Preview &nbsp;<FaEye/>
                                            </Button>
                                        </a>
                                    }
                                    <Button variant="contained"
                                            color="primary"
                                            type="submit" className="ml-2 positive-button">
                                        {isSubmitting && <><Spinner animation="border"
                                                                    size="sm"/>&nbsp;</>}
                                        Confirm&nbsp;<FaArrowRight/>
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    }}</Formik>

                </div>
            </Col>
        </Row>
    </div>

}

