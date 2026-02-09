import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables!');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations

// ==================== CLIENTS ====================

export const addClient = async (clientData) => {
    try {
        // Prepare base data that always exists
        const baseData = {
            business_id: clientData.business_id,
            business_name: clientData.business_name,
            email: clientData.email,
            phone: clientData.phone,
            address: clientData.address,
            hero_image: clientData.hero_image,
            logo: clientData.logo || '🏢',
            tagline: clientData.tagline,
            description: clientData.description,
            subscription_plan: clientData.subscription_plan || 'monthly',
            subscription_status: clientData.subscription_status || 'active',
            subscription_start_date: new Date().toISOString(),
            subscription_end_date: clientData.subscription_end_date,
            google_business_url: clientData.google_business_url,
            total_reviews: 0,
            average_rating: 0
        };

        // Add optional AI fields only if they exist in the schema
        // This allows the system to work with or without the database update
        const optionalFields = {};
        if (clientData.business_type) optionalFields.business_type = clientData.business_type;
        if (clientData.services) optionalFields.services = clientData.services;
        if (clientData.staff) optionalFields.staff = clientData.staff;
        if (clientData.qualities) optionalFields.qualities = clientData.qualities;
        if (clientData.feelings) optionalFields.feelings = clientData.feelings;
        if (clientData.search_keywords) optionalFields.search_keywords = clientData.search_keywords;
        if (clientData.gallery) optionalFields.gallery = clientData.gallery;

        const { data, error } = await supabase
            .from('clients')
            .insert([{ ...baseData, ...optionalFields }])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding client:', error);
        return { success: false, error: error.message };
    }
};

export const getAllClients = async () => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching clients:', error);
        return { success: false, error: error.message };
    }
};

export const getClientById = async (businessId) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('business_id', businessId)
            .single();

        if (error) throw error;

        // Format the data to match business structure
        if (data) {
            return {
                success: true,
                data: {
                    id: data.business_id,
                    name: data.business_name,
                    logo: data.logo || '🏢',
                    tagline: data.tagline || '',
                    description: data.description || '',
                    rating: parseFloat(data.average_rating) || 0,
                    reviewCount: data.total_reviews || 0,
                    address: data.address || '',
                    phone: data.phone || '',
                    email: data.email || '',
                    services: data.services || [],
                    staff: data.staff || [],
                    qualities: data.qualities || [],
                    feelings: data.feelings || [],
                    searchKeywords: data.search_keywords || [],
                    hero: {
                        main: data.hero_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                        overlay: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
                        gallery: []
                    },
                    gallery: data.gallery || []
                }
            };
        }

        return { success: false, error: 'Client not found' };
    } catch (error) {
        console.error('Error fetching client:', error);
        return { success: false, error: error.message };
    }
};

export const updateClient = async (businessId, updates) => {
    try {
        const { data, error } = await supabase
            .from('clients')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('business_id', businessId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating client:', error);
        return { success: false, error: error.message };
    }
};

export const deleteClient = async (businessId) => {
    try {
        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('business_id', businessId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting client:', error);
        return { success: false, error: error.message };
    }
};

// ==================== REVIEWS ====================

export const addReview = async (reviewData) => {
    try {
        // Insert review
        const { data: reviewInserted, error: reviewError } = await supabase
            .from('reviews')
            .insert([{
                business_id: reviewData.business_id,
                business_name: reviewData.business_name,
                customer_name: reviewData.customer_name,
                customer_email: reviewData.customer_email,
                customer_phone: reviewData.customer_phone,
                rating: reviewData.rating,
                review_text: reviewData.review_text,
                qualities: reviewData.qualities || [],
                feelings: reviewData.feelings || [],
                service_used: reviewData.service_used,
                staff_member: reviewData.staff_member,
                posted_to_google: false,
                is_public: true,
                ip_address: reviewData.ip_address || null
            }])
            .select();

        if (reviewError) throw reviewError;

        // Update client statistics
        await updateClientStats(reviewData.business_id);

        return { success: true, data: reviewInserted };
    } catch (error) {
        console.error('Error adding review:', error);
        return { success: false, error: error.message };
    }
};

export const getAllReviews = async () => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return { success: false, error: error.message };
    }
};

export const getReviewsByBusiness = async (businessId) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return { success: false, error: error.message };
    }
};

export const markReviewAsPosted = async (reviewId, googleUrl) => {
    try {
        const { data, error } = await supabase
            .from('reviews')
            .update({
                posted_to_google: true,
                google_review_url: googleUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', reviewId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error marking review as posted:', error);
        return { success: false, error: error.message };
    }
};

export const deleteReview = async (reviewId) => {
    try {
        // Get review to find business_id
        const { data: review } = await supabase
            .from('reviews')
            .select('business_id')
            .eq('id', reviewId)
            .single();

        // Delete review
        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', reviewId);

        if (error) throw error;

        // Update client statistics
        if (review) {
            await updateClientStats(review.business_id);
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting review:', error);
        return { success: false, error: error.message };
    }
};

// ==================== HELPER FUNCTIONS ====================

// Static stats for demo businesses to preserve "history"
const STATIC_BUSINESS_STATS = {
    'raj-salon': { count: 87, rating: 4.8 },
    'spa-paradise': { count: 124, rating: 4.9 },
    'pizza-corner': { count: 45, rating: 4.5 },
    'fitness-hub': { count: 63, rating: 4.7 },
    'beauty-lounge': { count: 168, rating: 4.9 },
    'tech-solutions': { count: 92, rating: 4.8 },
    'coffee-house': { count: 156, rating: 4.6 }
};

const updateClientStats = async (businessId) => {
    try {
        // Get all real reviews from database
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select('rating')
            .eq('business_id', businessId);

        if (error) throw error;

        // Calculate stats from real reviews
        const realCount = reviews.length;
        const realSum = reviews.reduce((sum, r) => sum + r.rating, 0);

        // Get static base stats if this is a demo business
        const staticStats = STATIC_BUSINESS_STATS[businessId] || { count: 0, rating: 0 };
        const staticSum = staticStats.count * staticStats.rating;

        // Combine real and static stats
        const totalReviews = realCount + staticStats.count;
        const totalSum = realSum + staticSum;

        const averageRating = totalReviews > 0
            ? totalSum / totalReviews
            : 0;

        // Update client in database
        await supabase
            .from('clients')
            .update({
                total_reviews: totalReviews,
                average_rating: averageRating.toFixed(1),
                updated_at: new Date().toISOString()
            })
            .eq('business_id', businessId);

        return { success: true };
    } catch (error) {
        console.error('Error updating client stats:', error);
        return { success: false, error: error.message };
    }
};

// ==================== ANALYTICS ====================

export const getAnalytics = async () => {
    try {
        // Get total clients
        const { count: totalClients } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true });

        // Get total reviews
        const { count: totalReviews } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true });

        // Get reviews posted to Google
        const { count: postedReviews } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('posted_to_google', true);

        // Get active subscriptions
        const { count: activeSubscriptions } = await supabase
            .from('clients')
            .select('*', { count: 'exact', head: true })
            .eq('subscription_status', 'active');

        return {
            success: true,
            data: {
                totalClients: totalClients || 0,
                totalReviews: totalReviews || 0,
                postedReviews: postedReviews || 0,
                activeSubscriptions: activeSubscriptions || 0,
                conversionRate: totalReviews > 0 ? ((postedReviews / totalReviews) * 100).toFixed(1) : 0
            }
        };
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return { success: false, error: error.message };
    }
};
