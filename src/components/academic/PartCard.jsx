import React from 'react';

const PartCard = ({ part, index, children }) => {
    const getYearTitle = (year) => {
        const titles = {
            1: "Year 1 (Associate Degree / B.Ed)",
            2: "Year 2 (Associate Degree Final)",
            3: "Year 3 (B.Ed Hons)",
            4: "Year 4 (Final Year)",
        };
        return titles[year] || `Year ${year}`;
    };

    const getYearLabel = (year) => {
        const labels = {
            1: "First Year",
            2: "Second Year",
            3: "Third Year",
            4: "Fourth Year",
        };
        return labels[year] || `Year ${year}`;
    };

    return (
        <div 
            className="year-block p-6 bg-gray-100 border-t-8 border-green-700 rounded-3xl shadow-lg hover:shadow-xl transition duration-300 content-entry-animation"
            style={{ animationDelay: `${0.1 + (index * 0.15)}s` }}
        >
            <h2 className="text-3xl font-bold text-green-800 mb-6 border-b pb-2">
                Part {part.year}
            </h2>
            <div className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">{getYearTitle(part.year)}</span>
            </div>
            
            {/* Children will be SemesterCards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {children}
            </div>
        </div>
    );
};

export default PartCard;
