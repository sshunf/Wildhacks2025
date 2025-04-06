import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import '../css/Dashboard.css'; // Import the CSS file
import superman from '../assets/superman.png';
import soldier from '../assets/soldier.png';
import archer from '../assets/archer.png';

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  // Retrieve heroId and userData from the state passed from Hero.jsx
  const heroId = location.state?.heroId;
  const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData'));

  // Map heroId to the corresponding image
  const heroImages = {
    0: superman,
    1: soldier,
    2: archer,
  };

  const heroImage = heroImages[heroId]; // Get the correct hero image

  const fetchTasks = React.useCallback(async () => {
    try {
      if (!userData?._id) {
        throw new Error('No user ID found');
      }

      const response = await fetch(`http://localhost:5000/task/${userData._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      console.log('Fetched tasks:', data.tasks);
      setTasks(data.tasks || []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      if (err.message === 'No user ID found') {
        navigate('/auth');
      }
    }
  }, [navigate, userData]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleComplete = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDelete = (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Here are your tasks:</p>
      <div className="dashboard-content">
        <div className="tasks-container">
          {tasks.map((task) => (
            <Task
              key={task._id}
              taskId={task._id}
              taskName={task.task_name}
              completed={task.completed}
              onComplete={() => handleComplete(task._id)}
              onDelete={() => handleDelete(task._id)}
            />
          ))}
        </div>
        <div className="hero-image-container">
          {heroImage && <img src={heroImage} alt="Hero" className="hero-image" />}
          {userData?.username && <p className="hero-username">{userData.username}</p>}
        </div>
      </div>
      <div>
        <button className="button">Add Task</button>
        <button className="button">Get Recommended Tasks</button>
      </div>
    </div>
  );
}

export default Dashboard;