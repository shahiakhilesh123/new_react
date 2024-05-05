import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import ProductReview from "../../components/reviews/ProductReview";
import {Formik} from "formik";
import ChatAPIs, {iChatSettingsResponse} from "../../apis/chat.apis";
import {
    failed_block_action_response,
    iResource,
    iResponseActions,
    loading_action_response,
    responseReducer,
    success_action_response
} from "../../redux/reducers";
import * as yup from "yup";
import HeadingCol from "../../components/heading/HeadingCol";
import {createTheme} from '@material-ui/core/styles'
import {Button, Grid} from "@material-ui/core";
import AppCard from "../../components/Card/AppCard";
import AppCardBody from "../../components/Card/AppCardBody";
import useIsMounted from "ismounted";
import {Reducer} from "redux";
import {NotificationContext} from "../../App";
import ColorSketchPicker from "../../components/ColorPicker/colorPicker";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import useTheme from "@material-ui/core/styles/useTheme";
import ReviewApis, {iReviewSettingsResponse} from "../../apis/review.apis";
import AppLoader from "../../components/Loader/AppLoader";
import {HandleErrors} from "../../components/helper/form.helper";
import webfontloader from "webfontloader";
import FontPicker from "font-picker-react";
import {useTour} from "@reactour/tour";


export default function ReviewSettings() {

    const {currentStep} = useTour();
    useEffect(() => {
        document.title = "Review Settings | Emailwish";
    }, []);
    const [showPreview, setShowPreview] = useState<boolean>();
    const isMounted = useIsMounted();
    const [{
        response,
        error,
        loading,
        error_block
    }, dispatchResponse] = useReducer<Reducer<iResource<iReviewSettingsResponse>, iResponseActions<iChatSettingsResponse>>>
    (responseReducer<iResource<iReviewSettingsResponse>, any>({}), {loading: true});
    const notificationContext = useContext(NotificationContext);
    const theme = useTheme();
    useEffect(() => {
        fetchSettings();
    }, []);
    const fetchSettings = useCallback(() => {
        dispatchResponse(loading_action_response())
        new ReviewApis().settings().then(response => {
            if (isMounted.current) {
                if (ChatAPIs.hasError(response, notificationContext)) {
                    dispatchResponse(failed_block_action_response(response.message))
                } else {
                    dispatchResponse(success_action_response(response))
                }
            }
        })
    }, [isMounted]);
    useEffect(() => {
        if (response && response.review_settings && response.review_settings.font_family) {
            webfontloader.load(
                {
                    google: {
                        families: [response.review_settings.font_family]
                    }
                }
            )
        }

    }, [response])
    useEffect(() => {
        if (response && response.review_settings && response.review_settings.secondary_font_family) {
            webfontloader.load(
                {
                    google: {
                        families: [response.review_settings.secondary_font_family]
                    }
                }
            )
        }

    }, [response])
    if (loading) {
        return <AppLoader/>;
    }
    if (error_block) {
        return <Alert>{error_block}</Alert>
    }


    return <div>
        <Formik

            initialValues={{
                primary_background_color: (response && response.review_settings && response.review_settings.primary_background_color) || "#ffffff",
                primary_text_color: (response && response.review_settings && response.review_settings.primary_text_color) || "#ffffff",
                secondary_background_color: (response && response.review_settings && response.review_settings.secondary_background_color) || "#ffffff",
                secondary_text_color: (response && response.review_settings && response.review_settings.secondary_text_color) || "#ffffff",
                active_star_color: (response && response.review_settings && response.review_settings.active_star_color) || "#ffffff",
                inactive_star_color: (response && response.review_settings && response.review_settings.inactive_star_color) || "#ffffff",
                separator_color: (response && response.review_settings && response.review_settings.separator_color) || "#ffffff",
                font_family: (response && response.review_settings && response.review_settings.font_family) || "Open Sans",
                secondary_font_family: (response && response.review_settings && response.review_settings.secondary_font_family) || "Open Sans",
                star_size: (response && response.review_settings && response.review_settings.star_size) || "20",
                star_size_units: (response && response.review_settings && response.review_settings.star_size_units) || "PX"
            }}
            onSubmit={(values: any, helpers) => {
                new ReviewApis().store_settings(values).then(response => {
                    if (isMounted.current) {
                        helpers.setSubmitting(false)
                        if (ReviewApis.hasError(response, notificationContext)) {
                            if (!HandleErrors(response, helpers)) {
                                dispatchResponse(failed_block_action_response(response.message))
                            }
                        } else {
                        }
                    }

                })
            }}
            validationSchema={yup.object({
                primary_background_color: yup
                    .string()
                    .required("Please enter primary background color"),
                primary_text_color: yup
                    .string()
                    .required("Please enter primary text color"),
                secondary_background_color: yup
                    .string()
                    .required("Please enter secondary background color"),
                secondary_text_color: yup
                    .string()
                    .required("Please enter secondary text color"),
                active_star_color: yup
                    .string()
                    .required("Please enter active star color"),
                inactive_star_color: yup
                    .string()
                    .required("Please enter inactive star color"),
                separator_color: yup
                    .string()
                    .required("Please enter separator color"),
                font_family: yup
                    .string().required("Please select font family"),
                secondary_font_family: yup
                    .string().required("Please select font family"),
                star_size: yup
                    .string().required("Please enter star size"),
            })}
        >
            {({
                  handleSubmit,
                  handleChange,
                  values,
                  isSubmitting,
                  setFieldTouched,
                  touched,
                  errors,
                  setFieldValue
              }: any) => {
                return <>
                    <form onSubmit={handleSubmit}>
                        <Row>
                            <HeadingCol title="Review Widget Settings"
                                        description={""}/>

                        </Row>

                        <Grid container spacing={1}>
                            <Grid item md={4} sm={12} xs={12}>
                                <AppCard>
                                    <AppCardBody>
                                        <Row>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_font_family">
                                                    <Form.Label>
                                                        Primary Font Family </Form.Label>
                                                    <div>
                                                        <FontPicker
                                                            pickerId={"primary"}
                                                            apiKey={process.env.REACT_APP_FONT_API_KEY || ""}
                                                            activeFontFamily={values.font_family}
                                                            onChange={(nextFont) => {
                                                                setFieldValue("font_family", nextFont.family);
                                                            }}

                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_secondary_font_family">
                                                    <Form.Label>
                                                        Secondary Font Family </Form.Label>
                                                    <div>
                                                        <FontPicker
                                                            pickerId={"secondary"}
                                                            apiKey={process.env.REACT_APP_FONT_API_KEY || ""}
                                                            activeFontFamily={values.secondary_font_family}
                                                            onChange={(nextFont) => {
                                                                setFieldValue("secondary_font_family", nextFont.family);
                                                            }}

                                                        />
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_primary_background_color">
                                                    <Form.Label>
                                                        Primary Background color
                                                    </Form.Label>
                                                    <ColorSketchPicker
                                                        defaultValue={values.primary_background_color}
                                                        onChange={(v) => {
                                                            setFieldValue("primary_background_color", v);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_primary_text_color">
                                                    <Form.Label>
                                                        Primary text/icon color
                                                    </Form.Label>
                                                    <ColorSketchPicker
                                                        defaultValue={values.primary_text_color}
                                                        onChange={(v) => {
                                                            setFieldValue("primary_text_color", v);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_secondary_background_color">
                                                    <Form.Label>
                                                        Secondary Background color
                                                    </Form.Label>
                                                    <ColorSketchPicker
                                                        defaultValue={values.secondary_background_color}
                                                        onChange={(v) => {
                                                            setFieldValue("secondary_background_color", v);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_secondary_text_color">
                                                    <Form.Label>
                                                        Secondary text/icon color
                                                    </Form.Label>
                                                    <ColorSketchPicker
                                                        defaultValue={values.secondary_text_color}
                                                        onChange={(v) => {
                                                            setFieldValue("secondary_text_color", v);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_active_star_color">
                                                    <Form.Label>
                                                        Active Star color
                                                    </Form.Label>
                                                    <ColorSketchPicker
                                                        defaultValue={values.active_star_color}
                                                        onChange={(v) => {
                                                            setFieldValue("active_star_color", v);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_inactive_star_color">
                                                    <Form.Label>
                                                        Inactive Star color
                                                    </Form.Label>
                                                    <ColorSketchPicker
                                                        defaultValue={values.inactive_star_color}
                                                        onChange={(v) => {
                                                            setFieldValue("inactive_star_color", v);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_separator_color">
                                                    <Form.Label>
                                                        Separator color
                                                    </Form.Label>
                                                    <ColorSketchPicker
                                                        defaultValue={values.separator_color}
                                                        onChange={(v) => {
                                                            setFieldValue("separator_color", v);
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col lg={6} md={12}>
                                                <Form.Group data-tut="reactour__review_star_size">
                                                    <Form.Label>
                                                        Star Size
                                                    </Form.Label>
                                                    <div style={{ display: 'flex' }}>
                                                        <input 
                                                            defaultValue={values.star_size}
                                                            onChange={(v) => {
                                                                setFieldValue("star_size", v.target.value);
                                                            }}
                                                            type="number" 
                                                            min="1" 
                                                            max="50"
                                                            step="0.1" 
                                                            style={{
                                                            fontSize: '1.1667rem', 
                                                            padding: '5px', 
                                                            background: 'rgb(255, 255, 255)', 
                                                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px', 
                                                            borderRadius: '1px', 
                                                            border: 'none',
                                                            outline: 'none', 
                                                            }}
                                                        />
                                                        <select 
                                                            defaultValue={values.star_size_units}
                                                            onChange={(v) => {
                                                                setFieldValue("star_size_units", v.target.value);
                                                            }}
                                                            style={{ 
                                                            fontSize: '1.1667rem', 
                                                            padding: '5px', 
                                                            background: 'rgb(255, 255, 255)', 
                                                            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px', 
                                                            borderRadius: '1px', 
                                                            border: 'none' ,
                                                            outline: 'none',
                                                            }}
                                                        >
                                                            <option value="px">px</option>
                                                            <option value="em">em</option>
                                                            <option value="rem">rem</option>
                                                        </select>
                                                    </div>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <div className="d-flex align-items-center">
                                            <Button color="primary"
                                                    type="submit"
                                                    data-tut="reactour__review_submit_button"
                                                    disabled={isSubmitting}
                                                    variant="contained"
                                                    className="positive-button">
                                                {isSubmitting && <Spinner animation="border" size="sm"/>}
                                                Save Settings
                                            </Button>
                                        </div>

                                    </AppCardBody>
                                </AppCard>
                            </Grid>
                            <Grid item md={8} sm={12} xs={12}
                                  style={{
                                      zIndex: ((42 < currentStep) && (currentStep < 53)) ? 1000000 : "unset"
                                  }}
                            >

                                <AppCard>
                                    <AppCardBody>
                                        <ThemeProvider theme={createTheme({
                                                ...{
                                                    typography: {
                                                        fontFamily: 'FuturaPT',
                                                        subtitle1: {
                                                            color: "black"
                                                        },
                                                        body1: {
                                                            fontSize: "18px",
                                                        },
                                                        button: {
                                                            textTransform: "capitalize"
                                                        }
                                                    },
                                                    palette: {
                                                        primary: {
                                                            main: values.primary_background_color,
                                                            dark: values.primary_background_color,
                                                            contrastText: values.primary_text_color,
                                                        },
                                                        secondary: {
                                                            main: values.secondary_background_color,
                                                            contrastText: values.secondary_text_color,
                                                        },
                                                    },
                                                },
                                                typography: {
                                                    fontFamily: values.font_family,
                                                },
                                            }
                                        )}>
                                            <ProductReview ui_testing={true} settings={values}/>
                                        </ThemeProvider>
                                    </AppCardBody>
                                </AppCard>

                            </Grid>
                        </Grid>
                    </form>
                </>;
            }}
        </Formik>


    </div>;
}
