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
        if (clientData.referral_code) optionalFields.referral_code = clientData.referral_code;
        if (clientData.referred_by) optionalFields.referred_by = clientData.referred_by;
        if (clientData.credit_points !== undefined) optionalFields.credit_points = clientData.credit_points;
        if (clientData.utr_number) optionalFields.utr_number = clientData.utr_number;

        let currentPayload = { ...baseData, ...optionalFields };
        let resultData = null;
        let resultError = null;
        let isSuccess = false;

        // Try inserting up to 10 times to clear out multiple missing columns if needed
        for (let attempt = 0; attempt < 10; attempt++) {
            const { data, error } = await supabase
                .from('clients')
                .insert([currentPayload])
                .select();

            if (!error) {
                resultData = data;
                isSuccess = true;
                break;
            }

            // check if missing column error
            if (error.message?.includes('could not find') || error.message?.includes('column')) {
                console.warn(`DB schema mismatch on attempt ${attempt + 1}:`, error.message);
                const match = error.message.match(/find the '([^']+)' column/i) || error.message.match(/column "([^"]+)"/i);

                if (match && match[1]) {
                    const missingCol = match[1];
                    console.log(`Retrying insert without missing column: ${missingCol}`);
                    delete currentPayload[missingCol];
                    continue; // Try again!
                }
            }

            // If it's a different error or we couldn't parse the column, fallback to base data
            console.warn('Could not parse missing column or different error. Retrying with bare base data...');
            const { data: fallbackData, error: fallbackError } = await supabase
                .from('clients')
                .insert([baseData])
                .select();

            if (fallbackError) {
                resultError = fallbackError;
            } else {
                resultData = fallbackData;
                isSuccess = true;
            }
            break;
        }

        if (!isSuccess) {
            throw resultError || new Error("Failed to insert client after multiple attempts.");
        }

        const data = resultData;

        // Process referral points if a referred_by code is provided
        if (clientData.referred_by) {
            try {
                // Find referring business and update points
                const { data: refData } = await supabase
                    .from('clients')
                    .select('business_id, credit_points')
                    .eq('referral_code', clientData.referred_by)
                    .single();

                if (refData) {
                    await supabase
                        .from('clients')
                        .update({ credit_points: (refData.credit_points || 0) + 10 })
                        .eq('business_id', refData.business_id);
                }
            } catch (refError) {
                console.error("Failed to process referral credit.", refError);
            }
        }

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
            // Normalize gallery: support both plain URL strings and {url, title} objects
            const rawGallery = data.gallery || [];
            const normalizedGallery = rawGallery.map(item => {
                if (typeof item === 'string') return item;
                if (item && item.url) return item.url;
                return null;
            }).filter(Boolean);

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
                    google_business_url: data.google_business_url || null,
                    hero: {
                        main: data.hero_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                        overlay: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5))',
                        gallery: normalizedGallery  // Pass real gallery through hero too
                    },
                    gallery: normalizedGallery,  // Normalized flat array of URLs
                    // Instagram Offer Fields
                    instagram_url: data.instagram_url || null,
                    ig_offer_title: data.ig_offer_title || null,
                    ig_offer_desc: data.ig_offer_desc || null,
                    ig_offer_validity: data.ig_offer_validity || 30
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
                posted_to_google: reviewData.posted_to_google || false,
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
// ==================== STORAGE ====================

