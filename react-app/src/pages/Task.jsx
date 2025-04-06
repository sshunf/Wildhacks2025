import React, { useState, useEffect } from 'react';
import { 
    Box,
    Container,
    Typography,
    Paper,
    Button,
    CircularProgress
} from '@mui/material';

const Task = () => {
    // State management
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);

    const promptGemini = async (prompt) => {
        try {
            const response = await fetch('http://localhost:5000/task/process-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });
            const result = await response.json();
            return result;
        } catch (err) {
            console.error('Error fetching data:', err);
            setError(err.message);
        }
    }

    const getGeminiResponse = async () => {
        const prompt = {
            userContent: 'Give me examples of some good habits to form that could improve my life.',
        }
        const geminiTasks = promptGemini(prompt);
        console.log(geminiTasks);
    }

    // Effect for initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Example API call
                const response = await fetch('your-api-endpoint');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    return (
        <div>
            <Button variant="contained" onClick={getGeminiResponse}> Gemerate Gemini Tasks</Button>
        </div>
    );
};

export default Task;