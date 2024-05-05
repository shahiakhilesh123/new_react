import {makeStyles} from '@material-ui/core/styles';
import {createStyles} from "@material-ui/core";
import {createContext} from "react";

export interface PopupProps extends iPopupContext {
    popup_title: string
    popup_id: string,
    popup_thumbnail: string,
    backgroundColor: string,
    backgroundOverlayColor: string,
    hasBackgroundImage: boolean,
    backgroundImage: string,
    backgroundRepeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y",
    backgroundSize: "auto" | "cover" | "contain" | "unset",
    backgroundPosition: "top" | "center" | "bottom" | "left" | "right" | "unset",

    popup_position: "top-left" | "top-middle" | "top-right" |
        "middle-left" | "center" | "middle-right" |
        "bottom-left" | "bottom-middle" | "bottom-right",
    popup_width: string,
    popup_height: string

    borderWidth: string,
    borderColor: string,
    borderRadius: string,

    title: string,
    hideTitle: boolean,
    titleAlign: "center" | "left" | "right",
    titleTextSize: string,
    titleTextColor: string,


    body: string,
    bodyAlign: "center" | "left" | "right",
    hideBody: boolean,
    bodyTextSize: string,
    bodyTextColor: string,

    hideFirstTextFormField: boolean,
    firstTextFormFieldHint: string,
    firstTextFormFieldTextSize: string,
    firstTextFormFieldTextColor: string,
    firstTextFormFieldBackgroundColor: string,
    firstTextFormFocusBorderColor: string,
    firstTextFormFocusShadowColor: string,
    firstTextFormShadowColor: string,
    firstTextFormBorderColor: string,

    hideSecondTextFormField: boolean,
    secondTextFormFieldHint: string,
    secondTextFormFieldTextSize: string,
    secondTextFormFieldTextColor: string,
    secondTextFormFieldBackgroundColor: string,
    secondTextFormFocusBorderColor: string,
    secondTextFormFocusShadowColor: string,
    secondTextFormShadowColor: string,
    secondTextFormBorderColor: string,

    thirdTextFormFieldHint: string,
    thirdTextFormFieldTextSize: string,
    thirdTextFormFieldTextColor: string,
    thirdTextFormFieldBackgroundColor: string,
    thirdTextFormFocusBorderColor: string,
    thirdTextFormFocusShadowColor: string,
    thirdTextFormShadowColor: string,
    thirdTextFormBorderColor: string,

    footer: string,
    footerAlign: "center" | "left" | "right",

    hideFooter: boolean,
    footerTextSize: string,
    footerTextColor: string,

    image?: string,
    imageWidthPercentAge: number,
    imageHeightPercentAge: number,
    imageBackgroundRepeat: "no-repeat" | "repeat" | "repeat-x" | "repeat-y"
    imageBackgroundSize: "auto" | "cover" | "contain" | "unset"
    imageBackgroundPosition: "top" | "center" | "bottom" | "left" | "right" | "unset"
    hideImage: boolean

    PositiveButtonAlignment: "flex-start" | "flex-end" | "center",
    PositiveButtonWidth: string,
    PositiveButtonHeight: string,
    PositiveButtonTextAlignment: "center" | "left" | "right",
    PositiveButtonText: string
    PositiveButtonTextColor: string
    PositiveButtonBackgroundColor: string,
    PositiveButtonHoverBackgroundColor: string,
    PositiveButtonHoverTextColor: string,
    PositiveButtonHoverBorderColor: string,
    PositiveButtonTextSize: string
    PositiveButtonRadius: string,
    hidePositiveButton: boolean,
    PositiveButtonFocusBorderColor: string,
    PositiveButtonFocusShadowColor: string,
    PositiveButtonShadowColor: string,
    PositiveButtonBorderColor: string,

    NegativeButtonText: string
    NegativeButtonTextColor: string
    NegativeButtonBackgroundColor: string,
    NegativeButtonHoverBackgroundColor: string,
    NegativeButtonHoverTextColor: string,
    NegativeButtonHoverBorderColor: string,
    NegativeButtonTextSize: string
    NegativeButtonRadius: string,
    hideNegativeButton: boolean,
    NegativeButtonFocusBorderColor: string,
    NegativeButtonFocusShadowColor: string,
    NegativeButtonShadowColor: string,
    NegativeButtonBorderColor: string,

    creationMode: boolean,
    aspect_ratio: boolean,

    onButtonSelected?: () => void,
    onTextSelected?: () => void,
    onFormInputSelected?: () => void,
    onBackgroundSelected?: () => void,
    onImageSelected?: () => void,

