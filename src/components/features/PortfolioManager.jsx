import React, { useState, useEffect } from 'react';
import dynamicDataService from '../../services/dynamicDataService';

const PortfolioManager = () => {
    const [portfolioData, setPortfolioData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolioData = async () => {
            try {
                const data = await dynamicDataService.getPortfolioData();
                setPortfolioData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching portfolio data:', error);
                setLoading(false);
            }
        };

        fetchPortfolioData();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                <h3 className="text-xl font-extrabold mb-6">Portfolio Manager</h3>
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
            <h3 className="text-xl font-extrabold mb-6">Portfolio Manager</h3>

            <div className="space-y-6">
                {portfolioData.map((portfolio) => (
                    <div key={portfolio.id} className="border-2 border-[#ffd200] rounded-xl overflow-hidden">
                        <div className="p-4 bg-linear-to-r from-green-50 to-yellow-50">
                            <h4 className="text-lg font-bold text-gray-800 mb-1">{portfolio.title}</h4>
                            <p className="text-sm text-gray-600 mb-3">{portfolio.description}</p>
                            <a
                                href={portfolio.downloadLink}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                    <polyline points="7 10 12 15 17 10"></polyline>
                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                </svg>
                                Download
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Portfolio data is managed dynamically through Firebase. Upload new portfolio files through the Academic Content Manager to update links.
                </p>
            </div>
        </div>
    );
};

export default PortfolioManager;
