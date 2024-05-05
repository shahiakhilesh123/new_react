import React, {useCallback, useContext, useEffect, useState} from "react";
import {Alert, Col, Form, Modal, ProgressBar, Row, Spinner} from "react-bootstrap";

import AppLoader from "../../../../components/Loader/AppLoader";
import {Button} from "@material-ui/core";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import EmailTemplateAPIs from "../../../../apis/Email/email.templates.apis";
import {Pagination} from "@material-ui/lab";
import {a11yProps, TabPanel} from "../../Templates/Email.Templates.Create";
import useIsMounted from "ismounted";
import {iEmailTemplate, iEmailTemplateLayout} from "../../../../types/internal";
import {iBasicListingResponse} from "../../../../types/api";
import {Formik} from "formik";
import {HandleErrors} from "../../../../components/helper/form.helper";
import * as yup from "yup";
import FormGroup from "../../../../components/FormGroup/CustomFormGroup";
import {Link} from "react-router-dom";
import EmailCampaignAPIs, {iEmailCampaignAttachment} from "../../../../apis/Email/email.campaigns.apis";
import {iEmailCampaign} from "../../../../types/internal/email/campaign";
import {AppAlert} from "../../../../components/Alert";
import {useDropzone} from "react-dropzone";
import {FaArrowRight, FaFile} from "react-icons/all";
import file_img from "../../../../assets/images/file.png"
import {EmailCampaignsViewContext} from "./Email.Campaigns.View";
import {NotificationContext} from "../../../../App";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";


