import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ClipboardDocumentIcon, ArrowLeftIcon, SparklesIcon, CheckBadgeIcon, ShieldCheckIcon, CheckCircleIcon, GiftIcon } from '@heroicons/react/24/solid';
import Footer from '../components/common/Footer';
import { addReview } from '../lib/supabase';

export default function ReviewGenerated() {
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [generatedContent, setGeneratedContent] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // Safe Copy Function for HTTP/HTTPS
    const copyToClipboard = async (text) => {
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for HTTP (non-secure)
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            textArea.style.top = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((resolve, reject) => {
                try {
                    document.execCommand('copy');
                    textArea.remove();
                    resolve();
                } catch (err) {
                    textArea.remove();
                    reject(err);
                }
            });
        }
    };

    useEffect(() => {
        const data = sessionStorage.getItem('reviewData');
        if (!data) {
            navigate('/');
            return;
        }
        const parsed = JSON.parse(data);
        setReviewData(parsed);

        let content = '';
        // Generate content based on rating
        if (parsed.rating > 3) {
            content = generateMediumReview(parsed);
        } else {
            content = generateConstructiveFeedback(parsed);
        }
        setGeneratedContent(content);

        // Auto-copy to clipboard
        if (content) {
            sessionStorage.setItem('generatedReview', content); // Save for later use
            copyToClipboard(content).then(() => {
                setShowToast(true);
                setTimeout(() => setShowToast(false), 4000);
            }).catch(err => console.log('Auto-copy blocked:', err));
        }
    }, [navigate]);

    const generateMediumReview = (data) => {
        const { businessName, service, services, staff, qualities, feelings, additional } = data;
        let review = `I had a fantastic experience at ${businessName}!`;

        const serviceList = services && services.length > 0 ? services.join(' and ') : service;
        const verb = (services && services.length > 1) ? 'were' : 'was';

        if (serviceList) review += ` The ${serviceList} ${verb} exactly what I needed.`;

        if (staff) review += ` ${staff} was incredibly helpful and professional.`;

        if (qualities.length > 0) {
            const selectedQualities = qualities.slice(0, 2).join(' and ');
            review += ` The service was ${selectedQualities}.`;
        }

        if (additional) review += ` ${additional}`;

        review += ` Highly recommend to anyone looking for quality service! ${data.rating} stars.`;
        return review;
    };

    const generateConstructiveFeedback = (data) => {
        const { service, services, additional, qualities } = data;

        const serviceList = services && services.length > 0 ? services.join(' and ') : service;
        let feedback = `I recently visited for ${serviceList || 'service'}.`;

        if (qualities.length > 0) {
            feedback += ` While I see potential, I think the ${qualities[0].toLowerCase()} aspect could be improved.`;
        }

        if (additional) feedback += ` ${additional}`;
        else feedback += ` I wanted to share this feedback so you can improve for future customers.`;

        return feedback;
    };


    const handlePostOnGoogle = async () => {
        // Copy review to clipboard
        try {
            await copyToClipboard(generatedContent);
        } catch (e) {
            console.warn('Copy failed', e);
        }

        // SAVE TO SUPABASE
        const servicesList = reviewData.services || (reviewData.service ? [reviewData.service] : []);

        const result = await addReview({
            business_id: reviewData.businessId || 'pizza-corner',
            business_name: reviewData.businessName || 'Pizza Corner',
            customer_name: reviewData.name || "Happy Customer",
            customer_email: reviewData.email || "",
            customer_phone: "",
            rating: reviewData.rating,
            review_text: generatedContent,
            qualities: reviewData.qualities || [],
            feelings: reviewData.feelings || [],
            service_used: servicesList.join(', '),
            staff_member: reviewData.staff || "",
            posted_to_google: true,
            is_public: true
        });

        if (result.success && result.data && result.data.length > 0) {
            sessionStorage.setItem('reviewId', result.data[0].id);
        }

        // Open Google Reviews
        // Prioritize the direct "Write a Review" URL format if a Place ID is available
        let targetUrl;
        if (reviewData.googlePlaceId) {
            targetUrl = `https://search.google.com/local/writereview?placeid=${reviewData.googlePlaceId}`;
        } else {
            targetUrl = reviewData.googleBusinessUrl || "https://www.google.com/search?q=raj-salon&lqi=CglyYWotc2Fsb25I_7OZmImygIAIWhMQABABGAAYASIJcmFqIHNhbG9ukgEMYmVhdXR5X3NhbG9u#lkt=LocalPoiReviews&rlimm=4264381171089884513&lrd=0xa976b4640dc76935:0x3b2e2014d9ad4561,3,,,,";
        }
        window.open(targetUrl, '_blank');
    };

    const handleSubmitPrivateFeedback = async () => {
        setIsSubmittingFeedback(true);

        // SAVE TO SUPABASE
        const servicesList = reviewData.services || (reviewData.service ? [reviewData.service] : []);

        const result = await addReview({
            business_id: reviewData.businessId || 'pizza-corner',
            business_name: reviewData.businessName || 'Pizza Corner',
            customer_name: reviewData.name || "Concerned Customer",
            customer_email: reviewData.email || "",
            customer_phone: "",
            rating: reviewData.rating,
            review_text: generatedContent,
            qualities: reviewData.qualities || [],
            feelings: reviewData.feelings || [],
            service_used: servicesList.join(', '),
            staff_member: reviewData.staff || "",
            posted_to_google: false,
            is_public: false
        });

        if (result.success && result.data && result.data.length > 0) {
            sessionStorage.setItem('reviewId', result.data[0].id);
        }

        // Simulate API call
        setTimeout(() => {
            setIsSubmittingFeedback(false);
            setFeedbackSubmitted(true);
        }, 1500);
    };

    const handleGoBack = () => {
        navigate(`/business/${reviewData.businessId}/review`, { state: { isEditing: true } });
    };

    if (!reviewData) return null;

    const isHighRating = reviewData.rating > 3;

    return (
        <div className="min-h-screen relative font-sans text-slate-800 flex flex-col">
            {/* Backgrounds */}
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

            {/* Navbar (simplified) */}
            <div className="fixed top-0 inset-x-0 z-40 p-4 flex justify-between items-center text-white bg-gradient-to-b from-black/50 to-transparent">
                <button onClick={handleGoBack} className="flex items-center gap-2 opacity-80 hover:opacity-100 font-medium px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md">
                    <ArrowLeftIcon className="w-5 h-5" /> Back
                </button>
                <div className="flex items-center gap-3">
                    <span className="font-bold text-lg hidden sm:block">{reviewData.businessName}</span>
                    <div className="text-3xl filter drop-shadow-lg">{reviewData.businessLogo}</div>
                </div>
            </div>

            <main className="container-custom pt-28 pb-12 flex-grow max-w-4xl mx-auto flex flex-col justify-center items-center">
                <div className="text-center mb-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg">
                            {isHighRating ? "Share the Love! ❤️" : "We Value Your Feedback 🙏"}
                        </h1>
                        <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto">
                            {isHighRating
                                ? "Your support helps us grow."
                                : "Help us improve our service."}
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl ring-1 ring-white/20 relative overflow-hidden w-full max-w-2xl"
                >
                    {/* Review Text Display */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 shadow-inner relative z-10">
                        <div className="absolute -top-3 -left-3 text-6xl text-slate-200 font-serif leading-none">“</div>
                        <p className="text-slate-700 leading-relaxed font-medium italic text-lg text-center px-4 relative z-10">
                            {generatedContent}
                        </p>
                        <div className="absolute -bottom-8 -right-3 text-6xl text-slate-200 font-serif leading-none rotate-180">“</div>
                    </div>

                    {/* Action Buttons */}
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-4 mt-8">
                        {isHighRating ? (
                            // HIGH RATING FLOW: Dual path
                            <>
                                <div className="relative group w-full">
                                    {/* Glowing effect */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-75 transition duration-500 animate-pulse"></div>

                                    <button
                                        onClick={() => navigate('/membership')}
                                        className="relative w-full py-5 bg-gradient-to-r from-slate-900 to-slate-800 border border-white/10 text-white rounded-xl font-bold text-xl shadow-2xl flex items-center justify-center gap-3 transition-transform active:scale-95 group overflow-hidden"
                                    >
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>

                                        <GiftIcon className="w-7 h-7 text-yellow-400 animate-bounce relative z-10" />
                                        <span className="relative z-10 tracking-wide text-white">
                                            Post with <span className="text-yellow-400 font-black">FREE</span> Offers
                                        </span>
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 px-8 py-2">
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                    <span className="text-slate-400 text-sm font-medium">or</span>
                                    <div className="h-px bg-slate-200 flex-1"></div>
                                </div>

                                <button
                                    onClick={handlePostOnGoogle}
                                    className="w-full py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-lg shadow-sm hover:shadow-md flex items-center justify-center gap-3 transition-all active:scale-95 group relative overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 relative z-10">
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span>Post on Google</span>
                                    </div>
                                    <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </button>
                            </>
                        ) : (
                            // LOW RATING FLOW: Feedback + Optional Membership
                            <div className="grid sm:grid-cols-2 gap-4 w-full">
                                {feedbackSubmitted ? (
                                    <div className="w-full py-4 bg-green-50 text-green-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 border border-green-200">
                                        <CheckBadgeIcon className="w-5 h-5" />
                                        Sent!
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleSubmitPrivateFeedback}
                                        disabled={isSubmittingFeedback}
                                        className="w-full py-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-lg shadow-lg shadow-slate-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
                                    >
                                        {isSubmittingFeedback ? "Sending..." : "Submit Feedback"}
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate('/membership')}
                                    className="w-full py-4 bg-transparent border-2 border-indigo-100 hover:border-indigo-300 text-indigo-600 hover:text-indigo-700 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    <GiftIcon className="w-5 h-5" />
                                    Claim Free Gift
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-slate-400 text-xs mt-6 font-medium">
                        {isHighRating ? "Review text has been copied for you!" : "Your feedback is private"}
                    </p>

                </motion.div>
            </main>
            <Footer />
            {/* Copied Toast Notification */}
            <AnimatePresence>
                {showToast && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: 50 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: 50, x: 50 }}
                        className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-white/10"
                    >
                        <div className="bg-green-500 rounded-full p-1">
                            <CheckCircleIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-sm">Review Copied!</p>
                            <p className="text-xs text-slate-400">Ready to paste on Google</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
}
