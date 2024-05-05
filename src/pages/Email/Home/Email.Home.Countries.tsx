import * as React from "react";
import ApexChart from 'react-apexcharts';

class EmailHomeCountries extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            series: [44, 55, 13, 43, 22],
            options: {

                chart: {

                    fontFamily: 'FuturaPT',
                    type: 'pie',
                }, stroke: {

                    width: [0]
                }, dataLabels: {
                    enabled: false
                }, legend: {
                    position: 'bottom'
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

            <div id="chart" style={{minHeight: "200px"}}>
                <ApexChart options={this.state.options} series={this.state.series} type="pie"/>
            </div>
        );
    }
}

export default EmailHomeCountries;