import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChartBarIcon,
    QrCodeIcon,
    StarIcon,
    UserGroupIcon,
    ArrowTrendingUpIcon,
    ArrowRightOnRectangleIcon,
    HomeIcon,
    UserIcon,
    ChartPieIcon,
    Cog6ToothIcon,
    DocumentTextIcon,
    PhotoIcon,
    MegaphoneIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckCircleIcon,
    TrashIcon,
    ChevronRightIcon,
    ArrowUpRightIcon,
    GlobeAltIcon,
    SparklesIcon,
    CodeBracketIcon,
    ShareIcon,
    LinkIcon,
    MapPinIcon,
    EyeIcon,
    ShoppingBagIcon,
    TrophyIcon,
    HeartIcon,
    FireIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline';

// Mock Data for Multiple Clients
const MOCK_DB = {
    'pizza-corner': {
        id: 'pizza-corner',
        name: 'Pizza Corner',
        type: 'Restaurant',
        logo: '🍕',
        theme: { from: 'from-orange-600', to: 'to-red-600', bg: 'bg-orange-50', accent: 'text-orange-600' },
        heroImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1080&q=80',
        plan: 'Premium',
        status: 'Active',
        stats: {
            qrScans: 1247,
            reviewsGenerated: 892,
            googlePosts: 734,
            avgRating: 4.7
        },
        reviews: [
            { id: 101, customer: "Sarah Johnson", rating: 5, text: "The pepperoni pizza was absolutely divine! Best in town.", date: "2026-02-11", posted: true, source: "Google", contact: "sarah.j@example.com", membership: "Gold Member" },
            { id: 102, customer: "Mike Chen", rating: 4, text: "Great service, but the music was a bit loud.", date: "2026-02-10", posted: true, source: "Google", contact: "mike.c@gmail.com", membership: null },
            { id: 103, customer: "Emma W.", rating: 5, text: "Loved the pasta! authentic italian taste.", date: "2026-02-09", posted: true, source: "Google", contact: "emma.watson@example.com", membership: "Silver Member" },
            { id: 104, customer: "David K.", rating: 3, text: "Delivery took longer than expected.", date: "2026-02-08", posted: false, source: "Direct", contact: "+1 555-0123", membership: null },
        ],
        competitors: [
            { name: "La Pino'z Pizza", area: "C-Scheme, Jaipur", rating: 4.1, reviews: 2300, sentiment: "mixed", insight: "Higher complaint volume on delivery delays vs your store.", trend: "down" },
            { name: "Zolocrust", area: "JLN Marg, Jaipur", rating: 4.9, reviews: 5100, sentiment: "positive", insight: "Dominating the organic/premium segment. Hard to compete on price.", trend: "up" },
            { name: "Ovenstory Pizza", area: "Vaishali Nagar", rating: 4.0, reviews: 890, sentiment: "neutral", insight: "Gaining traction with 'Buy 1 Get 1' offers.", trend: "stable" }
        ],
        products: [
            { id: 1, name: 'Farmhouse Special Pizza', category: 'Pizza', rating: 4.9, reviews: 342, price: '$12', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80', trend: 'up' },
            { id: 2, name: 'Spicy Pepperoni', category: 'Pizza', rating: 4.8, reviews: 215, price: '$14', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=300&q=80', trend: 'stable' },
            { id: 3, name: 'Creamy Alfredo Pasta', category: 'Pasta', rating: 4.5, reviews: 120, price: '$10', image: 'https://images.unsplash.com/photo-1626844131082-256783844137?auto=format&fit=crop&w=300&q=80', trend: 'down' },
            { id: 4, name: 'Garlic Breadsticks', category: 'Sides', rating: 4.2, reviews: 89, price: '$5', image: 'https://images.unsplash.com/photo-1573140247632-f84660f67627?auto=format&fit=crop&w=300&q=80', trend: 'stable' },
        ],
        team: [
            { id: 1, name: 'Mario Rossi', role: 'Head Chef', rating: 4.9, selections: 154, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=300&q=80', status: 'Star' },
            { id: 2, name: 'Sarah Jenkins', role: 'Senior Server', rating: 4.8, selections: 120, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', status: 'Rising' },
            { id: 3, name: 'David Smith', role: 'Delivery Lead', rating: 4.3, selections: 45, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80', status: 'Stable' },
        ]
    },
    'rajs-salon': {
        id: 'rajs-salon',
        name: "Raj's Salon",
        type: 'Salon',
        logo: '💇',
        theme: { from: 'from-purple-600', to: 'to-pink-600', bg: 'bg-purple-50', accent: 'text-purple-600' },
        heroImage: 'https://images.unsplash.com/photo-1560066984-12186d30b73c?auto=format&fit=crop&w=1080&q=80',
        plan: 'Premium',
        status: 'Active',
        stats: {
            qrScans: 856,
            reviewsGenerated: 412,
            googlePosts: 320,
            avgRating: 4.9
        },
        reviews: [
            { id: 201, customer: "Jessica L.", rating: 5, text: "Raj is a magician correctly! My hair looks amazing.", date: "2026-02-11", posted: true, source: "Google", contact: "jess.l@example.com", membership: "Platinum" },
            { id: 202, customer: "Amanda B.", rating: 5, text: "Best salon experience ever. Highly recommend the spa treatment.", date: "2026-02-10", posted: true, source: "Google", contact: "amanda.b@example.com", membership: "Gold" },
            { id: 203, customer: "Priya S.", rating: 4, text: "Good service but waiting time was long.", date: "2026-02-08", posted: true, source: "Google", contact: "+91 9876543210", membership: null },
        ],
        competitors: [
            { name: "Style 'N' Scissors", area: "Malviya Nagar", rating: 4.5, reviews: 1200, sentiment: "positive", insight: "Strong bridal makeup segment dominance.", trend: "up" },
            { name: "Toni & Guy", area: "C-Scheme", rating: 4.4, reviews: 900, sentiment: "positive", insight: "High price point excludes mass market.", trend: "stable" },
            { name: "Looks Salon", area: "Pink Square", rating: 4.2, reviews: 650, sentiment: "mixed", insight: "Recent staff turnover causing drop in ratings.", trend: "down" }
        ],
        products: [
            { id: 1, name: 'Gold Facial Kit', category: 'Facial', rating: 4.9, reviews: 89, price: '$40', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=300&q=80', trend: 'up' },
            { id: 2, name: 'Keratin Treatment', category: 'Hair', rating: 4.7, reviews: 156, price: '$120', image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=300&q=80', trend: 'stable' },
            { id: 3, name: 'Bridal Makeup Package', category: 'Makeup', rating: 5.0, reviews: 42, price: '$300', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=300&q=80', trend: 'up' },
        ],
        team: [
            { id: 1, name: 'Raj Koothrappali', role: 'Lead Stylist', rating: 5.0, selections: 230, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80', status: 'Legend' },
            { id: 2, name: 'Priya Sharma', role: 'Makeup Artist', rating: 4.8, selections: 180, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', status: 'Star' },
            { id: 3, name: 'Ken Adams', role: 'Colorist', rating: 4.6, selections: 95, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', status: 'Rising' },
        ]
    }
};

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [businessData, setBusinessData] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [qrLoading, setQrLoading] = useState(true);

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('clientLoggedIn');
        const clientId = sessionStorage.getItem('clientId');

        if (!isLoggedIn || !clientId) {
            navigate('/login');
            return;
        }

        const originalData = MOCK_DB[clientId] || MOCK_DB['pizza-corner'];
        let data = { ...originalData };

        // Demo Persistence: Load local reviews
        try {
            const localReviews = JSON.parse(localStorage.getItem('demo_reviews') || '[]');
            const myReviews = localReviews.filter(r => r.businessId === clientId);

            if (myReviews.length > 0) {
                // Combine with Mock data (newest first)
                data.reviews = [...myReviews, ...data.reviews];
                // Update stats
                data.stats = {
                    ...data.stats,
                    reviewsGenerated: data.stats.reviewsGenerated + myReviews.length
                };
            }
        } catch (err) {
            console.error("Local storage error:", err);
        }

        setBusinessData(data);
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('clientUser');
        sessionStorage.removeItem('clientId'); // Keep clientId removal for consistency with useEffect
        navigate('/login');
    };

    const deleteReview = (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            // Updated State
            const updatedReviews = businessData.reviews.filter(r => r.id !== id);
            setBusinessData(prev => ({ ...prev, reviews: updatedReviews }));

            // Update Local Storage
            const storedReviews = JSON.parse(localStorage.getItem('demo_reviews') || '[]');
            const newStoredReviews = storedReviews.filter(r => r.id !== id);
            localStorage.setItem('demo_reviews', JSON.stringify(newStoredReviews));
        }
    };

    if (!businessData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const theme = businessData.theme;
    // Generate QR URL based on current domain (for demo purposes using window.location.origin)
    const publicPageUrl = `${window.location.origin}/business/${businessData.id}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(publicPageUrl)}&color=${theme.accent.replace('text-', '').replace('-600', '')}`;

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden relative">
            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            {/* Premium Sidebar - Corporate Style */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-white flex flex-col flex-shrink-0 transition-transform duration-300 shadow-xl md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 md:hidden text-white/50 hover:text-white p-1"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                {/* Clean Gradient - Deep Corporate Blue */}
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0F172A] to-[#111827]"></div>

                {/* Content Layer */}
                <div className="relative z-10 flex-1 flex flex-col px-6 py-6">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-xl shadow-lg shadow-blue-900/20 shrink-0 text-white">
                            {businessData.logo}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className="text-base font-bold leading-tight text-white truncate">{businessData.name}</h2>
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-400 mt-0.5 inline-block">
                                {businessData.plan} Account
                            </span>
                        </div>
                    </div>

                    <nav className="space-y-1.5 flex-1">
                        {[
                            { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
                            { id: 'reviews', label: 'Reviews', icon: StarIcon },
                            { id: 'products', label: 'Products', icon: ShoppingBagIcon },
                            { id: 'team', label: 'Team', icon: UserGroupIcon },
                            { id: 'qr', label: 'QR Collection', icon: QrCodeIcon },
                            { id: 'analytics', label: 'Analytics', icon: ChartPieIcon },
                            { id: 'competitors', label: 'Competitor Spy', icon: EyeIcon },
                            { id: 'profile', label: 'Settings', icon: UserIcon },
                        ].map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${activeTab === item.id
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20'
                                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
                                    }`}
                            >
                                <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                                <span className="text-sm">{item.label}</span>
                                {activeTab === item.id && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"></div>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-slate-800/50">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-slate-400 hover:text-white font-medium transition-colors w-full px-3 py-2.5 rounded-lg hover:bg-white/5 group"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                            <span className="text-sm">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-slate-50">
                <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
                    {/* Header */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            {/* Mobile Hamburger */}
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </button>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                                    {activeTab === 'dashboard' ? 'Overview' :
                                        activeTab === 'reviews' ? 'Review Management' :
                                            activeTab === 'products' ? 'Product Portfolio' :
                                                activeTab === 'team' ? 'Team Performance' :
                                                    activeTab === 'qr' ? 'QR Code Assets' :
                                                        activeTab === 'analytics' ? 'Analytics & Insights' :
                                                            'Business Settings'}
                                </h1>
                                <p className="text-slate-500 mt-1">
                                    {activeTab === 'dashboard' ? `Welcome back to ${businessData.name}.` : 'Manage your business performance.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 self-end md:self-auto">
                            <button className="p-2 text-slate-400 hover:text-slate-600 bg-white rounded-full border border-slate-200 shadow-sm relative">
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                <EnvelopeIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate(`/business/${businessData.id}`, { state: { from: 'client-dashboard' } })}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold shadow-lg shadow-blue-500/20 bg-slate-900 hover:bg-slate-800 transition-all text-sm md:text-base"
                            >
                                <HomeIcon className="w-4 h-4" />
                                <span className="hidden sm:inline">View Storefront</span>
                                <span className="sm:hidden">Store</span>
                            </button>
                        </div>
                    </header>

                    <AnimatePresence mode="wait">
                        {/* --- DASHBOARD TAB --- */}
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {/* Welcome Banner - Refined */}
                                <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 shadow-lg shadow-slate-200/50">
                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                        <div>
                                            <h2 className="text-2xl font-bold mb-2 text-slate-800">Grow your 5-star reputation! 🚀</h2>
                                            <p className="text-slate-500 max-w-xl text-lg">Your AI-powered review system is active. Check your latest QR scan performance below.</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setActiveTab('qr')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2">
                                                <QrCodeIcon className="w-5 h-5" />
                                                Get QR Code
                                            </button>
                                        </div>
                                    </div>
                                    {/* Abstract Shapes */}
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-indigo-600/5 rounded-full blur-2xl"></div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Total Reviews', value: businessData.stats.reviewsGenerated, icon: StarIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                                        { label: 'QR Scans', value: businessData.stats.qrScans, icon: QrCodeIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
                                        { label: 'Avg Rating', value: businessData.stats.avgRating, icon: ChartBarIcon, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                                        { label: 'Map Views', value: '1.2k', icon: GlobeAltIcon, color: 'text-violet-600', bg: 'bg-violet-50' },
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-blue-100 transition-all group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                                    <stat.icon className="w-6 h-6" />
                                                </div>
                                                <ArrowUpRightIcon className="w-4 h-4 text-slate-300" />
                                            </div>
                                            <h3 className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</h3>
                                            <p className="text-slate-500 font-medium text-sm">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Reviews Preview */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                                        <div className="flex justify-between items-center mb-8">
                                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                                Latest Feedback
                                            </h3>
                                            <button onClick={() => setActiveTab('reviews')} className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                                        </div>
                                        <div className="space-y-6">
                                            {businessData.reviews.slice(0, 3).map((review) => (
                                                <div key={review.id} className="flex gap-4 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0 text-lg">
                                                        {review.customer.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="font-bold text-slate-900">{review.customer}</h4>
                                                                <div className="flex text-yellow-400 text-sm mt-1">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                                                        </div>
                                                        <p className="text-slate-600 text-sm mt-3 leading-relaxed">{review.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mini Analytics / Goals */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                                        <h3 className="font-bold text-slate-900 text-lg mb-6">Goals</h3>
                                        <div className="space-y-6">
                                            <div>
                                                <div className="flex justify-between text-sm font-bold mb-2">
                                                    <span className="text-slate-700">Review Goal</span>
                                                    <span className="text-blue-600">85%</span>
                                                </div>
                                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-blue-600 w-[85%] rounded-full"></div>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2">15 more reviews to reach monthly target</p>
                                            </div>
                                            <div>
                                                <div className="flex justify-between text-sm font-bold mb-2">
                                                    <span className="text-slate-700">Response Rate</span>
                                                    <span className="text-emerald-500">92%</span>
                                                </div>
                                                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 w-[92%] rounded-full"></div>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-2">You are replying fast! Keep it up.</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 pt-8 border-t border-slate-100">
                                            <button onClick={() => setActiveTab('qr')} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                                                Boost Reviews
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- REVIEWS TAB --- */}
                        {activeTab === 'reviews' && (
                            <motion.div
                                key="reviews"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                            >
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 border-b border-gray-100">
                                            <tr>
                                                <th className="p-6 font-bold text-gray-600 text-sm">Customer</th>
                                                <th className="p-6 font-bold text-gray-600 text-sm">Rating</th>
                                                <th className="p-6 font-bold text-gray-600 text-sm">Review</th>
                                                <th className="p-6 font-bold text-gray-600 text-sm">Contact Details</th>
                                                <th className="p-6 font-bold text-gray-600 text-sm">Status</th>
                                                <th className="p-6 font-bold text-gray-600 text-sm">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {businessData.reviews.map((review) => (
                                                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="p-6">
                                                        <div className="font-bold text-gray-900">{review.customer}</div>
                                                        {review.membership && (
                                                            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full font-medium">
                                                                {review.membership}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <p className="text-sm text-gray-600 max-w-xs">{review.text}</p>
                                                    </td>
                                                    <td className="p-6">
                                                        <div className="space-y-1 text-sm text-gray-600">
                                                            {review.contact ? (
                                                                <>
                                                                    <div className="flex items-center gap-2">
                                                                        {review.contact.includes('@') ? (
                                                                            <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                                                                        ) : (
                                                                            <PhoneIcon className="w-4 h-4 text-gray-400" />
                                                                        )}
                                                                        {review.contact}
                                                                    </div>
                                                                </>
                                                            ) : (
                                                                <span className="text-gray-400 italic">No contact info</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        {review.posted ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                                                <CheckCircleIcon className="w-3 h-3" />
                                                                Posted on {review.source}
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                                                                Pending
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="p-6">
                                                        <button
                                                            onClick={() => deleteReview(review.id)}
                                                            className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                                                            title="Delete Review"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* --- PREMIUM QR CODE TAB --- */}
                        {activeTab === 'qr' && (
                            <motion.div
                                key="qr"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid md:grid-cols-2 gap-8 items-start"
                            >
                                {/* Left: Premium QR Card */}
                                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-10 flex flex-col items-center relative overflow-hidden group">
                                    {/* Background decorative glow */}
                                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${theme.from} ${theme.to} opacity-5 blur-[80px] rounded-full pointer-events-none`}></div>

                                    <div className="relative z-10 text-center w-full">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Review Point</h3>
                                        <p className="text-slate-500 text-sm mb-8">Scan to leave a 5-star review instantly</p>

                                        {/* QR Container */}
                                        <div className="relative mx-auto w-72 h-72 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 p-4 flex items-center justify-center mb-8 group-hover:scale-105 transition-transform duration-500">
                                            {/* Corner Accents */}
                                            <div className={`absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 rounded-tl-xl ${theme.accent.replace('text-', 'border-')} opacity-30`}></div>
                                            <div className={`absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 rounded-tr-xl ${theme.accent.replace('text-', 'border-')} opacity-30`}></div>
                                            <div className={`absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 rounded-bl-xl ${theme.accent.replace('text-', 'border-')} opacity-30`}></div>
                                            <div className={`absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 rounded-br-xl ${theme.accent.replace('text-', 'border-')} opacity-30`}></div>

                                            {/* Loading Skeleton */}
                                            {qrLoading && (
                                                <div className="absolute inset-0 m-4 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center">
                                                    <QrCodeIcon className="w-12 h-12 text-slate-300 animate-bounce" />
                                                </div>
                                            )}

                                            {/* Main QR Image */}
                                            <img
                                                src={qrCodeUrl}
                                                alt={`${businessData.name} QR Code`}
                                                className={`w-full h-full object-contain mix-blend-multiply transition-opacity duration-500 ${qrLoading ? 'opacity-0' : 'opacity-100'}`}
                                                onLoad={() => setQrLoading(false)}
                                            />

                                            {/* 'Scan Me' Badge */}
                                            <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0`}>
                                                <PhotoIcon className="w-3 h-3" />
                                                Scan Me
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mx-auto">
                                            <button
                                                onClick={() => window.open(qrCodeUrl, '_blank')}
                                                className={`flex-1 px-6 py-3.5 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 bg-gradient-to-r ${theme.from} ${theme.to} hover:brightness-110 active:scale-95 transition-all`}
                                            >
                                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                                Download PNG
                                            </button>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(publicPageUrl);
                                                    alert('Link copied to clipboard!');
                                                }}
                                                className="px-6 py-3.5 rounded-xl bg-slate-50 text-slate-700 font-bold border border-slate-200 hover:bg-slate-100 hover:border-slate-300 active:scale-95 transition-all flex items-center justify-center"
                                                title="Copy Link"
                                            >
                                                <LinkIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Instructions & Tips */}
                                <div className="space-y-6">
                                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8">
                                        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                            <SparklesIcon className="w-5 h-5 text-yellow-500" />
                                            Deployment Guide
                                        </h3>
                                        <div className="space-y-6 relative">
                                            {/* Connector Line */}
                                            <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-100"></div>

                                            {[
                                                { title: "Download & Print", desc: "Get your unique QR code high-res file.", icon: ArrowRightOnRectangleIcon, color: "text-blue-500", bg: "bg-blue-50" },
                                                { title: "Strategic Placement", desc: "Place on table tents, counters, or bills.", icon: MapPinIcon, color: "text-purple-500", bg: "bg-purple-50" },
                                                { title: "Staff Training", desc: "Tell staff to point it out to happy customers.", icon: UserGroupIcon, color: "text-emerald-500", bg: "bg-emerald-50" },
                                                { title: "Watch & Grow", desc: "Track scans and reviews in real-time.", icon: ChartBarIcon, color: "text-orange-500", bg: "bg-orange-50" }
                                            ].map((step, idx) => (
                                                <div key={idx} className="relative flex gap-4 group">
                                                    <div className={`w-12 h-12 rounded-2xl ${step.bg} ${step.color} flex items-center justify-center shadow-sm shrink-0 relative z-10 group-hover:scale-110 transition-transform duration-300`}>
                                                        <step.icon className="w-6 h-6" />
                                                    </div>
                                                    <div className="pt-1">
                                                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{step.title}</h4>
                                                        <p className="text-slate-500 text-sm leading-relaxed mt-1">{step.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Pro Tip Card */}
                                    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                        <div className="relative z-10 flex gap-4">
                                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm h-fit">
                                                <MegaphoneIcon className="w-6 h-6 text-yellow-400" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg mb-1">Pro Tip</h4>
                                                <p className="text-slate-300 text-sm leading-relaxed">
                                                    Businesses that ask customers verbally ("Scan this for a discount!") get <span className="text-white font-bold">3x more reviews</span> than passive placement.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- ANALYTICS TAB --- */}
                        {activeTab === 'analytics' && (
                            <motion.div
                                key="analytics"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                {/* Top Metrics Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                        <h4 className="text-gray-500 font-medium mb-1 relative z-10">Review Conversion</h4>
                                        <div className="text-4xl font-bold text-gray-900 mb-2 relative z-10">24.8%</div>
                                        <div className="flex items-center gap-2 text-sm text-green-600 font-bold relative z-10">
                                            <ArrowTrendingUpIcon className="w-4 h-4" />
                                            <span>+4.2% this week</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-purple-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                        <h4 className="text-gray-500 font-medium mb-1 relative z-10">Avg Response Time</h4>
                                        <div className="text-4xl font-bold text-gray-900 mb-2 relative z-10">1.2 hrs</div>
                                        <div className="flex items-center gap-2 text-sm text-purple-600 font-bold relative z-10">
                                            <SparklesIcon className="w-4 h-4" />
                                            <span>Top 5% in sector</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
                                        <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                                        <h4 className="text-gray-500 font-medium mb-1 relative z-10">Sentiment Score</h4>
                                        <div className="text-4xl font-bold text-gray-900 mb-2 relative z-10">92/100</div>
                                        <div className="flex items-center gap-2 text-sm text-green-600 font-bold relative z-10">
                                            <ArrowTrendingUpIcon className="w-4 h-4" />
                                            <span>Positive Trend</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    {/* Rating Distribution */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                        <h3 className="text-lg font-bold text-gray-900 mb-6">Rating Distribution</h3>
                                        <div className="space-y-4">
                                            {[5, 4, 3, 2, 1].map((star) => {
                                                const count = businessData.reviews.filter(r => r.rating === star).length;
                                                const total = businessData.reviews.length;
                                                const percentage = total > 0 ? (count / total) * 100 : 0;
                                                return (
                                                    <div key={star} className="flex items-center gap-3">
                                                        <span className="w-3 text-sm font-bold text-gray-600">{star}</span>
                                                        <StarIcon className="w-4 h-4 text-yellow-400" />
                                                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                                                                style={{ width: `${percentage}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="w-8 text-sm text-gray-400 text-right">{count}</span>
                                                    </div>
                                                );
                                            })}
                                            <div className="pt-6 mt-2 text-center border-t border-gray-100">
                                                <div className="text-3xl font-bold text-gray-900">{businessData.reviews.length}</div>
                                                <div className="text-gray-400 text-sm">Total Reviews Collected</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Main Engagement Chart */}
                                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col justify-between">
                                        <div className="flex justify-between items-center mb-6">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">Weekly Engagement</h3>
                                                <p className="text-sm text-gray-400">QR Scans vs Reviews</p>
                                            </div>
                                            <select className="bg-gray-50 border border-gray-100 text-sm font-bold text-gray-600 rounded-lg px-3 py-2 outline-none">
                                                <option>Last 7 Days</option>
                                                <option>Last 30 Days</option>
                                            </select>
                                        </div>

                                        <div className="h-64 flex items-end justify-between gap-4 px-4 pb-4 border-b border-gray-50 relative">
                                            {/* Mock Trend Line BG */}
                                            <svg className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none opacity-10" preserveAspectRatio="none">
                                                <path d="M0,250 C100,200 200,50 300,150 C400,250 500,50 600,100 L600,250 L0,250 Z" fill="currentColor" className="text-blue-600" />
                                            </svg>

                                            {[65, 40, 75, 55, 80, 95, 85].map((h, i) => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-2 z-10 relative">
                                                    <div className="w-full relative group flex gap-1 items-end justify-center h-full">
                                                        {/* Reviews Bar */}
                                                        <div
                                                            className={`w-3 rounded-t-sm transition-all duration-500 bg-gray-900 group-hover:bg-blue-600`}
                                                            style={{ height: `${h * 0.6}%` }}
                                                        ></div>
                                                        {/* Scans Bar */}
                                                        <div
                                                            className={`w-3 rounded-t-sm transition-all duration-500 bg-gray-200 group-hover:bg-blue-200`}
                                                            style={{ height: `${h}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-center gap-6 mt-4">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <div className="w-3 h-3 bg-gray-900 rounded-sm"></div> Reviews
                                            </div>
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
                                                <div className="w-3 h-3 bg-gray-200 rounded-sm"></div> Scans
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- PRODUCTS TAB --- */}
                        {activeTab === 'products' && (
                            <motion.div
                                key="products"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                {/* Products Header Stats */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -mr-4 -mt-4"></div>
                                        <h4 className="text-slate-500 font-medium mb-1 relative z-10">Top Performer</h4>
                                        <div className="text-2xl font-bold text-slate-900 mb-1 relative z-10 truncate">
                                            {businessData.products?.sort((a, b) => b.rating - a.rating)[0].name}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-orange-600 font-bold relative z-10">
                                            <TrophyIcon className="w-4 h-4" />
                                            <span>Most Loved Item</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4"></div>
                                        <h4 className="text-slate-500 font-medium mb-1 relative z-10">Total Portfolio</h4>
                                        <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10">
                                            {businessData.products?.length} Items
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-blue-600 font-bold relative z-10">
                                            <ShoppingBagIcon className="w-4 h-4" />
                                            <span>Active Menu</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 relative overflow-hidden">
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4"></div>
                                        <h4 className="text-slate-500 font-medium mb-1 relative z-10">Menu Rating</h4>
                                        <div className="text-3xl font-bold text-slate-900 mb-1 relative z-10">
                                            {(businessData.products?.reduce((acc, curr) => acc + curr.rating, 0) / businessData.products?.length).toFixed(1)}
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-green-600 font-bold relative z-10">
                                            <StarIcon className="w-4 h-4" />
                                            <span>Average Score</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {businessData.products?.map((product) => (
                                        <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-800 shadow-sm">
                                                    {product.category}
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-900 line-clamp-1" title={product.name}>{product.name}</h3>
                                                    <span className="text-slate-900 font-bold">{product.price}</span>
                                                </div>

                                                <div className="flex items-center gap-4 mb-4 text-sm text-slate-500">
                                                    <div className="flex items-center gap-1">
                                                        <StarIcon className="w-4 h-4 text-yellow-400" />
                                                        <span className="font-bold text-slate-700">{product.rating}</span>
                                                        <span className="text-xs">({product.reviews})</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        {product.trend === 'up' ? (
                                                            <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                                                        ) : product.trend === 'down' ? (
                                                            <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />
                                                        ) : (
                                                            <span className="text-slate-300 font-bold">-</span>
                                                        )}
                                                        <span className={`text-xs font-medium ${product.trend === 'up' ? 'text-green-600' :
                                                            product.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                                                            }`}>
                                                            {product.trend === 'up' ? 'Trending' : product.trend === 'down' ? 'Cooling' : 'Stable'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button className="w-full py-2.5 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center justify-center gap-2">
                                                    <DocumentTextIcon className="w-4 h-4" />
                                                    View Reviews
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* --- TEAM TAB --- */}
                        {activeTab === 'team' && (
                            <motion.div
                                key="team"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">Team Performance</h3>
                                            <p className="text-slate-500 text-sm mt-1">Track which team members are delivering the best service.</p>
                                        </div>
                                        <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                                            Export Report
                                        </button>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50">
                                                <tr>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Team Member</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Role</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Rating</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Customer Selections</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {businessData.team?.map((member) => (
                                                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-4">
                                                                <img src={member.image} alt={member.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                                                                <div>
                                                                    <div className="font-bold text-slate-900">{member.name}</div>
                                                                    <div className="text-xs text-slate-400 font-medium">ID: #{1000 + member.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-6 text-slate-600 font-medium">
                                                            {member.role}
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-900">{member.rating}</span>
                                                                <div className="flex text-yellow-400">
                                                                    {[...Array(5)].map((_, i) => (
                                                                        <StarIcon key={i} className={`w-3 h-3 ${i < Math.floor(member.rating) ? 'fill-current' : 'text-slate-200'}`} />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex-1 w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div
                                                                        className="h-full bg-blue-500 rounded-full"
                                                                        style={{ width: `${(member.selections / 300) * 100}%` }}
                                                                    ></div>
                                                                </div>
                                                                <span className="text-sm font-bold text-slate-700">{member.selections}</span>
                                                            </div>
                                                            <p className="text-xs text-slate-400 mt-1">Customers selected this month</p>
                                                        </td>
                                                        <td className="p-6">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${member.status === 'Legend' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                                member.status === 'Star' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                                    member.status === 'Rising' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                                        'bg-slate-50 text-slate-600 border-slate-100'
                                                                }`}>
                                                                {member.status === 'Legend' && <FireIcon className="w-3 h-3" />}
                                                                {member.status === 'Star' && <StarIcon className="w-3 h-3" />}
                                                                {member.status === 'Rising' && <ArrowTrendingUpIcon className="w-3 h-3" />}
                                                                {member.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- COMPETITOR SPY TAB --- */}
                        {activeTab === 'competitors' && (
                            <motion.div
                                key="competitors"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                {/* Header / spy mode banner */}
                                <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
                                    <div className="absolute top-0 right-0 p-32 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                    <div className="absolute bottom-0 left-0 p-24 bg-purple-600/10 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none"></div>

                                    <div className="relative z-10 flex justify-between items-end">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30 uppercase tracking-widest">
                                                    Live Intelligence
                                                </span>
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                            </div>
                                            <h2 className="text-3xl font-bold text-white mb-2">Market Watch: Jaipur, C-Scheme</h2>
                                            <p className="text-slate-400 max-w-xl">
                                                Tracking real-time sentiment and reviews for <span className="text-white font-bold">{businessData.type}s</span> in your area.
                                            </p>
                                        </div>
                                        <div className="hidden md:block text-right">
                                            <div className="text-4xl font-bold text-white mb-1">#{businessData.stats.avgRating > 4.5 ? '1' : '2'}</div>
                                            <div className="text-sm text-slate-500 uppercase tracking-wider font-bold">Your Rank</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Main Competitor Grid */}
                                <div className="grid lg:grid-cols-3 gap-8">
                                    {/* Competitor List */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Your Business (Sticky or highlighted) */}
                                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 shadow-xl text-white relative overflow-hidden transform scale-[1.02] border-2 border-blue-400/50">
                                            <div className="absolute right-0 top-0 w-32 h-64 bg-white/10 skew-x-12 -mr-16 pointer-events-none"></div>

                                            <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between relative z-10">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center font-bold text-xl text-white border border-white/20">
                                                        #1
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                                            {businessData.name} (You)
                                                            <span className="px-2 py-0.5 rounded text-[10px] bg-green-400/20 border border-green-400/30 text-green-300 uppercase font-bold tracking-wider">Market Leader</span>
                                                        </h3>
                                                        <div className="text-sm text-blue-100 flex items-center gap-3 mt-1">
                                                            <span className="flex items-center gap-1 font-medium">
                                                                <StarIcon className="w-3 h-3 text-yellow-300" /> {businessData.stats.avgRating} Rating
                                                            </span>
                                                            <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                                                            <span className="opacity-80">{businessData.stats.reviewsGenerated} reviews</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 border-t md:border-t-0 p-4 md:p-0 border-white/10">
                                                    <div className="text-right">
                                                        <div className="text-[10px] text-blue-200 uppercase font-bold tracking-wider mb-1">Growth</div>
                                                        <div className="font-bold text-green-300 flex items-center gap-1">
                                                            <ArrowTrendingUpIcon className="w-3 h-3" /> +12%
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Competitors */}
                                        {businessData.competitors?.map((comp, idx) => (
                                            <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-slate-300 transition-all group relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 group-hover:bg-slate-400 transition-colors"></div>

                                                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-bold text-xl text-slate-400 border border-slate-100 group-hover:scale-110 transition-transform">
                                                            {idx + 2}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                                                {comp.name}
                                                                {comp.trend === 'up' && <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" title="Trending Up" />}
                                                                {comp.trend === 'down' && <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" title="Trending Down" />}
                                                                {comp.trend === 'stable' && <span className="text-slate-400 text-xs font-bold px-1.5 py-0.5 bg-slate-100 rounded">─</span>}
                                                            </h3>
                                                            <div className="text-sm text-slate-500 flex items-center gap-3 mt-1">
                                                                <span className="flex items-center gap-1">
                                                                    <MapPinIcon className="w-3 h-3 text-slate-400" /> {comp.area}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                                                                <span>{comp.reviews} reviews</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-8 border-t md:border-t-0 p-4 md:p-0 border-slate-50">
                                                        <div className="text-center min-w-[60px]">
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Rating</div>
                                                            <div className="font-bold text-slate-900 flex items-center justify-center gap-1">
                                                                {comp.rating}
                                                                <StarIcon className="w-3 h-3 text-yellow-500" />
                                                            </div>
                                                        </div>
                                                        <div className="text-center min-w-[80px]">
                                                            <div className="text-[10px] text-slate-400 font-bold uppercase mb-1 tracking-wider">Sentiment</div>
                                                            <div className={`font-bold text-xs px-2 py-1 rounded-full border ${comp.sentiment === 'positive' ? 'bg-green-50 text-green-700 border-green-100' :
                                                                comp.sentiment === 'mixed' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                                    'bg-slate-50 text-slate-600 border-slate-100'
                                                                }`}>
                                                                {comp.sentiment.charAt(0).toUpperCase() + comp.sentiment.slice(1)}
                                                            </div>
                                                        </div>
                                                        <button className="p-2 hover:bg-slate-50 rounded-full text-slate-300 hover:text-blue-600 transition-colors">
                                                            <ChevronRightIcon className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Spy Report */}
                                                <div className="mt-4 pt-4 border-t border-slate-50 flex items-start gap-3 bg-slate-50/50 -mx-6 -mb-6 p-4 text-sm mt-4">
                                                    <EyeIcon className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <p className="text-slate-600 italic">
                                                        <span className="font-bold text-slate-700 not-italic">Intel: </span>
                                                        "{comp.insight}"
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Right: AI Insights Panel */}
                                    <div className="space-y-6">
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                                            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                                                <SparklesIcon className="w-5 h-5 text-purple-600" />
                                                Strategy Engine
                                            </h3>
                                            <ul className="space-y-4">
                                                <li className="p-4 bg-purple-50 rounded-xl text-sm text-purple-900 leading-relaxed border border-purple-100 relative overflow-hidden group hover:border-purple-200 transition-colors">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
                                                    <strong className="block mb-1 text-purple-700 uppercase text-xs tracking-wider">Opportunity Alert</strong>
                                                    Competitor <span className="font-bold">"{businessData.competitors?.[2]?.name || 'Rival'}"</span> sees a dip in service quality complaints. Launch a <span className="font-bold underline decoration-purple-300">"Quality Guarantee"</span> campaign now.
                                                </li>
                                                <li className="p-4 bg-blue-50 rounded-xl text-sm text-blue-900 leading-relaxed border border-blue-100 relative overflow-hidden group hover:border-blue-200 transition-colors">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                                                    <strong className="block mb-1 text-blue-700 uppercase text-xs tracking-wider">Pricing Edge</strong>
                                                    You are <span className="font-bold">15% cheaper</span> than premium rivals but have equal ratings. Update Google Ads to highlight <span className="font-bold">"Premium Experience, Fair Prices"</span>.
                                                </li>
                                            </ul>
                                            <button className="w-full mt-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2">
                                                <CodeBracketIcon className="w-4 h-4" />
                                                Auto-Generate Campaign
                                            </button>
                                        </div>

                                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden border border-slate-700">
                                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                                            <h3 className="font-bold mb-4 relative z-10 flex items-center gap-2">
                                                <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                                                Keyword Battleground
                                            </h3>

                                            <div className="space-y-4 relative z-10">
                                                <div>
                                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                        <span>'Quality' (You win)</span>
                                                        <span className="text-green-400">85%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 w-[85%]"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                        <span>'Ambience' ({businessData.competitors?.[1]?.name.split(' ')[0] || 'Rival'} wins)</span>
                                                        <span className="text-blue-400">92%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 w-[92%]"></div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                                                        <span>'Value' ({businessData.competitors?.[0]?.name.split(' ')[0] || 'Rival'})</span>
                                                        <span className="text-orange-400">78%</span>
                                                    </div>
                                                    <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                                        <div className="h-full bg-orange-500 w-[78%]"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-white/10 text-xs text-slate-400 italic">
                                                *Based on last 500 reviews across platforms.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- PROFILE TAB --- */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8"
                            >
                                <div className="flex items-center gap-6 mb-8">
                                    <div className="w-24 h-24 rounded-2xl shadow-lg flex items-center justify-center text-6xl overflow-hidden shrink-0 border border-gray-100 relative bg-gray-50">
                                        <span className="absolute select-none">{businessData.logo}</span>
                                        <img
                                            src={businessData.heroImage}
                                            className="w-full h-full object-cover relative z-10"
                                            alt={businessData.name}
                                            onError={(e) => e.target.style.display = 'none'}
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{businessData.name}</h3>
                                        <p className="text-gray-500">{businessData.type}</p>
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Business Email</label>
                                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-800">contact@{businessData.id}.com</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subscription Plan</label>
                                        <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-green-700 font-bold flex items-center gap-2">
                                            <CheckCircleIcon className="w-5 h-5" />
                                            {businessData.plan} (Active)
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main >
        </div >
    );
}
