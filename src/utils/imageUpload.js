// Universal Image Upload Utility for Profile Pictures and Slides
// Uses Cloudinary for image uploads and Firebase Storage for text files

import cloudinaryService from '../services/cloudinaryService';

/**
 * Upload image with preview and validation
 * @param {File} file - Image file to upload
 * @param {string} folder - Folder name (e.g., 'profile_images', 'slides')
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Upload result with url and path
 */
export const uploadImageWithPreview = async (file, folder = 'profile_images', onProgress = null) => {
    try {
        console.log(`📤 Uploading image to folder: ${folder}`);
        
        // Validation
        if (file.size > 5 * 1024 * 1024) {
            throw new Error('Image size should be less than 5MB');
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed');
        }

        // Upload to Cloudinary with progress tracking
        const result = await cloudinaryService.uploadFile(file, folder, onProgress);
        console.log(`✅ Image uploaded successfully to Cloudinary folder: ${folder}:`, result.url);
        
        return {
            url: result.url,
            publicId: result.publicId,
            folder: folder
        };
    } catch (error) {
        console.error(`❌ Error uploading image to ${folder}:`, error);
        throw error;
    }
};

/**
 * Create image preview component
 * @param {File} file - Image file
 * @param {string} existingUrl - Existing image URL
 * @param {Function} onRemove - Remove callback
 * @returns {JSX.Element} - Preview component
 */
export const ImagePreview = ({ file, existingUrl, onRemove, className = "" }) => {
    const [previewUrl, setPreviewUrl] = React.useState(existingUrl || null);
    const [isHovered, setIsHovered] = React.useState(false);

    React.useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    if (!previewUrl) {
        return (
            <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
                <div className="text-gray-400">
                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="text-sm">No image selected</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`relative group ${className}`}>
            <div className="relative overflow-hidden rounded-lg border-2 border-gray-200 hover:border-[#ffd200] transition-colors">
                <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="w-full h-48 object-cover"
                />
                
                {/* Overlay with controls */}
                <div 
                    className={`absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isHovered ? 'opacity-100' : ''}`}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                // Open in new tab
                                window.open(previewUrl, '_blank');
                            }}
                            className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                            title="View full size"
                        >
                            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                        </button>
                        
                        {onRemove && (
                            <button
                                type="button"
                                onClick={onRemove}
                                className="p-2 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors"
                                title="Remove image"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Image info */}
            <div className="mt-2 text-xs text-gray-500">
                {file ? (
                    <>
                        <span className="font-medium">{file.name}</span>
                        <span className="ml-2">({(file.size / 1024).toFixed(1)} KB)</span>
                    </>
                ) : (
                    <span className="font-medium">Current image</span>
                )}
            </div>
        </div>
    );
};

/**
 * Image upload button component
 * @param {Function} onFileSelect - File selection callback
 * @param {string} label - Button label
 * @param {string} accept - Accepted file types
 * @returns {JSX.Element} - Upload button component
 */
export const ImageUploadButton = ({ onFileSelect, label = "Choose Image", accept = "image/*", className = "" }) => {
    return (
        <label className={`block ${className}`}>
            <input
                type="file"
                accept={accept}
                onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                        onFileSelect(file);
                    }
                }}
                className="hidden"
            />
            <div className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#ffd200] hover:bg-[#ffd200]/5 transition-all">
                <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <span className="text-sm font-medium text-gray-600">{label}</span>
            </div>
        </label>
    );
};

/**
 * Drag and drop image upload area
 * @param {Function} onFileDrop - File drop callback
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} - Drag drop component
 */
export const DragDropImageUpload = ({ onFileDrop, className = "" }) => {
    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));
        
        if (imageFiles.length > 0) {
            onFileDrop(imageFiles[0]);
        }
    };

    return (
        <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                isDragging 
                    ? 'border-[#ffd200] bg-[#ffd200]/10' 
                    : 'border-gray-300 hover:border-gray-400'
            } ${className}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="text-lg font-medium text-gray-600 mb-2">
                {isDragging ? 'Drop image here' : 'Drag & drop image here'}
            </p>
            <p className="text-sm text-gray-400">
                or click to browse
            </p>
        </div>
    );
};
