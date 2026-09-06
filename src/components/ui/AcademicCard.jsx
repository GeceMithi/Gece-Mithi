import React, { useState } from 'react';
import { Icon } from '../services/uicomponents';
import dynamicDataService from '../../services/dynamicDataService';

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
        // Ignore invalid URL parsing; fallback to regex.
    }

    const match = trimmedUrl.match(/(?:drive\.google\.com\/file\/d\/|drive\.google\.com\/d\/|drive\.google\.com\/open\?id=)([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }

    return trimmedUrl;
};

const AcademicCard = ({ 
    type, // 'outline', 'notes', 'past_paper'
    year, 
    semester, 
    courseCode, 
    subject, 
    link, 
    onAddNew, 
    onUpdateLink,
    showActions = true,
    compact = false 
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [newLink, setNewLink] = useState('');

    const getTypeLabel = () => {
        switch(type) {
            case 'outline': return 'Course Outline';
            case 'notes': return 'Course Notes';
            case 'past_paper': return 'Past Paper';
            default: return 'Material';
        }
    };

    const getTypeColor = () => {
        switch(type) {
            case 'outline': return 'border-blue-300 bg-blue-50';
            case 'notes': return 'border-green-300 bg-green-50';
            case 'past_paper': return 'border-purple-300 bg-purple-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const handleUpdate = () => {
        if (newLink.trim()) {
            onUpdateLink({
                year,
                semester,
                courseCode,
                subject,
                link: newLink.trim()
            });
            setNewLink('');
            setShowUpdateForm(false);
        }
    };

    const handleDownload = async (e) => {
        e.preventDefault();

        const directDownloadUrl = normalizeGoogleDriveDownloadUrl(link);
        
        try {
            // Track the download in Firebase
            const tracked = await dynamicDataService.trackDownload(
                type,
                year,
                semester,
                subject,
                courseCode,
                directDownloadUrl || link
            );
            
            if (tracked) {
                console.log("📊 Download tracked successfully");
            }
            
            // Open the download link in a new tab
            window.open(directDownloadUrl || link, '_blank', 'noopener,noreferrer');
            
        } catch (error) {
            console.error("❌ Error during download:", error);
            // Still try to open the link even if tracking fails
            window.open(directDownloadUrl || link, '_blank', 'noopener,noreferrer');
        }
    };

    const isPlaceholder = link && link.includes("Placeholder");
    const directDownloadLink = normalizeGoogleDriveDownloadUrl(link);
    
    // Debug logging
    console.log("AcademicCard - Type:", type);
    console.log("AcademicCard - Subject:", subject);
    console.log("AcademicCard - Link:", link);
    console.log("AcademicCard - IsPlaceholder:", isPlaceholder);
    console.log("AcademicCard - Show download button:", link && link !== "Placeholder");

    return (
        <div className={`border-2 rounded-lg p-4 transition-all duration-300 hover:shadow-md ${getTypeColor()} ${compact ? 'p-3' : 'p-4'}`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-gray-600">
                            Part {year} • Sem {semester}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                            type === 'outline' ? 'bg-blue-100 text-blue-700' :
                            type === 'notes' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                        }`}>
                            {getTypeLabel()}
                        </span>
                    </div>
                    <h3 className="font-bold text-gray-800">
                        {courseCode && `${courseCode} - `}{subject}
                    </h3>
                </div>
                
                {/* Download button positioned in header */}
                {(link && link !== "Placeholder" && link !== null && link !== "") && (
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={handleDownload}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors ${
                                type === 'outline' ? 'bg-blue-600 text-white hover:bg-blue-700' :
                                type === 'notes' ? 'bg-green-600 text-white hover:bg-green-700' :
                                'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                        >
                            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4" />
                            Download
                        </button>
                        
                        {!compact && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <Icon path={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
                
                {/* Show expand button when no download link */}
                {(!link || link === "Placeholder" || link === null || link === "") && !compact && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="text-gray-500 hover:text-gray-700 p-1"
                        >
                            <Icon path={isExpanded ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            
            {/* Expanded Content */}
            {isExpanded && !compact && (
                <div className="mt-3 space-y-3">
                    {/* Link Display */}
                    {link ? (
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                {isPlaceholder ? (
                                    <span className="text-sm text-gray-500 italic">
                                        No {getTypeLabel().toLowerCase()} available
                                    </span>
                                ) : (
                                    <a 
                                        href={directDownloadLink || link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm break-all"
                                    >
                                        {(directDownloadLink || link).length > 50 ? `${(directDownloadLink || link).substring(0, 50)}...` : (directDownloadLink || link)}
                                    </a>
                                )}
                            </div>
                            
                            {showActions && (
                                <div className="flex gap-2 ml-4">
                                    {!isPlaceholder && (
                                        <button 
                                            onClick={handleDownload}
                                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                                        >
                                            Download
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowUpdateForm(!showUpdateForm)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                    >
                                        Update
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-gray-500 text-sm mb-3">
                                No {getTypeLabel().toLowerCase()} link available
                            </p>
                            {showActions && (
                                <button
                                    onClick={() => setShowUpdateForm(!showUpdateForm)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                                >
                                    Add Link
                                </button>
                            )}
                        </div>
                    )}

                    {/* Update Form */}
                    {showUpdateForm && showActions && (
                        <div className="border-t pt-3">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    {link ? 'Update' : 'Add'} {getTypeLabel()} Link
                                </label>
                                <input
                                    type="url"
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full p-2 border rounded text-sm"
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleUpdate}
                                        className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                                    >
                                        {link ? 'Update' : 'Add'} Link
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowUpdateForm(false);
                                            setNewLink('');
                                        }}
                                        className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Compact Mode - Always show download button */}
            {compact && link && !isPlaceholder && (
                <div className="mt-3">
                    <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                        <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4" />
                        Download {getTypeLabel()}
                    </a>
                </div>
            )}
        </div>
    );
};

export default AcademicCard;
