import React, {useCallback, useContext, useEffect, useState} from "react";
import useIsMounted from "ismounted";
import {useHistory, useParams} from "react-router-dom";

import EmailCampaignAPIs from "../../../../apis/Email/email.campaigns.apis";
import {iEmailCampaign} from "../../../../types/internal/email/campaign";
import AppLoader from "../../../../components/Loader/AppLoader";
import {Step, StepButton, StepConnector, Stepper, withStyles} from "@material-ui/core";
import {EmailCampaignsTemplate} from "./Email.Campaigns.Template";

import EmailCampaignsRecipients from "./Email.Campaigns.Recipients";
import EmailCampaignsSetup from "./Email.Campaigns.Setup";
import EmailCampaignsSchedule from "./Email.Campaigns.Schedule";
import WithBreadCrumb from "../../../../components/Breadcrumbs/WithBreadcrumb";
import {NotificationContext} from "../../../../App";
import AppCard from "../../../../components/Card/AppCard";
import AppCardBody from "../../../../components/Card/AppCardBody";

const QontoConnector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    active: {
        '& $line': {
            borderColor: '#784af4',

        },
    },
    completed: {
        '& $line': {
            borderColor: '#784af4',
        },
    },
    line: {
        borderColor: '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
})(StepConnector);

const Recipients = "Recipients";
const Setup = "Setup";
const Template = "Template";
const Confirm = "Confirm";

const steps = [Recipients, Setup, Template, Confirm];


export const EmailCampaignsViewContext = React.createContext({});

function EmailCampaignsView() {
    const [loading, setLoading] = useState(true);
    const [error_message, setErrorMessage] = useState("");
    const [resource, setResource] = useState<iEmailCampaign | undefined>(undefined);

    const params: any = useParams<any>();
    const isMounted = useIsMounted();

    const notificationContext = useContext(NotificationContext);
    const history = useHistory();
    const [activeStep, setActiveStep] = useState(0);
    const fetchResource = useCallback(() => {
        setLoading(true);
        setErrorMessage("");
        new EmailCampaignAPIs().view(params.uid).then(response => {
            if (isMounted.current) {
                if (EmailCampaignAPIs.hasError(response, notificationContext) || !response.campaign) {
                    setErrorMessage(EmailCampaignAPIs.getError(response));
                    setResource(undefined);
                } else {
                    if (
                        response.campaign.status === "new" ||
                        response.campaign.status === "ready" ||
                        response.campaign.status === "error"
                    ) {
                        if (response.campaign.step < 3) {
                            setActiveStep(response.campaign.step);
                        } else {
                            setActiveStep(3);
                        }
                        setErrorMessage("");
                        setResource(response.campaign);
                        setLoading(false);
                    } else {
                        history.replace(`/email/campaigns/${params.uid}/overview`)
                    }

                }

            }
        })
    }, [params, isMounted])

    useEffect(() => {
        fetchResource();
    }, []);

    const handleStep = useCallback((step: number) => () => {
        setActiveStep(step);
        if (resource) {
            let _resource = {...resource};
            if (_resource.step < step) {
                _resource.step = step;
                setResource(_resource)
            }
        }
    }, [resource]);


    if (loading)
        return <AppLoader/>;

    if (!resource) return null;


    return <WithBreadCrumb>
        <div className="mt-2">
            <Stepper alternativeLabel
                     activeStep={activeStep}
                     nonLinear
                     className="app-card">
                {steps.map((label, index) => {

                        return <Step key={label}>
                            <StepButton
                                onClick={resource && resource.step >= index ? handleStep(index) : undefined}
                                completed={resource &&
                                (resource.step > index || index < activeStep)
                                && activeStep !== index}>
                                {label}
                            </StepButton>
                        </Step>
                    }
                )}
            </Stepper>
            <AppCard className="mt-1">
                <AppCardBody>
                    <EmailCampaignsViewContext.Provider value={{setActiveStep}}>
                        {
                            activeStep === 0 && <EmailCampaignsRecipients uid={resource.uid}/>
                        }
                        {
                            activeStep === 1 && <EmailCampaignsSetup uid={resource.uid}/>
                        }
                        {
                            activeStep === 2 && <EmailCampaignsTemplate uid={resource.uid}/>
                        }
                        {
                            activeStep >= 3 && <EmailCampaignsSchedule uid={resource.uid}/>
                        }
                    </EmailCampaignsViewContext.Provider>
                </AppCardBody>
            </AppCard>
        </div>
    </WithBreadCrumb>;
}

export default EmailCampaignsView;
