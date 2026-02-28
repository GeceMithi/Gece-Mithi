import React, { useState } from 'react';

const StaffCard = ({ staff, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedStaff, setEditedStaff] = useState(staff);

    const handleSave = () => {
        onUpdate(editedStaff);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedStaff(staff);
        setIsEditing(false);
    };

    const getCardColor = () => {
        switch(staff.category) {
            case 'volunteer':
                return 'border-blue-500 bg-blue-50';
            case 'faculty':
                return 'border-green-500 bg-green-50';
            case 'visiting-faculty':
                return 'border-purple-500 bg-purple-50';
            case 'non-teaching':
                return 'border-orange-500 bg-orange-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    const getCategoryBadge = () => {
        switch(staff.category) {
            case 'volunteer':
                return 'bg-blue-500 text-white';
            case 'faculty':
                return 'bg-green-500 text-white';
            case 'visiting-faculty':
                return 'bg-purple-500 text-white';
            case 'non-teaching':
                return 'bg-orange-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getCategoryLabel = () => {
        switch(staff.category) {
            case 'volunteer':
                return 'Volunteer';
            case 'faculty':
                return 'Faculty Member';
            case 'visiting-faculty':
                return 'Visiting Faculty';
            case 'non-teaching':
                return 'Non-Teaching Staff';
            default:
                return 'Staff';
        }
    };

    if (isEditing) {
        return (
            <div className={`border-2 rounded-lg p-6 mb-4 ${getCardColor()}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            type="text"
                            value={editedStaff.name}
                            onChange={(e) => setEditedStaff({...editedStaff, name: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={editedStaff.category}
                            onChange={(e) => setEditedStaff({...editedStaff, category: e.target.value})}
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
                            value={editedStaff.designation}
                            onChange={(e) => setEditedStaff({...editedStaff, designation: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                        <input
                            type="text"
                            value={editedStaff.department}
                            onChange={(e) => setEditedStaff({...editedStaff, department: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            value={editedStaff.email}
                            onChange={(e) => setEditedStaff({...editedStaff, email: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={editedStaff.phone}
                            onChange={(e) => setEditedStaff({...editedStaff, phone: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                        <input
                            type="text"
                            value={editedStaff.qualification}
                            onChange={(e) => setEditedStaff({...editedStaff, qualification: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                        <input
                            type="text"
                            value={editedStaff.experience}
                            onChange={(e) => setEditedStaff({...editedStaff, experience: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                    <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                    >
                        Save
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`border-2 rounded-lg p-6 mb-4 ${getCardColor()} hover:shadow-lg transition-shadow`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-600">
                            {staff.name ? staff.name.charAt(0).toUpperCase() : '?'}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{staff.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryBadge()}`}>
                            {getCategoryLabel()}
                        </span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(staff.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <span className="font-semibold text-gray-700">Designation:</span>
                    <p className="text-gray-600">{staff.designation || 'N/A'}</p>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Department:</span>
                    <p className="text-gray-600">{staff.department || 'N/A'}</p>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Email:</span>
                    <p className="text-gray-600">{staff.email || 'N/A'}</p>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Phone:</span>
                    <p className="text-gray-600">{staff.phone || 'N/A'}</p>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Qualification:</span>
                    <p className="text-gray-600">{staff.qualification || 'N/A'}</p>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Experience:</span>
                    <p className="text-gray-600">{staff.experience || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default StaffCard;
