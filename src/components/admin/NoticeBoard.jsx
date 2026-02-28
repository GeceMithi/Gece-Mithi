import React, { useState, useEffect } from 'react';
import { db } from '../../../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function NoticeBoard() {
    const [notices, setNotices] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newNotice, setNewNotice] = useState({
        content: '',
        attachment: null
    });
    const [loading, setLoading] = useState(false);

    // Fetch notices from Firebase on component mount
    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            const noticesQuery = query(collection(db, "notices"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(noticesQuery);
            const noticesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotices(noticesData);
        } catch (error) {
            console.error("Error fetching notices:", error);
            alert("Failed to load notices");
        } finally {
            setLoading(false);
        }
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

    const handleAddNotice = async () => {
        if (newNotice.content.trim()) {
            try {
                setLoading(true);
                
                // Create notice object for Firebase
                const noticeData = {
                    content: newNotice.content,
                    date: formatDate(),
                    createdAt: serverTimestamp(),
                    attachmentName: newNotice.attachment?.name || null
                };

                // Add to Firebase
                const docRef = await addDoc(collection(db, "notices"), noticeData);
                
                // Handle PDF upload if present
                let attachmentUrl = null;
                if (newNotice.attachment) {
                    attachmentUrl = URL.createObjectURL(newNotice.attachment);
                }

                // Update local state with new notice
                const newNoticeWithId = {
                    id: docRef.id,
                    ...noticeData,
                    attachmentUrl: attachmentUrl
                };
                
                setNotices([newNoticeWithId, ...notices]);
                setNewNotice({ content: '', attachment: null });
                setShowAddForm(false);
                
                alert("Notice posted successfully!");
            } catch (error) {
                console.error("Error adding notice:", error);
                alert("Failed to post notice");
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDeleteNotice = async (id) => {
        if (window.confirm("Are you sure you want to delete this notice?")) {
            try {
                setLoading(true);
                
                // Clean up URL object if attachment exists
                const noticeToDelete = notices.find(n => n.id === id);
                if (noticeToDelete?.attachmentUrl) {
                    URL.revokeObjectURL(noticeToDelete.attachmentUrl);
                }
                
                // Delete from Firebase
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'application/pdf') {
            // Check file size (2MB limit)
            if (file.size <= 2 * 1024 * 1024) {
                setNewNotice({ ...newNotice, attachment: file });
            } else {
                alert('PDF file size must be less than 2MB');
                e.target.value = ''; // Clear the input
            }
        } else if (file) {
            alert('Please select a PDF file only');
            e.target.value = ''; // Clear the input
        }
    };

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
                            <div className="flex items-center gap-2 mb-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                                </svg>
                                <label className="text-sm font-medium text-gray-700">
                                    ATTACH FILE (PDF ONLY)
                                </label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={handleFileChange}
                                    className="text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                    disabled={loading}
                                />
                                <span className="text-sm text-gray-500">
                                    {newNotice.attachment ? newNotice.attachment.name : 'No file chosen'}
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">PDF max 2MB.</p>
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    setShowAddForm(false);
                                    setNewNotice({ content: '', attachment: null });
                                }}
                                className="px-6 py-2 text-gray-700 hover:text-gray-900 transition"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddNotice}
                                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 transition"
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Post'}
                            </button>
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
                    notices.map((notice) => (
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
                        </div>
                    ))
                )}
            </div>
                </div>
            </div>
        </div>
    );
}
