import React from 'react';
import { portfolioData } from '../data';
import { Icon, DownloadLink } from './uicomponents';

const Portfolio = () => {
    // 1. Define the title variable here
    const title = "Portfolio Resources"; 
    
    const descriptionText = "Explore various types of portfolios essential for B.Ed (Hons) students to track development and showcase professional readiness.";

    return (
        <>
            <div className="text-center mb-16 pt-8 pb-10">
                <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tighter content-entry-animation sm:text-5xl">
                  Welcome to <span className="text-green-700"> B.Ed. (Hons)</span>
                </h1>
                
                {/* Now this will work because 'title' is defined above */}
                <p className="mt-4 text-xl font-medium text-gray-600 content-entry-animation" style={{ animationDelay: '0.3s' }}>
                    {title}
                </p>
                <p className="mt-8 text-lg text-gray-500 content-entry-animation" style={{ animationDelay: '0.4s' }}>
                    {descriptionText}
                </p>
            </div>
            
            {/* This will also work now */}
            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight sm:text-5xl text-center mb-8">
                {title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                {portfolioData.map((item, index) => (
                    <div 
                        key={item.title} 
                        className="p-6 bg-white rounded-2xl shadow-xl border border-[#ffd200] transition-all duration-300 hover:shadow-2xl hover:border-indigo-400 hover:translate-y-[-4px] content-entry-animation flex flex-col items-start"
                        style={{ animationDelay: `${0.1 + (index * 0.15)}s` }}
                    >
                        <Icon path={item.iconPath} className="w-8 h-8 text-indigo-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {item.title}
                        </h3>
                        <p className="text-sm text-gray-600 flex-grow mb-4">
                            {item.description}
                        </p>
                        <DownloadLink 
                            linkUrl={item.downloadLink} 
                            buttonText="Download" 
                        />
                    </div>
                ))}
            </div>
        </>
    );
};

export default Portfolio;