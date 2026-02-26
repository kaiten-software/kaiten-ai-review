import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addBusinessViaFSR } from '../lib/fsrApi';
import {
    BuildingStorefrontIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    SparklesIcon,
    CheckCircleIcon,
    RocketLaunchIcon
} from '@heroicons/react/24/outline';

export default function RegisterBusiness() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fsrId = searchParams.get('fsr');
    const [fsrDetails, setFsrDetails] = useState(null);

    useEffect(() => {
        const fetchFSR = async () => {
            if (fsrId) {
                const { getFSRByUserId } = await import('../lib/fsrApi');
                const result = await getFSRByUserId(fsrId);
                if (result.success) {
                    setFsrDetails(result.data);
                }
            }
        };
        fetchFSR();
    }, [fsrId]);

    const [formData, setFormData] = useState({
        businessName: '',
        ownerName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        businessType: '',
        description: '',
        fsrId: fsrId || ''
    });

    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const businessTypes = [
        'Salon & Spa',
        'Restaurant & Café',
        'Retail Store',
        'Electronics',
        'Fashion & Apparel',
        'Healthcare',
        'Fitness Center',
        'Education',
        'Professional Services',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (!formData.fsrId) {
                setError('FSR ID is required. Please use the QR code link provided by your sales representative.');
                setLoading(false);
                return;
            }

            // Save to Supabase via FSR API
            const result = await addBusinessViaFSR(formData, formData.fsrId);

            if (result.success) {
                console.log('Business registered successfully:', result.data);
                setSubmitted(true);
            } else {
                setError(result.error || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <CheckCircleIcon className="w-16 h-16 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-4">
                        🎉 Registration Successful!
                    </h1>
                    <p className="text-xl text-green-200 mb-6">
                        Welcome to RankBag, <span className="font-bold">{formData.businessName}</span>!
                    </p>
                    <p className="text-green-300 mb-8">
                        Our team will contact you shortly to complete the onboarding process.
                        Get ready to transform your customer reviews! 🚀
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-12 px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mb-6 shadow-2xl relative">
                        <RocketLaunchIcon className="w-10 h-10 text-white" />
                    </div>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-0 left-0 mt-4 ml-4 flex items-center text-purple-200 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                        Back
                    </button>
                    <h1 className="text-5xl font-bold text-white mb-4">
                        Start Your Journey with RankBag
                    </h1>
                    <p className="text-2xl text-purple-200 mb-2">
                        Transform Your Customer Reviews Today! ✨
                    </p>
                    {fsrId && (
                        <div className="inline-block bg-green-500/20 border border-green-500/50 rounded-full px-6 py-2 mt-4 backdrop-blur-md">
                            <p className="text-green-300 font-semibold flex items-center gap-2">
                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Referral</span>
                                Referred by: <span className="text-white text-lg">{fsrDetails ? fsrDetails.name : fsrId}</span>
                                <span className="text-green-400 text-sm">({fsrId})</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Registration Form */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-red-500/20 border border-red-500/50 rounded-xl p-4 text-red-200">
                            <p className="font-semibold">⚠️ {error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Business Information Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <BuildingStorefrontIcon className="w-8 h-8 mr-3 text-pink-400" />
                                Business Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Business Name */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        Business Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="e.g., Raj's Salon & Spa"
                                        required
                                    />
                                </div>

                                {/* Business Type */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        Business Type *
                                    </label>
                                    <select
                                        name="businessType"
                                        value={formData.businessType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        required
                                    >
                                        <option value="" className="bg-purple-900">Select business type</option>
                                        {businessTypes.map(type => (
                                            <option key={type} value={type} className="bg-purple-900">{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        Business Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="Tell us about your business..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>

                        {/* Owner Information Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <UserIcon className="w-8 h-8 mr-3 text-purple-400" />
                                Owner Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Owner Name */}
                                <div>
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        Owner Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="ownerName"
                                        value={formData.ownerName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        Email Address *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-purple-300" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                            placeholder="your@email.com"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        Phone Number *
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <PhoneIcon className="h-5 w-5 text-purple-300" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                            placeholder="+91-XXXXXXXXXX"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Location Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                <MapPinIcon className="w-8 h-8 mr-3 text-indigo-400" />
                                Business Location
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="Street address"
                                        required
                                    />
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="City"
                                        required
                                    />
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-sm font-medium text-purple-100 mb-2">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-purple-300/30 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                                        placeholder="State"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* FSR ID (Hidden/Display Only) */}
                        {fsrId && (
                            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4">
                                <p className="text-purple-200 text-sm">
                                    <span className="font-semibold">Field Sales Representative ID:</span>
                                    <span className="ml-2 text-white font-mono">{fsrId}</span>
                                </p>
                            </div>
                        )}

                        {/* Benefits Section */}
                        <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30">
                            <h3 className="text-white font-bold text-lg mb-3 flex items-center">
                                <SparklesIcon className="w-6 h-6 mr-2 text-yellow-400" />
                                What You'll Get
                            </h3>
                            <ul className="space-y-2 text-purple-100">
                                <li className="flex items-start">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>AI-powered review generation and management</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Beautiful QR code stands for your business</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Comprehensive analytics dashboard</span>
                                </li>
                                <li className="flex items-start">
                                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                    <span>Automated Google review posting</span>
                                </li>
                            </ul>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center">
                                    <RocketLaunchIcon className="w-6 h-6 mr-2" />
                                    Start My Journey
                                </span>
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-purple-300 text-sm">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-pink-400 hover:text-pink-300 font-semibold underline"
                        >
                            Login here
                        </button>
                    </p>
                </div>
            </div>

            <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div >
    );
}
