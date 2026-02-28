import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase'; 
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged 
} from "firebase/auth";
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    arrayUnion,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    orderBy
} from "firebase/firestore";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from "../assets/board/logo.png";

// === ICONS ===
const Icons = {
    Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    User: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>,
    Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    File: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>,
    LogOut: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    Upload: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    Download: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Alert: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>,
    Edit: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>,
    List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Paperclip: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>,
    Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    GraduationCap: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0"></path></svg>,
    Cloud: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>
};

const ADMIN_EMAIL = "admin@gece.com"; 
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const years = Array.from({ length: 60 }, (_, i) => new Date().getFullYear() - 15 - i); 

export default function Home() {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [allStudents, setAllStudents] = useState([]); 
    const [notices, setNotices] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEditing, setIsEditing] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // === TOP LEVEL VARIABLES ===
    const total = userData?.challans?.length || 0;
    const verified = userData?.challans?.filter(c => c.status === 'Verified').length || 0;
    const pending = userData?.challans?.filter(c => c.status === 'Pending Verification').length || 0;

    const [siteConfig, setSiteConfig] = useState({ 
        collegeName: "GOVT. ELEMENTARY COLLEGE OF EDUCATION (M/W) MITHI",
        tickerText: "Welcome to Student Portal",
        heroImage: "" 
    });
    
    // Notice Modal
    const [showNoticeModal, setShowNoticeModal] = useState(false);
    const [noticeText, setNoticeText] = useState('');
    const [noticeFile, setNoticeFile] = useState(null);
    
    // Challan Modal
    const [adminChallanModal, setAdminChallanModal] = useState({ show: false, cnic: null });
    const [challanForm, setChallanForm] = useState({ part: 'Part I', batch: '2k25', status: 'Non-Hosteller' });

    // Profile & Other
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedChallanId, setSelectedChallanId] = useState(null);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [studentForm, setStudentForm] = useState({ prefix: 'Mr', fullName: '', surname: '', fatherName: '', email: '', gender: 'Male', mobileNo: '', zipCode: '69230', city: 'Mithi', district: 'Tharparkar', address: '' });
    const [dob, setDob] = useState({ day: '1', month: 'January', year: '2000' });
    const [saving, setSaving] = useState(false);

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // === GROUP VERIFIED STUDENTS BY BATCH ===
    const getVerifiedStudentsByBatch = () => {
        const batchGroups = {};
        allStudents.forEach(student => {
            if(student.challans) {
                student.challans.forEach(ch => {
                    if(ch.status === 'Verified') {
                        const b = ch.batch || "Unknown";
                        if(!batchGroups[b]) batchGroups[b] = [];
                        batchGroups[b].push({ 
                            name: student.profile?.fullName || 'N/A', 
                            fname: student.profile?.fatherName || 'N/A', 
                            cnic: student.cnic, 
                            status: ch.statusType, 
                            amount: ch.amount 
                        });
                    }
                });
            }
        });
        return batchGroups;
    };

    // === NOTICE FORMATTER FUNCTION ===
    // Handles new lines (\n) and bold text (*text*)
    const renderNoticeContent = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => {
            const parts = line.split('*');
            return (
                <div key={index} className={`min-h-[1.5em] ${line.trim() === '' ? 'h-4' : ''}`}>
                    {parts.map((part, i) => {
                        // Odd index means it was between asterisks -> Bold it
                        if (i % 2 === 1) {
                            return <span key={i} className="font-extrabold text-black bg-yellow-100 px-1 rounded">{part}</span>;
                        }
                        // Even index is normal text
                        return <span key={i} className="text-gray-700 font-medium">{part}</span>;
                    })}
                </div>
            );
        });
    };

    const showToast = (message, type = 'success') => {
        setNotification({ show: true, message, type });
        setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000);
    };

    const ToastPopup = () => (
        notification.show && (
            <div className={`fixed bottom-5 right-5 z-50 px-6 py-4 rounded-lg shadow-xl text-white font-bold flex items-center gap-3 animate-bounce ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
                {notification.type === 'success' ? <Icons.Check /> : <Icons.Alert />} {notification.message}
            </div>
        )
    );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                await fetchNotices(); 
                try {
                    const docSnap = await getDoc(doc(db, "site_config", "main"));
                    if (docSnap.exists()) setSiteConfig(docSnap.data());
                } catch (e) { }

                if (currentUser.email === ADMIN_EMAIL) {
                    setIsAdmin(true);
                    await fetchAllStudents();
                } else {
                    setIsAdmin(false);
                    const cnic = currentUser.email.split('@')[0];
                    await fetchStudentData(cnic);
                }
            } else {
                setUser(null);
                setUserData(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const compressImage = (file) => { 
        return new Promise((resolve, reject) => { 
            const reader = new FileReader(); 
            reader.readAsDataURL(file); 
            reader.onload = (event) => { 
                const img = new Image(); 
                img.src = event.target.result; 
                img.onload = () => { 
                    const canvas = document.createElement('canvas'); 
                    const MAX_WIDTH = 1600; 
                    let width = img.width;
                    let height = img.height;
                    if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
                    canvas.width = width; canvas.height = height; 
                    const ctx = canvas.getContext('2d'); 
                    ctx.drawImage(img, 0, 0, width, height); 
                    resolve(canvas.toDataURL('image/jpeg', 0.95)); 
                }; 
                img.onerror = (error) => reject(error); 
            }; 
            reader.onerror = (error) => reject(error); 
        }); 
    };

    // Helper for PDF to Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const convertDriveLink = (url) => { if (!url) return null; if (url.includes('drive.google.com') && url.includes('/file/d/')) { const id = url.split('/file/d/')[1].split('/')[0]; return `https://drive.google.com/uc?export=view&id=${id}`; } return url; };
    const fetchNotices = async () => { try { const q = query(collection(db, "notices"), orderBy("createdAt", "desc")); const querySnapshot = await getDocs(q); setNotices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))); } catch (error) { } };
    const fetchAllStudents = async () => { try { const q = await getDocs(collection(db, "students")); setAllStudents(q.docs.map(doc => ({ id: doc.id, ...doc.data() }))); } catch (e) { } };
    const fetchStudentData = async (cnic) => { const d = await getDoc(doc(db, "students", cnic)); if(d.exists()) { setUserData(d.data()); if(d.data().profile) setStudentForm(d.data().profile); } else setUserData({ cnic, name: 'Student', challans: [] }); };
    
    // Actions
    const handleLogin = async (e) => { e.preventDefault(); let email = emailInput.trim(); if(!email.includes('@')) email += '@gecemithi.pk'; try { await signInWithEmailAndPassword(auth, email, passwordInput); showToast("Success!"); } catch { if(!email.includes("admin")) { await createUserWithEmailAndPassword(auth, email, passwordInput); await setDoc(doc(db, "students", emailInput.trim()), { cnic: emailInput.trim(), challans: [] }); showToast("Account Created!"); } else showToast("Login Failed", "error"); } };
    
    const addNotice = async (e) => { 
        e.preventDefault(); 
        try { 
            let fileData = null; 
            let fileType = null; 
            if (noticeFile) { 
                if (noticeFile.type !== 'application/pdf') { showToast("Only PDF files are allowed", "error"); return; } 
                if (noticeFile.size > 2 * 1024 * 1024) { showToast("PDF too large (Max 2MB)", "error"); return; } 
                fileData = await fileToBase64(noticeFile); 
                fileType = 'application/pdf'; 
            } 
            await addDoc(collection(db, "notices"), { 
                text: noticeText, 
                fileUrl: fileData, 
                fileType: fileType, 
                fileName: noticeFile ? noticeFile.name : null, 
                createdAt: new Date().toISOString(), 
                date: new Date().toLocaleDateString() 
            }); 
            setShowNoticeModal(false); 
            setNoticeText(''); 
            setNoticeFile(null); 
            fetchNotices(); 
            showToast("Notice Posted!", "success"); 
        } catch (err) { 
            showToast("Error posting notice", "error"); 
        } 
    };

    const deleteNotice = async (id) => { if(!window.confirm("Delete?")) return; try { await deleteDoc(doc(db, "notices", id)); fetchNotices(); showToast("Deleted!"); } catch { showToast("Error", "error"); } };

    // === VERIFIED LIST PDF ===
    const downloadBatchPDF = (batchName, studentsList) => { 
        const doc = new jsPDF(); 
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        // Header
        doc.setFontSize(16);
        doc.text(siteConfig.collegeName, pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(12);
        doc.text(`Verified Students - ${batchName}`, pageWidth / 2, 30, { align: 'center' });
        doc.text(`Total: ${studentsList.length} students`, pageWidth / 2, 40, { align: 'center' });
        
        // Table
        const tableData = studentsList.map((student, index) => [
            index + 1,
            student.name,
            student.fname,
            student.cnic,
            student.status,
            student.amount
        ]);
        
        autoTable(doc, {
            head: [['#', 'Name', 'Father Name', 'CNIC', 'Status', 'Amount']],
            body: tableData,
            startY: 50,
            theme: 'grid',
            styles: {
                fontSize: 10,
                cellPadding: 3
            },
            headStyles: {
                fillColor: [0, 77, 0],
                textColor: 255
            }
        });
        
        doc.save(`${batchName}_Verified_Students.pdf`);
        showToast("Downloaded!", "success"); 
    };

    // === LOGIN FORM ===
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-green-200">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icons.Grid className="text-white" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800">Student Portal</h1>
                        <p className="text-gray-600 mt-2">GECE Mithi</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email / CNIC</label>
                            <input
                                type="text"
                                value={emailInput}
                                onChange={(e) => setEmailInput(e.target.value)}
                                className="w-full px-4 py-3 border border-[#ffd200] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter CNIC or email"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                className="w-full px-4 py-3 border border-[#ffd200] rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter password"
                                required
                            />
                        </div>
                        
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // === ADMIN SIDEBAR ===
    if (isAdmin) {
        return (
            <div className="flex flex-col md:flex-row min-h-screen bg-[#f8f9fa] font-sans">
                <ToastPopup />
                {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
                <aside className={`fixed inset-y-0 left-0 w-64 bg-[#004d00] text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div className="p-6 text-center border-b border-green-800 flex justify-between items-center md:block">
                        <div className="w-full"><div className="mb-3 flex justify-center"><img src={logo}  alt="Logo" className="h-16 w-auto object-contain" /></div><h2 className="text-lg font-bold">ADMIN PANEL</h2><p className="text-xs text-green-200">GECE MITHI</p></div>
                        <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-white"><Icons.Close /></button>
                    </div>
                    <div className="flex-1 p-4 space-y-2">
                        <button onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 font-bold rounded shadow ${activeTab === 'dashboard' ? 'bg-white text-[#004d00]' : 'text-green-100 hover:bg-[#005a00]'}`}><Icons.Grid /> <span className="ml-3">ALL STUDENTS</span></button>
                        <button onClick={() => { setActiveTab('verifiedList'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 font-bold rounded shadow ${activeTab === 'verifiedList' ? 'bg-white text-[#004d00]' : 'text-green-100 hover:bg-[#005a00]'}`}><Icons.List /> <span className="ml-3">VERIFIED LIST</span></button>
                        <button onClick={() => { setActiveTab('manageBatches'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 font-bold rounded shadow ${activeTab === 'manageBatches' ? 'bg-white text-[#004d00]' : 'text-green-100 hover:bg-[#005a00]'}`}><Icons.GraduationCap /> <span className="ml-3">MANAGE BATCHES</span></button>
                        <button onClick={() => { setActiveTab('noticeBoard'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 font-bold rounded shadow ${activeTab === 'noticeBoard' ? 'bg-white text-[#004d00]' : 'text-green-100 hover:bg-[#005a00]'}`}><Icons.Bell /> <span className="ml-3">NOTICE BOARD</span></button>
                        <button onClick={() => { setActiveTab('manageResources'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 font-bold rounded shadow ${activeTab === 'manageResources' ? 'bg-white text-[#004d00]' : 'text-green-100 hover:bg-[#005a00]'}`}><Icons.Cloud /> <span className="ml-3">MANAGE RESOURCES</span></button>
                        <button onClick={() => { setActiveTab('staffManagement'); setIsSidebarOpen(false); }} className={`flex items-center w-full px-4 py-3 font-bold rounded shadow ${activeTab === 'staffManagement' ? 'bg-white text-[#004d00]' : 'text-green-100 hover:bg-[#005a00]'}`}><Icons.Users /> <span className="ml-3">STAFF MANAGEMENT</span></button>
                    </div>
                    <div className="p-4 border-t border-green-800"><button onClick={() => signOut(auth)} className="flex items-center w-full justify-center text-red-200 hover:text-white font-bold"><Icons.LogOut /> <span className="ml-2">LOGOUT</span></button></div>
                </aside>
                <main className="flex-1 flex flex-col min-h-screen w-full">
                    <header className="h-16 bg-white border-b border-[#ffd200] flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden text-gray-600"><Icons.Menu /></button>
                            <h2 className="text-sm md:text-lg font-bold text-[#004d00] uppercase tracking-wide">{activeTab.replace(/([A-Z])/g, ' $1').trim()}</h2>
                        </div>
                        <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full hidden sm:block">{currentDate}</div>
                    </header>
                    
                    <div className="flex-1 p-6">
                        {activeTab === 'staffManagement' && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Staff Management</h2>
                                <p className="text-gray-600">Manage staff members, volunteers, faculty, and non-teaching staff.</p>
                                <div className="mt-4 p-4 bg-blue-50 border border-[#ffd200] rounded-lg">
                                    <p className="text-blue-800">Staff Management feature is now integrated with the main website. Please access it from the main navigation under "About → Staff Management"</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Other tabs content would go here */}
                        {activeTab === 'dashboard' && (
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Dashboard</h2>
                                <p className="text-gray-600">Admin dashboard content here...</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        );
    }

    // === STUDENT PORTAL ===
    return (
        <div className="min-h-screen bg-gray-50">
            <ToastPopup />
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Student Portal</h1>
                    <p className="text-gray-600">Welcome to the student portal. Your content would go here.</p>
                </div>
            </div>
        </div>
    );
}
