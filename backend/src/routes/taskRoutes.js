const express = require('express');
const router = express.Router();
const { processContent } = require('../controllers/geminiController');
const { createTask, createTasks, getTasks, deleteTask, completeTask } = require('../controllers/taskController');
const getRecommendedTasks = require('../controllers/geminiController').getRecommendedTasks;

// Endpoint to process user content and call Gemini API
router.post('/process-content', processContent);
router.post('/create-task', createTask);
router.post('/create-tasks', createTasks);
router.get('/:userId', getTasks);
router.delete('/:taskId', deleteTask);
router.put('/:taskId', completeTask);
router.post('/recommended-tasks', getRecommendedTasks);

module.exports = router;