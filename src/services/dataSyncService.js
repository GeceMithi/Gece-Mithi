import { db } from "../firebase/firebase";
import { doc, setDoc, getDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { academicDataDownload, pastPapersData, toolsData, portfolioData } from "../utils/data";

class DataSyncService {
    // Sync academic data (outlines/notes) with Firebase
    async syncAcademicData() {
        try {
            const batch = [];
            
            academicDataDownload.forEach(yearSem => {
                yearSem.courses.forEach(course => {
                    // Extract course code from name
                    const courseCodeMatch = course.name.match(/^([A-Z]+-\d+)/);
                    const courseCode = courseCodeMatch ? courseCodeMatch[1] : null;
                    const courseName = course.name.replace(/^[A-Z]+-\d+\s*/, '');
                    
                    // Outline sync
                    if (course.outlineLink && !course.outlineLink.includes("Placeholder")) {
                        batch.push({
                            id: `outline_${yearSem.year}_${yearSem.semester}_${courseCode || courseName}`,
                            data: {
                                category: "outline",
                                year: yearSem.year,
                                semester: yearSem.semester,
                                courseCode: courseCode,
                                subject: courseName,
                                fileUrl: course.outlineLink,
                                originalFileName: course.name,
                                uploadedAt: new Date()
                            }
                        });
                    }
                    
                    // Notes sync
                    if (course.notesLink && !course.notesLink.includes("Placeholder")) {
                        batch.push({
                            id: `notes_${yearSem.year}_${yearSem.semester}_${courseCode || courseName}`,
                            data: {
                                category: "notes",
                                year: yearSem.year,
                                semester: yearSem.semester,
                                courseCode: courseCode,
                                subject: courseName,
                                fileUrl: course.notesLink,
                                originalFileName: course.name,
                                uploadedAt: new Date()
                            }
                        });
                    }
                });
            });

            // Update Firebase
            for (const item of batch) {
                await setDoc(doc(db, "media_files", item.id), item.data, { merge: true });
            }

            console.log(`Synced ${batch.length} academic items to Firebase`);
            return batch.length;
        } catch (error) {
            console.error("Error syncing academic data:", error);
            throw error;
        }
    }

    // Sync past papers with Firebase
    async syncPastPapersData() {
        try {
            const batch = [];
            
            pastPapersData.forEach(year => {
                year.semesters.forEach(sem => {
                    if (sem.link && !sem.link.includes("Placeholder")) {
                        batch.push({
                            id: `past_paper_year${sem.id <= 2 ? 1 : sem.id <= 4 ? 2 : sem.id <= 6 ? 3 : 4}_sem${sem.id}`,
                            data: {
                                category: "past_paper",
                                year: sem.id <= 2 ? 1 : sem.id <= 4 ? 2 : sem.id <= 6 ? 3 : 4,
                                semester: sem.id,
                                fileUrl: sem.link,
                                originalFileName: `${sem.title} Past Paper`,
                                uploadedAt: new Date()
                            }
                        });
                    }
                });
            });

            // Update Firebase
            for (const item of batch) {
                await setDoc(doc(db, "media_files", item.id), item.data, { merge: true });
            }

            console.log(`Synced ${batch.length} past paper items to Firebase`);
            return batch.length;
        } catch (error) {
            console.error("Error syncing past papers data:", error);
            throw error;
        }
    }

    // Sync tools with Firebase
    async syncToolsData() {
        try {
            const batch = [];
            
            toolsData.forEach(tool => {
                if (tool.link && !tool.link.includes("Placeholder")) {
                    batch.push({
                        id: `tool_${tool.title}`,
                        data: {
                            category: "tool",
                            title: tool.title,
                            fileUrl: tool.link,
                            originalFileName: tool.title,
                            uploadedAt: new Date()
                        }
                    });
                }
            });

            // Update Firebase
            for (const item of batch) {
                await setDoc(doc(db, "media_files", item.id), item.data, { merge: true });
            }

            console.log(`Synced ${batch.length} tool items to Firebase`);
            return batch.length;
        } catch (error) {
            console.error("Error syncing tools data:", error);
            throw error;
        }
    }

    // Sync portfolios with Firebase
    async syncPortfolioData() {
        try {
            const batch = [];
            const portfolioMap = {
                "Developmental Portfolio": "developmental",
                "Professional Portfolio": "professional", 
                "Reading Portfolio": "reading",
                "Advance Portfolio": "advance"
            };
            
            portfolioData.forEach(portfolio => {
                if (portfolio.downloadLink && !portfolio.downloadLink.includes("Placeholder")) {
                    batch.push({
                        id: `portfolio_${portfolioMap[portfolio.title]}`,
                        data: {
                            category: "portfolio",
                            portfolio: portfolioMap[portfolio.title],
                            fileUrl: portfolio.downloadLink,
                            originalFileName: portfolio.title,
                            uploadedAt: new Date()
                        }
                    });
                }
            });

            // Update Firebase
            for (const item of batch) {
                await setDoc(doc(db, "media_files", item.id), item.data, { merge: true });
            }

            console.log(`Synced ${batch.length} portfolio items to Firebase`);
            return batch.length;
        } catch (error) {
            console.error("Error syncing portfolio data:", error);
            throw error;
        }
    }

    // Sync all data
    async syncAllData() {
        try {
            const results = {
                academic: 0,
                pastPapers: 0,
                tools: 0,
                portfolios: 0
            };

            results.academic = await this.syncAcademicData();
            results.pastPapers = await this.syncPastPapersData();
            results.tools = await this.syncToolsData();
            results.portfolios = await this.syncPortfolioData();

            console.log("All data synced successfully:", results);
            return results;
        } catch (error) {
            console.error("Error syncing all data:", error);
            throw error;
        }
    }

    // Get sync status
    async getSyncStatus() {
        try {
            const snapshot = await getDocs(collection(db, "media_files"));
            const stats = {
                total: snapshot.size,
                outlines: 0,
                notes: 0,
                pastPapers: 0,
                tools: 0,
                portfolios: 0
            };

            snapshot.docs.forEach(doc => {
                const data = doc.data();
                switch(data.category) {
                    case 'outline': stats.outlines++; break;
                    case 'notes': stats.notes++; break;
                    case 'past_paper': stats.pastPapers++; break;
                    case 'tool': stats.tools++; break;
                    case 'portfolio': stats.portfolios++; break;
                }
            });

            return stats;
        } catch (error) {
            console.error("Error getting sync status:", error);
            throw error;
        }
    }

    // Clear all Firebase data (for reset)
    async clearAllData() {
        try {
            const snapshot = await getDocs(collection(db, "media_files"));
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            console.log(`Cleared ${snapshot.size} items from Firebase`);
            return snapshot.size;
        } catch (error) {
            console.error("Error clearing data:", error);
            throw error;
        }
    }
}

const dataSyncService = new DataSyncService();
export default dataSyncService;
