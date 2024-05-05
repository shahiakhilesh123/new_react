import * as React from "react";
import {useEffect, useState} from "react";
import DatePicker, {ReactDatePickerProps} from "react-datepicker";
import moment from "moment";


interface iProps extends ReactDatePickerProps {
    defaultValue?: Date
}

export default function DatePickerUncontrolled(prop: iProps) {

    const [date, setDate] = useState<Date | null>();
    useEffect(() => {
        setDate(prop.defaultValue || moment().toDate());
    }, []);
    const {defaultValue, ...props} = prop;
    return <DatePicker {...props}
                       selected={date}
                       onChange={(date: any) => setDate(date)}/>;

}
