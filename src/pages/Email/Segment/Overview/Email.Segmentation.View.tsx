import React, {useContext, useEffect, useState} from "react";
import {BreadCrumbContext, BreadCrumbLink} from "../../../../components/Breadcrumbs/WithBreadcrumb";
import {iEmailSegment} from "../../../../apis/Email/email.segmentation";

export default function EmailSegmentationView() {
    const [segment2, setSegment2] = useState<iEmailSegment | undefined>();

    const breadcrumb = useContext(BreadCrumbContext);

    useEffect(() => {
        if (breadcrumb.setLinks) {
            let links: BreadCrumbLink[] = []
            links.push({
                link: "/email/segments",
                text: "Segments"
            })
            if (segment2) {
                links.push({
                    link: `/email/segments/${segment2.uid}/overview`,
                    text: segment2.name
                })
            }
            breadcrumb.setLinks(links);
        }
    }, [segment2])

    return <div/>
}