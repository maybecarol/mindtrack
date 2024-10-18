import React from 'react';
import { Line } from 'react-chartjs-2';

const MoodProgressChart = ({ moodHistory }) => {
  const data = {
    labels: moodHistory.map((entry) => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Mood Intensity Over Time',
        data: moodHistory.map((entry) => entry.moodScore),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
      },
    ],
  };

  return (
    <div>
      <h3>Your Mood Progress</h3>
      <Line data={data} />
    </div>
  );
};

export default MoodProgressChart;
