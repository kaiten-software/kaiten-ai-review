import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { updateClient } from '../../lib/supabase';
import {
    HeartIcon,
    ArrowDownTrayIcon,
    LinkIcon,
    CheckCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/solid';

export default function InstagramQRManager({ businessData }) {
    const [igUrl, setIgUrl] = useState(businessData.instagram_url || '');
    const [offerTitle, setOfferTitle] = useState(businessData.ig_offer_title || '');
    const [offerDesc, setOfferDesc] = useState(businessData.ig_offer_desc || '');
    const [validity, setValidity] = useState(businessData.ig_offer_validity || 30);
    const [isSaving, setIsSaving] = useState(false);
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncSuccess, setSyncSuccess] = useState(false);
    const [showSaved, setShowSaved] = useState(false);

    // Derive username from URL for preview
    const getUsername = (url) => {
        try {
            if (!url) return 'your page';
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split('/').filter(p => p);
            return '@' + (pathParts[0] || 'yourpage');
        } catch (e) {
            return '@yourpage';
        }
    };
    const displayUsername = getUsername(igUrl);

    // QR Code URL based on Business ID (stays constant usually, but content updates on navigation)
    // However, if we want specific data, we usually embed it in the URL parameters or rely on the DB fetch.
    // The current approach relies on DB fetch on the landing page, so saving IS required for the landing page to work.
    // BUT the user wants the QR to "sync".
    // The QR *link* doesn't change `.../instagram-offer/:id`, but the *landing page intent* changes.
    // We will clarify this in the UI.
    const offerUrl = `${window.location.protocol}//${window.location.host}/instagram-offer/${businessData.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(offerUrl)}&color=E1306C&qzone=2`;

    const handleSave = async () => {
        setIsSaving(true);
        const updates = {
            instagram_url: igUrl,
            ig_offer_title: offerTitle,
            ig_offer_desc: offerDesc,
            ig_offer_validity: parseInt(validity)
        };

        const result = await updateClient(businessData.id, updates);

        setIsSaving(false);
        if (result.success) {
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 3000);
        } else {
            alert('Failed to save: ' + result.error);
        }
    };

    const handleSyncUrl = async () => {
        if (!igUrl) {
            alert('Please enter an Instagram URL first');
            return;
        }

        // Normalize URL if needed
        let syncUrl = igUrl;
        if (!syncUrl.startsWith('http://') && !syncUrl.startsWith('https://')) {
            syncUrl = `https://${syncUrl}`;
            setIgUrl(syncUrl);
        }

        setIsSyncing(true);

        // Save ALL fields, not just the URL, to ensure the Offer Page has the latest data
        const updates = {
            instagram_url: syncUrl,
            ig_offer_title: offerTitle,
            ig_offer_desc: offerDesc,
            ig_offer_validity: parseInt(validity)
        };

        const result = await updateClient(businessData.id, updates);

        setIsSyncing(false);
        if (result.success) {
            setSyncSuccess(true);
            setTimeout(() => setSyncSuccess(false), 2000);
        } else {
            alert('Failed to sync: ' + result.error);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(offerUrl);
        alert('Link copied to clipboard!');
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid lg:grid-cols-2 gap-8"
        >
            {/* Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <HeartIcon className="w-6 h-6 text-pink-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Instagram Offer Settings</h2>
                        <p className="text-slate-500 text-sm">Configure your "Follow to Win" campaign</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Instagram Profile URL</label>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center">
                                <span className="bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl px-4 py-3 text-slate-500">
                                    <LinkIcon className="w-5 h-5" />
                                </span>
                                <input
                                    type="url"
                                    value={igUrl}
                                    onChange={(e) => setIgUrl(e.target.value)}
                                    className="w-full border border-slate-200 rounded-r-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                                    placeholder="https://instagram.com/yourprofile"
                                />
                            </div>
                            <button
                                onClick={handleSyncUrl}
                                disabled={isSyncing}
                                className={`px-4 py-3 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2 ${syncSuccess
                                    ? 'bg-green-500 text-white hover:bg-green-600'
                                    : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                                title="Sync URL to QR Code"
                            >
                                {isSyncing ? (
                                    <ArrowPathIcon className="w-5 h-5 animate-spin" />
                                ) : syncSuccess ? (
                                    <CheckCircleIcon className="w-5 h-5" />
                                ) : (
                                    <ArrowPathIcon className="w-5 h-5" />
                                )}
                                <span className="hidden sm:inline">
                                    {isSyncing ? 'Syncing...' : syncSuccess ? 'Synced!' : 'Sync'}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Free Gift Title</label>
                        <input
                            type="text"
                            value={offerTitle}
                            onChange={(e) => setOfferTitle(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                            placeholder="e.g. Free Chocolate Brownie"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Offer Description</label>
                        <textarea
                            value={offerDesc}
                            onChange={(e) => setOfferDesc(e.target.value)}
                            rows="3"
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all resize-none"
                            placeholder="e.g. Get a complimentary brownie with any coffee order when you follow us!"
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Coupon Validity (Days)</label>
                        <input
                            type="number"
                            min="1"
                            max="365"
                            value={validity}
                            onChange={(e) => setValidity(e.target.value)}
                            className="w-full border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none transition-all"
                            placeholder="30"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="w-full py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-pink-500/30 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isSaving ? 'Saving...' : showSaved ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5 text-white" />
                                Saved Successfully
                            </>
                        ) : 'Save Settings'}
                    </button>
                </div>
            </div>

            {/* QR Preview */}
            <div className="bg-gradient-to-br from-purple-900 to-slate-900 rounded-2xl shadow-xl p-8 text-center text-white relative overflow-hidden flex flex-col items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                <h3 className="text-xl font-bold mb-2 relative z-10">Scan to Win {offerTitle || 'a Prize'}!</h3>
                <p className="text-purple-200 text-sm mb-6 relative z-10">
                    Follow <strong>{displayUsername}</strong> to claim.
                </p>

                <div className="bg-white p-4 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300 relative z-10">
                    <img src={qrCodeUrl} alt="Instagram QR" className="w-64 h-64 mix-blend-multiply" />
                </div>

                <p className="text-purple-200 text-xs mb-8 max-w-xs mx-auto relative z-10 opacity-70">
                    * QR links to your exclusive offer page. Updates sync automatically.
                </p>

                <div className="grid grid-cols-2 gap-4 w-full max-w-xs relative z-10">
                    <button
                        onClick={() => window.open(qrCodeUrl, '_blank')}
                        className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl py-3 px-4 font-semibold transition-all"
                    >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                        Download
                    </button>
                    <button
                        onClick={copyLink}
                        className="flex items-center justify-center gap-2 bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 rounded-xl py-3 px-4 font-semibold transition-all"
                    >
                        <LinkIcon className="w-5 h-5" />
                        Copy Link
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
