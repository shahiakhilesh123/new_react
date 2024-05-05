import * as React from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import ReactApexChart from 'react-apexcharts';
import {iEmailPerformanceData} from "../../../apis/Email/email.campaigns.apis";

export default function EmailHomePerformance(props: {
    bar_names: string[],
    columns: string[],
    data: iEmailPerformanceData[],
}) {
    const chart = {
        options: {
            chart: {

                fontFamily: 'FuturaPT',
                shadow: {
                    enabled: true,
                    color: '#000',
                    top: 18,
                    left: 7,
                    blur: 10,
                    opacity: 1
                },
                toolbar: {
                    show: false
                }
            },
            colors: ['#77B6EA', '#545454'],
            stroke: {
                curve: 'smooth',
                width: [2, 2]
            },
            grid: {
                borderColor: '#e7e7e7',
                column: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.3
                },
                row: {
                    colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                    opacity: 0.3
                },
            },
            markers: {
                size: 1
            },
            xaxis: {
                categories: props.columns,
            },
            legend: {
                position: 'top',
                floating: true,
                offsetY: -25,
                offsetX: -5
            }
        },
        series: props.data && props.data.map((data) => {
            return {
                name: data.name,
                data: data.data
            }
        })
    };

    return <AppCard className="h-auto" style={{maxHeight: "450px", minHeight: "450px"}}>
        <AppCardHeader>
            <AppCardTitle>
                <h6 className="u500 color1">24 Hours Performance</h6>
            </AppCardTitle>
        </AppCardHeader>
        <AppCardBody>
            <div id="chart" style={{maxHeight: "300px", minHeight: "300px"}}>
                {
                    // @ts-ignore
                    <ReactApexChart options={chart.options} series={chart.series} type="line" height="300"/>
                }
            </div>
        </AppCardBody>
    </AppCard>
}