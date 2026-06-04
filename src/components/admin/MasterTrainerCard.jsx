import React from 'react';

const YellowBorderCard = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-[#004d00] border-b-4 border-b-[#FFD700] overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 h-full ${className}`}>
            {children}
        </div>
    );
};

const MasterTrainerCard = ({ trainer, className = '' }) => {
    return (
        <YellowBorderCard className={`flex flex-col items-center text-center group ${className}`}>
            <div className="p-4 w-full flex flex-col items-center flex-grow justify-center">
                <h3 className="text-md font-bold text-gray-900 leading-tight mb-2">
                    {trainer.name}
                </h3>
                <p className="text-[#004d00] text-xs font-bold uppercase tracking-wide bg-green-50 px-3 py-1.5 rounded-full">
                    {trainer.role}
                </p>
            </div>
        </YellowBorderCard>
    );
};

export default MasterTrainerCard;
