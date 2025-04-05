import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Welcome to the Productivity App!</h1>
      <button onClick={() => navigate('/survey')}>Go to Survey</button>
    </div>
  );
}

export default Home;