import { logApiUsage } from './supabase';

/**
 * Utility to generate AI text using OpenAI's GPT
 * You must add VITE_OPENAI_API_KEY to your .env file
 */
export const generateAIText = async (prompt) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        console.warn("API Key is missing for AI Text Generation.");
        return null;
    }

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini", // Cost-effective, very fast text model perfect for reviews
                messages: [
                    {
                        "role": "system",
                        "content": "You are a customer writing a helpful, natural-sounding review based on provided details. Keep it conversational, not too robotic, and between 2-4 sentences."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI Text Error:", error);
            return null;
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();

        // Log the API usage for GPT-4o-mini
        try {
            await logApiUsage('openai_text', 'generate_review_text', prompt, 0.001);
        } catch (e) {
            console.error("Failed to log tracking:", e);
        }

        return content;

    } catch (error) {
        console.error("Error generating AI text:", error);
        return null;
    }
};
