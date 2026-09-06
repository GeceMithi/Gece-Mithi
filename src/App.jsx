import React, { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';

// === COMPONENTS IMPORTS ===
import Navbar from './components/layout/navbar';
import StudentPortal from './components/auth/studentportal';
import Home from './components/pages/home';
import Outline from './components/pages/outlines';
import Resources from './components/pages/resources';
import Notes from './components/pages/notes';
import PastPaper from './components/pages/pastpapers';
import SuccessStories from './components/pages/successstories';
import AboutUs from './components/pages/aboutus';
import ContactUs from './components/pages/contactus';
import Trainings from './components/pages/trainings';
import Batches from './components/pages/batches';
import MediaLibrary from './components/features/MediaLibrary';
import Footer from './components/layout/footer';
import Developer from './components/pages/developer';
import Tools from './components/pages/tools';

// --- ADMISSION PAGE IMPORT (Apne component file ke path ke hisab se adjust karein) ---
import Admission from './components/pages/admission';

// === CONTEXT IMPORTS ===
import { ToastProvider } from './contexts/ToastContext';

// === HOOKS ===
import useSecurity from './hook/useSecurity';
import { db } from './firebase/firebase';

const AdmissionAvailability = () => {
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            doc(db, 'settings', 'admission_form'),
            (snapshot) => {
                setIsActive(snapshot.exists() && snapshot.data()?.isActive === true);
                setLoading(false);
            },
            (error) => {
                console.error('Admission availability check failed:', error);
                setIsActive(false);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="min-h-[600px] flex items-center justify-center text-gray-500">Loading admission status...</div>;
    }

    if (!isActive) {
        return (
            <div className="min-h-[600px] flex items-center justify-center px-4">
                <div className="w-full max-w-lg text-center rounded-2xl border-2 border-[#ffd200] bg-white p-10 shadow-xl">
                    <h1 className="text-3xl font-extrabold text-[#004d00]">Admissions Coming Soon</h1>
                    <p className="mt-3 text-gray-600">The admission form is currently unavailable. Please check back later.</p>
                </div>
            </div>
        );
    }

    return <Admission />;
};

export default function App() {
    useSecurity();
    const [contentType, setContentType] = useState('home');

    // Handle URL parameter for developer page
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const contentParam = urlParams.get('content');
        if (contentParam === 'developer' || contentParam === 'admission' || urlParams.get('printApplication') === '1') {
            setContentType(contentParam === 'developer' ? 'developer' : 'admission');
        }
    }, []);

    // Content Switcher Logic
    const renderContent = () => {
        switch (contentType) {
            case 'home': return <Home setContentType={setContentType} />; 
            case 'outline': return <Outline />;
            case 'resources': return <Resources />;
            case 'tools': return <Tools />;
            case 'notes': return <Notes />;
            case 'pastPaper': return <PastPaper />;
            case 'successStories': return <SuccessStories />;
            case 'about': return <AboutUs />;
            case 'contact': return <ContactUs />;
            case 'trainings': return <Trainings />;
            case 'studentportal': return <StudentPortal />;
            case 'batches': return <Batches />;
            case 'mediaLibrary': return <MediaLibrary />;
            case 'developer': return <Developer />;
            
            // --- ADMISSION CASE ADDED ---
            case 'admission': return new URLSearchParams(window.location.search).get('printApplication') === '1'
                ? <Admission />
                : <AdmissionAvailability />;

            default: return <Home setContentType={setContentType} />;
        }
    };
    
    return (
        <ToastProvider>
            <>
                <style>
                    {`
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
                        html, body {
                            width: 100%;
                            overflow-x: hidden;
                            margin: 0; 
                            padding: 0;
                            font-family: 'Inter', sans-serif;
                            background-color: #f7f7f7; 
                        }
                        ::-webkit-scrollbar { width: 8px; }
                        ::-webkit-scrollbar-track { background: #f1f1f1; }
                        ::-webkit-scrollbar-thumb { background: #004d00; border-radius: 4px; }
                        
                        @keyframes fadeInUp {
                            from { opacity: 0; transform: translateY(25px); }
                            to { opacity: 1; transform: translateY(0); }
                        }
                        .content-entry-animation {
                            opacity: 0;
                            animation: fadeInUp 0.6s ease-out forwards;
                            transition: all 0.3s ease-in-out;
                        }
                    `}
                </style>

                <div className="flex flex-col min-h-screen w-full"> 
                    
                    {/* 1. Navbar */}
                    <Navbar contentType={contentType} setContentType={setContentType} />
                    
                    {/* 2. Main Content Box */}
                    <main className="grow w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-6 md:mt-10">
                        <div 
                            className="bg-white rounded-2xl shadow-xl w-full overflow-hidden min-h-[600px] p-4 md:p-8 border-4 border-[#ffd200]"
                            style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
                        >
                            {renderContent()}
                        </div>
                    </main>

                    {/* 3. Footer */}
                    <Footer setContentType={setContentType} />

                </div>
            </>
        </ToastProvider>
    );
}