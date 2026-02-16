import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    BuildingStorefrontIcon,
    UserGroupIcon,
    CreditCardIcon,
    CheckCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    SparklesIcon,
    MapPinIcon,
    PhotoIcon,
    GlobeAltIcon,
    TagIcon,
    PlusIcon,
    TrashIcon,
    StarIcon,
    ArrowUpTrayIcon,
    ArrowPathIcon,
    QrCodeIcon
} from '@heroicons/react/24/solid';
import Logo from '../components/common/Logo';
import { uploadImage } from '../lib/supabase';
import { Premium3DQRStands } from '../components/Premium3DQRStands';

export default function ClientOnboarding() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tempQuality, setTempQuality] = useState('');
    const [isPaymentOverlayOpen, setIsPaymentOverlayOpen] = useState(false);

    // Comprehensive Form Data
    const [formData, setFormData] = useState({
        // Step 1: Basic Info
        businessName: 'The Golden Spoon',
        businessType: 'Restaurant',
        tagline: 'Authentic flavors, unforgettable moments',
        description: 'A premium dining experience serving the best Italian cuisine in the heart of the city.',
        logo: '🍝',

        // Step 2: Contact & Location
        email: 'contact@goldenspoon.com',
        phone: '+91 98765 43210',
        addressLine1: '123, Gourmet Street, Foodie Zone',
        city: 'Mumbai',
        state: 'Maharashtra',
        zip: '400050',
        country: 'India',
        googleMapUrl: 'https://goo.gl/maps/example',

        // Step 3: Visual Identity
        heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
        gallery: [
            'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
        ],

        // Step 4: Team & Services
        teamMembers: [
            { name: 'Marco Rossi', role: 'Head Chef', image: '' },
            { name: 'Sarah Jones', role: 'Manager', image: '' }
        ],
        services: [
            { name: 'Fine Dining', price: '₹1500', description: 'Full course meal with wine pairing', image: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80' },
            { name: 'Luxury Catering', price: '₹10000', description: 'Premium catering for events and parties', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80' },
            { name: 'Private Events', price: '₹5000', description: 'Exclusive booking for special occasions', image: 'https://images.unsplash.com/photo-1519225468359-2996bc140aaa?auto=format&fit=crop&w=800&q=80' }
        ],

        // Step 5: Brand Voice
        qualities: ['Elegant', 'Delicious', 'Authentic'],
        socialMedia: [{ platform: 'Instagram', url: 'https://instagram.com/goldenspoon' }],

        // Step 6: Plan & Payment
        plan: 'premium',
        paymentMethod: 'upi',
        upiId: 'goldenspoon@upi',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',

        // Generated Credentials
        generatedUsername: '',
        generatedPassword: ''
    });

    // Helper to scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentStep]);

    // Validation Logic
    const validateStep = (step) => {
        switch (step) {
            case 1: // Basics
                return formData.businessName && formData.businessType;
            case 2: // Location
                return formData.email && formData.phone && formData.addressLine1 && formData.city;
            case 3: // Visuals
                return true; // Optional
            case 4: // Team/Services
                return true; // Optional
            case 5: // Brand
                return true; // Optional
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (currentStep < 6 && validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        } else if (!validateStep(currentStep)) {
            alert('Please fill in all required fields.');
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Array Item Handlers
    const addItem = (field, template) => {
        setFormData({ ...formData, [field]: [...formData[field], template] });
    };

    const removeItem = (field, index) => {
        setFormData({ ...formData, [field]: formData[field].filter((_, i) => i !== index) });
    };

    const updateItem = (field, index, subField, value) => {
        const newArray = [...formData[field]];
        newArray[index] = { ...newArray[index], [subField]: value };
        setFormData({ ...formData, [field]: newArray });
    };



    const addQuality = () => {
        const val = tempQuality.trim();
        if (!val) return;

        // Enforce one word per quality
        if (val.includes(' ')) {
            alert('Please use one word per quality (e.g. "Professional" instead of "Very Professional")');
            return;
        }

        if (!formData.qualities.includes(val)) {
            setFormData({
                ...formData,
                qualities: [...formData.qualities, val]
            });
        }
        setTempQuality('');
    };

    const handleQualityKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addQuality();
        }
    };

    const handleFileUpload = async (file, callback) => {
        if (!file) return;
        // Check file size (e.g. 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size too large. Please upload an image smaller than 5MB.');
            return;
        }

        setIsProcessing(true);
        try {
            const { success, url, error } = await uploadImage(file);
            if (success) {
                if (typeof callback === 'function') {
                    callback(url);
                } else {
                    // Fallback for legacy calls if any (though we are updating them all)
                    console.warn('handleFileUpload called without callback');
                }
            } else {
                alert('Upload failed: ' + error);
            }
        } catch (err) {
            console.error(err);
            alert('Upload error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmit = async () => {
        // PROTOTYPE ONLY: Show Payment Processing Screen
        setIsPaymentOverlayOpen(true);
        // Payment processing simulator - stays on buffering screen as requested
    };

    const steps = [
        { number: 1, title: 'Basics', icon: <BuildingStorefrontIcon className="w-5 h-5" /> },
        { number: 2, title: 'Location', icon: <MapPinIcon className="w-5 h-5" /> },
        { number: 3, title: 'Visuals', icon: <PhotoIcon className="w-5 h-5" /> },
        { number: 4, title: 'Offerings', icon: <UserGroupIcon className="w-5 h-5" /> },
        { number: 5, title: 'Brand', icon: <TagIcon className="w-5 h-5" /> },
        { number: 6, title: 'Checkout', icon: <CreditCardIcon className="w-5 h-5" /> }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 font-sans">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                    <Logo size="medium" variant="full" className="justify-center mb-4" />
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Build Your Business Profile</h1>
                    <p className="text-gray-600 text-lg">Set up your AI-powered review system in minutes.</p>
                </div>

                {/* Progress Steps */}
                <div className="mb-10 px-4 overflow-x-auto pb-4">
                    <div className="flex items-center justify-between relative max-w-4xl mx-auto min-w-max px-2">
                        {/* Connecting Line */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                        <div
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500 ease-in-out"
                            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                        ></div>

                        {steps.map((step) => (
                            <div key={step.number} className="flex flex-col items-center bg-transparent">
                                <div
                                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 z-10 border-4 ${currentStep >= step.number
                                        ? 'bg-blue-600 border-blue-100 text-white shadow-lg scale-110'
                                        : 'bg-white border-gray-200 text-gray-400'
                                        }`}
                                >
                                    {currentStep > step.number ? <CheckCircleIcon className="w-6 h-6" /> : step.icon}
                                </div>
                                <span className={`mt-2 text-xs md:text-sm font-semibold transition-colors whitespace-nowrap ${currentStep >= step.number ? 'text-blue-900' : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Form Card */}
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-6 md:p-12">
                        <AnimatePresence mode="wait">
                            {/* --- STEP 1: BASICS --- */}
                            {currentStep === 1 && (
                                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="border-b pb-4">
                                        <h2 className="text-3xl font-bold text-gray-900">The Basics</h2>
                                        <p className="text-gray-500 mt-1">Let's start with your business identity.</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Business Name *</label>
                                                <input
                                                    type="text"
                                                    value={formData.businessName}
                                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-lg"
                                                    placeholder="e.g. Bella Italia"
                                                    autoFocus
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Business Type *</label>
                                                <select
                                                    value={formData.businessType}
                                                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-medium text-lg appearance-none"
                                                >
                                                    {['Restaurant', 'Cafe', 'Salon', 'Spa', 'Gym', 'Retail', 'Hotel', 'Clinic', 'Other'].map(t => (
                                                        <option key={t} value={t}>{t}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
                                                <input
                                                    type="text"
                                                    value={formData.tagline}
                                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="e.g. Authentic Italian Flavors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    rows="4"
                                                    placeholder="Tell us about your business..."
                                                ></textarea>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Logo Emoji</label>
                                                <div className="flex flex-wrap gap-4">
                                                    {['🍕', '🍔', '💇', '💅', '🏋️', '🏥', '☕', '🏨', '🛍️'].map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            onClick={() => setFormData({ ...formData, logo: emoji })}
                                                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 transition-all ${formData.logo === emoji ? 'border-blue-500 bg-blue-50 transform scale-110' : 'border-gray-100 hover:border-blue-200'}`}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 2: LOCATION --- */}
                            {currentStep === 2 && (
                                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="border-b pb-4">
                                        <h2 className="text-3xl font-bold text-gray-900">Location & Contact</h2>
                                        <p className="text-gray-500 mt-1">Where can customers find you?</p>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address *</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="contact@example.com"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="+91 98765 43210"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Google Maps Embed URL</label>
                                                <input
                                                    type="text"
                                                    value={formData.googleMapUrl}
                                                    onChange={(e) => setFormData({ ...formData, googleMapUrl: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="https://goo.gl/maps/..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Address Line 1 *</label>
                                                <input
                                                    type="text"
                                                    value={formData.addressLine1}
                                                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="Shop No. 12, Main Street"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                                                    <input
                                                        type="text"
                                                        value={formData.city}
                                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                        placeholder="Mumbai"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Zip Code</label>
                                                    <input
                                                        type="text"
                                                        value={formData.zip}
                                                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                                                        className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                        placeholder="400001"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="Maharashtra"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 3: VISUALS --- */}
                            {currentStep === 3 && (
                                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="border-b pb-4">
                                        <h2 className="text-3xl font-bold text-gray-900">Visual Identity</h2>
                                        <p className="text-gray-500 mt-1">Make your page pop with great images.</p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Hero Image */}
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <label className="block text-lg font-bold text-gray-900 mb-4">Hero Image</label>

                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Preview Area */}
                                                <div className="w-full md:w-1/3 aspect-video bg-gray-200 rounded-xl overflow-hidden relative group border-2 border-dashed border-gray-300 flex items-center justify-center">
                                                    {formData.heroImage ? (
                                                        <>
                                                            <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <button
                                                                    onClick={() => setFormData({ ...formData, heroImage: '' })}
                                                                    className="bg-red-500 text-white p-2 rounded-full"
                                                                >
                                                                    <TrashIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-center p-4">
                                                            <PhotoIcon className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                                            <p className="text-xs text-gray-500">No image selected</p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Input Area */}
                                                <div className="flex-1 space-y-4">
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Upload from Device</label>
                                                        <label className="flex items-center gap-3 w-full px-5 py-4 rounded-xl border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer transition-colors group">
                                                            <div className="bg-white p-2 rounded-full shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                                                                <ArrowUpTrayIcon className="w-6 h-6" />
                                                            </div>
                                                            <div>
                                                                <span className="font-bold text-blue-900 block">Click to Upload</span>
                                                                <span className="text-xs text-blue-600">Supports JPG, PNG (Max 5MB)</span>
                                                            </div>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => handleFileUpload(e.target.files[0], (url) => setFormData(prev => ({ ...prev, heroImage: url })))}
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-gray-300"></div>
                                                        </div>
                                                        <div className="relative flex justify-center text-sm">
                                                            <span className="px-2 bg-gray-50 text-gray-500 font-medium">OR via URL</span>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={formData.heroImage}
                                                            onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none transition-all text-sm"
                                                            placeholder="Paste image URL (e.g. Unsplash)..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Gallery Images */}
                                        <div>
                                            <label className="block text-lg font-bold text-gray-900 mb-4">Gallery Images</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {/* Existing Images */}
                                                {formData.gallery.map((img, idx) => (
                                                    <div key={idx} className="relative group aspect-square">
                                                        <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover rounded-xl shadow-sm border border-gray-100" />
                                                        <button
                                                            onClick={() => {
                                                                const newGallery = formData.gallery.filter((_, i) => i !== idx);
                                                                setFormData({ ...formData, gallery: newGallery });
                                                            }}
                                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:bg-red-600"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* Add Button */}
                                                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-white flex items-center justify-center mb-2 transition-colors">
                                                        <PlusIcon className="w-6 h-6" />
                                                    </div>
                                                    <span className="font-semibold text-sm">Add Image</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) => handleFileUpload(e.target.files[0], (url) => setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] })))}
                                                    />
                                                </label>
                                            </div>
                                            {(formData.gallery.length > 0) && (
                                                <p className="text-xs text-gray-500 mt-2 text-right">{formData.gallery.length} images uploaded</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 4: TEAM & SERVICES --- */}
                            {currentStep === 4 && (
                                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="border-b pb-4">
                                        <h2 className="text-3xl font-bold text-gray-900">Offerings & Team</h2>
                                        <p className="text-gray-500 mt-1">Showcase what you do and who does it.</p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* Services */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-lg font-bold text-gray-900">Top Services</label>
                                                <button
                                                    onClick={() => addItem('services', { name: '', price: '', description: '', image: '' })}
                                                    className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1"
                                                >
                                                    <PlusIcon className="w-4 h-4" /> Add Service
                                                </button>
                                            </div>

                                            {formData.services.map((service, index) => (
                                                <div key={index} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                                                    <div className="p-4 md:p-6 grid md:grid-cols-12 gap-6">

                                                        {/* Service Image (AI / Upload) */}
                                                        <div className="md:col-span-4 space-y-3">
                                                            <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden group border border-gray-200">
                                                                {service.image ? (
                                                                    <img
                                                                        key={service.image} // Force re-render on URL change
                                                                        src={service.image}
                                                                        alt={service.name}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null;
                                                                            // Fallback to a static placeholder if AI fails
                                                                            e.target.src = 'https://placehold.co/800x600/f3f4f6/9ca3af?text=AI+Generation+Failed';
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center cursor-pointer hover:bg-gray-100 transition-colors">
                                                                        <ArrowUpTrayIcon className="w-8 h-8 mb-2 opacity-50" />
                                                                        <span className="text-xs">Click "Upload" to add a photo</span>
                                                                    </div>
                                                                )}

                                                                {/* Overlay Actions */}
                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                                    <label className="cursor-pointer bg-white text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors shadow-lg flex items-center gap-2">
                                                                        <ArrowUpTrayIcon className="w-4 h-4" /> Upload Photo
                                                                        <input
                                                                            type="file"
                                                                            accept="image/*"
                                                                            className="hidden"
                                                                            onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateItem('services', index, 'image', url))}
                                                                        />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Service Details */}
                                                        <div className="md:col-span-8 space-y-4">
                                                            <div className="flex justify-between items-start">
                                                                <div className="space-y-1 flex-1 mr-4">
                                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Name</label>
                                                                    <div className="flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="e.g. Haircut, Pizza, Consultation"
                                                                            value={service.name}
                                                                            onChange={(e) => updateItem('services', index, 'name', e.target.value)}
                                                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <button onClick={() => removeItem('services', index)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                                    <TrashIcon className="w-5 h-5" />
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Price</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="e.g. ₹500"
                                                                        value={service.price}
                                                                        onChange={(e) => updateItem('services', index, 'price', e.target.value)}
                                                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Description</label>
                                                                    <input
                                                                        type="text"
                                                                        placeholder="Short description"
                                                                        value={service.description}
                                                                        onChange={(e) => updateItem('services', index, 'description', e.target.value)}
                                                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <hr className="border-gray-100" />

                                        {/* Team */}
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-lg font-bold text-gray-900">Team Members</label>
                                                <button
                                                    onClick={() => addItem('teamMembers', { name: '', role: '', image: '' })}
                                                    className="text-sm text-blue-600 font-bold hover:underline flex items-center gap-1"
                                                >
                                                    <PlusIcon className="w-4 h-4" /> Add Member
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {formData.teamMembers.map((member, index) => (
                                                    <div key={index} className="bg-gray-50 rounded-2xl border border-gray-100 p-4 flex items-center gap-4 group hover:shadow-md transition-all">

                                                        {/* Team Photo */}
                                                        <div className="relative w-16 h-16 flex-shrink-0">
                                                            <div className="w-full h-full rounded-full overflow-hidden bg-gray-200 border border-gray-200">
                                                                {member.image ? (
                                                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                        <UserGroupIcon className="w-8 h-8" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Upload Trigger */}
                                                            <label className="absolute -bottom-1 -right-1 bg-white border border-gray-200 p-1.5 rounded-full shadow-sm cursor-pointer hover:bg-blue-50 transition-colors text-blue-600">
                                                                <ArrowUpTrayIcon className="w-3 h-3" />
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    className="hidden"
                                                                    onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateItem('teamMembers', index, 'image', url))}
                                                                />
                                                            </label>
                                                        </div>

                                                        <div className="flex-1 space-y-2">
                                                            <input
                                                                type="text"
                                                                placeholder="Name"
                                                                value={member.name}
                                                                onChange={(e) => updateItem('teamMembers', index, 'name', e.target.value)}
                                                                className="w-full px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:outline-none font-semibold"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Role (e.g. Manager)"
                                                                value={member.role}
                                                                onChange={(e) => updateItem('teamMembers', index, 'role', e.target.value)}
                                                                className="w-full px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs focus:border-blue-500 focus:outline-none"
                                                            />
                                                        </div>

                                                        <button
                                                            onClick={() => removeItem('teamMembers', index)}
                                                            className="text-gray-400 hover:text-red-500 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 5: BRAND & SOCIAL --- */}
                            {currentStep === 5 && (
                                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="border-b pb-4">
                                        <h2 className="text-3xl font-bold text-gray-900">Brand & Social</h2>
                                        <p className="text-gray-500 mt-1">Define your vibe and online presence.</p>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Qualities / Vibe */}
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Quality of Work (One word per quality)</label>
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {formData.qualities.map((tag, idx) => (
                                                    <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                        {tag}
                                                        <button onClick={() => {
                                                            const newTags = formData.qualities.filter((_, i) => i !== idx);
                                                            setFormData({ ...formData, qualities: newTags });
                                                        }} className="hover:text-blue-900">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={tempQuality}
                                                    onChange={(e) => setTempQuality(e.target.value)}
                                                    onKeyDown={handleQualityKeyDown}
                                                    className="flex-1 px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="e.g. Professional"
                                                />
                                                <button
                                                    onClick={addQuality}
                                                    className="px-6 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center text-xl"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>

                                        {/* Social Media */}
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-lg font-bold text-gray-900">Social Media Links</label>
                                                <button
                                                    onClick={() => addItem('socialMedia', { platform: 'Instagram', url: '' })}
                                                    className="text-sm text-blue-600 font-bold hover:underline"
                                                >
                                                    + Add Link
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.socialMedia.map((link, index) => (
                                                    <div key={index} className="flex flex-col sm:flex-row gap-4 items-center">
                                                        <select
                                                            value={link.platform}
                                                            onChange={(e) => updateItem('socialMedia', index, 'platform', e.target.value)}
                                                            className="w-full sm:w-1/3 px-4 py-3 rounded-lg border-2 border-gray-100 bg-gray-50"
                                                        >
                                                            {['Instagram', 'Facebook', 'Twitter', 'LinkedIn', 'Website'].map(p => (
                                                                <option key={p} value={p}>{p}</option>
                                                            ))}
                                                        </select>
                                                        <input
                                                            type="text"
                                                            placeholder="URL"
                                                            value={link.url}
                                                            onChange={(e) => updateItem('socialMedia', index, 'url', e.target.value)}
                                                            className="w-full flex-1 px-4 py-3 rounded-lg border-2 border-gray-100 bg-gray-50"
                                                        />
                                                        <button onClick={() => removeItem('socialMedia', index)} className="text-red-400 hover:text-red-600 p-2 self-end sm:self-center">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 6: CHECKOUT --- */}
                            {currentStep === 6 && (
                                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                    <div className="border-b pb-4">
                                        <h2 className="text-3xl font-bold text-gray-900">Review & Checkout</h2>
                                        <p className="text-gray-500 mt-1">Almost there! Select your plan and payment.</p>
                                    </div>

                                    {/* Plan Summary */}
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                        <div className="relative z-10 flex justify-between items-center">
                                            <div>
                                                <h3 className="text-2xl font-bold mb-1">Premium All-Access</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-blue-200 line-through text-lg">₹999</span>
                                                    <span className="bg-white text-blue-600 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">Testing Offer</span>
                                                </div>
                                                <p className="text-blue-100 opacity-90 text-sm mt-1">Monthly Subscription</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-4xl font-bold">₹1</div>
                                                <div className="text-sm opacity-80">/ month</div>
                                            </div>
                                        </div>
                                        {/* Decorative Circles */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                                        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                                    </div>

                                    {/* Premium Welcome Gift Section */}
                                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-2xl p-8 group">
                                        {/* Background Glow Effects */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 animate-pulse"></div>
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 animate-pulse" style={{ animationDelay: '1s' }}></div>

                                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                            {/* Text Content */}
                                            <div className="flex-1 text-center md:text-left space-y-3">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-amber-200 to-yellow-400 rounded-full text-amber-900 text-xs font-bold uppercase tracking-widest shadow-lg mb-2">
                                                    <SparklesIcon className="w-3 h-3 text-amber-800" />
                                                    <span>Premium Welcome Gift</span>
                                                </div>
                                                <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                                                    Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Brand Presence</span>
                                                </h3>
                                                <p className="text-slate-300 text-sm leading-relaxed max-w-md">
                                                    Receive a complimentary, custom-designed 3D Glass QR Stand. A stunning countertop piece that effortlessly turns customers into 5-star reviewers.
                                                </p>

                                                <div className="pt-2 flex flex-wrap justify-center md:justify-start gap-3">
                                                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 text-xs flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div> Crystal Clear Acrylic
                                                    </span>
                                                    <span className="px-3 py-1 bg-slate-800/50 border border-slate-600 rounded-lg text-slate-300 text-xs flex items-center gap-1.5">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div> NFC Enabled
                                                    </span>
                                                </div>
                                            </div>

                                            {/* 3D Animated Illustration */}
                                            <div className="flex-shrink-0 relative w-48 h-48 md:w-56 md:h-56 flex items-center justify-center perspective-[1000px]">
                                                {/* Floating Card Animation */}
                                                <div className="relative w-32 h-44 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-4 animate-[float_6s_ease-in-out_infinite] transform rotate-y-12 hover:rotate-y-0 transition-transform duration-700 preserve-3d">

                                                    {/* Glossy sheen */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 rounded-xl pointer-events-none"></div>

                                                    {/* Inner Content */}
                                                    <div className="w-12 h-12 bg-white rounded-lg shadow-inner flex items-center justify-center mb-3">
                                                        <QrCodeIcon className="w-8 h-8 text-slate-900" />
                                                    </div>
                                                    <div className="w-full h-1 bg-white/20 rounded-full mb-2"></div>
                                                    <div className="w-2/3 h-1 bg-white/10 rounded-full mb-4"></div>

                                                    <div className="mt-auto flex gap-1">
                                                        <StarIcon className="w-3 h-3 text-amber-400" />
                                                        <StarIcon className="w-3 h-3 text-amber-400" />
                                                        <StarIcon className="w-3 h-3 text-amber-400" />
                                                        <StarIcon className="w-3 h-3 text-amber-400" />
                                                        <StarIcon className="w-3 h-3 text-amber-400" />
                                                    </div>
                                                </div>

                                                {/* Floating Particles */}
                                                <div className="absolute top-1/4 right-0 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100 opacity-60"></div>
                                                <div className="absolute bottom-1/4 left-4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce delay-300 opacity-60"></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scan to Pay Section */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-4">Payment Method</label>

                                        <div className="bg-white rounded-2xl border-2 border-blue-100 p-8 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

                                            <div className="mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Scan & Pay ₹1</h3>
                                                <p className="text-gray-500 text-sm">Use any UPI app to complete the testing transaction</p>
                                            </div>

                                            {/* QR Code Placeholder - User to Replace */}
                                            <div className="p-4 bg-white rounded-xl border-2 border-gray-100 shadow-inner mb-6 relative group">
                                                {/* Placeholder Image - Instruct user to replace this source */}
                                                {/* Use a placeholder service or asset path */}
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent("upi://pay?pa=7878002359@ptsbi&pn=Amaan Tanveer&am=1.00&cu=INR")}`}
                                                    alt="Payment QR Code"
                                                    className="w-48 h-48 md:w-56 md:h-56 object-contain mix-blend-multiply"
                                                />
                                                <p className="mt-2 text-xs text-gray-400 font-mono">7878002359@ptsbi</p>
                                            </div>

                                            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                                                <span className="font-bold text-blue-800 italic">Paytm</span>
                                                <span className="font-bold text-green-600 italic">PhonePe</span>
                                                <span className="font-bold text-orange-500 italic">GPay</span>
                                                <span className="font-bold text-gray-800 italic">BHIM</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- STEP 7: SUCCESS --- */}
                            {currentStep === 7 && (
                                <motion.div key="step7" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-10">
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircleIcon className="w-16 h-16" />
                                    </div>
                                    <h2 className="text-4xl font-bold text-gray-900 mb-4">You're All Set!</h2>
                                    <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">
                                        Your business profile has been created and your dashboard is ready.
                                    </p>

                                    <div className="bg-gray-900 text-white rounded-2xl p-8 max-w-md mx-auto mb-10 shadow-2xl relative overflow-hidden">
                                        <div className="relative z-10">
                                            <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-6 font-bold">Your Credentials</h3>

                                            <div className="mb-6 text-left border-b border-gray-700 pb-6">
                                                <label className="text-xs text-gray-500 mb-1 block">Username</label>
                                                <div className="text-2xl font-mono text-green-400 font-bold tracking-wide">
                                                    {formData.generatedUsername}
                                                </div>
                                            </div>

                                            <div className="text-left">
                                                <label className="text-xs text-gray-500 mb-1 block">Password</label>
                                                <div className="text-2xl font-mono text-blue-400 font-bold tracking-wide">
                                                    {formData.generatedPassword}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
                                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-600 rounded-full blur-3xl opacity-20"></div>
                                    </div>

                                    <button
                                        onClick={() => navigate('/login', { state: { defaultMode: 'client' } })}
                                        className="btn btn-primary text-xl px-12 py-4 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                                    >
                                        Login to Dashboard
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Navigation Footer */}
                        {currentStep < 7 && (
                            <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-100">
                                <button
                                    onClick={handleBack}
                                    disabled={currentStep === 1}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <ArrowLeftIcon className="w-5 h-5" /> Back
                                </button>

                                {currentStep < 6 ? (
                                    <button
                                        onClick={handleNext}
                                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                    >
                                        Next Step <ArrowRightIcon className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isProcessing}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
                                    >
                                        {isProcessing ? 'Creating Account...' : 'Complete & Pay'}
                                        {!isProcessing && <CheckCircleIcon className="w-6 h-6" />}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {currentStep < 7 && (
                    <div className="text-center mt-8">
                        <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 font-medium transition-colors">
                            Cancel Setup
                        </button>
                    </div>
                )}
            </div>

            {/* Payment Processing Overlay (Buffering) */}
            <AnimatePresence>
                {isPaymentOverlayOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-10 max-w-sm w-full text-center relative overflow-hidden shadow-2xl"
                        >
                            <div className="mb-8 relative flex justify-center">
                                {/* Buffering Animation */}
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-gray-100 rounded-full"></div>
                                    <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <SparklesIcon className="w-8 h-8 text-blue-600 animate-pulse" />
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing Payment...</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Please wait while we confirm your transaction. This won't take long.
                            </p>

                            <div className="space-y-4">
                                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[progress_2s_ease-in-out_infinite] w-full origin-left"></div>
                                </div>
                                <p className="text-xs text-blue-600 font-semibold animate-pulse">Innovating your experience...</p>
                            </div>

                            <button
                                onClick={() => setIsPaymentOverlayOpen(false)}
                                className="mt-8 text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Cancel Payment
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
