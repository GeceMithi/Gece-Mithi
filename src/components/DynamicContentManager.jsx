import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import backupService from '../services/dataBackupService';
import validationService from '../services/dataValidationService';

// Icons for the content manager
const Icons = {
    Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
    List: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>,
    Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>,
    LogOut: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>,
    Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>,
    Menu: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>,
    Check: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="green" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>,
    Back: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>,
    Eye: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
    Cloud: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>,
    GradCap: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 0 6 2.5 6 5s3-5 6-5v-5"></path></svg>,
    Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
    Loader: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v10l4 4"></path></svg>
};

const DynamicContentManager = () => {
    // Form states for different content types
    const [facultyForm, setFacultyForm] = useState({ name: '', role: '', duration: '', isActive: false, showDurationInput: false });
    const [visitingFacultyForm, setVisitingFacultyForm] = useState({ name: '', role: '', duration: '', showDurationInput: false });
    const [nonTeachingForm, setNonTeachingForm] = useState({ name: '', role: '', duration: '', isActive: false, showDurationInput: false });
    const [volunteerTeacherForm, setVolunteerTeacherForm] = useState({ name: '', batch: '' });
    const [outlineForm, setOutlineForm] = useState({ title: '', description: '', fileUrl: '' });
    const [notesForm, setNotesForm] = useState({ title: '', description: '', fileUrl: '' });
    const [pastPaperForm, setPastPaperForm] = useState({ title: '', year: '', subject: '', fileUrl: '' });
    const [toolsForm, setToolsForm] = useState({ name: '', description: '', url: '', category: '' });

    // Data states
    const [faculty, setFaculty] = useState([]);
    const [visitingFaculty, setVisitingFaculty] = useState([]);
    const [nonTeachingStaff, setNonTeachingStaff] = useState([]);
    const [volunteerTeachers, setVolunteerTeachers] = useState([]);
    const [outlines, setOutlines] = useState([]);
    const [notes, setNotes] = useState([]);
    const [pastPapers, setPastPapers] = useState([]);
    const [tools, setTools] = useState([]);

    const [activeTab, setActiveTab] = useState('faculty');
    const [loading, setLoading] = useState(false);

    // Initialize backup service on component mount
    useEffect(() => {
        backupService.initialize();
        
        // Cleanup on unmount
        return () => {
            backupService.stop();
        };
    }, []);

    // Fetch all dynamic data from Firebase
    const fetchAllData = async () => {
        try {
            const facultySnap = await getDocs(collection(db, "faculty"));
            setFaculty(facultySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            const visitingFacultySnap = await getDocs(collection(db, "visiting_faculty"));
            setVisitingFaculty(visitingFacultySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            const nonTeachingSnap = await getDocs(collection(db, "non_teaching_staff"));
            setNonTeachingStaff(nonTeachingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            const volunteerTeachersSnap = await getDocs(collection(db, "volunteer_teachers"));
            setVolunteerTeachers(volunteerTeachersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            const outlinesSnap = await getDocs(collection(db, "outlines"));
            setOutlines(outlinesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            const notesSnap = await getDocs(collection(db, "notes"));
            setNotes(notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            const pastPapersSnap = await getDocs(collection(db, "past_papers"));
            setPastPapers(pastPapersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            const toolsSnap = await getDocs(collection(db, "tools"));
            setTools(toolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    React.useEffect(() => {
        fetchAllData();
    }, []);

    // Generic add function
    // Generic add function with validation and backup
    const addDocument = async (collectionName, data) => {
        setLoading(true);
        try {
            // Validate data before saving
            const validation = validationService.validateData(collectionName, data);
            if (!validation.isValid) {
                alert(`Validation Error: ${validation.errors.join(', ')}`);
                return;
            }

            // Sanitize data to prevent XSS
            const sanitizedData = validationService.sanitizeData(data);
            
            // Check document size
            if (!validationService.validateDocumentSize(sanitizedData)) {
                alert('Document is too large to save');
                return;
            }

            // Check collection size limits
            const collectionMap = {
                'faculty': faculty,
                'visiting_faculty': visitingFaculty,
                'non_teaching_staff': nonTeachingStaff,
                'volunteer_teachers': volunteerTeachers,
                'outlines': outlines,
                'notes': notes,
                'past_papers': pastPapers,
                'tools': tools
            };
            
            const currentCollection = collectionMap[collectionName] || [];
            
            if (!await validationService.checkCollectionSize(collectionName, currentCollection.length)) {
                alert('Collection has reached maximum size limit');
                return;
            }

            // Add document to Firebase
            await addDoc(collection(db, collectionName), {
                ...sanitizedData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            
            fetchAllData();
            
            // Trigger backup after important data changes
            if (['faculty', 'visiting_faculty', 'non_teaching_staff'].includes(collectionName)) {
                setTimeout(() => backupService.performBackup(), 1000);
            }
            
            // Reset form
            if (collectionName === 'faculty') setFacultyForm({ name: '', role: '', duration: '', isActive: false, showDurationInput: false });
            else if (collectionName === 'visiting_faculty') setVisitingFacultyForm({ name: '', role: '', duration: '', showDurationInput: false });
            else if (collectionName === 'non_teaching_staff') setNonTeachingForm({ name: '', role: '', duration: '', isActive: false, showDurationInput: false });
            else if (collectionName === 'volunteer_teachers') setVolunteerTeacherForm({ name: '', batch: '' });
            else if (collectionName === 'outlines') setOutlineForm({ title: '', description: '', fileUrl: '' });
            else if (collectionName === 'notes') setNotesForm({ title: '', description: '', fileUrl: '' });
            else if (collectionName === 'past_papers') setPastPaperForm({ title: '', year: '', subject: '', fileUrl: '' });
            else if (collectionName === 'tools') setToolsForm({ name: '', description: '', url: '', category: '' });
            
            alert("Added successfully!");
        } catch (error) {
            console.error("Error adding document:", error);
            alert("Failed to add!");
        }
        setLoading(false);
    };

    // Generic delete function
    const deleteDocument = async (collectionName, id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        
        setLoading(true);
        try {
            await deleteDoc(doc(db, collectionName, id));
            fetchAllData();
            alert("Deleted successfully!");
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete!");
        }
        setLoading(false);
    };


    // Generic update function
    const updateDocument = async (collectionName, id, data) => {
        setLoading(true);
        try {
            await updateDoc(doc(db, collectionName, id), data);
            fetchAllData();
            alert("Updated successfully!");
        } catch (error) {
            console.error("Error updating document:", error);
            alert("Failed to update!");
        }
        setLoading(false);
    };

    // Render different forms based on active tab
    const renderForm = () => {
        switch (activeTab) {
            case 'faculty':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Faculty Member</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Name" value={facultyForm.name} onChange={(e) => setFacultyForm({...facultyForm, name: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Role" value={facultyForm.role} onChange={(e) => setFacultyForm({...facultyForm, role: e.target.value})} className="w-full p-2 border rounded" />
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="facultyDuration" checked={!facultyForm.showDurationInput} onChange={() => setFacultyForm({...facultyForm, duration: '', showDurationInput: false})} className="mr-2" />
                                    <span className="text-gray-500">No Duration</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="facultyDuration" checked={facultyForm.showDurationInput} onChange={() => setFacultyForm({...facultyForm, showDurationInput: true})} className="mr-2" />
                                    Add Duration
                                </label>
                            </div>
                            {facultyForm.showDurationInput && (
                                <input type="text" placeholder="Duration (e.g., 2019-Present)" value={facultyForm.duration} onChange={(e) => setFacultyForm({...facultyForm, duration: e.target.value})} className="w-full p-2 border rounded" />
                            )}
                            <label className="flex items-center">
                                <input type="checkbox" checked={facultyForm.isActive} onChange={(e) => setFacultyForm({...facultyForm, isActive: e.target.checked})} className="mr-2" />
                                Active
                            </label>
                            <button onClick={() => addDocument('faculty', facultyForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Faculty'}
                            </button>
                        </div>
                    </div>
                );
            
            case 'visitingFaculty':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Visiting Faculty</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Name" value={visitingFacultyForm.name} onChange={(e) => setVisitingFacultyForm({...visitingFacultyForm, name: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Role" value={visitingFacultyForm.role} onChange={(e) => setVisitingFacultyForm({...visitingFacultyForm, role: e.target.value})} className="w-full p-2 border rounded" />
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="visitingFacultyDuration" checked={!visitingFacultyForm.showDurationInput} onChange={() => setVisitingFacultyForm({...visitingFacultyForm, duration: '', showDurationInput: false})} className="mr-2" />
                                    <span className="text-gray-500">No Duration</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="visitingFacultyDuration" checked={visitingFacultyForm.showDurationInput} onChange={() => setVisitingFacultyForm({...visitingFacultyForm, showDurationInput: true})} className="mr-2" />
                                    Add Duration
                                </label>
                            </div>
                            {visitingFacultyForm.showDurationInput && (
                                <input type="text" placeholder="Duration (e.g., 2019-Present)" value={visitingFacultyForm.duration} onChange={(e) => setVisitingFacultyForm({...visitingFacultyForm, duration: e.target.value})} className="w-full p-2 border rounded" />
                            )}
                            <button onClick={() => addDocument('visiting_faculty', visitingFacultyForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Visiting Faculty'}
                            </button>
                        </div>
                    </div>
                );
            
            case 'nonTeaching':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Non-Teaching Staff</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Name" value={nonTeachingForm.name} onChange={(e) => setNonTeachingForm({...nonTeachingForm, name: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Role" value={nonTeachingForm.role} onChange={(e) => setNonTeachingForm({...nonTeachingForm, role: e.target.value})} className="w-full p-2 border rounded" />
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input type="radio" name="nonTeachingDuration" checked={!nonTeachingForm.showDurationInput} onChange={() => setNonTeachingForm({...nonTeachingForm, duration: '', showDurationInput: false})} className="mr-2" />
                                    <span className="text-gray-500">No Duration</span>
                                </label>
                                <label className="flex items-center">
                                    <input type="radio" name="nonTeachingDuration" checked={nonTeachingForm.showDurationInput} onChange={() => setNonTeachingForm({...nonTeachingForm, showDurationInput: true})} className="mr-2" />
                                    Add Duration
                                </label>
                            </div>
                            {nonTeachingForm.showDurationInput && (
                                <input type="text" placeholder="Duration (e.g., 2019-Present)" value={nonTeachingForm.duration} onChange={(e) => setNonTeachingForm({...nonTeachingForm, duration: e.target.value})} className="w-full p-2 border rounded" />
                            )}
                            <label className="flex items-center">
                                <input type="checkbox" checked={nonTeachingForm.isActive} onChange={(e) => setNonTeachingForm({...nonTeachingForm, isActive: e.target.checked})} className="mr-2" />
                                Active
                            </label>
                            <button onClick={() => addDocument('non_teaching_staff', nonTeachingForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Staff'}
                            </button>
                        </div>
                    </div>
                );
            
            case 'volunteerTeachers':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Volunteer Teacher</h3>
                        <div className="space-y-4">
                            <select value={volunteerTeacherForm.batch} onChange={(e) => setVolunteerTeacherForm({...volunteerTeacherForm, batch: e.target.value})} className="w-full p-2 border rounded">
                                <option value="">Select Batch</option>
                                <option value="Batch 2k17">Batch 2k17</option>
                                <option value="Batch 2k18">Batch 2k18</option>
                                <option value="Batch 2k19">Batch 2k19</option>
                                <option value="Batch 2020">Batch 2020</option>
                                <option value="Batch 2k21">Batch 2k21</option>
                                <option value="Batch 2k22">Batch 2k22</option>
                                <option value="Batch 2k23">Batch 2k23</option>
                                <option value="Batch 2k24">Batch 2k24</option>
                                <option value="Batch 2k25">Batch 2k25</option>
                                <option value="Batch 2k26">Batch 2k26</option>
                                <option value="Batch 2k27">Batch 2k27</option>
                                <option value="Batch 2k28">Batch 2k28</option>
                                <option value="Batch 2k29">Batch 2k29</option>
                                <option value="Batch 2k30">Batch 2k30</option>
                            </select>
                            <input type="text" placeholder="Name" value={volunteerTeacherForm.name} onChange={(e) => setVolunteerTeacherForm({...volunteerTeacherForm, name: e.target.value})} className="w-full p-2 border rounded" />
                            <button onClick={() => addDocument('volunteer_teachers', volunteerTeacherForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Volunteer Teacher'}
                            </button>
                        </div>
                    </div>
                );
            
            case 'outlines':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Outline</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Title" value={outlineForm.title} onChange={(e) => setOutlineForm({...outlineForm, title: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="url" placeholder="File URL" value={outlineForm.fileUrl} onChange={(e) => setOutlineForm({...outlineForm, fileUrl: e.target.value})} className="w-full p-2 border rounded" />
                            <button onClick={() => addDocument('outlines', outlineForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Outline'}
                            </button>
                        </div>
                    </div>
                );
            
            case 'notes':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Notes</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Title" value={notesForm.title} onChange={(e) => setNotesForm({...notesForm, title: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="url" placeholder="File URL" value={notesForm.fileUrl} onChange={(e) => setNotesForm({...notesForm, fileUrl: e.target.value})} className="w-full p-2 border rounded" />
                            <button onClick={() => addDocument('notes', notesForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Notes'}
                            </button>
                        </div>
                    </div>
                );
            
            case 'pastPapers':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Past Paper</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Title" value={pastPaperForm.title} onChange={(e) => setPastPaperForm({...pastPaperForm, title: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Year" value={pastPaperForm.year} onChange={(e) => setPastPaperForm({...pastPaperForm, year: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Subject" value={pastPaperForm.subject} onChange={(e) => setPastPaperForm({...pastPaperForm, subject: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="url" placeholder="File URL" value={pastPaperForm.fileUrl} onChange={(e) => setPastPaperForm({...pastPaperForm, fileUrl: e.target.value})} className="w-full p-2 border rounded" />
                            <button onClick={() => addDocument('past_papers', pastPaperForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Past Paper'}
                            </button>
                        </div>
                    </div>
                );
            
            case 'tools':
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-lg font-bold mb-4">Add Tool</h3>
                        <div className="space-y-4">
                            <input type="text" placeholder="Name" value={toolsForm.name} onChange={(e) => setToolsForm({...toolsForm, name: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="url" placeholder="URL" value={toolsForm.url} onChange={(e) => setToolsForm({...toolsForm, url: e.target.value})} className="w-full p-2 border rounded" />
                            <input type="text" placeholder="Category" value={toolsForm.category} onChange={(e) => setToolsForm({...toolsForm, category: e.target.value})} className="w-full p-2 border rounded" />
                            <button onClick={() => addDocument('tools', toolsForm)} disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800">
                                {loading ? 'Adding...' : 'Add Tool'}
                            </button>
                        </div>
                    </div>
                );
            
            default:
                return null;
        }
    };

    // Render data list based on active tab
    const renderDataList = () => {
        const getData = () => {
            switch (activeTab) {
                case 'faculty': return faculty;
                case 'visitingFaculty': return visitingFaculty;
                case 'nonTeaching': return nonTeachingStaff;
                case 'volunteerTeachers': return volunteerTeachers;
                case 'outlines': return outlines;
                case 'notes': return notes;
                case 'pastPapers': return pastPapers;
                case 'tools': return tools;
                default: return [];
            }
        };

        const getCollectionName = () => {
            switch (activeTab) {
                case 'faculty': return 'faculty';
                case 'visitingFaculty': return 'visiting_faculty';
                case 'nonTeaching': return 'non_teaching_staff';
                case 'volunteerTeachers': return 'volunteer_teachers';
                case 'outlines': return 'outlines';
                case 'notes': return 'notes';
                case 'pastPapers': return 'past_papers';
                case 'tools': return 'tools';
                default: return '';
            }
        };

        const data = getData();
        const collectionName = getCollectionName();

        return (
            <div className="bg-white rounded-lg border border-[#ffd200]">
                <div className="p-4 border-b border-[#ffd200]">
                    <h3 className="text-lg font-bold">Current {activeTab.charAt(0).toUpperCase() + activeTab.slice(1).replace(/([A-Z])/g, ' $1')}</h3>
                </div>
                <div className="divide-y divide-gray-200">
                    {activeTab === 'volunteerTeachers' ? (
                        // Batch-wise rendering for volunteer teachers
                        Object.entries(
                            data.reduce((acc, teacher) => {
                                const batch = teacher.batch || 'Unknown Batch';
                                if (!acc[batch]) {
                                    acc[batch] = [];
                                }
                                acc[batch].push(teacher);
                                return acc;
                            }, {})
                        ).sort((a, b) => {
                            // Sort batches by year (2k17, 2k18, 2k19, etc.)
                            const getYear = (batch) => {
                                const match = batch.match(/(\d+)/);
                                return match ? parseInt(match[1]) : 0;
                            };
                            return getYear(a[0]) - getYear(b[0]);
                        }).map(([batch, teachers]) => (
                            <div key={batch} className="bg-gray-50 p-4">
                                <div className="mb-3 pb-2 border-b border-gray-300 flex items-center gap-2">
                                    <span className="text-lg">🎓</span>
                                    <h4 className="text-md font-bold text-[#004d00] uppercase">{batch}</h4>
                                    <span className="text-sm text-gray-500">({teachers.length} teachers)</span>
                                </div>
                                <div className="space-y-2">
                                    {teachers.sort((a, b) => a.name.localeCompare(b.name)).map((teacher, idx) => (
                                        <div key={teacher.id || idx} className="flex justify-between items-center p-3 bg-white rounded hover:bg-gray-50 border border-gray-200">
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{teacher.name}</h4>
                                                <p className="text-sm text-gray-600">{teacher.role || 'Volunteer Teacher'}</p>
                                            </div>
                                            <button
                                                onClick={() => deleteDocument('volunteer_teachers', teacher.id)}
                                                className="text-red-500 hover:text-red-700 font-medium text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Normal rendering for other collections
                        data.map((item) => (
                            <div key={item.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                                <div>
                                    <h4 className="font-semibold">{item.name || item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.role || item.subject || item.category || item.description}</p>
                                    {item.duration && <p className="text-xs text-gray-500">{item.duration}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => deleteDocument(collectionName, item.id)} className="text-red-600 hover:text-red-800">
                                        <Icons.Trash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                    {data.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            No items found. Add some {activeTab} to get started.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Content Update</h2>
            
            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { id: 'faculty', label: 'Faculty' },
                    { id: 'visitingFaculty', label: 'Visiting Faculty' },
                    { id: 'nonTeaching', label: 'Non-Teaching Staff' },
                    { id: 'volunteerTeachers', label: 'Volunteer Teachers' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2 rounded font-medium transition-colors ${
                            activeTab === tab.id
                                ? 'bg-[#004d00] text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form and Data List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {renderForm()}
                {renderDataList()}
            </div>
        </div>
    );
};

export default DynamicContentManager;
