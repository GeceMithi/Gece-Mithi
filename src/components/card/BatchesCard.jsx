import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from "../../firebase";

// === ICONS ===
const Icons = {
    Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    GradCap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 0 6 2.5 6 5s3-5 6-5v-5"></path></svg>,
    ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    ChevronUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>,
    Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
};

const BatchesCard = () => {
    const [activeBatch, setActiveBatch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [batchesData, setBatchesData] = useState({});
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '',
        rel: 'S/o',
        fname: '',
        surname: '',
        status: '',
        batch: '2025'
    });

    // Fetch data from Firebase
    useEffect(() => {
        const fetchBatches = async () => {
            try {
                console.log("🔄 Fetching batches from Firebase...");
                const batchSnapshot = await getDocs(collection(db, "students")); // Changed from "batches" to "students"
                console.log("📊 Firebase snapshot:", batchSnapshot);
                console.log("📊 Number of documents:", batchSnapshot.docs.length);
                
                const batchData = {};
                
                batchSnapshot.docs.forEach(doc => {
                    const student = doc.data();
                    console.log("👤 Student data:", student);
                    const batchName = student.batch || '2025';
                    
                    if (!batchData[batchName]) {
                        batchData[batchName] = [];
                    }
                    
                    // Convert Firebase data to match existing structure
                    batchData[batchName].push({
                        id: doc.id,
                        name: student.name || '',
                        rel: student.parentRelation || 'S/o',
                        fname: student.parentName || '',
                        surname: student.surname || '', // Read surname from students collection
                        status: student.semester || 'Studying'
                    });
                });
                
                console.log("✅ Batches data fetched:", batchData);
                setBatchesData(batchData);
            } catch (error) {
                console.error("Error fetching batches:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBatches();
    }, []);

    // Add new student
    const handleAddStudent = async () => {
        if (!newStudent.name || !newStudent.fname) {
            alert('Please fill in student name and parent name');
            return;
        }

        try {
            console.log("🔄 Adding student data:", newStudent);
            console.log("📥 Adding to collection: students");
            const docRef = await addDoc(collection(db, "students"), {
                name: newStudent.name,
                parentName: newStudent.fname,
                surname: newStudent.surname,
                semester: newStudent.status,
                batch: newStudent.batch,
                parentRelation: newStudent.rel,
                createdAt: new Date().toISOString(),
                status: 'Not Verified'
            });
            console.log("✅ Student added successfully with ID:", docRef.id);

            // Reset form
            setNewStudent({
                name: '',
                rel: 'S/o',
                fname: '',
                surname: '',
                status: '',
                batch: '2025'
            });
            setShowAddModal(false);
            
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student");
        }
    };

    // Delete student
    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm("Are you sure you want to delete this student?")) return;

        try {
            await deleteDoc(doc(db, "batches", studentId));
            // Refresh data
            window.location.reload();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student");
        }
    };

    const toggleBatch = (batch) => {
        setActiveBatch(activeBatch === batch ? null : batch);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#004d00] mx-auto mb-4"></div>
                    <p className="text-[#004d00] font-semibold">Loading batches...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 p-4 md:p-8">
            {/* HEADER - STATIC STRUCTURE, DYNAMIC TEXT */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#004d00] mb-3 tracking-wide">
                        {batchesData && Object.keys(batchesData).length > 0 ? 'PASSED STUDENTS HISTORY' : 'ALL BATCHES'}
                    </h1>
                    <p className="text-gray-600 text-lg">
                        {batchesData && Object.keys(batchesData).length > 0 
                            ? `View and search passed students records (${Object.values(batchesData).reduce((acc, students) => acc + students.length, 0)} total students)`
                            : 'Manage Student Batches Dynamically'
                        }
                    </p>
                </div>

                {/* SEARCH AND ADD BAR - STATIC STRUCTURE, DYNAMIC PLACEHOLDER */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-[#ffd200]">
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Icons.Search />
                            </div>
                            <input
                                type="text"
                                placeholder={`Search by student name or parent name... (${Object.values(batchesData).reduce((acc, students) => acc + students.length, 0)} students available)`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004d00] focus:border-[#004d00] text-lg"
                            />
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-[#004d00] text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-semibold flex items-center gap-2 shadow-lg"
                        >
                            <Icons.Plus />
                            Add Student
                        </button>
                    </div>
                </div>

                {/* BATCHES LIST - STATIC STRUCTURE, DYNAMIC DATA */}
                <div className="space-y-6">
                    {Object.entries(batchesData)
                        .sort((a, b) => {
                            const getYear = (batch) => {
                                const match = batch.match(/(\d+)/);
                                return match ? parseInt(match[1]) : 0;
                            };
                            return getYear(a[0]) - getYear(b[0]);
                        })
                        .map(([batch, students]) => {
                            const filteredStudents = students.filter(student =>
                                student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                student.fname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (student.surname && student.surname.toLowerCase().includes(searchTerm.toLowerCase()))
                            );
                            
                            if (filteredStudents.length === 0 && searchTerm) return null;

                            return (
                                <div key={batch} className="bg-white rounded-lg shadow-sm overflow-hidden border border-[#ffd200]">
                                    
                                    {/* HEADER - STATIC STRUCTURE, DYNAMIC TEXT */}
                                    <button 
                                        onClick={() => toggleBatch(batch)}
                                        className={`w-full flex items-center justify-between p-5 text-left transition-colors bg-[#004d00] text-white hover:bg-[#003d00]`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-full bg-white/10 text-yellow-400">
                                                <Icons.GradCap />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-white uppercase">{batch}</h3>
                                                <p className="text-xs text-green-200">
                                                    {filteredStudents.length} {filteredStudents.length === 1 ? 'Student' : 'Students'} Available
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-white">
                                            {activeBatch === batch ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                        </div>
                                    </button>

                                    {/* STUDENTS LIST - STATIC STRUCTURE, DYNAMIC DATA */}
                                    <div className={`transition-all duration-300 ease-in-out ${activeBatch === batch ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                                        {activeBatch === batch && (
                                            <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                                                {filteredStudents.length > 0 ? (
                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                        {filteredStudents.sort((a, b) => a.name.localeCompare(b.name)).map((student, idx) => (
                                                            <div key={student.id || idx} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#ffd200] group">
                                                                <div className="p-4">
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <div className="flex-1">
                                                                            <h4 className="font-bold text-black text-lg mb-1 group-hover:text-[#006600] transition-colors">
                                                                                {student.name || 'Unknown Student'}
                                                                            </h4>
                                                                            <p className="text-gray-600 text-sm flex items-center gap-1">
                                                                                <span className="text-gray-400">•</span>
                                                                                {student.rel || 'S/o'} {student.fname || 'Unknown'} {student.surname || ''}
                                                                            </p>
                                                                        </div>
                                                                        <div className="ml-3">
                                                                            <div className="w-10 h-10 bg-gradient-to-br from-[#004d00] to-[#006600] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                                                <span className="text-white text-sm font-bold">
                                                                                    {student.name ? student.name.charAt(0).toUpperCase() : '?'}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                                                            <span className="text-xs text-gray-500">Active</span>
                                                                        </div>
                                                                        <div className="flex gap-2">
                                                                            <span className="text-xs bg-gradient-to-r from-[#004d00] to-[#006600] text-white px-3 py-1 rounded-full font-medium shadow-sm">
                                                                                {student.status || 'Studying'}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-8">
                                                        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                            <span className="text-2xl text-gray-400">🔍</span>
                                                        </div>
                                                        <h4 className="text-lg font-medium text-gray-600 mb-2">No Students Found</h4>
                                                        <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                </div>

                {/* EMPTY STATE - STATIC STRUCTURE, DYNAMIC MESSAGE */}
                {Object.keys(batchesData).length === 0 && (
                    <div className="text-center py-16">
                        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <span className="text-3xl text-gray-400">🎓</span>
                        </div>
                        <h3 className="text-2xl font-bold text-[#004d00] mb-4">
                            {searchTerm ? 'No Students Found' : 'No Batches Available'}
                        </h3>
                        <p className="text-gray-600 mb-6">
                            {searchTerm 
                                ? 'Try adjusting your search criteria or add new students'
                                : 'Please add some students to get started'
                            }
                        </p>
                        {!searchTerm && (
                            <button
                                onClick={() => setShowAddModal(true)}
                                className="bg-[#004d00] text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-colors font-semibold flex items-center gap-2 mx-auto"
                            >
                                <Icons.Plus />
                                Add First Student
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BatchesCard;
