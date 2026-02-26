import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LockClosedIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/solid';
import Logo from '../components/common/Logo';

export default function AdminLogin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: 'admin@rankbag.com',
        password: 'admin123'
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulate API call
        setTimeout(() => {
            // Simple authentication (in production, use proper backend)
            if (formData.email === 'admin@rankbag.com' && formData.password === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                navigate('/admin/dashboard');
            } else {
                setError('Invalid email or password');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900"></div>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
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

                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Welcome to<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                            Admin Dashboard
                        </span>
                    </h1>

                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                        Manage your AI-powered review platform with advanced analytics,
                        client management, and powerful automation tools.
                    </p>

                    <div className="space-y-4">
                        {[
                            { icon: <ShieldCheckIcon className="w-6 h-6" />, text: 'Secure Authentication' },
                            { icon: <UserIcon className="w-6 h-6" />, text: 'Role-Based Access' },
                            { icon: <LockClosedIcon className="w-6 h-6" />, text: 'End-to-End Encryption' }
                        ].map((item, index) => (
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
                    <div className="md:hidden text-center mb-8">
                        <Logo size="medium" variant="full" className="justify-center mb-4" isDark={true} />
                        <h2 className="text-2xl font-bold text-white">Admin Login</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
                            <p className="text-gray-600">Enter your credentials to access the dashboard</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-4 pl-12 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
                                        placeholder="admin@rankbag.com"
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
                                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing In...
                                    </>
                                ) : (
                                    <>
                                        <LockClosedIcon className="w-5 h-5" />
                                        Sign In to Dashboard
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <p className="text-sm font-semibold text-gray-700 mb-2">Demo Credentials:</p>
                            <div className="font-mono text-sm bg-white px-4 py-3 rounded-lg border border-gray-200">
                                <p className="text-gray-600">Email: <span className="text-gray-900 font-semibold">admin@rankbag.com</span></p>
                                <p className="text-gray-600">Password: <span className="text-gray-900 font-semibold">admin123</span></p>
                            </div>
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
