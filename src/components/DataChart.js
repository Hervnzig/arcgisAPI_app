import React from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

const DataChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Number of Transport Stations",
        data: data.values,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    maintainAspectRatio: false, // Ensure the chart respects container dimensions
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <h2>Transport Stations Count</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default DataChart;
