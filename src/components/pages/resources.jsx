// resources.jsx - Merged Portfolio and Tools (Static Data)
import React from 'react';
import { portfolioData, toolsData } from '../../utils/data';
import { Icon } from '../services/uicomponents';

const Resources = () => {
    const actionButtonClass = "inline-flex items-center justify-center gap-2 bg-green-600 text-white border border-green-600 px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm";

    return (
        <>
            <div className="text-center mb-16 pt-8 pb-10">
                <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tighter content-entry-animation sm:text-5xl">
                    Welcome to <span className="text-green-700"> B.Ed. (Hons)</span>
                </h1>
                <p className="mt-4 text-xl font-medium text-gray-600 content-entry-animation" style={{ animationDelay: '0.3s' }}>
                    Resources
                </p>
                <p className="mt-8 text-lg text-gray-500 content-entry-animation" style={{ animationDelay: '0.4s' }}>
                    Access teaching tools and portfolio templates for your B.Ed journey.
                </p>
            </div>

            {/* Portfolio Section */}
            <div className="mb-16 bg-white rounded-3xl shadow-xl border border-yellow-400 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portfolioData.map((portfolio, index) => (
                        <div
                            key={portfolio.title}
                            className={`bg-white rounded-2xl shadow-xl border-2 border-yellow-400 overflow-hidden hover:shadow-2xl hover:border-yellow-500 hover:translate-y-[-4px] transition-all duration-300 flex flex-col items-start content-entry-animation ${index === portfolioData.length - 1 ? 'lg:col-start-2 lg:col-end-4 lg:max-w-[460px] lg:justify-self-center' : ''}`}
                            style={{ animationDelay: `${0.1 + (index * 0.15)}s` }}
                        >
                            <div className="p-6 bg-linear-to-r from-green-50 to-yellow-50 w-full flex-grow">
                                <h3 className="text-xl font-bold text-gray-800 mb-6">
                                    {portfolio.title}
                                </h3>
                                <div className="space-y-4">
                                    {portfolio.outlineLink && (
                                        <div className="grid grid-cols-[1fr_auto] items-center gap-4 bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
                                            <span className="text-base font-semibold text-gray-800">Outline</span>
                                            <a
                                                href={portfolio.outlineLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className={actionButtonClass}
                                            >
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                                    <polyline points="7 10 12 15 17 10"></polyline>
                                                    <line x1="12" y1="15" x2="12" y2="3"></line>
                                                </svg>
                                                Download
                                            </a>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-[1fr_auto] items-center gap-4 bg-white p-4 rounded-2xl border border-green-100 shadow-sm">
                                        <span className="text-base font-semibold text-gray-800">Portfolio</span>
                                        <a
                                            href={portfolio.downloadLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className={actionButtonClass}
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
                    {toolsData.map((tool) => (
                        <div key={tool.id} className={`group bg-white p-6 rounded-2xl shadow-sm border-2 border-yellow-400 ${tool.color.split(' ')[2]} cursor-pointer hover:shadow-xl hover:border-yellow-500 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full`}>
                            <div>
                                <div className={`w-14 h-14 ${tool.color.split(' ')[0]} ${tool.color.split(' ')[1]} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon path={tool.icon} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#004d00] transition-colors line-clamp-2">
                                    {tool.title}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-3">
                                    {tool.desc}
                                </p>
                            </div>
                            <a
                                href={tool.link}
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
