import React from 'react';
import { DownloadLink } from '../services/uicomponents';

const CourseCard = ({ course, linkKey, buttonText }) => {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50 hover:-translate-y-0.5 transition-all duration-200 transform">
            <span className="text-gray-700 font-medium mb-2 sm:mb-0">
                {course.name}
            </span>
            {course[linkKey] && (
                <DownloadLink 
                    linkUrl={course[linkKey]} 
                    buttonText={buttonText} 
                />
            )}
        </div>
    );
};

export default CourseCard;
