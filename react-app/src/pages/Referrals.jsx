import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllClients } from '../lib/supabase';
import {
    UserGroupIcon,
    GiftIcon,
    ChartBarIcon,
    CurrencyRupeeIcon,
    CheckCircleIcon,
    SparklesIcon,
    TrophyIcon,
    LinkIcon,
    XMarkIcon,
    FireIcon
} from '@heroicons/react/24/outline';

export default function Referrals() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReferral, setSelectedReferral] = useState(null);

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            setLoading(true);
            const { success, data } = await getAllClients();
            if (success && data) {
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to load clients for referrals:", error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate Referral Logic
    // 1. Every business has a referral_code (ideally). If missing, skip or label "None".
    // 2. We find how many businesses have `referred_by === business.referral_code`.
    // 3. That is the `referredClients` list.

    // Group all referrers and who they referred
    const referrers = clients.filter(c => c.referral_code).map(referrer => {
        const referredList = clients.filter(c => c.referred_by === referrer.referral_code);
        return {
            ...referrer,
            referredList,
            earnings: referredList.length * 10 // e.g. 10 points per legit referral as defined
        };
    }).sort((a, b) => b.referredList.length - a.referredList.length);

    // Filter out referrers who haven't referred anyone for a cleaner dashboard? 
    // Or show everyone. User said: "Each and every referral code of every business should be listed there"
    // So we list all referrers.

    const totalReferrals = referrers.reduce((acc, curr) => acc + curr.referredList.length, 0);

    return (
        <div className="space-y-8 relative">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden"
            >
                {/* Abstract shape */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mx-20 -my-20 pointer-events-none"></div>
                <div className="flex items-start gap-6 relative z-10">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
                        <TrophyIcon className="w-12 h-12 text-yellow-300" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black mb-2 tracking-tight">Referral Management</h2>
                        <p className="text-lg text-white/90 font-medium">
                            Monitor affiliate growth, credit points, and network expansion.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all"
                >
                    <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <UserGroupIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">{referrers.length}</div>
                        <div className="text-slate-500 font-medium text-sm">Active Referral Codes</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all"
                >
                    <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <SparklesIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">{totalReferrals}</div>
                        <div className="text-slate-500 font-medium text-sm">Total Businesses Added</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all"
                >
                    <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                        <CurrencyRupeeIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <div className="text-3xl font-bold text-slate-900">{totalReferrals * 10}</div>
                        <div className="text-slate-500 font-medium text-sm">Total Points Distributed</div>
                    </div>
                </motion.div>
            </div>

            {/* Referral History / Master List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">All Referral Codes & Networks</h3>
                </div>

                {loading ? (
                    <div className="p-12 pl-6 flex justify-center text-slate-400">Loading referral networks...</div>
                ) : referrers.length === 0 ? (
                    <div className="p-12 pl-6 flex justify-center text-slate-400">No referral codes found in the system yet.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Business / Referrer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Referral Code</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Points Earned</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Network Size</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {referrers.map((referrer, idx) => (
                                    <motion.tr
                                        key={referrer.business_id || idx}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-blue-50/30 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shrink-0">
                                                    {referrer.logo || '🏢'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{referrer.business_name || 'Unnamed Business'}</div>
                                                    <div className="text-xs text-slate-500">ID: {referrer.business_id}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 font-mono font-bold rounded-lg border border-indigo-100">
                                                {referrer.referral_code}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                                <FireIcon className="w-4 h-4 text-orange-500" />
                                                {referrer.credit_points || referrer.earnings || 0} pts
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {referrer.referredList.length > 0 ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 font-bold rounded-full">
                                                    {referrer.referredList.length} Referrals
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 text-sm font-medium">None yet</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => setSelectedReferral(referrer)}
                                                disabled={referrer.referredList.length === 0}
                                                className={`px-4 py-2 font-bold rounded-xl transition-all shadow-sm ${referrer.referredList.length > 0 ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                            >
                                                View Network
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Innovative Network Popup Modal */}
            <AnimatePresence>
                {selectedReferral && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedReferral(null)}
                    >
                        <motion.div
                            className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="relative bg-gradient-to-r from-slate-900 to-indigo-900 p-8 text-white overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
                                <button
                                    className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-1"
                                    onClick={() => setSelectedReferral(null)}
                                >
                                    <XMarkIcon className="w-8 h-8" />
                                </button>

                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner backdrop-blur-md">
                                        {selectedReferral.logo || '🏢'}
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">Referral Network For</h3>
                                        <h2 className="text-2xl font-black">{selectedReferral.business_name}</h2>
                                    </div>
                                </div>
                                <div className="mt-6 flex items-center gap-4">
                                    <div className="px-4 py-2 bg-black/30 rounded-full text-sm font-medium border border-white/10 flex items-center gap-2">
                                        Code: <span className="text-yellow-400 font-mono font-bold tracking-wider">{selectedReferral.referral_code}</span>
                                    </div>
                                    <div className="px-4 py-2 bg-black/30 rounded-full text-sm font-medium flex gap-2 border border-white/10">
                                        Total Onboarded: <span className="font-bold text-emerald-400">{selectedReferral.referredList.length}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Network Flow / List */}
                            <div className="p-8 max-h-[60vh] overflow-y-auto bg-slate-50/50">
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                    {selectedReferral.referredList.map((referredClient, index) => (
                                        <motion.div
                                            key={referredClient.business_id || index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                                        >
                                            {/* Icon connecting the line */}
                                            <div className="flex items-center justify-center w-4 h-4 rounded-full border-4 border-white bg-indigo-500 absolute left-6 md:left-1/2 -ml-2 md:-translate-x-1/2 shadow-sm"></div>

                                            {/* Card box */}
                                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-1.5rem)] ml-14 md:ml-0 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group-hover:-translate-y-1 duration-300 ease-in-out">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="text-2xl bg-slate-50 p-2 rounded-lg">{referredClient.logo || '🏢'}</div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-sm">{referredClient.business_name}</h4>
                                                        <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">New Client</span>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500">
                                                    Joined: {new Date(referredClient.created_at || Date.now()).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
