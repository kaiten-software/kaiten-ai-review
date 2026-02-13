import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getBusinessById } from '../data/businesses';
import { getClientById } from '../lib/supabase';
import { addReview } from '../lib/supabase';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { ArrowLeftIcon, StarIcon } from '@heroicons/react/24/solid';

export default function LeaveReviewPage() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hoverRating, setHoverRating] = useState(0);

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
                            google_business_url: (businessIdForDb === 'raj-salon') ? staticBusiness.google_business_url : (result.data.google_business_url || staticBusiness.google_business_url),
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
        services: [],
        staff: '',
        qualities: [],
        feelings: [],
        searchKeywords: [],
        additional: '',
        rating: 0
    });

    // Restore form data only if "Back" button was used (isEditing: true)
    useEffect(() => {
        const loadStoredData = () => {
            // Check if coming back from generate/private feedback using navigation state
            if (!location.state?.isEditing) {
                // Not editing - user refreshed or came from home
                return;
            }

            try {
                const storedReview = sessionStorage.getItem('reviewData');
                const storedFeedback = sessionStorage.getItem('privateFeedback');
                let dataToLoad = null;

                if (storedReview) {
                    const parsed = JSON.parse(storedReview);
                    // Check if the stored data is for the current business
                    if (String(parsed.businessId) === String(businessId)) {
                        dataToLoad = parsed;
                    }
                } else if (storedFeedback) {
                    const parsed = JSON.parse(storedFeedback);
                    if (String(parsed.businessId) === String(businessId)) {
                        dataToLoad = parsed;
                    }
                }

                if (dataToLoad) {
                    setFormData(prev => ({
                        ...prev,
                        services: dataToLoad.services || (dataToLoad.service ? [dataToLoad.service] : []),
                        staff: dataToLoad.staff || '',
                        qualities: dataToLoad.qualities || [],
                        feelings: dataToLoad.feelings || [],
                        searchKeywords: dataToLoad.searchKeywords || [],
                        additional: dataToLoad.additional || '',
                        rating: dataToLoad.rating || 0
                    }));
                }
            } catch (err) {
                console.error("Error loading stored form data:", err);
            }
        };

        loadStoredData();
    }, [businessId, location.state]);

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

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="text-4xl animate-bounce">✨</div></div>;
    if (!safeBusinessData || !safeBusinessData.id) return null;

    const displayBusiness = safeBusinessData;

    const toggleService = (service) => setFormData(p => ({ ...p, services: p.services.includes(service) ? p.services.filter(s => s !== service) : [...p.services, service] }));
    const toggleStaff = (staffName) => setFormData({ ...formData, staff: formData.staff === staffName ? '' : staffName });
    const toggleQuality = (quality) => setFormData(p => ({ ...p, qualities: p.qualities.includes(quality) ? p.qualities.filter(q => q !== quality) : [...p.qualities, quality] }));
    const toggleFeeling = (feeling) => setFormData(p => ({ ...p, feelings: p.feelings.includes(feeling) ? p.feelings.filter(f => f !== feeling) : [...p.feelings, feeling] }));
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
            service_used: formData.services.length > 0 ? formData.services.join(', ') : null,
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

        const commonData = {
            businessId: businessIdForDb,
            businessName: displayBusiness.business_name || displayBusiness.name,
            businessLogo: displayBusiness.logo,
            hero: displayBusiness.hero,
            ...formData
        };

        // Store data for the next page
        sessionStorage.setItem('reviewData', JSON.stringify({
            ...commonData,
            googleBusinessUrl: displayBusiness.google_business_url || null,
            socialMediaLinks: displayBusiness.social_media_links || [],
        }));
        navigate('/review-generated');
    };

    return (
        <div className="min-h-screen relative overflow-x-hidden font-sans">
            {/* Dynamic Business Background */}
            <div className="fixed inset-0 -z-20">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={displayBusiness.hero.main}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                        src={displayBusiness.hero.main}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>
            </div>

            {/* Dark Overlay for Readability */}
            <div className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-sm" />

            {/* Custom Navbar for Review Page with Back Button */}
            <div className="fixed top-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md z-40 border-b border-slate-100/50 px-4 md:px-8 flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-bold transition-colors group"
                >
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                        <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span className="text-sm uppercase tracking-wider">Back</span>
                </button>

                <div className="font-bold text-lg text-slate-800 hidden sm:block">
                    {displayBusiness.name}
                </div>
            </div>

            {/* Main Content Container - Centered and constrained */}
            <main className="pt-24 pb-20 px-4 md:px-8 max-w-3xl mx-auto w-full">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="w-full"
                >
                    {/* Header Text */}
                    <motion.div variants={itemVariants} className="text-center mb-10">
                        <span className="text-xs font-bold tracking-[0.2em] text-white/80 uppercase mb-3 block drop-shadow-sm">
                            We value your feedback
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight drop-shadow-lg">
                            How was your experience at<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-violet-300">
                                {displayBusiness.name}?
                            </span>
                        </h1>
                    </motion.div>

                    {/* Card Container */}
                    <motion.div
                        variants={itemVariants}
                        className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-10 relative overflow-hidden"
                    >
                        {/* Decorative Background Blob */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-50/50 to-transparent rounded-bl-full -z-10" />

                        <form onSubmit={handleSubmit} className="space-y-10">

                            {/* Service Selection */}
                            {displayBusiness.services?.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <label className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-lg shrink-0">1</span>
                                        What services did you use?
                                    </label>

                                    {(() => {
                                        const isPizzaCorner = (displayBusiness.id === 'pizza-corner' || displayBusiness.name.toLowerCase().includes('pizza'));
                                        const hasImages = !isPizzaCorner && displayBusiness.services.some(s => typeof s === 'object' && s?.image);

                                        return (
                                            <div className={hasImages ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "grid grid-cols-2 sm:flex sm:flex-wrap gap-3"}>
                                                {displayBusiness.services.map((service, index) => {
                                                    const isObject = typeof service === 'object' && service !== null;
                                                    const name = isObject ? service.name : service;
                                                    const price = isObject && service.price ? service.price : null;
                                                    const image = isObject && service.image ? service.image : null;
                                                    const isSelected = formData.services.includes(name);

                                                    if (!hasImages) {
                                                        // Bubble Style - Mobile Optimized
                                                        return (
                                                            <motion.button
                                                                key={index}
                                                                type="button"
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                onClick={() => toggleService(name)}
                                                                className={`py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-sm border w-full sm:w-auto flex justify-center items-center text-center ${isSelected
                                                                    ? 'bg-slate-900 text-white border-slate-900 shadow-slate-900/30'
                                                                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                                                                    }`}
                                                            >
                                                                {name}
                                                            </motion.button>
                                                        );
                                                    }

                                                    // Card Style
                                                    return (
                                                        <motion.button
                                                            key={index}
                                                            type="button"
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => toggleService(name)}
                                                            className={`relative overflow-hidden group rounded-2xl font-semibold text-center border transition-all duration-300 flex flex-col ${isSelected
                                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-white'
                                                                }`}
                                                        >
                                                            {image ? (
                                                                <div className="w-full h-32 relative">
                                                                    <img
                                                                        src={image}
                                                                        alt={name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.style.display = 'none';
                                                                            e.target.nextSibling.style.display = 'flex';
                                                                        }}
                                                                    />
                                                                    <div className="hidden absolute inset-0 bg-slate-100 items-center justify-center text-3xl">
                                                                        ✂️
                                                                    </div>
                                                                    {isSelected && <div className="absolute inset-0 bg-indigo-600/20 mix-blend-multiply" />}
                                                                </div>
                                                            ) : null}
                                                            <div className="p-4 flex flex-col items-center justify-center flex-grow w-full">
                                                                <span className="relative z-10 text-sm font-bold">{name}</span>

                                                            </div>
                                                        </motion.button>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })()}
                                </motion.div>
                            )}

                            {/* Staff Selection */}
                            {displayBusiness.staff?.length > 0 && (
                                <motion.div variants={itemVariants}>
                                    <label className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3">
                                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-lg shrink-0">2</span>
                                        Who served you?
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {displayBusiness.staff.map((member, index) => {
                                            const isObject = typeof member === 'object' && member !== null;
                                            const name = isObject ? member.name : member;
                                            const role = isObject ? member.role : null;
                                            const isSelected = formData.staff === name;

                                            return (
                                                <motion.button
                                                    key={index}
                                                    type="button"
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => toggleStaff(name)}
                                                    className={`p-4 rounded-2xl font-semibold text-center border transition-all duration-300 flex flex-col items-center justify-center ${isSelected
                                                        ? 'border-indigo-600 bg-indigo-600 text-white shadow-xl shadow-indigo-500/30'
                                                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-white'
                                                        }`}
                                                >
                                                    <span className="text-sm font-bold">{name}</span>
                                                    {role && (
                                                        <span className={`text-[10px] uppercase tracking-wider mt-1 ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                                                            {role}
                                                        </span>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {/* Qualities */}
                            <motion.div variants={itemVariants}>
                                <label className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-lg shrink-0">3</span>
                                    Quality of Work
                                </label>
                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                                    {displayBusiness.qualities.map((quality, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleQuality(quality)}
                                            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all border flex justify-center items-center text-center ${formData.qualities.includes(quality)
                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-white'
                                                }`}
                                        >
                                            {quality}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Feelings */}
                            <motion.div variants={itemVariants}>
                                <label className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-lg shrink-0">4</span>
                                    Vibe check
                                </label>
                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3">
                                    {feelingsWithEmojis.map((feeling, index) => (
                                        <motion.button
                                            key={index}
                                            type="button"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => toggleFeeling(feeling.text)}
                                            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all border flex justify-center items-center text-center ${formData.feelings.includes(feeling.text)
                                                ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-300 hover:bg-white'
                                                }`}
                                        >
                                            <span className="mr-2 opacity-90">{feeling.emoji}</span>
                                            {feeling.text}
                                        </motion.button>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Additional Comments */}
                            <motion.div variants={itemVariants}>
                                <label className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold shadow-lg shrink-0">5</span>
                                    Anything else?
                                </label>
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl blur opacity-25 group-focus-within:opacity-75 transition duration-500"></div>
                                    <textarea
                                        value={formData.additional}
                                        onChange={(e) => setFormData({ ...formData, additional: e.target.value })}
                                        rows="4"
                                        className="relative w-full px-6 py-5 rounded-3xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-400 focus:ring-0 focus:outline-none transition-all resize-none text-base text-slate-800 placeholder-slate-400 shadow-sm"
                                        placeholder="The details make the difference..."
                                    ></textarea>
                                </div>
                            </motion.div>

                            {/* Star Rating & Submit */}
                            <motion.div variants={itemVariants} className="pt-8 border-t border-slate-100">
                                <div className="text-center mb-10">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Your Final Rating</h3>
                                    <div className="flex justify-center gap-3 sm:gap-4" onMouseLeave={() => setHoverRating(0)}>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                type="button"
                                                whileHover={{ scale: 1.25, rotate: 10 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRatingClick(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                className="focus:outline-none relative group p-1"
                                            >
                                                <StarIcon
                                                    className={`w-10 h-10 sm:w-14 sm:h-14 transition-all duration-200 drop-shadow-md ${star <= (hoverRating || formData.rating)
                                                        ? 'text-yellow-400 scale-110 drop-shadow-lg filter'
                                                        : 'text-slate-200 group-hover:text-yellow-200'
                                                        }`}
                                                />
                                                {star <= (hoverRating || formData.rating) && (
                                                    <motion.div
                                                        className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full -z-10"
                                                        initial={{ opacity: 0, scale: 0.5 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    />
                                                )}
                                            </motion.button>
                                        ))}
                                    </div>
                                    <div className="h-6 mt-2">
                                        <AnimatePresence mode="wait">
                                            {(hoverRating > 0 || formData.rating > 0) && (
                                                <motion.div
                                                    key={hoverRating || formData.rating}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    className="text-lg font-bold text-slate-800"
                                                >
                                                    {(hoverRating || formData.rating) === 5 && "Absolutely loved it! 🌟"}
                                                    {(hoverRating || formData.rating) === 4 && "Great experience 👍"}
                                                    {(hoverRating || formData.rating) === 3 && "It was okay"}
                                                    {(hoverRating || formData.rating) === 2 && "Could be better"}
                                                    {(hoverRating || formData.rating) === 1 && "Not satisfied"}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={!formData.rating}
                                    className="w-full py-5 rounded-2xl bg-slate-900 text-white text-lg font-bold shadow-2xl shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group hover:bg-black transition-all"
                                >
                                    <span className="relative z-10">Generate Review</span>
                                    <ArrowLeftIcon className="w-5 h-5 rotate-180" />
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                </motion.button>
                            </motion.div>

                        </form>
                    </motion.div >

                </motion.div >
            </main >
            <Footer />
        </div >
    );
}
