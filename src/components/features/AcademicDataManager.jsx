import React, { useState, useEffect } from 'react';
import { db } from "../../firebase/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import dynamicDataService from "../../services/dynamicDataService";

const AcademicDataManager = () => {
    const [activeTab, setActiveTab] = useState('outlines');
    const [form, setForm] = useState({
        year: "",
        semester: "",
        subject: "",
        courseCode: "",
        link: "",
    });
    const [mediaItems, setMediaItems] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCourses = async () => {
        try {
            const coursesData = await dynamicDataService.fetchAcademicStructure();
            console.log("Fetched courses:", coursesData);
            setCourses(coursesData);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    const fetchMediaItems = async (category) => {
        try {
            const mediaSnap = await getDocs(collection(db, "media_files"));
            const items = mediaSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(item => item.category === category);
            console.log("Fetched media items for", category, ":", items);
            setMediaItems(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => { 
        fetchCourses(); 
        fetchMediaItems(activeTab);
    }, [activeTab]);

    const handleAddCourse = async (e) => {
        e.preventDefault();
        if (!form.year || !form.semester || !form.subject) {
            alert("Please fill all required fields!");
            return;
        }

        setLoading(true);
        try {
            const courseData = {
                year: parseInt(form.year),
                semester: parseInt(form.semester),
                subject: form.subject,
                courseCode: form.courseCode,
                category: activeTab
            };

            await dynamicDataService.addCourse(courseData);
            
            // Add link if provided
            if (form.link) {
                const mediaData = {
                    category: activeTab,
                    year: parseInt(form.year),
                    semester: parseInt(form.semester),
                    courseCode: form.courseCode,
                    subject: form.subject,
                    fileUrl: form.link,
                    originalFileName: `${form.courseCode || form.subject} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
                };
                await dynamicDataService.addMediaLink(mediaData);
            }

            alert("Course added successfully!");
            setForm({
                year: "",
                semester: "",
                subject: "",
                courseCode: "",
                link: ""
            });
            fetchCourses();
            fetchMediaItems(activeTab);
        } catch (error) {
            console.error("Error adding course:", error);
            alert("Failed to add course. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateLink = async (courseId) => {
        if (!form.link) {
            alert("Please provide a link!");
            return;
        }

        setLoading(true);
        try {
            // Find existing media item
            const existingMedia = mediaItems.find(item => 
                item.year === parseInt(form.year) && 
                item.semester === parseInt(form.semester) && 
                (item.courseCode === form.courseCode || item.subject === form.subject)
            );

            if (existingMedia) {
                // Update existing media
                await dynamicDataService.updateMediaLink(existingMedia.id, {
                    fileUrl: form.link,
                    updatedAt: new Date()
                });
            } else {
                // Add new media link
                const mediaData = {
                    category: activeTab,
                    year: parseInt(form.year),
                    semester: parseInt(form.semester),
                    courseCode: form.courseCode,
                    subject: form.subject,
                    fileUrl: form.link,
                    originalFileName: `${form.courseCode || form.subject} ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
                };
                await dynamicDataService.addMediaLink(mediaData);
            }

            alert("Link updated successfully!");
            setForm({
                year: "",
                semester: "",
                subject: "",
                courseCode: "",
                link: ""
            });
            fetchMediaItems(activeTab);
        } catch (error) {
            console.error("Error updating link:", error);
            alert("Failed to update link. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm("Delete this link?")) return;
        try {
            await deleteDoc(doc(db, "media_files", id));
            fetchMediaItems(activeTab);
            alert("Link deleted successfully!");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete link");
        }
    };

    const getTabTitle = () => {
        switch(activeTab) {
            case 'outlines': return 'Outlines';
            case 'notes': return 'Notes';
            case 'past_paper': return 'Past Papers';
            default: return 'Academic Content';
        }
    };

    const getSemesterOptions = () => {
        if (activeTab === 'past_paper') {
            return [1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>
                    Year {Math.ceil(sem/2)} Semester {sem % 2 === 1 ? 1 : 2} (Sem {sem})
                </option>
            ));
        }
        return [1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <option key={sem} value={sem}>Semester {sem}</option>
        ));
    };

    const getCombinedData = () => {
        const combined = [];
        
        // Only add courses that have real media links
        courses.forEach(course => {
            // Find corresponding media item
            const mediaItem = mediaItems.find(item => 
                item.year === course.year && 
                item.semester === course.semester && 
                (item.courseCode === course.courseCode || item.subject === item.subject) &&
                item.fileUrl && item.fileUrl !== "Placeholder"
            );
            
            // Only add if there's a real link
            if (mediaItem) {
                combined.push({
                    year: course.year,
                    semester: course.semester,
                    courseCode: course.courseCode,
                    subject: course.subject,
                    link: mediaItem.fileUrl
                });
            }
        });
        
        // Add media items that don't have corresponding courses (only if real links)
        mediaItems.forEach(item => {
            if (item.fileUrl && item.fileUrl !== "Placeholder") {
                const exists = combined.some(course => 
                    course.year === item.year && 
                    course.semester === item.semester && 
                    (course.courseCode === item.courseCode || course.subject === item.subject)
                );
                
                if (!exists) {
                    combined.push({
                        year: item.year,
                        semester: item.semester,
                        courseCode: item.courseCode,
                        subject: item.subject,
                        link: item.fileUrl
                    });
                }
            }
        });
        
        return combined;
    };

    const groupDataByYear = () => {
        const data = getCombinedData();
        const grouped = {};
        
        data.forEach(item => {
            if (!grouped[item.year]) {
                grouped[item.year] = {};
            }
            if (!grouped[item.year][item.semester]) {
                grouped[item.year][item.semester] = [];
            }
            grouped[item.year][item.semester].push(item);
        });
        
        return grouped;
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
            <h3 className="text-xl font-extrabold mb-6">Academic Data Manager</h3>

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-6 border-b border-gray-200">
                {['outlines', 'notes', 'past_paper'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-2 px-4 font-semibold transition-colors ${
                            activeTab === tab
                                ? 'text-green-600 border-b-2 border-green-600'
                                : 'text-gray-600 hover:text-gray-800'
                        }`}
                    >
                        {tab === 'past_paper' ? 'Past Papers' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            <div className="space-y-8 mb-8">
                {/* Add Course Section */}
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
                        <span className="mr-2">➕</span> Add New {getTabTitle().slice(0, -1)} Course
                    </h4>
                    <form onSubmit={handleAddCourse} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Part *</label>
                                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full p-3 border rounded-lg" required>
                                    <option value="">Select Part</option>
                                    <option value="1">Part 1</option>
                                    <option value="2">Part 2</option>
                                    <option value="3">Part 3</option>
                                    <option value="4">Part 4</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Semester *</label>
                                <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full p-3 border rounded-lg" required>
                                    <option value="">Select Semester</option>
                                    {getSemesterOptions()}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Course Code</label>
                                <input type="text" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="e.g., BED-101" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="e.g., Educational Psychology" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{getTabTitle().slice(0, -1)} Link</label>
                            <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="https://drive.google.com/..." />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 font-bold">
                            {loading ? 'Adding...' : 'Add Course'}
                        </button>
                    </form>
                </div>

                {/* Update Link Section */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <h4 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
                        <span className="mr-2">🔄</span> Update {getTabTitle().slice(0, -1)} Link
                    </h4>
                    <form onSubmit={(e) => { e.preventDefault(); handleUpdateLink(); }} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Part *</label>
                                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full p-3 border rounded-lg" required>
                                    <option value="">Select Part</option>
                                    <option value="1">Part 1</option>
                                    <option value="2">Part 2</option>
                                    <option value="3">Part 3</option>
                                    <option value="4">Part 4</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Semester *</label>
                                <select value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full p-3 border rounded-lg" required>
                                    <option value="">Select Semester</option>
                                    {getSemesterOptions()}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Course Code</label>
                                <input type="text" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="e.g., BED-101" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Subject *</label>
                                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="e.g., Educational Psychology" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">New {getTabTitle().slice(0, -1)} Link *</label>
                            <input type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="w-full p-3 border rounded-lg" placeholder="https://drive.google.com/..." required />
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-bold">
                            {loading ? 'Updating...' : 'Update Link'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Existing Data - Grouped by Year and Semester */}
            <div>
                <h4 className="text-lg font-bold text-gray-800 mb-4">Current {getTabTitle()} Data</h4>
                <div className="space-y-6">
                    {Object.keys(groupDataByYear()).length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No {getTabTitle().toLowerCase()} data found
                        </div>
                    ) : (
                        Object.keys(groupDataByYear()).sort((a, b) => a - b).map((year) => (
                            <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-50 px-4 py-3 font-bold text-gray-800">
                                    Part {year}
                                </div>
                                {Object.keys(groupDataByYear()[year]).sort((a, b) => a - b).map((semester) => (
                                    <div key={`${year}-${semester}`} className="border-t border-gray-200">
                                        <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
                                            Semester {semester}
                                        </div>
                                        <div className="p-4">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="text-left text-sm text-gray-600">
                                                        <th className="pb-2">Course Code</th>
                                                        <th className="pb-2">Subject</th>
                                                        <th className="pb-2">Link Status</th>
                                                        <th className="pb-2">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {groupDataByYear()[year][semester].map((item, index) => {
                                                        const mediaItem = mediaItems.find(mi => 
                                                            mi.year === item.year && 
                                                            mi.semester === item.semester && 
                                                            (mi.courseCode === item.courseCode || mi.subject === item.subject)
                                                        );
                                                        return (
                                                            <tr key={`${year}-${semester}-${index}`} className="border-t border-gray-100">
                                                                <td className="py-2">{item.courseCode || '-'}</td>
                                                                <td className="py-2">{item.subject}</td>
                                                                <td className="py-2">
                                                                    {item.link ? (
                                                                        <span className="text-green-600 text-sm">
                                            ✓ Link Available
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-red-600 text-sm">
                                            ✗ No Link
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="py-2">
                                                                    <div className="flex gap-2">
                                                                        {item.link && (
                                                                            <a 
                                                                                href={item.link} 
                                                                                target="_blank" 
                                                                                rel="noopener noreferrer" 
                                                                                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                                                            >
                                                                                View
                                                                            </a>
                                                                        )}
                                                                        {mediaItem && (
                                                                            <button 
                                                                                onClick={() => deleteItem(mediaItem.id)} 
                                                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcademicDataManager;
