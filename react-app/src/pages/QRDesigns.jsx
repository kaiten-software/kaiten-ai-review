// Paytm-Style Corporate QR Stand Designs
// These are production-ready physical QR stand mockups with proper branding

import { StarIcon, ChatBubbleLeftRightIcon, CheckCircleIcon, QrCodeIcon } from '@heroicons/react/24/solid';

export const renderQRDesign = (activeDesign, qrCodeUrl, businessData) => {
    // Design 0: Corporate Blue (Paytm Style)
    if (activeDesign === 0) {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl p-8">
                {/* Shadow beneath stand */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[240px] h-6 bg-black/20 blur-xl rounded-full"></div>

                {/* Physical QR Stand - Portrait 5x7" */}
                <div className="relative w-[240px] h-[336px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-white">
                    {/* Top Section - Branding (Blue Background) */}
                    <div className="relative h-[80px] bg-gradient-to-br from-blue-600 to-blue-700 flex flex-col items-center justify-center px-4 py-3">
                        <h2 className="text-white font-black text-lg tracking-tight">RANKBAG</h2>
                        <p className="text-blue-100 text-[10px] font-bold tracking-wider mt-0.5">AI REVIEW</p>
                    </div>

                    {/* Middle Section - White Background with QR */}
                    <div className="relative bg-white px-6 py-6 flex flex-col items-center">
                        {/* "Review Us Here" Text */}
                        <h3 className="text-slate-800 font-bold text-base mb-4 tracking-tight">Review Us Here</h3>

                        {/* QR Code */}
                        <div className="relative bg-white p-2 rounded-lg border-2 border-slate-200 shadow-sm">
                            <img src={qrCodeUrl} alt="QR" className="w-32 h-32 object-contain" />
                            {/* Business Logo Overlay */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-blue-500">
                                <span className="text-2xl">{businessData.logo}</span>
                            </div>
                        </div>

                        {/* Business Name */}
                        <p className="text-slate-700 font-semibold text-xs mt-4 text-center">{businessData.name}</p>
                    </div>

                    {/* Bottom Section - Navy Footer */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center px-4">
                        <div className="flex items-center gap-2 text-white">
                            <div className="flex items-center gap-1 text-[9px] font-bold">
                                <StarIcon className="w-3 h-3 text-yellow-400" />
                                <span>Rate</span>
                            </div>
                            <div className="w-px h-3 bg-white/30"></div>
                            <div className="flex items-center gap-1 text-[9px] font-bold">
                                <ChatBubbleLeftRightIcon className="w-3 h-3 text-blue-400" />
                                <span>Review</span>
                            </div>
                            <div className="w-px h-3 bg-white/30"></div>
                            <div className="flex items-center gap-1 text-[9px] font-bold">
                                <CheckCircleIcon className="w-3 h-3 text-green-400" />
                                <span>Share</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Design 1: Modern Green
    if (activeDesign === 1) {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl p-8">
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[240px] h-6 bg-black/20 blur-xl rounded-full"></div>

                <div className="relative w-[240px] h-[336px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-white">
                    {/* Top - Green Branding */}
                    <div className="relative h-[80px] bg-gradient-to-br from-emerald-600 to-green-700 flex flex-col items-center justify-center px-4 py-3">
                        <h2 className="text-white font-black text-lg tracking-tight">RANKBAG</h2>
                        <p className="text-green-100 text-[10px] font-bold tracking-wider mt-0.5">AI REVIEW</p>
                    </div>

                    {/* Middle - White with QR */}
                    <div className="relative bg-white px-6 py-6 flex flex-col items-center">
                        <h3 className="text-slate-800 font-bold text-base mb-4 tracking-tight">Share Feedback</h3>

                        <div className="relative bg-white p-2 rounded-lg border-2 border-green-200 shadow-sm">
                            <img src={qrCodeUrl} alt="QR" className="w-32 h-32 object-contain" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-green-500">
                                <span className="text-2xl">{businessData.logo}</span>
                            </div>
                        </div>

                        <p className="text-slate-700 font-semibold text-xs mt-4 text-center">{businessData.name}</p>
                    </div>

                    {/* Bottom - Dark Green Footer */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-br from-green-900 to-emerald-950 flex items-center justify-center px-4">
                        <div className="text-center">
                            <p className="text-green-100 text-[10px] font-bold">Scan • Rate • Review</p>
                            <p className="text-green-300 text-[8px] font-medium mt-0.5">Powered by Rankbag</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Design 2: Premium Purple
    if (activeDesign === 2) {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-violet-100 rounded-3xl p-8">
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[240px] h-6 bg-black/20 blur-xl rounded-full"></div>

                <div className="relative w-[240px] h-[336px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-white">
                    {/* Top - Purple Branding */}
                    <div className="relative h-[80px] bg-gradient-to-br from-purple-600 to-violet-700 flex flex-col items-center justify-center px-4 py-3">
                        <h2 className="text-white font-black text-lg tracking-tight">RANKBAG</h2>
                        <p className="text-purple-100 text-[10px] font-bold tracking-wider mt-0.5">AI REVIEW</p>
                    </div>

                    {/* Middle */}
                    <div className="relative bg-white px-6 py-6 flex flex-col items-center">
                        <h3 className="text-slate-800 font-bold text-base mb-4 tracking-tight">Leave a Review</h3>

                        <div className="relative bg-white p-2 rounded-lg border-2 border-purple-200 shadow-sm">
                            <img src={qrCodeUrl} alt="QR" className="w-32 h-32 object-contain" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-purple-500">
                                <span className="text-2xl">{businessData.logo}</span>
                            </div>
                        </div>

                        <p className="text-slate-700 font-semibold text-xs mt-4 text-center">{businessData.name}</p>
                    </div>

                    {/* Bottom - Dark Purple Footer */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-br from-purple-900 to-violet-950 flex items-center justify-center px-4">
                        <div className="flex items-center gap-2 text-white">
                            <QrCodeIcon className="w-4 h-4 text-purple-300" />
                            <span className="text-[10px] font-bold">Quick Scan Review</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Design 3: Orange Energy
    if (activeDesign === 3) {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 rounded-3xl p-8">
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[240px] h-6 bg-black/20 blur-xl rounded-full"></div>

                <div className="relative w-[240px] h-[336px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-white">
                    {/* Top - Orange Branding */}
                    <div className="relative h-[80px] bg-gradient-to-br from-orange-600 to-amber-700 flex flex-col items-center justify-center px-4 py-3">
                        <h2 className="text-white font-black text-lg tracking-tight">RANKBAG</h2>
                        <p className="text-orange-100 text-[10px] font-bold tracking-wider mt-0.5">AI REVIEW</p>
                    </div>

                    {/* Middle */}
                    <div className="relative bg-white px-6 py-6 flex flex-col items-center">
                        <h3 className="text-slate-800 font-bold text-base mb-4 tracking-tight">Rate Your Visit</h3>

                        <div className="relative bg-white p-2 rounded-lg border-2 border-orange-200 shadow-sm">
                            <img src={qrCodeUrl} alt="QR" className="w-32 h-32 object-contain" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-orange-500">
                                <span className="text-2xl">{businessData.logo}</span>
                            </div>
                        </div>

                        <p className="text-slate-700 font-semibold text-xs mt-4 text-center">{businessData.name}</p>
                    </div>

                    {/* Bottom - Dark Orange Footer */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-br from-orange-900 to-amber-950 flex items-center justify-center px-4">
                        <div className="text-center">
                            <p className="text-orange-100 text-[10px] font-bold">⭐ Share Your Experience</p>
                            <p className="text-orange-300 text-[8px] font-medium mt-0.5">Takes only 30 seconds</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Design 4: Cyan Tech
    if (activeDesign === 4) {
        return (
            <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-sky-100 rounded-3xl p-8">
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[240px] h-6 bg-black/20 blur-xl rounded-full"></div>

                <div className="relative w-[240px] h-[336px] bg-white rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.15)] overflow-hidden border-4 border-white">
                    {/* Top - Cyan Branding */}
                    <div className="relative h-[80px] bg-gradient-to-br from-cyan-600 to-sky-700 flex flex-col items-center justify-center px-4 py-3">
                        <h2 className="text-white font-black text-lg tracking-tight">RANKBAG</h2>
                        <p className="text-cyan-100 text-[10px] font-bold tracking-wider mt-0.5">AI REVIEW</p>
                    </div>

                    {/* Middle */}
                    <div className="relative bg-white px-6 py-6 flex flex-col items-center">
                        <h3 className="text-slate-800 font-bold text-base mb-4 tracking-tight">Scan & Review</h3>

                        <div className="relative bg-white p-2 rounded-lg border-2 border-cyan-200 shadow-sm">
                            <img src={qrCodeUrl} alt="QR" className="w-32 h-32 object-contain" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-cyan-500">
                                <span className="text-2xl">{businessData.logo}</span>
                            </div>
                        </div>

                        <p className="text-slate-700 font-semibold text-xs mt-4 text-center">{businessData.name}</p>
                    </div>

                    {/* Bottom - Dark Cyan Footer */}
                    <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-br from-cyan-900 to-sky-950 flex items-center justify-center px-4">
                        <div className="flex items-center gap-2 text-white">
                            <div className="flex items-center gap-1 text-[9px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <span>Scan</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
                                <span>Rate</span>
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                                <span>Done</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};
