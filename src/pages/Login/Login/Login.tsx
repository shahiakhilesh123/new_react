import React, {Dispatch, useContext, useEffect} from "react";
import * as yup from "yup";
import UserAPIs from '../../../apis/user.apis'
import {Button, CircularProgress, Grid, Typography} from "@material-ui/core";
import {Link, useHistory, useLocation, useParams, Redirect} from "react-router-dom";
import rectangle_background from "../../../assets/images/Rectangle.png";
import logo from "../../../assets/images/logo-tilted-small.png";
import background_image from "../../../assets/images/signup_background.svg";
import {Form, Alert} from "react-bootstrap";
import {Formik} from "formik";
import useIsMounted from "ismounted";
import {iStoreAction} from "../../../redux/reducers";
import {AppDispatchContext, NotificationContext} from "../../../App";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {animated, Transition} from "react-spring/renderprops";
import shapes_accountPage from "../../../assets/images/shapes_and_images_accountPage.png";
import Hidden from "@material-ui/core/Hidden";
import {Scrollbar} from "../../../components/CustomScroll/ScrollBars";
import OnBoardingApis from "../../../apis/onboarding.apis";
import qs from 'qs';

export const LoginPageStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {},
        loginArea: {
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
        loginCard: {
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
        registerCardMainContent: {
            flex: 2,
            paddingLeft: theme.spacing(2)
        },
        loginForm: {
            display: "flex",
            flexDirection: "column",
            height: "100%",
            padding: theme.spacing(2),
        },
        loginFormLogo: {
            display: "flex",
            justifyContent: "flex-end",
            "& img": {
                width: "150px"
            }
        },
        loginFormWrapper: {
            paddingTop: theme.spacing(2),
            flex: 1,
        },
        loginWelcomeText: {
            fontWeight: "normal",
            fontSize: "30px"
        },
        loginFormGroup: {
            "& input": {
                width: "250px"
            }
        },
        loginButton: {
            minWidth: "200px",
            backgroundColor: "#7116ed"
        },
        registerCardSideBarItem: {
            borderTopLeftRadius: "10px",
            borderBottomLeftRadius: "10px",
            height: "600px",
            position: "relative"
        },
        registerCardSideBarItemTypo: {
            fontSize: "18px",
            color: "white",
            fontWeight: 200,
            textAlign: "center",
            padding: theme.spacing(1)
        }
    },), {index: 1},
);
export default function Login() {
    useEffect(() => {
        document.title = "Login | Emailwish";
    }, []);
    const params: any = useParams();
    
    const classes = LoginPageStyles();
    const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
    let history = useHistory();
    const location = useLocation();
    const qsParams = qs.parse(location.search, {ignoreQueryPrefix: true});
    const account_exists = typeof qsParams.account_exists === "string" ? qsParams.account_exists : "0";
    const shop = typeof qsParams.shop === "string" ? qsParams.shop : "your shop";
    const redirect = qsParams.redirect;
    delete qsParams.redirect;
    
    const newQueryString = qs.stringify(qsParams);

    const redirect_url = redirect ? redirect + "?" + newQueryString : "";
    const register_url = redirect ? redirect_url  : "/register";
    const isMounted = useIsMounted();
    const loginSchema = yup.object({
        email: yup.string().email("Please enter valid email address").required("Please enter email ID"),
        password: yup.string().required("Please enter password"),
    });

    const notificationContext = useContext(NotificationContext);

    let {from}: any = location.state || {from: {pathname: "/"}};

    useEffect(() => {
        console.log(location.search)
        new OnBoardingApis().users_aff(params.af_id).then(res => {

        })
    }, [params && params.af_id])

    useEffect(() => {
        document.body.classList.add('login_body');
        return () => {
            document.body.classList.remove('login_body');
        }
    }, []);

    return <div className={classes.root}>
        <div className={classes.loginArea} style={{backgroundImage: `url(${background_image})`}}>
            <div className={classes.loginCard}>
                <Hidden xsDown>
                    <div className={classes.registerCardSideBar}>
                        <Grid container className={classes.registerCardSideBarItem}
                              style={{backgroundImage: `url(${rectangle_background})`}} alignItems={"flex-end"}>
                            <Grid item className="item1">
                                <Transition items={1}
                                            from={{opacity: 0, transform: 'translate3d(0px,40px,0)'}}
                                            enter={{opacity: 1, transform: 'translate3d(0px,0px,0)'}}
                                            leave={{opacity: 0, transform: 'translate3d(0px,0px,0)'}}
                                            config={{duration: 1400}}
                                >
                                    {page => (props =>
                                            <animated.div style={props}>
                                                <Typography className={classes.registerCardSideBarItemTypo}>
                                                    Smart and automated email campaign is just a few step away.
                                                </Typography>
                                            </animated.div>
                                    )}
                                </Transition>
                            </Grid>
                            <Grid item>
                                <img src={shapes_accountPage} alt={"login images"}/>
                            </Grid>
                        </Grid>
                    </div>
                </Hidden>
                <div className={classes.registerCardMainContent}>
                    <Scrollbar style={{height: "600px"}}>
                        <Formik
                            initialValues={{
                                email: "",
                                password: ""
                            }}
                            onSubmit={async (values: any, helpers) => {

                                helpers.setSubmitting(true);
                                return new UserAPIs().login(values["email"], values["password"]).then((response) => {
                                    if (isMounted.current) {
                                        if (UserAPIs.hasError(response, notificationContext)) {
                                            if (response.errors &&
                                                response.errors["email"]) {
                                                helpers.setErrors({"email": response.errors["email"]});
                                            }
                                            if (response.errors &&
                                                response.errors["password"]) {
                                                helpers.setErrors({"password": response.errors["password"]});
                                            }
                                            if (response.errors &&
                                                response.errors["email_verification_required"]) {
                                                //setVerificationError(true);
                                            }
                                            helpers.setSubmitting(false);
                                        } else {
                                            return new UserAPIs().fetch_user().then((response) => {
                                                if (isMounted.current) {
                                                    if (UserAPIs.hasError(response, notificationContext)) {
                                                        helpers.setSubmitting(false);
                                                    } else {
                                                        dispatch({
                                                            type: "set_logged_in_user",
                                                            loggedInUser: response.user
                                                        })
                                                            if (response.shops && response.shops.length > 0) {

                                                                let set_active_shop_uid = window.localStorage.getItem("set_active_shop_uid");
                                                                if (set_active_shop_uid) {
                                                                    let shop = response.shops.find(value => {
                                                                        return value.uid === set_active_shop_uid;
                                                                    })
                                                                    if (shop) {
                                                                        dispatch({
                                                                            type: "set_active_shop",
                                                                            shop: shop
                                                                        })
                                                                    } else {
                                                                        dispatch({
                                                                            type: "set_active_shop",
                                                                            shop: response.shops[0]
                                                                        })
                                                                    }
                                                                } else {
                                                                    dispatch({
                                                                        type: "set_active_shop",
                                                                        shop: response.shops[0]
                                                                    })
                                                                }
                                                                dispatch({
                                                                    type: "set_shops",
                                                                    shops: response.shops
                                                                })
                                                            }
                                                            
                                                            if(redirect_url){
                                                                
                                                                response.redirectURL = redirect_url
                                                            }
                                                            if (response.redirectURL) {
                                                                history.push(response.redirectURL)
                                                            } else {
                                                                if (from === "/login") {
                                                                    history.replace("/");
                                                                } else {
                                                                    history.replace(from);
                                                                }
                                                            }
                                                        
                                                        
                                                    }
                                                }
                                            });
                                        }
                                    }
                                })
                            }}
                            validationSchema={loginSchema}
                        >
                            {({
                                  handleSubmit,
                                  handleChange,
                                  values,
                                  touched,
                                  isSubmitting,
                                  errors,
                              }: any) => {
                                return <form onSubmit={handleSubmit} className={classes.loginForm}>
                                    <div className={classes.loginFormLogo}>
                                        <div>
                                            <img src={logo} alt="Emailwish logo"/>
                                        </div>
                                    </div>
                                    <div className={classes.loginFormWrapper}>
                                        <Grid container
                                              direction="column"
                                              alignItems="flex-start"
                                              spacing={1}
                                              justifyContent="center">
                                            <Grid item>
                                                <Typography className={classes.loginWelcomeText}>
                                                    Welcome, Login to your account.
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                {account_exists === "1" &&
                                                <Alert variant="success">Please login to connect <strong>{shop}</strong> to your existing account.</Alert>
                                                }
                                                <Form.Group controlId="emailController"
                                                            className={classes.loginFormGroup}>
                                                    <Form.Label className="text-box-label">Email </Form.Label>
                                                    <Form.Control
                                                        type="email"
                                                        name="email"
                                                        autoComplete="username"
                                                        placeholder="abc@example.com"
                                                        value={values.email}
                                                        onChange={handleChange}
                                                        isInvalid={touched && touched.email && errors && !!errors.email}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors && errors.email}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Grid>
                                            <Grid item>
                                                <Form.Group controlId="passwordController"
                                                            className={classes.loginFormGroup}>
                                                    <Form.Label className="text-box-label">Password</Form.Label>
                                                    <Form.Control
                                                        required
                                                        type="password"
                                                        name="password"
                                                        autoComplete="current-password"

                                                        className="text-control"
                                                        placeholder="*********"
                                                        onChange={handleChange}
                                                        isInvalid={touched && touched.password && errors && !!errors.password}
                                                    />
                                                    <Form.Control.Feedback type="invalid">
                                                        {errors && errors.password}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Grid>

                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    fullWidth
                                                    className={classes.loginButton}
                                                    type="submit"
                                                    disabled={isSubmitting}>
                                                    {isSubmitting && <CircularProgress size={15}/>}
                                                    &nbsp;Login
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Link to="/forgot-password">
                                                    <Typography className="forgot-text">
                                                        Forgot Password?
                                                    </Typography>
                                                </Link>
                                            </Grid>
                                            <Grid item>
                                                <Grid container spacing={1}>
                                                    <Grid item>
                                                        <Typography className="text1">
                                                            Don't have an Account?
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Link to={register_url}>
                                                            <Typography className="text2">
                                                                Register Now!
                                                            </Typography>
                                                        </Link>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </div>


                                </form>
                            }
                            }
                        </Formik>
                    </Scrollbar>
                </div>
            </div>
        </div>
    </div>
}
