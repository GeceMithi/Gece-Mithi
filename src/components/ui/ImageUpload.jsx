import React, { useState } from 'react';
import { uploadImageWithPreview, ImagePreview, ImageUploadButton, DragDropImageUpload } from '../../utils/imageUpload';

const ImageUploadComponent = ({ 
    onImageUpload, 
    existingImage = null, 
    folder = 'profile_images',
    label = 'Choose Image',
    accept = 'image/*',
    className = '',
    showDragDrop = true 
}) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState(null);

    const handleFileSelect = async (file) => {
        try {
            setSelectedFile(file);
            setError(null);
            setIsUploading(true);

            const result = await uploadImageWithPreview(file, folder);
            onImageUpload(result.url, result.publicId, result.folder);
            
            setSelectedFile(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemove = () => {
        setSelectedFile(null);
        setError(null);
        onImageUpload(null, null, folder);
    };

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Current Image Preview */}
            {(existingImage || selectedFile) && (
                <ImagePreview
                    file={selectedFile}
                    existingUrl={existingImage}
                    onRemove={handleRemove}
                    className="mb-4"
                />
            )}

            {/* Upload Area */}
            {!existingImage && !selectedFile && (
                showDragDrop ? (
                    <DragDropImageUpload
                        onFileDrop={handleFileSelect}
                        className="mb-4"
                    />
                ) : (
                    <ImageUploadButton
                        onFileSelect={handleFileSelect}
                        label={label}
                        accept={accept}
                        className="mb-4"
                    />
                )
            )}

            {/* Upload Status */}
            {isUploading && (
                <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                    <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                    <span className="text-blue-600 font-medium">Uploading image...</span>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
            )}

            {/* Selected File Info */}
            {selectedFile && !isUploading && (
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Selected:</span> {selectedFile.name}
                        <span className="ml-2 text-gray-400">({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default ImageUploadComponent;
