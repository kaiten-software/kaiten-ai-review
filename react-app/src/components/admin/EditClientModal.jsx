import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { updateClient } from '../../lib/supabase';

export default function EditClientModal({ isOpen, onClose, client, onUpdate }) {
    const [formData, setFormData] = useState({
        businessName: '',
        tagline: '',
        description: '',
        logo: '🏢',
        address: '',
        phone: '',
        email: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const logoOptions = ['🏢', '💇', '🍕', '🔧', '💪', '🏥', '🎨', '📱', '🍔', '☕', '🏨', '🚗', '📚', '🎵', '🌸'];

    useEffect(() => {
        if (client) {
            setFormData({
                businessName: client.business_name || client.name || '',
                tagline: client.tagline || '',
                description: client.description || '',
                logo: client.logo || '🏢',
                address: client.address || '',
                phone: client.phone || '',
                email: client.email || ''
            });
        }
    }, [client]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const businessId = client.business_id || client.id;

            // Prepare update data
            const updateData = {
                business_name: formData.businessName,
                tagline: formData.tagline,
                description: formData.description,
                logo: formData.logo,
                address: formData.address,
                phone: formData.phone,
                email: formData.email
            };

            const result = await updateClient(businessId, updateData);

            if (result.success) {
                alert('✅ Client updated successfully!');
                onUpdate(); // Callback to refresh the list
                onClose();
            } else {
                alert('❌ Error updating client: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Error updating client');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen || !client) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                        <h2 className="text-3xl font-bold">Edit Client</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">📋 Basic Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Business Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.businessName}
                                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    />
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
                                                        ? 'bg-primary text-white scale-110'
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
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Description *</label>
                                    <textarea
                                        required
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none resize-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">📞 Contact Information</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Phone *</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Email *</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2">Address *</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex gap-4 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 btn bg-gray-200 text-gray-700 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 btn btn-primary disabled:opacity-50"
                            >
                                {isSubmitting ? 'Updating...' : '✅ Update Client'}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
