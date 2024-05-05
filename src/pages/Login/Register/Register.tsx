import React, {Dispatch, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Form} from "react-bootstrap";
import {Button, CircularProgress, Grid, Typography} from "@material-ui/core";

import OnBoardingApis from "../../../apis/onboarding.apis";
import background_image from "../../../assets/images/signup_background.svg";
import shapes_and_masked_images from "../../../assets/images/shapes_and_masked_images.png";
import {Formik} from "formik";
import * as yup from "yup";
import {AppDispatchContext, AppStateContext, NotificationContext} from "../../../App";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import qs from "qs";
import useIsMounted from "ismounted";
import {HandleErrors} from "../../../components/helper/form.helper";
import {iStoreAction} from "../../../redux/reducers";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import Hidden from "@material-ui/core/Hidden";
import rectangle_background from "../../../assets/images/Rectangle.png";
import {animated, Transition} from "react-spring/renderprops";
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import Box from "@material-ui/core/Box";
import {ArrowForward} from "@material-ui/icons";
import Alert from "@material-ui/lab/Alert";
import UserAPIs from "../../../apis/user.apis";


export const RegisterPageStyles = makeStyles((theme: Theme) =>
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
        loginWelcomeText1: {
            fontWeight: "normal",
            fontSize: "24px",
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


function Register() {
    const [shopPlatform, setShopPlatform] = useState<string>("");
    useEffect(() => {
        document.title = "Register | Emailwish";
    }, []);
    const classes = RegisterPageStyles();
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    const [defaultURL, setDefaultUrl] = useState<string>("");
    const history = useHistory();
    const [loading, setLoading] = useState<boolean>(true);
    const params: any = useParams();
    const [error, setError] = useState<string | undefined>();
    const isMounted = useIsMounted();
    const notificationContext = useContext(NotificationContext);
    const formikRef = useRef<any>();
    const location = useLocation();


    useEffect(() => {
        const params = qs.parse(location.search, {ignoreQueryPrefix: true});
        if (params.af_id) {
            // @ts-ignore
            new OnBoardingApis().users_aff(params.af_id).then(res => {

            })
        }

    }, [])

    useEffect(() => {
        document.body.classList.add("login_body");
        return () => {
            document.body.classList.remove("login_body");
            document.body.classList.add("site_body");
        };
    }, []);


    const register = useCallback(() => {
        new OnBoardingApis().register_form(defaultURL,"shopify", "", "", "")
            .then((r) => {
                if (isMounted.current) {
                    if (OnBoardingApis.hasError(r, notificationContext) || (!r.redirectURL && !r.shop && !r.reactURL)) {
                        setLoading(false);
                        setError(r.message);
                    } else if (r.shop) {
                        dispatch({
                            type: "set_active_shop",
                            shop: r.shop
                        })
                        history.push({pathname: "/"});
                    } else if (r.redirectURL) {
                        window.location.href = r.redirectURL;
                    } else if (r.reactURL) {
                        history.replace(r.reactURL);
                    }
                }
            });
    }, [defaultURL, isMounted])

    useEffect(() => {
        const params = qs.parse(location.search, {ignoreQueryPrefix: true});
        if (params && params.shop && typeof params.shop === "string") {
            setDefaultUrl(params.shop)
            setLoading(true);
        } else {
            setLoading(false);
        }
    }, [])
    useEffect(() => {
        if (defaultURL) {
            register();
        }
    }, [defaultURL])

    const {loggedInUser} = useContext(AppStateContext);

    if (loading) {
        return null;
    }

    return <div className={classes.root}>
        <div className={classes.registerArea} style={{backgroundImage: `url(${background_image})`}}>
            <div className={classes.registerCard}>
                <div className={classes.registerCardMainContent}>
                    <Scrollbar style={{height: "600px"}}>
                        <div style={{paddingInline: "50px", position: "absolute", top:"50%", msTransform:"translate(0, -50%)", transform:"translate(0, -50%)"}}>
                            <Grid container justifyContent="center">
                                {
                                    loggedInUser && <Grid
                                        item
                                        xs={12}
                                        container
                                    >
                                        {
                                            error && <Grid item xs={12}>
                                                <div>
                                                    <Alert severity="error" color="error">
                                                        {error}
                                                    </Alert>
                                                </div>
                                            </Grid>
                                        }
                                        <Grid item xs={12}>
                                            <div>
                                                <Typography className={classes.loginWelcomeText1}>
                                                    Install Emailwish app from Shopify Marketplace.
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item className="mt-2">
                                            <a href="https://apps.shopify.com/emailmarketing_emailwish_abandonedcart_popup_chat_reviews"
                                            > <Button variant="contained" color="primary"
                                                      className="positive-button">
                                                Install Now <ArrowForward/>
                                            </Button>
                                            </a>
                                        </Grid>
                                        <Grid item>
                                            <Grid container spacing={1} className="mt-2">
                                                <Grid item>
                                                    <Typography>
                                                        Please remain logged in with Emailwish and we will add the new
                                                        shop
                                                        to
                                                        your account automatically.<br/>
                                                        Logged in as : {loggedInUser.email}<br/><br/>
                                                        <span>
                                                            Don't want to use this account? <a onClick={() => {
                                                            new UserAPIs().logout().then(() => {
                                                                if (isMounted.current) {
                                                                    dispatch({type: "logout"});
                                                                    history.replace("/login");
                                                                }
                                                            });
                                                        }} className="app-link">Logout now</a>
                                                        </span>
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={12} className="mt-4">
                                            <div>
                                                <Typography className={classes.loginWelcomeText1}>
                                                    Install Emailwish app For Woocommerce.
                                                </Typography>
                                            </div>
                                        </Grid>
                                        <Grid item className="mt-2">
                                            <a href="https://wordpress.org/plugins/emailwish/"
                                            > <Button variant="contained" color="primary"
                                                      className="positive-button">
                                                Download Now <ArrowForward/>
                                            </Button>
                                            </a>
                                        </Grid>
                                    </Grid>
                                }
                                {
                                    !loggedInUser && <Grid
                                        item
                                        xs={12}
                                        container
                                    >
                                        {
                                            error && <Grid item xs={12}>
                                                <div>
                                                    <Alert severity="error" color="error">
                                                        {error}
                                                    </Alert>
                                                </div>
                                            </Grid>
                                        }
                                        <Grid item xs={12}>

                                            <div>
                                                <Typography className={classes.loginWelcomeText}>
                                                    Join Emailwish now!
                                                </Typography>
                                            </div>

                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography>
                                                Smart and Automated email Campaigns is just a few step away.
                                            </Typography>
                                        </Grid>
                                    {
                                        <div className="row col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="platform">
                                                    <Typography variant={"subtitle1"}>
                                                        Please choose your shops platform.
                                                    </Typography>
                                                </label>
                                                <select onChange={(e) => {setShopPlatform(e.target.value)}} className="form-control" id="platform" aria-describedby="platfromHelp">
                                                    <option value="">--Choose--</option>
                                                    <option value="shopify">Shopify</option>
                                                    <option value="woocommerce">WooCommerce</option>
                                                </select>
                                            </div>
                                        </div>
                                    }
                                    {
                                        shopPlatform && shopPlatform === "shopify" && <Grid item xs={12}>
                                        <Formik
                                            innerRef={formikRef}
                                            key={defaultURL || ""}
                                            initialValues={{
                                                website_url: defaultURL || "",
                                            }}
                                            onSubmit={(values: any, formikHelpers) => {
                                                formikHelpers.setSubmitting(true)
                                                setError("");
                                                let domain = values.website_url;
                                                try {
                                                    domain = values.website_url.replace(/^https?:\/\//, '').replace(/\/\s*$/, "");;
                                                } catch (e) {

                                                }
                                                new OnBoardingApis().register_form(domain, shopPlatform, "", "", "")
                                                    .then((r) => {
                                                        if (isMounted.current) {
                                                            if (OnBoardingApis.hasError(r, notificationContext)
                                                                || (!r.redirectURL && !r.shop && !r.reactURL)) {
                                                                setLoading(false);
                                                                formikHelpers.setSubmitting(false)
                                                                if (!HandleErrors(r, formikHelpers)) {
                                                                    setError(r.message || "");
                                                                }
                                                            } else if (r.shop) {
                                                                setLoading(false);
                                                                formikHelpers.setSubmitting(false)
                                                                dispatch({
                                                                    type: "set_active_shop",
                                                                    shop: r.shop
                                                                })
                                                                history.push({pathname: "/"});
                                                            } else if (r.redirectURL) {
                                                                window.location.href = r.redirectURL;
                                                            } else if (r.reactURL) {
                                                                history.replace(r.reactURL);
                                                            }
                                                        }
                                                    });
                                            }}
                                            validationSchema={yup.object({
                                                website_url: yup
                                                    .string().matches(
                                                        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
                                                        'Enter correct url!'
                                                    )
                                                    .required("Please enter a valid url"),
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
                                                                Enter your shopify website URL
                                                            </Typography>
                                                        </Form.Label>
                                                        <Box display={"flex"}>
                                                            <div>
                                                                <Form.Group className={classes.loginFormGroup}>
                                                                    <Form.Control
                                                                        placeholder="example.com"
                                                                        value={values.website_url}
                                                                        name="website_url"
                                                                        onChange={handleChange}
                                                                        isInvalid={
                                                                            touched &&
                                                                            touched.website_url &&
                                                                            errors &&
                                                                            !!errors.website_url
                                                                        }
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {errors && errors.website_url}
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
                                                                    GET STARTED
                                                                </Button>
                                                            </Box>
                                                        </Box>
                                                    </Form>
                                                );
                                            }}
                                        </Formik>
                                    </Grid>
                                    }
                                    {
                                        shopPlatform && shopPlatform === "woocommerce" && <Grid item xs={12}>
                                            <Grid item>
                                            <Typography>
                                                Install the Emailwish WordPress plugin from
                                                <a href="https://wordpress.org/plugins/emailwish/"
                                                > wordpress.org </a>
                                            </Typography>
                                        </Grid>
                                        </Grid>
                                    }
                                    {
                                        shopPlatform && shopPlatform === "shopify" && <Grid item>
                                            <Typography>
                                                or Install Emailwish from
                                                <a href="https://apps.shopify.com/emailmarketing_emailwish_abandonedcart_popup_chat_reviews"
                                                > Shopify App Store</a>
                                            </Typography>
                                            <Typography>
                                                We will automatically fetch your email address from your shopify store!
                                            </Typography>
                                        </Grid>
                                    }
                                        <Grid item className="mt-3">
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
                                }
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

export default Register;
