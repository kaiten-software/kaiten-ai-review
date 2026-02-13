import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Logo from '../components/common/Logo';
import { getAllBusinesses } from '../data/businesses';
import { getAllClients } from '../lib/supabase';
import {
    SparklesIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    BoltIcon,
    StarIcon,
    CheckCircleIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import TutorialSection from '../components/home/TutorialSection';

export default function Home() {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]); // All businesses
    const [visibleBusinesses, setVisibleBusinesses] = useState([]); // Displayed businesses
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Helper to guess category if not present
    const getCategory = (b) => {
        const text = (b.name + ' ' + b.description + ' ' + b.tagline).toLowerCase();
        if (text.includes('salon') || text.includes('hair') || text.includes('beauty')) return 'Salon';
        if (text.includes('spa') || text.includes('massage')) return 'Spa';
        if (text.includes('pizza') || text.includes('food') || text.includes('restaurant') || text.includes('dining')) return 'Restaurant';
        if (text.includes('fitness') || text.includes('gym') || text.includes('workout')) return 'Gym';
        if (text.includes('tech') || text.includes('software') || text.includes('app')) return 'Tech';
        if (text.includes('coffee') || text.includes('cafe')) return 'Cafe';
        return 'Other';
    };

    // Fisher-Yates shuffle
    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    useEffect(() => {
        const loadBusinesses = async () => {
            // Get static businesses first
            const staticBusinesses = getAllBusinesses();

            // Get Supabase clients
            const result = await getAllClients();
            let all = [];

            if (result.success && result.data) {
                // Filter out test clients (FEWGW and AT bar)
                const supabaseClients = result.data.filter(client => {
                    const name = (client.business_name || client.name || '').toLowerCase();
                    return !name.includes('fewgw') && !name.includes('at bar');
                });

                // Create a map for easy lookup
                const supabaseClientMap = {};
                supabaseClients.forEach(client => {
                    const id = client.business_id || client.id;
                    supabaseClientMap[id] = {
                        id: id,
                        name: client.business_name || client.name,
                        logo: client.logo || '🏢',
                        tagline: client.tagline || '',
                        description: client.description || '',
                        rating: parseFloat(client.average_rating) || 0,
                        reviewCount: client.total_reviews || 0,
                        address: client.address || '',
                        phone: client.phone || '',
                        email: client.email || '',
                        services: client.services || [],
                        staff: client.staff || [],
                        qualities: client.qualities || [],
                        hero: {
                            main: client.hero_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                            gallery: []
                        }
                    };
                });

                // Merge static businesses with Supabase data
                const mergedStaticBusinesses = staticBusinesses.map(staticBiz => {
                    const dynamicData = supabaseClientMap[staticBiz.id];
                    if (dynamicData) {
                        return {
                            ...staticBiz,
                            rating: dynamicData.rating || staticBiz.rating,
                            reviewCount: dynamicData.reviewCount || staticBiz.reviewCount,
                        };
                    }
                    return staticBiz;
                });

                // Add only new Supabase clients that aren't in static list
                const staticIds = staticBusinesses.map(b => b.id);
                const newClients = Object.values(supabaseClientMap).filter(c => !staticIds.includes(c.id));

                all = [...mergedStaticBusinesses, ...newClients];
            } else {
                // Fallback to static businesses only
                all = staticBusinesses;
            }

            // Enrich with categories
            all = all.map(b => ({ ...b, category: getCategory(b) }));
            setBusinesses(all);

            // Initially shuffle and show 6
            setVisibleBusinesses(shuffleArray(all).slice(0, 6));
        };
        loadBusinesses();
    }, []);

    // Filter effect
    useEffect(() => {
        if (businesses.length === 0) return;

        let filtered = [...businesses];

        // If user is searching or filtering, show relevant results from WHOLE list
        if (searchTerm || selectedCategory !== 'All') {
            if (searchTerm) {
                const lower = searchTerm.toLowerCase();
                filtered = filtered.filter(b =>
                    b.name.toLowerCase().includes(lower) ||
                    b.description.toLowerCase().includes(lower) ||
                    b.tagline.toLowerCase().includes(lower)
                );
            }
            if (selectedCategory !== 'All') {
                filtered = filtered.filter(b => b.category === selectedCategory);
            }
            // Show up to 6 matches
            setVisibleBusinesses(filtered.slice(0, 6));
        } else {
            setVisibleBusinesses(shuffleArray(businesses).slice(0, 6));
        }
    }, [searchTerm, selectedCategory, businesses]);

    const features = [
        {
            icon: <SparklesIcon className="w-8 h-8" />,
            title: 'AI-Powered Reviews',
            description: 'Generate authentic, personalized reviews using cutting-edge AI technology',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <ChartBarIcon className="w-8 h-8" />,
            title: 'Advanced Analytics',
            description: 'Track QR scans, review generation, and conversion rates in real-time',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            icon: <ShieldCheckIcon className="w-8 h-8" />,
            title: 'Reputation Protection',
            description: 'Handle negative feedback privately to protect your brand reputation',
            gradient: 'from-green-500 to-emerald-500'
        },
        {
            icon: <BoltIcon className="w-8 h-8" />,
            title: 'Instant Integration',
            description: 'Simple QR codes and links for seamless customer experience',
            gradient: 'from-orange-500 to-red-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <Navbar />

            {/* Hero Section - Redesigned with better spacing */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
                {/* Animated Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-purple-100/50 to-pink-100/50"></div>
                    <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center max-w-5xl mx-auto"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="flex justify-center mb-10"
                        >
                            <Logo size="large" variant="full" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                            className="inline-block mb-8"
                        >
                            <span className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-base font-bold shadow-2xl animate-pulse">
                                🚀 Authentic Growth Engine
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-tight">
                            <span className="text-gray-900">Boost Your Business with</span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Authentic AI Reviews
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed">
                            <span className="font-bold text-red-500 block mb-2">⚠ Stop Buying Fake Reviews. It's Risky.</span>
                            Earn genuine 5-star ratings with AI. Your competitors are already using it to dominate the market—<span className="font-bold text-blue-600">don't get left behind.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <button
                                onClick={() => document.getElementById('businesses').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <SparklesIcon className="w-6 h-6" />
                                    Find a Business
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="group relative px-10 py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    🚀 Join Now
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>

                        {/* Stats - Redesigned with better spacing */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                        >
                            {[
                                { number: '1,000+', label: 'Active Businesses', icon: <UserGroupIcon className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
                                { number: '50K+', label: 'Reviews Generated', icon: <StarIcon className="w-8 h-8" />, color: 'from-purple-500 to-pink-500' },
                                { number: '4.9★', label: 'Average Rating', icon: <SparklesIcon className="w-8 h-8" />, color: 'from-orange-500 to-red-500' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ delay: 0.3 + (index * 0.1), duration: 0.5, ease: "easeOut" }}
                                    className="bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white"
                                >
                                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4 mx-auto shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                    <div className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-semibold">{stat.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* NEW: Interactive Tutorial Section */}
            <TutorialSection />

            {/* Features Section - With proper spacing and transition */}
            <section id="features" className="section relative bg-white py-32">
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Kaiten AI Review</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Everything you need to manage and grow your online reputation with cutting-edge technology
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                            >
                                <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Businesses Section - With gradient background and proper spacing */}
            <section id="businesses" className="section relative py-32 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            Select a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Business</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                            Choose a business to share your experience and help others make informed decisions.
                        </p>

                        {/* Search and Filters for Home Page */}
                        <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-grow">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Search businesses..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600 font-medium cursor-pointer"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="All">All Categories</option>
                                <option value="Salon">Salon</option>
                                <option value="Restaurant">Restaurant</option>
                                <option value="Gym">Gym/Fitness</option>
                                <option value="Spa">Spa</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {visibleBusinesses.map((business, index) => (
                            <motion.div
                                key={business.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => navigate(`/business/${business.id}`)}
                                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={business.hero?.main || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'}
                                        alt={business.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <div className="text-6xl mb-3 drop-shadow-2xl">{business.logo || '🏢'}</div>
                                        <h3 className="text-3xl font-bold drop-shadow-lg">{business.name}</h3>
                                        <span className="inline-block mt-2 px-2 py-1 bg-white/20 backdrop-blur-md rounded text-xs">
                                            {business.category || 'Business'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">{business.tagline}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <StarIcon className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                                            <span className="font-bold text-xl">{business.rating}</span>
                                            <span className="text-gray-500">({business.reviewCount})</span>
                                        </div>
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-bold group-hover:translate-x-2 transition-transform flex items-center gap-2">
                                            Review →
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={() => navigate('/businesses')}
                            className="group relative px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-full font-bold text-lg hover:border-purple-500 hover:text-purple-600 transition-all duration-300 shadow-lg flex items-center gap-3"
                        >
                            <span className="relative z-10">Explore All Businesses</span>
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Pricing Section - Redesigned as Single Premium Plan */}
            <section id="pricing" className="section relative py-32 bg-white overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-1/2 left-0 w-full h-full -z-10 overflow-hidden opacity-30 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                </div>

                <div className="container-custom relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-5xl md:text-7xl font-bold mb-6">
                            Invest in <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Growth</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            One powerful plan. Unlimited possibilities.
                        </p>
                    </motion.div>

                    <div className="max-w-5xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="relative group"
                        >
                            {/* Glowing border effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

                            <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-gray-100">
                                <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full text-base font-bold shadow-xl flex items-center gap-2">
                                        <SparklesIcon className="w-5 h-5" />
                                        Most Popular
                                    </span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-12 items-center">
                                    <div className="space-y-8">
                                        <div>
                                            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Premium All-Access</h3>
                                            <p className="text-gray-600 text-lg leading-relaxed">
                                                The complete toolkit for businesses serious about dominating their local market. Get everything you need to generate reviews, manage reputation, and grow.
                                            </p>
                                        </div>

                                        <div className="flex items-baseline gap-2">
                                            <span className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">₹999</span>
                                            <span className="text-xl text-gray-500 font-medium">/ month</span>
                                        </div>
                                        <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">
                                            Cancel anytime
                                        </div>

                                        <button
                                            onClick={() => navigate('/onboarding')}
                                            className="w-full sm:w-auto group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xl rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                                        >
                                            <span className="relative z-10 flex items-center justify-center gap-3">
                                                Join Now
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                </svg>
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                        <p className="text-sm text-center sm:text-left text-gray-500">No hidden fees. Cancel anytime.</p>
                                    </div>

                                    <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
                                        <h4 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                            <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
                                            Everything included:
                                        </h4>
                                        <ul className="space-y-4">
                                            {[
                                                'Unlimited AI Review AI Generation',
                                                'Smart QR Code System',
                                                'Negative Feedback Protection Shield',
                                                'WhatsApp Review Requests',
                                                'Competitor Analysis Dashboard',
                                                'Multi-Location Support',
                                                'Priority 24/7 Support',
                                                'Custom Branding Options'
                                            ].map((feature, i) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <span className="text-gray-700 font-medium">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
