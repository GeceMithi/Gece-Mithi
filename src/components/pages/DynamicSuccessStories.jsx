import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

// Import default images
import menlogo from '../../assets/staff/menlogo.png';
import womenlogo from '../../assets/staff/womenlogo.png';

// Batch series in descending order (2k20, 2k19, 2k18, 2k17...)
const BATCH_SERIES = ['2k20', '2k19', '2k18', '2k17', '2k16', '2k15', '2k14', '2k13', '2k12', '2k11', '2k10'];

// Function to sort stories by batch in descending order
const sortStoriesByBatch = (storiesData) => {
    return storiesData.sort((a, b) => {
        const batchA = a.batch?.toLowerCase() || '';
        const batchB = b.batch?.toLowerCase() || '';

        // Find index in BATCH_SERIES
        const indexA = BATCH_SERIES.findIndex(batch => batch.toLowerCase() === batchA);
        const indexB = BATCH_SERIES.findIndex(batch => batch.toLowerCase() === batchB);

        // If batch is in the series, use its index
        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB; // Both in series, sort by position
        }

        // If only one is in series, it comes first
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        // If neither is in series, sort alphabetically descending
        return batchB.localeCompare(batchA);
    });
};

const DynamicSuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);

    // Fetch success stories from Firebase
    const fetchSuccessStories = async () => {
        try {
            console.log('🔄 Fetching success stories from Firebase...');
            
            const successStoriesCollection = collection(db, 'success_stories');
            const q = query(successStoriesCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const storiesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function'
                    ? data.createdAt.toDate()
                    : new Date(data.createdAt || undefined);

                return {
                    id: doc.id,
                    name: data.name || 'Unknown',
                    role: data.role || 'Alumni',
                    fullStory: data.message || 'Full story not available',
                    img: data.profileImage || data.imageUrl || data.fileUrl || (data.gender === 'female' ? womenlogo : menlogo),
                    batch: data.batch || '',
                    achievements: data.achievements || [],
                    isActive: data.isActive !== false,
                    createdAt: createdAt || new Date()
                };
            });
            
            console.log(`✅ Fetched ${storiesData.length} success stories`);
            
            // Sort stories by batch in descending order
            const sortedStories = sortStoriesByBatch(storiesData);
            setStories(sortedStories);
            setLoading(false);
            
        } catch (error) {
            console.error('❌ Error fetching success stories:', error);
            setError('Failed to load success stories');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSuccessStories();
    }, []);

    const handleReadFullStory = (story) => {
        setSelectedStory(story);
        window.scrollTo(0, 0);
    };

    const handleBackToStories = () => {
        setSelectedStory(null);
    };

    if (loading) {
        return (
            <div className="content-entry-animation max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
                    <p className="mt-4 text-gray-600">Loading Stories of Successful Students...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="content-entry-animation max-w-7xl mx-auto px-4 py-8">
                <div className="text-center text-red-600">
                    <p>{error}</p>
                    <button 
                        onClick={fetchSuccessStories}
                        className="mt-4 bg-[#004d00] text-white px-4 py-2 rounded hover:bg-[#006400]"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (selectedStory) {
        return (
            <div className="content-entry-animation max-w-6xl mx-auto px-4" style={{ margin: '0 auto 2rem auto', marginTop: '4rem' }}>
                <div className="bg-white rounded-3xl shadow-xl border-4 overflow-hidden" style={{ borderTopColor: '#FFD700', borderRightColor: '#004d00', borderBottomColor: '#004d00', borderLeftColor: '#004d00' }}>
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#004d00] to-[#006400] text-white p-6">
                        <button
                            onClick={handleBackToStories}
                            className="mb-4 flex items-center gap-2 text-white hover:text-[#FFD700] transition-colors border-2 border-[#FFD700] rounded-lg px-4 py-2"
                        >
                            <span className="text-xl">←</span>
                            <span>Back to Stories</span>
                        </button>
                        <h1 className="text-3xl font-bold">Stories of Successful Students</h1>
                        <p className="text-white/80 mt-2">Read the full journey of our alumni</p>
                    </div>
                    
                    {/* Content */}
                    <div className="p-8">
                        <div className="flex flex-col items-center gap-8">
                            
                            {/* Smaller Profile Image */}
                            <div className="shrink-0 text-center">
                                <div className="w-48 h-48 md:w-56 md:h-56 lg:w-60 lg:h-60 relative mx-auto">
                                    <div className="absolute inset-0 bg-[#004d00]/10 rounded-full blur-xl"></div>
                                    <img 
                                        src={selectedStory.img} 
                                        alt={selectedStory.name} 
                                        className="relative w-full h-full object-cover rounded-full border-4 border-[#FFD700] shadow-xl"
                                    />
                                </div>

                                <div className="mt-5">
                                    <h2 className="text-2xl font-bold text-[#004d00]">{selectedStory.name}</h2>
                                    <p className="text-[#004d00] text-lg mt-1">{selectedStory.role}</p>
                                    {selectedStory.batch && (
                                        <p className="text-gray-600 text-sm mt-1">Batch: {selectedStory.batch}</p>
                                    )}
                                </div>
                            </div>
                            
                            {/* Story Content */}
                            <div className="w-full max-w-4xl">
                                <div className="space-y-6 text-gray-700 leading-relaxed">
                                    <div className="border-4 border-[#FFD700] rounded-3xl p-6 bg-white shadow-2xl transition-all duration-500">
                                        <div className="prose prose-lg max-w-none">
                                            {selectedStory.fullStory.split('\n').map((paragraph, index) => (
                                                <p key={index} className="mb-4 text-lg text-justify">
                                                    {paragraph}
                                                </p>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Achievements */}
                                    {selectedStory.achievements && selectedStory.achievements.length > 0 && (
                                        <div className="mt-10 bg-gray-50 p-6 rounded-2xl border-2 border-[#FFD700]">
                                            <h3 className="text-2xl font-bold text-[#004d00] mb-4">Key Achievements</h3>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {selectedStory.achievements.map((achievement, index) => (
                                                    <li key={index} className="flex items-start gap-2 bg-white p-3 rounded-lg shadow-sm">
                                                        <span className="text-[#FFD700] font-bold">✓</span>
                                                        <span className="text-gray-700">{achievement}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="content-entry-animation max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-[#004d00] mb-4">
                    Stories of Successful Students
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Discover the inspiring journeys of our graduates who are making significant contributions to education and society
                </p>
            </div>

            {stories.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-gray-500 text-lg">
                        <p>No Stories of Successful Students available yet.</p>
                        <p className="text-sm mt-2">Check back soon for inspiring stories from our alumni!</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {stories.map((story) => (
                        <div 
                            key={story.id}
                            className="bg-gradient-to-br from-white via-green-50 to-yellow-50 rounded-3xl shadow-2xl border-4 border-[#FFD700] overflow-hidden hover:shadow-3xl hover:scale-105 hover:-translate-y-1 transition-all duration-500 transform relative group min-h-[28rem]"
                        >
                            <div className="h-3 bg-gradient-to-r from-[#004d00] via-[#FFD700] to-[#004d00]"></div>
                            
                            <div className="p-6 text-center relative">
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#004d00] to-[#FFD700]"></div>
                                </div>
                                
                                <div className="relative w-32 h-32 mx-auto mb-4 sm:w-36 sm:h-36 lg:w-40 lg:h-40">
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#004d00] to-[#FFD700] rounded-full blur-sm opacity-30"></div>
                                    <div className="relative w-full h-full border-4 border-[#FFD700] rounded-full overflow-hidden shadow-xl flex items-center justify-center bg-white">
                                        <img 
                                            src={story.img} 
                                            alt={story.name} 
                                            className="w-full h-full object-center rounded-full border-2 border-[#004d00] shadow-lg"
                                        />
                                    </div>
                                    <div className="absolute -inset-2 border-2 border-[#FFD700] rounded-full opacity-60"></div>
                                </div>
                                
                                <div className="relative">
                                    <h3 className="text-xl font-bold text-[#004d00] mb-1 tracking-tight">
                                        {story.name}
                                    </h3>
                                    <p className="text-sm font-bold text-[#004d00] mb-3 uppercase tracking-wide">
                                        {story.role}
                                    </p>
                                    {story.batch && (
                                        <div className="inline-block bg-[#004d00] text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            {story.batch}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="px-6 pb-4">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border-2 border-[#FFD700]/30">
                                    <div className="flex items-center justify-center">
                                        <button 
                                            onClick={() => handleReadFullStory(story)}
                                            className="w-full max-w-[12rem] bg-gradient-to-r from-[#004d00] to-[#006400] text-white px-5 py-3 rounded-full text-sm font-bold hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                                        >
                                            Read Full Story
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DynamicSuccessStories;
