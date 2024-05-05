import * as React from "react";
import ReactApexChart from 'react-apexcharts';

class EmailHomeGrowth extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {

            series: [44, 55, 41],
            options: {
                chart: {

                    fontFamily: 'FuturaPT',
                    width: '100%',
                    height: '100%',
                    type: 'donut',
                }, stroke: {

                    width: [0]
                }, dataLabels: {
                    enabled: false
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },


        };
    }


    render() {
        return (
            <div id="chart" style={{minHeight: "222px"}}>
                {
                    // @ts-ignore
                    <ReactApexChart options={this.state.options} series={this.state.series} type="donut"/>
                }
            </div>
        );
    }
}

export default EmailHomeGrowth;