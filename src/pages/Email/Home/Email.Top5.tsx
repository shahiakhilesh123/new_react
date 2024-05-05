import React from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardBody from "../../../components/Card/AppCardBody";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppLoader from "../../../components/Loader/AppLoader";
import {Alert} from "react-bootstrap";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import {TabPanel} from "../Templates/Email.Templates.Create";
import {iEmailDashboardTopClick, iEmailDashboardTopLink, iEmailDashboardTopOpen} from "../../../types/internal";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import DashboardCardInfo from "../../../components/DashboardCardInfo/DashboardCardInfo";

interface iProps {
    loading: boolean,
    error?: string,
    topOpens?: iEmailDashboardTopOpen[],
    topClicks?: iEmailDashboardTopClick[],
    topLinks?: iEmailDashboardTopLink[]
}

export default function EmailTop5(props: iProps) {


    const [value, setValue] = React.useState(0);
    const handleChange = (event: any, newValue: any) => {
        setValue(newValue);
    };
    return <AppCard>
        <AppCardHeader>
            <AppCardTitle>
                Top 5
            </AppCardTitle>
        </AppCardHeader>
        <AppCardBody className="p-0">
            <div style={{padding: "0rem 1.25rem"}}>
                <Tabs indicatorColor="primary" onChange={handleChange} value={value} textColor="primary"
                      aria-label="disabled tabs example">
                    <Tab label="Campaign Opens" className="top-5-tab"/>
                    <Tab label="Campaign Clicks" className="top-5-tab"/>
                    <Tab label="Clicked Links" className="top-5-tab"/>
                </Tabs>
                <TabPanel value={value} index={0}>
                    {
                        props.loading && <AppLoader/>
                    }
                    {
                        props.error && <Alert>Something went wrong!</Alert>
                    }
                    {
                        props.topOpens && <TableContainer className="top-5-table">

                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className="text-left">SL No</TableCell>
                                        <TableCell className="text-left">Name of Campaign</TableCell>
                                        <TableCell>Opens</TableCell>
                                        <TableCell>Unique Opens</TableCell>
                                        <TableCell>Last Date</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        props.topOpens.length === 0 && <TableRow className="no-shadow">
                                            <TableCell align="center" colSpan={5}>
                                                <div>
                                                    <DashboardCardInfo text={"There are no records to display."}/>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    }
                                    {props.topOpens.length > 0 && props.topOpens.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell scope="row">
                                                <p className="pl-2 mt-1 mb-0 text-left">{index + 1}</p>
                                            </TableCell>
                                            <TableCell><p className={"mt-2 m-0 text-left"}>
                                                {row.name}
                                            </p></TableCell>
                                            <TableCell>{row.opens}</TableCell>
                                            <TableCell>{row.opens_unique}</TableCell>
                                            <TableCell>{row.last_open}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                        </TableContainer>}
                </TabPanel>
                <TabPanel value={value} index={1}>
                    {
                        props.loading && <AppLoader/>
                    }
                    {
                        props.error && <Alert>Something went wrong!</Alert>
                    }{

                }
                    {props.topClicks &&
                    <TableContainer className="top-5-table">
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="text-left">SL No</TableCell>
                                    <TableCell className="text-left">Name of Campaign</TableCell>
                                    <TableCell>Clicks</TableCell>
                                    <TableCell>Last click</TableCell>
                                    <TableCell>Recipients</TableCell>
                                    <TableCell>URLs</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.topClicks && props.topClicks.length === 0 && <TableRow className="no-shadow">
                                        <TableCell align="center" colSpan={6}>
                                            <div>
                                                <DashboardCardInfo text={"There are no records to display."}/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                }
                                {props.topClicks && props.topClicks.length > 0 && props.topClicks.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell scope="row">
                                            <p className="pl-2 mt-1 mb-0 text-left">{index + 1}</p>
                                        </TableCell>
                                        <TableCell><p className={"mt-2 m-0 text-left"}>{row.name}</p>
                                        </TableCell>
                                        <TableCell>{row.clicks}</TableCell>
                                        <TableCell>{row.last_click}</TableCell>
                                        <TableCell>{row.recipients}</TableCell>
                                        <TableCell>{row.urls}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>}
                </TabPanel>
                <TabPanel value={value} index={2}>
                    {
                        props.loading && <AppLoader/>
                    }
                    {
                        props.error && <Alert>Something went wrong!</Alert>
                    }
                    {props.topLinks && <TableContainer className="top-5-table">
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell className="text-left">SL No</TableCell>
                                    <TableCell className="text-left">Campaigns</TableCell>
                                    <TableCell>Clicks</TableCell>
                                    <TableCell>Last click</TableCell>
                                    <TableCell>URL</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    props.topLinks && props.topLinks.length === 0 && <TableRow className="no-shadow">
                                        <TableCell align="center" colSpan={5}>
                                            <div>
                                                <DashboardCardInfo text={"There are no records to display."}/>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                }
                                {props.topLinks && props.topLinks.length > 0 && props.topLinks.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell scope="row">
                                            <p className="pl-2 mt-1 mb-0 text-left">{index + 1}</p>
                                        </TableCell>
                                        <TableCell><p className={"mt-2 m-0 text-left"}>{row.campaigns}</p>
                                        </TableCell>
                                        <TableCell>{row.clicks}</TableCell>
                                        <TableCell>{row.last_click}</TableCell>
                                        <TableCell>{row.url}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                    </TableContainer>}
                </TabPanel>
            </div>

        </AppCardBody>
    </AppCard>;
}
