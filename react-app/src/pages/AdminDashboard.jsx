import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBusinesses } from '../data/businesses';
import { getAllClients, updateClient, deleteClient, getQROrders, updateQROrderStatus, deleteQROrder } from '../lib/supabase';
import Logo from '../components/common/Logo';
import AboutUs from './AboutUs';
import Referrals from './Referrals';
import AddClientModal from '../components/admin/AddClientModal';
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
    TrashIcon,
    TruckIcon
} from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showAddClientModal, setShowAddClientModal] = useState(false);
    const [showQRModal, setShowQRModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [qrClient, setQRClient] = useState(null);
    const [clients, setClients] = useState([]);
    const [qrOrders, setQrOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Shipment Modal State
    const [showShipmentModal, setShowShipmentModal] = useState(false);
    const [selectedOrderForShipment, setSelectedOrderForShipment] = useState(null);
    const [shipmentDetails, setShipmentDetails] = useState({
        courier: '',
        trackingNumber: '',
        deliveryDate: ''
    });
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Load clients from Supabase
    useEffect(() => {
        loadClients();
        loadQROrders();
    }, []);

    const loadQROrders = async () => {
        const result = await getQROrders();
        if (result.success) {
            setQrOrders(result.data || []);
        } else {
            console.error('Failed to load QR orders', result.error);
            setQrOrders([]);
        }
    };

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
            navigate('/login', { state: { defaultMode: 'admin' } });
        }
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('adminLoggedIn');
        navigate('/login', { state: { defaultMode: 'admin' } });
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
        { id: 'management', name: 'Client Management', icon: ClipboardDocumentCheckIcon },
        { id: 'qr-orders', name: 'QR Plate Orders', icon: TruckIcon },
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
                        onClick={() => {
                            setEditingClient(null);
                            setShowAddClientModal(true);
                        }}
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
                                            <div className="text-3xl">{business.logo || '🏢'}</div>
                                            <div>
                                                <div className="font-bold text-slate-800">
                                                    {business.business_name || business.name || (business.business_id ? `ID: ${business.business_id}` : 'Unnamed Business')}
                                                </div>
                                                <div className="text-sm text-gray-500">{business.tagline || 'No tagline'}</div>
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
                                                    setShowAddClientModal(true);
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
                            <span className="text-2xl font-bold">{business.average_rating || '0.0'}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-xl">
                            <div className="text-sm text-gray-600 mb-1">Total Reviews</div>
                            <div className="text-2xl font-bold">{business.total_reviews || 0}</div>
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

    const renderQROrders = () => (<>
        <div className="card overflow-hidden">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TruckIcon className="w-6 h-6 text-blue-600" />
                QR Stand Delivery Orders
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Business</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Plate Details</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Design Choice</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Delivery Address</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {qrOrders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No orders placed yet.
                                </td>
                            </tr>
                        ) : (
                            qrOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{order.business_name}</div>
                                        <div className="text-xs text-gray-500">{order.business_id}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="px-2 py-1 bg-gray-100 rounded font-mono text-xs border border-gray-200">
                                                {order.plate_number}
                                            </div>
                                        </div>
                                        <div className="text-xs text-green-600 font-bold mt-1">Paid: ₹{order.price}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {order.design_info ? (
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="w-4 h-4 rounded-full border border-gray-200 shadow-sm" style={{ backgroundColor: order.design_info.colorCode || '#ddd' }}></span>
                                                    <span className="font-bold text-sm text-gray-800">{order.design_info.name || 'Custom'}</span>
                                                </div>
                                                <div className="text-xs text-gray-500">{order.design_info.details}</div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">No design info</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm text-gray-700 max-w-xs">{order.address}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={async (e) => {
                                                const newStatus = e.target.value;

                                                if (newStatus === 'In Transit') {
                                                    // Open Modal instead of immediate update
                                                    setSelectedOrderForShipment(order);
                                                    setShipmentDetails({ courier: '', trackingNumber: '', deliveryDate: '' });
                                                    setShowShipmentModal(true);
                                                    return;
                                                }

                                                // Optimistic update
                                                setQrOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));

                                                const result = await updateQROrderStatus(order.id, newStatus);
                                                if (!result.success) {
                                                    alert('Error updating status');
                                                    loadQROrders(); // Revert
                                                }
                                            }}
                                            className={`px-3 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            <option value="Payment Verified">Payment Verified</option>
                                            <option value="In Transit">In Transit</option>
                                            <option value="Delivered">Delivered</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={async () => {
                                                if (window.confirm('Are you sure you want to delete this order?')) {
                                                    const result = await deleteQROrder(order.id);
                                                    if (result.success) {
                                                        loadQROrders();
                                                    } else {
                                                        alert('Error deleting order: ' + result.error);
                                                    }
                                                }
                                            }}
                                            className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded transition-colors"
                                            title="Delete Order"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
        {/* Shipment Modal */}
        <AnimatePresence>
            {showShipmentModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold flex items-center gap-2">
                                <TruckIcon className="w-5 h-5 text-blue-600" />
                                Shipment Details
                            </h3>
                            <button onClick={() => setShowShipmentModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Courier Service</label>
                                <input
                                    type="text"
                                    placeholder="e.g. FedEx, BlueDart"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                    value={shipmentDetails.courier}
                                    onChange={e => setShipmentDetails({ ...shipmentDetails, courier: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tracking Number</label>
                                <input
                                    type="text"
                                    placeholder="Tracking Number / AWB"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                    value={shipmentDetails.trackingNumber}
                                    onChange={e => setShipmentDetails({ ...shipmentDetails, trackingNumber: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Estimated Delivery Date</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                    value={shipmentDetails.deliveryDate}
                                    onChange={e => setShipmentDetails({ ...shipmentDetails, deliveryDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="p-6 bg-gray-50 flex justify-end gap-3">
                            <button
                                onClick={() => setShowShipmentModal(false)}
                                className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={async () => {
                                    if (!selectedOrderForShipment) return;

                                    const shipmentInfo = {
                                        courier: shipmentDetails.courier,
                                        trackingNumber: shipmentDetails.trackingNumber,
                                        estimatedDelivery: shipmentDetails.deliveryDate ? new Date(shipmentDetails.deliveryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Soon',
                                        status: 'In Transit',
                                        timeline: [
                                            { status: 'Order Placed', date: new Date(selectedOrderForShipment.created_at).toLocaleDateString(), completed: true },
                                            { status: 'Processing', date: new Date().toLocaleDateString(), completed: true },
                                            { status: 'In Transit', date: new Date().toLocaleDateString(), completed: true, current: true },
                                            { status: 'Delivered', date: `Est. ${shipmentDetails.deliveryDate || 'Soon'}`, completed: false }
                                        ]
                                    };

                                    // Update status and shipment info
                                    const result = await updateQROrderStatus(selectedOrderForShipment.id, 'In Transit', { shipment_info: shipmentInfo });

                                    if (result.success) {
                                        alert('Order marked as In Transit!');
                                        setShowShipmentModal(false);
                                        loadQROrders();
                                    } else {
                                        alert('Error updating shipment: ' + result.error);
                                    }
                                }}
                                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                            >
                                Confirm Shipment
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>

    </>);

    const renderManagement = () => {
        // Mock client credentials data (in production, fetch from database)
        const clientCredentials = [
            {
                id: 'pizza-corner',
                businessName: 'Pizza Corner',
                username: 'pizzacorner',
                password: 'demo123',
                status: 'Active',
                plan: 'Premium',
                onboardDate: '2026-01-15',
                lastLogin: '2026-02-11',
                paymentStatus: 'Paid'
            },
            {
                id: 'rajs-salon',
                businessName: "Raj's Salon",
                username: 'rajssalon',
                password: 'salon456',
                status: 'Active',
                plan: 'Premium',
                onboardDate: '2026-01-10',
                lastLogin: '2026-02-10',
                paymentStatus: 'Paid'
            }
        ];

        const handleLoginAsClient = (clientId) => {
            sessionStorage.setItem('clientLoggedIn', 'true');
            sessionStorage.setItem('clientId', clientId);
            window.open('/client/dashboard', '_blank');
        };

        const handlePauseAccount = (clientId) => {
            alert(`Account ${clientId} has been paused. Client cannot login until reactivated.`);
        };

        const handleTerminateAccount = (clientId) => {
            if (confirm(`Are you sure you want to permanently terminate ${clientId}? This action cannot be undone.`)) {
                alert(`Account ${clientId} has been terminated.`);
            }
        };

        return (
            <div className="space-y-6">
                <div className="card">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Client Account Management</h2>
                            <p className="text-gray-600">Manage client credentials, account status, and access control</p>
                        </div>
                    </div>

                    {/* Credentials Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Business</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Username</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Password</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Payment</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Onboarded</th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {clientCredentials.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{client.businessName}</p>
                                                <p className="text-xs text-gray-500">{client.plan} Plan</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-900">
                                                {client.username}
                                            </code>
                                        </td>
                                        <td className="px-4 py-4">
                                            <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-900">
                                                {client.password}
                                            </code>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.status === 'Active'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.paymentStatus === 'Paid'
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-orange-100 text-orange-700'
                                                }`}>
                                                {client.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-600">
                                            {new Date(client.onboardDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleLoginAsClient(client.id)}
                                                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                                                    title="Login as Client"
                                                >
                                                    <ArrowRightOnRectangleIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handlePauseAccount(client.id)}
                                                    className="p-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors"
                                                    title="Pause Account"
                                                >
                                                    ⏸️
                                                </button>
                                                <button
                                                    onClick={() => handleTerminateAccount(client.id)}
                                                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                                                    title="Terminate Account"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Legend */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-3">Action Legend:</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <ArrowRightOnRectangleIcon className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="text-gray-700"><strong>Login as Client:</strong> Impersonate client account</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600">
                                    ⏸️
                                </div>
                                <span className="text-gray-700"><strong>Pause:</strong> Disable login (payment overdue)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <TrashIcon className="w-4 h-4 text-red-600" />
                                </div>
                                <span className="text-gray-700"><strong>Terminate:</strong> Permanently delete account</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

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
        <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 font-sans">
            {/* Animated Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-40 right-10 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-white/20 px-4 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <Logo size="small" variant="icon" />
                    <span className="font-bold text-gray-800">Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-lg bg-white shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50"
                >
                    {isMobileMenuOpen ? (
                        <XMarkIcon className="w-6 h-6" />
                    ) : (
                        <div className="space-y-1.5 w-6">
                            <span className="block w-full h-0.5 bg-gray-600"></span>
                            <span className="block w-full h-0.5 bg-gray-600"></span>
                            <span className="block w-full h-0.5 bg-gray-600"></span>
                        </div>
                    )}
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-72 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 shadow-2xl flex flex-col z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Logo */}
                <div className="flex-none p-6 border-b border-white/20">
                    <div className="flex justify-between items-start mb-6">
                        <Logo size="small" variant="full" isDark={true} />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="md:hidden p-1 text-white/50 hover:text-white"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>
                    <div className="text-xs text-white/80 font-bold tracking-wider ml-1">ADMIN DASHBOARD</div>
                </div>

                {/* Navigation - Scrollable Area */}
                <nav className="flex-1 overflow-y-auto min-h-0 p-6 space-y-2 scrollbar-hide">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium whitespace-nowrap ${activeTab === item.id
                                    ? 'bg-white text-blue-600 shadow-lg'
                                    : 'hover:bg-white/10 text-white/90 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-5 h-5 flex-shrink-0" />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* Logout - Fixed at Bottom */}
                <div className="flex-none p-6 pt-2 bg-gradient-to-t from-indigo-900 to-transparent">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-lg transition-colors text-white font-medium shadow-lg border border-white/30"
                    >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-20 md:pt-8 md:ml-72 p-4 md:p-8 relative z-10 transition-all duration-300">
                {/* Header */}
                <div className="mb-8 hidden md:block">
                    <h1 className="text-4xl font-bold mb-2">
                        {navigationItems.find(item => item.id === activeTab)?.name}
                    </h1>
                    <p className="text-gray-600">
                        {activeTab === 'dashboard' && 'Welcome back, Admin!'}
                        {activeTab === 'clients' && 'Manage your business clients'}
                        {activeTab === 'management' && 'Control client credentials and account status'}
                        {activeTab === 'qr-orders' && 'Manage orders for physical QR plates'}
                        {activeTab === 'reviews' && 'Monitor all reviews across businesses'}
                        {activeTab === 'analytics' && 'Detailed analytics and insights'}
                        {activeTab === 'referrals' && 'Manage referral program and earnings'}
                        {activeTab === 'whatsapp' && 'WhatsApp integration and messaging'}
                        {activeTab === 'about' && 'About Kaiten Software and AI Review Platform'}
                    </p>
                </div>
                {/* Mobile Page Title */}
                <div className="mb-6 md:hidden">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {navigationItems.find(item => item.id === activeTab)?.name}
                    </h1>
                </div>

                {/* Tab Content */}
                {/* Tab Content */}
                <main className="flex-1 w-full transition-all duration-300">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === 'dashboard' && renderDashboard()}
                            {activeTab === 'clients' && renderClients()}
                            {activeTab === 'management' && renderManagement()}
                            {activeTab === 'qr-orders' && renderQROrders()}
                            {activeTab === 'reviews' && renderReviews()}
                            {activeTab === 'analytics' && renderAnalytics()}
                            {activeTab === 'referrals' && <Referrals />}
                            {activeTab === 'whatsapp' && (
                                <div className="card text-center py-12">
                                    <ChatBubbleLeftRightIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold mb-2">WhatsApp Integration</h3>
                                    <p className="text-gray-600">Automated messaging features coming soon...</p>
                                </div>
                            )}
                            {activeTab === 'about' && <AboutUs />}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
            {/* Add/Edit Client Modal */}
            <AddClientModal
                isOpen={showAddClientModal}
                onClose={() => {
                    setShowAddClientModal(false);
                    setEditingClient(null);
                }}
                client={editingClient}
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