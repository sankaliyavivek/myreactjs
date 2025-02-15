import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import io from 'socket.io-client';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

Chart.register(...registerables);
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://myreactjsproject-backend.onrender.com";
const socket = io(`${SOCKET_URL}`, {
    withCredentials: true,
    transports: ["websocket", "polling"],
  });  // Connect to the Socket.IO server

const TaskStatistics = () => {
  const [taskCompletionRate, setTaskCompletionRate] = useState(0);
  const [statusDistribution, setStatusDistribution] = useState({
    Backlog: 0,
    'In Progress': 0,
    Completed: 0,
  });
  const [teamProductivity, setTeamProductivity] = useState({});

  // Fetch initial statistics when the component mounts
  useEffect(() => {
    axios.get(`${API_BASE_URL}/statisticss/task-statistics`) 
      .then(response => {
        const data = response.data;
        setTaskCompletionRate(data.taskCompletionRate);
        setStatusDistribution(data.statusDistribution);
        // setTeamProductivity(data.teamProductivity);
      })
      .catch(error => console.error('Error fetching task statistics:', error));

    // Listen for real-time task statistics updates
    socket.on('updateStatistics', (data) => {
      setTaskCompletionRate(data.taskCompletionRate);
      setStatusDistribution(data.statusDistribution);
    //   setTeamProductivity(data.teamProductivity);
    });

    return () => {
      socket.off('updateStatistics');  // Clean up the listener when the component unmounts
    };
  }, []);

  // Chart Data for Task Completion Rate
  const completionRateData = {
    labels: ['Completed Tasks', 'Remaining Tasks'],
    datasets: [{
      data: [taskCompletionRate, 100 - taskCompletionRate],
      backgroundColor: ['#4CAF50', '#FF6384'],
    }],
  };

  // Chart Data for Status Distribution (Backlog, In Progress, Completed)
  const statusDistributionData = {
    labels: ['Backlog', 'In Progress', 'Completed'],
    datasets: [{
      label: 'Tasks per Status',
      data: [statusDistribution.Backlog, statusDistribution['In Progress'], statusDistribution.Completed],
      backgroundColor: ['#FFCE56', '#36A2EB', '#4CAF50'],
    }],
  };



  return (
    <div className="container mt-5">
      <h2 className="text-center">Task Statistics</h2>
      <div className="row">
        <div className="col-md-4">
          <h4>Task Completion Rate</h4>
          <Pie data={completionRateData} />
        </div>
        <div className="col-md-4">
          <h4>Status Distribution</h4>
          <Bar data={statusDistributionData} />
        </div>
        {/* <div className="col-md-4">
          <h4>Team Productivity</h4>
          <Bar data={teamProductivityData} />
        </div> */}
      </div>
    </div>
  );
};

export default TaskStatistics;
