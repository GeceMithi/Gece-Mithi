import React from 'react';
import DownloadButton from './DownloadButton';

const getSemesterColor = (semesterNum) => {
  const colors = {
    1: { card: 'bg-[#f3f8ff] border-[#9ec0f7] text-[#3d5e97]', icon: 'bg-[#e8f1ff] text-[#3d5e97]' },
    2: { card: 'bg-[#f3f8ff] border-[#9ec0f7] text-[#3d5e97]', icon: 'bg-[#e8f1ff] text-[#3d5e97]' },
    3: { card: 'bg-[#f3fff5] border-[#7dd8a6] text-[#2d7d52]', icon: 'bg-[#e8f9ee] text-[#2d7d52]' },
    4: { card: 'bg-[#f3fffb] border-[#9adfc8] text-[#2b7d67]', icon: 'bg-[#e8faf5] text-[#2b7d67]' },
    5: { card: 'bg-[#fffaf0] border-[#f1d57a] text-[#8a6924]', icon: 'bg-[#fef5d9] text-[#8a6924]' },
    6: { card: 'bg-[#fff5ee] border-[#f3b08b] text-[#a3592d]', icon: 'bg-[#fdebd8] text-[#a3592d]' },
    7: { card: 'bg-[#fff3f3] border-[#f39c9c] text-[#a94141]', icon: 'bg-[#fde1e1] text-[#a94141]' },
    8: { card: 'bg-[#faf4ff] border-[#d8b5ee] text-[#7f4aa5]', icon: 'bg-[#f3e4ff] text-[#7f4aa5]' },
  };

  return colors[semesterNum] || { card: 'bg-gray-50 border-gray-200 text-gray-700', icon: 'bg-gray-100 text-gray-700' };
};

const PastPaperBox = ({ paper, onDelete }) => {
  const palette = getSemesterColor(paper.semester);

  return (
    <div className={`group bg-white rounded-[18px] border-2 ${palette.card} p-4 md:p-5 shadow-sm hover:shadow-md transition-all duration-200`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${palette.icon}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
      </div>

      <div className="mb-5">
        <h3 className="text-lg font-bold text-gray-800">
          Semester {paper.semester}
        </h3>
      </div>

      <div className="flex gap-2">
        <DownloadButton url={paper.fileUrl || paper.link} label="Download" />
        {onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('🗑️ Are you sure you want to delete this past paper?\n\nThis action cannot be undone.')) {
                onDelete(paper.id);
              }
            }}
            className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 hover:shadow-lg transition"
            title="Delete this past paper from Firebase"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default PastPaperBox;
