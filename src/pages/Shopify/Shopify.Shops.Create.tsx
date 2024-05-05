import React, {useContext, useState} from "react";
import ShopifyShopAPIs, {iShopifyShopCreationParams,} from "../../apis/Shopify/shopify.shops.apis";
import {iApiBasicResponse} from "../../types/api";
import {Alert, Form, Spinner} from "react-bootstrap";
import {Redirect} from "react-router";
import {Button} from "@material-ui/core";
import Axios from "axios";
import * as yup from "yup";
import {Formik} from "formik";
import {NotificationContext} from "../../App";

export default function ShopifyShopsCreate(props: any) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error_message, setErrorMessage] = useState("");
    const [errors, setErrors] = useState<{
        [key: string]: string | Array<string>;
    }>();
    const [response, setResponse] = useState<iApiBasicResponse>();
    const createNewSchema = yup.object({
        shop: yup.string().required("Please enter some name"),
    });

    const notificationContext = useContext(NotificationContext);

    function createResource(creationParams: iShopifyShopCreationParams) {
        setLoading(true);
        setErrorMessage("");
        new ShopifyShopAPIs()
            .create(creationParams)
            .then((response) => onCreateShopResponse(response));
    }

    function onCreateShopResponse(response: iApiBasicResponse) {
        let source = Axios.CancelToken.source();
        if (ShopifyShopAPIs.hasError(response, notificationContext)) {
            setLoading(false);
            setErrorMessage(ShopifyShopAPIs.getError(response));
            setErrors(response.errors || {});
            setResponse(undefined);
        } else {
            setLoading(false);
            setErrorMessage("");
            setErrors({});
            setResponse(response);
            props.closeModal();
            props.refreshList(source);
        }
    }

    function getUid() {
        if (!response) return null;
        if (!response.uid) return null;
        return response.uid;
    }

    function renderErrorMessage() {
        if (!error_message) return null;
        return <Alert variant="danger">{error_message}</Alert>;
    }

    function renderForm() {
        const uid = getUid();
        if (uid) return <Redirect to={"/shopify/shops/view/" + uid}/>;
        return (
            <Formik
                initialValues={{
                    shop: "",
                }}
                onSubmit={(values: any) => {
                    createResource({
                        shop: values.shop,
                    });
                }}
                validationSchema={createNewSchema}
            >
                {({
                      handleSubmit,
                      handleChange,
                      values,
                      touched,
                      isSubmitting,
                      errors,
                  }: any) => {
                    return (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label className="text-box-label">Shop Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Name"
                                    name="shop"
                                    style={{
                                        border: 0,
                                        boxShadow: "var(--box-shadow-low)",
                                    }}
                                    value={values.shop}
                                    onChange={handleChange}
                                    isInvalid={touched && touched.shop && errors && !!errors.shop}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors && errors.shop}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Button
                                color="primary"
                                variant="contained"
                                type="submit"
                                disabled={loading}
                                className="positive-button"
                            >
                                {isSubmitting && <Spinner animation="border" size="sm"/>}
                                Save
                            </Button>
                            <Button type="button" variant="outlined" color="secondary" className="ml-2"
                                    onClick={props.closeModal}>
                                Cancel
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        );
    }

    return (
        <div className="mt-2">
            {renderErrorMessage()}
            {renderForm()}
        </div>
    );
}
