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
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [newTaskName, setNewTaskName] = useState(''); // State to store the new task name

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

  const handleComplete = async (taskId) => {
    // Optimistically update the UI by removing the task locally
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  
    try {
      // Send a PUT request to mark the task as completed
      const response = await fetch(`http://localhost:5000/task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error('Failed to complete task');
      }
  
      console.log('Task marked as completed successfully');
    } catch (err) {
      console.error('Error completing task:', err);
  
      fetchTasks(); 
    }
  }; 

  const getRecommendedTasks = async () => {

    const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData'));
    if (!userData?._id) {
      throw new Error('No user ID found');
    }
    const data = await fetch('http://localhost:5000/task/recommended-tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }, // Correct header
      body: JSON.stringify({
        user: userData, 
        numTasks: 3,
      })
    });

    let response = await data.json();
    console.log(response);
    console.log(response.geminiResponse); // make task components from these that show up on dashboard
    const cleanResponse = response.geminiResponse.replace(/"/g, '').trim().slice(1, -1);
    const taskList = cleanResponse
        .split(',')
        .map(task => task.trim())
        .filter(task => task.length > 0);

    //Upload tasks to the database
    console.log("TASK LIST: ", taskList);
    await fetch('http://localhost:5000/task/create-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userData._id, 
          task_list: taskList,
        }), 
    });

    response = await fetch(`http://localhost:5000/task/${userData._id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const tasks = await response.json();
    console.log('Fetched tasks:', tasks.tasks);
    setTasks(tasks.tasks || []);

  }

  const handleDelete = async (taskId) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
  
    try {
      const response = await fetch(`http://localhost:5000/task/${taskId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
  
      console.log('Task deleted successfully');
    } catch (err) {
      console.error('Error deleting task:', err);
    
      fetchTasks();
    }
  };

  const handleAddTask = async () => {
    if (!newTaskName.trim()) {
      alert('Task name cannot be empty!');
      return;
    }

    const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData'));

    const newTask = {
      user_id: userData._id,
      task_name: newTaskName,
      completed: false,
    };

    try {
      const response = await fetch('http://localhost:5000/task/create-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      console.log("successfully created task", response.status);
      const createdTask = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask.task]); // Add the new task to the list
      setNewTaskName(''); // Clear the input field
      setShowModal(false); // Close the modal
    } catch (err) {
      console.error('Error adding task:', err);
    }
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
        <button className="button" onClick={() => setShowModal(true)}>Add Task</button>
        <button className="button" onClick={getRecommendedTasks}>Get Recommended Tasks</button>
      </div>

      {/* Modal for adding a task */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Add a New Task</h2>
            <input
              type="text"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
              placeholder="Enter task"
              className="input"
            />
            <div className="modal-buttons">
              <button className="button" onClick={handleAddTask}>Add Task</button>
              <button className="button" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;