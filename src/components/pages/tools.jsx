import React from 'react';
import { Icon } from '../services/uicomponents';
import { toolsData } from '../../utils/data'; // <-- Ye import zaroori hai

const Tools = () => {
    
    const ToolCard = ({ tool }) => (
        <div className={`group bg-white p-6 rounded-2xl shadow-sm border ${tool.color.split(' ')[2]} cursor-pointer hover:shadow-xl hover:border-[#004d00] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full`}>
            <div>
                <div className={`w-14 h-14 ${tool.color.split(' ')[0]} ${tool.color.split(' ')[1]} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon path={tool.icon} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-[#004d00] transition-colors line-clamp-2">
                    {tool.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {tool.desc}
                </p>
            </div>
            
            {/* Download Button (Ab ye data.js se 'tool.link' uthayega) */}
            <a 
                href={tool.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-auto w-full flex items-center justify-center gap-2 bg-red-500  text-white hover:text-white py-2 rounded-lg text-sm font-bold transition-all border border-[#ffd200] hover:border-[#004d00]"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download
            </a>
        </div>
    );

    return (
        <div className="content-entry-animation">
            <div className="text-center mb-12 pt-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-yellow-500 tracking-tight">
                    Teaching <span className="text-[#004d00]">Tools & Forms</span>
                </h1>
                <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">
                    Essential observation forms, feedback tools, and lesson plan templates.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {toolsData.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
        </div>
    );
};

export default Tools;