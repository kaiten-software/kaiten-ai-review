import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const isBusinessPage = location.pathname.startsWith('/business/');

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Give Review', path: '/#businesses' },
        { name: 'Features', path: '/#features' },
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'glass shadow-xl backdrop-blur-strong' : 'bg-transparent'
                }`}
        >
            <div className="container-custom">
                <div className="flex items-center justify-between h-16 md:h-20 transition-all duration-300">
                    {/* Logo */}
                    <Link
                        to="/"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex items-center scale-100 md:scale-125 origin-left transition-transform md:ml-4"
                    >
                        <Logo size="small" variant="full" isDark={false} />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.path}
                                className="text-gray-700 hover:text-purple-600 font-semibold transition-colors relative group"
                            >
                                {link.name}
                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                            </a>
                        ))}

                        {!isBusinessPage && (
                            <button
                                onClick={() => navigate('/fsr-login')}
                                className="px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-600 hover:text-white transition-all flex items-center gap-2"
                            >
                                <UserGroupIcon className="w-4 h-4" />
                                FSR Login
                            </button>
                        )}

                        <button
                            onClick={() => navigate('/login')}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            Login
                            <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors text-slate-700"
                    >
                        {isMobileMenuOpen ? (
                            <XMarkIcon className="w-6 h-6" />
                        ) : (
                            <Bars3Icon className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: -10 }}
                            animate={{ opacity: 1, height: 'auto', y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="md:hidden pb-4 glass-dark rounded-2xl mt-0 overflow-hidden shadow-2xl border border-white/20 backdrop-blur-xl"
                        >
                            <div className="p-4 space-y-2">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={link.path}
                                        className="block px-4 py-3 text-slate-700 hover:text-purple-600 hover:bg-purple-50 rounded-xl font-bold transition-all"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                ))}

                                <div className="pt-4 space-y-3 border-t border-gray-100 mt-2">
                                    {!isBusinessPage && (
                                        <button
                                            onClick={() => {
                                                navigate('/fsr-login');
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-3 flex items-center gap-3 bg-white border border-purple-200 text-purple-700 rounded-xl font-bold justify-center shadow-sm"
                                        >
                                            <UserGroupIcon className="w-5 h-5" />
                                            FSR Login
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold justify-center shadow-lg shadow-blue-500/30"
                                    >
                                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                        Client Login
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
