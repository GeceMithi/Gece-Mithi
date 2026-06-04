import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from "firebase/firestore";

const DynamicTools = () => {
    const [tools, setTools] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTools = async () => {
            try {
                const toolsSnap = await getDocs(collection(db, "tools"));
                setTools(toolsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                setLoading(false);
            } catch (error) {
                console.error("Error fetching tools:", error);
                setLoading(false);
            }
        };

        fetchTools();
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
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tools & Resources</h2>
            {tools.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tools.map((tool) => (
                        <div key={tool.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{tool.name}</h3>
                            <div className="flex gap-2 mb-3">
                                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">{tool.category}</span>
                            </div>
                            <p className="text-gray-600 mb-4">{tool.description}</p>
                            {tool.url && (
                                <a 
                                    href={tool.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block bg-[#004d00] text-white px-4 py-2 rounded hover:bg-green-800 transition-colors"
                                >
                                    Open Tool
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500">No tools available.</p>
                </div>
            )}
        </div>
    );
};

export default DynamicTools;
