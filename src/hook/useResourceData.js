import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';

const useResourceData = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all resources from Firebase
    const fetchResources = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const resourcesCollection = collection(db, 'resources');
            const q = query(resourcesCollection, orderBy('addedDate', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const resourcesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setResources(resourcesData);
        } catch (err) {
            console.error('Error fetching resources:', err);
            setError('Failed to fetch resources data');
        } finally {
            setLoading(false);
        }
    };

    // Add new resource to Firebase
    const addResource = async (resourceData) => {
        try {
            setError(null);
            
            const resourcesCollection = collection(db, 'resources');
            const docRef = await addDoc(resourcesCollection, {
                ...resourceData,
                addedDate: new Date().toISOString(),
                updatedDate: new Date().toISOString()
            });
            
            // Refresh resources list
            await fetchResources();
            
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error('Error adding resource:', err);
            setError('Failed to add resource');
            return { success: false, error: err.message };
        }
    };

    // Update existing resource in Firebase
    const updateResource = async (resourceId, resourceData) => {
        try {
            setError(null);
            
            const resourceDoc = doc(db, 'resources', resourceId);
            await updateDoc(resourceDoc, {
                ...resourceData,
                updatedDate: new Date().toISOString()
            });
            
            // Refresh resources list
            await fetchResources();
            
            return { success: true };
        } catch (err) {
            console.error('Error updating resource:', err);
            setError('Failed to update resource');
            return { success: false, error: err.message };
        }
    };

    // Delete resource from Firebase
    const deleteResource = async (resourceId) => {
        try {
            setError(null);
            
            const resourceDoc = doc(db, 'resources', resourceId);
            await deleteDoc(resourceDoc);
            
            // Refresh resources list
            await fetchResources();
            
            return { success: true };
        } catch (err) {
            console.error('Error deleting resource:', err);
            setError('Failed to delete resource');
            return { success: false, error: err.message };
        }
    };

    // Get resources by category
    const getResourcesByCategory = async (category) => {
        try {
            setLoading(true);
            setError(null);
            
            const resourcesCollection = collection(db, 'resources');
            const q = query(
                resourcesCollection, 
                where('category', '==', category),
                orderBy('addedDate', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            const resourcesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            return resourcesData;
        } catch (err) {
            console.error('Error fetching resources by category:', err);
            setError('Failed to fetch resources by category');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Search resources by title or description
    const searchResources = async (searchTerm) => {
        try {
            setLoading(true);
            setError(null);
            
            const resourcesCollection = collection(db, 'resources');
            const querySnapshot = await getDocs(resourcesCollection);
            
            const resourcesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            const filteredResources = resourcesData.filter(resource => 
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.category.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            return filteredResources;
        } catch (err) {
            console.error('Error searching resources:', err);
            setError('Failed to search resources');
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Get resource statistics
    const getResourceStatistics = async () => {
        try {
            const resourcesCollection = collection(db, 'resources');
            const querySnapshot = await getDocs(resourcesCollection);
            
            const resourcesData = querySnapshot.docs.map(doc => ({
                ...doc.data()
            }));
            
            const stats = {
                total: resourcesData.length,
                studyMaterials: resourcesData.filter(r => r.category === 'study-materials').length,
                pastPapers: resourcesData.filter(r => r.category === 'past-papers').length,
                notes: resourcesData.filter(r => r.category === 'notes').length,
                other: resourcesData.filter(r => r.category === 'other').length
            };
            
            return stats;
        } catch (err) {
            console.error('Error getting resource statistics:', err);
            return {
                total: 0,
                studyMaterials: 0,
                pastPapers: 0,
                notes: 0,
                other: 0
            };
        }
    };

    // Initialize data on component mount
    useEffect(() => {
        fetchResources();
    }, []);

    return {
        resources,
        loading,
        error,
        fetchResources,
        addResource,
        updateResource,
        deleteResource,
        getResourcesByCategory,
        searchResources,
        getResourceStatistics
    };
};

export default useResourceData;
