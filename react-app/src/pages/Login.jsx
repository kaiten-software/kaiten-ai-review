import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LockClosedIcon, ShieldCheckIcon, UserIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import Logo from '../components/common/Logo';
import { authenticateAdmin, supabase } from '../lib/supabase';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const defaultMode = location.state?.defaultMode || 'admin';

    const [loginMode, setLoginMode] = useState(defaultMode); // 'admin' or 'client'
    const [formData, setFormData] = useState({
        username: defaultMode === 'admin' ? 'admin@kaiten.com' : 'pizzacorner',
        password: defaultMode === 'admin' ? 'admin123' : 'demo123'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Update form data when mode changes
    const handleModeSwitch = (mode) => {
        setLoginMode(mode);
        setError('');
        if (mode === 'admin') {
            setFormData({ username: 'admin@kaiten.com', password: 'admin123' });
        } else {
            setFormData({ username: 'pizzacorner', password: 'demo123' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const username = formData.username.trim();
        const password = formData.password.trim();

        if (loginMode === 'admin') {
            // Admin authentication with RBAC
            const result = await authenticateAdmin(username, password);

            if (result.success) {
                // Store admin session data
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminId', result.data.id);
                sessionStorage.setItem('adminRole', result.data.role);
                sessionStorage.setItem('adminName', result.data.full_name);
                sessionStorage.setItem('adminEmail', result.data.email);

                // Clear client session to avoid conflicts
                sessionStorage.removeItem('clientLoggedIn');
                sessionStorage.removeItem('clientId');

                navigate('/admin/dashboard');
            } else {
                setError(result.error || 'Invalid admin credentials');
                setIsLoading(false);
            }
        } else {
            // Client authentication - check Supabase first, then fallback to hardcoded
            const validClients = {
                'pizzacorner': { password: 'demo123', id: 'pizza-corner' },
                'rajssalon': { password: 'salon456', id: 'rajs-salon' }
            };

            const client = validClients[username];

            if (client && password === client.password) {
                sessionStorage.setItem('clientLoggedIn', 'true');
                sessionStorage.setItem('clientId', client.id);
                sessionStorage.removeItem('adminLoggedIn');
                sessionStorage.removeItem('adminRole');
                navigate('/client/dashboard');
            } else {
                // Try Supabase dynamic login
                try {
                    const { data, error } = await supabase
                        .from('clients')
                        .select('business_id, login_username, login_password, subscription_status')
                        .eq('login_username', username)
                        .eq('login_password', password)
                        .single();

                    if (data && !error) {
                        if (data.subscription_status === 'inactive') {
                            setError('Your account is pending payment verification. Please wait for approval.');
                            setIsLoading(false);
                            return;
                        }
                        sessionStorage.setItem('clientLoggedIn', 'true');
                        sessionStorage.setItem('clientId', data.business_id);
                        sessionStorage.removeItem('adminLoggedIn');
                        sessionStorage.removeItem('adminRole');
                        navigate('/client/dashboard');
                    } else {
                        setError('Invalid client credentials');
                        setIsLoading(false);
                    }
                } catch (dbErr) {
                    setError('Invalid client credentials');
                    setIsLoading(false);
                }
            }
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-2 sm:p-4">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-96 h-48 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-20 sm:top-40 right-5 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-10 sm:bottom-20 left-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>

            <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side - Branding */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="hidden md:block text-white"
                >
                    <Logo size="large" variant="full" className="mb-8" isDark={true} />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={loginMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h1 className="text-5xl font-bold mb-6 leading-tight">
                                Welcome to<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    {loginMode === 'admin' ? 'Admin Dashboard' : 'Client Portal'}
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                {loginMode === 'admin'
                                    ? 'Manage your AI-powered review platform with advanced analytics, client management, and powerful automation tools.'
                                    : 'Access your business dashboard to view analytics, manage reviews, and track your growth.'}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    <div className="space-y-4">
                        {(loginMode === 'admin' ? [
                            { icon: <ShieldCheckIcon className="w-6 h-6" />, text: 'Secure Authentication' },
                            { icon: <UserIcon className="w-6 h-6" />, text: 'Role-Based Access' },
                            { icon: <LockClosedIcon className="w-6 h-6" />, text: 'End-to-End Encryption' }
                        ] : [
                            { icon: <BuildingStorefrontIcon className="w-6 h-6" />, text: 'Business Analytics' },
                            { icon: <ShieldCheckIcon className="w-6 h-6" />, text: 'Review Management' },
                            { icon: <UserIcon className="w-6 h-6" />, text: 'Customer Insights' }
                        ]).map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                className="flex items-center gap-3 text-gray-300"
                            >
                                <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center">
                                    {item.icon}
                                </div>
                                <span className="text-lg">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side - Login Form */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full"
                >
                    {/* Mobile Logo */}
                    <div className="md:hidden text-center mb-6">
                        <Logo size="medium" variant="full" className="justify-center mb-3" isDark={true} />
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Login</h2>
                    </div>

                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-10 max-w-mobile-safe mx-auto">
                        {/* Mode Toggle */}
                        <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
                            <button
                                type="button"
                                onClick={() => handleModeSwitch('admin')}
                                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${loginMode === 'admin'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <ShieldCheckIcon className="w-5 h-5" />
                                Admin
                            </button>
                            <button
                                type="button"
                                onClick={() => handleModeSwitch('client')}
                                className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${loginMode === 'client'
                                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                <BuildingStorefrontIcon className="w-5 h-5" />
                                Client
                            </button>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                            <p className="text-gray-600">
                                {loginMode === 'admin' ? 'Access the admin dashboard' : 'Access your business portal'}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    {loginMode === 'admin' ? 'Email Address' : 'Username'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
                                        placeholder={loginMode === 'admin' ? 'admin@kaiten.com' : 'pizzacorner'}
                                        required
                                    />
                                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <LockClosedIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2"
                                >
                                    <span className="text-xl">⚠️</span>
                                    <span>{error}</span>
                                </motion.div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${loginMode === 'admin'
                                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white'
                                    : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white'
                                    }`}
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LockClosedIcon className="w-5 h-5" />
                                        Sign In to {loginMode === 'admin' ? 'Dashboard' : 'Portal'}
                                    </>
                                )}
                            </button>
                        </form>

                        <div className={`mt-8 p-4 rounded-xl border ${loginMode === 'admin'
                            ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100'
                            : 'bg-gradient-to-r from-orange-50 to-red-50 border-orange-100'
                            }`}>
                            <p className="text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Demo Credentials:</p>
                            {loginMode === 'admin' ? (
                                <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-none overflow-y-auto pr-1 scrollbar-custom">
                                    {/* Super Admin */}
                                    <div className="font-mono text-[10px] sm:text-xs bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
                                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-wide mb-0.5 sm:mb-1">Super Admin</p>
                                        <p className="text-gray-600 truncate">Email: <span className="text-gray-900 font-semibold">admin@kaiten.com</span></p>
                                        <p className="text-gray-600">Password: <span className="text-gray-900 font-semibold">admin123</span></p>
                                    </div>

                                    {/* Accountant */}
                                    <div className="font-mono text-[10px] sm:text-xs bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
                                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-wide mb-0.5 sm:mb-1">Accountant</p>
                                        <p className="text-gray-600 truncate">Email: <span className="text-gray-900 font-semibold">accountant@kaiten.com</span></p>
                                        <p className="text-gray-600">Password: <span className="text-gray-900 font-semibold">account123</span></p>
                                    </div>

                                    {/* Staff */}
                                    <div className="font-mono text-[10px] sm:text-xs bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
                                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-wide mb-0.5 sm:mb-1">Staff (Read-Only)</p>
                                        <p className="text-gray-600 truncate">Email: <span className="text-gray-900 font-semibold">staff@kaiten.com</span></p>
                                        <p className="text-gray-600">Password: <span className="text-gray-900 font-semibold">staff123</span></p>
                                    </div>

                                    {/* FSR Manager */}
                                    <div className="font-mono text-[10px] sm:text-xs bg-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-200">
                                        <p className="text-gray-500 text-[9px] sm:text-[10px] uppercase tracking-wide mb-0.5 sm:mb-1">FSR Manager</p>
                                        <p className="text-gray-600 truncate">Email: <span className="text-gray-900 font-semibold">fsrmanager@kaiten.com</span></p>
                                        <p className="text-gray-600">Password: <span className="text-gray-900 font-semibold">fsr123</span></p>
                                    </div>
                                </div>
                            ) : (
                                <div className="font-mono text-sm bg-white px-4 py-3 rounded-lg border border-gray-200">
                                    <p className="text-gray-600">Username: <span className="text-gray-900 font-semibold">pizzacorner</span></p>
                                    <p className="text-gray-600">Password: <span className="text-gray-900 font-semibold">demo123</span></p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back to Home */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-6"
                    >
                        <button
                            onClick={() => navigate('/')}
                            className="text-white hover:text-blue-300 transition-colors font-medium flex items-center gap-2 mx-auto"
                        >
                            <span>←</span> Back to Home
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
