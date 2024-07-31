import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

export default function Graph({ pastData}) {

    useEffect(() => {
        const chartData = {
            labels: pastData.map(data => data.timestamp),
            datasets: [
                {
                    label: 'Stock Price',
                    data: pastData.map(data => data.close),
                    borderColor: "black",
                    borderWidth: 2
                }
            ]
        };

        const canvas = document.getElementById('chart');
        if (canvas) {
            const context = canvas.getContext('2d');
            if (context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        const chart = new Chart(canvas, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });

        return () => {
            if (chart) {
                chart.destroy();
            }
        };
    }, [pastData]);

    return (
        <div>
            <canvas id="chart" width="400" height="400"></canvas>
        </div>
    );
}

    // const Data = [
    //         {
    //             x: 1,
    //             y: 10
    //         },
    //         {
    //             x: 2,
    //             y: 15
    //         },
    //         {
    //             x: 3,
    //             y: 5
    //         },
    //         {
    //             x: 4,
    //             y: 20
    //         }
    //     ]
// const slope = 1;
        // const FutureData = [
        //     {
        //         x: 5,
        //         y: slope * 5
        //     },
        //     {
        //         x: 6,
        //         y: slope * 6
        //     }
        // ]
        // predict the slope of data following the Data array
        // const combinedData = [
        //     ...Data.filter(data => data.x <= 4),
        //     ...FutureData
        // ];
        // const maxY = Math.max(...combinedData.map(data => data.y));
        // const [chartData, setChartData] = useState({
        //     labels: combinedData.map(data => data.x),
        //     datasets: [
        //         {
        //             label: 'Stock Price',
        //             data: combinedData.map(data => data.y),
        //             borderColor: "black",
        //             borderWidth: 2,
        //             segment: {
        //                 borderColor: ctx => ctx.p0.parsed.y > ctx.p1.parsed.y ? 'red' : 'green'
        //             },
        //         },
        //         {
        //             label: 'Current Date',
        //             data: [{x: 4, y: 0}, {x: 4, y: maxY + 10}],
        //             borderColor: "white",
        //             borderWidth: 2,
        //             hoverBorderWidth: 3
        //         }
        //     ]
        // });