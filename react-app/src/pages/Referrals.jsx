import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    UserGroupIcon,
    GiftIcon,
    ChartBarIcon,
    CurrencyRupeeIcon,
    ShareIcon,
    EnvelopeIcon,
    LinkIcon,
    CheckCircleIcon,
    SparklesIcon,
    TrophyIcon
} from '@heroicons/react/24/outline';

export default function Referrals() {
    const [referralCode] = useState('KAITEN-' + Math.random().toString(36).substr(2, 8).toUpperCase());
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    // Mock referral data - In production, this would come from backend
    const referralStats = {
        totalReferrals: 12,
        activeClients: 8,
        pendingSignups: 4,
        totalEarnings: 24000,
        pendingEarnings: 8000
    };

    const referralHistory = [
        { id: 1, name: 'Raj Salon & Spa', status: 'Active', date: '2024-01-15', earnings: 3000, plan: 'Annual' },
        { id: 2, name: 'Pizza Corner', status: 'Active', date: '2024-01-20', earnings: 2000, plan: 'Monthly' },
        { id: 3, name: 'Fitness Hub Pro', status: 'Active', date: '2024-02-01', earnings: 5000, plan: '3-Year' },
        { id: 4, name: 'Beauty Lounge', status: 'Pending', date: '2024-02-05', earnings: 0, plan: 'Monthly' },
        { id: 5, name: 'Tech Solutions', status: 'Active', date: '2024-02-10', earnings: 3000, plan: 'Annual' }
    ];

    const benefits = [
        {
            icon: <CurrencyRupeeIcon className="w-8 h-8" />,
            title: '20% Commission',
            description: 'Earn 20% of the first year subscription for every referral'
        },
        {
            icon: <GiftIcon className="w-8 h-8" />,
            title: 'Bonus Rewards',
            description: 'Get special bonuses for every 5 successful referrals'
        },
        {
            icon: <ChartBarIcon className="w-8 h-8" />,
            title: 'Lifetime Earnings',
            description: 'Continue earning from renewals and upgrades'
        },
        {
            icon: <TrophyIcon className="w-8 h-8" />,
            title: 'Leaderboard Prizes',
            description: 'Monthly prizes for top referrers'
        }
    ];

    const copyToClipboard = (text, type) => {
        navigator.clipboard.writeText(text);
        if (type === 'code') {
            setCopiedCode(true);
            setTimeout(() => setCopiedCode(false), 2000);
        } else {
            setCopiedLink(true);
            setTimeout(() => setCopiedLink(false), 2000);
        }
    };

    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient text-white"
            >
                <div className="flex items-start gap-6">
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center flex-shrink-0">
                        <UserGroupIcon className="w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold mb-3">Referral Program</h2>
                        <p className="text-lg text-white/90">
                            Earn rewards by referring businesses to Kaiten AI Review Platform
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="card text-center"
                >
                    <div className="text-3xl font-bold gradient-text mb-2">{referralStats.totalReferrals}</div>
                    <div className="text-gray-600 text-sm font-medium">Total Referrals</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="card text-center"
                >
                    <div className="text-3xl font-bold text-green-600 mb-2">{referralStats.activeClients}</div>
                    <div className="text-gray-600 text-sm font-medium">Active Clients</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="card text-center"
                >
                    <div className="text-3xl font-bold text-yellow-600 mb-2">{referralStats.pendingSignups}</div>
                    <div className="text-gray-600 text-sm font-medium">Pending</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="card text-center"
                >
                    <div className="text-3xl font-bold text-purple-600 mb-2">₹{referralStats.totalEarnings.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm font-medium">Total Earned</div>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="card text-center"
                >
                    <div className="text-3xl font-bold text-cyan-600 mb-2">₹{referralStats.pendingEarnings.toLocaleString()}</div>
                    <div className="text-gray-600 text-sm font-medium">Pending</div>
                </motion.div>
            </div>

            {/* Referral Code & Link */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <LinkIcon className="w-6 h-6 text-purple-600" />
                        <h3 className="text-xl font-bold">Your Referral Code</h3>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-cyan-50 p-4 rounded-xl mb-4">
                        <code className="text-2xl font-bold gradient-text">{referralCode}</code>
                    </div>
                    <button
                        onClick={() => copyToClipboard(referralCode, 'code')}
                        className="btn btn-primary w-full"
                    >
                        {copiedCode ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <ShareIcon className="w-5 h-5" />
                                Copy Code
                            </>
                        )}
                    </button>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <EnvelopeIcon className="w-6 h-6 text-cyan-600" />
                        <h3 className="text-xl font-bold">Referral Link</h3>
                    </div>
                    <div className="bg-gradient-to-br from-cyan-50 to-purple-50 p-4 rounded-xl mb-4 break-all">
                        <code className="text-sm text-gray-700">{referralLink}</code>
                    </div>
                    <button
                        onClick={() => copyToClipboard(referralLink, 'link')}
                        className="btn btn-accent w-full"
                    >
                        {copiedLink ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <LinkIcon className="w-5 h-5" />
                                Copy Link
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Benefits */}
            <div className="card">
                <div className="flex items-center gap-3 mb-6">
                    <SparklesIcon className="w-10 h-10 text-purple-600" />
                    <h3 className="text-2xl font-bold">Referral Benefits</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-100 hover:border-purple-200 transition-all"
                        >
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-cyan-600 rounded-xl flex items-center justify-center text-white mb-4">
                                {benefit.icon}
                            </div>
                            <h4 className="font-bold text-lg mb-2">{benefit.title}</h4>
                            <p className="text-gray-600 text-sm">{benefit.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Referral History */}
            <div className="card">
                <h3 className="text-2xl font-bold mb-6">Referral History</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plan</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Sign-up Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Earnings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {referralHistory.map((referral, index) => (
                                <motion.tr
                                    key={referral.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 font-semibold">{referral.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${referral.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {referral.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{referral.plan}</td>
                                    <td className="px-6 py-4 text-gray-600">{referral.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`font-bold ${referral.earnings > 0 ? 'text-green-600' : 'text-gray-400'
                                            }`}>
                                            ₹{referral.earnings.toLocaleString()}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* How It Works */}
            <div className="card bg-gradient-to-br from-purple-600 to-cyan-600 text-white">
                <h3 className="text-2xl font-bold mb-6">How It Works</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold mb-4">1</div>
                        <h4 className="font-bold text-lg mb-2">Share Your Link</h4>
                        <p className="text-white/80 text-sm">Share your unique referral code or link with businesses</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold mb-4">2</div>
                        <h4 className="font-bold text-lg mb-2">They Sign Up</h4>
                        <p className="text-white/80 text-sm">When they subscribe using your code, you both benefit</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl font-bold mb-4">3</div>
                        <h4 className="font-bold text-lg mb-2">Earn Rewards</h4>
                        <p className="text-white/80 text-sm">Get 20% commission and continue earning from renewals</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
