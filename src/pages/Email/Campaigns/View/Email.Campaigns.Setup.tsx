import React, {useCallback, useContext, useEffect, useState} from "react";
import EmailCampaignAPIs, {iEmailCampaignSetupParams,} from "../../../../apis/Email/email.campaigns.apis";
import useIsMounted from "ismounted";
import {Col, Form, Row, Spinner} from "react-bootstrap";
import {AppAlert} from "../../../../components/Alert";
import {FaArrowRight} from "react-icons/all";
import {Formik} from "formik";
import {HandleErrors} from "../../../../components/helper/form.helper";
import * as yup from "yup";
import FormGroup from "../../../../components/FormGroup/CustomFormGroup";
import {Button} from "@material-ui/core";
import AppLoader from "../../../../components/Loader/AppLoader";
import {EmailCampaignsViewContext} from "./Email.Campaigns.View";
import {NotificationContext} from "../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";


export default function EmailCampaignsSetup(props: { uid: string }) {
    const viewContext = useContext(EmailCampaignsViewContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState<string>("");

    const notificationContext = useContext(NotificationContext);
    const [initialValues, setInitialValues] = useState<iEmailCampaignSetupParams>({
        name: "",
        subject: "",
        from_name: "",
        from_email: "",
        use_default_sending_server_from_email: "0",
        reply_to: "",
        track_open: "0",
        track_click: "0",
        sign_dkim: "0"
    });
    const isMounted = useIsMounted();
    const fetchResource = useCallback(() => {
        setLoading(true);
        setErrorMessage("");
        new EmailCampaignAPIs().get_setup(props.uid).then(response => {
            if (isMounted.current) {
                if (EmailCampaignAPIs.hasError(response, notificationContext) || !response.campaign) {
                    setErrorMessage(EmailCampaignAPIs.getError(response))
                } else {
                    setInitialValues({
                        name: (response.campaign.name) || "",
                        subject: (response.campaign.subject) || "",
                        from_name: (response.campaign.from_name) || "",
                        from_email: (response.campaign.from_email) || "",
                        use_default_sending_server_from_email: (response.campaign.use_default_sending_server_from_email) || "0",
                        reply_to: (response.campaign.reply_to) || "",
                        track_open: (response.campaign.track_open) || "0",
                        track_click: (response.campaign.track_click) || "0",
                        sign_dkim: (response.campaign.sign_dkim) || "0"
                    })

                }
                setLoading(false);
            }

        })
    }, []);


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
    }, []);

    if (loading) return <AppLoader/>;
    return <div className="mt-2">
        <Row>
            <Col xl={12}>
                <div className="d-inline-block w-100">
                    <h5>Configure your campaign</h5>
                </div>
                <div className="mt-2">
                    <AppAlert error_message={error_message}/>
                    <Formik
                        initialValues={initialValues}
                        validateOnChange={false}
                        onSubmit={(values: any, helpers) => {
                            new EmailCampaignAPIs()
                                .save_setup(props.uid, values)
                                .then(response => {
                                    if (isMounted.current) {
                                        if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                                            if (!HandleErrors(response, helpers)) {
                                                setErrorMessage(EmailCampaignAPIs.getError(response));
                                            }
                                        } else {
                                            // @ts-ignore
                                            viewContext.setActiveStep(2)
                                        }
                                        helpers.setSubmitting(false);
                                    }
                                });

                        }}
                        key={initialValues.from_email}
                        validationSchema={yup.object({
                            name: yup.string().required("Please enter campaign name"),
                            subject: yup.string().required("Please enter campaign subject"),
                            from_name: yup.string().required("Please enter from name"),
                            from_email: yup.string().when("use_default_sending_server_from_email", {
                                is: (values => values !== "1"),
                                then: yup.string().email().required("Please enter from email"),
                                otherwise: yup.string()
                            }),
                            use_default_sending_server_from_email: yup.string(),
                            reply_to: yup.string().email().required("Please enter reply to address"),
                            track_open: yup.string(),
                            track_click: yup.string(),
                            sign_dkim: yup.string()
                        })}
                    >{({
                           handleSubmit,
                           handleBlur,
                           handleChange,
                           values,
                           touched,
                           errors,
                           isSubmitting,
                           setFieldValue
                       }: any) => {
                        return <form onSubmit={handleSubmit}>
                            <Row>
                                <Col xl={6} xs={12}>
                                    <FormGroup
                                        onChange={handleChange}
                                        type="text"
                                        name="name"
                                        label="Name your campaign"
                                        errors={errors}
                                        touched={touched}
                                        values={values}
                                        onBlur={handleBlur}
                                        placeholder="Give your campaign a name"
                                    />
                                    <FormGroup
                                        onChange={handleChange}
                                        type="text"
                                        name="subject"
                                        label="Email subject"
                                        errors={errors}
                                        touched={touched}
                                        values={values}
                                        onBlur={handleBlur}
                                        placeholder="A good subject must tell what's inside"
                                    />
                                    <FormGroup
                                        onChange={handleChange}
                                        type="text"
                                        name="from_name"
                                        label="From name"
                                        errors={errors}
                                        touched={touched}
                                        values={values}
                                        onBlur={handleBlur}
                                        placeholder="Use something your subscribers will instantly recognize"
                                    />


                                    <Form.Group>
                                        <Form.Check
                                            checked={values && values.use_default_sending_server_from_email === '1'}
                                            type="checkbox"
                                            name="use_default_sending_server_from_email"
                                            onChange={(e: any) => {
                                                setFieldValue("use_default_sending_server_from_email", e.target.checked ? "1" : "0");
                                            }}
                                            id="use_default_sending_server_from_email"
                                            onBlur={handleBlur}
                                            label="Use sending server's default from address"
                                        />
                                    </Form.Group>
                                    {
                                        values.use_default_sending_server_from_email !== "1" && <FormGroup
                                            onChange={handleChange}
                                            type="text"
                                            name="from_email"
                                            label="From email"
                                            errors={errors}
                                            touched={touched}
                                            values={values}
                                            onBlur={handleBlur}
                                            placeholder="Use a verified FROM address for increased deliverability"
                                        />
                                    }

                                    <FormGroup
                                        onChange={handleChange}
                                        type="text"
                                        name="reply_to"
                                        label="Reply to"
                                        errors={errors}
                                        touched={touched}
                                        values={values}
                                        onBlur={handleBlur}
                                        placeholder="Reply-To address"
                                    />
                                </Col>
                                <Col xl={6} xs={12}>
                                    <Form.Group>
                                        <Form.Label>Track Opens</Form.Label>
                                        <Form.Check
                                            checked={values && values.track_open === '1'}
                                            type="checkbox"
                                            name="track_open"
                                            onChange={(e: any) => {
                                                setFieldValue("track_open", e.target.checked ? "1" : "0");
                                            }}

                                            id="track_open"

                                            onBlur={handleBlur}
                                            label="Discover who opens your campaigns by tracking the number of times an invisible web beacon embedded in the campaign is downloaded."
                                        />
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Track Clicks</Form.Label>
                                        <Form.Check
                                            checked={values && values.track_click === '1'}
                                            type="checkbox"
                                            name="track_click"
                                            onChange={(e: any) => {
                                                setFieldValue("track_click", e.target.checked ? "1" : "0");
                                            }}

                                            id="track_click"
                                            onBlur={handleBlur}
                                            label="Discover which campaign links were clicked, how many times they were clicked, and who did the clicking."
                                        />
                                    </Form.Group>

                                    {/* <Form.Group> */}
                                    {/*     <Form.Label>Add DKIM signature</Form.Label> */}
                                    {/*     <Form.Check */}
                                    {/*         checked={values.sign_dkim === '1'} */}
                                    {/*         type="checkbox" */}
                                    {/*         name="sign_dkim" */}
                                    {/*         onChange={(e: any) => { */}
                                    {/*             setFieldValue("sign_dkim", e.target.checked ? "1" : "0"); */}
                                    {/*         }} */}
                                    {/**/}
                                    {/*         id="sign_dkim" */}
                                    {/*         label="Sign your email with your sending domain (if any), telling receiving email servers that your email is actually coming from you. This is to help establish the authenticity of your email, improving delivery rate." */}
                                    {/*     /> */}
                                    {/* </Form.Group> */}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12} className="d-flex justify-content-end">
                                    <Button variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="positive-button mt-2">{isSubmitting && <><Spinner
                                        animation="border"
                                        size="sm"/>&nbsp;</>}
                                        Save & Next<FaArrowRight/>
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

