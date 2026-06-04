import React from 'react';

const Watermark = () => {
    return (
        <div 
            className="fixed inset-0 pointer-events-none z-[9999] flex flex-wrap content-center justify-center overflow-hidden"
            style={{ opacity: 0.08 }} // Bilkul halka dikhega (8% opacity)
        >
            {/* Bohat saare text repeat honge taaki crop na kar sake */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} className="transform -rotate-45 text-black text-xl font-bold m-12 whitespace-nowrap">
                    GECE Mithi Property
                </div>
            ))}
        </div>
    );
};

export default Watermark;