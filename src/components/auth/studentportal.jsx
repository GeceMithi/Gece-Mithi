import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase/firebase';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    sendPasswordResetEmail,
    updateEmail
} from "firebase/auth";
import {
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    arrayUnion,
    collection,
    getDocs,
    addDoc
} from "firebase/firestore";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as pdfjsLib from 'pdfjs-dist';
import cloudinaryService from '../../services/cloudinaryService';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}
import firebaseStorageService from '../../services/firebaseStorageService';

// === IMPORT COMPONENTS ===
import BatchSection from '../admin/BatchSection';
import DynamicContentManager from '../features/DynamicContentManager';
import CloudinaryMediaManager from '../features/CloudinaryMediaManager';
import SuccessStoriesManagement from '../admin/successstoriesmanagement';
import ResourceManagement from '../admin/resourcemanagement';

// NOTE: PDF notices are converted to high-quality images and uploaded to Cloudinary

// --- IMPORT THEME COMPONENTS ---
import { ThemeNavButton, ThemeButton, ThemeCard, ThemeInput, ThemeBadge } from '../ui/ThemeButton';

// --- Icons ---
const Icons = {
    Dashboard: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>,
    List: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>,
    Search: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>,
    GradCap: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>,
    Users: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>,
    Profile: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>,
    Exam: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    Sync: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>,
    Upload: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>,
    View: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>,
    Download: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>,
    Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>,
    Key: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>,
    Close: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>,
    Logout: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>,
    Bell: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    Trophy: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>,
    Database: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7M4 7a2 2 0 012-2h12a2 2 0 012 2M4 7l8 5 8-5"></path></svg>,
    Menu: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>,
    Check: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>,
    Alert: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>,
    Spinner: () => <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
};

