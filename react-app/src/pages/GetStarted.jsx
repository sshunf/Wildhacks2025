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
            setTasks(response.geminiResponse);
            navigate('/dashboard');
        }} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Go to Dashboard
      </button>
    </div>
  );
}

export default GetStarted;