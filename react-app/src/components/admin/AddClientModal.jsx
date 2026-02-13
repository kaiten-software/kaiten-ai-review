import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon, PlusIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { addClient, updateClient, uploadImage } from '../../lib/supabase';
import { generateBusinessImage } from '../../utils/imageGenerator';
import { generateBusinessContent, generateDefaultStaff } from '../../utils/aiContentGenerator';
import { countries, indianStates, majorCities } from '../../data/locations';

export default function AddClientModal({ isOpen, onClose, client = null }) {
    const isEditing = !!client;

    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'other',
        tagline: '',
        description: '',
        logo: '🏢',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        email: '',
        heroImage: '',
        googleBusinessUrl: '',
        gallery: [],
        teamMembers: [{ name: '', role: '' }],
        socialMediaLinks: [{ platform: 'instagram', url: '' }],
        services: [{ name: '', price: '', image: '', description: '' }],
        qualities: [],
        feelings: []
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [newQuality, setNewQuality] = useState('');

    const logoOptions = ['🏢', '💇', '🍕', '🔧', '💪', '🏥', '🎨', '📱', '🍔', '☕', '🏨', '🚗', '📚', '🎵', '🌸', '🧘', '🍰', '📸', '💼', '🏪'];
    const businessTypes = [
        { value: 'salon', label: '💇 Salon' },
        { value: 'spa', label: '🧖 Spa' },
        { value: 'restaurant', label: '🍽️ Restaurant' },
        { value: 'cafe', label: '☕ Cafe' },
        { value: 'gym', label: '💪 Gym/Fitness' },
        { value: 'clinic', label: '🏥 Clinic' },
        { value: 'dental', label: '🦷 Dental' },
        { value: 'auto', label: '🚗 Auto Service' },
        { value: 'retail', label: '🏪 Retail Store' },
        { value: 'hotel', label: '🏨 Hotel' },
        { value: 'bakery', label: '🍰 Bakery' },
        { value: 'photography', label: '📸 Photography' },
        { value: 'consulting', label: '💼 Consulting' },
        { value: 'education', label: '📚 Education' },
        { value: 'other', label: '🏢 Other' }
    ];

    const currencyOptions = [
        { value: '₹', label: '₹ INR' },
        { value: '$', label: '$ USD' },
        { value: '€', label: '€ EUR' },
        { value: '£', label: '£ GBP' },
        { value: '¥', label: '¥ JPY' },
        { value: 'A$', label: 'A$ AUD' },
        { value: 'C$', label: 'C$ CAD' },
        { value: 'AED', label: 'AED' }
    ];

    useEffect(() => {
        if (isOpen) {
            if (client) {
                // Parse Address
                const addressParts = (client.address || '').split(',').map(s => s.trim());
                const country = addressParts.pop() || '';
                const zip = addressParts.pop() || '';
                const state = addressParts.pop() || '';
                const city = addressParts.pop() || '';
                const addressLine1 = addressParts.join(', ');

                setFormData({
                    businessName: client.business_name || client.name || '',
                    businessType: client.business_type || 'other',
                    tagline: client.tagline || '',
                    description: client.description || '',
                    logo: client.logo || '🏢',
                    addressLine1: addressLine1,
                    addressLine2: '',
                    city: city,
                    state: state,
                    zip: zip,
                    country: country,
                    phone: client.phone || '',
                    email: client.email || '',
                    heroImage: client.hero_image || (client.hero?.main) || '',
                    googleBusinessUrl: client.google_business_url || '',
                    gallery: client.gallery || [],
                    teamMembers: client.staff && client.staff.length > 0 ? client.staff : [{ name: '', role: '' }],
                    socialMediaLinks: client.social_media_links && client.social_media_links.length > 0 ? client.social_media_links : [{ platform: 'instagram', url: '' }],
                    services: client.services && client.services.length > 0 ? client.services.map(s => {
                        let currency = '₹';
                        let price = s.price;
                        if (s.price) {
                            const match = s.price.toString().match(/^([^\d\s]+)\s*(.*)$/);
                            if (match && match[2]) {
                                currency = match[1];
                                price = match[2];
                            }
                        }
                        return { ...s, currency: currency || '₹', price: price || '' };
                    }) : [{ name: '', price: '', currency: '₹', image: '', description: '' }],
                    qualities: client.qualities || [],
                    feelings: client.feelings || []
                });
            } else {
                // Reset form for Add Client mode
                setFormData({
                    businessName: '',
                    businessType: 'other',
                    tagline: '',
                    description: '',
                    logo: '🏢',
                    addressLine1: '',
                    addressLine2: '',
                    city: '',
                    state: '',
                    zip: '',
                    country: '',
                    phone: '',
                    email: '',
                    heroImage: '',
                    googleBusinessUrl: '',
                    gallery: [],
                    teamMembers: [{ name: '', role: '' }],
                    socialMediaLinks: [{ platform: 'instagram', url: '' }],
                    services: [{ name: '', price: '', currency: '₹', image: '', description: '' }],
                    qualities: [],
                    feelings: []
                });
                setNewQuality('');
                setIsSubmitting(false);
                setIsGenerating(false);
            }
        }
    }, [client, isOpen]);

    // --- Detail Handlers ---

    const handleTeamChange = (index, field, value) => {
        const newTeam = [...formData.teamMembers];
        newTeam[index] = { ...newTeam[index], [field]: value };
        setFormData({ ...formData, teamMembers: newTeam });
    };

    const addTeamMember = () => setFormData({ ...formData, teamMembers: [...formData.teamMembers, { name: '', role: '' }] });
    const removeTeamMember = (index) => setFormData({ ...formData, teamMembers: formData.teamMembers.filter((_, i) => i !== index) });

    const handleServiceChange = (index, field, value) => {
        const newServices = [...formData.services];
        newServices[index] = { ...newServices[index], [field]: value };
        setFormData({ ...formData, services: newServices });
    };

    const addService = () => setFormData({ ...formData, services: [...formData.services, { name: '', price: '', currency: '₹', image: '', description: '' }] });
    const removeService = (index) => setFormData({ ...formData, services: formData.services.filter((_, i) => i !== index) });

    const handleSocialChange = (index, field, value) => {
        const newSocial = [...formData.socialMediaLinks];
        newSocial[index] = { ...newSocial[index], [field]: value };
        setFormData({ ...formData, socialMediaLinks: newSocial });
    };

    const addSocial = () => setFormData({ ...formData, socialMediaLinks: [...formData.socialMediaLinks, { platform: 'instagram', url: '' }] });
    const removeSocial = (index) => setFormData({ ...formData, socialMediaLinks: formData.socialMediaLinks.filter((_, i) => i !== index) });

    // Gallery Handlers
    const handleGalleryChange = (index, field, value) => {
        const newGallery = [...formData.gallery];
        // If items are objects {url: ...}, update property. If strings, update directly? 
        // Let's stick to objects: { url: '...' } internally for consistency.
        if (typeof newGallery[index] === 'string') {
            newGallery[index] = { url: value };
        } else {
            newGallery[index] = { ...newGallery[index], [field]: value };
        }
        setFormData({ ...formData, gallery: newGallery });
    };

    const addGalleryImage = () => setFormData({ ...formData, gallery: [...formData.gallery, { url: '' }] });
    const removeGalleryImage = (index) => setFormData({ ...formData, gallery: formData.gallery.filter((_, i) => i !== index) });

    const addQuality = (e) => {
        if (e) e.preventDefault();
        if (newQuality.trim()) {
            if (!formData.qualities.includes(newQuality.trim())) {
                setFormData({ ...formData, qualities: [...formData.qualities, newQuality.trim()] });
            }
            setNewQuality('');
        }
    };

    const removeQuality = (tag) => {
        setFormData({ ...formData, qualities: formData.qualities.filter(t => t !== tag) });
    };

    const handleFileUpload = async (file, onUpload) => {
        if (!file) return;
        setIsGenerating(true); // Reuse loading state
        try {
            const { success, url, error } = await uploadImage(file);
            if (success) {
                onUpload(url);
            } else {
                alert('❌ Upload failed: ' + error);
            }
        } catch (err) {
            console.error(err);
            alert('❌ Upload error');
        } finally {
            setIsGenerating(false);
        }
    };

    // --- URL Helper ---
    const processImageUrl = (url) => {
        if (!url) return '';

        // Google Drive: Convert /file/d/.../view to export=view
        const driveMatch = url.match(/drive\.google\.com\/file\/d\/([-a-zA-Z0-9_]+)\/view/);
        if (driveMatch) {
            return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
        }

        // Dropbox: Convert dl=0 to raw=1
        if (url.includes('dropbox.com') && url.includes('dl=0')) {
            return url.replace('dl=0', 'raw=1');
        }

        return url;
    };

    const getUrlWarning = (url) => {
        if (!url) return null;
        if (url.includes('share.google') || url.includes('photos.app.goo.gl')) {
            return "⚠️ This appears to be a sharing link. Please upload the file directly for best results.";
        }
        return null;
    };

    // --- AI Autofill ---
    const handleAiAutofill = async () => {
        if (!formData.businessType || !formData.description) {
            alert("Please select a Business Type and enter a Description first.");
            return;
        }

        setIsGenerating(true);
        try {
            // 1. Generate Business Content
            const aiContent = generateBusinessContent(formData.businessType);
            const defaultStaff = generateDefaultStaff(formData.businessType);

            // 2. Generate Image (if missing)
            let heroImage = formData.heroImage;
            if (!heroImage) {
                heroImage = await generateBusinessImage(formData.businessType, formData.description);
            }
            if (!heroImage) {
                heroImage = `https://source.unsplash.com/1600x900/?${formData.businessType},business`;
            }

            // 3. Update State with AI suggestions (preserving existing non-empty values if you prefer, or overwrite)
            // Here we overwrite empty fields or append.

            const newServices = aiContent.services.map(s => ({
                name: s.name,
                price: s.price,
                duration: s.duration,
                description: s.description,
                image: `https://source.unsplash.com/600x400/?${formData.businessType},${s.name.replace(/\s+/g, '-')}`
            }));

            const newStaff = defaultStaff.map(s => ({
                name: '', // Leave name empty for user to fill, or filler? Let's leave empty so user inputs real names or use AI names if we had them.
                role: s.role,
                image: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`
            }));

            setFormData(prev => ({
                ...prev,
                tagline: prev.tagline || 'Experience Excellence',
                heroImage: heroImage,
                services: prev.services[0]?.name ? prev.services : newServices, // Only autofill if empty
                qualities: prev.qualities.length > 0 ? prev.qualities : aiContent.qualities,
                feelings: prev.feelings.length > 0 ? prev.feelings : aiContent.feelings,
                staff: prev.teamMembers[0]?.name ? prev.teamMembers : newStaff // This might be tricky if structure differs
            }));

            // Allow manual "Staff" Autofill:
            if (formData.teamMembers[0]?.name === '') {
                setFormData(prev => ({
                    ...prev,
                    teamMembers: newStaff.map((s, i) => ({ ...s, name: `Staff ${i + 1}` })) // Placeholder names
                }));
            }

        } catch (error) {
            console.error("AI Error", error);
        } finally {
            setIsGenerating(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const businessId = isEditing ? (client.business_id || client.id) : formData.businessName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            const fullAddress = [
                formData.addressLine1,
                formData.addressLine2,
                formData.city,
                formData.state,
                formData.zip,
                formData.country
            ].filter(part => part && part.trim() !== '').join(', ');

            const clientData = {
                business_id: businessId,
                business_name: formData.businessName,
                tagline: formData.tagline,
                description: formData.description,
                logo: formData.logo,
                hero_image: formData.heroImage,
                address: fullAddress,
                phone: formData.phone,
                email: formData.email,
                business_type: formData.businessType,
                services: formData.services.filter(s => s.name).map(s => ({
                    ...s,
                    price: `${s.currency || '₹'} ${s.price}`.trim()
                })),
                staff: formData.teamMembers.filter(t => t.name),
                qualities: formData.qualities,
                feelings: formData.feelings,
                google_business_url: formData.googleBusinessUrl || null,
                social_media_links: formData.socialMediaLinks.filter(link => link.url.trim() !== ''),
                gallery: formData.gallery.filter(g => {
                    if (typeof g === 'string') return g.trim() !== '';
                    return g.url && g.url.trim() !== '';
                }),
                subscription_plan: 'monthly',
                subscription_status: 'active'
            };

            let result;
            if (isEditing) {
                result = await updateClient(businessId, clientData);
                // If update returned no data (static business not yet in DB), try adding it
                if (result.success && (!result.data || result.data.length === 0)) {
                    console.log("Static business not in DB, creating detailed record...");
                    result = await addClient(clientData);
                }
            } else {
                result = await addClient(clientData);
            }

            if (result.success) {
                alert(isEditing ? '✅ Client updated successfully!' : '✅ Client added successfully!');
                onClose();
                window.location.reload();
            } else {
                alert('❌ Error: ' + result.error);
            }

        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error processing request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between shadow-md">
                        <div>
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {isEditing ? <PencilIcon className="w-6 h-6" /> : <PlusIcon className="w-6 h-6" />}
                                {isEditing ? 'Edit Client' : 'Add New Client'}
                            </h2>
                            <p className="text-white/80 text-sm mt-1">
                                {isEditing ? 'Update business details, services, and team' : 'Enter details manually or use AI autofill'}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors text-white">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">

                        {/* 1. Basic Info */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    🏢 Basic Information
                                </h3>
                                {!isEditing && (
                                    <button
                                        type="button"
                                        onClick={handleAiAutofill}
                                        disabled={isGenerating}
                                        className="text-sm bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-200 flex items-center gap-2 transition-colors"
                                    >
                                        <SparklesIcon className="w-4 h-4" />
                                        {isGenerating ? 'Generating...' : 'Autofill with AI'}
                                    </button>
                                )}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Business Name</label>
                                    <input required type="text" value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="e.g. Raj's Salon" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Type</label>
                                    <select required value={formData.businessType} onChange={e => setFormData({ ...formData, businessType: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl">
                                        {businessTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Tagline</label>
                                    <input type="text" value={formData.tagline} onChange={e => setFormData({ ...formData, tagline: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="Catchy slogan" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Logo Emoji</label>
                                    <select value={formData.logo} onChange={e => setFormData({ ...formData, logo: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl">
                                        {logoOptions.map(l => <option key={l} value={l}>{l}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Description</label>
                                    <textarea required rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="Brief description..." />
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* 2. Location & Contact */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">📍 Location & Contact</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <input type="text" value={formData.addressLine1} onChange={e => setFormData({ ...formData, addressLine1: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="Address Line 1" />
                                <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="City" />
                                <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="Phone" />
                                <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="Email" />
                                <div className="md:col-span-2 space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Google Review URL</label>
                                    <input type="url" value={formData.googleBusinessUrl} onChange={e => setFormData({ ...formData, googleBusinessUrl: e.target.value })} className="input-field w-full px-4 py-2 border rounded-xl" placeholder="https://g.page/r/..." />
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Social Media */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">🌐 Social Media</h3>
                            <div className="space-y-3">
                                {formData.socialMediaLinks.map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <select
                                            value={link.platform}
                                            onChange={e => handleSocialChange(index, 'platform', e.target.value)}
                                            className="w-1/3 px-4 py-2 border rounded-xl bg-gray-50"
                                        >
                                            <option value="instagram">Instagram</option>
                                            <option value="facebook">Facebook</option>
                                            <option value="twitter">X (Twitter)</option>
                                            <option value="linkedin">LinkedIn</option>
                                            <option value="website">Website</option>
                                        </select>
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={e => handleSocialChange(index, 'url', e.target.value)}
                                            placeholder="Profile URL"
                                            className="flex-1 px-4 py-2 border rounded-xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeSocial(index)}
                                            className="text-red-500 hover:bg-red-50 px-3 rounded-xl"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addSocial}
                                    className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1"
                                >
                                    <PlusIcon className="w-4 h-4" /> Add Social Link
                                </button>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* 3. Hero Image */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <PhotoIcon className="w-5 h-5" /> Hero Image
                            </h3>
                            <div className="space-y-2">
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="url"
                                        value={formData.heroImage}
                                        onChange={e => {
                                            const processedUrl = processImageUrl(e.target.value);
                                            setFormData({ ...formData, heroImage: processedUrl });
                                        }}
                                        className="input-field w-full px-4 py-2 border rounded-xl"
                                        placeholder="https://images.unsplash.com/photo-..."
                                    />
                                    {getUrlWarning(formData.heroImage) && (
                                        <p className="text-xs text-amber-600 font-medium px-2">{getUrlWarning(formData.heroImage)}</p>
                                    )}
                                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                                        <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Or Upload:</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                            onChange={(e) => handleFileUpload(e.target.files[0], (url) => setFormData(prev => ({ ...prev, heroImage: url })))}
                                        />
                                    </div>
                                </div>
                                {formData.heroImage && (
                                    <div className="relative h-48 w-full rounded-xl overflow-hidden bg-gray-100 mt-2 border border-gray-200">
                                        <img
                                            src={formData.heroImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Invalid+Image+URL';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* Gallery Images */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                <PhotoIcon className="w-5 h-5" /> Gallery Images
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                {formData.gallery.map((image, index) => (
                                    <div key={index} className="relative group p-3 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="mb-2 flex justify-between items-center">
                                            <span className="text-xs font-medium text-gray-400">Image #{index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="text-red-500 hover:bg-white p-1.5 rounded-md hover:shadow-sm transition-all"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="space-y-2">
                                            <input
                                                type="url"
                                                value={typeof image === 'string' ? image : image.url || ''}
                                                onChange={e => {
                                                    const processed = processImageUrl(e.target.value);
                                                    handleGalleryChange(index, 'url', processed);
                                                }}
                                                className="input-field w-full px-3 py-2 border rounded-xl text-sm"
                                                placeholder="Image URL"
                                            />
                                            {getUrlWarning(typeof image === 'string' ? image : image.url) && (
                                                <p className="text-xs text-amber-600 font-medium px-2">{getUrlWarning(typeof image === 'string' ? image : image.url)}</p>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                onChange={(e) => handleFileUpload(e.target.files[0], (url) => handleGalleryChange(index, 'url', url))}
                                            />
                                        </div>

                                        {(image.url || image) && (
                                            <div className="mt-2 h-32 rounded-lg overflow-hidden bg-gray-200 border border-gray-100">
                                                <img
                                                    src={image.url || image}
                                                    alt={`Gallery ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Invalid+Image+URL';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addGalleryImage}
                                    className="h-full min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 font-medium"
                                >
                                    <PlusIcon className="w-8 h-8 opacity-50" />
                                    <span>Add Another Photo</span>
                                </button>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* 4. Services */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                🛠️ Services
                            </h3>
                            <div className="space-y-4">
                                {formData.services.map((service, index) => (
                                    <div key={index} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 transition-all hover:shadow-md">
                                        <div className="flex justify-between items-center mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="bg-white text-gray-500 text-xs font-bold px-2 py-1 rounded border border-gray-200">#{index + 1}</span>
                                                <h4 className="text-sm font-semibold text-gray-700">Service Details</h4>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeService(index)}
                                                className="text-red-500 hover:bg-white hover:text-red-600 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100 hover:shadow-sm"
                                                title="Remove Service"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-3 mb-3">
                                            <input
                                                type="text"
                                                value={service.name}
                                                onChange={e => handleServiceChange(index, 'name', e.target.value)}
                                                placeholder="Service Name"
                                                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none w-full"
                                            />
                                            <div className="flex gap-2">
                                                <select
                                                    value={service.currency || '₹'}
                                                    onChange={e => handleServiceChange(index, 'currency', e.target.value)}
                                                    className="w-24 px-2 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:border-blue-500 outline-none cursor-pointer"
                                                >
                                                    {currencyOptions.map(opt => (
                                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="text"
                                                    value={service.price}
                                                    onChange={e => handleServiceChange(index, 'price', e.target.value)}
                                                    placeholder="Amount"
                                                    className="flex-1 px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <input
                                                type="url"
                                                value={service.image}
                                                onChange={e => {
                                                    const processed = processImageUrl(e.target.value);
                                                    handleServiceChange(index, 'image', processed);
                                                }}
                                                placeholder="Image URL (https://...)"
                                                className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none w-full text-sm"
                                            />
                                            {getUrlWarning(service.image) && (
                                                <p className="text-xs text-amber-600 font-medium px-2">{getUrlWarning(service.image)}</p>
                                            )}
                                            <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-xl border border-gray-200">
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Upload Image:</span>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                                                    onChange={(e) => handleFileUpload(e.target.files[0], (url) => handleServiceChange(index, 'image', url))}
                                                />
                                            </div>
                                            {service.image && (
                                                <div className="mt-2 h-24 w-full rounded-lg overflow-hidden bg-white border border-gray-200">
                                                    <img
                                                        src={service.image}
                                                        alt="Service Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://placehold.co/600x400/f3f4f6/9ca3af?text=Invalid+Image+URL';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button type="button" onClick={addService} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-medium bg-gray-50 hover:bg-blue-50">
                                    <PlusIcon className="w-5 h-5" /> Add New Service
                                </button>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* 5. Qualities */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">✨ Quality of Work (Tags)</h3>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {formData.qualities.map((tag, i) => (
                                        <span key={i} className="bg-white border border-gray-200 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 text-gray-700">
                                            {tag}
                                            <button type="button" onClick={() => removeQuality(tag)} className="text-red-400 hover:text-red-600">×</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newQuality}
                                        onChange={e => setNewQuality(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addQuality(e)}
                                        placeholder="Type a quality..."
                                        className="flex-1 px-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={addQuality}
                                        disabled={!newQuality.trim()}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        <PlusIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </section>

                        <hr className="border-gray-100" />

                        {/* 6. Team */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">👥 Team Members</h3>
                            <div className="space-y-2">
                                {formData.teamMembers.map((member, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs font-bold text-gray-400 uppercase">Member #{index + 1}</span>
                                            <button type="button" onClick={() => removeTeamMember(index)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg"><TrashIcon className="w-5 h-5" /></button>
                                        </div>
                                        <div className="flex gap-2 mb-3">
                                            <input type="text" value={member.name} onChange={e => handleTeamChange(index, 'name', e.target.value)} placeholder="Name" className="flex-1 px-4 py-2 border rounded-xl" />
                                            <input type="text" value={member.role} onChange={e => handleTeamChange(index, 'role', e.target.value)} placeholder="Role" className="flex-1 px-4 py-2 border rounded-xl" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-500">Profile Photo</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="url"
                                                    value={member.image || ''}
                                                    onChange={e => {
                                                        const processed = processImageUrl(e.target.value);
                                                        handleTeamChange(index, 'image', processed);
                                                    }}
                                                    placeholder="Image URL"
                                                    className="flex-1 px-3 py-2 border rounded-xl text-sm"
                                                />
                                                <div className="relative">
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                        onChange={(e) => handleFileUpload(e.target.files[0], (url) => handleTeamChange(index, 'image', url))}
                                                    />
                                                    <button type="button" className="px-3 py-2 bg-white border border-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 text-gray-700">
                                                        Upload
                                                    </button>
                                                </div>
                                            </div>
                                            {member.image && (
                                                <div className="mt-2 h-16 w-16 rounded-full overflow-hidden border border-gray-200">
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = 'https://placehold.co/100x100/f3f4f6/9ca3af?text=User';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addTeamMember}
                                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2 font-medium bg-gray-50 hover:bg-blue-50"
                                >
                                    <PlusIcon className="w-5 h-5" /> Add New Member
                                </button>
                            </div>
                        </section>

                        {/* Footer Actions */}
                        <div className="flex gap-4 pt-4">
                            <button type="button" onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200">Cancel</button>
                            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50">
                                {isSubmitting ? 'Saving...' : (isEditing ? 'Update Client' : 'Add Client')}
                            </button>
                        </div>

                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );

    function PencilIcon(props) { return <svg {...props} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" /></svg> }
}
