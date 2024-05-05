import React, {useCallback, useContext, useEffect, useReducer} from "react";
import ShopifyReviewsAPIs, {iShopifyReviewViewResponse} from "../../apis/Reviews/shopify.reviews.apis";
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {useHistory} from "react-router";
import {Link, useParams} from "react-router-dom";
import * as yup from "yup";
import {Formik} from "formik";
import {NotificationContext} from "../../App";
import {Reducer} from "redux";
import {
    failed_action_response,
    failed_block_action_response,
    iResource,
    iResponseActions,
    loading_action_response,
    responseReducer,
    success_action_response
} from "../../redux/reducers";
import AppLoader from "../../components/Loader/AppLoader";
import useIsMounted from "ismounted";
import {HandleErrors} from "../../components/helper/form.helper";
import moment from "moment";
import AppCard from "../../components/Card/AppCard";
import AppCardBody from "../../components/Card/AppCardBody";
import HeadingCol from "../../components/heading/HeadingCol";
import FormGroup from "../../components/FormGroup/CustomFormGroup";
import DatePicker from "react-datepicker";
import {Checkbox, FormControlLabel} from "@material-ui/core";
import AsyncSelect from "react-select/async";

function ReviewsCreate() {
    useEffect(() => {
        document.title = "Update Review / Emailwish";
    }, []);
    const [{loading, error, error_block, response}, dispatchResponse] =
        useReducer<Reducer<iResource<iShopifyReviewViewResponse | undefined>,
            iResponseActions<iShopifyReviewViewResponse | undefined>>>
        (responseReducer<iResource<iShopifyReviewViewResponse | undefined>, any>({}), {loading: true});
    const history = useHistory();
    const isMounted = useIsMounted();
    const params: any = useParams<any>();
    const notificationContext = useContext(NotificationContext);

    const loadReview = useCallback(() => {
        dispatchResponse(loading_action_response())
        new ShopifyReviewsAPIs().view_review(params.id).then((res) => {
            if (isMounted.current) {
                if (ShopifyReviewsAPIs.hasError(res)) {
                    dispatchResponse(failed_block_action_response(res.message))
                } else {
                    dispatchResponse(success_action_response(res))
                }
            }
        })
    }, [params])
    useEffect(() => {
        if (params.id) {
            loadReview();
        } else {
            dispatchResponse(success_action_response(undefined))
        }
    }, [])

    const showNoOptionsMessage = useCallback((val: any) => {
        let iVal = val.inputValue;
        if (!iVal.length) return "Type to search Product...";
        else return "No Product found. Try with product name";
    }, []);


    if (loading) {
        return <AppLoader/>
    }
    if (error_block) {
        return <Alert>{error_block}</Alert>
    }
    return (
        <Row>
            <HeadingCol
                title="Update Review"
            />
            <Col>
                <AppCard>
                    <AppCardBody className="p-3">
                        <Formik
                            initialValues={{
                                reviewer_email: (response && response.review && response.review.reviewer_email) || "",
                                reviewer_name: (response && response.review && response.review.reviewer_name) || "",
                                shopify_product_id: (response && response.review && response.review.shopify_product_id) || "",
                                product: (response && response.review && response.review.product &&
                                    {
                                        label: response.review.product.shopify_title,
                                        value: response.review.product.shopify_id
                                    }) || {},
                                title: (response && response.review && response.review.title) || "",
                                stars: (response && response.review && response.review.stars) || "",
                                message: (response && response.review && response.review.message) || "",
                                verified_purchase: (response && response.review && response.review.verified_purchase),
                                approved: response && response.review && response.review.approved,
                                images: [],
                                _created_at: (response && response.review && response.review.created_at && new Date(response.review.created_at)) || new Date(),
                            }}
                            onSubmit={(values: any, formikHelpers) => {
                                formikHelpers.setSubmitting(true)

                                values["created_at"] = moment(values._created_at.toISOString()).format("YYYY-MM-DD")
                                if (!params.id) {
                                    new ShopifyReviewsAPIs().create_review(values).then((response) => {
                                        if (isMounted.current) {
                                            formikHelpers.setSubmitting(false)
                                            if (ShopifyReviewsAPIs.hasError(response, notificationContext)) {
                                                if (!HandleErrors(response, formikHelpers)) {
                                                    dispatchResponse(failed_action_response(response.message))
                                                }
                                            } else {
                                                history.replace("/reviews")
                                            }
                                        }
                                    });
                                } else {
                                    new ShopifyReviewsAPIs().update_review(params.id, values).then((response) => {
                                        if (isMounted.current) {
                                            formikHelpers.setSubmitting(false)
                                            if (ShopifyReviewsAPIs.hasError(response, notificationContext)) {
                                                if (!HandleErrors(response, formikHelpers)) {
                                                    dispatchResponse(failed_action_response(response.message))
                                                }
                                            } else {
                                                history.replace("/reviews")
                                            }
                                        }
                                    });
                                }
                            }}
                            validationSchema={yup.object({
                                reviewer_email: yup
                                    .string()
                                    .required("Please enter Reviewer Email Address"),
                                reviewer_name: yup
                                    .string()
                                    .required("Please enter Reviewer Name"),
                                shopify_product_id: yup.string().required("Please select one product"),
                                title: yup.string().required("Please enter review title"),
                                stars: yup.number().required("Please give rating").max(5).min(1),
                                media: yup.mixed(),
                                _created_at: yup.string().required("Please enter creation date"),
                            })}
                        >
                            {({
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  touched,
                                  isSubmitting,
                                  errors,
                                  setFieldValue,
                              }) => {
                                console.log(errors)
                                return <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col xl={6} className={"mb-1"}>
                                            <div className="mt-2">

                                                <Row>
                                                    <FormGroup
                                                        onChange={handleChange}
                                                        values={values}
                                                        touched={touched}
                                                        errors={errors}
                                                        type="email"

                                                        name="reviewer_email"
                                                        label="Review Email Address *"
                                                        formGroupProps={{as: Col, md: 6}}
                                                    />
                                                    <FormGroup
                                                        onChange={handleChange}
                                                        values={values}
                                                        touched={touched}
                                                        errors={errors}
                                                        type="text"

                                                        name="reviewer_name"
                                                        label="Reviewer Name *"
                                                        formGroupProps={{as: Col, md: 6}}
                                                    />
                                                    <Form.Group as={Col} md={6}>
                                                        <Form.Label>Product *</Form.Label>
                                                        <AsyncSelect
                                                            value={values.product}
                                                            cacheOptions
                                                            defaultValue={values.product}

                                                            onChange={(item) => {
                                                                setFieldValue("product", item)
                                                                setFieldValue("shopify_product_id", item.value)
                                                            }}
                                                            placeholder={"Search by product name"}
                                                            noOptionsMessage={showNoOptionsMessage}
                                                            loadOptions={inputValue => {
                                                                return new ShopifyReviewsAPIs().list_products_select(inputValue).then((res) => {
                                                                    if (isMounted.current) {
                                                                        if (!ShopifyReviewsAPIs.hasError(res)) {
                                                                            return res.products || []
                                                                        }
                                                                        return []
                                                                    }
                                                                    return []
                                                                })
                                                            }}
                                                            name="Titles"
                                                            className="basic-multi-select"
                                                            classNamePrefix="select"/>
                                                        <Form.Control type={"hidden"} isInvalid={
                                                            touched && touched.shopify_product_uid &&
                                                            !(errors && errors.shopify_product_uid)}/>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors && errors.shopify_product_uid}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group as={Col} md={6}>
                                                        <Form.Label>Creation Date</Form.Label>
                                                        <div style={{display: "block", width: "100%"}}>
                                                            <DatePicker
                                                                onChange={(e) => {
                                                                    if (e) {
                                                                        setFieldValue("_created_at", e)
                                                                    } else {
                                                                        setFieldValue("_created_at", new Date())
                                                                    }
                                                                }}
                                                                selected={values._created_at}
                                                                name="_created_at"

                                                                className="form-control"
                                                                dateFormat="yyyy-MM-dd"/>

                                                        </div>
                                                        <Form.Control type={"hidden"} isInvalid={
                                                            touched && touched._created_at &&
                                                            !(errors && errors._created_at)}/>
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors && errors._created_at}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <FormGroup
                                                        onChange={handleChange}
                                                        values={values}
                                                        touched={touched}
                                                        errors={errors}

                                                        type="text"
                                                        name="title"
                                                        label="Review Title"
                                                        formGroupProps={{as: Col, md: 6}}
                                                    />
                                                    <FormGroup
                                                        onChange={handleChange}
                                                        values={values}
                                                        touched={touched}
                                                        errors={errors}

                                                        type="number"
                                                        name="stars"
                                                        label="Stars"
                                                        formGroupProps={{as: Col, md: 6}}
                                                    />
                                                    <FormGroup
                                                        onChange={handleChange}
                                                        values={values}
                                                        touched={touched}
                                                        errors={errors}
                                                        type="text"

                                                        as="textarea"
                                                        name="message"
                                                        label="Review Message"
                                                        formGroupProps={{as: Col, md: 12}}
                                                    />
                                                    <Col md={4}>
                                                        <Form.Group>
                                                            <FormControlLabel
                                                                control={<Checkbox

                                                                    color="primary"
                                                                    checked={values.verified_purchase}
                                                                    onChange={(e: any) => {
                                                                        setFieldValue("verified_purchase", e.target.checked)
                                                                    }} name="verified_purchase"/>}

                                                                label="Verified Purchase"
                                                            />
                                                            <Form.Control
                                                                name="verified_purchase"
                                                                hidden
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.verified_purchase &&
                                                                    errors &&
                                                                    !!errors.verified_purchase
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.verified_purchase}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Form.Group>
                                                            <FormControlLabel
                                                                control={<Checkbox
                                                                    color="primary"
                                                                    checked={values.approved} onChange={(e: any) => {
                                                                    setFieldValue("approved", e.target.checked)
                                                                }} name="approved"/>}

                                                                label="Approved"
                                                            />
                                                            <Form.Control
                                                                name="approved"
                                                                hidden
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.approved &&
                                                                    errors &&
                                                                    !!errors.approved
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.approved}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </Col>

                                                </Row>

                                                <Button
                                                    variant="primary"
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting && <><Spinner animation="border"
                                                                                size="sm"/>&nbsp;</>}
                                                    Save
                                                </Button>
                                                <Link to="/reviews">
                                                    <Button variant="outlined" color="secondary" type="button"
                                                            className="ml-2">
                                                        Cancel
                                                    </Button>
                                                </Link>

                                            </div>
                                        </Col>
                                        <Col xl={6} lg={6} md={8} sm={12}>

                                            <Row>
                                                {response && response.review && response.review.images && response.review.images.map((res) => {
                                                    return <Col lg={4} md={6} key={res.full_path}><img
                                                        src={res.full_path}
                                                        alt={res.full_path}/></Col>

                                                })}
                                                <Col md={12} className={"mt-5"}>
                                                    <Form.Group>
                                                        <Form.File
                                                            onChange={(event: any) => {

                                                                if (event.target.files) {
                                                                    setFieldValue("images", event.target.files)
                                                                }
                                                            }}
                                                            multiple
                                                            accept=".jpg,.png"
                                                            isInvalid={
                                                                touched &&
                                                                touched.images &&
                                                                errors &&
                                                                !!errors.images
                                                            }
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            {errors && errors.images}
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                </Form>
                            }}
                        </Formik>
                    </AppCardBody>
                </AppCard>
            </Col>
        </Row>
    );
}

export default ReviewsCreate;
