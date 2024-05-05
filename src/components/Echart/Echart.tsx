import ReactEcharts from 'echarts-for-react';
import * as React from "react";

interface iProps {
    response: {
        pie: number
        horizontal: number
        data: any
        title: string
        bar_names: any
        columns: any
    }
}

function Echart(props: iProps) {
    function getOption() {
        const data = props.response;
        let basic_columns_options: any;
        if (data['pie'] === 1) {
            basic_columns_options = {
                // Add title
                title: {
                    text: data['title'],
                    // subtext: 'Open source information',
                    x: 'center'
                },

                // Add tooltip
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },

                // Add legend
                legend: {
                    orient: 'vertical',
                    x: 'left',
                    data: data["bar_names"]
                },

                // Display toolbox
                toolbox: {
                    show: false,
                    orient: 'vertical',
                    feature: {
                        dataView: {
                            show: true,
                            readOnly: false,
                            title: 'View data',
                            lang: ['View chart data', 'Close', 'Update']
                        },
                        restore: {
                            show: true,
                            title: 'Restore'
                        },
                        saveAsImage: {
                            show: true,
                            title: 'Save as image',
                            lang: ['Save']
                        }
                    }
                },

                // Add series
                series: data["data"],
            }
        } else if (data['horizontal'] === 1) {
            basic_columns_options = {

                // Setup grid
                grid: {
                    x: 45,
                    x2: 10,
                    y: 85,
                    y2: 25
                },

                // Add tooltip
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },

                // Add legend
                legend: {
                    data: data["bar_names"]
                },

                // Enable drag recalculate
                calculable: true,

                // Horizontal axis
                yAxis: [{
                    type: 'category',
                    data: data["columns"]
                }],

                // Vertical axis
                xAxis: [{
                    type: 'value',
                    boundaryGap: [0, 0.01]
                }],

                // Add series
                series: data["data"],

            };
        } else {
            basic_columns_options = {

                // Setup grid
                grid: {
                    x: 40,
                    x2: 40,
                    y: 35,
                    y2: 25
                },

                // Add tooltip
                tooltip: {
                    trigger: 'axis'
                },

                // Add legend
                legend: {
                    data: data["bar_names"]
                },

                // Enable drag recalculate
                calculable: true,

                // Horizontal axis
                xAxis: [{
                    type: 'category',
                    data: data["columns"]
                }],

                // Vertical axis
                yAxis: [{
                    type: 'value'
                }],

                // Add series
                series: data["data"],

            };
        }

        return basic_columns_options;
    }


    return <div style={{backgroundColor: "white", border: "1px solid #ccc", padding: 20, borderRadius: "0.25rem"}}>
        <ReactEcharts option={getOption()}
                      style={{height: '400px', width: '100%'}}
        />
    </div>


}

export default Echart;
