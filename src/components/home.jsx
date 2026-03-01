import React, { useState, useEffect } from 'react';
import { Icon } from './uicomponents'; 
import { db } from '../firebase'; 
import { collection, onSnapshot, query, orderBy, doc, getDoc } from 'firebase/firestore';
import Group from '../assets/slide.jpg'; 

// Icons (Local)
const Icons = {
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    File: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
};

const Home = ({ setContentType }) => {
    
    // --- STATE ---
    const [notices, setNotices] = useState([]); 
    const [siteConfig, setSiteConfig] = useState({ 
        heroImage: ""
    });

    // --- FETCH DATA ---
    useEffect(() => {
        const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
            const noticesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotices(noticesData);
        });

        const fetchConfig = async () => {
            try {
                const docSnap = await getDoc(doc(db, "site_config", "main"));
                if (docSnap.exists()) setSiteConfig(docSnap.data());
            } catch (e) { 
                // Silently handle Firebase permissions error
                if (e.code === 'permission-denied') {
                    console.log('Site config not accessible - using defaults');
                } else {
                    console.log('Firebase config error:', e.message);
                }
            }
        };
        fetchConfig();

        return () => unsubscribeSnapshot();
    }, []);

    const convertDriveLink = (url) => {
        if (!url) return null;
        if (url.includes('drive.google.com') && url.includes('/file/d/')) {
            const id = url.split('/file/d/')[1].split('/')[0];
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
        return url; 
    };

    // --- ANIMATION STYLES (Professional Seamless Scroll) ---
    const styles = `
        @keyframes scrollUp {
            0% { transform: translateY(0); }
            100% { transform: translateY(-50%); }
        }
        .news-ticker {
            animation: scrollUp 50s linear infinite;
        }
        .news-ticker:hover {
            animation-play-state: paused;
        }
        /* Gradient Mask for Smooth Fade In/Out */
        .notice-mask {
            mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
    `;

    return (
        <div className="min-h-screen bg-[#f8f9fa] pb-12 w-full font-sans">
            <style>{styles}</style>
            
            <div className="container mx-auto px-4 md:px-6 pt-6">
                
                {/* === LAYOUT: VERTICAL STACK === */}
                <div className="flex flex-col gap-8 mb-10">
                    
                    {/* 1. HERO SECTION */}
                    <div>
                        <div className="w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden shadow-xl border-4 border-white group relative">
                            <img 
                                src={convertDriveLink(siteConfig.heroImage) || Group} 
                                alt="College Campus" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        </div>

                        <div className="text-center mt-5 px-2">
                            <span className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block shadow-sm">
                                Official Website
                            </span>
                            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2 text-[#004d00]">
                                Govt. Elementary College of Education
                            </h1>
                            <p className="text-gray-500 text-sm font-bold tracking-wide uppercase">
                                (M/W) Mithi, Tharparkar
                            </p>
                        </div>
                    </div>

                    {/* 2. NOTICE BOARD (Professional Animated) */}
                    <div className="w-full bg-white rounded-2xl shadow-xl border-4 border-white overflow-hidden flex flex-col">
                        
                        {/* Header */}
                        <div className="bg-[#004d00] p-4 flex items-center justify-between shrink-0 z-20 relative shadow-md">
                            <h3 className="text-lg font-bold text-white flex items-center tracking-wide">
                                <Icons.Bell /> <span className="ml-3">Notice Board</span>
                            </h3>
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 bg-red-500 rounded-full animate-ping"></span>
                                <span className="text-[10px] text-white font-bold bg-white/20 px-2 py-1 rounded">UPDATES</span>
                            </div>
                        </div>

                        {/* Animated Content Container with Fixed Height & Mask */}
                        <div className="h-[350px] overflow-hidden relative bg-gray-50 notice-mask">
                            {notices.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                    <span className="text-4xl mb-2">📭</span>
                                    <p className="text-sm">No new notices posted.</p>
                                </div>
                            ) : (
                                // Wrapper for smooth scrolling
                                <div className="news-ticker p-4 space-y-4">
                                    {/* Duplicating notices for Seamless Loop */}
                                    {[...notices, ...notices].map((notice, index) => (
                                        <div key={`${notice.id}-${index}`} className="bg-white p-5 rounded-xl border-l-4 border-l-[#004d00] border border-[#ffd200] shadow-sm hover:shadow-md transition-all hover:bg-green-50/30">
                                            
                                            {/* Date Badge */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center text-[10px] font-bold text-[#004d00] bg-green-100 w-fit px-2 py-1 rounded">
                                                    <Icons.Calendar /> <span className="ml-1">{notice.createdAt?.toDate?.() ? 
                                                        new Date(notice.createdAt.toDate()).toLocaleDateString() : 
                                                        new Date(notice.createdAt?.toMillis?.() || notice.createdAt).toLocaleDateString()
                                                    }</span>
                                                </div>
                                                {index < 2 && <span className="text-[9px] text-white bg-red-500 px-2 py-0.5 rounded-full font-bold animate-pulse">NEW</span>}
                                            </div>

                                            {/* Title */}
                                            <h4 className="font-bold text-[#004d00] text-lg mb-2">{notice.title}</h4>

                                            {/* Text */}
                                            <p className="text-gray-800 text-sm font-medium leading-relaxed whitespace-pre-line mb-3">
                                                {notice.content}
                                            </p>

                                            {/* PDF Attachment Display */}
                                            {notice.pdfData && (
                                                <div className="mt-3 pt-3 border-t border-dashed border-[#ffd200]">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Icons.File className="w-4 h-4 mr-2 text-[#004d00]" />
                                                            <span className="text-xs text-gray-600">
                                                                PDF: {notice.pdfFileName}
                                                            </span>
                                                        </div>
                                                        <a 
                                                            href={notice.pdfData} 
                                                            download={notice.pdfFileName}
                                                            target="_blank" 
                                                            rel="noreferrer"
                                                            className="flex items-center justify-center bg-[#004d00]/10 text-[#004d00] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#004d00] hover:text-white transition-colors border border-[#004d00]/20"
                                                        >
                                                            <Icons.Download /> <span className="ml-1">Download PDF</span>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Priority Badge */}
                                            {notice.priority && notice.priority !== 'normal' && (
                                                <div className="mt-2">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        notice.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                        notice.priority === 'important' ? 'bg-[#ffd200] text-[#004d00]' :
                                                        'bg-gray-100 text-gray-700'
                                                    }`}>
                                                        {notice.priority.charAt(0).toUpperCase() + notice.priority.slice(1)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* === STATS & WELCOME === */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#ffd200] mb-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome Students 👋</h2>
                        <p className="text-gray-500 text-sm">Access your notes, outlines, and past papers from the library below.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-6 py-2 bg-green-50 rounded-xl border border-green-100">
                            <span className="block text-2xl font-bold text-[#004d00]">46+</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Subjects</span>
                        </div>
                        <div className="text-center px-6 py-2 bg-yellow-50 rounded-xl border border-yellow-100">
                            <span className="block text-2xl font-bold text-yellow-600">100+</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase">Notes</span>
                        </div>
                    </div>
                </div>

                {/* === QUICK ACCESS GRID === */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-1 w-10 bg-[#004d00] rounded-full"></div>
                        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">Digital Library</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <QuickCard title="Outlines" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" color="text-blue-600 bg-blue-50" onClick={() => setContentType('outline')} />
                        <QuickCard title="Notes" icon="M12 6.5v11m4-7H8M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="text-yellow-600 bg-yellow-50" onClick={() => setContentType('notes')} />
                        <QuickCard title="Past Papers" icon="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" color="text-green-600 bg-green-50" onClick={() => setContentType('pastPaper')} />
                        {/* <QuickCard title="Portfolios" icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 2.388-8 5v1h16v-1c0-2.612-3.582-5-8-5z" color="text-purple-600 bg-purple-50" onClick={() => setContentType('portfolio')} /> */}
                        <QuickCard title="Tools" icon="M7 21h10a2 2 0 002-2V9.586a1 1 0 00-.293-.707l-5.586-5.586A1 1 0 0011.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" color="text-red-600 bg-red-50" onClick={() => setContentType('tools')} />
                        <QuickCard title="About" icon="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" color="text-gray-600 bg-gray-100" onClick={() => setContentType('about')} />
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- HELPER COMPONENT: QUICK CARD ---
const QuickCard = ({ title, icon, color, onClick }) => (
    <div onClick={onClick} className="bg-white p-4 rounded-xl shadow-sm border border-[#ffd200] hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center gap-3 group">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color.split(' ')[1]} group-hover:bg-[#004d00] transition-colors`}>
            <Icon path={icon} className={`w-6 h-6 ${color.split(' ')[0]} group-hover:text-white transition-colors`} />
        </div>
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide group-hover:text-[#004d00]">{title}</span>
    </div>
);

export default Home;