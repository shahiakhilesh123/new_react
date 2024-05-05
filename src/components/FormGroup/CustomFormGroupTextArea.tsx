import React from "react";
import {Form} from "react-bootstrap";

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
    disabled?: boolean
}

export function getNestedValue(original_data: any, original_key: string) {
    const keys = original_key.split('.');
    let data = {...original_data};
    keys.forEach(key => {
        data = data ? data[key] : undefined;
    });
    return data;
}

function CustomFormGroupTextArea({
                                     formGroupProps,
                                     label,
                                     name,
                                     disabled,
                                     type,
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
            disabled={disabled}
            as="textarea"
            value={getNestedValue(values, name)}
            onChange={onChange}
            onBlur={onBlur}
            isInvalid={getNestedValue(touched, name) && !!getNestedValue(errors, name)}
        />
        <Form.Control.Feedback type="invalid">
            {getNestedValue(errors, name)}
        </Form.Control.Feedback>
    </Form.Group>
}

export default CustomFormGroupTextArea;
