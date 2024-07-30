import LineGraph from './LineGraph';
import Chart from 'chart.js/auto';
import { useState, useEffect } from 'react';

export default function Graph({stockSymbol}) {
    const Data = [
            {
                x: 1,
                y: 10
            },
            {
                x: 2,
                y: 15
            },
            {
                x: 3,
                y: 5
            },
            {
                x: 4,
                y: 20
            }
        ]
        const slope = (Data[Data.length - 1].y - Data[Data.length - 2].y) / (Data[Data.length - 1].x - Data[Data.length - 2].x);
        const FutureData = [
            {
                x: 5,
                y: slope * 5
            },
            {
                x: 6,
                y: slope * 6
            }
        ]
        // predict the slope of data following the Data array
        const combinedData = [
            ...Data.filter(data => data.x <= 4),
            ...FutureData
        ];
        const maxY = Math.max(...combinedData.map(data => data.y));
        const [chartData, setChartData] = useState({
            labels: combinedData.map(data => data.x),
            datasets: [
                {
                    label: 'Stock Price',
                    data: combinedData.map(data => data.y),
                    borderColor: "black",
                    borderWidth: 2,
                    segment: {
                        borderColor: ctx => ctx.p0.parsed.y > ctx.p1.parsed.y ? 'red' : 'green'
                    },
                },
                {
                    label: 'Current Date',
                    data: [{x: 4, y: 0}, {x: 4, y: maxY + 10}],
                    borderColor: "white",
                    borderWidth: 2,
                    hoverBorderWidth: 3
                }
            ]
        });
    return (
        <div>
            <LineGraph chartData={chartData} title="Stock Price Prediction"/>
        </div>
    );
}