import React, { useState, useEffect } from 'react';
import dataSyncService from '../../services/dataSyncService';

const DataSyncManager = () => {
    const [syncStatus, setSyncStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // success, error, info

    useEffect(() => {
        fetchSyncStatus();
    }, []);

    const fetchSyncStatus = async () => {
        try {
            const status = await dataSyncService.getSyncStatus();
            setSyncStatus(status);
        } catch (error) {
            showMessage('Error fetching sync status', 'error');
        }
    };

    const showMessage = (text, type) => {
        setMessage(text);
        setMessageType(type);
        setTimeout(() => setMessage(''), 5000);
    };

    const handleSyncAll = async () => {
        setLoading(true);
        try {
            const results = await dataSyncService.syncAllData();
            showMessage(`Sync completed! Academic: ${results.academic}, Past Papers: ${results.pastPapers}, Tools: ${results.tools}, Portfolios: ${results.portfolios}`, 'success');
            await fetchSyncStatus();
        } catch (error) {
            showMessage('Sync failed. Please try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncAcademic = async () => {
        setLoading(true);
        try {
            const count = await dataSyncService.syncAcademicData();
            showMessage(`Synced ${count} academic items`, 'success');
            await fetchSyncStatus();
        } catch (error) {
            showMessage('Academic sync failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncPastPapers = async () => {
        setLoading(true);
        try {
            const count = await dataSyncService.syncPastPapersData();
            showMessage(`Synced ${count} past paper items`, 'success');
            await fetchSyncStatus();
        } catch (error) {
            showMessage('Past papers sync failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncTools = async () => {
        setLoading(true);
        try {
            const count = await dataSyncService.syncToolsData();
            showMessage(`Synced ${count} tool items`, 'success');
            await fetchSyncStatus();
        } catch (error) {
            showMessage('Tools sync failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSyncPortfolios = async () => {
        setLoading(true);
        try {
            const count = await dataSyncService.syncPortfolioData();
            showMessage(`Synced ${count} portfolio items`, 'success');
            await fetchSyncStatus();
        } catch (error) {
            showMessage('Portfolio sync failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('Are you sure you want to clear all Firebase data? This action cannot be undone.')) {
            return;
        }
        
        setLoading(true);
        try {
            const count = await dataSyncService.clearAllData();
            showMessage(`Cleared ${count} items from Firebase`, 'success');
            setSyncStatus(null);
        } catch (error) {
            showMessage('Clear operation failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg border border-[#ffd200] p-6">
            <h3 className="text-xl font-extrabold mb-6">Data Sync Manager</h3>
            
            {/* Message Display */}
            {message && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                    messageType === 'success' ? 'bg-green-100 text-green-700' :
                    messageType === 'error' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                }`}>
                    {message}
                </div>
            )}

            {/* Sync Status */}
            {syncStatus && (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Current Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                        <div className="flex justify-between">
                            <span>Total Items:</span>
                            <span className="font-semibold">{syncStatus.total}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Outlines:</span>
                            <span className="font-semibold">{syncStatus.outlines}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Notes:</span>
                            <span className="font-semibold">{syncStatus.notes}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Past Papers:</span>
                            <span className="font-semibold">{syncStatus.pastPapers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tools:</span>
                            <span className="font-semibold">{syncStatus.tools}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Portfolios:</span>
                            <span className="font-semibold">{syncStatus.portfolios}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Sync Buttons */}
            <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={handleSyncAll}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                        {loading ? 'Syncing...' : 'Sync All Data'}
                    </button>
                    <button
                        onClick={handleSyncAcademic}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Syncing...' : 'Sync Academic'}
                    </button>
                    <button
                        onClick={handleSyncPastPapers}
                        disabled={loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Syncing...' : 'Sync Past Papers'}
                    </button>
                    <button
                        onClick={handleSyncTools}
                        disabled={loading}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Syncing...' : 'Sync Tools'}
                    </button>
                    <button
                        onClick={handleSyncPortfolios}
                        disabled={loading}
                        className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Syncing...' : 'Sync Portfolios'}
                    </button>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={fetchSyncStatus}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Refresh Status
                    </button>
                    <button
                        onClick={handleClearAll}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Clear All Data
                    </button>
                </div>
            </div>

            {/* Instructions */}
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold mb-2 text-yellow-800">Instructions:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Update links in <code className="bg-yellow-100 px-1">src/utils/data.js</code></li>
                    <li>• Click "Sync All Data" to update Firebase with new links</li>
                    <li>• Links will automatically appear on the website after sync</li>
                    <li>• Use individual sync buttons for specific sections</li>
                    <li>• "Clear All Data" removes all Firebase entries (use with caution)</li>
                </ul>
            </div>
        </div>
    );
};

export default DataSyncManager;
