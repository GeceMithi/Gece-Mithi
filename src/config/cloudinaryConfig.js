// Cloudinary Configuration
// Replace these values with your actual Cloudinary credentials
export const CLOUDINARY_CONFIG = {
    cloudName: "dt4s1jxfu", // Your Cloudinary cloud name
    uploadPreset: "student_uploads", // Your unsigned upload preset
};

// Backup Configuration
export const backupConfig = {
    autoBackup: true,
    backupInterval: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxBackupFiles: 10,
    backupLocation: "cloudinary_backups"
};

// Retention Policy
export const retentionPolicy = {
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year in milliseconds
    maxDocuments: 1000,
    cleanupInterval: 7 * 24 * 60 * 60 * 1000 // 1 week in milliseconds
};

// Monitoring Configuration
export const monitoringConfig = {
    enableLogging: true,
    logLevel: "info",
    maxLogSize: 1000,
    metricsInterval: 60 * 1000 // 1 minute in milliseconds
};

// Validation Rules
export const validationRules = {
    faculty: {
        required: ["name", "role"],
        maxLength: { name: 100, role: 50 }
    },
    notices: {
        required: ["content"],
        maxLength: { content: 1000 }
    },
    media_files: {
        required: ["title", "fileUrl"],
        maxLength: { title: 200, description: 500 }
    }
};

// Instructions:
// 1. Sign up for free at https://cloudinary.com
// 2. Get your Cloud Name from the dashboard
// 3. Go to Settings > Upload > Upload presets
// 4. Create an "unsigned" preset (no authentication required)
// 5. Replace the placeholder values above with your actual credentials