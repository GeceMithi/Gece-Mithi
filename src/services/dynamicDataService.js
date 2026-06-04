import { db } from "../firebase/firebase";
import { collection, getDocs, query, orderBy, where, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";

class DynamicDataService {
    // Fetch all academic structure from Firebase
    async fetchAcademicStructure() {
        try {
            const academicRef = collection(db, "academic_structure");
            const snapshot = await getDocs(academicRef);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching academic structure:", error);
            return [];
        }
    }

    // Add course to academic structure
    async addCourse(courseData) {
        try {
            const docRef = await addDoc(collection(db, "academic_structure"), {
                ...courseData,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding course:", error);
            throw error;
        }
    }

    // Update course in academic structure
    async updateCourse(courseId, courseData) {
        try {
            const courseRef = doc(db, "academic_structure", courseId);
            await updateDoc(courseRef, {
                ...courseData,
                updatedAt: new Date()
            });
            return true;
        } catch (error) {
            console.error("Error updating course:", error);
            throw error;
        }
    }

    // Delete course from academic structure
    async deleteCourse(courseId) {
        try {
            await deleteDoc(doc(db, "academic_structure", courseId));
            return true;
        } catch (error) {
            console.error("Error deleting course:", error);
            throw error;
        }
    }

    // Fetch all media items from Firebase Storage (media_files collection)
    async fetchAllMedia() {
        try {
            const q = query(collection(db, "media_files"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error("Error fetching media:", error);
            return [];
        }
    }

    // Add media link
    async addMediaLink(mediaData) {
        try {
            const docRef = await addDoc(collection(db, "media_files"), {
                ...mediaData,
                createdAt: new Date()
            });
            return docRef.id;
        } catch (error) {
            console.error("Error adding media link:", error);
            throw error;
        }
    }

    // Update media link
    async updateMediaLink(mediaId, mediaData) {
        try {
            const mediaRef = doc(db, "media_files", mediaId);
            await updateDoc(mediaRef, {
                ...mediaData,
                updatedAt: new Date()
            });
            return true;
        } catch (error) {
            console.error("Error updating media link:", error);
            throw error;
        }
    }

    // Get academic data for outlines - UNIFIED SYSTEM
    async getOutlinesData() {
        try {
            console.log("=== FETCHING OUTLINES DATA (UNIFIED) ===");
            
            // Fetch from unified academic_data collection
            const academicData = await this.fetchUnifiedData('study-materials');
            
            console.log("✓ Fetched unified outline data:", academicData.length, "items");
            
            // Convert to flat array format for outline section
            const flatResult = academicData.map(item => {
                console.log(`Processing outline: ${item.subject} (${item.year}-${item.semester})`);
                console.log(`  - Link: ${item.link || 'None'}`);
                
                return {
                    year: parseInt(item.year),
                    semester: parseInt(item.semester),
                    courseCode: item.courseCode || '',
                    subject: item.subject,
                    link: item.link
                };
            });
            
            console.log(`✅ Final outline data array:`, flatResult);
            return flatResult;
            
        } catch (error) {
            console.error("❌ Error fetching outline data:", error);
            return [];
        }
    }

    // Fetch unified data from academic_data collection
    async fetchUnifiedData(category) {
        try {
            console.log(`🔄 Fetching unified data for category: ${category}`);
            
            const unifiedCollection = collection(db, 'academic_data');
            const q = query(unifiedCollection, where('category', '==', category), orderBy('createdAt', 'desc'));
            const querySnapshot = await getDocs(q);
            
            const unifiedData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    year: data.year,
                    semester: data.semester,
                    courseCode: data.courseCode || '',
                    subject: data.title || data.subject,
                    title: data.title || data.subject,
                    link: data.fileUrl && data.fileUrl !== '' ? data.fileUrl : null,
                    fileUrl: data.fileUrl || '',
                    description: data.description || '',
                    category: data.category,
                    type: data.type,
                    createdAt: data.createdAt
                };
            });
            
            console.log(`✅ Found ${unifiedData.length} unified items for ${category}`);
            return unifiedData;
        } catch (error) {
            console.error(`❌ Error fetching unified data for ${category}:`, error);
            return [];
        }
    }

    // Get academic data for notes - UNIFIED SYSTEM
    async getNotesData() {
        try {
            console.log("=== FETCHING NOTES DATA (UNIFIED) ===");
            
            // Fetch from unified academic_data collection
            const academicData = await this.fetchUnifiedData('notes');
            
            console.log("✓ Fetched unified notes data:", academicData.length, "items");
            
            // Convert to flat array format for notes section
            const flatResult = academicData.map(item => {
                console.log(`Processing notes: ${item.subject} (${item.year}-${item.semester})`);
                console.log(`  - Link: ${item.link || 'None'}`);
                
                return {
                    year: parseInt(item.year),
                    semester: parseInt(item.semester),
                    courseCode: item.courseCode || '',
                    subject: item.subject,
                    link: item.link
                };
            });
            
            console.log(`✅ Final notes data array:`, flatResult);
            return flatResult;
            
        } catch (error) {
            console.error("❌ Error fetching notes data:", error);
            return [];
        }
    }

    // Get academic data for notes (show ALL courses from admin panel)
    async getNotesDataOld() {
        try {
            console.log("=== FETCHING NOTES DATA ===");
            
            // Fetch both structure and media in parallel
            const [structure, media] = await Promise.all([
                this.fetchAcademicStructure(),
                this.fetchAllMedia()
            ]);
            
            console.log("✓ Fetched courses from admin panel:", structure.length);
            console.log("✓ Fetched media items:", media.length);
            
            // Filter notes from media
            const notesMedia = media.filter(m => m.category === 'notes');
            console.log("✓ Notes media items:", notesMedia.length);
            
            // Convert to flat array format - SHOW ALL COURSES
            const flatResult = [];
            
            structure.forEach(item => {
                console.log(`Processing course: ${item.subject} (${item.year}-${item.semester})`);
                
                // Find matching notes media
                const notesUrl = this.getMediaUrl(media, 'notes', item.year, item.semester, item.courseCode, item.subject);
                
                // ALWAYS include the course - even if no notes file exists
                flatResult.push({
                    year: parseInt(item.year),
                    semester: parseInt(item.semester),
                    courseCode: item.courseCode || '',
                    subject: item.subject,
                    link: (notesUrl && notesUrl !== "Placeholder") ? notesUrl : null
                });
                
                console.log(`  - Notes URL: ${notesUrl || 'None'}`);
            });

            console.log("✓ Final notes data result:", flatResult.length, "items");
            console.log("✓ Items with download links:", flatResult.filter(item => item.link).length);
            console.log("✓ Items without download links:", flatResult.filter(item => !item.link).length);
            
            return flatResult;
        } catch (error) {
            console.error("✗ Error getting notes data:", error);
            // Return empty array but don't crash the app
            return [];
        }
    }

    // Keep the old method for backward compatibility
    async getAcademicData() {
        try {
            console.log("Fetching academic data from Firebase...");
            const structure = await this.fetchAcademicStructure();
            console.log("Fetched courses:", structure);
            
            const media = await this.fetchAllMedia();
            console.log("Fetched media items:", media);
            
            // Convert to flat array format that AcademicSection expects
            const flatResult = [];
            
            structure.forEach(item => {
                const outlineUrl = this.getMediaUrl(media, 'outline', item.year, item.semester, item.courseCode, item.subject);
                const notesUrl = this.getMediaUrl(media, 'notes', item.year, item.semester, item.courseCode, item.subject);
                
                console.log(`Course: ${item.subject}, Outline URL: ${outlineUrl}, Notes URL: ${notesUrl}`);
                
                // Create flat structure for AcademicSection
                flatResult.push({
                    year: parseInt(item.year),
                    semester: parseInt(item.semester),
                    courseCode: item.courseCode || '',
                    subject: item.subject,
                    outlineLink: outlineUrl !== "Placeholder" ? outlineUrl : null,
                    notesLink: notesUrl !== "Placeholder" ? notesUrl : null
                });
            });

            console.log("Final academic data result (flat):", flatResult);
            return flatResult;
        } catch (error) {
            console.error("Error getting academic data:", error);
            return [];
        }
    }

    // Track download click in Firebase
    async trackDownload(type, year, semester, subject, courseCode, link) {
        try {
            console.log("📊 Tracking download:", { type, year, semester, subject, courseCode });
            
            const downloadData = {
                type, // 'outline', 'notes', 'past_paper'
                year: parseInt(year),
                semester: parseInt(semester),
                subject,
                courseCode: courseCode || '',
                link,
                downloadedAt: serverTimestamp(),
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };
            
            const docRef = await addDoc(collection(db, "download_tracking"), downloadData);
            console.log("✅ Download tracked successfully:", docRef.id);
            
            return true;
        } catch (error) {
            console.error("❌ Error tracking download:", error);
            // Don't throw error - download should still work even if tracking fails
            return false;
        }
    }

    // Helper to get media URL for specific course
    getMediaUrl(media, category, year, semester, courseCode, subject) {
        console.log(`🔍 Looking for ${category} - Year: ${year}, Sem: ${semester}, Code: ${courseCode}, Subject: ${subject}`);
        console.log(`📋 Available media items:`, media.map(m => ({
            category: m.category,
            year: m.year,
            semester: m.semester,
            subject: m.subject,
            courseCode: m.courseCode,
            hasFileUrl: !!m.fileUrl,
            hasCloudinaryUrl: !!m.cloudinaryUrl
        })));
        
        const item = media.find(m => {
            const match = m.category === category && 
                         m.year == year && // Use == for string/number comparison
                         m.semester == semester &&
                         (m.courseCode === courseCode || m.subject === subject || (!courseCode && !m.courseCode));
            
            console.log(`🤔 Checking item:`, {
                itemCategory: m.category,
                itemYear: m.year,
                itemSemester: m.semester,
                itemSubject: m.subject,
                itemCourseCode: m.courseCode,
                categoryMatch: m.category === category,
                yearMatch: m.year == year,
                semesterMatch: m.semester == semester,
                subjectMatch: m.subject === subject,
                courseCodeMatch: m.courseCode === courseCode,
                finalMatch: match
            });
            
            if (match) {
                console.log("✅ Found matching media item:", m);
            }
            return match;
        });
        
        const url = item ? (item.fileUrl || item.cloudinaryUrl || item.link) : null;
        console.log(`🔗 Returning URL: ${url || "Placeholder"}`);
        return url || "Placeholder";
    }

    // Get past papers data - UNIFIED SYSTEM
    async getPastPapersData() {
        try {
            console.log("=== FETCHING PAST PAPERS DATA (UNIFIED) ===");
            
            // Fetch from unified academic_data collection
            const academicData = await this.fetchUnifiedData('past-papers');
            
            console.log("✓ Fetched unified past papers data:", academicData.length, "items");
            
            // Convert to flat array format for past papers section
            const flatResult = academicData.map(item => {
                console.log(`Processing past paper: ${item.subject} (${item.year}-${item.semester})`);
                console.log(`  - Link: ${item.link || 'None'}`);
                
                return {
                    year: parseInt(item.year),
                    semester: parseInt(item.semester),
                    courseCode: item.courseCode || '',
                    subject: item.subject || `Past Paper Year ${item.year} Sem ${item.semester}`,
                    link: item.link
                };
            });
            
            console.log(`✅ Final past papers data array:`, flatResult);
            return flatResult;
        } catch (error) {
            console.error("❌ Error fetching past papers data:", error);
            return [];
        }
    }

    // Get tools data from Firebase (only real data)
    async getToolsData() {
        try {
            const media = await this.fetchAllMedia();
            const tools = media.filter(item => item.category === "tool");
            
            // Only return tools that have real links
            return tools
                .filter(tool => tool.fileUrl && tool.fileUrl !== "Placeholder")
                .map(tool => ({
                    id: tool.id,
                    title: tool.title || tool.originalFileName,
                    desc: tool.description || "Teaching tool for B.Ed students",
                    link: tool.fileUrl,
                    color: "bg-blue-100 text-blue-800"
                }));
        } catch (error) {
            console.error("Error getting tools data:", error);
            return [];
        }
    }

    // Get portfolio data from Firebase (only real data)
    async getPortfolioData() {
        try {
            const media = await this.fetchAllMedia();
            const portfolios = media.filter(item => item.category === "portfolio");
            
            const portfolioMap = {
                "developmental": "Developmental Portfolio",
                "professional": "Professional Portfolio",
                "reading": "Reading Portfolio",
                "advance": "Advance Portfolio"
            };
            
            return Object.entries(portfolioMap)
                .map(([key, title]) => {
                    const portfolio = portfolios.find(p => p.portfolio === key);
                    // Only include if there's a real link
                    if (portfolio && portfolio.fileUrl && portfolio.fileUrl !== "Placeholder") {
                        return {
                            id: key,
                            title: title,
                            description: this.getPortfolioDescription(key),
                            downloadLink: portfolio.fileUrl
                        };
                    }
                    return null;
                })
                .filter(Boolean); // Remove null entries
        } catch (error) {
            console.error("Error getting portfolio data:", error);
            return [];
        }
    }

    // Helper for portfolio descriptions
    getPortfolioDescription(type) {
        const descriptions = {
            "developmental": "Portfolio for developmental assessment and evaluation",
            "professional": "Professional development portfolio for teaching practice",
            "reading": "Reading and literacy assessment portfolio",
            "advance": "Advanced portfolio for comprehensive evaluation"
        };
        return descriptions[type] || "Portfolio template for B.Ed program";
    }

    // Organize media items by category (legacy method)
    async getMediaByCategory() {
        const allMedia = await this.fetchAllMedia();
        return {
            outlines: allMedia.filter(item => item.category === "outline"),
            notes: allMedia.filter(item => item.category === "notes"),
            pastPapers: allMedia.filter(item => item.category === "past_paper"),
            tools: allMedia.filter(item => item.category === "tool"),
            portfolios: allMedia.filter(item => item.category === "portfolio"),
        };
    }

    // Get media items by portfolio (legacy method)
    async getMediaByPortfolio() {
        const allMedia = await this.fetchAllMedia();
        return {
            developmental: allMedia.filter(item => item.portfolio === "developmental"),
            professional: allMedia.filter(item => item.portfolio === "professional"),
            reading: allMedia.filter(item => item.portfolio === "reading"),
            advance: allMedia.filter(item => item.portfolio === "advance"),
        };
    }
}

const dynamicDataService = new DynamicDataService();
export default dynamicDataService;
