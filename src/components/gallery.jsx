import React from 'react';
import { Icon } from './uicomponents';

const Gallery = () => {
    // Yahan aap apni Asli Tasveeron ke URL dalein
    const activities = [
        { id: 1, title: "Annual Sports Week", date: "Feb 2025", img: "https://placehold.co/600x400/004d00/FFF?text=Sports+Week" },
        { id: 2, title: "Independence Day", date: "14 Aug 2024", img: "https://placehold.co/600x400/004d00/FFF?text=14+August" },
        { id: 3, title: "Science Exhibition", date: "Dec 2024", img: "https://placehold.co/600x400/004d00/FFF?text=Science+Fair" },
        { id: 4, title: "Welcome Party", date: "Jan 2025", img: "https://placehold.co/600x400/004d00/FFF?text=Welcome+Party" },
        { id: 5, title: "Tree Plantation", date: "Mar 2024", img: "https://placehold.co/600x400/004d00/FFF?text=Plantation" },
        { id: 6, title: "Farewell Batch 2023", date: "Dec 2023", img: "https://placehold.co/600x400/004d00/FFF?text=Farewell" },
    ];

    return (
        <div className="content-entry-animation">
            <div className="text-center mb-10 pt-4">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    Life at <span className="text-[#004d00]">GECE</span>
                </h1>
                <p className="mt-2 text-gray-500">Glimpses of our activities and events.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activities.map((item) => (
                    <div key={item.id} className="group relative overflow-hidden rounded-xl shadow-lg cursor-pointer h-64">
                        <img 
                            src={item.img} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                            <h3 className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</h3>
                            <p className="text-[#FFD700] text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">{item.date}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;