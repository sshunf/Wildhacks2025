import React from 'react';
import '../css/Task.css'; // Import the CSS file

function Task({ taskName, onComplete, onDelete }) {
  return (
    <div className="task">
      <span>{taskName}</span>
      <div>
        <button className="complete-button" onClick={onComplete}>
          Complete
        </button>
        <button className="delete-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default Task;