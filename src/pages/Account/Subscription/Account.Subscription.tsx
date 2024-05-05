import React, { Dispatch, useCallback, useContext, useEffect, useState } from "react";
import { AppDispatchContext, AppStateContext, NotificationContext } from "../../../App";
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";
import { Button, Theme } from "@material-ui/core";
import { Table } from "react-bootstrap";
import "./styles.scss"
import { FaCheck } from "react-icons/all";
import Tooltip from "@material-ui/core/Tooltip";
import InfoIcon from '@material-ui/icons/Info';
import withStyles from "@material-ui/core/styles/withStyles";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Container from "@material-ui/core/Container";
import OnBoardingApis from "../../../apis/onboarding.apis";
import useIsMounted from "ismounted";
import UserAPIs from "../../../apis/user.apis";
import { iStoreAction } from "../../../redux/reducers";
import { useHistory, useLocation } from "react-router-dom";
import AppLoader from "../../../components/Loader/AppLoader";
import Badge from "@material-ui/core/Badge";
import HtmlTooltip from "../../../components/Tooltip/HtmlTooltip";


export default function AccountSubscription() {
  useEffect(() => {
    document.title = "Subscription | Emailwish";
  }, []);
  const { shop, plans, loggedInUser } = useContext(AppStateContext);
  const isMounted = useIsMounted();

  const location = useLocation();
  const dispatch: Dispatch<iStoreAction> = useContext(AppDispatchContext);
  const [loading, setLoading] = useState(true);
  const notificationContext = useContext(NotificationContext);
  const features = (): any[] => {

    return [
      {
        feature: "Email Limit",
        description: "Total number of emails available with different package each month.",
        data: (plans && plans.map((value => {
          let options = value.options_object;
          if (options) {
            return options.email_max_free
          }
          return null;
        }))
        ) || []
      },
      {
        feature: "Pricing after Limit",
        description: "The given price will be charged for every 1000 emails after the initial limit is exhausted.",
        data: (plans && plans.map((value => {
          return "$" + value.usage_rate + "/1000 email"
        }))
        ) || []
      },
      {
        feature: "Chat Bots & Live Chat App Module",
        description: "Availability of Chat module with the following package. It is not charged separately.",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      {
        feature: "Review App Module",
        description: "Availability of Review module with the following package. It is not charged separately.",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      {
        feature: "Popup App Module",
        description: "Availability of Popup module with the following package. It is not charged separately.",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      {
        feature: "Automations",
        description: "Automations are personalized emails sent automatically to the customers. There is no limit on how many you can create.",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      {
        feature: "Segmentations",
        description: "Segmentations are customer groups updated automatically based on demographics and their behaviour. There is no limit on how many you can create. ",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      // {
      //     feature: "Inbox",
      //     description: "With Emailwish, you can manage and take complete control over your inbox.",
      //     data: (plans && plans.map((value => {
      //             return "Coming Soon"
      //         }))
      //     ) || []
      // },
      {
        feature: "Pre Built Templates",
        description: "Pre-built templates for emails, chat bots & popups.",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      {
        feature: "A/B Testing",
        description: "A/B testing facility to analyze various customer group and their responses on different email campaigns, popups & automations.",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      {
        feature: "Custom Branding",
        description: "The ability to remove Emailwish branding.",
        data: (plans && plans.map((value => {
          return true;
        }))
        ) || []
      },
      // {
      //     feature: "Number of Team Members Allowed",
      //     description: "This is the total number of team members you can add in your Emailwish account including you.",
      //     data: (plans && plans.map((value => {
      //             return ""
      //         }))
      //     ) || []
      // },
      {
        feature: "Support",
        description: "At Emailwish we provide you with the highest standard of support.",
        data: (plans && plans.map((value => {
          return true
        }))
        ) || []
      },
      // {
      //     feature: "Emailwish Agents for Hire",
      //     description: "Our exclusive in-house team at your service to be your chat agents working 24x7.",
      //     data: (plans && plans.map((value => {
      //             return "Available @$800/month"
      //         }))
      //     ) || []
      // },

    ]
  };

  const history = useHistory();
  const onFetchUser = useCallback(() => {
    setLoading(true);
    new UserAPIs().fetch_user().then((response) => {
      if (isMounted.current) {
        if (UserAPIs.hasError(response, notificationContext)) {
          setLoading(false);
        } else {
          if (response.user) {
            let plans = response.plans && response.plans.map((value => {
              let options_object = JSON.parse(value.options);
              return { ...value, options_object: options_object }
            }))
            dispatch({
              type: "set_plans",
              plans: plans,
            })
            if (shop && response.shops && response.shops.length > 0) {

              dispatch({
                type: "set_logged_in_user",
                loggedInUser: response.user,
              })
            } else {
              dispatch({
                type: "set_logged_in_user",
                loggedInUser: response.user,
              })
              history.replace("/register")
            }

          }
          setLoading(false);
        }
      }
    });
  }, [isMounted, shop]);

  useEffect(() => {
    onFetchUser();
  }, []);

  if (loading) {
    return <AppLoader />
  }
  return <AppCard>
    <AppCardBody className="p-3">
      <div className="mt-2">

        <Container>
          <div className="d-flex justify-content-between mb-2">
            <div>
              <h6>
                Active Subscription
              </h6>
            </div>
            <div>
              <h6>
                {
                  shop && shop.customer && shop.customer.plan && shop.customer.plan.name
                }
              </h6>
            </div>
          </div>

          <Table responsive className="plan-table" bordered striped>
            <thead>
              <tr>
                <th className="plan-table-feature-th">
                  <h3>
                    Key Features
                  </h3>
                  <p>
                    EmailWish features for your ecommerce store .
                  </p>
                </th>
                {
                  plans && plans.map((value, index) => {

                    const current_plan = shop && shop.customer && shop.customer.plan && shop.customer.plan;

                    return <th key={index} className="plan-table-data-th">
                      <div className="plan-table-data-th-wrapper">
                        <div>
                          {
                            current_plan && value && current_plan.id === value.id &&
                            <Badge badgeContent={"Active"} color="primary">
                              <div className="pt-3">
                                <h3>
                                  {value.name}
                                </h3>
                              </div>

                            </Badge>
                          }
                          {
                            current_plan && value && current_plan.id !== value.id &&
                            <h3>
                              {value.name}
                            </h3>
                          }
                        </div>
                        <div>
                          <p>
                            ${value.price}/month
                          </p>
                        </div>
                        <div>
                          {
                            !current_plan &&
                            <Button color={"primary"} variant={"outlined"}
                              onClick={() => {
                                if (shop && value) {
                                  new OnBoardingApis().change_plan(shop.myshopify_domain, value.id).then((res) => {
                                    if (isMounted.current) {
                                      if (OnBoardingApis.hasError(res, notificationContext)) {
                                      } else {
                                        if (res.redirectURL) {
                                          window.location.href = res.redirectURL;
                                        }
                                      }
                                    }
                                  });
                                }
                              }}>
                              Upgrade
                            </Button>
                          }
                          {
                            current_plan && current_plan.id !== value.id &&
                            parseInt(current_plan.price) < parseInt(value.price) &&
                            <Button color={"primary"} variant={"outlined"}
                              onClick={() => {
                                if (shop && value) {
                                  new OnBoardingApis().change_plan(shop.myshopify_domain, value.id).then((res) => {
                                    if (isMounted.current) {
                                      if (OnBoardingApis.hasError(res, notificationContext)) {
                                      } else {
                                        if (res.redirectURL) {
                                          window.location.href = res.redirectURL;
                                        }
                                      }
                                    }
                                  })
                                }
                              }}>
                              Upgrade
                            </Button>
                          }
                          {
                            current_plan && current_plan.id !== value.id &&
                            parseInt(current_plan.price) > parseInt(value.price) &&
                            <Button color={"primary"} variant={"outlined"}
                              onClick={() => {
                                if (shop && value) {
                                  new OnBoardingApis().change_plan(shop.myshopify_domain, value.id).then((res) => {
                                    if (isMounted.current) {
                                      if (OnBoardingApis.hasError(res, notificationContext)) {
                                      } else {
                                        if (res.redirectURL) {
                                          window.location.href = res.redirectURL;
                                        }
                                      }
                                    }
                                  })
                                }
                              }}>
                              Downgrade
                            </Button>
                          }
                        </div>
                      </div>


                    </th>
                  })
                }
              </tr>
            </thead>
            <tbody>
              {
                features().map((value, index) => {
                  return <tr key={index}>
                    <td className="plan-table-feature-tbody-td">
                      <div>
                        {value.feature}
                      </div>
                      <div>
                        <HtmlTooltip
                          title={
                            <React.Fragment>
                              <Typography color="inherit">{value.description} </Typography>
                            </React.Fragment>
                          }
                        >
                          <IconButton>
                            <InfoIcon style={{ color: "white" }} />
                          </IconButton>
                        </HtmlTooltip>

                      </div>
                    </td>
                    {
                      value.data.map((data: any, index: any) => {
                        if (typeof data === "boolean") {
                          return <td key={index} className="plan-table-data-tbody-td">
                            {
                              data && <FaCheck />
                            }
                            {
                              !data && "No"
                            }
                          </td>
                        }
                        return <td key={index} className="plan-table-data-tbody-td">{data}</td>
                      })
                    }
                  </tr>
                })
              }

            </tbody>
          </Table>

        </Container>


      </div>
    </AppCardBody>
  </AppCard>;
}
