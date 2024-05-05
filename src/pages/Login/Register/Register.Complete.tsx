import { Button, createStyles, Grid, Paper, Theme, Typography } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
import { makeStyles } from "@material-ui/styles";
import getSymbolFromCurrency from "currency-symbol-map";
import { Formik, FormikProps, useFormikContext } from 'formik';
import useIsMounted from "ismounted";
import qs from 'qs';
import React, { Dispatch, useContext, useEffect, useRef, useState } from "react";
import { Alert, Col, Form, InputGroup, Row } from "react-bootstrap";
import {
  FaCcPaypal, FaFacebookSquare,
  FaIdBadge,
  FaInstagramSquare,
  FaLink,
  FaLinkedinIn,
  FaPhoneAlt,
  FaSkype, FaStripe, FaTag, FaTwitter,
  FaUser
} from "react-icons/all";
import { useHistory, useLocation } from "react-router-dom";
import { animated, Transition } from "react-spring/renderprops";
import * as yup from "yup";
import OnBoardingApis, { iStepOneResponse, iWooCommerce, storePlatform, tStorePlatform } from "../../../apis/onboarding.apis";
import UserAPIs from "../../../apis/user.apis";
import { AppDispatchContext, AppStateContext, NotificationContext } from "../../../App";
import logo from "../../../assets/images/logo-tilted-small.png";
import rectangle_background from "../../../assets/images/Rectangle.png";
import shapes_acccuntPage from "../../../assets/images/shapes_and_images_accountPage.png";
import shapesImage from "../../../assets/images/shapes_and_masked_images.png";
import background_image from "../../../assets/images/signup_background.svg";
import ColorSketchPicker from "../../../components/ColorPicker/colorPicker";
import { HandleErrors } from "../../../components/helper/form.helper";
import HtmlTooltip from "../../../components/Tooltip/HtmlTooltip";
import { iStoreAction } from "../../../redux/reducers";
import { iApiBasicResponse, iPlan, iShopDetails } from "../../../types/api";
import PlanCard from "./Plan.Card";

export const RegisterCompleteStyles = makeStyles((theme: Theme) =>
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
      width: "990px",
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
      padding: theme.spacing(2),
    },
    loginForm: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      padding: theme.spacing(1),
    },
    loginFormLogo: {
      display: "flex",
      justifyContent: "flex-end",
      "& img": {
        width: "150px"
      }
    },
    loginFormWrapper: {
      flex: 1,
    },
    loginWelcomeText: {
      fontWeight: "normal",
      fontSize: "30px"
    },
    loginFormGroup: {
      "& input": {
        width: "200px"
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
    registerCardSideBarItemTypoHeading: {
      fontSize: "22px",
      color: "white",
      fontWeight: 200,
      textAlign: "center",
      padding: theme.spacing(1)
    },
    registerCardSideBarItemTypo: {
      fontSize: "18px",
      color: "white",
      fontWeight: 200,
      textAlign: "center",
      padding: theme.spacing(1)
    },
    registerCardSideBarItemTypoList: {
      fontSize: "16px",
      color: "black",
    },
    colorPickerItemWrapper: {
      display: "flex",
      alignItems: "center"

    },
    colorPickerIteColorWrapper: {
      display: "flex"
    },
    colorPickerIteColorPicker: {},
    colorPickerIteColorValue: {},
    colorPickerItemTypo: {
      paddingLeft: "8px"
    },
    gettingStartedButton: {
      backgroundColor: "black",
      color: "white",
      makeStyles: "70px"
    },
    linksFormGroup: {
      "& input": {
        width: "200px",

        [theme.breakpoints.down('sm')]: {
          width: "150px",
        },
      }
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      color: theme.palette.text.secondary,
    },
    button: {
      marginTop: theme.spacing(2),
    },
  },), { index: 1 },
);


