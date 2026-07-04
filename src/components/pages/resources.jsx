// resources.jsx - Merged Portfolio and Tools (Static Data)
import React from 'react';
import { portfolioData, toolsData } from '../../utils/data';
import { Icon, DownloadLink } from '../services/uicomponents';

const Resources = () => {

    return (
        <>
            <div className="text-center mb-16 pt-8 pb-10">
                <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tighter content-entry-animation sm:text-5xl">
                    Welcome to <span className="text-green-700"> B.Ed. (Hons)</span>
                </h1>
                <h2 className="mt-4 text-1xl md:text-2xl font-extrabold text-gray-800 content-entry-animation" style={{ animationDelay: '0.3s' }}>
                    Practicum Porfolio & Teaching Tools
                </h2>
                <p className="mt-8 text-base md:text-lg text-gray-600 max-w-1xl mx-auto leading-relaxed px-4 content-entry-animation" style={{ animationDelay: '0.4s' }}>
                    Access teaching tools and portfolio templates for your B.Ed journey.
                </p>
            </div>

            {/* Portfolio Section */}
            <div className="mb-16 bg-white rounded-3xl shadow-xl border border-yellow-400 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {portfolioData.map((portfolio, index) => (
                        <div
                            key={portfolio.title}
                            className={`bg-linear-to-br from-green-50 via-yellow-50 to-green-100 rounded-2xl shadow-lg border-2 border-yellow-400 overflow-hidden hover:shadow-2xl hover:border-yellow-500 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start content-entry-animation ${index === portfolioData.length - 1 ? 'lg:col-start-2 lg:col-end-4 lg:max-w-[460px] lg:justify-self-center' : ''}`}
                            style={{ animationDelay: `${0.1 + (index * 0.15)}s` }}
                        >
                            <div className="p-6 bg-transparent w-full grow">
                                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-6">
                                    {portfolio.title}
                                </h3>
                                <div className="space-y-4">
                                    {portfolio.outlineLink && (
                                        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-yellow-400 shadow-sm min-w-0">
                                            <span className="text-base font-semibold text-gray-800">Outline</span>
                                            <DownloadLink linkUrl={portfolio.outlineLink} buttonText="Download" />
                                        </div>
                                    )}
                                    {portfolio.handout && (
                                        <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-yellow-400 shadow-sm min-w-0">
                                            <span className="text-base font-semibold text-gray-800">Handout</span>
                                            <DownloadLink linkUrl={portfolio.handout} buttonText="Download" />
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-yellow-400 shadow-sm min-w-0">
                                        <span className="text-base font-semibold text-gray-800">Portfolio</span>
                                        <DownloadLink linkUrl={portfolio.downloadLink} buttonText="Download" />
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
