import React from 'react';
import PortfoliosBox from './PortfoliosBox';
import useResourceData from '../../hook/useResourceData';

const portfolioTypes = [
  { type: 'development', label: 'Developmental Portfolio' },
  { type: 'professional', label: 'Professional Portfolio' },
  { type: 'reading', label: 'Reading Portfolio' },
  { type: 'advance', label: 'Advance Portfolio' },
  { type: 'research', label: 'Research Thesis' }
];

const defaultItemTypes = ['outline', 'handout', 'portfolio'];

const PortfoliosSection = ({ sections, onDelete }) => {
  // Agar parent se sections pass na ho toh live hook se fetch karega
  const { resources, loading } = useResourceData();

  const portfolioResources = resources ? resources.filter(r => r.category === 'portfolios') : [];

  const groupedSections = sections || portfolioTypes.map(({ type, label }) => {
    const matchingResources = portfolioResources.filter(
      r => (r.portfolioType || '').toLowerCase() === type.toLowerCase()
    );

    const items = defaultItemTypes.map(itemType => {
      const found = matchingResources.find(
        r => (r.itemType || '').toLowerCase() === itemType || 
             (itemType === 'portfolio' && (r.itemType || '').toLowerCase() === 'notes')
      );

      return found || {
        id: `${type}-${itemType}`,
        portfolioType: type,
        itemType: itemType,
        fileUrl: '' // Missing link will show "Coming Soon"
      };
    });

    return {
      portfolioType: type,
      title: label,
      items
    };
  });

  const mainPortfolios = groupedSections.filter(s => s.portfolioType !== 'research');
  const researchThesis = groupedSections.find(s => s.portfolioType === 'research');

  if (loading && !sections) {
    return <div className="text-center py-12 text-gray-500">Loading Portfolios...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Outer Border Box matching Screenshot style */}
      <div className="rounded-3xl border-2 border-[#fcd34d] p-6 bg-white/50 shadow-sm">
        
        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainPortfolios.map((section) => (
            <div
              key={section.portfolioType}
              className="bg-gradient-to-b from-[#f9fff3] via-[#f7fcf0] to-[#e6fae8] rounded-2xl border-2 border-[#fcd34d] p-5 shadow-sm"
            >
              <h3 className="text-[17px] font-bold text-slate-800 text-center mb-5 tracking-tight">
                {section.title || portfolioTypes.find(p => p.type === section.portfolioType)?.label}
              </h3>

              <div className="space-y-3">
                {section.items.map((portfolio) => (
                  <PortfoliosBox
                    key={portfolio.id || `${portfolio.portfolioType}-${portfolio.itemType}`}
                    portfolio={portfolio}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Centered Research Thesis Box */}
        {researchThesis && (
          <div className="flex justify-center">
            <div className="w-full sm:w-[320px] md:w-[290px] bg-gradient-to-b from-[#f9fff3] via-[#f7fcf0] to-[#e6fae8] rounded-2xl border-2 border-[#fcd34d] p-5 shadow-sm">
              <h3 className="text-[17px] font-bold text-slate-800 text-center mb-5 tracking-tight">
                Research Thesis
              </h3>

              <div className="space-y-3">
                {researchThesis.items.map((portfolio) => (
                  <PortfoliosBox
                    key={portfolio.id || `${portfolio.portfolioType}-${portfolio.itemType}`}
                    portfolio={portfolio}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default PortfoliosSection;