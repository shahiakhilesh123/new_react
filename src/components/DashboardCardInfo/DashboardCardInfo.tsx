import React from "react";

function DashboardCardInfo({link, text}: { text: string, link?: string, }) {
    return <div className="d-flex justify-content-center align-items-center h-100 w-100">
        {text}
    </div>
}

export default DashboardCardInfo;