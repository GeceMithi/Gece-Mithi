import React from 'react';
import PastPaperBox from './PastPaperBox';

const getYearLabel = (part) => {
  const labels = {
    1: 'First Year',
    2: 'Second Year',
    3: 'Third Year',
    4: 'Fourth Year',
  };

  return labels[part] || `Year ${part}`;
};

const getPartTitle = (part) => {
  const titles = {
    1: 'Year 1 (Associate Degree / B.Ed)',
    2: 'Year 2 (Associate Degree Final)',
    3: 'Year 3 (B.Ed Hons)',
    4: 'Year 4 (Final Year)',
  };

  return titles[part] || `Year ${part}`;
};

const PastPaperSection = ({ sections = [], onDelete }) => {
  if (!sections.length) {
    return <p className="text-gray-500">No past paper items saved yet.</p>;
  }

  return (
    <div className="flex flex-col gap-8">
      {sections.map((section, index) => (
        <div
          key={section.partTitle || `part-${section.part || index + 1}`}
          className="bg-white rounded-[22px] border-2 border-[#f0d84d] shadow-[0_0_0_1px_rgba(240,216,77,0.2)] overflow-hidden"
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4 bg-[#f6f5f2] border-b border-[#f0d84d]">
            <div className="text-[#004d00] text-[11px] font-black uppercase tracking-[0.12em]">
              {getYearLabel(section.part || index + 1)}
            </div>
            <div className="text-3xl md:text-4xl font-black text-gray-300 leading-none">0{index + 1}</div>
          </div>

          <div className="px-5 py-4 md:px-8 md:py-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <h2 className="text-xl md:text-2xl font-extrabold text-[#0d4c0d] tracking-tight">
                {getPartTitle(section.part || index + 1)}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {section.items
                .slice()
                .sort((a, b) => Number(a.semester) - Number(b.semester))
                .map((paper) => (
                  <PastPaperBox key={paper.id || `${paper.part}-${paper.semester}`} paper={paper} onDelete={onDelete} />
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastPaperSection;
