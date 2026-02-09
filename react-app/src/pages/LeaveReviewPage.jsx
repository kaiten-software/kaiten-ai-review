import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getBusinessById } from '../data/businesses';
import { getClientById } from '../lib/supabase';
import { addReview } from '../lib/supabase';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { StarIcon, ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function LeaveReviewPage() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 50 }
        }
    };

    // Load business data
    useEffect(() => {
        const loadBusiness = async () => {
            setLoading(true);
            const staticBusiness = getBusinessById(businessId);
            let displayData = staticBusiness;

            try {
                const idToFetch = staticBusiness?.id || businessId;
                const result = await getClientById(idToFetch);

                if (result.success && result.data) {
                    if (staticBusiness) {
                        displayData = {
                            ...staticBusiness,
                            ...result.data,
                            services: (result.data.services?.length > 0) ? result.data.services : staticBusiness.services,
                            staff: (result.data.staff?.length > 0) ? result.data.staff : staticBusiness.staff,
                            qualities: (result.data.qualities?.length > 0) ? result.data.qualities : staticBusiness.qualities,
                            feelings: (result.data.feelings?.length > 0) ? result.data.feelings : staticBusiness.feelings,
                            searchKeywords: (result.data.searchKeywords?.length > 0) ? result.data.searchKeywords : staticBusiness.searchKeywords,
                            gallery: staticBusiness.gallery || result.data.gallery,
                            hero: staticBusiness.hero || result.data.hero,
                            rating: result.data.rating || staticBusiness.rating,
                            reviewCount: result.data.reviewCount || staticBusiness.reviewCount
                        };
                    } else {
                        displayData = result.data;
                    }
                }
            } catch (err) {
                console.error("Error syncing with Supabase:", err);
            }

            if (displayData && displayData.id) {
                setBusiness(displayData);
                setLoading(false);
            } else {
                navigate('/');
                setLoading(false);
            }
        };
        loadBusiness();
    }, [businessId, navigate]);

    const [formData, setFormData] = useState({
        service: '',
        staff: '',
        qualities: [],
        feelings: [],
        searchKeywords: [],
        additional: '',
        rating: 0
    });

    const feelingsWithEmojis = [
        { text: 'Happy', emoji: '😊' },
        { text: 'Excited', emoji: '🎉' },
        { text: 'Satisfied', emoji: '😌' },
        { text: 'Impressed', emoji: '😍' },
        { text: 'Grateful', emoji: '🙏' },
        { text: 'Relaxed', emoji: '😎' },
        { text: 'Delighted', emoji: '🥰' },
        { text: 'Amazed', emoji: '🤩' }
    ];

    const searchKeywords = business?.searchKeywords || business?.search_keywords || [
        'Best service', 'Top-rated', 'Professional', 'Highly recommended', 'Quality service', 'Excellent', 'Best in town', 'Five-star'
    ];

    const safeBusinessData = business ? {
        ...business,
        services: business.services || [],
        staff: business.staff || [],
        qualities: business.qualities || ['Professional', 'Friendly', 'Quality', 'Reliable', 'Excellent', 'Skilled'],
        feelings: business.feelings || ['Happy', 'Satisfied', 'Impressed', 'Delighted', 'Grateful', 'Pleased'],
        gallery: business.gallery || [],
        hero: {
            main: business.hero?.main || business.hero_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop',
            overlay: business.hero?.overlay || 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
            gallery: business.hero?.gallery || []
        }
    } : null;

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="text-4xl animate-bounce">✨</div></div>;
    if (!safeBusinessData || !safeBusinessData.id) return null;

    const displayBusiness = safeBusinessData;

    const toggleService = (service) => setFormData({ ...formData, service: formData.service === service ? '' : service });
    const toggleStaff = (staffName) => setFormData({ ...formData, staff: formData.staff === staffName ? '' : staffName });
    const toggleQuality = (quality) => setFormData(p => ({ ...p, qualities: p.qualities.includes(quality) ? p.qualities.filter(q => q !== quality) : [...p.qualities, quality] }));
    const toggleFeeling = (feeling) => setFormData(p => ({ ...p, feelings: p.feelings.includes(feeling) ? p.feelings.filter(f => f !== feeling) : [...p.feelings, feeling] }));
    const toggleSearchKeyword = (keyword) => setFormData(p => ({ ...p, searchKeywords: p.searchKeywords.includes(keyword) ? p.searchKeywords.filter(k => k !== keyword) : [...p.searchKeywords, keyword] }));
    const handleRatingClick = (rating) => setFormData({ ...formData, rating });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const businessIdForDb = displayBusiness.business_id || displayBusiness.id;
        const reviewData = {
            business_id: businessIdForDb,
            business_name: displayBusiness.business_name || displayBusiness.name,
            customer_name: '',
            customer_email: '',
            customer_phone: null,
            rating: formData.rating,
            review_text: formData.additional || 'Great experience!',
            qualities: formData.qualities,
            feelings: formData.feelings,
            service_used: formData.service || null,
            staff_member: formData.staff || null,
            posted_to_google: false,
            is_public: formData.rating > 3
        };

        try {
            const result = await addReview(reviewData);
            if (result.success && result.data && result.data[0]) {
                sessionStorage.setItem('reviewId', result.data[0].id);
            }
        } catch (error) {
            console.error('Database error:', error);
        }

        if (formData.rating <= 3) {
            sessionStorage.setItem('privateFeedback', JSON.stringify({ businessId: businessIdForDb, businessName: displayBusiness.business_name || displayBusiness.name, ...formData }));
            navigate('/private-feedback');
        } else {
            sessionStorage.setItem('reviewData', JSON.stringify({
                businessId: businessIdForDb,
                businessName: displayBusiness.business_name || displayBusiness.name,
                businessLogo: displayBusiness.logo,
                googleBusinessUrl: displayBusiness.google_business_url || null,
                socialMediaLinks: displayBusiness.social_media_links || [],
                ...formData
            }));
            navigate('/review-generated');
        }
    };

    return (
        <div className="min-h-screen relative font-sans text-gray-800 overflow-hidden bg-slate-50">
            {/* Clean Professional Background */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-gray-100" />

            {/* Simplified Header */}
            <motion.div
                initial={{ y: -100 }} animate={{ y: 0 }} transition={{ type: "spring", stiffness: 100 }}
                className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm"
            >
                <div className="container-custom py-4 flex items-center justify-between">
                    <button onClick={() => navigate(`/business/${businessId}`)} className="group flex items-center gap-2 text-gray-500 hover:text-slate-900 transition-colors font-medium">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </div>
                        <span>Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <motion.div whileHover={{ rotate: 10 }} className="text-3xl filter drop-shadow-md">{displayBusiness.logo}</motion.div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold leading-none">{displayBusiness.name}</h1>
                        </div>
                    </div>
                    <div className="w-16"></div>
                </div>
            </motion.div>

            {/* Main Content */}
            <main className="container-custom pt-32 pb-20 max-w-4xl">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="relative"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-12 relative">
                        <h2 className="text-sm font-bold tracking-[0.3em] text-slate-500 uppercase mb-2">Feedback</h2>
                        <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                            Share Your Experience
                        </h3>
                        <p className="text-lg text-slate-500 max-w-xl mx-auto">
                            Your feedback helps us provide better service.
                        </p>
                    </motion.div>

                    {/* Form Card */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white border border-gray-200 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
                    >
                        <form onSubmit={handleSubmit} className="space-y-12">

                            {/* Service Selection */}
                            {displayBusiness.services?.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <label className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">1</span>
                                        Which service did you use?
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {displayBusiness.services.map((service, index) => (
                                            <motion.button
                                                key={index}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleService(service.name)}
                                                className={`relative overflow-hidden group p-4 rounded-xl font-semibold text-center border-2 transition-all duration-300 ${formData.service === service.name
                                                    ? 'border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                                    : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                                                    }`}
                                            >
                                                <span className="relative z-10 text-sm md:text-base">{service.name}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Staff Selection */}
                            {displayBusiness.staff?.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <label className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">2</span>
                                        Who served you? <span className="text-sm font-normal text-gray-400 ml-auto">(Optional)</span>
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {displayBusiness.staff.map((member, index) => (
                                            <motion.button
                                                key={index}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleStaff(member.name)}
                                                className={`p-4 rounded-xl font-semibold text-center border-2 transition-all duration-300 ${formData.staff === member.name
                                                    ? 'border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/20'
                                                    : 'border-slate-100 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50/30'
                                                    }`}
                                            >
                                                <span className="text-sm md:text-base">{member.name}</span>
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {/* Qualities */}
                            <motion.div variants={itemVariants}>
                                <label className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">3</span>
                                    Quality of Work
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {displayBusiness.qualities.map((quality, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleQuality(quality)}
                                            className={`px-6 py-3 rounded-full font-medium text-sm transition-all border-2 ${formData.qualities.includes(quality)
                                                ? 'border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-700'
                                                }`}
                                        >
                                            {quality}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Feelings */}
                            <motion.div variants={itemVariants}>
                                <label className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">4</span>
                                    How did you feel?
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {feelingsWithEmojis.map((feeling, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleFeeling(feeling.text)}
                                            className={`px-6 py-3 rounded-full font-medium text-sm transition-all border-2 ${formData.feelings.includes(feeling.text)
                                                ? 'border-transparent bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20'
                                                : 'border-slate-100 bg-white text-slate-500 hover:border-blue-200 hover:text-blue-700'
                                                }`}
                                        >
                                            <span className="mr-2 opacity-80">{feeling.emoji}</span>
                                            {feeling.text}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Additional Comments */}
                            <motion.div variants={itemVariants}>
                                <label className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-sm font-bold">5</span>
                                    Any extra details?
                                </label>
                                <div className="relative">
                                    <textarea
                                        value={formData.additional}
                                        onChange={(e) => setFormData({ ...formData, additional: e.target.value })}
                                        rows="4"
                                        className="w-full px-6 py-5 rounded-3xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-slate-400 focus:ring-0 focus:outline-none transition-all resize-none text-lg text-slate-800 placeholder-slate-400 shadow-inner"
                                        placeholder="The staff was amazing..."
                                    ></textarea>
                                </div>
                            </motion.div>

                            {/* Star Rating & Submit */}
                            <motion.div variants={itemVariants} className="pt-8 border-t border-gray-100">
                                <label className="block text-2xl font-black text-center text-slate-800 mb-8">
                                    Your Final Rating
                                </label>
                                <div className="flex justify-center gap-3 mb-12">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <motion.button
                                            key={star}
                                            type="button"
                                            whileHover={{ scale: 1.2, rotate: 10 }}
                                            whileTap={{ scale: 0.8 }}
                                            onClick={() => handleRatingClick(star)}
                                            className="focus:outline-none relative group"
                                        >
                                            <StarIcon
                                                className={`w-14 h-14 transition-all duration-300 ${star <= formData.rating
                                                    ? 'text-yellow-400 fill-yellow-400 drop-shadow-md'
                                                    : 'text-gray-200 fill-gray-200 group-hover:text-yellow-200'
                                                    }`}
                                            />
                                        </motion.button>
                                    ))}
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, translateY: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={!formData.rating}
                                    className="w-full py-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-xl font-bold shadow-2xl shadow-slate-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group hover:from-black hover:to-slate-900 transition-all"
                                >
                                    <span className="relative z-10">Continue</span>
                                    <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                                </motion.button>
                            </motion.div>

                        </form>
                    </motion.div>

                </motion.div>
                <Footer />
            </main>
        </div>
    );
}
