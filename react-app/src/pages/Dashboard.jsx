import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import '../css/Dashboard.css'; // Import the CSS file

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize tasks from location.state or default to an empty array
  const [tasks, setTasks] = useState([]);

  const fetchTasks = React.useCallback(async () => {
    try {
      // Get user data from localStorage as fallback
      const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData'));
      
      if (!userData?._id) {
        throw new Error('No user ID found');
      }

      console.log(userData);
      const response = await fetch(`http://localhost:5000/task/${userData._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Fetched tasks:', data);
      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      // Redirect to auth if no user data is found
      if (err.message === 'No user ID found') {
        navigate('/auth');
      }
    }
  }, [navigate]);
  
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

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