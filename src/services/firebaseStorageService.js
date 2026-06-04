import { storage } from "../firebase/firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";

class FirebaseStorageService {
    // Upload file to Firebase Storage with progress tracking
    async uploadFile(file, path = "media", onProgress = null) {
        try {
            // Create a unique filename with timestamp
            const timestamp = Date.now();
            const fileName = `${timestamp}_${file.name}`;
            const fullPath = `${path}/${fileName}`;
            console.log("[firebaseStorageService] Starting upload:", fullPath, file);
            
            // Create storage reference
            const storageRef = ref(storage, fullPath);
            
            // Upload with resumable upload for progress tracking
            const uploadTask = uploadBytesResumable(storageRef, file);
            
            return new Promise((resolve, reject) => {
                uploadTask.on(
                    "state_changed",
                        (snapshot) => {
                            // Progress callback
                            const progress = (snapshot.totalBytes > 0)
                                ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                                : 0;
                            const formattedProgress = Number(progress.toFixed(1));
                            console.log("[firebaseStorageService] Upload progress:", fullPath, formattedProgress + "%");
                            if (onProgress) {
                                onProgress(formattedProgress);
                            }
                        },
                    (error) => {
                        // Error callback
                            console.error("[firebaseStorageService] Upload error:", fullPath, error);
                        reject(error);
                    },
                    async () => {
                        // Success callback - get download URL
                        try {
                                console.log("[firebaseStorageService] Upload finished, getting download URL:", fullPath);
                                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                console.log("[firebaseStorageService] Download URL:", downloadURL);
                                resolve({
                                    url: downloadURL,
                                    path: fullPath,
                                    fileName: fileName,
                                    size: file.size,
                                    type: file.type,
                                });
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    }

    // Delete file from Firebase Storage
    async deleteFile(filePath) {
        try {
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
            return true;
        } catch (error) {
            console.error("Delete failed:", error);
            throw error;
        }
    }

    // Get download URL for a file path
    async getFileUrl(filePath) {
        try {
            const fileRef = ref(storage, filePath);
            const url = await getDownloadURL(fileRef);
            return url;
        } catch (error) {
            console.error("Get URL failed:", error);
            throw error;
        }
    }

    // Format file size for display
    formatFileSize(bytes) {
        if (!bytes) return "Unknown";
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
    }
}

// Create singleton instance
const firebaseStorageService = new FirebaseStorageService();

export default firebaseStorageService;
