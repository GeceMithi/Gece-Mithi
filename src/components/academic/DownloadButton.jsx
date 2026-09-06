import React from 'react';

const convertDriveUrlToDirectDownload = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';

  const trimmedUrl = rawUrl.trim();
  if (!trimmedUrl) return '';

  const match = trimmedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }

  return trimmedUrl;
};

const DownloadButton = ({ url, label = 'Download' }) => {
  const directUrl = convertDriveUrlToDirectDownload(url);

  if (!directUrl) {
    return (
      <button
        type="button"
        disabled
        className="w-full flex items-center justify-center gap-2 bg-gray-300 text-gray-600 border border-gray-200 py-2.5 rounded-lg text-sm font-bold cursor-not-allowed"
      >
        No file
      </button>
    );
  }

  return (
    <a
      href={directUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full flex items-center justify-center gap-2 bg-green-600 text-white border border-[#ffd200] hover:bg-red-600 hover:border-red-400 py-2.5 rounded-lg text-sm font-bold transition-all"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {label}
    </a>
  );
};

export default DownloadButton;
