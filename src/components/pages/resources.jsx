// resources.jsx - Merged Portfolio and Tools
import React from 'react';
import useResourceData from '../../hook/useResourceData';
import { Icon, DownloadLink } from '../services/uicomponents';

const portfolioTypes = [
    { type: 'development', title: 'Developmental Portfolio', part: 2, semester: 3 },
    { type: 'professional', title: 'Professional Portfolio', part: 2, semester: 4 },
    { type: 'reading', title: 'Reading Portfolio', part: 4, semester: 7 },
    { type: 'advance', title: 'Advance Portfolio', part: 4, semester: 8 },
    { type: 'research', title: 'Research Thesis', part: 4, semester: 8 }
];

const portfolioItems = [
    { type: 'outline', label: 'Outline' },
    { type: 'handout', label: 'Handout' },
    { type: 'portfolio', label: 'Portfolio' }
];

const Resources = () => {
    const { resources, loading } = useResourceData();
    const portfolioResources = resources.filter(resource => resource.category === 'portfolios');
    const toolResources = resources.filter(resource => resource.category === 'tools');

    const getPortfolioItem = (portfolioType, itemType) => portfolioResources.find(resource => (
        resource.portfolioType?.toLowerCase() === portfolioType &&
        (resource.itemType?.toLowerCase() === itemType || (
            itemType === 'portfolio' && resource.itemType?.toLowerCase() === 'notes'
        ))
    ));

    return (
        <>
            <div className="text-center mb-16 pt-8 pb-10">
                <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tighter content-entry-animation sm:text-5xl">
                    Welcome to <span className="text-green-700"> B.Ed. (Hons)</span>
                </h1>
                <h2 className="mt-4 text-1xl md:text-2xl font-extrabold text-gray-800 content-entry-animation" style={{ animationDelay: '0.3s' }}>
                    Practicum Portfolio & Teaching Tools
                </h2>
                <p className="mt-8 text-base md:text-lg text-gray-600 max-w-1xl mx-auto leading-relaxed px-4 content-entry-animation" style={{ animationDelay: '0.4s' }}>
                    Access teaching tools and portfolio templates for your B.Ed journey.
                </p>
            </div>

            {/* Portfolio Section */}
            <div className="mb-16 bg-white rounded-3xl shadow-xl border border-yellow-400 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portfolioTypes.map((portfolio, index) => (
                        <div
                            key={portfolio.type}
                            className={`bg-linear-to-br from-green-50 via-yellow-50 to-green-100 rounded-2xl shadow-lg border-2 border-yellow-400 overflow-hidden hover:shadow-2xl hover:border-yellow-500 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start content-entry-animation ${index === portfolioTypes.length - 1 ? 'lg:col-start-2 lg:col-end-4 lg:max-w-[460px] lg:justify-self-center' : ''}`}
                            style={{ animationDelay: `${0.1 + (index * 0.15)}s` }}
                        >
                            <div className="p-6 bg-transparent w-full grow">
                                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                                    {portfolio.title}
                                </h3>
                                <p className="text-xs font-bold uppercase tracking-wide text-green-700 mb-4">
                                    Part {portfolio.part} · Semester {portfolio.semester}
                                </p>
                                <div className="space-y-4">
                                    {portfolioItems.map(item => {
                                        const portfolioResource = getPortfolioItem(portfolio.type, item.type);
                                        const downloadLink = portfolioResource?.fileUrl;

                                        return (
                                            <div key={item.type} className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-yellow-400 shadow-sm min-w-0">
                                                <span className="text-base font-semibold text-gray-800">
                                                    {portfolio.type === 'research' && item.type === 'portfolio' ? 'Thesis' : item.label}
                                                </span>
                                                {downloadLink ? (
                                                    <DownloadLink linkUrl={downloadLink} buttonText="Download" />
                                                ) : (
                                                    <span className="text-xs font-medium text-gray-500">Coming Soon</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tools Section */}
            <div className="mb-16 bg-white rounded-3xl shadow-xl border border-yellow-400 p-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Teaching Tools</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">Download essential tools for classroom observation and assessment.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <p className="col-span-full text-center text-gray-500">Loading tools...</p>
                    ) : toolResources.length === 0 ? (
                        <p className="col-span-full text-center text-gray-500">No tools available.</p>
                    ) : toolResources.map((tool) => (
                        <div key={tool.id} className="group bg-white p-6 rounded-2xl shadow-sm border-2 border-yellow-400 cursor-pointer hover:shadow-xl hover:border-yellow-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full">
                            <div>
                                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
                                    <Icon path={tool.icon || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0120 6v13a2 2 0 01-2 2H7z'} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#004d00] transition-colors line-clamp-2">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {tool.description || 'Teaching and assessment resource.'}
                                </p>
                            </div>
                            <a
                                href={tool.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white border-2 border-yellow-400 rounded-lg hover:bg-red-600 hover:border-red-400 transition-all duration-300 py-2.5 font-semibold"
                            >
                                <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4" />
                                Download
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Resources;
