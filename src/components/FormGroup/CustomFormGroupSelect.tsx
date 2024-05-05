import React from "react";
import {Form} from "react-bootstrap";
import {getNestedValue} from "./CustomFormGroup";

interface Props {
    formGroupProps: any,
    label: string | React.ReactNode
    name: string
    type: string
    onChange: (e: React.ChangeEvent<any>) => void,
    onBlur?: (e: React.FocusEvent<any>) => void,
    touched: any,
    errors: any
    values: any,
    disabled?: boolean,
    disabled_option: string,
    options: any,
}


function CustomFormGroupSelect({
                                   formGroupProps,
                                   label,
                                   name,
                                   type,
                                   disabled_option,
                                   options,
                                   disabled,
                                   onChange,
                                   onBlur,
                                   touched,
                                   errors,
                                   values
                               }: Props) {
    return <Form.Group {...formGroupProps}>
        <Form.Label>{label}</Form.Label>
        <Form.Control
            type={type}
            name={name}
            as="select"
            disabled={disabled}
            value={getNestedValue(values, name)}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={getNestedValue(touched, name) && !!getNestedValue(errors, name)}
        >
            <option value={""} disabled>{disabled_option}</option>
            {
                options && options.length && options.map((option: any) => {
                    return <option value={option.id}
                                   key={option.id}>{option.name}</option>
                })
            }
        </Form.Control>
        <Form.Control.Feedback type="invalid">
            {getNestedValue(errors, name)}
        </Form.Control.Feedback>
    </Form.Group>
}

export default CustomFormGroupSelect;
