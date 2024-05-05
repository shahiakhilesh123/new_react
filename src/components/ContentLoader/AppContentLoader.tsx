import React from "react";
import ContentLoader from 'react-content-loader'
import {Alert, Button} from "react-bootstrap";
import CenterSpinner from "./CenterSpinner";

export interface ContentLoaderProps {
    type?: "folders" | "dots" | "dashboard"
}

const TableRow = (props: any) => {
    const random = Math.random() * (1 - 0.7) + 0.7;
    return (
        <ContentLoader
            height={40}
            width={1060}
            speed={2}
            primaryColor="#d9d9d9"
            secondaryColor="#ecebeb"
            {...props}
        >

            <rect x="0" y="15" rx="4" ry="4" width="6" height="6.4"/>
            <rect x="34" y="13" rx="6" ry="6" width={200 * random} height="12"/>
            <rect x="633" y="13" rx="6" ry="6" width={23 * random} height="12"/>
            <rect x="653" y="13" rx="6" ry="6" width={78 * random} height="12"/>
            <rect x="755" y="13" rx="6" ry="6" width={117 * random} height="12"/>
            <rect x="938" y="13" rx="6" ry="6" width={83 * random} height="12"/>

            <rect x="0" y="39" rx="6" ry="6" width="1060" height=".3"/>
        </ContentLoader>
    )
};

const Table = () => (
    <React.Fragment>
        {Array(10)
            .fill('')
            .map((e, i) => (
                <TableRow key={i} style={{opacity: Number(2 / i).toFixed(1)}}/>
            ))}
    </React.Fragment>
);
const DashboardLoader = () => (
    <ContentLoader
        height={160}
        width={400}
        speed={2}
        primaryColor="#d6e6ed"
        secondaryColor="#EBF3F6"
    >
        <rect x="9" y="10" rx="0" ry="0" width="150" height="72"/>
        <rect x="170" y="10" rx="0" ry="0" width="110" height="72"/>
        <rect x="291" y="10" rx="0" ry="0" width="110" height="72"/>

        <rect x="9" y="90" rx="0" ry="0" width="150" height="72"/>
        <rect x="170" y="90" rx="0" ry="0" width="110" height="72"/>
        <rect x="291" y="90" rx="0" ry="0" width="110" height="72"/>
    </ContentLoader>
);
const Folder = () =>
    (<ContentLoader
        height={507}
        width={900}
        speed={2}
        primaryColor="#f3f3f3"
        secondaryColor="#ecebeb"
    >
        <rect x="30" y="20" rx="0" ry="0" width="130" height="23"/>
        <rect x="30" y="60" rx="0" ry="0" width="200" height="120"/>
        <rect x="30" y="189" rx="0" ry="0" width="200" height="15"/>
        <rect x="30" y="211" rx="0" ry="0" width="140" height="15"/>
        <rect x="243" y="60" rx="0" ry="0" width="200" height="120"/>
        <rect x="243" y="189" rx="0" ry="0" width="200" height="15"/>
        <rect x="243" y="211" rx="0" ry="0" width="140" height="15"/>
        <rect x="455" y="60" rx="0" ry="0" width="200" height="120"/>
        <rect x="455" y="189" rx="0" ry="0" width="200" height="15"/>
        <rect x="455" y="211" rx="0" ry="0" width="140" height="15"/>
        <rect x="667" y="60" rx="0" ry="0" width="200" height="120"/>
        <rect x="667" y="188" rx="0" ry="0" width="200" height="15"/>
        <rect x="667" y="209" rx="0" ry="0" width="140" height="15"/>
        <rect x="30" y="280" rx="0" ry="0" width="130" height="23"/>
        <rect x="30" y="320" rx="0" ry="0" width="200" height="120"/>
        <rect x="30" y="450" rx="0" ry="0" width="200" height="15"/>
        <rect x="30" y="474" rx="0" ry="0" width="140" height="15"/>
        <rect x="243" y="320" rx="0" ry="0" width="200" height="120"/>
        <rect x="455" y="320" rx="0" ry="0" width="200" height="120"/>
        <rect x="667" y="320" rx="0" ry="0" width="200" height="120"/>
        <rect x="243" y="450" rx="0" ry="0" width="200" height="15"/>
        <rect x="455" y="450" rx="0" ry="0" width="200" height="15"/>
        <rect x="667" y="450" rx="0" ry="0" width="200" height="15"/>
        <rect x="243" y="474" rx="0" ry="0" width="140" height="15"/>
        <rect x="455" y="474" rx="0" ry="0" width="140" height="15"/>
        <rect x="667" y="474" rx="0" ry="0" width="140" height="15"/>
    </ContentLoader>);
const ThreeDots = () => (
    <ContentLoader
        height={160}
        width={400}
        speed={2}
        primaryColor="transparent"
        secondaryColor="#3e6f95"
    >
        <circle cx="150" cy="86" r="8"/>
        <circle cx="194" cy="86" r="8"/>
        <circle cx="238" cy="86" r="8"/>
    </ContentLoader>
);

function AppContentLoader(props: ContentLoaderProps) {

    function getLoader() {
        if (props.type) {
            switch (props.type) {
                case "folders":
                    return <Folder/>;
                case "dots":
                    return <ThreeDots/>;
                case "dashboard":
                    return <DashboardLoader/>
            }
        }
        return <Table/>
    }

    return <React.Fragment>
        <div className="m-3">
            {getLoader()}
        </div>
    </React.Fragment>;

}

export function AppContentLoaderFunction(props: any) {
    if (props.error) {
        return <Alert type="danger" className="mt-1"><h5>It seems that you not connected to the internet!</h5>
            <Button onClick={() => {
                window.location.reload();
            }}>Reload</Button></Alert>;
    } else if (props.timedOut) {
        return <Alert type="danger" className="mt-1"><h5>It seems that you not connected to the internet!</h5>
            <Button onClick={() => {
                window.location.reload();
            }}>Reload</Button></Alert>;
    } else if (props.pastDelay) {
        return <AppContentLoader type="dashboard"/>;
    } else {
        return null;
    }
}

export function AppContentSpinnerFunction(props: any) {
    if (props.error) {
        return <Alert type="danger" className="mt-1"><h5>It seems that you not connected to the internet!</h5>
            <Button onClick={() => {
                window.location.reload();
            }}>Reload</Button></Alert>;
    } else if (props.timedOut) {
        return <Alert type="danger" className="mt-1"><h5>It seems that you not connected to the internet!</h5>
            <Button onClick={() => {
                window.location.reload();
            }}>Reload</Button></Alert>;
    } else if (props.pastDelay) {
        return <CenterSpinner/>;
    } else {
        return null;
    }
}

export default AppContentLoader;