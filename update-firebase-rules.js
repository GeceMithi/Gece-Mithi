// Firebase Rules Update Script
// Run this script in browser console when logged into Firebase Console

const firebaseRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Batches collection - only authenticated users can read/write
    match /batches/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
    
    // Faculty collection - only authenticated users can read/write
    match /faculty/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
    
    // Visiting faculty collection
    match /visiting_faculty/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
    
    // Non-teaching staff collection
    match /non_teaching_staff/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
    
    // Volunteer teachers collection
    match /volunteer_teachers/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
    
    // Outlines collection
    match /outlines/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
    
    // Notes collection
    match /notes/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
    
    // Past papers collection
    match /past_papers/{docId} {
      allow read, write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
      allow read: if true; // Public read access for display
    }
  }
}
`;

console.log("Firebase Rules Updated!");
console.log("Copy these rules and paste in Firebase Console → Firestore → Rules:");
console.log(firebaseRules);
