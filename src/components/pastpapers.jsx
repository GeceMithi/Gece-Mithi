import React from 'react';
import { Icon } from './uicomponents';
// Import Data from data.js
import { pastPapersData } from '../data';

const PastPaper = () => {

    return (
        <div className="content-entry-animation">
            
            {/* --- Header Section --- */}
            <div className="text-center mb-12 pt-6">
                <span className="block text-[#FFD700] font-bold tracking-widest uppercase text-xs md:text-sm mb-2">
                    Welcome to B.Ed. (Hons)
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-500 tracking-tight mb-4">
                    Past <span className="text-[#004d00]">Examination Papers</span>
                </h1>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                    Access previous year question papers for all B.Ed (Hons) subjects across 8 semesters.
                </p>
            </div>

            {/* --- LOOP THROUGH IMPORTED DATA --- */}
            <div className="flex flex-col gap-10"> 
                
                {pastPapersData.map((part, index) => (
                    // --- PART BOX (Container) ---
                    <div key={index} className="bg-white rounded-3xl shadow-xl border border-[#ffd200] overflow-hidden transform transition-all hover:shadow-2xl">
                        
                        {/* Box Header (Gray Bar) */}
                        <div className="bg-gray-50 p-6 border-b border-[#ffd200] flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <span className="text-[#004d00] bg-green-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {part.yearLabel}
                                </span>
                                <h2 className="text-xl md:text-2xl font-bold text-green-800 mt-2">
                                    {part.partTitle}
                                </h2>
                            </div>
                            {/* Decorative Number */}
                            <div className="text-4xl font-black text-gray-200">0{index + 1}</div>
                        </div>

                        {/* Box Body (Cards Grid) */}
                        <div className="p-6 md:p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {part.semesters.map((sem) => (
                                    <div key={sem.id} className={`group bg-white p-5 rounded-2xl border-2 ${sem.color.split(' ')[2]} flex flex-col justify-between hover:border-[#004d00] hover:shadow-md transition-all duration-300`}>
                                        
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${sem.color.split(' ')[0]} ${sem.color.split(' ')[1]}`}>
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#004d00] transition-colors">{sem.title}</h3>
                                            <p className="text-sm text-gray-500">{sem.desc}</p>
                                        </div>

                                        {/* Download Button */}
                                        <a 
                                            href={sem.link}
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white hover:text-blue border border-[#ffd200] hover:border-[#004d00] py-2.5 rounded-lg text-sm font-bold transition-all"
                                        >
                                            <Icon path="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" className="w-4 h-4" />
                                            Download
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
};

export default PastPaper;