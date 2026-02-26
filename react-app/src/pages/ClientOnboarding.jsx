import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
import { uploadImage, addClient } from '../lib/supabase';
import { getFSRByUserId } from '../lib/fsrApi';
import { generateAIImage } from '../lib/aiImage';
import { Premium3DQRStands } from '../components/Premium3DQRStands';

export default function ClientOnboarding() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fsrParam = searchParams.get('fsr');
    const [currentStep, setCurrentStep] = useState(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [tempQuality, setTempQuality] = useState('');
    const [isPaymentOverlayOpen, setIsPaymentOverlayOpen] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [generatingStates, setGeneratingStates] = useState({});
    const [generationCounts, setGenerationCounts] = useState({});
    const [promptInputs, setPromptInputs] = useState({});
    const MAX_GENERATIONS = 2; // initial + 1 regenerate

    // --- Smart AI Gallery State ---
    const [aiPrompts, setAiPrompts] = useState(null); // { hero: string, gallery: string[] }
    const [generatingAll, setGeneratingAll] = useState(false);
    const [genProgress, setGenProgress] = useState([]); // 'idle'|'loading'|'done'|'error' per slot
    const [extraGallery, setExtraGallery] = useState([]); // user-uploaded additional photos

    /**
     * Generates 5 highly efficient, credit-light prompts tailored to the business description.
     * Prompts are kept short & specific so DALL-E resolves them quickly with minimum tokens.
     */
    const generateSmartPrompts = (description, businessName, businessType) => {
        const base = description.trim() || businessName || businessType || 'local business';
        const type = businessType || 'business';
        // Hero prompt — wide, cinematic, low token usage
        const hero = `Professional wide-angle exterior photo, ${type} called "${businessName || base}", bright natural light, clean signage, photorealistic`;
        // 4 varied gallery prompts — contextual but concise
        const gallery = [
            `Warm interior ambiance shot, ${type}, cozy lighting, customers present, photorealistic`,
            `Close-up hero product or service of ${base}, sharp focus, white background, commercial photography`,
            `Staff smiling and serving customers at ${type}, candid, professional, bright environment`,
            `Artistic overhead flat-lay of signature items from ${base}, clean minimal backdrop, studio light`
        ];
        return { hero, gallery };
    };

    // Auto-generate prompts when the user arrives on Step 3
    useEffect(() => {
        if (currentStep === 3 && !aiPrompts) {
            const prompts = generateSmartPrompts(
                formData.description,
                formData.businessName,
                formData.businessType
            );
            setAiPrompts(prompts);
            setGenProgress(['idle', 'idle', 'idle', 'idle', 'idle']); // [hero, g0, g1, g2, g3]
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentStep]);

    const handleAIGeneration = async (keyPath, idx = null) => {
        const stateKey = idx !== null ? `${keyPath}-${idx}` : keyPath;
        const currentCount = generationCounts[stateKey] || 0;

        let promptText = '';
        if (keyPath === 'services' && idx !== null) {
            promptText = formData.services[idx].name;
            if (!promptText || !promptText.trim()) {
                alert("Please enter a Service Name first. This will be used as the prompt.");
                return;
            }
            promptText = `Professional high quality photo representing the service: ${promptText}. Clean, highly detailed, photorealistic.`;
        } else {
            promptText = promptInputs[stateKey];
            if (!promptText || !promptText.trim()) {
                alert("Please accurately describe the exact image you want first.");
                return;
            }
        }

        setGeneratingStates(prev => ({ ...prev, [stateKey]: true }));

        try {
            if (keyPath === 'heroImage') {
                const heroUrl = await generateAIImage(`Professional main cover photo of: ${promptText}. Best lighting, wide angle, photorealistic.`);
                if (heroUrl) {
                    setFormData(prev => ({ ...prev, heroImage: heroUrl }));
                    setGenerationCounts(prev => ({ ...prev, [stateKey]: currentCount + 1 }));
                }
            } else if (keyPath === 'gallery') {
                const galleryPrompts = [
                    `Interior view of: ${promptText}`,
                    `Alternative perspective of: ${promptText}`,
                    `Atmosphere and ambiance of: ${promptText}`,
                    `Close up detail view of: ${promptText}`
                ];

                const galleryUrls = await Promise.all(galleryPrompts.map(p => generateAIImage(p)));
                const validGalleryUrls = galleryUrls.filter(Boolean);

                setFormData(prev => ({ ...prev, gallery: validGalleryUrls.slice(0, 4) }));
                setGenerationCounts(prev => ({ ...prev, [stateKey]: currentCount + 1 }));
                setPromptInputs(prev => ({ ...prev, [stateKey]: '' }));
            } else {
                const url = await generateAIImage(promptText);
                if (url) {
                    if (idx !== null) {
                        updateItem(keyPath, idx, 'image', url);
                    } else {
                        setFormData(prev => ({ ...prev, [keyPath]: url }));
                    }
                    setGenerationCounts(prev => ({ ...prev, [stateKey]: currentCount + 1 }));
                }
            }
        } finally {
            setGeneratingStates(prev => ({ ...prev, [stateKey]: false }));
        }
    };

    /** Generate all 5 AI images sequentially using the pre-built smart prompts */
    const handleGenerateAll = async () => {
        if (!aiPrompts) return;
        setGeneratingAll(true);
        setGenProgress(['loading', 'idle', 'idle', 'idle', 'idle']);

        const allPrompts = [aiPrompts.hero, ...aiPrompts.gallery];
        const results = [];

        for (let i = 0; i < allPrompts.length; i++) {
            setGenProgress(prev => {
                const next = [...prev];
                next[i] = 'loading';
                return next;
            });
            try {
                const url = await generateAIImage(allPrompts[i]);
                results.push(url || null);
                setGenProgress(prev => {
                    const next = [...prev];
                    next[i] = url ? 'done' : 'error';
                    if (i + 1 < allPrompts.length) next[i + 1] = 'loading';
                    return next;
                });
                // Update form data immediately as each image arrives
                if (i === 0 && url) {
                    setFormData(prev => ({ ...prev, heroImage: url }));
                } else if (i > 0 && url) {
                    setFormData(prev => ({
                        ...prev,
                        gallery: [...results.slice(1).filter(Boolean)]
                    }));
                }
            } catch {
                results.push(null);
                setGenProgress(prev => {
                    const next = [...prev];
                    next[i] = 'error';
                    if (i + 1 < allPrompts.length) next[i + 1] = 'loading';
                    return next;
                });
            }
        }
        setGeneratingAll(false);
    };

    // Comprehensive Form Data
    const [formData, setFormData] = useState({
        // FSR Info (New)
        fsrId: '',
        fsrName: '',

        // Step 1: Basic Info
        businessName: '',
        businessType: '',
        tagline: '',
        description: '',
        logo: '',
        referredBy: '',

        // Step 2: Contact & Location
        email: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        googleMapUrl: '',

        // Step 3: Visual Identity
        heroImage: '',
        gallery: [],

        // Step 4: Team & Services
        teamMembers: [],
        services: [],

        // Step 5: Brand Voice
        qualities: [],
        socialMedia: [{ platform: 'Instagram', url: '' }],
        googleReviewUrl: '',

        // Step 6: Plan & Payment
        plan: 'premium',
        paymentMethod: 'upi',
        utrNumber: '',
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

    // Fetch FSR Details if param exists
    useEffect(() => {
        const loadFSR = async () => {
            if (fsrParam) {
                const result = await getFSRByUserId(fsrParam);
                if (result.success) {
                    setFormData(prev => ({
                        ...prev,
                        fsrId: result.data.user_id,
                        fsrName: result.data.name
                    }));
                }
            }
        };
        loadFSR();
    }, [fsrParam]);

    // Validation Logic
    const validateStep = (step) => {
        switch (step) {
            case 1: // Basics
                return formData.businessName && formData.businessType && formData.email;
            case 2: // Location
                return formData.phone && formData.addressLine1 && formData.city;
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
        if (!formData.utrNumber || formData.utrNumber.trim().length < 4) {
            alert('Please enter a valid UPI Transaction / UTR Number.');
            return;
        }
        setIsProcessing(true);
        setIsPaymentOverlayOpen(true);

        try {
            const businessId = formData.businessName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const fullAddress = [formData.addressLine1, formData.city, formData.state, formData.zip].filter(Boolean).join(', ');

            const clientPayload = {
                business_id: businessId,
                business_name: formData.businessName,
                email: formData.email,
                phone: formData.phone,
                address: fullAddress,
                hero_image: formData.heroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&h=1080&fit=crop',
                logo: formData.logo || '🏢',
                tagline: formData.tagline || '',
                description: formData.description || '',
                google_business_url: formData.googleReviewUrl,
                business_type: formData.businessType,
                services: formData.services,
                staff: formData.teamMembers,
                qualities: formData.qualities,
                feelings: [],
                search_keywords: [],
                gallery: [...(formData.gallery || []), ...extraGallery],
                referral_code: businessId.substring(0, 8).toUpperCase() + Math.floor(100 + Math.random() * 900),
                referred_by: formData.referredBy || null,
                credit_points: 0,
                subscription_status: 'inactive',
                utr_number: formData.utrNumber.trim()
            };

            const result = await addClient(clientPayload);

            if (!result.success && !result.error?.includes('duplicate key')) {
                throw new Error(result.error || 'Failed to submit your application');
            }

            // Show success popup after short delay
            setTimeout(() => {
                setIsPaymentOverlayOpen(false);
                setIsProcessing(false);
                setShowSuccessPopup(true);
            }, 2500);

        } catch (error) {
            console.error('Registration error:', error);
            alert('Submission Failed: ' + error.message);
            setIsPaymentOverlayOpen(false);
            setIsProcessing(false);
        }
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

                                    {formData.fsrId && (
                                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-center gap-4 animate-pulse-once">
                                            <div className="bg-white p-3 rounded-full shadow-sm text-blue-600">
                                                <UserGroupIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-0.5">Referred By FSR</p>
                                                <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                                                    {formData.fsrName || 'FSR Agent'}
                                                    <span className="bg-blue-200 text-blue-800 text-xs px-2 py-0.5 rounded-md font-mono">{formData.fsrId}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

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
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Tagline</label>
                                                <input
                                                    type="text"
                                                    value={formData.tagline}
                                                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    placeholder="e.g. Authentic Italian Flavors"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Referral Code (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={formData.referredBy}
                                                    onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all uppercase"
                                                    placeholder="e.g. PIZ0X3A"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-1">Business Description <span className="text-blue-600">*</span></label>
                                                <p className="text-xs text-purple-600 font-semibold mb-2 flex items-center gap-1">
                                                    <SparklesIcon className="w-3.5 h-3.5" />
                                                    This powers your AI Gallery — the better you describe, the better the images!
                                                </p>
                                                <textarea
                                                    value={formData.description}
                                                    onChange={(e) => {
                                                        setFormData({ ...formData, description: e.target.value });
                                                        setAiPrompts(null);
                                                    }}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-blue-100 bg-blue-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                    rows="5"
                                                    placeholder="e.g. We are a cozy pizza corner in Mumbai, famous for wood-fired Neapolitan pizzas, hand-tossed daily using fresh ingredients. Family-friendly with a warm Italian ambiance..."
                                                ></textarea>
                                                <p className="text-xs text-gray-400 mt-1 text-right">{formData.description.length} chars — aim for 50+ for best results</p>
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
                                        <p className="text-gray-500 mt-1">AI-powered images crafted from your business description.</p>
                                    </div>

                                    {/* Info banner if no description */}
                                    {!formData.description.trim() && (
                                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                                            <SparklesIcon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm text-amber-800 font-medium">
                                                Tip: Go back to Step 1 and fill in a detailed <strong>Business Description</strong> to get better AI prompts and images!
                                            </p>
                                        </div>
                                    )}

                                    {/* ---------- HERO IMAGE SECTION ---------- */}
                                    <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl p-6 border border-indigo-800 shadow-xl">
                                        <div className="flex items-center gap-2 mb-4">
                                            <SparklesIcon className="w-5 h-5 text-indigo-300" />
                                            <h3 className="text-white font-bold text-lg">Hero Image</h3>
                                            <span className="ml-auto text-xs text-indigo-300 bg-indigo-800/60 px-2 py-0.5 rounded-full">Auto-generated prompt</span>
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-5">
                                            {/* Preview */}
                                            <div className="w-full md:w-2/5 aspect-video rounded-xl overflow-hidden relative border-2 border-indigo-700 bg-slate-800 flex items-center justify-center group">
                                                {genProgress[0] === 'loading' ? (
                                                    <div className="flex flex-col items-center gap-3">
                                                        <div className="w-10 h-10 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                                                        <p className="text-indigo-300 text-sm font-medium">Generating hero image...</p>
                                                    </div>
                                                ) : formData.heroImage ? (
                                                    <>
                                                        <img src={formData.heroImage} alt="Hero" className="w-full h-full object-cover" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <button onClick={() => setFormData(prev => ({ ...prev, heroImage: '' }))} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600">
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        {genProgress[0] === 'done' && (
                                                            <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                                <CheckCircleIcon className="w-3 h-3" /> Generated
                                                            </div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="text-center text-slate-400 p-4">
                                                        <PhotoIcon className="w-10 h-10 mx-auto mb-2 opacity-40" />
                                                        <p className="text-xs">Hero image will appear here</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Prompt card + manual upload */}
                                            <div className="flex-1 flex flex-col gap-3">
                                                {/* Read-only prompt */}
                                                <div className="bg-indigo-800/40 border border-indigo-600 rounded-xl p-3">
                                                    <p className="text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">AI Prompt (auto-crafted)</p>
                                                    <p className="text-slate-200 text-sm leading-relaxed">{aiPrompts?.hero || '...'}</p>
                                                </div>
                                                {/* Manual upload for hero */}
                                                <label className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-indigo-600 bg-indigo-800/20 hover:bg-indigo-800/40 cursor-pointer transition-colors text-indigo-300 text-sm font-semibold">
                                                    <ArrowUpTrayIcon className="w-4 h-4" /> Upload your own hero photo instead
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], (url) => { setFormData(prev => ({ ...prev, heroImage: url })); setGenProgress(prev => { const n = [...prev]; n[0] = 'done'; return n; }); })} />
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ---------- GALLERY SECTION ---------- */}
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-5">
                                        <div className="flex items-center gap-2">
                                            <PhotoIcon className="w-5 h-5 text-purple-600" />
                                            <h3 className="font-bold text-gray-900 text-lg">Gallery (4 AI Images)</h3>
                                            <span className="ml-auto text-xs text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Auto-generated prompts</span>
                                        </div>

                                        {/* 4 prompt + image cards */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {[0, 1, 2, 3].map((i) => (
                                                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                                                    {/* Image preview */}
                                                    <div className="aspect-video bg-gray-100 relative flex items-center justify-center group">
                                                        {genProgress[i + 1] === 'loading' ? (
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                                <p className="text-purple-500 text-xs font-medium">Generating...</p>
                                                            </div>
                                                        ) : formData.gallery[i] ? (
                                                            <>
                                                                <img src={formData.gallery[i]} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <button
                                                                        onClick={() => setFormData(prev => ({ ...prev, gallery: prev.gallery.filter((_, gi) => gi !== i) }))}
                                                                        className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                                                                    >
                                                                        <TrashIcon className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                                {genProgress[i + 1] === 'done' && (
                                                                    <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                                                                        <CheckCircleIcon className="w-3 h-3" /> Done
                                                                    </div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div className="text-center text-gray-300 p-3">
                                                                <PhotoIcon className="w-8 h-8 mx-auto mb-1 opacity-40" />
                                                                <p className="text-xs text-gray-400">Image {i + 1}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Prompt chip */}
                                                    <div className="p-3">
                                                        <p className="text-xs text-purple-700 font-bold uppercase tracking-wider mb-1">Prompt {i + 1}</p>
                                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{aiPrompts?.gallery?.[i] || '...'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Generate All Button */}
                                        {!generatingAll && !genProgress.every(s => s === 'done') && (
                                            <button
                                                onClick={(e) => { e.preventDefault(); handleGenerateAll(); }}
                                                disabled={generatingAll}
                                                className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-3 text-base disabled:opacity-60"
                                            >
                                                <SparklesIcon className="w-5 h-5" />
                                                Generate All 5 AI Images (1 Hero + 4 Gallery)
                                            </button>
                                        )}
                                        {generatingAll && (
                                            <div className="w-full py-4 bg-gradient-to-r from-purple-600/80 to-indigo-600/80 text-white font-bold rounded-2xl flex items-center justify-center gap-3 text-base">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Generating images... ({genProgress.filter(s => s === 'done').length}/5 done)
                                            </div>
                                        )}
                                        {!generatingAll && genProgress.every(s => s === 'done') && (
                                            <div className="w-full py-3 bg-green-50 border border-green-200 text-green-700 font-bold rounded-2xl flex items-center justify-center gap-2 text-sm">
                                                <CheckCircleIcon className="w-5 h-5" /> All 5 images generated successfully!
                                            </div>
                                        )}
                                    </div>

                                    {/* ---------- EXTRA UPLOAD SECTION ---------- */}
                                    <div className="bg-white rounded-2xl p-5 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold text-gray-900">Add More Photos</h3>
                                                <p className="text-xs text-gray-500 mt-0.5">Upload additional photos beyond the 5 AI-generated images</p>
                                            </div>
                                            <label className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl cursor-pointer font-bold text-sm transition-colors">
                                                <PlusIcon className="w-4 h-4" /> Add Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        Array.from(e.target.files).forEach(file => {
                                                            handleFileUpload(file, (url) => {
                                                                setExtraGallery(prev => [...prev, url]);
                                                            });
                                                        });
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {extraGallery.length > 0 ? (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                                {extraGallery.map((img, idx) => (
                                                    <div key={idx} className="relative group aspect-square">
                                                        <img src={img} alt={`Extra ${idx}`} className="w-full h-full object-cover rounded-xl border border-gray-200" />
                                                        <button
                                                            onClick={() => setExtraGallery(prev => prev.filter((_, i) => i !== idx))}
                                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <TrashIcon className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400">
                                                <PhotoIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                                <p className="text-sm">No extra photos yet. Click "Add Photo" to upload.</p>
                                            </div>
                                        )}
                                        {extraGallery.length > 0 && (
                                            <p className="text-xs text-gray-400 mt-2 text-right">{extraGallery.length} extra photo{extraGallery.length !== 1 ? 's' : ''} added</p>
                                        )}
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
                                                    <div className="p-4 md:p-5 space-y-4">

                                                        {/* Row 1: Service Name + Delete */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 space-y-1">
                                                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Name</label>
                                                                <input
                                                                    type="text"
                                                                    placeholder="e.g. Haircut, Pizza, Consultation"
                                                                    value={service.name}
                                                                    onChange={(e) => updateItem('services', index, 'name', e.target.value)}
                                                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:outline-none font-medium"
                                                                />
                                                            </div>
                                                            <button onClick={() => removeItem('services', index)} className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 mt-5">
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>

                                                        {/* Row 2: Photo Box */}
                                                        <div className="space-y-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Service Photo</label>
                                                            <div className="relative h-44 bg-gray-200 rounded-xl overflow-hidden group border border-gray-200">
                                                                {generatingStates[`services-${index}`] ? (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gray-100">
                                                                        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                                                                        <p className="text-purple-600 text-xs font-semibold">Generating AI photo...</p>
                                                                    </div>
                                                                ) : service.image ? (
                                                                    <>
                                                                        <img
                                                                            key={service.image}
                                                                            src={service.image}
                                                                            alt={service.name}
                                                                            className="w-full h-full object-cover"
                                                                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/800x600/f3f4f6/9ca3af?text=Image+Failed'; }}
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                                            <label className="cursor-pointer bg-white text-gray-900 px-3 py-2 rounded-lg text-xs font-bold hover:bg-gray-100 flex items-center gap-2 shadow">
                                                                                <ArrowUpTrayIcon className="w-4 h-4" /> Upload New
                                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateItem('services', index, 'image', url))} />
                                                                            </label>
                                                                            <button
                                                                                onClick={(e) => { e.preventDefault(); handleAIGeneration('services', index); }}
                                                                                disabled={generatingStates[`services-${index}`]}
                                                                                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 disabled:opacity-50 shadow"
                                                                            >
                                                                                <SparklesIcon className="w-3.5 h-3.5" /> Regenerate AI
                                                                            </button>
                                                                            <button onClick={() => updateItem('services', index, 'image', '')} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow">
                                                                                <TrashIcon className="w-4 h-4" />
                                                                            </button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400 p-4">
                                                                        <PhotoIcon className="w-10 h-10 opacity-30" />
                                                                        <div className="flex gap-3">
                                                                            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors">
                                                                                <ArrowUpTrayIcon className="w-3.5 h-3.5" /> Upload Photo
                                                                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e.target.files[0], (url) => updateItem('services', index, 'image', url))} />
                                                                            </label>
                                                                            <button
                                                                                onClick={(e) => { e.preventDefault(); handleAIGeneration('services', index); }}
                                                                                disabled={generatingStates[`services-${index}`] || !service.name.trim()}
                                                                                title={!service.name.trim() ? 'Enter a service name first' : 'Generate with AI'}
                                                                                className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 transition-all"
                                                                            >
                                                                                <SparklesIcon className="w-3.5 h-3.5" /> Generate AI
                                                                            </button>
                                                                        </div>
                                                                        {!service.name.trim() && <p className="text-xs text-amber-500">Enter service name above to enable AI generation</p>}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Row 3: Price + Description */}
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

                                                        {/* Team Photo - Upload Only */}
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
                                                            {/* Upload trigger only */}
                                                            <label className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white p-1.5 rounded-full cursor-pointer shadow-md transition-colors" title="Upload photo">
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

                                        {/* Google Review Link */}
                                        <div>
                                            <div className="mb-4">
                                                <label className="text-lg font-bold text-gray-900">Google Review Link</label>
                                                <p className="text-gray-500 text-sm mt-1">This link opens the "Write a Review" dialog directly on Google. It powers the "Post on Google" button.</p>
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.googleReviewUrl}
                                                onChange={(e) => setFormData({ ...formData, googleReviewUrl: e.target.value })}
                                                className="w-full px-5 py-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all"
                                                placeholder="https://g.page/r/.../review"
                                            />
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
                                        <label className="block text-sm font-bold text-gray-700 mb-4">Complete Payment</label>

                                        <div className="bg-white rounded-2xl border-2 border-blue-100 p-8 flex flex-col items-center text-center shadow-lg relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"></div>

                                            <div className="mb-6">
                                                <h3 className="text-2xl font-bold text-gray-900 mb-1">Scan & Pay ₹999</h3>
                                                <p className="text-gray-500 text-sm">Use any UPI app to complete the transaction</p>
                                            </div>

                                            <div className="p-4 bg-white rounded-xl border-2 border-gray-100 shadow-inner mb-6 relative group">
                                                <img
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent("upi://pay?pa=7878002359@ptsbi&pn=Amaan Tanveer&am=999.00&cu=INR")}`}
                                                    alt="Payment QR Code"
                                                    className="w-48 h-48 md:w-56 md:h-56 object-contain mix-blend-multiply"
                                                />
                                                <p className="mt-2 text-xs text-gray-400 font-mono">7878002359@ptsbi</p>
                                            </div>

                                            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300 mb-8">
                                                <span className="font-bold text-blue-800 italic">Paytm</span>
                                                <span className="font-bold text-green-600 italic">PhonePe</span>
                                                <span className="font-bold text-orange-500 italic">GPay</span>
                                                <span className="font-bold text-gray-800 italic">BHIM</span>
                                            </div>

                                            {/* UTR Number Input */}
                                            <div className="w-full max-w-md text-left">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">UPI Transaction / UTR Number <span className="text-red-500">*</span></label>
                                                <input
                                                    type="text"
                                                    value={formData.utrNumber}
                                                    onChange={(e) => setFormData({ ...formData, utrNumber: e.target.value })}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-gray-200 bg-gray-50 focus:border-blue-500 focus:bg-white focus:outline-none transition-all font-mono text-lg tracking-wider"
                                                    placeholder="e.g. 421234567890"
                                                />
                                                <p className="text-xs text-gray-400 mt-2">Enter the reference number shown in your UPI app after payment</p>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step 7 is removed - success is shown via popup */}
                        </AnimatePresence>

                        {/* Navigation Footer */}
                        {currentStep <= 6 && (
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
                                        disabled={isProcessing || !formData.utrNumber}
                                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2 shadow-xl hover:shadow-2xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-wait"
                                    >
                                        {isProcessing ? 'Submitting...' : "I've Paid — Submit Application"}
                                        {!isProcessing && <CheckCircleIcon className="w-6 h-6" />}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>

                {
                    currentStep <= 6 && (
                        <div className="text-center mt-8">
                            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 font-medium transition-colors">
                                Cancel Setup
                            </button>
                        </div>
                    )
                }
            </div >

            {/* Payment Processing Overlay (Buffering) */}
            < AnimatePresence >
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
                )
                }
            </AnimatePresence >

            {/* Account In Process Success Popup */}
            < AnimatePresence >
                {showSuccessPopup && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white rounded-3xl p-10 max-w-md w-full text-center relative overflow-hidden shadow-2xl"
                        >
                            {/* Celebratory top bar */}
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>

                            <div className="w-24 h-24 bg-amber-50 border-4 border-amber-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <SparklesIcon className="w-12 h-12 text-amber-500" />
                            </div>

                            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">Application Received!</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Your payment is being verified. Once confirmed, your <strong>Login ID & Password</strong> will be sent to:
                            </p>

                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                                <p className="text-blue-800 font-bold text-lg">{formData.email}</p>
                                <p className="text-blue-600 text-sm mt-1">Please check your inbox (and spam) within 24 hours.</p>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><CheckCircleIcon className="w-5 h-5 text-green-600" /></div>
                                    <span className="text-gray-700 text-sm">Business details submitted</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><CheckCircleIcon className="w-5 h-5 text-green-600" /></div>
                                    <span className="text-gray-700 text-sm">Payment reference received</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0"><SparklesIcon className="w-5 h-5 text-amber-500 animate-pulse" /></div>
                                    <span className="text-gray-700 text-sm font-semibold">Verification in progress...</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/')}
                                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg hover:bg-black transition-colors shadow-lg"
                            >
                                Back to Home
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence >
        </div >
    );
}
