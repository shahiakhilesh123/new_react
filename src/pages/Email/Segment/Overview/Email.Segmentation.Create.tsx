import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Alert, Col, Form, Row, Spinner} from "react-bootstrap";
import Select from "react-select";
import DeleteIcon from "@material-ui/icons/Delete";

import "react-datepicker/dist/react-datepicker.css";
import {Button} from "@material-ui/core";
import {useHistory, useParams} from 'react-router-dom';
import useIsMounted from "ismounted";
import {FieldArray, Formik} from "formik";
import * as yup from "yup";
import uuid from "uuid";
import {iSelectOption} from "../../../../types/internal";
import EmailSegmentationAPIs, {
    iEmailSegment,
    iEmailSegmentGroup,
    iEmailSegmentGroupCondition
} from "../../../../apis/Email/email.segmentation";
import {HandleErrors} from "../../../../components/helper/form.helper";
import AppCard from "../../../../components/Card/AppCard";
import DatePickerField from "../../../../components/DatePicker";
import {NotificationContext} from "../../../../App";
import AppLoader from "../../../../components/Loader/AppLoader";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";

const toCamel = (s: string) => {
    let a = s.split("__");
    if (a.length > 1) {
        return a[1].replace(/([-_][a-z])/ig, ($1) => {
            return $1
                .replace('-', '')
                .replace('_', ' ');
        });
    }
    return s.replace(/([-_][a-z])/ig, ($1) => {
        return $1
            .replace('-', '')
            .replace('_', ' ');
    });
};
const dropDownList: Array<iSelectOption> = [
    {"label": "What someone has done or not done", "value": "action"},
    {"label": "Properties about someone", "value": "property"},
    {"label": "Someone's proximity to a location", "value": "location"}
]

