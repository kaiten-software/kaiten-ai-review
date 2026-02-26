import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCodeLib from 'qrcode';
import { motion, AnimatePresence } from 'framer-motion';
import { addQROrder, getQROrderByBusinessId, getAllQROrdersByBusinessId, getReviewsByBusiness, deleteReview as deleteReviewSupabase, getClientById, addCallbackRequest } from '../lib/supabase';
import {
    ChartBarIcon,
    CalendarDaysIcon,
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
    CheckIcon,
    ExclamationTriangleIcon,
    GlobeAltIcon,
    ArrowUpRightIcon,
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
    XMarkIcon,
    CubeIcon,
    CreditCardIcon,
    TruckIcon,
    InformationCircleIcon,
    ChatBubbleLeftRightIcon,
    CursorArrowRaysIcon,
    ArrowDownTrayIcon,
    ShieldCheckIcon,
    BoltIcon,
    TicketIcon,
    LifebuoyIcon,
    PaintBrushIcon
} from '@heroicons/react/24/outline';
import { Premium3DQRStands } from '../components/Premium3DQRStands';
import InstagramQRManager from '../components/dashboard/InstagramQRManager';
import CouponManager from '../components/dashboard/CouponManager';

// Mock Data for Multiple Clients
const MOCK_DB = {
    'pizza-corner': {
        id: 'pizza-corner',
        name: 'Pizza Corner',
        address: '78 Indiranagar, Bangalore, Karnataka 560038',
        type: 'Restaurant',
        logo: '🍕',
        email: 'hello@pizzacorner.com',
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
        shipment: {
            orderId: 'ORD-7782-KP',
            status: 'In Transit', // Ordered, Processing, In Transit, Delivered
            estimatedDelivery: 'Wed, Feb 18',
            carrier: 'FedEx Express',
            trackingNumber: '7823 9942 1102',
            currentLocation: 'Jaipur Distribution Center',
            timeline: [
                { status: 'Order Placed', date: 'Feb 14, 2:30 PM', completed: true },
                { status: 'Order Confirmed', date: 'Feb 14, 2:35 PM', completed: true },
                { status: 'Processing', date: 'Feb 15, 10:00 AM', completed: true },
                { status: 'Shipped', date: 'Feb 16, 9:00 AM', completed: true },
                { status: 'In Transit', date: 'Feb 16, 5:45 PM', completed: true, current: true },
                { status: 'Out for Delivery', date: 'Expected Feb 18', completed: false },
                { status: 'Delivered', date: 'Expected Feb 18', completed: false }
            ]
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
            { id: 1, name: 'Gourmet Pizza', category: 'Pizza', rating: 4.8, reviews: 342, price: '₹450', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop', trend: 'up' },
            { id: 2, name: 'Handmade Pasta', category: 'Pasta', rating: 4.9, reviews: 215, price: '₹350', image: 'https://images.unsplash.com/photo-1626844131082-256783844137?w=600&h=400&fit=crop', trend: 'stable' },
            { id: 3, name: 'Juicy Burgers', category: 'Burger', rating: 4.5, reviews: 120, price: '₹250', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop', trend: 'down' },
            { id: 4, name: 'Signature Drinks', category: 'Beverage', rating: 4.7, reviews: 89, price: '₹150', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=400&fit=crop', trend: 'stable' },
            { id: 5, name: 'Sweet Desserts', category: 'Dessert', rating: 4.9, reviews: 310, price: '₹200', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop', trend: 'up' },
            { id: 6, name: 'Fresh Wraps', category: 'Wrap', rating: 4.6, reviews: 140, price: '₹180', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=400&fit=crop', trend: 'up' },
            { id: 7, name: 'Green Salads', category: 'Salad', rating: 4.4, reviews: 95, price: '₹220', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop', trend: 'stable' },
            { id: 8, name: 'Crispy Fries', category: 'Sides', rating: 4.8, reviews: 420, price: '₹120', image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&h=400&fit=crop', trend: 'up' }
        ],
        team: [
            { id: 1, name: 'Chef Marco Rossi', role: 'Head Chef', rating: 5.0, selections: 154, image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400&h=400&fit=crop', status: 'Legend' },
            { id: 2, name: 'Vikram Khanna', role: 'Sous Chef', rating: 4.8, selections: 120, image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', status: 'Star' },
            { id: 3, name: 'Sophia D\'Angelo', role: 'Pastry Chef', rating: 4.9, selections: 95, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', status: 'Rising' },
            { id: 4, name: 'Rahul Verma', role: 'Pizza Chef', rating: 4.6, selections: 45, image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop', status: 'Stable' }
        ]
    },
    'rajs-salon': {
        id: 'rajs-salon',
        name: "Raj's Salon",
        address: "45 Fashion Avenue, Style District, NY 10012",
        type: 'Salon',
        logo: '💇',
        email: 'contact@rajssalon.com',
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
            { id: 1, name: 'Haircut & Styling', category: 'Hair', rating: 4.8, reviews: 142, price: '₹500', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=400&fit=crop', trend: 'up' },
            { id: 2, name: 'Hair Coloring', category: 'Hair', rating: 4.9, reviews: 215, price: '₹2000', image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&h=400&fit=crop', trend: 'stable' },
            { id: 3, name: 'Hair Treatment', category: 'Hair', rating: 4.9, reviews: 180, price: '₹1500', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop', trend: 'up' },
            { id: 4, name: 'Beard Grooming', category: 'Men', rating: 4.7, reviews: 89, price: '₹300', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&h=400&fit=crop', trend: 'stable' },
            { id: 5, name: 'Bridal Package', category: 'Bridal', rating: 5.0, reviews: 45, price: '₹5000', image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop', trend: 'up' }
        ],
        team: [
            { id: 1, name: 'Raj Kumar', role: 'Master Stylist', rating: 5.0, selections: 230, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', status: 'Legend' },
            { id: 2, name: 'Priya Sharma', role: 'Senior Stylist', rating: 4.8, selections: 180, image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', status: 'Star' },
            { id: 3, name: 'Amit Patel', role: 'Barber', rating: 4.6, selections: 95, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', status: 'Rising' },
            { id: 4, name: 'Neha Singh', role: 'Junior Stylist', rating: 4.7, selections: 65, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop', status: 'Rising' }
        ]
    },
    'sharma-electronics': {
        id: 'sharma-electronics',
        name: 'Sharma Electronics',
        address: '12 Tech Park, MG Road, Bangalore',
        type: 'Electronics',
        logo: '⚡',
        email: 'support@sharmaelectronics.com',
        theme: { from: 'from-blue-600', to: 'to-cyan-600', bg: 'bg-blue-50', accent: 'text-blue-600' },
        heroImage: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1080&q=80',
        plan: 'Premium',
        status: 'Active',
        subscriptionExpiry: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days
        stats: {
            qrScans: 2105,
            reviewsGenerated: 1850,
            googlePosts: 1600,
            avgRating: 4.6
        },
        reviews: [
            { id: 301, customer: "Vikram R.", rating: 5, text: "Got an amazing deal on the new iPhone!", date: "2026-02-18", posted: true, source: "Google", contact: "vikram@example.com", membership: "Gold" },
            { id: 302, customer: "Anita D.", rating: 4, text: "Good variety but billing took time.", date: "2026-02-15", posted: true, source: "Google", contact: "anita@example.com", membership: null },
            { id: 303, customer: "Sanjay K.", rating: 5, text: "Best place for laptops in the city.", date: "2026-02-10", posted: true, source: "Google", contact: "sanjay@example.com", membership: "Silver" },
        ],
        competitors: [
            { name: "Croma", area: "Indiranagar", rating: 4.4, reviews: 3500, sentiment: "positive", insight: "Strong online presence and fast delivery.", trend: "up" },
            { name: "Reliance Digital", area: "MG Road", rating: 4.2, reviews: 4100, sentiment: "mixed", insight: "Aggressive pricing but lower service quality.", trend: "stable" },
            { name: "Imagine Store", area: "UB City", rating: 4.8, reviews: 1200, sentiment: "positive", insight: "Premium Apple experience, high loyalty.", trend: "up" }
        ],
        products: [
            { id: 1, name: 'Sony 55" 4K TV', category: 'TV', rating: 4.8, reviews: 120, price: '₹65,000', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', trend: 'up' },
            { id: 2, name: 'Dell XPS 13', category: 'Laptop', rating: 4.9, reviews: 85, price: '₹1,20,000', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', trend: 'stable' },
            { id: 3, name: 'AirPods Pro', category: 'Audio', rating: 4.7, reviews: 310, price: '₹24,900', image: 'https://images.unsplash.com/photo-1504274066651-8d31a536b300?w=800&q=80', trend: 'up' },
        ],
        team: [
            { id: 1, name: 'Rahul Sharma', role: 'Store Manager', rating: 4.9, selections: 450, image: 'https://randomuser.me/api/portraits/men/32.jpg', status: 'Legend' },
            { id: 2, name: 'Priya Verma', role: 'Sales Lead', rating: 4.7, selections: 320, image: 'https://randomuser.me/api/portraits/women/44.jpg', status: 'Star' },
        ]
    }
};

const THEMES = {
    default: {
        id: 'default',
        name: 'Obsidian Executive',
        sidebar: 'bg-slate-950 border-r border-slate-800',
        sidebarGradient: 'from-slate-900 via-slate-950 to-black',
        sidebarText: 'text-white',
        sidebarMuted: 'text-slate-400',
        sidebarHoverText: 'hover:text-white',
        sidebarHoverBg: 'hover:bg-white/5',
        sidebarBorder: 'border-slate-800',
        logoBg: 'bg-white/10 border-white/10 text-white',
        pageBg: 'bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100',
        pageText: 'text-slate-900',
        pageTextMuted: 'text-slate-500',
        activeBg: 'bg-white/10 backdrop-blur-sm',
        activeText: 'text-white',
        activeBorder: 'border-white/10',
        iconColor: 'text-blue-400',
        indicator: 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]',
        button: 'bg-slate-900 hover:bg-black text-white shadow-xl shadow-slate-900/20',
        accent: 'text-slate-800',
        lightAccent: 'bg-slate-100',
        borderColor: 'border-slate-200'
    },
    aurora: {
        id: 'aurora',
        name: 'Aurora Borealis',
        sidebar: 'bg-cyan-950 border-r border-cyan-900',
        sidebarGradient: 'from-cyan-900 via-teal-900 to-emerald-950',
        sidebarText: 'text-white',
        sidebarMuted: 'text-cyan-200/70',
        sidebarHoverText: 'hover:text-white',
        sidebarHoverBg: 'hover:bg-white/10',
        sidebarBorder: 'border-cyan-900',
        logoBg: 'bg-white/10 border-white/10 text-white',
        pageBg: 'bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-cyan-50 to-emerald-50',
        pageText: 'text-slate-900',
        pageTextMuted: 'text-slate-500',
        activeBg: 'bg-gradient-to-r from-cyan-400/10 to-emerald-400/10 backdrop-blur-md',
        activeText: 'text-cyan-300',
        activeBorder: 'border-cyan-500/20',
        iconColor: 'text-cyan-300',
        indicator: 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.6)]',
        button: 'bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-xl shadow-cyan-500/20',
        accent: 'text-cyan-800',
        lightAccent: 'bg-cyan-50',
        borderColor: 'border-cyan-100'
    },
    sunset: {
        id: 'sunset',
        name: 'Golden Hour',
        sidebar: 'bg-orange-950 border-r border-orange-900',
        sidebarGradient: 'from-orange-900 via-red-950 to-rose-950',
        sidebarText: 'text-white',
        sidebarMuted: 'text-orange-200/70',
        sidebarHoverText: 'hover:text-white',
        sidebarHoverBg: 'hover:bg-white/10',
        sidebarBorder: 'border-orange-900',
        logoBg: 'bg-white/10 border-white/10 text-white',
        pageBg: 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-50 via-orange-50 to-rose-50',
        pageText: 'text-slate-900',
        pageTextMuted: 'text-slate-500',
        activeBg: 'bg-gradient-to-r from-orange-500/10 to-red-500/10',
        activeText: 'text-orange-200',
        activeBorder: 'border-orange-500/20',
        iconColor: 'text-orange-200',
        indicator: 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]',
        button: 'bg-gradient-to-r from-orange-600 to-red-600 hover:shadow-orange-500/20 text-white shadow-xl',
        accent: 'text-orange-800',
        lightAccent: 'bg-orange-50',
        borderColor: 'border-orange-100'
    },
    lavender: {
        id: 'lavender',
        name: 'Royal Aether',
        sidebar: 'bg-indigo-950 border-r border-indigo-900',
        sidebarGradient: 'from-indigo-900 via-purple-900 to-fuchsia-950',
        sidebarText: 'text-white',
        sidebarMuted: 'text-indigo-200/70',
        sidebarHoverText: 'hover:text-white',
        sidebarHoverBg: 'hover:bg-white/10',
        sidebarBorder: 'border-indigo-900',
        logoBg: 'bg-white/10 border-white/10 text-white',
        pageBg: 'bg-[conic-gradient(at_bottom_left,_var(--tw-gradient-stops))] from-indigo-50 via-purple-50 to-pink-50',
        pageText: 'text-slate-900',
        pageTextMuted: 'text-slate-500',
        activeBg: 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10',
        activeText: 'text-indigo-200',
        activeBorder: 'border-indigo-500/20',
        iconColor: 'text-indigo-300',
        indicator: 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]',
        button: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/20',
        accent: 'text-indigo-800',
        lightAccent: 'bg-indigo-50',
        borderColor: 'border-indigo-100'
    },

    platinum: {
        id: 'platinum',
        name: 'Premium Light',
        sidebar: 'bg-white border-r border-slate-200',
        sidebarGradient: 'from-white via-slate-50 to-slate-100',
        sidebarText: 'text-slate-900',
        sidebarMuted: 'text-slate-500',
        sidebarHoverText: 'hover:text-slate-900',
        sidebarHoverBg: 'hover:bg-slate-100',
        sidebarBorder: 'border-slate-200',
        logoBg: 'bg-slate-100 border-slate-200 text-slate-900',
        pageBg: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white via-slate-50 to-gray-100',
        pageText: 'text-slate-900',
        pageTextMuted: 'text-slate-500',
        activeBg: 'bg-slate-100',
        activeText: 'text-slate-900',
        activeBorder: 'border-slate-300',
        iconColor: 'text-slate-700',
        indicator: 'bg-slate-900 shadow-[0_0_15px_rgba(15,23,42,0.3)]',
        button: 'bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10',
        accent: 'text-slate-900',
        lightAccent: 'bg-slate-100',
        borderColor: 'border-slate-200'
    }
};

export default function ClientDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('dashboard');
    const [businessData, setBusinessData] = useState(null);
    const [productCategory, setProductCategory] = useState('All');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [qrLoading, setQrLoading] = useState(true);
    const [plateAddress, setPlateAddress] = useState('');
    const [plateQuantity, setPlateQuantity] = useState(1);
    const [upiReference, setUpiReference] = useState('');
    const [plateOrderStatus, setPlateOrderStatus] = useState('idle'); // idle, processing, success
    const [showPaymentPopup, setShowPaymentPopup] = useState(false);
    const [ordersList, setOrdersList] = useState([]);
    const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);
    const [currentTheme, setCurrentTheme] = useState('default');
    const [showCallModal, setShowCallModal] = useState(false);
    const [openFaq, setOpenFaq] = useState(null);
    const [showCallbackModal, setShowCallbackModal] = useState(false);
    const [callbackForm, setCallbackForm] = useState({ contact_name: '', phone: '', preferred_time: '', message: '' });
    const [callbackSubmitting, setCallbackSubmitting] = useState(false);
    const [callbackSuccess, setCallbackSuccess] = useState(false);
    const qrStandRef = useRef(null);

    const handleDownloadQRStand = async () => {
        try {
            // Design configs matching Premium3DQRStands
            const designConfigs = [
                { topColor1: '#1e40af', topColor2: '#60a5fa', bottomColor1: '#1e293b', bottomColor2: '#334155', accent: '#3b82f6', bgColor: '#dbeafe', ctaText: "Love Our Food?" },
                { topColor1: '#047857', topColor2: '#34d399', bottomColor1: '#064e3b', bottomColor2: '#065f46', accent: '#10b981', bgColor: '#d1fae5', ctaText: "Enjoyed Your Meal?" },
                { topColor1: '#7c3aed', topColor2: '#c084fc', bottomColor1: '#581c87', bottomColor2: '#6b21a8', accent: '#a855f7', bgColor: '#f3e8ff', ctaText: "Rate Your Experience" },
                { topColor1: '#dc2626', topColor2: '#fb923c', bottomColor1: '#7c2d12', bottomColor2: '#9a3412', accent: '#f97316', bgColor: '#fed7aa', ctaText: "Share Your Love!" },
                { topColor1: '#0891b2', topColor2: '#22d3ee', bottomColor1: '#164e63', bottomColor2: '#155e75', accent: '#06b6d4', bgColor: '#cffafe', ctaText: "Tell Us Your Thoughts" },
            ];
            const cfg = designConfigs[activeDesign] || designConfigs[0];

            // Canvas dimensions (2x for quality)
            const W = 400, H = 680;
            const canvas = document.createElement('canvas');
            canvas.width = W;
            canvas.height = H;
            const ctx = canvas.getContext('2d');

            // --- BG ---
            const bgGrad = ctx.createLinearGradient(0, 0, W, H);
            bgGrad.addColorStop(0, cfg.bgColor);
            bgGrad.addColorStop(1, cfg.bgColor + 'aa');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, W, H);

            // --- Card dimensions ---
            const cardX = 60, cardY = 40, cardW = 280, cardR = 20;
            const topH = 110, qrSectionH = 240, bottomH = 70;
            const cardH = topH + qrSectionH + bottomH;

            // --- Card shadow ---
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.15)';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetY = 10;
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, cardH, cardR);
            ctx.fill();
            ctx.restore();

            // --- TOP SECTION gradient ---
            const topGrad = ctx.createLinearGradient(0, cardY, 0, cardY + topH);
            topGrad.addColorStop(0, cfg.topColor1);
            topGrad.addColorStop(1, cfg.topColor2);
            ctx.fillStyle = topGrad;
            ctx.beginPath();
            ctx.roundRect(cardX, cardY, cardW, topH, [cardR, cardR, 0, 0]);
            ctx.fill();

            // --- Business emoji ---
            ctx.font = '32px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(businessData.logo || '🏪', cardX + cardW / 2, cardY + 42);

            // --- Business name ---
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 18px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(businessData.name || 'Business', cardX + cardW / 2, cardY + 72);

            // --- Tagline pill ---
            ctx.fillStyle = 'rgba(255,255,255,0.25)';
            const pillW = 110, pillH = 20, pillX = cardX + (cardW - pillW) / 2, pillY = cardY + 80;
            ctx.beginPath();
            ctx.roundRect(pillX, pillY, pillW, pillH, 10);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px system-ui, sans-serif';
            ctx.fillText('⭐ Premium Dining', cardX + cardW / 2, pillY + 14);

            // --- WHITE MIDDLE SECTION ---
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(cardX, cardY + topH, cardW, qrSectionH);

            // CTA text
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 16px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(cfg.ctaText, cardX + cardW / 2, cardY + topH + 28);

            ctx.fillStyle = '#64748b';
            ctx.font = '11px system-ui, sans-serif';
            ctx.fillText('Scan the QR code below', cardX + cardW / 2, cardY + topH + 46);

            // --- QR CODE ---
            const qrCanvas = document.createElement('canvas');
            const qrSize = 140;
            await QRCodeLib.toCanvas(qrCanvas, publicPageUrl, {
                width: qrSize,
                margin: 1,
                color: { dark: cfg.accent, light: '#ffffff' }
            });

            // QR border box
            const qrX = cardX + (cardW - qrSize - 12) / 2;
            const qrY = cardY + topH + 56;
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = cfg.accent;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(qrX - 4, qrY - 4, qrSize + 20, qrSize + 20, 10);
            ctx.fill();
            ctx.stroke();
            ctx.drawImage(qrCanvas, qrX + 4, qrY + 4, qrSize, qrSize);

            // --- Scan/Rate/Share icons ---
            const iconY = cardY + topH + qrSectionH - 28;
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillStyle = '#475569';
            ctx.fillText('📱 Scan', cardX + cardW * 0.25, iconY + 14);
            ctx.fillText('⭐ Rate', cardX + cardW * 0.5, iconY + 14);
            ctx.fillText('❤️ Share', cardX + cardW * 0.75, iconY + 14);

            // --- BOTTOM SECTION ---
            const botY = cardY + topH + qrSectionH;
            const botGrad = ctx.createLinearGradient(0, botY, 0, botY + bottomH);
            botGrad.addColorStop(0, cfg.bottomColor1);
            botGrad.addColorStop(1, cfg.bottomColor2);
            ctx.fillStyle = botGrad;
            ctx.beginPath();
            ctx.roundRect(cardX, botY, cardW, bottomH, [0, 0, cardR, cardR]);
            ctx.fill();

            ctx.fillStyle = '#FDE68A';
            ctx.font = 'bold 15px system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✦ RankBag ✦', cardX + cardW / 2, botY + 22);

            ctx.fillStyle = 'rgba(255,255,255,0.9)';
            ctx.font = 'bold 9px system-ui, sans-serif';
            ctx.letterSpacing = '0.25em';
            ctx.fillText('AI REVIEW', cardX + cardW / 2, botY + 38);

            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = '8px system-ui, sans-serif';
            ctx.fillText('Powered by Kaiten Software', cardX + cardW / 2, botY + 54);

            // --- Download ---
            const link = document.createElement('a');
            link.download = `RankBag-Standee-${businessData.name || 'QR'}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();

        } catch (error) {
            console.error('Error generating QR standee: ', error);
            alert('Failed to generate the standee. Please try again.');
        }
    };

    // Fetch all orders
    useEffect(() => {
        if (businessData?.business_id || businessData?.id) {
            loadAllOrders();
        }
    }, [businessData]);

    const loadAllOrders = async () => {
        const id = businessData?.business_id || businessData?.id;
        if (!id) return;
        const result = await getAllQROrdersByBusinessId(id);
        if (result.success && result.data) {
            setOrdersList(result.data);
        }
    };

    // Helper to get display data for selected order
    const trackingInfo = useMemo(() => {
        if (!selectedTrackingOrder) return null;
        const order = selectedTrackingOrder;

        // If manual shipment info exists (from Admin)
        if (order.shipment_info && Object.keys(order.shipment_info).length > 0) {
            return {
                ...order.shipment_info,
                carrier: order.shipment_info.courier || order.shipment_info.carrier || 'Unknown Carrier',
                status: order.status,
                orderId: order.id.substring(0, 8).toUpperCase(),
                design: order.design_info
            };
        }
        // Generate default view from status
        const isProcessing = ['Processing', 'In Transit', 'Delivered'].includes(order.status);
        const isInTransit = ['In Transit', 'Delivered'].includes(order.status);
        const isDelivered = order.status === 'Delivered';

        return {
            orderId: order.id.substring(0, 8).toUpperCase(),
            status: order.status,
            estimatedDelivery: 'Soon',
            carrier: 'Pending Assignment',
            trackingNumber: 'Processing',
            currentLocation: 'Order Center',
            design: order.design_info,
            timeline: [
                { status: 'Order Placed', date: new Date(order.created_at).toLocaleDateString(), completed: true },
                { status: 'Payment Verified', date: new Date(order.created_at).toLocaleDateString(), completed: true },
                { status: 'Processing', date: isProcessing ? 'Started' : 'Pending', completed: isProcessing },
                { status: 'In Transit', date: isInTransit ? 'On the way' : 'Pending', completed: isInTransit, current: order.status === 'In Transit' },
                { status: 'Delivered', date: isDelivered ? 'Delivered' : 'Pending', completed: isDelivered }
            ]
        };
    }, [selectedTrackingOrder]);

    // NEW: Active Design State for QR Gallery
    const [activeDesign, setActiveDesign] = useState(0);

    const qrDesigns = [
        {
            id: 0,
            name: "Corporate Blue",
            style: "Professional & Trustworthy",
            description: "Classic blue corporate design perfect for professional businesses and service providers.",
            material: "5mm Clear Acrylic",
            dimensions: "5\" × 7\" × 0.2\"",
            color: "bg-blue-600"
        },
        {
            id: 1,
            name: "Modern Green",
            style: "Fresh & Eco-Friendly",
            description: "Vibrant green design ideal for health, wellness, and eco-conscious businesses.",
            material: "5mm Clear Acrylic",
            dimensions: "5\" × 7\" × 0.2\"",
            color: "bg-emerald-600"
        },
        {
            id: 2,
            name: "Premium Purple",
            style: "Luxury & Creative",
            description: "Elegant purple design for upscale venues, salons, and creative businesses.",
            material: "5mm Clear Acrylic",
            dimensions: "5\" × 7\" × 0.2\"",
            color: "bg-purple-600"
        },
        {
            id: 3,
            name: "Orange Energy",
            style: "Bold & Energetic",
            description: "Vibrant orange design perfect for restaurants, cafes, and entertainment venues.",
            material: "5mm Clear Acrylic",
            dimensions: "5\" × 7\" × 0.2\"",
            color: "bg-orange-600"
        },
        {
            id: 4,
            name: "Cyan Tech",
            style: "Modern & Tech-Forward",
            description: "Contemporary cyan design ideal for tech companies and modern service providers.",
            material: "5mm Clear Acrylic",
            dimensions: "5\" × 7\" × 0.2\"",
            color: "bg-cyan-900"
        },
    ];

    const plateId = useMemo(() => {
        if (!businessData) return '';
        // Deterministic ID for preview based on name length or something simple, or random once per session
        // New Format: XXX-XXX-XXX
        return `${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}-${Math.floor(100 + Math.random() * 900)}`;
    }, [businessData]);

    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem('clientLoggedIn');
        const clientId = sessionStorage.getItem('clientId');

        if (!isLoggedIn || !clientId) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            // Only use MOCK_DB for known demo businesses — never fall back to pizza-corner for real clients
            const mockData = MOCK_DB[clientId] ? { ...MOCK_DB[clientId] } : {
                id: clientId,
                name: '',
                address: '',
                type: 'Business',
                logo: '🏢',
                email: '',
                theme: { from: 'from-slate-600', to: 'to-slate-800', bg: 'bg-slate-50', accent: 'text-slate-600' },
                heroImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1080&q=80',
                plan: 'Premium',
                status: 'Active',
                stats: { qrScans: 0, reviewsGenerated: 0, googlePosts: 0, avgRating: 0 },
                reviews: [],
                competitors: [],
                products: [],
                team: []
            };
            let data = { ...mockData };

            // Load real client data from Supabase
            try {
                const { success, data: clientData } = await getClientById(clientId);
                if (success && clientData) {
                    console.log("Loaded real client data:", clientData);

                    // Build products from services if services are objects with name/price/image
                    let realProducts = data.products;
                    if (clientData.services && clientData.services.length > 0) {
                        const serviceObjects = clientData.services.filter(s => typeof s === 'object' && s !== null && s.name);
                        if (serviceObjects.length > 0) {
                            realProducts = serviceObjects.map((s, i) => ({
                                id: i + 1,
                                name: s.name,
                                category: s.category || clientData.type || 'Service',
                                rating: 0,
                                reviews: 0,
                                price: s.price || '',
                                image: s.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
                                trend: 'stable'
                            }));
                        }
                    }

                    // Build team from staff if available
                    let realTeam = data.team;
                    if (clientData.staff && clientData.staff.length > 0) {
                        const staffObjects = clientData.staff.filter(s => typeof s === 'object' && s !== null && s.name);
                        if (staffObjects.length > 0) {
                            realTeam = staffObjects.map((s, i) => ({
                                id: i + 1,
                                name: s.name,
                                role: s.role || 'Team Member',
                                rating: 0,
                                selections: 0,
                                image: s.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(s.name)}&background=random`,
                                status: 'Active'
                            }));
                        }
                    }

                    data = {
                        ...data,
                        id: clientData.id,
                        name: clientData.name,
                        address: clientData.address,
                        logo: clientData.logo,
                        status: 'Active',
                        products: realProducts,
                        team: realTeam,
                        instagram_url: clientData.instagram_url,
                        ig_offer_title: clientData.ig_offer_title,
                        ig_offer_desc: clientData.ig_offer_desc,
                        ig_offer_validity: clientData.ig_offer_validity,
                    };
                }
            } catch (err) {
                console.error("Supabase client load error:", err);
            }

            // Load ONLY real reviews from Supabase — never mix mock reviews for real businesses
            try {
                const { success, data: supabaseReviews } = await getReviewsByBusiness(clientId);
                const isRealBusiness = !MOCK_DB[clientId]; // true if not a demo business

                if (success && supabaseReviews.length > 0) {
                    const formattedReviews = supabaseReviews.map(r => ({
                        id: r.id,
                        customer: r.customer_name || "Anonymous",
                        rating: r.rating,
                        text: r.review_text,
                        date: new Date(r.created_at).toISOString().split('T')[0],
                        posted: r.posted_to_google,
                        source: r.posted_to_google ? "Google" : "Direct",
                        contact: r.customer_email || r.customer_phone || "",
                        membership: null,
                        businessId: r.business_id
                    }));

                    // For real businesses: only show real reviews
                    // For demo businesses: merge with mock reviews
                    data.reviews = isRealBusiness
                        ? formattedReviews
                        : [...formattedReviews, ...data.reviews];

                    const totalReviews = data.reviews.length;
                    const totalRating = data.reviews.reduce((sum, r) => sum + r.rating, 0);
                    const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : data.stats.avgRating;

                    data.stats = {
                        ...data.stats,
                        reviewsGenerated: totalReviews,
                        avgRating: parseFloat(avgRating)
                    };
                } else if (isRealBusiness) {
                    // Real business with no reviews yet — show empty state, no mock data
                    data.reviews = [];
                    data.stats = { ...data.stats, reviewsGenerated: 0, avgRating: 0 };
                }
            } catch (err) {
                console.error("Supabase load error:", err);
            }

            setBusinessData(data);
            if (data.address) {
                setPlateAddress(data.address);
            }
        };

        loadData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('clientUser');
        sessionStorage.removeItem('clientId'); // Keep clientId removal for consistency with useEffect
        navigate('/login');
    };

    const deleteReview = async (id) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            // Optimistic Update
            const updatedReviews = businessData.reviews.filter(r => r.id !== id);
            setBusinessData(prev => ({ ...prev, reviews: updatedReviews }));

            // Delete from Supabase
            // Check if it's a UUID (Supabase ID) vs Number (Mock ID)
            if (typeof id === 'string' && id.length > 10) {
                await deleteReviewSupabase(id);
            }
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
    const publicPageUrl = `${window.location.origin}/business/${businessData.id}/review`;
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
            {/* Premium Sidebar - Dynamic Theme */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 ${THEMES[currentTheme].sidebar} ${THEMES[currentTheme].sidebarText} flex flex-col flex-shrink-0 transition-transform duration-300 shadow-xl md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Mobile Close Button */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 md:hidden text-white/50 hover:text-white p-1"
                >
                    <XMarkIcon className="w-6 h-6" />
                </button>
                {/* Clean Gradient - Dynamic */}
                <div className={`absolute inset-0 z-0 bg-gradient-to-b ${THEMES[currentTheme].sidebarGradient}`}></div>

                {/* Content Layer */}
                <div className="relative z-10 flex-1 flex flex-col px-6 py-6 min-h-0 overflow-hidden">
                    <div className="flex items-center gap-4 mb-10 shrink-0">
                        <div className={`w-10 h-10 rounded-lg ${THEMES[currentTheme].logoBg} backdrop-blur-sm flex items-center justify-center text-xl shadow-lg border shrink-0`}>
                            {businessData.logo}
                        </div>
                        <div className="overflow-hidden">
                            <h2 className={`text-base font-bold leading-tight truncate ${THEMES[currentTheme].sidebarText}`}>{businessData.name}</h2>
                            <span className="text-[10px] uppercase tracking-wider font-semibold opacity-70 mt-0.5 inline-block">
                                {businessData.plan} Account
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-y-auto min-h-0 -mx-2 px-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] space-y-1.5">
                        <nav className="space-y-1.5">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
                                { id: 'reviews', label: 'Reviews', icon: StarIcon },
                                { id: 'products', label: 'Products', icon: ShoppingBagIcon },
                                { id: 'team', label: 'Team', icon: UserGroupIcon },

                                { id: 'qr-plate', label: 'Order QR Stand', icon: CubeIcon },
                                { id: 'tracking', label: 'Track Shipment', icon: TruckIcon },
                                { id: 'coupons', label: 'Coupon Verification', icon: TicketIcon },
                                { id: 'support', label: 'Help Center', icon: LifebuoyIcon },
                                { id: 'profile', label: 'Settings', icon: Cog6ToothIcon },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 group ${activeTab === item.id
                                        ? `${THEMES[currentTheme].activeBg} ${THEMES[currentTheme].activeText} border ${THEMES[currentTheme].activeBorder}`
                                        : `${THEMES[currentTheme].sidebarMuted} ${THEMES[currentTheme].sidebarHoverText} ${THEMES[currentTheme].sidebarHoverBg}`
                                        }`}
                                >
                                    <item.icon className={`w-5 h-5 ${activeTab === item.id ? THEMES[currentTheme].iconColor : `${THEMES[currentTheme].sidebarMuted} group-hover:text-current`}`} />
                                    <span className="text-sm">{item.label}</span>
                                    {activeTab === item.id && (
                                        <div className={`ml-auto w-1.5 h-1.5 rounded-full ${THEMES[currentTheme].indicator}`}></div>
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className={`mt-auto pt-6 border-t ${THEMES[currentTheme].sidebarBorder}`}>
                            <button
                                onClick={handleLogout}
                                className={`flex items-center gap-3 font-medium transition-colors w-full px-3 py-2.5 rounded-lg group ${THEMES[currentTheme].sidebarMuted} ${THEMES[currentTheme].sidebarHoverText} ${THEMES[currentTheme].sidebarHoverBg}`}
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 group-hover:text-red-400 transition-colors" />
                                <span className="text-sm">Sign Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className={`flex-1 flex flex-col relative overflow-hidden transition-colors duration-500 ${THEMES[currentTheme].pageBg}`}>
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
                                <h1 className={`text-3xl font-bold tracking-tight ${THEMES[currentTheme].pageText}`}>
                                    {activeTab === 'dashboard' ? 'Overview' :
                                        activeTab === 'reviews' ? 'Review Management' :
                                            activeTab === 'products' ? 'Product Portfolio' :
                                                activeTab === 'team' ? 'Team Performance' :
                                                    activeTab === 'qr' ? 'QR Code Assets' :
                                                        activeTab === 'qr-plate' ? 'Get Premium QR Stand' :
                                                            activeTab === 'tracking' ? 'Shipment Tracking' :
                                                                activeTab === 'analytics' ? 'Analytics & Insights' :
                                                                    activeTab === 'competitors' ? 'Competitor Spy' :
                                                                        activeTab === 'support' ? 'Help Center' :
                                                                            'Business Settings'}
                                </h1>
                                <p className={`mt-1 ${THEMES[currentTheme].pageTextMuted}`}>
                                    {activeTab === 'dashboard' ? `Welcome back to ${businessData.name}.` : 'Manage your business performance.'}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 self-end md:self-auto">
                            <button
                                onClick={() => { setShowCallbackModal(true); setCallbackSuccess(false); setCallbackForm({ contact_name: '', phone: '', preferred_time: '', message: '' }); }}
                                className="p-2 text-slate-400 hover:text-blue-600 bg-white rounded-full border border-slate-200 shadow-sm relative transition-colors"
                                title="Request a Callback"
                            >
                                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
                                <PhoneIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigate(`/business/${businessData.id}`, { state: { from: 'client-dashboard' } })}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-white font-bold shadow-lg transition-all text-sm md:text-base ${THEMES[currentTheme].button}`}
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
                                            <button onClick={() => setActiveTab('qr-plate')} className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors flex items-center gap-2">
                                                <QrCodeIcon className="w-5 h-5" />
                                                Get QR Stand
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
                                {/* Left: Premium 2D Printable Card Design */}
                                <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-4 sm:p-8 md:p-10 flex flex-col items-center relative overflow-hidden group">

                                    {/* The Printable Card Itself */}
                                    <div id="printable-qr-card" className={`relative w-full max-w-[300px] sm:max-w-[320px] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-500 hover:scale-[1.02] flex flex-col items-center text-center bg-gradient-to-br ${theme.from} ${theme.to}`}>

                                        {/* Glass Overlay/Shine */}
                                        <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></div>
                                        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/20 rounded-full blur-3xl"></div>
                                        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-black/10 rounded-full blur-3xl"></div>

                                        {/* Content Container */}
                                        <div className="relative z-10 flex flex-col items-center justify-between gap-6 w-full p-8">

                                            {/* Header */}
                                            <div className="flex flex-col items-center gap-2 pt-2">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-2xl shadow-sm border border-white/30">
                                                    {businessData.logo}
                                                </div>
                                                <h3 className="text-white font-bold text-xl tracking-tight leading-tight drop-shadow-md">
                                                    {businessData.name}
                                                </h3>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(i => (
                                                        <StarIcon key={i} className="w-4 h-4 text-yellow-400 drop-shadow-sm" />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* QR Code Frame */}
                                            <div className="bg-white p-4 rounded-2xl shadow-xl w-48 h-48 flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                                                <img
                                                    src={qrCodeUrl}
                                                    alt="Scan to Review"
                                                    className="w-full h-full object-contain mix-blend-multiply"
                                                />
                                            </div>

                                            {/* Footer CTA */}
                                            <div className="pb-4">
                                                <p className="text-white/90 font-medium text-sm uppercase tracking-widest mb-1">Scan to Review</p>
                                                <div className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/40 shadow-sm">
                                                    <p className="text-white text-xs font-bold flex items-center gap-2">
                                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                                        Takes 30 seconds
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm mx-auto mt-8">
                                        <button
                                            onClick={() => window.open(qrCodeUrl, '_blank')}
                                            className="flex-1 px-6 py-3.5 rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowDownTrayIcon className="w-5 h-5" />
                                            Download PNG
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText(publicPageUrl);
                                                alert('Link copied to clipboard!');
                                            }}
                                            className="px-6 py-3.5 rounded-xl bg-white text-slate-700 font-bold border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all flex items-center justify-center"
                                            title="Copy Link"
                                        >
                                            <LinkIcon className="w-5 h-5" />
                                        </button>
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

                        {/* --- QR PLATE ORDER TAB --- */}
                        {activeTab === 'qr-plate' && (
                            <motion.div
                                key="qr-plate"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="grid lg:grid-cols-2 gap-12 items-start"
                            >
                                {/* Left: The "AI" generated Plate Preview - REDESIGNED */}
                                <div className="space-y-6">
                                    {/* Clean Preview Container - NO OVERLAP */}
                                    <div className="bg-white p-8 rounded-3xl border-2 border-slate-200 shadow-lg">

                                        {/* QR Stand Preview - CRISP & CLEAR */}
                                        <div ref={qrStandRef} className="relative w-full h-[600px] flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl overflow-hidden">
                                            {/* Premium 3D QR Stand - HD CRISP */}
                                            <Premium3DQRStands
                                                activeDesign={activeDesign}
                                                qrCodeUrl={publicPageUrl}
                                                businessData={businessData}
                                            />
                                        </div>

                                        {/* Download Option */}
                                        <div className="mt-6 flex justify-center">
                                            <button
                                                onClick={handleDownloadQRStand}
                                                className="px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 font-bold shadow-sm hover:bg-slate-50 active:scale-95 transition-all flex items-center gap-2"
                                            >
                                                <ArrowDownTrayIcon className="w-5 h-5" />
                                                Download Quick Print Version
                                            </button>
                                        </div>

                                        {/* Color Selector - BELOW STAND (NO OVERLAP) */}
                                        <div className="mt-6">
                                            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                                                <SparklesIcon className="w-4 h-4 text-yellow-500" />
                                                Choose Your Design
                                            </h3>
                                            <div className="grid grid-cols-5 gap-3">
                                                {qrDesigns.map((design, idx) => {
                                                    // Get the active class based on design index
                                                    const activeClasses = [
                                                        'bg-blue-600',      // Corporate Blue
                                                        'bg-emerald-600',   // Modern Green
                                                        'bg-purple-600',    // Premium Purple
                                                        'bg-orange-600',    // Orange Energy
                                                        'bg-cyan-900'       // Cyan Tech
                                                    ];

                                                    return (
                                                        <button
                                                            key={design.id}
                                                            onClick={() => setActiveDesign(idx)}
                                                            className={`relative p-3 rounded-xl text-center transition-all duration-300 border-2 ${activeDesign === idx
                                                                ? `${activeClasses[idx]} text-white border-transparent shadow-xl scale-105`
                                                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:shadow-md'
                                                                }`}
                                                        >
                                                            <div className="text-[10px] font-bold uppercase tracking-wide leading-tight break-words">
                                                                {design.name}
                                                            </div>
                                                            {activeDesign === idx && (
                                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                                                                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Design Details - CLEAN */}
                                        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-2xl border border-blue-100">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2.5 bg-white rounded-xl shadow-sm">
                                                    <SparklesIcon className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-black text-slate-900 text-base mb-1">
                                                        {qrDesigns[activeDesign] ? qrDesigns[activeDesign].name : "Select a design"}
                                                    </h4>
                                                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                                                        {qrDesigns[activeDesign] ? qrDesigns[activeDesign].description : ""}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg">
                                                            <CubeIcon className="w-3.5 h-3.5" />
                                                            <span className="font-semibold">{qrDesigns[activeDesign] ? qrDesigns[activeDesign].material : ""}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg">
                                                            <span className="font-mono font-semibold">{qrDesigns[activeDesign] ? qrDesigns[activeDesign].dimensions : ""}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                            <InformationCircleIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">Why order this?</h4>
                                            <p className="text-slate-500 text-sm mt-1">Physical QR stands increase review collection by <span className="text-slate-900 font-bold">300%</span>. Placing this on your counter prompts happy customers to leave feedback instantly.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Order Form */}
                                <div className="space-y-8">
                                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
                                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 mb-2">
                                            <CubeIcon className="w-8 h-8 text-blue-600" />
                                            Order Your Stand
                                        </h2>
                                        <p className="text-slate-500 mb-8">Get this premium acrylic QR stand delivered to your doorstep.</p>

                                        {plateOrderStatus === 'success' ? (
                                            <div className="text-center py-12">
                                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <CheckCircleIcon className="w-10 h-10" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h3>
                                                <p className="text-slate-500 mb-8 max-w-xs mx-auto">Your QR Stand is being prepared. You can track its status in your dashboard.</p>
                                                <button
                                                    onClick={() => setPlateOrderStatus('idle')}
                                                    className="px-6 py-2 text-slate-600 hover:text-slate-900 font-bold"
                                                >
                                                    Order Another
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-6">
                                                {/* Store Address (Read-only) */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">Store Address</label>
                                                    <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 text-slate-500 text-sm">
                                                        {businessData.address || "No store address registered."}
                                                    </div>
                                                </div>

                                                {/* Shipping Address */}
                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="block text-sm font-bold text-slate-700">Shipping Address</label>
                                                        {businessData.address && (
                                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                                <input
                                                                    type="checkbox"
                                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 transition-all"
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setPlateAddress(businessData.address);
                                                                        } else {
                                                                            setPlateAddress('');
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="text-xs font-semibold text-blue-600 group-hover:text-blue-800 transition-colors">Same as Store Address</span>
                                                            </label>
                                                        )}
                                                    </div>
                                                    <textarea
                                                        value={plateAddress}
                                                        onChange={(e) => setPlateAddress(e.target.value)}
                                                        placeholder="Enter delivery address..."
                                                        rows={3}
                                                        className="w-full px-4 py-3 rounded-xl bg-white border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-all shadow-sm focus:shadow-md"
                                                    />
                                                </div>

                                                <div className="flex items-center justify-between mb-4">
                                                    <label className="block text-sm font-bold text-slate-700">Quantity</label>
                                                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                                                        <button
                                                            className="px-3 py-1 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border-r border-slate-200"
                                                            onClick={() => setPlateQuantity(Math.max(1, plateQuantity - 1))}
                                                        >-</button>
                                                        <span className="px-4 py-1 text-slate-900 font-medium font-mono text-center min-w-[3rem]">{plateQuantity}</span>
                                                        <button
                                                            className="px-3 py-1 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors border-l border-slate-200"
                                                            onClick={() => setPlateQuantity(plateQuantity + 1)}
                                                        >+</button>
                                                    </div>
                                                </div>

                                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-slate-600">Premium Acrylic Stand (x{plateQuantity})</span>
                                                        <span className="font-bold text-slate-900">₹{250 * plateQuantity}.00</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-slate-500">Delivery Fee</span>
                                                        <span className="font-bold text-green-600">FREE</span>
                                                    </div>
                                                    <div className="border-t border-slate-200 my-3"></div>
                                                    <div className="flex justify-between items-center text-lg">
                                                        <span className="font-bold text-slate-900">Total</span>
                                                        <span className="font-bold text-blue-600">₹{250 * plateQuantity}.00</span>
                                                    </div>

                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (!plateAddress) {
                                                            alert('Please enter a delivery address');
                                                            return;
                                                        }
                                                        setShowPaymentPopup(true);
                                                    }}
                                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                                                >
                                                    <CreditCardIcon className="w-6 h-6" />
                                                    Order Now
                                                </button>

                                                <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-1">
                                                    <TruckIcon className="w-3 h-3" />
                                                    Estimated delivery: 3-5 business days
                                                </p>
                                            </div>
                                        )}
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
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">Product Ratings Report</h3>
                                            <p className="text-slate-500 text-sm mt-1">Track all your products and their performance.</p>
                                        </div>
                                        <div className="flex gap-3 items-center w-full md:w-auto">
                                            <select
                                                className="bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 rounded-xl px-4 py-2 outline-none flex-1 md:flex-none cursor-pointer"
                                                value={productCategory}
                                                onChange={(e) => setProductCategory(e.target.value)}
                                            >
                                                <option value="All">All Categories</option>
                                                {[...new Set(businessData.products?.map(p => p.category))].map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            <button className={`px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors ${THEMES[currentTheme].button}`}>
                                                Export Report
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50/50">
                                                <tr>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Product</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Category</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Rating</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider">Trend</th>
                                                    <th className="p-6 font-bold text-slate-500 text-sm uppercase tracking-wider text-right">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {businessData.products
                                                    ?.filter(p => productCategory === 'All' || p.category === productCategory)
                                                    .sort((a, b) => b.rating - a.rating)
                                                    .map((product) => (
                                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                                            <td className="p-6">
                                                                <div className="flex items-center gap-4">
                                                                    <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover shadow-sm bg-slate-100" />
                                                                    <div>
                                                                        <div className="font-bold text-slate-900">{product.name}</div>
                                                                        <div className="text-xs text-slate-400 font-medium">ID: #{2000 + product.id}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-6 text-slate-600 font-medium">
                                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold">{product.category}</span>
                                                            </td>
                                                            <td className="p-6">
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-bold text-slate-900">{product.rating}</span>
                                                                        <div className="flex text-yellow-400">
                                                                            {[...Array(5)].map((_, i) => (
                                                                                <StarIcon key={i} className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-slate-200'}`} />
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <span className="text-xs text-slate-400">{product.reviews} reviews</span>
                                                                </div>
                                                            </td>
                                                            <td className="p-6">
                                                                <div className="flex items-center gap-1.5">
                                                                    {product.trend === 'up' ? (
                                                                        <ArrowTrendingUpIcon className="w-4 h-4 text-green-500" />
                                                                    ) : product.trend === 'down' ? (
                                                                        <ArrowTrendingUpIcon className="w-4 h-4 text-red-500 rotate-180" />
                                                                    ) : (
                                                                        <span className="text-slate-300 font-bold">-</span>
                                                                    )}
                                                                    <span className={`text-xs font-bold ${product.trend === 'up' ? 'text-green-600' :
                                                                        product.trend === 'down' ? 'text-red-500' : 'text-slate-400'
                                                                        }`}>
                                                                        {product.trend === 'up' ? 'Trending' : product.trend === 'down' ? 'Cooling' : 'Stable'}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="p-6 text-right font-bold text-slate-900">
                                                                {product.price}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
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
                                        <button className={`px-4 py-2 text-white rounded-xl text-sm font-bold transition-colors ${THEMES[currentTheme].button}`}>
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
                                                {businessData.team
                                                    ?.sort((a, b) => b.rating - a.rating)
                                                    .map((member) => (
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
                                                                            className={`h-full rounded-full ${THEMES[currentTheme].indicator.split(' ')[0]}`}
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

                        {/* --- TRACKING TAB --- */}
                        {activeTab === 'tracking' && (
                            <motion.div
                                key="tracking"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                {!selectedTrackingOrder ? (
                                    <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
                                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Your QR Stand Orders</h2>
                                        {ordersList.length === 0 ? (
                                            <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <TruckIcon className="w-8 h-8 text-slate-400" />
                                                </div>
                                                <p className="font-bold">No orders placed yet.</p>
                                                <p className="text-sm mt-1 mb-4">You haven't ordered any QR stands.</p>
                                                <button onClick={() => setActiveTab('order')} className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors">
                                                    Order Now
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="overflow-x-auto">
                                                <table className="w-full text-left border-collapse">
                                                    <thead>
                                                        <tr className="border-b border-slate-100">
                                                            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Order ID</th>
                                                            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Date</th>
                                                            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Design</th>
                                                            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider">Status</th>
                                                            <th className="p-4 font-bold text-slate-500 text-xs uppercase tracking-wider text-right">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-50">
                                                        {ordersList.map(order => (
                                                            <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group">
                                                                <td className="p-4 font-mono text-sm font-bold text-slate-700">#{order.id.substring(0, 8).toUpperCase()}</td>
                                                                <td className="p-4 text-sm text-slate-600">{new Date(order.created_at).toLocaleDateString()}</td>
                                                                <td className="p-4">
                                                                    {order.design_info ? (
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 rounded-lg shadow-sm border border-slate-100 flex items-center justify-center shrink-0" style={{ backgroundColor: order.design_info.colorCode || '#ddd' }}></div>
                                                                            <div>
                                                                                <p className="text-sm font-bold text-slate-800">{order.design_info.name}</p>
                                                                                <p className="text-xs text-slate-400">{order.design_info.material || 'Stand'}</p>
                                                                            </div>
                                                                        </div>
                                                                    ) : <span className="text-sm text-slate-400 italic">Standard Design</span>}
                                                                </td>
                                                                <td className="p-4">
                                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                                        order.status === 'In Transit' ? 'bg-blue-100 text-blue-700' :
                                                                            'bg-yellow-100 text-yellow-700'
                                                                        }`}>
                                                                        <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Delivered' ? 'bg-green-500' :
                                                                            order.status === 'In Transit' ? 'bg-blue-500 animate-pulse' :
                                                                                'bg-yellow-500'
                                                                            }`}></span>
                                                                        {order.status}
                                                                    </span>
                                                                </td>
                                                                <td className="p-4 text-right">
                                                                    <button
                                                                        onClick={() => setSelectedTrackingOrder(order)}
                                                                        className="px-4 py-2 bg-white text-blue-600 text-sm font-bold rounded-lg border border-blue-100 hover:bg-blue-50 hover:border-blue-200 transition-colors shadow-sm"
                                                                    >
                                                                        Track Shipment
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        <button
                                            onClick={() => setSelectedTrackingOrder(null)}
                                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors mb-6 group pl-1"
                                        >
                                            <span className="group-hover:-translate-x-1 transition-transform">←</span>
                                            Back to Your Orders
                                        </button>

                                        {trackingInfo && (
                                            <div className="space-y-6">
                                                {/* Active Shipment Card */}
                                                <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl overflow-hidden relative">
                                                    <div className="absolute top-0 right-0 p-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 relative z-10">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${trackingInfo.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                    <span className={`w-2 h-2 rounded-full animate-pulse ${trackingInfo.status === 'Delivered' ? 'bg-green-600' : 'bg-blue-600'}`}></span>
                                                                    {trackingInfo.status}
                                                                </span>
                                                                <span className="text-slate-400 text-sm font-mono">#{trackingInfo.orderId}</span>
                                                            </div>
                                                            <h2 className="text-3xl font-bold text-slate-900">
                                                                {trackingInfo.status === 'Delivered' ? 'Delivered' : `Arriving by ${trackingInfo.estimatedDelivery}`}
                                                            </h2>
                                                            <p className="text-slate-500 mt-1">
                                                                {trackingInfo.status === 'Delivered' ? 'Your package has arrived.' : 'Your premium QR stand is on its way.'}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-sm text-slate-400 font-bold uppercase tracking-wider">Carrier</p>
                                                            <p className="text-xl font-bold text-slate-900">{trackingInfo.carrier}</p>
                                                            <p className="text-sm text-slate-500 font-mono tracking-wide">Tracking #: {trackingInfo.trackingNumber}</p>
                                                        </div>
                                                    </div>

                                                    {/* Visual Progress Bar */}
                                                    <div className="relative mb-12 px-4">
                                                        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                                                        <div
                                                            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 rounded-full transition-all duration-1000"
                                                            style={{
                                                                width: trackingInfo.status === 'Delivered' ? '100%' :
                                                                    trackingInfo.status === 'In Transit' ? '65%' :
                                                                        trackingInfo.status === 'Processing' ? '35%' : '10%'
                                                            }}
                                                        ></div>

                                                        {/* Truck Animation - Position Dynamic */}
                                                        <div
                                                            className="absolute top-1/2 -mt-7 transition-all duration-1000 z-10"
                                                            style={{
                                                                left: trackingInfo.status === 'Delivered' ? '100%' :
                                                                    trackingInfo.status === 'In Transit' ? '65%' :
                                                                        trackingInfo.status === 'Processing' ? '35%' : '10%',
                                                                transform: 'translateX(-50%)'
                                                            }}
                                                        >
                                                            <div className="bg-white p-2 rounded-full shadow-lg border-2 border-blue-600 relative group">
                                                                <TruckIcon className="w-6 h-6 text-blue-600" />
                                                                {/* Label - MOVED UP to avoid overlap */}
                                                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none">
                                                                    Current Location
                                                                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-between relative z-0">
                                                            {['Ordered', 'Processing', 'In Transit', 'Delivered'].map((step, i) => {
                                                                const statusIdx = trackingInfo.status === 'Delivered' ? 3 :
                                                                    trackingInfo.status === 'In Transit' ? 2 :
                                                                        trackingInfo.status === 'Processing' ? 1 : 0;
                                                                const isActive = i <= statusIdx;

                                                                return (
                                                                    <div key={i} className="flex flex-col items-center gap-2 pt-4">
                                                                        <div className={`w-4 h-4 rounded-full border-2 z-10 bg-white ${isActive ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}`}></div>
                                                                        <span className={`text-xs font-bold ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{step}</span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Detailed Timeline */}
                                                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Shipment Updates</h3>
                                                    <div className="space-y-6 relative">
                                                        <div className="absolute top-2 left-[19px] w-0.5 h-full bg-slate-200"></div>
                                                        {trackingInfo.timeline && trackingInfo.timeline.map((event, idx) => (
                                                            <div key={idx} className="relative flex gap-6">
                                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-slate-50 ${event.completed ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-200 text-slate-400'}`}>
                                                                    {event.completed ? <CheckIcon className="w-5 h-5" /> : <div className="w-3 h-3 bg-slate-300 rounded-full"></div>}
                                                                </div>
                                                                <div className={`${event.current ? 'opacity-100' : event.completed ? 'opacity-70' : 'opacity-40'}`}>
                                                                    <h4 className="text-base font-bold text-slate-900">{event.status}</h4>
                                                                    <p className="text-sm text-slate-500">{event.date}</p>
                                                                    {event.current && trackingInfo.currentLocation && (
                                                                        <p className="text-xs font-bold text-blue-600 mt-1 flex items-center gap-1">
                                                                            <MapPinIcon className="w-3 h-3" />
                                                                            {trackingInfo.currentLocation}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </motion.div>
                        )}


                        {/* --- INSTAGRAM QR TAB --- */}
                        {activeTab === 'instagram-qr' && (
                            <motion.div
                                key="instagram-qr"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900">Instagram Growth & Offers</h2>
                                    <p className="text-slate-500">Turn followers into customers with exclusive rewards.</p>
                                </div>
                                <InstagramQRManager businessData={businessData} />
                            </motion.div>
                        )}

                        {/* --- COUPONS TAB --- */}
                        {activeTab === 'coupons' && (
                            <motion.div
                                key="coupons"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="mb-8">
                                    <h2 className="text-3xl font-bold text-slate-900">Coupon Management</h2>
                                    <p className="text-slate-500">Verify and track customer redemptions.</p>
                                </div>
                                <CouponManager businessData={businessData} />
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

                        {/* --- SETTINGS TAB --- */}
                        {activeTab === 'profile' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-6"
                            >
                                {/* --- SUBSCRIPTION CARD (NEW) --- */}
                                <div className={`relative overflow-hidden rounded-3xl bg-white p-8 shadow-xl border ${THEMES[currentTheme].borderColor}`}>
                                    <div className={`absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full ${THEMES[currentTheme].lightAccent} opacity-50 blur-3xl`}></div>

                                    <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                        <div>
                                            <div className="mb-2 flex items-center gap-3">
                                                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${THEMES[currentTheme].lightAccent} ${THEMES[currentTheme].accent}`}>
                                                    <CalendarDaysIcon className="h-6 w-6" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-slate-900">Subscription Status</h3>
                                                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide border ${new Date(businessData.subscriptionExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1))).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 ? 'bg-red-100 text-red-700 border-red-200' : 'bg-green-100 text-green-700 border-green-200'}`}>
                                                    {new Date(businessData.subscriptionExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1))).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000 ? 'Expiring Soon' : 'Active'}
                                                </span>
                                            </div>
                                            <p className="max-w-xl text-lg text-slate-500">
                                                Your <span className="font-bold text-slate-900">Premium Business Plan</span> is active.
                                                You have full access to all features until <span className="font-bold text-slate-900">{new Date(businessData.subscriptionExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1))).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-xl active:scale-95">
                                                Manage Plan
                                            </button>
                                            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-600 transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-95">
                                                View Invoice
                                            </button>
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-8">
                                        {(() => {
                                            const expiryDate = new Date(businessData.subscriptionExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
                                            const now = new Date();
                                            const totalDuration = 365 * 24 * 60 * 60 * 1000; // Assuming 1 year plan
                                            const remaining = expiryDate.getTime() - now.getTime();
                                            const elapsed = totalDuration - remaining;
                                            const daysRemaining = Math.max(0, Math.ceil(remaining / (24 * 60 * 60 * 1000)));
                                            const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

                                            return (
                                                <>
                                                    <div className="mb-2 flex justify-between text-sm font-medium text-slate-500">
                                                        <span>{daysRemaining < 30 ? 'Your plan is ending soon' : 'Plan Validation'}</span>
                                                        <span className={`${daysRemaining < 7 ? 'text-red-500 font-bold' : THEMES[currentTheme].accent}`}>{daysRemaining} Days Remaining</span>
                                                    </div>
                                                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-1000 ${daysRemaining < 7 ? 'bg-red-500' : (THEMES[currentTheme].sidebar === 'bg-white border-r border-slate-200' ? 'bg-slate-900' : THEMES[currentTheme].sidebar.split(' ')[0])}`}
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                <div className={`bg-white rounded-3xl shadow-xl ${THEMES[currentTheme].borderColor} border p-10 relative overflow-hidden`}>
                                    <div className={`absolute top-0 right-0 w-96 h-96 ${THEMES[currentTheme].lightAccent} rounded-full blur-3xl -mr-32 -mt-32 opacity-50`}></div>

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className={`p-4 rounded-2xl ${THEMES[currentTheme].lightAccent} ${THEMES[currentTheme].accent}`}>
                                                <PaintBrushIcon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold text-slate-900">Visual Appearance</h3>
                                                <p className="text-slate-500">Customize your dashboard experience.</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {Object.keys(THEMES).map((key) => (
                                                <button
                                                    key={key}
                                                    onClick={() => setCurrentTheme(key)}
                                                    className={`group relative h-40 rounded-2xl border-2 transition-all overflow-hidden text-left flex flex-col shadow-sm hover:shadow-md ${currentTheme === key
                                                        ? `${THEMES[key].activeBorder} ring-2 ring-offset-2 ring-offset-white ring-${THEMES[key].activeText.split('-')[1]}-400`
                                                        : 'border-slate-100 hover:border-slate-300'
                                                        }`}
                                                >
                                                    {/* Preview Header */}
                                                    <div className={`h-2/3 w-full bg-gradient-to-r ${THEMES[key].sidebarGradient.replace('from-', 'from-').replace('to-', 'to-')} p-4 flex items-center gap-2`}>
                                                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                                        <div className="w-8 h-2 rounded-full bg-white/20"></div>
                                                    </div>
                                                    {/* Preview Body */}
                                                    <div className={`h-1/3 w-full ${THEMES[key].pageBg} p-4 flex items-center justify-between`}>
                                                        <span className={`font-bold ${THEMES[key].accent}`}>{THEMES[key].name}</span>
                                                        {currentTheme === key && (
                                                            <div className={`w-6 h-6 rounded-full ${THEMES[key].accent.replace('text-', 'bg-')} text-white flex items-center justify-center shadow-lg`}>
                                                                <CheckIcon className="w-3 h-3" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* --- SUPPORT TAB (NEW) --- */}
                        {activeTab === 'support' && (
                            <motion.div
                                key="support"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="text-center max-w-2xl mx-auto mb-12">
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4">How can we help you today?</h2>
                                    <p className="text-lg text-slate-500">Our dedicated support team is available 24/7 to assist you with any questions or issues.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                    {/* Call Us Card */}
                                    <div className="group relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-100 transition-colors"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                <PhoneIcon className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Priority Phone Support</h3>
                                            <p className="text-slate-500 mb-8">Speak directly with a support specialist.</p>
                                            <button
                                                onClick={() => setShowCallModal(true)}
                                                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-95"
                                            >
                                                Call Now
                                            </button>
                                        </div>
                                    </div>

                                    {/* Email Us Card */}
                                    <div className="group relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-50 rounded-full blur-3xl -ml-16 -mt-16 group-hover:bg-purple-100 transition-colors"></div>
                                        <div className="relative z-10 flex flex-col items-center text-center">
                                            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                <EnvelopeIcon className="w-10 h-10" />
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Email Support</h3>
                                            <p className="text-slate-500 mb-8">Get a response within 24 hours.</p>
                                            <button
                                                onClick={() => window.open('https://mail.google.com/mail/?view=cm&fs=1&to=help@rankbag.com', '_blank')}
                                                className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 hover:shadow-purple-300 transition-all active:scale-95"
                                            >
                                                Send an Email
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ / Help Articles Placeholder */}
                                <div className="max-w-4xl mx-auto mt-12 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
                                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <LifebuoyIcon className="w-5 h-5 text-slate-400" />
                                        Common Questions
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="space-y-4">
                                            {[
                                                { q: "How does the AI Review Reply work?", a: "Our AI analyzes the sentiment of the customer review and generates a personalized, professional response based on your business profile. You can filter for 4-5 stars to auto-reply, or review lower ratings manually." },
                                                { q: "Can I customize the QR Stand design?", a: "Absolutely! Navigate to the 'Order QR Stand' tab where you can view our premium 3D acrylic models. We offer various styles including Corporate Blue, Modern Green, and Luxury Gold to match your brand." },
                                                { q: "How can I increase my Google reviews?", a: "Encourage happy customers to scan your QR code at checkout. You can also share your review link on social media using the tools in the 'Instagram QR Offers' tab." },
                                                { q: "Where can I find my digital QR code?", a: "Navigate to the 'QR Code Assets' tab to view and download your unique QR code in high resolution for printing or digital use." }
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                                    className={`rounded-xl transition-all duration-300 cursor-pointer overflow-hidden border ${openFaq === i ? `bg-white shadow-lg ${THEMES[currentTheme].borderColor} ring-1 ring-opacity-50` : 'bg-slate-50 hover:bg-slate-100 border-transparent'}`}
                                                >
                                                    <div className="p-4 flex justify-between items-center bg-white/50">
                                                        <span className={`font-medium ${openFaq === i ? THEMES[currentTheme].accent : 'text-slate-700 group-hover:text-slate-900'}`}>{item.q}</span>
                                                        <ChevronRightIcon className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-90 text-blue-500' : ''}`} />
                                                    </div>
                                                    <AnimatePresence>
                                                        {openFaq === i && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                <div className="p-4 pt-0 text-sm text-slate-500 leading-relaxed border-t border-slate-100/50">
                                                                    {item.a}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Support Call Modal */}
                    <AnimatePresence>
                        {showCallModal && (
                            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowCallModal(false)}
                                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                                ></motion.div>

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center overflow-hidden border border-white/20"
                                >
                                    {/* Cool Background Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>

                                    <div className="relative z-10 bg-white/50 backdrop-blur rounded-2xl p-6 border border-slate-100 shadow-inner mb-6 flex flex-col items-center">
                                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 mb-4 animate-pulse">
                                            <PhoneIcon className="w-10 h-10 text-white" />
                                        </div>
                                        <h3 className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-2">Priority Support Line</h3>
                                        <div className="text-3xl font-black text-slate-900 tracking-tight font-mono">
                                            +1 (800) 555-0199
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2">Available 24/7 for Premium Partners</p>
                                    </div>

                                    <div className="relative z-10 grid gap-3">
                                        <button
                                            onClick={() => {
                                                window.location.href = 'tel:+18005550199';
                                            }}
                                            className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <PhoneIcon className="w-4 h-4" />
                                            Call Now
                                        </button>
                                        <button
                                            onClick={() => setShowCallModal(false)}
                                            className="w-full py-3 text-slate-500 font-bold hover:text-slate-800 transition-colors"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    <style>{`
                        .custom-curve-bottom {
                            border-bottom-left-radius: 50% 20px;
                            border-bottom-right-radius: 50% 20px;
                        }
                        .preserve-3d {
                            transform-style: preserve-3d;
                        }
                        .perspective-1000 {
                            perspective: 1000px;
                        }
                    `}</style>
                </div >
            </main >

            {/* ===== REQUEST CALLBACK MODAL ===== */}
            <AnimatePresence>
                {showCallbackModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                        onClick={(e) => { if (e.target === e.currentTarget) setShowCallbackModal(false); }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="relative bg-gradient-to-br from-[#0B2046] to-[#24889F] p-8 text-white">
                                <button onClick={() => setShowCallbackModal(false)} className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center shadow-lg">
                                        <PhoneIcon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Request a Callback</h2>
                                        <p className="text-white/70 text-sm mt-0.5">Our team will call you back shortly</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                {callbackSuccess ? (
                                    <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-6">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircleIcon className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">Request Submitted! 🎉</h3>
                                        <p className="text-slate-500 text-sm mb-6">Our team will call you at <span className="font-bold text-slate-700">{callbackForm.phone}</span> within 24 hours.</p>
                                        <button onClick={() => setShowCallbackModal(false)} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">Done</button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={async (e) => {
                                        e.preventDefault();
                                        if (!callbackForm.phone || !callbackForm.contact_name) return;
                                        setCallbackSubmitting(true);
                                        const result = await addCallbackRequest({
                                            business_id: businessData.id, business_name: businessData.name,
                                            contact_name: callbackForm.contact_name, phone: callbackForm.phone,
                                            preferred_time: callbackForm.preferred_time, message: callbackForm.message,
                                        });
                                        setCallbackSubmitting(false);
                                        if (result.success) { setCallbackSuccess(true); } else { alert('Failed to submit. Please try again.'); }
                                    }} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Your Name <span className="text-red-500">*</span></label>
                                            <input type="text" required placeholder="e.g. Rahul Sharma" value={callbackForm.contact_name}
                                                onChange={(e) => setCallbackForm(f => ({ ...f, contact_name: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                                            <input type="tel" required placeholder="+91 98765 43210" value={callbackForm.phone}
                                                onChange={(e) => setCallbackForm(f => ({ ...f, phone: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Preferred Call Time</label>
                                            <select value={callbackForm.preferred_time} onChange={(e) => setCallbackForm(f => ({ ...f, preferred_time: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-sm bg-white">
                                                <option value="">Any time</option>
                                                <option value="Morning (9 AM - 12 PM)">Morning (9 AM - 12 PM)</option>
                                                <option value="Afternoon (12 PM - 4 PM)">Afternoon (12 PM - 4 PM)</option>
                                                <option value="Evening (4 PM - 7 PM)">Evening (4 PM - 7 PM)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1.5">Message / Query <span className="text-slate-400 font-normal">(optional)</span></label>
                                            <textarea rows={3} placeholder="What would you like to discuss?" value={callbackForm.message}
                                                onChange={(e) => setCallbackForm(f => ({ ...f, message: e.target.value }))}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors text-sm resize-none" />
                                        </div>
                                        <button type="submit" disabled={callbackSubmitting}
                                            className="w-full py-3.5 bg-gradient-to-r from-[#0B2046] to-[#24889F] text-white font-bold rounded-xl shadow-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2">
                                            {callbackSubmitting ? (<><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Submitting...</>) : (<><PhoneIcon className="w-5 h-5" /> Request Callback</>)}
                                        </button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>



            {/* PAYMENT POPUP MODAL */}
            <AnimatePresence>
                {showPaymentPopup && businessData && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ type: 'spring', damping: 22 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-black">Complete Payment</h3>
                                    <p className="text-sm text-white/80 mt-0.5">Scan QR and pay, then enter the reference</p>
                                </div>
                                <button onClick={() => setShowPaymentPopup(false)} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10">
                                    <XMarkIcon className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="bg-blue-50 rounded-2xl p-4 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-slate-500 font-medium">Order Total</div>
                                        <div className="text-3xl font-black text-slate-900">₹{250 * plateQuantity}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{plateQuantity}x QR Acrylic Stand</div>
                                    </div>
                                    <div className="text-4xl">💳</div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <p className="text-sm text-slate-500 font-semibold mb-3 text-center">Scan to pay via UPI</p>
                                    <div className="bg-white p-3 rounded-2xl border-2 border-blue-100 shadow-inner inline-block">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=7878002359@ptsbi%26pn=AmaanTanveer%26am=${250 * plateQuantity}%26cu=INR%26tn=RankBagQRStand`}
                                            alt="Payment QR"
                                            className="w-44 h-44 object-contain"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-slate-400 font-mono">7878002359@ptsbi</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        UPI Transaction ID <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={upiReference}
                                        onChange={(e) => setUpiReference(e.target.value)}
                                        placeholder="e.g. 421234567890"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors font-mono text-sm"
                                    />
                                    <p className="text-xs text-slate-400 mt-1.5">Found in your UPI app after payment</p>
                                </div>
                                <button
                                    disabled={plateOrderStatus === 'processing'}
                                    onClick={async () => {
                                        if (!upiReference.trim()) { alert('Please enter the UPI reference number.'); return; }
                                        setPlateOrderStatus('processing');
                                        const result = await addQROrder({
                                            business_id: businessData.id,
                                            business_name: businessData.name,
                                            plate_number: String(Math.floor(100 + Math.random() * 900)) + '-' + String(Math.floor(100 + Math.random() * 900)) + '-' + String(Math.floor(100 + Math.random() * 900)),
                                            address: plateAddress,
                                            design_info: {
                                                name: qrDesigns[activeDesign]?.name || 'Custom',
                                                colorCode: qrDesigns[activeDesign]?.color || '#3b82f6',
                                                details: qrDesigns[activeDesign]?.description || '',
                                                quantity: plateQuantity,
                                                total_price: 250 * plateQuantity,
                                                upi_reference: upiReference.trim()
                                            }
                                        });
                                        if (result.success) {
                                            setShowPaymentPopup(false);
                                            setUpiReference('');
                                            loadAllOrders();
                                            setTimeout(() => setPlateOrderStatus('success'), 800);
                                        } else {
                                            alert('Order failed: ' + result.error);
                                            setPlateOrderStatus('idle');
                                        }
                                    }}
                                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-base"
                                >
                                    {plateOrderStatus === 'processing' ? (
                                        <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Placing Order...</>
                                    ) : (
                                        <><CheckCircleIcon className="w-6 h-6" /> I have Paid &mdash; Submit Order</>
                                    )}
                                </button>
                                <p className="text-center text-xs text-slate-400">
                                    Order status updates after payment verification by our team.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


        </div >
    );
}