export function EmailCampaignsTemplate(props: { uid: string, }) {
    const [loading, setLoading] = useState<boolean>(true);
    const [error_message, setErrorMessage] = useState<string | undefined>("");
    const [showTemplateChooser, setShowTemplateChooser] = useState(-1);
    const [showTemplateChooserModal, setShowTemplateChooserModal] = useState(false);
    const isMounted = useIsMounted();
    const [thumb_url, setThumbURL] = useState<string | undefined>();
    const [template_layouts, setTemplateLayout] = useState<iEmailTemplateLayout[]>();
    const [templateGalleryResponse, setTemplateGalleryResponse] = useState<iBasicListingResponse<iEmailTemplate> | undefined>();
    const [templatePageNumber, setTemplatePageNumber] = useState<number>(1);
    const [resource, setResource] = useState<iEmailCampaign | undefined>();
    const [attachments, setAttachments] = useState<iEmailCampaignAttachment[] | undefined>([]);
    const [attachmentsUploadProgress, setAttachmentsUploadProgress] = useState<any>({});
    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
        setShowTemplateChooser(newValue);
    };

    const notificationContext = useContext(NotificationContext);
    const [files, setFiles] = useState<any>([]);
    const viewContext = useContext(EmailCampaignsViewContext);
    const handleTabChangeIndex = (index: number) => {
        setShowTemplateChooser(index);
    };
    const get_attachments = useCallback(() => {
        if (resource) {
            new EmailCampaignAPIs().get_attachments(resource.uid).then(res => {
                if (isMounted.current) {
                    if (!EmailCampaignAPIs.hasError(res, notificationContext)) {

                        setAttachments(res.attachments);
                    }
                }
            });
        }
    }, [resource])

    const onDrop = useCallback(acceptedFiles => {

        let af = acceptedFiles.map((file: any) => Object.assign(file, {
            preview: URL.createObjectURL(file)
        }))
        let newState = [...files, ...af];
        setFiles(newState)
        if (resource) {
            for (let i = 0; i < af.length; i++) {
                new EmailCampaignAPIs().upload_attachment([af[i]], resource.uid, progressEvent => {
                    try {
                        const percentage = Math.round(progressEvent.loaded / (progressEvent.total ?? 0) * 100);
                        let progress = {...attachmentsUploadProgress};
                        progress[af[i].preview] = percentage;
                        setAttachmentsUploadProgress(progress)
                    } catch (e) {

                    }
                }).then((res) => {
                    if (isMounted.current) {
                        if (!EmailCampaignAPIs.hasError(res, notificationContext)) {

                            let progress = {...attachmentsUploadProgress};
                            progress[af[i].preview] = 100;
                            setAttachmentsUploadProgress(progress)
                            get_attachments();
                        }

                    }
                })
            }

        }
    }, [resource, files, attachmentsUploadProgress])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: onDrop})


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
    useEffect(() => {
        fetchLayouts();
        get_template();
    }, []);
    useEffect(() => {
        if (resource) {
            get_attachments()
        }
    }, [resource])
    const get_template = useCallback(() => {
        setLoading(true)
        new EmailCampaignAPIs()
            .get_template(props.uid)
            .then(response => {
                if (isMounted.current) {
                    if (EmailCampaignAPIs.hasError(response, notificationContext)) {
                        setErrorMessage(response.message)
                    } else {
                        setResource(response.campaign)
                        setThumbURL(response.thumb_url)
                        setLoading(false)
                    }
                }
            });
    }, [isMounted]);
    useEffect(() => {
        fetchTemplates(templatePageNumber);
    }, [templatePageNumber]);

    const fetchTemplates = useCallback((templatePageNumber: number) => {
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


    useEffect(() => () => {
        // Make sure to revoke the data uris to avoid memory leaks
        // @ts-ignore
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setTemplatePageNumber(value);
    };

    const thumbs = files.map((file: any, index: number) => {
        if (file.type && file.type.includes("image")) {
            return <div key={file.preview} className="thumb">
                <div className="thumbInner">
                    <img
                        src={file.preview}
                    />{attachmentsUploadProgress[file.preview] &&
                <ProgressBar now={attachmentsUploadProgress[file.preview]}
                             label={`${attachmentsUploadProgress[file.preview]}%`}/>
                }
                </div>
            </div>
        }
        return <div className="thumb" key={file.preview}>
            <div className="thumbInner">
                <img
                    src={file_img}

                />{attachmentsUploadProgress[file.preview] &&
            <ProgressBar now={attachmentsUploadProgress[file.preview]}
                         label={`${attachmentsUploadProgress[file.preview]}%`}/>
            }
            </div>
        </div>
    });
    if (loading) return <AppLoader/>;
    if (error_message) {
        return <AppAlert error_message={error_message}/>
    }


    return <>
        {
            resource && resource.type === "regular" && !thumb_url && <div className="mt-2">
                <Row>
                    <Col md>
                        <div className="d-inline-block w-100">
                            <h5>Email Content</h5>
                        </div>
                        <div className="d-inline-block">
                            <p style={{fontSize: "17.28px"}}>
                                Create your email from scratch or start from Emailwish per-built templates / themes.
                                Customize
                                the content the way you desire with our powerful but easy-to-use HTML email builder.
                            </p>
                        </div>
                        <ul className="hover-list">
                            <li className="template-start"
                            >

                                <div className="list-body">
                                    <h5>From a Template</h5>
                                    <p>No need to create an email from scratch. Start from a beautiful template we
                                        have</p>
                                </div>
                                <div className="list-action">
                                    <Button variant="contained" color="primary"
                                            className="positive-button" onClick={() => {
                                        setShowTemplateChooser(0);
                                        setShowTemplateChooserModal(true);
                                    }}>
                                        Start
                                    </Button>
                                </div>
                            </li>
                            <li className="template-start">
                                <div className="list-body">
                                    <h5>Upload own template</h5>
                                    <p>Upload your own template in ZIP format</p>
                                </div>
                                <div className="list-action">
                                    <Button variant="contained" color="primary"
                                            className="positive-button" onClick={() => {
                                        setShowTemplateChooser(1);

                                        setShowTemplateChooserModal(true);
                                    }}>
                                        Start
                                    </Button>
                                </div>
                            </li>
                        </ul>
                    </Col>
                </Row>

            </div>
        }
        {
            (resource && resource.type === "regular" && thumb_url) &&
            <div className="mt-2">
                <Row>
                    <Col md>
                        <div className="d-inline-block w-100">
                            <h5>Email Content</h5>
                        </div>
                        <div className="d-inline-block">
                            <p>
                                Create your email from scratch or start from Emailwish per-built templates / themes.
                                Customize
                                the content the way you desire with our powerful but easy-to-use HTML email builder.
                            </p>
                        </div>
                    </Col>
                    <Col xl={2}>
                        <img src={thumb_url} width={100} alt={""}/>
                    </Col>
                </Row>
                <Row className="campaign-more-button">
                    <Col md={12}>
                        <Button variant="contained"
                                color="primary"
                                className="mr-1 positive-button"
                                onClick={() => {
                                    setShowTemplateChooser(0);
                                    setShowTemplateChooserModal(true);
                                }}>Change Template</Button>
                        {
                            resource && <Button
                                color="primary"
                                variant="outlined"
                                className="mr-1"
                                href={new EmailTemplateAPIs().getExternalCampaignEditorURL(resource.uid)}
                            >
                                Design
                            </Button>
                        }
                    </Col>
                </Row>

                <Row className="campaign-attachments">
                    <Col md={12}>
                        <h5>Attachments</h5>
                        <p>
                            Email will be sent with the follow files below. Drag and drop your local files to upload
                            zone to attach files into the campaign email.
                        </p>
                    </Col>
                    <Col md={12}>
                        <div className="image_upload_div">
                            <form className="dropzone dz-clickable">
                                <div {...getRootProps()} className="dz-default dz-message">
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                            <span>Drop the files here ...</span> :
                                            <span>Drag 'n' drop some files here, or click to select files</span>
                                    }
                                </div>
                            </form>

                        </div>
                    </Col>
                    <Col md={12}>
                        <div className={"thumbsContainer"}>
                            {thumbs}
                        </div>
                    </Col>
                    <Col md={12} className="campaign-attachments-attached-files">
                        <h5>Attached files</h5>
                        {
                            resource && <ul>
                                {
                                    attachments && attachments.map((attachment, index) => {
                                        return <li className="d-flex align-items-canter"
                                                   key={index.toString() + attachment.size + attachment.name}>
                                            <div className="mr-auto d-flex align-items-canter">
                                                <FaFile/>
                                                <div className="d-inline-block name-wrapper">
                                                    <h6>{attachment.name}</h6>
                                                    <p>File size: {attachment.size}</p>
                                                </div>
                                            </div>
                                            <div className="text-nowrap">
                                                {
                                                    resource && <>
                                                        {/*    <a className="tip-right"*/}
                                                        {/*                 href={new EmailCampaignAPIs().getDownloadAttachmentLink(resource.uid, attachment.name)}>*/}
                                                        {/*    Download*/}
                                                        {/*</a>*/}
                                                        {/*    |*/}
                                                        <Button>
                                                            <a onClick={() => {
                                                                if (resource) {
                                                                    new EmailCampaignAPIs()
                                                                        .remove_attachment(resource.uid, attachment.name)
                                                                        .then((value => {
                                                                            if (isMounted.current) {
                                                                                if (!EmailCampaignAPIs.hasError(value, notificationContext)) {
                                                                                    get_attachments();
                                                                                }
                                                                            }
                                                                        }))
                                                                }

                                                            }}
                                                               className="remove-attachment">
                                                                Remove
                                                            </a>
                                                        </Button>


                                                    </>
                                                }
                                            </div>
                                        </li>
                                    })
                                }
                            </ul>
                        }
                        {
                            (!attachments || !attachments.length) && <p>No attached files</p>
                        }

                    </Col>
                </Row>
                <Row>
                    <Col md={12} className="d-flex justify-content-end">
                        <Button variant="contained"
                                color="primary"
                                type="button"
                                onClick={() => {
                                    // @ts-ignore
                                    viewContext.setActiveStep(3)
                                }
                                }
                                className="positive-button mt-2">
                            Save & Next<FaArrowRight/>
                        </Button>
                    </Col>
                </Row>
            </div>
        }
        {
            (resource && resource.type === "plain-text") &&
            <div className="mt-2">
                <Formik
                    initialValues={{
                        plain: (resource && resource.plain) || "",
                    }}
                    onSubmit={(values: any, formikHelpers: any) => {
                        if (resource) {
                            new EmailCampaignAPIs().save_plain_text_campaign(resource.uid, values.plain).then((res) => {
                                if (isMounted.current) {
                                    formikHelpers.setSubmitting(false);
                                    if (EmailCampaignAPIs.hasError(res, notificationContext)) {

                                    } else {
                                        // @ts-ignore
                                        viewContext.setActiveStep(3)
                                    }
                                }
                            })
                        }
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
                        return (
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md>
                                        <div className="d-inline-block w-100">
                                            <h5>Email Content</h5>
                                        </div>
                                        <div className="d-inline-block">
                                            <p>
                                                Enter your email plain text via text box below.
                                            </p>
                                        </div>
                                    </Col>
                                    <Col xl={12}>
                                        <FormGroup
                                            label=""
                                            name="plain"
                                            as={"textarea"}
                                            errors={errors}
                                            touched={touched}
                                            type="text"
                                            onChange={handleChange}
                                            values={values}
                                            formControlProps={{className: "text-field", style: {height: "200px"}}}
                                        />
                                    </Col>
                                </Row>

                                <Row>
                                    <Col md={12} className="d-flex justify-content-end">
                                        <Button variant="contained"
                                                color="primary"
                                                type="submit"
                                                className="positive-button mt-2">
                                            {isSubmitting && <><Spinner animation="border"
                                                                        size="sm"/>&nbsp;</>}
                                            Save & Next<FaArrowRight/>
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        )
                    }}
                </Formik>

            </div>
        }
        <Modal show={showTemplateChooserModal}
               onHide={() => {
                   setShowTemplateChooserModal(false);
               }} size="lg" aria-labelledby="contained-modal-title-vcenter"
               centered>
            {
                //@ts-ignore
                <Modal.Header closeButton>
                    <Modal.Title>Choose Email Content</Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                <Form.Group className="w-100">
                    <Form.Label className="w-100">
                        Select one of template layouts below
                    </Form.Label>
                    <Tabs
                        value={showTemplateChooser !== -1 ? showTemplateChooser : 0}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="secondary"
                        aria-label="full width tabs example"
                        variant="scrollable"
                    >
                        <Tab label="Templates"  {...a11yProps(0)}/>
                        <Tab label="Upload"  {...a11yProps(1)}/>
                    </Tabs>
                    <TabPanel value={showTemplateChooser !== -1 ? showTemplateChooser : 0} index={0} dir="ltr">
                        <Row>
                            {templateGalleryResponse &&
                            templateGalleryResponse.data &&
                            templateGalleryResponse.data.map((response, index) => {
                                let className = "generic-select-child select-template-layout";
                                return <div className="col-xxs-12 col-xs-6 col-sm-3 col-md-2"
                                            key={index}>
                                    <a onClick={() => {
                                        new EmailCampaignAPIs()
                                            .save_template_theme(props.uid, response.uid)
                                            .then((response) => {
                                                if (isMounted.current) {
                                                    if (!EmailCampaignAPIs.hasError(response, notificationContext)) {
                                                        setShowTemplateChooserModal(false);
                                                        get_template();
                                                    }
                                                }
                                            })
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
                    <TabPanel value={showTemplateChooser !== -1 ? showTemplateChooser : 0} index={1} dir="ltr">
                        <Row>
                            <Col md={12}>
                                <h5 className="app-dark-color mt-3 u500" style={{letterSpacing: "0.5px"}}>Upload
                                    Email Template</h5>
                                <Alert variant="info">
                                    <p className="app-dark-color dashboard-data u300">Please upload your HTML
                                        template bundle. Normally,
                                        it should be a .zip file containing:</p>
                                    <ul>
                                        <li>One single .html file and</li>
                                        <li>One directory at the same level containing asset files (JS, CSS,
                                            Images,
                                            etc.)
                                        </li>
                                    </ul>
                                </Alert>
                            </Col>
                            <Col md={12}>
                                <Formik
                                    initialValues={{
                                        name: "",
                                        file: "",
                                    }}
                                    onSubmit={((values, formikHelpers) => {
                                        new EmailTemplateAPIs().upload_template(values)
                                            .then(response => {
                                                if (isMounted.current) {
                                                    if (EmailTemplateAPIs.hasError(response, notificationContext) || !response.uid) {
                                                        if (HandleErrors(response, formikHelpers)) {

                                                        }
                                                    } else {
                                                        setShowTemplateChooserModal(false);
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
                                            <Button color="primary" variant="contained" type="submit"
                                                    disabled={isSubmitting}>
                                                {isSubmitting && <><Spinner animation="border"
                                                                            size="sm"/>&nbsp;</>}
                                                Save
                                            </Button>
                                            <Link to="/email/templates">
                                                <Button variant="outlined" color="secondary" type="button"
                                                        className="ml-2">
                                                    Cancel
                                                </Button>
                                            </Link>
                                        </Form>
                                    }}
                                </Formik>
                            </Col>
                        </Row>
                    </TabPanel>

                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => {
                    setShowTemplateChooserModal(false);
                }}>Close</Button>
            </Modal.Footer>
        </Modal>
    </>
}
