# Past Papers System - Implementation Guide

## Overview
The Past Papers system allows admins to add past papers through the Dynamic Content Manager, which are then stored in Firebase and displayed in a themed section on the website.

## Components Created

### 1. **PastPaperBox.jsx**
- Main container component that fetches past papers from Firebase
- Groups papers by Part and Semester
- Displays them in an organized grid layout
- Located in: `src/components/features/PastPaperBox.jsx`

**Features:**
- Fetches data from Firebase collection `past_papers`
- Groups papers by Part (Year 1, Year 2, etc.) and Semester
- Responsive grid layout
- Loading state handling
- Yellow border theme matching your design

### 2. **PastPaperCard.jsx**
- Individual card component for each past paper
- Displays subject, year, and download button
- Located in: `src/components/features/PastPaperCard.jsx`

**Features:**
- Shows subject and year information
- Document emoji icon
- Hover effects
- Blue gradient background
- Compact card design

### 3. **PastPaperDownloadButton.jsx**
- Download button with loading state
- Handles file downloads from URLs
- Located in: `src/components/features/PastPaperDownloadButton.jsx`

**Features:**
- Download functionality with error handling
- Loading animation
- Disabled state when no file URL
- Green button styling
- Automatic filename generation

### 4. **PastPapersSection.jsx**
- Wrapper component for easy integration into pages
- Located in: `src/components/pages/PastPapersSection.jsx`

## Firebase Collection Structure

The past papers are stored in Firebase under the `past_papers` collection with the following structure:

```json
{
  "part": "Year 1",
  "semester": "Semester 1",
  "year": "2023",
  "subject": "Mathematics",
  "fileUrl": "https://example.com/paper.pdf",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## How to Use

### Step 1: Add Past Paper through Admin Panel
1. Go to Resource Management → Past Papers tab
2. Fill in the form:
   - **Part**: Year 1, Year 2, Year 3, etc.
   - **Semester**: Semester 1, Semester 2, etc.
   - **Year**: 2023, 2024, etc.
   - **Subject**: Subject name
   - **File URL**: PDF file URL (can be from Cloudinary)
3. Click "Add Past Paper"
4. Data is automatically saved to Firebase

### Step 2: Display in Your Page
Add the component to any page where you want to display past papers:

```jsx
import PastPapersSection from '../components/pages/PastPapersSection';

// In your component:
<PastPapersSection />
```

### Step 3: Users Can Download
- The PastPaperBox displays papers organized by Part and Semester
- Users click the "Download" button to get the PDF
- Files are downloaded with a descriptive name

## Data Flow

```
Admin Panel (DynamicContentManager)
    ↓
Form Data (part, semester, year, subject, fileUrl)
    ↓
Firebase (past_papers collection)
    ↓
PastPaperBox (fetches and groups data)
    ↓
Display Section (organized by Part/Semester)
    ↓
Users Download PDFs
```

## Styling

All components use:
- **Primary Green**: `#004d00` (text and accents)
- **Yellow**: `#ffd200` (borders and highlights)
- **Blue Gradient**: For cards (from-blue-50 to-blue-100)
- **Green Gradient**: For download button
- Tailwind CSS for responsive design

## Features

✅ Firebase integration
✅ Part and Semester grouping
✅ Download functionality
✅ Loading states
✅ Error handling
✅ Responsive design
✅ Themed styling
✅ No file size limits (files stored externally)

## File Upload Recommendations

For best results, upload PDF files using:
1. **Cloudinary** (recommended) - via DynamicContentManager's upload feature
2. **Google Drive** - get shareable link and copy URL
3. **Other cloud storage** - ensure the URL is publicly accessible

## Notes

- Files are stored externally (not in Firebase to avoid size limits)
- The fileUrl must be a direct download link
- PDFs are downloaded with automatic naming
- The system handles multiple papers per semester
- Changes in admin panel are reflected immediately on the section
