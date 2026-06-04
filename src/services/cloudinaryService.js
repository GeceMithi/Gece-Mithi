// Cloudinary Service for Image Uploads
// Handles all image uploads to Cloudinary

import { CLOUDINARY_CONFIG } from '../config/cloudinaryConfig';

const CLOUDINARY_CLOUD_NAME = CLOUDINARY_CONFIG?.cloudName?.trim() || 'dxjzqjzga';
const CLOUDINARY_UPLOAD_PRESET = CLOUDINARY_CONFIG?.uploadPreset?.trim() || 'ml_default';

if (!CLOUDINARY_CONFIG?.cloudName || !CLOUDINARY_CONFIG?.uploadPreset) {
    console.warn('[cloudinaryService] CLOUDINARY_CONFIG is missing cloudName or uploadPreset. Using fallback values.');
}

/**
 * Upload file to Cloudinary
 * @param {File} file - File to upload
 * @param {string} folder - Folder name for organization
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} - Upload result with url and publicId
 */
export const uploadFile = async (file, folder = 'general', onProgress = null) => {
    console.log('[cloudinaryService.uploadFile] Starting upload', { folder, fileSize: file.size, fileType: file.type });
    
    return new Promise((resolve, reject) => {
        // Create form data
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', folder);

        console.log('[cloudinaryService.uploadFile] FormData created', { uploadPreset: CLOUDINARY_UPLOAD_PRESET, cloudName: CLOUDINARY_CLOUD_NAME });

        // Create XHR for progress tracking
        const xhr = new XMLHttpRequest();

        // Progress tracking
        if (onProgress) {
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    onProgress(percentComplete);
                }
            });
        }

        // Load complete
        xhr.addEventListener('load', () => {
            console.log('[cloudinaryService.uploadFile] XHR load event', { status: xhr.status });
            
            if (xhr.status === 200) {
                try {
                    const response = JSON.parse(xhr.responseText);
                    console.log('[cloudinaryService.uploadFile] Response parsed', { publicId: response.public_id, secureUrl: response.secure_url });
                    
                    if (response.secure_url) {
                        resolve({
                            url: response.secure_url,
                            publicId: response.public_id,
                            folder: folder
                        });
                    } else {
                        console.error('[cloudinaryService.uploadFile] No secure_url in response');
                        reject(new Error('Upload failed: No URL returned'));
                    }
                } catch (error) {
                    console.error('[cloudinaryService.uploadFile] Response parse error', error);
                    reject(new Error('Failed to parse response'));
                }
            } else {
                console.error('[cloudinaryService.uploadFile] HTTP error', { status: xhr.status, responseText: xhr.responseText });
                reject(new Error(`Upload failed with status: ${xhr.status}`));
            }
        });

        // Error handling
        xhr.addEventListener('error', () => {
            console.error('[cloudinaryService.uploadFile] XHR network error');
            reject(new Error('Network error during upload'));
        });

        // Setup and send
        const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`;
        console.log('[cloudinaryService.uploadFile] Opening XHR to', uploadUrl);
        
        xhr.open('POST', uploadUrl);
        xhr.send(formData);
    });
};

/**
 * Get optimized URL for Cloudinary image
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Transformation options
 * @returns {string} - Optimized URL
 */
export const getOptimizedUrl = (publicId, options = {}) => {
    const transformations = [];
    
    if (options.width) transformations.push(`w_${options.width}`);
    if (options.height) transformations.push(`h_${options.height}`);
    if (options.crop) transformations.push(`c_${options.crop}`);
    if (options.quality) transformations.push(`q_${options.quality}`);
    if (options.format) transformations.push(`f_${options.format}`);
    
    const transformationString = transformations.length > 0 ? transformations.join(',') : '';
    
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformationString}/${publicId}`;
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteImage = async (publicId) => {
    // Note: This requires server-side implementation for security
    // Client-side deletion is not recommended for Cloudinary
    console.warn('Cloudinary deletion requires server-side implementation');
    return { success: false, message: 'Server-side deletion required' };
};

export default {
    uploadFile,
    getOptimizedUrl,
    deleteImage
};
