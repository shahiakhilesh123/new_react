import React, {useCallback, useContext, useEffect, useState} from "react";

import EmailTemplateAPIs from "../../../apis/Email/email.templates.apis";
import {iBasicListingResponse} from "../../../types/api";
import {iEmailTemplate, iEmailTemplateLayout} from "../../../types/internal";
import {Col, Form, Row, Spinner} from "react-bootstrap";
import {Box, Button} from "@material-ui/core";
import {Link, useHistory} from "react-router-dom";
import useIsMounted from "ismounted";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {Formik} from "formik";
import * as yup from "yup";
import FormGroup from "../../../components/FormGroup/CustomFormGroup";
import {AppAlert} from "../../../components/Alert";
import {Pagination} from "@material-ui/lab";
import {iEmailCampaign} from "../../../types/internal/email/campaign";
import {NotificationContext} from "../../../App";
import HeadingCol from "../../../components/heading/HeadingCol";
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";

interface TabPanelProps {
    children?: React.ReactNode;
    dir?: string;
    index: any;
    value: any;
}

export function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box p={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export function a11yProps(index: any) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

function EmailTemplatesCreate() {
    useEffect(() => {
        document.title = "Create Templates | Emailwish";
    }, []);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setErrorMessage] = useState("");
    const [template_gallery, setTemplateGallery] = useState<iEmailTemplate[]>([]);
    const [template_layouts, setTemplateLayout] = useState<iEmailTemplateLayout[]>([]);
    const [templateGalleryResponse, setTemplateGalleryResponse] = useState<iBasicListingResponse<iEmailTemplate> | undefined>();
    const [templatePageNumber, setTemplatePageNumber] = useState<number>(1);
    const [use_layout, setUseLayout] = useState<boolean>(true);
    const history = useHistory();
    const [resource, setResource] = useState<iEmailCampaign | undefined>();
    const [template, setTemplate] = useState<iEmailTemplate | undefined>();

    const notificationContext = useContext(NotificationContext);
    const isMounted = useIsMounted();
    useEffect(() => {
        fetchLayouts();
    }, []);
    useEffect(() => {
        fetchSamples(templatePageNumber);
    }, [templatePageNumber]);

    const fetchSamples = useCallback((templatePageNumber: number) => {
        new EmailTemplateAPIs().getTemplatesFromGallery(templatePageNumber).then(response => {
            if (isMounted.current) {
                if (EmailTemplateAPIs.hasError(response, notificationContext) || !response.templates) {
                    setTemplateGalleryResponse(undefined);
                } else {
                    setTemplateGalleryResponse(response.templates);
                }
            }
        });
    }, [isMounted]);

    const [value, setValue] = React.useState(0);

    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setValue(newValue);
    };

    const handleTabChangeIndex = (index: number) => {
        setValue(index);
    };

    const fetchLayouts = useCallback(() => {
        new EmailTemplateAPIs()
            .getTemplateLayouts()
            .then(response => {
                if (isMounted.current) {
                    if (EmailTemplateAPIs.hasError(response, notificationContext) || !response.template_layouts) {
                        setTemplateLayout([]);
                    } else {
                        setTemplateLayout(response.template_layouts || []);
                    }
                }
            });
    }, [isMounted]);


    function openTemplateEditLink(url: string) {
        let win = window.open(`${process.env.REACT_APP_SERVER_PATH}/templates/${url}/edit`);
        if (win)
            win.focus();
    }

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setTemplatePageNumber(value);
    };

    return <div className="mt-2">
        <Row>
            <HeadingCol
                title={"Create Email Template"}
                description={""}
            />
        </Row>
        <Formik
            initialValues={{
                name: "",
                layout: "",
                template: ""
            }}
            onSubmit={((values, formikHelpers) => {
                new EmailTemplateAPIs().create_template(values)
                    .then(response => {
                        if (isMounted.current) {
                            if (EmailTemplateAPIs.hasError(response, notificationContext) || !response.uid) {
                                setErrorMessage(EmailTemplateAPIs.getError(response));
                                formikHelpers.setSubmitting(false)
                            } else {

                                history.push(`${process.env.REACT_APP_SERVER_PATH}/templates/${response.uid}/edit`)
                            }
                        }
                    });
            })}
            validationSchema={yup.object({
                name: yup.string().required("Please enter a name")
            })}>
            {({
                  handleSubmit,
                  handleChange,
                  values,
                  touched,
                  isSubmitting,
                  setFieldValue,
                  errors,
              }: any) => {
                return <Form onSubmit={handleSubmit}>
                    <AppCard>
                        <AppCardBody>
                            <Row>
                                <Col lg={12} md={12}>
                                    <FormGroup
                                        label="Enter your template's name here *"
                                        name="name"
                                        type="text"
                                        formGroupProps={{style: {maxWidth: "250px"}}}
                                        onChange={handleChange}
                                        touched={touched}
                                        errors={errors}
                                        values={values}/>

                                    <Form.Group>
                                        <Form.Label>Select one of template layouts below</Form.Label>
                                        <Tabs
                                            value={value}
                                            onChange={handleTabChange}
                                            indicatorColor="primary"
                                            textColor="secondary"
                                            aria-label="full width tabs example"
                                            variant="scrollable"
                                        >
                                            <Tab label="Templates"  {...a11yProps(0)}/>
                                        </Tabs>


                                        <TabPanel value={value} index={0} dir="ltr">
                                            <Row>
                                                {templateGalleryResponse &&
                                                templateGalleryResponse.data &&
                                                templateGalleryResponse.data.map((response, index) => {
                                                    let className = "generic-select-child select-template-layout";
                                                    if (values.template === response.uid) className += " active";
                                                    return <div className="col-xxs-12 col-xs-6 col-sm-3 col-md-2"
                                                                key={index}>
                                                        <a onClick={() => {
                                                            setFieldValue("layout", "");
                                                            setFieldValue("template", response.uid);
                                                        }} className={className}>
                                                            <div className="panel panel-flat panel-template-style">
                                                                <div className="panel-body">
                                                                    <img
                                                                        src={
                                                                            new EmailTemplateAPIs().getApiBaseURL()  + (response.image ? response.image : "/assets/images/placeholder.jpg")
                                                                        }
                                                                        alt={response.name}/>
                                                                    <h6 className="mt-1 mb-20 text-center">{response.name}</h6>
                                                                </div>
                                                            </div>
                                                        </a>
                                                    </div>
                                                })}
                                                <Col md={12} className="mt-2">
                                                    {
                                                        templateGalleryResponse &&
                                                        <Pagination
                                                            count={templateGalleryResponse.last_page}
                                                            shape="rounded"
                                                            onChange={handlePageChange}/>
                                                    }
                                                </Col>
                                            </Row>
                                        </TabPanel>


                                    </Form.Group>
                                    {
                                        error && <AppAlert error_message={error}/>
                                    }
                                    <Button color="primary" variant="contained" type="submit" disabled={loading}>
                                        {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}
                                        Save
                                    </Button>
                                    <Link to="/email/templates">
                                        <Button variant="outlined" color="secondary" type="button" className="ml-2">
                                            Cancel
                                        </Button>
                                    </Link>
                                </Col>
                            </Row>
                        </AppCardBody>
                    </AppCard>
                </Form>
            }
            }
        </Formik>
    </div>;


}

export default EmailTemplatesCreate;
