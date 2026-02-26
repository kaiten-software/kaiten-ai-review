// Role-Based Access Control (RBAC) Utilities

export const ROLES = {
    SUPER_ADMIN: 'super_admin',
    ACCOUNTANT: 'accountant',
    STAFF: 'staff',
    FSR_MANAGER: 'fsr_manager'
};

// Permission definitions for each role
const PERMISSIONS = {
    [ROLES.SUPER_ADMIN]: [
        '*' // All permissions
    ],
    [ROLES.ACCOUNTANT]: [
        'view_dashboard',
        'view_clients_basic',
        'view_payments',
        'verify_payment',
        'view_qr_orders',
        'export_reports'
    ],
    [ROLES.STAFF]: [
        'view_dashboard',
        'view_clients',
        'view_reviews',
        'view_analytics',
        'view_qr_orders',
        'view_plans'
    ],
    [ROLES.FSR_MANAGER]: [
        'view_dashboard',
        'view_clients',
        'view_fsr',
        'manage_fsr',
        'view_analytics',
        'assign_clients'
    ]
};

// Navigation items visibility per role
const NAV_VISIBILITY = {
    dashboard: ['all'],
    clients: ['all'],
    payments: [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT],
    management: [ROLES.SUPER_ADMIN],
    fsr: [ROLES.SUPER_ADMIN, ROLES.FSR_MANAGER],
    'qr-orders': [ROLES.SUPER_ADMIN, ROLES.ACCOUNTANT, ROLES.STAFF],
    reviews: [ROLES.SUPER_ADMIN, ROLES.STAFF],
    analytics: [ROLES.SUPER_ADMIN, ROLES.STAFF, ROLES.FSR_MANAGER],
    referrals: [ROLES.SUPER_ADMIN],
    plans: [ROLES.SUPER_ADMIN, ROLES.STAFF],
    whatsapp: [ROLES.SUPER_ADMIN],
    about: ['all']
};

/**
 * Check if a user role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
    if (!role) return false;

    const rolePermissions = PERMISSIONS[role] || [];

    // Super admin has all permissions
    if (rolePermissions.includes('*')) return true;

    return rolePermissions.includes(permission);
};

/**
 * Check if a navigation item should be visible for a role
 * @param {string} role - User role
 * @param {string} navId - Navigation item ID
 * @returns {boolean}
 */
export const canViewNav = (role, navId) => {
    if (!role || !navId) return false;

    const allowedRoles = NAV_VISIBILITY[navId] || [];

    // 'all' means everyone can see it
    if (allowedRoles.includes('all')) return true;

    return allowedRoles.includes(role);
};

/**
 * Get visible navigation items for a role
 * @param {Array} navigationItems - All navigation items
 * @param {string} role - User role
 * @returns {Array} Filtered navigation items
 */
export const getVisibleNavItems = (navigationItems, role) => {
    if (!role) return [];

    return navigationItems.filter(item => canViewNav(role, item.id));
};

/**
 * Get user role display name
 * @param {string} role - Role key
 * @returns {string}
 */
export const getRoleDisplayName = (role) => {
    const roleNames = {
        [ROLES.SUPER_ADMIN]: 'Super Admin',
        [ROLES.ACCOUNTANT]: 'Accountant',
        [ROLES.STAFF]: 'Staff',
        [ROLES.FSR_MANAGER]: 'FSR Manager'
    };

    return roleNames[role] || 'Unknown';
};

/**
 * Check if user can perform destructive actions (delete, pause, etc.)
 * @param {string} role - User role
 * @returns {boolean}
 */
export const canPerformDestructiveActions = (role) => {
    return role === ROLES.SUPER_ADMIN;
};

/**
 * Check if user can edit client data
 * @param {string} role - User role
 * @returns {boolean}
 */
export const canEditClients = (role) => {
    return role === ROLES.SUPER_ADMIN;
};

/**
 * Check if user can verify payments
 * @param {string} role - User role
 * @returns {boolean}
 */
export const canVerifyPayments = (role) => {
    return role === ROLES.SUPER_ADMIN || role === ROLES.ACCOUNTANT;
};
