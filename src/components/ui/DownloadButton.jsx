import React from 'react';
import { Icon } from '../services/uicomponents';

const DownloadButton = ({ linkUrl, buttonText = 'Download', className = '' }) => {
    const isMockLink = linkUrl && linkUrl.includes('Placeholder');

    if (isMockLink || !linkUrl) {
        return (
            <span className={`inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 ${className}`}>
                Coming Soon
            </span>
        );
    }

    return (
        <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded-full border-2 border-yellow-400 bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-md transition duration-300 hover:border-red-400 hover:bg-red-600 ${className}`}
        >
            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="mr-1 h-4 w-4" />
            {buttonText}
        </a>
    );
};

export default DownloadButton;
