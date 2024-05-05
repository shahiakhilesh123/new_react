import React, {useContext, useEffect, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import {Button, CircularProgress, Grid, Typography} from "@material-ui/core";

import OnBoardingApis from "../../../apis/onboarding.apis";
import background_image from "../../../assets/images/signup_background.svg";
import shapes_and_masked_images from "../../../assets/images/shapes_and_masked_images.png";
import {Formik} from "formik";
import * as yup from "yup";
import {NotificationContext} from "../../../App";
import {Link, useLocation, useParams} from "react-router-dom";
import qs from "qs";
import useIsMounted from "ismounted";
import {HandleErrors} from "../../../components/helper/form.helper";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import rectangle_background from "../../../assets/images/Rectangle.png";
import {animated, Transition} from "react-spring/renderprops";
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import Box from "@material-ui/core/Box";
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
            fontSize: "22px",
            textAlign: "left"

        },
        registerCardMainContent: {
            flex: 2,
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
                width: "180px"
            }
        },
        gettingStartedButton: {
            backgroundColor: "black",
            color: "white",
            makeStyles: "70px"
        }
    },), {index: 1},
);

function ForgotPassword() {
    useEffect(() => {
        document.title = "Forgot Password | Emailwish";
    }, []);
    const classes = ForgotPageStyles();
    const [error, setError] = useState<string>("");
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);
    const formikRef = useRef<any>();
    const location = useLocation();
    const [defaultEmail, setDefaultEmail] = useState<string>("");
    const {email} = useParams<any>();
    useEffect(() => {
        const params = qs.parse(location.search, {ignoreQueryPrefix: true});
        if (params && params.email && typeof params.email === "string") {
            setDefaultEmail(params.email)
        }
    }, [])
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
                        <div style={{paddingInline: "50px", paddingTop: "200px"}}>
                            <Grid container justifyContent="center">
                                <Grid
                                    item
                                    xs={12}
                                    container
                                >
                                    <Grid item xs={12}>
                                        <div>
                                            <Typography className={classes.loginWelcomeText}>
                                                Forgot your password?
                                            </Typography>
                                        </div>

                                    </Grid>
                                    <Grid item xs={12}>
                                        <Formik
                                            key={defaultEmail}
                                            innerRef={formikRef}
                                            initialValues={{
                                                email: defaultEmail || "",
                                            }}
                                            onSubmit={(values: any, formikHelpers) => {
                                                formikHelpers.setSubmitting(true)
                                                setError("");
                                                new OnBoardingApis().forgot_password(values.email)
                                                    .then((r) => {
                                                        if (isMounted.current) {
                                                            formikHelpers.setSubmitting(false)
                                                            if (OnBoardingApis.hasError(r, notificationContext)) {
                                                                if (!HandleErrors(r, formikHelpers)) {
                                                                    setError(r.message || "");
                                                                }
                                                            } else {

                                                            }
                                                        }
                                                    });
                                            }}
                                            validationSchema={yup.object({
                                                email: yup
                                                    .string()
                                                    .email("Please enter valid email address")
                                                    .required("Please enter your email address"),
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
                                                        <Form.Label>
                                                            <Typography variant={"subtitle1"}>
                                                                Enter your email address
                                                            </Typography>
                                                        </Form.Label>
                                                        <Box display={"flex"}>
                                                            <div>
                                                                <Form.Group className={classes.loginFormGroup}>
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
                                                            </div>
                                                            <Box paddingLeft={1}>
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
                                                            </Box>
                                                        </Box>
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
                                    <Grid item>
                                        <Grid container spacing={1}>
                                            <Grid item>
                                                <Typography>
                                                    Already have an account?
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Link to="/login">
                                                    <Typography>
                                                        Login Now!
                                                    </Typography>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                    </Grid>
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

export default ForgotPassword;
