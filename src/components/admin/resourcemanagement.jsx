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

    const [outlineForm, setOutlineForm] = useState({
        part: '1',
        semester: '1',
        url: ''
    });
    const [notesForm, setNotesForm] = useState({
        part: '1',
        semester: '1',
        url: ''
    });

    useEffect(() => {
        console.log(`🔗 Real-time fileUrl update: "${newResource.fileUrl}"`);
    }, [newResource.fileUrl]);

    const [statistics, setStatistics] = useState({
        total: 0,
        studyMaterials: 0,
        notes: 0,
        other: 0
    });

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
                id: Date.now()
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

    const convertDriveUrlToDirectDownload = (url) => {
        if (!url || typeof url !== 'string') return '';

        const trimmedUrl = url.trim();
        if (!trimmedUrl) return '';

        const match = trimmedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
            return `https://drive.google.com/uc?export=download&id=${match[1]}`;
        }

        return trimmedUrl;
    };

    const handleAddResource = async () => {
        if (newResource.title.trim()) {
            const convertedResource = {
                ...newResource,
                fileUrl: convertDriveUrlToDirectDownload(newResource.fileUrl)
            };

            const result = await addResource(convertedResource);
            
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
            } else {
                alert('Failed to add resource: ' + result.error);
            }
        }
    };

    const handleAcademicSubmit = async (type) => {
        const form = type === 'outline' ? outlineForm : notesForm;
        const part = Number(form.part);
        const semester = Number(form.semester);

        if (!form.url.trim()) {
            alert(`${type === 'outline' ? 'Outline' : 'Notes'} URL is required.`);
            return;
        }

        const payload = {
            title: type === 'outline' ? 'Outline' : 'Notes',
            category: type === 'outline' ? 'study-materials' : 'notes',
            subject: type === 'outline' ? 'Outline' : 'Notes',
            class: `Year ${part} Semester ${semester}`,
            description: `${type === 'outline' ? 'Outline' : 'Notes'} for Part ${part}, Semester ${semester}`,
            fileUrl: convertDriveUrlToDirectDownload(form.url.trim()),
            fileType: 'pdf'
        };

        const result = await addResource(payload);

        if (result.success) {
            if (type === 'outline') {
                setOutlineForm({ part: '1', semester: '1', url: '' });
            } else {
                setNotesForm({ part: '1', semester: '1', url: '' });
            }
            alert(`${type === 'outline' ? 'Outline' : 'Notes'} saved successfully!`);
        } else {
            alert(`Failed to save ${type === 'outline' ? 'outline' : 'notes'}: ${result.error}`);
        }
    };

    const handleDeleteAllResources = async () => {
        if (confirm('⚠️ WARNING: This will delete ALL resources from Firebase!\n\nThis action cannot be undone.')) {
            const result = await deleteAllResources();
            if (result.success) {
                alert(`✅ Successfully deleted ${result.deletedCount} resources from Firebase!`);
            } else {
                alert(`❌ Failed to delete all resources: ${result.error}`);
            }
        }
    };

    const handleRemoveSemester = async (category, year, semester) => {
        const categoryName = category === 'study-materials' ? 'Outlines' : 'Notes';
        
        if (confirm(`Are you sure you want to remove ALL ${categoryName} for Year ${year}, Semester ${semester}?`)) {
            const result = await removeSemesterData(category, parseInt(year), parseInt(semester));
            if (result.success) {
                alert(`✅ All ${categoryName} for Year ${year}, Semester ${semester} have been removed!`);
            } else {
                alert(`❌ Failed to remove semester: ${result.error}`);
            }
        }
    };

    const handleDeleteResource = async (resourceId) => {
        const resource = resources.find(r => r.id === resourceId);
        const resourceName = resource?.title || resource?.subject || 'this resource';
        
        const result = await deleteResource(resourceId);
        if (result.success) {
            alert(`✅ "${resourceName}" has been deleted successfully!`);
        } else {
            alert(`❌ Failed to delete resource: ${result.error}`);
        }
    };

    // Filtered resources for search & category view
    const filteredResources = resources.filter(resource => {
        const matchesCategory = filter === 'all' || resource.category === filter;
        const matchesSearch = searchTerm === '' || 
            (resource.title && resource.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (resource.description && resource.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (resource.subject && resource.subject.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return matchesCategory && matchesSearch;
    });

    const sectionButtons = [
        { id: 'outline', label: 'Outline', category: 'study-materials', accent: 'bg-blue-600' },
        { id: 'notes', label: 'Notes', category: 'notes', accent: 'bg-blue-600' }
    ];

    const [activeSection, setActiveSection] = useState('outline');
    const [formData, setFormData] = useState({ title: '', part: '1', semester: '1', url: '' });

    const activeSectionConfig = sectionButtons.find(section => section.id === activeSection) || sectionButtons[0];

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSectionSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('Please enter a title before saving.');
            return;
        }

        if (!formData.url.trim()) {
            alert('Please enter the file URL before saving.');
            return;
        }

        const result = await addResource({
            title: formData.title.trim(),
            category: activeSectionConfig.category,
            subject: formData.title.trim(),
            class: `Year ${formData.part} Semester ${formData.semester}`,
            description: `${activeSectionConfig.label} for Part ${formData.part}, Semester ${formData.semester}`,
            fileUrl: convertDriveUrlToDirectDownload(formData.url.trim()),
            fileType: 'pdf'
        });

        if (result.success) {
            alert(`${activeSectionConfig.label} saved successfully.`);
            setFormData({ title: '', part: '1', semester: '1', url: '' });
        } else {
            alert(`Failed to save ${activeSectionConfig.label.toLowerCase()}: ${result.error}`);
        }
    };

    const filteredSectionResources = resources.filter(resource => {
        const resourceCategory = resource.category || 'other';
        return resourceCategory === activeSectionConfig.category;
    });

    const parsePartSemester = (resource) => {
        if (resource.part && resource.semester) {
            return {
                part: Number(resource.part),
                semester: Number(resource.semester)
            };
        }

        const classText = resource.class || resource.description || '';
        const partMatch = classText.match(/Year\s*(\d+)/i);
        const semesterMatch = classText.match(/Semester\s*(\d+)/i);

        return {
            part: partMatch ? Number(partMatch[1]) : 0,
            semester: semesterMatch ? Number(semesterMatch[1]) : 0
        };
    };

    const groupedResources = filteredSectionResources.reduce((acc, item) => {
        const { part, semester } = parsePartSemester(item);
        const partKey = `Part ${part}`;
        const semKey = `Semester ${semester}`;

        if (!acc[partKey]) {
            acc[partKey] = { part, semesters: {} };
        }
        if (!acc[partKey].semesters[semKey]) {
            acc[partKey].semesters[semKey] = { semester, items: [] };
        }

        acc[partKey].semesters[semKey].items.push(item);
        return acc;
    }, {});

    const sortedGroupKeys = Object.keys(groupedResources).sort((a, b) => groupedResources[a].part - groupedResources[b].part);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800">Resource Management</h1>
                    <p className="text-gray-600 mt-2">Choose Outline or Notes, fill the details, and save the file directly to Firebase.</p>
                </div>

                {/* Section Toggle Buttons */}
                <div className="flex flex-wrap gap-3">
                    {sectionButtons.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`px-4 py-2 rounded-lg font-semibold text-white shadow-sm transition border-2 ${activeSection === section.id ? `bg-green-600 border-yellow-400 ${section.accent}` : 'bg-green-500 hover:bg-green-600 border-yellow-300'}`}
                        >
                            {section.label}
                        </button>
                    ))}
                </div>

                {/* Resource Form */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Add {activeSectionConfig.label}</h2>
                    <form onSubmit={handleSectionSubmit} className="grid gap-4 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleFormChange}
                                placeholder={`Enter ${activeSectionConfig.label.toLowerCase()} title`}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Part</label>
                            <select
                                name="part"
                                value={formData.part}
                                onChange={handleFormChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                {[1, 2, 3, 4].map(part => (
                                    <option key={part} value={part}>Part {part}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
                            <select
                                name="semester"
                                value={formData.semester}
                                onChange={handleFormChange}
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                                    <option key={semester} value={semester}>Semester {semester}</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Download URL</label>
                            <input
                                type="url"
                                name="url"
                                value={formData.url}
                                onChange={handleFormChange}
                                placeholder="https://example.com/file.pdf"
                                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                            >
                                Save {activeSectionConfig.label}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Display Saved Items (Outline & Notes) */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Saved {activeSectionConfig.label} Items</h3>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : filteredSectionResources.length === 0 ? (
                        <p className="text-gray-500">No {activeSectionConfig.label.toLowerCase()} items saved yet.</p>
                    ) : (
                        <div className="space-y-6">
                            {sortedGroupKeys.map(partKey => {
                                const partGroup = groupedResources[partKey];
                                const sortedSemesters = Object.values(partGroup.semesters).sort((a, b) => a.semester - b.semester);

                                return (
                                    <div key={partKey} className="rounded-2xl border border-yellow-300 bg-gray-50 p-4">
                                        <h4 className="text-xl font-bold text-gray-800 mb-4">{partKey}</h4>
                                        <div className="space-y-4">
                                            {sortedSemesters.map((semesterGroup) => (
                                                <div key={`${partKey}-${semesterGroup.semester}`} className="rounded-2xl border border-green-200 bg-white p-4">
                                                    <div className="mb-3 text-lg font-semibold text-green-700">Semester {semesterGroup.semester}</div>
                                                    <div className="space-y-3">
                                                        {semesterGroup.items.map(item => (
                                                            <div key={item.id} className="border rounded-lg p-3 bg-gray-50">
                                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                                    <div className="min-w-0">
                                                                        <div className="font-semibold text-gray-800 truncate">{item.title || item.subject}</div>
                                                                        <div className="text-sm text-gray-500">{item.class || 'No class info'}</div>
                                                                    </div>
                                                                    <div className="flex items-center justify-end gap-2 sm:w-52">
                                                                        <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-green-600 text-sm underline">Open URL</a>
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleDeleteResource(item.id)}
                                                                            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResourceManagement;
