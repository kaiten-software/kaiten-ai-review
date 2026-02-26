import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllBusinesses } from '../data/businesses';
import { getAllClients, updateClient, deleteClient, getQROrders, updateQROrderStatus, deleteQROrder, getAllCallbackRequests, updateCallbackRequestStatus, deleteCallbackRequest, supabase } from '../lib/supabase';
import Logo from '../components/common/Logo';
import AboutUs from './AboutUs';
import Referrals from './Referrals';
import ApiTracker from './ApiTracker';
import AddClientModal from '../components/admin/AddClientModal';
import QRCodeModal from '../components/admin/QRCodeModal';
import FSRManagement from '../components/admin/FSRManagement';
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
    TruckIcon,
    PhoneIcon,
    FunnelIcon,
    ArrowDownTrayIcon,
    PrinterIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    CreditCardIcon,
    EllipsisVerticalIcon,
    BanknotesIcon,
    BoltIcon
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
    const [callbackRequests, setCallbackRequests] = useState([]);
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

    // QR Orders Filtering & Bulk select
    const [qrFilterStatus, setQrFilterStatus] = useState('all');
    const [qrFilterColor, setQrFilterColor] = useState('all');
    const [qrFilterDate, setQrFilterDate] = useState('');
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [openMenuOrderId, setOpenMenuOrderId] = useState(null); // three-dot menu
    const [showPrintMenu, setShowPrintMenu] = useState(false); // bulk print dropdown

    // Invoice Modal State
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [invoiceOrder, setInvoiceOrder] = useState(null);
    const [invoiceEmail, setInvoiceEmail] = useState({ to: '', from: 'billing@kaitensoftware.com', sending: false, sent: false });
    const invoicePrintRef = useRef(null);

    // Load clients from Supabase
    useEffect(() => {
        loadClients();
        loadQROrders();
        loadCallbackRequests();
    }, []);

    // Close menus when clicking outside
    useEffect(() => {
        if (!openMenuOrderId && !showPrintMenu) return;
        const close = () => { setOpenMenuOrderId(null); setShowPrintMenu(false); };
        document.addEventListener('click', close);
        return () => document.removeEventListener('click', close);
    }, [openMenuOrderId, showPrintMenu]);

    const loadCallbackRequests = async () => {
        const result = await getAllCallbackRequests();
        if (result.success) {
            setCallbackRequests(result.data || []);
        } else {
            console.error('Failed to load callback requests', result.error);
            setCallbackRequests([]);
        }
    };

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
            (filterStatus === 'active' && client.subscription_status === 'active') ||
            (filterStatus === 'new' && (!client.subscription_status || client.subscription_status === 'inactive'));
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
        { id: 'payments', name: 'Payment Verification', icon: BanknotesIcon },
        { id: 'qr-orders', name: 'QR Plate Orders', icon: TruckIcon },
        { id: 'callbacks', name: 'Callback Requests', icon: PhoneIcon },
        { id: 'reviews', name: 'Reviews', icon: StarIcon },
        { id: 'fsr', name: 'FSR Management', icon: UserGroupIcon },
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

    const renderQROrders = () => {
        const STATUS_PIPELINE = ['New', 'In Process', 'Payment Verified', 'Printing In Process', 'Ready to Ship', 'In Transit', 'Delivered'];

        const getStatusColor = (status) => {
            switch (status) {
                case 'Delivered': return 'bg-green-100 text-green-800';
                case 'In Transit': return 'bg-blue-100 text-blue-800';
                case 'Ready to Ship': return 'bg-indigo-100 text-indigo-800';
                case 'Printing In Process': return 'bg-purple-100 text-purple-800';
                case 'Payment Verified': return 'bg-teal-100 text-teal-800';
                case 'In Process': return 'bg-yellow-100 text-yellow-800';
                case 'New': return 'bg-rose-100 text-rose-800 tracking-wide ring-1 ring-rose-200';
                default: return 'bg-gray-100 text-gray-700';
            }
        };

        const uniqueColors = [...new Set(
            qrOrders.filter(o => o.design_info?.name).map(o => o.design_info.name)
        )];

        const filteredQrOrders = qrOrders.filter(order => {
            const matchStatus = qrFilterStatus === 'all' || order.status === qrFilterStatus;
            const matchColor = qrFilterColor === 'all' || (order.design_info?.name === qrFilterColor);
            const matchDate = !qrFilterDate || (order.created_at && order.created_at.startsWith(qrFilterDate));
            return matchStatus && matchColor && matchDate;
        });

        const allFilteredSelected = filteredQrOrders.length > 0 && filteredQrOrders.every(o => selectedOrderIds.includes(o.id));

        const toggleSelectAll = () => {
            if (allFilteredSelected) {
                setSelectedOrderIds(prev => prev.filter(id => !filteredQrOrders.map(o => o.id).includes(id)));
            } else {
                setSelectedOrderIds(prev => [...new Set([...prev, ...filteredQrOrders.map(o => o.id)])]);
            }
        };

        const toggleSelectOrder = (id) => {
            setSelectedOrderIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
        };

        const handleBulkDownload = () => {
            const selected = qrOrders.filter(o => selectedOrderIds.includes(o.id));
            const rows = [['Date', 'Business', 'Plate #', 'Design', 'Address', 'Status', 'Amount', 'UPI Ref']];
            selected.forEach(o => rows.push([
                new Date(o.created_at).toLocaleDateString(),
                o.business_name,
                o.plate_number,
                o.design_info?.name || '-',
                o.address,
                o.status,
                `Rs.${o.price || (o.design_info?.total_price ?? '-')}`,
                o.design_info?.upi_reference || '-'
            ]));
            const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'qr_orders.csv'; a.click();
            URL.revokeObjectURL(url);
        };

        const handleBulkPrint = () => {
            const selected = qrOrders.filter(o => selectedOrderIds.includes(o.id));
            const printWindow = window.open('', '_blank');
            const stickerStyle = `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap');

                .sticker { 
                    border: none;
                    display: flex; 
                    flex-direction: column; 
                    justify-content: center; 
                    align-items: center;
                    text-align: center;
                    background: transparent; 
                    font-family: 'Inter', sans-serif; 
                }
                .label-prefix {
                    font-size: 12px;
                    font-weight: 900;
                    color: #64748b;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    margin-bottom: 3px;
                }
                .business-name {
                    font-size: 18px;
                    font-weight: 900;
                    color: #0f172a;
                    margin-bottom: 4px;
                    line-height: 1.2;
                }
                .postal-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #64748b;
                    margin-top: 4px;
                    margin-bottom: 1px;
                }
                .address {
                    font-size: 13px;
                    color: #334155;
                    line-height: 1.35;
                    font-weight: 500;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                }
                .divider {
                    height: 1px;
                    background: #cbd5e1;
                    margin: 5px auto;
                    width: 35%;
                }
                .serial-group {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }
                .serial-label {
                    font-size: 11px;
                    font-weight: 700;
                    color: #94a3b8;
                    text-transform: uppercase;
                }
                .serial-num {
                    font-size: 12px;
                    font-weight: 900;
                    color: #0f172a;
                    letter-spacing: 0.5px;
                }
            `;

            /* SL102 Label Sheet: US Letter (8.5" x 11"), 2 cols x 5 rows = 10 labels
               Each label: 4" x 2" (101.6mm x 50.8mm)
               Top margin: 0.5" (12.7mm), Side margin: 3/16" (4.76mm)
               Column gap: ~1/8" (3.2mm), Row gap: 0 */

            const content = `
                <style>
                    @page { size: letter portrait; margin: 0; }
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, sans-serif; }
                    .page {
                        width: 8.5in;
                        height: 11in;
                        padding-top: 0.5in;
                        padding-left: 0.1875in;
                        padding-right: 0.1875in;
                        display: grid;
                        grid-template-columns: 4in 4in;
                        grid-template-rows: repeat(5, 2in);
                        column-gap: 0.125in;
                        row-gap: 0;
                        page-break-after: always;
                    }
                    .page:last-child { page-break-after: avoid; }
                    .sticker {
                        width: 4in;
                        height: 2in;
                        padding: 0.15in 0.25in;
                        overflow: hidden;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                    }
                    ${stickerStyle}
                </style>
                ${(() => {
                    // Split into pages of 10
                    const pages = [];
                    for (let i = 0; i < selected.length; i += 10) {
                        pages.push(selected.slice(i, i + 10));
                    }
                    return pages.map(page => `
                        <div class="page">
                            ${page.map(o => `
                                <div class="sticker">
                                    <div class="label-prefix">To:</div>
                                    <div class="business-name">${o.business_name || 'Business'}</div>
                                    <div class="postal-label">Postal Address —</div>
                                    <div class="address">${o.address || 'N/A'}</div>
                                    <div class="divider"></div>
                                    <div class="serial-group">
                                        <span class="serial-label">Serial</span>
                                        <span class="serial-num">${o.plate_number}</span>
                                    </div>
                                </div>
                            `).join('')}
                            ${Array(10 - page.length).fill('<div class="sticker"></div>').join('')}
                        </div>
                    `).join('');
                })()}
            `;

            printWindow.document.write(`
                <html><head><title>Print Corporate Stickers</title></head><body>
                ${content}
                <script>setTimeout(() => window.print(), 500);<\/script>
                </body></html>
            `);
            printWindow.document.close();
        };

        return (
            <>
                <div className="space-y-6">
                    {/* Header + Filters */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                            <div className="flex items-center gap-2">
                                <TruckIcon className="w-6 h-6 text-blue-600" />
                                <h3 className="text-xl font-bold text-slate-900">QR Stand Orders</h3>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">{qrOrders.length}</span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                                {selectedOrderIds.length > 0 && (
                                    <>
                                        <span className="text-sm text-slate-600 font-medium">{selectedOrderIds.length} selected</span>
                                        <button onClick={handleBulkDownload} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
                                            <ArrowDownTrayIcon className="w-4 h-4" /> Export CSV
                                        </button>
                                        <button onClick={handleBulkPrint} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition-colors">
                                            <PrinterIcon className="w-4 h-4" /> Print
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                        {/* Filter Bar */}
                        <div className="flex flex-wrap gap-3 items-center">
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                                <FunnelIcon className="w-4 h-4" /> Filters:
                            </div>
                            <select value={qrFilterStatus} onChange={e => setQrFilterStatus(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white">
                                <option value="all">All Statuses</option>
                                {STATUS_PIPELINE.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <select value={qrFilterColor} onChange={e => setQrFilterColor(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white">
                                <option value="all">All Designs</option>
                                {uniqueColors.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input type="date" value={qrFilterDate} onChange={e => setQrFilterDate(e.target.value)}
                                className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:border-blue-500 outline-none bg-white" />
                            {(qrFilterStatus !== 'all' || qrFilterColor !== 'all' || qrFilterDate) && (
                                <button onClick={() => { setQrFilterStatus('all'); setQrFilterColor('all'); setQrFilterDate(''); }}
                                    className="text-xs text-red-500 font-bold hover:text-red-700 flex items-center gap-1">
                                    <XMarkIcon className="w-3.5 h-3.5" /> Clear
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-200 text-sm">
                                    <tr>
                                        <th className="px-4 py-3">
                                            <input type="checkbox" checked={allFilteredSelected} onChange={toggleSelectAll}
                                                className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
                                        </th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Date</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Business</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Plate / Qty</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Design</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">UPI Ref</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600">Delivery Address</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600 text-center">Status</th>
                                        <th className="px-4 py-3 font-semibold text-slate-600 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredQrOrders.length === 0 ? (
                                        <tr>
                                            <td colSpan="9" className="px-6 py-12 text-center text-slate-400">
                                                No orders match the current filters.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredQrOrders.map((order) => (
                                            <tr key={order.id} className={`hover:bg-slate-50/70 transition-colors ${selectedOrderIds.includes(order.id) ? 'bg-blue-50/40' : ''}`}>
                                                <td className="px-4 py-3">
                                                    <input type="checkbox" checked={selectedOrderIds.includes(order.id)} onChange={() => toggleSelectOrder(order.id)}
                                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer" />
                                                </td>
                                                <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-slate-900">{order.business_name}</div>
                                                    <div className="text-xs text-slate-400">{order.business_id}</div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="font-mono text-xs bg-slate-100 border border-slate-200 px-2 py-1 rounded inline-block">{order.plate_number}</div>
                                                    {order.design_info?.quantity && (
                                                        <div className="text-xs text-slate-500 mt-0.5">Qty: <span className="font-bold text-slate-700">{order.design_info.quantity}</span></div>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {order.design_info ? (() => {
                                                        const colorMap = {
                                                            'bg-blue-600': '#2563eb',
                                                            'bg-emerald-600': '#059669',
                                                            'bg-purple-600': '#9333ea',
                                                            'bg-orange-600': '#ea580c',
                                                            'bg-cyan-900': '#164e63',
                                                            'bg-red-600': '#dc2626',
                                                            'bg-pink-600': '#db2777',
                                                            'bg-yellow-500': '#eab308',
                                                        };
                                                        const dotColor = colorMap[order.design_info.colorCode] || order.design_info.colorCode || '#94a3b8';
                                                        return (
                                                            <div className="flex items-center gap-2">
                                                                <span className="w-3.5 h-3.5 rounded-full flex-shrink-0 ring-1 ring-black/10 shadow-sm" style={{ backgroundColor: dotColor }}></span>
                                                                <span className="text-xs font-bold text-slate-800">{order.design_info.name}</span>
                                                            </div>
                                                        );
                                                    })() : <span className="text-slate-300 text-xs italic">—</span>}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {order.design_info?.upi_reference ? (
                                                        <span className="font-mono text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-1 rounded-lg font-bold">{order.design_info.upi_reference}</span>
                                                    ) : (
                                                        <span className="text-slate-300 text-xs italic">Not provided</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <p className="text-xs text-slate-600 max-w-[180px] leading-relaxed">{order.address}</p>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <select
                                                        value={order.status}
                                                        onChange={async (e) => {
                                                            const newStatus = e.target.value;
                                                            if (newStatus === 'In Transit') {
                                                                setSelectedOrderForShipment(order);
                                                                setShipmentDetails({ courier: '', trackingNumber: '', deliveryDate: '' });
                                                                setShowShipmentModal(true);
                                                                return;
                                                            }
                                                            if (newStatus === 'Payment Verified') {
                                                                const matchingClient = clients.find(c => c.business_id === order.business_id);
                                                                const businessEmail = matchingClient?.email || '';
                                                                setInvoiceOrder(order);
                                                                setInvoiceEmail({ to: businessEmail, from: 'billing@kaitensoftware.com', sending: false, sent: false });
                                                                setShowInvoiceModal(true);
                                                                return; // Status only changes when admin clicks Confirm inside modal
                                                            }
                                                            setQrOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                                                            const result = await updateQROrderStatus(order.id, newStatus);
                                                            if (!result.success) { alert('Error updating status'); loadQROrders(); }
                                                        }}
                                                        className={`px-2 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${getStatusColor(order.status)}`}
                                                    >
                                                        {STATUS_PIPELINE.map(s => <option key={s} value={s}>{s}</option>)}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="relative inline-block">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setOpenMenuOrderId(openMenuOrderId === order.id ? null : order.id); }}
                                                            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors shadow-sm"
                                                            title="Options"
                                                        >
                                                            <EllipsisVerticalIcon className="w-5 h-5" />
                                                        </button>
                                                        {openMenuOrderId === order.id && (
                                                            <div
                                                                className="absolute right-0 top-8 z-50 bg-white rounded-xl shadow-xl border border-slate-100 py-1 min-w-[120px]"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <button
                                                                    onClick={async () => {
                                                                        setOpenMenuOrderId(null);
                                                                        if (window.confirm('Delete this order? This cannot be undone.')) {
                                                                            const result = await deleteQROrder(order.id);
                                                                            if (result.success) { loadQROrders(); setSelectedOrderIds(prev => prev.filter(x => x !== order.id)); }
                                                                            else alert('Error: ' + result.error);
                                                                        }
                                                                    }}
                                                                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                                                >
                                                                    <TrashIcon className="w-4 h-4" /> Delete
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Shipment Modal */}
                <AnimatePresence>
                    {showShipmentModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-lg font-bold flex items-center gap-2"><TruckIcon className="w-5 h-5 text-blue-600" /> Shipment Details</h3>
                                    <button onClick={() => setShowShipmentModal(false)} className="text-gray-400 hover:text-gray-600"><XMarkIcon className="w-6 h-6" /></button>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Courier Service</label>
                                        <input type="text" placeholder="e.g. FedEx, BlueDart"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                            value={shipmentDetails.courier} onChange={e => setShipmentDetails({ ...shipmentDetails, courier: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Tracking Number</label>
                                        <input type="text" placeholder="AWB / Tracking Number"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                            value={shipmentDetails.trackingNumber} onChange={e => setShipmentDetails({ ...shipmentDetails, trackingNumber: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">Estimated Delivery Date</label>
                                        <input type="date" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 outline-none"
                                            value={shipmentDetails.deliveryDate} onChange={e => setShipmentDetails({ ...shipmentDetails, deliveryDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="p-6 bg-gray-50 flex justify-end gap-3">
                                    <button onClick={() => setShowShipmentModal(false)} className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-200 rounded-lg">Cancel</button>
                                    <button onClick={async () => {
                                        if (!selectedOrderForShipment) return;
                                        const shipmentInfo = {
                                            courier: shipmentDetails.courier, trackingNumber: shipmentDetails.trackingNumber,
                                            estimatedDelivery: shipmentDetails.deliveryDate ? new Date(shipmentDetails.deliveryDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Soon',
                                            status: 'In Transit',
                                            timeline: [
                                                { status: 'Order Placed', date: new Date(selectedOrderForShipment.created_at).toLocaleDateString(), completed: true },
                                                { status: 'Processing', date: new Date().toLocaleDateString(), completed: true },
                                                { status: 'In Transit', date: new Date().toLocaleDateString(), completed: true, current: true },
                                                { status: 'Delivered', date: `Est. ${shipmentDetails.deliveryDate || 'Soon'}`, completed: false }
                                            ]
                                        };
                                        const result = await updateQROrderStatus(selectedOrderForShipment.id, 'In Transit', { shipment_info: shipmentInfo });
                                        if (result.success) { setShowShipmentModal(false); loadQROrders(); }
                                        else alert('Error: ' + result.error);
                                    }} className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-500/20">
                                        Confirm Shipment
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Invoice Modal */}
                <AnimatePresence>
                    {showInvoiceModal && invoiceOrder && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div initial={{ opacity: 0, scale: 0.93, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.93 }}
                                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
                                <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex justify-between items-center flex-shrink-0">
                                    <div className="flex items-center gap-3">
                                        <DocumentTextIcon className="w-6 h-6" />
                                        <div>
                                            <h3 className="text-lg font-bold">Review & Verify Payment</h3>
                                            <p className="text-sm text-white/80">{invoiceOrder.business_name} · {new Date(invoiceOrder.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setShowInvoiceModal(false)} className="text-white/70 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                                </div>
                                <div className="overflow-y-auto flex-1">
                                    <div ref={invoicePrintRef} className="p-8 bg-white">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <div className="text-2xl font-black text-slate-900">Kaiten Software</div>
                                                <div className="text-sm text-slate-500 mt-1">billing@kaitensoftware.com</div>
                                                <div className="text-sm text-slate-500">Bangalore, Karnataka, India</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-black text-teal-600">INVOICE</div>
                                                <div className="text-xs text-slate-500 mt-1">#{invoiceOrder.plate_number}</div>
                                                <div className="text-xs text-slate-500">{new Date().toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-50 rounded-xl p-5 mb-6">
                                            <div className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wide">Bill To</div>
                                            <div className="text-lg font-black text-slate-900">{invoiceOrder.business_name}</div>
                                            <div className="text-sm text-slate-500">{invoiceOrder.address}</div>
                                        </div>
                                        {(() => {
                                            const total = invoiceOrder.design_info?.total_price || invoiceOrder.price || 250;
                                            const qty = invoiceOrder.design_info?.quantity || 1;
                                            const basePrice = (total / 1.18).toFixed(2);
                                            const gstTotal = (total - basePrice);
                                            const cgst = (gstTotal / 2).toFixed(2);
                                            const sgst = (gstTotal / 2).toFixed(2);

                                            return (
                                                <>
                                                    <table className="w-full mb-6">
                                                        <thead><tr className="border-b-2 border-slate-200">
                                                            <th className="text-left py-2 text-sm font-bold text-slate-700">Description</th>
                                                            <th className="text-center py-2 text-sm font-bold text-slate-700">Qty</th>
                                                            <th className="text-right py-2 text-sm font-bold text-slate-700">Amount</th>
                                                        </tr></thead>
                                                        <tbody>
                                                            <tr className="border-b border-slate-100">
                                                                <td className="py-3 text-sm">
                                                                    <div className="font-semibold text-slate-800">QR Acrylic Stand — {invoiceOrder.design_info?.name || 'Custom Design'}</div>
                                                                    <div className="text-slate-500 text-xs mt-0.5">Plate: {invoiceOrder.plate_number}</div>
                                                                    {invoiceOrder.design_info?.upi_reference && (<div className="text-xs text-indigo-600 mt-0.5">UPI Ref: {invoiceOrder.design_info.upi_reference}</div>)}
                                                                </td>
                                                                <td className="py-3 text-sm text-center font-bold text-slate-800">{qty}</td>
                                                                <td className="py-3 text-sm text-right font-bold">₹{basePrice}</td>
                                                            </tr>
                                                            <tr>
                                                                <td colSpan="2" className="py-2 text-sm text-right font-semibold text-slate-500">CGST (9%)</td>
                                                                <td className="py-2 text-sm text-right font-semibold text-slate-600">₹{cgst}</td>
                                                            </tr>
                                                            <tr className="border-b border-slate-100">
                                                                <td colSpan="2" className="py-2 text-sm text-right font-semibold text-slate-500">SGST (9%)</td>
                                                                <td className="py-2 text-sm text-right font-semibold text-slate-600">₹{sgst}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="text-xs text-slate-500 font-medium">GSTIN: 29AWBPP8756K1Z9</div>
                                                        <div className="bg-teal-600 text-white rounded-xl px-6 py-3 flex gap-6 items-center">
                                                            <span className="text-sm font-semibold opacity-80">Total Paid</span>
                                                            <span className="text-2xl font-black">₹{total}</span>
                                                        </div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                        <div className="mt-6 text-center text-xs text-slate-400">Thank you for your business! · kaitensoftware.com</div>
                                    </div>

                                    <div className="px-8 py-5 border-t border-slate-100 space-y-4 bg-white">
                                        {/* Confirm Payment Verified button */}
                                        <div className="flex items-center justify-between bg-amber-50 border-2 border-amber-200 rounded-xl px-4 py-3">
                                            <div>
                                                <div className="text-sm font-bold text-amber-800">✓ Confirm Payment Verified</div>
                                                <div className="text-xs text-amber-600 mt-0.5">Only click after verifying the UPI transaction above</div>
                                            </div>
                                            <button
                                                onClick={async () => {
                                                    const result = await updateQROrderStatus(invoiceOrder.id, 'Payment Verified');
                                                    if (result.success) {
                                                        setQrOrders(prev => prev.map(o => o.id === invoiceOrder.id ? { ...o, status: 'Payment Verified' } : o));
                                                        setShowInvoiceModal(false);
                                                    } else { alert('Error: ' + result.error); }
                                                }}
                                                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all flex items-center gap-2 shadow-md whitespace-nowrap ml-4"
                                            >
                                                <CheckCircleIcon className="w-4 h-4" /> Confirm & Verify
                                            </button>
                                        </div>

                                        <div className="text-sm font-bold text-slate-700">Send Invoice to Customer Email</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-slate-500 font-semibold block mb-1">From</label>
                                                <input type="email" value={invoiceEmail.from} onChange={e => setInvoiceEmail(p => ({ ...p, from: e.target.value }))}
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-teal-500 outline-none" />
                                            </div>
                                            <div>
                                                <label className="text-xs text-slate-500 font-semibold block mb-1">To (Customer Email)</label>
                                                <input type="email" value={invoiceEmail.to} onChange={e => setInvoiceEmail(p => ({ ...p, to: e.target.value }))}
                                                    placeholder="customer@email.com"
                                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:border-teal-500 outline-none" />
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => window.print()}
                                                className="flex-1 px-4 py-2.5 bg-slate-800 text-white font-bold rounded-xl text-sm hover:bg-slate-900 flex items-center justify-center gap-2">
                                                <PrinterIcon className="w-4 h-4" /> Print Invoice
                                            </button>
                                            <button disabled={invoiceEmail.sent}
                                                onClick={async () => {
                                                    if (!invoiceEmail.to) { alert('Please enter customer email'); return; }
                                                    const qty = invoiceOrder.design_info?.quantity || 1;
                                                    const total = invoiceOrder.design_info?.total_price || invoiceOrder.price || 250;
                                                    const basePrice = (total / 1.18).toFixed(2);
                                                    const gstTotal = (total - basePrice);
                                                    const cgst = (gstTotal / 2).toFixed(2);
                                                    const sgst = (gstTotal / 2).toFixed(2);
                                                    const upiRef = invoiceOrder.design_info?.upi_reference || 'N/A';
                                                    const subject = encodeURIComponent('Invoice #' + invoiceOrder.plate_number + ' — ' + invoiceOrder.business_name);

                                                    const textBody = `Dear ${invoiceOrder.business_name},\n\nInvoice #${invoiceOrder.plate_number}\nDate: ${new Date().toLocaleDateString()}\n\nBill To: ${invoiceOrder.business_name}\n${invoiceOrder.address}\n\nQR Acrylic Stand — ${invoiceOrder.design_info?.name || 'Custom'}\nQty: ${qty} x Rs.${basePrice}\nCGST (9%): Rs.${cgst}\nSGST (9%): Rs.${sgst}\n--------------------------\nTotal Paid: Rs.${total}\nUPI Ref: ${upiRef}\n\nThank you!\nKaiten Software | kaitensoftware.com`;
                                                    const body = encodeURIComponent(textBody);

                                                    window.open('https://mail.google.com/mail/?view=cm&to=' + encodeURIComponent(invoiceEmail.to) + '&su=' + subject + '&body=' + body, '_blank');
                                                    setInvoiceEmail(p => ({ ...p, sent: true }));
                                                }}
                                                className={`flex-1 px-4 py-2.5 font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all ${invoiceEmail.sent ? 'bg-green-500 text-white' : 'bg-teal-600 text-white hover:bg-teal-700'}`}>
                                                {invoiceEmail.sent ? (<><CheckCircleIcon className="w-4 h-4" /> Sent!</>) : (<><EnvelopeIcon className="w-4 h-4" /> Send Invoice</>)}
                                            </button>
                                            <button onClick={() => setShowInvoiceModal(false)}
                                                className="px-6 py-2.5 text-slate-600 font-bold rounded-xl text-sm hover:bg-slate-100">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </>
        );
    };

    const renderManagement = () => {
        const handleLoginAsClient = (clientId) => {
            sessionStorage.setItem('clientLoggedIn', 'true');
            sessionStorage.setItem('clientId', clientId);
            window.open('/client/dashboard', '_blank');
        };

        const handlePauseAccount = (clientId) => {
            alert(`Account ${clientId} has been paused. Client cannot login until reactivated.`);
        };

        const handleTerminateAccount = async (clientId) => {
            if (window.confirm(`Are you sure you want to permanently terminate ${clientId}? This action cannot be undone.`)) {
                const result = await deleteClient(clientId);
                if (result.success) {
                    alert(`Account ${clientId} has been terminated.`);
                    setClients(clients.filter(c => (c.business_id || c.id) !== clientId));
                } else {
                    alert(`Failed to terminate account: ${result.error}`);
                }
            }
        };

        const managedClients = clients
            .filter(c => c.subscription_status === 'active' && (c.login_username || c.id === 'pizza-corner' || c.id === 'rajs-salon' || c.business_id === 'pizza-corner' || c.business_id === 'rajs-salon'))
            .map(c => {
                const isPizzaCorner = c.id === 'pizza-corner' || c.business_id === 'pizza-corner';
                const isRajsSalon = c.id === 'rajs-salon' || c.business_id === 'rajs-salon';
                return {
                    id: c.business_id || c.id,
                    businessName: c.business_name || c.name || 'Unknown Business',
                    username: c.login_username || (isPizzaCorner ? 'pizzacorner' : isRajsSalon ? 'rajssalon' : 'Not Generated'),
                    password: c.login_password || (isPizzaCorner ? 'demo123' : isRajsSalon ? 'salon456' : 'Not Generated'),
                    status: c.subscription_status === 'active' ? 'Active' : 'Inactive',
                    plan: c.subscription_plan || 'Premium',
                    onboardDate: c.subscription_start_date || c.created_at || new Date().toISOString(),
                    paymentStatus: c.subscription_status === 'active' ? 'Paid' : 'Pending'
                };
            });

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
                                {managedClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <div>
                                                <p className="font-semibold text-gray-900">{client.businessName}</p>
                                                <p className="text-xs text-gray-500">{client.plan} Plan</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <code className={`px-2 py-1 rounded text-sm font-mono ${client.username === 'Not Generated' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-900'}`}>
                                                {client.username}
                                            </code>
                                        </td>
                                        <td className="px-4 py-4">
                                            <code className={`px-2 py-1 rounded text-sm font-mono ${client.password === 'Not Generated' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-900'}`}>
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
                                                    <span role="img" aria-label="pause">⏸️</span>
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

    const renderCallbacks = () => (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Callback Requests</h2>
                    <p className="text-slate-500 mt-1">Manage and respond to client callback requests.</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600 font-bold">
                    Total: {callbackRequests.length}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-sm">
                                <th className="p-4 font-semibold text-slate-600">Client / Business</th>
                                <th className="p-4 font-semibold text-slate-600">Contact Details</th>
                                <th className="p-4 font-semibold text-slate-600">Message / Preference</th>
                                <th className="p-4 font-semibold text-slate-600">Date</th>
                                <th className="p-4 font-semibold text-slate-600 text-center">Status</th>
                                <th className="p-4 font-semibold text-slate-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {callbackRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-slate-500">
                                        No callback requests found.
                                    </td>
                                </tr>
                            ) : (
                                callbackRequests.map((req) => (
                                    <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-bold text-slate-900">{req.contact_name}</div>
                                            <div className="text-sm text-slate-500">{req.business_name || 'Unknown Business'}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-700 font-medium">
                                                <PhoneIcon className="w-4 h-4 text-slate-400" />
                                                {req.phone}
                                            </div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            {req.preferred_time && (
                                                <div className="text-xs font-semibold text-blue-700 bg-blue-50 inline-block px-2 py-1 rounded-md mb-1">
                                                    {req.preferred_time}
                                                </div>
                                            )}
                                            <div className="text-sm text-slate-600 truncate" title={req.message}>
                                                {req.message || <span className="text-slate-400 italic">No message provided</span>}
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">
                                            {new Date(req.created_at).toLocaleDateString()}
                                            <div className="text-xs">{new Date(req.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold leading-5 ${req.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {req.status === 'resolved' ? 'Called' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                {req.status !== 'resolved' && (
                                                    <button
                                                        onClick={async () => {
                                                            if (window.confirm(`Mark request from ${req.contact_name} as called?`)) {
                                                                await updateCallbackRequestStatus(req.id, 'resolved');
                                                                loadCallbackRequests();
                                                            }
                                                        }}
                                                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-green-100 shadow-sm font-medium text-sm flex items-center gap-1"
                                                        title="Mark as Called"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" /> Resolve
                                                    </button>
                                                )}
                                                <button
                                                    onClick={async () => {
                                                        if (window.confirm(`Delete request from ${req.contact_name}?`)) {
                                                            await deleteCallbackRequest(req.id);
                                                            loadCallbackRequests();
                                                        }
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100 shadow-sm"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    // =====================================================
    // Payment Verification TAB
    // =====================================================
    const [pendingClients, setPendingClients] = useState([]);
    const [paymentSearch, setPaymentSearch] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [selectedPaymentClient, setSelectedPaymentClient] = useState(null);
    const [generatedCreds, setGeneratedCreds] = useState(null);
    const [credEmailSending, setCredEmailSending] = useState(false);
    const [credEmailSent, setCredEmailSent] = useState(false);

    const loadPendingClients = async () => {
        setPaymentLoading(true);
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error && data) {
                setPendingClients(data);
            }
        } catch (e) {
            console.error('Error loading pending clients:', e);
        }
        setPaymentLoading(false);
    };

    useEffect(() => {
        if (activeTab === 'payments') {
            loadPendingClients();
        }
    }, [activeTab]);

    const handleVerifyPayment = async (client) => {
        // Generate credentials
        const username = client.business_name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(100 + Math.random() * 900);
        const password = Math.random().toString(36).slice(-8).toUpperCase();

        // Update client in Supabase: set status to active, store credentials
        const { error } = await supabase
            .from('clients')
            .update({
                subscription_status: 'active',
                login_username: username,
                login_password: password,
                updated_at: new Date().toISOString()
            })
            .eq('business_id', client.business_id);

        if (!error) {
            setGeneratedCreds({ username, password, email: client.email, businessName: client.business_name, businessId: client.business_id });
            setCredEmailSent(false);
            // Refresh list
            loadPendingClients();
        } else {
            alert('Failed to verify payment: ' + error.message);
        }
    };

    const handleSendCredentials = async () => {
        if (!generatedCreds) return;
        setCredEmailSending(true);
        try {
            // Use EmailJS or similar - for now simulate sending via mailto
            const subject = encodeURIComponent(`Your RankBag Login Credentials - ${generatedCreds.businessName}`);
            const body = encodeURIComponent(
                `Dear ${generatedCreds.businessName},\n\n` +
                `Welcome to RankBag! Your payment has been verified and your account is now active.\n\n` +
                `Here are your login credentials:\n\n` +
                `Username: ${generatedCreds.username}\n` +
                `Password: ${generatedCreds.password}\n\n` +
                `Login URL: ${window.location.origin}/login\n\n` +
                `Please change your password after first login.\n\n` +
                `Best regards,\nKaiten Software Team`
            );
            window.open(`mailto:${generatedCreds.email}?subject=${subject}&body=${body}`, '_blank');
            setCredEmailSent(true);
        } catch (e) {
            alert('Failed to open email client');
        }
        setCredEmailSending(false);
    };

    const renderPayments = () => {
        const filteredPending = pendingClients.filter(c => {
            const q = paymentSearch.toLowerCase();
            if (!q) return true;
            return (c.business_name || '').toLowerCase().includes(q) ||
                (c.business_id || '').toLowerCase().includes(q) ||
                (c.utr_number || '').toLowerCase().includes(q) ||
                (c.email || '').toLowerCase().includes(q) ||
                (c.referral_code || '').toLowerCase().includes(q);
        });

        const pendingList = filteredPending.filter(c => c.subscription_status === 'inactive');
        const verifiedList = filteredPending.filter(c => c.subscription_status === 'active' && c.login_username);

        return (
            <div className="space-y-8">
                {/* Stats Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-amber-50 rounded-xl"><BanknotesIcon className="w-7 h-7 text-amber-600" /></div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{pendingClients.filter(c => c.subscription_status === 'inactive').length}</p>
                                <p className="text-sm text-gray-500 font-medium">Pending Verification</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-50 rounded-xl"><CheckCircleIcon className="w-7 h-7 text-green-600" /></div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{pendingClients.filter(c => c.subscription_status === 'active').length}</p>
                                <p className="text-sm text-gray-500 font-medium">Active Accounts</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 rounded-xl"><EnvelopeIcon className="w-7 h-7 text-blue-600" /></div>
                            <div>
                                <p className="text-3xl font-bold text-gray-900">{pendingClients.filter(c => c.login_username).length}</p>
                                <p className="text-sm text-gray-500 font-medium">Credentials Generated</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Payment Verification</h3>
                        <div className="relative w-full sm:w-80">
                            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={paymentSearch}
                                onChange={(e) => setPaymentSearch(e.target.value)}
                                placeholder="Search by name, UTR, email..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Pending Payments */}
                    {pendingList.length > 0 && (
                        <div className="mb-8">
                            <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
                                Pending Verification ({pendingList.length})
                            </h4>
                            <div className="space-y-3">
                                {pendingList.map(client => (
                                    <div key={client.business_id} className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between hover:shadow-md transition-all">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="text-2xl">{client.logo || '🏢'}</span>
                                                <div>
                                                    <h5 className="font-bold text-gray-900 text-lg">{client.business_name}</h5>
                                                    <p className="text-sm text-gray-500">{client.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-3 mt-2">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-amber-200 rounded-lg text-sm font-mono text-gray-700">
                                                    <CreditCardIcon className="w-4 h-4 text-amber-500" />
                                                    UTR: {client.utr_number || 'N/A'}
                                                </span>
                                                {client.referral_code && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-blue-200 rounded-lg text-sm text-blue-700">
                                                        Ref: {client.referral_code}
                                                    </span>
                                                )}
                                                <span className="px-3 py-1 bg-amber-200 text-amber-800 rounded-lg text-xs font-bold uppercase">New</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleVerifyPayment(client)}
                                            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg shadow-green-500/20 flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <CheckCircleIcon className="w-5 h-5" />
                                            Verify Payment
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Verified / Active Accounts */}
                    {verifiedList.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-green-600 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4" />
                                Verified & Active ({verifiedList.length})
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold tracking-wider">
                                        <tr>
                                            <th className="px-5 py-3 text-left">Business</th>
                                            <th className="px-5 py-3 text-left">Email</th>
                                            <th className="px-5 py-3 text-left">Username</th>
                                            <th className="px-5 py-3 text-left">UTR</th>
                                            <th className="px-5 py-3 text-left">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {verifiedList.map(client => (
                                            <tr key={client.business_id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg">{client.logo || '🏢'}</span>
                                                        <span className="font-bold text-gray-900">{client.business_name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-sm text-gray-600">{client.email}</td>
                                                <td className="px-5 py-4 font-mono text-sm text-green-700 font-bold">{client.login_username}</td>
                                                <td className="px-5 py-4 font-mono text-sm text-gray-500">{client.utr_number || '-'}</td>
                                                <td className="px-5 py-4">
                                                    <button
                                                        onClick={() => {
                                                            setGeneratedCreds({
                                                                username: client.login_username,
                                                                password: client.login_password,
                                                                email: client.email,
                                                                businessName: client.business_name,
                                                                businessId: client.business_id
                                                            });
                                                            setCredEmailSent(false);
                                                        }}
                                                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                                                    >
                                                        <EnvelopeIcon className="w-4 h-4" /> Send Credentials
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {paymentLoading && (
                        <div className="text-center py-12 text-gray-400">Loading payments...</div>
                    )}
                    {!paymentLoading && filteredPending.length === 0 && (
                        <div className="text-center py-12 text-gray-400">No results found.</div>
                    )}
                </div>

                {/* Credential Modal */}
                <AnimatePresence>
                    {generatedCreds && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
                            onClick={() => setGeneratedCreds(null)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
                            >
                                <button onClick={() => setGeneratedCreds(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>

                                <div className="text-center mb-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircleIcon className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Credentials Ready</h3>
                                    <p className="text-gray-500 text-sm mt-1">{generatedCreds.businessName}</p>
                                </div>

                                <div className="bg-gray-900 rounded-2xl p-6 mb-6 text-white">
                                    <div className="mb-4 border-b border-gray-700 pb-4">
                                        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Username</label>
                                        <div className="text-xl font-mono font-bold text-green-400 mt-1">{generatedCreds.username}</div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 uppercase tracking-wider font-bold">Password</label>
                                        <div className="text-xl font-mono font-bold text-blue-400 mt-1">{generatedCreds.password}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 mb-2 block">Send to Email</label>
                                        <input
                                            type="email"
                                            value={generatedCreds.email}
                                            readOnly
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 font-medium"
                                        />
                                    </div>

                                    <button
                                        onClick={handleSendCredentials}
                                        disabled={credEmailSending || credEmailSent}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg ${credEmailSent
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
                                            }`}
                                    >
                                        {credEmailSending ? (
                                            <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Sending...</>
                                        ) : credEmailSent ? (
                                            <><CheckCircleIcon className="w-6 h-6" /> Email Sent!</>
                                        ) : (
                                            <><EnvelopeIcon className="w-6 h-6" /> Send Credentials</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

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
                        {activeTab === 'payments' && 'Verify payments and activate client accounts'}
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
                            {activeTab === 'callbacks' && renderCallbacks()}
                            {activeTab === 'reviews' && renderReviews()}
                            {activeTab === 'fsr' && <FSRManagement />}
                            {activeTab === 'analytics' && renderAnalytics()}
                            {activeTab === 'referrals' && <Referrals />}
                            {activeTab === 'api-tracker' && <ApiTracker />}
                            {activeTab === 'payments' && renderPayments()}
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