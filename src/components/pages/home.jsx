import React, { useState, useEffect } from 'react';
import { Icon } from '../../components/services/uicomponents'; 
import { db } from '../../firebase/firebase'; 
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';
import principal3 from '../../assets/principles/principal.jpg';

// Icons (Local)
const Icons = {
    Bell: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    File: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    Download: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Calendar: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
};

const Home = ({ setContentType }) => {
        // Editable slider heights (px)
        // Change these values to update slider height for each breakpoint
        const sliderHeights = {
            base: 250, // mobile
            md: 360,   // tablet/laptop
            lg: 370,   // desktop
            xl: 380    // large desktop
        };
    
    // --- HOOKS ---
    const { showToast } = useToast();
    
    // --- STATE ---
    const [notices, setNotices] = useState([]); 
    const [aboutSliderImages, setAboutSliderImages] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderLoading, setSliderLoading] = useState(true);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState(null);

    const resolveImageUrl = (value) => {
        if (!value || typeof value !== 'string') return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        return '';
    };

    const openImageModal = (url) => {
        const resolved = resolveImageUrl(url);
        if (!resolved) return;
        setModalImageUrl(resolved);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setModalImageUrl(null);
    };

    const downloadImage = async (url) => {
        const imageUrl = resolveImageUrl(url || modalImageUrl);
        if (!imageUrl) return;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const objectUrl = window.URL.createObjectURL(blob);
            const extension = imageUrl.split('.').pop().split('?')[0] || 'png';
            const a = document.createElement('a');
            a.href = objectUrl;
            a.download = `notice_${Date.now()}.${extension}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(objectUrl);
        } catch (error) {
            console.error('Image download failed:', error);
            showToast('Failed to download image', 'error');
        }
    };

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

        const sliderRef = doc(db, "settings", "about_college_slider");
        const unsubscribeSlider = onSnapshot(
            sliderRef,
            (docSnap) => {
                if (!docSnap.exists()) {
                    setAboutSliderImages([]);
                    setSliderLoading(false);
                    return;
                }
                const data = docSnap.data();
                const imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
                const captions = Array.isArray(data.captions) ? data.captions : [];

                const slides = imageUrls
                    .map((url, idx) => ({ url, idx }))
                    .filter((x) => Boolean(x.url))
                    .map(({ url, idx }) => ({
                        id: idx + 1,
                        image: resolveImageUrl(url),
                        heading: captions[idx] || `Slide ${idx + 1}`,
                    }));

                setAboutSliderImages(slides);
                setSliderLoading(false);
            },
            (error) => {
                console.error("About slider fetch failed:", error);
                setAboutSliderImages([]);
                setSliderLoading(false);
            }
        );

        return () => {
            unsubscribeSnapshot();
            unsubscribeSlider();
        };
    }, []);

    const convertDriveLink = (url) => {
        if (!url) return null;
        if (url.includes('drive.google.com') && url.includes('/file/d/')) {
            const id = url.split('/file/d/')[1].split('/')[0];
            return `https://drive.google.com/uc?export=view&id=${id}`;
        }
        return url; 
    };

    // --- SLIDER TIMER ---
    useEffect(() => {
        if (aboutSliderImages.length <= 1) return;
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev === aboutSliderImages.length - 1 ? 0 : prev + 1));
        }, 6000); 
        return () => clearInterval(slideInterval);
    }, [aboutSliderImages.length]);

    useEffect(() => {
        if (currentSlide >= aboutSliderImages.length) setCurrentSlide(0);
    }, [currentSlide, aboutSliderImages.length]);

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
                    
                    {/* 1. HERO SECTION WITH SLIDER & HISTORY */}
                    <div>
                        <div className="w-full mb-12 flex justify-center">
                            {/* SLIDER - INCREASED WIDTH */}
                            <div className="w-full max-w-6xl relative">
                                <div className="absolute -top-2 -left-2 w-full h-full bg-[#004d00] rounded-xl -z-10 hidden md:block"></div>
                                
                                {/* Main Slider Container */}
                                <div
                                    className="relative rounded-xl overflow-hidden shadow-lg border-4 border-[#FFD700] bg-gray-200"
                                    style={{
                                        height: `${sliderHeights.base}px`,
                                    }}
                                    id="slider-image-box"
                                >
                                    <style>{`
                                        @media (min-width: 768px) { #slider-image-box { height: ${sliderHeights.md}px !important; } }
                                        @media (min-width: 1024px) { #slider-image-box { height: ${sliderHeights.lg}px !important; } }
                                        @media (min-width: 1280px) { #slider-image-box { height: ${sliderHeights.xl}px !important; } }
                                    `}</style>
                                    <div className="absolute inset-0 border-4 border-[#004d00] rounded-xl pointer-events-none"></div>
                                    
                                    {aboutSliderImages.map((slide, index) => (
                                        <div 
                                            key={slide.id}
                                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                                                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                                            }`}
                                        >
                                            {/* Image */}
                                            <img 
                                                src={convertDriveLink(slide.image)} 
                                                alt={slide.heading} 
                                                loading="eager"
                                                className="w-full h-full object-fit" 
                                            />
                                            
                                            {/* Caption */}
                                            <div className="absolute bottom-3 left-3 right-3 bg-[#004d00] border-2 border-[#ffd200] rounded-lg p-2 backdrop-blur-sm">
                                                <p className="text-white text-md md:text-sm font-bold text-center tracking-wide">
                                                    {slide.heading}
                                                </p>
                                            </div>
                                        </div>
                                    ))}

                                    {aboutSliderImages.length === 0 && !sliderLoading && (
                                        <div className="w-full h-full flex items-center justify-center text-center px-4 text-gray-500">
                                            No slider images are configured yet. Upload images from the admin panel to display them here.
                                        </div>
                                    )}

                                </div>
                            </div>
                        </div>

                        {/* College Info Section */}
                        <div className="text-center mt-5 px-2">
                            <span className="bg-yellow-400 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-3 inline-block shadow-sm">
                                Official Website
                            </span>
                            <h1 className="text-2xl md:text-2xl font-extrabold leading-tight mb-2 text-[#004d00]">
                                Govt. Elementary College of Education
                            </h1>
                            <p className="text-gray-500 text-sm font-bold tracking-wide uppercase">
                                (M/W) Mithi, Tharparkar
                            </p>
                        </div>
                    </div>

                    {/* 2. PRINCIPAL'S MESSAGE SECTION */}
                    <div className="bg-white rounded-2xl shadow-xl border-4 border-[#FFD700] overflow-hidden">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#004d00] to-[#006400] text-white p-6">
                            <div className="text-center">
                                <p className="text-yellow-300 text-2xl md:text-2xl font-medium">Message from the Principal</p>
                            </div>
                        </div>
                        
                        {/* Content */}
                        <div className="p-8">
                            <div className="flex flex-col items-center">
                                {/* PRINCIPAL PHOTO */}
                                <div className="w-full flex justify-center mb-6">
                                    <div className="relative w-32 h-32 md:w-40 md:h-40 overflow-hidden border-4 border-[#004d00] shadow-xl">
                                        <img 
                                            src={principal3} 
                                            alt="Principal Jeetandar Maheshwari" 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {e.target.src='https://placehold.co/400x400/004d00/white?text=PRINCIPAL'}}
                                        />
                                    </div>
                                </div>

                                {/* MESSAGE TEXT */}
                                <div className="w-full space-y-4">
                                    <div className="text-gray-700 leading-relaxed space-y-4">
                                        <p className="text-lg font-semibold text-[#004d00] text-center">
                                            "Teacher is a change agent of society. The capacity building of teachers are mandatory."
                                        </p>
                                        
                                        <p className="text-base leading-relaxed text-justify">
                                            Prospective teachers develop many skills during their training here at GECE Mithi. Besides, future teachers enhance knowledge and habits positively. Learning use of modern methodology in teaching enables them to be professional teachers.
                                        </p>
                                        
                                        <p className="text-base leading-relaxed text-justify">
                                            As our institution offers B.Ed. (Hons) Elementary from 2017. For this, we are grateful to School Education & Literacy Department, Government of Sindh.
                                        </p>
                                        
                                        <p className="text-base leading-relaxed text-justify">
                                            The teaching and non-teaching staff of our institution work with heart and soul for the college so the dreams of prospective teachers and parents may come true.
                                        </p>
                                    </div>
                                    
                                    {/* Signature */}
                                    <div className="pt-4 border-t border-[#FFD700]/30">
                                        <div className="text-right">
                                            <p className="font-bold text-[#004d00] text-lg">Jeetandar Maheshwari</p>
                                            <p className="text-sm text-gray-600 font-medium">Principal, GECE Mithi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                <span className="text-[15px] text-white font-bold bg-white/20 px-2 py-1 rounded">Latest News</span>
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

                                            {/* Image Attachment Display */}
                                            {notice.imageUrl && resolveImageUrl(notice.imageUrl) && (
                                                <div className="mt-3 rounded-xl overflow-hidden border border-[#ffd200] bg-white shadow-sm">
                                                    <div className="p-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                                        <span className="text-xs text-gray-500">Image attached to notice</span>
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <button
                                                                onClick={() => downloadImage(notice.imageUrl)}
                                                                className="bg-white text-[#004d00] border border-[#004d00] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#004d00] hover:text-white transition flex items-center gap-1"
                                                            >
                                                                <Icons.Download /> Download
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* PDF Attachment Display */}
                                            {(notice.attachmentUrl || notice.pdfUrl) && (
                                                <div className="mt-3 pt-3 border-t border-dashed border-[#ffd200]">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Icons.File className="w-4 h-4 mr-2 text-[#004d00]" />
                                                            <span className="text-xs text-gray-600">
                                                                PDF: {notice.attachmentName || notice.pdfFileName}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <a
                                                                href={notice.attachmentUrl || notice.pdfUrl || notice.pdfFilePath || '#'}
                                                                download={notice.attachmentName || notice.pdfFileName || 'document.pdf'}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                onClick={async (e) => {
                                                                    const href = notice.attachmentUrl || notice.pdfUrl || '';
                                                                    const filePath = notice.pdfFilePath || null;
                                                                    if (href && href.startsWith('http')) {
                                                                        console.log('Opening notice file URL:', href);
                                                                        return;
                                                                    }
                                                                    if (filePath) {
                                                                        e.preventDefault();
                                                                        try {
                                                                            const { default: firebaseStorageService } = await import('../../services/firebaseStorageService');
                                                                            const url = await firebaseStorageService.getFileUrl(filePath);
                                                                            if (url) {
                                                                                window.open(url, '_blank', 'noopener');
                                                                            } else {
                                                                                alert('Unable to resolve file URL.');
                                                                            }
                                                                        } catch (err) {
                                                                            console.error('Failed to get download URL from Firebase Storage:', err);
                                                                            alert('Failed to load file.');
                                                                        }
                                                                    } else {
                                                                        e.preventDefault();
                                                                        alert('Invalid file URL. Please contact admin.');
                                                                        console.error('Notice download failed - invalid URL or missing filePath:', notice);
                                                                    }
                                                                }}
                                                                className="flex items-center justify-center bg-[#004d00]/10 text-[#004d00] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#004d00] hover:text-white transition-colors border border-[#004d00]/20"
                                                            >
                                                                <Icons.Download /> <span className="ml-1">Download</span>
                                                            </a>
                                                        </div>
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
             </div>

            {showImageModal && modalImageUrl && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={closeImageModal}>
                    <div className="relative max-w-5xl w-full max-h-[90vh] bg-transparent" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={closeImageModal}
                            className="absolute top-3 right-3 z-20 bg-white/90 text-gray-800 rounded-full p-2 hover:bg-white"
                        >
                            ✕
                        </button>
                        <img src={modalImageUrl} alt="Notice full screen" className="w-full h-[80vh] object-contain rounded-lg shadow-2xl" />
                        <button
                            onClick={downloadImage}
                            className="mt-4 w-full bg-[#004d00] text-white py-3 rounded-lg font-bold hover:bg-[#003800] transition"
                        >
                            Download Image
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;