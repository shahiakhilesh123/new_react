import {FormikHelpers} from "formik";
import {getFlatKeys} from "./common";

export function HandleErrors(res: any, helpers: FormikHelpers<any>) {

    if (res.validation_errors) {
        let keys = Object.keys(res.validation_errors)
        for (let i = 0; i < keys.length; i++) {
            helpers.setFieldError(keys[i], res.validation_errors[keys[i]][0])
        }
        if (keys.length) {
            focusInputElementByName(keys[0]);
        }
        return true
    }
    return false;
}

export function focusOnError(errors: Array<any>) {
    const keys = getFlatKeys(errors);
    if (keys.length) {
        focusInputElementByName(keys[0]);
    }
}

export function focusInputElementByName(name: string) {
    const els = document.getElementsByName(name);
    if (els.length) {
        if (document.activeElement)
            (document.activeElement as HTMLFormElement).blur();
        const el = els[0] as HTMLInputElement;
        el.focus();
        if (el.parentElement && el.type === "hidden") {
            el.parentElement.scrollIntoView({behavior: 'smooth'});
        }
    }
}
