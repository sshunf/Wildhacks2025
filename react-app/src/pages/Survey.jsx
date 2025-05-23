import React, { useState } from 'react';
import '../css/Survey.css';
import { useNavigate } from 'react-router-dom';

function Survey() {
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const questions = [
    {
      id: 'priorities',
      question: 'What are your top 3 life priorities right now?',
      options: [
        'School / Learning',
        'Career advancement',
        'Health & fitness',
        'Mental health',
        'Relationships',
        'Creativity',
        'Finances',
        'Adventure / Exploration',
        'Other',
      ],
      type: 'checkbox',
      maxSelections: 3,
    },
    {
      id: 'values',
      question: 'Which of these values best describe you? (Choose 3)',
      options: [
        'Discipline',
        'Growth',
        'Balance',
        'Connection',
        'Creativity',
        'Curiosity',
        'Efficiency',
        'Resilience',
      ],
      type: 'checkbox',
      maxSelections: 3,
    },
    {
      id: 'shortTermGoal',
      question: 'What is a short-term goal you’re working on?',
      type: 'text',
    },
    {
      id: 'longTermGoal',
      question: 'What is a long-term goal you’re aiming for in the next 6–12 months?',
      type: 'text',
    },
    {
      id: 'motivation',
      question: 'What motivates you to stay productive?',
      options: [
        'I thrive on structure and deadlines.',
        'I like flexibility but need direction.',
        'I get motivated when things feel meaningful.',
        'I just want to get things done and not feel overwhelmed.',
      ],
      type: 'radio',
    },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const maxSelections = questions.find((q) => q.id === name)?.maxSelections || Infinity;
      setResponses((prev) => {
        const prevValues = prev[name] || [];
        if (checked) {
          if (prevValues.length < maxSelections) {
            return { ...prev, [name]: [...prevValues, value] };
          } else {
            alert(`You can only select up to ${maxSelections} options.`);
            return prev;
          }
        } else {
          return { ...prev, [name]: prevValues.filter((v) => v !== value) };
        }
      });
    } else {
      setResponses({ ...responses, [name]: value });
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      console.log(responses);
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const user = localStorage.getItem('userData'); // Retrieve user ID from localStorage
      const userId = user ? JSON.parse(user)._id : null; // Parse the user data to get the ID
      if (!userId) {
        alert('User ID not found. Please log in again.');
        return;
      }
  
      // Include finished_survey: true in the updated user data
      const updatedUserData = {
        core_values: responses.values || [],
        life_priorities: responses.priorities || [],
        short_term_goals: responses.shortTermGoal || '',
        long_term_goals: responses.longTermGoal || '',
        motivation: responses.motivation || '',
        finished_survey: true, // Set finished_survey to true
      };
  
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUserData),
      });
  
      if (response.ok) {
        alert('Survey submitted successfully!');
        localStorage.setItem('finished_survey', 'true'); // Update finished_survey in localStorage
        const newUserData = await response.json();
        console.log('Updated user data:', newUserData.user);
        localStorage.setItem('userData', JSON.stringify(newUserData.user)); // Update user data in localStorage
        navigate('/getstarted'); // Navigate to the GetStarted page
      } else {
        const errorData = await response.json();
        console.error('Error response from server:', errorData);
        alert('Failed to submit the survey. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('An error occurred while submitting the survey.');
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="survey-container">
      <h1 className="survey-title">Survey</h1>
      <div className="question-container">
        <p className="question-text">{currentQuestion.question}</p>
        {currentQuestion.type === 'checkbox' && (
          <div className="options-grid">
            {currentQuestion.options.map((option) => (
              <label key={option} className="option-label">
                <input
                  type="checkbox"
                  name={currentQuestion.id}
                  value={option}
                  onChange={handleChange}
                  className="option-input"
                  checked={responses[currentQuestion.id]?.includes(option) || false}
                  disabled={
                    responses[currentQuestion.id]?.length >= currentQuestion.maxSelections &&
                    !responses[currentQuestion.id]?.includes(option)
                  }
                />
                <span className="option-button">{option}</span>
              </label>
            ))}
          </div>
        )}
        {currentQuestion.type === 'radio' && (
          <div className="options-grid">
            {currentQuestion.options.map((option) => (
              <label key={option} className="option-label">
                <input
                  type="radio"
                  name={currentQuestion.id}
                  value={option}
                  onChange={handleChange}
                  className="option-input"
                />
                <span className="option-button">{option}</span>
              </label>
            ))}
          </div>
        )}
        {currentQuestion.type === 'text' && (
          <input
            type="text"
            name={currentQuestion.id}
            onChange={handleChange}
            className="text-input"
          />
        )}
      </div>
      <div className="navigation-buttons">
        <button className="nav-button" onClick={handlePrevious} disabled={currentStep === 0}>
          Previous
        </button>
        <button className="nav-button" onClick={handleNext}>
          {currentStep < questions.length - 1 ? 'Next' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default Survey;