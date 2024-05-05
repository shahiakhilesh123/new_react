import makeStyles from "@material-ui/core/styles/makeStyles";
import {Theme} from "@material-ui/core";
import {createStyles} from "@material-ui/styles";
import {iChatSettings} from "../../../../../types/internal";
import {alpha} from "@material-ui/core/styles/colorManipulator";

const spacing = (number: number) => {
    return 8 * number;
};

export const useChatStyles = makeStyles((theme: Theme) =>
        createStyles({
            root: (settings: iChatSettings) => {
                return {
                    position: "fixed",
                    width: "max-content",
                    display: "flex",
                    flexDirection: "column",
                    height: "max-content",
                    bottom: spacing(2) + "px",
                    right: spacing(4) + "px",
                    zIndex: 100000,

                }
            },
            SubmitButton: (settings: iChatSettings) => {
                let box_shadow = alpha(settings.primary_background_color, 0.12);
                return {
                    marginTop: "4px",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    padding: spacing(1) + "px",
                    paddingInline: spacing(2) + "px",
                    fontSize: "12px",
                    boxShadow: "0px 3px 1px -2px " + box_shadow + ", 0px 2px 2px 0px " + box_shadow +
                        ", 0px 1px 5px 0px " + box_shadow,
                    backgroundColor: settings.primary_background_color,
                    color: settings.primary_text_color,
                    "&:hover": {
                        boxShadow: "0px 2px 4px -1px " + alpha(settings.primary_background_color, 0.20) + ", 0px 4px 5px 0px " + alpha(settings.primary_background_color, 0.14) +
                            ", 0px 1px 10px 0px " + alpha(settings.primary_background_color, 0.12)
                    }

                }
            },
            feedSubmitButton: (settings: iChatSettings) => {
                let box_shadow = alpha(settings.primary_background_color, 0.12);
                return {
                    marginTop: "8px",
                    padding: spacing(1) + "px",
                    paddingInline: spacing(2) + "px",
                    fontSize: "12px",
                    boxShadow: "0px 3px 1px -2px " + box_shadow + ", 0px 2px 2px 0px " + box_shadow +
                        ", 0px 1px 5px 0px " + box_shadow,
                    backgroundColor: settings.primary_background_color,
                    color: settings.primary_text_color,
                    "&:hover": {
                        boxShadow: "0px 2px 4px -1px " + alpha(settings.primary_background_color, 0.20) + ", 0px 4px 5px 0px " + alpha(settings.primary_background_color, 0.14) +
                            ", 0px 1px 10px 0px " + alpha(settings.primary_background_color, 0.12)
                    }

                }
            },
            textEdit: (settings: iChatSettings) => {
                return {
                    fontSize: "12px!important",
                    color: settings.secondary_text_color,
                    boxSizing: "content-box!important" as "content-box",
                }
            },
            mobileChatOpenRoot: {
                position: "fixed",
                width: "100%",
                top: "0",
                bottom: 0,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexDirection: "column",
                zIndex: 10000,

            },
            chatButtonWrapper: {
                display: "flex",
                justifyContent: "flex-end",
                pointerEvents: "none",
                [theme.breakpoints.down('sm')]: {
                    // marginRight: spacing(1),
                }
            },
            chatButton: (settings: iChatSettings) => {
                let box_shadow = alpha(settings.primary_background_color, 0.12);
                return {
                    width: spacing(7) + "px",
                    height: spacing(7) + "px",
                    boxShadow: "0px 3px 1px -2px " + box_shadow + ", 0px 2px 2px 0px " + box_shadow +
                        ", 0px 1px 5px 0px " + box_shadow,
                    background: settings.primary_background_color,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                    padding: spacing(1) + "px",
                    pointerEvents: "all",
                    "&:hover": {
                        boxShadow: "0px 2px 4px -1px " + alpha(settings.primary_background_color, 0.20) + ", 0px 4px 5px 0px " + alpha(settings.primary_background_color, 0.14) +
                            ", 0px 1px 10px 0px " + alpha(settings.primary_background_color, 0.12)
                    }
                }
            },
            chatIcon: (settings: iChatSettings) => {
                return {
                    width: spacing(3) + "px",
                    color: settings.primary_text_color,
                    userSelect: "none"
                }
            },
            chatIconMin: (settings: iChatSettings) => {
                return {
                    width: spacing(5) + "px",
                    color: settings.primary_text_color,
                    userSelect: "none"
                }
            },
            chatWindow: (settings: iChatSettings) => {
                return {
                    width: "360px",
                    height: `calc(100vh - 9rem)`,
                    background: settings.secondary_background_color,
                    paddingBottom: spacing(0) + "px",
                    marginBottom: spacing(1) + "px",
                    boxShadow: "0 3px 20px 0 rgb(0 0 0 / 5%)",
                    display: "flex",
                    flexDirection: "column",
                    [theme.breakpoints.down('xs')]: {
                        width: "100%",
                        height: `100%`,
                        marginBottom: "0",
                        padding: "8px"
                    }
                }
            },
            ratingWrapper: (settings: iChatSettings) => {
                return {
                    display: "flex"
                }
            },
            ratingText: (settings: iChatSettings) => {
                return {}
            },
            chatWindowInnerWrapper: {
                height: "100%",
                display: "flex",
                flexDirection: "column",

            },
            chatWindowHeader: (settings: iChatSettings) => {
                return {
                    padding: spacing(1) + "px",
                    paddingInline: spacing(1.5) + "px",
                    marginInline: spacing(2) + "px",
                    marginTop: spacing(2) + "px",
                    display: "flex",
                    flexDirection: "column",
                    background: settings.primary_background_color,

                    borderRadius: spacing(1) + "px"
                }
            },
            chatWindowHeader_1: {
                padding: spacing(0.2) + "px",
                paddingTop: spacing(1) + "px",

                display: "flex",
                alignItems: "center"
            },
            chatWindowHeader_InfoWrapper: {
                paddingBlock: spacing(1) + "px",
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center"
            },
            chatWindowHeader_endChatButton: (settings: iChatSettings) => {
                let box_shadow = alpha(settings.primary_background_color, 0.12);
                return {

                    color: settings.primary_text_color,
                    boxShadow: "0px 3px 1px -2px " + box_shadow + ", 0px 2px 2px 0px " + box_shadow +
                        ", 0px 1px 5px 0px " + box_shadow,
                    background: settings.primary_background_color,
                    "&:hover": {
                        color: settings.primary_text_color,
                        background: settings.primary_background_color,

                        boxShadow: "0px 2px 4px -1px " + alpha(settings.primary_background_color, 0.20) + ", 0px 4px 5px 0px " + alpha(settings.primary_background_color, 0.14) +
                            ", 0px 1px 10px 0px " + alpha(settings.primary_background_color, 0.12)

                    }
                }
            },
            chatWindowHeader_restartChatButton: (settings: iChatSettings) => {
                let box_shadow = alpha(settings.primary_background_color, 0.12);
                return {
                    fontSize: "12px",
                    textTransform: "capitalize",
                    width: "130px",
                    boxShadow: "0px 3px 1px -2px " + box_shadow + ", 0px 2px 2px 0px " + box_shadow +
                        ", 0px 1px 5px 0px " + box_shadow,
                    padding: "10px",
                    color: settings.primary_text_color,
                    background: settings.primary_background_color,
                    "&:hover": {

                        boxShadow: "0px 2px 4px -1px " + alpha(settings.primary_background_color, 0.20) + ", 0px 4px 5px 0px " + alpha(settings.primary_background_color, 0.14) +
                            ", 0px 1px 10px 0px " + alpha(settings.primary_background_color, 0.12),

                        color: settings.primary_text_color,
                        background: settings.primary_background_color,
                    }
                }
            },
            chatWindowHeader_Info_type: (settings: iChatSettings) => {
                return {
                    fontSize: "12px",
                    color: settings.primary_text_color
                }
            },
            chatHeaderName: (settings: iChatSettings) => {
                return {
                    fontSize: "13px",
                    fontWeight: "bold",
                    color: settings.primary_text_color
                }
            },
            chatHeaderImage: {
                width: spacing(8) + "px",
                height: spacing(8) + "px",
                borderRadius: "50%",
                objectFit: "cover",
                margin: 0
            },
            chatHeaderActiveIcon: {
                width: spacing(1) + "px",
                height: spacing(1) + "px",
                borderRadius: "50%",
                background: "lawngreen"
            },
            chatHeaderStatusText: (settings: iChatSettings) => {
                return {
                    fontSize: "12px",
                    color: settings.primary_text_color
                }
            },
            rateUsText: (settings: iChatSettings) => {
                return {
                    color: settings.secondary_text_color,
                    fontSize: "13px",
                    fontWeight: "bold"
                }
            },
            chatHeaderExpandIcon: (settings: iChatSettings) => {
                return {
                    width: "16px",
                    color: settings.primary_text_color
                }
            },
            chatWindowHeader_2: {
                padding: spacing(1) + "px"
            },
            chatBody: {
                flexGrow: 1,
                paddingTop: spacing(1) + "px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
            },
            chatBodyMessageItemWrapper: {},
            chatBodyMessageItem: {
                marginBottom: spacing(2) + "px",
                display: "flex",
                flexDirection: "column",
                paddingInline: spacing(2) + "px",
            },
            chatBodyMessageItemGuest: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
            },
            chatBodyMessageItemAdmin: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            },
            chatBodyMessageItemGuestText: (settings: iChatSettings) => {
                return {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    color: settings.guest_message_text_color,
                    backgroundColor: settings.guest_message_background_color,
                    borderRadius: spacing(1) + "px",
                    padding: spacing(1.5) + "px",
                    paddingInline: spacing(3) + "px",
                }
            },
            chatBodyMessageItemGuestInfo: {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end"
            },
            chatBodyMessageItemGuestInfoDate: (settings: iChatSettings) => {
                return {
                    paddingInline: spacing(0.5) + "px",
                }
            },
            chatBodyMessageItemGuestInfoIcon: {
                paddingInline: spacing(0.5) + "px",
            },
            chatBodyMessageItemGuestInfoIconItem: (settings: iChatSettings) => {
                return {
                    width: "18px",
                    color: settings.secondary_text_color
                }
            },
            chatBodyMessageItemAdminForm: {},
            chatBodyMessageItemAdminText: (settings: iChatSettings) => {
                return {
                    minWidth: "150px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    color: settings.admin_message_text_color,

                    backgroundColor: settings.admin_message_background_color,
                    borderRadius: spacing(1) + "px",
                    padding: spacing(0.5) + "px",
                    paddingInline: spacing(2) + "px",


                }
            },
            chatBodyMessageItemAdminTextAfter: (settings: iChatSettings) => {
                return {
                    position: "relative",
                    height: "16px",
                    width: "16px",
                    transform: "rotate(45deg)",
                    bottom: "-8px",
                    backgroundColor: settings.admin_message_background_color,
                }
            },
            chatBodyMessageItemAdminTextTypo: (settings: iChatSettings) => {
                return {
                    fontSize: "13px",
                    color: settings.admin_message_text_color,
                    marginTop: spacing(1) + "px",
                    marginBottom: spacing(-0.6) + "px"
                }
            },
            chatBodyMessageItemGuestTextTypo: (settings: iChatSettings) => {
                return {
                    color: settings.guest_message_text_color,
                    fontSize: "13px",
                }
            },
            chatBodyMessageItemAdminInfo: {
                display: "flex",
                alignItems: "center"
            },
            chatBodyMessageItemAdminInfoDate: (settings: iChatSettings) => {
                return {
                    width: "100%",
                    minHeight: spacing(1.5) + "px",
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingInline: spacing(0.5) + "px",
                }
            },
            chatBodyMessageItemAdminInfoDateTypo: (settings: iChatSettings) => {
                return {
                    color: settings.secondary_text_color,
                    fontSize: "11px"
                }
            },
            chatBodyMessageItemGuestInfoDateTypo: (settings: iChatSettings) => {
                return {
                    color: settings.secondary_text_color,
                    fontSize: "11px"
                }
            },
            chatBodyMessageItemAdminSenderInfo: {},
            chatBodyMessageItemAdminSenderInfoName: {},
            chatBodyMessageItemAdminSenderInfoNameTypo: (settings: iChatSettings) => {
                return {
                    color: settings.secondary_text_color,
                    fontSize: "11px",
                    paddingLeft: spacing(1) + "px"
                }
            },

            chatBodyMessageItemAdminSenderImageInfo: {
                width: spacing(5) + "px",
                height: spacing(5) + "px",
                borderRadius: "50%",
                objectFit: "cover"
            },
            chatBodyMessageItemAdminInfoIcon: {},
            chatFooter: {
                paddingInline: spacing(2) + "px"
            },
            chatFooterInput: {
                marginBottom: spacing(1) + "px"
            },
            chatFooterInputAttachment: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            },
            chatFooterInputAttachmentTextWrapper: {
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between"
            },
            chatFooterInputAttachmentText: (settings: iChatSettings) => {
                return {
                    fontSize: "13px",
                    color: settings.secondary_text_color,
                    width: "250px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }
            },

            chatFooterInputAttachmentFileSize: (settings: iChatSettings) => {
                return {
                    color: settings.secondary_text_color,
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }
            },
            chatFooterInputAttachmentCloseButton: {},
            chatFooterInputBox: (settings: iChatSettings) => {
                return {
                    fontSize: "12px!important",
                    padding: spacing(2) + "px",
                    border: "none",
                    color: settings.input_text_color,
                    boxSizing: "content-box!important" as "content-box",
                    backgroundColor: settings.input_background_color,
                    "&:hover": {
                        border: "none"
                    }
                }
            },
            chatFooterInputBox2: (settings: iChatSettings) => {
                return {}
            },
            chatFooterInputBoxInputAdornment: (settings: iChatSettings) => {
                return {
                    border: "none",
                    backgroundColor: settings.input_background_color,
                    boxShadow: "0px 1px 25px 2px #e3e2e26f",
                    "&:hover": {
                        border: "none"
                    }
                }
            },
            chatFooterInputIcon: (settings: iChatSettings) => {
                return {
                    color: settings.input_text_color
                }
            },
            chatFooterTextLink: {
                display: "flex",
                justifyContent: "center",
                textDecoration: "none",
                alignItems: "center",
                marginBottom: spacing(1) + "px"

            },
            chatFooterTextImage: {
                zIndex: 100,
                width: spacing(2) + "px",
                height: "auto",
                margin: 0
            },
            chatFooterText: (settings: iChatSettings) => {
                return {
                    fontSize: "11px",
                    color: settings.secondary_text_color,
                    paddingLeft: spacing(1) + "px"
                }
            },

        }),
    {classNamePrefix: "ew-chat-"}
);
