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

  return (
    <div>
      <h2>Transport Stations Count</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default DataChart;
