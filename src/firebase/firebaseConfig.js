// Firebase Security Configuration
// This file contains security rules and backup settings for dynamic data

// === FIRESTORE SECURITY RULES ===
export const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Batches collection - public read, admin write
    match /batches/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Students collection - public read, public write (temporary for testing)
    match /students/{docId} {
      allow read: if true; // Public read access for display
      allow write: if true; // Temporary: Allow public write for testing
    }
    
    // Faculty collection - public read, admin write
    match /faculty/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Visiting faculty collection - public read, admin write
    match /visiting_faculty/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Non-teaching staff collection - public read, admin write
    match /non_teaching_staff/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Volunteer teachers collection - public read, admin write
    match /volunteer_teachers/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }

    // In-service trainings collection - public read, admin write
    match /inservice_trainings/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Outlines collection - public read, admin write
    match /outlines/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Notes collection - public read, admin write
    match /notes/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Past papers collection - public read, admin write
    match /past_papers/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Tools collection - public read, admin write
    match /tools/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Notices collection - public read, admin write
    match /notices/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    
    // Site config collection - public read, admin write
    match /site_config/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
    match /settings/{docId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
    }
  }
}
`;

// === BACKUP CONFIGURATION ===
export const backupConfig = {
  // Auto backup settings
  autoBackup: true,
  backupInterval: 'daily', // daily, weekly, monthly
  retentionDays: 365, // Keep backups for 1 year
  
  // Collections to backup
  collections: [
    'faculty',
    'visiting_faculty', 
    'non_teaching_staff',
    'volunteer_teachers',
    'inservice_trainings',
    'outlines',
    'notes',
    'past_papers',
    'tools',
    'settings'
  ],
  
  // Backup format
  backupFormat: 'json',
  
  // Storage location (Firebase Storage)
  backupBucket: 'gecemithi-a9f02.appspot.com',
  backupPath: 'backups/'
};

// === DATA VALIDATION RULES ===
export const validationRules = {
  faculty: {
    required: ['name', 'role'],
    optional: ['duration', 'isActive'],
    constraints: {
      name: { maxLength: 100, minLength: 2 },
      role: { maxLength: 100, minLength: 2 },
      duration: { maxLength: 50, minLength: 2 }
    }
  },
  visiting_faculty: {
    required: ['name', 'role'],
    optional: ['duration'],
    constraints: {
      name: { maxLength: 100, minLength: 2 },
      role: { maxLength: 100, minLength: 2 },
      duration: { maxLength: 50, minLength: 2 }
    }
  },
  non_teaching_staff: {
    required: ['name', 'role'],
    optional: ['duration', 'isActive'],
    constraints: {
      name: { maxLength: 100, minLength: 2 },
      role: { maxLength: 100, minLength: 2 },
      duration: { maxLength: 50, minLength: 2 }
    }
  },
  volunteer_teachers: {
    required: ['batch', 'name'],
    optional: [],
    constraints: {
      batch: { maxLength: 20, minLength: 2 },
      name: { maxLength: 100, minLength: 2 }
    }
  },
  inservice_trainings: {
    required: ['prefix', 'name', 'profession'],
    optional: ['title', 'date', 'organizer', 'venue', 'description', 'image'],
    constraints: {
      prefix: { maxLength: 10, minLength: 2 },
      name: { maxLength: 100, minLength: 2 },
      profession: { maxLength: 100, minLength: 2 },
      title: { maxLength: 200, minLength: 2 },
      date: { maxLength: 100 },
      organizer: { maxLength: 150 },
      venue: { maxLength: 150 },
      description: { maxLength: 1000 },
      image: { maxLength: 500 }
    }
  },
  outlines: {
    required: ['title', 'description'],
    optional: ['fileUrl'],
    constraints: {
      title: { maxLength: 200, minLength: 2 },
      description: { maxLength: 1000, minLength: 10 },
      fileUrl: { maxLength: 500 }
    }
  },
  notes: {
    required: ['title', 'description'],
    optional: ['fileUrl'],
    constraints: {
      title: { maxLength: 200, minLength: 2 },
      description: { maxLength: 1000, minLength: 10 },
      fileUrl: { maxLength: 500 }
    }
  },
  past_papers: {
    required: ['title', 'year', 'subject'],
    optional: ['fileUrl'],
    constraints: {
      title: { maxLength: 200, minLength: 2 },
      year: { maxLength: 10, minLength: 4 },
      subject: { maxLength: 100, minLength: 2 },
      fileUrl: { maxLength: 500 }
    }
  },
  tools: {
    required: ['name', 'description', 'url', 'category'],
    optional: [],
    constraints: {
      name: { maxLength: 100, minLength: 2 },
      description: { maxLength: 500, minLength: 10 },
      url: { maxLength: 500 },
      category: { maxLength: 50, minLength: 2 }
    }
  },
  settings: {
    required: [],
    optional: ['imageUrl', 'imageUrls'],
    constraints: {
      imageUrl: { maxLength: 500 },
      imageUrls: { maxLength: 2000 }
    }
  }
};

// === DATA RETENTION POLICY ===
export const retentionPolicy = {
  // Auto-delete old data (optional - set to false to keep all data)
  autoDelete: false,
  
  // If autoDelete is true, specify retention periods
  retentionPeriods: {
    // Keep faculty data forever (important historical data)
    faculty: null,
    visiting_faculty: null,
    non_teaching_staff: null,
    volunteer_teachers: null,
    
    // Keep educational resources for 5 years
    outlines: 5 * 365 * 24 * 60 * 60 * 1000, // 5 years in milliseconds
    notes: 5 * 365 * 24 * 60 * 60 * 1000,
    past_papers: 5 * 365 * 24 * 60 * 60 * 1000,
    tools: null // Keep tools forever
  },
  
  // Fields to check for age (usually createdAt timestamp)
  ageField: 'createdAt'
};

// === MONITORING AND ALERTS ===
export const monitoringConfig = {
  // Enable monitoring
  enabled: true,
  
  // Alert thresholds
  alerts: {
    // Alert if document count exceeds these limits
    maxDocuments: {
      faculty: 100,
      visiting_faculty: 50,
      non_teaching_staff: 50,
      volunteer_teachers: 200,
      inservice_trainings: 100,
      outlines: 1000,
      notes: 1000,
      past_papers: 500,
      tools: 100
    },
    
    // Alert if document size exceeds these limits
    maxDocumentSize: 1024 * 1024, // 1MB per document
    
    // Alert for failed operations
    trackFailures: true,
    failureThreshold: 5 // Alert after 5 consecutive failures
  },
  
  // Admin email for alerts
  adminEmail: 'admin@gece.com'
};
