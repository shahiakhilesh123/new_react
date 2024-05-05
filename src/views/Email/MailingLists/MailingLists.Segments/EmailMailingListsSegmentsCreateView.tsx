import * as React from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import {Redirect} from "react-router";
import Select, {ValueType} from "react-select";

import {iApiBasicResponse} from "../../../../types/api";
import {iEmailMailingListSegmentCreateParams} from "../../../../apis/Email/email.mailinglists.segments.apis";
import {iBasicErrorParameters, iSelectOption} from "../../../../types/internal";
import FormControlFeedback from "../../../../components/Form/Feedback/FormControlFeedback";
import {
    iEmailMailingList,
    iEmailMailingListField,
    iEmailMailingListSegmentCondition
} from "../../../../types/internal/email/mailinglist";
import {FaTrash} from "react-icons/all";
import {Link} from "react-router-dom";
import uuid from "uuid";
import {Button} from "@material-ui/core";
import AppLoader from "../../../../components/Loader/AppLoader";
import AppCard from "../../../../components/Card/AppCard";
import AppCardBody from "../../../../components/Card/AppCardBody";
import HeadingCol from "../../../../components/heading/HeadingCol";

interface iProps extends iBasicErrorParameters {
    createResource: (creationParams: iEmailMailingListSegmentCreateParams) => void
    response?: iApiBasicResponse
    mailing_list_id: string
    mailing_list?: iEmailMailingList
    fields?: iEmailMailingListField[]
}

interface iState {
    name: string
    matching: string,
    conditions: iEmailMailingListSegmentCondition[]
}

const operator_options: iSelectOption[] = [
    {value: "equal", label: "equal"},
    {value: "not_equal", label: "not equal"},
    {value: "contains", label: "contains"},
    {value: "not_contains", label: "not contains"},
    {value: "starts", label: "starts with"},
    {value: "ends", label: "ends with"},
    {value: "not_starts", label: "not starts with"},
    {value: "not_ends", label: "not ends with"},
    {value: "greater", label: "greater than"},
    {value: "less", label: "less than"},
    {value: "blank", label: "blank"},
    {value: "not_blank", label: "not blank"},
];

const verification_operator_options: iSelectOption[] = [
    {value: "verification_equal", label: "equal"},
    {value: "verification_not_equal", label: "not equal"},
];

const verification_value_options: iSelectOption[] = [
    {value: "deliverable", label: "Deliverable"},
    {value: "undeliverable", label: "Undeliverable"},
    {value: "unknown", label: "Unknown"},
    {value: "risky", label: "Risky"},
];

class EmailMailingListsSegmentsCreateView extends React.Component<iProps, iState> {
    state = {
        name: "",
        matching: "all",
        conditions: []
    };

    onFormSubmit = () => {
        this.props.createResource(this.state);
    };

    getCreatedResourceUid = () => {
        if (!this.props.response) return null;
        if (!this.props.response.uid) return null;
        return this.props.response.uid;
    };

    renderErrorMessage = () => {
        if (!this.props.error_message) return null;
        return <Alert variant="danger">{this.props.error_message}</Alert>
    };

