import React, { useState } from 'react';
import AcademicCard from './AcademicCard';
import { Icon } from '../services/uicomponents';

const AcademicSection = ({ 
    type, // 'outline', 'notes', 'past_paper'
    title,
    data, // Array of courses/semesters
    onAddNew,
    onUpdateLink,
    showAddButton = true,
    compact = false
}) => {
    const [showAddForm, setShowAddForm] = useState(false);
    const [newCourse, setNewCourse] = useState({
        year: '',
        semester: '',
        courseCode: '',
        subject: '',
        link: ''
    });

    const getTypeColor = () => {
        switch(type) {
            case 'outline': return 'border-blue-300 bg-blue-50';
            case 'notes': return 'border-green-300 bg-green-50';
            case 'past_paper': return 'border-purple-300 bg-purple-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getTypeLabel = () => {
        switch(type) {
            case 'outline': return 'Course Outlines';
            case 'notes': return 'Course Notes';
            case 'past_paper': return 'Past Papers';
            default: return 'Material';
        }
    };

    const handleAddNew = () => {
        if (newCourse.year && newCourse.semester && newCourse.subject) {
            onAddNew({
                ...newCourse,
                type
            });
            setNewCourse({
                year: '',
                semester: '',
                courseCode: '',
                subject: '',
                link: ''
            });
            setShowAddForm(false);
        } else {
            alert('Please fill all required fields (Year, Semester, Subject)');
        }
    };

    const groupByYearAndSemester = () => {
        const grouped = {};
        console.log("Grouping data:", data);
        console.log("Data type:", type);
        console.log("Data length:", data.length);
        
        if (!data || data.length === 0) {
            console.log("No data to group");
            return {};
        }
        
        data.forEach((item, index) => {
            console.log(`Item ${index}:`, item);
            const year = item.year;
            const semester = item.semester;
            
            if (!year || !semester) {
                console.warn("Item missing year or semester:", item);
                return;
            }
            
            if (!grouped[year]) {
                grouped[year] = {};
            }
            if (!grouped[year][semester]) {
                grouped[year][semester] = [];
            }
            grouped[year][semester].push(item);
        });
        
        console.log("Grouped result:", grouped);
        return grouped;
    };

    const getSemesterOptions = () => {
        if (type === 'past_paper') {
            return [1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>
                    Year {Math.ceil(sem/2)} Semester {sem % 2 === 1 ? 1 : 2} (Sem {sem})
                </option>
            ));
        }
        return [1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <option key={sem} value={sem}>Semester {sem}</option>
        ));
    };

    const groupedData = groupByYearAndSemester();

    console.log("AcademicSection render - Type:", type);
    console.log("AcademicSection render - Data:", data);
    console.log("AcademicSection render - GroupedData:", groupedData);
    console.log("AcademicSection render - ShowAddButton:", showAddButton);

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                {showAddButton && (
                    <button
                        onClick={() => setShowAddForm(!showAddForm)}
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            type === 'outline' ? 'bg-blue-600 hover:bg-blue-700' :
                            type === 'notes' ? 'bg-green-600 hover:bg-green-700' :
                            'bg-purple-600 hover:bg-purple-700'
                        } text-white`}
                    >
                        <Icon path="M12 4v16m8-8H4" className="w-4 h-4 inline mr-2" />
                        Add New {getTypeLabel()}
                    </button>
                )}
            </div>

            {/* Add New Form */}
            {showAddForm && showAddButton && (
                <div className={`border-2 rounded-lg p-6 ${getTypeColor()}`}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">
                        Add New {getTypeLabel()} Course
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Year *</label>
                            <select
                                value={newCourse.year}
                                onChange={(e) => setNewCourse({...newCourse, year: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Year</option>
                                <option value="1">Year 1</option>
                                <option value="2">Year 2</option>
                                <option value="3">Year 3</option>
                                <option value="4">Year 4</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Semester *</label>
                            <select
                                value={newCourse.semester}
                                onChange={(e) => setNewCourse({...newCourse, semester: e.target.value})}
                                className="w-full p-2 border rounded"
                                required
                            >
                                <option value="">Select Semester</option>
                                {getSemesterOptions()}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Course Code</label>
                            <input
                                type="text"
                                value={newCourse.courseCode}
                                onChange={(e) => setNewCourse({...newCourse, courseCode: e.target.value})}
                                placeholder="e.g., BED-101"
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject *</label>
                            <input
                                type="text"
                                value={newCourse.subject}
                                onChange={(e) => setNewCourse({...newCourse, subject: e.target.value})}
                                placeholder="e.g., Educational Psychology"
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">{getTypeLabel()} Link</label>
                            <input
                                type="url"
                                value={newCourse.link}
                                onChange={(e) => setNewCourse({...newCourse, link: e.target.value})}
                                placeholder="https://drive.google.com/..."
                                className="w-full p-2 border rounded"
                            />
                        </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={handleAddNew}
                            className="bg-green-600 text-white px-6 py-2 rounded font-semibold hover:bg-green-700"
                        >
                            Add {getTypeLabel()}
                        </button>
                    </div>
                </div>
            )}

            {Object.keys(groupedData).length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-gray-200">
                    <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 text-lg font-medium">No {getTypeLabel().toLowerCase()} data available</p>
                    <p className="text-gray-400 text-sm mt-2">Please check back later or contact administrator</p>
                </div>
            ) : (
                Object.keys(groupedData).sort((a, b) => a - b).map((year) => (
                    <div key={year} className="bg-gray-100 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 border-t-8 border-green-700">
                        {/* Box Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {year === '1' ? 'First Year' : year === '2' ? 'Second Year' : year === '3' ? 'Third Year' : 'Fourth Year'}
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-green-800 mt-2">
                                        Part {year}
                                    </h2>
                                </div>
                                <div className="text-4xl font-black text-gray-200">0{year}</div>
                            </div>
                        </div>

                        {/* Box Body */}
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {Object.keys(groupedData[year]).sort((a, b) => a - b).map((semester) => (
                                    <div key={`${year}-${semester}`} className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-semibold text-gray-800">
                                                    Semester {semester}
                                                </h3>
                                                <div className={`p-3 rounded-xl ${getTypeColor().split(' ')[0]} ${getTypeColor().split(' ')[1]}`}>
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                                    </svg>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                {groupedData[year][semester].map((item, index) => {
                                                    console.log("Rendering AcademicCard with item:", item);
                                                    
                                                    // Get the correct link based on type
                                                    let link = null;
                                                    if (type === 'outline') {
                                                        link = item.link; // New structure uses 'link' field
                                                    } else if (type === 'notes') {
                                                        link = item.link; // New structure uses 'link' field
                                                    } else if (type === 'past_paper') {
                                                        link = item.link;
                                                    }
                                                    
                                                    console.log("Link mapping for", type, ":");
                                                    console.log("- Item:", item);
                                                    console.log("- link:", item.link);
                                                    console.log("- Final link:", link);
                                                    console.log("- Show download:", link && link !== "Placeholder" && link !== null && link !== "");
                                                    
                                                    return (
                                                        <AcademicCard
                                                            key={`${item.year}-${item.semester}-${item.subject}-${index}`}
                                                            type={type}
                                                            year={item.year}
                                                            semester={item.semester}
                                                            courseCode={item.courseCode}
                                                            subject={item.subject}
                                                            link={link}
                                                            onUpdateLink={onUpdateLink}
                                                            showActions={!compact}
                                                            compact={compact}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default AcademicSection;
