import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HeartIcon, CheckCircleIcon, UserIcon, EnvelopeIcon, PhoneIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/common/Navbar';
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
            const result = await addReview(reviewData);
            if (result.success) {
                setSubmitted(true);
                setTimeout(() => {
                    sessionStorage.removeItem('privateFeedback');
                    navigate('/');
                }, 4000);
            } else {
                alert(`Error: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            alert(`Error: ${error.message || 'Unknown error'}`);
        }
    };

    if (!feedbackData) return null;

    if (submitted) {
        return (
            <div className="min-h-screen relative overflow-hidden flex items-center justify-center font-sans text-gray-800">
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100 via-white to-blue-100 opacity-90" />
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/60 backdrop-blur-2xl p-12 rounded-[2.5rem] shadow-2xl shadow-green-500/10 text-center max-w-lg mx-4 border border-white/50"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/30"
                    >
                        <CheckCircleIcon className="w-12 h-12 text-white" />
                    </motion.div>
                    <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Feedback Received</h2>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                        Thank you for your honest feedback. We're committed to improving your experience.
                    </p>
                    <div className="h-1 w-24 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full mx-auto" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative font-sans text-gray-800 overflow-hidden">
            {/* Cooperative Gradient Background */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-white to-rose-100 opacity-80" />
            <div className="fixed inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />

            <div className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm">
                <div className="container-custom py-4 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </div>
                        <span>Back</span>
                    </button>
                    <div className="font-bold text-lg">Private Feedback</div>
                    <div className="w-16"></div>
                </div>
            </div>

            <main className="container-custom pt-32 pb-20 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-500/5 relative overflow-hidden"
                >
                    <div className="text-center mb-12 relative z-10">
                        <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-rose-400 to-orange-500 rounded-3xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/20"
                        >
                            <HeartIcon className="w-10 h-10 text-white" />
                        </motion.div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">We Hear You</h1>
                        <p className="text-lg text-gray-500 max-w-lg mx-auto">
                            We value your input. Please help us understand how we can do better next time.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8 relative z-10">

                        {/* Feedback Summary Receipt */}
                        <div className="bg-white/50 rounded-2xl p-6 border border-white max-w-lg mx-auto relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 to-orange-500" />
                            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wide opacity-50">Your Experience</h3>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="font-medium text-gray-500">Rating</span>
                                    <span className="font-bold text-gray-900">{feedbackData.rating} Stars</span>
                                </div>
                                <div className="flex justify-between border-b border-gray-100 pb-2">
                                    <span className="font-medium text-gray-500">Service</span>
                                    <span className="font-bold text-gray-900 text-right">{feedbackData.service}</span>
                                </div>
                                {feedbackData.additional && (
                                    <div className="pt-2">
                                        <span className="font-medium text-gray-500 block mb-1">Comments</span>
                                        <p className="text-gray-900 italic bg-white p-3 rounded-lg border border-gray-100">"{feedbackData.additional}"</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="space-y-6">
                            <div className="text-center">
                                <h3 className="font-bold text-xl text-gray-900">Let's Connect</h3>
                                <p className="text-gray-500 text-sm">Share your contact info so management can address your concerns directly.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative group">
                                    <UserIcon className="w-5 h-5 text-gray-400 absolute left-4 top-4 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        value={personalDetails.name}
                                        onChange={(e) => setPersonalDetails({ ...personalDetails, name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                                        placeholder="Full Name"
                                        required
                                    />
                                </div>
                                <div className="relative group">
                                    <PhoneIcon className="w-5 h-5 text-gray-400 absolute left-4 top-4 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="tel"
                                        value={personalDetails.phone}
                                        onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                                        placeholder="Phone Number"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="relative group">
                                <EnvelopeIcon className="w-5 h-5 text-gray-400 absolute left-4 top-4 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    value={personalDetails.email}
                                    onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium"
                                    placeholder="Email Address (Optional)"
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02, translateY: -2 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xl font-bold shadow-xl shadow-rose-500/20 flex items-center justify-center gap-3 relative overflow-hidden group"
                        >
                            <span className="relative z-10">Submit Feedback</span>
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.button>

                    </form>

                    {/* Background Decor */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-rose-500/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-0" />
                </motion.div>
                <Footer />
            </main>
        </div>
    );
}
