import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getBusinessById } from '../data/businesses';
import { getClientById, getReviewsByBusiness } from '../lib/supabase';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SocialMediaIcons from '../components/common/SocialMediaIcons';
import { StarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/solid';

export default function BusinessPage() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const fromDashboard = location.state?.from === 'client-dashboard' || location.state?.from === 'admin-dashboard' || location.state?.from === 'fsr-dashboard';
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topReviews, setTopReviews] = useState([]);
    const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

    // Load business data (static or from Supabase)
    useEffect(() => {
        const loadBusiness = async () => {
            setLoading(true);

            // First try to get from static businesses
            const staticBusiness = getBusinessById(businessId);
            let displayData = staticBusiness;

            // Try to get fresh data from Supabase to sync stats
            try {
                // Use business_id (Supabase key) or id (Static key)
                const idToFetch = staticBusiness?.id || businessId;
                const result = await getClientById(idToFetch);

                if (result.success && result.data) {
                    if (staticBusiness) {
                        // Merge static content with fresh Supabase stats
                        displayData = {
                            ...staticBusiness,
                            ...result.data, // Overwrite with dynamic data

                            // Prevent empty DB arrays from overwriting static data
                            services: (result.data.services?.length > 0) ? result.data.services : staticBusiness.services,
                            staff: (result.data.staff?.length > 0) ? result.data.staff : staticBusiness.staff,
                            qualities: (result.data.qualities?.length > 0) ? result.data.qualities : staticBusiness.qualities,
                            feelings: (result.data.feelings?.length > 0) ? result.data.feelings : staticBusiness.feelings,
                            searchKeywords: (result.data.searchKeywords?.length > 0) ? result.data.searchKeywords : staticBusiness.searchKeywords,

                            // Ensure we keep static content that might be missing in DB
                            gallery: staticBusiness.gallery || result.data.gallery,
                            features: staticBusiness.features || result.data.features,
                            hero: staticBusiness.hero || result.data.hero,
                            // But use FRESH stats
                            rating: result.data.rating || staticBusiness.rating,
                            reviewCount: result.data.reviewCount || staticBusiness.reviewCount
                        };
                    } else {
                        // Purely dynamic business
                        displayData = result.data;
                    }
                }
            } catch (err) {
                console.error("Error syncing with Supabase:", err);
                // Fallback to static data if DB fails
            }

            if (displayData && displayData.id) {
                setBusiness(displayData);
                setLoading(false);
            } else {
                // Business not found, redirect to home
                navigate('/');
                setLoading(false);
            }
        };

        loadBusiness();
    }, [businessId, navigate]);

    // Fetch and rotate top reviews
    useEffect(() => {
        const fetchReviews = async () => {
            if (!businessId) return;
            const result = await getReviewsByBusiness(businessId);
            if (result.success && result.data && result.data.length > 0) {
                // Filter 4 and 5 star reviews that are public and have actual AI text
                const top = result.data.filter(r =>
                    r.rating >= 4 &&
                    r.is_public !== false &&
                    (r.review_text || r.text) &&
                    (r.review_text || r.text).length > 10 &&
                    !(r.review_text || r.text).includes('Customer provided feedback')
                );
                // Sort by highest rating, then newest
                top.sort((a, b) => b.rating - a.rating || new Date(b.created_at) - new Date(a.created_at));

                if (top.length > 0) {
                    setTopReviews(top.slice(0, 5)); // Show top 5
                }
            }
        };
        fetchReviews();
    }, [businessId]);

    // Auto rotate reviews
    useEffect(() => {
        if (topReviews.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentReviewIndex(prev => (prev + 1) % topReviews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [topReviews]);

    // Ensure business has all required fields with defaults
    const safeBusinessData = business ? {
        ...business,
        services: business.services || [],
        staff: business.staff || [],
        qualities: business.qualities || [],
        feelings: business.feelings || [],
        gallery: business.gallery || [],
        hero: {
            main: business.hero?.main || business.hero_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
            overlay: business.hero?.overlay || 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
            gallery: business.gallery || business.hero?.gallery || []
        }
    } : null;

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">⏳</div>
                    <div className="text-xl font-semibold">Loading...</div>
                </div>
            </div>
        );
    }

    // Prevent rendering if business data is not available
    if (!safeBusinessData || !safeBusinessData.id) {
        return null;
    }

    // Use safeBusinessData for all rendering
    const displayBusiness = safeBusinessData;

    return (
        <div className="min-h-screen bg-gray-50 relative">
            {fromDashboard && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="fixed top-24 left-6 z-50"
                >
                    <button
                        onClick={() => {
                            if (location.state?.from === 'admin-dashboard') {
                                navigate('/admin/dashboard');
                            } else if (location.state?.from === 'fsr-dashboard') {
                                navigate('/fsr-dashboard');
                            } else {
                                navigate('/client/dashboard');
                            }
                        }}
                        className="bg-white/90 backdrop-blur-md hover:bg-white text-gray-900 px-6 py-3 rounded-full shadow-lg border border-gray-200 font-bold flex items-center gap-2 transition-all transform hover:scale-105 group"
                    >
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Back to Dashboard
                    </button>
                </motion.div>
            )}
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[65vh] sm:h-[75vh] md:h-[85vh] overflow-hidden">
                <motion.div
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <img
                        src={displayBusiness.hero.main}
                        alt={displayBusiness.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0" style={{ background: displayBusiness.hero.overlay }}></div>
                </motion.div>

                <div className="relative z-10 h-full flex items-center justify-center text-white text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="container-custom"
                    >
                        <div className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6">{displayBusiness.logo}</div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-shadow-lg leading-tight">{displayBusiness.name}</h1>
                        <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-shadow max-w-2xl mx-auto">{displayBusiness.tagline}</p>
                        <div className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                            <StarIcon className="w-5 h-5 sm:w-6 sm:h-6 fill-yellow-400" />
                            <span className="font-bold">{displayBusiness.rating}</span>
                            <span>({displayBusiness.reviewCount} reviews)</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mt-8 sm:mt-10 w-full max-w-md mx-auto sm:max-w-none">
                            <button
                                onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white/20 backdrop-blur-md border border-white/30 text-white font-bold rounded-xl shadow-lg hover:bg-white/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                            >
                                <span>ℹ️</span> About Business
                            </button>
                            <button
                                onClick={() => navigate(`/business/${businessId}/review`)}
                                className="px-6 py-3.5 sm:px-8 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 animate-pulse text-sm sm:text-base w-full sm:w-auto"
                            >
                                <StarIcon className="w-5 h-5" />
                                Leave a Review
                            </button>
                        </div>

                        {/* Social Media Icons */}
                        {displayBusiness.social_media_links && displayBusiness.social_media_links.length > 0 && (
                            <div className="mt-6 sm:mt-8">
                                <p className="text-xs sm:text-sm font-medium opacity-90 mb-2 sm:mb-3 uppercase tracking-wider text-shadow-sm">Follow Us</p>
                                <SocialMediaIcons
                                    socialLinks={displayBusiness.social_media_links}
                                    size="md"
                                    showLabels={false}
                                    center={true}
                                />
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 text-white z-20"
                >
                    <div className="text-center">
                        <div className="text-xs sm:text-sm mb-1 sm:mb-2">Scroll to explore</div>
                        <div className="text-xl sm:text-2xl">↓</div>
                    </div>
                </motion.div>
            </section>

            {/* Top Reviews Showcase */}
            {topReviews.length > 0 && (
                <section className="py-16 md:py-24 bg-white border-b border-slate-100 overflow-hidden relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 right-0 -mt-10 mr-10 text-slate-50 opacity-40 select-none">
                        <span className="text-[250px] leading-none font-serif">"</span>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent"></div>

                    <div className="container-custom relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-16"
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 font-bold text-sm mb-4">TESTIMONIALS</span>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">Customer Love</h2>
                            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">What people are saying about {displayBusiness.name}</p>
                        </motion.div>

                        <div className="max-w-4xl mx-auto min-h-[350px] relative flex items-center justify-center mb-12">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentReviewIndex}
                                    initial={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                                    animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                                    exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                    className="w-full px-4 md:px-8 py-8"
                                >
                                    <div className="bg-gradient-to-br from-white to-orange-50/30 rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-orange-100/50 relative group hover:shadow-[0_8px_30px_rgb(249,115,22,0.1)] transition-shadow duration-500">
                                        <div className="absolute top-6 right-10 text-orange-200 opacity-30 text-9xl font-serif leading-none group-hover:scale-110 group-hover:text-orange-300 transition-all duration-700">"</div>

                                        {/* Verified Review Badge */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1.5 rounded-full border border-green-200 shadow-sm flex items-center gap-2">
                                            <span className="text-green-500 text-sm">✓</span>
                                            <span className="text-xs font-bold text-slate-600 tracking-wide uppercase">Verified Customer</span>
                                        </div>

                                        <div className="flex flex-col items-center text-center relative z-10 pt-4">
                                            <div className="flex gap-1.5 mb-8">
                                                {[...Array(topReviews[currentReviewIndex].rating)].map((_, i) => (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                    >
                                                        <StarIcon className="w-6 h-6 md:w-8 md:h-8 fill-yellow-400 drop-shadow-sm" />
                                                    </motion.div>
                                                ))}
                                            </div>

                                            <div className="max-h-[200px] overflow-y-auto mb-10 custom-scrollbar px-4 w-full">
                                                <p className="text-xl md:text-2xl text-slate-700 font-medium italic mx-auto max-w-3xl leading-relaxed">
                                                    "{topReviews[currentReviewIndex].review_text || topReviews[currentReviewIndex].text}"
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 mt-auto">
                                                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl md:text-2xl shadow-lg border-4 border-white">
                                                    {topReviews[currentReviewIndex].customer_name?.charAt(0).toUpperCase() || '✨'}
                                                </div>
                                                <div className="text-left">
                                                    <h4 className="font-bold text-slate-900 text-lg">{topReviews[currentReviewIndex].customer_name || 'Happy Customer'}</h4>
                                                    <p className="text-sm font-medium text-slate-400">
                                                        {new Date(topReviews[currentReviewIndex].created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Pagination Dots */}
                        {topReviews.length > 1 && (
                            <div className="flex justify-center gap-3">
                                {topReviews.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setCurrentReviewIndex(idx)}
                                        className={`h-2 rounded-full transition-all duration-500 ease-in-out ${idx === currentReviewIndex ? 'bg-orange-500 w-10' : 'bg-slate-200 w-2 hover:bg-orange-300'}`}
                                        aria-label={`Go to review ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Services Section */}
            <section id="services" className="section bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">Our Services</h2>
                        <p className="text-xl text-gray-600">Premium services tailored for you</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayBusiness.services.map((service, index) => {
                            const isObject = typeof service === 'object' && service !== null;

                            if (!isObject) {
                                // Simple Card for String Services (e.g. Pizza Corner menu)
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.05 }}
                                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl font-bold group-hover:scale-110 transition-transform">
                                                🍽️
                                            </div>
                                            <h3 className="text-lg font-bold text-slate-800">{service}</h3>
                                        </div>
                                        <span className="text-slate-400 text-sm font-medium">Available</span>
                                    </motion.div>
                                );
                            }

                            // Full Card for detailed services (e.g. Raj's Salon)
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={service.image}
                                            alt={service.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="hidden absolute inset-0 bg-slate-100 items-center justify-center text-4xl text-slate-300">
                                            ✨
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                                        {service.description && <p className="text-gray-600 mb-4 text-sm">{service.description}</p>}
                                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                            <span className="text-xl font-bold text-indigo-600">{service.price}</span>
                                            <span className="text-gray-500 text-sm flex items-center gap-1">
                                                ⏱️ {service.duration}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Gallery Section - only show if there are images */}
            {displayBusiness.gallery && displayBusiness.gallery.length > 0 && (
                <section className="section bg-gray-50">
                    <div className="container-custom">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center mb-12"
                        >
                            <h2 className="text-4xl font-bold mb-4">Gallery</h2>
                            <p className="text-xl text-gray-600">Take a look at our work</p>
                        </motion.div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {displayBusiness.gallery.map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer"
                                >
                                    <img
                                        src={typeof image === 'string' ? image : (image.url || image.src || '')}
                                        alt={typeof image === 'string' ? 'Gallery Image' : (image.title || 'Gallery Image')}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.parentElement.style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                                            {typeof image === 'string' ? 'View' : (image.title || 'View')}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Staff Section */}
            <section className="section bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600">Experienced professionals at your service</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {displayBusiness.staff.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card text-center group"
                            >
                                <div className="relative w-32 h-32 mx-auto mb-6 overflow-hidden rounded-full">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                                <p className="text-primary font-semibold mb-2">{member.role}</p>
                                <p className="text-gray-600 text-sm mb-2">{member.experience} experience</p>
                                <p className="text-gray-500 text-sm">{member.specialty}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>



            {/* Contact Section */}
            <section className="section bg-white">
                <div className="container-custom max-w-4xl">
                    <div className="glass rounded-3xl p-8 md:p-12">
                        <h3 className="text-3xl font-bold mb-8 text-center">Contact Information</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-4">
                                <MapPinIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold mb-1">Address</h4>
                                    <p className="text-gray-600">{displayBusiness.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <PhoneIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold mb-1">Phone</h4>
                                    <p className="text-gray-600">{displayBusiness.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <EnvelopeIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold mb-1">Email</h4>
                                    <p className="text-gray-600">{displayBusiness.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <StarIcon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-semibold mb-1">Rating</h4>
                                    <p className="text-gray-600">{displayBusiness.rating} ★ ({displayBusiness.reviewCount} reviews)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