    renderForm = () => {
        const createdResourceUid = this.getCreatedResourceUid();
        if (createdResourceUid)
            return <Redirect to={`/email/lists/${this.props.mailing_list_id}/segments/`}/>;

        const list: iEmailMailingList | undefined = this.props.mailing_list;
        const list_fields: iEmailMailingListField[] | undefined = this.props.fields;
        if (!list || !list_fields) return <AppLoader/>;

        let field_options_temp: Array<iSelectOption> = [];
        if (this.props.fields) {
            field_options_temp = this.props.fields.map(c => ({
                value: c.uid,
                label: c.label
            }));
        }
        let shopify_fields: Array<iSelectOption> = [];
        if (list.shopify_shop_id) {
            shopify_fields = [
                {
                    label: "Shopify",
                    value: "",
                    isDisabled: true
                },
                {
                    label: "Number of orders placed",
                    value: "__shopify_orders_count"
                },
                {
                    label: "Number of abandoned checkouts",
                    value: "__shopify_abandoned_checkouts_count"
                }
            ];
        }
        const field_options: Array<iSelectOption> = [
            ...shopify_fields,
            {
                label: "List Fields",
                value: "",
                isDisabled: true
            },
            ...field_options_temp,
            {
                label: "Email Verification",
                value: "",
                isDisabled: true
            },
            {
                label: "Verification Result",
                value: "verification"
            }
        ];

        const matching_options: iSelectOption[] = [
            {value: "all", label: "All"},
            {value: "any", label: "Any"},
        ];
        const selected_matching = matching_options.find(option => option.value === this.state.matching && !!this.state.matching);
        return <>
            <Row>
                <Col xl={8} lg={8} md={8} sm={12}>
                    <Form.Group>
                        <Form.Label>List name</Form.Label>
                        <Form.Control value={this.state.name}
                                      onChange={(event: any) => this.setState({name: event.target.value})}
                                      placeholder="Segment name"/>
                        <FormControlFeedback feedback={this.props.errors["name"]}/>
                    </Form.Group>
                </Col>
                <Col xl={4} lg={4} md={4} sm={12}>
                    <Form.Group>
                        <Form.Label>How to combine conditions</Form.Label>
                        <Select value={selected_matching}
                                onChange={this.updateMatching}
                                options={matching_options}/>
                        <FormControlFeedback feedback={this.props.errors["matching"]}/>
                    </Form.Group>
                </Col>
            </Row>
            {this.state.conditions.map((condition, index) => this.renderCondition(condition, index, field_options))}
            <Row>
                <Col>
                    <Button variant="contained"
                            color="primary"
                            type="button"
                            className="positive-button"
                            onClick={this.addCondition}>
                        Add condition
                    </Button>
                    <FormControlFeedback feedback={this.props.errors["segment_conditions_empty"]}/>
                </Col>
            </Row>
            <hr/>
            <Button color="primary"
                    variant="contained"
                    type="button"
                    onClick={this.onFormSubmit}>
                Save
            </Button>
            <Link to={`/email/lists/${this.props.mailing_list_id}/segments`} className="ml-1">
                <Button variant="outlined" color="secondary"
                        type="button">
                    Cancel
                </Button>
            </Link>
        </>
    };
    updateMatching = (option: ValueType<iSelectOption, any>) => {
        let selected_value: iSelectOption = {label: "", value: ""};
        if (option instanceof Array) {
            selected_value = option[0];
        } else if (!!option) {
            // @ts-ignore
            selected_value = option;
        }
        this.setState({matching: selected_value.value});
    };

    renderCondition = (condition: iEmailMailingListSegmentCondition, index: number, field_options: Array<iSelectOption>) => {
        // Find the currently selected field.
        let selected_field_option = field_options.find(option => (option.value === condition.field_id && !!condition.field_id) || (option.value === condition.special_condition && !!condition.special_condition));
        const verification_field_is_selected = !!selected_field_option && selected_field_option.value === "verification";

        // Find the currently selected operator
        const field_specific_operator_options = verification_field_is_selected ? verification_operator_options : operator_options;
        let selected_operator_option = field_specific_operator_options.find(option => option.value === condition.operator);

        // Find the currently selected option if applicable:
        let selected_value_option: iSelectOption | undefined = undefined;
        if (verification_field_is_selected) {
            selected_value_option = verification_value_options.find(option => option.value === condition.value)
        }

        const time_period_options: Array<iSelectOption> = [
            {
                value: "all_time",
                label: "All Time"
            },
            {
                value: "in_last",
                label: "In Last"
            },
        ];
        const selected_time_period_option = time_period_options.find(option => option.value === condition.time_period);
        const shopify_field_is_selected = !!selected_field_option && selected_field_option.value.indexOf('__') === 0;
        const show_last_days_box = !!selected_time_period_option && selected_time_period_option.value === 'in_last';
        return <Row key={condition.uid}>
            <Col xl={11} lg={11} md={12} sm={12}>
                <Row>
                    <Col>
                        <Form.Group>
                            <Select value={selected_field_option}
                                    onChange={(v) => this.updateConditionField(v, index)}
                                    options={field_options}/>
                            <FormControlFeedback feedback={this.props.errors[`conditions.${index}.field_id`]}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            <Select value={selected_operator_option}
                                    onChange={(v) => this.updateConditionOperator(v, index)}
                                    options={operator_options}/>
                            <FormControlFeedback feedback={this.props.errors[`conditions.${index}.operator`]}/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group>
                            {verification_field_is_selected
                                ? <Select value={selected_value_option}
                                          onChange={(v) => this.updateConditionValueViaSelect(v, index)}
                                          options={verification_value_options}/>
                                : <Form.Control value={condition.value}
                                                onChange={(event: any) => this.updateConditionValue(event.target.value, index)}/>
                            }
                            <FormControlFeedback feedback={this.props.errors[`conditions.${index}.value`]}/>
                        </Form.Group>
                    </Col>
                    {shopify_field_is_selected && <>
                        <Col>
                            <Form.Group>
                                <Select value={selected_time_period_option}
                                        onChange={(v) => this.updateTimePeriod(v, index)}
                                        options={time_period_options}/>
                                <FormControlFeedback feedback={this.props.errors[`conditions.${index}.time_period`]}/>
                            </Form.Group>
                        </Col>
                        {show_last_days_box && <Col>
                            <Form.Control value={condition.time_period_in_last_days}
                                          onChange={(event: any) => this.updateTimePeriodLastDaysValue(event.target.value, index)}/>
                            <FormControlFeedback
                                feedback={this.props.errors[`conditions.${index}.time_period_in_last_days`]}/>
                        </Col>
                        }
                    </>}
                </Row>
            </Col>
            <Col xl={1} lg={1} md={12} sm={12}>
                <Button color="secondary"
                        variant="contained"
                        onClick={() => this.deleteCondition(index)}
                        type="button">
                    <FaTrash/>
                </Button>
            </Col>
        </Row>
    };

