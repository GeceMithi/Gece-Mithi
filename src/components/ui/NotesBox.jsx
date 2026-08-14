import React from 'react';
import NotesCard from './NotesCard';

const NotesBox = ({ title, items, emptyText, compact = false }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className="rounded-3xl border border-[#ffd200] bg-white p-4 shadow-xl sm:p-6">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-extrabold text-green-800 sm:text-4xl">{title}</h2>
            </div>
            <div className="space-y-4">
                {items.map((item) => (
                    <NotesCard key={item.id} item={item} showMeta={!compact} />
                ))}
            </div>
        </div>
    );
};

export default NotesBox;
