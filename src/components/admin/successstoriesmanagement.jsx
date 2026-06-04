import React, { useState, useRef } from 'react';
import useSuccessStories from '../../hook/useSuccessStories';
import cloudinaryService from '../../services/cloudinaryService';
import menlogo from '../../assets/staff/menlogo.png';
import womenlogo from '../../assets/staff/womenlogo.png';

const SuccessStoriesManagement = () => {
    const { 
        stories, 
        loading, 
        error, 
        addSuccessStory, 
        updateSuccessStory, 
        deleteSuccessStory, 
        toggleStoryStatus 
    } = useSuccessStories();

    const [showAddForm, setShowAddForm] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [newStory, setNewStory] = useState({
        name: '',
        prefix: 'Mr.',
        role: '',
        batch: '',
        message: '',
        achievements: [],
        profileImage: ''
    });

    const fileInputRef = useRef(null);

    // Handle image upload
    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        console.log('🔍 Debugging image upload...');
        console.log('File details:', {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert('Only image files (JPEG, PNG, WebP) are allowed');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        try {
            setUploading(true);
            console.log('📤 Uploading profile image to Cloudinary...');
            
            // Upload to Cloudinary; do not use Firebase Storage for story images
            const result = await cloudinaryService.uploadFile(file, 'success_stories');
            const imageUrl = result.url;
            console.log('Upload result:', imageUrl);
            
            setNewStory(prev => ({ ...prev, profileImage: imageUrl }));
            setImagePreview(imageUrl);
            
            console.log('✅ Profile image uploaded successfully');
            alert('✅ Profile image uploaded successfully!');
        } catch (error) {
            console.error('❌ Error uploading image:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            alert(`❌ Failed to upload image: ${error.message}`);
        } finally {
            setUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!newStory.name || !newStory.message) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            const storyData = {
                ...newStory,
                fullName: `${newStory.prefix || 'Mr.'} ${newStory.name}`,
                achievements: newStory.achievements.filter(achievement => achievement.trim() !== ''),
                profileImage: newStory.profileImage || menlogo
            };

            if (editingStory) {
                await updateSuccessStory(editingStory.id, storyData);
                alert('✅ Success story updated successfully!');
            } else {
                await addSuccessStory(storyData);
                alert('✅ Success story added successfully!');
            }

            // Reset form
            resetForm();
        } catch (error) {
            console.error('❌ Error saving story:', error);
            alert(`❌ Failed to save story: ${error.message}`);
        }
    };

    // Reset form
    const resetForm = () => {
        setNewStory({
            name: '',
            prefix: 'Mr.',
            role: '',
            batch: '',
            message: '',
            achievements: [],
            profileImage: ''
        });
        setEditingStory(null);
        setShowAddForm(false);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle edit
    const handleEdit = (story) => {
        setEditingStory(story);
        setNewStory({
            name: story.name,
            prefix: story.prefix || 'Mr.',
            role: story.role,
            batch: story.batch || '',
            message: story.message,
            achievements: story.achievements || [],
            profileImage: story.profileImage || story.imageUrl || story.fileUrl || ''
        });
        setImagePreview(story.profileImage || story.imageUrl || story.fileUrl || null);
        setShowAddForm(true);
    };

    // Handle delete
    const handleDelete = async (storyId) => {
        if (confirm('Are you sure you want to delete this success story?')) {
            try {
                await deleteSuccessStory(storyId);
                alert('✅ Success story deleted successfully!');
            } catch (error) {
                console.error('❌ Error deleting story:', error);
                alert(`❌ Failed to delete story: ${error.message}`);
            }
        }
    };

    // Handle toggle status
    const handleToggleStatus = async (storyId, isActive) => {
        try {
            await toggleStoryStatus(storyId, isActive);
            alert(`✅ Story ${isActive ? 'activated' : 'deactivated'} successfully!`);
        } catch (error) {
            console.error('❌ Error toggling status:', error);
            alert(`❌ Failed to update status: ${error.message}`);
        }
    };

    // Add achievement
    const addAchievement = () => {
        setNewStory(prev => ({
            ...prev,
            achievements: [...prev.achievements, '']
        }));
    };

    // Update achievement
    const updateAchievement = (index, value) => {
        setNewStory(prev => ({
            ...prev,
            achievements: prev.achievements.map((achievement, i) => 
                i === index ? value : achievement
            )
        }));
    };

    // Remove achievement
    const removeAchievement = (index) => {
        setNewStory(prev => ({
            ...prev,
            achievements: prev.achievements.filter((_, i) => i !== index)
        }));
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
                    <p className="mt-4 text-gray-600">Loading success stories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#004d00] mb-2">Success Stories Management</h1>
                <p className="text-gray-600">Manage alumni success stories and achievements</p>
            </div>

            {/* Add/Edit Form */}
            {showAddForm && (
                <div className="bg-white rounded-2xl shadow-lg border-2 border-[#FFD700] p-6 mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#004d00]">
                            {editingStory ? 'Edit Success Story' : 'Add New Success Story'}
                        </h2>
                        <button
                            onClick={resetForm}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Profile Image Upload */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Profile Image
                                </label>
                                <div className="flex items-center space-x-6">
                                    <div className="w-24 h-24">
                                        <img
                                            src={imagePreview || menlogo}
                                            alt="Profile"
                                            className="w-full h-full object-cover rounded-full border-2 border-[#004d00]"
                                        />
                                    </div>
                                    <div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            className="bg-[#004d00] text-white px-4 py-2 rounded hover:bg-[#006400] disabled:opacity-50"
                                        >
                                            {uploading ? 'Uploading...' : 'Upload Image'}
                                        </button>
                                        <p className="text-xs text-gray-500 mt-1">
                                            JPEG, PNG, WebP (max 5MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Name with Prefix */}
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Prefix
                                    </label>
                                    <select
                                        value={newStory.prefix}
                                        onChange={(e) => setNewStory(prev => ({ ...prev, prefix: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d00]"
                                    >
                                        <option value="Mr.">Mr.</option>
                                        <option value="Mrs.">Mrs.</option>
                                        <option value="Ms.">Ms.</option>
                                        <option value="Dr.">Dr.</option>
                                        <option value="Prof.">Prof.</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={newStory.name}
                                        onChange={(e) => setNewStory(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d00]"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Role/Position *
                                </label>
                                <input
                                    type="text"
                                    value={newStory.role}
                                    onChange={(e) => setNewStory(prev => ({ ...prev, role: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d00]"
                                    placeholder="e.g., EST & SST, Principal, etc."
                                    required
                                />
                            </div>

                            {/* Batch */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Batch
                                </label>
                                <input
                                    type="text"
                                    value={newStory.batch}
                                    onChange={(e) => setNewStory(prev => ({ ...prev, batch: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d00]"
                                    placeholder="e.g., 2017, 2018, etc."
                                />
                            </div>

                            
                            {/* Full Story */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Story *
                                </label>
                                <textarea
                                    value={newStory.message}
                                    onChange={(e) => setNewStory(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d00]"
                                    rows={8}
                                    required
                                />
                            </div>

                            {/* Achievements */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Key Achievements
                                </label>
                                {newStory.achievements.map((achievement, index) => (
                                    <div key={index} className="flex items-center space-x-2 mb-2">
                                        <input
                                            type="text"
                                            value={achievement}
                                            onChange={(e) => updateAchievement(index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#004d00]"
                                            placeholder="Enter achievement"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeAchievement(index)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addAchievement}
                                    className="bg-[#FFD700] text-[#004d00] px-4 py-2 rounded hover:bg-yellow-400"
                                >
                                    + Add Achievement
                                </button>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[#004d00] text-white px-6 py-2 rounded-lg hover:bg-[#006400]"
                            >
                                {editingStory ? 'Update Story' : 'Add Story'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Add Button */}
            {!showAddForm && (
                <div className="mb-8">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-[#004d00] text-white px-6 py-3 rounded-lg hover:bg-[#006400]"
                    >
                        + Add New Success Story
                    </button>
                </div>
            )}

            {/* Stories List */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-[#FFD700] overflow-hidden">
                <div className="bg-gradient-to-r from-[#004d00] to-[#006400] text-white p-4">
                    <h2 className="text-xl font-bold">Success Stories ({stories.length})</h2>
                </div>

                {stories.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <p>No success stories found.</p>
                        <p className="text-sm mt-1">Add your first success story using the button above.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {stories.map((story) => (
                            <div key={story.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12">
                                            <img
                                                src={story.profileImage || story.imageUrl || story.fileUrl || (story.gender === 'female' ? womenlogo : menlogo)}
                                                alt={story.name}
                                                className="w-full h-full object-cover rounded-full border-2 border-[#004d00]"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{story.name}</h3>
                                            <p className="text-sm text-gray-600">{story.role}</p>
                                            {story.batch && (
                                                <p className="text-xs text-gray-500">Batch: {story.batch}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            story.isActive !== false 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {story.isActive !== false ? 'Active' : 'Inactive'}
                                        </span>
                                        <button
                                            onClick={() => handleToggleStatus(story.id, story.isActive === false)}
                                            className="text-blue-500 hover:text-blue-700"
                                        >
                                            {story.isActive !== false ? '👁️' : '👁️‍🗨️'}
                                        </button>
                                        <button
                                            onClick={() => handleEdit(story)}
                                            className="text-green-500 hover:text-green-700"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => handleDelete(story.id)}
                                            className="text-red-500 hover:text-red-700"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SuccessStoriesManagement;
