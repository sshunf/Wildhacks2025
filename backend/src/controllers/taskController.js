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
        const tasks = await Task.find({ user_id: searchId, completed: false });
        console.log(tasks);
        res.status(200).json({tasks:tasks});
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
}

const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        console.log('Deleteing: ', taskId);
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
}

const completeTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { completed: true },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.status(200).json({ message: 'Task marked as completed', task: updatedTask });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ error: 'Failed to complete task' });
    }
};

module.exports = { createTask, createTasks, getTasks, deleteTask, completeTask };