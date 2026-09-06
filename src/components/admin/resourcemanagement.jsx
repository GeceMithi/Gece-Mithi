import React, { useState } from 'react';
import PastPaperSection from '../academic/PastPaperSection';
import useResourceData from '../../hook/useResourceData';

const portfolioAcademicMap = {
    development: { part: 2, semester: 3, label: 'Developmental Portfolio' },
    professional: { part: 2, semester: 4, label: 'Professional Portfolio' },
    reading: { part: 4, semester: 7, label: 'Reading Portfolio' },
    advance: { part: 4, semester: 8, label: 'Advance Portfolio' },
    research: { part: 4, semester: 8, label: 'Research Thesis' }
};

const ResourceManagement = () => {
    const {
        resources,
        loading,
        addResource,
        updateResource,
        deleteResource,
    } = useResourceData();

    const [portfolioForm, setPortfolioForm] = useState({
        portfolioType: 'development',
        itemType: 'outline',
        part: '1',
        semester: '1',
        url: ''
    });

    const [pastPaperForm, setPastPaperForm] = useState({ part: '1', semester: '1', url: '' });

    const sectionButtons = [
        { id: 'outline', label: 'Outline', category: 'study-materials', accent: 'bg-blue-600' },
        { id: 'notes', label: 'Notes', category: 'notes', accent: 'bg-blue-600' },
        { id: 'past-papers', label: 'Past Papers', category: 'past-papers', accent: 'bg-blue-600' },
        { id: 'portfolios', label: 'Portfolios', category: 'portfolios', accent: 'bg-blue-600' },
        { id: 'tools', label: 'Tools', category: 'tools', accent: 'bg-blue-600' }
    ];

    const [activeSection, setActiveSection] = useState('outline');
    const [formData, setFormData] = useState({ title: '', part: '1', semester: '1', url: '', description: '' });
    const [editingToolId, setEditingToolId] = useState(null);
    const [editingToolUrl, setEditingToolUrl] = useState('');

    const updatePortfolioType = (portfolioType) => {
        const academicDetails = portfolioAcademicMap[portfolioType];
        setPortfolioForm(prev => ({
            ...prev,
            portfolioType,
            part: String(academicDetails?.part || 1),
            semester: String(academicDetails?.semester || 1)
        }));
    };

    const activeSectionConfig = sectionButtons.find(section => section.id === activeSection) || sectionButtons[0];

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

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleToolSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.url.trim()) {
            alert('Please enter a tool title and URL.');
            return;
        }

        const result = await addResource({
            title: formData.title.trim(),
            category: 'tools',
            subject: formData.title.trim(),
            description: formData.description.trim(),
            fileUrl: formData.url.trim(),
            fileType: 'link'
        });

        if (result.success) {
            alert('Tool saved successfully.');
            setFormData({ title: '', part: '1', semester: '1', url: '', description: '' });
        } else {
            alert(`Failed to save tool: ${result.error}`);
        }
    };

    const handleSectionSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim() || !formData.url.trim()) {
            alert('Please fill all required fields.');
            return;
        }

        const result = await addResource({
            title: formData.title.trim(),
            category: activeSectionConfig.category,
            subject: formData.title.trim(),
            class: `Year ${formData.part} Semester ${formData.semester}`,
            description: `${activeSectionConfig.label} for Part ${formData.part}, Semester ${formData.semester}`,
            fileUrl: convertDriveUrlToDirectDownload(formData.url.trim()),
            fileType: 'pdf',
            part: Number(formData.part),
            semester: Number(formData.semester)
        });

        if (result.success) {
            alert(`${activeSectionConfig.label} saved successfully.`);
            setFormData({ title: '', part: '1', semester: '1', url: '', description: '' });
        } else {
            alert(`Failed to save: ${result.error}`);
        }
    };

    const handlePastPaperSubmit = async (e) => {
        e.preventDefault();
        if (!pastPaperForm.url.trim()) {
            alert('Please enter the past paper URL.');
            return;
        }

        const part = Number(pastPaperForm.part);
        const semester = Number(pastPaperForm.semester);

        const result = await addResource({
            title: `Past Paper - Part ${part} Semester ${semester}`,
            category: 'past-papers',
            subject: `Past Paper Part ${part} Semester ${semester}`,
            class: `Year ${part} Semester ${semester}`,
            description: `Past Paper for Part ${part}, Semester ${semester}`,
            fileUrl: convertDriveUrlToDirectDownload(pastPaperForm.url.trim()),
            fileType: 'pdf',
            part,
            semester
        });

        if (result.success) {
            alert('Past paper saved successfully.');
            setPastPaperForm({ part: '1', semester: '1', url: '' });
        } else {
            alert(`Failed to save past paper: ${result.error}`);
        }
    };

    const handlePortfolioSubmit = async (e) => {
        e.preventDefault();
        if (!portfolioForm.url.trim()) {
            alert('Please enter the portfolio URL.');
            return;
        }

        const result = await addResource({
            title: `${portfolioForm.portfolioType} - ${portfolioForm.itemType}`,
            category: 'portfolios',
            subject: `Portfolio ${portfolioForm.portfolioType} ${portfolioForm.itemType}`,
            class: `Part ${portfolioForm.part} Semester ${portfolioForm.semester}`,
            description: `${portfolioForm.itemType} for ${portfolioForm.portfolioType} portfolio, Part ${portfolioForm.part}, Semester ${portfolioForm.semester}`,
            fileUrl: convertDriveUrlToDirectDownload(portfolioForm.url.trim()),
            fileType: 'pdf',
            part: Number(portfolioForm.part),
            semester: Number(portfolioForm.semester),
            portfolioType: portfolioForm.portfolioType,
            itemType: portfolioForm.itemType
        });

        if (result.success) {
            alert('Portfolio item saved successfully! It will appear on the Portfolios Page.');
            setPortfolioForm({ portfolioType: 'development', itemType: 'outline', part: '1', semester: '1', url: '' });
        } else {
            alert(`Failed to save portfolio: ${result.error}`);
        }
    };

    const handleDeleteResource = async (resourceId) => {
        if (!confirm('Are you sure you want to delete this resource?')) return;
        await deleteResource(resourceId);
    };

    const handleToolUpdate = async (tool) => {
        if (!editingToolUrl.trim()) {
            alert('Please enter a download URL.');
            return;
        }

        const result = await updateResource(tool.id, {
            category: 'tools',
            fileUrl: editingToolUrl.trim()
        });
        if (result.success) {
            setEditingToolId(null);
            setEditingToolUrl('');
            alert('Tool URL updated successfully.');
        } else {
            alert(`Failed to update tool: ${result.error}`);
        }
    };

    const filteredSectionResources = resources.filter(resource => {
        return (resource.category || 'other') === activeSectionConfig.category;
    });

    const parsePartSemester = (resource) => {
        if (resource.part || resource.year) {
            return {
                part: Number(resource.part ?? resource.year ?? 0),
                semester: Number(resource.semester ?? 0)
            };
        }
        const classText = resource.class || resource.description || '';
        const partMatch = classText.match(/(?:Part|Year)\s*(\d+)/i);
        const semesterMatch = classText.match(/Semester\s*(\d+)/i);
        return {
            part: partMatch ? Number(partMatch[1]) : 0,
            semester: semesterMatch ? Number(semesterMatch[1]) : 0
        };
    };

    const groupedResources = filteredSectionResources.reduce((acc, item) => {
        const { part, semester } = parsePartSemester(item);
        const safePart = part || 1;
        const safeSemester = semester || 1;
        const partKey = `Part ${safePart}`;
        const semKey = `Semester ${safeSemester}`;

        if (!acc[partKey]) acc[partKey] = { part: safePart, semesters: {} };
        if (!acc[partKey].semesters[semKey]) acc[partKey].semesters[semKey] = { semester: safeSemester, items: [] };

        acc[partKey].semesters[semKey].items.push(item);
        return acc;
    }, {});

    const sortedGroupKeys = Object.keys(groupedResources).sort((a, b) => groupedResources[a].part - groupedResources[b].part);

    const groupedPastPaperSections = Object.values(
        filteredSectionResources.reduce((acc, item) => {
            const { part, semester } = parsePartSemester(item);
            const safePart = part || 1;
            const safeSemester = semester || 1;
            const partKey = `Part ${safePart}`;

            if (!acc[partKey]) {
                acc[partKey] = {
                    part: safePart,
                    partTitle: `Part ${safePart}`,
                    items: []
                };
            }

            acc[partKey].items.push({
                ...item,
                part: safePart,
                semester: safeSemester,
                title: item.title || item.subject || `Past Paper Part ${safePart} Semester ${safeSemester}`
            });
            return acc;
        }, {})
    ).sort((a, b) => a.part - b.part);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800">Resource Management</h1>
                    <p className="text-gray-600 mt-2">Manage academic outlines, notes, past papers, and portfolios</p>
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

                {/* Form Section */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    {activeSectionConfig.id === 'past-papers' ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Past Paper</h2>
                            <form onSubmit={handlePastPaperSubmit} className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Part</label>
                                    <select
                                        value={pastPaperForm.part}
                                        onChange={(e) => setPastPaperForm(prev => ({ ...prev, part: e.target.value }))}
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
                                        value={pastPaperForm.semester}
                                        onChange={(e) => setPastPaperForm(prev => ({ ...prev, semester: e.target.value }))}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map(semester => (
                                            <option key={semester} value={semester}>Semester {semester}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">URL</label>
                                    <input
                                        type="url"
                                        value={pastPaperForm.url}
                                        onChange={(e) => setPastPaperForm(prev => ({ ...prev, url: e.target.value }))}
                                        placeholder="https://example.com/past-paper.pdf"
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold  hover:bg-orange-700 transition"
                                    >
                                        Add Past Paper
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : activeSectionConfig.id === 'portfolios' ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Portfolio Item</h2>
                            <form onSubmit={handlePortfolioSubmit} className="grid gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Portfolio Type</label>
                                    <select
                                        value={portfolioForm.portfolioType}
                                        onChange={(e) => updatePortfolioType(e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500  outline-none"
                                    >
                                        <option value="development">Developmental Portfolio</option>
                                        <option value="professional">Professional Portfolio</option>
                                        <option value="reading">Reading Portfolio</option>
                                        <option value="advance">Advance Portfolio</option>
                                        <option value="research">Research Thesis</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Item Type</label>
                                    <select
                                        value={portfolioForm.itemType}
                                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, itemType: e.target.value }))}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500  outline-none"
                                    >
                                        <option value="outline">Outline</option>
                                        <option value="handout">Handout</option>
                                        <option value="portfolio">Portfolio</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Part</label>
                                    <select
                                        value={portfolioForm.part}
                                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, part: e.target.value }))}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        {[1, 2, 3, 4].map(part => <option key={part} value={part}>Part {part}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Semester</label>
                                    <select
                                        value={portfolioForm.semester}
                                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, semester: e.target.value }))}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                    >
                                        {Array.from({ length: 8 }, (_, index) => index + 1).map(semester => <option key={semester} value={semester}>Semester {semester}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Download URL</label>
                                    <input
                                        type="url"
                                        value={portfolioForm.url}
                                        onChange={(e) => setPortfolioForm(prev => ({ ...prev, url: e.target.value }))}
                                        placeholder="https://drive.google.com/..."
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <button
                                        type="submit"
                                        className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold  hover:bg-orange-700 transition"
                                    >
                                        Add Portfolio Item
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : activeSectionConfig.id === 'tools' ? (
                        <>
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Add Tool</h2>
                            <form onSubmit={handleToolSubmit} className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tool Name</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} placeholder="Enter tool name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Tool URL</label>
                                    <input type="url" value={formData.url} onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))} placeholder="https://example.com/tool.pdf" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                                    <textarea value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe what this tool is used for" rows="3" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none" />
                                </div>
                                <div className="md:col-span-2">
                                    <button type="submit" className="w-full md:w-auto px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition">Add Tool</button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
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
                                        Add {activeSectionConfig.label}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                {/* Display Saved Items */}
                {
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Saved {activeSectionConfig.label} Items</h3>
                        {loading ? (
                            <p className="text-gray-500">Loading...</p>
                        ) : activeSectionConfig.id === 'tools' ? (
                            filteredSectionResources.length === 0 ? (
                                <p className="text-gray-500">No tools saved yet.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {filteredSectionResources.map(tool => (
                                        <div key={tool.id} className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 shadow-sm">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h4 className="font-bold text-gray-800 truncate">{tool.title || tool.subject}</h4>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{tool.description || 'Teaching and assessment resource.'}</p>
                                                </div>
                                                <span className="text-xs font-bold uppercase text-orange-700">Tool</span>
                                            </div>
                                            {editingToolId === tool.id ? (
                                                <div className="mt-4 space-y-2">
                                                    <input
                                                        type="url"
                                                        value={editingToolUrl}
                                                        onChange={(e) => setEditingToolUrl(e.target.value)}
                                                        className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                                                        required
                                                    />
                                                    <div className="flex flex-nowrap gap-1.5">
                                                        <button type="button" onClick={() => handleToolUpdate(tool)} className="whitespace-nowrap px-2.5 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700">Add Outline</button>
                                                        <button type="button" onClick={() => setEditingToolId(null)} className="whitespace-nowrap px-2.5 py-1.5 bg-gray-500 text-white rounded-lg text-xs font-semibold hover:bg-gray-600">Cancel</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-4 flex flex-nowrap items-center gap-1.5">
                                                    <a href={tool.fileUrl} target="_blank" rel="noreferrer" className="whitespace-nowrap text-green-700 text-xs font-semibold underline">Open URL</a>
                                                    <button type="button" onClick={() => { setEditingToolId(tool.id); setEditingToolUrl(tool.fileUrl || ''); }} className="whitespace-nowrap px-2.5 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700">Edit</button>
                                                    <button type="button" onClick={() => handleDeleteResource(tool.id)} className="whitespace-nowrap px-2.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700">Delete</button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : activeSectionConfig.id === 'portfolios' ? (
                            (() => {
                                const portfolioGroups = filteredSectionResources.reduce((groups, item) => {
                                    const academicDetails = portfolioAcademicMap[item.portfolioType] || {};
                                    const part = Number(item.part || item.year || academicDetails.part || 1);
                                    const semester = Number(item.semester || academicDetails.semester || 1);
                                    const groupKey = `Part ${part} - Semester ${semester}`;
                                    if (!groups[groupKey]) groups[groupKey] = { part, semester, items: [] };
                                    groups[groupKey].items.push(item);
                                    return groups;
                                }, {});
                                const sortedPortfolioGroups = Object.values(portfolioGroups).sort((a, b) => (
                                    a.part - b.part || a.semester - b.semester
                                ));

                                if (sortedPortfolioGroups.length === 0) {
                                    return <p className="text-gray-500">No portfolio items saved yet.</p>;
                                }

                                return (
                                    <div className="space-y-8">
                                        {sortedPortfolioGroups.map(group => {
                                            const typeGroups = group.items.reduce((types, item) => {
                                                const type = item.portfolioType || 'development';
                                                if (!types[type]) types[type] = [];
                                                types[type].push(item);
                                                return types;
                                            }, {});

                                            return (
                                                <section key={`${group.part}-${group.semester}`} className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 via-white to-yellow-50 p-5 shadow-sm">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h4 className="text-lg font-extrabold text-[#004d00]">Part {group.part} <span className="text-purple-600">/</span> Semester {group.semester}</h4>
                                                        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">{group.items.length} item(s)</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                                        {Object.entries(typeGroups).map(([type, items]) => (
                                                            <div key={type} className="rounded-xl border border-yellow-300 bg-white p-4 shadow-sm">
                                                                <h5 className="font-bold capitalize text-gray-800 mb-3">{type === 'research' ? 'Research Thesis' : `${type} Portfolio`}</h5>
                                                                <div className="space-y-3">
                                                                    {items.map(item => (
                                                                        <div key={item.id} className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <span className="font-semibold capitalize text-sm text-gray-800">
                                                                                    {type === 'research' && item.itemType === 'portfolio' ? 'Thesis' : item.itemType || 'Portfolio'}
                                                                                </span>
                                                                                <div className="flex items-center gap-2">
                                                                                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-green-700 text-xs font-bold underline">Open</a>
                                                                                    <button type="button" onClick={() => handleDeleteResource(item.id)} className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700">Delete</button>
                                                                                </div>
                                                                            </div>
                                                                            <p className="text-xs text-gray-500 mt-1 truncate">{item.title || item.subject}</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            );
                                        })}
                                    </div>
                                );
                            })()
                        ) : activeSectionConfig.id === 'past-papers' ? (
                            <PastPaperSection sections={groupedPastPaperSections} onDelete={handleDeleteResource} />
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
                }
            </div>
        </div>
    );
};

export default ResourceManagement;