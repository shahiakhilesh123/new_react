import React, {createContext, Dispatch, useCallback, useContext, useEffect, useReducer, useState} from "react";
import {
    Button,
    ButtonGroup,
    Checkbox,
    FormControlLabel,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Slider,
    Switch,
    Typography
} from "@material-ui/core";
import theme from "../../AppThemePopup";
import AppCard from "../../components/Card/AppCard";
import AppCardHeader from "../../components/Card/AppCardHeader";
import AppCardBody from "../../components/Card/AppCardBody";
import IconLabelButtons from "../../components/IconLabelButtons/IconLabelButtons";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import {Alert, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {PopupContext, PopupProps} from "../../components/popups/popup_props/props";
import PopupAPIs, {iPopupCreateParams, iPopupListingResponse,} from "../../apis/Popup/popup.apis";
import EmailCampaignAPIs from "../../apis/Email/email.campaigns.apis";
import {useHistory, useParams} from "react-router-dom";
import Gallery, {GalleryProps} from "../../components/Gallery/Gallery";

import FormatAlignCenterIcon from '@material-ui/icons/FormatAlignCenter';
import FormatAlignLeftIcon from '@material-ui/icons/FormatAlignLeft';
import FormatAlignRightIcon from '@material-ui/icons/FormatAlignRight';
import VerticalAlignBottomIcon from '@material-ui/icons/VerticalAlignBottom';
import VerticalAlignTopIcon from '@material-ui/icons/VerticalAlignTop';
import VerticalAlignCenterIcon from '@material-ui/icons/VerticalAlignCenter';
import {AppDispatchContext, AppStateContext, NotificationContext} from "../../App";

import AppLoader from "../../components/Loader/AppLoader";
import CustomDropDown from "../../components/CustomDropDown/CustomDropDown";
import ColorSketchPicker from "../../components/ColorPicker/ColorPicker2";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import {Scrollbar} from "../../components/CustomScroll/ScrollBars";
import domtoimage from 'dom-to-image';
import useIsMounted from "ismounted";
import {default_popup_data} from "./Popup.List";

import PopupPreview from "./PopupPreview";
import WindowSize from "@reach/window-size";
import {FieldArray, Formik} from "formik";
import * as yup from "yup";
import {FaMinus, FaPlus} from "react-icons/fa";
import {iPopup} from "../../types/internal/popup/popup";
import {iListResource, iListResponseActions, iStoreAction, listReducer} from "../../redux/reducers";
import {Reducer} from "redux";
import {Flag} from "@material-ui/icons";
import {useTour} from "@reactour/tour";
import {TourContent, TourControls, TourWrapper} from "../../components/Tour/Pages/Home.Tour";
import {ContentProps, StepType, TourProps} from "@reactour/tour/dist/types";
import HelpVideo from "../../components/HelpVideo/HelpVideo";
import UpgradePlanRequired from "../../components/UpgradePlanWrapper/UpgradePlanWrapper";

export const GalleryWidgetApiContext = createContext<GalleryProps>({});

const popup_positions = [
    "top-left",
    "top-middle",
    "top-right",
    "middle-left",
    "center",
    "middle-right",
    "bottom-left",
    "bottom-middle",
    "bottom-right"
];

function PopupCreate() {
    useEffect(() => {
        document.title = "Popup Edit | Emailwish";
    }, []);
    const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [saving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [popup, setPopup_] = useState<PopupProps>();
    const [showModal, setShowModel] = useState<boolean>(false);
    const [showImageGallery, setShowImageGallery] = useState<boolean>(false);
    const [showBackgroundGallery, setShowBackgroundGallery] = useState<boolean>(false);
    const [showSetting, setShowSetting] = useState<boolean>(false);
    const [setting, setSetting] = useState<iPopup | undefined>();
    const [rawPopup, setRawPopup] = useState<iPopup | undefined>();
    const params: any = useParams<any>();
    const history = useHistory();
    const isMounted = useIsMounted();
    const {popup_tour_shown} = useContext(AppStateContext);

    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);

    function _popupConfig(history: any, tour_props: TourProps, hasForm: boolean): StepType[] {
        let items = [
            {
                selector: '[data-tut="reactour__popup_background"]',
                mutationObservables: ['.app-loader'],
                content: (props: ContentProps) => {

                    return <TourWrapper>
                        <TourContent>
                            <p>
                                Popup background can be managed from this tab.
                            </p>
                            <p>
                                You can use between color background and image background.
                            </p>
                        </TourContent>
                        <TourControls props={props}/>
                    </TourWrapper>
                }
            },
        ];
        if (hasForm) {
            items.push({
                selector: '[data-tut="reactour__popup_form"]',
                mutationObservables: ['.app-loader'],
                content: (props: ContentProps) => {

                    return <TourWrapper>
                        <TourContent>
                            <p>
                                Form in the popup can be managed through this tab.

                            </p>
                        </TourContent>
                        <TourControls props={props}/>
                    </TourWrapper>
                }
            })

        }
        items.push({
            selector: '[data-tut="reactour__popup_button"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        <p>
                            Button in the popup can be managed through this tab.
                        </p>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            }
        });
        items.push({
            selector: '[data-tut="reactour__popup_text"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        <p>
                            Text in the popup can be managed through this tab.
                        </p>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            }
        });

        items.push({
            selector: '[data-tut="reactour__popup_size_width"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        <p>
                            Width of the popup can be managed through this input.
                        </p>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            }
        });
        items.push({
            selector: '[data-tut="reactour__popup_size_height"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        <p>
                            Height of the popup can be managed through this input.
                        </p>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            }
        });
        items.push({
            selector: '[data-tut="reactour__popup_popup_position"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        <p>
                            Position of the popup can be managed through this input.
                        </p>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            }
        });
        items.push({
            selector: '[data-tut="reactour__popup_aspect_ratio"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        <p>
                            Aspect Ratio of the popup can be managed through this input.
                        </p>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            }
        });
        items.push({
            selector: '[data-tut="reactour__popup_builder_view"]',
            mutationObservables: ['.app-loader'],
            content: (props: ContentProps) => {

                return <TourWrapper>
                    <TourContent>
                        <p>
                            All the changes in the input will reflect here in the builder
                        </p>
                    </TourContent>
                    <TourControls props={props}/>
                </TourWrapper>
            }
        });
        return items;
    }

    const [{
        resource, query
    }, dispatchList] = useReducer<Reducer<iListResource<iPopupListingResponse>, iListResponseActions<iPopupListingResponse>>>
    (listReducer<iListResource<iPopupListingResponse>, any>({}), {
        query: {sort_order: "created_at", sort_direction: "desc", per_page: 20},
        loading: true,
    });
    const popupTrigger = [
        {
            id: "on-load",
            name: "On-load"
        },
        {
            id: "scroll-start",
            name: "Scroll Start"
        },
        {
            id: "scroll-middle",
            name: "Scroll Middle"
        },
        {
            id: "scroll-end",
            name: "Scroll End"
        },
        {
            id: "idle",
            name: "Idle"
        },
        {
            id: "leaving",
            name: "Leaving"
        },
    ];


    const changeImage = useCallback((address: string) => {

        let popup1: any = popup;
        if (popup1 !== null) {
            popup1.image = address
            setPopup(popup1);
            setShowImageGallery(false);
        }
    }, [popup]);
    const changeBGImage = useCallback((address: string) => {

        let popup1: any = popup;
        if (popup1 !== null) {
            popup1.backgroundImage = address
            setPopup(popup1);
            setShowBackgroundGallery(false);
        }
    }, [popup]);

    const hideImageGallery = useCallback(() => {
        setShowImageGallery(false);
    }, []);
    const hideBGGallery = useCallback(() => {
        setShowBackgroundGallery(false);
    }, []);


    const setPopup = useCallback((popup: PopupProps | null) => {
        if (popup) {
            setPopup_({...popup});
        } else {
            setPopup_(undefined);
        }
    }, [])


    const notificationContext = useContext(NotificationContext);
    useEffect(() => {
        fetchResource(params.uid);
    }, []);

    const onButtonSelected = useCallback(() => {
        setSelectedMenu("button");
    }, [])

    const onTextSelected = useCallback(() => {
        setSelectedMenu("text");
    }, [])

    const onFormInputSelected = useCallback(() => {
        setSelectedMenu("form");
    }, [])

    const onBackgroundSelected = useCallback(() => {
        setSelectedMenu("background");
    }, [])

    const onImageSelected = useCallback(() => {
        setSelectedMenu("background");
        setShowImageGallery(true);
    }, [])

    const tour = useTour();
    const onSavePopup = useCallback(() => {
        if (popup) {
            setSaving(true);
            let popup1 = popup;
            if (popup1 !== null) {
                popup1.creationMode = false;
                setPopup(popup1);
            }
            setTimeout(() => {
                convertNodeToImage().then((res) => {
                    updateResource(params.uid, {
                        title: popup.popup_title,
                        popup_position: popup.popup_position,
                        data: JSON.stringify(popup),
                        width: popup.popup_width,
                        height: popup.popup_height,
                        type: popup.popup_id,
                        thumbnail_file: res
                    });
                })

            }, 1)


        }
    }, [popup])

    const fetchResource = useCallback((uid: string) => {
        setLoading(true);
        setError("");
        new PopupAPIs().view(uid).then(response => {
            if (PopupAPIs.hasError(response, notificationContext) || !response.popup || !response.popup.data) {
                setLoading(false);
                setError(PopupAPIs.getError(response))
            } else {
                if (typeof response.popup.data === "string") {
                    setError("");
                    setRawPopup(response.popup)
                    let data: PopupProps = JSON.parse(response.popup.data);
                    setPopup({
                        ...default_popup_data,
                        ...data,
                        creationMode: true,
                        popup_title: response.popup.title,
                        onImageSelected: onImageSelected,
                        onBackgroundSelected: onBackgroundSelected,
                        onFormInputSelected: onFormInputSelected,
                        onButtonSelected: onButtonSelected,
                        onTextSelected: onTextSelected,
                    });
                    if (data) {
                        setLoading(false);
                        setSelectedMenu(null)
                        tour.setSteps(_popupConfig(history, tour, data.hasForm));
                        tour.setCurrentStep(0);
                        tour.setIsOpen(!popup_tour_shown)
                        dispatch({type: "popup_tour_shown", popup_tour_shown: true})
                    }

                }
            }
        })
    }, [tour, history])

    const updateResource = useCallback((uid: string, creationParams: iPopupCreateParams) => {

        setError("");
        new PopupAPIs().update(uid, creationParams).then(response => {
            if (isMounted.current) {
                if (EmailCampaignAPIs.hasError(response, notificationContext) || !response.uid) {
                    setSaving(false);
                    setError(EmailCampaignAPIs.getError(response));
                } else {
                    setSaving(false);
                    setError("");
                    let popup1 = popup;
                    if (popup1) {
                        popup1.creationMode = false;
                        setPopup(popup1);
                    }
                    setSetting(rawPopup)
                    setShowSetting(true)
                }
            }

        });
    }, [isMounted, history, popup])

    const escapeKeyListener = (event: any) => {
        if (event.key == "Escape") {
            setShowModel(false)
        }
    }
    useEffect(() => {
        window.addEventListener("keyup", escapeKeyListener);
        return () => {

            window.removeEventListener("keyup", escapeKeyListener);
        }
    }, [])

    const [showHelpVideo, setShowHelpVideo] = useState(false);
    const convertNodeToImage = (): Promise<string> => {

        return new Promise<string>(((resolve, reject) => {
            let node = document.getElementById('popup_builder');
            if (node) {
                domtoimage.toPng(node, {quality: 0.03,})
                    .then(function (dataUrl) {
                        resolve(dataUrl);
                    })
                    .catch(function (error) {
                        console.error('oops, something went wrong!', error);
                    });
            }
        }))
    }

    function renderPopupCreation() {
        if (!popup)
            return <div/>;
        return <>
            {/************** modal *************/}
            <Modal show={showSetting} onHide={() => {
                setSetting(undefined)
                setShowSetting(false);
            }}>
                {
                    //@ts-ignore
                    <Modal.Header closeButton>
                        <Modal.Title>Manage Popup</Modal.Title>
                    </Modal.Header>
                }
                <Modal.Body>
                    <Formik
                        initialValues={{
                            active: (setting && setting.active) || false,
                            active_mobile: (setting && setting.active_mobile) || false,
                            behaviour: (setting && setting.behaviour) || "",
                            triggers: (setting && setting.triggers && setting.triggers.length > 0 && setting.triggers) || [
                                {
                                    type: "",
                                    delay_seconds: 5
                                }
                            ]
                        }}
                        validateOnChange={false}
                        onSubmit={async (values: any, helpers) => {
                            if (setting) {
                                helpers.setSubmitting(true);
                                new PopupAPIs().popup_setting(setting.uid, values).then(value => {
                                    if (isMounted.current) {
                                        if (PopupAPIs.hasError(value, notificationContext)) {
                                            helpers.setSubmitting(false);
                                        } else {
                                            setSetting(undefined)
                                            setShowSetting(false);
                                            fetchResource(params.uid);
                                        }
                                    }
                                })
                            }

                        }}
                        validationSchema={yup.object({
                            active: yup.string(),
                            behaviour: yup.string(),
                            triggers: yup.array(yup.object({
                                type: yup.string().required("Please select type"),
                                delay_seconds: yup.string().required("Please select delay"),
                            })),
                        })}
                    >{({
                           handleSubmit,
                           handleBlur,
                           values,
                           touched,
                           errors,
                           isSubmitting,
                           setFieldValue,
                           handleChange
                       }: any) => {
                        return <form onSubmit={handleSubmit}>

                            <Typography>
                                You need to configure an <a href="/email/automations" target="_blank">automation</a> to
                                handle popup submissions emails.
                            </Typography>
                            <div className="mt-2">
                                <FormControlLabel
                                    control={<Switch checked={values.active} onChange={((event, checked) => {
                                        setFieldValue("active", checked)
                                    })} name="active"/>}
                                    label="Active in Web"
                                />
                                <FormControlLabel
                                    control={<Switch checked={values.active_mobile} onChange={((event, checked) => {
                                        setFieldValue("active_mobile", checked)
                                    })} name="active_mobile"/>}
                                    label="Active in Mobile"
                                />

                                <Form.Group>
                                    <Form.Label>Behaviour *</Form.Label>
                                    <Form.Control
                                        type={"text"}
                                        name={`behaviour`}
                                        as={"select"}
                                        value={values.behaviour}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        isInvalid={(touched &&
                                            touched.behaviour && !!(
                                                errors &&
                                                errors.behaviour
                                            )
                                        )}
                                    >
                                        <option value={""} disabled>Select Behaviour</option>
                                        <option value={"once"}>Show once</option>
                                        <option value={"till_submission"}
                                        >Show till submission
                                        </option>
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                        {errors &&
                                        errors.behaviour}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <h6>Triggers</h6>
                                <FieldArray name="triggers">
                                    {
                                        (triggers_props => {
                                            return <div>
                                                {values.triggers && values.triggers.length > 0 &&
                                                values.triggers.map((_trigger: any, index: number) => {
                                                    return <div
                                                        key={index.toString() + values.triggers.length.toString()}
                                                        className="mb-2 edit-trigger">
                                                        <p>Trigger {index + 1}</p>
                                                        <Row>
                                                            <Form.Group as={Col}>
                                                                <Form.Label>When to trigger *</Form.Label>
                                                                <Form.Control
                                                                    type={"text"}
                                                                    name={`triggers[${index}].type`}
                                                                    as="select"
                                                                    value={_trigger.type}
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    isInvalid={(touched &&
                                                                        touched.triggers &&
                                                                        touched.triggers.length > index &&
                                                                        touched.triggers[index] &&
                                                                        touched.triggers[index].type && !!(
                                                                            errors &&
                                                                            errors.triggers &&
                                                                            errors.triggers.length > index &&
                                                                            errors.triggers[index] &&
                                                                            errors.triggers[index].type
                                                                        )
                                                                    )}
                                                                >
                                                                    <option value={""} disabled>Select trigger type
                                                                    </option>
                                                                    {
                                                                        popupTrigger.map((option: any) => {
                                                                            return <option value={option.id}
                                                                                           key={option.id}>{option.name}</option>
                                                                        })
                                                                    }
                                                                </Form.Control>
                                                                <Form.Control.Feedback type="invalid">
                                                                    {errors &&
                                                                    errors.triggers &&
                                                                    errors.triggers.length > index &&
                                                                    errors.triggers[index] &&
                                                                    errors.triggers[index].type}
                                                                </Form.Control.Feedback>
                                                            </Form.Group>
                                                            {
                                                                _trigger.type !== "leaving" && <Form.Group as={Col}>
                                                                    <Form.Label>
                                                                        Delay *
                                                                    </Form.Label>
                                                                    <Slider
                                                                        value={_trigger.delay_seconds}
                                                                        getAriaValueText={(value, index) => {
                                                                            return value.toString() + " seconds"
                                                                        }}
                                                                        onChange={(event, value) => {
                                                                            setFieldValue(`triggers[${index}].delay_seconds`, value)
                                                                        }}
                                                                        aria-labelledby="discrete-slider"
                                                                        valueLabelDisplay="auto"
                                                                        step={1}
                                                                        marks
                                                                        min={0}
                                                                        max={10}
                                                                    />
                                                                </Form.Group>
                                                            }
                                                        </Row>
                                                        {values.triggers.length > 1 &&
                                                        <div className="d-flex justify-content-end">
                                                            <Button className="" variant="text" color="inherit"
                                                                    onClick={() => {
                                                                        triggers_props.remove(index)
                                                                    }}>
                                                                Remove Trigger&nbsp;<FaMinus/>
                                                            </Button>
                                                        </div>
                                                        }

                                                    </div>
                                                })}
                                                <Button variant="contained" color="primary" onClick={() => {
                                                    triggers_props.push({
                                                        type: "",
                                                        delay_seconds: 5
                                                    })
                                                }}>
                                                    Add Trigger&nbsp;<FaPlus/>
                                                </Button>

                                            </div>
                                        })
                                    }
                                </FieldArray>

                            </div>

                            <div className="float-right">
                                <Button color="secondary" onClick={() => {
                                    setSetting(undefined)
                                    setShowSetting(false);
                                }}>
                                    Close
                                </Button>
                                <Button color="primary" type="submit">
                                    {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}Save
                                </Button>
                            </div>
                        </form>
                    }}
                    </Formik>
                </Modal.Body>
            </Modal>


            <Grid container direction="row" spacing={2}>
                <Grid item md={4}>
                    <AppCard>
                        <AppCardHeader className="p-2">
                            <Grid container direction="row">
                                <Grid item lg={3} md={6}>
                                    <Typography variant="h6" className="u500">
                                        Options
                                    </Typography>
                                </Grid>
                                <Grid item md={9} container spacing={1} justifyContent={"flex-end"}
                                      alignItems={"center"}>
                                    <Grid item>
                                        <IconButton onClick={() => {
                                            if (popup) {
                                                setSelectedMenu(null)
                                                tour.setSteps(_popupConfig(history, tour, popup.hasForm));
                                                tour.setCurrentStep(0);
                                                tour.setIsOpen(true)
                                            }


                                        }}>
                                            <Flag/>
                                        </IconButton>
                                    </Grid> <Grid item>

                                    <Button variant="contained" form="popup_form" color="primary"
                                            className="positive-button"
                                            disabled={saving}
                                            type="submit"> {saving && <><Spinner animation="border"
                                                                                 size="sm"/>&nbsp;</>}Save &
                                        config</Button>
                                </Grid>
                                    <Grid item>

                                        <Button variant="contained" color="primary"
                                                className="positive-button"
                                                onClick={() => {
                                                    let popup1 = popup;
                                                    if (popup1 !== null) {
                                                        popup1.creationMode = false;
                                                        setPopup(popup1);
                                                    }
                                                    setShowModel(true)
                                                }}>Preview</Button>
                                    </Grid>
                                    <Grid item className="d-flex">

                                        <div className="p-2"/>

                                        <Button variant="outlined" color="secondary" onClick={() => {
                                            if (window.confirm("Do you really cancel creating the popup without saving?")) {
                                                if (!params.uid) {
                                                    setPopup(null);
                                                } else {
                                                    history.push("/popups")
                                                }
                                            }
                                        }
                                        }>Cancel</Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </AppCardHeader>
                        <AppCardBody className="p-2">
                            <Scrollbar style={{height: "calc(95vh - 200px)"}}>

                                <Typography>
                                    You need to configure an <a href="/email/automations"
                                                                target="_blank">automation</a> to handle popup
                                    submissions emails.
                                </Typography>
                                {selectedMenu == null
                                    ?
                                    <List component="nav" aria-label="main mailbox folders">
                                        <ListItem button onClick={() => {
                                            setSelectedMenu("background");
                                        }
                                        } data-tut="reactour__popup_background">
                                            <ListItemText primary="Background"/>
                                        </ListItem>
                                        {
                                            popup.hasForm && <ListItem button onClick={() => {
                                                setSelectedMenu("form");
                                            }
                                            } data-tut="reactour__popup_form">
                                                <ListItemText primary="Form"/>
                                            </ListItem>
                                        }
                                        <ListItem button onClick={() => {
                                            setSelectedMenu("button");
                                        }
                                        } data-tut="reactour__popup_button">
                                            <ListItemText primary="Button"/>
                                        </ListItem>
                                        <ListItem button onClick={() => {
                                            setSelectedMenu("text");
                                        }
                                        } data-tut="reactour__popup_text">
                                            <ListItemText primary="Text"/>
                                        </ListItem>
                                    </List> :
                                    <Grid container direction="row">
                                        <Grid item md={12}>
                                            <IconLabelButtons
                                                color="secondary"
                                                icon={<ArrowBackIosIcon color="secondary"/>}
                                                text={selectedMenu}
                                                variant="text"
                                                onClick={() => {
                                                    setSelectedMenu(null);
                                                }}
                                            />
                                        </Grid>
                                        {
                                            selectedMenu === "background"
                                                ? <Grid item md={12} key={'background'}>
                                                    <Grid container spacing={1}>
                                                        <Grid item md={12}>
                                                            <FormControlLabel
                                                                value="start"
                                                                control={
                                                                    <Checkbox color="primary"
                                                                              checked={popup.hasBackgroundImage}
                                                                              onChange={(e) => {
                                                                                  let popup1 = popup;
                                                                                  if (popup1 !== null) {
                                                                                      popup1.hasBackgroundImage = e.target.checked;
                                                                                      setPopup(popup1);
                                                                                  }
                                                                              }}/>}
                                                                label="Use Background Image"
                                                                labelPlacement="start"
                                                            />
                                                        </Grid>
                                                    </Grid>

                                                    {
                                                        popup.hasBackgroundImage &&
                                                        <Grid container direction="row" spacing={1}>
                                                            <Grid item md={12}>
                                                                <ListItemText primary="Background Image"/>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Form.Group>
                                                                    <img src={popup.backgroundImage} width={100} alt={""}
                                                                         style={{width: "100px", cursor: "pointer"}}
                                                                         onClick={() => {
                                                                             setShowBackgroundGallery(true);
                                                                         }}/>
                                                                    <Button variant="text"
                                                                            color="primary"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setShowBackgroundGallery(true);
                                                                            }}
                                                                    >Change Image</Button>
                                                                    <GalleryWidgetApiContext.Provider value={{
                                                                        HideGallery: hideBGGallery,
                                                                        onImageSelected: changeBGImage,
                                                                        openGallery: showBackgroundGallery,
                                                                    }}>
                                                                        <div className="position-absolute" style={{
                                                                            top: "0",
                                                                            left: "0",
                                                                            zIndex: 1500
                                                                        }}>
                                                                            <Gallery/>
                                                                        </div>
                                                                    </GalleryWidgetApiContext.Provider>

                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Form.Group>
                                                                    <Form.Label>Overlay Color</Form.Label>
                                                                    <ColorSketchPicker
                                                                        defaultValue={popup.backgroundOverlayColor}
                                                                        onChange={(color => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                popup1.backgroundOverlayColor = color;
                                                                                setPopup(popup1);
                                                                            }
                                                                        })}
                                                                    />
                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Grid container spacing={1}>
                                                                    <Grid item md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Repeat</Form.Label>
                                                                            <CustomDropDown
                                                                                value={popup.backgroundRepeat}
                                                                                onChange={(v: any) => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.backgroundRepeat = v;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}
                                                                                options={[
                                                                                    {
                                                                                        label: "No repeat",
                                                                                        value: "no-repeat"
                                                                                    },
                                                                                    {
                                                                                        label: "Repeat",
                                                                                        value: "repeat"
                                                                                    },
                                                                                    {
                                                                                        label: "Repeat X",
                                                                                        value: "repeat-x"
                                                                                    },
                                                                                    {
                                                                                        label: "Repeat Y",
                                                                                        value: "repeat-y"
                                                                                    }
                                                                                ]}

                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Size</Form.Label>
                                                                            <CustomDropDown
                                                                                value={popup.backgroundSize}
                                                                                onChange={(v: any) => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.backgroundSize = v;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}
                                                                                options={[
                                                                                    {
                                                                                        label: "Auto",
                                                                                        value: "auto"
                                                                                    },
                                                                                    {
                                                                                        label: "Cover",
                                                                                        value: "cover"
                                                                                    },
                                                                                    {
                                                                                        label: "Contain",
                                                                                        value: "contain"
                                                                                    }
                                                                                ]}

                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Position</Form.Label>
                                                                            <CustomDropDown
                                                                                value={popup.backgroundPosition}
                                                                                onChange={(v: any) => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.backgroundPosition = v;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}
                                                                                options={[
                                                                                    {
                                                                                        label: "Top",
                                                                                        value: "top"
                                                                                    },
                                                                                    {
                                                                                        label: "Center",
                                                                                        value: "center"
                                                                                    },
                                                                                    {
                                                                                        label: "Bottom",
                                                                                        value: "bottom"
                                                                                    },
                                                                                    {
                                                                                        label: "Left",
                                                                                        value: "left"
                                                                                    },
                                                                                    {
                                                                                        label: "Right",
                                                                                        value: "right"
                                                                                    },
                                                                                    {
                                                                                        label: "Unset",
                                                                                        value: "unset"
                                                                                    }
                                                                                ]}

                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                        </Grid>
                                                    }
                                                    {
                                                        !popup.hasBackgroundImage &&
                                                        <Grid container direction="row" spacing={1}>
                                                            <Grid item md={12}>
                                                                <Form.Group>
                                                                    <Form.Label>Color</Form.Label>
                                                                    <ColorSketchPicker
                                                                        defaultValue={popup.backgroundColor}
                                                                        onChange={(color => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                popup1.backgroundColor = color;
                                                                                setPopup(popup1);
                                                                            }
                                                                        })}
                                                                    />
                                                                </Form.Group>
                                                            </Grid>

                                                        </Grid>
                                                    }
                                                    <Grid container direction="row" spacing={1}>
                                                        <Grid item md={12}>
                                                            <ListItemText primary="Border"/>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <Form.Group>
                                                                <Form.Label>Width</Form.Label>
                                                                <Form.Control
                                                                    name="border_width"
                                                                    type="number"
                                                                    defaultValue={popup.borderWidth && "1"}
                                                                    onChange={(e) => {
                                                                        let popup1 = popup;
                                                                        if (popup1 !== null) {
                                                                            popup1.borderWidth = e.target.value;
                                                                            setPopup(popup1);
                                                                        }
                                                                    }}
                                                                />
                                                            </Form.Group>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <Form.Group>
                                                                <Form.Label>Radius</Form.Label>
                                                                <Form.Control name="border_radius" type="number"
                                                                              defaultValue={popup.borderRadius && "1"}

                                                                              onChange={(e) => {
                                                                                  let popup1 = popup;
                                                                                  if (popup1 !== null) {
                                                                                      popup1.borderRadius = e.target.value;
                                                                                      setPopup(popup1);
                                                                                  }
                                                                              }}
                                                                />
                                                            </Form.Group>
                                                        </Grid>
                                                        <Grid item md={6}>
                                                            <Form.Group>
                                                                <Form.Label>Color</Form.Label>
                                                                <ColorSketchPicker
                                                                    defaultValue={popup.borderColor}
                                                                    onChange={(color => {
                                                                        let popup1 = popup;
                                                                        if (popup1 !== null) {
                                                                            popup1.borderColor = color;
                                                                            setPopup(popup1);
                                                                        }
                                                                    })}
                                                                />
                                                            </Form.Group>
                                                        </Grid>

                                                    </Grid>
                                                    {
                                                        popup.hasImageUploadOption &&
                                                        <Grid container direction="row" spacing={1}>
                                                            <Grid item md={12}>
                                                                <ListItemText primary="Image"/>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Form.Group>
                                                                    <img src={popup.image} width={100} alt={""}
                                                                         style={{width: "100px", cursor: "pointer"}}
                                                                         onClick={() => {
                                                                             setShowImageGallery(true);
                                                                         }}/>
                                                                    <Button variant="text"
                                                                            color="primary"
                                                                            type="button"
                                                                            onClick={() => {
                                                                                setShowImageGallery(true);
                                                                            }}
                                                                    >Change Image</Button>
                                                                    <GalleryWidgetApiContext.Provider value={{
                                                                        HideGallery: hideImageGallery,
                                                                        onImageSelected: changeImage,
                                                                        openGallery: showImageGallery,
                                                                    }}>
                                                                        <div className="position-absolute" style={{
                                                                            top: "0",
                                                                            left: "0",
                                                                            zIndex: 1500
                                                                        }}>
                                                                            <Gallery/>
                                                                        </div>
                                                                    </GalleryWidgetApiContext.Provider>

                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <Form.Group className="px-2">
                                                                    <Form.Label>Width</Form.Label>
                                                                    <Slider
                                                                        style={{width: "90%"}}
                                                                        valueLabelDisplay="auto"
                                                                        value={popup.imageWidthPercentAge}
                                                                        onChange={((event, value) => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                if (typeof value === "number") {
                                                                                    popup1.imageWidthPercentAge = value;
                                                                                    setPopup(popup1);
                                                                                }

                                                                            }
                                                                        })}
                                                                        aria-labelledby="input-slider"
                                                                    />


                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item md={6}>
                                                                <Form.Group className="px-2">
                                                                    <Form.Label>Height</Form.Label>
                                                                    <Slider
                                                                        style={{width: "90%"}}
                                                                        valueLabelDisplay="auto"
                                                                        value={popup.imageHeightPercentAge}
                                                                        onChange={((event, value) => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                if (typeof value === "number") {
                                                                                    popup1.imageHeightPercentAge = value;
                                                                                    setPopup(popup1);
                                                                                }

                                                                            }
                                                                        })}
                                                                        aria-labelledby="input-slider"
                                                                    />


                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <Grid container spacing={1}>
                                                                    <Grid item md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Repeat</Form.Label>
                                                                            <CustomDropDown
                                                                                value={popup.imageBackgroundRepeat}
                                                                                onChange={(v: any) => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.imageBackgroundRepeat = v;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}
                                                                                options={[
                                                                                    {
                                                                                        label: "No repeat",
                                                                                        value: "no-repeat"
                                                                                    },
                                                                                    {
                                                                                        label: "Repeat",
                                                                                        value: "repeat"
                                                                                    },
                                                                                    {
                                                                                        label: "Repeat X",
                                                                                        value: "repeat-x"
                                                                                    },
                                                                                    {
                                                                                        label: "Repeat Y",
                                                                                        value: "repeat-y"
                                                                                    }
                                                                                ]}

                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Size</Form.Label>
                                                                            <CustomDropDown
                                                                                value={popup.imageBackgroundSize}
                                                                                onChange={(v: any) => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.imageBackgroundSize = v;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}
                                                                                options={[
                                                                                    {
                                                                                        label: "Auto",
                                                                                        value: "auto"
                                                                                    },
                                                                                    {
                                                                                        label: "Cover",
                                                                                        value: "cover"
                                                                                    },
                                                                                    {
                                                                                        label: "Contain",
                                                                                        value: "contain"
                                                                                    }
                                                                                ]}

                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Position</Form.Label>
                                                                            <CustomDropDown
                                                                                value={popup.imageBackgroundPosition}
                                                                                onChange={(v: any) => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.imageBackgroundPosition = v;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}
                                                                                options={[
                                                                                    {
                                                                                        label: "Top",
                                                                                        value: "top"
                                                                                    },
                                                                                    {
                                                                                        label: "Center",
                                                                                        value: "center"
                                                                                    },
                                                                                    {
                                                                                        label: "Bottom",
                                                                                        value: "bottom"
                                                                                    },
                                                                                    {
                                                                                        label: "Left",
                                                                                        value: "left"
                                                                                    },
                                                                                    {
                                                                                        label: "Right",
                                                                                        value: "right"
                                                                                    },
                                                                                    {
                                                                                        label: "Unset",
                                                                                        value: "unset"
                                                                                    }
                                                                                ]}

                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                        </Grid>
                                                    }


                                                </Grid> :
                                                selectedMenu === "form" ?
                                                    <Grid item md={12} key={'form'}>

                                                        <Grid container direction="row" spacing={1}>

                                                            <Grid item md={12}>
                                                                <Form.Group>
                                                                    <Form.Label>Vertical Alignment</Form.Label><br/>
                                                                    <ButtonGroup size="medium"
                                                                                 aria-label="small">

                                                                        <IconButton onClick={() => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                popup1.formAlignment = "flex-start";
                                                                                setPopup(popup1);
                                                                            }
                                                                        }}>
                                                                            <VerticalAlignTopIcon
                                                                                color={popup.formAlignment === "flex-start" ? "primary" : "disabled"}/>
                                                                        </IconButton>
                                                                        <IconButton onClick={() => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                popup1.formAlignment = "center";
                                                                                setPopup(popup1);
                                                                            }
                                                                        }}>
                                                                            <VerticalAlignCenterIcon
                                                                                color={popup.formAlignment === "center" ? "primary" : "disabled"}/>
                                                                        </IconButton>
                                                                        <IconButton onClick={() => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                popup1.formAlignment = "flex-end";
                                                                                setPopup(popup1);
                                                                            }
                                                                        }}>
                                                                            <VerticalAlignBottomIcon
                                                                                color={popup.formAlignment === "flex-end" ? "primary" : "disabled"}/>
                                                                        </IconButton>
                                                                    </ButtonGroup>
                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item md={12}>
                                                                <FormControlLabel
                                                                    value="start"
                                                                    control={
                                                                        <Checkbox color="primary"
                                                                                  checked={!popup.hideFirstTextFormField}
                                                                                  onChange={(e) => {
                                                                                      let popup1 = popup;
                                                                                      if (popup1 !== null) {
                                                                                          popup1.hideFirstTextFormField = !e.target.checked;
                                                                                          setPopup(popup1);
                                                                                      }
                                                                                  }}/>}
                                                                    label="Field 1"
                                                                    labelPlacement="start"
                                                                />
                                                            </Grid>
                                                            {!popup.hideFirstTextFormField && <>
                                                                <Grid item lg={6} md={12}>
                                                                    <Form.Group>
                                                                        <Form.Label>Hint Text</Form.Label>
                                                                        <Form.Control name="firstTextFieldHint"
                                                                                      type="text"
                                                                                      defaultValue={popup.firstTextFormFieldHint}
                                                                                      onChange={(e) => {
                                                                                          let popup1 = popup;
                                                                                          if (popup1 !== null) {
                                                                                              popup1.firstTextFormFieldHint = e.target.value;
                                                                                              setPopup(popup1);
                                                                                          }
                                                                                      }}
                                                                        />
                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Font-size</Form.Label>
                                                                        <Form.Control name="firstTextFieldFontSize"
                                                                                      type="number"
                                                                                      defaultValue={popup.firstTextFormFieldTextSize}
                                                                                      onChange={(e) => {
                                                                                          let popup1 = popup;
                                                                                          if (popup1 !== null) {
                                                                                              popup1.firstTextFormFieldTextSize = e.target.value;
                                                                                              setPopup(popup1);
                                                                                          }
                                                                                      }}
                                                                        />
                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>color</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.firstTextFormFieldTextColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.firstTextFormFieldTextColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />

                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Border Color</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.firstTextFormBorderColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.firstTextFormBorderColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />

                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item container md={12} spacing={2}>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Background</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.firstTextFormFieldBackgroundColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.firstTextFormFieldBackgroundColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>

                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Shadow</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.firstTextFormShadowColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.firstTextFormShadowColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />

                                                                        </Form.Group>
                                                                    </Grid>

                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Focus Border</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.firstTextFormFocusBorderColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.firstTextFormFocusBorderColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>

                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Focus Shadow</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.firstTextFormFocusShadowColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.firstTextFormFocusShadowColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                </Grid>

                                                            </>}

                                                        </Grid>
                                                        <Grid container direction="row" spacing={1}>
                                                            <Grid item md={12}>
                                                                <FormControlLabel
                                                                    value="start"
                                                                    control={
                                                                        <Checkbox color="primary"
                                                                                  checked={!popup.hideSecondTextFormField}
                                                                                  onChange={(e) => {
                                                                                      let popup1 = popup;
                                                                                      if (popup1 !== null) {
                                                                                          popup1.hideSecondTextFormField = !e.target.checked;
                                                                                          setPopup(popup1);
                                                                                      }
                                                                                  }}/>}
                                                                    label="Field 2"
                                                                    labelPlacement="start"
                                                                />
                                                            </Grid>
                                                            {!popup.hideSecondTextFormField && <>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Hint Text</Form.Label>
                                                                        <Form.Control name="secondTextFormFieldHint"
                                                                                      type="text"
                                                                                      defaultValue={popup.secondTextFormFieldHint}
                                                                                      onChange={(e) => {
                                                                                          let popup1 = popup;
                                                                                          if (popup1 !== null) {
                                                                                              popup1.secondTextFormFieldHint = e.target.value;
                                                                                              setPopup(popup1);
                                                                                          }
                                                                                      }}
                                                                        />
                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Font-size</Form.Label>
                                                                        <Form.Control name="secondTextFormFieldTextSize"
                                                                                      type="number"
                                                                                      defaultValue={popup.secondTextFormFieldTextSize}
                                                                                      onChange={(e) => {
                                                                                          let popup1 = popup;
                                                                                          if (popup1 !== null) {
                                                                                              popup1.secondTextFormFieldTextSize = e.target.value;
                                                                                              setPopup(popup1);
                                                                                          }
                                                                                      }}
                                                                        />
                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>color</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.secondTextFormFieldTextColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.secondTextFormFieldTextColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />

                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Border Color</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.secondTextFormBorderColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.secondTextFormBorderColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />

                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item md={12} container spacing={2}>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Background</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.secondTextFormFieldBackgroundColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.secondTextFormFieldBackgroundColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>

                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Shadow</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.secondTextFormShadowColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.secondTextFormShadowColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>

                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Focus Border</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.secondTextFormFocusBorderColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.secondTextFormFocusBorderColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Focus Shadow</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.secondTextFormFocusShadowColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.secondTextFormFocusShadowColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                </Grid>

                                                            </>}
                                                        </Grid>
                                                        <Grid container direction="row" spacing={1}>
                                                            <Grid item md={12}>
                                                                <FormControlLabel
                                                                    value="start"
                                                                    control={
                                                                        <Checkbox color="primary"
                                                                                  checked={true}
                                                                                  disabled
                                                                        />}
                                                                    label="Field 3"
                                                                    labelPlacement="start"
                                                                />
                                                            </Grid>
                                                            <Grid item lg={6} md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Hint Text</Form.Label>
                                                                    <Form.Control name="thirdTextFormFieldHint"
                                                                                  type="text"
                                                                                  defaultValue={popup.thirdTextFormFieldHint}
                                                                                  onChange={(e) => {
                                                                                      let popup1 = popup;
                                                                                      if (popup1 !== null) {
                                                                                          popup1.thirdTextFormFieldHint = e.target.value;
                                                                                          setPopup(popup1);
                                                                                      }
                                                                                  }}
                                                                    />
                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item lg={6} md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Font-size</Form.Label>
                                                                    <Form.Control name="thirdTextFormFieldTextSize"
                                                                                  type="number"
                                                                                  min={1}
                                                                                  defaultValue={popup.thirdTextFormFieldTextSize}
                                                                                  onChange={(e) => {
                                                                                      let popup1 = popup;
                                                                                      if (popup1 !== null) {
                                                                                          popup1.thirdTextFormFieldTextSize = e.target.value;
                                                                                          setPopup(popup1);
                                                                                      }
                                                                                  }}
                                                                    />
                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item lg={6} md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>color</Form.Label>
                                                                    <ColorSketchPicker
                                                                        defaultValue={popup.thirdTextFormFieldTextColor}
                                                                        onChange={(color => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                popup1.thirdTextFormFieldTextColor = color;
                                                                                setPopup(popup1);
                                                                            }
                                                                        })}
                                                                    />

                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item lg={6} md={6}>
                                                                <Form.Group>
                                                                    <Form.Label>Border Color</Form.Label>
                                                                    <ColorSketchPicker
                                                                        defaultValue={popup.thirdTextFormBorderColor}
                                                                        onChange={(color => {
                                                                            let popup1 = popup;
                                                                            if (popup1 !== null) {
                                                                                popup1.thirdTextFormBorderColor = color;
                                                                                setPopup(popup1);
                                                                            }
                                                                        })}
                                                                    />
                                                                </Form.Group>
                                                            </Grid>
                                                            <Grid item md={12} container spacing={2}>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Background</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.thirdTextFormFieldBackgroundColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.thirdTextFormFieldBackgroundColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />

                                                                    </Form.Group>
                                                                </Grid>

                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Shadow</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.thirdTextFormShadowColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.thirdTextFormShadowColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />
                                                                    </Form.Group>
                                                                </Grid>

                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Focus Border</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.thirdTextFormFocusBorderColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.thirdTextFormFocusBorderColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />
                                                                    </Form.Group>
                                                                </Grid>
                                                                <Grid item lg={6} md={6}>
                                                                    <Form.Group>
                                                                        <Form.Label>Focus Shadow</Form.Label>
                                                                        <ColorSketchPicker
                                                                            defaultValue={popup.thirdTextFormFocusShadowColor}
                                                                            onChange={(color => {
                                                                                let popup1 = popup;
                                                                                if (popup1 !== null) {
                                                                                    popup1.thirdTextFormFocusShadowColor = color;
                                                                                    setPopup(popup1);
                                                                                }
                                                                            })}
                                                                        />
                                                                    </Form.Group>
                                                                </Grid>
                                                            </Grid>


                                                        </Grid>


                                                    </Grid> :
                                                    selectedMenu === "button" ?
                                                        <Grid item md={12} key={'button'}>
                                                            <Grid container direction="row" spacing={1}>
                                                                <Grid item md={12}>
                                                                    <FormControlLabel
                                                                        value="start"
                                                                        control={
                                                                            <Checkbox color="primary"
                                                                                      checked={true}
                                                                                      disabled
                                                                            />}
                                                                        label="Positive Button"
                                                                        labelPlacement="start"
                                                                    />
                                                                </Grid>
                                                                {!popup.hidePositiveButton &&
                                                                <>
                                                                    <Grid item md={12}>
                                                                        <Form.Group>
                                                                            <Form.Label>Text</Form.Label>
                                                                            <Form.Control name="button_text" type="text"
                                                                                          defaultValue={popup.PositiveButtonText}
                                                                                          onChange={(e) => {
                                                                                              let popup1 = popup;
                                                                                              if (popup1 !== null) {
                                                                                                  popup1.PositiveButtonText = e.target.value;
                                                                                                  setPopup(popup1);
                                                                                              }
                                                                                          }}/>
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    {
                                                                        !popup.hasForm && <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Button Action
                                                                                    Url</Form.Label>
                                                                                <Form.Control name="button_link"
                                                                                              type="text"
                                                                                              defaultValue={popup.positiveButtonLink}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.positiveButtonLink = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}/>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                    }
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Font</Form.Label>
                                                                            <Form.Control name="button_font_size"
                                                                                          type="number"
                                                                                          defaultValue={popup.PositiveButtonTextSize}
                                                                                          onChange={(e) => {
                                                                                              let popup1 = popup;
                                                                                              if (popup1 !== null) {
                                                                                                  popup1.PositiveButtonTextSize = e.target.value;
                                                                                                  setPopup(popup1);
                                                                                              }
                                                                                          }}/>
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Radius</Form.Label>
                                                                            <Form.Control name="button_radius"
                                                                                          type="number"
                                                                                          defaultValue={popup.PositiveButtonRadius}
                                                                                          onChange={(e) => {
                                                                                              let popup1 = popup;
                                                                                              if (popup1 !== null) {
                                                                                                  popup1.PositiveButtonRadius = e.target.value;
                                                                                                  setPopup(popup1);
                                                                                              }
                                                                                          }}/>
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Text color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonTextColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonTextColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item md={12}>
                                                                        <Grid container spacing={2}>
                                                                            <Grid item xs={6}>
                                                                                <Grid container>
                                                                                    <Grid item xs={12}>
                                                                                        <FormControlLabel
                                                                                            value="start"
                                                                                            control={
                                                                                                <Checkbox
                                                                                                    color="primary"
                                                                                                    checked={popup.PositiveButtonWidth === "auto"}
                                                                                                    onChange={(e) => {
                                                                                                        let popup1 = popup;
                                                                                                        if (popup1 !== null) {
                                                                                                            popup1.PositiveButtonWidth = e.target.checked ? "auto" : "100";
                                                                                                            setPopup(popup1);
                                                                                                        }
                                                                                                    }}/>}
                                                                                            label="Width Auto"
                                                                                            labelPlacement="start"
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid item xs={12}>

                                                                                        {
                                                                                            popup.PositiveButtonWidth !== "auto" &&
                                                                                            <Form.Group>
                                                                                                <Form.Label>Percentage</Form.Label>
                                                                                                <Slider

                                                                                                    style={{width: "90%"}}
                                                                                                    valueLabelDisplay="auto"
                                                                                                    value={parseInt(popup.PositiveButtonWidth)}
                                                                                                    onChange={((event, value) => {
                                                                                                        let popup1 = popup;
                                                                                                        if (popup1 !== null) {
                                                                                                            if (typeof value === "number") {
                                                                                                                popup1.PositiveButtonWidth = value.toString();
                                                                                                                setPopup(popup1);
                                                                                                            }

                                                                                                        }
                                                                                                    })}
                                                                                                    aria-labelledby="input-slider"
                                                                                                />


                                                                                            </Form.Group>
                                                                                        }
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>
                                                                            <Grid item xs={6}>
                                                                                <Grid container>
                                                                                    <Grid item xs={12}>
                                                                                        <FormControlLabel
                                                                                            value="start"
                                                                                            control={
                                                                                                <Checkbox
                                                                                                    color="primary"
                                                                                                    checked={popup.PositiveButtonHeight === "auto"}
                                                                                                    onChange={(e) => {
                                                                                                        let popup1 = popup;
                                                                                                        if (popup1 !== null) {
                                                                                                            popup1.PositiveButtonHeight = e.target.checked ? "auto" : "100";
                                                                                                            setPopup(popup1);
                                                                                                        }
                                                                                                    }}/>}
                                                                                            label="Height Auto"
                                                                                            labelPlacement="start"
                                                                                        />
                                                                                    </Grid>
                                                                                    <Grid item xs={12}>
                                                                                        {
                                                                                            popup.PositiveButtonHeight !== "auto" &&
                                                                                            <Form.Group>
                                                                                                <Form.Label>Percentage</Form.Label>
                                                                                                <Slider

                                                                                                    style={{width: "90%"}}
                                                                                                    valueLabelDisplay="auto"
                                                                                                    value={parseInt(popup.PositiveButtonHeight)}
                                                                                                    onChange={((event, value) => {
                                                                                                        let popup1 = popup;
                                                                                                        if (popup1 !== null) {
                                                                                                            if (typeof value === "number") {
                                                                                                                popup1.PositiveButtonHeight = value.toString();
                                                                                                                setPopup(popup1);
                                                                                                            }
                                                                                                        }
                                                                                                    })}
                                                                                                    aria-labelledby="input-slider"
                                                                                                />
                                                                                            </Form.Group>
                                                                                        }
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Grid>

                                                                            <Grid item xs={12}>
                                                                                <Form.Group>
                                                                                    <Form.Label>Button
                                                                                        Alignment</Form.Label><br/>
                                                                                    <ButtonGroup size="medium"
                                                                                                 aria-label="small">
                                                                                        <IconButton onClick={() => {
                                                                                            let popup1 = popup;
                                                                                            if (popup1 !== null) {
                                                                                                popup1.PositiveButtonAlignment = "flex-start";
                                                                                                setPopup(popup1);
                                                                                            }
                                                                                        }}>
                                                                                            <FormatAlignLeftIcon
                                                                                                color={popup.PositiveButtonAlignment === "flex-start" ? "primary" : "disabled"}/>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            let popup1 = popup;
                                                                                            if (popup1 !== null) {
                                                                                                popup1.PositiveButtonAlignment = "center";
                                                                                                setPopup(popup1);
                                                                                            }
                                                                                        }}>
                                                                                            <FormatAlignCenterIcon
                                                                                                color={popup.PositiveButtonAlignment === "center" ? "primary" : "disabled"}/>
                                                                                        </IconButton>
                                                                                        <IconButton onClick={() => {
                                                                                            let popup1 = popup;
                                                                                            if (popup1 !== null) {
                                                                                                popup1.PositiveButtonAlignment = "flex-end";
                                                                                                setPopup(popup1);
                                                                                            }
                                                                                        }}>
                                                                                            <FormatAlignRightIcon
                                                                                                color={popup.PositiveButtonAlignment === "flex-end" ? "primary" : "disabled"}/>
                                                                                        </IconButton>
                                                                                    </ButtonGroup>
                                                                                </Form.Group>
                                                                            </Grid>
                                                                        </Grid>

                                                                    </Grid>
                                                                    <Grid item xs={12}>
                                                                        <Form.Group>
                                                                            <Form.Label>Text Alignment</Form.Label><br/>
                                                                            <ButtonGroup size="medium"
                                                                                         aria-label="small">
                                                                                <IconButton onClick={() => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonTextAlignment = "left";
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}>
                                                                                    <FormatAlignLeftIcon
                                                                                        color={popup.PositiveButtonTextAlignment === "left" ? "primary" : "disabled"}/>
                                                                                </IconButton>
                                                                                <IconButton onClick={() => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonTextAlignment = "center";
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}>
                                                                                    <FormatAlignCenterIcon
                                                                                        color={popup.PositiveButtonTextAlignment === "center" ? "primary" : "disabled"}/>
                                                                                </IconButton>
                                                                                <IconButton onClick={() => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonTextAlignment = "right";
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                }}>
                                                                                    <FormatAlignRightIcon
                                                                                        color={popup.PositiveButtonTextAlignment === "right" ? "primary" : "disabled"}/>
                                                                                </IconButton>
                                                                            </ButtonGroup>
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Background color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonBackgroundColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonBackgroundColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Border Color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonBorderColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonBorderColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />

                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Shadow Color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonShadowColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonShadowColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>

                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Hover Background
                                                                                color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonHoverBackgroundColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonHoverBackgroundColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>

                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Hover Text color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonHoverTextColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonHoverTextColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />

                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Hover Border color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonHoverBorderColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonHoverBorderColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />

                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Focus Border Color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonFocusBorderColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonFocusBorderColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                    <Grid item lg={6} md={6}>
                                                                        <Form.Group>
                                                                            <Form.Label>Focus Shadow Color</Form.Label>
                                                                            <ColorSketchPicker
                                                                                defaultValue={popup.PositiveButtonFocusShadowColor}
                                                                                onChange={(color => {
                                                                                    let popup1 = popup;
                                                                                    if (popup1 !== null) {
                                                                                        popup1.PositiveButtonFocusShadowColor = color;
                                                                                        setPopup(popup1);
                                                                                    }
                                                                                })}
                                                                            />
                                                                        </Form.Group>
                                                                    </Grid>
                                                                </>
                                                                }
                                                            </Grid>
                                                            {
                                                                popup.hasNegativeButtonOption &&
                                                                <Grid container direction="row" spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <FormControlLabel
                                                                            value="start"
                                                                            control={
                                                                                <Checkbox color="primary"
                                                                                          checked={!popup.hideNegativeButton}
                                                                                          onChange={(e) => {
                                                                                              let popup1 = popup;
                                                                                              if (popup1 !== null) {
                                                                                                  popup1.hideNegativeButton = !e.target.checked;
                                                                                                  setPopup(popup1);
                                                                                              }
                                                                                          }}/>}
                                                                            label="Negative Button"
                                                                            labelPlacement="start"
                                                                        />
                                                                    </Grid>
                                                                    {!popup.hideNegativeButton &&
                                                                    <>
                                                                        <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Text</Form.Label>
                                                                                <Form.Control name="button_text"
                                                                                              type="text"
                                                                                              defaultValue={popup.NegativeButtonText}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.NegativeButtonText = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}/>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Font</Form.Label>
                                                                                <Form.Control name="button_font_size"
                                                                                              type="number"
                                                                                              defaultValue={popup.NegativeButtonTextSize}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.NegativeButtonTextSize = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}/>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Radius</Form.Label>
                                                                                <Form.Control name="button_radius"
                                                                                              type="number"
                                                                                              defaultValue={popup.NegativeButtonRadius}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.NegativeButtonRadius = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}/>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Text color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonTextColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonTextColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>


                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Border Color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonBorderColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonBorderColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />

                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Shadow Color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonShadowColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonShadowColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>

                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Background
                                                                                    color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonBackgroundColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonBackgroundColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>

                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Hover Background
                                                                                    color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonHoverBackgroundColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonHoverBackgroundColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>

                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Hover Text
                                                                                    color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonHoverTextColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonHoverTextColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />

                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Hover Border
                                                                                    color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonHoverBorderColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonHoverBorderColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />

                                                                            </Form.Group>
                                                                        </Grid>

                                                                        <Grid item md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Focus Border
                                                                                    Color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonFocusBorderColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonFocusBorderColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />

                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Focus Shadow
                                                                                    Color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.NegativeButtonFocusShadowColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.NegativeButtonFocusShadowColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>
                                                                    </>
                                                                    }
                                                                </Grid>
                                                            }

                                                        </Grid> :
                                                        selectedMenu === "text" ?
                                                            <Grid item md={12} key={'text'}>
                                                                <Grid container direction="row" spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <FormControlLabel
                                                                            value="start"

                                                                            control={
                                                                                <Checkbox color="primary"
                                                                                          checked={!popup.hideTitle}
                                                                                          onChange={(e) => {
                                                                                              let popup1 = popup;
                                                                                              if (popup1 !== null) {
                                                                                                  popup1.hideTitle = !e.target.checked;
                                                                                                  setPopup(popup1);
                                                                                              }
                                                                                          }}/>}
                                                                            label="Heading"
                                                                            labelPlacement="start"
                                                                        />
                                                                    </Grid>
                                                                    {!popup.hideTitle && <>
                                                                        <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Header text</Form.Label>
                                                                                <Form.Control name="header_text"
                                                                                              type="text"
                                                                                              defaultValue={popup.title}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.title = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Font</Form.Label>
                                                                                <Form.Control name="header_font"
                                                                                              type="number"
                                                                                              defaultValue={popup.titleTextSize}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.titleTextSize = e.target.value;

                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.titleTextColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.titleTextColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />

                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Alignment</Form.Label><br/>
                                                                                <ButtonGroup size="medium"
                                                                                             aria-label="small">

                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.titleAlign = "left";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignLeftIcon
                                                                                            color={popup.titleAlign === "left" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.titleAlign = "center";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignCenterIcon
                                                                                            color={popup.titleAlign === "center" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.titleAlign = "right";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignRightIcon
                                                                                            color={popup.titleAlign === "right" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                </ButtonGroup>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                    </>}
                                                                </Grid>
                                                                <Grid container direction="row" spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <FormControlLabel
                                                                            value="start"
                                                                            control={
                                                                                <Checkbox color="primary"
                                                                                          checked={!popup.hideBody}
                                                                                          onChange={(e) => {
                                                                                              let popup1 = popup;
                                                                                              if (popup1 !== null) {
                                                                                                  popup1.hideBody = !e.target.checked;
                                                                                                  setPopup(popup1);
                                                                                              }
                                                                                          }}/>}
                                                                            label="Sub Heading"
                                                                            labelPlacement="start"
                                                                        />
                                                                    </Grid>
                                                                    {!popup.hideBody && <>
                                                                        <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Text</Form.Label>
                                                                                <Form.Control name="sub_title_text"
                                                                                              type="text"
                                                                                              defaultValue={popup.body}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.body = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Font</Form.Label>
                                                                                <Form.Control name="sub_title_font"
                                                                                              type="number"
                                                                                              defaultValue={popup.bodyTextSize}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.bodyTextSize = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.bodyTextColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.bodyTextColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />

                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Alignment</Form.Label><br/>
                                                                                <ButtonGroup size="medium"
                                                                                             aria-label="small">

                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.bodyAlign = "left";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignLeftIcon
                                                                                            color={popup.bodyAlign === "left" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.bodyAlign = "center";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignCenterIcon
                                                                                            color={popup.bodyAlign === "center" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.bodyAlign = "right";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignRightIcon
                                                                                            color={popup.bodyAlign === "right" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                </ButtonGroup>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                    </>}

                                                                </Grid>
                                                                <Grid container direction="row" spacing={1}>
                                                                    <Grid item md={12}>
                                                                        <FormControlLabel
                                                                            value="start"
                                                                            control={
                                                                                <Checkbox color="primary"
                                                                                          checked={!popup.hideFooter}
                                                                                          onChange={(e) => {
                                                                                              let popup1 = popup;
                                                                                              if (popup1 !== null) {
                                                                                                  popup1.hideFooter = !e.target.checked;
                                                                                                  setPopup(popup1);
                                                                                              }
                                                                                          }}/>}
                                                                            label="Footer"
                                                                            labelPlacement="start"
                                                                        />
                                                                    </Grid>
                                                                    {!popup.hideFooter && <>
                                                                        <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Text</Form.Label>
                                                                                <Form.Control name="footer_text"
                                                                                              type="text"
                                                                                              defaultValue={popup.footer}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.footer = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}/>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Font</Form.Label>
                                                                                <Form.Control name="footer_font"
                                                                                              type="number"
                                                                                              defaultValue={popup.footerTextSize}
                                                                                              onChange={(e) => {
                                                                                                  let popup1 = popup;
                                                                                                  if (popup1 !== null) {
                                                                                                      popup1.footerTextSize = e.target.value;
                                                                                                      setPopup(popup1);
                                                                                                  }
                                                                                              }}/>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item lg={6} md={6}>
                                                                            <Form.Group>
                                                                                <Form.Label>Color</Form.Label>
                                                                                <ColorSketchPicker
                                                                                    defaultValue={popup.footerTextColor}
                                                                                    onChange={(color => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.footerTextColor = color;
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    })}
                                                                                />
                                                                            </Form.Group>
                                                                        </Grid>
                                                                        <Grid item md={12}>
                                                                            <Form.Group>
                                                                                <Form.Label>Alignment</Form.Label><br/>
                                                                                <ButtonGroup size="medium"
                                                                                             aria-label="small">

                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.footerAlign = "left";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignLeftIcon
                                                                                            color={popup.footerAlign === "left" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.footerAlign = "center";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignCenterIcon
                                                                                            color={popup.footerAlign === "center" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                    <IconButton onClick={() => {
                                                                                        let popup1 = popup;
                                                                                        if (popup1 !== null) {
                                                                                            popup1.footerAlign = "right";
                                                                                            setPopup(popup1);
                                                                                        }
                                                                                    }}>
                                                                                        <FormatAlignRightIcon
                                                                                            color={popup.footerAlign === "right" ? "primary" : "disabled"}/>
                                                                                    </IconButton>
                                                                                </ButtonGroup>
                                                                            </Form.Group>
                                                                        </Grid>
                                                                    </>}

                                                                </Grid>

                                                                <Grid container direction="row" spacing={1}>
                                                                   <Grid item md={12}>
                                                                       <UpgradePlanRequired
                                                                           feature_name="hide_branding"
                                                                           plan_required_text="Custom Branding is not available in active plan. You need to upgrade to higher package.">
                                                                           <FormControlLabel
                                                                               value="start"
                                                                               control={
                                                                                   <Checkbox color="primary"
                                                                                             checked={popup.hideBranding}
                                                                                             onChange={(e) => {
                                                                                                 let popup1 = popup;
                                                                                                 if (popup1 !== null) {
                                                                                                     popup1.hideBranding = e.target.checked;
                                                                                                     setPopup({...popup1});
                                                                                                 }
                                                                                             }}/>}
                                                                               label={<>
                                                                                   <Typography>
                                                                                       Hide Emailwish branding
                                                                                   </Typography>

                                                                                </>}
                                                                                labelPlacement="start"
                                                                            />
                                                                        </UpgradePlanRequired>

                                                                    </Grid>

                                                                </Grid>


                                                            </Grid> : ""}


                                    </Grid>
                                }
                            </Scrollbar>
                        </AppCardBody>
                    </AppCard>
                </Grid>
                <Grid item md={8} container>
                    <Grid item xs={12}>
                        <AppCard>
                            <AppCardBody>
                                <form style={{width: "100%"}}
                                      id="popup_form"
                                      onSubmit={(e) => {
                                          e.preventDefault();
                                          onSavePopup();
                                      }}
                                >
                                    <div className="d-flex justify-content-end">
                                        <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                                                   helpLink={"https://www.youtube.com/embed/j3LHGPk9lDQ"}/>

                                        <a className="app-link" onClick={() => {
                                            setShowHelpVideo(true)
                                        }
                                        }>Learn How?</a>
                                    </div>

                                    <Grid item md={12} container direction="row" spacing={1}>
                                        <Grid item lg={3} md={6} data-tut="reactour__popup_title">
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control name="popup_title" type="text"
                                                          placeholder={"Enter Popup Title"}
                                                          required
                                                          defaultValue={popup.popup_title}
                                                          onChange={(e) => {
                                                              let popup1 = popup;
                                                              if (popup1 !== null) {
                                                                  popup1.popup_title = e.target.value;
                                                                  setPopup(popup1);
                                                              }
                                                          }}


                                            />
                                        </Grid>
                                        <Grid item md={2} data-tut="reactour__popup_size_width">
                                            <Form.Label>Width</Form.Label>
                                            <Form.Control name="size_width" type="number"
                                                          placeholder={"in px"}
                                                          value={popup.popup_width}
                                                          onChange={(e) => {
                                                              let popup1 = {...popup};
                                                              if (popup1) {
                                                                  if (popup1.aspect_ratio) {
                                                                      if (popup.popup_width) {
                                                                          if (parseFloat(popup.popup_width) < parseFloat(e.target.value)) {
                                                                              popup1.popup_height = parseInt(Math.ceil(parseFloat(popup.popup_height) * parseFloat(e.target.value) / parseFloat(popup.popup_width)).toString()).toString();

                                                                          } else {
                                                                              popup1.popup_height = parseInt(Math.floor(parseFloat(popup.popup_height) * parseFloat(e.target.value) / parseFloat(popup.popup_width)).toString()).toString();
                                                                          }
                                                                      }
                                                                      popup1.popup_width = e.target.value;
                                                                  } else {
                                                                      popup1.popup_width = e.target.value;
                                                                  }
                                                                  setPopup(popup1);
                                                              }
                                                          }}


                                            />
                                        </Grid>
                                        <Grid item md={2} data-tut="reactour__popup_size_height">
                                            <Form.Label>Height</Form.Label>
                                            <Form.Control name="size_height" type="number"
                                                          placeholder={"in px"}
                                                          value={popup.popup_height}
                                                          onChange={(e) => {
                                                              let popup1 = {...popup};

                                                              if (popup1) {
                                                                  if (popup1.aspect_ratio) {
                                                                      if (popup.popup_height) {
                                                                          if (parseFloat(popup.popup_height) < parseFloat(e.target.value)) {
                                                                              popup1.popup_width = parseInt(Math.floor(parseFloat(popup.popup_width) * parseFloat(e.target.value) / parseFloat(popup.popup_height)).toString()).toString();
                                                                          } else {
                                                                              popup1.popup_width = parseInt(Math.ceil(parseFloat(popup.popup_width) * parseFloat(e.target.value) / parseFloat(popup.popup_height)).toString()).toString();
                                                                          }
                                                                      }
                                                                      popup1.popup_height = e.target.value;
                                                                  } else {
                                                                      popup1.popup_height = e.target.value;
                                                                  }
                                                                  setPopup(popup1);
                                                              }

                                                          }}/>
                                        </Grid>
                                        <Grid item md={2} data-tut="reactour__popup_popup_position">
                                            <Form.Group className="m-0">
                                                <Form.Label>Position</Form.Label>
                                                <CustomDropDown
                                                    value={popup.popup_position}
                                                    onChange={(v: any) => {
                                                        let popup1 = popup;
                                                        if (popup1 !== null) {
                                                            popup1.popup_position = v;
                                                            setPopup(popup1);
                                                        }
                                                    }}
                                                    options={popup_positions.map((q) => {
                                                        return {
                                                            value: q,
                                                            label: q
                                                        }
                                                    })}

                                                />
                                            </Form.Group>
                                        </Grid>
                                        <Grid item lg={3} data-tut="reactour__popup_aspect_ratio" md={6} container
                                              justifyContent="center" alignItems="center">
                                            <FormControlLabel
                                                style={{marginTop: "25px"}}
                                                label={"Aspect Ratio"}
                                                control={<Checkbox checked={popup.aspect_ratio} onChange={(e) => {
                                                    let popup1 = popup;
                                                    if (popup1 !== null) {
                                                        popup1.aspect_ratio = e.target.checked;
                                                        setPopup({...popup1});
                                                    }
                                                }} name="aspect_ratio"/>}
                                            />
                                        </Grid>

                                    </Grid>
                                </form>
                            </AppCardBody>
                        </AppCard>
                    </Grid>
                    <Grid item container md={12} justifyContent={"center"} alignItems={"flex-start"}>
                        <div id={"popup_builder"}>
                            <ThemeProvider theme={theme}>
                                <WindowSize>
                                    {(size) => {
                                        return <div data-tut="reactour__popup_builder_view">
                                            <PopupContext.Provider value={{isMobile: size.width < 800}}>
                                                <PopupPreview {...popup}/>
                                            </PopupContext.Provider></div>
                                    }}</WindowSize>
                            </ThemeProvider>
                        </div>

                    </Grid>
                </Grid>
            </Grid>
            <ThemeProvider theme={theme}>
                {
                    showModal && <div className="popup-overlay"
                                      style={{
                                          justifyContent:
                                              (
                                                  popup.popup_position === "center" ||
                                                  popup.popup_position === "top-middle" ||
                                                  popup.popup_position === "bottom-middle"
                                              ) ? "center" :
                                                  (
                                                      popup.popup_position === "top-left" ||
                                                      popup.popup_position === "middle-left" ||
                                                      popup.popup_position === "bottom-left"
                                                  ) ? "flex-start" : (
                                                      popup.popup_position === "top-right" ||
                                                      popup.popup_position === "middle-right" ||
                                                      popup.popup_position === "bottom-right"
                                                  ) ? "flex-end" : "center",
                                          alignItems: (
                                              popup.popup_position === "top-left" ||
                                              popup.popup_position === "top-middle" ||
                                              popup.popup_position === "top-right"
                                          ) ? "flex-start" :
                                              (
                                                  popup.popup_position === "middle-left" ||
                                                  popup.popup_position === "center" ||
                                                  popup.popup_position === "middle-right"
                                              ) ? "center" : (
                                                  popup.popup_position === "bottom-right" ||
                                                  popup.popup_position === "bottom-middle" ||
                                                  popup.popup_position === "bottom-left"
                                              ) ? "flex-end" : "center"
                                      }}

                    >
                        <div className="popup-wrapper">
                            <WindowSize>
                                {(size) => {
                                    return <div><PopupContext.Provider value={{isMobile: size.width < 800}}>
                                        <PopupPreview {...popup}/>
                                    </PopupContext.Provider></div>
                                }}
                            </WindowSize>


                            <button className="popup-close-btn" onClick={() => {
                                let popup1 = popup;
                                if (popup1 !== null) {
                                    popup1.creationMode = true;
                                    setPopup(popup1);
                                }
                                setShowModel(false)
                            }}> ✕
                            </button>
                        </div>
                    </div>
                }
            </ThemeProvider>
        </>;
    }


    function renderErrorMessage() {
        if (!error) return null;
        return <Alert variant="danger">{error}</Alert>
    }

    if (loading) {
        return <AppLoader/>
    }
    return <div className="mt-2">
        <div>
            {
                renderErrorMessage()
            }
            {renderPopupCreation()}
        </div>
    </div>;
}

export default PopupCreate;