export const uploadImage = async (file, bucket = 'business-images') => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        // List of buckets to try if the primary one fails
        const bucketsToTry = [bucket];
        // Only try fallbacks if we are using the default bucket or a known one
        if (bucket === 'business-images') {
            bucketsToTry.push('images', 'public', 'avatars');
        }

        let lastError = null;
        let successfulBucket = null;

        for (const currentBucket of bucketsToTry) {

            // 1. Try to upload directly
            let { data, error } = await supabase.storage
                .from(currentBucket)
                .upload(filePath, file);

            // 2. If bucket not found, try to create it (only for the primary requested bucket)
            if (error && (error.message.includes('not found') || error.statusCode === '404' || error.error === 'Bucket not found')) {
                if (currentBucket === bucket) {
                    console.log(`Bucket '${currentBucket}' not found. Attempting to create...`);
                    const { error: createError } = await supabase.storage.createBucket(currentBucket, { public: true });
                    if (!createError) {
                        // Retry upload
                        const retry = await supabase.storage.from(currentBucket).upload(filePath, file);
                        if (!retry.error) {
                            successfulBucket = currentBucket;
                            break;
                        }
                    }
                }
                // If failed, continue loop to next fallback
                lastError = error;
                continue;
            }

            if (!error) {
                successfulBucket = currentBucket;
                break;
            }

            lastError = error;
        }

        if (!successfulBucket) {
            console.error('All upload attempts failed. Last error:', lastError);
            throw new Error(`Storage Error: The bucket '${bucket}' is missing. Please create a public bucket named '${bucket}' in Supabase, or run the provided setup SQL script.`);
        }

        const { data: publicUrlData } = supabase.storage
            .from(successfulBucket)
            .getPublicUrl(filePath);

        return { success: true, url: publicUrlData.publicUrl };
    } catch (error) {
        console.error('Error uploading image:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Downloads a remote image (e.g. a temporary OpenAI URL) and uploads it
 * permanently to Supabase Storage.
 * 
 * @param {string} imageUrl - The remote URL to download and re-upload
 * @param {string} bucket - Supabase Storage bucket name (default: 'business-images')
 * @returns {string|null} Permanent Supabase public URL, or null on failure
 */
export const uploadImageFromUrl = async (imageUrl, bucket = 'business-images') => {
    try {
        // Fetch the image as a binary blob
        const fetchResponse = await fetch(imageUrl);
        if (!fetchResponse.ok) {
            console.error('uploadImageFromUrl: Failed to fetch image from URL', imageUrl);
            return null;
        }

        const blob = await fetchResponse.blob();
        const contentType = blob.type || 'image/png';
        const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
        const fileName = `ai_${Math.random().toString(36).substring(2)}_${Date.now()}.${ext}`;

        // Upload the blob to Supabase Storage
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, blob, { contentType, upsert: false });

        if (error) {
            // If bucket doesn't exist, try to create it and retry once
            if (error.message?.includes('not found') || error.statusCode === '404' || error.error === 'Bucket not found') {
                console.log(`Bucket '${bucket}' not found. Attempting to create...`);
                await supabase.storage.createBucket(bucket, { public: true });
                const retry = await supabase.storage
                    .from(bucket)
                    .upload(fileName, blob, { contentType, upsert: false });
                if (retry.error) {
                    console.error('uploadImageFromUrl: Retry upload failed', retry.error);
                    return null;
                }
            } else {
                console.error('uploadImageFromUrl: Upload failed', error);
                return null;
            }
        }

        const { data: publicUrlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return publicUrlData?.publicUrl || null;
    } catch (err) {
        console.error('uploadImageFromUrl: Unexpected error', err);
        return null;
    }
};

// ==================== QR ORDERS ====================

export const addQROrder = async (orderData) => {
    try {
        const { data, error } = await supabase
            .from('qr_orders')
            .insert([{
                business_id: orderData.business_id,
                business_name: orderData.business_name,
                plate_number: orderData.plate_number,
                address: orderData.address,
                design_info: orderData.design_info || {}, // Add design info
                status: 'New',
                price: 250
            }])
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding QR order:', error);
        return { success: false, error: error.message };
    }
};

export const getQROrders = async () => {
    try {
        const { data, error } = await supabase
            .from('qr_orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching QR orders:', error);
        return { success: false, error: error.message };
    }
};

export const updateQROrderStatus = async (orderId, status, additionalUpdates = {}) => {
    try {
        const { data, error } = await supabase
            .from('qr_orders')
            .update({ status, ...additionalUpdates })
            .eq('id', orderId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating QR order status:', error);
        return { success: false, error: error.message };
    }
};

export const deleteQROrder = async (orderId) => {
    try {
        const { error } = await supabase
            .from('qr_orders')
            .delete()
            .eq('id', orderId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting QR order:', error);
        return { success: false, error: error.message };
    }
};

export const getQROrderByBusinessId = async (businessId) => {
    try {
        const { data, error } = await supabase
            .from('qr_orders')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching QR order by business ID:', error);
        return { success: false, error: error.message };
    }
};

export const getAllQROrdersByBusinessId = async (businessId) => {
    try {
        const { data, error } = await supabase
            .from('qr_orders')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching all QR orders by business ID:', error);
        return { success: false, error: error.message };
    }
};

// ==================== ADMIN USERS (RBAC) ====================

/**
 * Authenticate admin user
 * @param {string} email - Admin email
 * @param {string} password - Admin password (plain text for dev)
 * @returns {Object} { success, data: { id, email, full_name, role }, error }
 */
export const authenticateAdmin = async (email, password) => {
    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('email', email.toLowerCase())
            .eq('password', password)
            .eq('is_active', true)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return { success: false, error: 'Invalid credentials' };
            }
            throw error;
        }

        // Update last login
        await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', data.id);

        return {
            success: true,
            data: {
                id: data.id,
                email: data.email,
                full_name: data.full_name,
                role: data.role
            }
        };
    } catch (error) {
        console.error('Error authenticating admin:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all admin users (Super Admin only)
 * @returns {Object} { success, data, error }
 */
export const getAllAdminUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('admin_users')
            .select('id, email, full_name, role, is_active, created_at, last_login')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching admin users:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Log admin activity for audit trail
 * @param {string} adminId - Admin user ID
 * @param {string} action - Action performed
 * @param {string} targetType - Type of target (client, fsr, etc.)
 * @param {string} targetId - ID of target
 * @param {Object} details - Additional details
 * @returns {Object} { success, error }
 */
export const logAdminActivity = async (adminId, action, targetType = null, targetId = null, details = {}) => {
    try {
        const { error } = await supabase
            .from('admin_activity_log')
            .insert({
                admin_id: adminId,
                action,
                target_type: targetType,
                target_id: targetId,
                details
            });

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error logging admin activity:', error);
        return { success: false, error: error.message };
    }
};

// ==================== COUPONS ====================

export const generateCoupon = async (couponData) => {
    try {
        const { data, error } = await supabase
            .from('coupons')
            .insert([{
                business_id: couponData.business_id,
                business_name: couponData.business_name,
                code: couponData.code,
                offer_title: couponData.offer_title,
                description: couponData.description,
                status: 'active',
                source: couponData.source,
                customer_details: couponData.customer_details || {},
                expiry_date: couponData.expiry_date
            }])
            .select();

        if (error) throw error;
        return { success: true, data: data ? data[0] : null };
    } catch (error) {
        console.error('Error generating coupon:', error);
        return { success: false, error: error.message };
    }
};

export const getCouponsByBusiness = async (businessId) => {
    try {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('business_id', businessId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching coupons:', error);
        return { success: false, error: error.message };
    }
};

export const verifyCoupon = async (code, businessId) => {
    try {
        const { data, error } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', code)
            .single();

        if (error) throw error;

        if (businessId && data.business_id !== businessId) {
            return { success: false, error: 'Coupon belongs to another business' };
        }

        if (data.status !== 'active') {
            return { success: false, error: `Coupon is ${data.status}` };
        }

        if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
            return { success: false, error: 'Coupon has expired' };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error verifying coupon:', error);
        return { success: false, error: 'Invalid coupon code' };
    }
};

export const claimCoupon = async (couponId) => {
    try {
        const { data, error } = await supabase
            .from('coupons')
            .update({
                status: 'claimed',
                claimed_at: new Date().toISOString()
            })
            .eq('id', couponId)
            .select();

        if (error) throw error;
        return { success: true, data: data ? data[0] : null };
    } catch (error) {
        console.error('Error claiming coupon:', error);
        return { success: false, error: error.message };
    }
};

// ==================== CALLBACK REQUESTS ====================

export const addCallbackRequest = async (data) => {
    try {
        const { data: result, error } = await supabase
            .from('callback_requests')
            .insert([{
                business_id: data.business_id,
                business_name: data.business_name,
                contact_name: data.contact_name,
                phone: data.phone,
                message: data.message || '',
                preferred_time: data.preferred_time || '',
                status: 'pending',
            }])
            .select();
        if (error) throw error;
        return { success: true, data: result[0] };
    } catch (error) {
        console.error('Error adding callback request:', error);
        return { success: false, error: error.message };
    }
};

export const getAllCallbackRequests = async () => {
    try {
        const { data, error } = await supabase
            .from('callback_requests')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching callback requests:', error);
        return { success: false, data: [], error: error.message };
    }
};

export const updateCallbackRequestStatus = async (id, status) => {
    try {
        const { data, error } = await supabase
            .from('callback_requests')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select();
        if (error) throw error;
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error updating callback request:', error);
        return { success: false, error: error.message };
    }
};

export const deleteCallbackRequest = async (id) => {
    try {
        const { error } = await supabase
            .from('callback_requests')
            .delete()
            .eq('id', id);
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting callback request:', error);
        return { success: false, error: error.message };
    }
};
// ==================== API USAGE TRACKING ====================

export const logApiUsage = async (api_type, action, input_details, cost_estimate) => {
    try {
        const { error } = await supabase
            .from('api_usage_logs')
            .insert([{
                api_type,
                action,
                input_details,
                cost_estimate,
                timestamp: new Date().toISOString()
            }]);

        if (error) {
            // If table doesn't exist, we just fail silently in production, 
            // but log to console so admin knows to create it.
            if (error.code === '42P01') {
                console.warn('API Usage table missing. Super admin must run setup SQL.');
            } else {
                throw error;
            }
        }
        return { success: true };
    } catch (error) {
        console.error('Error logging API usage:', error);
        return { success: false, error: error.message };
    }
};

export const getAllApiLogs = async () => {
    try {
        const { data, error } = await supabase
            .from('api_usage_logs')
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) {
            if (error.code === '42P01') {
                return { success: false, error: 'Table missing', requiresSetup: true };
            }
            throw error;
        }
        return { success: true, data: data || [] };
    } catch (error) {
        console.error('Error fetching API logs:', error);
        return { success: false, data: [], error: error.message };
    }
};
