import React, { useState, useEffect } from "react";
import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    updateDoc,
    setDoc,
    getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import cloudinaryService from "../../services/cloudinaryService";
import backupService from "../../services/dataBackupService";
import validationService from "../../services/dataValidationService";
import BatchSection from "../admin/BatchSection";

// Icons for the content manager
const Icons = {
    Grid: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
        </svg>
    ),
    List: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
    ),
    Bell: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
    ),
    LogOut: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
    ),
    Close: () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    ),
    Menu: () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
    ),
    Plus: () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    ),
    Check: () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    ),
    Trash: () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="red"
            strokeWidth="2"
        >
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
    ),
    Back: () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
    ),
    Eye: () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
            <circle cx="12" cy="12" r="3"></circle>
        </svg>
    ),
    Cloud: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
        </svg>
    ),
    GradCap: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
            <path d="M6 12v5c3 0 6 2.5 6 5s3-5 6-5v-5"></path>
        </svg>
    ),
    Users: () => (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    ),
    Loader: () => (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2v10l4 4"></path>
        </svg>
    ),
};

const DynamicContentManager = () => {
    // Form states for different content types
    const [facultyForm, setFacultyForm] = useState({
        name: "",
        role: "",
        duration: "",
        isActive: false,
        showDurationInput: false,
    });
    const [visitingFacultyForm, setVisitingFacultyForm] = useState({
        name: "",
        role: "",
        duration: "",
        showDurationInput: false,
    });
    const [nonTeachingForm, setNonTeachingForm] = useState({
        name: "",
        role: "",
        duration: "",
        isActive: false,
        showDurationInput: false,
    });
    const [volunteerTeacherForm, setVolunteerTeacherForm] = useState({
        name: "",
        batch: "",
    });
    const [outlineForm, setOutlineForm] = useState({
        title: "",
        description: "",
        fileUrl: "",
    });
    const [notesForm, setNotesForm] = useState({
        title: "",
        description: "",
        fileUrl: "",
    });

    const [trainingForm, setTrainingForm] = useState({
        prefix: "Mr.",
        name: "",
        profession: "",
        title: "",
        date: "",
        organizer: "",
        venue: "",
        description: "",
        image: "",
    });

    const [batchStudentForm, setBatchStudentForm] = useState({
        name: "",
        rel: "S/o",
        fname: "",
        surname: "",
        status: "",
        batchYear: "",
    });

    const [selectedBatchDropdown, setSelectedBatchDropdown] = useState("");
    const [newBatchYear, setNewBatchYear] = useState("");

    // Data states
    const [faculty, setFaculty] = useState([]);
    const [visitingFaculty, setVisitingFaculty] = useState([]);
    const [nonTeachingStaff, setNonTeachingStaff] = useState([]);
    const [volunteerTeachers, setVolunteerTeachers] = useState([]);
    const [outlines, setOutlines] = useState([]);
    const [notes, setNotes] = useState([]);
    const [inserviceTrainings, setInserviceTrainings] = useState([]);

    const [batches, setBatches] = useState([]);
    const [settings, setSettings] = useState({ imageUrls: [] });
    const [aboutSliderSettings, setAboutSliderSettings] = useState({ imageUrls: [], captions: [] });
    const [aboutSlideNumber, setAboutSlideNumber] = useState(1);
    const [aboutSlideCaption, setAboutSlideCaption] = useState("");
    const [selectedAboutFile, setSelectedAboutFile] = useState(null);

    const [activeTab, setActiveTab] = useState("faculty");
    const [loading, setLoading] = useState(false);
    const [loadingHomeSlider, setLoadingHomeSlider] = useState(false);
    const [loadingAboutSlide, setLoadingAboutSlide] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Initialize backup service on component mount
    useEffect(() => {
        backupService.initialize();

        return () => {
            backupService.stop();
        };
    }, []);

    const normalizeBatchYear = (rawYear) => {
        const clean = String(rawYear || "").trim();
        const match2k = /^2k(\d{2})$/i.exec(clean);
        if (match2k) return `20${match2k[1]}`;
        return clean;
    };

    const addStudentToBatch = async () => {
        const year = normalizeBatchYear(batchStudentForm.batchYear);
        if (!year) return alert("Please enter a valid batch year.");
        if (!batchStudentForm.name.trim())
            return alert("Student name is required.");
        if (!batchStudentForm.status.trim()) return alert("Status is required.");

        setLoading(true);
        try {
            const batchRef = doc(db, "batches", year);
            const snap = await getDoc(batchRef);
            const existing = snap.exists() ? snap.data()?.students || [] : [];

            const newStudent = {
                id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
                name: batchStudentForm.name.trim(),
                rel: (batchStudentForm.rel || "S/o").trim(),
                fname: batchStudentForm.fname.trim(),
                surname: batchStudentForm.surname.trim(),
                status: batchStudentForm.status.trim(),
            };

            await setDoc(
                batchRef,
                {
                    students: [...existing, newStudent],
                    updatedAt: new Date().toISOString(),
                },
                { merge: true },
            );
            setBatchStudentForm({
                name: "",
                rel: "S/o",
                fname: "",
                surname: "",
                status: "",
                batchYear: "",
            });
            setSelectedBatchDropdown("");
            await fetchAllData();
        } catch (error) {
            console.error("Error adding student:", error);
            alert("Failed to add student");
        } finally {
            setLoading(false);
        }
    };

    const updateStudentStatus = async (year, studentId, newStatus) => {
        setLoading(true);
        try {
            const batchRef = doc(db, "batches", String(year));
            const snap = await getDoc(batchRef);
            if (!snap.exists()) return;

            const existing = snap.data()?.students || [];
            const updated = existing.map((student) =>
                (student.id || "") === studentId
                    ? { ...student, status: newStatus }
                    : student
            );
            await updateDoc(batchRef, {
                students: updated,
                updatedAt: new Date().toISOString(),
            });
            await fetchAllData();
            alert("Student status updated successfully!");
        } catch (error) {
            console.error("Error updating student status:", error);
            alert("Failed to update student status");
        } finally {
            setLoading(false);
        }
    };

    const createNewBatch = async (year) => {
        const normalizedYear = normalizeBatchYear(year);
        if (!normalizedYear) return alert("Please enter a valid batch year.");

        setLoading(true);
        try {
            const batchRef = doc(db, "batches", normalizedYear);
            const snap = await getDoc(batchRef);

            if (snap.exists()) {
                alert(`Batch ${normalizedYear} already exists!`);
                return;
            }

            await setDoc(batchRef, {
                students: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            await fetchAllData();
            alert(`Batch ${normalizedYear} created successfully!`);
        } catch (error) {
            console.error("Error creating batch:", error);
            alert("Failed to create batch");
        } finally {
            setLoading(false);
        }
    };

    // Fetch all dynamic data from Firebase
    const fetchAllData = async () => {
        try {
            const facultySnap = await getDocs(collection(db, "faculty"));
            setFaculty(
                facultySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );

            const visitingFacultySnap = await getDocs(
                collection(db, "visiting_faculty"),
            );
            setVisitingFaculty(
                visitingFacultySnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );

            const nonTeachingSnap = await getDocs(
                collection(db, "non_teaching_staff"),
            );
            setNonTeachingStaff(
                nonTeachingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );

            const volunteerTeachersSnap = await getDocs(
                collection(db, "volunteer_teachers"),
            );
            setVolunteerTeachers(
                volunteerTeachersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );

            const outlinesSnap = await getDocs(collection(db, "outlines"));
            setOutlines(
                outlinesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );

            const notesSnap = await getDocs(collection(db, "notes"));
            setNotes(
                notesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );

            const inserviceTrainingsSnap = await getDocs(collection(db, "inservice_trainings"));
            setInserviceTrainings(
                inserviceTrainingsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );

            const batchesSnap = await getDocs(collection(db, "batches"));
            const batchesList = batchesSnap.docs
                .map((d) => ({
                    year: normalizeBatchYear(d.id),
                    students: d.data()?.students || [],
                }))
                .sort((a, b) => Number(a.year) - Number(b.year));
            setBatches(batchesList);

            const settingsSnap = await getDocs(collection(db, "settings"));
            if (!settingsSnap.empty) {
                const homeSliderDoc = settingsSnap.docs.find(doc => doc.id === "home_slider");
                if (homeSliderDoc) {
                    setSettings(homeSliderDoc.data());
                }

                const aboutSliderDoc = settingsSnap.docs.find(doc => doc.id === "about_college_slider");
                if (aboutSliderDoc) {
                    setAboutSliderSettings(aboutSliderDoc.data());
                }
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        const captions = Array.isArray(aboutSliderSettings.captions) ? aboutSliderSettings.captions : [];
        setAboutSlideCaption(captions[aboutSlideNumber - 1] || "");
    }, [aboutSlideNumber, aboutSliderSettings]);

    const uploadSliderImage = async (file) => {
        try {
            if (!file.type.startsWith('image/')) {
                throw new Error('Only image files are allowed for slider uploads');
            }
            const result = await cloudinaryService.uploadFile(file, 'sliders');
            return result?.url || null;
        } catch (error) {
            console.error("Slider upload failed:", error);
            return null;
        }
    };

    const handleUpdateSlider = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setLoadingHomeSlider(true);
        try {
            const imageUrl = await uploadSliderImage(file);
            if (imageUrl) {
                const currentImageUrls = Array.isArray(settings.imageUrls)
                    ? [...settings.imageUrls]
                    : settings.imageUrl
                        ? [settings.imageUrl]
                        : [];
                currentImageUrls[0] = imageUrl;

                await setDoc(doc(db, "settings", "home_slider"), {
                    imageUrls: currentImageUrls,
                    updatedAt: new Date()
                }, { merge: true });

                setSettings({ ...settings, imageUrls: currentImageUrls });
                alert("Slider image updated successfully!");
            } else {
                alert("Failed to upload image to Cloudinary.");
            }
        } catch (error) {
            console.error("Error updating slider:", error);
            alert("Failed to update slider image");
        } finally {
            setLoadingHomeSlider(false);
        }
    };

    const handleAboutSlideFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setSelectedAboutFile(file);
    };

    const handleUploadAboutSlide = async () => {
        if (!selectedAboutFile) return alert("Please select an image first.");

        setLoadingAboutSlide(true);
        try {
            const imageUrl = await uploadSliderImage(selectedAboutFile);
            if (!imageUrl) throw new Error("Image upload failed");

            const currentImageUrls = Array.isArray(aboutSliderSettings.imageUrls)
                ? [...aboutSliderSettings.imageUrls]
                : [];
            const currentCaptions = Array.isArray(aboutSliderSettings.captions)
                ? [...aboutSliderSettings.captions]
                : [];

            const targetIndex = Math.min(Math.max(Number(aboutSlideNumber) - 1, 0), 17);
            while (currentImageUrls.length < 18) currentImageUrls.push("");
            while (currentCaptions.length < 18) currentCaptions.push("");

            currentImageUrls[targetIndex] = imageUrl;
            currentCaptions[targetIndex] = aboutSlideCaption.trim();

            await setDoc(doc(db, "settings", "about_college_slider"), {
                imageUrls: currentImageUrls,
                captions: currentCaptions,
                updatedAt: new Date(),
            }, { merge: true });

            setAboutSliderSettings({ ...aboutSliderSettings, imageUrls: currentImageUrls, captions: currentCaptions });
            setSelectedAboutFile(null);
            alert("About College slide uploaded successfully!");
        } catch (error) {
            console.error("Error uploading about slide:", error);
            alert("Failed to upload About College slide");
        } finally {
            setLoadingAboutSlide(false);
        }
    };

    const handleDeleteAboutSlide = (index) => {
        setDeleteConfirm({ action: 'deleteAboutSlide', index, label: `Slide ${index + 1}` });
    };

    const deleteHomeSlideImage = (imageUrl) => {
        setDeleteConfirm({ action: 'deleteHomeSlide', imageUrl, label: 'home slide image' });
    };

    const addDocument = async (collectionName, data) => {
        setLoading(true);
        try {
            const validation = validationService.validateData(collectionName, data);
            if (!validation.isValid) {
                alert(`Validation Error: ${validation.errors.join(", ")}`);
                return;
            }

            const sanitizedData = validationService.sanitizeData(data);

            if (!validationService.validateDocumentSize(sanitizedData)) {
                alert("Document is too large to save");
                return;
            }

            const collectionMap = {
                faculty: faculty,
                visiting_faculty: visitingFaculty,
                non_teaching_staff: nonTeachingStaff,
                volunteer_teachers: volunteerTeachers,
                outlines: outlines,
                notes: notes,
                inservice_trainings: inserviceTrainings,
            };

            const currentCollection = collectionMap[collectionName] || [];

            if (
                !(await validationService.checkCollectionSize(
                    collectionName,
                    currentCollection.length,
                ))
            ) {
                alert("Collection has reached maximum size limit");
                return;
            }

            await addDoc(collection(db, collectionName), {
                ...sanitizedData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });

            fetchAllData();

            if (
                ["faculty", "visiting_faculty", "non_teaching_staff"].includes(
                    collectionName,
                )
            ) {
                setTimeout(() => backupService.performBackup(), 1000);
            }

            if (collectionName === "faculty")
                setFacultyForm({
                    name: "",
                    role: "",
                    duration: "",
                    isActive: false,
                    showDurationInput: false,
                });
            else if (collectionName === "visiting_faculty")
                setVisitingFacultyForm({
                    name: "",
                    role: "",
                    duration: "",
                    showDurationInput: false,
                });
            else if (collectionName === "non_teaching_staff")
                setNonTeachingForm({
                    name: "",
                    role: "",
                    duration: "",
                    isActive: false,
                    showDurationInput: false,
                });
            else if (collectionName === "volunteer_teachers")
                setVolunteerTeacherForm({ name: "", batch: "" });
            else if (collectionName === "outlines")
                setOutlineForm({ title: "", description: "", fileUrl: "" });
            else if (collectionName === "notes")
                setNotesForm({ title: "", description: "", fileUrl: "" });
            else if (collectionName === "inservice_trainings")
                setTrainingForm({ prefix: "Mr.", name: "", profession: "", title: "", date: "", organizer: "", venue: "", description: "", image: "" });

            alert("Added successfully!");
        } catch (error) {
            console.error("Error adding document:", error);
            alert("Failed to add!");
        } finally {
            setLoading(false);
        }
    };

    const requestDelete = (collectionName, id, label) => {
        setDeleteConfirm({ collectionName, id, label: label || 'this item' });
    };

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        setLoading(true);
        try {
            if (deleteConfirm.action === 'deleteStudent') {
                const batchRef = doc(db, "batches", String(deleteConfirm.year));
                const snap = await getDoc(batchRef);
                if (snap.exists()) {
                    const existing = snap.data()?.students || [];
                    const updated = existing.filter((s) => (s.id || "") !== deleteConfirm.studentId);
                    await updateDoc(batchRef, { students: updated, updatedAt: new Date().toISOString() });
                    await fetchAllData();
                }
            } else if (deleteConfirm.action === 'deleteBatch') {
                await deleteDoc(doc(db, "batches", String(deleteConfirm.year)));
                await fetchAllData();
            } else if (deleteConfirm.action === 'deleteAboutSlide') {
                const currentImageUrls = Array.isArray(aboutSliderSettings.imageUrls) ? [...aboutSliderSettings.imageUrls] : [];
                const currentCaptions = Array.isArray(aboutSliderSettings.captions) ? [...aboutSliderSettings.captions] : [];
                currentImageUrls.splice(deleteConfirm.index, 1);
                currentCaptions.splice(deleteConfirm.index, 1);
                await setDoc(doc(db, "settings", "about_college_slider"), { imageUrls: currentImageUrls, captions: currentCaptions, updatedAt: new Date() }, { merge: true });
                setAboutSliderSettings({ ...aboutSliderSettings, imageUrls: currentImageUrls, captions: currentCaptions });
            } else if (deleteConfirm.action === 'deleteHomeSlide') {
                const currentImageUrls = settings.imageUrls || [];
                const updatedImageUrls = currentImageUrls.filter(url => url !== deleteConfirm.imageUrl);
                await setDoc(doc(db, "settings", "home_slider"), { imageUrls: updatedImageUrls, updatedAt: new Date().toISOString() }, { merge: true });
                setSettings({ ...settings, imageUrls: updatedImageUrls });
            } else {
                await deleteDoc(doc(db, deleteConfirm.collectionName, deleteConfirm.id));
                fetchAllData();
            }
            alert("Deleted successfully!");
        } catch (error) {
            console.error("Error deleting:", error);
            alert("Failed to delete!");
        } finally {
            setLoading(false);
            setDeleteConfirm(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirm(null);
    };

    const renderForm = () => {
        switch (activeTab) {
            case "faculty":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add Faculty Member</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={facultyForm.name}
                                onChange={(e) =>
                                    setFacultyForm({ ...facultyForm, name: e.target.value })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <input
                                type="text"
                                placeholder="Role"
                                value={facultyForm.role}
                                onChange={(e) =>
                                    setFacultyForm({ ...facultyForm, role: e.target.value })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="facultyDuration"
                                        checked={!facultyForm.showDurationInput}
                                        onChange={() =>
                                            setFacultyForm({
                                                ...facultyForm,
                                                duration: "",
                                                showDurationInput: false,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-gray-500">No Duration</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="facultyDuration"
                                        checked={facultyForm.showDurationInput}
                                        onChange={() =>
                                            setFacultyForm({
                                                ...facultyForm,
                                                showDurationInput: true,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    Add Duration
                                </label>
                            </div>
                            {facultyForm.showDurationInput && (
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., 2019-Present)"
                                    value={facultyForm.duration}
                                    onChange={(e) =>
                                        setFacultyForm({ ...facultyForm, duration: e.target.value })
                                    }
                                    className="w-full p-3 border rounded text-base font-semibold"
                                />
                            )}
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={facultyForm.isActive}
                                    onChange={(e) =>
                                        setFacultyForm({
                                            ...facultyForm,
                                            isActive: e.target.checked,
                                        })
                                    }
                                    className="mr-2"
                                />
                                Active
                            </label>
                            <button
                                onClick={() => addDocument("faculty", facultyForm)}
                                disabled={loading}
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                            >
                                {loading ? "Adding..." : "Add Faculty"}
                            </button>
                        </div>
                    </div>
                );

            case "addStudent":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add Student</h3>
                        <div className="space-y-4">
                            <div className="border-t pt-4">
                                <h4 className="font-bold text-lg mb-2">Batches</h4>
                                <div className="grid grid-cols-1 gap-2 mb-2">
                                    <input
                                        type="number"
                                        placeholder="Batch Year (e.g., 2026)"
                                        value={batchStudentForm.batchYear}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setBatchStudentForm((prev) => ({
                                                ...prev,
                                                batchYear: value,
                                            }));
                                            const matchedBatch = batches.find((batch) => batch.year === value);
                                            setSelectedBatchDropdown(matchedBatch ? matchedBatch.year : "");
                                        }}
                                        className="w-full p-3 border rounded text-base font-semibold"
                                        min="2012"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-2 mb-2">
                                    <select
                                        value={selectedBatchDropdown}
                                        onChange={(e) => {
                                            const selectedYear = e.target.value;
                                            setSelectedBatchDropdown(selectedYear);
                                            setBatchStudentForm((prev) => ({
                                                ...prev,
                                                batchYear: selectedYear,
                                            }));
                                        }}
                                        className="w-full p-2 border border-[#ffd200] rounded bg-white"
                                    >
                                        <option value="">Select Existing Batch</option>
                                        {batches.map((batch) => (
                                            <option key={batch.year} value={batch.year}>
                                                {batch.year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Student Name"
                                        value={batchStudentForm.name}
                                        onChange={(e) =>
                                            setBatchStudentForm((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border rounded"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                    <select
                                        value={batchStudentForm.rel}
                                        onChange={(e) =>
                                            setBatchStudentForm((prev) => ({
                                                ...prev,
                                                rel: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border rounded text-base font-semibold"
                                    >
                                        <option value="S/o">S/o</option>
                                        <option value="D/o">D/o</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Father Name"
                                        value={batchStudentForm.fname}
                                        onChange={(e) =>
                                            setBatchStudentForm((prev) => ({
                                                ...prev,
                                                fname: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border rounded text-base font-semibold"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                    <input
                                        type="text"
                                        placeholder="Surname"
                                        value={batchStudentForm.surname}
                                        onChange={(e) =>
                                            setBatchStudentForm((prev) => ({
                                                ...prev,
                                                surname: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border rounded text-base font-semibold"
                                    />
                                    <select
                                        value={batchStudentForm.status}
                                        onChange={(e) =>
                                            setBatchStudentForm((prev) => ({
                                                ...prev,
                                                status: e.target.value,
                                            }))
                                        }
                                        className="w-full p-3 border rounded text-base font-semibold"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="JEST (IBA)">JEST (IBA)</option>
                                        <option value="PST (IBA)">PST (IBA)</option>
                                        <option value="PST (NTS)">PST (NTS)</option>
                                        <option value="ECT (IBA)">ECT (IBA)</option>
                                        <option value="SST (SPSC)">SST (SPSC)</option>
                                        <option value="ASI (SPSC)">ASI (SPSC)</option>
                                        <option value="EST (TL)">EST (TL)</option>
                                        <option value="Private Teacher">Private Teacher</option>
                                        <option value="Private Job">Private Job</option>
                                        <option value="Govt: Job in Health">Govt: Job in Health</option>
                                        <option value="Web Developer/Web Designer">Web Developer/Web Designer</option>
                                        <option value="Govt: Job in NADRA">Govt: Job in NADRA</option>
                                        <option value="Job in Police">Job in Police</option>
                                        <option value="Job in Revenue">Job in Revenue</option>
                                        <option value="Auditor">Auditor</option>
                                        <option value="Business man">Business man</option>
                                        <option value="Private Bank Job">Private Bank Job</option>
                                        <option value="Visiting Teacher">Visiting Teacher</option>
                                        <option value="Visiting Teacher in GECE Mithi">Visiting Teacher in GECE Mithi</option>
                                        <option value="Studies in KU (Karachi University)">Studies in KU (Karachi University)</option>
                                        <option value="For Further Studies in Foreign Country">For Further Studies in Foreign Country</option>
                                        <option value="Waiting">Waiting</option>
                                        <option value="Waiting for Examination">Waiting for Examination</option>
                                        <option value="Studying in 3rd Semester">Studying in 3rd Semester</option>
                                        <option value="Studying in 4th Semester">Studying in 4th Semester</option>
                                        <option value="Studying in 5th Semester">Studying in 5th Semester</option>
                                        <option value="Studying in 6th Semester">Studying in 6th Semester</option>
                                        <option value="Studying in 7th Semester">Studying in 7th Semester</option>
                                        <option value="Studying in 8th Semester">Studying in 8th Semester</option>
                                        <option value="ADE Complete">ADE Complete</option>
                                        <option value="ADE ongoing">ADE ongoing</option>
                                    </select>
                                </div>
                                <button
                                    onClick={addStudentToBatch}
                                    disabled={loading}
                                    className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                                >
                                    {loading ? "Adding..." : "Add Student"}
                                </button>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => setActiveTab("manageStudents")}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 border border-[#ffd200]"
                                    >
                                        Update Student Status
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "visitingFaculty":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add Visiting Faculty</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={visitingFacultyForm.name}
                                onChange={(e) =>
                                    setVisitingFacultyForm({
                                        ...visitingFacultyForm,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <input
                                type="text"
                                placeholder="Role"
                                value={visitingFacultyForm.role}
                                onChange={(e) =>
                                    setVisitingFacultyForm({
                                        ...visitingFacultyForm,
                                        role: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="visitingFacultyDuration"
                                        checked={!visitingFacultyForm.showDurationInput}
                                        onChange={() =>
                                            setVisitingFacultyForm({
                                                ...visitingFacultyForm,
                                                duration: "",
                                                showDurationInput: false,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-gray-500">No Duration</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="visitingFacultyDuration"
                                        checked={visitingFacultyForm.showDurationInput}
                                        onChange={() =>
                                            setVisitingFacultyForm({
                                                ...visitingFacultyForm,
                                                showDurationInput: true,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    Add Duration
                                </label>
                            </div>
                            {visitingFacultyForm.showDurationInput && (
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., 2019-Present)"
                                    value={visitingFacultyForm.duration}
                                    onChange={(e) =>
                                        setVisitingFacultyForm({
                                            ...visitingFacultyForm,
                                            duration: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 border rounded text-base font-semibold"
                                />
                            )}
                            <button
                                onClick={() =>
                                    addDocument("visiting_faculty", visitingFacultyForm)
                                }
                                disabled={loading}
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                            >
                                {loading ? "Adding..." : "Add Visiting Faculty"}
                            </button>
                        </div>
                    </div>
                );

            case "nonTeaching":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add Non-Teaching Staff</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Name"
                                value={nonTeachingForm.name}
                                onChange={(e) =>
                                    setNonTeachingForm({
                                        ...nonTeachingForm,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <input
                                type="text"
                                placeholder="Role"
                                value={nonTeachingForm.role}
                                onChange={(e) =>
                                    setNonTeachingForm({
                                        ...nonTeachingForm,
                                        role: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="nonTeachingDuration"
                                        checked={!nonTeachingForm.showDurationInput}
                                        onChange={() =>
                                            setNonTeachingForm({
                                                ...nonTeachingForm,
                                                duration: "",
                                                showDurationInput: false,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-gray-500">No Duration</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="nonTeachingDuration"
                                        checked={nonTeachingForm.showDurationInput}
                                        onChange={() =>
                                            setNonTeachingForm({
                                                ...nonTeachingForm,
                                                showDurationInput: true,
                                            })
                                        }
                                        className="mr-2"
                                    />
                                    Add Duration
                                </label>
                            </div>
                            {nonTeachingForm.showDurationInput && (
                                <input
                                    type="text"
                                    placeholder="Duration (e.g., 2019-Present)"
                                    value={nonTeachingForm.duration}
                                    onChange={(e) =>
                                        setNonTeachingForm({
                                            ...nonTeachingForm,
                                            duration: e.target.value,
                                        })
                                    }
                                    className="w-full p-3 border rounded text-base font-semibold"
                                />
                            )}
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={nonTeachingForm.isActive}
                                    onChange={(e) =>
                                        setNonTeachingForm({
                                            ...nonTeachingForm,
                                            isActive: e.target.checked,
                                        })
                                    }
                                    className="mr-2"
                                />
                                Active
                            </label>
                            <button
                                onClick={() =>
                                    addDocument("non_teaching_staff", nonTeachingForm)
                                }
                                disabled={loading}
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                            >
                                {loading ? "Adding..." : "Add Staff"}
                            </button>
                        </div>
                    </div>
                );

            case "volunteerTeachers":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add Volunteer Teacher</h3>
                        <div className="space-y-4">
                            <select
                                value={volunteerTeacherForm.batch}
                                onChange={(e) =>
                                    setVolunteerTeacherForm({
                                        ...volunteerTeacherForm,
                                        batch: e.target.value,
                                    })
                                }
                                className="w-full p-3 border border-[#ffd200] rounded text-base font-semibold"
                            >
                                <option value="">Select Batch</option>
                                {batches.map((batch) => (
                                    <option key={batch.year} value={batch.year}>
                                        Batch {batch.year}
                                    </option>
                                ))}
                            </select>
                            <div className="flex gap-3">
                                <input
                                    type="number"
                                    placeholder="Or enter new batch year (e.g., 2027)"
                                    value={newBatchYear}
                                    onChange={(e) => setNewBatchYear(e.target.value)}
                                    className="flex-1 p-3 border rounded text-base font-semibold focus:ring-2 focus:ring-[#004d00] outline-none"
                                    min="2012"
                                />
                                <button
                                    onClick={() => {
                                        if (newBatchYear.trim()) {
                                            createNewBatch(newBatchYear.trim());
                                            setVolunteerTeacherForm({
                                                ...volunteerTeacherForm,
                                                batch: newBatchYear.trim(),
                                            });
                                            setNewBatchYear('');
                                        }
                                    }}
                                    disabled={!newBatchYear.trim() || loading}
                                    className="bg-[#004d00] text-white px-4 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base disabled:opacity-50"
                                >
                                    Create Batch
                                </button>
                            </div>
                            <input
                                type="text"
                                placeholder="Name"
                                value={volunteerTeacherForm.name}
                                onChange={(e) =>
                                    setVolunteerTeacherForm({
                                        ...volunteerTeacherForm,
                                        name: e.target.value,
                                    })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <button
                                onClick={() =>
                                    addDocument("volunteer_teachers", volunteerTeacherForm)
                                }
                                disabled={loading}
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                            >
                                {loading ? "Adding..." : "Add Volunteer Teacher"}
                            </button>
                        </div>
                    </div>
                );

            case "inserviceTrainings":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add In-Service Training</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <select
                                    value={trainingForm.prefix}
                                    onChange={(e) =>
                                        setTrainingForm({ ...trainingForm, prefix: e.target.value })
                                    }
                                    className="w-full p-3 border rounded text-base font-semibold"
                                >
                                    <option value="Mr.">Mr.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Mrs.">Mrs.</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={trainingForm.name}
                                    onChange={(e) =>
                                        setTrainingForm({ ...trainingForm, name: e.target.value })
                                    }
                                    className="w-full p-3 border rounded text-base font-semibold"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Profession"
                                value={trainingForm.profession}
                                onChange={(e) =>
                                    setTrainingForm({ ...trainingForm, profession: e.target.value })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <button
                                onClick={() =>
                                    addDocument("inservice_trainings", trainingForm)
                                }
                                disabled={loading}
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                            >
                                {loading ? "Adding..." : "Add Training"}
                            </button>
                        </div>
                    </div>
                );

            case "outlines":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add Outline</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={outlineForm.title}
                                onChange={(e) =>
                                    setOutlineForm({ ...outlineForm, title: e.target.value })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <input
                                type="url"
                                placeholder="File URL"
                                value={outlineForm.fileUrl}
                                onChange={(e) =>
                                    setOutlineForm({ ...outlineForm, fileUrl: e.target.value })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <button
                                onClick={() => addDocument("outlines", outlineForm)}
                                disabled={loading}
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                            >
                                {loading ? "Adding..." : "Add Outline"}
                            </button>
                        </div>
                    </div>
                );

            case "notes":
                return (
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                        <h3 className="text-xl font-extrabold mb-4">Add Notes</h3>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Title"
                                value={notesForm.title}
                                onChange={(e) =>
                                    setNotesForm({ ...notesForm, title: e.target.value })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <input
                                type="url"
                                placeholder="File URL"
                                value={notesForm.fileUrl}
                                onChange={(e) =>
                                    setNotesForm({ ...notesForm, fileUrl: e.target.value })
                                }
                                className="w-full p-3 border rounded text-base font-semibold"
                            />
                            <button
                                onClick={() => addDocument("notes", notesForm)}
                                disabled={loading}
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base"
                            >
                                {loading ? "Adding..." : "Add Notes"}
                            </button>
                        </div>
                    </div>
                );

            case "homeSlides":
                return null;

            default:
                return null;
        }
    };

    const renderDataList = () => {
        if (activeTab === "manageStudents") {
            return (
                <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-extrabold">Batch Student Update</h3>
                        <button
                            onClick={() => setActiveTab("addStudent")}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-gray-700 border border-[#ffd200]"
                        >
                            Back to Add Student
                        </button>
                    </div>

                    <BatchSection batchesData={batches.reduce((acc, batch) => {
                        acc[batch.year] = batch.students;
                        return acc;
                    }, {})} onCreateBatch={createNewBatch} onStatusUpdate={updateStudentStatus} />
                </div>
            );
        }

        if (activeTab === "homeSlides") {
            return (
                <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                    <div className="mb-4">
                        <h3 className="text-xl font-extrabold">Update GEC Mithi Slider</h3>
                    </div>

                    <div className="text-center py-8">
                        <p className="text-gray-700 text-base font-semibold mb-4">Current slider image will be replaced with the new upload.</p>
                        <p className="text-base font-medium text-gray-600">Supported formats: JPG, PNG, GIF</p>
                        <p className="text-sm text-green-700 mt-2">Images upload directly to Cloudinary; only the resulting URL is saved in Firestore.</p>
                    </div>

                    <div className="mb-6">
                        <h4 className="text-lg font-bold mb-3">Current Slider Image</h4>
                        {(() => {
                            const current = Array.isArray(settings.imageUrls)
                                ? settings.imageUrls.filter(Boolean)
                                : settings.imageUrl
                                    ? [settings.imageUrl]
                                    : [];

                            if (current.length === 0) {
                                return <p className="text-sm text-gray-500">No slider image configured.</p>;
                            }

                            return (
                                <div className="flex items-center justify-center gap-4 flex-wrap">
                                    {current.map((url) => (
                                        <div key={url} className="relative">
                                            <img src={url} alt="Current slider" className="w-64 h-40 object-cover rounded-lg border" />
                                            <button
                                                onClick={() => deleteHomeSlideImage(url)}
                                                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-lg text-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>

                    <div className="flex justify-center">
                        <div className="flex items-center">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUpdateSlider}
                                className="hidden"
                                id="home-slide-upload"
                                disabled={loadingHomeSlider}
                            />
                            <label
                                htmlFor="home-slide-upload"
                                className="bg-[#004d00] text-white px-5 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 cursor-pointer font-bold text-base"
                            >
                                {loadingHomeSlider ? "Uploading..." : "Update Slider Image"}
                            </label>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === "aboutCollegeSlides") {
            const slides = [];
            for (let i = 0; i < 18; i++) {
                const url = aboutSliderSettings.imageUrls?.[i];
                const caption = aboutSliderSettings.captions?.[i];
                if (url) slides.push({ index: i, url, caption });
            }

            return (
                <div className="grid grid-cols-1 gap-4 -mx-6 w-full">
                    <div className="bg-white p-6 rounded-lg border border-[#ffd200] w-full">
                        <div className="mb-4">
                            <h3 className="text-xl font-extrabold">Upload Slide</h3>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-700 text-base font-medium">Select slide number (1-18), enter caption, and upload image.</p>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Slide Number</label>
                                <select
                                    value={aboutSlideNumber}
                                    onChange={(e) => setAboutSlideNumber(Number(e.target.value))}
                                    className="border rounded px-4 py-3 w-full max-w-xs text-base font-semibold"
                                    disabled={loadingAboutSlide}
                                >
                                    {Array.from({ length: 18 }, (_, i) => i + 1).map((n) => (
                                        <option key={n} value={n}>Slide {n}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Caption</label>
                                <input
                                    type="text"
                                    placeholder="Enter caption for this slide..."
                                    value={aboutSlideCaption}
                                    onChange={(e) => setAboutSlideCaption(e.target.value)}
                                    className="w-full border rounded px-4 py-3 text-base font-semibold"
                                    disabled={loadingAboutSlide}
                                />
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAboutSlideFileChange}
                                    className="hidden"
                                    id="about-slide-upload"
                                    disabled={loadingAboutSlide}
                                />
                                <label
                                    htmlFor="about-slide-upload"
                                    className="bg-gray-200 text-gray-800 px-5 py-3 rounded hover:bg-gray-300 cursor-pointer text-base font-semibold inline-block"
                                >
                                    {selectedAboutFile ? selectedAboutFile.name : "Choose Image"}
                                </label>

                                <button
                                    onClick={handleUploadAboutSlide}
                                    disabled={loading || !selectedAboutFile}
                                    className="bg-[#004d00] text-white px-5 py-3 rounded border border-[#ffd200] hover:bg-green-800 disabled:opacity-50 text-base font-bold"
                                >
                                    {loadingAboutSlide ? "Uploading..." : "Upload Slide"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-[#ffd200] w-full">
                        <div className="mb-4">
                            <h3 className="text-xl font-extrabold">Current Slides</h3>
                        </div>

                        {slides.length === 0 ? (
                            <p className="text-gray-500 text-base font-medium">No slides uploaded yet.</p>
                        ) : (
                            <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                                {slides.map(({ index, url, caption }) => (
                                    <div key={index} className="relative bg-gray-50 rounded-lg border p-3">
                                        <img
                                            src={url}
                                            alt={caption || `Slide ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg mb-2"
                                            loading="lazy"
                                        />
                                        <p className="text-sm font-bold text-gray-800 truncate">Slide {index + 1}</p>
                                        {caption && <p className="text-xs font-semibold text-gray-600 truncate italic">{caption}</p>}
                                        <button
                                            onClick={() => handleDeleteAboutSlide(index)}
                                            disabled={loading}
                                            className="absolute top-2 right-2 bg-[#004d00] text-white text-xs font-bold px-2 py-1 rounded border border-[#ffd200] hover:bg-green-800 disabled:opacity-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const tabTitles = {
            faculty: "Faculty Members",
            visitingFaculty: "Visiting Faculty",
            nonTeaching: "Non-Teaching Staff",
            volunteerTeachers: "Volunteer Teachers",
            inserviceTrainings: "In-Service Trainings",
            outlines: "Outlines",
            notes: "Notes",
        };

        const collectionMap = {
            faculty: faculty,
            visitingFaculty: visitingFaculty,
            nonTeaching: nonTeachingStaff,
            volunteerTeachers: volunteerTeachers,
            outlines: outlines,
            notes: notes,
            inserviceTrainings: inserviceTrainings,
        };

        const data = collectionMap[activeTab] || [];
        const collectionName = activeTab.replace(/([A-Z])/g, '_$1').toLowerCase();

        if (activeTab === "volunteerTeachers") {
            const groupedByBatch = data.reduce((acc, teacher) => {
                const batch = teacher.batch || 'No Batch';
                if (!acc[batch]) acc[batch] = [];
                acc[batch].push(teacher);
                return acc;
            }, {});

            const batchYears = Object.keys(groupedByBatch).sort((a, b) => Number(a) - Number(b));

            return (
                <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-extrabold">{tabTitles[activeTab]}</h3>
                    </div>

                    {batchYears.length === 0 ? (
                        <div className="p-8 text-center text-gray-600 text-lg font-medium">
                            No volunteer teachers found. Add some to get started.
                        </div>
                    ) : (
                        batchYears.map((batch) => (
                            <div key={batch} className="mb-6">
                                <h4 className="font-bold text-lg text-[#004d00] mb-3">Batch {batch}</h4>
                                <div className="space-y-3">
                                    {groupedByBatch[batch].map((teacher) => (
                                        <div key={teacher.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-sm hover:shadow-md transition">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-900 text-base">{teacher.name}</h4>
                                                <p className="text-sm text-gray-500">Volunteer Teacher</p>
                                            </div>
                                            <button
                                                onClick={() => requestDelete(collectionName, teacher.id, 'volunteer teacher')}
                                                className="text-red-600 hover:text-red-800 font-bold text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            );
        }

        return (
            <div className="bg-white p-6 rounded-lg border border-[#ffd200]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-extrabold">{tabTitles[activeTab] || activeTab}</h3>
                </div>

                <div className="space-y-4">
                    {data.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    {Object.entries(item).map(([key, value]) => {
                                        if (key === 'id' || key === 'createdAt' || key === 'updatedAt') return null;

                                        if (
                                            value === null ||
                                            value === undefined ||
                                            (typeof value === 'string' && value.trim() === '') ||
                                            (Array.isArray(value) && value.length === 0)
                                        ) {
                                            return null;
                                        }

                                        if (key === 'isActive') return (
                                            <div key={key} className="text-base font-semibold">
                                                <span className="font-medium">Active:</span> {value ? 'Yes' : 'No'}
                                            </div>
                                        );
                                        if (typeof value === 'string' && value.length > 100) {
                                            return (
                                                <div key={key} className="text-base font-semibold">
                                                    <span className="text-base font-bold">{key}:</span> {value.substring(0, 100)}...
                                                </div>
                                            );
                                        }
                                        return (
                                            <div key={key} className="text-base font-semibold">
                                                <span className="text-base font-bold">{key}:</span> {String(value)}
                                            </div>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => requestDelete(collectionName, item.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Icons.Trash />
                                </button>
                            </div>
                        </div>
                    ))}

                    {data.length === 0 && (
                        <div className="p-8 text-center text-gray-600 text-lg font-medium">
                            No items found. Add some {activeTab} to get started.
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const contentTabTitles = {
        aboutCollegeSlides: "Home Slides",
        faculty: "Faculty",
        visitingFaculty: "Visiting Faculty",
        nonTeaching: "Non-Teaching Staff",
        volunteerTeachers: "Volunteer Teachers",
        inserviceTrainings: "In-Service Trainings",
        addStudent: "Add Student",
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-extrabold">{contentTabTitles[activeTab] || "Content Manager"}</h2>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                    { id: "aboutCollegeSlides", label: "Home Slides" },
                    { id: "faculty", label: "Faculty" },
                    { id: "visitingFaculty", label: "Visiting Faculty" },
                    { id: "nonTeaching", label: "Non-Teaching Staff" },
                    { id: "volunteerTeachers", label: "Volunteer Teachers" },
                    { id: "inserviceTrainings", label: "In-Service Trainings" },
                    { id: "addStudent", label: "Add Student" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-5 py-3 rounded-lg font-bold text-base transition-colors border border-[#ffd200] ${activeTab === tab.id
                                ? "bg-[#004d00] text-white"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Form and Data List */}
            <div className={`grid grid-cols-1 ${activeTab === "manageStudents" || activeTab === "addStudent" || activeTab === "homeSlides" || activeTab === "aboutCollegeSlides" ? "" : "lg:grid-cols-2"} ${activeTab === "aboutCollegeSlides" ? "gap-0" : "gap-6"}`}>
                {renderForm()}
                {activeTab !== "addStudent" && renderDataList()}
            </div>

            {/* Delete Confirmation Dialog */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4 border-2 border-[#ffd200]">
                        <div className="text-center">
                            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Confirm Delete</h3>
                            <p className="text-sm text-gray-600 mb-6">Are you sure you want to delete <span className="font-bold text-red-600">{deleteConfirm.label}</span>? This action cannot be undone.</p>
                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={cancelDelete}
                                    className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-bold text-sm transition-colors border border-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors border border-[#ffd200]"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DynamicContentManager;
