import { supabase, addClient } from './supabase';

// ... (Authentication functions remain the same) ...

// ==================== Add Business via FSR ====================

/**
 * Add a new business/client via FSR
 * This adds to fsr_clients table and updates FSR points
 * NOW SYNCS WITH MAIN CLIENTS TABLE
 */
export async function addBusinessViaFSR(businessData, fsrUserId) {
    try {
        // 1. Get FSR by user_id
        const fsrResult = await getFSRByUserId(fsrUserId);
        if (!fsrResult.success) {
            return { success: false, error: 'FSR not found' };
        }

        const fsr = fsrResult.data;

        // 2. Create entry in MAIN clients table first
        // This ensures the business appears in Admin Dashboard > Clients
        const clientPayload = {
            business_name: businessData.businessName,
            email: businessData.email,
            phone: businessData.phone,
            address: businessData.address,
            business_type: businessData.businessType,
            owner_name: businessData.ownerName, // Note: standard client table might not have owner_name, but we pass it
            description: businessData.description || '',
            subscription_status: 'active' // Default to trial or active
        };

        const mainClientResult = await addClient(clientPayload);

        // Even if main client creation has issues (e.g. duplicate email), we might want to proceed 
        // with FSR tracking, but ideally we want strict consistency. 
        // For now, if it fails, we assume validation error and stop.
        if (!mainClientResult.success) {
            return { success: false, error: `Failed to create main client record: ${mainClientResult.error}` };
        }

        const businessId = mainClientResult.data[0].business_id;

        // 3. Add to fsr_clients table with link to main business_id
        const { data: client, error: clientError } = await supabase
            .from('fsr_clients')
            .insert([{
                fsr_id: fsr.id,
                business_id: businessId, // LINKED!
                business_name: businessData.businessName,
                business_email: businessData.email,
                business_phone: businessData.phone,
                business_type: businessData.businessType,
                owner_name: businessData.ownerName,
                city: businessData.city,
                state: businessData.state,
                points_earned: 1,
                payment_status: 'completed',
                payment_amount: 5000,
                notes: businessData.notes || ''
            }])
            .select()
            .single();

        if (clientError) {
            return { success: false, error: clientError.message };
        }

        // 4. Update FSR total points and total clients
        const { error: updateError } = await supabase
            .from('fsr')
            .update({
                total_points: fsr.total_points + 1,
                total_clients: fsr.total_clients + 1
            })
            .eq('id', fsr.id);

        if (updateError) {
            console.error('Failed to update FSR stats:', updateError);
        }

        // 5. Log activity
        await supabase
            .from('fsr_activity_log')
            .insert([{
                fsr_id: fsr.id,
                activity_type: 'client_added',
                description: `Added new client: ${businessData.businessName}`,
                points_change: 1
            }]);

        return { success: true, data: client };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Login FSR with username and password
 */
export async function loginFSR(username, password) {
    try {
        const { data, error } = await supabase
            .from('fsr')
            .select('*')
            .eq('username', username)
            .eq('password_hash', password) // In prototype, password is stored as plain text
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// ==================== FSR Data Retrieval ====================

/**
 * Get FSR by ID
 */
export async function getFSRById(fsrId) {
    try {
        const { data, error } = await supabase
            .from('fsr')
            .select('*')
            .eq('id', fsrId)
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Get FSR by user_id (e.g., FSR001)
 */
export async function getFSRByUserId(userId) {
    try {
        const { data, error } = await supabase
            .from('fsr')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Get all FSRs (for admin)
 */
export async function getAllFSRs() {
    try {
        const { data, error } = await supabase
            .from('fsr')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// ==================== FSR Clients ====================

/**
 * Get all clients for a specific FSR
 */
export async function getFSRClients(fsrId) {
    try {
        const { data, error } = await supabase
            .from('fsr_clients')
            .select('*')
            .eq('fsr_id', fsrId)
            .order('added_date', { ascending: false });

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Get FSR clients by user_id (e.g., FSR001)
 */
export async function getFSRClientsByUserId(userId) {
    try {
        // First get the FSR by user_id
        const fsrResult = await getFSRByUserId(userId);
        if (!fsrResult.success) {
            return fsrResult;
        }

        // Then get their clients
        return await getFSRClients(fsrResult.data.id);
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Get ALL FSR clients (for system sync)
 */
export async function getAllFSRClientsSystem() {
    try {
        const { data, error } = await supabase
            .from('fsr_clients')
            .select('*');

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// ==================== Add FSR (Admin) ====================

/**
 * Add a new FSR (called by admin)
 */
export async function addFSR(fsrData) {
    try {
        // Generate FSR user_id by calling the database function
        const { data: userIdData, error: userIdError } = await supabase
            .rpc('generate_fsr_user_id');

        if (userIdError) {
            return { success: false, error: 'Failed to generate FSR ID' };
        }

        const userId = userIdData;

        // Generate username
        const { data: usernameData, error: usernameError } = await supabase
            .rpc('generate_fsr_username', { fsr_name: fsrData.name });

        if (usernameError) {
            return { success: false, error: 'Failed to generate username' };
        }

        const username = usernameData;

        // Generate random password (6 characters)
        const password = Math.random().toString(36).substring(2, 8);

        // Insert FSR
        const { data, error } = await supabase
            .from('fsr')
            .insert([{
                user_id: userId,
                name: fsrData.name,
                email: fsrData.email,
                phone: fsrData.phone,
                address: fsrData.address || '',
                city: fsrData.city,
                state: fsrData.state,
                username: username,
                password_hash: password, // In prototype, storing plain password
                total_points: 0,
                total_clients: 0,
                status: 'active'
            }])
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        // Return FSR data with generated credentials
        return {
            success: true,
            data: {
                ...data,
                generatedPassword: password // Include for showing to admin
            }
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

// ==================== Update FSR ====================

/**
 * Update FSR information
 */
export async function updateFSR(fsrId, updates) {
    try {
        const { data, error } = await supabase
            .from('fsr')
            .update(updates)
            .eq('id', fsrId)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Recalculate FSR stats based on actual client count
 * Useful for fixing data discrepancies
 */
export async function recalculateFSRStats(fsrId) {
    try {
        // 1. Get actual client count
        const { count, error: countError } = await supabase
            .from('fsr_clients')
            .select('*', { count: 'exact', head: true })
            .eq('fsr_id', fsrId);

        if (countError) throw countError;

        // 2. Update FSR record
        const { data, error: updateError } = await supabase
            .from('fsr')
            .update({
                total_clients: count,
                total_points: count // Assumes 1 point per client
            })
            .eq('id', fsrId)
            .select()
            .single();

        if (updateError) throw updateError;

        return { success: true, data };
    } catch (err) {
        console.error('Recalculate stats error:', err);
        return { success: false, error: err.message };
    }
}

/**
 * Update FSR status (active/inactive)
 */
export async function updateFSRStatus(fsrId, status) {
    return await updateFSR(fsrId, { status });
}

// ==================== FSR Statistics ====================

/**
 * Get FSR statistics for dashboard
 */
export async function getFSRStats(fsrUserId) {
    try {
        const fsrResult = await getFSRByUserId(fsrUserId);
        if (!fsrResult.success) {
            return fsrResult;
        }

        const fsr = fsrResult.data;
        const clientsResult = await getFSRClients(fsr.id);

        if (!clientsResult.success) {
            return clientsResult;
        }

        const clients = clientsResult.data;

        // Calculate stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const thisWeekStart = new Date(today);
        thisWeekStart.setDate(today.getDate() - today.getDay());

        const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

        const todayClients = clients.filter(c => {
            const addedDate = new Date(c.added_date);
            addedDate.setHours(0, 0, 0, 0);
            return addedDate.getTime() === today.getTime();
        }).length;

        const weekClients = clients.filter(c => {
            const addedDate = new Date(c.added_date);
            return addedDate >= thisWeekStart;
        }).length;

        const monthClients = clients.filter(c => {
            const addedDate = new Date(c.added_date);
            return addedDate >= thisMonthStart;
        }).length;

        return {
            success: true,
            data: {
                fsr,
                clients,
                stats: {
                    totalPoints: fsr.total_points,
                    totalClients: fsr.total_clients,
                    todayClients,
                    weekClients,
                    monthClients
                }
            }
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

/**
 * Get all FSR statistics (for admin dashboard)
 */
export async function getAllFSRStats() {
    try {
        const fsrsResult = await getAllFSRs();
        if (!fsrsResult.success) {
            return fsrsResult;
        }

        const { data: allClients, error: clientsError } = await supabase
            .from('fsr_clients')
            .select('*');

        if (clientsError) {
            return { success: false, error: clientsError.message };
        }

        const totalPoints = fsrsResult.data.reduce((sum, fsr) => sum + fsr.total_points, 0);
        const totalClients = allClients.length;

        return {
            success: true,
            data: {
                fsrs: fsrsResult.data,
                totalFSRs: fsrsResult.data.length,
                totalClients,
                totalPoints
            }
        };
    } catch (err) {
        return { success: false, error: err.message };
    }
}
