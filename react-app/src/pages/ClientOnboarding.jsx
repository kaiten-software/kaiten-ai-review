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
    ArrowPathIcon
} from '@heroicons/react/24/solid';
import Logo from '../components/common/Logo';
import { uploadImage } from '../lib/supabase';

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
            { name: 'Marco Rossi', role: 'Head Chef' },
            { name: 'Sarah Jones', role: 'Manager' }
        ],
        services: [
            { name: 'Fine Dining', price: '₹1500', description: 'Full course meal' },
            { name: 'Catering', price: '₹10000', description: 'Events and parties' }
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

    const handleFileUpload = async (file, field) => {
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
                if (field === 'heroImage') {
                    setFormData(prev => ({ ...prev, heroImage: url }));
                } else if (field === 'gallery') {
                    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
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
        // No further action - credentials not generated yet
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
                                                                onChange={(e) => handleFileUpload(e.target.files[0], 'heroImage')}
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
                                                        onChange={(e) => handleFileUpload(e.target.files[0], 'gallery')}
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
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-lg font-bold text-gray-900">Top Services</label>
                                                <button
                                                    onClick={() => addItem('services', { name: '', price: '', description: '' })}
                                                    className="text-sm text-blue-600 font-bold hover:underline"
                                                >
                                                    + Add Service
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.services.map((service, index) => (
                                                    <div key={index} className="flex flex-col sm:flex-row gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex-1 grid md:grid-cols-2 gap-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Service Name"
                                                                value={service.name}
                                                                onChange={(e) => updateItem('services', index, 'name', e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Price (e.g. ₹500)"
                                                                value={service.price}
                                                                onChange={(e) => updateItem('services', index, 'price', e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                                                            />
                                                        </div>
                                                        <button onClick={() => removeItem('services', index)} className="text-red-400 hover:text-red-600 p-2">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Team */}
                                        <div>
                                            <div className="flex justify-between items-center mb-4">
                                                <label className="text-lg font-bold text-gray-900">Team Members</label>
                                                <button
                                                    onClick={() => addItem('teamMembers', { name: '', role: '' })}
                                                    className="text-sm text-blue-600 font-bold hover:underline"
                                                >
                                                    + Add Member
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {formData.teamMembers.map((member, index) => (
                                                    <div key={index} className="flex flex-col sm:flex-row gap-4 items-start p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                        <div className="flex-1 grid md:grid-cols-2 gap-4">
                                                            <input
                                                                type="text"
                                                                placeholder="Name"
                                                                value={member.name}
                                                                onChange={(e) => updateItem('teamMembers', index, 'name', e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Role (e.g. Senior Stylist)"
                                                                value={member.role}
                                                                onChange={(e) => updateItem('teamMembers', index, 'role', e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border border-gray-200"
                                                            />
                                                        </div>
                                                        <button onClick={() => removeItem('teamMembers', index)} className="text-red-400 hover:text-red-600 p-2">
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
                                                <p className="text-blue-100 opacity-90">Monthly Subscription</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-3xl font-bold">₹999</div>
                                                <div className="text-sm opacity-80">/ month</div>
                                            </div>
                                        </div>
                                        {/* Decorative Circles */}
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
                                        <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white opacity-10 rounded-full"></div>
                                    </div>

                                    {/* Payment Method */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-4">Select Payment Method</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {['upi', 'card', 'netbanking'].map((method) => (
                                                <button
                                                    key={method}
                                                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                                                    className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${formData.paymentMethod === method
                                                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                                                        : 'border-gray-200 text-gray-500 hover:border-blue-200'
                                                        }`}
                                                >
                                                    <span className="text-2xl uppercase font-bold">{method}</span>
                                                    <span className="text-xs uppercase font-semibold tracking-wider text-gray-400">
                                                        {method === 'upi' ? 'Unified Payments' : method === 'card' ? 'Credit/Debit' : 'Internet Banking'}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Details (Simplified for Demo) */}
                                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                                        <h4 className="font-bold text-gray-900 mb-4">Payment Details</h4>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                                placeholder={formData.paymentMethod === 'upi' ? 'Enter UPI ID (e.g. name@upi)' : 'Card Number'}
                                            />
                                            {formData.paymentMethod === 'card' && (
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input type="text" placeholder="MM/YY" className="w-full px-5 py-3 rounded-lg border border-gray-300" />
                                                    <input type="text" placeholder="CVV" className="w-full px-5 py-3 rounded-lg border border-gray-300" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                                            <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                            Secure end-to-end encryption. No actual charge for this demo.
                                        </p>
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

            {/* Payment Processing Overlay */}
            <AnimatePresence>
                {isPaymentOverlayOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-3xl p-10 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
                        >
                            {/* Animated Background Blob */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse"></div>

                            <div className="mb-8 relative">
                                <div className="w-24 h-24 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mx-auto"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ArrowPathIcon className="w-8 h-8 text-blue-600 animate-pulse" />
                                </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Payment</h3>
                            <p className="text-gray-500 mb-8">
                                Please wait while we securely process your transaction...
                            </p>

                            <div className="space-y-4">
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 animate-progress w-2/3"></div>
                                </div>
                                <p className="text-xs text-gray-400">Do not close this window</p>
                            </div>

                            <button
                                onClick={() => setIsPaymentOverlayOpen(false)}
                                className="mt-8 text-gray-400 hover:text-gray-600 text-sm font-medium flex items-center justify-center gap-2 mx-auto hover:bg-gray-50 px-4 py-2 rounded-lg transition-colors"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Cancel & Go Back
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
