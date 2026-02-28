import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from "firebase/firestore";

const DynamicPastPapers = () => {
    const [pastPapers, setPastPapers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPastPapers = async () => {
            try {
                const pastPapersSnap = await getDocs(collection(db, "past_papers"));
                setPastPapers(pastPapersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching past papers:", error);
                setLoading(false);
            }
        };

        fetchPastPapers();
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Past Papers</h2>
            {pastPapers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastPapers.map((paper) => (
                        <div key={paper.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{paper.title}</h3>
                            <div className="flex gap-2 mb-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{paper.year}</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{paper.subject}</span>
                            </div>
                            <p className="text-gray-600 mb-4">{paper.description}</p>
                            {paper.fileUrl && (
                                <a 
                                    href={paper.fileUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
                                >
                                    Download Paper
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No past papers available.</p>
                </div>
            )}
        </div>
    );
};

export default DynamicPastPapers;
