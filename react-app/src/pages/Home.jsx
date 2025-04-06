import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Home.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">HeroHabits</h1>
      <h2 className="home-subtitle">
        An AI-powered productivity app that will help you achieve your goals
      </h2>
      <button className="home-button" onClick={() => navigate('/auth')}>
        Get Started
      </button>
    </div>
  );
}

export default Home;
