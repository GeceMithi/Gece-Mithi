// Example Usage of Past Papers Section

// In your main App.jsx or any page component:

import React from 'react';
import PastPapersSection from './components/pages/PastPapersSection';
import Navbar from './components/layout/navbar';
import Footer from './components/layout/footer';

function App() {
    return (
        <div>
            <Navbar />
            
            {/* Other page sections */}
            
            {/* Past Papers Section */}
            <PastPapersSection />
            
            {/* Other sections */}
            
            <Footer />
        </div>
    );
}

export default App;

// ===================================
// Alternative: Direct Component Usage
// ===================================

import PastPaperBox from './components/features/PastPaperBox';

function ResourcesPage() {
    return (
        <div>
            <h1>Our Resources</h1>
            <PastPaperBox />
        </div>
    );
}

// ===================================
// Data Structure for Firebase
// ===================================

// When adding data through Admin Panel:
// Fill the form with:
// Part: "Year 1" (or "Year 2", "Year 3", etc.)
// Semester: "Semester 1" (or "Semester 2")
// Year: "2024"
// Subject: "Mathematics"
// File URL: "https://cdn.example.com/past-papers/math-2024.pdf"

// This creates a document in Firebase like:
// {
//   part: "Year 1",
//   semester: "Semester 1", 
//   year: "2024",
//   subject: "Mathematics",
//   fileUrl: "https://cdn.example.com/past-papers/math-2024.pdf",
//   createdAt: "2024-01-15T10:30:00.000Z",
//   updatedAt: "2024-01-15T10:30:00.000Z"
// }

// ===================================
// How the Display Works
// ===================================

// The PastPaperBox component:
// 1. Fetches all documents from 'past_papers' collection
// 2. Groups them by Part (Year 1, Year 2, etc.)
// 3. Within each Part, groups by Semester (1, 2, etc.)
// 4. Displays in a beautiful grid layout:
//
// ┌─────────────────────────────────────────┐
// │        FIRST YEAR (Number: 01)          │
// ├─────────────────────────────────────────┤
// │ Semester 1        │ Semester 2          │
// │ ┌──────────────┐  │ ┌──────────────┐   │
// │ │ Mathematics  │  │ │ English      │   │
// │ │ Year: 2024   │  │ │ Year: 2024   │   │
// │ │ [Download]   │  │ │ [Download]   │   │
// │ └──────────────┘  │ └──────────────┘   │
// └─────────────────────────────────────────┘

// ===================================
// For Cloudinary Integration
// ===================================

// In DynamicContentManager, you can upload PDFs to Cloudinary first:
// 1. Use the CloudinaryMediaManager component
// 2. Upload PDF file
// 3. Copy the Cloudinary URL
// 4. Paste into File URL field in Past Papers form
// 5. Submit form

// This ensures PDFs are hosted reliably and users can download them quickly
