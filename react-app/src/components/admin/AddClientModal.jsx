import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { addClient } from '../../lib/supabase';
import { generateBusinessImage } from '../../utils/imageGenerator';
import { generateBusinessContent, generateDefaultStaff } from '../../utils/aiContentGenerator';

export default function AddClientModal({ isOpen, onClose }) {
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'other',
        tagline: '',
        description: '',
        logo: '🏢',
        address: '',
        phone: '',
        email: '',
        teamMembers: [''], // Just names
        socialMediaLinks: [{ platform: 'instagram', url: '' }] // Social media accounts
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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

    const handleAddTeamMember = () => {
        setFormData({
            ...formData,
            teamMembers: [...formData.teamMembers, '']
        });
    };

    const handleRemoveTeamMember = (index) => {
        setFormData({
            ...formData,
            teamMembers: formData.teamMembers.filter((_, i) => i !== index)
        });
    };

    const handleTeamMemberChange = (index, value) => {
        const newTeamMembers = [...formData.teamMembers];
        newTeamMembers[index] = value;
        setFormData({ ...formData, teamMembers: newTeamMembers });
    };

    // Social Media Handlers
    const handleAddSocialMedia = () => {
        setFormData({
            ...formData,
            socialMediaLinks: [...formData.socialMediaLinks, { platform: 'instagram', url: '' }]
        });
    };

    const handleRemoveSocialMedia = (index) => {
        setFormData({
            ...formData,
            socialMediaLinks: formData.socialMediaLinks.filter((_, i) => i !== index)
        });
    };

    const handleSocialMediaChange = (index, field, value) => {
        const newSocialMedia = [...formData.socialMediaLinks];
        newSocialMedia[index][field] = value;
        setFormData({ ...formData, socialMediaLinks: newSocialMedia });
    };

    const handleGenerateImage = async () => {
        if (!formData.businessType || !formData.description) {
            return null;
        }

        setIsGeneratingImage(true);
        try {
            const imageUrl = await generateBusinessImage(formData.businessType, formData.description);
            return imageUrl;
        } catch (error) {
            console.error('Error generating image:', error);
            return null;
        } finally {
            setIsGeneratingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Generate AI image based on business type and description
            const generatedImageUrl = await handleGenerateImage();

            // Generate AI content based on business type
            const aiContent = generateBusinessContent(formData.businessType);

            // Generate staff data from team member names
            const defaultStaff = generateDefaultStaff(formData.businessType);
            const staff = formData.teamMembers
                .filter(name => name.trim())
                .map((name, index) => ({
                    name: name.trim(),
                    role: defaultStaff[index % defaultStaff.length].role,
                    experience: defaultStaff[index % defaultStaff.length].experience,
                    specialty: defaultStaff[index % defaultStaff.length].specialty,
                    image: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`
                }));

            // Add images to services
            const servicesWithImages = aiContent.services.map(service => ({
                ...service,
                image: `https://source.unsplash.com/600x400/?${formData.businessType},${service.name.replace(/\s+/g, '-')}`
            }));

            // Generate a unique business ID from the business name
            const businessId = formData.businessName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, '');

            // Prepare client data for Supabase
            const clientData = {
                business_id: businessId,
                business_name: formData.businessName,
                tagline: formData.tagline,
                description: formData.description,
                logo: formData.logo,
                hero_image: generatedImageUrl || `https://source.unsplash.com/1600x900/?${formData.businessType},business`,
                address: formData.address,
                phone: formData.phone,
                email: formData.email,
                business_type: formData.businessType,
                services: servicesWithImages,
                staff: staff.length > 0 ? staff : defaultStaff.map(s => ({
                    ...s,
                    image: `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`
                })),
                qualities: aiContent.qualities,
                feelings: aiContent.feelings,
                search_keywords: aiContent.searchKeywords,
                gallery: [],
                subscription_plan: 'monthly',
                subscription_status: 'active',
                google_business_url: formData.googleBusinessUrl || null,
                social_media_links: formData.socialMediaLinks.filter(link => link.url.trim() !== '')
            };

            const result = await addClient(clientData);

            if (result.success) {
                alert('✅ Client added successfully with AI-generated content!');
                onClose();
                // Reload page to show new client
                window.location.reload();
            } else {
                alert('❌ Error adding client: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error adding client');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                        <div>
                            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
                                <SparklesIcon className="w-8 h-8" />
                                Add New Client
                            </h2>
                            <p className="text-white/90 mt-1">AI will generate services, qualities, and more!</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Basic Information */}
                        <div className="bg-blue-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                📋 Basic Information
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Business Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., Raj's Salon"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Business Type *</label>
                                    <select
                                        required
                                        value={formData.businessType}
                                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                    >
                                        {businessTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        <SparklesIcon className="w-3 h-3 inline" /> AI will generate services, qualities, and keywords based on this
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Logo Emoji *</label>
                                    <div className="flex flex-wrap gap-2">
                                        {logoOptions.map((emoji) => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, logo: emoji })}
                                                className={`text-3xl p-2 rounded-xl transition-all ${formData.logo === emoji
                                                    ? 'bg-blue-500 text-white scale-110 shadow-lg'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Tagline *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.tagline}
                                        onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., Where Style Meets Excellence"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold mb-2">Description *</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none"
                                        placeholder="Brief description of the business..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        <SparklesIcon className="w-3 h-3 inline" /> Used to generate AI images
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="bg-purple-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">📞 Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                                        placeholder="contact@business.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Address *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                                        placeholder="123 Main Street, City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Google Business Review URL</label>
                                    <input
                                        type="url"
                                        value={formData.googleBusinessUrl || ''}
                                        onChange={(e) => setFormData({ ...formData, googleBusinessUrl: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none"
                                        placeholder="https://g.page/r/YOUR_PLACE_ID/review"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        🔗 Paste your Google review page URL here. Customers will be redirected to this page to post reviews.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Team Members */}
                        <div className="bg-green-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">👥 Team Members (Optional)</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                <SparklesIcon className="w-4 h-4 inline" /> Just add names - AI will generate roles and details!
                            </p>
                            <div className="space-y-3">
                                {formData.teamMembers.map((member, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={member}
                                            onChange={(e) => handleTeamMemberChange(index, e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                                            placeholder={`Team member ${index + 1} name`}
                                        />
                                        {formData.teamMembers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTeamMember(index)}
                                                className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddTeamMember}
                                    className="w-full px-4 py-3 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 transition-colors font-semibold"
                                >
                                    + Add Team Member
                                </button>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="bg-orange-50 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-4">🔗 Social Media Links (Optional)</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Add your business social media accounts. These will be displayed on your business page and after reviews.
                            </p>
                            <div className="space-y-3">
                                {formData.socialMediaLinks.map((link, index) => (
                                    <div key={index} className="flex gap-2">
                                        <select
                                            value={link.platform}
                                            onChange={(e) => handleSocialMediaChange(index, 'platform', e.target.value)}
                                            className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none bg-white"
                                        >
                                            <option value="instagram">📷 Instagram</option>
                                            <option value="facebook">👥 Facebook</option>
                                            <option value="twitter">🐦 Twitter</option>
                                            <option value="linkedin">💼 LinkedIn</option>
                                            <option value="youtube">📺 YouTube</option>
                                            <option value="tiktok">🎵 TikTok</option>
                                        </select>
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => handleSocialMediaChange(index, 'url', e.target.value)}
                                            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none"
                                            placeholder={`https://${link.platform}.com/yourbusiness`}
                                        />
                                        {formData.socialMediaLinks.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSocialMedia(index)}
                                                className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleAddSocialMedia}
                                    className="w-full px-4 py-3 bg-orange-100 text-orange-700 rounded-xl hover:bg-orange-200 transition-colors font-semibold"
                                >
                                    + Add Social Media Account
                                </button>
                            </div>
                        </div>

                        {/* AI Generation Info */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200">
                            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6 text-blue-600" />
                                What AI Will Generate
                            </h3>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li>✨ <strong>Hero Image:</strong> Professional business photo based on type & description</li>
                                <li>✨ <strong>Services:</strong> 3-5 relevant services with prices, duration & descriptions</li>
                                <li>✨ <strong>Staff Details:</strong> Roles, experience & specialties for team members</li>
                                <li>✨ <strong>Quality Tags:</strong> 8 quality descriptors for reviews</li>
                                <li>✨ <strong>Feeling Tags:</strong> 8 emotional descriptors for reviews</li>
                                <li>✨ <strong>SEO Keywords:</strong> 6 search keywords for better discoverability</li>
                            </ul>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-4 bg-gray-200 text-gray-700 rounded-2xl hover:bg-gray-300 transition-colors font-semibold"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isGeneratingImage}
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>⏳ Adding Client...</>
                                ) : isGeneratingImage ? (
                                    <>🎨 Generating Image...</>
                                ) : (
                                    <>
                                        <SparklesIcon className="w-5 h-5" />
                                        Add Client with AI
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
