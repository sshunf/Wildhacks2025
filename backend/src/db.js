const mongoose = require('mongoose');

async function connectToDatabase() {
    try {
        const uri = process.env.MONGO_URI; // Replace with your MongoDB URI
        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

module.exports = { connectToDatabase };