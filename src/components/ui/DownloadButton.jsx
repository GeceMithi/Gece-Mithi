import React from 'react';
import { Icon } from '../services/uicomponents';

const normalizeGoogleDriveDownloadUrl = (rawUrl) => {
    if (!rawUrl || typeof rawUrl !== 'string') return '';

    const trimmedUrl = rawUrl.trim();
    if (!trimmedUrl) return '';

    try {
        const url = new URL(trimmedUrl);
        const driveId = url.searchParams.get('id');
        if (driveId) {
            return `https://drive.google.com/uc?export=download&id=${driveId}`;
        }
    } catch (error) {
        // Ignore invalid URL parsing; fallback to regex-based conversion below.
    }

    const match = trimmedUrl.match(/(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }

    return trimmedUrl;
};

const DownloadButton = ({ linkUrl, buttonText = 'Download', className = '' }) => {
    const isMockLink = linkUrl && linkUrl.includes('Placeholder');
    const safeLink = normalizeGoogleDriveDownloadUrl(linkUrl);

    if (isMockLink || !safeLink) {
        return (
            <span className={`inline-flex items-center rounded-full bg-gray-200 px-3 py-1 text-xs font-semibold text-gray-600 ${className}`}>
                Coming Soon
            </span>
        );
    }

    return (
        <a
            href={safeLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center rounded-full border-2 border-yellow-400 bg-green-600 px-3 py-1 text-sm font-semibold text-white shadow-md transition duration-300 hover:border-red-400 hover:bg-red-600 ${className}`}
        >
            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m4 4V4" className="mr-1 h-4 w-4" />
            {buttonText}
        </a>
    );
};

export default DownloadButton;
