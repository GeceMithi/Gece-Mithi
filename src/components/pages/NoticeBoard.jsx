import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import * as pdfjsLib from 'pdfjs-dist';
import { CLOUDINARY_CONFIG } from '../../config/cloudinaryConfig';

// PDF.js worker fallback configuration
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function NoticeBoard() {
    const [notices, setNotices] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newNotice, setNewNotice] = useState({
        title: '',
        description: ''
    });
    const [selectedPdf, setSelectedPdf] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);

    // Fetch notices from Firebase on component mount
    useEffect(() => {
        console.log('[NoticeBoard.useEffect] Component mounted, fetching notices...');
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            console.log('[NoticeBoard.fetchNotices] Querying Firestore collection "notices"...');
            const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(noticesQuery);
            console.log('[NoticeBoard.fetchNotices] Query returned', querySnapshot.size, 'documents');
            
            const noticesData = querySnapshot.docs.map((doc, idx) => {
                const data = doc.data();
                console.log(`[NoticeBoard.fetchNotices] Doc ${idx}:`, {
                    id: doc.id,
                    title: data.title,
                    hasImageUrl: !!data.imageUrl,
                    imageUrl: data.imageUrl,
                    hasContent: !!data.content,
                    createdAt: data.createdAt
                });
                return {
                    id: doc.id,
                    ...data
                };
            });
            
            console.log('[NoticeBoard.fetchNotices] Total notices loaded:', noticesData.length);
            setNotices(noticesData);
        } catch (error) {
            console.error("[NoticeBoard.fetchNotices] Error fetching notices:", error);
            alert("Failed to load notices");
        } finally {
            setLoading(false);
        }
    };

    // Convert first page of PDF to high-quality PNG image Blob
    const convertPdfToImageBlob = async (file, { mimeType = 'image/png' } = {}) => {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const unscaledViewport = page.getViewport({ scale: 1 });
        const maxSide = Math.max(unscaledViewport.width, unscaledViewport.height);
        const targetSide = 4096;
        const effectiveScale = maxSide >= targetSide ? 1 : targetSide / maxSide;
        const scale = Math.min(Math.max(effectiveScale, 1), 10);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        await page.render({ canvasContext: ctx, viewport }).promise;

        return new Promise((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error('Canvas conversion failed'));
            }, mimeType);
        });
    };

    const uploadBlobToCloudinary = async (blob, publicIdPrefix = 'notice') => {
        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/upload`;
        const form = new FormData();
        form.append('file', blob);
        form.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
        form.append('folder', `notices`);
        form.append('public_id', `${publicIdPrefix}_${Date.now()}`);

        const res = await fetch(url, { method: 'POST', body: form });
        if (!res.ok) throw new Error('Cloudinary upload failed');
        return res.json();
    };

    const getCurrentDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    const formatDate = (date) => {
        const d = new Date();
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // New flow: select PDF then convert & publish to Cloudinary and save Firestore document
    const handleConvertAndPublish = async () => {
        if (!selectedPdf) {
            alert('Please select a PDF first (max 5MB).');
            return;
        }
        if (!newNotice.title || !newNotice.title.trim()) {
            alert('Please enter a title for the notice.');
            return;
        }

        try {
            setIsPublishing(true);
            setUploadMessage('Converting PDF to high-quality image...');

            const imageBlob = await convertPdfToImageBlob(selectedPdf, { mimeType: 'image/png' });
            setUploadMessage('Uploading image to Cloudinary...');
            const cloudResp = await uploadBlobToCloudinary(imageBlob, 'notice_img');
            const secureUrl = cloudResp.secure_url || cloudResp.url;

            setUploadMessage('Saving notice metadata to Firestore...');
            const noticeData = {
                title: newNotice.title,
                description: newNotice.description || '',
                date: formatDate(),
                imageUrl: secureUrl,
                cloudinary: { public_id: cloudResp.public_id, version: cloudResp.version },
                createdAt: serverTimestamp()
            };

            const docRef = await addDoc(collection(db, 'notices'), noticeData);

            setNotices([ { id: docRef.id, ...noticeData }, ...notices ]);
            setNewNotice({ title: '', description: '' });
            setSelectedPdf(null);
            setUploadMessage('✅ Notice published successfully.');
            setShowAddForm(false);
        } catch (err) {
            console.error('Publish failed:', err);
            setUploadMessage(`Publish failed: ${err.message}`);
            alert('Publish failed: ' + err.message);
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDeleteNotice = async (id) => {
        if (window.confirm("Are you sure you want to delete this notice?")) {
            try {
                setLoading(true);
                // For notices with Cloudinary-hosted images, do NOT attempt client-side deletion of Cloudinary assets.
                // Only delete the Firestore document here. Cloudinary asset lifecycle should be handled server-side if needed.
                await deleteDoc(doc(db, "notices", id));

                // Update local state
                setNotices(notices.filter(notice => notice.id !== id));
                
                            alert("Notice deleted successfully!");
            } catch (error) {
                console.error("Error deleting notice:", error);
                alert("Failed to delete notice");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDownloadImage = async () => {
        if (!selectedImage) return;
        try {
            const res = await fetch(selectedImage);
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `notice_${Date.now()}.webp`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Failed to download image');
        }
    };

    // handleFileChange removed; file selection handled by hidden input in form

    const handleViewAttachment = (attachmentUrl) => {
        if (attachmentUrl) {
            window.open(attachmentUrl, '_blank');
        }
    };

    const formatText = (text) => {
        // Convert text wrapped in single quotes to bold
        return text.replace(/'([^']+)'/g, '<strong>$1</strong>');
    };

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div className="grow p-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-green-700">NOTICE BOARD</h2>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                            disabled={loading}
                        >
                            <span className="text-xl">+</span> ADD NOTICE
                        </button>
                    </div>

            {/* Add Notice Form */}
            {showAddForm && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4 text-green-700">Add Notice</h3>
                    <div className="space-y-4">
                        <div>
                            <textarea
                                className="w-full p-3 border border-[#ffd200] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize"
                                rows="6"
                                placeholder="Type notice..."
                                value={newNotice.content}
                                onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <div className="mb-3">
                                <input value={newNotice.title} onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })} placeholder="Title" className="w-full p-2 border rounded mb-2" />
                                <textarea value={newNotice.description} onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })} placeholder="Short description (optional)" className="w-full p-2 border rounded" rows={3} />
                            </div>

                            <div className="flex items-center gap-3">
                                <input ref={fileInputRef} type="file" accept=".pdf" onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    if (file.type !== 'application/pdf') { alert('Please select a PDF file'); e.target.value = ''; return; }
                                    if (file.size > 5 * 1024 * 1024) { alert('PDF must be <= 5MB'); e.target.value = ''; return; }
                                    setSelectedPdf(file);
                                }} className="hidden" />

                                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-100 rounded">Select PDF</button>
                                <span className="text-sm text-gray-500">{selectedPdf ? selectedPdf.name : 'No file chosen'}</span>

                                <div className="ml-auto flex items-center gap-2">
                                    <button onClick={() => { setSelectedPdf(null); setNewNotice({ title: '', description: '' }); setShowAddForm(false); }} className="px-4 py-2 text-gray-700 border rounded">Cancel</button>
                                    <button onClick={handleConvertAndPublish} className={`px-4 py-2 rounded text-white font-bold ${isPublishing ? 'bg-gray-400' : 'bg-green-700'}`} disabled={isPublishing}>{isPublishing ? 'Publishing...' : 'Convert & Publish'}</button>
                                </div>
                            </div>

                            {uploadMessage && <p className="text-xs text-gray-500 mt-2">{uploadMessage}</p>}
                        </div>
                    </div>
                </div>
            )}

            {/* Notices List */}
            <div className="space-y-3">
                {loading && notices.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading notices...</p>
                    </div>
                ) : notices.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No notices posted yet.</p>
                    </div>
                ) : (
                    notices.map((notice, idx) => {
                        console.log(`[NoticeBoard.render] Rendering notice ${idx}:`, { id: notice.id, title: notice.title, hasImageUrl: !!notice.imageUrl });
                        return (
                        <div key={notice.id} className="bg-white border border-[#ffd200] rounded-lg p-4 relative">
                            <button
                                onClick={() => handleDeleteNotice(notice.id)}
                                className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
                                title="Delete notice"
                                disabled={loading}
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                            </button>

                            {/* New-style notice: title/description/imageUrl */}
                            {notice.title ? (
                                <>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2">{notice.title}</h3>
                                    {notice.imageUrl && (
                                        <div className="mb-3 cursor-pointer" onClick={() => { setSelectedImage(notice.imageUrl); setShowImageModal(true); }}>
                                            <img 
                                                src={notice.imageUrl} 
                                                alt={notice.title} 
                                                className="w-full max-h-72 object-contain rounded hover:opacity-80 transition" 
                                                title="Click to view full screen"
                                                onLoad={() => console.log('[NoticeBoard] Image loaded:', notice.imageUrl)}
                                                onError={(e) => console.error('[NoticeBoard] Image load failed:', notice.imageUrl, e)}
                                            />
                                        </div>
                                    )}
                                    {!notice.imageUrl && <p className="text-gray-500 text-sm mb-3">[No image]</p>}
                                    {notice.description && (
                                        <div className="text-gray-800 text-sm leading-relaxed mb-3" style={{ whiteSpace: 'pre-wrap' }}>{notice.description}</div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">{notice.date}</span>
                                        {/* No client-side deletion of Cloudinary asset here */}
                                    </div>
                                </>
                            ) : (
                                // Fallback to old-style notice with content/attachment
                                <>
                                    <div 
                                        className="text-gray-800 text-sm leading-relaxed mb-3 pr-8"
                                        style={{ whiteSpace: 'pre-wrap' }}
                                        dangerouslySetInnerHTML={{ __html: formatText(notice.content) }}
                                    />
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-500">{notice.date}</span>
                                        {notice.attachmentName && (
                                            <button 
                                                onClick={() => handleViewAttachment(notice.attachmentUrl)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 transition flex items-center gap-1"
                                                disabled={loading}
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                </svg>
                                                Attachment
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        );
                    })
                )}
            </div>
                </div>
            </div>

            {/* Full-Screen Image Modal */}
            {showImageModal && selectedImage && (
                <div 
                    className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <div 
                        className="relative max-w-4xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 z-10 transition"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>

                        {/* Image */}
                        <img src={selectedImage} alt="Full screen notice" className="w-full h-full object-contain rounded-lg" />

                        {/* Download Button */}
                        <button
                            onClick={handleDownloadImage}
                            className="absolute bottom-4 left-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                            Download
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
