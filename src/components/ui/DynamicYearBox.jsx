import React from 'react';
import { Icon } from '../services/uicomponents';
import AcademicCard from './AcademicCard';

const DynamicYearBox = ({ 
    year, 
    semesters, 
    type, 
    title,
    onUpdateLink,
    showAddButton = false,
    animationDelay = 0
}) => {
    // Debug logging
    console.log(`📦 DynamicYearBox - Year ${year}:`, {
        type,
        title,
        semestersCount: semesters?.length || 0,
        semesters: semesters
    });
    const getTypeLabel = () => {
        switch(type) {
            case 'outline': return 'Course Outline';
            case 'notes': return 'Course Notes';
            case 'past_paper': return 'Past Paper';
            default: return 'Material';
        }
    };

    const getTypeColor = () => {
        switch(type) {
            case 'outline': return 'border-blue-300 bg-blue-50';
            case 'notes': return 'border-green-300 bg-green-50';
            case 'past_paper': return 'border-purple-300 bg-purple-50';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    const getButtonColor = () => {
        switch(type) {
            case 'outline': return 'bg-blue-600 hover:bg-blue-700';
            case 'notes': return 'bg-green-600 hover:bg-green-700';
            case 'past_paper': return 'bg-purple-600 hover:bg-purple-700';
            default: return 'bg-gray-600 hover:bg-gray-700';
        }
    };

    return (
        <div 
            className="year-block p-6 bg-gray-100 border-t-8 border-green-700 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 content-entry-animation"
            style={{ animationDelay: `${animationDelay}s` }}
        >
            {/* Year Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-green-800 mb-2">
                        Part {year}
                    </h2>
                    <p className="text-lg text-gray-600">
                        {getTypeLabel()} for Year {year}
                    </p>
                </div>
                <div className="text-4xl font-black text-gray-200">
                    0{year}
                </div>
            </div>

            {/* Add New Button */}
            {showAddButton && (
                <div className="mb-4 text-right">
                    <button
                        className={`px-4 py-2 rounded-lg font-semibold transition-colors text-white ${getButtonColor()}`}
                        onClick={() => {
                            // Handle add new functionality
                            console.log(`Add new ${getTypeLabel()} for Year ${year}`);
                        }}
                    >
                        <Icon path="M12 4v16m8-8H4" className="w-4 h-4 inline mr-2" />
                        Add New {getTypeLabel()}
                    </button>
                </div>
            )}

            {/* Semesters Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {semesters.map((semester, index) => {
                    console.log(`🎓 Processing Semester ${semester.semester}:`, {
                        semester,
                        coursesCount: semester.courses?.length || 0,
                        courses: semester.courses
                    });
                    
                    return (
                    <div 
                        key={semester.semester} 
                        className={`semester-card bg-white p-6 rounded-2xl shadow-md transition duration-300 border ${getTypeColor()} hover:shadow-lg hover:-translate-y-0.5`}
                        style={{ animationDelay: `${animationDelay + 0.1 + (index * 0.05)}s` }}
                    >
                        {/* Semester Header */}
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl font-semibold text-gray-800">
                                Semester {semester.semester}
                            </h3>
                            <div className={`p-3 rounded-xl ${getTypeColor().split(' ')[0]} ${getTypeColor().split(' ')[1]}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Courses List */}
                        <div className="space-y-3">
                            {semester.courses && semester.courses.map((course, courseIndex) => {
                                console.log(`📚 Rendering Course ${courseIndex}:`, course);
                                
                                return (
                                <div key={courseIndex} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg transition duration-200 hover:bg-indigo-50">
                                    <div className="flex-1">
                                        <span className="text-gray-700 font-medium">
                                            {course.subject || course.name}
                                        </span>
                                        {course.courseCode && (
                                            <span className="ml-2 text-sm text-gray-500">
                                                ({course.courseCode})
                                            </span>
                                        )}
                                    </div>
                                    
                                    {/* Download Button or No Link Message */}
                                    {(() => {
                                        const hasLink = course.link && course.link !== "Placeholder" && course.link !== null && course.link !== "";
                                        console.log(`🔗 DEBUG - Course: ${course.subject}`);
                                        console.log(`🔗 DEBUG - Link:`, course.link);
                                        console.log(`🔗 DEBUG - Has Link:`, hasLink);
                                        console.log(`🔗 DEBUG - Link Type:`, typeof course.link);
                                        console.log(`🔗 DEBUG - Link Length:`, course.link ? course.link.length : 'N/A');
                                        
                                        return hasLink; // Now using actual logic
                                    })() ? (
                                        <button
                                            onClick={() => {
                                                console.log(`📥 Downloading: ${course.subject}`);
                                                const link = course.link;
                                                if (link && link !== "Placeholder") {
                                                    window.open(link, '_blank', 'noopener,noreferrer');
                                                } else {
                                                    console.log(`❌ Invalid link: ${link}`);
                                                    alert('Download link not available');
                                                }
                                            }}
                                            className={`mt-2 sm:mt-0 sm:ml-4 px-3 py-1 rounded text-sm font-medium text-white transition-colors ${getButtonColor()}`}
                                        >
                                            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4 inline mr-1" />
                                            Download
                                        </button>
                                    ) : (
                                        <span className="mt-2 sm:mt-0 sm:ml-4 text-sm text-gray-500 italic">
                                            No {getTypeLabel().toLowerCase()} available
                                        </span>
                                    )}
                                </div>
                                );
                            })}
                            
                            {/* Show message if no courses */}
                            {(!semester.courses || semester.courses.length === 0) && (
                                <div className="text-center py-8 text-gray-500">
                                    <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-12 h-12 mx-auto mb-2" />
                                    <p>No courses available for this semester</p>
                                </div>
                            )}
                        </div>
                    </div>
                    );
                })}
            </div>

            {/* Show message if no semesters */}
            {(!semesters || semesters.length === 0) && (
                <div className="text-center py-12 text-gray-500">
                    <Icon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-lg">No data available for Year {year}</p>
                    <p className="text-sm mt-2">Please check back later or contact administrator</p>
                </div>
            )}
        </div>
    );
};

export default DynamicYearBox;
