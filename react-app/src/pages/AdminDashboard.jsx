import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBusinesses } from '../data/businesses';
import { getAllClients, updateClient, deleteClient } from '../lib/supabase';
import Logo from '../components/common/Logo';
import AboutUs from './AboutUs';
import Referrals from './Referrals';
import AddClientModal from '../components/admin/AddClientModal';
import EditClientModal from '../components/admin/EditClientModal';
import QRCodeModal from '../components/admin/QRCodeModal';
import {
    ChartBarIcon,
    UsersIcon,
    StarIcon,
    CurrencyRupeeIcon,
    MagnifyingGlassIcon,
    ArrowRightOnRectangleIcon,
    QrCodeIcon,
    ChartPieIcon,
    ChatBubbleLeftRightIcon,
    EyeIcon,
    CheckCircleIcon,
    ClipboardDocumentCheckIcon,
    UserGroupIcon,
    InformationCircleIcon,
    PlusIcon,
    XMarkIcon,
    PencilIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [showEditClientModal, setShowEditClientModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [qrClient, setQRClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load clients from Supabase
    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        setLoading(true);

        // Get static businesses
        const staticBusinesses = getAllBusinesses();

        // Get Supabase clients
        const result = await getAllClients();

        if (result.success && result.data) {
            // Filter out test clients (FEWGW and AT bar)
            const supabaseClients = result.data.filter(client => {
                const name = (client.business_name || client.name || '').toLowerCase();
                return !name.includes('fewgw') && !name.includes('at bar');
            });

            // Map Supabase clients for easy lookup
            const supabaseMap = {};
            supabaseClients.forEach(c => {
                supabaseMap[c.business_id] = c;
            });

            // Merge static businesses with Supabase data
            const mergedStatic = staticBusinesses.map(staticBiz => {
                const supabaseBiz = supabaseMap[staticBiz.id];
                if (supabaseBiz) {
                    // Business exists in Supabase - use live data for stats
                    return {
                        ...staticBiz,
                        ...supabaseBiz, // Overwrite with live data
                        // Ensure we use Supabase stats
                        total_reviews: supabaseBiz.total_reviews,
                        average_rating: supabaseBiz.average_rating,
                        // Keep strict ID
                        id: staticBiz.id,
                        business_id: staticBiz.id
                    };
                }

                // Business only in Static - map keys to match Dashboard expectations
                return {
                    ...staticBiz,
                    total_reviews: staticBiz.reviewCount,
                    average_rating: staticBiz.rating
                };
            });

            // Get purely new Supabase clients (not in static list)
            const staticIds = staticBusinesses.map(b => b.id);
            const newSupabaseClients = supabaseClients.filter(c =>
                !staticIds.includes(c.business_id)
            );

            // Combine both
            setClients([...mergedStatic, ...newSupabaseClients]);
        } else {
            // Fallback to static businesses only (mapped)
            setClients(staticBusinesses.map(b => ({
                ...b,
                total_reviews: b.reviewCount,
                average_rating: b.rating
            })));
        }

        setLoading(false);
    };

    // Mock analytics data
    const analyticsData = {
        qrScans: {
            total: 0,
            byBusiness: {}
        },
        reviewsGenerated: {
            total: clients.reduce((sum, c) => sum + (c.total_reviews || 0), 0),
            byBusiness: {}
        },
        reviewsPosted: {
            total: 0,
            byBusiness: {}
        },
        conversionRates: {
            scanToGenerate: 0,
            generateToPost: 0
        }
    };

    useEffect(() => {
        if (!sessionStorage.getItem('adminLoggedIn')) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('adminLoggedIn');
        navigate('/admin/login');
    };

    const stats = [
        {
            name: 'Total Clients',
            value: clients.length,
            icon: <UsersIcon className="w-8 h-8" />,
            color: 'from-blue-500 to-blue-600'
        },
        {
            name: 'Total Reviews',
            value: clients.reduce((sum, c) => sum + (c.total_reviews || 0), 0),
            icon: <StarIcon className="w-8 h-8" />,
            color: 'from-yellow-500 to-yellow-600'
        },
        {
            name: 'Average Rating',
            value: clients.length > 0 ? (clients.reduce((sum, c) => sum + (parseFloat(c.average_rating) || 0), 0) / clients.length).toFixed(1) : '0.0',
            icon: <ChartBarIcon className="w-8 h-8" />,
            color: 'from-green-500 to-green-600'
        },
        {
            name: 'Active Subscriptions',
            value: clients.filter(c => c.subscription_status === 'active').length,
            icon: <CheckCircleIcon className="w-8 h-8" />,
            color: 'from-blue-500 to-blue-600'
        }
    ];

    const filteredClients = clients.filter(client => {
        const clientName = client.business_name || client.name || '';
        const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' ||
            (filterStatus === 'active' && (client.total_reviews || 0) > 50) ||
            (filterStatus === 'new' && (client.total_reviews || 0) <= 50);
        return matchesSearch && matchesFilter;
    });

    const getQRCodeUrl = (businessId) => {
        const baseUrl = window.location.origin;
        const reviewUrl = `${baseUrl}/business/${businessId}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(reviewUrl)}`;
    };

    const generateUID = () => {
        return `KS-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };

    const navigationItems = [
        { id: 'dashboard', name: 'Dashboard', icon: ChartBarIcon },
        { id: 'clients', name: 'Clients', icon: UsersIcon },
        { id: 'reviews', name: 'Reviews', icon: StarIcon },
        { id: 'analytics', name: 'Analytics', icon: ChartPieIcon },
        { id: 'referrals', name: 'Referrals', icon: UserGroupIcon },
        { id: 'whatsapp', name: 'WhatsApp', icon: ChatBubbleLeftRightIcon },
        { id: 'about', name: 'About Us', icon: InformationCircleIcon }
    ];

    const renderDashboard = () => (
        <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="card"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-semibold mb-1">{stat.name}</h3>
                        <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="card">
                    <h3 className="text-xl font-bold mb-4">Conversion Rates</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">QR Scan → Review Generated</span>
                                <span className="font-bold">{analyticsData.conversionRates.scanToGenerate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                                    style={{ width: `${analyticsData.conversionRates.scanToGenerate}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Review Generated → Posted on Google</span>
                                <span className="font-bold">{analyticsData.conversionRates.generateToPost}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full"
                                    style={{ width: `${analyticsData.conversionRates.generateToPost}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h3 className="text-xl font-bold mb-4">Website UID</h3>
                    <div className="bg-gray-50 p-4 rounded-xl mb-4">
                        <code className="text-sm font-mono break-all">{generateUID()}</code>
                    </div>
                    <button className="btn btn-primary w-full">
                        Generate New UID
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h3 className="text-xl font-bold mb-4">Top Performing Clients</h3>
                <div className="space-y-3">
                    {clients.slice(0, 3).map((client, index) => {
                        const clientName = client.business_name || client.name || 'Unnamed';
                        return (
                            <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="text-3xl">{client.logo || '🏢'}</div>
                                    <div>
                                        <div className="font-semibold">{clientName}</div>
                                        <div className="text-sm text-gray-500">{client.total_reviews || 0} reviews</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-bold">{client.average_rating || '0.0'}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );

    const renderClients = () => (
        <>
            {/* Filters and Add Client Button */}
            <div className="card mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search clients..."
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                    >
                        <option value="all">All Clients</option>
                        <option value="active">Active (50+ reviews)</option>
                        <option value="new">New (&lt; 50 reviews)</option>
                    </select>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAddClientModal(true)}
                        className="btn btn-primary flex items-center gap-2 whitespace-nowrap px-6"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Client
                    </motion.button>
                </div>
            </div>

            {/* Clients Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Reviews</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Services</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">QR Code</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredClients.map((business, index) => (
                                <motion.tr
                                    key={business.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="text-3xl">{business.logo}</div>
                                            <div>
                                                <div className="font-semibold">{business.business_name || business.name || 'Unnamed'}</div>
                                                <div className="text-sm text-gray-500">{business.tagline}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                            <span className="font-semibold">{business.average_rating || '0.0'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold">{business.total_reviews || 0}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-gray-600">{business.services?.length || 0} services</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => {
                                                setQRClient(business);
                                                setShowQRModal(true);
                                            }}
                                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-semibold transition-colors"
                                        >
                                            <QrCodeIcon className="w-5 h-5" />
                                            View QR
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => {
                                                    setEditingClient(business);
                                                    setShowEditClientModal(true);
                                                }}
                                                className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                                            >
                                                <PencilIcon className="w-4 h-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => navigate(`/business/${business.business_id || business.id}`)}
                                                className="text-primary hover:text-primary-dark font-semibold transition-colors"
                                            >
                                                View →
                                            </button>
                                            {/* Delete button for all clients */}
                                            <button
                                                onClick={async () => {
                                                    const businessName = business.business_name || business.name;
                                                    const isStatic = !business.business_id;

                                                    const confirmMessage = isStatic
                                                        ? `Are you sure you want to remove ${businessName} from the list? (This will only hide it from the admin view, not delete the original data)`
                                                        : `Are you sure you want to permanently delete ${businessName} from the database?`;

                                                    if (window.confirm(confirmMessage)) {
                                                        if (business.business_id) {
                                                            // Delete from Supabase
                                                            const result = await deleteClient(business.business_id);
                                                            if (result.success) {
                                                                alert('✅ Client deleted successfully!');
                                                                loadClients();
                                                            } else {
                                                                alert('❌ Error deleting client: ' + result.error);
                                                            }
                                                        } else {
                                                            // Remove static business from display
                                                            setClients(clients.filter(c => c.id !== business.id));
                                                            alert('✅ Business removed from view!');
                                                        }
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-800 font-semibold transition-colors inline-flex items-center gap-1"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredClients.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        No clients found matching your criteria
                    </div>
                )}
            </div>
        </>
    );

    const renderReviews = () => (
        <div className="space-y-6">
            {clients.map((business) => (
                <div key={business.id} className="card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="text-3xl">{business.logo}</div>
                            <div>
                                <h3 className="text-xl font-bold">{business.name}</h3>
                                <p className="text-gray-600">{business.tagline}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <StarIcon className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                            <span className="text-2xl font-bold">{business.rating}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
                            <div className="text-2xl font-bold">{business.reviewCount}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-sm text-gray-600 mb-1">Generated</div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {analyticsData.reviewsGenerated.byBusiness[business.id] || 0}
                            </div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-sm text-gray-600 mb-1">Posted</div>
                            <div className="text-2xl font-bold text-green-600">
                                {analyticsData.reviewsPosted.byBusiness[business.id] || 0}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderAnalytics = () => (
        <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <QrCodeIcon className="w-10 h-10 text-purple-600" />
                        <h3 className="text-xl font-bold">QR Code Scans</h3>
                    </div>
                    <p className="text-4xl font-bold gradient-text mb-2">{analyticsData.qrScans.total}</p>
                    <p className="text-gray-600">Total scans across all businesses</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <ClipboardDocumentCheckIcon className="w-10 h-10 text-yellow-600" />
                        <h3 className="text-xl font-bold">Reviews Generated</h3>
                    </div>
                    <p className="text-4xl font-bold gradient-text mb-2">{analyticsData.reviewsGenerated.total}</p>
                    <p className="text-gray-600">AI-generated reviews</p>
                </div>

                <div className="card">
                    <div className="flex items-center gap-3 mb-4">
                        <CheckCircleIcon className="w-10 h-10 text-green-600" />
                        <h3 className="text-xl font-bold">Reviews Posted</h3>
                    </div>
                    <p className="text-4xl font-bold gradient-text mb-2">{analyticsData.reviewsPosted.total}</p>
                    <p className="text-gray-600">Posted on Google</p>
                </div>
            </div>

            {/* Detailed Analytics by Business */}
            <div className="card">
                <h3 className="text-2xl font-bold mb-6">Analytics by Business</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">QR Scans</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Generated</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Posted</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Conversion %</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {clients.map((business) => {
                                const scans = analyticsData.qrScans.byBusiness[business.id] || 0;
                                const generated = analyticsData.reviewsGenerated.byBusiness[business.id] || 0;
                                const posted = analyticsData.reviewsPosted.byBusiness[business.id] || 0;
                                const conversionRate = scans > 0 ? ((posted / scans) * 100).toFixed(1) : 0;

                                return (
                                    <tr key={business.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="text-2xl">{business.logo}</div>
                                                <div className="font-semibold">{business.name}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-purple-600">{scans}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-yellow-600">{generated}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-green-600">{posted}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full"
                                                        style={{ width: `${conversionRate}%` }}
                                                    ></div>
                                                </div>
                                                <span className="font-semibold">{conversionRate}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Funnel Visualization */}
            <div className="card">
                <h3 className="text-2xl font-bold mb-6">Conversion Funnel</h3>
                <div className="space-y-4">
                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">QR Code Scanned</span>
                            <span className="text-2xl font-bold">{analyticsData.qrScans.total}</span>
                        </div>
                        <div className="w-full bg-purple-200 rounded-lg h-12 flex items-center justify-center">
                            <span className="font-bold text-purple-800">100%</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Review Generated</span>
                            <span className="text-2xl font-bold">{analyticsData.reviewsGenerated.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-lg h-12">
                            <div
                                className="bg-yellow-400 rounded-lg h-12 flex items-center justify-center"
                                style={{ width: `${analyticsData.conversionRates.scanToGenerate}%` }}
                            >
                                <span className="font-bold text-yellow-900">{analyticsData.conversionRates.scanToGenerate}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">Posted on Google</span>
                            <span className="text-2xl font-bold">{analyticsData.reviewsPosted.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-lg h-12">
                            <div
                                className="bg-green-500 rounded-lg h-12 flex items-center justify-center"
                                style={{ width: `${(analyticsData.reviewsPosted.total / analyticsData.qrScans.total * 100).toFixed(1)}%` }}
                            >
                                <span className="font-bold text-white">
                                    {((analyticsData.reviewsPosted.total / analyticsData.qrScans.total) * 100).toFixed(1)}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderWhatsApp = () => (
        <div className="space-y-6">
            <div className="card">
                <div className="flex items-center gap-3 mb-6">
                    <ChatBubbleLeftRightIcon className="w-10 h-10 text-green-600" />
                    <h2 className="text-2xl font-bold">WhatsApp Integration</h2>
                </div>
                <p className="text-gray-600 mb-6">
                    Integrate WhatsApp to send automated review requests and follow-ups to your customers.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-green-50 p-6 rounded-xl">
                        <h3 className="font-bold text-lg mb-3">✅ Features Available</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li>• Automated review request messages</li>
                            <li>• QR code sharing via WhatsApp</li>
                            <li>• Follow-up reminders</li>
                            <li>• Thank you messages after review</li>
                            <li>• Bulk messaging to customers</li>
                            <li>• WhatsApp Business API integration</li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-xl">
                        <h3 className="font-bold text-lg mb-3">📊 Use Cases</h3>
                        <ul className="space-y-2 text-gray-700">
                            <li>• Send review links after service</li>
                            <li>• Share QR codes for easy access</li>
                            <li>• Remind customers to post reviews</li>
                            <li>• Collect feedback privately</li>
                            <li>• Promote special offers</li>
                            <li>• Build customer relationships</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-8 rounded-2xl">
                    <h3 className="text-2xl font-bold mb-4">WhatsApp Business API</h3>
                    <p className="mb-6">
                        Connect your WhatsApp Business account to send automated messages and manage customer communications.
                    </p>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2">WhatsApp Business Phone Number</label>
                            <input
                                type="tel"
                                placeholder="+91 XXXXX XXXXX"
                                className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-2">API Access Token</label>
                            <input
                                type="password"
                                placeholder="Enter your WhatsApp Business API token"
                                className="w-full px-4 py-3 rounded-xl text-gray-900 focus:outline-none"
                            />
                        </div>
                        <button className="w-full bg-white text-green-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors">
                            Connect WhatsApp Business
                        </button>
                    </div>
                </div>

                <div className="mt-6 card bg-yellow-50">
                    <h3 className="font-bold text-lg mb-3">💡 Message Templates</h3>
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-xl">
                            <div className="font-semibold mb-2">Review Request Template</div>
                            <p className="text-sm text-gray-600">
                                "Hi [Name]! Thank you for visiting [Business Name]. We'd love to hear about your experience.
                                Click here to leave a review: [Link] 🌟"
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                            <div className="font-semibold mb-2">QR Code Share Template</div>
                            <p className="text-sm text-gray-600">
                                "Scan this QR code to leave us a quick review! Your feedback helps us improve. [QR Code Image]"
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl">
                            <div className="font-semibold mb-2">Thank You Template</div>
                            <p className="text-sm text-gray-600">
                                "Thank you for your wonderful review! We appreciate your support. Looking forward to serving you again! 🙏"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-72 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 shadow-2xl p-6 overflow-y-auto scrollbar-custom border-r border-white/10 z-50">
                {/* Logo */}
                <div className="mb-12 pb-6 border-b border-white/20">
                    <Logo size="small" variant="full" className="mb-3" isDark={true} />
                    <div className="text-xs text-white/80 font-bold tracking-wider ml-1">ADMIN DASHBOARD</div>
                </div>

                {/* Navigation */}
                <nav className="space-y-2 mb-8">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${activeTab === item.id
                                    ? 'bg-white text-blue-600 shadow-lg'
                                    : 'hover:bg-white/10 text-white/90 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="absolute bottom-6 left-6 right-6 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-lg transition-colors text-white font-medium shadow-lg border border-white/30"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>

            {/* Main Content */}
            <div className="ml-72 p-8 relative z-10">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        {navigationItems.find(item => item.id === activeTab)?.name}
                    </h1>
                    <p className="text-gray-600">
                        {activeTab === 'dashboard' && 'Welcome back, Admin!'}
                        {activeTab === 'clients' && 'Manage your business clients'}
                        {activeTab === 'reviews' && 'Monitor all reviews across businesses'}
                        {activeTab === 'analytics' && 'Detailed analytics and insights'}
                        {activeTab === 'referrals' && 'Manage referral program and earnings'}
                        {activeTab === 'whatsapp' && 'WhatsApp integration and messaging'}
                        {activeTab === 'about' && 'About Kaiten Software and AI Review Platform'}
                    </p>
                </div>

                {/* Tab Content */}
                {activeTab === 'dashboard' && renderDashboard()}
                {activeTab === 'clients' && renderClients()}
                {activeTab === 'reviews' && renderReviews()}
                {activeTab === 'analytics' && renderAnalytics()}
                {activeTab === 'referrals' && <Referrals />}
                {activeTab === 'whatsapp' && renderWhatsApp()}
                {activeTab === 'about' && <AboutUs />}
            </div>
            {/* Add Client Modal */}
            <AddClientModal
                isOpen={showAddClientModal}
                onClose={() => setShowAddClientModal(false)}
            />

            {/* Edit Client Modal */}
            <EditClientModal
                isOpen={showEditClientModal}
                onClose={() => {
                    setShowEditClientModal(false);
                    setEditingClient(null);
                }}
                client={editingClient}
                onUpdate={loadClients}
            />

            {/* QR Code Modal */}
            <QRCodeModal
                isOpen={showQRModal}
                onClose={() => {
                    setShowQRModal(false);
                    setQRClient(null);
                }}
                business={qrClient}
            />
        </div>
    );
}