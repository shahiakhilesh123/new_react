import React from "react";
import {useField, useFormikContext} from "formik";
import DatePicker from "react-datepicker";
import moment from "moment";

export const DatePickerField = ({...props}: any) => {
    const {setFieldValue} = useFormikContext();
    const [field] = useField(props);
    return (
        <DatePicker
            {...field}
            {...props}
            popperModifiers={{
                offset: {enabled: true, offset: '5px, 10px'},
                preventOverflow: {
                    enabled: true,
                    escapeWithReference: false,
                    boundariesElement: 'viewport'
                }
            }}
            selected={(field.value && new Date(field.value)) || null}
            onChange={val => {
                setFieldValue(field.name, moment(val || "").format("YYYY-MM-DD"));
            }}
        />
    );
};

export default DatePickerField;
