import React, {useContext, useEffect, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import {Button, CircularProgress, Grid, Typography} from "@material-ui/core";

import OnBoardingApis from "../../../apis/onboarding.apis";
import background_image from "../../../assets/images/signup_background.svg";
import shapes_and_masked_images from "../../../assets/images/shapes_and_masked_images.png";
import {Formik} from "formik";
import * as yup from "yup";
import {NotificationContext} from "../../../App";
import {useHistory, useParams} from "react-router-dom";
import useIsMounted from "ismounted";
import {HandleErrors} from "../../../components/helper/form.helper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import rectangle_background from "../../../assets/images/Rectangle.png";
import {animated, Transition} from "react-spring/renderprops";
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import {Alert} from "@material-ui/lab";


export const ForgotPageStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        registerArea: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            overflowY: "scroll",
            overflowX: "scroll",
            padding: theme.spacing(2)
        },

        registerCard: {
            height: "600px",
            width: "900px",
            backgroundColor: "#fff",
            boxShadow: "var(--box-shadow-large)",
            border: 0,
            borderRadius: "10px",
            display: "flex",
            [theme.breakpoints.down('sm')]: {
                width: "98vw",
            },
        },
        registerCardSideBar: {
            flex: 1
        },
        loginWelcomeText: {
            fontWeight: "normal",
            fontSize: "30px",
            textAlign: "left"

        },
        registerCardMainContent: {
            flex: 2,
        },
        registerCardWrapper: {
            paddingInline: "50px",
            paddingTop: "100px",
            [theme.breakpoints.down('xs')]: {
                paddingInline: "10px",
                paddingTop: "30px",
            }
        },
        registerCardSideBarItem: {
            borderTopRightRadius: "10px",
            borderBottomRightRadius: "10px",
            height: "600px",
            position: "relative"
        },
        registerCardSideBarItemTypo: {
            fontSize: "18px",
            color: "white",
            width: "100%",
            fontWeight: 200,
            textAlign: "center",
            padding: theme.spacing(1)
        },
        loginFormGroup: {
            "& input": {
                width: "220px"
            }
        },
        gettingStartedButton: {
            backgroundColor: "black",
            color: "white",
            makeStyles: "70px"
        }
    },), {index: 1},
);

