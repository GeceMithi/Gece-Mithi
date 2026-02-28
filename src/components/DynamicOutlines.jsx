import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

const DynamicOutlines = () => {
    const [outlines, setOutlines] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOutlines = async () => {
            try {
                const outlinesSnap = await getDocs(collection(db, "outlines"));
                setOutlines(outlinesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching outlines:", error);
                setLoading(false);
            }
        };

        fetchOutlines();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Outlines</h2>
            {outlines.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {outlines.map((outline) => (
                        <div key={outline.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-3">{outline.title}</h3>
                            <p className="text-gray-600 mb-4">{outline.description}</p>
                            {outline.fileUrl && (
                                <a 
                                    href={outline.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
                                >
                                    View Outline
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No outlines available.</p>
                </div>
            )}
        </div>
    );
};

export default DynamicOutlines;
