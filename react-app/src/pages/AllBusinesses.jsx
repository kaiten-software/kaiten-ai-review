import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { getAllBusinesses } from '../data/businesses';
import { getAllClients } from '../lib/supabase';
import { MagnifyingGlassIcon, FunnelIcon, ArrowsUpDownIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// Scroll to top component
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

export default function AllBusinesses() {
    const navigate = useNavigate();
    const [allBusinesses, setAllBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('rating-desc'); // rating-desc, rating-asc, name-asc, name-desc

    // Derived categories
    const categories = ['All', 'Salon', 'Spa', 'Restaurant', 'Gym', 'Tech', 'Cafe', 'Other'];

    // Helper to guess category if not present
    const getCategory = (b) => {
        const text = (b.name + ' ' + b.description + ' ' + b.tagline).toLowerCase();
        if (text.includes('salon') || text.includes('hair') || text.includes('beauty')) return 'Salon';
        if (text.includes('spa') || text.includes('massage')) return 'Spa';
        if (text.includes('pizza') || text.includes('food') || text.includes('restaurant') || text.includes('dining')) return 'Restaurant';
        if (text.includes('fitness') || text.includes('gym') || text.includes('workout')) return 'Gym';
        if (text.includes('tech') || text.includes('software') || text.includes('app')) return 'Tech';
        if (text.includes('coffee') || text.includes('cafe')) return 'Cafe';
        return 'Other';
    };

    useEffect(() => {
        const loadBusinesses = async () => {
            setLoading(true);
            const staticBusinesses = getAllBusinesses();
            const result = await getAllClients();

            let combined = [];
            if (result.success && result.data) {
                const supabaseClients = result.data.filter(client => {
                    const name = (client.business_name || client.name || '').toLowerCase();
                    return !name.includes('fewgw') && !name.includes('at bar');
                });

                // Create a map of Supabase clients for easy lookup
                const supabaseClientMap = {};
                supabaseClients.forEach(client => {
                    const id = client.business_id || client.id;
                    supabaseClientMap[id] = {
                        id: id,
                        name: client.business_name || client.name,
                        logo: client.logo || '🏢',
                        tagline: client.tagline || '',
                        description: client.description || '',
                        rating: parseFloat(client.average_rating) || 0,
                        reviewCount: client.total_reviews || 0,
                        hero: {
                            main: client.hero_image || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
                        }
                    };
                });

                // Merge static businesses with Supabase data
                const mergedStaticBusinesses = staticBusinesses.map(staticBiz => {
                    const dynamicData = supabaseClientMap[staticBiz.id];
                    if (dynamicData) {
                        return {
                            ...staticBiz,
                            rating: dynamicData.rating || staticBiz.rating,
                            reviewCount: dynamicData.reviewCount || staticBiz.reviewCount,
                            // We can merge other fields if needed, but rating/reviews are high priority for sync
                        };
                    }
                    return staticBiz;
                });

                // Filter out Supabase clients that were already merged into static ones
                const staticIds = staticBusinesses.map(b => b.id);
                const newUniqueClients = Object.values(supabaseClientMap).filter(c => !staticIds.includes(c.id));

                combined = [...mergedStaticBusinesses, ...newUniqueClients];
            } else {
                combined = staticBusinesses;
            }

            // Add category info to objects for easier filtering
            const withCategories = combined.map(b => ({
                ...b,
                category: getCategory(b)
            }));

            setAllBusinesses(withCategories);
            setFilteredBusinesses(withCategories);
            setLoading(false);
        };
        loadBusinesses();
    }, []);

    useEffect(() => {
        let result = [...allBusinesses];

        // 1. Search
        if (searchTerm) {
            const lower = searchTerm.toLowerCase();
            result = result.filter(b =>
                b.name.toLowerCase().includes(lower) ||
                b.description.toLowerCase().includes(lower) ||
                b.tagline.toLowerCase().includes(lower)
            );
        }

        // 2. Category
        if (selectedCategory !== 'All') {
            result = result.filter(b => b.category === selectedCategory);
        }

        // 3. Sort
        result.sort((a, b) => {
            switch (sortBy) {
                case 'rating-desc': return b.rating - a.rating;
                case 'rating-asc': return a.rating - b.rating;
                case 'name-asc': return a.name.localeCompare(b.name);
                case 'name-desc': return b.name.localeCompare(a.name);
                default: return 0;
            }
        });

        setFilteredBusinesses(result);
    }, [searchTerm, selectedCategory, sortBy, allBusinesses]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="pt-28 pb-10 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white relative">
                <div className="container-custom">
                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/')}
                        className="absolute top-28 left-4 md:left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-medium bg-white/10 backdrop-blur-md px-4 py-2 rounded-full"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        Back to Home
                    </button>

                    <div className="text-center mt-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Amazing Businesses</h1>
                        <p className="text-xl opacity-90">Find the best local services rated by AI and real customers</p>
                    </div>
                </div>
            </div>

            <div className="container-custom py-12">
                {/* Filters */}
                <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 border border-gray-100 sticky top-24 z-20">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">

                        {/* Search */}
                        <div className="relative w-full md:w-96">
                            <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search businesses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                            />
                        </div>

                        <div className="flex gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                            {/* Category Dropdown */}
                            <div className="relative min-w-[150px]">
                                <FunnelIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full pl-12 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer text-gray-700 font-medium"
                                >
                                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            {/* Sort Dropdown */}
                            <div className="relative min-w-[180px]">
                                <ArrowsUpDownIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full pl-12 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-pink-500 focus:outline-none cursor-pointer text-gray-700 font-medium"
                                >
                                    <option value="rating-desc">Highest Rated</option>
                                    <option value="rating-asc">Lowest Rated</option>
                                    <option value="name-asc">Name (A-Z)</option>
                                    <option value="name-desc">Name (Z-A)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading businesses...</p>
                    </div>
                ) : filteredBusinesses.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBusinesses.map((business, index) => (
                            <motion.div
                                key={business.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => navigate(`/business/${business.id}`)}
                                className="group cursor-pointer bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={business.hero?.main || 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'}
                                        alt={business.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl shadow-sm">{business.logo}</span>
                                            <div>
                                                <h3 className="text-xl font-bold leading-tight">{business.name}</h3>
                                                <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-md rounded text-xs mt-1">
                                                    {business.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{business.tagline || business.description}</p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                        <div className="flex items-center gap-1.5">
                                            <StarIcon className="w-5 h-5 text-yellow-400" />
                                            <span className="font-bold text-gray-900">{business.rating}</span>
                                            <span className="text-gray-400 text-sm">({business.reviewCount})</span>
                                        </div>
                                        <button className="text-blue-600 font-bold text-sm group-hover:underline">
                                            View Profile
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-dashed border-gray-300">
                        <p className="text-xl text-gray-500 mb-2">No businesses found</p>
                        <p className="text-gray-400">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}
