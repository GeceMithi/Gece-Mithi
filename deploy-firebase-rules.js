// === FIREBASE RULES DEPLOYMENT SCRIPT ===
// Copy this script and run it in Firebase Console to update security rules

console.log("🔒 Firebase Security Rules Deployment Script");
console.log("📋 Instructions:");
console.log("1. Go to Firebase Console: https://console.firebase.google.com");
console.log("2. Select your project");
console.log("3. Go to Firestore Database");
console.log("4. Click on 'Rules' tab");
console.log("5. Replace existing rules with the rules below");
console.log("6. Click 'Publish'");

const updatedRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Batches collection - public read, admin write
    match /batches/{docId} {
      allow read: if true; // Public read access for display
      allow write: if request.auth != null && request.auth.token.email == 'admin@gece.com';
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
  }
}
`;

console.log("📝 Copy and paste these rules in Firebase Console:");
console.log(updatedRules);
console.log("✅ After deploying, the permission errors will be resolved!");
