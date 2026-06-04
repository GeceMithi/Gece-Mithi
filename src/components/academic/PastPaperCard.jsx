import React from 'react';
import { Icon } from '../services/uicomponents';

const PastPaperCard = ({ semester }) => {
    const getSemesterColor = (semesterNum) => {
        const colors = {
            1: "bg-blue-50 text-blue-700 border-blue-200",
            2: "bg-blue-50 text-blue-700 border-blue-200",
            3: "bg-green-50 text-green-700 border-green-200",
            4: "bg-teal-50 text-teal-700 border-teal-200",
            5: "bg-yellow-50 text-yellow-700 border-yellow-200",
            6: "bg-orange-50 text-orange-700 border-orange-200",
            7: "bg-red-50 text-red-700 border-red-200",
            8: "bg-purple-50 text-purple-700 border-purple-200",
        };
        return colors[semesterNum] || "bg-gray-50 text-gray-700 border-gray-200";
    };

    const colorClass = getSemesterColor(semester.semester);

    return (
        <div className={`group bg-white p-5 rounded-2xl border-2 ${colorClass.split(' ')[2]} flex flex-col justify-between hover:border-[#004d00] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 transform`}>
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${colorClass.split(' ')[0]} ${colorClass.split(' ')[1]}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#004d00] transition-colors">
                    {semester.title}
                </h3>
                <p className="text-sm text-gray-500">{semester.desc}</p>
            </div>

            {/* Download Button */}
            <a 
                href={semester.link}
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:text-blue border border-[#ffd200] hover:border-[#004d00] py-2.5 rounded-lg text-sm font-bold transition-all"
            >
                <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4" />
                Download
            </a>
        </div>
    );
};

export default PastPaperCard;
