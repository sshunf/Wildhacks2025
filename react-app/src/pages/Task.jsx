import React from 'react';
import '../css/Task.css'; // Import the CSS file

function Task({ taskId, taskName, completed, onComplete, onDelete }) {
  return (
    <div className={`task ${completed ? 'completed' : ''}`}>
      <span>{taskName}</span>
      <div>
        <button className="complete-button" onClick={onComplete}>
          {completed ? 'Undo' : 'Complete'}
        </button>
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Task;