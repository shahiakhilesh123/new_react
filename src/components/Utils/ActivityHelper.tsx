import React from "react";
import {iEmailDashboardActivity} from "../../types/internal";

interface Props {
    activity: iEmailDashboardActivity
}

export default function ActivityHelper(props: Props) {
    switch (props.activity.type) {
        case "list":
            const list_name = props.activity.extra_data.name;
            const list_count = props.activity.extra_data.count;
            const list_error = props.activity.extra_data.error;
            switch (props.activity.name) {
                case "created":
                    return <>The list "<i>{list_name}</i>" was created!</>;
                case "updated":
                    return <>The list "<i>{list_name}</i>" was updated!</>;
                case "deleted":
                    return <>The list "<i>{list_name}</i>" was deleted!</>;
                case "import_started":
                    return <>The import process for list "<i>{list_name}</i>" started!</>;
                case "import_success":
                    return <>The import process for list "<i>{list_name}</i>" finished, <span
                        className="text-success-600 text-bold">{list_count}</span> record(s) imported, <span
                        className="text-danger text-bold">{list_error}</span> errors!</>;
                case "import_max_error":
                    return <>The import process for list "<i>{list_name}</i>" finished, but reached the maximum
                        quota, {list_count} record(s) imported!</>;
                case "export_started":
                    return <>The export process for list "<i>{list_name}</i>" started!</>;
                case "export_success":
                    return <>The export process for list "<i>{list_name}</i>" finished, <span
                        className="text-success-600 text-bold">{list_count}</span> record(s) exported!</>;
            }
            return null;
        case "segment":
            const segment_name = props.activity.extra_data.name;
            const segment_list_name = props.activity.extra_data.list_name;
            switch (props.activity.name) {
                case "created":
                    return <>A new segment "<i>{segment_name}</i>" has been added to the list
                        "<i>{segment_list_name}</i>"!</>;
                case "updated":
                    return <>The segment "<i>{segment_name}</i>" belonging to the list "<i>{segment_list_name}</i>" was
                        updated!</>;
                case "deleted":
                    return <>The segment "<i>{segment_name}</i>" belonging to the list "<i>{segment_list_name}</i>" was
                        deleted!</>;
            }
            return null;
        case "subscriber":
            const subscriber_email = props.activity.extra_data.email;
            const subscriber_list_name = props.activity.extra_data.list_name;
            switch (props.activity.name) {
                case "created":
                    return <>A new subscriber "<i>{subscriber_email}</i>" has been added to the list
                        "<i>{subscriber_list_name}</i>"!</>;
                case "updated":
                    return <>The subscriber "<i>{subscriber_email}</i>" belonging to the list
                        "<i>{subscriber_list_name}</i>" was updated!</>;
                case "deleted":
                    return <>The subscriber "<i>{subscriber_email}</i>" belonging to the list
                        "<i>{subscriber_list_name}</i>" was deleted!</>;
                case "subscribed":
                    return <>The subscriber "<i>{subscriber_email}</i>" belonging to the list
                        "<i>{subscriber_list_name}</i>" was subscribed!</>;
                case "unsubscribed":
                    return <>The subscriber "<i>{subscriber_email}</i>" belonging to the list
                        "<i>{subscriber_list_name}</i>" was unsubscribed!</>;
            }
            return null;
        case "campaign":
            const campaign_name = props.activity.extra_data.name;
            switch (props.activity.name) {
                case "created":
                    return <>A new campaign "<i>{campaign_name}</i>" was created!</>;
                case "updated":
                    return <>The campaign "<i>{campaign_name}</i>" was updated!</>;
                case "deleted":
                    return <>The campaign "<i>{campaign_name}</i>" was deleted!</>;
                case "paused":
                    return <>The campaign "<i>{campaign_name}</i>" was paused!</>;
                case "restarted":
                    return <>The campaign "<i>{campaign_name}</i>" was restarted!</>;
                case "sent":
                    return <>The campaign "<i>{campaign_name}</i>" was sent!</>;
            }
            return null;
        case "page":
            const page_name = props.activity.extra_data.name;
            const page_list_name = props.activity.extra_data.list_name;
            switch (props.activity.name) {
                case "updated":
                    return <>The page "<i>{page_name}</i>" belonging to the list "<i>{page_list_name}</i>" was
                        updated!</>;
            }
            return null;
    }
    return null;
}

/*
    'log.list.created' => 'The list "<a href=":link">:name</a>" was created!',
    'log.list.updated' => 'The list "<a href=":link">:name</a>" was updated!',
    'log.list.deleted' => 'The list ":name" was deleted!',
    'log.list.import_started' => 'The import process for list "<a href=":link">:name</a>" started!',
    'log.list.import_success' => 'The import process for list "<a href=":link">:name</a>" finished, <span className="text-success-600 text-bold">:count</span> record(s) imported, <span className="text-danger text-bold">:error</span> errors!',
    'log.list.import_max_error' => 'The import process for list "<a href=":link">:name</a>" finished, but reached the maximum quota, :count record(s) imported!',
    'log.list.export_started' => 'The export process for list "<a href=":link">:name</a>" started!',
    'log.list.export_success' => 'The export process for list "<a href=":link">:name</a>" finished, <span className="text-success-600 text-bold">:count</span> record(s) exported!',
    'log.segment.created' => 'A new segment "<a href=":link">:name</a>" has been added to the list "<a href=":list_link">:list_name</a>"!',
    'log.segment.updated' => 'The segment "<a href=":link">:name</a>" belonging to the list "<a href=":list_link">:list_name</a>" was updated!',
    'log.segment.deleted' => 'The segment "<a href=":link">:name</a>" belonging to the list "<a href=":list_link">:list_name</a>" was deleted!',
    'log.subscriber.created' => 'A new subscriber "<a href=":link">:email</a>" has been added to the list "<a href=":list_link">:list_name</a>"!',
    'log.subscriber.updated' => 'The subscriber "<a href=":link">:email</a>" belonging to the list "<a href=":list_link">:list_name</a>" was updated!',
    'log.subscriber.deleted' => 'The subscriber "<a href=":link">:email</a>" belonging to the list "<a href=":list_link">:list_name</a>" was deleted!',
    'log.subscriber.subscribed' => 'The subscriber "<a href=":link">:email</a>" belonging to the list "<a href=":list_link">:list_name</a>" was subscribed!',
    'log.subscriber.unsubscribed' => 'The subscriber "<a href=":link">:email</a>" belonging to the list "<a href=":list_link">:list_name</a>" was unsubscribed!',
    'log.campaign.created' => 'A new campaign "<a href=":link">:name</a>" was created!',
    'log.campaign.updated' => 'The campaign "<a href=":link">:name</a>" was updated!',
    'log.campaign.deleted' => 'The campaign "<a href=":link">:name</a>" was deleted!',
    'log.campaign.paused' => 'The campaign "<a href=":link">:name</a>" was paused!',
    'log.campaign.restarted' => 'The campaign "<a href=":link">:name</a>" was restarted!',
    'log.campaign.started' => 'The campaign "<a href=":link">:name</a>" was started!',
    'log.campaign.sent' => 'The campaign "<a href=":link">:name</a>" was sent!',
    'log.page.updated' => 'The page "<a href=":link">:name</a>" belonging to the list "<a href=":list_link">:list_name</a>" was updated!'
*/
