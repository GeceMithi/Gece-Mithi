import React, { useState, useEffect } from 'react';
import StaffCard from './card/staffcard';
import useStaffData from '../hook/useStaffData';

const StaffManagement = () => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Use custom hook for Firebase operations
    const {
        staff,
        loading,
        error,
        addStaff,
        updateStaff,
        deleteStaff,
        getStaffStatistics
    } = useStaffData();

    const [newStaff, setNewStaff] = useState({
        name: '',
        category: 'volunteer',
        designation: '',
        department: '',
        email: '',
        phone: '',
        qualification: '',
        experience: ''
    });

    const [statistics, setStatistics] = useState({
        total: 0,
        volunteer: 0,
        faculty: 0,
        visitingFaculty: 0,
        nonTeaching: 0
    });

    // Fetch statistics whenever staff data changes
    useEffect(() => {
        const fetchStats = async () => {
            const stats = await getStaffStatistics();
            setStatistics(stats);
        };
        fetchStats();
    }, [staff]);

    const handleAddStaff = async () => {
        if (newStaff.name.trim()) {
            const result = await addStaff(newStaff);
            if (result.success) {
                setNewStaff({
                    name: '',
                    category: 'volunteer',
                    designation: '',
                    department: '',
                    email: '',
                    phone: '',
                    qualification: '',
                    experience: ''
                });
                setShowAddForm(false);
                alert('Staff member added successfully!');
            } else {
                alert('Failed to add staff member: ' + result.error);
            }
        }
    };

    const handleUpdateStaff = async (updatedStaff) => {
        const result = await updateStaff(updatedStaff.id, updatedStaff);
        if (result.success) {
            alert('Staff member updated successfully!');
        } else {
            alert('Failed to update staff member: ' + result.error);
        }
    };

    const handleDeleteStaff = async (staffId) => {
        if (confirm('Are you sure you want to delete this staff member?')) {
            const result = await deleteStaff(staffId);
            if (result.success) {
                alert('Staff member deleted successfully!');
            } else {
                alert('Failed to delete staff member: ' + result.error);
            }
        }
    };

    // Filter staff based on selected category and search term
    const filteredStaff = staff.filter(staffMember => {
        const matchesCategory = filter === 'all' || staffMember.category === filter;
        const matchesSearch = searchTerm === '' || 
            staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staffMember.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            staffMember.designation.toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesCategory && matchesSearch;
    });

    const getStaffCountByCategory = (category) => {
        return staff.filter(s => s.category === category).length;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Staff Management</h1>
                            <p className="text-gray-600 mt-2">Manage GECE Mithi Staff Members</p>
                        </div>
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                        >
                            {showAddForm ? 'Cancel' : 'Add New Staff'}
                        </button>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700">Volunteers</h3>
                        <p className="text-2xl font-bold text-blue-600">{statistics.volunteer}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700">Faculty</h3>
                        <p className="text-2xl font-bold text-green-600">{statistics.faculty}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-700">Visiting Faculty</h3>
                        <p className="text-2xl font-bold text-purple-600">{statistics.visitingFaculty}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-orange-500">
                        <h3 className="text-lg font-semibold text-gray-700">Non-Teaching</h3>
                        <p className="text-2xl font-bold text-orange-600">{statistics.nonTeaching}</p>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search staff by name, email, or designation..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div className="text-gray-600 self-center">
                            Total Staff: <span className="font-bold text-green-600">{statistics.total}</span>
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
                            All Staff ({statistics.total})
                        </button>
                        <button
                            onClick={() => setFilter('volunteer')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'volunteer' 
                                    ? 'bg-blue-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Volunteers ({statistics.volunteer})
                        </button>
                        <button
                            onClick={() => setFilter('faculty')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'faculty' 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Faculty ({statistics.faculty})
                        </button>
                        <button
                            onClick={() => setFilter('visiting-faculty')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'visiting-faculty' 
                                    ? 'bg-purple-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Visiting Faculty ({statistics.visitingFaculty})
                        </button>
                        <button
                            onClick={() => setFilter('non-teaching')}
                            className={`px-4 py-2 rounded-lg font-medium transition mb-2 ${
                                filter === 'non-teaching' 
                                    ? 'bg-orange-500 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Non-Teaching ({statistics.nonTeaching})
                        </button>
                    </div>
                </div>

                {/* Add New Staff Form */}
                {showAddForm && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-2 border-green-500">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Staff Member</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                                <input
                                    type="text"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={newStaff.category}
                                    onChange={(e) => setNewStaff({...newStaff, category: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                >
                                    <option value="volunteer">Volunteer</option>
                                    <option value="faculty">Faculty Member</option>
                                    <option value="visiting-faculty">Visiting Faculty</option>
                                    <option value="non-teaching">Non-Teaching Staff</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                                <input
                                    type="text"
                                    value={newStaff.designation}
                                    onChange={(e) => setNewStaff({...newStaff, designation: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    value={newStaff.department}
                                    onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={newStaff.email}
                                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={newStaff.phone}
                                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                                <input
                                    type="text"
                                    value={newStaff.qualification}
                                    onChange={(e) => setNewStaff({...newStaff, qualification: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                                <input
                                    type="text"
                                    value={newStaff.experience}
                                    onChange={(e) => setNewStaff({...newStaff, experience: e.target.value})}
                                    className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                                />
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
                                onClick={handleAddStaff}
                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                disabled={!newStaff.name.trim()}
                            >
                                Add Staff
                            </button>
                        </div>
                    </div>
                )}

                {/* Staff List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">
                        Staff List ({filteredStaff.length} members)
                    </h2>
                    
                    {loading && (
                        <div className="text-center py-8">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            <p className="text-gray-500 mt-2">Loading staff data...</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    
                    {!loading && !error && filteredStaff.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg">No staff members found</p>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                            >
                                Add First Staff Member
                            </button>
                        </div>
                    ) : (
                        !loading && !error && (
                            <div className="space-y-4">
                                {filteredStaff.map((staffMember) => (
                                    <StaffCard
                                        key={staffMember.id}
                                        staff={staffMember}
                                        onUpdate={handleUpdateStaff}
                                        onDelete={handleDeleteStaff}
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

export default StaffManagement;
