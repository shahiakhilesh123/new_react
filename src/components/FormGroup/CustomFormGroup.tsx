import React from "react";
import {Form} from "react-bootstrap";

interface Props {
    formGroupProps?: any,
    formControlProps?: any,
    placeholder?: string,
    label: string | React.ReactNode
    name: string
    type: string
    maxLength?: number
    onChange: (e: React.ChangeEvent<any>) => void,
    onBlur?: (e: React.FocusEvent<any>) => void,
    touched: any,
    errors: any,
    disabled?: boolean
    values: any,
    autoComplete?: string,
    min?: number,
    max?: number,
    as?: any,
    required?: boolean

}

export function getNestedValue(original_data: any, original_key: string) {
    const keys = original_key.split('.');
    let data = {...original_data};
    keys.forEach(key => {
        data = data ? data[key] : undefined;
    });
    return data;
}

function FormGroup({
                       formGroupProps,
                       formControlProps,
                       placeholder,
                       label,
                       as,
                       name,
                       type,
                       autoComplete,
                       disabled,
                       required,
                       maxLength,
                       onChange,
                       onBlur,
                       touched,
                       errors,
                       values,
                       min,
                       max
                   }: Props) {
    return <Form.Group {...formGroupProps}>
        <Form.Label>{label}{required === true ? <b style={{color: "red"}}>*</b> : ''}</Form.Label>
        <Form.Control
            {...formControlProps}
            placeholder={placeholder}
            as={as}
            type={type}
            autoComplete={autoComplete}
            maxLength={maxLength}
            disabled={disabled}
            name={name}
            value={getNestedValue(values, name)}
            onChange={onChange}
            onBlur={onBlur}
            min={min}
            max={max}
            isInvalid={getNestedValue(touched, name) && !!getNestedValue(errors, name)}
        />
        <Form.Control.Feedback type="invalid">
            {getNestedValue(errors, name)}
        </Form.Control.Feedback>
    </Form.Group>
}

export default FormGroup;
