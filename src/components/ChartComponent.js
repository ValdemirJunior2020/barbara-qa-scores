import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChartComponent = ({ agents }) => {
  const centers = [...new Set(agents.map((a) => a.center))];

  const csData = {};
  const gData = {};

  agents.forEach((agent) => {
    if (!csData[agent.center]) csData[agent.center] = [];
    if (!gData[agent.center]) gData[agent.center] = [];

    if (agent.type === 'CS') csData[agent.center].push(agent.score);
    if (agent.type === 'G') gData[agent.center].push(agent.score);
  });

  const avg = (arr) =>
    arr.length ? Math.round(arr.reduce((sum, s) => sum + s, 0) / arr.length) : 0;

  const chartData = {
    labels: centers,
    datasets: [
      {
        label: 'Average CS Score',
        data: centers.map((c) => avg(csData[c] || [])),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Average G Score',
        data: centers.map((c) => avg(gData[c] || [])),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="mb-5">
      <h4 className="text-center">Average QA Scores by Call Center</h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