const App = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    // Admin States
    const [allPaidStudents, setAllPaidStudents] = useState([]);
    const [pendingChallans, setPendingChallans] = useState([]);
    const [adminSearchCnic, setAdminSearchCnic] = useState('');
    const [searchedStudent, setSearchedStudent] = useState(null);
    const [adminFilterPart, setAdminFilterPart] = useState('All');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Notice Board States
    const [noticeTitle, setNoticeTitle] = useState('');
    const [noticeContent, setNoticeContent] = useState('');
    const [noticePriority, setNoticePriority] = useState('normal');
    const [noticePDF, setNoticePDF] = useState(null);
    const [publishedNotices, setPublishedNotices] = useState([]);
    const [isPublishingNotice, setIsPublishingNotice] = useState(false);
    const [isUploadingPDF, setIsUploadingPDF] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isDeletingNotice, setIsDeletingNotice] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null); // { action, label, ...params }

    // Reset Password States
    const [showResetModal, setShowResetModal] = useState(false);
    const [resetPasswordInput, setResetPasswordInput] = useState('');

    const [authInput, setAuthInput] = useState({ cnic: '', password: '' });
    const [errorMsg, setErrorMsg] = useState('');
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    // Notification State
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const [studentForm, setStudentForm] = useState({
        profileImage: '', prefix: 'M', fullName: '', surname: '', email: '', dob: '',
        cnic: '', cnicExpiry: '', fatherName: '', mobileCode: '0092', mobileNo: '',
        placeOfBirth: '', country: 'PAKISTAN', province: 'SINDH', district: 'THARPARKAR',
        city: 'MITHI', homeAddress: '', permanentAddress: '', zipCode: '69230', bloodGroup: 'B+', gender: 'FEMALE'
    });

    const [isEditing, setIsEditing] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedChallanId, setSelectedChallanId] = useState(null);
    const [uploadForm, setUploadForm] = useState({ amount: '', mode: 'BANK DEPOSIT', date: '', file: null });
    const [uploading, setUploading] = useState(false);
    const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [receiptUrl, setReceiptUrl] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ id: '', studentCnic: '', part: '', batch: '', amount: '', status: '' });

    const isGlobalLoading = loading || isAuthLoading || uploading;

    useEffect(() => {
        if (isGlobalLoading) { document.title = "Processing... | GECE Mithi"; } else { document.title = user ? (isAdmin === true ? "Admin Panel | GECE Mithi" : "Student Portal | GECE Mithi") : "Login | GECE Mithi"; }
    }, [isGlobalLoading, user]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            try {
                if (currentUser) {
                    setUser(currentUser);
                    const email = currentUser.email;
                    const isAdminUser = email === 'admin@gece.com';
                    setIsAdmin(isAdminUser);

                    if (isAdminUser) {
                        await fetchAllStudentsData();
                        await fetchNotices();
                    } else {
                        const cnic = email.split('@')[0];
                        const studentRef = doc(db, "students", cnic);
                        const studentSnap = await getDoc(studentRef);
                        if (studentSnap.exists()) {
                            const data = studentSnap.data();
                            setUserData(data);
                            setStudentForm(data.personalInfo || {});
                        }
                    }
                } else {
                    setUser(null);
                    setIsAdmin(false);
                    setUserData(null);
                    setStudentForm({});
                }
            } catch (error) {
                console.error("Auth Error:", error);
                setErrorMsg("Authentication failed. Please try again.");
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, []);

    const showToast = (message, type = 'success') => { setNotification({ show: true, message, type }); setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 3000); };
    const getEmail = (cnic) => `${cnic}@studentportal.com`;
    const fetchStudentData = async (cnicOrId) => { let docRef = doc(db, "students", cnicOrId); let docSnap = await getDoc(docRef); if (docSnap.exists()) { setUserData(docSnap.data()); setStudentForm({ ...studentForm, ...docSnap.data().personalInfo }); } else { setStudentForm(prev => ({ ...prev, cnic: cnicOrId })); } };

    const fetchAllStudentsData = async () => {
        console.log("Fetching all students data...");
        try {
            const querySnapshot = await getDocs(collection(db, "students"));
            console.log("Documents found:", querySnapshot.size);
            let paidList = [];
            let pendingList = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const studentCnic = doc.id;
                console.log("Processing student:", studentCnic, data.personalInfo?.fullName);
                if (data.challans && data.challans.length > 0) {
                    data.challans.forEach(challan => {
                        const studentInfo = {
                            name: data.personalInfo?.fullName || "N/A",
                            fname: data.personalInfo?.fatherName || "N/A",
                            studentCnic: studentCnic,
                            part: challan.part,
                            batch: challan.batch,
                            amount: challan.amount,
                            date: challan.date || "N/A",
                            status: challan.status,
                            statusType: challan.statusType
                        };
                        if (challan.status === 'Verified') {
                            paidList.push(studentInfo);
                        } else if (challan.status === 'Pending Verification') {
                            pendingList.push(studentInfo);
                        }
                    });
                }
            });
            console.log("Paid students:", paidList.length, "Pending:", pendingList.length);
            setAllPaidStudents(paidList);
            setPendingChallans(pendingList);
        } catch (error) {
            console.error("Fetch All Students Error:", error);
        }
    };

    const handleAdminSearch = async (e) => {
        e.preventDefault();
        setSearchedStudent(null);
        setLoading(true);
        try {
            const docRef = doc(db, "students", adminSearchCnic.trim());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setSearchedStudent({ ...docSnap.data(), cnic: docSnap.id });
            } else {
                showToast("Student not found!", "error");
            }
        } catch (error) {
            console.error("Search Error:", error); showToast("Error searching student.", "error");
        } finally { setLoading(false); }
    };

    const handleDeleteAccount = (studentCnic) => {
        setDeleteConfirm({ action: 'deleteAccount', studentCnic, label: `student ${studentCnic}` });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        setLoading(true);
        try {
            if (deleteConfirm.action === 'deleteAccount') {
                await deleteDoc(doc(db, "students", deleteConfirm.studentCnic));
                setSearchedStudent(null);
                setAdminSearchCnic('');
                await fetchAllStudentsData();
                showToast("Account Deleted.", "success");
            } else if (deleteConfirm.action === 'deleteNotice') {
                setIsDeletingNotice(true);
                const noticeRef = doc(db, "notices", deleteConfirm.noticeId);
                // Get notice data to find PDF file path before deleting
                const noticeSnap = await getDoc(noticeRef);
                if (noticeSnap.exists()) {
                    const noticeData = noticeSnap.data();
                    // If the notice had a file path in Firebase Storage, delete it
                    const pdfFilePath = noticeData.pdfFilePath || noticeData.attachmentPath || null;
                    if (pdfFilePath) {
                        try {
                            await firebaseStorageService.deleteFile(pdfFilePath);
                            console.log('PDF deleted from Firebase Storage:', pdfFilePath);
                        } catch (storageError) {
                            console.error('Failed to delete PDF from Firebase Storage:', storageError);
                        }
                    }
                }
                // Then delete notice from Firestore
                await deleteDoc(noticeRef);
                await fetchNotices();
                showToast("Notice deleted successfully", "success");
            } else if (deleteConfirm.action === 'deleteChallan') {
                const studentRef = doc(db, "students", deleteConfirm.studentCnic);
                const studentSnap = await getDoc(studentRef);
                if (studentSnap.exists()) {
                    const studentData = studentSnap.data();
                    const updatedChallans = studentData.challans.filter(ch => ch.id !== deleteConfirm.challanId);
                    await updateDoc(studentRef, { challans: updatedChallans });
                    await fetchAllStudentsData();
                    if (searchedStudent && searchedStudent.cnic === deleteConfirm.studentCnic) {
                        setSearchedStudent({ ...studentData, challans: updatedChallans, cnic: deleteConfirm.studentCnic });
                    }
                    showToast("Deleted successfully.", "success");
                } else {
                    showToast("Student record not found.", "error");
                }
            }
        } catch (error) {
            console.error("Delete Error:", error);
            showToast("Delete failed: " + error.message, "error");
        } finally {
            setLoading(false);
            setIsDeletingNotice(false);
            setDeleteConfirm(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const openResetModal = () => { setShowResetModal(true); setResetPasswordInput(''); };
    const handleHardResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const email = getEmail(searchedStudent.cnic);
        const password = resetPasswordInput;
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await signOut(auth);
            alert("Password Reset Successful! You have been logged out. Please login as Admin again.");
            window.location.reload();
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') { alert("Error: User still exists in Firebase Console. Please DELETE user first."); }
            else { alert("Error: " + error.message); }
        } finally { setLoading(false); setShowResetModal(false); }
    };

    const generateSpecificChallanPDF = (studentName, fatherName, part, batch, challanNo, amount, status) => {
        try {
            const doc = new jsPDF('l', 'mm', 'a4');
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const colWidth = pageWidth / 3; const marginX = 6; const contentWidth = colWidth - (marginX * 2);
            const copies = ["BANK COPY", "COLLEGE COPY", "STUDENT COPY"];
            const sName = String(studentName || "N/A"); const fName = String(fatherName || "N/A"); const cNo = String(challanNo || "---"); const stBatch = String(batch || "---");
            const isHosteller = status === 'Hosteller';
            const tuition = '200'; const admission = '100'; const roomRent = isHosteller ? '200' : '---'; const subTotalA = isHosteller ? '500' : '300';
            const funds1 = isHosteller ? '400' : '300'; const funds2 = isHosteller ? '400' : '300'; const totalAmount = isHosteller ? '1300' : '900';

            copies.forEach((copyTitle, index) => {
                const startX = (index * colWidth) + marginX; const centerX = startX + (contentWidth / 2); let y = 10;
                doc.setFont("helvetica", "bold"); doc.setFontSize(9);
                doc.text("GOVT. ELEMENTARY COLLEGE OF", centerX, y, { align: "center" }); y += 6;
                doc.text("EDUCATION (M/W) MITHI", centerX, y, { align: "center" }); y += 10;
                doc.setFontSize(9); doc.text(`Challan No: ${cNo}`, centerX, y, { align: "center" }); y += 6;
                doc.setFillColor(0, 0, 0); doc.setTextColor(255, 255, 255); doc.rect(startX, y - 3, 22, 4, 'F');
                doc.setFontSize(6); doc.text(copyTitle, startX + 11, y, { align: "center" });
                doc.setTextColor(0, 0, 0); doc.setFontSize(7);
                doc.text("NBP MITHI ACCOUNT NO... 9223-7", startX + contentWidth, y, { align: "right" }); y += 6;
                doc.setFontSize(8); doc.text("Date: ______________", startX + contentWidth, y, { align: "right" }); y += 8;
                doc.setFont("helvetica", "normal"); doc.setFontSize(8);
                doc.text(`Name: ${sName}`, startX, y); y += 6; doc.text(`F/Name: ${fName}`, startX, y); y += 6;
                doc.setFont("helvetica", "bold"); doc.text(`Class: ADE/B.Ed(Hons) Part-${part}`, startX, y); y += 6;
                doc.text(`Batch: ${stBatch}`, startX, y); doc.text(`Status: ${status}`, startX + 45, y); y += 8;
                doc.setFontSize(9); doc.text("DETAILS OF CHARGES", centerX, y, { align: "center" }); y += 2;
                autoTable(doc, { startY: y, margin: { left: startX }, tableWidth: contentWidth, head: [['Sr', 'Nature of Dues', 'Amount']], body: [[{ content: 'A) Fee structure per Semester', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], fontSize: 8 } }], ['1', 'Tuition Fee', tuition], ['2', 'Admission Fee', admission], ['3', 'Hostel Room Rent', roomRent], [{ content: 'Sub-Total (A)', colSpan: 2, styles: { fontStyle: 'bold' } }, subTotalA], [{ content: 'B) College-Hostel Dues/Sem', colSpan: 3, styles: { fontStyle: 'bold', fillColor: [240, 240, 240], fontSize: 8 } }], ['1', 'Library/Dev/Utility Funds', funds1], ['2', 'Sports/Welfare/Exam Funds', funds2], [{ content: 'Grand Total (A+B)', colSpan: 2, styles: { fontStyle: 'bold', fontSize: 9 } }, { content: `${totalAmount}`, styles: { fontStyle: 'bold', fontSize: 9 } }],], theme: 'grid', styles: { fontSize: 7, cellPadding: 1.5, minCellHeight: 10, valign: 'middle', lineColor: [0, 0, 0], lineWidth: 0.1 }, headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.1, lineColor: [0, 0, 0], halign: 'center', fontStyle: 'bold' }, columnStyles: { 0: { cellWidth: 6 }, 1: { cellWidth: 55 }, 2: { cellWidth: 20, halign: 'center' } }, });
                const footerY = pageHeight - 15; doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.text("Rupees in words: _________________________________", startX, footerY - 12); doc.setFontSize(7); doc.text("Cashier", startX, footerY); doc.text("Officer", startX + 30, footerY); doc.text("Candidate", startX + 60, footerY);
                if (index < 2) { const lineX = (index + 1) * colWidth; doc.setLineDash([2, 2], 0); doc.line(lineX, 5, lineX, pageHeight - 5); doc.setLineDash([]); doc.setFontSize(10); doc.text("✂", lineX - 1.5, 10); doc.text("✂", lineX - 1.5, pageHeight - 10); }
            });
            doc.save(`Challan_${sName}_${part}.pdf`);
        } catch (error) { console.error("PDF Gen Error:", error); showToast("PDF Error: " + error.message, "error"); }
    };

    const handleAuth = async (e) => { e.preventDefault(); setErrorMsg(''); setIsAuthLoading(true); const input = authInput.cnic.trim(); let password = authInput.password.trim(); let email; if (input.includes('@')) { email = input; } else { email = `${input}@studentportal.com`; } if (input !== 'admin@gece.com' && !input.includes('@')) { if (input !== password) { setIsAuthLoading(false); return setErrorMsg("Password must be same as CNIC."); } } try { await signInWithEmailAndPassword(auth, email, password); } catch (loginError) { try { if (!input.includes('@')) { await createUserWithEmailAndPassword(auth, email, password); if (input !== 'admin@gece.com') { const initialData = { cnic: input, personalInfo: { ...studentForm, cnic: input }, challans: [] }; await setDoc(doc(db, "students", input), initialData); } } else { throw loginError; } } catch (registerError) { setIsAuthLoading(false); if (registerError.code === 'auth/weak-password') setErrorMsg("Error: Password too short."); else setErrorMsg("Error: " + registerError.message); } } };
    const handleLogout = async () => { await signOut(auth); setAuthInput({ cnic: '', password: '' }); setIsAdmin(false); setSearchedStudent(null); setIsAuthLoading(false); };
    const handleFormChange = (e) => { const { name, value } = e.target; setStudentForm(prev => ({ ...prev, [name]: value })); };
    const handleCancelEdit = () => { setIsEditing(false); if (userData?.personalInfo) { setStudentForm(userData.personalInfo); } };
    const openUploadModal = (id) => { setSelectedChallanId(id); const challan = userData.challans.find(c => c.id === id); setUploadForm({ amount: challan.amount, mode: 'BANK DEPOSIT', date: '', file: null }); setShowUploadModal(true); };
    const handleViewReceipt = (url) => { setReceiptUrl(url); setShowReceiptModal(true); };
    const handleAdminAction = async (studentCnic, challanId, newStatus) => { try { const studentRef = doc(db, "students", studentCnic); const studentSnap = await getDoc(studentRef); const studentData = studentSnap.data(); const updatedChallans = studentData.challans.map(ch => { if (ch.id === challanId) return { ...ch, status: newStatus }; return ch; }); await updateDoc(studentRef, { challans: updatedChallans }); await fetchAllStudentsData(); if (searchedStudent && searchedStudent.cnic === studentCnic) { setSearchedStudent({ ...searchedStudent, challans: updatedChallans }); } showToast(`Challan ${newStatus}`, "success"); } catch (error) { showToast("Failed.", "error"); } };
    const openEditModal = (challan, studentCnic) => { setEditForm({ id: challan.id, studentCnic: studentCnic, part: challan.part, batch: challan.batch, amount: challan.amount, status: challan.status }); setShowEditModal(true); };
    const handleEditSubmit = async (e) => { e.preventDefault(); try { const studentRef = doc(db, "students", editForm.studentCnic); const studentSnap = await getDoc(studentRef); const updatedChallans = studentSnap.data().challans.map(ch => { if (ch.id === editForm.id) { return { ...ch, part: editForm.part, batch: editForm.batch, amount: editForm.amount, status: editForm.status }; } return ch; }); await updateDoc(studentRef, { challans: updatedChallans }); await fetchAllStudentsData(); if (searchedStudent && searchedStudent.cnic === editForm.studentCnic) { setSearchedStudent({ ...searchedStudent, challans: updatedChallans }); } setShowEditModal(false); showToast("Record Updated.", "success"); } catch (error) { showToast("Update Failed.", "error"); } };

    // --- NOTICE BOARD FUNCTIONS ---
    const fetchNotices = async () => {
        try {
            const noticesRef = collection(db, "notices");
            const noticesSnapshot = await getDocs(noticesRef);
            const noticesList = noticesSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })).sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : a.createdAt;
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : b.createdAt;
                return new Date(dateB) - new Date(dateA);
            });
            setPublishedNotices(noticesList);
        } catch (error) {
            console.error("Error fetching notices:", error);
        }
    };

    const publishNotice = async () => {
        console.log('[publishNotice] Starting...', { noticePDF, noticeTitle, noticeContent });

        if (!noticeTitle.trim() || !noticeContent.trim()) {
            showToast("Please fill in all fields", "error");
            return;
        }

        setIsPublishingNotice(true);
        try {
            const noticesRef = collection(db, "notices");

            let imageUrl = null;
            let cloudMeta = null;

            // If noticePDF is a File (selected but not uploaded), validate size and convert first page to image
            if (noticePDF && noticePDF instanceof File) {
                if (noticePDF.size > 5 * 1024 * 1024) {
                    const fileInput = document.getElementById('notice-pdf-input');
                    if (fileInput) fileInput.value = '';
                    setNoticePDF(null);
                    showToast('PDF exceeds 5MB limit. Please select a smaller file.', 'error');
                    throw new Error('PDF exceeds 5MB limit');
                }

                console.log('[publishNotice] PDF selected, converting...', { fileName: noticePDF.name, size: noticePDF.size });
                showToast('Converting PDF to image...', 'info');

                try {
                    const imageBlob = await convertPdfToImageBlob_Admin(noticePDF, { mimeType: 'image/png' });
                    console.log('[publishNotice] PDF converted to blob', { blobSize: imageBlob?.size, blobType: imageBlob?.type });

                    if (!imageBlob) {
                        throw new Error('PDF conversion returned null blob');
                    }

                    showToast('Uploading high-quality image to Cloudinary...', 'info');
                    console.log('[publishNotice] Uploading blob to Cloudinary...');

                    const uploadRes = await cloudinaryService.uploadFile(imageBlob, 'notices', (p) => {
                        console.log(`[publishNotice] Upload progress: ${p}%`);
                        setUploadProgress(p);
                    });

                    console.log('[publishNotice] Cloudinary upload response:', uploadRes);

                    if (!uploadRes?.url) {
                        throw new Error('Cloudinary upload returned no URL');
                    }

                    imageUrl = uploadRes.url;
                    cloudMeta = { publicId: uploadRes.publicId, folder: 'notices' };
                    setUploadProgress(0);
                    showToast('Image uploaded to Cloudinary ✅', 'success');
                } catch (err) {
                    console.error('[publishNotice] PDF/Cloudinary error:', err);
                    showToast(`PDF/Upload error: ${err.message}`, 'error');
                    throw err;
                }
            } else {
                console.log('[publishNotice] No PDF selected (optional)');
            }

            const newNotice = {
                title: noticeTitle.trim(),
                content: noticeContent.trim(),
                priority: noticePriority,
                imageUrl: imageUrl,
                cloudinary: cloudMeta,
                createdAt: new Date(),
                publishedBy: user.email,
                status: 'active'
            };

            console.log('[publishNotice] Saving to Firestore:', newNotice);

            const docRef = await addDoc(noticesRef, newNotice);
            console.log('[publishNotice] Firestore doc created:', docRef.id);

            setNoticeTitle('');
            setNoticeContent('');
            setNoticePriority('normal');
            setNoticePDF(null);

            const fileInput = document.getElementById('notice-pdf-input');
            if (fileInput) fileInput.value = '';

            await fetchNotices();

            showToast('Notice published successfully!', 'success');
        } catch (error) {
            console.error('[publishNotice] Fatal error:', error);
            showToast(`Failed: ${error.message}`, 'error');
        } finally {
            setIsPublishingNotice(false);
        }
    };

    const deleteNotice = (noticeId) => {
        setDeleteConfirm({ action: 'deleteNotice', noticeId, label: 'this notice' });
    };

    const handleNoticePDFChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf') {
            showToast('Only PDF files are allowed', 'error');
            e.target.value = '';
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            showToast('PDF file size must be less than or equal to 5MB', 'error');
            e.target.value = '';
            return;
        }

        // Store selected PDF file locally; conversion & upload happen on Publish
        setNoticePDF(file);
        showToast('PDF selected. Click Convert & Publish to upload to Cloudinary.', 'info');
    };

    const convertPdfToImageBlob_Admin = async (file, { mimeType = 'image/png' } = {}) => {
        try {
            console.log('[convertPdfToImageBlob_Admin] Starting conversion...', { fileName: file.name, mimeType });

            const arrayBuffer = await file.arrayBuffer();
            console.log('[convertPdfToImageBlob_Admin] arrayBuffer created', { size: arrayBuffer.byteLength });

            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            console.log('[convertPdfToImageBlob_Admin] PDF loading task started');

            const pdf = await loadingTask.promise;
            console.log('[convertPdfToImageBlob_Admin] PDF loaded', { numPages: pdf.numPages });

            const page = await pdf.getPage(1);
            console.log('[convertPdfToImageBlob_Admin] First page loaded');

            const unscaledViewport = page.getViewport({ scale: 1 });
            const maxSide = Math.max(unscaledViewport.width, unscaledViewport.height);
            const targetSide = 4096;
            const effectiveScale = maxSide >= targetSide ? 1 : targetSide / maxSide;
            const scale = Math.min(Math.max(effectiveScale, 1), 10);
            const viewport = page.getViewport({ scale });
            console.log('[convertPdfToImageBlob_Admin] Viewport created', { width: viewport.width, height: viewport.height, scale });

            const canvas = document.createElement('canvas');
            canvas.width = Math.floor(viewport.width);
            canvas.height = Math.floor(viewport.height);
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            console.log('[convertPdfToImageBlob_Admin] Canvas created', { canvasWidth: canvas.width, canvasHeight: canvas.height });

            await page.render({ canvasContext: ctx, viewport }).promise;
            console.log('[convertPdfToImageBlob_Admin] Page rendered to canvas');

            return new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (blob) {
                        console.log('[convertPdfToImageBlob_Admin] Blob created successfully', { blobSize: blob.size, blobType: blob.type });
                        resolve(blob);
                    } else {
                        console.error('[convertPdfToImageBlob_Admin] Blob creation failed - returned null');
                        reject(new Error('Canvas conversion failed'));
                    }
                }, mimeType);
            });
        } catch (err) {
            console.error('[convertPdfToImageBlob_Admin] Conversion error:', err);
            throw err;
        }
    };

    const testCloudinaryConnectivity = async () => {
        try {
            showToast('Testing Cloudinary connectivity...', 'info');
            // Use the Cloudinary base URL to test reachability
            const cloudName = (await import('../../config/cloudinaryConfig')).CLOUDINARY_CONFIG.cloudName;
            const testUrl = `https://res.cloudinary.com/${cloudName}/image/upload/`;
            const res = await fetch(testUrl, { method: 'GET' });
            if (!res.ok && res.type !== 'opaque') {
                console.error('Cloudinary connectivity unexpected response:', res.status);
                showToast(`Cloudinary connectivity failed: HTTP ${res.status}`, 'error');
                return false;
            }
            showToast('Cloudinary reachable ✅', 'success');
            return true;
        } catch (err) {
            console.error('Cloudinary connectivity test exception:', err);
            showToast('Cloudinary connectivity test failed: Network/CORS', 'error');
            return false;
        }
    };


    const generateAdminPDF = () => {
        const filteredStudents = allPaidStudents.filter(st => adminFilterPart === 'All' || st.part === adminFilterPart);

        if (filteredStudents.length === 0) {
            showToast("No students to generate PDF", "error");
            return;
        }

        const doc = new jsPDF('l', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Header
        doc.setFontSize(16);
        doc.setTextColor(0, 77, 0);
        doc.text('GECE Mithi - Verified Student List', pageWidth / 2, 15, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Part: ${adminFilterPart}`, pageWidth / 2, 22, { align: 'center' });
        doc.text(`Total Students: ${filteredStudents.length}`, pageWidth / 2, 28, { align: 'center' });

        // Table
        const tableData = filteredStudents.map(st => [
            st.cnic,
            st.fullName,
            st.fatherName,
            st.part,
            st.amount,
            st.date || 'N/A'
        ]);

        autoTable(doc, {
            startY: 35,
            head: [['CNIC', 'Name', 'Father Name', 'Part', 'Amount', 'Date']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 77, 0],
                textColor: 255,
                fontSize: 9
            },
            bodyStyles: {
                fontSize: 8,
                textColor: 50
            },
            styles: {
                cellPadding: 3
            }
        });

        doc.save(`Verified_List_${adminFilterPart}_${new Date().toISOString().split('T')[0]}.pdf`);
        showToast("PDF downloaded successfully", "success");
    };

    const convertPDFToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const result = reader.result;
                    if (result && result.includes('base64')) {
                        resolve(result);
                    } else {
                        reject(new Error('Failed to convert PDF to base64'));
                    }
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const handleStudentPasswordReset = async () => {
        const targetEmail = studentForm.email && studentForm.email.includes('@') ? studentForm.email : user.email;
        if (window.confirm(`Send password reset link to ${targetEmail}?`)) {
            setLoading(true);
            try {
                await sendPasswordResetEmail(auth, targetEmail);
                showToast(`Reset link sent to ${targetEmail}.`, "success");
            } catch (error) {
                console.error("Reset Error", error);
                showToast(error.message, "error");
            } finally {
                setLoading(false);
            }
        }
    };

    const TopLoaderBar = () => (<div className="fixed top-0 left-0 w-full h-1 bg-blue-200 z-50 overflow-hidden"> <div className="h-full bg-yellow-400 animate-pulse w-full origin-left-right scale-x-50"></div> <style>{` @keyframes loading-bar { 0% { transform: translateX(-100%); } 50% { transform: translateX(50%); } 100% { transform: translateX(200%); } } .origin-left-right { animation: loading-bar 1.5s infinite linear; } `}</style> </div>);
    const ToastPopup = () => (notification.show && (<div className={`fixed bottom-5 right-5 z-50 px-6 py-4 rounded-lg shadow-xl text-white font-bold transform transition-all duration-300 ease-in-out flex items-center gap-3 animate-bounce ${notification.type === 'success' ? 'bg-green-600' : 'bg-green-700'}`}> {notification.type === 'success' ? <Icons.Check /> : <Icons.Alert />} {notification.message} </div>));

    // ==========================================
    // 1. LOGIN RENDER
    // ==========================================
    if (!user) return (
        <>
            {isGlobalLoading && <TopLoaderBar />}
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-xl border-4 border-white w-full max-w-md sm:max-w-lg overflow-hidden">
                    <div className="bg-[#004d00] p-4 sm:p-6 text-center flex flex-col items-center">
                        {/* Styled Login Logo with Yellow Ring */}
                        <div className="bg-white p-1.5 rounded-full shadow-md w-20 h-20 flex items-center justify-center mb-4 border-[3px] border-[#ffd200]">
                            <img src="/logo1.png" alt="Logo" className="h-[90%] w-[90%] object-contain" />
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold text-white tracking-widest uppercase">GOVT. ELEMENTARY COLLEGE</h1>
                        <h2 className="text-xs sm:text-sm font-bold text-[#ffd200] tracking-wider">OF EDUCATION (M/W) MITHI</h2>
                        <p className="text-gray-200 text-[9px] sm:text-[10px] mt-1">Education & Literacy Dept, Govt. of Sindh</p>
                    </div>
                    <div className="p-6 sm:p-10">
                        <form onSubmit={handleAuth} className="space-y-4 sm:space-y-6">
                            <div><label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wide">CNIC / Admin Email / Email</label><input type="text" className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-none bg-gray-50 text-sm" placeholder="e.g. 44303... or admin@gece.com or email@gmail.com" value={authInput.cnic} onChange={(e) => setAuthInput({ ...authInput, cnic: e.target.value })} required /></div>
                            <div><label className="block text-gray-500 text-xs font-bold mb-2 uppercase tracking-wide">Password</label><input type="password" className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#004d00] focus:border-transparent outline-none bg-gray-50 text-sm" placeholder="••••••••" value={authInput.password} onChange={(e) => setAuthInput({ ...authInput, password: e.target.value })} required /></div>
                            {errorMsg && <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded border border-red-200 text-center">{errorMsg}</div>}
                            <button type="submit" className="w-full bg-[#004d00] hover:bg-[#003800] text-white font-bold py-2.5 sm:py-3.5 rounded-md shadow-md transition-all uppercase tracking-wide text-xs sm:text-sm flex justify-center items-center"> {isAuthLoading ? <Icons.Spinner /> : "Sign In"} </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );

    // ==========================================
    // 2. ADMIN PANEL RENDER
    // ==========================================
    if (isAdmin) return (
        <>
            {isGlobalLoading && <TopLoaderBar />}
            <ToastPopup />

            <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-700 flex flex-col">
                <main className="p-4 sm:p-8 max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6">

                    {/* --- STYLED ADMIN SIDEBAR NAVIGATION --- */}
                    <div className="w-full lg:w-[280px] bg-[#004d00] rounded-xl shadow-2xl overflow-hidden flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
                        {/* Profile / Title Section */}
                        <div className="p-6 flex flex-col items-center justify-center border-b border-[#006400]">
                            {/* Styled Admin Logo with Yellow Ring */}
                            <div className="bg-white p-1 rounded-full mb-3 shadow-md w-20 h-20 flex items-center justify-center border-[3px] border-[#ffd200]">
                                <img src="/logo1.png" alt="Logo" className="h-[90%] w-[90%] object-contain" />
                            </div>
                            {activeTab !== 'contentManager' && (
                                <>
                                    <h2 className="text-white font-extrabold tracking-wider text-lg mt-1">ADMIN PANEL</h2>
                                    <p className="text-[#00ff80] text-xs font-bold tracking-widest mt-1">GECE MITHI</p>
                                </>
                            )}
                        </div>

                        {/* Buttons Section */}
                        <nav className="p-4 space-y-3">
                            {/* Main Admin Section */}
                            <p className="text-xs font-bold text-[#ffd200] uppercase tracking-wider px-4">Admin</p>

                                {[
                                    { id: 'dashboard', label: 'ALL STUDENTS', icon: Icons.Dashboard },
                                    { id: 'verifiedList', label: 'VERIFIED LIST', icon: Icons.List },
                                    { id: 'noticeBoard', label: 'NOTICE BOARD', icon: Icons.Bell },
                                    { id: 'successStories', label: 'SUCCESS STORIES', icon: Icons.Trophy },
                                    { id: 'contentManager', label: 'STAFF MANAGER', icon: Icons.Users },
                                    { id: 'resourceManagement', label: 'RESOURCE MANAGEMENT', icon: Icons.Database },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveTab(item.id)}
                                        className={`w-full flex items-center px-4 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                                            ${activeTab === item.id
                                                ? item.id === 'contentManager'
                                                    ? 'bg-[#ffeb3b] text-black border-3 border-[#f57c00] shadow-lg'
                                                    : 'bg-[#ffd200] text-[#004d00] border-2 border-[#FFD700]'
                                                : 'bg-[#003b00] text-white border border-[#005a00] hover:bg-[#002a00] hover:border-[#004d00]'
                                            }`}
                                    >
                                        <item.icon className="w-5 h-5 mr-3" />
                                        {item.label}
                                    </button>
                                ))}

                            {/* Divider */}
                            <div className="border-t border-[#006400] my-2"></div>
                        </nav>

                        {/* --- LOGOUT BUTTON AT BOTTOM --- */}
                        <div className="p-4 border-t border-[#006400] mt-auto">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-[#ffd200] hover:bg-yellow-500 text-[#004d00] font-bold text-sm uppercase tracking-wide transition-colors shadow-md"
                            >
                                <Icons.Logout className="w-5 h-5 mr-2" /> LOGOUT
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 w-full overflow-x-auto bg-white rounded-xl border-4 border-[#FFD700] shadow-xl p-4">
                        {/* --- ADMIN CONTENT SECTIONS --- */}

                        {/* 1. DASHBOARD / ALL STUDENTS */}
                        {activeTab === 'dashboard' && (
                            <div className="space-y-6 animate-fade-in w-full">
                                <div className="bg-white p-6 rounded-lg shadow-xl border-4 border-[#FFD700] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                                    <form onSubmit={handleAdminSearch} className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="Search by Student CNIC..."
                                            className="flex-1 p-3 border rounded focus:ring-2 focus:ring-[#004d00] outline-none"
                                            value={adminSearchCnic}
                                            onChange={(e) => setAdminSearchCnic(e.target.value)}
                                        />
                                        <button type="submit" className="bg-[#004d00] text-white px-6 py-3 rounded font-bold shadow-md hover:bg-[#003800] transition-colors flex items-center gap-2 border-2 border-[#ffd200]">
                                            <Icons.Search /> Search
                                        </button>
                                    </form>
                                </div>

                                {!searchedStudent && (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-white p-6 rounded-lg shadow-xl border-4 border-[#FFD700] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                                                <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Pending Verifications</h3>
                                                <p className="text-3xl font-extrabold text-orange-600">{pendingChallans.length}</p>
                                            </div>
                                            <div className="bg-white p-6 rounded-lg shadow-xl border-4 border-[#FFD700] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                                                <h3 className="text-gray-500 font-bold uppercase text-xs mb-2">Verified Challans</h3>
                                                <p className="text-3xl font-extrabold text-green-600">{allPaidStudents.length}</p>
                                            </div>
                                        </div>

                                        {pendingChallans.length > 0 && (
                                            <div className="bg-white rounded-lg shadow-xl border-4 border-[#FFD700] hover:shadow-2xl hover:scale-[1.02] transition-all duration-300">
                                                <div className="p-4 bg-orange-50 border-b border-orange-100"><h3 className="font-bold text-orange-800">Requires Verification</h3></div>
                                                <div className="p-4 overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-gray-50">
                                                            <tr>
                                                                <th className="py-2 px-3">Student Name</th>
                                                                <th className="py-2 px-3">CNIC</th>
                                                                <th className="py-2 px-3">Amount</th>
                                                                <th className="py-2 px-3">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {pendingChallans.map((p, idx) => (
                                                                <tr key={idx} className="border-b">
                                                                    <td className="py-2 px-3 font-bold">{p.name}</td>
                                                                    <td className="py-2 px-3 text-xs">{p.studentCnic}</td>
                                                                    <td className="py-2 px-3 font-bold text-[#004d00]">Rs.{p.amount}</td>
                                                                    <td className="py-2 px-3 flex gap-2">
                                                                        <button onClick={() => { setAdminSearchCnic(p.studentCnic); handleAdminSearch({ preventDefault: () => { } }); }} className="text-xs bg-[#004d00] text-white px-3 py-1 rounded border border-[#ffd200]">View Profile</button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {searchedStudent && (
                                    <div className="bg-white rounded-lg shadow-xl border-4 border-[#FFD700] overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                        <div className="p-6 border-b border-gray-200 flex justify-between items-start bg-gray-50">
                                            <div>
                                                <h3 className="text-2xl font-bold text-[#004d00] uppercase">{searchedStudent.personalInfo?.fullName || "Name Not Set"}</h3>
                                                <p className="text-gray-500 font-mono mt-1">CNIC: {searchedStudent.cnic}</p>
                                                <p className="text-sm text-gray-600 mt-2"><strong>Father:</strong> {searchedStudent.personalInfo?.fatherName || "N/A"} | <strong>Batch:</strong> {searchedStudent.challans?.[0]?.batch || "N/A"}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={openResetModal} className="bg-orange-100 text-orange-700 px-4 py-2 rounded text-xs font-bold hover:bg-orange-200 transition flex items-center justify-center gap-2"><Icons.Key /> Reset Password</button>
                                                <button onClick={() => handleDeleteAccount(searchedStudent.cnic)} className="bg-red-100 text-red-700 px-4 py-2 rounded text-xs font-bold hover:bg-red-200 transition flex items-center justify-center gap-2"><Icons.Close /> Delete Account</button>
                                            </div>
                                        </div>

                                        <div className="p-6">
                                            <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">Challan Records</h4>
                                            {(!searchedStudent.challans || searchedStudent.challans.length === 0) ? (
                                                <p className="text-gray-500 text-sm">No challan records found for this student.</p>
                                            ) : (
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="bg-[#004d00] text-white">
                                                            <tr>
                                                                <th className="py-3 px-4 rounded-tl-lg">Challan No</th>
                                                                <th className="py-3 px-4">Details</th>
                                                                <th className="py-3 px-4">Amount</th>
                                                                <th className="py-3 px-4">Receipt</th>
                                                                <th className="py-3 px-4">Status</th>
                                                                <th className="py-3 px-4 rounded-tr-lg text-right">Actions</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-100">
                                                            {searchedStudent.challans.map((ch) => (
                                                                <tr key={ch.id} className="hover:bg-gray-50">
                                                                    <td className="py-3 px-4 font-mono text-xs">{ch.challanNo}</td>
                                                                    <td className="py-3 px-4 font-bold">Part {ch.part} <span className="text-xs text-gray-500 block font-normal">{ch.batch} - {ch.statusType}</span></td>
                                                                    <td className="py-3 px-4 font-bold text-[#004d00]">Rs.{ch.amount}</td>
                                                                    <td className="py-3 px-4">
                                                                        {ch.receiptImageUrl ? (
                                                                            <button onClick={() => handleViewReceipt(ch.receiptImageUrl)} className="text-blue-600 hover:underline flex items-center gap-1 text-xs font-bold"><Icons.View /> View</button>
                                                                        ) : <span className="text-gray-400 text-xs">No Receipt</span>}
                                                                    </td>
                                                                    <td className="py-3 px-4">
                                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide ${ch.status === 'Verified' ? 'bg-green-100 text-green-700' : ch.status === 'Pending Verification' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>{ch.status}</span>
                                                                    </td>
                                                                    <td className="py-3 px-4 text-right">
                                                                        <div className="flex justify-end gap-2">
                                                                            {ch.status !== 'Verified' && ch.receiptImageUrl && (
                                                                                <button onClick={() => handleAdminAction(searchedStudent.cnic, ch.id, 'Verified')} className="bg-[#004d00] text-white p-1.5 rounded hover:bg-[#003800] border border-[#ffd200]" title="Verify Payment"><Icons.Check /></button>
                                                                            )}
                                                                            <button onClick={() => openEditModal(ch, searchedStudent.cnic)} className="bg-[#004d00] text-white p-1.5 rounded hover:bg-[#003800] border border-[#ffd200]" title="Edit Record"><Icons.Edit /></button>
                                                                            <button onClick={() => handleDeleteChallan(searchedStudent.cnic, ch.id)} className="bg-[#004d00] text-white p-1.5 rounded hover:bg-[#003800] border border-[#ffd200]" title="Delete Challan"><Icons.Close /></button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 2. VERIFIED LIST */}
                        {activeTab === 'verifiedList' && (
                            <div className="bg-white rounded-lg shadow-xl border-4 border-[#FFD700] overflow-hidden animate-fade-in w-full hover:shadow-2xl hover:scale-[1.01] transition-all duration-300">
                                <div className="bg-[#004d00] px-6 py-4 flex justify-between items-center border-b border-[#ffd200]">
                                    <div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Verified List</h3>
                                        <p className="text-[10px] text-[#ffd200] mt-1">Students with paid and verified challans</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <select
                                            value={adminFilterPart}
                                            onChange={(e) => setAdminFilterPart(e.target.value)}
                                            className="bg-transparent text-white px-3 py-1.5 rounded text-xs font-bold outline-none border-2 border-[#ffd200] cursor-pointer"
                                        >
                                            <option value="All" className="text-black bg-white">All Parts</option>
                                            <option value="I" className="text-black bg-white">Part I</option>
                                            <option value="II" className="text-black bg-white">Part II</option>
                                            <option value="III" className="text-black bg-white">Part III</option>
                                            <option value="IV" className="text-black bg-white">Part IV</option>
                                        </select>
                                        <button onClick={generateAdminPDF} className="bg-[#ffd200] text-[#004d00] hover:bg-yellow-500 px-4 py-1.5 rounded font-bold shadow transition-colors text-xs flex items-center gap-2 uppercase tracking-wide"><Icons.Download /> Download PDF</button>
                                    </div>
                                </div>
                                <div className="p-0 overflow-x-auto w-full">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                                            <tr>
                                                <th className="py-3 px-4">CNIC</th>
                                                <th className="py-3 px-4">Name</th>
                                                <th className="py-3 px-4">Father Name</th>
                                                <th className="py-3 px-4">Part</th>
                                                <th className="py-3 px-4">Amount</th>
                                                <th className="py-3 px-4">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {allPaidStudents.filter(st => adminFilterPart === 'All' || st.part === adminFilterPart).length === 0 ? (
                                                <tr><td colSpan="6" className="p-8 text-center text-gray-400 font-medium">No verified students found for this category.</td></tr>
                                            ) : (
                                                allPaidStudents.filter(st => adminFilterPart === 'All' || st.part === adminFilterPart).map((st, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="py-3 px-4 font-mono text-xs">{st.studentCnic}</td>
                                                        <td className="py-3 px-4 font-bold text-gray-800 uppercase">{st.name}</td>
                                                        <td className="py-3 px-4 text-gray-600 uppercase">{st.fname}</td>
                                                        <td className="py-3 px-4 font-bold">Part {st.part} <span className="text-xs text-gray-400 font-normal">({st.batch})</span></td>
                                                        <td className="py-3 px-4 text-[#004d00] font-bold">Rs.{st.amount}</td>
                                                        <td className="py-3 px-4 text-xs">{st.date}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* 3. NOTICE BOARD */}
                        {activeTab === 'noticeBoard' && (
                            <div className="space-y-6 animate-fade-in w-full">
                                <div className="bg-white rounded-lg border-4 border-[#FFD700] shadow-xl overflow-hidden">
                                    <div className="bg-[#004d00] px-6 py-4 border-b border-[#ffd200]">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Notice Board Management</h3>
                                        <p className="text-[10px] text-[#ffd200] mt-1">Update and manage college notices</p>
                                    </div>
                                    <div className="p-6 space-y-6">
                                        <div>
                                            <label className="block text-[10px] font-bold text-[#004d00] uppercase mb-2">Notice Title</label>
                                            <input
                                                type="text"
                                                value={noticeTitle}
                                                onChange={(e) => setNoticeTitle(e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-[#ffd200] rounded-lg focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                                                placeholder="Enter notice title..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-[#004d00] uppercase mb-2">Notice Content</label>
                                            <textarea
                                                value={noticeContent}
                                                onChange={(e) => setNoticeContent(e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-[#ffd200] rounded-lg focus:ring-2 focus:ring-[#004d00] focus:border-transparent h-32"
                                                placeholder="Enter notice content..."
                                            ></textarea>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-[#004d00] uppercase mb-2">Priority</label>
                                            <select
                                                value={noticePriority}
                                                onChange={(e) => setNoticePriority(e.target.value)}
                                                className="w-full px-4 py-3 border-2 border-[#ffd200] rounded-lg focus:ring-2 focus:ring-[#004d00] focus:border-transparent"
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="important">Important</option>
                                                <option value="urgent">Urgent</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-[10px] font-bold text-[#004d00] uppercase mb-2">
                                                PDF Document (Optional)
                                            </label>

                                            {/* PDF Upload Box (Yellow Border) */}
                                            <div className="border-2 border-[#ffd200] rounded-lg p-4 flex justify-center items-center">
                                                <input
                                                    id="notice-pdf-input"
                                                    type="file"
                                                    accept=".pdf"
                                                    onChange={handleNoticePDFChange}
                                                    className="hidden"
                                                />
                                                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full text-center">
                                                    <label
                                                        htmlFor="notice-pdf-input"
                                                        className="px-4 py-2 font-bold bg-[#0f6f2f] rounded border-2 border-[#ffd200] text-white cursor-pointer shadow-sm hover:bg-[#0d5e28] transition-all sm:border sm:border-yellow-400 whitespace-nowrap"
                                                    >
                                                        Upload PDF
                                                    </label>
                                                    <span className="text-sm text-gray-600 truncate max-w-xs">
                                                        {noticePDF ? (noticePDF.name || noticePDF) : 'No file chosen'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Convert & Publish Button (Outside and Centered) */}
                                            <div className="flex justify-center mt-6">
                                                <button
                                                    onClick={publishNotice}
                                                    disabled={isPublishingNotice}
                                                    className={`px-6 py-2 rounded text-white font-bold transition-colors ${isPublishingNotice ? 'bg-gray-400' : 'bg-green-700 hover:bg-green-800'
                                                        }`}
                                                >
                                                    {isPublishingNotice ? 'Publishing...' : 'Add Notice'}
                                                </button>
                                            </div>
                                        </div>
                                        {noticePDF && (
                                            <div className="mt-2 flex items-center justify-between">
                                                <span className="text-xs text-green-600">✓ PDF Selected</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setNoticePDF(null);
                                                        const fileInput = document.getElementById('notice-pdf-input');
                                                        if (fileInput) fileInput.value = '';
                                                    }}
                                                    className="text-xs text-red-600 hover:text-red-800"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg border-4 border-[#FFD700] shadow-xl overflow-hidden">
                                    <div className="bg-[#004d00] px-6 py-4 border-b border-[#ffd200]">
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Published Notices</h3>
                                        <p className="text-[10px] text-[#ffd200] mt-1">View and manage existing notices</p>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4">
                                            {publishedNotices.length === 0 ? (
                                                <div className="text-center py-8 text-gray-400">
                                                    <Icons.Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                                    <p className="text-sm">No notices published yet</p>
                                                </div>
                                            ) : (
                                                publishedNotices.map((notice) => (
                                                    <div key={notice.id} className="p-4 border-2 border-[#ffd200] rounded-lg bg-[#f8f9fa]">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h4 className="font-bold text-[#004d00]">{notice.title}</h4>
                                                            <span className={`px-2 py-1 rounded text-xs font-bold ${notice.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                                                notice.priority === 'important' ? 'bg-[#ffd200] text-[#004d00]' :
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {(notice.priority || 'normal').charAt(0).toUpperCase() + (notice.priority || 'normal').slice(1)}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">{notice.content}</p>

                                                        {(notice.pdfUrl || notice.pdfData) && (
                                                            <div className="mb-2 p-2 bg-white rounded border border-[#ffd200]">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <Icons.Download className="w-4 h-4 mr-2 text-[#004d00]" />
                                                                        <span className="text-xs text-gray-600">
                                                                            PDF: {notice.pdfFileName || 'Notice PDF'}
                                                                        </span>
                                                                    </div>
                                                                    <a
                                                                        href={notice.pdfUrl || notice.pdfData}
                                                                        download={notice.pdfFileName || 'notice.pdf'}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-[#004d00] hover:text-[#003800] text-xs font-bold underline"
                                                                    >
                                                                        Download PDF
                                                                    </a>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-400">
                                                                Published: {notice.createdAt?.toDate?.() ?
                                                                    new Date(notice.createdAt.toDate()).toLocaleDateString() :
                                                                    new Date(notice.createdAt?.toMillis?.() || notice.createdAt).toLocaleDateString()
                                                                }
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <button
                                                                    onClick={() => deleteNotice(notice.id)}
                                                                    disabled={isDeletingNotice}
                                                                    className="text-red-600 hover:underline text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {isDeletingNotice ? 'Deleting...' : 'Delete'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. SUCCESS STORIES MANAGER */}
                        {activeTab === 'successStories' && (
                            <div className="animate-fade-in w-full">
                                <SuccessStoriesManagement />
                            </div>
                        )}

                        {/* 5. CONTENT MANAGER */}
                        {activeTab === 'contentManager' && (
                            <div className="animate-fade-in w-full">
                                <DynamicContentManager />
                            </div>
                        )}

                        {/* 6. RESOURCE MANAGEMENT */}
                        {activeTab === 'resourceManagement' && (
                            <div className="animate-fade-in w-full">
                                <ResourceManagement />
                            </div>
                        )}

                    </div >
                </main >

                {/* --- ADMIN MODALS --- */}
                {
                    deleteConfirm && (
                        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border-2 border-[#ffd200]">
                                <div className="text-center">
                                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
                                    <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete <span className="font-bold text-red-600">{deleteConfirm.label}</span>? This action cannot be undone.</p>
                                    <div className="flex gap-3 justify-center">
                                        <button
                                            onClick={cancelDelete}
                                            className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-sm transition-colors border border-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors border border-[#ffd200]"
                                        >
                                            Confirm Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {showEditModal && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl border-4 border-[#FFD700] w-full max-w-sm hover:shadow-2xl transition-all duration-300"><div className="p-5 border-b border-gray-100"><h3 className="font-bold text-gray-800">Edit Record</h3></div><form onSubmit={handleEditSubmit} className="p-5 space-y-4"><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Part</label><select value={editForm.part} onChange={(e) => setEditForm({ ...editForm, part: e.target.value })} className="w-full border p-2 rounded text-sm"><option value="I">Part I</option><option value="II">Part II</option><option value="III">Part III</option><option value="IV">Part IV</option></select></div><div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label><select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full border p-2 rounded text-sm"><option value="Verified">Verified</option><option value="Not Verified">Not Verified</option><option value="Pending Verification">Pending Verification</option></select></div><div className="flex justify-end gap-2 pt-2"><button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded">CANCEL</button><button type="submit" className="px-4 py-2 bg-[#1a4d0f] text-white text-xs font-bold hover:bg-[#12360a] rounded shadow-sm">SAVE</button></div></form></div></div>}
                {showReceiptModal && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-lg shadow-xl border-4 border-[#FFD700] max-w-2xl w-full h-[80vh] flex flex-col hover:shadow-2xl transition-all duration-300"><div className="p-3 border-b flex justify-between items-center"><h3 className="font-bold text-sm text-gray-600 uppercase">Receipt Proof</h3><button onClick={() => setShowReceiptModal(false)} className="text-gray-400 hover:text-red-500"><Icons.Close /></button></div><div className="flex-1 bg-black/5 p-4 flex justify-center items-center overflow-auto"><img src={receiptUrl} alt="Receipt" className="max-h-full object-contain shadow" /></div></div></div>}
                {
                    showResetModal && (
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                            <div className="bg-white rounded-lg shadow-xl border-4 border-[#FFD700] w-full max-w-sm hover:shadow-2xl transition-all duration-300">
                                <div className="p-5 border-b border-gray-100 bg-red-50 rounded-t-lg">
                                    <h3 className="font-bold text-red-700 uppercase flex items-center gap-2"><Icons.Key /> Force Reset Password</h3>
                                </div>
                                <form onSubmit={handleHardResetPassword} className="p-5 space-y-4">
                                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 text-xs text-yellow-800 font-medium">
                                        Warning: This will overwrite the user's password. Make sure you have deleted the user from Firebase Auth Console first.
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                                        <input type="text" value={resetPasswordInput} onChange={(e) => setResetPasswordInput(e.target.value)} className="w-full border p-2 rounded text-sm" placeholder="Enter new password" required minLength="6" />
                                    </div>
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button type="button" onClick={() => setShowResetModal(false)} className="px-4 py-2 text-gray-500 text-xs font-bold hover:bg-gray-100 rounded">CANCEL</button>
                                        <button type="submit" className="px-4 py-2 bg-red-600 text-white text-xs font-bold hover:bg-red-700 rounded shadow-sm">RESET NOW</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div >
        </>
    );

    // ==========================================
    // 3. STUDENT DASHBOARD RENDER
    // ==========================================
    return (
        <>
            {isGlobalLoading && <TopLoaderBar />}
            <ToastPopup />
            <div className="flex flex-col lg:flex-row h-screen bg-[#f8fafc] font-sans text-gray-800">
                {/* Mobile Menu Toggle */}
                <div className="lg:hidden bg-[#004d00] p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {/* Styled Mobile Logo */}
                        <div className="bg-white p-0.5 rounded-full shadow-sm w-10 h-10 flex items-center justify-center border-[2px] border-[#ffd200]">
                            <img src="/logo1.png" alt="College Logo" className="h-[90%] w-[90%] object-contain" />
                        </div>
                        <span className="text-white text-xs font-bold">Student Portal</span>
                    </div>
                    <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white p-2">
                        <Icons.Menu />
                    </button>
                </div>

                {/* Sidebar */}
                <aside className={`${mobileMenuOpen ? 'flex' : 'hidden'} lg:flex w-full lg:w-64 bg-[#004d00] text-white flex-col shadow-2xl fixed lg:sticky top-0 lg:top-auto h-screen z-40`}>
                    <div className="h-20 lg:h-32 flex items-center justify-center border-b border-green-800 bg-[#004d00] px-4">
                        {/* --- SIDEBAR HEADER --- */}
                        <div className="flex flex-col items-center">
                            {/* Styled Student Sidebar Logo */}
                            <div className="bg-white p-1 rounded-full shadow-sm w-12 h-12 lg:w-16 lg:h-16 flex items-center justify-center mb-2 border-[3px] border-[#ffd200]">
                                <img src="/logo1.png" alt="College Logo" className="h-[90%] w-[90%] object-contain" />
                            </div>
                            <h1 className="text-[8px] lg:text-[10px] font-extrabold text-white leading-tight tracking-wider text-center">GOVT. ELEMENTARY COLLEGE</h1>
                            <h2 className="text-[6px] lg:text-[8px] font-bold text-[#ffd200] leading-tight tracking-wider text-center">OF EDUCATION (M/W) MITHI</h2>
                        </div>
                    </div>
                    <div className="p-4 lg:p-6">
                        <div className="flex items-center gap-2 lg:gap-3 mb-6 lg:mb-8 p-2 lg:p-3 bg-green-900/50 rounded-lg border border-green-800">
                            <div className="w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-white text-[#004d00] flex items-center justify-center text-[10px] lg:text-xs font-bold overflow-hidden border-2 border-[#ffd200]">
                                {studentForm.profileImage ? <img src={studentForm.profileImage} className="w-full h-full object-cover" /> : studentForm.fullName?.charAt(0) || 'U'}
                            </div>
                            <div className="overflow-hidden"><h4 className="text-[10px] lg:text-xs font-bold truncate text-white uppercase">{studentForm.fullName || 'Student'}</h4><p className="text-[8px] lg:text-[10px] text-[#ffd200] truncate">{user.email.split('@')[0]}</p></div>
                        </div>
                        <nav className="space-y-1">
                            {[
                                { id: 'dashboard', label: 'Dashboard', icon: Icons.Dashboard },
                                { id: 'profile', label: 'My Profile', icon: Icons.Profile },
                                { id: 'generator', label: 'Exam Challan', icon: Icons.Exam },
                            ].map((item) => (
                                <button key={item.id} onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }} className={`w-full flex items-center px-3 lg:px-4 py-2 lg:py-3 rounded-lg transition-all duration-200 ${activeTab === item.id ? 'bg-[#ffd200] text-[#004d00] shadow-md font-bold border-2 border-[#ffd200] rounded-lg' : 'bg-transparent text-white hover:bg-[#003b00] border-2 border-transparent font-medium'}`}>
                                    <item.icon className="w-3 h-3 lg:w-4 lg:h-4 mr-2 lg:mr-3" /> <span className="text-[10px] lg:text-xs tracking-wide uppercase">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="mt-auto p-6 border-t border-[#006400]">
                        <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-[#ffd200] text-[#004d00] hover:bg-yellow-500 font-bold text-xs uppercase tracking-wide"><Icons.Logout className="mr-2" /> LOGOUT</button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                    <header className="h-14 sm:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20 shadow-sm">
                        <h2 className="text-sm sm:text-lg font-bold text-[#004d00] uppercase tracking-wide">{activeTab === 'dashboard' ? 'Overview' : activeTab === 'profile' ? 'Profile' : 'Fee Section'}</h2>
                        <div className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase tracking-wider hidden sm:block">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </header>

                    <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-8 space-y-4 sm:space-y-8">
                        {/* === DASHBOARD === */}
                        {activeTab === 'dashboard' && (
                            <div className="animate-fade-in space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                                    <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition"><div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Total Challans</p><h3 className="text-xl sm:text-2xl font-bold text-[#004d00]">{userData?.challans?.length || 0}</h3></div><div className="p-3 bg-green-50 text-[#004d00] rounded-full"><Icons.Exam /></div></div>
                                    <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition"><div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Pending</p><h3 className="text-xl sm:text-2xl font-bold text-orange-500">{userData?.challans?.filter(c => c.status === 'Pending Verification').length || 0}</h3></div><div className="p-3 bg-orange-50 text-orange-500 rounded-full"><Icons.Upload /></div></div>
                                    <div className="bg-white p-3 sm:p-5 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition"><div><p className="text-xs text-gray-400 font-bold uppercase mb-1">Verified</p><h3 className="text-xl sm:text-2xl font-bold text-green-600">{userData?.challans?.filter(c => c.status === 'Verified').length || 0}</h3></div><div className="p-3 bg-green-50 text-green-600 rounded-full"><Icons.View /></div></div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="px-5 sm:px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2"><Icons.List /><h3 className="font-bold text-[#004d00] text-sm uppercase tracking-wide">Recent Activity</h3></div>
                                    <div className="overflow-x-auto">
                                        {(!userData?.challans || userData.challans.length === 0) ? (
                                            <div className="p-10 text-center text-gray-400 flex flex-col items-center"><Icons.Alert /><p className="text-sm mt-2 font-medium">No fee records found.</p></div>
                                        ) : (
                                            <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm"><thead className="bg-white"><tr><th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs">Details</th><th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs">Amount</th><th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs">Status</th><th className="px-4 sm:px-6 py-3 text-left font-bold text-gray-500 uppercase tracking-wider text-[10px] sm:text-xs hidden sm:table-cell">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{userData.challans.map((c, idx) => (<tr key={c.id || idx} className="hover:bg-gray-50 transition-colors"><td className="px-4 sm:px-6 py-3 sm:py-4"><div className="font-bold text-gray-800 text-xs sm:text-sm uppercase tracking-wide">Part {c.part} Fee</div><div className="text-[9px] sm:text-[10px] text-gray-400 mt-1 font-mono tracking-wider">{c.challanNo} &bull; {c.statusType}</div></td><td className="px-4 sm:px-6 py-3 sm:py-4"><span className="font-mono font-extrabold text-[#004d00] text-xs sm:text-sm">Rs. {c.amount}</span></td><td className="px-4 sm:px-6 py-3 sm:py-4"><span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider border ${c.status === 'Verified' ? 'bg-green-50 text-green-700 border-green-200' : c.status === 'Pending Verification' ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{c.status}</span></td><td className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold flex items-center gap-2 sm:gap-3 hidden sm:flex"><button onClick={() => handleDownloadPdf(c)} className="text-gray-500 hover:text-[#004d00] flex items-center gap-1.5 transition-colors bg-gray-100 px-3 py-1.5 rounded-lg"><Icons.Download /> <span>PDF</span></button>{c.status === 'Verified' ? (<button onClick={() => handleViewReceipt(c.receiptImageUrl)} className="text-green-600 hover:text-green-800 flex items-center gap-1.5 transition-colors bg-green-50 px-3 py-1.5 rounded-lg"><Icons.View /> <span>RECEIPT</span></button>) : (c.hasDownloaded && (<button onClick={() => openUploadModal(c.id)} className="bg-[#004d00] text-white px-3 py-1.5 rounded-lg hover:bg-[#003800] flex items-center gap-1.5 shadow-sm transition-all"><Icons.Upload /> <span>UPLOAD</span></button>))}</td><td className="px-4 sm:px-6 py-3 sm:py-4 text-xs font-bold flex items-center gap-2 sm:hidden"><button onClick={() => handleDownloadPdf(c)} className="text-gray-500 hover:text-[#004d00] flex items-center gap-1.5 transition-colors bg-gray-100 p-2 rounded-lg"><Icons.Download /></button>{c.status === 'Verified' ? (<button onClick={() => handleViewReceipt(c.receiptImageUrl)} className="text-green-600 hover:text-green-800 flex items-center gap-1.5 transition-colors bg-green-50 p-2 rounded-lg"><Icons.View /></button>) : (c.hasDownloaded && (<button onClick={() => openUploadModal(c.id)} className="bg-[#004d00] text-white p-2 rounded-lg hover:bg-[#003800] flex items-center gap-1.5 shadow-sm transition-all"><Icons.Upload /></button>))}</td></tr>))}</tbody></table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* === PROFILE === */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 animate-fade-in overflow-hidden mb-2">
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-bold text-[#004d00] text-sm uppercase tracking-wide flex items-center gap-2">
                                        <Icons.Profile /> {isEditing ? 'Update Personal Details' : 'Personal Information'}
                                    </h3>
                                    <span className="text-[9px] font-bold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-sm tracking-wider">ID: {user.email.split('@')[0]}</span>
                                </div>

                                {isEditing ? (
                                    <form onSubmit={saveProfile} className="p-4 sm:p-5 flex flex-col justify-center min-h-[calc(100vh-180px)]">
                                        {/* 4-Columns Grid banaya hai taake vertical space bache */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                                            <div><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Prefix</label><select name="prefix" value={studentForm.prefix} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none bg-gray-50 text-xs font-medium"><option value="M">M</option><option value="F">F</option></select></div>
                                            <div className="col-span-2"><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Full Name</label><input type="text" name="fullName" value={studentForm.fullName} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none uppercase text-xs font-bold text-gray-800 bg-gray-50" placeholder="NAME" /></div>
                                            <div><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Surname / Caste</label><input type="text" name="surname" value={studentForm.surname} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none uppercase text-xs font-bold text-gray-800 bg-gray-50" placeholder="SURNAME" /></div>

                                            <div className="col-span-2"><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Father's Name</label><input type="text" name="fatherName" value={studentForm.fatherName} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none uppercase text-xs font-bold text-gray-800 bg-gray-50" placeholder="FATHER'S NAME" /></div>
                                            <div><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Date of Birth</label><input type="date" name="dob" value={studentForm.dob} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none uppercase text-xs font-medium text-gray-800 bg-gray-50" /></div>
                                            <div><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Gender</label><select name="gender" value={studentForm.gender} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none bg-gray-50 text-xs font-medium"><option value="MALE">MALE</option><option value="FEMALE">FEMALE</option></select></div>

                                            <div className="col-span-2"><label className="block text-[9px] font-bold text-blue-600 uppercase mb-0.5 tracking-wider">Email Address</label><input type="email" name="email" value={studentForm.email} onChange={handleFormChange} placeholder="student@example.com" className="w-full px-3 py-1.5 border border-blue-200 rounded focus:ring-1 focus:ring-blue-500 outline-none text-xs font-medium bg-blue-50/30 text-blue-900" /></div>
                                            <div><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Mobile No.</label><input type="text" name="mobileNo" value={studentForm.mobileNo} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none text-xs font-mono font-bold text-gray-800 bg-gray-50" placeholder="03XX" /></div>
                                            <div><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Zip Code</label><input type="text" name="zipCode" value={studentForm.zipCode} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none text-xs font-mono font-bold text-gray-800 bg-gray-50" placeholder="69230" /></div>

                                            <div><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">City / Taluka</label><select name="city" value={studentForm.city} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none bg-gray-50 text-xs font-medium"><option value="MITHI">MITHI</option><option value="ISLAMKOT">ISLAMKOT</option><option value="CHACHRO">CHACHRO</option><option value="DIPLO">DIPLO</option><option value="NAGARPARKAR">NAGARPARKAR</option><option value="KALOI">KALOI</option><option value="DAHLI">DAHLI</option></select></div>
                                            <div>
                                                <label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">District</label>
                                                <select name="district" value="THARPARKAR" className="w-full px-3 py-1.5 border border-gray-200 rounded outline-none bg-gray-100 text-gray-500 font-bold text-xs cursor-not-allowed" disabled>
                                                    <option value="THARPARKAR">THARPARKAR</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2"><label className="block text-[9px] font-bold text-gray-500 uppercase mb-0.5 tracking-wider">Postal Address</label><input type="text" name="homeAddress" value={studentForm.homeAddress} onChange={handleFormChange} className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-[#004d00] outline-none uppercase text-xs font-medium text-gray-800 bg-gray-50" placeholder="ADDRESS..." /></div>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-2">
                                            <button type="button" onClick={handleCancelEdit} className="px-6 py-2 rounded font-bold text-[10px] uppercase tracking-wider text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">Cancel</button>
                                            <button type="submit" className="bg-[#004d00] hover:bg-[#003800] text-[#ffd200] px-6 py-2 rounded font-extrabold shadow-sm transition-all text-[10px] uppercase tracking-wider flex items-center gap-1.5"><Icons.Check className="w-3 h-3" /> Save</button>
                                        </div>
                                    </form>
                                ) : (
                                    <div className="p-4 sm:p-6 flex flex-col items-center relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-50/50 via-white to-white justify-center min-h-[calc(100vh-180px)]">
                                        <div className="flex flex-col items-center w-full mb-5">
                                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white shadow-md bg-[#004d00] text-[#ffd200] flex items-center justify-center text-3xl font-extrabold uppercase mb-2 relative z-10">
                                                {studentForm.profileImage ? <img src={studentForm.profileImage} className="w-full h-full object-cover rounded-full" /> : studentForm.fullName?.charAt(0) || 'U'}
                                            </div>
                                            <h4 className="font-extrabold text-xl sm:text-2xl text-gray-800 uppercase text-center tracking-tight">{studentForm.fullName || 'NO NAME PROVIDED'}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full text-[9px] font-bold uppercase tracking-widest">{studentForm.gender || 'GENDER'}</span>
                                                <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-[9px] font-bold uppercase tracking-widest font-mono">ID: {user.email.split('@')[0]}</span>
                                            </div>
                                        </div>

                                        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-5">
                                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 hover:border-green-200 transition-colors">
                                                <div className="flex items-start gap-2.5"><div className="p-1.5 bg-gray-50 rounded-lg text-gray-400"><Icons.Users className="w-4 h-4" /></div><div><h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Father's Name</h5><p className="text-xs font-bold text-gray-800 uppercase">{studentForm.fatherName || '-'}</p></div></div>
                                                <div className="flex items-start gap-2.5"><div className="p-1.5 bg-gray-50 rounded-lg text-gray-400"><Icons.Profile className="w-4 h-4" /></div><div><h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Surname / Caste</h5><p className="text-xs font-bold text-gray-800 uppercase">{studentForm.surname || '-'}</p></div></div>
                                                <div className="flex items-start gap-2.5"><div className="p-1.5 bg-gray-50 rounded-lg text-gray-400"><Icons.Exam className="w-4 h-4" /></div><div><h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Date of Birth</h5><p className="text-xs font-bold text-gray-800 font-mono">{studentForm.dob || '-'}</p></div></div>
                                            </div>

                                            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 hover:border-green-200 transition-colors">
                                                <div className="flex items-start gap-2.5"><div className="p-1.5 bg-gray-50 rounded-lg text-gray-400"><Icons.Dashboard className="w-4 h-4" /></div><div><h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Mobile Number</h5><p className="text-xs font-bold text-gray-800 font-mono tracking-wider">{studentForm.mobileNo || '-'}</p></div></div>
                                                <div className="flex items-start gap-2.5"><div className="p-1.5 bg-blue-50 rounded-lg text-blue-500"><Icons.View className="w-4 h-4" /></div><div><h5 className="text-[9px] font-bold text-blue-500 uppercase tracking-widest mb-0.5">Email Address</h5><p className="text-xs font-bold text-blue-900">{studentForm.email || 'Not Provided'}</p></div></div>
                                                <div className="flex items-start gap-2.5"><div className="p-1.5 bg-gray-50 rounded-lg text-gray-400"><Icons.List className="w-4 h-4" /></div><div><h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Location</h5><p className="text-xs font-bold text-gray-800 uppercase">{studentForm.city ? `${studentForm.city}, THARPARKAR` : '-'}</p></div></div>
                                            </div>

                                            <div className="md:col-span-2 bg-white p-3.5 rounded-xl border border-gray-100 shadow-sm hover:border-green-200 transition-colors">
                                                <h5 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Complete Postal Address</h5>
                                                <p className="text-xs font-bold text-gray-800 uppercase leading-snug bg-gray-50 p-2.5 rounded-lg border border-gray-100">{studentForm.homeAddress || 'No address provided yet.'}</p>
                                            </div>
                                        </div>

                                        <button onClick={() => setIsEditing(true)} className="bg-[#004d00] hover:bg-[#003800] text-[#ffd200] px-8 py-2.5 rounded-full font-extrabold shadow-md hover:shadow-lg transition-all text-[10px] uppercase tracking-widest flex items-center gap-2 transform hover:-translate-y-0.5">
                                            <Icons.Edit className="w-4 h-4" /> Edit Details
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* === GENERATOR === */}
                        {activeTab === 'generator' && (
                            <div className="max-w-md mx-auto flex flex-col justify-center h-full min-h-[calc(100vh-180px)]">
                                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in w-full">
                                    <div className="bg-[#004d00] px-4 py-4 text-center border-b-4 border-[#ffd200] relative overflow-hidden">
                                        <Icons.Exam className="absolute -right-2 -bottom-2 w-16 h-16 text-white opacity-10 transform rotate-12" />
                                        <h3 className="text-lg font-extrabold text-white tracking-widest uppercase relative z-10">Fee Challan Generator</h3>
                                        <p className="text-[#ffd200] text-[10px] mt-0.5 font-medium tracking-wide relative z-10">Generate semester exam fee voucher</p>
                                    </div>
                                    <div className="p-5 sm:p-6">
                                        <form onSubmit={(e) => { e.preventDefault(); generateChallan(e.target.part.value, e.target.batch.value, e.target.status.value); }} className="space-y-4">

                                            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg">
                                                <p className="text-[11px] text-blue-800 font-medium leading-tight">
                                                    <strong className="text-blue-900 uppercase tracking-wider mr-1">Note:</strong>
                                                    Generate challan only for the parts you have to appear in. Duplicate challans are restricted.
                                                </p>
                                            </div>

                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Select Program Part</label>
                                                    <div className="relative">
                                                        <select name="part" className="w-full pl-3 pr-8 py-2.5 border-2 border-gray-200 rounded-lg appearance-none focus:border-[#004d00] outline-none bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer">
                                                            <option value="I">Part I (First Year)</option>
                                                            <option value="II">Part II (Second Year)</option>
                                                            <option value="III">Part III (Third Year)</option>
                                                            <option value="IV">Part IV (Fourth Year)</option>
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <Icons.View className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Select Enrolled Batch</label>
                                                    <div className="relative">
                                                        <select name="batch" className="w-full pl-3 pr-8 py-2.5 border-2 border-gray-200 rounded-lg appearance-none focus:border-[#004d00] outline-none bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer">
                                                            <option value="2k22">Batch 2k22</option>
                                                            <option value="2k23">Batch 2k23</option>
                                                            <option value="2k24">Batch 2k24</option>
                                                            <option value="2k25">Batch 2k25</option>
                                                            <option value="2k26">Batch 2k26</option>
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <Icons.GradCap className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Select Resident Status</label>
                                                    <div className="relative">
                                                        <select name="status" className="w-full pl-3 pr-8 py-2.5 border-2 border-gray-200 rounded-lg appearance-none focus:border-[#004d00] outline-none bg-gray-50 text-xs font-bold text-gray-700 cursor-pointer">
                                                            <option value="Hosteller">Hosteller (Boarder) - Rs. 1300/-</option>
                                                            <option value="Non-Hosteller">Non-Hosteller (Day Scholar) - Rs. 900/-</option>
                                                        </select>
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                            <Icons.Users className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button type="submit" className="w-full mt-2 bg-[#004d00] hover:bg-[#003800] text-[#ffd200] font-extrabold py-3.5 rounded-lg shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-widest flex justify-center items-center gap-2">
                                                <Icons.Download className="w-4 h-4" /> Generate PDF Challan
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* Modals */}
                    {showUploadModal && (<div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100"><div className="bg-[#004d00] px-5 py-4 border-b-4 border-[#ffd200] flex justify-between items-center"><h3 className="font-extrabold text-sm text-white uppercase tracking-widest">Upload Receipt</h3><button onClick={() => setShowUploadModal(false)} className="text-white hover:text-[#ffd200] transition"><Icons.Close /></button></div><form onSubmit={handleUploadSubmit} className="p-6 space-y-5"><div className="bg-blue-50 text-blue-800 text-[11px] p-3 rounded-lg border border-blue-100 font-medium">Upload <strong className="text-blue-900">stamped bank copy</strong> (JPG/PNG). Max size 800KB.</div><div><label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Amount Paid (Rs.)</label><input type="text" value={uploadForm.amount} onChange={(e) => setUploadForm({ ...uploadForm, amount: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:border-[#004d00] outline-none" required placeholder="e.g. 900" /></div><div><label className="block text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1.5">Deposit Date</label><input type="date" value={uploadForm.date} onChange={(e) => setUploadForm({ ...uploadForm, date: e.target.value })} className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm font-bold text-gray-800 focus:border-[#004d00] outline-none" required /></div><div className="border-2 border-dashed border-[#004d00] bg-green-50/50 rounded-xl p-6 text-center hover:bg-green-50 cursor-pointer relative transition group"><div className="text-[#004d00] group-hover:scale-110 transition-transform duration-300 flex justify-center mb-2"><Icons.Upload /></div><span className="text-xs font-bold text-[#004d00] block">Click to Select Image</span><span className="text-[10px] text-gray-400 block mt-1">JPG, PNG only</span><input type="file" accept="image/jpeg, image/png" onChange={handleUploadFileChange} className="absolute inset-0 opacity-0 cursor-pointer" required /></div><button type="submit" disabled={uploading} className="w-full bg-[#004d00] hover:bg-[#003800] text-[#ffd200] font-extrabold py-3.5 rounded-lg shadow-md transition-colors text-xs uppercase tracking-widest flex justify-center items-center mt-2">{uploading ? <span className="flex items-center gap-2"><Icons.Spinner /> UPLOADING...</span> : 'SUBMIT RECEIPT'}</button></form></div></div>)}
                    {showReceiptModal && (<div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"><div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full h-[85vh] flex flex-col overflow-hidden"><div className="bg-[#004d00] p-4 border-b-4 border-[#ffd200] flex justify-between items-center"><h3 className="font-extrabold text-sm text-white uppercase tracking-widest">Bank Receipt Proof</h3><button onClick={() => setShowReceiptModal(false)} className="text-white hover:text-[#ffd200] bg-white/10 p-1.5 rounded-lg transition"><Icons.Close /></button></div><div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100 p-6 flex justify-center items-center overflow-auto"><div className="bg-white p-2 rounded-lg shadow-lg"><img src={receiptUrl} alt="Receipt" className="max-h-[70vh] object-contain rounded border border-gray-200" /></div></div></div></div>)}
                </div>

                {/* --- MOBILE NAVIGATION --- */}
                <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 md:hidden flex justify-around items-center p-2 z-40 pb-safe shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
                    {[
                        { id: 'dashboard', label: 'Home', icon: Icons.Dashboard },
                        { id: 'profile', label: 'Profile', icon: Icons.Profile },
                        { id: 'generator', label: 'Fee', icon: Icons.Exam },
                    ].map((item) => (
                        <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center w-16 h-12 rounded-lg transition-all ${activeTab === item.id ? 'text-[#004d00] bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}>
                            <item.icon className={`w-5 h-5 mb-0.5 ${activeTab === item.id ? 'scale-110 transition-transform' : ''}`} />
                            <span className={`text-[9px] font-bold tracking-wider ${activeTab === item.id ? 'text-[#004d00]' : 'text-gray-400'}`}>{item.label}</span>
                        </button>
                    ))}
                    <button onClick={handleLogout} className="flex flex-col items-center justify-center w-16 h-12 rounded-lg text-red-500 hover:bg-red-50 transition-all">
                        <Icons.Logout className="w-5 h-5 mb-0.5" />
                        <span className="text-[9px] font-bold tracking-wider">Exit</span>
                    </button>
                </nav>
            </div>
        </>
    );
};

export default App;
