import {useParams} from "react-router-dom";
import * as React from "react";
import {useCallback, useEffect, useReducer, useState} from "react";
import CommonApis, {iReviewResponse} from "../../../apis/common.apis";
import {Reducer} from "redux";
import {
    failed_block_action_response,
    iResource,
    iResponseActions,
    responseReducer,
    success_action_response,
} from "../../../redux/reducers";
import AppLoader from "../../../components/Loader/AppLoader";
import {Alert, Button, Col, Container, Row, Spinner} from "react-bootstrap";
import "./style.scss"
import {Theme, Typography} from "@material-ui/core";
import moment from "moment";
import * as yup from "yup";
import {FieldArray, Formik} from "formik";
import FormGroup from "../../../components/FormGroup/CustomFormGroup";
import {DropzoneArea} from "material-ui-dropzone";
import {createStyles, makeStyles} from "@material-ui/styles";
import Lottie from "lottie-react";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import done_lottie from "../../../assets/lottie/done.json"
import {HandleErrors} from "../../../components/helper/form.helper";

export default function ReviewUpdate() {
    const params: any = useParams();
    const [{response, error, loading, error_block}, dispatchResponse] = useReducer<Reducer<iResource<iReviewResponse>,
        iResponseActions<iReviewResponse>>>
    (responseReducer<iResource<iReviewResponse>, any>({}), {loading: true});
    const [uploadPercentage, setUploadPercentage] = useState<number>(0);
    const loadReview = useCallback(() => {
        new CommonApis().get_review(params.uid, params.secret).then((res => {
            if (CommonApis.hasError(res)) {
                dispatchResponse(failed_block_action_response(res.message))
            } else {
                dispatchResponse(success_action_response(res))
            }
        }))
    }, []);
    const summaryClasses = useSummaryStyles();
    const [reviewUpdated, setReviewUpdated] = useState(false);
    const [_error,setError]=useState("")
    useEffect(() => {

        loadReview();
    }, [])

    if (loading) {
        return <AppLoader/>
    }
    if (error_block) {
        return <Container>
            <div className="p-4">
                <Alert variant="warning">{error_block}</Alert>
            </div>

        </Container>
    }
    const review = response && response.review;
    return <Container>
        <div className="review-update">


            {
                reviewUpdated && <div className="done-animation-wrapper">
                    <div>
                        <Lottie animationData={done_lottie}
                                autoplay
                                loop
                                className="done-animation"/>
                    </div>
                    <Typography variant={"h4"}>
                        Thank you for updating your review.
                    </Typography>
                    <Typography variant={"body1"}>
                        <a className="app-link" onClick={() => {
                            setReviewUpdated(false)
                        }}>click here</a> to update again
                    </Typography>
                </div>
            }


            {
                !reviewUpdated && <div className="review-update-main">
                    <div className="review-update-heading">
                        Hi {response?.review?.reviewer_name}! You gave your
                        reviews on {response &&
                    response.review &&
                    response.review.updated_at
                    && moment(response.review.updated_at).format('MMMM D, YYYY')}
                    </div>

                    <Row className="review-update-main-entry">
                        <Col className="review-update-main-entry-heading" md={4} sm={12}>
                            <Typography>
                                Product name
                            </Typography>
                        </Col>
                        <Col className="review-update-main-entry-value" md={8} sm={12}>
                            {response && response.review && response.review.product && response.review.product.shopify_title}
                        </Col>
                    </Row>
                    {
                        response && response.review && response.review.images && response.review.images.length > 0 &&
                        <Row className="review-update-main-entry">
                            <Col className="review-update-main-entry-heading" md={4} sm={12}>
                                <Typography>
                                    Review Attachments
                                </Typography>
                            </Col>
                            <Col className="review-update-main-entry-value" md={8} sm={12}>
                                {response && response.review && response.review.images && response.review.images.map((v) => {
                                    return <div>
                                        <img src={v.full_path} alt={v.full_path}/>
                                    </div>
                                })}
                            </Col>
                        </Row>
                    }

                    {
                        !reviewUpdated && <div>
                            <Formik
                                initialValues={{
                                    images: [],
                                    title: (review && review.title) || "",
                                    message: (review && review.message) || "",
                                    stars: (review && review.stars) || "",
                                    reviewer_email: (review && review.reviewer_email) || "",
                                    reviewer_name: (review && review.reviewer_name) || "",
                                }}
                                onSubmit={(values: any, helpers) => {
                                    setError("")
                                    new CommonApis().update_review(params.uid, params.secret, values, progressEvent => {
                                        try {
                                            const percentage = Math.round(progressEvent.loaded / progressEvent.total * 100);
                                            setUploadPercentage(percentage)
                                        } catch (e) {

                                        }
                                    }).then((res) => {
                                        setUploadPercentage(0)
                                        if(CommonApis.hasError(res)){
                                            if(HandleErrors(res,helpers)){

                                            }
                                            setError(res.message||"Some unknown error occurred,Please try again later");
                                        }else {
                                            setReviewUpdated(true)
                                            loadReview()
                                        }
                                    })

                                }}
                                validationSchema={yup.object({
                                    title: yup.string().required("Please enter title"),
                                    message: yup.string().required("Please enter message"),
                                    stars: yup.string().required("Please enter stars"),
                                    reviewer_email: yup.string().required("Please enter reviewer email"),
                                    reviewer_name: yup.string().required("Please enter reviewer name"),
                                    images: yup.array(),
                                })}
                            >
                                {({
                                      handleSubmit,
                                      handleChange,
                                      values,
                                      isSubmitting,
                                      touched,
                                      errors,
                                      setFieldValue, validateForm

                                  }: any) => {
                                    return <form onSubmit={handleSubmit}>
                                        <Row>
                                            <Col md={12}>
                                                <FormGroup
                                                    label="Title"
                                                    name="title"
                                                    errors={errors}
                                                    touched={touched}
                                                    type="text"
                                                    onChange={handleChange}
                                                    values={values}
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <FormGroup
                                                    label="Message"
                                                    name="message"
                                                    as={"textarea"}
                                                    errors={errors}
                                                    touched={touched}
                                                    type="text"
                                                    onChange={handleChange}
                                                    values={values}
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <FormGroup
                                                    label="Your name"
                                                    name="reviewer_name"
                                                    errors={errors}
                                                    touched={touched}
                                                    type="text"
                                                    onChange={handleChange}
                                                    values={values}
                                                />
                                            </Col>
                                            <Col md={12}>
                                                <FormGroup
                                                    label="Your email"
                                                    name="reviewer_email"
                                                    errors={errors}
                                                    touched={touched}
                                                    type="text"
                                                    onChange={handleChange}
                                                    values={values}
                                                />
                                            </Col>

                                            <Col md={12}>
                                                <FieldArray name={"images"}>
                                                    {
                                                        props1 => {
                                                            return <DropzoneArea
                                                                dropzoneClass={summaryClasses.dropZone}
                                                                acceptedFiles={['image/*']}
                                                                maxFileSize={100000000}
                                                                filesLimit={3}
                                                                onChange={(files: any) => {
                                                                    setFieldValue("images", files)
                                                                }}
                                                                previewGridClasses={{
                                                                    container: summaryClasses.review_root,
                                                                    image: summaryClasses.dropZoneImage
                                                                }}
                                                                previewChipProps={{
                                                                    size: "small",
                                                                    style: {width: "10px"}
                                                                }}
                                                                previewGridProps={{
                                                                    container: {spacing: 2},
                                                                    item: {md: 4,}

                                                                }}
                                                                classes={{
                                                                    root: summaryClasses.review_root
                                                                }}

                                                                initialFiles={values.images}
                                                            />
                                                        }
                                                    }
                                                </FieldArray>
                                            </Col>
                                            <Col md={12}>
                                                {
                                                    uploadPercentage > 0 && <div className="mb-2">
                                                        <LinearProgress variant="determinate" value={50}/>
                                                    </div>
                                                }
                                            </Col>
                                            <Col md={12}>
                                                {
                                                    _error && <div className="mb-2">
                                                        <Alert variant={"danger"}>
                                                            {_error}
                                                        </Alert>
                                                    </div>
                                                }
                                            </Col>
                                            <Col md={12}>
                                                <div className="d-flex justify-content-center">
                                                    <Button type="submit" disabled={isSubmitting}>
                                                        {isSubmitting && (
                                                            <Spinner animation="border" size="sm"/>
                                                        )} Update Review
                                                    </Button>
                                                </div>
                                            </Col>
                                            <Col md={12}>
                                                <div className="d-flex justify-content-center p-4">
                                                    Powered by&nbsp;<a href={"https://emailwish.com"} target={"_blank"}
                                                                       rel="noopener noreferrer"> Emailwish</a>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>;
                                }}
                            </Formik>
                        </div>
                    }

                </div>
            }


        </div>
    </Container>
}
export const useSummaryStyles = makeStyles((theme: Theme) =>
        createStyles({
            review_root: () => {
                return {
                    flexGrow: 1,
                    width: "100%",
                    marginBottom: 8
                }
            },
            dropZone: () => {
                return {
                    padding: "20px",
                    backgroundColor: "#e4e4edd6",
                    color: "black",
                }
            },
            dropZoneImage: () => {
                return {
                    width: "20px",
                    backgroundColor: "#6500ff",
                    color: "black",
                }
            },
        }),
    {classNamePrefix: "summary", index: 1}
);
