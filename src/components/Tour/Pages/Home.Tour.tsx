import {ReactourStep} from "reactour";
import * as React from "react";
import {Dispatch, useContext} from "react";
import Text1 from "../Text1";
import {useTour} from "@reactour/tour";
import Tooltip from "../Tooltip";
import {Button, IconButton} from "@material-ui/core";
import {ChevronLeft, ChevronRight, Duo, KeyboardArrowRight} from "@material-ui/icons";
import {AppDispatchContext, AppStateContext} from "../../../App";
import {iStoreAction} from "../../../redux/reducers";
import "./styles.scss"
import {useHistory, useLocation} from "react-router-dom";
import campaign_1 from "../../../assets/images/campaigns/create-campaigns-1.png"
import campaign_2 from "../../../assets/images/campaigns/create-campaigns-2.png"
import campaign_3 from "../../../assets/images/campaigns/create-campaigns-3.png"
import campaign_4 from "../../../assets/images/campaigns/create-campaigns-4.png"
import campaign_5 from "../../../assets/images/campaigns/create-campaigns-5.png"
import campaign_6 from "../../../assets/images/campaigns/create-campaigns-6.png"
import campaign_7 from "../../../assets/images/campaigns/create-campaigns-7.png"
import automation_1 from "../../../assets/images/automations/create-automation-1.png"
import {ContentProps, StepType, TourProps} from "@reactour/tour/dist/types";
import CloseIcon from "@material-ui/icons/Close";

export const TOUR_HOME = "TOUR_HOME";
export const TOUR_EMAIL_CAMPAIGN = "TOUR_EMAIL_CAMPAIGN";
export const TOUR_EMAIL_AUTOMATION = "TOUR_EMAIL_AUTOMATION";
export const TOUR_EMAIL = "TOUR_EMAIL";
export const TOUR_CHATS = "TOUR_CHATS";
export const TOUR_REVIEWS = "TOUR_REVIEWS";
export const TOUR_REVIEWS_SETTINGS = "TOUR_REVIEWS_SETTINGS";
export const TOUR_CHATS_SETTINGS = "TOUR_CHATS_SETTINGS";
export const TOUR_SKIP = "TOUR_SKIP";

// export function getTourSteps(tour_type: string) {
//
//     if (tour_type === TOUR_HOME) {
//         return _HomeConfig
//     }
//     if (tour_type === TOUR_EMAIL) {
//         return _emailConfig
//     }
//     if (tour_type === TOUR_EMAIL_CAMPAIGN) {
//         return _emailCampaignConfig
//     }
//     if (tour_type === TOUR_EMAIL_AUTOMATION) {
//         return _emailAutomationConfig
//     }
//     if (tour_type === TOUR_CHATS) {
//         return _chatConfig
//     }
//     if (tour_type === TOUR_SKIP) {
//         return _skipTourConfig
//     }
//
//     return []
// }
export function TourControls({
                                 props,
                                 onBack,
                                 onNext
                             }: { props: ContentProps, onBack?: () => void, onNext?: () => void }) {
    return <div className="w-100 d-flex justify-content-around mt-2">
        <IconButton onClick={onBack ? onBack : () => {
            if (props.currentStep > 0) {
                props.setCurrentStep(props.currentStep - 1)
            }
        }}>
            <ChevronLeft/>
        </IconButton>
        <IconButton onClick={onNext ? onNext : () => {
            props.setCurrentStep(props.currentStep + 1)
        }}>
            <ChevronRight/>
        </IconButton>
    </div>
}

export function TourWrapper({
                                children
                            }: { children: any }) {
    const {setIsOpen} = useTour();
    return <div>
        <div className="d-flex justify-content-end">
            <IconButton onClick={() => {
                setIsOpen(false)
            }}>
                <CloseIcon/>
            </IconButton>
        </div>
        <div>
            {children}
        </div>

    </div>
}

export function TourContent({
                                children
                            }: { children: any }) {

    return <div>
        {children}
    </div>
}

