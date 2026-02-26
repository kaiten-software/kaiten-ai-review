import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getFSRStats } from '../lib/fsrApi';
import {
    PlusCircleIcon,
    UsersIcon,
    TrophyIcon,
    QrCodeIcon,
    ArrowRightOnRectangleIcon,
    SparklesIcon,
    ChartBarIcon,
    FireIcon,
    BoltIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function FSRDashboard() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const viewAsId = searchParams.get('viewAs');
    const [fsrData, setFsrData] = useState(null);
    const [clients, setClients] = useState([]);
    const [stats, setStats] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showQRModal, setShowQRModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadFSRData = async () => {
            let userIdToLoad;

            // 1. Check if Admin is viewing as a specific FSR
            if (viewAsId) {
                userIdToLoad = viewAsId;
            } else {
                // 2. Normal FSR Login Check
                const session = localStorage.getItem('fsrSession');
                if (!session) {
                    navigate('/fsr-login');
                    return;
                }
                const sessionData = JSON.parse(session);
                userIdToLoad = sessionData.userId;
            }

            try {
                // Load real FSR data from Supabase
                const result = await getFSRStats(userIdToLoad);

                if (result.success) {
                    const transformedClients = result.data.clients.map((client, idx) => ({
                        id: client.id,
                        business_id: client.business_id,
                        name: client.business_name,
                        date: new Date(client.added_date).toISOString().split('T')[0],
                        payment: client.payment_amount || 5000,
                        status: client.payment_status,
                        points: client.points_earned
                    }));

                    setFsrData({
                        fsrId: result.data.fsr.user_id,
                        name: result.data.fsr.name,
                        username: result.data.fsr.username,
                        email: result.data.fsr.email,
                        phone: result.data.fsr.phone,
                        totalPoints: transformedClients.length, // Client count = Points (Strict Rule)
                        totalClients: transformedClients.length,
                        todayClients: result.data.stats.todayClients,
                        weekClients: result.data.stats.weekClients,
                        monthClients: result.data.stats.monthClients,
                        rank: 1,
                        clients: transformedClients
                    });

                    setClients(transformedClients);
                    setStats(result.data.stats);
                } else {
                    setError(result.error || 'Failed to load FSR data');
                }
            } catch (err) {
                console.error('Error loading FSR data:', err);
                setError('An error occurred while loading your data');
            } finally {
                setLoading(false);
            }
        };

        loadFSRData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('fsrSession');
        navigate('/fsr-login');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                    <div className="text-white text-xl">Loading your dashboard...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
                <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 max-w-md text-center">
                    <p className="text-red-200 text-xl mb-4">⚠️ {error}</p>
                    <button
                        onClick={() => navigate('/fsr-login')}
                        className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        );
    }

    if (!fsrData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
                <div className="text-white text-xl">No data available</div>
            </div>
        );
    }

    const qrCodeUrl = `${window.location.origin}/register-business?fsr=${fsrData.fsrId}`;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24 md:pb-0">

            <header className="bg-black/30 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                        <div className="flex items-center space-x-4 w-full md:w-auto justify-center md:justify-start">
                            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <SparklesIcon className="w-7 h-7 text-white" />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-bold text-white">FSR Dashboard</h1>
                                <p className="text-purple-300 text-sm">Welcome back, {fsrData.name}!</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 w-full md:w-auto justify-center md:justify-end">
                            <div className="text-center md:text-right mr-0 md:mr-4">
                                <p className="text-white font-semibold">{fsrData.fsrId}</p>
                                <p className="text-purple-300 text-sm">{fsrData.username}</p>
                            </div>
                            {viewAsId ? (
                                <button
                                    onClick={() => window.close()}
                                    className="flex items-center space-x-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-xl transition-all border border-yellow-500/30 text-sm md:text-base"
                                >
                                    <ArrowLeftIcon className="w-5 h-5" />
                                    <span>Exit</span>
                                </button>
                            ) : (
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl transition-all border border-red-500/30 text-sm md:text-base"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                    {/* Total Points */}
                    <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <TrophyIcon className="w-12 h-12 text-white/90" />
                            <FireIcon className="w-8 h-8 text-white/60 animate-pulse" />
                        </div>
                        <h3 className="text-white/80 text-sm font-medium mb-1">Total Points</h3>
                        <p className="text-4xl font-bold text-white">{fsrData.totalPoints}</p>
                        <p className="text-white/70 text-xs mt-2">🏆 Rank #{fsrData.rank} this month</p>
                    </div>

                    {/* Total Clients */}
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <UsersIcon className="w-12 h-12 text-white/90" />
                            <BoltIcon className="w-8 h-8 text-white/60" />
                        </div>
                        <h3 className="text-white/80 text-sm font-medium mb-1">Total Clients</h3>
                        <p className="text-4xl font-bold text-white">{fsrData.totalClients}</p>
                        <p className="text-white/70 text-xs mt-2">+{fsrData.todayClients} today</p>
                    </div>

                    {/* This Week */}
                    <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl transform hover:scale-105 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <ChartBarIcon className="w-12 h-12 text-white/90" />
                            <SparklesIcon className="w-8 h-8 text-white/60" />
                        </div>
                        <h3 className="text-white/80 text-sm font-medium mb-1">This Week</h3>
                        <p className="text-4xl font-bold text-white">{fsrData.weekClients}</p>
                        <p className="text-white/70 text-xs mt-2">Clients added</p>
                    </div>
                </div>

                {/* Desktop Navigation Tabs (Hidden on Mobile) */}
                <div className="hidden md:block bg-black/30 backdrop-blur-xl rounded-2xl p-2 mb-6 border border-white/10">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'overview'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                                : 'text-purple-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('add-business')}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'add-business'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                                : 'text-purple-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <PlusCircleIcon className="w-5 h-5 inline mr-2" />
                            Add Business
                        </button>
                        <button
                            onClick={() => setActiveTab('my-clients')}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'my-clients'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                                : 'text-purple-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <UsersIcon className="w-5 h-5 inline mr-2" />
                            My Clients
                        </button>
                        <button
                            onClick={() => setActiveTab('points')}
                            className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${activeTab === 'points'
                                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                                : 'text-purple-300 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <TrophyIcon className="w-5 h-5 inline mr-2" />
                            Points & Rewards
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10">
                    {activeTab === 'overview' && <OverviewTab fsrData={fsrData} />}
                    {activeTab === 'add-business' && <AddBusinessTab fsrData={fsrData} setShowQRModal={setShowQRModal} />}
                    {activeTab === 'my-clients' && <MyClientsTab fsrData={fsrData} />}
                    {activeTab === 'points' && <PointsTab fsrData={fsrData} />}
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 z-50">
                <div className="flex justify-around items-center p-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl w-full ${activeTab === 'overview' ? 'text-purple-400 bg-white/5' : 'text-slate-400'}`}
                    >
                        <ChartBarIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">Overview</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('add-business')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl w-full ${activeTab === 'add-business' ? 'text-purple-400 bg-white/5' : 'text-slate-400'}`}
                    >
                        <PlusCircleIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">Add</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('my-clients')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl w-full ${activeTab === 'my-clients' ? 'text-purple-400 bg-white/5' : 'text-slate-400'}`}
                    >
                        <UsersIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">Clients</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('points')}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl w-full ${activeTab === 'points' ? 'text-purple-400 bg-white/5' : 'text-slate-400'}`}
                    >
                        <TrophyIcon className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-medium">Rewards</span>
                    </button>
                </div>
            </div>

            {/* QR Code Modal */}
            {showQRModal && (
                <QRCodeModal
                    fsrData={fsrData}
                    qrCodeUrl={qrCodeUrl}
                    onClose={() => setShowQRModal(false)}
                />
            )}
        </div>
    );
}

// Overview Tab Component
function OverviewTab({ fsrData }) {
    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Performance Overview</h2>

            {/* Performance Chart */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-6 border border-purple-500/30">
                    <h3 className="text-xl font-bold text-white mb-4">Monthly Progress</h3>
                    <div className="space-y-3">
                        <div>
                            <div className="flex justify-between text-sm text-purple-200 mb-1">
                                <span>Clients Added</span>
                                <span>{fsrData.monthClients} / 20</span>
                            </div>
                            <div className="w-full bg-purple-900/30 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full transition-all"
                                    style={{ width: `${(fsrData.monthClients / 20) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-purple-200 mb-1">
                                <span>Points Earned</span>
                                <span>{fsrData.totalPoints} / 20</span>
                            </div>
                            <div className="w-full bg-purple-900/30 rounded-full h-3">
                                <div
                                    className="bg-gradient-to-r from-yellow-500 to-orange-600 h-3 rounded-full transition-all"
                                    style={{ width: `${(fsrData.totalPoints / 20) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-blue-500/30">
                    <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                        {fsrData.clients.slice(0, 3).map((client, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{client.name}</p>
                                    <p className="text-purple-300 text-sm">{client.date}</p>
                                </div>
                                <div className="text-green-400 font-semibold">+1 pt</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Motivational Section */}
            <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 rounded-xl p-8 border border-yellow-500/30 text-center">
                <FireIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-bold text-white mb-2">You're on Fire! 🔥</h3>
                <p className="text-purple-200 text-lg mb-4">
                    Just {20 - fsrData.totalPoints} more points to reach the next milestone!
                </p>
                <p className="text-purple-300">
                    Keep adding clients to unlock exclusive rewards and bonuses!
                </p>
            </div>
        </div>
    );
}

// Add Business Tab Component
function AddBusinessTab({ fsrData, setShowQRModal }) {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Add New Business</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Manual Entry */}
                <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-8 border border-purple-500/30 text-center cursor-pointer hover:scale-105 transition-all"
                    onClick={() => navigate(`/client-onboarding?fsr=${fsrData.fsrId}`)}>
                    <PlusCircleIcon className="w-20 h-20 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Manual Entry</h3>
                    <p className="text-purple-200 mb-4">
                        Fill out the form yourself and add a new client
                    </p>
                    <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                        Start Registration
                    </button>
                </div>

                {/* QR Code Method */}
                <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-8 border border-blue-500/30 text-center cursor-pointer hover:scale-105 transition-all"
                    onClick={() => setShowQRModal(true)}>
                    <QrCodeIcon className="w-20 h-20 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">Share QR Code</h3>
                    <p className="text-purple-200 mb-4">
                        Let clients scan your QR and fill their own details
                    </p>
                    <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all">
                        View My QR
                    </button>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                <h4 className="text-white font-bold mb-2">💡 Pro Tip</h4>
                <p className="text-green-200">
                    Your FSR ID ({fsrData.fsrId}) will be automatically added to every business you register.
                    You'll earn 1 point for each successful registration!
                </p>
            </div>
        </div>
    );
}

// My Clients Tab Component
function MyClientsTab({ fsrData }) {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-white">My Clients</h2>
                <div className="text-purple-300">
                    Total: <span className="text-white font-bold text-xl">{fsrData.totalClients}</span>
                </div>
            </div>

            {/* Clients Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-purple-500/30">
                            <th className="text-left py-3 px-4 text-purple-300 font-semibold">#</th>
                            <th className="text-left py-3 px-4 text-purple-300 font-semibold">Business Name</th>
                            <th className="text-left py-3 px-4 text-purple-300 font-semibold">Date Added</th>
                            <th className="text-left py-3 px-4 text-purple-300 font-semibold">Status</th>
                            <th className="text-left py-3 px-4 text-purple-300 font-semibold">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {fsrData.clients.map((client, idx) => (
                            <tr key={client.id} className="border-b border-purple-500/10 hover:bg-purple-500/10 transition-colors">
                                <td className="py-4 px-4 text-white">{idx + 1}</td>
                                <td className="py-4 px-4 text-white font-medium">
                                    <button
                                        onClick={() => navigate(`/business/${client.business_id}`, { state: { from: 'fsr-dashboard' } })}
                                        className="hover:text-purple-300 hover:underline transition-colors text-left"
                                    >
                                        {client.name}
                                    </button>
                                </td>
                                <td className="py-4 px-4 text-purple-300">{client.date}</td>
                                <td className="py-4 px-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${client.status === 'completed'
                                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                                        : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                                        }`}>
                                        {client.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-yellow-400 font-bold">+1</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Points Tab Component
function PointsTab({ fsrData }) {
    const pointsToNextLevel = 20 - fsrData.totalPoints;
    const progress = (fsrData.totalPoints / 20) * 100;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">Points & Rewards</h2>

            {/* Current Points Display */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-8 text-center shadow-2xl">
                <TrophyIcon className="w-24 h-24 text-white mx-auto mb-4 animate-bounce" />
                <h3 className="text-white/80 text-lg mb-2">Your Total Points</h3>
                <p className="text-7xl font-bold text-white mb-4">{fsrData.totalPoints}</p>
                <p className="text-white/90 text-xl">
                    🏆 Rank #{fsrData.rank} this month
                </p>
            </div>

            {/* Progress to Next Level */}
            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Progress to Next Reward</h3>
                <div className="mb-2">
                    <div className="flex justify-between text-sm text-purple-200 mb-2">
                        <span>Current Progress</span>
                        <span>{fsrData.totalPoints} / 20 points</span>
                    </div>
                    <div className="w-full bg-purple-900/30 rounded-full h-6">
                        <div
                            className="bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 h-6 rounded-full transition-all flex items-center justify-end pr-2"
                            style={{ width: `${progress}%` }}
                        >
                            <span className="text-white text-xs font-bold">{Math.round(progress)}%</span>
                        </div>
                    </div>
                </div>
                <p className="text-purple-200 text-center mt-4">
                    Just <span className="text-yellow-400 font-bold">{pointsToNextLevel}</span> more points to unlock the next reward! 🎁
                </p>
            </div>

            {/* Rewards Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`rounded-xl p-6 border-2 ${fsrData.totalPoints >= 10
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-gray-500/10 border-gray-500/30'
                    }`}>
                    <div className="text-center">
                        <div className="text-4xl mb-2">🥉</div>
                        <h4 className="text-white font-bold mb-1">Bronze</h4>
                        <p className="text-purple-300 text-sm mb-2">10 Points</p>
                        <p className="text-purple-200 text-xs">₹500 Bonus</p>
                    </div>
                </div>

                <div className={`rounded-xl p-6 border-2 ${fsrData.totalPoints >= 20
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-gray-500/10 border-gray-500/30'
                    }`}>
                    <div className="text-center">
                        <div className="text-4xl mb-2">🥈</div>
                        <h4 className="text-white font-bold mb-1">Silver</h4>
                        <p className="text-purple-300 text-sm mb-2">20 Points</p>
                        <p className="text-purple-200 text-xs">₹1,500 Bonus</p>
                    </div>
                </div>

                <div className={`rounded-xl p-6 border-2 ${fsrData.totalPoints >= 30
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-gray-500/10 border-gray-500/30'
                    }`}>
                    <div className="text-center">
                        <div className="text-4xl mb-2">🥇</div>
                        <h4 className="text-white font-bold mb-1">Gold</h4>
                        <p className="text-purple-300 text-sm mb-2">30 Points</p>
                        <p className="text-purple-200 text-xs">₹3,000 Bonus</p>
                    </div>
                </div>
            </div>

            {/* Motivational Message */}
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-xl p-6 border border-pink-500/30 text-center">
                <SparklesIcon className="w-12 h-12 text-pink-400 mx-auto mb-3" />
                <h4 className="text-white font-bold text-xl mb-2">Keep Going! 💪</h4>
                <p className="text-purple-200">
                    Every client you add brings you closer to amazing rewards and recognition!
                </p>
            </div>
        </div>
    );
}

// QR Code Modal Component
function QRCodeModal({ fsrData, qrCodeUrl, onClose }) {
    const downloadQR = () => {
        // In production, this would generate and download the actual QR code
        alert('QR Code download functionality will be implemented with QR generation library');
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">Your Personal QR Code</h3>
                    <p className="text-purple-200 mb-6">
                        Share this QR code with clients. When they scan it, they'll be directed to the registration form with your FSR ID pre-filled!
                    </p>

                    {/* QR Code Placeholder */}
                    <div className="bg-white rounded-2xl p-8 mb-6">
                        <div className="mx-auto bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center p-4">
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCodeUrl)}`}
                                alt={`QR Code for ${fsrData.fsrId}`}
                                className="w-48 h-48 rounded-lg shadow-inner"
                            />
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-purple-600 font-bold">{fsrData.fsrId}</p>
                            <p className="text-purple-500 text-sm">Scan with your phone camera</p>
                        </div>
                    </div>

                    <div className="bg-purple-500/20 rounded-xl p-4 mb-6 border border-purple-500/30">
                        <p className="text-purple-200 text-sm break-all">{qrCodeUrl}</p>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={downloadQR}
                            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                        >
                            Download QR
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/10 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
