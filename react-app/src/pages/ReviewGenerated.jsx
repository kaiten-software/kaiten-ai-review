import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ClipboardDocumentIcon, ArrowLeftIcon, SparklesIcon, XMarkIcon, UserIcon, CheckBadgeIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import SocialMediaIcons from '../components/common/SocialMediaIcons';
import { supabase } from '../lib/supabase';

export default function ReviewGenerated() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [reviewData, setReviewData] = useState(null);
    const [shortReview, setShortReview] = useState('');
    const [longReview, setLongReview] = useState('');
    const [copiedShort, setCopiedShort] = useState(false);
    const [copiedLong, setCopiedLong] = useState(false);

    // VIP Membership State
    const [membershipState, setMembershipState] = useState('invite'); // 'invite', 'joining', 'member'
    const [vipForm, setVipForm] = useState({
        name: '',
        email: '',
        phone: ''
    });
    const [isSubmittingVip, setIsSubmittingVip] = useState(false);

    useEffect(() => {
        const data = sessionStorage.getItem('reviewData');
        if (!data) {
            navigate('/');
            return;
        }

        const parsed = JSON.parse(data);
        setReviewData(parsed);

        const { short, long } = generateReviews(parsed);
        setShortReview(short);
        setLongReview(long);

        // Ensure background is appropriate
        document.body.style.backgroundColor = '#0f172a'; // Slate 900 base

        return () => {
            document.body.style.backgroundColor = '';
        }
    }, [navigate]);

    const generateReviews = (data) => {
        const { businessName, rating, service, staff, qualities, feelings, additional, searchKeywords } = data;
        let short = `Amazing experience at ${businessName}! `;
        if (service) short += `The ${service} was excellent. `;
        if (qualities.length > 0) short += `${qualities[0]} service. `;
        short += `Highly recommend!`;

        let long = `I had an absolutely wonderful experience at ${businessName}! `;
        if (staff) long += `${staff} provided exceptional service and made me feel welcome from the moment I arrived. `;
        if (service) long += `I came in for ${service} and I couldn't be happier with the results. `;
        if (qualities.length > 0) {
            if (qualities.length === 1) long += `The service was ${qualities[0]}. `;
            else long += `The service was ${qualities.slice(0, -1).join(', ')} and ${qualities[qualities.length - 1]}. `;
        }
        if (feelings.length > 0) long += `I left feeling ${feelings.join(', ')}. `;
        if (additional) long += `${additional} `;
        if (searchKeywords && searchKeywords.length > 0) {
            const keywords = searchKeywords.slice(0, 2);
            long += `Truly ${keywords.join(' and ')}! `;
        }
        long += `I highly recommend ${businessName} to anyone looking for quality service. ${rating} stars well deserved!`;

        return { short, long };
    };

    const copyToClipboard = async (text, isShort) => {
        try {
            await navigator.clipboard.writeText(text);
            if (isShort) {
                setCopiedShort(true);
                setTimeout(() => { setCopiedShort(false); setStep(2); }, 800);
            } else {
                setCopiedLong(true);
                setTimeout(() => { setCopiedLong(false); setStep(2); }, 800);
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const openGoogleReviews = () => {
        if (reviewData.googleBusinessUrl) {
            window.open(reviewData.googleBusinessUrl, '_blank');
        } else {
            const searchQuery = encodeURIComponent(`${reviewData.businessName} reviews`);
            window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
        }
    };

    const handleJoinClub = async (e) => {
        e.preventDefault();
        setIsSubmittingVip(true);

        try {
            const storedReviewId = sessionStorage.getItem('reviewId');

            // Prepare update payload
            const updates = {
                customer_name: vipForm.name,
                customer_email: vipForm.email,
                customer_phone: vipForm.phone
            };

            if (storedReviewId) {
                const { error } = await supabase
                    .from('reviews')
                    .update(updates)
                    .eq('id', storedReviewId);

                if (error) console.error('Supabase Error:', error);
            } else {
                console.warn('No review ID found in session storage.');
            }

            setMembershipState('member');

        } catch (err) {
            console.error('Error joining club:', err);
        } finally {
            setIsSubmittingVip(false);
        }
    };

    if (!reviewData) return null;

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen relative font-sans text-slate-800 overflow-hidden selection:bg-indigo-500/30">
            {/* Rich Gradient Background (Deep Space) */}
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black" />

            {/* Ambient Aurora Glows */}
            <div className="fixed top-[-50%] left-[-20%] w-[100%] h-[100%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
            <div className="fixed bottom-[-50%] right-[-20%] w-[100%] h-[100%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

            <div className="fixed inset-0 -z-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />

            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900/50 backdrop-blur-md border-b border-white/5 shadow-2xl">
                <div className="container-custom py-4 flex items-center justify-between">
                    <button onClick={() => navigate(`/business/${reviewData.businessId}`)} className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-all">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </div>
                        <span>Back</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-3xl filter drop-shadow-lg">{reviewData.businessLogo}</div>
                        <div className="hidden sm:block">
                            <h1 className="text-lg font-bold leading-none tracking-wide text-white">{reviewData.businessName}</h1>
                        </div>
                    </div>
                    <div className="w-16"></div>
                </div>
            </div>

            <main className="container-custom pt-32 pb-20 max-w-6xl">
                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Step 02 Content */}
                            <motion.div variants={itemVariants} className="text-center mb-16 relative">
                                <h2 className="text-sm font-bold tracking-[0.3em] text-indigo-400 uppercase mb-4 drop-shadow-md">Step Two</h2>
                                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-indigo-300 drop-shadow-lg mb-6">
                                    Choose Your Review
                                </h1>
                                <p className="text-lg text-slate-400 max-w-lg mx-auto">Select the version that best describes your experience.</p>
                            </motion.div>

                            {/* Reviews System */}
                            <div className="grid md:grid-cols-2 gap-8 mb-12">
                                {/* Short Review */}
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="group relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-indigo-500/20 flex flex-col transition-all duration-300 border border-white/50"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-white/0 rounded-[2rem]" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center"><StarIcon className="w-6 h-6" /></div>
                                                <h3 className="font-bold text-2xl text-slate-800">Short & Sweet</h3>
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wide border border-indigo-100">Quick</span>
                                        </div>
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 flex-grow shadow-inner">
                                            <p className="text-lg leading-relaxed text-slate-600 italic font-medium">"{shortReview}"</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => copyToClipboard(shortReview, true)}
                                            className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {copiedShort ? <><CheckBadgeIcon className="w-5 h-5" /> Copied!</> : <><ClipboardDocumentIcon className="w-5 h-5" /> Copy & Continue</>}
                                            </span>
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* Long Review */}
                                <motion.div
                                    variants={itemVariants}
                                    whileHover={{ y: -5 }}
                                    className="group relative bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl shadow-purple-500/20 flex flex-col transition-all duration-300 border border-white/50"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-white/0 rounded-[2rem]" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center"><ClipboardDocumentIcon className="w-6 h-6" /></div>
                                                <h3 className="font-bold text-2xl text-slate-800">Detailed & Rich</h3>
                                            </div>
                                            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wide border border-purple-100">Helpful</span>
                                        </div>
                                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 flex-grow shadow-inner">
                                            <p className="text-lg leading-relaxed text-slate-600 italic font-medium">"{longReview}"</p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => copyToClipboard(longReview, false)}
                                            className="w-full py-4 rounded-xl bg-purple-600 text-white font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 relative overflow-hidden group"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                {copiedLong ? <><CheckBadgeIcon className="w-5 h-5" /> Copied!</> : <><ClipboardDocumentIcon className="w-5 h-5" /> Copy & Continue</>}
                                            </span>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            </div>
                            <button onClick={() => navigate(-1)} className="w-full text-center text-slate-500 hover:text-white text-sm font-semibold tracking-widest uppercase transition-colors">
                                Edit Options
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="max-w-6xl mx-auto"
                        >
                            <div className="text-center mb-16">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
                                    <CheckBadgeIcon className="w-5 h-5" />
                                    Review Copied!
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
                                    Final Step
                                </h1>
                                <p className="text-slate-400 text-lg">Choose how you'd like to post your review.</p>
                            </div>

                            <div className="grid lg:grid-cols-2 gap-8 items-stretch">

                                {/* OPTION A: Post Directly (The "Light" Choice) */}
                                <motion.div
                                    className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-500/10 relative overflow-hidden flex flex-col order-2 lg:order-1 border-4 border-transparent hover:border-indigo-100 transition-all duration-300"
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="mb-8">
                                        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-3xl text-indigo-500">🌍</div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-2">Post Publicly</h3>
                                        <p className="text-lg text-slate-500">Quickly paste your review on Google Maps. No extra steps.</p>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 flex-grow">
                                        <h4 className="font-bold text-slate-900 mb-4 uppercase text-sm tracking-wider">Instructions</h4>
                                        <ol className="space-y-4 text-slate-600">
                                            <li className="flex gap-4 items-center">
                                                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 shadow-sm">1</span>
                                                <span className="font-medium">Click "Post on Google"</span>
                                            </li>
                                            <li className="flex gap-4 items-center">
                                                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 shadow-sm">2</span>
                                                <span className="font-medium">Paste your review</span>
                                            </li>
                                            <li className="flex gap-4 items-center">
                                                <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-blue-600 font-bold flex items-center justify-center flex-shrink-0 shadow-sm">3</span>
                                                <span className="font-medium">Submit!</span>
                                            </li>
                                        </ol>
                                    </div>

                                    <div className="mt-auto pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={openGoogleReviews}
                                            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold shadow-xl shadow-blue-500/20 flex items-center justify-center gap-4 transition-all relative overflow-hidden group"
                                        >
                                            <div className="bg-white p-2 rounded-full shadow-sm flex items-center justify-center w-10 h-10">
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21-1.19-2.63z" fill="#FBBC05" />
                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                </svg>
                                            </div>
                                            <span>Post on Google</span>
                                        </motion.button>
                                    </div>
                                </motion.div>

                                {/* OPTION B: VIP Inner Circle (The "Dark/Premium" Choice) */}
                                <div className="relative order-1 lg:order-2 group">
                                    {/* Animated Gradient Border */}
                                    <div className="absolute -inset-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-[2.6rem] opacity-75 blur-sm group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>

                                    <motion.div
                                        className="relative bg-gray-900 rounded-[2.5rem] p-8 md:p-12 shadow-2xl h-full flex flex-col overflow-hidden"
                                        whileHover={{ scale: 1.005 }}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {/* Exotic Holographic Glows */}
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                        <div className="absolute -top-[50%] -right-[50%] w-[100%] h-[100%] bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-[80px] group-hover:opacity-100 transition-opacity opacity-50"></div>
                                        <div className="absolute -bottom-[50%] -left-[50%] w-[100%] h-[100%] bg-gradient-to-t from-blue-500/20 to-transparent rounded-full blur-[80px] group-hover:opacity-100 transition-opacity opacity-50"></div>

                                        <AnimatePresence mode="wait">
                                            {membershipState === 'invite' && (
                                                <motion.div
                                                    key="invite"
                                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                                    className="flex flex-col items-center justify-center h-full text-center relative z-10 py-6"
                                                >
                                                    <div className="w-24 h-24 rounded-full border border-indigo-500/30 bg-indigo-500/10 flex items-center justify-center mb-8 relative shadow-[0_0_30px_rgba(99,102,241,0.2)] backdrop-blur-md">
                                                        <SparklesIcon className="w-10 h-10 text-indigo-400 animate-pulse" />
                                                    </div>

                                                    <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.4em] mb-4">Exclusive Invitation</h3>
                                                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight drop-shadow-xl">
                                                        Join the <br />
                                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">Inner Circle</span>
                                                    </h2>
                                                    <p className="text-slate-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed border-t border-white/5 pt-6">
                                                        Unlock priority status, secret rewards, and VIP updates.
                                                    </p>

                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => setMembershipState('joining')}
                                                        className="w-full py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-500/30 text-lg flex items-center justify-center gap-3 relative overflow-hidden group"
                                                    >
                                                        <span className="relative z-10">Claim Membership</span>
                                                        <ArrowLeftIcon className="w-5 h-5 rotate-180 relative z-10" />
                                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                                    </motion.button>

                                                    <div className="mt-8 flex items-center justify-center gap-2">
                                                        <span className="relative flex h-3 w-3">
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                                                        </span>
                                                        <p className="text-xs text-indigo-300 font-medium tracking-wide">High Demand</p>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {membershipState === 'joining' && (
                                                <motion.div
                                                    key="joining"
                                                    initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                                                    className="relative z-10 w-full h-full flex flex-col pt-4"
                                                >
                                                    <button
                                                        onClick={() => setMembershipState('invite')}
                                                        className="absolute -top-4 right-0 p-2 text-slate-500 hover:text-white transition-colors"
                                                    >
                                                        <XMarkIcon className="w-6 h-6" />
                                                    </button>

                                                    <div className="mb-8 border-b border-white/10 pb-6">
                                                        <h3 className="text-2xl font-bold mb-2 text-white flex items-center gap-3">
                                                            <ShieldCheckIcon className="w-6 h-6 text-indigo-400" />
                                                            Verify Identity
                                                        </h3>
                                                        <p className="text-slate-400 text-sm">Secure your spot in the Inner Circle.</p>
                                                    </div>

                                                    <form onSubmit={handleJoinClub} className="space-y-6 flex-grow">
                                                        {[
                                                            { label: 'Full Name', type: 'text', val: 'name', ph: 'Your legal name' },
                                                            { label: 'Email Address', type: 'email', val: 'email', ph: 'best@email.com' },
                                                            { label: 'Phone Number', type: 'tel', val: 'phone', ph: 'Mobile number' }
                                                        ].map((field, idx) => (
                                                            <div className="group relative" key={idx}>
                                                                <label className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider mb-2 block ml-1">
                                                                    {field.label}
                                                                </label>
                                                                <input
                                                                    type={field.type}
                                                                    required
                                                                    value={vipForm[field.val]}
                                                                    onChange={e => setVipForm({ ...vipForm, [field.val]: e.target.value })}
                                                                    className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-indigo-500/10 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none transition-all text-base font-medium"
                                                                    placeholder={field.ph}
                                                                />
                                                            </div>
                                                        ))}

                                                        <div className="mt-8">
                                                            <motion.button
                                                                whileHover={{ scale: 1.02 }}
                                                                whileTap={{ scale: 0.98 }}
                                                                type="submit"
                                                                disabled={isSubmittingVip}
                                                                className="w-full py-5 rounded-xl bg-white text-indigo-950 text-xl font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-3 relative overflow-hidden group hover:bg-indigo-50 transition-colors"
                                                            >
                                                                {isSubmittingVip ? (
                                                                    <span>Verifying...</span>
                                                                ) : (
                                                                    <span>Activate Status</span>
                                                                )}
                                                            </motion.button>
                                                        </div>
                                                    </form>
                                                </motion.div>
                                            )}

                                            {membershipState === 'member' && (
                                                <motion.div
                                                    key="member"
                                                    initial={{ opacity: 0, rotateY: 90 }} animate={{ opacity: 1, rotateY: 0 }}
                                                    className="flex flex-col items-center justify-center h-full text-center relative z-10"
                                                >
                                                    {/* The Digital Card */}
                                                    <div className="w-full bg-gradient-to-br from-indigo-900 via-slate-900 to-black border border-indigo-400/30 rounded-2xl p-6 shadow-2xl mb-8 relative overflow-hidden transform hover:scale-105 transition-transform duration-500 group">
                                                        {/* Holographic Watermark */}
                                                        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                                                            <SparklesIcon className="w-48 h-48 text-white" />
                                                        </div>

                                                        <div className="flex justify-between items-start mb-12">
                                                            <div className="flex flex-col items-start gap-1">
                                                                <div className="text-white font-bold tracking-[0.2em] text-[10px] uppercase bg-white/10 px-2 py-1 rounded backdrop-blur-md">Inner Circle</div>
                                                            </div>
                                                            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/40">
                                                                <CheckBadgeIcon className="w-5 h-5 text-white" />
                                                            </div>
                                                        </div>
                                                        <div className="text-left relative z-10">
                                                            <p className="text-indigo-300 text-[9px] uppercase mb-1 tracking-widest font-bold">Authorized Member</p>
                                                            <p className="text-white font-mono text-xl tracking-wider uppercase font-bold text-shadow">{vipForm.name || 'MEMBER'}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10 mb-8 flex-grow w-full">
                                                        <h3 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h3>
                                                        <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                                            Your membership is active. Verification pending review submission.
                                                        </p>
                                                    </div>

                                                    <div className="mt-auto w-full pt-4">
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={openGoogleReviews}
                                                            className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all relative overflow-hidden group"
                                                        >
                                                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
                                                            <div className="bg-white p-1.5 rounded-full shadow-sm flex items-center justify-center w-8 h-8">
                                                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.21-1.19-2.63z" fill="#FBBC05" />
                                                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                                </svg>
                                                            </div>
                                                            <span>Post Review</span>
                                                        </motion.button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            </div>

                            <button onClick={() => setStep(1)} className="w-full mt-12 text-center text-slate-500 hover:text-white text-sm font-semibold tracking-widest uppercase transition-colors">
                                ← Back to Reviews
                            </button>

                            {/* Connect Section - Innovative Bottom Bar */}
                            {reviewData.socialMediaLinks && reviewData.socialMediaLinks.length > 0 && (
                                <motion.div
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                    className="mt-12 text-center"
                                >
                                    <div className="inline-block relative group">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                                        <div className="relative bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-8 py-4 flex items-center gap-6 shadow-2xl hover:scale-105 transition-transform duration-300">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-r border-slate-700 pr-6 mr-2">Connect</span>
                                            <SocialMediaIcons socialLinks={reviewData.socialMediaLinks} size="lg" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
