import React from 'react';
import QRCode from 'react-qr-code';
import { StarIcon, HeartIcon, SparklesIcon } from '@heroicons/react/24/solid';

export const Premium3DQRStands = ({ activeDesign, qrCodeUrl, businessData }) => {

    const renderStand = (config) => {
        const {
            topGradient,
            mainBg,
            bottomGradient,
            accentColor,
            shadowColor,
            ctaText
        } = config;

        return (
            // Container - WITH BREATHING SPACE (2nd Image Version)
            <div className="relative w-full h-full flex items-center justify-center py-16" style={{ background: mainBg }}>
                {/* Desk Shadow - SUBTLE */}
                <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[200px] h-4 rounded-full blur-xl opacity-20"
                    style={{ backgroundColor: shadowColor }}></div>

                {/* Physical QR Stand - SMALLER WITH SPACE (2nd Image) */}
                <div className="relative" style={{
                    transform: 'perspective(800px) rotateX(-1deg)',
                    filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.12))'
                }}>
                    {/* Main Stand Card - COMPACT */}
                    <div className="relative w-[200px] bg-white rounded-2xl overflow-hidden border-[4px] border-white"
                        style={{
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            imageRendering: 'crisp-edges',
                            WebkitFontSmoothing: 'antialiased'
                        }}>

                        {/* TOP SECTION - Business Branding */}
                        <div className="relative px-4 py-4 text-center" style={{ background: topGradient }}>
                            {/* Business Logo */}
                            <div className="mb-2">
                                <div className="text-3xl drop-shadow-md inline-block">
                                    {businessData.logo}
                                </div>
                            </div>

                            {/* Business Name - CRISP FONT */}
                            <h1 className="text-white font-black text-base tracking-tight drop-shadow-md mb-1.5"
                                style={{
                                    fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif",
                                    letterSpacing: '-0.02em',
                                    WebkitFontSmoothing: 'antialiased',
                                    textRendering: 'optimizeLegibility'
                                }}>
                                {businessData.name}
                            </h1>

                            {/* Tagline */}
                            <div className="px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full inline-block border border-white/30">
                                <p className="text-white text-[8px] font-bold tracking-wide">
                                    ⭐ Premium Dining
                                </p>
                            </div>
                        </div>

                        {/* MIDDLE SECTION - QR Code */}
                        <div className="relative bg-white px-4 py-4">
                            {/* Call to Action Title */}
                            <div className="text-center mb-3">
                                <h2 className="text-slate-900 font-black text-sm mb-0.5 tracking-tight"
                                    style={{
                                        fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif",
                                        letterSpacing: '-0.01em',
                                        WebkitFontSmoothing: 'antialiased'
                                    }}>
                                    {ctaText}
                                </h2>
                                <p className="text-slate-600 text-[9px] font-semibold">
                                    Scan the QR code below
                                </p>
                            </div>

                            {/* QR CODE - CRISP & SHARP */}
                            <div className="flex justify-center mb-3">
                                <div className="relative">
                                    {/* Glow Effect - SUBTLE */}
                                    <div className="absolute -inset-2 rounded-xl blur-md opacity-15 animate-pulse"
                                        style={{ backgroundColor: accentColor }}></div>

                                    {/* QR Code Container - HD */}
                                    <div className="relative bg-white p-2 rounded-xl border-[2px] shadow-md"
                                        style={{ borderColor: accentColor }}>
                                        <QRCode
                                            value={qrCodeUrl}
                                            size={112} // w-28 = 112px
                                            level="H" // High error correction
                                            fgColor={accentColor}
                                            style={{
                                                width: '112px',
                                                height: '112px',
                                                imageRendering: 'crisp-edges',
                                                WebkitImageRendering: 'crisp-edges'
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Instructions - CRISP */}
                            <div className="flex items-center justify-center gap-2 text-slate-700">
                                <div className="flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 shadow-sm"
                                        style={{ backgroundColor: accentColor + '15' }}>
                                        <span className="text-sm">📱</span>
                                    </div>
                                    <span className="text-[7px] font-bold">Scan</span>
                                </div>

                                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: accentColor + '25' }}></div>

                                <div className="flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 shadow-sm"
                                        style={{ backgroundColor: accentColor + '15' }}>
                                        <StarIcon className="w-3 h-3 text-yellow-500" />
                                    </div>
                                    <span className="text-[7px] font-bold">Rate</span>
                                </div>

                                <div className="w-3 h-0.5 rounded-full" style={{ backgroundColor: accentColor + '25' }}></div>

                                <div className="flex flex-col items-center">
                                    <div className="w-7 h-7 rounded-lg flex items-center justify-center mb-0.5 shadow-sm"
                                        style={{ backgroundColor: accentColor + '15' }}>
                                        <HeartIcon className="w-3 h-3 text-red-500" />
                                    </div>
                                    <span className="text-[7px] font-bold">Share</span>
                                </div>
                            </div>
                        </div>

                        {/* BOTTOM SECTION - RankBag Branding */}
                        <div className="relative px-4 py-3 text-center" style={{ background: bottomGradient }}>
                            <div className="flex items-center justify-center gap-1 mb-0.5">
                                <SparklesIcon className="w-2.5 h-2.5 text-yellow-400" />
                                <h3 className="text-white font-black text-xs tracking-wider"
                                    style={{
                                        fontFamily: "'Montserrat', 'Inter', system-ui, sans-serif",
                                        letterSpacing: '0.15em',
                                        WebkitFontSmoothing: 'antialiased'
                                    }}>
                                    RankBag
                                </h3>
                                <SparklesIcon className="w-2.5 h-2.5 text-yellow-400" />
                            </div>
                            <p className="text-white/90 text-[8px] font-black tracking-widest mb-0.5"
                                style={{ letterSpacing: '0.25em' }}>
                                AI REVIEW
                            </p>
                            <p className="text-white/70 text-[6px] font-semibold mt-0.5 tracking-wide">
                                Powered by Kaiten Software
                            </p>
                        </div>
                    </div>

                    {/* 3D Stand Base - SUBTLE */}
                    <div className="absolute -bottom-0.5 left-0 right-0 h-2 rounded-b-2xl"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05), rgba(0,0,0,0.1))',
                            transform: 'scaleX(0.98)'
                        }}></div>
                </div>
            </div>
        );
    };

    // Design Configurations
    const designs = [
        {
            topGradient: 'linear-gradient(180deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
            mainBg: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
            bottomGradient: 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
            accentColor: '#3b82f6',
            shadowColor: '#3b82f6',
            ctaText: 'Love Our Food?'
        },
        {
            topGradient: 'linear-gradient(180deg, #047857 0%, #10b981 50%, #34d399 100%)',
            mainBg: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
            bottomGradient: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
            accentColor: '#10b981',
            shadowColor: '#10b981',
            ctaText: 'Enjoyed Your Meal?'
        },
        {
            topGradient: 'linear-gradient(180deg, #7c3aed 0%, #a855f7 50%, #c084fc 100%)',
            mainBg: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)',
            bottomGradient: 'linear-gradient(180deg, #581c87 0%, #6b21a8 100%)',
            accentColor: '#a855f7',
            shadowColor: '#a855f7',
            ctaText: 'Rate Your Experience'
        },
        {
            topGradient: 'linear-gradient(180deg, #dc2626 0%, #f97316 50%, #fb923c 100%)',
            mainBg: 'linear-gradient(135deg, #fed7aa 0%, #fdba74 100%)',
            bottomGradient: 'linear-gradient(180deg, #7c2d12 0%, #9a3412 100%)',
            accentColor: '#f97316',
            shadowColor: '#f97316',
            ctaText: 'Share Your Love!'
        },
        {
            topGradient: 'linear-gradient(180deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
            mainBg: 'linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)',
            bottomGradient: 'linear-gradient(180deg, #164e63 0%, #155e75 100%)',
            accentColor: '#06b6d4',
            shadowColor: '#06b6d4',
            ctaText: 'Tell Us Your Thoughts'
        }
    ];

    return renderStand(designs[activeDesign] || designs[0]);
};
