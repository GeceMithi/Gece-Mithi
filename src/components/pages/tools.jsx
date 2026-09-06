import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Icon } from '../services/uicomponents';

const Tools = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const toolsQuery = query(collection(db, 'academic_data'), where('category', '==', 'tools'));
        const snapshot = await getDocs(toolsQuery);
        setTools(snapshot.docs.map((toolDoc) => ({ id: toolDoc.id, ...toolDoc.data() })));
      } catch (error) {
        console.error('Failed to load tools:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTools();
  }, []);

  const ToolCard = ({ tool }) => {
    return (
      <div className="bg-white rounded-2xl p-6 border-2 border-amber-400 flex flex-col justify-between h-full transition-all duration-200">
        <div>
          {/* Small Rounded Icon Badge */}
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 ${
              tool.iconBg || 'bg-blue-50 text-blue-500'
            }`}
          >
            <Icon path={tool.icon || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'} />
          </div>

          {/* Title */}
          <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-2">
            {tool.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-600 leading-relaxed mb-6">
            {tool.description || 'Teaching and assessment resource.'}
          </p>
        </div>

        {/* Download Button */}
        <a
          href={tool.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-[#4cae38] hover:bg-[#439c32] active:scale-[0.99] text-white py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors duration-150"
        >
          {/* Download Tray Arrow Icon */}
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v11m0 0l-3.5-3.5M12 15l3.5-3.5"
            />
          </svg>
          <span>Download</span>
        </a>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Outer Main Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl border-2 border-amber-400 p-8 sm:p-12">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Teaching Tools
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 font-medium">
            Download essential tools for classroom observation and assessment.
          </p>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-full text-center text-slate-500">Loading tools...</p>
          ) : tools.length === 0 ? (
            <p className="col-span-full text-center text-slate-500">No tools available.</p>
          ) : tools.map((tool) => (
            <ToolCard key={tool.id || tool.title} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;