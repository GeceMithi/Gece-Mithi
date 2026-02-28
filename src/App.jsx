import React, { useState } from 'react';

// === COMPONENTS IMPORTS ===
import Navbar from './components/navbar';
import StudentPortal from './components/studentportal'; 
import AdminLogin from './components/adminlogin'; 
import Home from './components/home';
import Outline from './components/outlines';
import Portfolio from './components/portfolios';
import Notes from './components/notes';
import PastPaper from './components/pastpapers';
import Tools from './components/tools';
import AboutUs from './components/aboutus';
import ContactUs from './components/contactus';
import Trainings from './components/trainings';
import Batches from './components/batches';
import Footer from './components/footer';

// === HOOKS ===
import useSecurity from './hook/useSecurity';

export default function App() {
    useSecurity();
    const [contentType, setContentType] = useState('home');

    // Content Switcher Logic
    const renderContent = () => {
        switch (contentType) {
            case 'home': return <Home setContentType={setContentType} />; 
            case 'outline': return <Outline />;
            case 'portfolio': return <Portfolio />;
            case 'tools': return <Tools />;
            case 'notes': return <Notes />;
            case 'pastPaper': return <PastPaper />;
            case 'about': return <AboutUs />;
            case 'contact': return <ContactUs />;
            case 'trainings': return <Trainings />;
            case 'studentportal': return <StudentPortal />;
            case 'admin-login': return <AdminLogin />;
            case 'batches': return <Batches />;
            default: return <Home setContentType={setContentType} />;
        }
    };
    
    return (
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
                
                {/* Hero Section yahan se hata diya gaya hai */}
                
                {/* 2. Main Content Box */}
                <main className="grow w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-6 md:mt-10">
                    <div 
                        className="bg-white rounded-2xl shadow-xl w-full overflow-hidden min-h-[600px] p-4 md:p-8"
                        style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}
                    >
                        {renderContent()}
                    </div>
                </main>

                {/* 3. Footer */}
                <Footer setContentType={setContentType} />

            </div>
        </>
    );
}