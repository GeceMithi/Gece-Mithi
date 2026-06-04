import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

const useSuccessStories = () => {
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all success stories
    const fetchSuccessStories = async () => {
        try {
            console.log('🔄 Fetching success stories from Firebase...');
            
            const successStoriesCollection = collection(db, 'success_stories');
            const q = query(successStoriesCollection, orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const storiesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            
            console.log(`✅ Fetched ${storiesData.length} success stories`);
            setStories(storiesData);
            setLoading(false);
            
        } catch (error) {
            console.error('❌ Error fetching success stories:', error);
            setError('Failed to load success stories');
            setLoading(false);
        }
    };

    // Add new success story
    const addSuccessStory = async (storyData) => {
        try {
            console.log('📝 Adding new success story...');
            
            const newStory = {
                ...storyData,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            };
            
            const successStoriesCollection = collection(db, 'success_stories');
            const docRef = await addDoc(successStoriesCollection, newStory);
            
            console.log(`✅ Success story added with ID: ${docRef.id}`);
            
            // Refresh stories list
            await fetchSuccessStories();
            
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('❌ Error adding success story:', error);
            setError('Failed to add success story');
            return { success: false, error: error.message };
        }
    };

    // Update success story
    const updateSuccessStory = async (storyId, storyData) => {
        try {
            console.log(`🔄 Updating success story: ${storyId}`);
            
            const updatedData = {
                ...storyData,
                updatedAt: new Date()
            };
            
            const storyRef = doc(db, 'success_stories', storyId);
            await updateDoc(storyRef, updatedData);
            
            console.log(`✅ Success story updated successfully`);
            
            // Refresh stories list
            await fetchSuccessStories();
            
            return { success: true };
        } catch (error) {
            console.error('❌ Error updating success story:', error);
            setError('Failed to update success story');
            return { success: false, error: error.message };
        }
    };

    // Delete success story
    const deleteSuccessStory = async (storyId) => {
        try {
            console.log(`🗑️ Deleting success story: ${storyId}`);
            
            const storyRef = doc(db, 'success_stories', storyId);
            await deleteDoc(storyRef);
            
            console.log(`✅ Success story deleted successfully`);
            
            // Refresh stories list
            await fetchSuccessStories();
            
            return { success: true };
        } catch (error) {
            console.error('❌ Error deleting success story:', error);
            setError('Failed to delete success story');
            return { success: false, error: error.message };
        }
    };

    // Get success story by ID
    const getSuccessStoryById = async (storyId) => {
        try {
            const storyRef = doc(db, 'success_stories', storyId);
            const storyDoc = await getDoc(storyRef);
            
            if (storyDoc.exists()) {
                return { success: true, data: { id: storyDoc.id, ...storyDoc.data() } };
            } else {
                return { success: false, error: 'Success story not found' };
            }
        } catch (error) {
            console.error('❌ Error getting success story:', error);
            return { success: false, error: error.message };
        }
    };

    // Toggle story active status
    const toggleStoryStatus = async (storyId, isActive) => {
        try {
            console.log(`🔄 Toggling story status: ${storyId} -> ${isActive}`);
            
            const storyRef = doc(db, 'success_stories', storyId);
            await updateDoc(storyRef, { 
                isActive: isActive,
                updatedAt: new Date()
            });
            
            console.log(`✅ Story status updated successfully`);
            
            // Refresh stories list
            await fetchSuccessStories();
            
            return { success: true };
        } catch (error) {
            console.error('❌ Error toggling story status:', error);
            setError('Failed to update story status');
            return { success: false, error: error.message };
        }
    };

    // Get active stories only
    const getActiveStories = () => {
        return stories.filter(story => story.isActive !== false);
    };

    // Get stories by batch
    const getStoriesByBatch = (batch) => {
        return stories.filter(story => story.batch === batch && story.isActive !== false);
    };

    useEffect(() => {
        fetchSuccessStories();
    }, []);

    return {
        stories,
        loading,
        error,
        fetchSuccessStories,
        addSuccessStory,
        updateSuccessStory,
        deleteSuccessStory,
        getSuccessStoryById,
        toggleStoryStatus,
        getActiveStories,
        getStoriesByBatch
    };
};

export default useSuccessStories;
