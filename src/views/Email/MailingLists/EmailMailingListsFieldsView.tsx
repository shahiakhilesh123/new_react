import * as React from "react";
import {Alert, Col, Form, Row} from "react-bootstrap";
import {FaTrash} from "react-icons/all";
import {capitalCase} from "change-case";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

import {
    iEmailMailingList,
    iEmailMailingListField,
    iEmailMailingListFieldOption,
    iEmailMailingListFieldType
} from "../../../types/internal/email/mailinglist";
import Table from "../../../components/Table/Table";
import moment from "moment";
import HeadingCol from "../../../components/heading/HeadingCol";
import {Button} from "@material-ui/core";


interface iProps {
    mailing_list: iEmailMailingList
    fields: iEmailMailingListField[]
    updateFields: (fields: iEmailMailingListField[]) => void
    error: string
    loading: boolean
}

interface iState {
    fields: iEmailMailingListField[]
}

class EmailMailingListsFieldsView extends React.Component<iProps, iState> {

    constructor(props: iProps) {
        super(props);
        this.state = {
            fields: props.fields
        };
    }

    componentDidUpdate(prevProps: Readonly<iProps>, prevState: Readonly<{}>, snapshot?: any): void {
        const prevFields = JSON.stringify(prevProps.fields);
        const currFields = JSON.stringify(this.props.fields);
        if (prevFields !== currFields) this.setState({fields: this.props.fields});
    }

    renderErrorMessage = () => {
        if (!this.props.error) return null;
        return <Alert variant="danger">{this.props.error}</Alert>
    };

    onFormSubmit = () => {
        this.props.updateFields(this.state.fields);
    };

