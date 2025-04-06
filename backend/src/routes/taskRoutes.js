const express = require('express');
const router = express.Router();
const { processContent } = require('../controllers/geminiController');
const { createTask, createTasks, getTasks, deleteTask } = require('../controllers/taskController');

// Endpoint to process user content and call Gemini API
router.post('/process-content', processContent);
router.post('/create-task', createTask);
router.post('/create-tasks', createTasks);
router.get('/:userId', getTasks);
router.delete('/:taskId', deleteTask);

module.exports = router;