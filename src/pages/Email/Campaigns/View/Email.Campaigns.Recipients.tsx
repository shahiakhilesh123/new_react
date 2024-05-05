import React, {useCallback, useContext, useEffect, useState} from "react";
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import {FaArrowRight, FaPlus} from "react-icons/all";
import Select from "react-select";
import useIsMounted from "ismounted";
import * as yup from "yup";
import EmailCampaignAPIs, {iEmailCampaignRecipientsResponse,} from "../../../../apis/Email/email.campaigns.apis";
import {iEmailCampaign, iEmailCampaignListSegmentOption,} from "../../../../types/internal/email/campaign";
import {Link, useHistory} from "react-router-dom";
import AppLoader from "../../../../components/Loader/AppLoader";
import {Button, Checkbox, FormControlLabel} from "@material-ui/core";
import {FieldArray, Formik} from "formik";
import {HandleErrors} from "../../../../components/helper/form.helper";
import {EmailCampaignsViewContext} from "./Email.Campaigns.View";
import {NotificationContext} from "../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";

interface iSaveRecipient {
    lists_segments: Array<{
        mail_list_uid: string,
        is_default: boolean,
        segment2_uids: string[]
    }>
}


function EmailCampaignRecipients(props: { uid: string, }) {

    const viewContext = useContext(EmailCampaignsViewContext);
    const [loading, setLoading] = useState(false);
    const [error_message, setErrorMessage] = useState("");
    const [resource, setResource] = useState<iEmailCampaign | undefined>(undefined);
    const [list_segment_select_options, setListSegmentSelectOptions] = useState<iEmailCampaignListSegmentOption[]>([]);
    const history = useHistory();
    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const [initialValues, setInitialValues] = useState<iSaveRecipient>({
        lists_segments: [
            {
                mail_list_uid: "",
                is_default: true,
                segment2_uids: []
            }
        ]
    });
    const fetchResource = useCallback(() => {
        setLoading(true);
        setErrorMessage("");
        new EmailCampaignAPIs().get_recipients(props.uid).then(r => onFetchResourceResponse(r))
    }, [props,])

    const onFetchResourceResponse = useCallback((response: iEmailCampaignRecipientsResponse) => {
        if (!isMounted.current)
            return;

        if (EmailCampaignAPIs.hasError(response, notificationContext) || !response.campaign) {
            setErrorMessage(EmailCampaignAPIs.getError(response));
            setResource(undefined);
            setListSegmentSelectOptions([]);
        } else {
            setErrorMessage("");
            setResource(response.campaign);
            if (response.recipients && response.recipients.length > 0) {
                setInitialValues({
                    lists_segments: response.recipients
                })
            }
            setListSegmentSelectOptions(response.list_segment2_select_options || []);
        }

        setLoading(false);
    }, [isMounted]);

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

    const renderErrorMessage = () => {
        if (!error_message) return null;
        return <Alert variant="danger">{error_message}</Alert>
    };

    if (loading) return <AppLoader/>;
    if (!resource) return null;

    return <div className="mt-2">
        <Row>
            <Col xl={12}>
                <div className="d-inline-block w-100">
                    <h5>Choose one or more lists / segment for sending email</h5>

                </div>
                <div className="mt-2">
                    {renderErrorMessage()}
                    <Formik
                        initialValues={initialValues}
                        validateOnChange={false}
                        onSubmit={(values: any, helpers) => {
                            new EmailCampaignAPIs()
                                .save_recipients(props.uid, values)
                                .then(response => {
                                    if (isMounted.current) {
                                        if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                                            if (!HandleErrors(response, helpers)) {
                                                setErrorMessage(EmailCampaignAPIs.getError(response));
                                            }
                                        } else {
                                            // @ts-ignore
                                            viewContext.setActiveStep(1);

                                        }
                                        helpers.setSubmitting(false);
                                    }
                                });

                        }}
                        validationSchema={yup.object({
                            lists_segments: yup.array(
                                yup.object({
                                    mail_list_uid: yup.string().required("Please select one list"),
                                    is_default: yup.boolean(),
                                    segment2_uids: yup.array(
                                        yup.string()
                                    )
                                })
                            )
                        })}
                    >{({
                           handleSubmit,
                           handleBlur,
                           values,
                           touched,
                           errors,
                           isSubmitting,
                           setFieldValue
                       }: any) => {
                        return <form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={12}>
                                    <FieldArray name="lists_segments">
                                        {
                                            (lists_segments_props => {
                                                return <Row>
                                                    <Col md={12}>{
                                                        values.lists_segments.map((segment: {
                                                            mail_list_uid: string,
                                                            is_default: boolean,
                                                            segment2_uids: string[]
                                                        }, index: number) => {
                                                            const selectedList: iEmailCampaignListSegmentOption | undefined = list_segment_select_options
                                                                .find(list_option => list_option.value === segment.mail_list_uid);
                                                            return <Row key={index} className="mb-2">
                                                                <Col xl={2} lg={4} md={4} xs={12}>
                                                                    <FormControlLabel
                                                                        control={<Checkbox checked={segment.is_default}
                                                                                           onChange={(e) => {
                                                                                               if (!e.target.checked) {
                                                                                                   return
                                                                                               }
                                                                                               values.lists_segments.forEach((lists_segment: any, _index: number) => {
                                                                                                   if (lists_segment.is_default) {
                                                                                                       setFieldValue(`lists_segments[${_index}].is_default`, false);
                                                                                                   }
                                                                                               })
                                                                                               setFieldValue(`lists_segments[${index}].is_default`, true);
                                                                                           }}

                                                                                           onBlur={handleBlur}
                                                                                           name="Set as default list"/>}
                                                                        label="Set as default list"
                                                                    />
                                                                </Col>
                                                                <Col md={4} xs={12}>
                                                                    <Select
                                                                        options={list_segment_select_options}
                                                                        value={list_segment_select_options.find((value => value.value === segment.mail_list_uid))}
                                                                        onChange={(e: any) => {

                                                                            setFieldValue(`lists_segments[${index}].mail_list_uid`, e.value);
                                                                        }}
                                                                        onBlur={handleBlur}
                                                                    />
                                                                    <Form.Group>
                                                                        <Form.Control hidden isInvalid={
                                                                            touched &&
                                                                            touched.lists_segments &&
                                                                            touched.lists_segments.length > index && touched.lists_segments[index] &&
                                                                            touched.lists_segments[index].mail_list_uid &&
                                                                            !!(errors &&
                                                                                errors.lists_segments &&
                                                                                errors.lists_segments.length > index && errors.lists_segments[index] &&
                                                                                errors.lists_segments[index].mail_list_uid)
                                                                        }>

                                                                        </Form.Control>
                                                                        <Form.Control.Feedback
                                                                            type="invalid">
                                                                            {errors &&
                                                                            errors.lists_segments &&
                                                                            errors.lists_segments.length > index && errors.lists_segments[index] &&
                                                                            errors.lists_segments[index].mail_list_uid}
                                                                        </Form.Control.Feedback>
                                                                    </Form.Group>

                                                                </Col>
                                                                {!!selectedList && !!selectedList.segment2s && selectedList.segment2s.length > 0 &&
                                                                <Col md={4}
                                                                     xs={12}>
                                                                    <Form.Group>
                                                                        <Select isMulti={true}
                                                                                options={selectedList.segment2s}
                                                                                value={selectedList.segment2s.filter(_segment => segment.segment2_uids.includes(_segment.value))}
                                                                                onChange={(segment_uids: any) => {
                                                                                    if (segment_uids) {
                                                                                        setFieldValue(`lists_segments[${index}].segment2_uids`, segment_uids.map((value: any) => value.value));
                                                                                    } else {
                                                                                        setFieldValue(`lists_segments[${index}].segment2_uids`, []);
                                                                                    }
                                                                                }}/>
                                                                        <Form.Text>
                                                                            * Leave this box empty to choose all
                                                                            subscribers in the list
                                                                        </Form.Text>
                                                                    </Form.Group>

                                                                </Col>}
                                                                <Col md={2} xs={12}>
                                                                    {index > 0 &&
                                                                    <Button variant="text" color="secondary"
                                                                            onClick={() => {
                                                                                lists_segments_props.remove(index);
                                                                            }}>Delete</Button>}
                                                                </Col>
                                                            </Row>;
                                                        })
                                                    }</Col>
                                                    <Col md={12}>
                                                        <Button
                                                            variant="text"
                                                            color="secondary"
                                                            type="button"
                                                            className="mb-2"
                                                            onClick={() => {
                                                                lists_segments_props.push({
                                                                    mail_list_uid: "",
                                                                    is_default: false,
                                                                    segment2_uids: []
                                                                })
                                                            }}
                                                        >
                                                            <FaPlus/>
                                                            &nbsp;Add list / segment
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            })
                                        }
                                    </FieldArray>
                                    <Button>

                                        <Link to="/email/lists/create" color="primary">Create new mailing list</Link>
                                    </Button>
                                </Col>

                            </Row>
                            <Row>
                                <Col xs={12} className="d-flex justify-content-end">
                                    <Button variant="contained"
                                            color="primary"
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="positive-button mt-2">{isSubmitting && <><Spinner
                                        animation="border"
                                        size="sm"/>&nbsp;</>}
                                        Save & Next &nbsp;<FaArrowRight/>
                                    </Button>
                                </Col>
                            </Row>
                        </form>
                    }
                    }</Formik>
                </div>
            </Col>
        </Row>
    </div>;
}

export default EmailCampaignRecipients;
