// DownloadSection.jsx
import React from 'react';
import DownloadLink from './uicomponents';
import { yearsDownload } from '../../utils/data';

const DownloadSection = ({ linkKey, buttonText, title, descriptionText }) => {
    return (
        <>
            {/* Download sections use the same branding header */}
            <div className="text-center mb-16 pt-8 pb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter content-entry-animation sm:text-5xl">
                    Academic <span className="text-indigo-600">Resources</span>
                </h1>
                <p className="mt-4 text-xl font-medium text-gray-600 content-entry-animation" style={{ animationDelay: '0.3s' }}>
                    {title}
                </p>
                <p className="mt-8 text-lg text-gray-500 content-entry-animation" style={{ animationDelay: '0.4s' }}>
                    {descriptionText}
                </p>
            </div>

            <div className="space-y-12 mt-8 px-4 sm:px-0">
                {yearsDownload.map((yearBlock, index) => (
                    <div 
                        key={yearBlock.year} 
                        className="year-block p-6 bg-gray-100 border-t-8 border-indigo-500 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 content-entry-animation"
                        style={{ animationDelay: `${0.1 + (index * 0.15)}s` }}
                    >
                        <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b pb-2">
                            Part {yearBlock.year}
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {yearBlock.semesters.map(semester => (
                                <div 
                                    key={semester.semester} 
                                    className="semester-card bg-white p-6 rounded-2xl shadow-md transition duration-300 border border-[#ffd200] hover:shadow-lg hover:translate-y-[-2px]"
                                >
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                                        Semester {semester.semester}
                                    </h3>
                                    <ul className="space-y-3">
                                        {semester.courses.map((course, i) => (
                                            <li key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg transition duration-200 hover:bg-indigo-50">
                                                <span className="text-gray-700 font-medium mb-2 sm:mb-0">
                                                    {course.name}
                                                </span>
                                                <DownloadLink 
                                                    linkUrl={course[linkKey]} 
                                                    buttonText={buttonText} 
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

// Exporting specific components as requested:

// 7. Outline.jsx
export const Outline = () => (
    <DownloadSection
        linkKey='outlineLink'
        buttonText='Get Outline'
        title='Course Outlines (Syllabus)'
        descriptionText='Access the official course outlines for all 46 B.Ed (Hons) subjects across 8 semesters.'
    />
);

// 8. Notes.jsx
export const Notes = () => (
    <DownloadSection
        linkKey='notesLink'
        buttonText='Get Notes'
        title='Academic Notes'
        descriptionText='Access lecture notes and supporting material for all 46 B.Ed (Hons) subjects across 8 semesters.'
    />
);

// 9. PastPaper.jsx
export const PastPaper = () => (
    <DownloadSection
        linkKey='pastPaperLink'
        buttonText='Get Paper'
        title='Past Examination Papers'
        descriptionText='Access previous year question papers for all 46 B.Ed (Hons) subjects across 8 semesters.'
    />
);