import React, {Dispatch, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Col, Form, Row, Spinner} from "react-bootstrap";
import UserAPIs, {iProfileUpdateParams,} from "../../../apis/user.apis";
import {iTimezone,} from "../../../types/internal";
import * as yup from "yup";
import {Formik} from "formik";
import {HandleErrors} from "../../../components/helper/form.helper";
import {iStoreAction} from "../../../redux/reducers";
import useIsMounted from "ismounted";
import {AppDispatchContext, AppStateContext, NotificationContext} from "../../../App";
import FormGroup from "../../../components/FormGroup/CustomFormGroup";
import CustomFormGroupSelect from "../../../components/FormGroup/CustomFormGroupSelect";
import {Button} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";
import {RegisterCompleteStyles} from "../../Login/Register/Register.Complete";
import HelpVideo from "../../../components/HelpVideo/HelpVideo";

function AccountProfile() {
    useEffect(() => {
        document.title = "Profile | Emailwish";
    }, []);
    const [error, setError] = useState<string | undefined>("");
    const [loading, setLoading] = useState(false);
    const [timeZones, setTimeZones] = useState<Array<iTimezone>>([]);
    const isMounted = useIsMounted();
    const [image, setImage] = useState({preview: "", raw: ""});
    const {loggedInUser} = useContext(AppStateContext);
    const image_path=loggedInUser && loggedInUser.customers && loggedInUser.customers.find(value => !!value.image)?.uid||"";
    const image_path_updated_at=loggedInUser && loggedInUser.customers && loggedInUser.customers.find(value => !!value.image)?.updated_at||"";
    const inputRef = useRef([]);
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    const classes = RegisterCompleteStyles();
    const notificationContext = useContext(NotificationContext);
    const history = useHistory();
    const {shop} = useContext(AppStateContext);
    const createNewSchema = yup.object({
        first_name: yup.string().required("Please enter first name"),
        last_name: yup.string().required("Please enter last name"),
        timezone: yup.string().required("Please enter timezone"),
        password: yup.string(),
        password_confirmation: yup.string(),
        image: yup.mixed(),
        email: yup
            .string()
            .email("Please enter valid email")
            .required("Please enter email"),
    });


    const fetchUser = useCallback(() => {
        setLoading(false);
        setError("");
        new UserAPIs()
            .fetch_user()
            .then((response) => {
                if (isMounted.current) {
                    if (UserAPIs.hasError(response, notificationContext) || !response.user) {
                        setLoading(false);
                        setError(UserAPIs.getError(response));
                    } else {
                        dispatch({type: "set_logged_in_user", loggedInUser: response.user});
                    }
                }
            });
    }, [isMounted]);

    const loadTimezones = useCallback(() => {
        new UserAPIs().getTimeZones().then((r) => {
            setTimeZones(r);
        });
    }, []);
    const handleChangeImage = (e: any) => {
        if (e.target.files.length) {
            setImage({
                preview: URL.createObjectURL(e.target.files[0]),
                raw: e.target.files[0]
            });
        }
    };

    const [showHelpVideo, setShowHelpVideo] = useState(false);
    useEffect(() => {
        loadTimezones();
    }, []);

    return (
        <AppCard>
            <AppCardBody className="p-3">
                <div className="mt-2">
                    <Formik
                        initialValues={{
                            first_name: (loggedInUser && loggedInUser.first_name) || "",
                            last_name: (loggedInUser && loggedInUser.last_name) || "",
                            email: (loggedInUser && loggedInUser.email) || "",
                            timezone: (loggedInUser && loggedInUser.timezone) || "",
                            password: "",
                            password_confirmation: "",
                            image: ""
                        }}
                        onSubmit={(values: iProfileUpdateParams, helpers) => {
                            setLoading(false);
                            setError("");
                            new UserAPIs().update_profile(values).then((response) => {
                                if (isMounted.current) {
                                    if (UserAPIs.hasError(response, notificationContext)) {

                                        if (!HandleErrors(response, helpers)) {
                                            setError(response.message);
                                        }
                                    } else {
                                        fetchUser();
                                    }

                                    helpers.setSubmitting(false);
                                }

                            });
                        }}
                        validationSchema={createNewSchema}
                    >
                        {({
                              handleSubmit,
                              handleChange,
                              values,
                              isSubmitting,
                              touched,
                              errors,
                              setFieldValue
                          }: any) => {
                            return <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col xl={4} lg={4} md={4} sm={12}>
                                        <HelpVideo show={showHelpVideo} setShow={setShowHelpVideo}
                                                   helpLink={"https://www.youtube.com/embed/qDUW9szk_YQ"}/>

                                        <div className="d-flex">
                                            <h5>
                                                Profile Photo
                                            </h5>
                                            <div className="p-1"/>
                                            <a className="app-link" onClick={() => {
                                                setShowHelpVideo(true)
                                            }}>Learn How?</a>

                                        </div>
                                        <div className="profile-photo">
                                            <div className="profile-photo__image">
                                                {
                                                    image && image.preview && <img src={image.preview} alt="profile"/>
                                                }
                                                {
                                                    (!image || !image.preview) && <img
                                                        src={image_path ?
                                                            new UserAPIs().getCustomerAvatarURL(image_path, image_path_updated_at) : ""}
                                                        alt="avatar"/>

                                                }

                                            </div>
                                            <div className="profile-photo__button">
                                                <Button color="secondary" variant="contained" type="button"
                                                        className="mt-1"
                                                        onClick={() => {

                                                            // @ts-ignore
                                                            inputRef.current[0].click()
                                                        }}>
                                                    Change
                                                    <input

                                                        // @ts-ignore
                                                        ref={el => inputRef.current[0] = el}
                                                        type="file"
                                                        id="upload-button"
                                                        style={{display: "none"}}
                                                        onChange={(e: any) => {
                                                            if (e.target.files.length) {
                                                                setImage({
                                                                    preview: URL.createObjectURL(e.target.files[0]),
                                                                    raw: e.target.files[0]
                                                                });
                                                                setFieldValue("image", e.target.files[0])
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                            </div>
                                        </div>

                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12}>
                                        <h5>
                                            Basic Information
                                        </h5>
                                        <FormGroup
                                            label="First Name"
                                            name="first_name"
                                            errors={errors}
                                            touched={touched}
                                            type="text"
                                            onChange={handleChange}
                                            values={values}
                                            formControlProps={{className: "text-field"}}
                                        />
                                        <FormGroup
                                            label="Last Name"
                                            name="last_name"
                                            errors={errors}
                                            touched={touched}
                                            type="text"
                                            onChange={handleChange}
                                            values={values}
                                            formControlProps={{className: "text-field"}}
                                        />
                                        <CustomFormGroupSelect
                                            onChange={handleChange}
                                            values={values}
                                            touched={touched}
                                            errors={errors}
                                            type="text"
                                            name="timezone"
                                            label="Timezone"
                                            formGroupProps={{}}
                                            options={timeZones && timeZones.map((value => {
                                                return {id: value.value, name: value.label}
                                            }))}
                                            disabled_option={"Select a timezone"}

                                        />
                                    </Col>
                                    <Col xl={4} lg={4} md={4} sm={12}>
                                        <h5>
                                            Account
                                        </h5>
                                        <FormGroup
                                            label="Email address"
                                            name="email"
                                            errors={errors}
                                            touched={touched}
                                            type="text"
                                            onChange={handleChange}
                                            values={values}
                                            formControlProps={{className: "text-field"}}
                                        />
                                        <FormGroup
                                            label="New Password"
                                            name="password"
                                            errors={errors}

                                            autoComplete={"new-password"}
                                            touched={touched}
                                            type="password"
                                            onChange={handleChange}
                                            values={values}
                                            formControlProps={{className: "text-field"}}
                                        />
                                        <FormGroup
                                            label="Confirm New Password"
                                            name="password_confirmation"
                                            errors={errors}
                                            autoComplete={"new-password"}
                                            touched={touched}
                                            type="password"
                                            onChange={handleChange}
                                            values={values}
                                            formControlProps={{className: "text-field"}}
                                        />
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            className="float-right positive-button"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting && <><Spinner animation="border" size="sm"/>&nbsp;</>}
                                            Save
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>;
                        }}
                    </Formik>
                </div>
            </AppCardBody>
        </AppCard>
    );
}

export default AccountProfile;
