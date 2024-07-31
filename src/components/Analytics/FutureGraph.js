import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import PolynomialRegression from 'ml-regression-polynomial';

export default function Graph({ pastData, forecastPeriod }) {
    console.log('Forecast Period received:', forecastPeriod);
    const [futureData, setFutureData] = useState([]);

    useEffect(() => {
        // Prepare data
        const timestamps = pastData.map(data => new Date(data.timestamp).getTime());
        const prices = pastData.map(data => data.close);

        let regression, futurePredictions;
        function linearRegression(x, y) {
            const n = x.length;
            const xMean = x.reduce((sum, xi) => sum + xi, 0) / n;
            const yMean = y.reduce((sum, yi) => sum + yi, 0) / n;

            const numerator = x.reduce((sum, xi, i) => sum + (xi - xMean) * (y[i] - yMean), 0);
            const denominator = x.reduce((sum, xi) => sum + (xi - xMean) ** 2, 0);

            const slope = numerator / denominator;
            const intercept = yMean - slope * xMean;

            return { predict: x => slope * x + intercept };
        }

        if (timestamps.length > 2) {
            // Prepare data for polynomial regression
            const degree = 2; // Degree of the polynomial
            const x = timestamps.map(ts => (ts - timestamps[0]) / (24 * 60 * 60 * 1000)); // Convert timestamps to days
            const y = prices;

            // Fit polynomial regression model
            regression = new PolynomialRegression(x, y, degree);

            // Generate future timestamps
            const lastTimestamp = timestamps[timestamps.length - 1];
            const futureTimestamps = Array.from({ length: forecastPeriod }, (_, i) => new Date(lastTimestamp + (i + 1) * 24 * 60 * 60 * 1000).getTime());

            // Predict future values
            const futureDays = futureTimestamps.map(ts => (ts - timestamps[0]) / (24 * 60 * 60 * 1000));
            const futurePrices = futureDays.map(day => regression.predict(day));

            futurePredictions = futureTimestamps.map((timestamp, index) => ({
                timestamp: new Date(timestamp).toISOString(),
                predictedClose: futurePrices[index]
            }));
        } else if (timestamps.length === 2) {
            // Linear regression for exactly two points
            const x = timestamps.map(ts => (ts - timestamps[0]) / (24 * 60 * 60 * 1000)); // Convert timestamps to days
            const y = prices;

            // Fit linear regression model
            const regressionModel = linearRegression(x, y);

            // Generate future timestamps
            const lastTimestamp = timestamps[timestamps.length - 1];
            const futureTimestamps = Array.from({ length: forecastPeriod }, (_, i) => new Date(lastTimestamp + (i + 1) * 24 * 60 * 60 * 1000).getTime());

            // Predict future values
            const futureDays = futureTimestamps.map(ts => (ts - timestamps[0]) / (24 * 60 * 60 * 1000));
            const futurePrices = futureDays.map(day => regressionModel.predict(day));

            futurePredictions = futureTimestamps.map((timestamp, index) => ({
                timestamp: new Date(timestamp).toISOString(),
                predictedClose: futurePrices[index]
            }));
        } else {
            // Only one data point, predict future prices as a straight line
            const onlyPrice = prices[0];
            const futureTimestamps = Array.from({ length: forecastPeriod }, (_, i) => new Date(timestamps[0] + (i + 1) * 24 * 60 * 60 * 1000).getTime());

            futurePredictions = futureTimestamps.map(timestamp => ({
                timestamp: new Date(timestamp).toISOString(),
                predictedClose: onlyPrice
            }));
        }

        setFutureData(futurePredictions);

        // Setup chart
        const chartData = {
            labels: [...pastData.map(data => data.timestamp), ...futurePredictions.map(data => data.timestamp)],
            datasets: [
                {
                    label: 'Stock Price',
                    data: [
                        ...pastData.map(data => ({ x: data.timestamp, y: data.close })),
                        ...futurePredictions.map(() => ({ x: null, y: null })) // Hide future predictions in this dataset
                    ],
                    borderColor: "black",
                    borderWidth: 2,
                    fill: false,
                },
                {
                    label: 'Future Predictions',
                    data: [
                        ...pastData.map(() => ({ x: null, y: null })), // Hide past data in this dataset
                        ...futurePredictions.map(data => ({ x: data.timestamp, y: data.predictedClose }))
                    ],
                    borderColor: "red",
                    borderWidth: 1,
                    borderDash: [5, 5], // Dotted line for future predictions
                    fill: false,
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
    }, [pastData, forecastPeriod]);

    return (
        <div>
            <canvas id="chart" width="400" height="400"></canvas>
        </div>
    );
}