    updateConditionField = (option: ValueType<iSelectOption, any>, index: number) => {
        let selected_value: iSelectOption = {label: "", value: ""};
        if (option instanceof Array) {
            selected_value = option[0];
        } else if (!!option) {
            // @ts-ignore
            selected_value = option;
        }
        const conditions: iEmailMailingListSegmentCondition[] = [...this.state.conditions];
        conditions[index].field_id = selected_value.value;
        this.setState({conditions});
    };

    updateConditionOperator = (option: ValueType<iSelectOption, any>, index: number) => {
        let selected_value: iSelectOption = {label: "", value: ""};
        if (Array.isArray(option)) {
            selected_value = option[0];
        } else if (!!option) {
            // @ts-ignore
            selected_value = option;
        }
        const conditions: iEmailMailingListSegmentCondition[] = [...this.state.conditions];
        conditions[index].operator = selected_value.value;
        this.setState({conditions});
    };

    updateConditionValue = (value: string, index: number) => {
        const conditions: iEmailMailingListSegmentCondition[] = [...this.state.conditions];
        conditions[index].value = value;
        this.setState({conditions});
    };

    updateConditionValueViaSelect = (option: ValueType<iSelectOption, any>, index: number) => {
        let selected_value: iSelectOption = {label: "", value: ""};
        if (Array.isArray(option)) {
            selected_value = option[0];
        } else if (!!option) {
            // @ts-ignore
            selected_value = option;
        }
        const conditions: iEmailMailingListSegmentCondition[] = [...this.state.conditions];
        conditions[index].value = selected_value.value;
        this.setState({conditions});
    };

    updateTimePeriod = (option: ValueType<iSelectOption, any>, index: number) => {
        let selected_value: iSelectOption = {label: "", value: ""};
        if (Array.isArray(option)) {
            selected_value = option[0];
        } else if (!!option) {
            // @ts-ignore
            selected_value = option;
        }
        const conditions: iEmailMailingListSegmentCondition[] = [...this.state.conditions];
        conditions[index].time_period = selected_value.value;
        this.setState({conditions});
    };

    updateTimePeriodLastDaysValue = (value: string, index: number) => {
        const conditions: iEmailMailingListSegmentCondition[] = [...this.state.conditions];
        conditions[index].time_period_in_last_days = value;
        this.setState({conditions});
    };

    deleteCondition = (index: number) => {
        const conditions = [...this.state.conditions];
        conditions.splice(index, 1);
        this.setState({conditions});
    };

    addCondition = () => {
        const conditions: iEmailMailingListSegmentCondition[] = [...this.state.conditions];
        conditions.push({
            special_condition: "",
            field_id: "",
            operator: "",
            value: "",
            time_period: "",
            time_period_in_last_days: "0",

            updated_at: "",
            created_at: "",
            uid: uuid.v4(),
            status: "",
            id: 0
        });
        this.setState({conditions});
    };

    render() {
        return <div className="mt-2">
            <Row>
                <HeadingCol
                    title={"Create Mailing List Segment"}
                    description={""}
                />

            </Row>
            <AppCard>
                <AppCardBody>
                    <div className="mt-2">
                        {this.renderErrorMessage()}
                    </div>
                    {this.renderForm()}
                </AppCardBody>
            </AppCard>
        </div>;
    }
}

export default EmailMailingListsSegmentsCreateView;
