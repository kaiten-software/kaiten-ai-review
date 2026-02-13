import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckBadgeIcon, SparklesIcon, ArrowLeftIcon, ShieldCheckIcon, GiftIcon } from '@heroicons/react/24/solid';
import { supabase } from '../lib/supabase';
import Footer from '../components/common/Footer';

export default function MembershipPage() {
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');

    useEffect(() => {
        const data = sessionStorage.getItem('reviewData');
        if (!data) {
            navigate('/');
            return;
        }
        const parsed = JSON.parse(data);
        setReviewData(parsed);

        // Generate content based on rating for clipboard copy
        if (parsed.rating > 3) {
            setGeneratedContent(generateMediumReview(parsed));
        }
    }, [navigate]);

    const generateMediumReview = (data) => {
        const { businessName, service, staff, qualities, feelings, additional } = data;
        let review = `I had a fantastic experience at ${businessName}!`;
        if (service) review += ` The ${service} was exactly what I needed.`;
        if (staff) review += ` ${staff} was incredibly helpful and professional.`;
        if (qualities.length > 0) {
            const selectedQualities = qualities.slice(0, 2).join(' and ');
            review += ` The service was ${selectedQualities}.`;
        }
        if (additional) review += ` ${additional}`;
        review += ` Highly recommend! ${data.rating} stars.`;
        return review;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // SAVE TO LOCAL STORAGE (Demo Persistence)
            const newReview = {
                id: Date.now(),
                customer: formData.name,
                rating: reviewData.rating,
                text: generatedContent || "Verified Customer Review",
                date: new Date().toISOString().split('T')[0],
                posted: true,
                source: "Membership Application",
                contact: `${formData.phone}${formData.email ? ' / ' + formData.email : ''}`, // Prioritize phone as requested
                membership: "VIP Member",
                businessId: reviewData.businessId || 'pizza-corner'
            };
            const existing = JSON.parse(localStorage.getItem('demo_reviews') || '[]');
            localStorage.setItem('demo_reviews', JSON.stringify([newReview, ...existing]));

            const storedReviewId = sessionStorage.getItem('reviewId');

            // Update the existing review with customer details
            if (storedReviewId) {
                const { error } = await supabase
                    .from('reviews')
                    .update({
                        customer_name: formData.name,
                        customer_email: formData.email,
                        customer_phone: formData.phone
                    })
                    .eq('id', storedReviewId);

                if (error) console.error('Supabase Error:', error);
            }

            // Simulate "Processing" for effect
            await new Promise(resolve => setTimeout(resolve, 800));
            // setIsSuccess(true);
            navigate('/coupon');

        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };



    if (!reviewData) return null;
    const isHighRating = reviewData.rating > 3;

    return (
        <div className="min-h-screen relative font-sans text-slate-800 flex flex-col">
            {/* Background */}
            <div className="fixed inset-0 -z-20">
                <AnimatePresence mode="wait">
                    {reviewData.hero && reviewData.hero.main && (
                        <motion.img
                            key={reviewData.hero.main}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                            src={reviewData.hero.main}
                            alt="Background"
                            className="w-full h-full object-cover"
                        />
                    )}
                </AnimatePresence>
            </div>
            <div className="fixed inset-0 -z-10 bg-black/60 backdrop-blur-md" />

            {/* Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10 shadow-sm">
                <div className="container-custom py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/review-generated')}
                        className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </div>
                        <span className="hidden sm:inline">Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-white hidden sm:block">Membership Application</span>
                        <div className="text-3xl filter drop-shadow-lg">{reviewData.businessLogo}</div>
                    </div>
                </div>
            </div>

            <main className="container-custom pt-32 pb-20 max-w-lg mx-auto flex-grow flex items-center justify-center">
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            className="w-full bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden border border-white/10 ring-1 ring-black/5"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                            <div className="text-center mb-8 relative z-10">
                                <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                                    <GiftIcon className="w-12 h-12 text-yellow-400 animate-pulse" />
                                </div>
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.3em] mb-2">Review Reward</h3>
                                <h1 className="text-3xl font-black mb-2 leading-tight">Unlock Your <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">FREE Offer</span></h1>
                                <p className="text-slate-400 text-sm mt-4">One step away! Enter your details to reveal your exclusive coupon.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                                <div>
                                    <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider ml-1 mb-1 block">Full Name</label>
                                    <input
                                        type="text" required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all font-medium"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider ml-1 mb-1 block">Email Address</label>
                                    <input
                                        type="email" required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all font-medium"
                                        placeholder="you@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider ml-1 mb-1 block">Phone Number</label>
                                    <input
                                        type="tel" required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all font-medium"
                                        placeholder="(555) 000-0000"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full py-4 mt-6 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-xl font-bold shadow-xl shadow-yellow-500/20 text-lg flex items-center justify-center gap-2 relative overflow-hidden group"
                                >
                                    {isSubmitting ? 'Unlocking...' : 'Get My Offer'}
                                </motion.button>
                            </form>
                        </motion.div>
                    ) : (
                        // This part will essentially be skipped as we navigate away, but kept as a fallback or for transition
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400"></div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
            <Footer />
        </div>
    );
}
