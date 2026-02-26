import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getClientById, generateCoupon } from '../lib/supabase';
import { getBusinessById } from '../data/businesses';
import {
    HeartIcon,
    ArrowRightIcon,
    GiftIcon,
    CheckBadgeIcon
} from '@heroicons/react/24/solid';

export default function InstagramOfferPage() {
    const { businessId } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState('offer'); // offer, following, claimed
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const loadBusiness = async () => {
            // Try fetching from Supabase first
            const result = await getClientById(businessId);
            if (result.success && result.data) {
                setBusiness(result.data);
            } else {
                // Fallback to static data
                const staticData = getBusinessById(businessId);
                if (staticData) setBusiness(staticData);
            }
            setLoading(false);
        };
        loadBusiness();
    }, [businessId]);

    const handleFollowClick = () => {
        // Open Instagram
        // Open Instagram URL
        const igUrl = business?.instagram_url || `https://instagram.com/${business?.instagram_handle || ''}`;
        window.open(igUrl, '_blank');

        setIsFollowing(true);
        // Simulate "verification" delay
        setTimeout(() => {
            setStep('verify');
        }, 2000);
    };

    const handleClaimClick = async () => {
        // Generate Coupon
        const couponData = {
            business_id: businessId,
            business_name: business?.name || 'Business',
            code: `${business?.name.substring(0, 3).toUpperCase()}-IG-${Math.floor(Math.random() * 10000)}`,
            offer_title: business?.ig_offer_title || 'Free Special Treat',
            description: business?.ig_offer_desc || 'Get a free treat when you follow us on Instagram!',
            source: 'instagram',
            expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
        };

        const result = await generateCoupon(couponData);

        // Even if Supabase fails (e.g. no table), we show the coupon for UX
        const finalCoupon = result.success ? result.data : couponData;

        // Save to session for CouponPage
        const sessionData = {
            businessId: businessId,
            businessName: business?.name,
            businessLogo: business?.logo,
            hero: business?.hero,
            couponCode: finalCoupon.code,
            offer: {
                title: finalCoupon.offer_title,
                description: finalCoupon.description,
                terms: "Valid for one-time use. Must follow on Instagram.",
                validity: business?.ig_offer_validity || 30
            },
            source: 'instagram'
        };
        sessionStorage.setItem('reviewData', JSON.stringify(sessionData));
        navigate('/coupon');
    };

    if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>;
    if (!business) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Business not found</div>;

    return (
        <div className="min-h-screen bg-slate-900 relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20"></div>
            </div>

            <main className="w-full max-w-md relative z-10">
                <AnimatePresence mode="wait">
                    {step === 'offer' && (
                        <motion.div
                            key="offer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl"
                        >
                            <div className="w-24 h-24 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                                {/* Instagram Icon fallback since we don't have react-icons for sure */}
                                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </div>

                            <h1 className="text-3xl font-bold text-white mb-2">{business.name}</h1>
                            <p className="text-purple-200 mb-8">Follow us on Instagram to unlock a special gift!</p>

                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-yellow-400/20 to-transparent rounded-bl-full"></div>
                                <h3 className="text-yellow-400 font-bold uppercase tracking-wider text-sm mb-2">Exclusive Offer</h3>
                                <p className="text-2xl font-bold text-white mb-1">{business.ig_offer_title || 'Free Dessert'}</p>
                                <p className="text-white/60 text-sm">{business.ig_offer_desc || 'With your next order'}</p>
                            </div>

                            <button
                                onClick={handleFollowClick}
                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-purple-500/50 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <span>Follow Now</span>
                                <ArrowRightIcon className="w-5 h-5" />
                            </button>
                            <p className="text-white/40 text-xs mt-4">Tap to open Instagram</p>
                        </motion.div>
                    )}

                    {step === 'verify' && (
                        <motion.div
                            key="verify"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg shadow-green-500/30">
                                <CheckBadgeIcon className="w-12 h-12 text-white" />
                            </div>

                            <h2 className="text-2xl font-bold text-white mb-2">Welcome to the fam!</h2>
                            <p className="text-purple-200 mb-8">Thanks for following. Your gift is ready to be claimed.</p>

                            <button
                                onClick={handleClaimClick}
                                className="w-full py-4 bg-white text-purple-900 rounded-xl font-bold text-lg shadow-lg hover:shadow-white/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                            >
                                <GiftIcon className="w-6 h-6 text-purple-600" />
                                <span>Claim My Gift</span>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            <div className="mt-8 text-white/30 text-sm font-medium">
                Powered by RankBag
            </div>
        </div>
    );
}
