import React, {useCallback, useContext, useEffect, useReducer, useState} from "react";
import {Alert, Badge, Col, Form, Row, Spinner} from "react-bootstrap";
import BaseAPIs from "../../../../../apis/base.apis";
import * as yup from "yup";
import {Formik} from "formik";
import {Button} from "@material-ui/core";
import {useParams, Link} from "react-router-dom";
import EmailMailingListSubscriberAPIs, {
    SystemJob,
    SystemJobResponseList,
} from "../../../../../apis/Email/email.mailinglists.subscribers.apis";
import {Reducer} from "redux";
import {
    current_page_change_action,
    failed_action,
    iListResource,
    iListResponseActions,
    listReducer,
    loading_action,
    onSortAction,
    per_page_row_change_action,
    search_action,
    success_action,
} from "../../../../../redux/reducers";
import AppLoader from "../../../../../components/Loader/AppLoader";
import {customStyles} from "../../../../../components/common/common";
import CustomDataTable from "../../../../../components/CustomerDataTable/CustomDataTable";
import FormattedDate from "../../../../../components/Utils/FormattedDate";
import useIsMounted from "ismounted";
import {AppStateContext, NotificationContext} from "../../../../../App";
import {HandleErrors} from "../../../../../components/helper/form.helper";
import useInterval from "use-interval";
import {BreadCrumbContext, BreadCrumbLink,} from "../../../../../components/Breadcrumbs/WithBreadcrumb";
import { UpgradePlanWarning } from "../../../../../components/UpgradePlanWrapper/UpgradePlanWrapper";

