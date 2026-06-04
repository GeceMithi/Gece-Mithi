// Test script to add sample data to Firebase
import { db } from './src/firebase/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

const sampleResources = [
    {
        title: 'Mathematics Study Guide',
        category: 'study-materials',
        subject: 'Mathematics',
        class: 'Class 10',
        description: 'Comprehensive study guide for Class 10 Mathematics',
        fileUrl: 'https://example.com/math-guide.pdf',
        fileType: 'pdf',
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
    },
    {
        title: 'Physics Past Paper 2023',
        category: 'past-papers',
        subject: 'Physics',
        class: 'Class 12',
        description: 'Annual examination paper 2023',
        fileUrl: 'https://example.com/physics-paper-2023.pdf',
        fileType: 'pdf',
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
    },
    {
        title: 'Chemistry Notes Chapter 1',
        category: 'notes',
        subject: 'Chemistry',
        class: 'Class 11',
        description: 'Detailed notes for Chapter 1 of Chemistry',
        fileUrl: 'https://example.com/chem-notes.pdf',
        fileType: 'pdf',
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString()
    }
];

const addSampleData = async () => {
    try {
        console.log('Adding sample data to Firebase...');
        
        for (const resource of sampleResources) {
            const docRef = await addDoc(collection(db, 'resources'), resource);
            console.log('Document added with ID: ', docRef.id);
        }
        
        console.log('Sample data added successfully!');
    } catch (error) {
        console.error('Error adding sample data: ', error);
    }
};

// Uncomment to run
// addSampleData();