function RegisterComplete() {
  type FormValues = {};
  const formRef = useRef<FormikProps<FormValues> | null>(null);

  const classes = RegisterCompleteStyles();
  const location = useLocation();
  const [abortingOnboarding, setAbortOnboarding] = useState<boolean>(false);
  const history = useHistory();
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<{ [key: string]: string | string[] }>({});
  const [error, setError] = useState<string>("");


  const shopDefaults: iShopDetails = storePlatform
  const [shopifyStore, setShopifyStore] = useState<iShopDetails>(shopDefaults);
  const params = qs.parse(location.search, { ignoreQueryPrefix: true });
  const [plans, setPlans] = useState<iPlan[]>([]);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [step, setStep] = useState<string>('one')
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [isShopify, setIsShopify] = useState<boolean>(false);
  const platform = typeof params.platform === "string" ? params.platform : "shopify";
  const shop: string = typeof params.shop === "string" ? params.shop : "";
  const api_key: string = typeof params.api_key === "string" ? params.api_key : "";
  const api_secret: string = typeof params.api_secret === "string" ? params.api_secret : "";
  const secret: string = typeof params.secret === "string" ? params.secret : "";
  const inputRef = useRef([]);
  const notificationContext = useContext(NotificationContext);
  const { loggedInUser, shops } = useContext(AppStateContext);
  const isMounted = useIsMounted();
  const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
  const format_url = (value: String, originalValue: String) => {
    if (!originalValue.startsWith('https://') && !originalValue.startsWith('http://') && originalValue.trim() !== '') {
      return `https://${originalValue.trim()}`;
    }
      return value;
  };
    const social_media_warning = 'Social Media Link cannot exceed 500 characters';
    const validationSchema = yup.object({
            name: yup.string().required("Please enter name"),
            owner_first_name: yup.string().required("Please enter first name"),
            owner_last_name: yup.string().required("Please enter last name"),
            email: yup.string().required("Please enter email"),
            primary_domain: yup.string().required("Please enter primary domain"),
            myshopify_domain: yup.string().required("Please enter my shopify domain"),
            font_family: yup.string().required("Please select font family"),
            primary_background_color: yup.string().required("Please select color"),
            primary_text_color: yup.string().required("Please select color"),
            secondary_background_color: yup.string().required("Please select color"),
            secondary_text_color: yup.string().required("Please select color"),
            password: ((shopifyStore && shopifyStore.password_required)) ? yup.string().required("Please enter new password")
                .min(8, 'The password doesn\'t meet the criteria.') : yup.string(),
            currency: yup.string().required("Please select currency"),
            selected_plan_id: yup.number().required("Please select plan"),
            selected_plan_price: yup.string(),
            step: yup.number(),

            full_name: yup.string(),
            designation: yup.string(),
            website: yup.string().transform(format_url).url().max(500, social_media_warning),
            phone: yup.string(),
            facebook: yup.string().transform(format_url).url().max(500, social_media_warning),
            instagram: yup.string().transform(format_url).url().max(500, social_media_warning),
            linkedin: yup.string().transform(format_url).url().max(500, social_media_warning),
            twitter: yup.string().transform(format_url).url().max(500, social_media_warning),
            skype: yup.string().transform(format_url).url().max(500, social_media_warning),
            logo: yup.mixed(),
            api_key: yup.string(),
            api_secret: yup.string(),
            platform: yup.string()
    });

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  const handlePayPalClick = (plan_id: string) => {
    // Implement PayPal payment logic
    new OnBoardingApis().paypal_approval_url(plan_id,).then((res) => {
      if (OnBoardingApis.hasError(res, notificationContext)) {

      } else {
        openCenteredWindow(res.approval_url, 500, 600)
      }

    })
  };
  function openCenteredWindow(url: any, width: any, height: any) {
    const screenWidth = window.screen.availWidth;
    const screenHeight = window.screen.availHeight;

    const left = (screenWidth / 2) - (width / 2) + window.screenLeft;
    const top = (screenHeight / 2) - (height / 2) + window.screenTop;
    const centeredWindow = window.open(url, '_blank', `
          toolbar=no,
          location=no,
          directories=no,
          status=no,
          menubar=no,
          scrollbars=yes,
          resizable=yes,
          copyhistory=no,
          width=${width},
          height=${height},
          top=${top},
          left=${left}
        `);

    if (centeredWindow) {
      const pollClosed = setInterval(function() {
        if (centeredWindow.closed) {
          document.getElementById('paymentLoading')?.remove()
          windowClosed = true
          clearInterval(pollClosed);
          // if (formRef.current) {
          //     formRef.current?.handleSubmit()
          // }
        }
      }, 1000);
      const paymentLoading = document.createElement('div')
      paymentLoading.classList.add('paymentLoading')
      paymentLoading.id = "paymentLoading"
      document.body.appendChild(paymentLoading)
      var windowClosed = false
      centeredWindow.focus();
      window.addEventListener('message', function(event) {
        if (event.data.type === 'closeWindow' && !windowClosed) {
          if (formRef.current) {
            formRef.current?.handleSubmit()
          }
          centeredWindow.close()
        }

      });
    }
  }
  const handleStripeClick = () => {
    console.log("Stripe selected");
    // Implement Stripe payment logic
  };
  useEffect(() => {
    document.body.classList.add('login_body')
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      document.body.classList.remove('login_body');
      document.body.classList.add('site_body');
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  // region Step One
  useEffect(() => {
    const state: string = typeof params.state === "string" ? params.state : "";
    const code: string = typeof params.code === "string" ? params.code : "";
    const hmac: string = typeof params.hmac === "string" ? params.hmac : "";
    const timestamp = typeof params.timestamp === "string" ? params.timestamp : "";
    const charge_id = typeof params.charge_id === "string" ? params.charge_id : "";
    setLoading(true);
    const email: string = typeof params.email === "string" ? params.email : "";
    if (platform === "shopify") {
      setIsShopify(true);
      if (process.env.REACT_APP_DEV_MODE === "true") {
        setCurrencies(["US$"]);
        setStep("two");
      } else {
        if (charge_id) new OnBoardingApis().complete_plan(charge_id, shop).then(complete_plan_response)
        else new OnBoardingApis().step_one("shopify", state, code, hmac, shop, timestamp, "", "", "", email).then(step_one_response)
      }
    } else {
      
      if (shop) {
        if (charge_id) new OnBoardingApis().complete_plan(charge_id, shop).then(complete_plan_response)
        else new OnBoardingApis().step_one("woocommerce", state, "", "", shop, "", api_key, api_secret, secret, email).then(step_one_response)

      } else {
        history.replace("/");
      }
    }
  }, [])

  function step_one_response(r: iStepOneResponse) {


    if (r.reactURL) {
      window.location.href = r.reactURL;
      return;
    }

    if (OnBoardingApis.hasError(r, notificationContext) || !r.store || !r.plans || !r.currencies) {
      setLoading(false);
      setErrors(r.errors || {});
      setError(r.message || "");
    } else if (!r.plans.length) {
      setLoading(false);
      setErrors(r.errors || {});
      setError("No plans are available now! Please try again later!");
    } else {

      setShopifyStore(r.store);
      setPlans(r.plans);
      if (r.currencies) {
        let sorted_currency = [...r.currencies];
        sorted_currency.sort()
        setCurrencies(sorted_currency);
      }

      setLoading(false);
      setTimeout(() => {
        setStep('two');
      }, 500)
    }
  }

  function complete_plan_response(r: iApiBasicResponse) {
    if (OnBoardingApis.hasError(r, notificationContext)) {
      setLoading(false);
      setErrors(r.errors || {});
      setError(r.message || "");
    } else {
      setLoading(false);
      // @ts-ignore
      window.location.href = "/";
    }
  }

  function step_one() {
    return <Box height={"100%"} display="flex" alignItems={"center"}>
      <div>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant={"h4"}>
              Fetching Store Information
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"subtitle1"}>
              Please wait while we fetch basic information about your store...
            </Typography>
          </Grid>
          {error && <Grid item xs={12}>
            <Alert variant="danger">{error}</Alert>
            <Button variant="contained"
              type="button"
              onClick={() => {
                new UserAPIs().logout().then(() => {
                  if (isMounted.current) {

                    dispatch({ type: "logout" });
                    history.replace("/login");
                  }
                });
              }}
              className="positive-button">
              Logout
            </Button>
          </Grid>}
        </Grid>
      </div>

    </Box>;
  }


  return <div className={classes.root}>
    <div id="regForm" className={classes.loginArea} style={{ backgroundImage: `url(${background_image})` }}>
      <Formik

        key={shopifyStore && shopifyStore.email}
        initialValues={{
          name: (shopifyStore && shopifyStore.name) || "",
          owner_first_name: (shopifyStore && shopifyStore.owner_first_name) || "",
          owner_last_name: (shopifyStore && shopifyStore.owner_last_name) || "",
          email: (shopifyStore && shopifyStore.email) || (process.env.REACT_APP_DEV_MODE === "true" && "example@email.com") || "",
          primary_domain: (shopifyStore && shopifyStore.primary_domain) || shop,
          myshopify_domain: (shopifyStore && shopifyStore.myshopify_domain) || "",
          font_family: (shopifyStore && shopifyStore.font_family) || "Open Sans",
          primary_background_color: (shopifyStore && shopifyStore.primary_background_color) || "#000000ff",
          primary_text_color: (shopifyStore && shopifyStore.primary_text_color) || "#ffffffff",
          secondary_background_color: (shopifyStore && shopifyStore.secondary_background_color) || "#ffffffff",
          secondary_text_color: (shopifyStore && shopifyStore.secondary_text_color) || "#000000ff",
          password: "",
          currency: (shopifyStore && shopifyStore.currency) || "",

          selected_plan_id: (shopifyStore && shopifyStore.selected_plan_id) || "",
          selected_plan_price: (shopifyStore && shopifyStore.selected_plan_price) || "",
          step: 0,


          full_name: (shopifyStore && shopifyStore.owner_first_name) || "",

          designation: (shopifyStore && shopifyStore.designation) || "",
          website: (shopifyStore && shopifyStore.primary_domain) || shop,
          phone: (shopifyStore && shopifyStore.phone) || "",
          facebook: (shopifyStore && shopifyStore.facebook) || "",
          instagram: (shopifyStore && shopifyStore.instagram) || "",
          linkedin: (shopifyStore && shopifyStore.linkedin) || "",
          twitter: (shopifyStore && shopifyStore.twitter) || "",
          skype: (shopifyStore && shopifyStore.skype) || "",
          logo: "",
          api_key: api_key || "",
          api_secret: api_secret || "",
          platform: platform || "",
          coupon: "",

        }}
        onSubmit={async (values: any, helpers) => {
          helpers.setSubmitting(true);
          return new OnBoardingApis().select_plan(values).then((response) => {
            if (OnBoardingApis.hasError(response, notificationContext)) {

              if (
                (response && response.validation_errors && response.validation_errors["facebook"]) ||
                (response && response.validation_errors && response.validation_errors["instagram"]) ||
                (response && response.validation_errors && response.validation_errors["linkedin"]) ||
                (response && response.validation_errors && response.validation_errors["twitter"]) ||
                (response && response.validation_errors && response.validation_errors["skype"])
              ) {
                setStep("three")
              }
              if (HandleErrors(response, helpers)) {

              }
            } else {
              if (response.redirectURL) {
                window.location.href = response.redirectURL;
              }
            }
          })
        }}
        innerRef={formRef}
        validationSchema={validationSchema}
      >
        {({
          handleSubmit,
          handleChange,
          submitForm,
          values,
          touched,
          isSubmitting,
          errors, validateField,
          setFieldTouched,
          setFieldValue,
          validateForm
        }: any) => {
          return <form onSubmit={handleSubmit} className={classes.loginCard}
          //ref={formRef}
          >
            <Hidden smDown>
              <div className={classes.registerCardSideBar}>
                <Grid container className={classes.registerCardSideBarItem}
                  style={{ backgroundImage: `url(${rectangle_background})` }}
                  alignItems={"flex-end"}>
                  <Grid item>
                    {
                      step === 'one' && <Transition items={2}
                        keys={2}
                        from={{
                          opacity: 0,
                          clipPath: 'circle(25% at -10% 148%)'
                        }}
                        enter={{ opacity: 1, }}
                        leave={{ opacity: 0, }}
                        config={{ duration: 500 }}
                      >
                        {page => (props =>
                          <animated.div style={{ ...props, }}>
                            <Grid container
                              alignItems="flex-end"
                              justifyContent="center"
                              direction="row"
                              style={{ backgroundImage: `url(${rectangle_background})` }}>
                              <Grid item style={{ marginBottom: "80px" }} xs={12}>
                                <Transition items={2} keys={1}
                                  from={{
                                    opacity: 0,
                                    transform: 'translate3d(0px,40px,0)'
                                  }}
                                  enter={{
                                    opacity: 1,
                                    transform: 'translate3d(0px,0px,0)'
                                  }}
                                  leave={{
                                    opacity: 0,
                                    transform: 'translate3d(0px,0px,0)'
                                  }}
                                  config={{ duration: 1400 }}
                                >
                                  {page => (props =>
                                    <animated.div style={props}>
                                      <Typography
                                        className={classes.registerCardSideBarItemTypo}>
                                        Smart and automated email
                                        campaign is just a few step
                                        away.
                                      </Typography>
                                    </animated.div>
                                  )}
                                </Transition>
                              </Grid>
                              <Grid item>
                                <img src={shapes_acccuntPage} />
                              </Grid>
                            </Grid>
                          </animated.div>
                        )}
                      </Transition>
                    }
                    {
                      (step === "two" || step === "three" ||
                        step === "four" || step === "five") && <Transition items={2}
                          keys={2}
                          from={{
                            opacity: 0,
                            clipPath: 'circle(25% at -10% 148%)'
                          }}
                          enter={{
                            opacity: 1,
                            clipPath: 'circle(100% at 50% 50%)'
                          }}
                          leave={{ opacity: 0, }}
                          config={{ duration: 500 }}
                        >
                        {page => (props =>

                          <animated.div style={{ ...props, }}>
                            <Grid container className="page-3-4-side-bar"
                              alignItems="flex-start"
                              justifyContent="space-between"
                              direction="column"
                              style={{ backgroundImage: `url(${rectangle_background})` }}>
                              <Grid item>
                                <Grid container className="sidebar-sub-grid"
                                  alignItems="flex-start"
                                  justifyContent="flex-start"
                                  direction="column">
                                  <Grid item className="list-item w-100">
                                    <Grid container direction="row" spacing={1}
                                      alignItems={"center"}
                                      className="w-100">
                                      <Grid item xs={2}>
                                        <div
                                          className="numberCircle">1
                                        </div>
                                      </Grid>
                                      <Grid item xs={10}>
                                        {step === 'two' ?
                                          <Transition items={3}
                                            keys={3}
                                            from={{
                                              opacity: 0,
                                              transform: 'translate3d(15px,0,0px)'
                                            }}
                                            enter={{
                                              opacity: 1,
                                              transform: 'translate3d(0px,0,0px)'
                                            }}
                                            leave={{
                                              opacity: 0,
                                              transform: 'translate3d(0px,0,0)'
                                            }}
                                            config={{ duration: 1200 }}>
                                            {page => (props =>
                                              <animated.div
                                                style={props}>
                                                <div
                                                  className="d-flex justify-content-between align-items-center">
                                                  <Typography
                                                    className={" active-item "}>
                                                    ACCOUNT
                                                    DETAILS
                                                  </Typography>
                                                  <HtmlTooltip
                                                    title={
                                                      <React.Fragment>
                                                        <Typography
                                                          className={classes.registerCardSideBarItemTypoList}>
                                                          Fill
                                                          out
                                                          the
                                                          basic
                                                          account
                                                          detail
                                                        </Typography>
                                                      </React.Fragment>
                                                    }
                                                  >
                                                    <IconButton>
                                                      <InfoIcon
                                                        style={{ color: "white" }} />
                                                    </IconButton>

                                                  </HtmlTooltip>

                                                </div>

                                              </animated.div>
                                            )}
                                          </Transition> :
                                          <div>
                                            <div
                                              className="d-flex justify-content-between align-items-center">
                                              <Typography
                                                className="list-item-text">
                                                ACCOUNT
                                                DETAILS
                                              </Typography>
                                              <HtmlTooltip
                                                title={
                                                  <React.Fragment>
                                                    <Typography
                                                      className={classes.registerCardSideBarItemTypoList}>
                                                      Fill out
                                                      the
                                                      basic
                                                      account
                                                      detail
                                                    </Typography>
                                                  </React.Fragment>
                                                }
                                              >
                                                <IconButton>
                                                  <InfoIcon
                                                    style={{ color: "white" }} />
                                                </IconButton>

                                              </HtmlTooltip>
                                            </div>
                                          </div>

                                        }
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid item className="list-item w-100">
                                    <Grid container direction="row" spacing={1}
                                      alignItems={"center"}
                                      className="w-100">
                                      <Grid item xs={2}>
                                        <div className="numberCircle">2
                                        </div>
                                      </Grid>
                                      <Grid item xs={10}>
                                        {step === 'three' ?
                                          <Transition items={3} keys={3}
                                            from={{
                                              opacity: 0,
                                              transform: 'translate3d(15px,0,0px)'
                                            }}
                                            enter={{
                                              opacity: 1,
                                              transform: 'translate3d(0px,0,0px)'
                                            }}
                                            leave={{
                                              opacity: 0,
                                              transform: 'translate3d(0px,0,0)'
                                            }}
                                            config={{ duration: 1200 }}>
                                            {page => (props =>
                                              <animated.div
                                                style={props}>
                                                <div
                                                  className="d-flex justify-content-between align-items-center">
                                                  <Typography
                                                    className={" active-item "}>
                                                    SIGNATURE
                                                  </Typography>
                                                  <HtmlTooltip
                                                    title={
                                                      <React.Fragment>
                                                        <Typography
                                                          className={classes.registerCardSideBarItemTypoList}>
                                                          This
                                                          will
                                                          be
                                                          used
                                                          in
                                                          your
                                                          email
                                                          templates
                                                          and
                                                          email
                                                          builder
                                                          by
                                                          default
                                                        </Typography>
                                                      </React.Fragment>
                                                    }
                                                  >
                                                    <IconButton>
                                                      <InfoIcon
                                                        style={{ color: "white" }} />
                                                    </IconButton>

                                                  </HtmlTooltip>

                                                </div>
                                              </animated.div>
                                            )}
                                          </Transition> :
                                          <div>
                                            <div
                                              className="d-flex justify-content-between align-items-center">
                                              <Typography
                                                className="list-item-text">
                                                SIGNATURE
                                              </Typography>
                                              <HtmlTooltip
                                                title={
                                                  <React.Fragment>
                                                    <Typography
                                                      className={classes.registerCardSideBarItemTypoList}>

                                                      This
                                                      will be
                                                      used in
                                                      your
                                                      email
                                                      templates
                                                      and
                                                      email
                                                      builder
                                                      by
                                                      default
                                                    </Typography>
                                                  </React.Fragment>
                                                }
                                              >
                                                <IconButton>
                                                  <InfoIcon
                                                    style={{ color: "white" }} />
                                                </IconButton>

                                              </HtmlTooltip>
                                            </div>
                                          </div>
                                        }
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <Grid item className="list-item w-100">
                                    <Grid container direction="row" spacing={1}
                                      alignItems={"center"}
                                      className="w-100">
                                      <Grid item xs={2}>
                                        <div className="numberCircle">3
                                        </div>
                                      </Grid>
                                      <Grid item xs={10}>
                                        {step === 'four' ?
                                          <Transition items={4} keys={4}
                                            from={{
                                              opacity: 0,
                                              transform: 'translate3d(15px,0,0px)'
                                            }}
                                            enter={{
                                              opacity: 1,
                                              transform: 'translate3d(0px,0,0px)'
                                            }}
                                            leave={{
                                              opacity: 0,
                                              transform: 'translate3d(0px,0,0)'
                                            }}
                                            config={{ duration: 1000 }}>
                                            {page => (props =>
                                              <animated.div
                                                style={props}>
                                                <div
                                                  className="d-flex w-100 justify-content-between align-items-center">
                                                  <Typography
                                                    className={" active-item "}>
                                                    PLAN
                                                  </Typography>
                                                  <HtmlTooltip
                                                    title={
                                                      <React.Fragment>
                                                        <Typography
                                                          className={classes.registerCardSideBarItemTypoList}>
                                                          Select
                                                          the
                                                          best
                                                          plan
                                                          you
                                                          need
                                                          and
                                                          Start
                                                          doing
                                                          Emailwish
                                                        </Typography>
                                                      </React.Fragment>
                                                    }
                                                  >
                                                    <IconButton>
                                                      <InfoIcon
                                                        style={{ color: "white" }} />
                                                    </IconButton>

                                                  </HtmlTooltip>

                                                </div>
                                              </animated.div>
                                            )}
                                          </Transition> :
                                          <div>
                                            <div
                                              className="d-flex w-100 justify-content-between align-items-center">
                                              <Typography
                                                className="list-item-text">
                                                PLAN
                                              </Typography>
                                              <HtmlTooltip
                                                title={
                                                  <React.Fragment>
                                                    <Typography
                                                      className={classes.registerCardSideBarItemTypoList}>
                                                      Select
                                                      the best
                                                      plan you
                                                      need and
                                                      Start
                                                      doing
                                                      Emailwish
                                                    </Typography>
                                                  </React.Fragment>
                                                }
                                              >
                                                <IconButton>
                                                  <InfoIcon
                                                    style={{ color: "white" }} />
                                                </IconButton>

                                              </HtmlTooltip>
                                            </div>
                                          </div>}
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  {
                                    ((!isShopify)) &&
                                    <Grid item className="list-item w-100">
                                      <Grid container direction="row" spacing={1}
                                        alignItems={"center"}
                                        className="w-100">
                                        <Grid item xs={2}>
                                          <div className="numberCircle">4
                                          </div>
                                        </Grid>
                                        <Grid item xs={10}>
                                          {step === 'five' ?
                                            <Transition items={5} keys={5}
                                              from={{
                                                opacity: 0,
                                                transform: 'translate3d(15px,0,0px)'
                                              }}
                                              enter={{
                                                opacity: 1,
                                                transform: 'translate3d(0px,0,0px)'
                                              }}
                                              leave={{
                                                opacity: 0,
                                                transform: 'translate3d(0px,0,0)'
                                              }}
                                              config={{ duration: 1000 }}>
                                              {page => (props =>
                                                <animated.div
                                                  style={props}>
                                                  <div
                                                    className="d-flex w-100 justify-content-between align-items-center">
                                                    <Typography
                                                      className={" active-item "}>
                                                      PAYMENT
                                                    </Typography>
                                                    <HtmlTooltip
                                                      title={
                                                        <React.Fragment>
                                                          <Typography
                                                            className={classes.registerCardSideBarItemTypoList}>
                                                            Choose a payment method
                                                          </Typography>
                                                        </React.Fragment>
                                                      }
                                                    >
                                                      <IconButton>
                                                        <InfoIcon
                                                          style={{ color: "white" }} />
                                                      </IconButton>

                                                    </HtmlTooltip>

                                                  </div>
                                                </animated.div>
                                              )}
                                            </Transition> :
                                            <div>
                                              <div
                                                className="d-flex w-100 justify-content-between align-items-center">
                                                <Typography
                                                  className="list-item-text">
                                                  PAYMENT
                                                </Typography>
                                                <HtmlTooltip
                                                  title={
                                                    <React.Fragment>
                                                      <Typography
                                                        className={classes.registerCardSideBarItemTypoList}>
                                                        Choose a payment method
                                                      </Typography>
                                                    </React.Fragment>
                                                  }
                                                >
                                                  <IconButton>
                                                    <InfoIcon
                                                      style={{ color: "white" }} />
                                                  </IconButton>

                                                </HtmlTooltip>
                                              </div>
                                            </div>}
                                        </Grid>
                                      </Grid>
                                    </Grid>
                                  }
                                </Grid>
                              </Grid>
                              <Grid item>
                                <img src={shapesImage} />
                              </Grid>
                            </Grid>
                          </animated.div>
                        )}
                      </Transition>
                    }
                  </Grid>
                </Grid>
              </div>
            </Hidden>
            <div className={classes.registerCardMainContent}>
              <div className={classes.loginForm}>

                {step === 'one' && step_one()}
                {step !== 'one' &&
                  <div style={{ height: "100%" }}>
                    {step === 'two' && <Transition items={2} keys={2}
                      from={{ opacity: 0 }}
                      enter={{ opacity: 1, }}
                      leave={{ opacity: 0 }}
                      config={{ duration: 500 }}>
                      {page => (props =>
                        <animated.div style={{ ...props, height: "100%" }}>
                          <Box display={"flex"} height={"100%"} flexDirection={"column"}>
                            <div className={classes.loginFormLogo}>
                              <div>
                                <img src={logo} alt="Emailwish logo" />
                              </div>
                            </div>
                            <Box flex={1}>
                              <Grid container>
                                <Grid item xs={12}>
                                  <Typography variant={"h4"}>
                                    Account Details
                                  </Typography>
                                </Grid>
                              </Grid>
                              <Box paddingTop={4}>
                                <Grid container
                                  spacing={2}>
                                  <Grid item xs={6}>

                                    <Form.Group>
                                      <Form.Label>
                                        <Typography variant={"subtitle1"}>
                                          Email Address *
                                        </Typography>
                                      </Form.Label>
                                      <Form.Control
                                        className={errors && errors.email && "is-invalid"}
                                        name="email"

                                        disabled={platform === "shopify"}
                                        value={values.email}
                                        onChange={(e: any) => {
                                          handleChange(e)
                                        }}
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
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Form.Group>
                                      <Form.Label>
                                        <Typography variant={"subtitle1"}>
                                          Primary Domain *
                                        </Typography>

                                      </Form.Label>
                                      <Form.Control

                                        disabled={true}
                                        name="primary_domain"
                                        onChange={(e: any) => {
                                          handleChange(e)
                                        }}

                                        value={values.primary_domain}
                                        isInvalid={
                                          touched &&
                                          touched.primary_domain &&
                                          errors &&
                                          !!errors.primary_domain
                                        }
                                      />
                                      <Form.Control.Feedback type="invalid">
                                        {errors && errors.primary_domain}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Grid>
                                  {
                                    ((shopifyStore && shopifyStore.password_required) || (!isShopify)) &&
                                    <Grid item xs={6}>
                                      <Form.Group >
                                        <Form.Label>
                                          <Typography variant={"subtitle1"}>
                                            Password
                                          </Typography>
                                        </Form.Label>
                                        <Form.Control type="password"
                                          className={errors && errors.password && "is-invalid"}
                                          name="password"

                                          value={values.password}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}
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
                                    </Grid>
                                  }

                                  <Grid item xs={6}>
                                    <Form.Group>
                                      <Form.Label
                                        className="text-box-label"> Store Name
                                        *</Form.Label>
                                      <Form.Control
                                        className={errors && errors.name && "is-invalid"}
                                        name="name"
                                        value={values.name}
                                        onChange={(e: any) => {
                                          handleChange(e)
                                        }}
                                        isInvalid={
                                          touched &&
                                          touched.name &&
                                          errors &&
                                          !!errors.name
                                        }
                                      />
                                      <Form.Control.Feedback
                                        type="invalid">
                                        {errors && errors.name}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Grid>

                                  <Grid item xs={6}>
                                    <Form.Group>
                                      <Form.Label
                                        className="text-box-label">Your
                                        First Name *</Form.Label>
                                      <Form.Control
                                        name="owner_first_name"
                                        value={values.owner_first_name}
                                        onChange={(e: any) => {
                                          handleChange(e)
                                        }}
                                        isInvalid={
                                          touched &&
                                          touched.owner_first_name &&
                                          errors &&
                                          !!errors.owner_first_name
                                        }
                                      >
                                      </Form.Control>
                                      <Form.Control.Feedback
                                        type="invalid">
                                        {errors && errors.owner_first_name}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Form.Group>
                                      <Form.Label
                                        className="text-box-label">Last
                                        Name</Form.Label>
                                      <Form.Control
                                        name="owner_last_name"
                                        value={values.owner_last_name}
                                        onChange={(e: any) => {
                                          handleChange(e)
                                        }}
                                        isInvalid={
                                          touched &&
                                          touched.owner_last_name &&
                                          errors &&
                                          !!errors.owner_last_name
                                        }
                                      >
                                      </Form.Control>
                                      <Form.Control.Feedback
                                        type="invalid">
                                        {errors && errors.owner_last_name}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Form.Group>
                                      <Form.Label>
                                        <Typography variant={"subtitle1"}>
                                          Currency *
                                        </Typography>
                                      </Form.Label>
                                      <Form.Control as="select"

                                        name="currency"
                                        value={values.currency}
                                        onChange={(e: any) => {
                                          handleChange(e)
                                        }}

                                        isInvalid={
                                          touched &&
                                          touched.currency &&
                                          errors &&
                                          !!errors.currency
                                        }
                                      >
                                        <option disabled value="">Select
                                        </option>
                                        {currencies.map((value, index) =>
                                          <option key={index}
                                            value={value}>{value} ({getSymbolFromCurrency(value)})</option>)}
                                      </Form.Control>
                                      <Form.Control.Feedback type="invalid">
                                        {errors && errors.currency}
                                      </Form.Control.Feedback>
                                    </Form.Group>
                                  </Grid>

                                </Grid>
                              </Box>

                              <Grid item xs={12} container>
                                {
                                  shopifyStore && shopifyStore.email !== shopifyStore.shop_owner_email && isShopify &&
                                  <div className="mb-2">

                                    <Alert variant="danger">
                                      <span>
                                        You are already logged in on Emailwish with {shopifyStore.email}.
                                        Your Shopify store email is {shopifyStore.shop_owner_email}. Continuing will add this store to {shopifyStore.email} and not {shopifyStore.shop_owner_email} email
                                      </span>
                                    </Alert>

                                  </div>
                                }

                              </Grid>
                              <Grid item xs={12} container justifyContent={"space-between"}>
                                <Button
                                  style={{ color: "red" }}
                                  onClick={() => {
                                    new OnBoardingApis().onboarding_abort(shopifyStore.myshopify_domain).then(value => {
                                      if (isMounted.current) {
                                        setAbortOnboarding(false);
                                        window.location.href = "/";
                                      }
                                    })

                                  }}
                                  disabled={abortingOnboarding}
                                  className="previous-button">
                                  Abort Onboarding
                                </Button>

                                <Button variant="contained" style={{ marginLeft: "auto" }}
                                  onClick={() => {
                                    validateForm().then(((value: any) => {
                                      setFieldTouched("password")
                                      setFieldTouched("currency")
                                      setFieldTouched("owner_first_name")
                                      setFieldTouched("owner_last_name")
                                      if (!value || (!value.password && !value.currency &&
                                        !value.owner_first_name && !value.owner_last_name)) {
                                        setStep("three")
                                      }
                                    }))

                                  }}
                                  className={classes.gettingStartedButton}>
                                  NEXT
                                </Button>
                              </Grid>

                            </Box>

                          </Box>

                        </animated.div>)}
                    </Transition>}
                    {step == 'three' && <Transition items={3} keys={3}
                      from={{ opacity: 0 }}
                      enter={{ opacity: 1 }}
                      leave={{ opacity: 0 }}
                      config={{ duration: 1000 }}
                    >
                      {page => (props =>
                        <animated.div style={{ ...props, height: "100%" }}>
                          <Box display={"flex"} height={"100%"}
                            flexDirection={"column"}>
                            <div className={classes.loginFormLogo}>
                              <div>
                                <img src={logo} alt="Emailwish logo" />
                              </div>
                            </div>
                            <Box flex={1}>
                              <Typography variant={"h4"}>
                                Signature
                              </Typography>
                              <p>
                                This will be used in your email templates and email
                                builder by default
                              </p>
                              <div>
                                <Grid container spacing={2}>
                                  <Grid item xs={12}>
                                    <Row>

                                      <Col md={12}>

                                        <div className="chat-settings-photo">
                                          <div
                                            className="chat-settings-photo__image">
                                            <div>
                                              {
                                                image && image.preview &&
                                                <img src={image.preview}
                                                  alt="profile" />
                                              }
                                            </div>


                                          </div>

                                          <Form.Group className="m-0">
                                            <input

                                              // @ts-ignore
                                              ref={el => inputRef.current[0] = el}
                                              type="file"
                                              id="upload-button"
                                              style={{ display: "none" }}
                                              onChange={(e: any) => {
                                                if (e.target.files.length) {

                                                  setFieldValue("logo", e.target.files[0])
                                                  setImage({
                                                    preview: URL.createObjectURL(e.target.files[0]),
                                                    raw: e.target.files[0]
                                                  });
                                                }
                                              }}
                                            />
                                            <Form.Control hidden
                                              isInvalid={
                                                touched &&
                                                touched.logo &&
                                                !!(errors &&
                                                  errors.logo)
                                              } />
                                            <Form.Control.Feedback
                                              className="text-center"
                                              type="invalid">
                                              {errors && errors.logo}
                                            </Form.Control.Feedback>
                                          </Form.Group>
                                          <span>

                                            Max Size 1MB
                                          </span>
                                          <div
                                            className="chat-settings-photo__button2">
                                            <Button color="secondary"
                                              variant="contained"
                                              type="button"
                                              className="mt-1"
                                              onClick={() => {
                                                setFieldTouched("logo", true)
                                                // @ts-ignore
                                                inputRef.current[0].click()
                                              }}>
                                              Choose logo
                                            </Button>
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Form.Group data-tut="reactour__review_primary_background_color">
                                      <Form.Label>
                                        Brand color
                                      </Form.Label>
                                      <ColorSketchPicker
                                        defaultValue={values.primary_background_color}
                                        onChange={(v) => {
                                          setFieldValue("primary_background_color", v);
                                        }}
                                      />
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Form.Group data-tut="reactour__review_secondary_background_color">
                                      <Form.Label>
                                        Accent color
                                      </Form.Label>
                                      <ColorSketchPicker
                                        defaultValue={values.secondary_background_color}
                                        onChange={(v) => {
                                          setFieldValue("secondary_background_color", v);
                                        }}
                                      />
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaUser
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Full name"
                                          name="full_name"
                                          value={values.full_name}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}
                                          isInvalid={
                                            touched &&
                                            touched.full_name &&
                                            errors &&
                                            !!errors.full_name
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.full_name}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaIdBadge
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Designation"
                                          name="designation"
                                          value={values.designation}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}
                                          isInvalid={
                                            touched &&
                                            touched.designation &&
                                            errors &&
                                            !!errors.designation
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.designation}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaLink
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Website"
                                          name="website"
                                          value={values.website}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}
                                          isInvalid={
                                            touched &&
                                            touched.website &&
                                            errors &&
                                            !!errors.website
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.website}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaPhoneAlt
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Phone Number"
                                          name="phone"
                                          value={values.phone}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}
                                          isInvalid={
                                            touched &&
                                            touched.phone &&
                                            errors &&
                                            !!errors.phone
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.phone_number}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>
                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaFacebookSquare
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Facebook URL"
                                          name="facebook"
                                          value={values.facebook}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}
                                          isInvalid={
                                            touched &&
                                            touched.facebook &&
                                            errors &&
                                            !!errors.facebook
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.facebook}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>


                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaInstagramSquare
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Instagram URL"
                                          name="instagram"
                                          value={values.instagram}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}

                                          isInvalid={
                                            touched &&
                                            touched.instagram &&
                                            errors &&
                                            !!errors.instagram
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.instagram}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>


                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaSkype
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Skype URL"
                                          name="skype"
                                          value={values.skype}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}
                                          isInvalid={
                                            touched &&
                                            touched.skype &&
                                            errors &&
                                            !!errors.skype
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.skype}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>


                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaLinkedinIn
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Linkedin URL"
                                          name="linkedin"
                                          value={values.linkedin}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}

                                          isInvalid={
                                            touched &&
                                            touched.linkedin &&
                                            errors &&
                                            !!errors.linkedin
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.linkedin}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>


                                  </Grid>
                                  <Grid item xs={4}>
                                    <Form.Group>
                                      <InputGroup className="align-items-center">
                                        <InputGroup.Prepend className="pr-3">
                                          <FaTwitter
                                            className="icon" />
                                        </InputGroup.Prepend>
                                        <Form.Control
                                          placeholder="Twitter URL"
                                          name="twitter"
                                          value={values.twitter}
                                          onChange={(e: any) => {
                                            handleChange(e)
                                          }}

                                          isInvalid={
                                            touched &&
                                            touched.twitter &&
                                            errors &&
                                            !!errors.twitter
                                          }
                                        >
                                        </Form.Control>
                                        <Form.Control.Feedback
                                          type="invalid">
                                          {errors && errors.twitter}
                                        </Form.Control.Feedback>
                                      </InputGroup>
                                    </Form.Group>


                                  </Grid>
                                </Grid>
                              </div>

                              <Grid container
                                direction="row"
                                spacing={2}
                                alignItems="flex-start"
                                justifyContent="space-between">
                                <Grid item>
                                  <Button className="previous-button"
                                    onClick={() => setStep('two')}>PREVIOUS
                                    STEP</Button>
                                </Grid>
                                <Grid item>
                                  <Button variant="contained"
                                    className={classes.gettingStartedButton}
                                    onClick={() => {

                                      validateForm().then(((value: any) => {
                                        setFieldTouched("name")
                                        if (!value || (!value.name)) {
                                          setStep("four")
                                        }
                                      }))
                                    }}>
                                    NEXT
                                  </Button>
                                </Grid>
                              </Grid>
                            </Box>

                          </Box>
                        </animated.div>
                      )}
                    </Transition>}
                    {step === 'four' && <Transition items={2} keys={2}
                      from={{ opacity: 0 }}
                      enter={{ opacity: 1, }}
                      leave={{ opacity: 0 }}
                      config={{ duration: 500 }}>
                      {page => (props =>
                        <animated.div style={{ ...props, height: "100%" }}>
                          <Box display={"flex"} height={"100%"} flexDirection={"column"}>
                            <div className={classes.loginFormLogo}>
                              <div>
                                <img src={logo} alt="Emailwish logo" />
                              </div>
                            </div>
                            <Box flex={1}>
                              <Grid container spacing={1}>
                                {plans.map(plan => {
                                  const selected = values.selected_plan_id === plan.id.toString();
                                  return <Grid item xs={3}>
                                    <PlanCard plan={plan} selected={selected}
                                      onPlanSelect={() => {
                                        setFieldValue("selected_plan_id", plan.id.toString())
                                        setFieldValue("selected_plan_price", plan.price)
                                        //woocommerceStore["selected_plan_id"] = plan.id.toString()
                                      }} />
                                  </Grid>
                                })}
                                <Grid xs={12}>
                                  <Typography align="right">
                                    Know more about <a
                                      href="https://emailwish.com/pricing/"
                                      target="_blank" rel="noopener noreferrer"
                                      style={{ color: "#6500ff" }}>Pricing</a>
                                  </Typography>
                                </Grid>
                                <Grid xs={12}>
                                  <Form.Group>
                                    <Form.Control
                                      hidden
                                      name="selected_plan_id"
                                      value={values.selected_plan_id}
                                      onChange={(e: any) => {
                                        handleChange(e)
                                      }}

                                      isInvalid={
                                        touched &&
                                        touched.selected_plan_id &&
                                        errors &&
                                        !!errors.selected_plan_id
                                      }
                                    >
                                    </Form.Control>
                                    <Form.Control.Feedback type="invalid">
                                      {errors && errors.selected_plan_id}
                                    </Form.Control.Feedback>
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Control
                                      hidden
                                      name="api_key"
                                      value={values.api_key}>
                                    </Form.Control>
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Control
                                      hidden
                                      name="platform"
                                      value={values.platform}>
                                    </Form.Control>
                                  </Form.Group>
                                  <Form.Group>
                                    <Form.Control
                                      hidden
                                      name="api_secret"
                                      value={values.api_secret}>
                                    </Form.Control>
                                  </Form.Group>
                                </Grid>
                              </Grid>
                              <Grid container
                                direction="row"
                                spacing={2}
                                className="button-item"
                                alignItems="flex-start"
                                justifyContent="space-between">

                                <Grid item>
                                  <Form.Group>
                                    <Form.Control type="text" placeholder="Enter Coupon Code" name="coupon" onChange={(event) => { setFieldValue('coupon', event.target.value) }} defaultValue={values.coupon} />
                                    <Button color="secondary" variant="outlined" onClick={() => {
                                      new OnBoardingApis().use_coupon(values.coupon).then((res) => {
                                        if (res.plan !== undefined) {
                                          setPlans(res.plan);
                                        };
                                      });
                                    }}>Use Coupon</Button>
                                  </Form.Group>
                                </Grid>
                                <Grid item>
                                  <Button className="previous-button"
                                    onClick={() => setStep('three')}>
                                    PREVIOUS STEP
                                  </Button>
                                </Grid>
                                <Grid item>
                                  <Button variant="contained"
                                    className={classes.gettingStartedButton}
                                    onClick={() => {
                                      console.log('price ', values.selected_plan_price);
                                      if (isShopify || values.selected_plan_price < 0.01) {
                                        submitForm().then(() => {
                                          console.log("on submit");
                                        })
                                      } else {
                                        validateForm().then(((value: any) => {
                                          setFieldTouched("selected_plan_id")
                                          setFieldTouched("currency")
                                          setFieldTouched("owner_first_name")
                                          setFieldTouched("owner_last_name")
                                          if (!value || (!value.selected_plan_id)) {
                                            setStep("five")
                                          }
                                        }))

                                      }

                                    }}
                                  >
                                    {isShopify ? "Finish" : "Next"}
                                  </Button>
                                </Grid>
                              </Grid>
                              {/* {!isShopify && 
                                                            <Grid xs={12}>
                                                                <Typography variant={"h5"}>
                                                                    All plans include a 14 day free trial. Click next to begin.
                                                                </Typography>
                                                            </Grid>
                                                        } */}
                            </Box>

                          </Box>

                        </animated.div>)}
                    </Transition>}
                    {step === 'five' && <Transition items={2} keys={2}
                      from={{ opacity: 0 }}
                      enter={{ opacity: 1, }}
                      leave={{ opacity: 0 }}
                      config={{ duration: 500 }}>
                      {page => (props =>
                        <animated.div style={{ ...props, height: "100%" }}>
                          <Box display={"flex"} height={"100%"} flexDirection={"column"}>
                            <div className={classes.loginFormLogo}>
                              <div>
                                <img src={logo} alt="Emailwish logo" />
                              </div>
                            </div>
                            <Box flex={1}>
                              <Grid container spacing={1} className="pb-4">
                                <Grid container spacing={3}>
                                  <Grid item xs={12}>
                                    <Typography variant="h4" align="center">
                                      Choose a Payment Method
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={12} sm={6}>
                                    <Paper className={classes.paper}>
                                      <FaCcPaypal style={{ fontSize: "100px" }} />
                                      <Button
                                        variant="contained"
                                        color="primary"
                                        fullWidth
                                        className={classes.button}
                                        onClick={() => handlePayPalClick(values.selected_plan_id)}
                                      >
                                        Pay with PayPal
                                      </Button>
                                    </Paper>
                                  </Grid>
                                  {/* <Grid item xs={12} sm={6}> */}
                                  {/*   <Paper className={classes.paper}> */}
                                  {/*     <FaTag style={{ fontSize: "100px" }} /> */}
                                  {/*     <Button */}
                                  {/*       variant="contained" */}
                                  {/*       color="secondary" */}
                                  {/*       fullWidth */}
                                  {/*       className={classes.button} */}
                                  {/*       onClick={() => { */}
                                  {/*         submitForm().then(() => { */}
                                  {/*         }) */}
                                  {/*       }} */}
                                  {/*     > */}
                                  {/*       Start 14 day Free Trial */}
                                  {/*     </Button> */}
                                  {/*   </Paper> */}
                                  {/* </Grid> */}
                                  {/* <Grid item xs={12} sm={6}>
                                                            <Paper className={classes.paper}>
                                                                <FaStripe  style={{fontSize:"100px"}} />
                                                                <Button
                                                                variant="contained"
                                                                color="primary"
                                                                fullWidth
                                                                className={classes.button}
                                                                onClick={handleStripeClick}
                                                                >
                                                                Pay with Stripe
                                                                </Button>
                                                            </Paper>
                                                            </Grid> */}
                                </Grid>
                              </Grid>
                              <Grid container
                                direction="row"
                                spacing={2}
                                className="button-item"
                                alignItems="flex-start"
                                justifyContent="space-between">

                                <Grid item>
                                  <Button className="previous-button"
                                    onClick={() => setStep('four')}>
                                    PREVIOUS STEP
                                  </Button>
                                </Grid>
                                <Grid item>
                                </Grid>
                              </Grid>
                            </Box>

                          </Box>

                        </animated.div>)}
                    </Transition>}
                  </div>}
              </div>
            </div>
          </form>
        }}
      </Formik>

    </div>

  </div>
}

export default RegisterComplete;
