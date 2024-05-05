import React, {useContext} from "react";
import {makeStyles} from "@material-ui/styles";
import {createStyles, Theme} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {Link, useHistory} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {AppStateContext} from "../../App";
import AppLoader from "../Loader/AppLoader";
import HtmlTooltip from "../Tooltip/HtmlTooltip";
import { Alert } from "react-bootstrap";

export const useUpgradePlan = makeStyles(() =>
    createStyles({
        root: {
            display: "flex",
            justifyContent: "space-between"
        },
        feature: {
            opacity: 0.5
        },
        feature_item: {
            pointerEvents: "none"
        }
    },), {index: 1, classNamePrefix: "upgrade-"},
);

interface UpgradePlanWrapperProps {
    feature_name: string,
    plan_required_text: string,
    children: any
}

interface UpgradePlanWarningProps {
    feature_name: string,
}

export default function UpgradePlanRequired(props: UpgradePlanWrapperProps) {
    const classes = useUpgradePlan();
    const history = useHistory();

    const {shop} = useContext(AppStateContext);
    if (shop && shop.customer && shop.customer.plan) {
        const options = JSON.parse(shop.customer.plan.options)
        if (options && options[props.feature_name] === "yes") {
            return <div>
                {props.children}
            </div>
        } else {
            return <div className={classes.root}>

                <div className={classes.feature}>
                    <HtmlTooltip
                        title={
                            <React.Fragment>
                                <Typography color="inherit">{props.plan_required_text} </Typography>

                            </React.Fragment>
                        }
                    >
                        <div>
                            <div className={classes.feature_item}>
                                {props.children}
                            </div>
                        </div>


                    </HtmlTooltip>
                </div>
                <div>
                    <Button
                        variant={"contained"}
                        color={"secondary"}
                        onClick={() => {
                            history.push("/account/subscription")
                        }}
                    >
                        Upgrade
                    </Button>
                </div>

            </div>
        }

    }
    return <AppLoader/>;
}

export function UpgradePlanWarning(props: UpgradePlanWarningProps) {
    const {shop} = useContext(AppStateContext);
    if (shop && shop.customer && shop.customer.plan) {
        const options = JSON.parse(shop.customer.plan.options)
        if (options && options[props.feature_name] === "no") {
            return (<Alert variant="danger">Your current plan does not include this feature. <Link to="/account/subscription">See Plans</Link></Alert>);
        }
    }
    return (<></>);
}
