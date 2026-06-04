import React from 'react';

const FacultyCard = ({ item, collectionType, onDelete }) => {
    const isStaff = ['faculty','visiting_faculty','non_teaching_staff','volunteer_teachers'].includes(collectionType);

    return (
        <div className="bg-white border border-[#ffd200] rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition h-full">
            <div className="p-5 flex-1">
                {isStaff ? (
                    <>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">{item.prefix ? `${item.prefix} ` : ''}{item.name}</h4>
                        {(item.designation || item.role || item.profession) && (
                            <p className="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wider bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                                {item.designation || item.role || item.profession}
                            </p>
                        )}
                        {item.department && <p className="text-sm text-gray-600 font-medium mt-1"><span className="font-bold text-[#004d00]">Dept:</span> {item.department}</p>}
                        {item.qualification && <p className="text-sm text-gray-600 font-medium mt-1"><span className="font-bold text-[#004d00]">Qual:</span> {item.qualification}</p>}
                        {(item.experience || item.duration) && <p className="text-sm text-gray-600 font-medium mt-1"><span className="font-bold text-[#004d00]">Exp:</span> {item.experience || item.duration}</p>}
                        {item.email && <p className="text-sm text-gray-500 mt-1 truncate"><span className="font-bold">Email:</span> {item.email}</p>}
                        {item.phone && <p className="text-sm text-gray-500 mt-1"><span className="font-bold">Phone:</span> {item.phone}</p>}
                        {item.batch && <p className="text-sm text-[#004d00] font-extrabold uppercase mt-1 tracking-wide">Batch {item.batch}</p>}
                    </>
                ) : (
                    <>
                        {item.title && <h4 className="font-bold text-gray-900 text-lg mb-1">{item.title}</h4>}
                        {item.name && !item.title && <h4 className="font-bold text-gray-900 text-lg mb-1">{item.name}</h4>}
                        {(item.subject || item.category || item.profession) && (
                            <p className="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wider bg-gray-100 px-2 py-0.5 rounded-full inline-block">
                                {item.subject || item.category || item.profession}
                            </p>
                        )}
                        {item.year && <p className="text-sm text-gray-600 font-medium mt-1"><span className="font-bold text-[#004d00]">Year:</span> {item.year}</p>}
                        {item.organizer && <p className="text-sm text-gray-600 font-medium mt-1"><span className="font-bold text-[#004d00]">Organizer:</span> {item.organizer}</p>}
                        {item.venue && <p className="text-sm text-gray-600 font-medium mt-1"><span className="font-bold text-[#004d00]">Venue:</span> {item.venue}</p>}
                        {item.date && <p className="text-sm text-gray-600 font-medium mt-1"><span className="font-bold text-[#004d00]">Date:</span> {item.date}</p>}
                        {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                        {(item.fileUrl || item.url) && <a href={item.fileUrl || item.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-1 inline-block font-bold">View File</a>}
                    </>
                )}
            </div>
            <div className="bg-[#004d00] text-white text-xs font-bold text-center py-2 flex items-center justify-between px-4 mt-auto">
                <span className="uppercase tracking-wide">{isStaff ? (item.designation || item.role || 'Staff') : collectionType.replace(/_/g,' ')}</span>
                <button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs font-bold border border-[#ffd200]">Delete</button>
            </div>
        </div>
    );
};

export default FacultyCard;

