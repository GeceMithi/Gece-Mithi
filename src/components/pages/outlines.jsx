// outline.jsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { yearsDownload } from '../../utils/data';
import { DownloadLink } from '../services/uicomponents';

const buildUpdatedOutlineData = (items) => {
    const grouped = new Map();

    items.forEach((item) => {
        const year = Number(item.year || 1);
        const semester = Number(item.semester || 1);
        const key = `${year}-${semester}`;

        if (!grouped.has(key)) {
            grouped.set(key, {
                year,
                semester,
                courses: []
            });
        }

        grouped.get(key).courses.push({
            name: item.title || item.subject || 'Course',
            outlineLink: item.fileUrl || item.link || '',
        });
    });

    // Group semesters by part/year
    const partGrouped = new Map();
    Array.from(grouped.values()).forEach((semesterBlock) => {
        const partKey = semesterBlock.year;
        if (!partGrouped.has(partKey)) {
            partGrouped.set(partKey, {
                year: semesterBlock.year,
                semesters: []
            });
        }
        partGrouped.get(partKey).semesters.push({
            semester: semesterBlock.semester,
            courses: semesterBlock.courses
        });
    });

    return Array.from(partGrouped.values())
        .sort((a, b) => a.year - b.year)
        .map((partBlock) => ({
            year: partBlock.year,
            semesters: partBlock.semesters.sort((a, b) => a.semester - b.semester)
        }));
};

const renderYearBlock = (yearBlock, linkKey, buttonText, titlePrefix = 'Previous') => (
    <div
        key={`${titlePrefix}-${yearBlock.year}`}
        className="year-block p-6 bg-gray-100 border-t-8 border-green-700 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 content-entry-animation"
    >
        <h2 className="text-3xl font-bold text-green-800 mb-6 border-b pb-2">
            Part {yearBlock.year}
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {yearBlock.semesters.map((semester) => (
                <div
                    key={`${titlePrefix}-${yearBlock.year}-${semester.semester}`}
                    className="semester-card bg-white p-6 rounded-2xl shadow-md transition duration-300 border border-[#ffd200] hover:shadow-lg hover:-translate-y-0.5"
                >
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                        Semester {semester.semester}
                    </h3>
                    <ul className="space-y-3">
                        {(semester.courses || []).map((course, i) => (
                            <li key={`${titlePrefix}-${yearBlock.year}-${semester.semester}-${i}`} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-[#ffd200] transition duration-200 hover:bg-indigo-50">
                                <span className="text-gray-700 font-medium mb-2 sm:mb-0">
                                    {course.name}
                                </span>
                                <DownloadLink
                                    linkUrl={course[linkKey] || course.outlineLink || course.notesLink || ''}
                                    buttonText={buttonText}
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);

const Outline = () => {
    const linkKey = 'outlineLink';
    const buttonText = 'Download';
    const title = 'Course Outlines (Syllabus)';
    const descriptionText = 'Access the official course outlines for B.Ed (Hons) subjects across 8 semesters.';
    const [updatedOutlineData, setUpdatedOutlineData] = useState([]);
    const [activeOutlineTab, setActiveOutlineTab] = useState('previous');

    useEffect(() => {
        const fetchUpdatedOutlines = async () => {
            try {
                const q = query(collection(db, 'academic_data'), where('category', '==', 'study-materials'));
                const snapshot = await getDocs(q);
                const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setUpdatedOutlineData(buildUpdatedOutlineData(items));
            } catch (error) {
                console.error('Error fetching updated outlines:', error);
                setUpdatedOutlineData([]);
            }
        };

        fetchUpdatedOutlines();
    }, []);

    const previousData = yearsDownload;
    const visibleOutlineData = activeOutlineTab === 'updated' ? updatedOutlineData : previousData;

    return (
        <>
            <div className="text-center mb-16 pt-8 pb-10">
                <h1 className="text-4xl font-extrabold text-yellow-500 tracking-tighter content-entry-animation sm:text-5xl">
                    Welcome to <span className="text-green-700"> B.Ed. (Hons)</span>
                </h1>
                <p className="mt-4 text-xl font-medium text-gray-600 content-entry-animation" style={{ animationDelay: '0.3s' }}>
                    {title}
                </p>
                <p className="mt-8 text-lg text-gray-500 content-entry-animation" style={{ animationDelay: '0.4s' }}>
                    {descriptionText}
                </p>
            </div>

            <div className="mt-8 px-4 sm:px-0">
                <div className="mb-8 flex justify-center">
                    <div className="inline-flex rounded-full border-2 border-[#d4d4d8] bg-[#f4f4f5] p-1.5 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setActiveOutlineTab('previous')}
                            className={`rounded-full border px-6 py-2.5 text-sm sm:text-base font-extrabold tracking-[0.08em] uppercase transition-all ${
                                activeOutlineTab === 'previous'
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md border-green-700'
                                    : 'text-green-800 hover:text-green-900 border-green-300 bg-green-50'
                            }`}
                        >
                            Previous Outline
                        </button>
                        {updatedOutlineData.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setActiveOutlineTab('updated')}
                                className={`rounded-full border px-6 py-2.5 text-sm sm:text-base font-extrabold tracking-[0.08em] uppercase transition-all ${
                                    activeOutlineTab === 'updated'
                                        ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-md border-yellow-600'
                                        : 'text-yellow-700 hover:text-yellow-800 border-yellow-300 bg-yellow-50'
                                }`}
                            >
                                Updated Outline
                            </button>
                        )}
                    </div>
                </div>

                <div className="space-y-12">
                    {visibleOutlineData.length > 0 ? (
                        visibleOutlineData.map((yearBlock) => renderYearBlock(yearBlock, linkKey, buttonText, activeOutlineTab === 'updated' ? 'Updated' : 'Previous'))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-500">
                            No outline data available.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Outline;