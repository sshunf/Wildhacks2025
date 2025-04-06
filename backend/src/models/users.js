const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    core_values: [String],
    life_priorities: [String],
    motivation: String,
    short_term_goals: [String],
    long_term_goals: [String],
    rating: Number,
    finished_survey: Boolean,
});

const User = mongoose.model('User', userSchema);

module.exports = User;