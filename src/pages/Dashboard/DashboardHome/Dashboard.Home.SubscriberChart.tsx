import * as React from "react";
import {useCallback} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import {Alert} from "react-bootstrap";
import AppLoader from "../../../components/Loader/AppLoader";
import {iDashboardReportResponse} from "../../../apis/user.apis";
import {iResource} from "../../../redux/reducers";
import ReactApexChart from "react-apexcharts";
import {DefinedRange} from "materialui-daterange-picker/src/types";

interface DashboardHomeAnalyticsGraph {
    options: any,
    series: any
}

function DashboardHomeSubscriberChart({
                                          dateRange,
                                          state
                                      }: { dateRange: DefinedRange, state: iResource<iDashboardReportResponse> }) {
    const {
        loading,
        error,
        response
    } = state

    const getChartSeries = useCallback(() => {
        let series = [];
        if (response && response.subscribers && response.subscribers.items && response.subscribers.items.length > 0) {

            series.push({
                name: 'Subscribers',
                data: response &&
                    response.subscribers &&
                    response.subscribers.items &&
                    response.subscribers.items.map(res => {
                        return {
                            x: new Date(res.date).getTime(),
                            y: parseInt(res.number_of_subscribers)
                        }
                    })
            });
        }
        return series;
    }, [response])

    const getDiffDay = () => {
        return Math.round((dateRange.endDate.getTime() - dateRange.startDate.getTime()) / 86400000);
    }
    const getColumnWidth = () => {
        let days = getDiffDay();
        console.log("days", days)
        if (days < 15) return "50%";
        return "80%"
    }
    const graph: DashboardHomeAnalyticsGraph = {
        options: {
            chart: {
                id: "home-analytics",
                fontFamily: 'FuturaPT',
                type: 'bar',
                stacked: false,
                height: 300,
                toolbar: {
                    show: false,
                },
            },
            grid: {
                show: true,
                borderColor: '#f5f5f5',

                yaxis: {
                    lines: {
                        show: true
                    }
                },
            },
            colors: ['#000000', '#6500ff', '#fb78a0'],
            fill: {
                colors: ['#000000', '#6500ff', '#fb78a0']
            },
            yaxis: {
                title: {
                    text: 'Subscribers',
                    style: {
                        fontSize: '15px',
                    },
                },
                axisBorder: {
                    show: true,
                    color: '#d3d3d3',
                    offsetX: 0,
                },
                axisTicks: {
                    show: true,
                    borderType: 'solid',
                    color: '#d3d3d3',
                    width: 2,
                    offsetX: 0,
                    offsetY: 0
                },
                labels: {
                    offsetX: 2,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                    },
                    formatter: function(val:any, index:any) {
                        return Math.round(val);
                    },

                },

            },
            xaxis: {
                type: 'datetime',
                min: getDiffDay() > 4 ? new Date(dateRange.startDate).getTime() : undefined,
                max: getDiffDay() > 4 ? new Date(dateRange.endDate).getTime() : undefined,
                labels: {
                    format: 'dd MMM',
                    style: {
                        fontSize: '15px',
                    },
                },
                axisBorder: {
                    show: true,
                    color: '#d3d3d3',
                    offsetX: 0,
                    offsetY: 0
                },
            },
            plotOptions: {
                bar: {
                    columnWidth: getColumnWidth(),
                }
            },
            tooltip: {
                shared: false,
            },
            dataLabels: {
                enabled: false
            },
        },

        series: getChartSeries(),
    };

    return <AppCard className="email-sent-dashboard">
        <AppCardHeader>
            <AppCardTitle>
                <div className="d-flex justify-content-between">
                    <div>
                        <div style={{fontSize: "22px"}}>
                            {response && response.subscribers && response.subscribers.total_subscriber}
                        </div>
                        New Subscriber
                    </div>
                    {/*<div>*/}
                    {/*    <span style={{fontSize:"12px",cursor:"pointer"}}>View Report</span>*/}
                    {/*</div>*/}

                </div>

            </AppCardTitle>
        </AppCardHeader>
        <AppCardBody className="p-0 email-sent-dashboard__card-body">
            {
                loading && <AppLoader/>
            }
            {
                error && <div className="mt-2"><Alert variant="danger">{error}</Alert></div>
            }
            {
                !loading && !error && response && <div
                    id="chart"
                    style={{maxHeight: "250px", minHeight: "250px"}}>


                    {
                        // @ts-ignore
                        <ReactApexChart options={graph.options} series={graph.series}
                                        type="bar" height="250"/>
                    }
                </div>
            }

        </AppCardBody>
    </AppCard>;

}

export default DashboardHomeSubscriberChart;
