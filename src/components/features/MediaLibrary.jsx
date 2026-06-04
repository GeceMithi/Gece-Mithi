import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

// Icons
const Icons = {
    File: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
    ),
    Download: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    ),
    Eye: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
    Search: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
        </svg>
    ),
    Filter: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
    ),
    Grid: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    ),
    List: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
    ),
};

const MediaLibrary = ({ category: initialCategory = "all" }) => {
    const [mediaItems, setMediaItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [viewMode, setViewMode] = useState("grid"); // grid or list
    const [selectedItem, setSelectedItem] = useState(null);

    // Fetch media items
    const fetchMediaItems = async () => {
        try {
            setLoading(true);
            const q = query(collection(db, "media_files"), orderBy("createdAt", "desc"));
            const mediaSnap = await getDocs(q);
            const items = mediaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMediaItems(items);
            setFilteredItems(items);
        } catch (error) {
            console.error("Error fetching media items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMediaItems();
    }, []);

    // Filter items based on search and category
    useEffect(() => {
        let filtered = mediaItems;

        // Filter by category
        if (selectedCategory !== "all") {
            filtered = filtered.filter(item => item.category === selectedCategory);
        }

        // Filter by search term
        if (searchTerm.trim()) {
            filtered = filtered.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.originalFileName?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredItems(filtered);
    }, [mediaItems, selectedCategory, searchTerm]);

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            outline: "text-blue-600 bg-blue-50 border-blue-200",
            notes: "text-yellow-600 bg-yellow-50 border-yellow-200",
            tool: "text-red-600 bg-red-50 border-red-200",
            past_paper: "text-green-600 bg-green-50 border-green-200",
        };
        return colors[category] || "text-gray-600 bg-gray-50 border-gray-200";
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return "Unknown";
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
    };

    // Get file icon based on format
    const getFileIcon = (format) => {
        if (!format) return <Icons.File />;
        
        const iconMap = {
            pdf: () => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
            ),
            jpg: () => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            ),
            png: () => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
            ),
            doc: () => (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
            ),
        };

        const IconComponent = iconMap[format.toLowerCase()] || Icons.File;
        return <IconComponent />;
    };

    // Get category stats
    const getCategoryStats = () => {
        const stats = {
            all: mediaItems.length,
            outline: mediaItems.filter(item => item.category === "outline").length,
            notes: mediaItems.filter(item => item.category === "notes").length,
            tool: mediaItems.filter(item => item.category === "tool").length,
            past_paper: mediaItems.filter(item => item.category === "past_paper").length,
        };
        return stats;
    };

    const stats = getCategoryStats();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f8f9fa] p-6">
                <div className="container mx-auto">
                    <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8f9fa] p-6">
            <div className="container mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#ffd200] p-6 mb-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 mb-2">Digital Media Library</h1>
                            <p className="text-gray-500">Access notes, outlines, past papers, and tools</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-center px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
                                <span className="block text-xl font-bold text-blue-600">{stats.all}</span>
                                <span className="text-xs text-gray-500 font-bold uppercase">Total Files</span>
                            </div>
                            <div className="text-center px-4 py-2 bg-green-50 rounded-xl border border-green-100">
                                <span className="block text-xl font-bold text-green-600">{stats.notes}</span>
                                <span className="text-xs text-gray-500 font-bold uppercase">Notes</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-2xl shadow-sm border border-[#ffd200] p-6 mb-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by title, description, or filename..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="flex gap-2 flex-wrap">
                            {[
                                { value: "all", label: "All", count: stats.all },
                                { value: "outline", label: "Outlines", count: stats.outline },
                                { value: "notes", label: "Notes", count: stats.notes },
                                { value: "tool", label: "Tools", count: stats.tool },
                                { value: "past_paper", label: "Past Papers", count: stats.past_paper },
                            ].map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                                        selectedCategory === cat.value
                                            ? "bg-[#004d00] text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {cat.label} ({cat.count})
                                </button>
                            ))}
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === "grid" ? "bg-[#004d00] text-white" : "bg-gray-100 text-gray-700"
                                }`}
                                title="Grid View"
                            >
                                <Icons.Grid />
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`p-2 rounded-lg transition-colors ${
                                    viewMode === "list" ? "bg-[#004d00] text-white" : "bg-gray-100 text-gray-700"
                                }`}
                                title="List View"
                            >
                                <Icons.List />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        Showing {filteredItems.length} of {mediaItems.length} items
                    </p>
                </div>

                {/* Media Items */}
                {filteredItems.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-[#ffd200] p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-700 mb-2">No media items found</h3>
                        <p className="text-gray-500">
                            {searchTerm || selectedCategory !== "all"
                                ? "Try adjusting your search or filters"
                                : "No media items have been uploaded yet"}
                        </p>
                    </div>
                ) : (
                    <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
                        {filteredItems.map((item) => (
                            <div
                                key={item.id}
                                className={`bg-white rounded-xl shadow-sm border border-[#ffd200] hover:shadow-md transition-all duration-300 ${
                                    viewMode === "list" ? "p-4" : "p-6"
                                }`}
                            >
                                <div className={viewMode === "list" ? "flex items-center gap-4" : ""}>
                                    {/* File Icon */}
                                    <div className={`shrink-0 ${viewMode === "list" ? "" : "mb-4"}`}>
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getCategoryColor(item.category)}`}>
                                            {getFileIcon(item.format)}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`flex-1 ${viewMode === "list" ? "" : "mb-4"}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${getCategoryColor(item.category)}`}>
                                                {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace("_", " ")}
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-gray-800 mb-1 line-clamp-2">{item.title}</h3>
                                        {item.description && (
                                            <p className="text-sm text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                                        )}
                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                            {item.size && <span>{formatFileSize(item.size)}</span>}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className={`flex items-center gap-2 ${viewMode === "list" ? "ml-auto" : ""}`}>
                                        <a
                                            href={item.fileUrl || item.cloudinaryUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View"
                                        >
                                            <Icons.Eye />
                                        </a>
                                        <a
                                            href={item.fileUrl || item.cloudinaryUrl}
                                            download={item.originalFileName || item.title}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Icons.Download />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MediaLibrary;
