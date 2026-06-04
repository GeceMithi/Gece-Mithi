import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import cloudinaryService from "../../services/cloudinaryService";

// Icons
const Icons = {
    Upload: () => (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
    ),
    File: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    Trash: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Eye: () => (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
    Cloud: () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
    ),
};

const CloudinaryMediaManager = ({ defaultCategory = "outline", lockCategory = false }) => {
    // Form state
    const [mediaForm, setMediaForm] = useState({
        category: defaultCategory,
        fileSource: "upload",
        fileUrl: "",
        selectedFile: null,
        year: "",
        semester: "",
        subject: "",
        courseCode: "",
        portfolio: "",
    });

    // Data states
    const [mediaItems, setMediaItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Fetch all media items
    const fetchMediaItems = async () => {
        try {
            const mediaSnap = await getDocs(collection(db, "media_files"));
            const items = mediaSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Filter by category if locked
            const filteredItems = lockCategory 
                ? items.filter(item => item.category === defaultCategory)
                : items;
            setMediaItems(filteredItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error("Error fetching media items:", error);
        }
    };

    useEffect(() => {
        fetchMediaItems();
    }, [lockCategory, defaultCategory]);

    // Upload file to Cloudinary
    const uploadToCloudinary = async (file) => {
        try {
            const result = await cloudinaryService.uploadFile(
                file,
                "media",
                (progress) => setUploadProgress(progress)
            );
            return result;
        } catch (error) {
            console.error("Upload failed:", error);
            return null;
        }
    };

    // Handle file selection
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMediaForm({
                ...mediaForm,
                selectedFile: file,
                fileUrl: "",
            });
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if (mediaForm.fileSource === "upload" && !mediaForm.selectedFile) {
            alert("Please select a file to upload!");
            return;
        }

        if (mediaForm.fileSource === "url" && !mediaForm.fileUrl.trim()) {
            alert("Please enter a valid URL!");
            return;
        }

        // Validate academic fields for outline, notes, past papers
        if ((mediaForm.category === "outline" || mediaForm.category === "notes" || mediaForm.category === "past_paper")) {
            if (!mediaForm.year) {
                alert("Year is required for academic content!");
                return;
            }
            if (!mediaForm.semester) {
                alert("Semester is required for academic content!");
                return;
            }
            if (!mediaForm.subject.trim()) {
                alert("Subject/Course name is required for academic content!");
                return;
            }
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            let fileData = {};

            if (mediaForm.fileSource === "upload") {
                // Upload file to Cloudinary
                const uploadResult = await uploadToCloudinary(mediaForm.selectedFile);
                if (!uploadResult) {
                    throw new Error("Failed to upload file to Cloudinary");
                }
                
                fileData = {
                    fileUrl: uploadResult.url,
                    storagePath: uploadResult.publicId || uploadResult.path || '',
                    fileName: mediaForm.selectedFile.name,
                    size: mediaForm.selectedFile.size,
                    fileType: mediaForm.selectedFile.type,
                    originalFileName: mediaForm.selectedFile.name,
                    cloudinaryPublicId: uploadResult.publicId || null,
                };
            } else {
                // Direct URL input
                fileData = {
                    fileUrl: mediaForm.fileUrl.trim(),
                    isDirectUrl: true,
                };
            }

            // Save to Firestore
            await addDoc(collection(db, "media_files"), {
                category: mediaForm.category,
                year: mediaForm.year,
                semester: mediaForm.semester,
                subject: mediaForm.subject.trim(),
                courseCode: mediaForm.courseCode.trim(),
                portfolio: mediaForm.portfolio,
                ...fileData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            // Reset form
            setMediaForm({
                category: "outline",
                fileSource: "upload",
                fileUrl: "",
                selectedFile: null,
                year: "",
                semester: "",
                subject: "",
                courseCode: "",
                portfolio: "",
            });

            // Reset file input
            const fileInput = document.getElementById("file-input");
            if (fileInput) fileInput.value = "";

            fetchMediaItems();
            alert("Media uploaded successfully!");

        } catch (error) {
            console.error("Error uploading media:", error);
            alert("Failed to upload media: " + error.message);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    // Delete media item
    const deleteMediaItem = async (id, storagePath) => {
        if (!window.confirm("Are you sure you want to delete this media item?")) return;

        setLoading(true);
        try {
            // Note: Cloudinary file deletion requires secure server-side support.
            // Here we remove the Firestore metadata record only.
            await deleteDoc(doc(db, "media_files", id));
            fetchMediaItems();
            alert("Media item deleted successfully!");
        } catch (error) {
            console.error("Error deleting media item:", error);
            alert("Failed to delete media item!");
        } finally {
            setLoading(false);
        }
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            outline: "text-blue-600 bg-blue-50",
            notes: "text-yellow-600 bg-yellow-50",
            tool: "text-red-600 bg-red-50",
            past_paper: "text-green-600 bg-green-50",
        };
        return colors[category] || "text-gray-600 bg-gray-50";
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return "Unknown";
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + " " + sizes[i];
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
            <h3 className="text-xl font-extrabold mb-6 flex items-center">
                <Icons.Cloud className="mr-2" />
                Cloudinary Media & Documents Manager
            </h3>

            {/* Upload Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
    
                {/* Category Field - Only show if not locked */}
                {!lockCategory && (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Category *
                        </label>
                        <select
                            value={mediaForm.category}
                            onChange={(e) => setMediaForm({ ...mediaForm, category: e.target.value })}
                            className="w-full p-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                        >
                            <option value="outline">Outline</option>
                            <option value="notes">Notes</option>
                            <option value="tool">Tool</option>
                            <option value="past_paper">Past Paper</option>
                        </select>
                    </div>
                )}

                {/* Portfolio Field */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        Portfolio (Optional)
                    </label>
                    <select
                        value={mediaForm.portfolio}
                        onChange={(e) => setMediaForm({ ...mediaForm, portfolio: e.target.value })}
                        className="w-full p-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                    >
                        <option value="">Select Portfolio (Optional)</option>
                        <option value="developmental">Developmental Portfolio</option>
                        <option value="professional">Professional Portfolio</option>
                        <option value="reading">Reading Portfolio</option>
                        <option value="advance">Advance Portfolio</option>
                    </select>
                </div>

                {/* File Source Radio Buttons */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        File Source *
                    </label>
                    <div className="flex space-x-6">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="fileSource"
                                value="upload"
                                checked={mediaForm.fileSource === "upload"}
                                onChange={(e) => setMediaForm({ ...mediaForm, fileSource: "upload", fileUrl: "" })}
                                className="mr-2"
                            />
                            <span className="text-gray-700 font-medium">Direct File Upload</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                name="fileSource"
                                value="url"
                                checked={mediaForm.fileSource === "url"}
                                onChange={(e) => setMediaForm({ ...mediaForm, fileSource: "url", selectedFile: null })}
                                className="mr-2"
                            />
                            <span className="text-gray-700 font-medium">URL Input</span>
                        </label>
                    </div>
                </div>

                {/* File Upload / URL Input */}
                {mediaForm.fileSource === "upload" ? (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Select File *
                        </label>
                        <input
                            id="file-input"
                            type="file"
                            onChange={handleFileSelect}
                            accept=".pdf,.jpg,.jpeg,.png,.gif,.doc,.docx"
                            className="w-full p-3 border rounded-lg text-base font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#004d00] file:text-white hover:file:bg-[#003300]"
                        />
                        {mediaForm.selectedFile && (
                            <p className="mt-2 text-sm text-gray-600">
                                Selected: {mediaForm.selectedFile.name} ({formatFileSize(mediaForm.selectedFile.size)})
                            </p>
                        )}
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            File URL *
                        </label>
                        <input
                            type="url"
                            placeholder="Enter direct file URL (Google Drive, Dropbox, etc.)"
                            value={mediaForm.fileUrl}
                            onChange={(e) => setMediaForm({ ...mediaForm, fileUrl: e.target.value })}
                            className="w-full p-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                        />
                    </div>
                )}

                {/* Academic Fields - Show for outline, notes, past_paper */}
                {(mediaForm.category === "outline" || mediaForm.category === "notes" || mediaForm.category === "past_paper") && (
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                        <h4 className="text-sm font-bold text-gray-700 mb-3">Academic Information</h4>
                        
                        {/* Year Field */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Year *
                            </label>
                            <select
                                value={mediaForm.year}
                                onChange={(e) => setMediaForm({ ...mediaForm, year: e.target.value })}
                                className="w-full p-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="1">Year 1 (Associate Degree / B.Ed)</option>
                                <option value="2">Year 2 (Associate Degree Final)</option>
                                <option value="3">Year 3 (B.Ed Hons)</option>
                                <option value="4">Year 4 (Final Year)</option>
                            </select>
                        </div>

                        {/* Semester Field */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Semester *
                            </label>
                            <select
                                value={mediaForm.semester}
                                onChange={(e) => setMediaForm({ ...mediaForm, semester: e.target.value })}
                                className="w-full p-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                                required
                            >
                                <option value="">Select Semester</option>
                                {mediaForm.year === "1" && (
                                    <>
                                        <option value="1">Semester 1</option>
                                        <option value="2">Semester 2</option>
                                    </>
                                )}
                                {mediaForm.year === "2" && (
                                    <>
                                        <option value="3">Semester 3</option>
                                        <option value="4">Semester 4</option>
                                    </>
                                )}
                                {mediaForm.year === "3" && (
                                    <>
                                        <option value="5">Semester 5</option>
                                        <option value="6">Semester 6</option>
                                    </>
                                )}
                                {mediaForm.year === "4" && (
                                    <>
                                        <option value="7">Semester 7</option>
                                        <option value="8">Semester 8</option>
                                    </>
                                )}
                            </select>
                        </div>

                        {/* Subject/Course Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Subject/Course Name *
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., Functional English, Teaching Mathematics, etc."
                                value={mediaForm.subject}
                                onChange={(e) => setMediaForm({ ...mediaForm, subject: e.target.value })}
                                className="w-full p-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                                required
                            />
                        </div>

                        {/* Course Code (Optional) */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Course Code (Optional)
                            </label>
                            <input
                                type="text"
                                placeholder="e.g., GENG-300, EED-301, etc."
                                value={mediaForm.courseCode}
                                onChange={(e) => setMediaForm({ ...mediaForm, courseCode: e.target.value })}
                                className="w-full p-3 border rounded-lg text-base font-semibold focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#004d00] hover:bg-[#003800] text-white px-6 py-3 rounded-lg font-bold shadow-md transition-all text-xs uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Uploading...
                        </>
                    ) : (
                        <>
                            <Icons.Upload className="mr-2" />
                            Upload to Cloudinary
                        </>
                    )}
                </button>
            </form>

            {/* Media Items List */}
            <div className="border-t pt-6">
                <h4 className="text-lg font-bold mb-4">Uploaded Media Items</h4>
                {mediaItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No media items uploaded yet.</p>
                ) : (
                    <div className="space-y-3">
                        {mediaItems.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${getCategoryColor(item.category)}`}>
                                                {item.category.charAt(0).toUpperCase() + item.category.slice(1)}
                                            </span>
                                            {item.originalFileName && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {item.originalFileName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                            <span>Uploaded: {new Date(item.createdAt).toLocaleDateString()}</span>
                                            {item.size && <span>Size: {formatFileSize(item.size)}</span>}
                                            {item.format && <span>Format: {item.format.toUpperCase()}</span>}
                                            {item.year && <span>Year: {item.year}</span>}
                                            {item.semester && <span>Semester: {item.semester}</span>}
                                            {item.subject && <span>Subject: {item.subject}</span>}
                                            {item.courseCode && <span>Code: {item.courseCode}</span>}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 ml-4">
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
                                            download={item.originalFileName || item.category}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Icons.Download />
                                        </a>
                                        <button
                                            onClick={() => deleteMediaItem(item.id, item.storagePath)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Icons.Trash />
                                        </button>
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

export default CloudinaryMediaManager;
