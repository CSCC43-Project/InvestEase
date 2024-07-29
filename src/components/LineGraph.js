import React from "react";
import { Line } from "react-chartjs-2";
function LineChart({ chartData, title }) {
    return (
        <div className="chart-container">
            <h2 style={{ textAlign: "center" }}>Analytics</h2>
            <Line
                data={chartData}
                options={{
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: title
                        },
                        legend: {
                            display: false
                        }
                    },
                }}
            />
        </div>
    );
}
export default LineChart;