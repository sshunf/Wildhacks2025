import React, { useState } from 'react';
import '../css/Survey.css'; 

function Survey() {
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);

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
      question: 'How would you describe your productivity motivation?',
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
      setResponses((prev) => {
        const prevValues = prev[name] || [];
        if (checked) {
          return { ...prev, [name]: [...prevValues, value] };
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
      alert('Survey completed! Thank you for your responses.');
      console.log('Survey Responses:', responses);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
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
  );
}

export default Survey;