export default function EmailListSubscribersImport() {
    const {shop} = useContext(AppStateContext);
    let [can_import, setImport] = useState(true);
    useEffect(() => {
        if (shop && shop.customer && shop.customer.plan) {
            const options = JSON.parse(shop.customer.plan.options)
            if (options && options["list_import"] === "no") {
                setImport(false);
            }
        }
    }, [shop]);
    useEffect(() => {
        document.title = "Import Subscriber | Emailwish";
    }, []);
    const params: any = useParams<any>();
    const [response, dispatchList] = useReducer<Reducer<iListResource<SystemJobResponseList>,
        iListResponseActions<SystemJobResponseList>>>(listReducer<iListResource<SystemJobResponseList>, any>({}), {
        query: {sort_direction: "desc", sort_order: "created_at"},
        loading: true,
    });
    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const loadResource = useCallback(() => {
        dispatchList(loading_action());

        new EmailMailingListSubscriberAPIs()
            .import_list(params.list_uid, response?.query)
            .then((res) => {
                if (isMounted.current) {
                    if (EmailMailingListSubscriberAPIs.hasError(res)) {
                        dispatchList(failed_action(res.message));
                    } else {
                        dispatchList(success_action(res));
                    }
                }
            });
    }, [isMounted, params, response?.query]);

    const breadcrumb = useContext(BreadCrumbContext);
    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = [];
            links.push({
                link: "/email/lists",
                text: "Lists",
            });
            if (response && response.resource && response.resource.list) {
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview`,
                    text: response.resource.list.name,
                });
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview/subscribers`,
                    text: "Subscribers",
                });
                links.push({
                    link: `/email/lists/${response.resource.list.uid}/overview/subscribers/import`,
                    text: "Import",
                });
            }
            breadcrumb.setLinks(links);
        }
    }, [response]);

    useInterval(
        () => {
            loadResource();
        },
        5000,
        true
    );

    const columns = [
        {
            name: "Created at",
            cell: (row: SystemJob) => <FormattedDate date_string={row.created_at}/>,
        },
        {
            name: "Updated at",
            cell: (row: SystemJob) => <div style={{fontSize: "12px"}}><FormattedDate date_string={row.updated_at}/>
            </div>,
        },
        {
            name: "Status",
            cell: (row: SystemJob) => (
                <Badge variant={row.status === "failed" ? "danger" : "info"}>
                    {row.status}
                </Badge>
            ),
        },
    ];
    return (
        <div className="mt-2">
            <div style={{
                marginLeft: "50px"
            }}>
                <Row>
                    <Col xl={6} lg={6} md={6} sm={12}>
                        <h4>+ Import Subscribers</h4>
                    </Col>
                </Row>
                <Alert variant="info">
                    Acceptable file type is CSV, please checkout the{" "}
                    <a
                        href={
                            new BaseAPIs().getApiBaseURL() + "/files/csv_import_example.csv"
                        }
                        download
                    >
                        Sample.csv
                    </a>
                </Alert>
                <UpgradePlanWarning feature_name="list_import" />
            </div>
            <Formik
                initialValues={{
                    file: "",
                }}
                onSubmit={(values, formikHelpers) => {
                    let submit = formikHelpers.setSubmitting(true);
                    new EmailMailingListSubscriberAPIs()
                        .import(params.list_uid, values.file)
                        .then((res) => {
                            if (isMounted.current) {
                                if (
                                    EmailMailingListSubscriberAPIs.hasError(
                                        res,
                                        notificationContext
                                    )
                                ) {
                                    if (!HandleErrors(res, formikHelpers)) {
                                    }
                                } else {
                                }

                                formikHelpers.setSubmitting(false);
                            }
                        });
                }}
                validationSchema={yup.object({
                    file: yup.mixed().required("Please select a file"),
                })}
                validate={(values) => {
                    if (!values.file) {
                        return {file: "Please select a file"};
                    }
                    return {};
                }}
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
                    return (
                        <div style={{marginLeft: "50px"}}>
                            <form onSubmit={handleSubmit}>
                                <p>Server max file upload size: 800M</p>
                                <Form.Group>
                                    <div style={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #ddd",
                                        borderRadius: "5px",
                                        display: "inline-block",
                                        height: "40px",
                                        marginRight: "10px",
                                        padding: "5px 40px 5px 5px",
                                        position: "relative",
                                        width: "auto"
                                    }}>
                                        <Form.File
                                            onChange={(event: any) => {
                                                if (event.target.files) {
                                                    setFieldValue("file", event.target.files[0]);
                                                }
                                            }}
                                            name="file"
                                            accept=".csv"
                                            isInvalid={touched && touched.file && errors && !!errors.file}
                                            feedback={errors && errors.file}
                                        />
                                    </div>
                                    <Button variant="contained" color="primary" type="submit" disabled={isSubmitting || !can_import}>
                                        {isSubmitting && (
                                            <>
                                                <Spinner animation="border" size="sm"/>
                                                &nbsp;
                                            </>
                                        )}
                                        Import
                                    </Button>
                                </Form.Group>
                            </form>
                        </div>
                    );
                }}
            </Formik>
            <Col md={12} className="mt-2">
                <CustomDataTable
                    columns={columns}
                    progressComponent={<AppLoader/>}
                    data={
                        (response &&
                            response.resource &&
                            response.resource.system_jobs &&
                            response.resource.system_jobs.data) ||
                        []
                    }
                    sortServer
                    onSort={(column, sortDirection) => {
                        if (typeof column.selector === "string")
                            dispatchList(onSortAction(column.selector, sortDirection));
                    }}
                    actionButtons={[]}
                    onKeywordChange={(a) => {
                        dispatchList(search_action(a));
                    }}
                    noSearchFilter
                    noDataComponent={
                        response.error ? (
                            <Alert variant="danger" className="w-100 mb-0">
                                {response.error}
                            </Alert>
                        ) : (
                            <Alert variant="dark" className="w-100 mb-0 text-center">
                                There are no imports logs.
                            </Alert>
                        )
                    }
                    pagination
                    paginationPerPage={response.query.per_page}
                    onChangeRowsPerPage={(per_page) => {
                        dispatchList(per_page_row_change_action(per_page));
                    }}
                    paginationServer
                    onChangePage={(page) => {
                        dispatchList(current_page_change_action(page));
                    }}
                    subHeaderComponent={<h5>Recent Imports</h5>}
                    subHeader
                    subHeaderAlign="left"
                    noHeader={true}
                    customStyles={customStyles}
                />
            </Col>
        </div>
    );
}
