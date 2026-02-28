import React, { useState } from 'react';

const ResourceCard = ({ resource, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedResource, setEditedResource] = useState(resource);

    const handleSave = () => {
        onUpdate(editedResource);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditedResource(resource);
        setIsEditing(false);
    };

    const getCardColor = () => {
        switch(resource.category) {
            case 'study-materials':
                return 'border-blue-500 bg-blue-50';
            case 'past-papers':
                return 'border-green-500 bg-green-50';
            case 'notes':
                return 'border-purple-500 bg-purple-50';
            case 'other':
                return 'border-orange-500 bg-orange-50';
            default:
                return 'border-gray-500 bg-gray-50';
        }
    };

    const getCategoryBadge = () => {
        switch(resource.category) {
            case 'study-materials':
                return 'bg-blue-500 text-white';
            case 'past-papers':
                return 'bg-green-500 text-white';
            case 'notes':
                return 'bg-purple-500 text-white';
            case 'other':
                return 'bg-orange-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getCategoryLabel = () => {
        switch(resource.category) {
            case 'study-materials':
                return 'Study Materials';
            case 'past-papers':
                return 'Past Papers';
            case 'notes':
                return 'Notes';
            case 'other':
                return 'Other';
            default:
                return 'Resource';
        }
    };

    const getFileIcon = () => {
        if (resource.fileType === 'pdf') return '📄';
        if (resource.fileType === 'doc' || resource.fileType === 'docx') return '📝';
        if (resource.fileType === 'ppt' || resource.fileType === 'pptx') return '📊';
        if (resource.fileType === 'xls' || resource.fileType === 'xlsx') return '📈';
        if (resource.fileType === 'zip' || resource.fileType === 'rar') return '📦';
        if (resource.fileType === 'jpg' || resource.fileType === 'png' || resource.fileType === 'gif') return '🖼️';
        return '📎';
    };

    if (isEditing) {
        return (
            <div className={`border-2 rounded-lg p-6 mb-4 ${getCardColor()}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            value={editedResource.title}
                            onChange={(e) => setEditedResource({...editedResource, title: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                            value={editedResource.category}
                            onChange={(e) => setEditedResource({...editedResource, category: e.target.value})}
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
                            value={editedResource.subject}
                            onChange={(e) => setEditedResource({...editedResource, subject: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Class/Batch</label>
                        <input
                            type="text"
                            value={editedResource.class}
                            onChange={(e) => setEditedResource({...editedResource, class: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={editedResource.description}
                            onChange={(e) => setEditedResource({...editedResource, description: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            rows="3"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File URL</label>
                        <input
                            type="text"
                            value={editedResource.fileUrl}
                            onChange={(e) => setEditedResource({...editedResource, fileUrl: e.target.value})}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            placeholder="Enter file URL or upload file"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">File Type</label>
                        <select
                            value={editedResource.fileType}
                            onChange={(e) => setEditedResource({...editedResource, fileType: e.target.value})}
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
                    <div className="text-3xl">{getFileIcon()}</div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{resource.title}</h3>
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
                        onClick={() => onDelete(resource.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                    >
                        Delete
                    </button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <span className="font-semibold text-gray-700">Subject:</span>
                    <p className="text-gray-600">{resource.subject || 'N/A'}</p>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Class/Batch:</span>
                    <p className="text-gray-600">{resource.class || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                    <span className="font-semibold text-gray-700">Description:</span>
                    <p className="text-gray-600">{resource.description || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                    <span className="font-semibold text-gray-700">File:</span>
                    {resource.fileUrl ? (
                        <a 
                            href={resource.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 mt-1"
                        >
                            <span className="mr-2">{getFileIcon()}</span>
                            View/Download Resource
                        </a>
                    ) : (
                        <p className="text-gray-500">No file available</p>
                    )}
                </div>
                <div>
                    <span className="font-semibold text-gray-700">Added Date:</span>
                    <p className="text-gray-600">
                        {resource.addedDate ? new Date(resource.addedDate).toLocaleDateString() : 'N/A'}
                    </p>
                </div>
                <div>
                    <span className="font-semibold text-gray-700">File Type:</span>
                    <p className="text-gray-600">{resource.fileType || 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default ResourceCard;
