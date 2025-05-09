const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.post('/get-fitness-plan', async (req, res) => {
    const { age, weight, fitnessLevel, goals } = req.body;
    const userPrompt = `Create a personalized fitness plan for a ${fitnessLevel} person who is ${age} years old, weighs ${weight} kg, and has the following goals: ${goals}. Include both workout and diet recommendations.`;

    try {
        const response = await axios.post(
            'https://openrouter.ai/api/v1/chat/completions',
            {
                model: 'qwen/qwen3-32b:free',
                messages: [
                    { role: 'user', content: userPrompt }
                ]
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://your-site.com',
                    'X-Title': 'AI Fitness Coach'
                }
            }
        );

        res.json({ plan: response.data.choices[0].message.content });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the fitness plan.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});