    onPositiveButtonClicked?: (data: any, hasForm: boolean, action_url?: string) => void
    onNegativeButtonClicked?: () => void
    submitting_form?: boolean,

    hasImageUploadOption: boolean,
    hasNegativeButtonOption: boolean,
    emailFieldRequired: boolean,
    hasForm: boolean,
    positiveButtonLink?: string

    formAlignment: "flex-start" | "flex-end" | "center",
    hideBranding?: boolean
}

export const usePopupStyles = makeStyles((theme) =>
    createStyles({
        root: (props: PopupProps,) => ({
            backgroundColor: !props.hasBackgroundImage ?
                props.backgroundColor : props.backgroundOverlayColor,
            borderColor: props.borderColor,
            borderRadius: props.borderRadius + "px",
            borderWidth: props.borderWidth + "px",
            borderStyle: "solid",
            overflow: "hidden",
            width: props.popup_width + "px",
            maxWidth: "unset",
            height: props.popup_height + "px",
            margin: "0",
            backgroundImage: props.hasBackgroundImage ?
                `url(${props.backgroundImage})` : "none",
            backgroundPosition: props.hasBackgroundImage ?
                props.backgroundPosition : "unset",
            backgroundRepeat: props.hasBackgroundImage ?
                props.backgroundRepeat : "unset",
            backgroundSize: props.hasBackgroundImage ?
                props.backgroundSize : "unset",
            backgroundBlendMode: "overlay",
            [theme.breakpoints.down('xs')]: {
                height: "80vh",
                width: "100%"
            },
        }),
        root_grid: (props: PopupProps,) => ({
            flexDirection: "unset",
            [theme.breakpoints.down('xs')]: {
                flexDirection: "column",
            },
        }),
        root_grid_image: (props: PopupProps,) => ({

            [theme.breakpoints.down('xs')]: {
                flex: 1,
                width: "100%"
            },
        }),
        root_grid_form: (props: PopupProps,) => ({
            [theme.breakpoints.down('xs')]: {
                width: "100%",
                flex: 1
            },
        }),
        powered_by: (props: PopupProps) => ({
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
        }),
        powered_by_typo: (props: PopupProps) => ({
            fontSize: "12px",
            color: props.titleTextColor,
            marginTop: '4px',
            display: props.hideBranding ? "none !important" : "unset"
        }),
        firstFormField: (props: PopupProps) => ({
            fontSize: props.firstTextFormFieldTextSize + "px",
            color: props.firstTextFormFieldTextColor,
            borderColor: props.firstTextFormBorderColor,
            backgroundColor: props.firstTextFormFieldBackgroundColor,
            boxShadow: "0 0 2px 2px " + (props.firstTextFormShadowColor || "#000"),
            borderStyle: "solid",
            borderWidth: "1px",
            '& :focus': {
                outline: "none",
                borderColor: props.firstTextFormFocusBorderColor,
                boxShadow: "0 3px 20px 0 " + (props.firstTextFormFocusShadowColor || "#000")
            },
        }),
        firstFormFieldInput: (props: PopupProps) => ({
            fontSize: props.firstTextFormFieldTextSize + "px",
            color: props.firstTextFormFieldTextColor,
            paddingInline: "4px",
        }),
        secondFormField: (props: PopupProps) => ({
            fontSize: props.secondTextFormFieldTextSize + "px",
            color: props.secondTextFormFieldTextColor,
            borderColor: props.secondTextFormBorderColor,
            backgroundColor: props.secondTextFormFieldBackgroundColor,
            boxShadow: "0 0 2px 2px " + (props.secondTextFormShadowColor || "#000"),
            borderStyle: "solid",
            borderWidth: "1px",
            '& :focus': {
                outline: "none",
                borderColor: props.secondTextFormFocusBorderColor,
                boxShadow: "0 3px 20px 0 " + (props.secondTextFormFocusShadowColor || "#000")
            },
        }),
        secondFormFieldInput: (props: PopupProps) => ({
            fontSize: props.secondTextFormFieldTextSize + "px",
            color: props.secondTextFormFieldTextColor,
            paddingInline: "4px",
        }),
        thirdFormField: (props: PopupProps) => ({
            borderColor: props.thirdTextFormBorderColor,
            backgroundColor: props.thirdTextFormFieldBackgroundColor,
            boxShadow: "0 0 2px 2px " + (props.thirdTextFormShadowColor || "#000"),
            borderStyle: "solid",
            borderWidth: "1px",
            paddingInline: "4px",
            '& :focus': {
                outline: "none",
                // borderColor:props.thirdTextFormFocusBorderColor,
                boxShadow: "0 3px 20px 0 " + (props.thirdTextFormFocusShadowColor || "#000")
            },
        }),
        thirdFormFieldInput: (props: PopupProps) => ({
            fontSize: props.thirdTextFormFieldTextSize + "px",
            color: props.thirdTextFormFieldTextColor,
            paddingInline: "4px",
        }),
        title: (props: PopupProps) => ({
            color: props.titleTextColor,
            fontSize: props.titleTextSize + "px",
            fontWeight: "bold",
            textAlign: props.titleAlign
        }),
        body: (props: PopupProps) => ({
            color: props.bodyTextColor,
            fontSize: props.bodyTextSize + "px",
            textAlign: props.bodyAlign
        }),
        image: (props: PopupProps) => ({
            height: props.imageHeightPercentAge + "%",
            width: props.imageWidthPercentAge + "%",
            backgroundImage: `url(${props.image})`,
            backgroundPosition: props.imageBackgroundPosition,
            backgroundRepeat: props.imageBackgroundRepeat,
            backgroundSize: props.imageBackgroundSize
        }),
        footer: (props: PopupProps) => ({
            fontSize: props.footerTextSize + "px",
            color: props.footerTextColor,
            marginTop: '20px',
            fontStyle: "italic",
            textAlign: props.footerAlign
        }),
        positiveButtonWrapper: (props: PopupProps,) => ({
            display: "flex",
            justifyContent: props.PositiveButtonAlignment,
            width: "100%"
        }),
        positiveButton: (props: PopupProps) => ({
            width: props.PositiveButtonWidth === "auto" ? "auto" : props.PositiveButtonWidth + "%",
            height: props.PositiveButtonHeight === "auto" ? "auto" : props.PositiveButtonHeight + "px",
            textAlign: props.PositiveButtonTextAlignment,
            display: "inline-block",
            fontWeight: 400,
            verticalAlign: "middle",
            userSelect: "none",
            border: "1px solid transparent",
            padding: "0.375rem 0.75rem",
            lineHeight: "1.5",
            transition: "color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",

            color: props.PositiveButtonTextColor,
            backgroundColor: props.PositiveButtonBackgroundColor,
            '&:hover': {
                backgroundColor: props.PositiveButtonHoverBackgroundColor,
                borderColor: props.PositiveButtonHoverBorderColor,
                color: props.PositiveButtonHoverTextColor,
            },
            fontSize: props.PositiveButtonTextSize + "px",
            borderRadius: props.PositiveButtonRadius + 'px',
            borderColor: props.PositiveButtonBorderColor,
            boxShadow: "0 0 2px 2px " + (props.PositiveButtonShadowColor || "#000"),
            '&:focus,&:active': {
                outline: "none",
                color: props.PositiveButtonHoverTextColor,
                backgroundColor: props.PositiveButtonHoverBackgroundColor,
                borderColor: props.PositiveButtonFocusBorderColor,
                boxShadow: "0 3px 20px 0 " + (props.PositiveButtonFocusShadowColor || "#000")
            },
        }),
        negativeButton: (props: PopupProps) => ({
            display: "inline-block",
            fontWeight: 400,
            verticalAlign: "middle",
            userSelect: "none",
            padding: "0.375rem 0.75rem",
            lineHeight: "1.5",
            transition: "color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",

            color: props.NegativeButtonTextColor,
            backgroundColor: props.NegativeButtonBackgroundColor,
            '&:hover': {
                backgroundColor: props.NegativeButtonHoverBackgroundColor,
                borderColor: props.NegativeButtonHoverBorderColor,
                color: props.NegativeButtonHoverTextColor,
            },
            fontSize: props.NegativeButtonTextSize + "px",
            borderRadius: props.NegativeButtonRadius + 'px',
            border: "none",
            width: "auto",
            borderColor: props.NegativeButtonBorderColor,
            boxShadow: "0 0 2px 2px " + (props.NegativeButtonShadowColor || "#000"),
            '&:focus': {
                outline: "none",
                color: props.NegativeButtonHoverTextColor,
                backgroundColor: props.NegativeButtonHoverBackgroundColor,
                borderColor: props.NegativeButtonFocusBorderColor,
                boxShadow: "0 3px 20px 0 " + (props.NegativeButtonFocusShadowColor || "#000")
            },
        }),
        formParent: (props: PopupProps) => ({
            display: "flex",
            flexDirection: "column",
            height: "100%",

            justifyContent: props.formAlignment
        }),
    },), {index: 1},
);

export interface iPopupContext {
    isMobile?: boolean
}

export const PopupContext = createContext<iPopupContext>({isMobile: false});

