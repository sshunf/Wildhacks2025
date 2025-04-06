import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import '../css/Dashboard.css'; // Import the CSS file

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize tasks from location.state or default to an empty array
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Check if tasks are passed via location.state
    if (location.state?.tasks) {
      setTasks(location.state.tasks);
    } else {
      console.error('No tasks found in location.state. Redirecting to GetStarted.');
      navigate('/getstarted'); // Redirect to GetStarted if no tasks are found
    }
  }, [location.state, navigate]);

  // Mark a task as completed
  const handleComplete = (taskIndex) => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === taskIndex ? `✅ ${task}` : task
      )
    );
  };

  // Delete a task
  const handleDelete = (taskIndex) => {
    setTasks((prevTasks) => prevTasks.filter((_, index) => index !== taskIndex));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Here are your tasks:</p>
      <div className="tasks-container">
        {tasks.map((task, index) => (
          <Task
            key={index}
            taskName={task}
            onComplete={() => handleComplete(index)}
            onDelete={() => handleDelete(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;