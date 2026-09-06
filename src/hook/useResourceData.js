import { useState, useEffect } from 'react';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, where } from 'firebase/firestore';
import { convertResourceUrl } from '../utils/downloadUrl';

const useResourceData = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch all resources from Firebase - UNIFIED SYSTEM
    const fetchResources = async () => {
        try {
            console.log('🔄 Starting to fetch resources from UNIFIED Firebase collection...');
            setLoading(true);
            setError(null);
            
            console.log('📊 Creating collection reference for academic_data...');
            const unifiedCollection = collection(db, 'academic_data');
            const q = query(unifiedCollection, orderBy('createdAt', 'desc'));
            
            console.log('🔍 Executing query...');
            const querySnapshot = await getDocs(q);
            console.log('📋 Query snapshot received, docs count:', querySnapshot.docs.length);
            
            const resourcesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                const title = data.title || data.subject || '';
                const portfolioType = data.portfolioType || title.split(' - ')[0] || '';
                const itemType = data.itemType || title.split(' - ')[1] || '';
                console.log(`📄 Processing UNIFIED Firebase doc: ${doc.id}`, data);
                
                const mappedData = {
                    id: doc.id,
                    ...data,
                    // Map back to admin panel format
                    title,
                    category: data.category, // Keep the original resource category, including tools.
                    portfolioType,
                    itemType,
                    // Ensure required fields for admin panel
                    fileUrl: data.fileUrl || '',
                    description: data.description || '',
                    class: data.class || (data.year && data.semester ? `Year ${data.year} Semester ${data.semester}` : '')
                };
                
                console.log(`🔄 Mapped to admin format:`, mappedData);
                return mappedData;
            });
            
            console.log('💾 UNIFIED Resources data processed:', resourcesData);
            setResources(resourcesData);
            console.log('✅ Resources state updated successfully');
        } catch (err) {
            console.error('❌ Error fetching resources:', err);
            setError('Failed to fetch resources data: ' + err.message);
        } finally {
            setLoading(false);
            console.log('🏁 Fetch completed, loading set to false');
        }
    };

    // Add new resource to Firebase - UNIFIED SYSTEM
    const addResource = async (resourceData) => {
        try {
            setError(null);
            console.log(`➕ Admin panel adding resource (UNIFIED):`, resourceData);
            
            // Parse year and semester from class field
            let part = Number(resourceData.part ?? resourceData.year ?? 1);
            let semester = Number(resourceData.semester ?? 1);
            if (resourceData.class) {
                const classParts = resourceData.class.split(' ');
                console.log(`📋 Class parts:`, classParts);
                if (classParts.length >= 4) {
                    part = parseInt(classParts[1]) || part;
                    semester = parseInt(classParts[3]) || semester;
                }
            }
            
            // UNIFIED DATA STRUCTURE - Single array for all categories
            const unifiedData = {
                // Core identification
                category: resourceData.category, // Keep original category: 'study-materials', 'notes', 'past-papers'
                    type: resourceData.category === 'study-materials' ? 'outline' : 
                      resourceData.category === 'notes' ? 'notes' : 
                        resourceData.category === 'past-papers' ? 'past_paper' : 
                        resourceData.category === 'tools' ? 'tool' : 'other',
                
                // Academic information
                title: resourceData.title,
                subject: resourceData.title, // For consistency
                part: part,
                year: part,
                semester: semester,
                class: resourceData.class || `Year ${part} Semester ${semester}`,
                courseCode: resourceData.courseCode || '',
                description: resourceData.description || '',
                
                // Media information
                fileUrl: convertResourceUrl(resourceData.category, resourceData.fileUrl),
                fileType: resourceData.fileType || 'pdf',
                portfolioType: resourceData.portfolioType || '',
                itemType: resourceData.itemType || '',
                
                // Metadata
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            };
            
            console.log(`🔄 Mapped to UNIFIED format:`, unifiedData);
            console.log(`🔍 Specific fileUrl check:`, {
                originalFileUrl: resourceData.fileUrl,
                mappedFileUrl: unifiedData.fileUrl,
                fileUrlType: typeof unifiedData.fileUrl,
                fileUrlLength: unifiedData.fileUrl ? unifiedData.fileUrl.length : 0,
                fileUrlValue: `"${unifiedData.fileUrl}"`,
                isEmpty: unifiedData.fileUrl === '' || unifiedData.fileUrl === null || unifiedData.fileUrl === undefined
            });
            
            // Save to UNIFIED collection
            console.log(`💾 Saving to Firebase academic_data collection...`);
            const unifiedCollection = collection(db, 'academic_data');
            const docRef = await addDoc(unifiedCollection, unifiedData);
            
            console.log(`✅ Successfully saved to UNIFIED Firebase collection with ID: ${docRef.id}`);
            
            // Verify the saved data by reading it back
            console.log(`🔍 Verifying saved data...`);
            const savedDoc = await getDoc(doc(db, 'academic_data', docRef.id));
            if (savedDoc.exists()) {
                const savedData = savedDoc.data();
                console.log(`📄 Saved document data:`, savedData);
                console.log(`🔗 Saved fileUrl:`, {
                    value: savedData.fileUrl,
                    type: typeof savedData.fileUrl,
                    length: savedData.fileUrl ? savedData.fileUrl.length : 0,
                    isEmpty: savedData.fileUrl === '' || savedData.fileUrl === null || savedData.fileUrl === undefined
                });
            } else {
                console.error(`❌ Could not verify saved document - document not found`);
            }
            
            // Refresh resources list
            await fetchResources();
            
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error('Error adding resource:', err);
            setError('Failed to add resource');
            return { success: false, error: err.message };
        }
    };

    // Update the existing unified document without changing its identity.
    const updateResource = async (resourceId, resourceData) => {
        try {
            setError(null);
            await updateDoc(doc(db, 'academic_data', resourceId), {
                fileUrl: convertResourceUrl(resourceData.category, resourceData.fileUrl),
                updatedAt: new Date()
            });
            await fetchResources();

            return { success: true, id: resourceId };
        } catch (err) {
            console.error('❌ Error updating resource:', err);
            setError('Failed to update resource');
            return { success: false, error: err.message };
        }
    };

    // Remove entire semester data
    const removeSemesterData = async (category, year, semester) => {
        try {
            console.log(`🗑️ Removing entire semester: ${category}, Year ${year}, Sem ${semester}`);
            
            const mediaCollection = collection(db, 'media_files');
            const q = query(
                mediaCollection,
                where('category', '==', category),
                where('year', '==', year),
                where('semester', '==', semester)
            );
            
            const querySnapshot = await getDocs(q);
            console.log(`📋 Found ${querySnapshot.docs.length} records to remove`);
            
            const deletePromises = [];
            querySnapshot.docs.forEach(doc => {
                console.log(`🗑️ Removing semester record: ${doc.id}`);
                deletePromises.push(deleteDoc(doc(db, 'media_files', doc.id)));
            });
            
            if (deletePromises.length > 0) {
                await Promise.all(deletePromises);
                console.log(`✅ Removed entire semester data (${deletePromises.length} records)`);
            }
            
            // Refresh resources list
            await fetchResources();
            
            return { success: true, removedCount: deletePromises.length };
        } catch (err) {
            console.error('❌ Error removing semester data:', err);
            return { success: false, error: err.message };
        }
    };

    // Delete resource from Firebase - UNIFIED SYSTEM
    const deleteResource = async (resourceId) => {
        try {
            setError(null);
            console.log(`🗑️ Deleting resource from UNIFIED Firebase: ${resourceId}`);
            
            // First check if document exists
            const resourceDoc = doc(db, 'academic_data', resourceId);
            console.log(`🔍 Checking if document exists: ${resourceId}`);
            
            try {
                const docSnap = await getDoc(resourceDoc);
                if (docSnap.exists()) {
                    console.log(`📄 Document found:`, docSnap.data());
                    
                    // Delete from UNIFIED collection
                    await deleteDoc(resourceDoc);
                    console.log(`✅ Successfully deleted resource: ${resourceId}`);
                    
                    // Verify deletion
                    const docSnapAfter = await getDoc(resourceDoc);
                    if (!docSnapAfter.exists()) {
                        console.log(`✅ Verified deletion - document no longer exists in Firebase`);
                    } else {
                        console.warn(`⚠️ Deletion verification failed - document still exists`);
                    }
                } else {
                    console.warn(`⚠️ Document not found in Firebase: ${resourceId}`);
                    return { success: false, error: 'Document not found' };
                }
            } catch (checkError) {
                console.error(`❌ Error checking document existence:`, checkError);
                return { success: false, error: checkError.message };
            }
            
            // Refresh resources list
            await fetchResources();
            
            return { success: true };
        } catch (err) {
            console.error('❌ Error deleting resource:', err);
            setError('Failed to delete resource');
            return { success: false, error: err.message };
        }
    };

    // Delete ALL resources from Firebase - UNIFIED SYSTEM
    const deleteAllResources = async () => {
        try {
            setError(null);
            console.log(`🗑️ Deleting ALL resources from UNIFIED Firebase...`);
            
            const unifiedCollection = collection(db, 'academic_data');
            const q = query(unifiedCollection);
            const querySnapshot = await getDocs(q);
            
            console.log(`📋 Found ${querySnapshot.docs.length} documents to delete`);
            
            if (querySnapshot.docs.length === 0) {
                console.log(`ℹ️ No documents to delete`);
                return { success: true, deletedCount: 0 };
            }
            
            const deletePromises = [];
            querySnapshot.docs.forEach(doc => {
                console.log(`🗑️ Deleting document: ${doc.id} - ${doc.data().title || doc.data().subject}`);
                deletePromises.push(deleteDoc(doc(db, 'academic_data', doc.id)));
            });
            
            await Promise.all(deletePromises);
            console.log(`✅ Successfully deleted ${deletePromises.length} documents from UNIFIED Firebase`);
            
            // Refresh resources list
            await fetchResources();
            
            return { success: true, deletedCount: deletePromises.length };
        } catch (err) {
            console.error('❌ Error deleting all resources:', err);
            setError('Failed to delete all resources');
            return { success: false, error: err.message };
        }
    };

    // Save course structure for outline section
    const saveCourseStructure = async (resourceData) => {
        try {
            console.log(`🏗️ Saving course structure for outline section:`, resourceData);
            
            // Parse year and semester from class field
            let year = 1, semester = 1;
            if (resourceData.class) {
                const classParts = resourceData.class.split(' ');
                if (classParts.length >= 4) {
                    year = parseInt(classParts[1]) || 1;
                    semester = parseInt(classParts[3]) || 1;
                }
            }
            
            const structureData = {
                subject: resourceData.title,
                year: year,
                semester: semester,
                courseCode: resourceData.courseCode || '',
                category: resourceData.category === 'study-materials' ? 'outline' : resourceData.category,
                createdAt: new Date()
            };
            
            console.log(`🔄 Mapped to structure format:`, structureData);
            
            // Save to academic_structure collection
            const structureCollection = collection(db, 'academic_structure');
            const docRef = await addDoc(structureCollection, structureData);
            
            console.log(`✅ Course structure saved with ID: ${docRef.id}`);
            return { success: true, id: docRef.id };
        } catch (err) {
            console.error('❌ Error saving course structure:', err);
            return { success: false, error: err.message };
        }
    };

    // Get resources by selected section while keeping app data consistent.
    const getSectionData = async (section = 'all') => {
        try {
            setError(null);

            const normalizedSection = String(section || 'all').toLowerCase();
            const sectionAliases = {
                all: ['all'],
                outlines: ['study-materials', 'outline'],
                'study-materials': ['study-materials', 'outline'],
                notes: ['notes'],
                pastpapers: ['past-papers', 'past_paper'],
                'past-papers': ['past-papers', 'past_paper'],
                portfolio: ['portfolio'],
                tools: ['tools']
            };

            if (normalizedSection === 'all') {
                if (resources.length === 0) {
                    await fetchResources();
                }
                return resources;
            }

            const allowedValues = sectionAliases[normalizedSection] || [normalizedSection];
            const filteredResources = resources.filter((resource) => {
                const category = String(resource.category || resource.type || '').toLowerCase();
                return allowedValues.some(value => category === value || category.includes(value));
            });

            if (filteredResources.length === 0 && resources.length === 0) {
                await fetchResources();
                return resources.filter((resource) => {
                    const category = String(resource.category || resource.type || '').toLowerCase();
                    return allowedValues.some(value => category === value || category.includes(value));
                });
            }

            return filteredResources;
        } catch (err) {
            console.error('❌ Error getting section data:', err);
            setError('Failed to get section data');
            return [];
        }
    };

    // Get resources by category
    const getResourcesByCategory = async (category) => {
        try {
            setLoading(true);
            setError(null);
            
            // Map admin panel category to Firebase category
            const firebaseCategory = category === 'study-materials' ? 'outline' : 
                                   category === 'notes' ? 'notes' : 
                                   category === 'past-papers' ? 'past_paper' : 'other';
            
            const mediaCollection = collection(db, 'media_files');
            const q = query(
                mediaCollection, 
                where('category', '==', firebaseCategory),
                orderBy('createdAt', 'desc')
            );
            const querySnapshot = await getDocs(q);
            
            const resourcesData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Map back to admin panel format
                title: doc.data().subject || doc.data().title,
                category: category
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
        addResource,
        updateResource,
        deleteResource,
        deleteAllResources,
        removeSemesterData,
        saveCourseStructure,
        getSectionData,
        getResourceStatistics,
        getResourcesByCategory,
        searchResources
    };
};

export default useResourceData;
