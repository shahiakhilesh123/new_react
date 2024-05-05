import React, {useState} from "react";
import ReactApexChart from 'react-apexcharts';

function EmailHomeStatistics() {


    const [stats] = useState({
            options: {
                chart: {

                    fontFamily: 'FuturaPT',
                    width: '100%',
                    height: '100%',
                    type: 'bar',
                    toolbar: {
                        show: false
                    },
                }
            },
            colors: 'blue',
            plotOptions: {
                bar: {
                    columnWidth: '25%',
                    distributed: true
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                show: false
            },
            series: [{
                data: [21, 22, 10, 28, 16, 21, 13, 30]
            }],
            xaxis: {
                categories: [
                    ['John', 'Doe'],
                    ['Joe', 'Smith'],
                    ['Jake', 'Williams'],
                    'Amber',
                    ['Peter', 'Brown'],
                    ['Mary', 'Evans'],
                    ['David', 'Wilson'],
                    ['Lily', 'Roberts'],
                ],
            },

        });


    return <div id="chart" style={{maxHeight: "300px", minHeight: "300px"}}>
        {
            // @ts-ignore
            <ReactApexChart options={stats.options}
                            series={stats.series}
                            type="bar"
            />
        }
    </div>

}


export default EmailHomeStatistics;
