// UIComponents.jsx
import React from 'react';

export const Icon = ({ path, className = "w-5 h-5 inline mr-1 -mt-0.5" }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={path} />
    </svg>
);

export const DownloadLink = ({ linkUrl, buttonText }) => {
    const isMockLink = linkUrl && linkUrl.includes("Placeholder");
    
    if (isMockLink || !linkUrl) {
        return (
            <span className="flex items-center text-xs font-semibold px-3 py-1 bg-gray-200 text-gray-600 rounded-full opacity-90">
                Coming Soon
            </span>
        );
    }

    return (
        <a 
            href={linkUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center text-sm font-semibold px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-300 shadow-md hover:shadow-lg"
        >
            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4 mr-1"/>
            {buttonText}
        </a>
    );
};