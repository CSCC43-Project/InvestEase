import { useEffect } from 'react';
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