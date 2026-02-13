import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartIcon, CheckCircleIcon, UserIcon, EnvelopeIcon, PhoneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Footer from '../components/common/Footer';
import { addReview } from '../lib/supabase';

export default function PrivateFeedback() {
    const navigate = useNavigate();
    const [feedbackData, setFeedbackData] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [personalDetails, setPersonalDetails] = useState({
        name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        const data = sessionStorage.getItem('privateFeedback');
        if (!data) {
            navigate('/');
            return;
        }
        setFeedbackData(JSON.parse(data));
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!personalDetails.name || !personalDetails.phone) {
            alert('Please provide your name and phone number');
            return;
        }

        const reviewData = {
            business_id: feedbackData.businessId,
            business_name: feedbackData.businessName,
            customer_name: personalDetails.name,
            customer_email: personalDetails.email || null,
            customer_phone: personalDetails.phone,
            rating: feedbackData.rating,
            review_text: feedbackData.additional || 'Customer provided feedback',
            qualities: feedbackData.qualities || [],
            feelings: feedbackData.feelings || [],
            service_used: feedbackData.service || null,
            staff_member: feedbackData.staff || null,
            posted_to_google: false,
            is_public: false
        };

        try {
            // SAVE TO LOCAL STORAGE (Demo Persistence)
            const demoReview = {
                id: Date.now(),
                customer: personalDetails.name,
                rating: feedbackData.rating,
                text: feedbackData.additional || 'Customer provided feedback',
                date: new Date().toISOString().split('T')[0],
                posted: false,
                source: "Private Feedback",
                contact: `${personalDetails.phone}${personalDetails.email ? ' / ' + personalDetails.email : ''}`, // Prioritize phone
                membership: null,
                businessId: feedbackData.businessId || 'pizza-corner'
            };
            const existing = JSON.parse(localStorage.getItem('demo_reviews') || '[]');
            localStorage.setItem('demo_reviews', JSON.stringify([demoReview, ...existing]));

            const result = await addReview(reviewData);
            if (result.success || result) { // Handle mock success if addReview is mocked
                setSubmitted(true);
                setTimeout(() => {
                    sessionStorage.removeItem('privateFeedback');
                    navigate('/');
                }, 4000);
            } else {
                alert(`Error: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("Submission error:", error);
            // Fallback for demo if supabase fails
            setSubmitted(true);
        }
    };

    if (!feedbackData) return null;

    if (submitted) {
        return (
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-sans text-gray-800 flex-col">
                {/* Consistent Background */}
                <div className="fixed inset-0 -z-20">
                    <AnimatePresence mode="wait">
                        {feedbackData.hero && feedbackData.hero.main && (
                            <motion.img
                                key={feedbackData.hero.main}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                                src={feedbackData.hero.main}
                                alt="Background"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </AnimatePresence>
                </div>
                <div className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-md" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/95 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-2xl text-center max-w-lg mx-4 border border-white/50 relative overflow-hidden ring-1 ring-black/5"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30 relative z-10"
                    >
                        <CheckCircleIcon className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-slate-800 mb-4 tracking-tight relative z-10">Feedback Received</h2>
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed relative z-10">
                        Thank you for your honest feedback. We're committed to improving your experience.
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mx-auto relative z-10" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative font-sans text-slate-800 overflow-hidden flex flex-col">
            {/* Dynamic Business Background */}
            <div className="fixed inset-0 -z-20">
                <AnimatePresence mode="wait">
                    {feedbackData.hero && feedbackData.hero.main && (
                        <motion.img
                            key={feedbackData.hero.main}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            src={feedbackData.hero.main}
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    )}
                </AnimatePresence>
            </div>
            {/* Refined Overlay for Readability */}
            <div className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-sm" />

            <div className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10 shadow-sm">
                <div className="container-custom py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate(`/business/${feedbackData.businessId}/review`, { state: { isEditing: true } })}
                        className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all shadow-sm">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </div>
                        <span className="hidden sm:inline text-white">Back</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="font-bold text-lg text-white hidden sm:block">We Value Your Feedback</span>
                        <div className="text-3xl filter drop-shadow-lg scale-110">{feedbackData.businessLogo}</div>
                    </div>
                </div>
            </div>

            <main className="container-custom pt-32 pb-20 max-w-3xl flex-grow">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/95 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden ring-1 ring-black/5"
                >
                    {/* Decorative background element inside card */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-rose-50/50 to-transparent rounded-bl-full -z-10" />

                    <div className="text-center mb-12 relative z-10">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/20"
                        >
                            <HeartIcon className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">We Hear You</h1>
                        <p className="text-lg text-slate-600 max-w-lg mx-auto">
                            {feedbackData.businessName} values your input. Please help us understand how we can do better next time.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                        {/* Feedback Summary Receipt */}
                        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-100 max-w-lg mx-auto relative overflow-hidden shadow-inner">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-orange-500" />
                            <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-widest opacity-50">Your Experience Summary</h3>
                            <div className="space-y-3 text-slate-700">
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="font-medium text-slate-500">Rating</span>
                                    <span className="font-bold text-slate-900">{feedbackData.rating} Stars</span>
                                </div>
                                {feedbackData.service && (
                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                        <span className="font-medium text-slate-500">Service</span>
                                        <span className="font-bold text-slate-900 text-right">{feedbackData.service}</span>
                                    </div>
                                )}
                                {feedbackData.additional && (
                                    <div className="pt-2">
                                        <span className="font-medium text-slate-500 block mb-2">Comments</span>
                                        <p className="text-slate-800 italic bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-sm">"{feedbackData.additional}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="space-y-6 pt-4">
                            <div className="text-center">
                                <h3 className="font-bold text-xl text-slate-900">Let's Connect</h3>
                                <p className="text-slate-500 text-sm mt-1">Share your contact info so management can address your concerns directly.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <UserIcon className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={personalDetails.name}
                                        onChange={(e) => setPersonalDetails({ ...personalDetails, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all outline-none font-medium text-slate-800 placeholder-slate-400"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <PhoneIcon className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="tel"
                                        value={personalDetails.phone}
                                        onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all outline-none font-medium text-slate-800 placeholder-slate-400"
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute left-4 top-4 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    value={personalDetails.email}
                                    onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all outline-none font-medium text-slate-800 placeholder-slate-400"
                                    placeholder="Email Address (Optional)"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-600 to-orange-600 text-white text-xl font-bold shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 relative overflow-hidden group hover:from-rose-500 hover:to-orange-500 transition-all"
                        >
                            <span className="relative z-10">Submit Feedback</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>

                    </form>

                </motion.div>
                <Footer />
            </main>
        </div>
    );
}
