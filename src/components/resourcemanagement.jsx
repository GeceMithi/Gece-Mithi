import React, { useState, useEffect } from 'react';
import ResourceCard from './resourcecard';
import ResourceStaffCard from './resourcestaffcard';
import useResourceData from '../hook/useResourceData';

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
        getResourceStatistics
    } = useResourceData();

    const [newResource, setNewResource] = useState({
        title: '',
        category: 'study-materials',
        subject: '',
        class: '',
        description: '',
        fileUrl: '',
        fileType: 'pdf'
    });

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
        if (newResource.title.trim()) {
            const result = await addResource(newResource);
            if (result.success) {
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
                alert('Resource added successfully!');
            } else {
                alert('Failed to add resource: ' + result.error);
            }
        }
    };

    const handleUpdateResource = async (updatedResource) => {
        const result = await updateResource(updatedResource.id, updatedResource);
        if (result.success) {
            alert('Resource updated successfully!');
        } else {
            alert('Failed to update resource: ' + result.error);
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (confirm('Are you sure you want to delete this resource?')) {
            const result = await deleteResource(resourceId);
            if (result.success) {
                alert('Resource deleted successfully!');
            } else {
                alert('Failed to delete resource: ' + result.error);
            }
        }
    };

    // Filter resources based on selected category and search term
    const filteredResources = resources.filter(resource => {
        const matchesCategory = filter === 'all' || resource.category === filter;
        const matchesSearch = searchTerm === '' || 
            resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resource.subject.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch;
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
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                        >
                            {showStaffForm ? 'Cancel' : 'Add Staff Member'}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                                <select
                                    value={newResource.fileType}
                                    onChange={(e) => setNewResource({...newResource, fileType: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="doc">Word Document</option>
                                    <option value="ppt">PowerPoint</option>
                                    <option value="xls">Excel</option>
                                    <option value="zip">Archive</option>
                                    <option value="jpg">Image</option>
                                    <option value="other">Other</option>
                                </select>
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
