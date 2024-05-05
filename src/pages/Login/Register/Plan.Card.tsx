import React from "react";
import "./plan.card.scss"
import {iPlan} from "../../../types/api";
import Typography from "@material-ui/core/Typography";
import {Button} from "react-bootstrap";

export default function PlanCard({
                                     plan,
                                     selected,
                                     onPlanSelect
                                 }: { plan: iPlan, selected: boolean, onPlanSelect: any }) {
    const options = JSON.parse(plan.options);
    return <div className="plan-card">
        <Typography align={"center"} className="plan-card-title">
            {plan.name}
        </Typography>
        <div className="plan-card-price-wrapper">
            <span className="plan-card-price-amount">${plan.price}</span><span
            className="plan-card-price-per-month">/month</span>
        </div>
        <div className="plan-card-price-detail">
            Get {options && options.email_max_free} Emails.
            <br/>
            <br/>
            After {options && options.email_max_free} emails <span
            className="plan-card-price-detail-highlight">${plan.usage_rate}</span> for every 1000 emails.
        </div>
        <div className="plan-card-price-button" onClick={onPlanSelect}>
            <Button className={`${selected ? "plan-card-price-button-selected" : ""}`}>
                {selected ? "Selected" : "Select"}
            </Button>
        </div>
    </div>
}
