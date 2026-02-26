import { motion, AnimatePresence } from 'framer-motion';
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
    const [showJoinPayment, setShowJoinPayment] = useState(false);
    const [joinUtr, setJoinUtr] = useState('');
    const [joinSubmitting, setJoinSubmitting] = useState(false);

    // Custom Smooth Typewriter State
    const [typeText, setTypeText] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);

    const typewriterWords = [
        { text: 'Authentic AI Reviews', color: 'from-[#0B2046] via-[#24889F] to-[#0B2046]' },
        { text: '5-Star Ratings', color: 'from-[#24889F] via-teal-500 to-[#0B2046]' },
        { text: 'Happy Customers', color: 'from-[#0B2046] via-indigo-600 to-[#24889F]' },
        { text: 'Real Feedback', color: 'from-[#24889F] via-blue-600 to-[#0B2046]' }
    ];

    useEffect(() => {
        let timer;
        const currentWord = typewriterWords[wordIndex].text;

        if (isDeleting) {
            timer = setTimeout(() => {
                setTypeText(currentWord.substring(0, typeText.length - 1));
                if (typeText.length <= 1) {
                    setIsDeleting(false);
                    setWordIndex((prev) => (prev + 1) % typewriterWords.length);
                }
            }, 30);
        } else {
            timer = setTimeout(() => {
                setTypeText(currentWord.substring(0, typeText.length + 1));
                if (typeText.length === currentWord.length) {
                    timer = setTimeout(() => setIsDeleting(true), 2500);
                }
            }, 70);
        }

        return () => clearTimeout(timer);
    }, [typeText, isDeleting, wordIndex]);

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

            // Show only top 6 businesses on homepage (sorted by rating)
            const sortedByRating = [...all].sort((a, b) => b.rating - a.rating);
            setVisibleBusinesses(sortedByRating.slice(0, 6));
        };
        loadBusinesses();
    }, []);

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
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-10 pb-32">
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
                        className="text-center max-w-5xl mx-auto mt-16 md:mt-24"
                    >
                        {/* Logo */}
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className="flex justify-center mb-16"
                        >
                            <Logo size="large" variant="full" />
                        </motion.div>

                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                            className="inline-block mb-10"
                        >
                            <span className="px-8 py-4 bg-gradient-to-r from-[#0B2046] to-[#24889F] text-white rounded-full text-base md:text-lg font-bold shadow-2xl animate-[pulse_2s_ease-in-out_infinite] hover:scale-105 transition-transform">
                                🚀 Authentic Growth Engine
                            </span>
                        </motion.div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight px-2">
                            <span className="text-[#0B2046]">Boost Your Business with</span>
                            <br />
                            <div className="inline-block mt-2 min-h-[1.5em] lg:min-h-[1.2em] whitespace-nowrap overflow-visible">
                                <span
                                    className={`bg-gradient-to-r ${typewriterWords[wordIndex].color} bg-clip-text text-transparent font-black pr-1 transition-all duration-300`}
                                    style={{
                                        backgroundSize: '200% 200%',
                                        animation: 'gradient-shift 4s ease infinite',
                                    }}
                                >
                                    {typeText}
                                </span>
                                <span className="inline-block w-[3px] h-[0.9em] bg-slate-800 dark:bg-slate-200 animate-[pulse_1s_infinite] align-middle -mt-2 opacity-80" />
                            </div>
                        </h1>

                        <p className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4">
                            <span className="font-bold text-red-500 block mb-2">⚠ Stop Buying Fake Reviews. It's Risky.</span>
                            Earn genuine 5-star ratings with AI. Your competitors are already using it to dominate the market—<span className="font-bold text-blue-600">don't get left behind.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4">
                            <button
                                onClick={() => document.getElementById('businesses').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden w-full sm:w-auto"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <SparklesIcon className="w-6 h-6" />
                                    Find a Business
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button
                                onClick={() => navigate('/onboarding')}
                                className="group relative px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden w-full sm:w-auto"
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
                                    className="bg-white/80 backdrop-blur-lg p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-white"
                                >
                                    <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${stat.color} rounded-xl sm:rounded-2xl flex items-center justify-center text-white mb-3 sm:mb-4 mx-auto shadow-lg`}>
                                        {stat.icon}
                                    </div>
                                    <div className={`text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}>
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-semibold text-sm sm:text-base">{stat.label}</div>
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
                            Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">RankBag</span>
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
                            Featured <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Businesses</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-10">
                            Discover our top-rated businesses and share your experience.
                        </p>


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

                    {/* Removed 'Explore All Businesses' button - only top 6 shown on homepage */}
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

                            <div className="relative bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-2xl border border-gray-100">
                                <div className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 w-max">
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-bold shadow-xl flex items-center gap-2">
                                        <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
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
