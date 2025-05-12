const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/get-fitness-plan', async (req, res) => {
    const { age, weight, fitnessLevel, goals } = req.body;
    const prompt = `Create a personalized fitness plan for a ${age}-year-old, weighing ${weight}kg, with ${fitnessLevel} fitness level, aiming to ${goals}.`;

    try {
        const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
            model: 'qwen-3',
            messages: [{ role: 'user', content: prompt }]
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const plan = response.data.choices[0].message.content;
        res.json({ plan });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate fitness plan' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});