function EmailSegmentationCreate() {
    useEffect(() => {
        document.title = "Segmentation Edit | Create | Emailwish";
    }, []);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingConditionTypes, setLoadingConditionTypes] = useState<boolean>(true);
    const [segment2, setSegment2] = useState<iEmailSegment | undefined>();
    const [error, setError] = useState<string | undefined>();
    const history = useHistory();
    const [locationList, setLocationList] = useState<Array<iSelectOption>>();

    const [actionTypeList, setActionTypeList] = useState<Array<iSelectOption>>();

    const [actionCountTypeList, setActionCountTypeList] = useState<Array<iSelectOption>>();
    const [actionDateTypePeriodRequiredFieldList, setActionDateTypePeriodRequiredFieldList] = useState<Array<iSelectOption>>();

    const [actionCountTypeValueRequiredFieldList, setActionCountTypeValueRequiredFieldList] = useState<Array<iSelectOption>>();

    const [actionDatePeriodsList, setActionDatePeriodsList] = useState<Array<iSelectOption>>();

    const [actionDateTypeFieldList, setActionDateTypeFieldList] = useState<Array<iSelectOption>>();
    const [actionDateTypeValueOneDateRequiredFieldList, setActionDateTypeValueOneDataRequiredFieldList] = useState<Array<iSelectOption>>();
    const [actionDateTypeValueOneIntRequiredFieldList, setActionDateTypeValueOneIntRequiredFieldList] = useState<Array<iSelectOption>>();
    const [actionDateTypeValueTwoDateRequiredFieldList, setActionDateTypeValueTwoDataRequiredFieldList] = useState<Array<iSelectOption>>();
    const [actionDateTypeValueTwoIntRequiredFieldList, setActionDateTypeValueTwoIntRequiredFieldList] = useState<Array<iSelectOption>>();

    const [propertyList, setPropertyList] = useState<Array<iSelectOption>>();
    const [propertyTextComparisonTypesList, setPropertyTextComparisonTypesList] = useState<Array<iSelectOption>>();
    const [propertyNumberComparisonTypesList, setPropertyNumberComparisonTypesList] = useState<Array<iSelectOption>>();
    const [propertyBooleanComparisonTypesList, setPropertyBooleanComparisonTypesList] = useState<Array<iSelectOption>>();
    const [propertyDateComparisonTypesList, setPropertyDateComparisonTypesList] = useState<Array<iSelectOption>>();
    const [propertyTypeList, setPropertyTypeList] = useState<any>();
    const isMounted = useIsMounted();
    const breadcrumb = useContext(BreadCrumbContext);

    const notificationContext = useContext(NotificationContext);
    const params = useParams<any>();
    const {
        segment_uid
    }: any = params;
    const loadSegmentation = useCallback(() => {
        setLoading(true)
        new EmailSegmentationAPIs().view(segment_uid).then((res) => {
            if (isMounted.current) {
                if (EmailSegmentationAPIs.hasError(res, notificationContext)) {
                    setError(res.message)
                } else {
                    setSegment2(res.segment2)
                }
                setLoading(false);
            }
        })
    }, []);
    const loadConditionTypes = useCallback(() => {
        setLoadingConditionTypes(true)
        new EmailSegmentationAPIs().loadConditionTypeOptions().then((res) => {
            if (isMounted.current) {
                if (EmailSegmentationAPIs.hasError(res, notificationContext)) {
                    setError(res.message)
                } else {
                    setLocationList(res.location_types && res.location_types.map((location) => {
                        return {value: location.id.toString(), label: location.name}
                    }))
                    setActionTypeList(res.action_types && res.action_types.map((action_type) => {
                        return {value: action_type.id.toString(), label: action_type.name}
                    }))
                    setActionCountTypeList(res.action_count_types && res.action_count_types.map((val) => {
                        return {value: val, label: toCamel(val)}
                    }))
                    setActionDateTypePeriodRequiredFieldList(res.action_date_types__period_required_fields &&
                        res.action_date_types__period_required_fields.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setActionCountTypeValueRequiredFieldList(res.action_count_types__value_required_fields &&
                        res.action_count_types__value_required_fields.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setActionDatePeriodsList(res.action_date_periods &&
                        res.action_date_periods.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setActionDateTypeValueOneDataRequiredFieldList(res.action_date_types__value_one_date_required_fields &&
                        res.action_date_types__value_one_date_required_fields.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setActionDateTypeValueOneIntRequiredFieldList(res.action_date_types__value_one_int_required_fields &&
                        res.action_date_types__value_one_int_required_fields.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setActionDateTypeValueTwoDataRequiredFieldList(res.action_date_types__value_two_date_required_fields &&
                        res.action_date_types__value_two_date_required_fields.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setActionDateTypeValueTwoIntRequiredFieldList(res.action_date_types__value_two_int_required_fields &&
                        res.action_date_types__value_two_int_required_fields.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setActionDateTypeFieldList(res.action_date_types &&
                        res.action_date_types.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setPropertyList(res.property_types &&
                        res.property_types.map((val) => {
                            return {value: val.id.toString(), label: val.name}
                        }))
                    setPropertyTextComparisonTypesList(res.property_text_comparison_types &&
                        res.property_text_comparison_types.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setPropertyBooleanComparisonTypesList(res.property_boolean_comparison_types &&
                        res.property_boolean_comparison_types.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setPropertyNumberComparisonTypesList(res.property_number_comparison_types &&
                        res.property_number_comparison_types.map((val) => {
                            return {value: val, label: toCamel(val)}
                        }))
                    setPropertyDateComparisonTypesList([
                        "date__equal",
                        "date__not_equal",
                        "date__before",
                        "date__after"
                    ].map((val) => {
                        return {value: val, label: toCamel(val)}
                    }))
                    setPropertyTypeList(res.property_types)

                }
                setLoadingConditionTypes(false);
            }
        })
    }, []);


    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/segments",
                text: "Segments"
            })
            if (segment2) {
                links.push({
                    link: `/email/segments/${segment2.id}/overview`,
                    text: segment2.name
                })
                links.push({
                    link: `/email/segments/${segment2.id}/overview/edit`,
                    text: "Edit"
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [segment2])
    useEffect(() => {

        loadSegmentation();
        loadConditionTypes();
    }, [])

    const segmentSchema = yup.object({
        name: yup.string().required("Please enter segment name"),
        groups: yup.array(yup.object({
            conditions: yup.array(yup.object({
                condition_type: yup.string().required("Please select condition type")
            }))
        }))
    });

    if (loading || loadingConditionTypes) {
        return <AppLoader/>
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>
    }
    if (!segment2 || !locationList) {
        return <Alert variant="danger">No Segmentation found!</Alert>

    }
    return <Formik
        initialValues={segment2}
        onSubmit={(_values: any, helpers) => {
            new EmailSegmentationAPIs().updateSegmentation(segment_uid, {..._values}).then((res) => {
                if (EmailSegmentationAPIs.hasError(res, notificationContext)) {
                    if (!HandleErrors(res, helpers)) {
                        setError(res.message)
                    }
                    helpers.setSubmitting(false)
                } else {
                    history.replace("/email/segments")
                }
            });
        }}
        validateOnChange={false}
        validationSchema={segmentSchema}
    >
        {(
            {
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isSubmitting,
                errors,
                setFieldValue,
            }: any) => {
            return <form onSubmit={handleSubmit} className="email-segmentation">
                <div>
                    <AppCard className="p-3 email-segmentation--card">
                        <Form.Group>
                            <Form.Label className="text-box-label">Name</Form.Label>
                            <Form.Control required={true}
                                          className="text-field"
                                          name="name"
                                          type="text"
                                          placeholder="Name"
                                          value={values.name}
                                          onBlur={handleBlur}
                                          onChange={handleChange}
                                          isInvalid={((touched && touched.name)
                                              &&
                                              (errors && !!errors.name))
                                          }
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors && errors.name}
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="text-box-label">Definitions</Form.Label>

                            <FieldArray name="groups"
                                        render={(groupHelper => {
                                            return <Form.Row>
                                                <Col md={12}>
                                                    {values.groups.map((group: iEmailSegmentGroup, group_index: number) => {
                                                        return <div key={group.id ? group.id : group.lid}>
                                                            {group_index > 0 &&
                                                            <Button disabled variant="outlined" className="mt-3">
                                                                ADD
                                                            </Button>}
                                                            <FieldArray name={`groups[${group_index}].conditions`}
                                                                        render={(groupConditionHelper => {
                                                                            return values.groups[group_index].conditions &&
                                                                                values.groups[group_index].conditions
                                                                                    .map((condition: iEmailSegmentGroupCondition, condition_index: number) => {
                                                                                        return <Row className="mt-3"
                                                                                                    key={condition.id ? condition.id : condition.lid}>
                                                                                            <Col md={12}>
                                                                                                <Row
                                                                                                    className="email-segmentation__heading">
                                                                                                    <Col
                                                                                                        className="email-segmentation__heading_condition_type">
                                                                                                        <Form.Group>
                                                                                                            <Select
                                                                                                                required={true}
                                                                                                                options={dropDownList}
                                                                                                                // @ts-ignore
                                                                                                                value={dropDownList.filter(option => option.value === condition.condition_type)}
                                                                                                                placeholder={"Select a Condition"}
                                                                                                                onChange={(e: any) => {
                                                                                                                    setFieldValue(`groups[${group_index}].conditions[${condition_index}].condition_type`, e.value)
                                                                                                                    if (e.value === "location") {
                                                                                                                        setFieldValue(`groups[${group_index}].conditions[${condition_index}].location`, {})
                                                                                                                    } else if (e.value === "property") {
                                                                                                                        setFieldValue(`groups[${group_index}].conditions[${condition_index}].property`, {})
                                                                                                                    } else if (e.value === "action") {
                                                                                                                        setFieldValue(`groups[${group_index}].conditions[${condition_index}].action.action_type_id`,
                                                                                                                            actionTypeList && actionTypeList[0].value)
                                                                                                                        setFieldValue(`groups[${group_index}].conditions[${condition_index}].action.count_type`,
                                                                                                                            actionCountTypeList && actionCountTypeList[0].value)
                                                                                                                        setFieldValue(`groups[${group_index}].conditions[${condition_index}].action.date_type`,
                                                                                                                            actionDateTypeFieldList && actionDateTypeFieldList[0].value)

                                                                                                                    }
                                                                                                                }}
                                                                                                                menuPortalTarget={document.querySelector('body')}
                                                                                                            />
                                                                                                        </Form.Group>
                                                                                                    </Col>
                                                                                                    <Col
                                                                                                        className="d-flex justify-content-end align-items-center"
                                                                                                        md={6}>
                                                                                                        <DeleteIcon
                                                                                                            color="secondary"
                                                                                                            onClick={() => {
                                                                                                                if (values.groups[group_index].conditions.length === 1) {
                                                                                                                    if (values.groups.length > 1) {
                                                                                                                        groupHelper.remove(group_index);
                                                                                                                    } else {
                                                                                                                        window.alert("At-least one condition is required")
                                                                                                                    }
                                                                                                                } else {
                                                                                                                    groupConditionHelper.remove(condition_index);
                                                                                                                }

                                                                                                            }}
                                                                                                            name="Delete "
                                                                                                            cursor={"pointer"}/>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                                {condition.condition_type === "location" && locationList && condition.location &&
                                                                                                <div
                                                                                                    className="email-segmentation__component">
                                                                                                    <div
                                                                                                        className="email-segmentation__select_input">
                                                                                                        <Select
                                                                                                            required={true}
                                                                                                            options={locationList}
                                                                                                            // @ts-ignore
                                                                                                            value={
                                                                                                                locationList.filter((option: any) => option.value === condition.location.location_type_id)
                                                                                                            }
                                                                                                            placeholder={"Select a location"}
                                                                                                            onChange={(e: any) => {
                                                                                                                setFieldValue(`groups[${group_index}].conditions[${condition_index}].location.location_type_id`, e.value)

                                                                                                            }}
                                                                                                            menuPortalTarget={document.querySelector('body')}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>
                                                                                                }
                                                                                                {condition.condition_type === "property" && propertyList && condition.property &&
                                                                                                <div
                                                                                                    className="email-segmentation__component">

                                                                                                    <div
                                                                                                        className="email-segmentation__select_input"
                                                                                                    >
                                                                                                        <Select
                                                                                                            required={true}
                                                                                                            options={propertyList}
                                                                                                            // @ts-ignore
                                                                                                            value={
                                                                                                                propertyList.filter((option: any) => option.value === condition.property.property_type_id)
                                                                                                            }
                                                                                                            placeholder={"Select a property"}
                                                                                                            onChange={(e: any) => {
                                                                                                                setFieldValue(`groups[${group_index}].conditions[${condition_index}].property.property_type_id`, e.value)
                                                                                                                setFieldValue(`groups[${group_index}].conditions[${condition_index}].property.property_data_type`,
                                                                                                                    propertyTypeList.filter((_v: any) => {
                                                                                                                        return _v.id.toString() === e.value;
                                                                                                                    })[0].data_type)
                                                                                                            }}
                                                                                                            menuPortalTarget={document.querySelector('body')}
                                                                                                        />

                                                                                                    </div>

                                                                                                    {
                                                                                                        condition.property.property_type_id &&
                                                                                                        condition.property.property_data_type === "text" &&
                                                                                                        propertyTextComparisonTypesList &&

                                                                                                        <div
                                                                                                            className="email-segmentation__select_input">
                                                                                                            <Select
                                                                                                                required={true}
                                                                                                                options={propertyTextComparisonTypesList}
                                                                                                                // @ts-ignore
                                                                                                                value={propertyTextComparisonTypesList.filter((option: any) => option.value === condition.property.comparison_type)}
                                                                                                                placeholder={"Select a text property"}
                                                                                                                onChange={(e: any) => {
                                                                                                                    setFieldValue(`groups[${group_index}].conditions[${condition_index}].property.comparison_type`, e.value)
                                                                                                                }}
                                                                                                                menuPortalTarget={document.querySelector('body')}
                                                                                                            />

                                                                                                        </div>
                                                                                                    }
                                                                                                    {
                                                                                                        condition.property.property_type_id &&
                                                                                                        condition.property.property_data_type === "date" &&
                                                                                                        propertyDateComparisonTypesList &&

                                                                                                        <div
                                                                                                            className="email-segmentation__select_input">
                                                                                                            <Select
                                                                                                                required={true}
                                                                                                                options={propertyDateComparisonTypesList}
                                                                                                                // @ts-ignore
                                                                                                                value={propertyDateComparisonTypesList.filter((option: any) => option.value === condition.property.comparison_type)}
                                                                                                                placeholder={"Select a date property"}
                                                                                                                onChange={(e: any) => {
                                                                                                                    setFieldValue(`groups[${group_index}].conditions[${condition_index}].property.comparison_type`, e.value)
                                                                                                                }}
                                                                                                                menuPortalTarget={document.querySelector('body')}
                                                                                                            />

                                                                                                        </div>
                                                                                                    }
                                                                                                    {
                                                                                                        condition.property.property_type_id &&
                                                                                                        condition.property.property_data_type === "boolean" &&
                                                                                                        propertyBooleanComparisonTypesList &&

                                                                                                        <div
                                                                                                            className="email-segmentation__select_input">
                                                                                                            <Select
                                                                                                                required={true}
                                                                                                                options={propertyBooleanComparisonTypesList}
                                                                                                                // @ts-ignore
                                                                                                                value={propertyBooleanComparisonTypesList.filter((option: any) => option.value === condition.property.comparison_type)}
                                                                                                                placeholder={"Select a boolean property"}
                                                                                                                onChange={(e: any) => {
                                                                                                                    setFieldValue(`groups[${group_index}].conditions[${condition_index}].property.comparison_type`, e.value)
                                                                                                                }}
                                                                                                                menuPortalTarget={document.querySelector('body')}
                                                                                                            />

                                                                                                        </div>
                                                                                                    }
                                                                                                    {
                                                                                                        condition.property.property_type_id &&
                                                                                                        condition.property.property_data_type === "number" &&
                                                                                                        propertyNumberComparisonTypesList &&
                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__select_input">
                                                                                                            <Select
                                                                                                                required={true}
                                                                                                                options={propertyNumberComparisonTypesList}
                                                                                                                // @ts-ignore
                                                                                                                value={propertyNumberComparisonTypesList.filter((option: any) => option.value === condition.property.comparison_type)}
                                                                                                                placeholder={"Select a number property"}
                                                                                                                onChange={(e: any) => {
                                                                                                                    setFieldValue(`groups[${group_index}].conditions[${condition_index}].property.comparison_type`, e.value)
                                                                                                                }}
                                                                                                                menuPortalTarget={document.querySelector('body')}
                                                                                                            />

                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                    {
                                                                                                        condition.property.property_type_id &&
                                                                                                        condition.property.property_data_type === "text" &&
                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__number_input">
                                                                                                            <Form.Control
                                                                                                                required={true}
                                                                                                                className="text-field"
                                                                                                                name={`groups[${group_index}].conditions[${condition_index}].property.comparison_value_text`}
                                                                                                                type="text"
                                                                                                                value={values.groups[group_index].conditions[condition_index].property.comparison_value_text}
                                                                                                                onBlur={handleBlur}
                                                                                                                onChange={handleChange}
                                                                                                            />

                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                    {
                                                                                                        condition.property.property_type_id &&
                                                                                                        condition.property.property_data_type === "number" &&
                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__number_input">
                                                                                                            <Form.Control
                                                                                                                required={true}
                                                                                                                className="text-field"
                                                                                                                name={`groups[${group_index}].conditions[${condition_index}].property.comparison_value_number`}
                                                                                                                type="number"
                                                                                                                value={values.groups[group_index].conditions[condition_index].property.comparison_value_number}
                                                                                                                onBlur={handleBlur}
                                                                                                                onChange={handleChange}
                                                                                                            />

                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                    {
                                                                                                        condition.property.property_type_id &&
                                                                                                        condition.property.property_data_type === "date" &&

                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__date_input">
                                                                                                            <DatePickerField
                                                                                                                className={"text-field form-control"}
                                                                                                                name={`groups[${group_index}].conditions[${condition_index}].property.comparison_value_date`}/>

                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                </div>
                                                                                                }
                                                                                                {condition.condition_type === "action"
                                                                                                && actionTypeList &&
                                                                                                actionCountTypeList &&
                                                                                                actionDateTypeFieldList &&
                                                                                                condition.action &&
                                                                                                <div
                                                                                                    className="email-segmentation__component">
                                                                                                    <div
                                                                                                        className="email-segmentation__component__has">
                                                                                                        <div
                                                                                                            className="email-segmentation__component__has_text">
                                                                                                            <span>Has</span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div
                                                                                                        className="email-segmentation__select_input">
                                                                                                        <Select
                                                                                                            required={true}
                                                                                                            options={actionTypeList}
                                                                                                            // @ts-ignore
                                                                                                            value={actionTypeList.filter((option: any) => option.value === condition.action.action_type_id)}
                                                                                                            placeholder={"Select a action"}
                                                                                                            onChange={(e: any) => {
                                                                                                                setFieldValue(`groups[${group_index}].conditions[${condition_index}].action.action_type_id`, e.value)
                                                                                                            }}
                                                                                                            menuPortalTarget={document.querySelector('body')}
                                                                                                        />
                                                                                                    </div>

                                                                                                    <div
                                                                                                        className="email-segmentation__select_input">

                                                                                                        <Select
                                                                                                            required={true}
                                                                                                            options={actionCountTypeList}
                                                                                                            // @ts-ignore
                                                                                                            value={actionCountTypeList.filter((option: any) => option.value === condition.action.count_type)}
                                                                                                            placeholder={"Select a condition"}
                                                                                                            onChange={(e: any) => {
                                                                                                                setFieldValue(`groups[${group_index}].conditions[${condition_index}].action.count_type`, e.value)
                                                                                                            }}
                                                                                                            menuPortalTarget={document.querySelector('body')}
                                                                                                        />
                                                                                                    </div>
                                                                                                    {actionCountTypeValueRequiredFieldList &&
                                                                                                    actionCountTypeValueRequiredFieldList.filter((option: any) => option.value === condition.action.count_type).length > 0 &&
                                                                                                    <Form.Group
                                                                                                        className="email-segmentation__number_input">
                                                                                                        <Form.Control
                                                                                                            required={true}
                                                                                                            className="text-field"
                                                                                                            name={`groups[${group_index}].conditions[${condition_index}].action.count_value`}
                                                                                                            type="number"
                                                                                                            value={values.groups[group_index].conditions[condition_index].action.count_value}
                                                                                                            onBlur={handleBlur}
                                                                                                            onChange={handleChange}
                                                                                                        />
                                                                                                    </Form.Group>}

                                                                                                    <div
                                                                                                        className="email-segmentation__select_input">

                                                                                                        <Select
                                                                                                            required={true}
                                                                                                            options={actionDateTypeFieldList}
                                                                                                            // @ts-ignore
                                                                                                            value={actionDateTypeFieldList.filter((option: any) => option.value === condition.action.date_type)}
                                                                                                            placeholder={"Select a date type"}
                                                                                                            onChange={(e: any) => {
                                                                                                                setFieldValue(`groups[${group_index}].conditions[${condition_index}].action.date_type`, e.value)
                                                                                                            }}
                                                                                                            menuPortalTarget={document.querySelector('body')}
                                                                                                        />
                                                                                                    </div>
                                                                                                    {
                                                                                                        actionDateTypeValueOneIntRequiredFieldList &&
                                                                                                        actionDateTypeValueOneIntRequiredFieldList.filter((option: any) => option.value === condition.action.date_type).length > 0 &&
                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__number_input">
                                                                                                            <Form.Control
                                                                                                                required={true}
                                                                                                                className={"text-field email-segmentation__number_input"}
                                                                                                                name={`groups[${group_index}].conditions[${condition_index}].action.date_value_int_one`}
                                                                                                                type="number"
                                                                                                                value={values.groups[group_index].conditions[condition_index].action.date_value_int_one}
                                                                                                                onBlur={handleBlur}
                                                                                                                onChange={handleChange}
                                                                                                            />
                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                    {
                                                                                                        actionDateTypeValueTwoIntRequiredFieldList &&
                                                                                                        actionDateTypeValueTwoIntRequiredFieldList.filter((option: any) => option.value === condition.action.date_type).length > 0 &&
                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__number_input">
                                                                                                            <Form.Control
                                                                                                                required={true}
                                                                                                                className={"text-field email-segmentation__number_input"}
                                                                                                                name={`groups[${group_index}].conditions[${condition_index}].action.date_value_int_two`}
                                                                                                                type="number"
                                                                                                                value={values.groups[group_index].conditions[condition_index].action.date_value_int_two}
                                                                                                                onBlur={handleBlur}
                                                                                                                onChange={handleChange}
                                                                                                            />
                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                    {
                                                                                                        actionDateTypeValueOneDateRequiredFieldList &&
                                                                                                        actionDateTypeValueOneDateRequiredFieldList.filter((option: any) => option.value === condition.action.date_type).length > 0 &&
                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__date_input ">
                                                                                                            <DatePickerField

                                                                                                                className={"text-field  form-control"}
                                                                                                                name={`groups[${group_index}].conditions[${condition_index}].action.date_value_date_one`}/>
                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                    {
                                                                                                        actionDateTypeValueTwoDateRequiredFieldList &&
                                                                                                        actionDateTypeValueTwoDateRequiredFieldList.filter((option: any) => option.value === condition.action.date_type).length > 0 &&
                                                                                                        <Form.Group
                                                                                                            className="email-segmentation__date_input">
                                                                                                            <DatePickerField
                                                                                                                className={"text-field  form-control"}
                                                                                                                name={`groups[${group_index}].conditions[${condition_index}].action.date_value_date_two`}
                                                                                                            />
                                                                                                        </Form.Group>
                                                                                                    }
                                                                                                    {
                                                                                                        actionDateTypePeriodRequiredFieldList && actionDatePeriodsList && condition.action &&
                                                                                                        actionDateTypePeriodRequiredFieldList.filter((option: any) => option.value === condition.action.date_type).length > 0 &&
                                                                                                        <div
                                                                                                            className="email-segmentation__select_input">
                                                                                                            <Select
                                                                                                                required={true}
                                                                                                                options={actionDatePeriodsList}
                                                                                                                // @ts-ignore
                                                                                                                value={actionDatePeriodsList.filter((option: any) => option.value === condition.action.date_period)}
                                                                                                                placeholder={"Select a date type"}
                                                                                                                onChange={(e: any) => {
                                                                                                                    setFieldValue(`groups[${group_index}].conditions[${condition_index}].action.date_period`, e.value)
                                                                                                                }}
                                                                                                                menuPortalTarget={document.querySelector('body')}
                                                                                                            />
                                                                                                        </div>
                                                                                                    }
                                                                                                </div>
                                                                                                }
                                                                                            </Col>

                                                                                            {values.groups[group_index].conditions.length > 1 &&
                                                                                            <Col md={12}>
                                                                                                <Row>
                                                                                                    <Col xs={2} md={1}
                                                                                                         lg={1}>
                                                                                                        <Button disabled
                                                                                                                variant="outlined">
                                                                                                            OR
                                                                                                        </Button>
                                                                                                    </Col>
                                                                                                    <Col>
                                                                                                        <hr/>
                                                                                                    </Col>
                                                                                                </Row></Col>}
                                                                                            {values.groups[group_index].conditions.length - 1 === condition_index &&
                                                                                            <Col md={12}
                                                                                                 className="d-flex justify-content-end mt-1">
                                                                                                <Button
                                                                                                    onClick={() => {
                                                                                                        groupConditionHelper.push({
                                                                                                            condition_type: null,
                                                                                                            lid: uuid.v4()
                                                                                                        })
                                                                                                    }}
                                                                                                    variant="outlined">
                                                                                                    OR
                                                                                                </Button>
                                                                                            </Col>}
                                                                                        </Row>
                                                                                    })

                                                                        })}/>


                                                        </div>
                                                    })}</Col>
                                                <Col md={12}>
                                                    <Button
                                                        variant="outlined"
                                                        className="mt-3"
                                                        onClick={() => {
                                                            let conditions = [{condition_type: null, lid: uuid.v4()}];
                                                            groupHelper.push({conditions: conditions, lid: uuid.v4()})
                                                        }}
                                                    >
                                                        &nbsp; AND
                                                    </Button>
                                                </Col>
                                            </Form.Row>
                                        })}
                            />
                        </Form.Group>
                    </AppCard>
                </div>
                <Row>
                    <Col>
                        <Button color="primary"
                                variant="contained"
                                className={"mt-3 mr-1"}
                                type="submit"
                        >
                            {isSubmitting && <Spinner animation="border" size="sm"/>} &nbsp;Save
                        </Button>
                        <Button onClick={() => {
                            history.replace("/email/segments")
                        }}
                                type="button"
                                color="secondary"
                                variant="outlined"
                                className="mt-3">

                            Cancel

                        </Button>
                    </Col>
                </Row>
            </form>
        }}</Formik>;
}

export default EmailSegmentationCreate;
