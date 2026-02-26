import { useState, useEffect } from 'react';
import { BoltIcon, ChartBarIcon, DocumentTextIcon, BanknotesIcon } from '@heroicons/react/24/outline';
import { getAllApiLogs } from '../lib/supabase';

export default function ApiTracker() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [stats, setStats] = useState({
        totalRequests: 0,
        totalCost: 0,
        imageGenerations: 0,
        textGenerations: 0
    });

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        const result = await getAllApiLogs();
        if (result.success) {
            setLogs(result.data);
            calculateStats(result.data);
            setNeedsSetup(false);
        } else if (result.requiresSetup) {
            setNeedsSetup(true);
        } else {
            console.error("Failed to load logs", result.error);
        }
        setLoading(false);
    };

    const calculateStats = (data) => {
        const totalReqs = data.length;
        let cost = 0;
        let imgGens = 0;
        let txtGens = 0;

        data.forEach(log => {
            cost += parseFloat(log.cost_estimate || 0);
            if (log.api_type === 'openai_image') imgGens++;
            if (log.api_type === 'openai_text') txtGens++;
        });

        setStats({
            totalRequests: totalReqs,
            totalCost: cost.toFixed(3),
            imageGenerations: imgGens,
            textGenerations: txtGens
        });
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (needsSetup) {
        return (
            <div className="card max-w-2xl mx-auto mt-8">
                <div className="text-center mb-6">
                    <BoltIcon className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">API Tracker Setup Required</h2>
                    <p className="text-gray-600">
                        The live tracking feature requires a new database table.
                        Please run the following SQL snippet in your Supabase SQL Editor.
                    </p>
                </div>

                <div className="bg-gray-900 text-gray-100 p-4 rounded-xl mb-6 overflow-x-auto text-sm">
                    <pre><code>{`-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.api_usage_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    api_type VARCHAR(255) NOT NULL,
    action VARCHAR(255),
    input_details TEXT,
    cost_estimate DECIMAL(10, 4) DEFAULT 0,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.api_usage_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/insert for simplicity (or restrict as needed)
CREATE POLICY "Enable read access for all users" ON public.api_usage_logs FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON public.api_usage_logs FOR INSERT WITH CHECK (true);
`}</code></pre>
                </div>

                <div className="text-center">
                    <button onClick={loadLogs} className="btn btn-primary px-8">
                        I have run the SQL snippet
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <BoltIcon className="w-8 h-8 text-yellow-500" />
                        Live API Tracker
                    </h2>
                    <p className="text-gray-500">Monitor your OpenAI DALL-E and GPT usage limits in real-time.</p>
                </div>
                <button onClick={loadLogs} className="btn bg-gray-100 hover:bg-gray-200 text-gray-700">
                    Refresh Stats
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="card bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <ChartBarIcon className="w-6 h-6" />
                        <h3 className="font-semibold">Total Requests</h3>
                    </div>
                    <p className="text-4xl font-bold">{stats.totalRequests}</p>
                </div>

                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <BanknotesIcon className="w-6 h-6" />
                        <h3 className="font-semibold">Estimated Cost</h3>
                    </div>
                    <p className="text-4xl font-bold">${stats.totalCost}</p>
                </div>

                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <DocumentTextIcon className="w-6 h-6" />
                        <h3 className="font-semibold">Image Generators</h3>
                    </div>
                    <p className="text-4xl font-bold">{stats.imageGenerations}</p>
                    <p className="text-sm opacity-80 mt-1">DALL-E 3</p>
                </div>

                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <div className="flex items-center gap-3 mb-2 opacity-80">
                        <DocumentTextIcon className="w-6 h-6" />
                        <h3 className="font-semibold">Text Generators</h3>
                    </div>
                    <p className="text-4xl font-bold">{stats.textGenerations}</p>
                    <p className="text-sm opacity-80 mt-1">GPT-4 Limit</p>
                </div>
            </div>

            <div className="card">
                <h3 className="text-xl font-bold mb-4">Recent API Activity</h3>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Timestamp</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">API Type</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Input Details</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Est. Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                        No API usage recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${log.api_type === 'openai_image' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {log.api_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {log.action}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={log.input_details}>
                                            {log.input_details}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-green-600">
                                            ${parseFloat(log.cost_estimate || 0).toFixed(3)}
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
}
