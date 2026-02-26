import { useState, useEffect } from 'react';
import { getAllFSRStats, addFSR, recalculateFSRStats, addBusinessViaFSR } from '../../lib/fsrApi';
import {
    UserGroupIcon,
    PlusIcon,
    XMarkIcon,
    TrophyIcon,
    UsersIcon,
    QrCodeIcon,
    EyeIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export default function FSRManagement() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [fsrList, setFsrList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalFSRs: 0,
        totalClients: 0,
        totalPoints: 0
    });

    const [newFSR, setNewFSR] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: ''
    });

    const loadData = async () => {
        setLoading(true);
        try {
            const result = await getAllFSRStats();
            if (result.success) {
                // Transform FSR data for display
                const transformedFSRs = result.data.fsrs.map(fsr => ({
                    id: fsr.id,
                    fsrId: fsr.user_id,
                    name: fsr.name,
                    email: fsr.email,
                    phone: fsr.phone,
                    city: fsr.city,
                    state: fsr.state,
                    username: fsr.username,
                    password: fsr.password_hash, // In prototype, showing plain text
                    totalPoints: fsr.total_points,
                    totalClients: fsr.total_clients,
                    status: fsr.status,
                    joinedDate: new Date(fsr.created_at).toISOString().split('T')[0]
                }));

                setFsrList(transformedFSRs);
                setStats({
                    totalFSRs: result.data.totalFSRs,
                    totalClients: result.data.totalClients,
                    totalPoints: result.data.totalPoints
                });
            }
        } catch (error) {
            console.error('Error loading FSRs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAddFSR = async (e) => {
        e.preventDefault();
        try {
            const result = await addFSR(newFSR);
            if (result.success) {
                setShowAddModal(false);
                setNewFSR({
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    city: '',
                    state: ''
                });

                // Show credentials alert
                alert(`FSR Added Successfully!
                
FSR ID: ${result.data.user_id}
Username: ${result.data.username}
Password: ${result.data.generatedPassword}

Please save these credentials and share with the FSR.`);

                // Reload list
                loadData();
            } else {
                alert('Failed to add FSR: ' + result.error);
            }
        } catch (error) {
            console.error('Error adding FSR:', error);
            alert('An unexpected error occurred');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">FSR Management</h2>
                    <p className="text-gray-600 mt-1">Manage your Field Sales Representatives</p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 w-full md:w-auto">
                    <button
                        onClick={async () => {
                            if (!window.confirm('Recalculate stats for all FSRs?')) return;
                            setLoading(true);
                            try {
                                const result = await getAllFSRStats();
                                if (result.success) {
                                    for (const fsr of result.data.fsrs) {
                                        await recalculateFSRStats(fsr.id);
                                    }
                                    alert('Stats synchronized!');
                                    loadData();
                                }
                            } catch (e) {
                                console.error(e);
                                alert('Error syncing stats');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-3 py-2 md:px-4 md:py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all text-sm md:text-base"
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Sync Ops
                    </button>
                    <button
                        onClick={async () => {
                            const fsrId = prompt('Enter FSR ID (e.g. FSR001) to add client to:');
                            if (!fsrId) return;

                            setLoading(true);
                            try {
                                const result = await addBusinessViaFSR({
                                    businessName: 'Sharma Electronics',
                                    email: `sharma.electronics.${Date.now()}@example.com`,
                                    phone: '9876543210',
                                    businessType: 'Electronics',
                                    ownerName: 'Mr. Sharma',
                                    city: 'Mumbai',
                                    state: 'Maharashtra',
                                    notes: 'Added via Admin Panel'
                                }, fsrId);

                                if (result.success) {
                                    alert('Added "Sharma Electronics" successfully! Check Admin Client List and FSR Dashboard.');
                                    loadData();
                                } else {
                                    alert('Failed to add client: ' + result.error);
                                }
                            } catch (e) {
                                console.error(e);
                                alert('Error adding demo client');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="flex items-center gap-2 bg-white border border-purple-300 text-purple-700 px-3 py-2 md:px-4 md:py-3 rounded-xl font-semibold hover:bg-purple-50 transition-all text-sm md:text-base"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add Client
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm md:text-base"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Add FSR
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <UserGroupIcon className="w-12 h-12 opacity-80" />
                    </div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Total FSRs</h3>
                    <p className="text-4xl font-bold">{stats.totalFSRs}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <UsersIcon className="w-12 h-12 opacity-80" />
                    </div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Total Clients Added</h3>
                    <p className="text-4xl font-bold">
                        {stats.totalClients}
                    </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                        <TrophyIcon className="w-12 h-12 opacity-80" />
                    </div>
                    <h3 className="text-white/80 text-sm font-medium mb-1">Total Points</h3>
                    <p className="text-4xl font-bold">
                        {stats.totalPoints}
                    </p>
                </div>
            </div>

            {/* FSR List Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">FSR ID</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Credentials</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Performance</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {fsrList.map((fsr) => (
                                <tr key={fsr.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono font-bold text-purple-600">{fsr.fsrId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-semibold text-gray-900">{fsr.name}</div>
                                            <div className="text-sm text-gray-500">Joined: {fsr.joinedDate}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            <div className="text-gray-900">{fsr.email}</div>
                                            <div className="text-gray-500">{fsr.phone}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {fsr.city}, {fsr.state}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm space-y-1">
                                            <div>
                                                <span className="text-gray-500">User:</span>{' '}
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                                    {fsr.username}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500">Pass:</span>{' '}
                                                <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                                                    {fsr.password}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <UsersIcon className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm font-semibold">{fsr.totalClients} clients</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrophyIcon className="w-4 h-4 text-yellow-600" />
                                                <span className="text-sm font-semibold">{fsr.totalPoints} points</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${fsr.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}
                                        >
                                            {fsr.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => window.open(`/fsr-dashboard?viewAs=${fsr.fsrId}`, '_blank')}
                                                className="text-purple-600 hover:text-purple-800 font-semibold text-sm flex items-center gap-1"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                                View
                                            </button>

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add FSR Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                            <h3 className="text-2xl font-bold text-gray-900">Add New FSR</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8">
                            <form
                                onSubmit={handleAddFSR}
                                className="space-y-6"
                            >
                                {/* Personal Information */}
                                <div>
                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={newFSR.name}
                                                onChange={(e) => setNewFSR({ ...newFSR, name: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Enter full name"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={newFSR.email}
                                                onChange={(e) => setNewFSR({ ...newFSR, email: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="email@example.com"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                value={newFSR.phone}
                                                onChange={(e) => setNewFSR({ ...newFSR, phone: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="+91-XXXXXXXXXX"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                value={newFSR.address}
                                                onChange={(e) => setNewFSR({ ...newFSR, address: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="Street address"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                value={newFSR.city}
                                                onChange={(e) => setNewFSR({ ...newFSR, city: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="City"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                State *
                                            </label>
                                            <input
                                                type="text"
                                                value={newFSR.state}
                                                onChange={(e) => setNewFSR({ ...newFSR, state: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                                placeholder="State"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                                    <p className="text-sm text-purple-800">
                                        <strong>Note:</strong> Username and password will be automatically generated upon
                                        submission. You'll receive the credentials to share with the FSR.
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(false)}
                                        className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                                    >
                                        Add FSR
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