export function _HomeConfig(history: any, tour_props: TourProps, dispatch?: any): StepType[] {

    return [
        {
            selector: '[data-tut="reactour__header_dashboard"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        This is your dashboard, you can see your shop sales analytics <br/>and stats of sales breakdown
                        of
                        our review, chat and popup tools,
                        <br/>
                        <a href="https://www.youtube.com/channel/UCsZsVmPUNnvJblHDURUbWMQ/videos" target="_blank">
                            Learn emailwish by videos
                        </a>
                    </TourContent>

                    <TourControls props={props}/>
                </TourWrapper>
            }
        },
        {
            selector: '[data-tut="reactour__header_email"]',

            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This is your email dashboard and you can manage your campaigns and automations here
                        <br/>
                        <br/>
                        <div>
                        <span className="mb-4">
                            Check the following:
                        </span>
                            <ul className="tour-choose-list">
                                {
                                    [
                                        {
                                            value: "Email Summary",
                                            onClick: () => {
                                                history.push("/email")
                                                props.setCurrentStep(5)
                                            },
                                        },
                                        {
                                            value: "Email Campaigns",
                                            onClick: () => {
                                                history.push("/email/campaigns")


                                                props.setCurrentStep(11)


                                            },
                                        },
                                        {
                                            value: "Email Automations",
                                            onClick: () => {

                                                history.push("/email/automations")
                                                props.setCurrentStep(19)


                                            },
                                        },
                                    ].map((value, index) => {
                                        return <li key={index} onClick={value.onClick}>
                                        <span>
                                            {value.value}
                                        </span>
                                            <KeyboardArrowRight/>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </TourContent>
                    <TourControls props={props}/>

                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__header_chats"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This is chat page, you can manage the chats of your store from this page.
                        <br/>
                        <br/>
                        <div>
                        <span className="mb-4">
                            Check the following:
                        </span>
                            <ul className="tour-choose-list">
                                {
                                    [
                                        {
                                            value: "How to enable chat widget on shop",
                                            onClick: () => {
                                                history.push("/chats")
                                                props.setCurrentStep(22)
                                            },
                                        },
                                        {
                                            value: "How to set color and other settings of chat widget",
                                            onClick: () => {
                                                history.push("/chats/settings")
                                                props.setCurrentStep(23)
                                            },
                                        },

                                    ].map((value, index) => {
                                        return <li key={index} onClick={value.onClick}>
                                        <span>
                                            {value.value}
                                        </span>
                                            <KeyboardArrowRight/>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </TourContent>
                    <TourControls props={props}/>

                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__header_reviews"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This is review page, you can manage your store reviews here.
                        <br/>
                        <br/>
                        <div>
                        <span className="mb-4">
                            Check the following:
                        </span>
                            <ul className="tour-choose-list">
                                {
                                    [
                                        {
                                            value: "How to enable review widget on shop",
                                            onClick: () => {
                                                history.push("/reviews")
                                                props.setCurrentStep(41)
                                            },
                                        },
                                        {
                                            value: "How to set color and other settings of review widget",
                                            onClick: () => {
                                                history.push("/reviews/settings")
                                                props.setCurrentStep(42)

                                            },
                                        },

                                    ].map((value, index) => {
                                        return <li key={index} onClick={value.onClick}>
                                        <span>
                                            {value.value}
                                        </span>
                                            <KeyboardArrowRight/>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__header_popups"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This is popup page, you can create and manage your popups from this page.
                        <br/>
                        <br/>
                        <div>
                        <span className="mb-4">
                            Check the following:
                        </span>
                            <ul className="tour-choose-list">
                                {
                                    [
                                        {
                                            value: "How to enable popup widget on shop?",
                                            onClick: () => {
                                                history.push("/popups")
                                                props.setCurrentStep(53)
                                            },
                                        },
                                        {
                                            value: "How to use popup builder?",
                                            onClick: () => {
                                                dispatch && dispatch({
                                                    type: "popup_tour_shown",
                                                    popup_tour_shown: false
                                                })
                                                history.push("/popups")
                                                props.setCurrentStep(54)

                                            },
                                        },


                                    ].map((value, index) => {
                                        return <li key={index} onClick={value.onClick}>
                                        <span>
                                            {value.value}
                                        </span>
                                            <KeyboardArrowRight/>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </TourContent>
                    <TourControls props={props} onNext={() => {
                    }}/>
                </TourWrapper>
            ),
        },

        //email 5 done
        {
            selector: '[data-tut="reactour__sidebar_email_summary"]',
            mutationObservables: ['.app-loader'],

            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This is your email dashboard. you can see your email campaign's analytics and summary here.
                    </TourContent>
                    <TourControls props={props} onBack={() => {
                        history.push("/dashboard")
                        props.setCurrentStep(1)
                    }}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__sidebar_email_campaigns"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can manage your email campaigns
                        <br/>
                        <div>
                        <span className="mb-4">
                            Check the following:
                        </span>
                            <ul className="tour-choose-list">
                                {
                                    [
                                        {
                                            value: "How to create new campaign?",
                                            onClick: () => {
                                                history.push("/email/campaigns")

                                            },
                                        },
                                    ].map((value, index) => {
                                        return <li key={index} onClick={value.onClick}>
                                        <span>
                                            {value.value}
                                        </span>
                                            <KeyboardArrowRight/>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__sidebar_email_automations"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can manage your email automations
                        <br/>
                        <div>
                        <span className="mb-4">
                            Check the following:
                        </span>
                            <ul className="tour-choose-list">
                                {
                                    [
                                        {
                                            value: "How to create new automation",
                                            onClick: () => {
                                                history.push("/email/automations")

                                            },
                                        },
                                    ].map((value, index) => {
                                        return <li key={index} onClick={value.onClick}>
                                        <span>
                                            {value.value}
                                        </span>
                                            <KeyboardArrowRight/>
                                        </li>
                                    })
                                }
                            </ul>
                        </div>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__sidebar_email_lists"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can manage your mailing lists.
                    </TourContent>
                    <TourControls props={props}  />
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__sidebar_email_templates"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can manage your email templates.
                    </TourContent>
                    <TourControls props={props} />
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__sidebar_email_segments"]',
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can manage mailing list segmentations.
                    </TourContent>
                    <TourControls props={props} onNext={()=>{
                        history.push("/email/campaigns")
                        setTimeout(()=>{
                            props.setCurrentStep(11)
                        },2000)

                    }}/>
                </TourWrapper>
            )
        },

        //email campaign 11 done
        {
            selector: '[data-tut="reactour__create_campaigns"]',
            mutationObservables: ['.app-loader'],

            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can click on Add button to create new campaign.
                    </TourContent>
                    <TourControls props={props} onBack={() => {
                        props.setCurrentStep(1)
                    }}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__create_campaigns"]',
            position: "left",
            content: (props: ContentProps) => (
                <TourWrapper>
                    <img src={campaign_1} alt={"campaign image"}/>
                    <TourControls props={props}/>
                </TourWrapper>
            ),

        },
        {
            selector: '[data-tut="reactour__create_campaigns"]',
            position: "left",
            content: (props: ContentProps) => (
                <TourWrapper>
                    <img src={campaign_2} alt={"campaign image"}/>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__create_campaigns"]',

            content: (props: ContentProps) => (
                <TourWrapper>
                    <img src={campaign_3} alt={"campaign image"}/>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__create_campaigns"]',

            content: (props: ContentProps) => (
                <TourWrapper>
                    <img src={campaign_4} alt={"campaign image"}/>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__create_campaigns"]',

            content: (props: ContentProps) => (
                <TourWrapper>
                    <img src={campaign_5} alt={"campaign image"}/>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__create_campaigns"]',
            position: "top",
            content: (props: ContentProps) => (
                <TourWrapper>
                    <img src={campaign_6} alt={"campaign image"}/>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {

            selector: '[data-tut="reactour__create_campaigns"]',

            content: (props: ContentProps) => (
                <TourWrapper>
                    <img src={campaign_7} alt={"campaign image"}/>
                    <TourControls props={props} onNext={() => {
                        props.setCurrentStep(1)
                    }}/>
                </TourWrapper>
            )
        },

        //email automation 19 done
        {
            selector: '[data-tut="reactour__create_automations"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can click on Add button to create new automation.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__create_automations"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <div>
                        <p>
                            Create automation
                        </p>
                    </div>
                    <div className="tour-image-view">

                        <img src={automation_1} alt={"campaign image"}/>
                    </div>
                    <TourControls props={props} onNext={() => {
                        props.setCurrentStep(1)
                    }}/>
                </TourWrapper>
            )
        },

        //chat 22
        {
            selector: '[data-tut="reactour__chat_enable"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This switch enable/disable the chat widget on your store
                    </TourContent>
                    <TourControls props={props} onBack={() => {
                        props.setCurrentStep(2)
                    }}/>
                </TourWrapper>
            )
        },

        //chat settings 23
        {
            selector: '[data-tut="reactour__sidebar_chat_settings"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can edit chat design settings
                    </TourContent>
                    <TourControls props={props} onNext={() => {
                        history.push("/chats/settings");
                        props.setCurrentStep(props.currentStep + 1);
                    }}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_photo"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can upload chat agent photo
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_info_message"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can show information that will be visible to the user everytime user open chat widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_bot_name"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can change chat agent name
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_offline_message"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can change offline message. This is will be shown to user when agent is offline.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_welcome_message"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can change welcome message. This will be shown to user when chat opens for the first
                        time.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_primary_background_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can change background color of chat widget.
                    </TourContent>

                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_primary_text_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can change the text color of elements which have primary background.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_secondary_background_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can change secondary background color of chat widget. This is color is used in chat
                        header background
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_secondary_text_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can change the text color of elements which have secondary background.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_guest_message_background_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can set background color of guest message card from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_guest_message_text_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can set text color of guest message from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_admin_message_background_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can set background color of store admin (You) message card from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_admin_message_text_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can set text color of store admin (You) message from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_input_background_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can set text input widget's background color from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_input_text_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can set text input widget's text color from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_font_family"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can decide chat widget's font family
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_file_sharing_enabled"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        You can enable/disable file upload in chat widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__chat_settings_save_button"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Save your chat design settings!
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },

        //review 41
        {
            selector: '[data-tut="reactour__review_enable"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This switch enable/disable the review widget on your store
                    </TourContent>
                    <TourControls props={props} onBack={() => {
                        props.setCurrentStep(3)
                    }} onNext={() => {
                        props.setCurrentStep(3)
                    }}/>
                </TourWrapper>
            )
        },
        //review settings 42
        {
            selector: '[data-tut="reactour__sidebar_review_settings"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Here you can edit review design settings
                    </TourContent>

                    <TourControls props={props} onBack={() => {
                        props.setCurrentStep(3)
                    }}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__review_font_family"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Primary font family is used almost everywhere in review widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },

        {
            selector: '[data-tut="reactour__review_secondary_font_family"]',
            mutationObservables: ['.app-loader'],
            position: "left",
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Secondary font family is used review message.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__review_primary_background_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Primary background color is store's background color. You can change it from this color widget.
                    </TourContent>

                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__review_primary_text_color"]',
            mutationObservables: ['.app-loader'],
            position: "left",
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Primary text color is used for the text which has primary background color. You can change it
                        from this color widget.
                    </TourContent>

                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__review_secondary_background_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Secondary background color is used in Button's background. You can change it from this color
                        widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__review_secondary_text_color"]',
            mutationObservables: ['.app-loader'],
            position: "left",
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Secondary text color is used in Button's text. You can change it from this color widget.
                    </TourContent>
                    Secondary text/icon color
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },

        {
            selector: '[data-tut="reactour__review_active_star_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Active star color can be changed from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },

        {
            selector: '[data-tut="reactour__review_inactive_star_color"]',
            mutationObservables: ['.app-loader'],
            position: "left",
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Inactive star color can be changed from this color widget.
                    </TourContent>

                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__review_separator_color"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        All the separator line's color can be changed from this color widget.
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },

        {
            selector: '[data-tut="reactour__review_submit_button"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Save your review design settings!
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },
        {
            selector: '[data-tut="reactour__popup_enable_button"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        This switch enable/disable the popup widget on your store
                    </TourContent>

                    <TourControls props={props}/>
                </TourWrapper>
            )
        },

        {
            selector: '[data-tut="reactour__popup_add_button"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <TourContent>
                        Click here to add to build new popup
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            )
        },

        //skip
        {
            selector: '[data-tut="reactour__skip_tour"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => (
                <TourWrapper>
                    <div className="mb-3"/>
                    <span className={"mb-1"}>
                                   You can always replay the tour from this button
                    </span>

                    <br/>
                    <br/>
                    <div className="d-flex justify-content-center">
                        <Duo/>
                    </div>
                    <br/>
                    <div className="d-flex justify-content-center">
                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                type="button"
                                className="positive-button"
                                onClick={() => {
                                    props.setCurrentStep(props.currentStep + 1)
                                }}
                            >
                                ok, Got it!
                            </Button>
                        </div>
                    </div>

                </TourWrapper>
            ),
        },


    ]
}

export function HomeTour() {
    const {tour} = useContext(AppStateContext);
    const history = useHistory();
    const location = useLocation();
    const tour_props = useTour();
    const {setSteps, setCurrentStep,} = tour_props;

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);


    const tourConfig: ReactourStep[] = [
        {
            selector: '[data-tut="reactour__dashboard_analytics"]',
            content: `Analytics shows brief about your sales on shopify.`,
        },
        {
            stepInteraction: false,
            selector: '[data-tut="reactour__dashboard_reviews"]',
            content: `Here you will see recent reviews of your shop's products.`,
        },
        {
            selector: '[data-tut="reactour__dashboard_chat"]',
            content: `Here you will see recent Chat sessions of your shop.`,
        },
        {
            selector: '[data-tut="reactour__dashboard_email_campaigns"]',

            content: ({goTo}: any) => (
                <div>
                    If you wanna go anywhere, skipping places, it is absolutely possible.
                    <br/> "Oh, I forgot something inside the bus…"{" "}
                    <button
                        style={{
                            border: "1px solid #f7f7f7",
                            background: "none",
                            padding: ".3em .7em",
                            fontSize: "inherit",
                            display: "block",
                            cursor: "pointer",
                            margin: "1em auto"
                        }}

                    >
                        Please go back to{" "}
                        <span aria-label="bus" role="img">
            🚌
          </span>
                    </button>
                </div>
            )
        },
        {
            selector: '[data-tut="reactour___campaigns"]',
            content: () => (
                <Text1>
                    The <Tooltip data-tooltip="this helper ⬇">tourist guide</Tooltip> could
                    be positioned where you want.
                    <br/> In this case will try to stay in the <strong>
                    left side
                </strong>{" "}
                    if there's available space, otherwise will{" "}
                    <strong>auto position</strong>.
                </Text1>
            ),
            position: "left"
        },
        {
            selector: '[data-tut="reactour__dashboard_suggestions"]',
            content:
                "Probably you noted that the Tour scrolled directly to the desired place, and you could control the time also…"
        },
        {
            selector: '[data-tut="reactour__header_shopify"]',
            content:
                "Manage Your Shopify store from here"
        },
        {
            selector: '[data-tut="reactour__header_dashboard"]',
            content: () => (
                <div>
                    If you wanna go anywhere, skipping places, it is absolutely possible.
                    <br/> "Oh, I forgot something inside the bus…"{" "}
                    <button
                        style={{
                            border: "1px solid #f7f7f7",
                            background: "none",
                            padding: ".3em .7em",
                            fontSize: "inherit",
                            display: "block",
                            cursor: "pointer",
                            margin: "1em auto"
                        }}
                        onClick={() => {
                            //history.push("/email")
                        }}
                    >
                        Please go back to{" "}
                        <span aria-label="bus" role="img">
            🚌
          </span>
                    </button>
                </div>
            )
        },
        {
            selector: '[data-tut="reactour__scroll--hidden"]',
            content: "Also when places are pretty hidden…"
        },
    ];


    return null;
    // return <Tour
    //
    //     key={tour && tour.tour_type}
    //     onRequestClose={closeTour}
    //     steps={
    //         getTourSteps()
    //     }
    //
    //     isOpen={!!(tour && tour.tour_active)}
    //     maskClassName="tour-mask"
    //     className="helper"
    //     updateDelay={5000}
    //     disableFocusLock
    //     showNavigation={true}
    //     prevStep={()=>{
    //
    //     }}
    //     showNumber={false}
    //     showNavigationNumber={false}
    //     prevButton={false}
    //     accentColor={"#6500ff"}
    //     onAfterOpen={disableBodyScroll}
    //     onBeforeClose={enableBodyScroll}
    // />
}
