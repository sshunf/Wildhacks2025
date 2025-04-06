import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Task from '../components/Task';
import '../css/Dashboard.css'; // Import the CSS file

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [newTaskName, setNewTaskName] = useState(''); // State to store the new task name

  const fetchTasks = React.useCallback(async () => {
    try {
      const userData = location.state?.userData || JSON.parse(localStorage.getItem('userData'));

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
  }, [navigate]);

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
      <div>
        <button className="button" onClick={() => setShowModal(true)}>Add Task</button>
        <button className="button">Get Recommended Tasks</button>
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