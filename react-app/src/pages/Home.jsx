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
    UserGroupIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';
import TutorialSection from '../components/home/TutorialSection';

export default function Home() {
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState(getAllBusinesses());

    useEffect(() => {
        const loadBusinesses = async () => {
            // Get static businesses first
            const staticBusinesses = getAllBusinesses();

            // Get Supabase clients
            const result = await getAllClients();
            if (result.success && result.data) {
                // Filter out test clients (FEWGW and AT bar)
                const supabaseClients = result.data.filter(client => {
                    const name = (client.business_name || client.name || '').toLowerCase();
                    return !name.includes('fewgw') && !name.includes('at bar');
                });

                // Map Supabase clients to business format
                const mapped = supabaseClients.map(client => ({
                    id: client.business_id || client.id,
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
                }));

                // Merge: Keep all static businesses and add only new Supabase clients
                const staticIds = staticBusinesses.map(b => b.id);
                const newClients = mapped.filter(c => !staticIds.includes(c.id));
                setBusinesses([...staticBusinesses, ...newClients]);
            } else {
                // Fallback to static businesses only
                setBusinesses(staticBusinesses);
            }
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

    const pricingPlans = [
        {
            name: 'Monthly',
            price: '₹2,999',
            period: '/month',
            features: [
                'Unlimited AI reviews',
                'QR code generation',
                'Basic analytics dashboard',
                'Email support',
                'Single location'
            ],
            popular: false,
            gradient: 'from-blue-600 to-cyan-600'
        },
        {
            name: 'Annual',
            price: '₹29,999',
            period: '/year',
            savings: 'Save ₹6,000',
            features: [
                'Everything in Monthly',
                'Priority support',
                'Advanced analytics',
                'Custom branding',
                'API access',
                'Multi-location support'
            ],
            popular: true,
            gradient: 'from-purple-600 to-pink-600'
        },
        {
            name: '3-Year Plan',
            price: '₹74,999',
            period: '/3 years',
            savings: 'Save ₹33,000',
            features: [
                'Everything in Annual',
                'Dedicated account manager',
                'White-label solution',
                'Unlimited locations',
                'Premium features',
                'Custom integrations'
            ],
            popular: false,
            gradient: 'from-indigo-600 to-purple-600'
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
                            <span className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-base font-bold shadow-2xl">
                                ✨ Next-Gen AI Review Platform
                            </span>
                        </motion.div>

                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                            <span className="text-gray-900">Transform Your</span>
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Online Reputation
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Harness the power of AI to generate authentic reviews, boost your ratings,
                            and build trust with customers. Built by <strong className="text-blue-600">Kaiten Software</strong>.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                            <button
                                onClick={() => document.getElementById('businesses').scrollIntoView({ behavior: 'smooth' })}
                                className="group relative px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <SparklesIcon className="w-6 h-6" />
                                    Leave a Review
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                            <button
                                onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
                                className="px-10 py-5 bg-white text-blue-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-200 hover:border-blue-400"
                            >
                                View Pricing
                            </button>
                        </div>

                        {/* Stats - Redesigned with better spacing */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                        >
                            {[
                                { number: '1,000+', label: 'Active Businesses', icon: <UserGroupIcon className="w-8 h-8" />, color: 'from-blue-500 to-cyan-500' },
                                { number: '50K+', label: 'Reviews Generated', icon: <StarIcon className="w-8 h-8" />, color: 'from-purple-500 to-pink-500' },
                                { number: '4.9★', label: 'Average Rating', icon: <SparklesIcon className="w-8 h-8" />, color: 'from-orange-500 to-red-500' }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.9 + index * 0.1, type: 'spring' }}
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
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            Select a <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Business</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Choose a business to share your experience and help others make informed decisions
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {businesses.map((business, index) => (
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
                </div>
            </section>

            {/* Pricing Section - With better design */}
            <section id="pricing" className="section relative py-32 bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-6">
                            Simple, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Transparent Pricing</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            Choose the perfect plan for your business. All plans include unlimited AI-generated reviews.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {pricingPlans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className={`relative bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 ${plan.popular ? 'border-purple-400 scale-105 z-10' : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className={`absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.gradient} text-white px-8 py-3 rounded-full text-sm font-bold shadow-xl`}>
                                        ⭐ Most Popular
                                    </div>
                                )}

                                <div className="text-center mb-8 mt-4">
                                    <h3 className="text-3xl font-bold mb-4">{plan.name}</h3>
                                    {plan.savings && (
                                        <div className="inline-block bg-green-100 text-green-700 px-5 py-2 rounded-full text-sm font-bold mb-4">
                                            {plan.savings}
                                        </div>
                                    )}
                                    <div className="flex items-baseline justify-center gap-2">
                                        <span className={`text-6xl font-bold bg-gradient-to-r ${plan.gradient} bg-clip-text text-transparent`}>
                                            {plan.price}
                                        </span>
                                        <span className="text-gray-500 text-xl">{plan.period}</span>
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-10">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircleIcon className={`w-6 h-6 flex-shrink-0 ${plan.popular ? 'text-purple-600' : 'text-green-500'}`} />
                                            <span className="text-gray-700 leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} font-bold py-5 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl`}>
                                    Get Started
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section relative overflow-hidden py-32 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>

                <div className="container-custom text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-white"
                    >
                        <h2 className="text-5xl md:text-6xl font-bold mb-8">
                            Ready to Transform Your Reviews?
                        </h2>
                        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-95 leading-relaxed">
                            Join over 1,000 businesses using Kaiten AI Review Platform to build trust,
                            attract customers, and grow their online presence.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <button className="px-12 py-6 bg-white text-purple-600 hover:bg-gray-100 font-bold text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center gap-3">
                                <RocketLaunchIcon className="w-7 h-7" />
                                Start Free Trial
                            </button>
                            <button className="px-12 py-6 bg-white/10 backdrop-blur-lg text-white border-2 border-white hover:bg-white/20 font-bold text-xl rounded-2xl transition-all duration-300">
                                Schedule Demo
                            </button>
                        </div>

                        {/* Powered by Kaiten Software */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="mt-20 pt-12 border-t border-white/20"
                        >
                            <p className="text-white/80 mb-6 text-lg">Powered by</p>
                            <Logo size="medium" variant="full" className="justify-center" isDark={true} />
                            <p className="text-white/60 mt-6 text-base">
                                B-95 Bhan Nagar, Prince Road, Jaipur, RJ 302021 | www.kaitensoftware.com
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
