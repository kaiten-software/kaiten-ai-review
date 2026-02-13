import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckBadgeIcon, XCircleIcon, GiftIcon } from '@heroicons/react/24/solid';
import Footer from '../components/common/Footer';

export default function RedeemPage() {
    const { code } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // verifying, valid, invalid
    const [offerDetails, setOfferDetails] = useState(null);

    useEffect(() => {
        // Mock verification logic
        const verifyCode = () => {
            setTimeout(() => {
                if (!code) {
                    setStatus('invalid');
                    return;
                }

                // Simple logic to decode the offer based on the code prefix
                // In a real app, this would check Supabase
                const prefix = code.split('-')[0];

                let offer = null;
                if (prefix === 'PIZ' || prefix === 'IZZ') {
                    offer = {
                        business: "Pizza Corner",
                        title: "FREE Garlic Bread",
                        description: "Complimentary portion with any Large Pizza.",
                        expiry: "Valid for 14 days"
                    };
                } else if (prefix === 'RAJ' || prefix === 'ALO') {
                    offer = {
                        business: "Raj's Salon",
                        title: "20% Off Hair Spa",
                        description: "Exclusive luxury treatment discount.",
                        expiry: "Valid for 45 days"
                    };
                } else {
                    offer = {
                        business: "Partner Business",
                        title: "10% Off Next Visit",
                        description: "Thank you for your feedback.",
                        expiry: "Valid for 30 days"
                    };
                }

                setOfferDetails(offer);
                setStatus('valid');
            }, 1500);
        };

        verifyCode();
    }, [code]);

    return (
        <div className="min-h-screen bg-slate-900 font-sans text-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-indigo-500/10 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <main className="w-full max-w-md p-4 relative z-10">
                {status === 'verifying' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 text-center shadow-2xl"
                    >
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mx-auto mb-6"></div>
                        <h2 className="text-xl font-bold text-slate-800">Verifying Coupon...</h2>
                        <p className="text-slate-500 text-sm mt-2">Checking validity for code: <span className="font-mono font-bold text-indigo-600">{code}</span></p>
                    </motion.div>
                )}

                {status === 'valid' && offerDetails && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="bg-white rounded-[2rem] overflow-hidden shadow-2xl border-4 border-green-400"
                    >
                        <div className="bg-green-400 p-6 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg"
                            >
                                <CheckBadgeIcon className="w-12 h-12 text-green-500" />
                            </motion.div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-wider">Coupon Valid</h1>
                        </div>

                        <div className="p-8 text-center">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">{offerDetails.business}</h3>
                            <h2 className="text-3xl font-black text-slate-800 mb-4">{offerDetails.title}</h2>
                            <p className="text-slate-600 font-medium leading-relaxed mb-6">{offerDetails.description}</p>

                            <div className="bg-slate-50 rounded-xl p-4 border border-dashed border-slate-300">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Coupon Code</p>
                                <p className="text-2xl font-mono font-bold text-slate-800 tracking-widest">{code}</p>
                            </div>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                                <GiftIcon className="w-4 h-4" />
                                <span>{offerDetails.expiry}</span>
                            </div>
                        </div>

                        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
                            <button
                                onClick={() => navigate('/')}
                                className="text-indigo-600 font-bold text-sm hover:underline"
                            >
                                Close & Return Home
                            </button>
                        </div>
                    </motion.div>
                )}

                {status === 'invalid' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl p-8 text-center shadow-2xl border-4 border-red-100"
                    >
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircleIcon className="w-12 h-12 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Invalid Cookie</h2>
                        <p className="text-slate-500 mb-6">This coupon code could not be verified or has expired.</p>
                        <button
                            onClick={() => navigate('/')}
                            className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors"
                        >
                            Return Home
                        </button>
                    </motion.div>
                )}
            </main>

            <div className="fixed bottom-0 w-full">
                <Footer />
            </div>
        </div>
    );
}