function ResetPassword() {
    useEffect(() => {
        document.title = "Reset Password | Emailwish";
    }, []);
    const classes = ForgotPageStyles();
    const [error, setError] = useState<string>("");
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);
    const formikRef = useRef<any>();
    const {token} = useParams<any>();
    const history = useHistory();

    useEffect(() => {
        document.body.classList.add("login_body");
        return () => {
            document.body.classList.remove("login_body");
            document.body.classList.add("site_body");
        };
    }, []);


    return <div className={classes.root}>
        <div className={classes.registerArea} style={{backgroundImage: `url(${background_image})`}}>
            <div className={classes.registerCard}>
                <div className={classes.registerCardMainContent}>
                    <Scrollbar style={{height: "600px"}}>
                        <div className={classes.registerCardWrapper}>
                            <Grid container justifyContent="center">
                                <Grid
                                    item
                                    xs={12}
                                    container
                                >
                                    <Grid item xs={12}>
                                        <div>
                                            <Typography className={classes.loginWelcomeText}>
                                                Set New Password
                                            </Typography>
                                        </div>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <Formik
                                            innerRef={formikRef}
                                            initialValues={{
                                                email: "",
                                                token: token,
                                                password: "",
                                                password_confirmation: "",
                                            }}
                                            onSubmit={(values: any, formikHelpers) => {
                                                formikHelpers.setSubmitting(true)
                                                setError("");
                                                new OnBoardingApis().reset_password(values)
                                                    .then((r) => {
                                                        if (isMounted.current) {
                                                            formikHelpers.setSubmitting(false)
                                                            if (OnBoardingApis.hasError(r, notificationContext)) {
                                                                if (!HandleErrors(r, formikHelpers)) {
                                                                    setError(r.message || "");
                                                                }
                                                            } else {
                                                                setTimeout(() => {
                                                                    window.location.href = "/dashboard"
                                                                }, 1000)
                                                            }
                                                        }
                                                    });
                                            }}
                                            validationSchema={yup.object({
                                                email: yup
                                                    .string()
                                                    .email("Please enter valid email address")
                                                    .required("Please enter your email address"),
                                                token: yup.string().required("Token is missing"),
                                                password: yup.string().required("Please enter new password").min(8, 'The password doesn\'t meet the criteria.'),
                                                password_confirmation: yup.string().required("Please confirm password")
                                                    .min(8, 'The password doesn\'t meet the criteria.').oneOf(
                                                        [yup.ref('password')],
                                                        'Password entered doesn\'t match',
                                                    ),
                                            })}
                                        >
                                            {({
                                                  handleSubmit,
                                                  handleChange,
                                                  values,
                                                  touched,
                                                  isSubmitting,

                                                  errors,
                                              }: any) => {
                                                return (
                                                    <Form onSubmit={handleSubmit}>


                                                        <Form.Group className={classes.loginFormGroup}>
                                                            <Form.Label>
                                                                <Typography variant={"subtitle1"}>
                                                                    Email
                                                                </Typography>
                                                            </Form.Label>
                                                            <Form.Control
                                                                placeholder="Please enter your email"
                                                                value={values.email}
                                                                name="email"
                                                                onChange={handleChange}
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.email &&
                                                                    errors &&
                                                                    !!errors.email
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.email}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group className={classes.loginFormGroup}>
                                                            <Form.Label>
                                                                <Typography variant={"subtitle1"}>
                                                                    Password
                                                                </Typography>
                                                            </Form.Label>
                                                            <Form.Control
                                                                placeholder="Please enter new password"
                                                                value={values.password}
                                                                name="password"
                                                                type="password"

                                                                autoComplete={"new-password"}
                                                                onChange={handleChange}
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.password &&
                                                                    errors &&
                                                                    !!errors.password
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.password}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>

                                                        <Form.Group className={classes.loginFormGroup}>
                                                            <Form.Label>
                                                                <Typography variant={"subtitle1"}>
                                                                    Confirm Password
                                                                </Typography>
                                                            </Form.Label>
                                                            <Form.Control
                                                                placeholder="Please re-confirm the password"
                                                                value={values.password_confirmation}
                                                                name="password_confirmation"

                                                                autoComplete={"new-password"}
                                                                type="password"
                                                                onChange={handleChange}
                                                                isInvalid={
                                                                    touched &&
                                                                    touched.password_confirmation &&
                                                                    errors &&
                                                                    !!errors.password_confirmation
                                                                }
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                {errors && errors.password_confirmation}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <Button
                                                            variant="contained"
                                                            type="submit"
                                                            color={"primary"}
                                                            disabled={isSubmitting}
                                                        >
                                                            {(isSubmitting) &&
                                                            <> <CircularProgress size={15}/>&nbsp;</>}
                                                            SUBMIT
                                                        </Button>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </Grid>
                                    {
                                        error && <Grid item>
                                            <Alert severity="error">{error}</Alert>
                                        </Grid>
                                    }
                                </Grid>
                            </Grid>
                        </div>
                    </Scrollbar>
                </div>
                <Hidden xsDown>
                    <div className={classes.registerCardSideBar}>
                        <Grid container className={classes.registerCardSideBarItem}
                              style={{backgroundImage: `url(${rectangle_background})`}} alignItems={"flex-end"}>
                            <Grid item xs={12}>
                                <Transition items={1}
                                            from={{opacity: 0, transform: 'translate3d(0px,40px,0)'}}
                                            enter={{opacity: 1, transform: 'translate3d(0px,0px,0)'}}
                                            leave={{opacity: 0, transform: 'translate3d(0px,0px,0)'}}
                                            config={{duration: 1400}}
                                >
                                    {page => (props =>
                                            <animated.div style={props}>
                                                <Typography className={classes.registerCardSideBarItemTypo}>
                                                    One App, One Price.
                                                </Typography>
                                            </animated.div>
                                    )}
                                </Transition>
                            </Grid>
                            <Grid item>
                                <img src={shapes_and_masked_images} alt={"login images"}/>
                            </Grid>
                        </Grid>
                    </div>
                </Hidden>
            </div>
        </div>
    </div>;

}

export default ResetPassword;
