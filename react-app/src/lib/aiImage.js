import { logApiUsage, uploadImageFromUrl } from './supabase';

/**
 * Utility to generate AI images using OpenAI's DALL-E 3.
 * 
 * ⚡ IMPORTANT: OpenAI image URLs expire after ~1 hour.
 * This function immediately downloads the generated image and uploads it
 * to Supabase Storage, returning a PERMANENT public URL.
 */
export const generateAIImage = async (prompt) => {
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
        alert("API Key is missing! Please provide your OpenAI API key in the .env file as VITE_OPENAI_API_KEY");
        return null;
    }

    try {
        // Step 1: Generate image with DALL-E 3
        const response = await fetch('https://api.openai.com/v1/images/generations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: `A beautiful, high-quality, professional photography style image of: ${prompt}. Clean background, highly detailed, 4k.`,
                n: 1,
                size: "1024x1024",
                response_format: "url"
            })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error("OpenAI Error:", error);
            alert(`Failed to generate image: ${error.error?.message || 'Unknown error'}`);
            return null;
        }

        const data = await response.json();
        const tempUrl = data.data[0].url; // Temporary OpenAI URL (expires in ~1 hour)

        // Log the API usage (fire and forget)
        logApiUsage('openai_image', 'generate_dalle_image', prompt, 0.04).catch(() => { });

        // Step 2: Upload to Supabase Storage for permanent storage
        // This converts the expiring OpenAI URL into a permanent Supabase URL
        const permanentUrl = await uploadImageFromUrl(tempUrl);

        if (permanentUrl) {
            return permanentUrl; // ✅ Permanent Supabase URL
        }

        // Fallback: return the temporary URL if Supabase upload fails
        // (image will still show now but may disappear later)
        console.warn('Could not upload AI image to Supabase — returning temporary URL. Image may expire.');
        return tempUrl;

    } catch (error) {
        console.error("Error generating AI image:", error);
        alert(`An error occurred while generating the image: ${error.message || error}`);
        return null;
    }
};
