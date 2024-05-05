import React, {useCallback, useContext, useEffect, useState} from "react";
import EmailCampaignAPIs, {iEmailCampaignViewResponse,} from "../../../../apis/Email/email.campaigns.apis";
import {Alert, Col, Row} from "react-bootstrap";
import {iEmailCampaign} from "../../../../types/internal/email/campaign";
import {useParams} from "react-router-dom";
import AppLoader from "../../../../components/Loader/AppLoader";
import {NotificationContext} from "../../../../App";

function EmailCampaignsReview() {
    useEffect(() => {
        document.title = "Campaign Email Review | Emailwish";
    }, []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resource, setResource] = useState<iEmailCampaign>();
    const [frameUrl, setFrameUrl] = useState("");
    const params: any = useParams<any>();

    const notificationContext = useContext(NotificationContext);
    useEffect(() => {
        fetchResource();
    }, [params]);

    const fetchResource = useCallback(() => {
        setLoading(true);
        setError("");
        new EmailCampaignAPIs().view(params.uid).then((r) => onFetchResourceResponse(r));
    }, [params]);

    const onFetchResourceResponse = useCallback((response: iEmailCampaignViewResponse) => {
        if (EmailCampaignAPIs.hasError(response, notificationContext,) || !response.campaign) {
            setLoading(false);
            setError(EmailCampaignAPIs.getError(response));
        } else {
            setLoading(false);
            setError("");
            setResource(response.campaign);
            if (response && response.campaign && response.campaign.uid)
                setFrameUrl(
                    new EmailCampaignAPIs().getTemplateReviewURL(response.campaign.uid)
                );
        }
    }, []);
    if (loading) {
        return <AppLoader/>
    }

    return (
        <div className="mt-2">
            <Row>
                <Col xl={12}>
                    <br/>
                    {error ? <Alert variant="danger">{error}</Alert> : null}

                    {frameUrl ? (
                        <embed
                            style={{width: "100%", height: 500}}
                            src={frameUrl}
                            title="template_review"
                        />
                    ) : null}

                </Col>
            </Row>
        </div>
    );
}

export default EmailCampaignsReview;
