import React from 'react';

const getItemTypeLabel = (itemType) => {
  const labels = {
    outline: 'Outline',
    handout: 'Handout',
    notes: 'Portfolio',
    portfolio: 'Portfolio',
  };

  return labels[itemType] || itemType;
};

const PortfoliosCard = ({ portfolio, onDelete, showMeta = false }) => {
  const hasFile = Boolean(portfolio?.fileUrl && portfolio.fileUrl.trim() !== '');

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3 bg-white border-2 border-[#fcd34d] rounded-xl shadow-xs transition-all hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <p className="font-bold text-slate-700 text-sm">
          {getItemTypeLabel(portfolio.itemType || portfolio.title)}
        </p>
        {showMeta && (
          <p className="text-xs text-gray-400 mt-0.5">
            {portfolio.portfolioType}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {hasFile ? (
          <a
            href={portfolio.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#009b4d] hover:bg-[#008240] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all"
          >
            <svg
              className="w-3.5 h-3.5"
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
          <span className="inline-flex items-center justify-center bg-[#e5e7eb] text-[#6b7280] text-[11px] font-medium px-2.5 py-1 rounded-full">
            Coming Soon
          </span>
        )}

        {onDelete && hasFile && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this item?')) {
                onDelete(portfolio.id);
              }
            }}
            className="text-gray-400 hover:text-red-500 p-1 text-xs transition"
            title="Delete"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};

export default PortfoliosCard;