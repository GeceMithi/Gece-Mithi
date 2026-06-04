import React from 'react';

const YellowBorderCard = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-[#004d00] border-b-4 border-b-[#FFD700] overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 h-full ${className}`}>
            {children}
        </div>
    );
};

const InserviceTrainingCard = ({ prefix, name, profession }) => {
    const heading = (() => {
        if (!name) return 'Training Session';
        const trimmedPrefix = (prefix || '').trim();
        const trimmedName = name.trim();
        if (!trimmedPrefix) return trimmedName;
        const barePrefix = trimmedPrefix.replace(/\./g, '').toLowerCase();
        const bareName = trimmedName.replace(/\./g, '').toLowerCase();
        if (bareName.startsWith(barePrefix)) return trimmedName;
        return `${trimmedPrefix} ${trimmedName}`;
    })();

    return (
        <YellowBorderCard className="flex flex-col items-center text-center group p-4">
            <div className="w-full flex flex-col items-center justify-center gap-3">
                <h3 className="text-md font-bold text-gray-900 leading-tight">{heading}</h3>
                {profession && (
                    <p className="text-[#004d00] text-xs font-bold uppercase tracking-wide bg-green-50 px-3 py-1.5 rounded-full">
                        {profession}
                    </p>
                )}
            </div>
        </YellowBorderCard>
    );
};

export default InserviceTrainingCard;