    render() {
        const list = this.props.mailing_list;
        const cache = this.props.mailing_list.cache_object;
        const fields = this.state.fields;

        return <div>
            <Row>

                <HeadingCol title="Manage list fields"
                            description={"These fields are tied to specific lists and available thru the builder only when working on that list."}/>


                <Col xl={6} lg={6} md={8} sm={12}>
                    <div className="mt-2">
                        {this.renderErrorMessage()}
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Table className="mt-2 mb-2">
                        <thead>
                        <tr>
                            <th>&nbsp;</th>
                            <th>Label & Type</th>
                            <th>Required</th>
                            <th>Visible</th>
                            <th>Tag</th>
                            <th>Default Value</th>
                            <th>&nbsp;</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fields.map(this.renderFields)}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <h5><p>Add a new field</p></h5>
            <Row>
                <Col>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("text")}>
                        Text
                    </Button>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("number")}>
                        Number
                    </Button>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("dropdown")}>
                        Dropdown
                    </Button>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("multiselect")}>
                        Multi-Select
                    </Button>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("checkbox")}>
                        Checkbox
                    </Button>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("radio")}>
                        Radio
                    </Button>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("date")}>
                        Date
                    </Button>
                    <Button color="secondary"
                            className="mr-1"
                            variant={"outlined"}
                            onClick={() => this.addField("datetime")}>
                        Datetime
                    </Button>
                    <Button color="secondary"
                            variant={"outlined"}
                            className="mr-1"
                            onClick={() => this.addField("textarea")}>
                        Textarea
                    </Button>
                </Col>
            </Row>

            <Button color="primary" variant="contained"
                    className="positive-button mt-3"
                    onClick={this.onFormSubmit}>
                Save Changes
            </Button>
        </div>;
    }

    addField = (type: iEmailMailingListFieldType) => {
        let fields = [...this.state.fields];
        const field: iEmailMailingListField = {
            type: type,
            id: 0,
            uid: "",
            required: "0",
            custom_order: "0",
            default_value: "",
            visible: "1",
            label: type,
            mail_list_id: this.props.mailing_list.id,
            tag: "",
            status: "",
            created_at: "",
            updated_at: "",
        };
        if (type === "dropdown" || type === "multiselect" || type === "checkbox" || type === "radio") {
            field.options = [{
                id: 0,
                uid: "",
                label: "",
                value: "",
                status: "",
                created_at: "",
                updated_at: "",
            }];
        }
        fields.push(field);
        fields = this.setCustomOrder(fields);

        this.setState({fields});
    };

    renderFields = (field: iEmailMailingListField, field_index: number) => {
        return <React.Fragment key={field_index}>
            <tr>
                <td>&nbsp;</td>
                <td>
                    <Form.Control className="w-auto d-inline"
                                  placeholder="Label"
                                  onChange={(event: any) => this.changeLabel(event.target.value, field_index)}
                                  value={field.label}
                    />&nbsp;{capitalCase(field.type)}
                </td>
                <td>
                    <Form.Check type="checkbox"
                                onChange={(event: any) => this.changeRequired(event.target.checked, field_index)}
                                checked={field.required === "1"}
                                disabled={field.tag === "EMAIL"}
                    />
                </td>
                <td>
                    <Form.Check type="checkbox"
                                onChange={(event: any) => this.changeVisible(event.target.checked, field_index)}
                                checked={field.visible === "1"}
                                disabled={field.tag === "EMAIL"}
                    />
                </td>
                <td>
                    {"["}
                    <Form.Control className="w-auto d-inline"
                                  placeholder="Tag"
                                  onChange={(event: any) => this.changeTag(event.target.value, field_index)}
                                  value={field.tag}
                                  disabled={field.tag === "EMAIL"}
                    />
                    {"]"}
                </td>
                <td>
                    {this.renderDefaultInput(field, field_index)}
                </td>
                <td>{this.renderFieldDelete(field, field_index)}</td>
            </tr>
            {
                field.options && !!field.options.length && <tr>
                    <td colSpan={7} style={{padding: 0}}>
                        <table style={{width: "100%"}}>
                            <thead>
                            <tr>
                                <td>Label</td>
                                <td>Value</td>
                                <td>&nbsp;</td>
                            </tr>
                            </thead>
                            <tbody>
                            {field.options.map((option, option_index, options) => this.renderFieldOptions(option, option_index, options, field_index))}
                            <tr>
                                <td colSpan={3}>
                                    <Button color="secondary"
                                            className="mr-1"
                                            onClick={() => this.addFieldOption(field_index)}>
                                        + Add Option
                                    </Button>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            }
        </React.Fragment>
    };

    changeLabel = (label: string, field_index: number) => {
        const fields = [...this.state.fields];
        fields[field_index].label = label;
        this.setState({fields});
    };

    changeRequired = (checked: boolean, field_index: number) => {
        const fields = [...this.state.fields];
        fields[field_index].required = checked ? "1" : "0";
        this.setState({fields});
    };

    changeVisible = (checked: boolean, field_index: number) => {
        const fields = [...this.state.fields];
        fields[field_index].visible = checked ? "1" : "0";
        this.setState({fields});
    };

    changeTag = (tag: string, field_index: number) => {
        const fields = [...this.state.fields];
        fields[field_index].tag = tag;
        this.setState({fields});
    };

    changeDefault = (value: string, field_index: number) => {
        const fields = [...this.state.fields];
        fields[field_index].default_value = value;
        this.setState({fields});
    };

    renderDefaultInput = (field: iEmailMailingListField, field_index: number) => {
        let datetime = undefined;
        if (field.default_value !== undefined && field.default_value !== "") {
            datetime = new Date(field.default_value);
            if (isNaN(datetime.getTime()))
                datetime = undefined;
        }
        switch (field.type) {
            case "date":
                return <DatePicker
                    selected={datetime}
                    onChange={date => {
                        if (date) {
                            this.changeDefault(moment(date).format("YYYY-MM-DD"), field_index)
                        }
                    }}
                    className="form-control"
                    dateFormat="yyyy-MM-dd"
                />;
            case "datetime":
                return <DatePicker
                    selected={datetime}
                    onChange={date => {
                        if (date) {
                            this.changeDefault(moment(date).format("YYYY-MM-DD, HH:mm"), field_index)
                        }
                    }}
                    className="form-control"
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={1}
                    dateFormat="yyyy-MM-dd, HH:mm"
                />;
            default:
                return <Form.Control className="w-auto"
                                     placeholder="Default Value"
                                     onChange={(event: any) => this.changeDefault(event.target.value, field_index)}
                                     value={field.default_value || ""}/>
        }
    };

    renderFieldDelete = (field: iEmailMailingListField, field_index: number) => {
        if (field.tag === "EMAIL") return null;
        return <Button color="secondary" onClick={() => this.deleteField(field_index)}><FaTrash/></Button>;
    };

    deleteField = (field_index: number) => {
        let fields = [...this.state.fields];
        fields.splice(field_index, 1);
        fields = this.setCustomOrder(fields);

        this.setState({fields});
    };

    setCustomOrder = (fields: iEmailMailingListField[]) => {
        fields.forEach((field, index) => field.custom_order = "" + index);
        return fields;
    };


    renderFieldOptions = (option: iEmailMailingListFieldOption, option_index: number, options: iEmailMailingListFieldOption[], field_index: number) => {
        return <tr key={option_index}>
            <td>
                <Form.Control className="w-auto"
                              placeholder="Option Label"
                              onChange={(event: any) => this.changeFieldOptionLabel(event.target.value, field_index, option_index)}
                              value={option.label}/>
            </td>
            <td>
                <Form.Control className="w-auto"
                              placeholder="Option Value"
                              onChange={(event: any) => this.changeFieldOptionValue(event.target.value, field_index, option_index)}
                              value={option.value}/>
            </td>
            <td>{this.renderFieldOptionDelete(option, option_index, options, field_index)}</td>
        </tr>
    };

    changeFieldOptionLabel = (value: string, field_index: number, option_index: number) => {
        const fields = [...this.state.fields];
        const options = fields[field_index].options;
        if (!options) return;
        options[option_index].label = value;

        this.setState({fields});
    };

    changeFieldOptionValue = (value: string, field_index: number, option_index: number) => {
        const fields = [...this.state.fields];
        const options = fields[field_index].options;
        if (!options) return;
        options[option_index].value = value;

        this.setState({fields});
    };

    renderFieldOptionDelete = (option: iEmailMailingListFieldOption, option_index: number, array: iEmailMailingListFieldOption[], field_index: number) => {
        if (array.length < 2) return null;
        return <Button variant="contained"
                       onClick={() => this.deleteFieldOption(field_index, option_index)}><FaTrash/></Button>;
    };

    deleteFieldOption = (field_index: number, option_index: number) => {
        const fields = [...this.state.fields];
        const field = fields[field_index];
        const options = field.options;
        if (options)
            options.splice(option_index, 1);

        this.setState({fields});
    };

    addFieldOption = (index: number) => {
        const fields = [...this.state.fields];
        const field = fields[index];
        if (!field.options) field.options = [];
        field.options.push({
            id: 0,
            uid: "",
            label: "",
            value: "",
            status: "",
            created_at: "",
            updated_at: "",
        });

        this.setState({fields});
    };
}

export default EmailMailingListsFieldsView;
