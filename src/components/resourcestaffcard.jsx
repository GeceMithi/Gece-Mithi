import React from 'react';

const ResourceStaffCard = ({ 
    type, 
    name, 
    designation, 
    department, 
    qualification, 
    experience, 
    email, 
    phone, 
    image,
    onEdit,
    onDelete 
}) => {
    // Card colors based on staff type
    const getCardColor = () => {
        switch(type) {
            case 'volunteer-teacher':
                return 'border-blue-400 bg-blue-50';
            case 'faculty-member':
                return 'border-green-400 bg-green-50';
            case 'visiting-faculty':
                return 'border-purple-400 bg-purple-50';
            case 'volunteer-teacher-2':
                return 'border-orange-400 bg-orange-50';
            case 'non-teaching-staff':
                return 'border-gray-400 bg-gray-50';
            default:
                return 'border-[#ffd200] bg-white';
        }
    };

    // Badge colors
    const getBadgeColor = () => {
        switch(type) {
            case 'volunteer-teacher':
                return 'bg-blue-500 text-white';
            case 'faculty-member':
                return 'bg-green-500 text-white';
            case 'visiting-faculty':
                return 'bg-purple-500 text-white';
            case 'volunteer-teacher-2':
                return 'bg-orange-500 text-white';
            case 'non-teaching-staff':
                return 'bg-gray-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    // Type labels
    const getTypeLabel = () => {
        switch(type) {
            case 'volunteer-teacher':
                return 'Volunteer Teacher';
            case 'faculty-member':
                return 'Faculty Member';
            case 'visiting-faculty':
                return 'Visiting Faculty';
            case 'volunteer-teacher-2':
                return 'Volunteer Teacher';
            case 'non-teaching-staff':
                return 'Non-Teaching Staff';
            default:
                return 'Staff Member';
        }
    };

    return (
        <div className={`border-2 rounded-lg p-4 shadow-md hover:shadow-lg transition-all duration-300 ${getCardColor()}`}>
            {/* Header with type badge */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                    {/* Profile Image */}
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                        {image ? (
                            <img 
                                src={image} 
                                alt={name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                <span className="text-gray-600 text-xl font-bold">
                                    {name ? name.charAt(0).toUpperCase() : '?'}
                                </span>
                            </div>
                        )}
                    </div>
                    
                    {/* Name and Designation */}
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{name}</h3>
                        <p className="text-gray-600 text-sm">{designation}</p>
                    </div>
                </div>

                {/* Type Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getBadgeColor()}`}>
                    {getTypeLabel()}
                </div>
            </div>

            {/* Staff Details */}
            <div className="space-y-2 text-sm">
                {department && (
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Department:</span>
                        <span className="text-gray-600">{department}</span>
                    </div>
                )}

                {qualification && (
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Qualification:</span>
                        <span className="text-gray-600">{qualification}</span>
                    </div>
                )}

                {experience && (
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Experience:</span>
                        <span className="text-gray-600">{experience}</span>
                    </div>
                )}

                {email && (
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Email:</span>
                        <span className="text-blue-600 hover:underline">{email}</span>
                    </div>
                )}

                {phone && (
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-700">Phone:</span>
                        <span className="text-gray-600">{phone}</span>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-[#ffd200]">
                {onEdit && (
                    <button
                        onClick={() => onEdit()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200 text-sm font-medium"
                    >
                        Edit
                    </button>
                )}
                {onDelete && (
                    <button
                        onClick={() => onDelete()}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
                    >
                        Delete
                    </button>
                )}
            </div>
        </div>
    );
};

export default ResourceStaffCard;
