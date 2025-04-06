const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
      user_id: mongoose.Schema.Types.ObjectId,
      task_name: String,
      completed: Boolean
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;