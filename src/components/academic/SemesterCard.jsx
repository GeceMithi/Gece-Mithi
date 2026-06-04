import React from 'react';

const SemesterCard = ({ semester, children }) => {
    const getSemesterDescription = (semesterNum) => {
        const descriptions = {
            1: "Foundation Courses.",
            2: "Early Childhood & Content.",
            3: "Curriculum & Arts Crafts.",
            4: "Practicum & Classroom Mgt.",
            5: "Advanced Foundations & English.",
            6: "Research Methods & Guidance.",
            7: "Pedagogy & Specialization 1.",
            8: "Specialization 2 & Thesis.",
        };
        return descriptions[semesterNum] || `Semester ${semesterNum} courses.`;
    };

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
        <div className="semester-card bg-white p-6 rounded-2xl shadow-md transition duration-300 border border-[#ffd200] hover:shadow-lg hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                    Semester {semester.semester}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
                    {getSemesterDescription(semester.semester)}
                </span>
            </div>
            
            {/* Children will be CourseCards or other content */}
            <div className="space-y-3">
                {children}
            </div>
        </div>
    );
};

export default SemesterCard;
