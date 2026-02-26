import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MagnifyingGlassIcon,
    CheckBadgeIcon,
    XMarkIcon,
    BarsArrowDownIcon,
    FunnelIcon,
    TicketIcon
} from '@heroicons/react/24/solid';
import { getCouponsByBusiness, verifyCoupon, claimCoupon } from '../../lib/supabase';

export default function CouponManager({ businessData }) {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [verifyCode, setVerifyCode] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null); // null, 'success', 'error'
    const [verificationMessage, setVerificationMessage] = useState('');
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [selectedCoupon, setSelectedCoupon] = useState(null);

    // Fetch Coupons
    const loadCoupons = async () => {
        setLoading(true);
        const { data, error } = await getCouponsByBusiness(businessData.id);
        if (data) {
            setCoupons(data);
        } else {
            console.error(error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (businessData?.id) {
            loadCoupons();
        }
    }, [businessData]);

    const handleCodeChange = (e) => {
        let val = e.target.value.toUpperCase(); // Allow only alphanumeric and hyphens

        // Auto-hyphenation Disabled per user feedback
        // if (val.length > verifyCode.length) { ... }

        setVerifyCode(val);

        if (val.length > 0) {
            // Filter logic: Find UNCLAIMED coupons containing the typed characters (Active only)
            const matches = coupons
                .filter(c => c.code.includes(val) && c.status !== 'claimed')
                .sort((a, b) => a.code.localeCompare(b.code))
                .slice(0, 50);

            setSuggestions(matches);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (code) => {
        setVerifyCode(code);
        setShowSuggestions(false);
        // Optional: Auto-verify on select?
        // handleVerify(code); 
        // Better to let them click Verify to confirm interaction
    };

    const handleVerify = async () => {
        setVerificationResult(null);
        setVerificationMessage('Verifying...');
        setShowSuggestions(false);

        const result = await verifyCoupon(verifyCode, businessData.id);

        if (result.success) {
            setVerificationResult('success');
            setVerificationMessage('Coupon is Valid!');
            setSelectedCoupon(result.data);
            setShowVerifyModal(true);
        } else {
            setVerificationResult('error');
            setVerificationMessage(result.error);
        }
    };

    const handleClaim = async () => {
        if (!selectedCoupon) return;

        const result = await claimCoupon(selectedCoupon.id);
        if (result.success) {
            setVerificationMessage('Coupon Claimed Successfully!');
            setTimeout(() => {
                setShowVerifyModal(false);
                setVerifyCode('');
                setVerificationResult(null);
                loadCoupons(); // Refresh list
            }, 1500);
        } else {
            setVerificationMessage('Error claiming: ' + result.error);
        }
    };

    // Filter coupons
    const filteredCoupons = coupons.filter(c =>
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.offer_title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header & Verification Section */}
            <div className="relative rounded-3xl shadow-xl text-white">
                {/* Background Layer (Handles Gradient & Shape Clipping) */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                </div>

                {/* Content Layer (Allows Dropdown Overflow) */}
                <div className="relative z-10 p-8 grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
                            <TicketIcon className="w-8 h-8 text-yellow-400" />
                            Coupon Verification
                        </h2>
                        <p className="text-blue-100 mb-6">Enter a customer's code to check validity and mark as claimed.</p>

                        <div className="relative">
                            <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 relative z-20">
                                <input
                                    type="text"
                                    value={verifyCode}
                                    onChange={handleCodeChange}
                                    onFocus={() => {
                                        if (verifyCode) setShowSuggestions(true);
                                    }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                                    placeholder="ENTER CODE (e.g. PIZ-IG-1234)"
                                    className="bg-transparent border-none text-white placeholder-blue-300 px-4 py-2 w-full outline-none font-mono tracking-wider font-bold text-lg"
                                />
                                <button
                                    onClick={handleVerify}
                                    className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold px-6 py-2 rounded-xl transition-colors shadow-lg"
                                >
                                    Verify
                                </button>
                            </div>

                            {/* Autocomplete Suggestions */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-30 max-h-60 overflow-y-auto">
                                    {suggestions.map((s) => (
                                        <div
                                            key={s.id}
                                            onMouseDown={(e) => {
                                                e.preventDefault(); // Prevent input blur
                                                selectSuggestion(s.code);
                                            }}
                                            className={`px-4 py-3 cursor-pointer flex justify-between items-center border-b border-slate-50 last:border-0 hover:bg-slate-50 ${s.status === 'claimed' ? 'opacity-60 bg-slate-50' : ''}`}
                                        >
                                            <div>
                                                <span className="font-mono font-bold text-slate-800 block">{s.code}</span>
                                                <span className="text-xs text-slate-500">{s.offer_title}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${s.status === 'active' ? 'bg-green-100 text-green-700' :
                                                s.status === 'claimed' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {verificationResult === 'error' && (
                            <p className="mt-3 text-red-300 font-bold bg-red-900/20 px-4 py-2 rounded-lg inline-block border border-red-500/30">
                                <XMarkIcon className="w-4 h-4 inline mr-1" />
                                {verificationMessage}
                            </p>
                        )}
                    </div>

                    <div className="hidden md:flex justify-end">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 w-64 text-center">
                            <div className="text-4xl font-bold mb-1">{coupons.filter(c => c.status === 'claimed').length}</div>
                            <div className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Total Claimed</div>
                            <div className="h-px bg-white/10 my-4"></div>
                            <div className="text-4xl font-bold mb-1 text-green-300">{coupons.filter(c => c.status === 'active').length}</div>
                            <div className="text-blue-200 text-sm uppercase tracking-wider font-semibold">Active Coupons</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coupons List */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h3 className="font-bold text-slate-800 text-lg">All Coupons</h3>

                    <div className="relative w-full sm:w-auto">
                        <MagnifyingGlassIcon className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search coupons..."
                            className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl w-full sm:w-64 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider text-left">
                            <tr>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Code</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Offer</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4">Claimed</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredCoupons.length > 0 ? (
                                filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${coupon.status === 'active' ? 'bg-green-100 text-green-700 border-green-200' :
                                                coupon.status === 'claimed' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                    'bg-slate-100 text-slate-500 border-slate-200'
                                                }`}>
                                                {coupon.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-mono font-bold text-slate-700">{coupon.code}</td>
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            {coupon.customer_details?.name || 'Anonymous'}
                                            {coupon.customer_details?.phone && (
                                                <div className="text-xs text-slate-500 font-normal">{coupon.customer_details.phone}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium">{coupon.offer_title}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm capitalize">{coupon.source}</td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {new Date(coupon.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-sm">
                                            {coupon.claimed_at ? new Date(coupon.claimed_at).toLocaleDateString() : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        {loading ? 'Loading coupons...' : 'No coupons found matching your search.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Modal */}
            <AnimatePresence>
                {showVerifyModal && selectedCoupon && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
                        >
                            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <CheckBadgeIcon className="w-12 h-12 text-green-600" />
                            </div>

                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Valid Coupon!</h3>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6">
                                <p className="text-xs text-slate-400 font-bold uppercase mb-1">Offer</p>
                                <p className="text-lg font-bold text-slate-800">{selectedCoupon.offer_title}</p>
                                <p className="text-sm text-slate-500 mt-1">{selectedCoupon.description}</p>
                            </div>

                            <button
                                onClick={handleClaim}
                                className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-600/30 transition-all mb-3"
                            >
                                Mark as Claimed
                            </button>
                            <button
                                onClick={() => setShowVerifyModal(false)}
                                className="text-slate-400 hover:text-slate-600 font-medium text-sm"
                            >
                                Cancel
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
