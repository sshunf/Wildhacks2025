import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function GetStarted() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Your Productivity Journey!</h1>
      <p>Thank you for completing the survey. Let's get started on achieving your goals!</p>
      <button onClick={ async () => {
            const userData = JSON.parse(localStorage.getItem('userData'));

            console.log("USER DATA: ");
            console.log(userData);

            
            let userTasks = await fetch(`http://localhost:5000/task/${userData._id}`, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' }
            });

            userTasks = await userTasks.json();
            userTasks = userTasks.tasks || []; // Ensure tasks is an array

            if (userTasks.length === 0){
              const data = await fetch('http://localhost:5000/task/process-content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }, // Correct header
                body: JSON.stringify({
                  user: userData, 
                  numTasks: 3,
                }), 
            });

            let response = await data.json();
            console.log(response);
            console.log(response.geminiResponse); // make task components from these that show up on dashboard
            const cleanResponse = response.geminiResponse.replace(/"/g, '').trim().slice(1, -1);
            const taskList = cleanResponse
                .split(',')
                .map(task => task.trim())
                .filter(task => task.length > 0);

            console.log("TASK LIST: ", taskList);
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

            }
            navigate('/hero', { state: { userData } }); 
        }} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Choose Your Hero
      </button>
    </div>
  );
}

export default GetStarted;