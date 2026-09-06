import React from 'react';
import useResourceData from '../../hook/useResourceData';

const PORTFOLIO_CONFIG = [
  { type: 'development', title: 'Developmental Portfolio' },
  { type: 'professional', title: 'Professional Portfolio' },
  { type: 'reading', title: 'Reading Portfolio' },
  { type: 'advance', title: 'Advance Portfolio' },
  { type: 'research', title: 'Research Thesis' },
];

const ITEM_TYPES = [
  { key: 'outline', label: 'Outline' },
  { key: 'handout', label: 'Handout' },
  { key: 'portfolio', label: 'Portfolio' },
];

const PortfolioCard = ({ title, items = [] }) => {
  return (
    <div className="w-full flex flex-col bg-gradient-to-b from-[#f9fff0] via-[#f7fcf0] to-[#e1f8e8] rounded-[24px] border-[2.5px] border-[#fcd34d] p-6 shadow-sm min-h-[310px]">
      {/* Title */}
      <div className="min-h-[50px] flex items-center justify-center text-center mb-6">
        <h3 className="text-[19px] font-bold text-slate-800 leading-tight">
          {title}
        </h3>
      </div>

      {/* Row Items */}
      <div className="space-y-4 w-full flex-1 flex flex-col justify-center">
        {ITEM_TYPES.map(({ key, label }) => {
          const itemData = items.find(
            (i) => (i.itemType || '').toLowerCase() === key ||
                   (key === 'portfolio' && (i.itemType || '').toLowerCase() === 'notes')
          );
          const hasFile = Boolean(itemData?.fileUrl && itemData.fileUrl.trim() !== '');

          return (
            <div
              key={key}
              className="flex items-center justify-between gap-3 px-4 py-3.5 bg-white border-[2px] border-[#fcd34d] rounded-2xl shadow-xs"
            >
              <span className="font-bold text-slate-800 text-[15px]">
                {label}
              </span>

              {hasFile ? (
                <a
                  href={itemData.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-[#009b4d] hover:bg-[#008240] text-white text-[13px] font-semibold px-4 py-2 rounded-full shadow-sm hover:shadow transition-all"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  Download
                </a>
              ) : (
                <span className="inline-flex items-center justify-center bg-[#e5e7eb] text-[#6b7280] text-[12px] font-medium px-3.5 py-1.5 rounded-full">
                  Coming Soon
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Portfolio = () => {
  const { resources, loading } = useResourceData();

  const portfolioResources = resources ? resources.filter((r) => r.category === 'portfolios') : [];

  const mainPortfolios = PORTFOLIO_CONFIG.slice(0, 4);
  const researchThesis = PORTFOLIO_CONFIG[4];

  const getItemsForType = (type) =>
    portfolioResources.filter((r) => (r.portfolioType || '').toLowerCase() === type.toLowerCase());

  return (
    <div className="w-full min-h-screen py-6 px-2 sm:px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-yellow-500 tracking-tight sm:text-5xl">
          Welcome to <span className="text-green-700">B.Ed. (Hons)</span>
        </h1>
        <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-800">
          Portfolio Resources
        </h2>
        <p className="mt-2 text-base text-gray-600 max-w-2xl mx-auto">
          Explore various types of portfolios essential for B.Ed (Hons) students to track development and showcase professional readiness.
        </p>
      </div>

      {/* Main Outer Box (Outer margin & padding reduced, width expanded) */}
      <div className="w-full max-w-[98%] xl:max-w-[1400px] mx-auto rounded-[32px] border-[2.5px] border-[#fcd34d] p-4 sm:p-6 bg-white/40 shadow-xs">
        {loading ? (
          <p className="text-center py-10 text-gray-500">Loading Portfolios...</p>
        ) : (
          <>
            {/* Top 4 Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 w-full">
              {mainPortfolios.map((item) => (
                <PortfolioCard
                  key={item.type}
                  title={item.title}
                  items={getItemsForType(item.type)}
                />
              ))}
            </div>

            {/* Bottom Centered Research Thesis Card */}
            <div className="flex justify-center w-full">
              <div className="w-full sm:w-[calc(50%-10px)] lg:w-[calc(25%-15px)]">
                <PortfolioCard
                  title={researchThesis.title}
                  items={getItemsForType(researchThesis.type)}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Portfolio;