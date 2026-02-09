/**
 * Image Generator Utility
 * Fetches relevant business images from Unsplash based on business type
 */

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with actual key or use public API

// Mapping of business types to search queries
const businessTypeQueries = {
    salon: 'modern hair salon interior professional',
    spa: 'luxury spa wellness center',
    restaurant: 'elegant restaurant interior dining',
    cafe: 'cozy coffee shop cafe interior',
    gym: 'modern fitness gym equipment',
    clinic: 'medical clinic healthcare facility',
    dental: 'modern dental clinic office',
    auto: 'auto repair shop garage',
    retail: 'modern retail store interior',
    hotel: 'luxury hotel lobby interior',
    bakery: 'artisan bakery pastry shop',
    photography: 'photography studio professional',
    consulting: 'modern office professional workspace',
    education: 'modern classroom training center',
    other: 'modern business interior professional'
};

/**
 * Generate a business image URL based on business type
 * @param {string} businessType - The type of business
 * @param {string} description - Business description for context
 * @returns {Promise<string|null>} - Image URL or null if failed
 */
export async function generateBusinessImage(businessType, description) {
    try {
        // Get the search query for this business type
        const query = businessTypeQueries[businessType] || businessTypeQueries.other;

        // Use Unsplash Source API (no API key required for basic usage)
        // This provides random images based on search terms
        const imageUrl = `https://source.unsplash.com/1600x900/?${encodeURIComponent(query)}`;

        // Verify the image loads
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(imageUrl);
            img.onerror = () => {
                console.error('Failed to load image from Unsplash');
                resolve(getFallbackImage(businessType));
            };
            img.src = imageUrl;
        });
    } catch (error) {
        console.error('Error generating business image:', error);
        return getFallbackImage(businessType);
    }
}

/**
 * Get a fallback image URL based on business type
 * @param {string} businessType - The type of business
 * @returns {string} - Fallback image URL
 */
function getFallbackImage(businessType) {
    // Use Lorem Picsum as fallback (provides random placeholder images)
    const seed = businessType || 'business';
    return `https://picsum.photos/seed/${seed}/1600/900`;
}

/**
 * Alternative: Use Pexels API (requires API key but has better quality)
 * Uncomment and use this if you have a Pexels API key
 */
/*
const PEXELS_API_KEY = 'YOUR_PEXELS_API_KEY';

export async function generateBusinessImagePexels(businessType, description) {
    try {
        const query = businessTypeQueries[businessType] || businessTypeQueries.other;
        
        const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
            {
                headers: {
                    'Authorization': PEXELS_API_KEY
                }
            }
        );
        
        if (!response.ok) {
            throw new Error('Pexels API request failed');
        }
        
        const data = await response.json();
        
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.large2x;
        }
        
        return getFallbackImage(businessType);
    } catch (error) {
        console.error('Error fetching from Pexels:', error);
        return getFallbackImage(businessType);
    }
}
*/
