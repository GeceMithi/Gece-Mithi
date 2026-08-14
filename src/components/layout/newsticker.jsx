import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const NewTicker = ({ text, speed = 18 }) => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Listen to `newsTicker` collection in Firestore for real-time updates
        try {
            const q = query(collection(db, 'newsTicker'), orderBy('createdAt', 'desc'));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data()) }));
                if (msgs.length === 0) {
                    setItems([]);
                } else {
                    // Use text field if present, else fallback to full doc data
                    setItems(msgs.map(m => m.text || JSON.stringify(m)));
                }
            }, (err) => {
                console.error('NewTicker snapshot error:', err);
            });

            return () => unsubscribe();
        } catch (err) {
            console.error('NewTicker init error:', err);
        }
    }, []);

    const content = items.length > 0 ? items.join('  •  ') : (text || 'Latest updates: Admissions open for new batches | Visit the College portal for notices and exam schedules | Contact us for registrations and fee details.');

    return (
        <div className="w-full overflow-hidden border-4 border-[#FFD200] rounded-b-xl bg-white">
            <div className="relative overflow-hidden">
                    <div className="inline-block animate-marquee whitespace-nowrap min-w-max text-xs sm:text-sm text-black uppercase tracking-[0.22em] px-4 py-2">
                    {content}
                </div>
            </div>
            <style>{`@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } } .animate-marquee { animation: marquee ${speed}s linear infinite; }`}</style>
        </div>
    );
};

export default NewTicker;
