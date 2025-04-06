const mongoose = require('mongoose');
const Task = require('../models/tasks');

// Controller function to create a new user
const createTask = async (req, res) => {
    try {
        const {user_id, task_name} = req.body;
        const newTask = new Task({
                            _id: new mongoose.Types.ObjectId(),
                            user_id: new mongoose.Types.ObjectId(user_id),
                            task_name: task_name,
                            completed: false
                        });
        await newTask.save();

        res.status(200).json({ message: 'Created task successfully', task: newTask });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
};

const createTasks = async (req, res) => {
    try {
        const {user_id, task_list} = req.body;
        for (let i = 0; i < task_list.length; i++) {
            const task_name = task_list[i];
            const newTask = new Task({
                            _id: new mongoose.Types.ObjectId(),
                            user_id: user_id,
                            task_name: task_name,
                            completed: false
                        });
            await newTask.save();
        }
        res.status(200).json({ message: 'Created tasks successfully' });
    } catch (error) {
        console.error('Error creating tasks:', error);
        res.status(500).json({ error: 'Failed to create tasks' });
    }
};

const getTasks = async (req, res) => {
    
    try {
        const  user_id  = req.params.userId;
        const searchId = new mongoose.Types.ObjectId(user_id); 
        const tasks = await Task.find({ user_id: searchId });
        console.log(tasks);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}

module.exports = { createTask, createTasks, getTasks };