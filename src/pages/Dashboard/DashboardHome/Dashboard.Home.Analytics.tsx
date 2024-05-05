import * as React from "react";
import {useCallback, useContext} from "react";
import AppCard from "../../../components/Card/AppCard";
import AppCardHeader from "../../../components/Card/AppCardHeader";
import AppCardTitle from "../../../components/Card/AppCardTitle";
import AppCardBody from "../../../components/Card/AppCardBody";
import ReactApexChart from 'react-apexcharts';
import AppLoader from "../../../components/Loader/AppLoader";
import {Alert} from "react-bootstrap";
import {DefinedRange} from "materialui-daterange-picker/src/types";
import {iResource} from "../../../redux/reducers";
import {iDashboardReportResponse} from "../../../apis/user.apis";
import {AppStateContext} from "../../../App";
import getSymbolFromCurrency from "currency-symbol-map";

interface DashboardHomeAnalyticsGraph {
    options: any,
    series: any
}

const getLast7thDayDate = () => {
    let a = new Date();
    a.setDate(new Date().getDate() - 7)
    return a;
}
export default function DashboardHomeAnalytics({
                                                   dateRange,
                                                   state
                                               }: { dateRange: DefinedRange, state: iResource<iDashboardReportResponse> }) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const {
        loading,
        error,
        response
    } = state

    const {shop} = useContext(AppStateContext)

    const getChartSeries = useCallback(() => {
        let series = [];
        if (response && response.shopify_orders && response.shopify_orders.items && response.shopify_orders.items.length > 0) {

            series.push({
                name: 'Total Revenue',
                data: response &&
                    response.shopify_orders &&
                    response.shopify_orders.items &&
                    response.shopify_orders.items.map(res => {
                        return {
                            x: new Date(res.date).getTime(),
                            y: parseInt(res.total_price)
                        }
                    }),
                color: '#f9c86c'
            });


        }
        if (response && response.emailwish_shopify_orders && response.emailwish_shopify_orders.items && response.emailwish_shopify_orders.items.length > 0) {
            series.push({
                name: 'Emailwish Generated Revenue',
                data: response &&
                    response.emailwish_shopify_orders &&
                    response.emailwish_shopify_orders.items &&
                    response.emailwish_shopify_orders.items.map(res => {
                        return {
                            x: new Date(res.date).getTime(),
                            y: parseInt(res.total_price)
                        }
                    }),
            })
        }

        return series;
    }, [response])
    const currency = getSymbolFromCurrency((shop && shop.primary_currency) || "USD") || "$";


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
            colors: ['#00a49e', '#6500ff'],
            fill: {
                colors: ['#00a49e', '#6500ff']
            },
            yaxis: {
                title: {
                    text: '',
                },
                labels: {
                    formatter: function (value: any) {
                        return currency.toString() + +value.toFixed(1);
                    },
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                    },
                },
                axisBorder: {
                    show: true,
                    color: '#d3d3d3',
                    offsetX: 0,
                    offsetY: -2,
                },
                axisTicks: {
                    show: true,
                    borderType: 'solid',
                    color: '#d3d3d3',
                    width: 3,
                    offsetX: 0,
                    offsetY: 0
                },
            },
            dataLabels: {
                enabled: false,
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
            legend: {
                offsetY: 12,
                fontSize: '15px',
            }
        },


        series: getChartSeries(),
    };

    const shopify_orders = state && state.response && state.response.shopify_orders;
    return <AppCard className="h-auto" style={{maxHeight: "360px", minHeight: "360px"}}>
        <AppCardHeader>
            <AppCardTitle>
                Total Revenue
                <div style={{fontSize: "20px"}}>
                    {currency + " " + (shopify_orders && shopify_orders.total_sales .toFixed(2) || "0")}
                </div>
            </AppCardTitle>
        </AppCardHeader>
        <AppCardBody>
            {
                loading && <AppLoader/>
            }
            {
                error && <div className="mt-2"><Alert variant="danger">{error}</Alert></div>
            }
            {
                !loading && !error && response && <div
                    id="chart"
                    style={{maxHeight: "300px", minHeight: "300px"}}>


                    {
                        // @ts-ignore
                        <ReactApexChart options={graph.options} series={graph.series}
                                        type="bar" height="220"
                        />
                    }
                </div>
            }

        </AppCardBody>
    </AppCard>;
}
