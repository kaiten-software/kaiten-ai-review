import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QrCodeIcon,
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    ShareIcon,
    SparklesIcon,
    ClockIcon,
    TicketIcon,
    GiftIcon
} from '@heroicons/react/24/solid';
import { generateCoupon } from '../lib/supabase';
import Footer from '../components/common/Footer';

export default function CouponPage() {
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [offer, setOffer] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        const data = sessionStorage.getItem('reviewData');
        if (!data) {
            navigate('/');
            return;
        }
        const parsed = JSON.parse(data);
        setReviewData(parsed);

        // Generate Offer based on Business Type
        const businessId = parsed.businessId;
        let selectedOffer = null;

        if (parsed.offer) {
            selectedOffer = parsed.offer;
        } else {
            // Default logic for Review flow if not provided
            selectedOffer = {
                title: "10% Off Your Next Visit",
                description: "Show this coupon to get a discount on any service.",
                terms: "Valid for one-time use only. Cannot be combined with other offers.",
                validity: 30 // days
            };

            if (businessId === 'pizza-corner' || (parsed.businessName && parsed.businessName.toLowerCase().includes('pizza'))) {
                selectedOffer = {
                    title: "FREE Garlic Bread",
                    description: "Get a complimentary portion of our famous Garlic Bread with any Large Pizza.",
                    terms: "Valid for dine-in only. One coupon per table.",
                    validity: 14
                };
            } else if (businessId === 'raj-salon' || (parsed.businessName && parsed.businessName.toLowerCase().includes('salon'))) {
                selectedOffer = {
                    title: "20% Off Hair Spa",
                    description: "Treat yourself to a luxury Hair Spa treatment at a special discounted price.",
                    terms: "Prior appointment required. Valid on weekdays only.",
                    validity: 45
                };
            }
        }

        setOffer(selectedOffer);

        // Generate Coupon Code
        if (parsed.couponCode) {
            setCouponCode(parsed.couponCode);
        } else {
            const randomCode = Math.random().toString(36).substring(2, 7).toUpperCase();
            const prefix = (parsed.businessName || 'BIZ').substring(0, 3).toUpperCase();
            const code = `${prefix}-${randomCode}`;
            setCouponCode(code);

            // Save to DB immediately to ensure it's listed in Coupon verification
            generateCoupon({
                business_id: parsed.businessId || 'pizza-corner',
                business_name: parsed.businessName || 'Business',
                code: code,
                offer_title: selectedOffer.title,
                description: selectedOffer.description,
                source: 'review',
                customer_details: {},
                expiry_date: new Date(Date.now() + selectedOffer.validity * 24 * 60 * 60 * 1000).toISOString()
            }).then(result => {
                if (result.success) {
                    sessionStorage.setItem('reviewData', JSON.stringify({
                        ...parsed,
                        couponCode: code
                    }));
                }
            });
        }

        // Hide confetti after a few seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);

    }, [navigate]);

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

    const handlePostOnGoogle = async () => {
        // Prioritize the direct "Write a Review" URL format for mobile compatibility
        // Use the hardcoded Place ID as a reliable default if data is missing
        const defaultPlaceId = 'ChIJUewm6BHXCDkRdClN6_t0Be4';
        const placeId = reviewData.googlePlaceId || defaultPlaceId;
        const targetUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;

        // Copy text to clipboard (Best Effort)
        const textToCopy = sessionStorage.getItem('generatedReview') || "Great experience!";

        try {
            await copyToClipboard(textToCopy);
        } catch (err) {
            console.error('Copy failed:', err);
        }

        // Use window.location.href for maximum reliability on mobile browsers
        // preventing popup blockers from interfering with the redirection
        window.location.href = targetUrl;
    };

    const handleSaveCoupon = () => {
        alert("Coupon saved to your device! (Demo)");
    };

    if (!reviewData || !offer) return null;

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + offer.validity);

    return (
        <div className="min-h-screen relative font-sans text-slate-800 flex flex-col items-center overflow-hidden">
            {/* Confetti Effect (CSS only implementation for simplicity) */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -100, x: Math.random() * window.innerWidth, rotate: 0 }}
                            animate={{ y: window.innerHeight + 100, rotate: 360 }}
                            transition={{ duration: Math.random() * 2 + 2, ease: "linear", repeat: Infinity }}
                            className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                            style={{
                                left: Math.random() * 100 + '%',
                                backgroundColor: ['#FFD700', '#FF69B4', '#00BFFF', '#32CD32'][Math.floor(Math.random() * 4)]
                            }}
                        />
                    ))}
                </div>
            )}

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
                            className="w-full h-full object-cover blur-sm scale-105"
                        />
                    )}
                </AnimatePresence>
            </div>
            <div className="fixed inset-0 -z-10 bg-black/70 backdrop-blur-md" />

            {/* Navbar */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10 shadow-sm">
                <div className="container-custom py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="group flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </div>
                        <span className="hidden sm:inline">Home</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-lg text-white hidden sm:block">{reviewData.businessName}</span>
                        <div className="text-3xl filter drop-shadow-lg">{reviewData.businessLogo}</div>
                    </div>
                </div>
            </div>

            <main className="container-custom pt-32 pb-20 max-w-lg mx-auto flex-grow w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                    className="relative"
                >
                    {/* Header */}
                    <div className="text-center mb-8 relative z-10">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 border border-yellow-400/50 rounded-full mb-4 backdrop-blur-md"
                        >
                            <SparklesIcon className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm font-bold text-yellow-300 uppercase tracking-wider">Reward Unlocked</span>
                        </motion.div>
                        <h1 className="text-3xl md:text-4xl font-black text-white mb-2 drop-shadow-lg">
                            Here is your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-yellow-200">Exclusive Coupon</span>
                        </h1>
                        <p className="text-white/80 text-sm">Thank you for your feedback! Enjoy this gift on us.</p>
                    </div>

                    {/* Coupon Card */}
                    <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
                        {/* Top Decoration */}
                        <div className="h-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                        {/* Cutout Circles for Ticket Look */}
                        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-slate-900 rounded-full"></div>
                        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-slate-900 rounded-full"></div>
                        <div className="absolute top-1/2 left-0 right-0 border-t-2 border-dashed border-gray-200 -z-10"></div>

                        <div className="p-8 pb-10">
                            {/* 1. Activate Coupon CTA (Priority) */}
                            {/* 1. Activate Coupon CTA (Priority) - ONLY for Reviews, NOT Instagram */}
                            {!reviewData.source || reviewData.source !== 'instagram' ? (
                                <div className="mb-8 space-y-4">
                                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                        <SparklesIcon className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
                                        <div>
                                            <p className="text-sm font-bold text-amber-800">Activate This Coupon</p>
                                            <p className="text-xs text-amber-700 mt-1">You must post your review on Google to use this coupon.</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handlePostOnGoogle}
                                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 flex items-center justify-center gap-3 transition-all active:scale-95 group relative overflow-hidden"
                                    >
                                        <div className="flex items-center gap-2 relative z-10">
                                            <div className="bg-white rounded-full p-1">
                                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                            </div>
                                            <span>Post Review to Activate</span>
                                        </div>
                                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                </div>
                            ) : null}

                            {/* 2. Coupon Code Display */}
                            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-xl border-2 border-slate-200 border-dashed mb-8">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Your Code:</span>
                                <span className="text-2xl font-mono font-black text-slate-800 tracking-widest">{couponCode}</span>
                            </div>


                            {/* 3. Offer Details */}
                            <div className="text-center mb-8 border-b border-slate-100 pb-8">
                                <h2 className="text-3xl font-black text-slate-800 mb-2">{offer.title}</h2>
                                <p className="text-slate-600 font-medium">{offer.description}</p>
                            </div>

                            {/* 4. QR Code Section */}
                            <div className="mb-8 flex flex-col items-center">
                                <div className="p-4 bg-white rounded-2xl border-2 border-slate-100 shadow-inner mb-4">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`${window.location.protocol}//${window.location.host}/redeem/${couponCode}`)}&color=334155&qzone=4`}
                                        alt="Coupon QR"
                                        className="w-48 h-48 object-contain mix-blend-multiply"
                                    />
                                </div>
                                <p className="text-xs text-slate-400 font-medium">Scan to Redeem</p>
                            </div>

                            {/* Terms & Validity */}
                            <div className="bg-slate-50 rounded-xl p-4 text-xs text-slate-500 space-y-2 mb-6">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-slate-400" />
                                    <div className="flex flex-col">
                                        <span>Valid from: <strong>{new Date().toLocaleDateString()}</strong></span>
                                        <span>Valid until: <strong>{expiryDate.toLocaleDateString()}</strong></span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2">
                                    <TicketIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                    <span>{offer.terms}</span>
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSaveCoupon}
                                className="w-full py-3 bg-white border-2 border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                            >
                                <ArrowDownTrayIcon className="w-5 h-5" />
                                Save to Photos
                            </button>
                        </div>
                    </div>



                </motion.div>
            </main>
            <Footer />
        </div>
    );
}
