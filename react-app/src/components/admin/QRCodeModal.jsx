import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon, PrinterIcon, ShareIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function QRCodeModal({ isOpen, onClose, business }) {
    const [selectedStyle, setSelectedStyle] = useState('modern');

    if (!isOpen || !business) return null;

    const baseUrl = window.location.origin;
    const reviewUrl = `${baseUrl}/business/${business.business_id || business.id}`;

    const qrStyles = {
        modern: {
            name: 'Modern',
            url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewUrl)}&color=667eea&bgcolor=ffffff`,
            gradient: 'from-blue-500 to-purple-600',
            description: 'Clean and professional'
        },
        vibrant: {
            name: 'Vibrant',
            url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewUrl)}&color=ec4899&bgcolor=fdf2f8`,
            gradient: 'from-pink-500 to-rose-600',
            description: 'Eye-catching and bold'
        },
        elegant: {
            name: 'Elegant',
            url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewUrl)}&color=1e293b&bgcolor=f8fafc`,
            gradient: 'from-slate-700 to-slate-900',
            description: 'Sophisticated and minimal'
        },
        nature: {
            name: 'Nature',
            url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewUrl)}&color=059669&bgcolor=f0fdf4`,
            gradient: 'from-green-600 to-emerald-700',
            description: 'Fresh and organic'
        },
        sunset: {
            name: 'Sunset',
            url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewUrl)}&color=ea580c&bgcolor=fff7ed`,
            gradient: 'from-orange-600 to-red-600',
            description: 'Warm and inviting'
        },
        ocean: {
            name: 'Ocean',
            url: `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewUrl)}&color=0891b2&bgcolor=ecfeff`,
            gradient: 'from-cyan-600 to-blue-700',
            description: 'Cool and calming'
        }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(qrStyles[selectedStyle].url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${business.business_name || business.name}-qr-${selectedStyle}.png`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading QR code:', error);
        }
    };

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>QR Code - ${business.business_name || business.name}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 40px;
                        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .container {
                        background: white;
                        padding: 60px;
                        border-radius: 30px;
                        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                        text-align: center;
                        max-width: 600px;
                    }
                    .logo {
                        font-size: 80px;
                        margin-bottom: 20px;
                    }
                    h1 {
                        font-size: 36px;
                        font-weight: 800;
                        margin: 0 0 10px 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                        background-clip: text;
                    }
                    .tagline {
                        font-size: 18px;
                        color: #64748b;
                        margin-bottom: 40px;
                    }
                    .qr-container {
                        background: white;
                        padding: 30px;
                        border-radius: 20px;
                        display: inline-block;
                        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
                        margin-bottom: 30px;
                    }
                    img {
                        width: 400px;
                        height: 400px;
                        display: block;
                    }
                    .instructions {
                        font-size: 20px;
                        font-weight: 600;
                        color: #1e293b;
                        margin-bottom: 15px;
                    }
                    .url {
                        font-size: 14px;
                        color: #64748b;
                        font-family: monospace;
                        background: #f1f5f9;
                        padding: 10px 20px;
                        border-radius: 10px;
                        display: inline-block;
                    }
                    @media print {
                        body {
                            background: white;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="logo">${business.logo || '🏢'}</div>
                    <h1>${business.business_name || business.name}</h1>
                    <div class="tagline">${business.tagline || ''}</div>
                    <div class="qr-container">
                        <img src="${qrStyles[selectedStyle].url}" alt="QR Code" />
                    </div>
                    <div class="instructions">📱 Scan to Leave a Review</div>
                    <div class="url">${reviewUrl}</div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Review ${business.business_name || business.name}`,
                    text: `Share your experience at ${business.business_name || business.name}`,
                    url: reviewUrl
                });
            } catch (error) {
                console.log('Error sharing:', error);
            }
        } else {
            // Fallback: Copy to clipboard
            navigator.clipboard.writeText(reviewUrl);
            alert('Review link copied to clipboard!');
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                        <div className="flex items-center gap-4">
                            <div className="text-5xl">{business.logo || '🏢'}</div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">{business.business_name || business.name}</h2>
                                <p className="text-white/90">{business.tagline || 'QR Code Generator'}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Style Selection */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Choose QR Code Style</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {Object.entries(qrStyles).map(([key, style]) => (
                                    <motion.button
                                        key={key}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedStyle(key)}
                                        className={`p-4 rounded-2xl border-2 transition-all ${selectedStyle === key
                                                ? 'border-purple-500 bg-purple-50 shadow-lg'
                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${style.gradient} mb-3 mx-auto`}></div>
                                        <div className="font-bold text-gray-900">{style.name}</div>
                                        <div className="text-xs text-gray-500 mt-1">{style.description}</div>
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* QR Code Preview */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold mb-4 text-gray-900">Preview</h3>
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8 flex flex-col items-center">
                                <motion.div
                                    key={selectedStyle}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white p-6 rounded-2xl shadow-2xl"
                                >
                                    <img
                                        src={qrStyles[selectedStyle].url}
                                        alt="QR Code"
                                        className="w-80 h-80 rounded-xl"
                                    />
                                </motion.div>
                                <div className="mt-6 text-center">
                                    <div className="text-lg font-semibold text-gray-700 mb-2">📱 Scan to Leave a Review</div>
                                    <div className="text-sm text-gray-500 font-mono bg-white px-4 py-2 rounded-lg inline-block">
                                        {reviewUrl}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            >
                                <ArrowDownTrayIcon className="w-6 h-6" />
                                Download QR Code
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handlePrint}
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            >
                                <PrinterIcon className="w-6 h-6" />
                                Print QR Code
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleShare}
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all"
                            >
                                <ShareIcon className="w-6 h-6" />
                                Share Link
                            </motion.button>
                        </div>

                        {/* Tips */}
                        <div className="mt-8 bg-blue-50 rounded-2xl p-6">
                            <h4 className="font-bold text-blue-900 mb-3">💡 Tips for Using Your QR Code</h4>
                            <ul className="space-y-2 text-blue-800 text-sm">
                                <li>• Print and display at your business location</li>
                                <li>• Add to receipts, business cards, and marketing materials</li>
                                <li>• Share on social media to encourage reviews</li>
                                <li>• Include in email signatures and newsletters</li>
                                <li>• Place on table tents, posters, and signage</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
