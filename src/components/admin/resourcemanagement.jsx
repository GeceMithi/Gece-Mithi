import React, { useState, useEffect } from 'react';
import ResourceCard from './resourcecard';
import ResourceStaffCard from './resourcestaffcard';
import useResourceData from '../../hook/useResourceData';

const ResourceManagement = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showStaffForm, setShowStaffForm] = useState(false);
    
    // Sample staff data - replace with Firebase data later
    const [staffMembers, setStaffMembers] = useState([
        {
            id: 1,
            type: 'volunteer-teacher',
            name: 'Ahmed Ali',
            designation: 'Volunteer Teacher',
            department: 'Education',
            qualification: 'M.Ed',
            experience: '5 years',
            email: 'ahmed@gece.com',
            phone: '0123-456789',
            image: ''
        },
        {
            id: 2,
            type: 'faculty-member',
            name: 'Dr. Sarah Khan',
            designation: 'Professor',
            department: 'Computer Science',
            qualification: 'PhD in Computer Science',
            experience: '10 years',
            email: 'sarah@gece.com',
            phone: '0123-456789',
            image: ''
        },
        {
            id: 3,
            type: 'visiting-faculty',
            name: 'Prof. Muhammad Hassan',
            designation: 'Visiting Faculty',
            department: 'Mathematics',
            qualification: 'M.Phil Mathematics',
            experience: '8 years',
            email: 'hassan@gece.com',
            phone: '0123-456789',
            image: ''
        },
        {
            id: 4,
            type: 'volunteer-teacher-2',
            name: 'Fatima Bibi',
            designation: 'Volunteer Teacher',
            department: 'Physics',
            qualification: 'B.Sc Physics',
            experience: '3 years',
            email: 'fatima@gece.com',
            phone: '0123-456789',
            image: ''
        },
        {
            id: 5,
            type: 'non-teaching-staff',
            name: 'Ali Raza',
            designation: 'Administrative Officer',
            department: 'Administration',
            qualification: 'MBA',
            experience: '6 years',
            email: 'ali@gece.com',
            phone: '0123-456789',
            image: ''
        }
    ]);

    // Add debug log to check if component renders
    useEffect(() => {
        console.log('ResourceManagement component mounted');
        console.log('Staff members:', staffMembers);
        console.log('Show staff form:', showStaffForm);
    }, [staffMembers, showStaffForm]);

    const [newStaff, setNewStaff] = useState({
        type: 'volunteer-teacher',
        name: '',
        designation: '',
        department: '',
        qualification: '',
        experience: '',
        email: '',
        phone: ''
    });
    
    // Use custom hook for Firebase operations
    const {
        resources,
        loading,
        error,
        addResource,
        updateResource,
        deleteResource,
        deleteAllResources,
        removeSemesterData,
        getResourceStatistics
    } = useResourceData();

    // Debug logs to track data flow
    useEffect(() => {
        console.log('📊 ResourceManagement - resources state:', resources);
        console.log('⏳ ResourceManagement - loading state:', loading);
        console.log('❌ ResourceManagement - error state:', error);
    }, [resources, loading, error]);

    const [newResource, setNewResource] = useState({
        title: '',
        category: 'study-materials',
        subject: '',
        class: '',
        description: '',
        fileUrl: '',
        fileType: 'pdf'
    });

    // Debug fileUrl changes in real-time
    useEffect(() => {
        console.log(`🔗 Real-time fileUrl update: "${newResource.fileUrl}"`);
    }, [newResource.fileUrl]);

    const [statistics, setStatistics] = useState({
        total: 0,
        studyMaterials: 0,
        pastPapers: 0,
        notes: 0,
        other: 0
    });

    // Fetch statistics whenever resource data changes
    useEffect(() => {
        const fetchStats = async () => {
            const stats = await getResourceStatistics();
            setStatistics(stats);
        };
        fetchStats();
    }, [resources]);

    const handleAddStaff = () => {
        if (newStaff.name.trim()) {
            const staffWithId = {
                ...newStaff,
                id: Date.now() // Temporary ID generation
            };
            setStaffMembers([...staffMembers, staffWithId]);
            setNewStaff({
                type: 'volunteer-teacher',
                name: '',
                designation: '',
                department: '',
                qualification: '',
                experience: '',
                email: '',
                phone: ''
            });
            setShowStaffForm(false);
        }
    };

    const handleDeleteStaff = (staffId) => {
        setStaffMembers(staffMembers.filter(staff => staff.id !== staffId));
    };

    const handleEditStaff = (staff) => {
        setNewStaff(staff);
        setShowStaffForm(true);
    };

    const handleAddResource = async () => {
        console.log(`🚀 Admin panel form submission - newResource state:`, newResource);
        console.log(`🔍 Form validation - title: "${newResource.title}", fileUrl: "${newResource.fileUrl}"`);
        
        if (newResource.title.trim()) {
            console.log(`✅ Form validation passed, calling addResource with:`, newResource);
            const result = await addResource(newResource);
            
            if (result.success) {
                console.log(`✅ Resource added successfully, resetting form`);
                // Reset form
                setNewResource({
                    title: '',
                    category: 'study-materials',
                    subject: '',
                    class: '',
                    description: '',
                    fileUrl: '',
                    fileType: 'pdf'
                });
                setShowAddForm(false);
            } else {
                console.error(`❌ Failed to add resource:`, result.error);
                alert('Failed to add resource: ' + result.error);
            }
        } else {
            console.warn(`⚠️ Form validation failed - title is empty`);
        }
    };

    // Test Firebase connection and add sample data
    const handleTestFirebase = async () => {
        console.log('🧪 Testing Firebase connection...');
        
        const sampleData = {
            title: 'Test Mathematics Guide',
            category: 'study-materials',
            subject: 'Mathematics',
            class: 'Year 1 Semester 1',
            description: 'This is a test resource to verify Firebase connectivity',
            fileUrl: 'https://drive.google.com/file/d/1abc123/view', // Test Google Drive URL
            fileType: 'pdf'
        };

        try {
            const result = await addResource(sampleData);
            if (result.success) {
                console.log('✅ Test data added successfully!');
                alert('Test data added successfully! Check if it appears in the list and outline section.');
            } else {
                console.error('❌ Failed to add test data:', result.error);
                alert('Failed to add test data: ' + result.error);
            }
        } catch (error) {
            console.error('❌ Error during test:', error);
            alert('Error during test: ' + error.message);
        }
    };

    // Test URL specifically
    const handleTestUrl = async () => {
        console.log('🔗 Testing URL storage specifically...');
        
        const testData = {
            title: 'URL Test Subject',
            category: 'study-materials',
            subject: 'URL Test Subject',
            class: 'Year 1 Semester 1',
            description: 'Testing if Google Drive URL gets stored',
            fileUrl: 'https://drive.google.com/file/d/1sample_google_drive_url/view?usp=sharing',
            fileType: 'pdf'
        };

        console.log('🔗 Test data with URL:', testData);
        
        try {
            const result = await addResource(testData);
            if (result.success) {
                console.log('✅ URL test successful!');
                alert('URL test successful! Check Firebase console for the URL.');
            } else {
                console.error('❌ URL test failed:', result.error);
                alert('URL test failed: ' + result.error);
            }
        } catch (error) {
            console.error('❌ URL test error:', error);
            alert('URL test error: ' + error.message);
        }
    };

    // Delete all resources
    const handleDeleteAllResources = async () => {
        if (confirm('⚠️ WARNING: This will delete ALL resources from Firebase!\n\nThis action cannot be undone. All data will be permanently removed.\n\nAre you absolutely sure you want to continue?')) {
            console.log('🗑️ User confirmed delete all resources operation');
            
            const result = await deleteAllResources();
            if (result.success) {
                console.log(`✅ Successfully deleted ${result.deletedCount} resources from Firebase`);
                alert(`✅ Successfully deleted ${result.deletedCount} resources from Firebase!\n\nAll data has been permanently removed.`);
            } else {
                console.error(`❌ Failed to delete all resources: ${result.error}`);
                alert(`❌ Failed to delete all resources: ${result.error}`);
            }
        } else {
            console.log('🚫 User cancelled delete all resources operation');
        }
    };

    // Complete reset - delete all data and create fresh setup
    const handleCompleteReset = async () => {
        if (!confirm('⚠️ COMPLETE RESET WARNING!\n\nThis will:\n1. Delete ALL outline, notes, past papers data from Firebase\n2. Clear admin panel cache\n3. Reset entire system\n\nThis action CANNOT be undone!\n\nAre you absolutely sure you want to continue?')) {
            console.log('🚫 User cancelled complete reset');
            return;
        }

        if (!confirm('🔒 FINAL CONFIRMATION REQUIRED!\n\nYou are about to permanently delete ALL academic data including:\n- Outline data\n- Notes data\n- Past papers data\n- All admin panel entries\n\nType "RESET" in the next prompt to confirm.')) {
            console.log('🚫 User cancelled final confirmation');
            return;
        }

        const finalConfirmation = prompt('Type "RESET" to confirm complete data deletion:');
        if (finalConfirmation !== 'RESET') {
            console.log('🚫 User failed final confirmation test');
            alert('❌ Reset cancelled - confirmation did not match "RESET"');
            return;
        }

        console.log('🔄 Starting complete system reset...');
        
        try {
            // Step 1: Delete all unified data
            console.log('�️ Step 1: Deleting all unified data from academic_data collection...');
            const deleteResult = await deleteAllResources();
            
            if (deleteResult.success) {
                console.log(`✅ Deleted ${deleteResult.deletedCount} items from academic_data collection`);
            } else {
                console.error('❌ Failed to delete unified data:', deleteResult.error);
                throw new Error(deleteResult.error);
            }

            // Step 2: Clear old collections if they exist
            console.log('�️ Step 2: Clearing old collections...');
            await clearOldCollections();

            // Step 3: Reset admin panel state
            console.log('🔄 Step 3: Resetting admin panel state...');
            setNewResource({
                title: '',
                category: 'study-materials',
                subject: '',
                class: '',
                description: '',
                fileUrl: '',
                fileType: 'pdf'
            });
            setShowAddForm(false);

            // Step 4: Force refresh data
            console.log('🔄 Step 4: Refreshing all data...');
            await fetchResources();

            console.log('✅ Complete reset successful!');
            alert(`✅ SYSTEM RESET COMPLETE!\n\n✅ Deleted ${deleteResult.deletedCount} items from Firebase\n✅ Cleared all old collections\n✅ Reset admin panel\n✅ Ready for fresh data entry\n\nYou can now add new outline, notes, and past papers data!`);

        } catch (error) {
            console.error('❌ Complete reset failed:', error);
            alert(`❌ Reset failed: ${error.message}\n\nPlease check console for details.`);
        }
    };

    // Clear old collections
    const clearOldCollections = async () => {
        try {
            console.log('🧹 Clearing old Firebase collections...');
            
            // Import Firebase functions
            const { db } = await import('../../firebase/firebase');
            const { collection, getDocs, query, deleteDoc, doc } = await import('firebase/firestore');
            
            const collections = ['media_files', 'academic_structure', 'resources'];
            
            for (const collectionName of collections) {
                console.log(`🗑️ Clearing collection: ${collectionName}`);
                
                try {
                    const collRef = collection(db, collectionName);
                    const q = query(collRef);
                    const querySnapshot = await getDocs(q);
                    
                    if (querySnapshot.docs.length > 0) {
                        const deletePromises = querySnapshot.docs.map(docSnapshot => 
                            deleteDoc(doc(db, collectionName, docSnapshot.id))
                        );
                        
                        await Promise.all(deletePromises);
                        console.log(`✅ Cleared ${deletePromises.length} documents from ${collectionName}`);
                    } else {
                        console.log(`ℹ️ No documents found in ${collectionName}`);
                    }
                } catch (error) {
                    console.warn(`⚠️ Could not clear collection ${collectionName}:`, error.message);
                }
            }
            
            console.log('✅ Old collections cleared');
        } catch (error) {
            console.error('❌ Error clearing old collections:', error);
        }
    };

    // Test URL upload specifically
    const handleTestUrlUpload = async () => {
        console.log('🔗 Testing URL upload specifically...');
        
        const testData = {
            title: 'URL Upload Test',
            category: 'study-materials',
            subject: 'URL Upload Test',
            class: 'Year 1 Semester 1',
            description: 'Testing if URL gets uploaded to Firebase correctly',
            fileUrl: 'https://drive.google.com/file/d/1ABC123XYZ_TEST_URL/view?usp=sharing',
            fileType: 'pdf'
        };

        console.log('🔗 Test data for URL upload:', testData);
        console.log('🔍 fileUrl field value:', `"${testData.fileUrl}"`);
        console.log('🔍 fileUrl field type:', typeof testData.fileUrl);
        console.log('🔍 fileUrl field length:', testData.fileUrl.length);
        
        try {
            const result = await addResource(testData);
            if (result.success) {
                console.log('✅ URL upload test successful!');
                alert('✅ URL upload test successful!\n\nCheck console for detailed Firebase save verification.\n\nNow check if the URL appears in the outline section.');
                
                // Test the outline section after a delay
                setTimeout(async () => {
                    console.log('🔍 Testing outline section after URL upload...');
                    await handleTestOutlineData();
                }, 2000);
            } else {
                console.error('❌ URL upload test failed:', result.error);
                alert('❌ URL upload test failed: ' + result.error);
            }
        } catch (error) {
            console.error('❌ URL upload test error:', error);
            alert('❌ URL upload test error: ' + error.message);
        }
    };

    // Add sample outline data for testing
    const handleAddSampleOutline = async () => {
        console.log('📝 Adding sample outline data for testing...');
        
        const sampleData = {
            title: 'Educational Psychology',
            category: 'study-materials',
            subject: 'Educational Psychology',
            class: 'Year 1 Semester 1',
            description: 'Sample outline data for testing the display in outline section',
            fileUrl: 'https://drive.google.com/file/d/1sample_test_outline/view?usp=sharing',
            fileType: 'pdf'
        };

        console.log('📝 Sample outline data:', sampleData);
        
        try {
            const result = await addResource(sampleData);
            if (result.success) {
                console.log('✅ Sample outline added successfully!');
                alert('✅ Sample outline added successfully!\n\nNow check the outline section to see if it displays properly.');
                
                // Test the outline section
                setTimeout(async () => {
                    await handleTestOutlineData();
                }, 1000);
            } else {
                console.error('❌ Failed to add sample outline:', result.error);
                alert('❌ Failed to add sample outline: ' + result.error);
            }
        } catch (error) {
            console.error('❌ Error adding sample outline:', error);
            alert('❌ Error adding sample outline: ' + error.message);
        }
    };

    const handleUpdateResource = async (updatedResource) => {
        console.log(`🔄 Admin panel updating resource: ${updatedResource.title || updatedResource.subject}`);
        
        const result = await updateResource(updatedResource.id, updatedResource);
        if (result.success) {
            console.log(`✅ Smart update completed successfully`);
            alert(`✅ Resource updated successfully!\n\nOld data was removed and new data was added to Firebase.\nThe outline section will now show the updated information.`);
        } else {
            console.error(`❌ Smart update failed: ${result.error}`);
            alert(`❌ Failed to update resource: ${result.error}`);
        }
    };

    const handleRemoveSemester = async (category, year, semester) => {
        const categoryName = category === 'study-materials' ? 'Outlines' : 
                           category === 'notes' ? 'Notes' : 
                           category === 'past-papers' ? 'Past Papers' : 'Other';
        
        if (confirm(`Are you sure you want to remove ALL ${categoryName} for Year ${year}, Semester ${semester}?\n\nThis will permanently delete all subjects in this semester from Firebase.`)) {
            console.log(`🗑️ Admin panel removing semester: ${category}, Year ${year}, Sem ${semester}`);
            
            const result = await removeSemesterData(category, parseInt(year), parseInt(semester));
            if (result.success) {
                console.log(`✅ Semester removed successfully (${result.removedCount} records)`);
                alert(`✅ All ${categoryName} for Year ${year}, Semester ${semester} have been removed!\n\n${result.removedCount} records were deleted from Firebase.`);
            } else {
                console.error(`❌ Failed to remove semester: ${result.error}`);
                alert(`❌ Failed to remove semester: ${result.error}`);
            }
        }
    };

    const handleDeleteResource = async (resourceId) => {
        const resource = resources.find(r => r.id === resourceId);
        const resourceName = resource?.title || resource?.subject || 'this resource';
        
        if (confirm(`Are you sure you want to delete "${resourceName}"?\n\nThis will permanently remove it from Firebase and the outline section.`)) {
            console.log(`🗑️ Admin panel deleting resource: ${resourceId} (${resourceName})`);
            
            const result = await deleteResource(resourceId);
            if (result.success) {
                console.log(`✅ Successfully deleted resource: ${resourceName}`);
                alert(`✅ "${resourceName}" has been deleted successfully!\n\nIt has been completely removed from Firebase.`);
            } else {
                console.error(`❌ Failed to delete resource: ${result.error}`);
                alert(`❌ Failed to delete resource: ${result.error}`);
            }
        } else {
            console.log(`🚫 Delete cancelled for resource: ${resourceId}`);
        }
    };

    // Filter resources based on selected category and search term
    const filteredResources = resources.filter(resource => {
        console.log(`🔍 Filtering resource:`, resource);
        
        const matchesCategory = filter === 'all' || resource.category === filter;
        const matchesSearch = searchTerm === '' || 
            (resource.title && resource.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (resource.subject && resource.subject.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const result = matchesCategory && matchesSearch;
        console.log(`📊 Filter result for "${resource.title || resource.subject}":`, {
            matchesCategory,
            matchesSearch,
            filter,
            searchTerm,
            result
        });
        
        return result;
    });

    const getResourceCountByCategory = (category) => {
        return resources.filter(r => r.category === category).length;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Resource Management</h1>
                            <p className="text-gray-600 mt-2">Manage educational resources, study materials, and documents</p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold mr-2"
                        >
                            {showAddForm ? 'Cancel' : 'Add New Resource'}
                        </button>
                        <button
                            onClick={() => setShowStaffForm(!showStaffForm)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold mr-2"
                        >
                            {showStaffForm ? 'Cancel' : 'Add Staff Member'}
                        </button>
                        <button
                            onClick={handleTestFirebase}
                            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                        >
                            Test Firebase
                        </button>
                                                <button
                        <button
                            onClick={handleTestOutlineData}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            Test Outline
                        </button>
                        <button
                        <button
                            onClick={handleAddSampleOutline}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            📝 Add Sample Outline
                        </button>
                                            </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700">Study Materials</h3>
                        <p className="text-2xl font-bold text-blue-600">{statistics.studyMaterials}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700">Past Papers</h3>
                        <p className="text-2xl font-bold text-green-600">{statistics.pastPapers}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-700">Notes</h3>
                        <p className="text-2xl font-bold text-purple-600">{statistics.notes}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                        <h3 className="text-lg font-semibold text-gray-700">Other</h3>
                        <p className="text-2xl font-bold text-orange-600">{statistics.other}</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search resources by title, subject, or description..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div className="text-gray-600 self-center">
                            Total Resources: <span className="font-bold text-green-600">{statistics.total}</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-wrap space-x-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'all' 
                                    ? 'bg-gray-800 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            All Resources ({statistics.total})
                        </button>
                        <button
                            onClick={() => setFilter('study-materials')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'study-materials' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Study Materials ({statistics.studyMaterials})
                        </button>
                        <button
                            onClick={() => setFilter('past-papers')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'past-papers' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Past Papers ({statistics.pastPapers})
                        </button>
                        <button
                            onClick={() => setFilter('notes')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'notes' 
                                    ? 'bg-purple-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Notes ({statistics.notes})
                        </button>
                        <button
                            onClick={() => setFilter('other')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'other' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Other ({statistics.other})
                        </button>
                    </div>
                </div>

                {/* Add New Staff Form */}
                {showStaffForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-blue-500">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Staff Member</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                                <select
                                    value={newStaff.type}
                                    onChange={(e) => setNewStaff({...newStaff, type: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="volunteer-teacher">Volunteer Teacher</option>
                                    <option value="faculty-member">Faculty Member</option>
                                    <option value="visiting-faculty">Visiting Faculty</option>
                                    <option value="volunteer-teacher-2">Volunteer Teacher</option>
                                    <option value="non-teaching-staff">Non-Teaching Staff</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                                <input
                                    type="text"
                                    value={newStaff.designation}
                                    onChange={(e) => setNewStaff({...newStaff, designation: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <input
                                    type="text"
                                    value={newStaff.department}
                                    onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                <input
                                    type="text"
                                    value={newStaff.qualification}
                                    onChange={(e) => setNewStaff({...newStaff, qualification: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                <input
                                    type="text"
                                    value={newStaff.experience}
                                    onChange={(e) => setNewStaff({...newStaff, experience: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newStaff.email}
                                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={newStaff.phone}
                                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowStaffForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddStaff}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                disabled={!newStaff.name.trim()}
                            >
                                Add Staff Member
                            </button>
                        </div>
                    </div>
                )}

                {/* Add New Resource Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-green-500">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Resource</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                <input
                                    type="text"
                                    value={newResource.title}
                                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={newResource.category}
                                    onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    <option value="study-materials">Study Materials</option>
                                    <option value="past-papers">Past Papers</option>
                                    <option value="notes">Notes</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                <input
                                    type="text"
                                    value={newResource.subject}
                                    onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Class/Batch</label>
                                <input
                                    type="text"
                                    value={newResource.class}
                                    onChange={(e) => setNewResource({...newResource, class: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={newResource.description}
                                    onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                    rows="3"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                                <input
                                    type="text"
                                    value={newResource.fileUrl}
                                    onChange={(e) => setNewResource({...newResource, fileUrl: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                    placeholder="Enter file URL"
                                />
                            </div>
                            <div>
                                                            </div>
                        </div>
                        <div className="flex justify-end space-x-2 mt-4">
                            <button
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddResource}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                disabled={!newResource.title.trim()}
                            >
                                Add Resource
                            </button>
                        </div>
                    </div>
                )}

                {/* Staff Members List */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Staff Members ({staffMembers.length} members)
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {staffMembers.map((staff) => (
                            <ResourceStaffCard
                                key={staff.id}
                                {...staff}
                                onEdit={() => handleEditStaff(staff)}
                                onDelete={() => handleDeleteStaff(staff.id)}
                            />
                        ))}
                    </div>
                </div>

                {/* Resources List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Resources List ({filteredResources.length} items)
                    </h2>
                    
                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <p className="text-gray-500 mt-2">Loading resources...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    
                    {!loading && !error && filteredResources.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No resources found</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Add First Resource
                            </button>
                        </div>
                    ) : (
                        !loading && !error && (
                            <div className="space-y-4">
                                {filteredResources.map((resource) => (
                                    <ResourceCard
                                        key={resource.id}
                                        resource={resource}
                                        onUpdate={handleUpdateResource}
                                        onDelete={handleDeleteResource}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceManagement;
