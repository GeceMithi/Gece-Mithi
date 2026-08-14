import React from 'react';
import DownloadButton from './DownloadButton';

const NotesCard = ({ item, showMeta = true }) => {
    return (
        <div className="flex flex-col items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
                <p className="font-semibold text-gray-800">{item.title}</p>
                {showMeta && (
                    <p className="mt-1 text-sm text-gray-500">Part {item.part} • Semester {item.semester}</p>
                )}
            </div>
            <div className="flex-shrink-0">
                <DownloadButton linkUrl={item.fileUrl} buttonText="Download" />
            </div>
        </div>
    );
};

export default NotesCard;
