import React, { useState, useEffect } from 'react';

// import Trainings from './trainings';
// import slide15 from './images/slide15.jpg';

//Supporting Staff //
import member1 from '../../assets/staff/member1.jpg';
import member2 from '../../assets/staff/member2.jpg';

// Cloudinary removed - using Firebase Storage now

// / Principals Images Imports//
import principal1 from '../../assets/principles/teekamdas.jpg';
import principal2 from '../../assets/principles/walimuhammad.jpg';
import principal3 from '../../assets/principles/principal.jpg';

// Board Image Import
import boardImage from '../../assets/board/board.jpg';

// Firebase imports
import { db } from '../../firebase/firebase';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";

// --- IMPORT THEME COMPONENTS ---
import { ThemeCard, ThemeButton, ThemeBadge } from '../ui/ThemeButton';

// --- REUSABLE YELLOW BORDER CARD COMPONENT ---
export const YellowBorderCard = ({ children, className = "" }) => {
    return (
        <div className={`bg-white rounded-xl shadow-lg border border-[#ffd200] border-b-4 border-b-[#004d00] overflow-hidden hover:shadow-2xl hover:scale-105 hover:-translate-y-1 transition-all duration-300 h-full transform ${className}`}>
            {children}
        </div>
    );
};

const TeamCard = ({ person, showImage = false, className = "" }) => (
    <ThemeCard className={`flex flex-col items-center text-center ${className}`}>

        {/* Content */}
        <div className="w-full flex flex-col items-center grow justify-center">
            {showImage && (
                <div className="relative w-36 h-36 mb-3 mt-1">
                    <img src={person.img} alt={person.name} className="w-full h-full object-fit rounded-full border-4 border-[#004d00] shadow-sm" />
                    {person.isActive && <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] text-white">✓</div>}
                </div>
            )}

            <h3 className="text-sm md:text-base font-bold text-gray-900 leading-tight mb-1 px-1">
                {person.name}
            </h3>

            <p className="text-[#004d00] text-[10px] md:text-xs font-bold uppercase tracking-wide mb-2">
                {person.role}
            </p>

            {person.desc && <p className="text-gray-600 text-[10px] px-2 leading-snug italic mb-2">"{person.desc}"</p>}
        </div>

        {/* Footer */}
        <div className="w-full bg-[#004d00] text-white font-bold py-1.5 text-xs tracking-wider mt-auto">
            {person.duration || ''}
        </div>

    </ThemeCard>
);

const SectionDropdown = ({ title, icon, children, isOpen, onClick }) => {
    return (
        <div className="max-w-7xl mx-auto px-4 mb-4">
            <div className={`rounded-2xl shadow-md border overflow-hidden transition-all duration-300 ${isOpen ? 'border-[#004d00] ring-1 ring-[#004d00]' : 'border-[#ffd200]'}`}>
                <button
                    onClick={onClick}
                    className={`w-full p-4 flex items-center justify-between transition-colors focus:outline-none ${isOpen ? 'bg-[#004d00] text-white' : 'bg-white text-gray-800 hover:bg-gray-50'}`}
                >
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{icon}</span>
                        <h2 className={`text-lg md:text-xl font-bold uppercase tracking-wider text-left ${isOpen ? 'text-white' : 'text-green-800'}`}>
                            {title}
                        </h2>
                    </div>
                    <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180 text-white' : 'text-gray-500'}`}>▼</div>
                </button>
                {isOpen && <div className="p-4 md:p-6 bg-gray-50/50 border-t border-[#ffd200] animate-fadeIn">{children}</div>}
            </div>
        </div>
    );
};

const AboutUs = () => {
    
    const [activeSection, setActiveSection] = useState(null);
    
    // Dynamic data states

    const [faculty, setFaculty] = useState([]);
    const [visitingFaculty, setVisitingFaculty] = useState([]);
    const [nonTeachingStaff, setNonTeachingStaff] = useState([]);
    const [volunteerTeachers, setVolunteerTeachers] = useState([]);
    const [inserviceTrainings, setInserviceTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [aboutSliderImages, setAboutSliderImages] = useState([]);

    const resolveImageUrl = (value) => {
        if (!value || typeof value !== 'string') return '';
        const trimmed = value.trim();
        if (!trimmed) return '';
        // If it's already a full URL (Firebase Storage, Cloudinary, etc.), return as-is
        if (/^https?:\/\//i.test(trimmed)) return trimmed;
        // Otherwise return empty (invalid URL)
        return '';
    };

    // Fetch dynamic data from Firebase
    useEffect(() => {
        const fetchData = async () => {
            try {

                const facultySnap = await getDocs(collection(db, "faculty"));
                setFaculty(facultySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                const visitingFacultySnap = await getDocs(collection(db, "visiting_faculty"));
                setVisitingFaculty(visitingFacultySnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                const nonTeachingSnap = await getDocs(collection(db, "non_teaching_staff"));
                setNonTeachingStaff(nonTeachingSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                const volunteerTeachersSnap = await getDocs(collection(db, "volunteer_teachers"));
                setVolunteerTeachers(volunteerTeachersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

                const inserviceTrainingsSnap = await getDocs(collection(db, "inservice_trainings"));
                setInserviceTrainings(inserviceTrainingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const sliderRef = doc(db, "settings", "about_college_slider");
        const unsubscribe = onSnapshot(
            sliderRef,
            (docSnap) => {
                if (!docSnap.exists()) {
                    setAboutSliderImages([]);
                    return;
                }
                const data = docSnap.data();
                const imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
                const captions = Array.isArray(data.captions) ? data.captions : [];

                const slides = imageUrls
                    .map((url, idx) => ({ url, idx }))
                    .filter((x) => Boolean(x.url))
                    .map(({ url, idx }) => ({
                        id: idx + 1,
                        image: resolveImageUrl(url),
                        heading: captions[idx] || `Slide ${idx + 1}`,
                    }));

                setAboutSliderImages(slides);
            },
            (error) => {
                console.error("About slider fetch failed:", error);
                setAboutSliderImages([]);
            }
        );

        return () => unsubscribe();
    }, []);

    const toggleSection = (sectionName) => {
        setActiveSection(activeSection === sectionName ? null : sectionName);
    };

    // --- STAFF DATA ---
    const principalsData = [
        { id: 1, name: "Sir. Nakhat Singh Sodho", role: "Founder of Institute + 1st Principal", duration: "2003 - 2011", img: principal1, isActive: false },
        { id: 2, name: "Sir Wali Muhammad Mangrio", role: "2nd Principal", duration: "2011 - 2024", img: principal2, isActive: false },
        { id: 3, name: "Sir. Jeetandar Maheshwari", role: "Current Principal", duration: "2024 - Up to yet", img: principal3, isActive: true }
    ];

    const facultyData = [
        { id: 1, name: "Late Sir. Ganesh Mal", role: "Assistant Professor", duration: "2005 - 2008" },
        { id: 2, name: "Sir. Tikam Das", role: "Assistant Professor", duration: "2018 - 2022" },
        { id: 3, name: "Sir. Abdul Wahid Samoon", role: "Lecturer", duration: "2012 - 2018" },
        { id: 4, name: "Sir. Yousif Channa", role: "Lecturer", duration: "2012 - 2018" },
        { id: 5, name: "Sir. Nihal Chand", role: "Lecturer", duration: "2012 - 2018" },
        { id: 6, name: "Sir. Mian Bux Kapri", role: "Lecturer", duration: "2012 - 2018" },
        { id: 7, name: "Sir. Shoaib Riaz", role: "Assistant Professor", duration: "2020 - 2021" },
        { id: 8, name: "Sir. Nevand Ram", role: "Lecturer", duration: "2020 - 2022" },
        { id: 9, name: "Sir Krishan Lal", role: "HST", duration: "2004 - 2024" },
        { id: 10, name: "Sir. Karno Ji Mahraj", role: "Assistant Professor", duration: "2004 - Up to yet", isActive: true },
        // --- Naye Teachers Jo Abhi Join Hue Hain ---
        { id: 11, name: "Mr. Vishal", role: "Lecturer in Computer Science", duration: "2026 - Up to yet", isActive: true },
        { id: 12, name: "Ms. Cheena Kumari", role: "Lecturer in Chemistry", duration: "2026 - Up to yet", isActive: true }
    ];
    const supportingStaffData = [
        { id: 1, name: "Mr. Sandesh Khemani Suther", role: "Website Developer", desc: "Designed and developed this website & composed lecture notes.", duration: "2021 - Present", img: member1 },
        { id: 2, name: "Mr. Bhaweesh Gul Meghwar", role: "Content Coordinator", desc: "Collected study material from college & Compiled notes.", duration: "2025 - Present", img: member2 }
    ];

    const visitingFacultyData = [
        { id: 1, name: "Sir. Arjun Lal", role: "Subject Specialist", duration: "2005 - 2012" },
        { id: 2, name: "Sir. Allah Jurio Dars", role: "Subject Specialist", duration: "2005 - 2012" },
        { id: 3, name: "Sir. Suresh Soni", role: "Subject Specialist", duration: "2005 - 2012" },
        { id: 4, name: "Sir. Alji Bheel", role: "Subject Specialist", duration: "2005 - 2012" },
        { id: 5, name: <>Late Sir <br/> Mufti Kher Muhammad</>, role: "Visiting Faculty", },
        { id: 6, name: "Miss Mala Kumari", role: "Visiting Faculty", duration: "2023 - 2024" },
        { id: 7, name: "Miss Shardha Bai", role: "Visiting Faculty", duration: "2023 - 2024" },
        { id: 8, name: "Sir Mufti Muhammad Ishaque", role: "Visiting Faculty" }
    ];

    const nonTeachingData = [
        { id: 1, name: "Mr. Manoj Kumar", role: "Computer Trainer", duration: "2016 - 2018" },
        { id: 2, name: "Mr. Ahmed Khan", role: "Senior Clerk", duration: "2016 - 2024" },
        { id: 3, name: "Mr. Rasool Bux", role: "Driver", duration: "2017 - 2021" },
        { id: 4, name: "Mr. Allah Bachayo Channa", role: "Driver", duration: "2014 - 2016" },
        { id: 5, name: "Mr. Farman Ali", role: "Chokidar", duration: "2012 - Up to yet", isActive: true },
        { id: 6, name: "Mr. Dolat Rai", role: "Naib Qasid", duration: "2012 - Up to yet", isActive: true },
        { id: 7, name: "Mr. Chandrno Rahimoo", role: "Chokidar", isActive: true } 
    ];

    // --- VOLUNTEER TEACHERS DATA ---
    const volunteerBatches = [
        {
            batch: "Batch 2k17",
            members: [
                { name: "Mr. Madan Lal" }, { name: "Mr. Allah Dino" }, { name: "Mr. Pandhi" }, 
                { name: "Mr. Vinesh Kumar" }, { name: "Mr. Pardeep" }, { name: "Mr. Kishore" },
                { name: "Mr. Mehtab" }, { name: "Mr. Muhammad Rizwan" }, { name: "Mr. Manoj Kumar" },
                { name: "Mr. Preetam Das" }, { name: "Miss. Devi" }, { name: "Miss. Komal" }
            ]
        },
        {
            batch: "Batch 2k18",
            members: [
                { name: "Mr. Ahmed" }, { name: "Mr. Ashok" }, { name: "Mr. Hareesh" },
                { name: "Mr. Kamlesh" }, { name: "Mr. Miandad" }, { name: "Mr. Bilal Hussain" },
                { name: "Miss. Neelam" }, { name: "Ms. Pushpa" }
            ]
        },
        {
            batch: "Batch 2k19",
            members: [
                { name: "Miss. Pirpula" }, { name: "Miss. Devi Kumari" }, { name: "Mr. Karooji" },
                { name: "Mr. Kishore Kumar" }, { name: "Miss. Shahida" }, { name: "Mr. Imam Bux" },
                { name: "Mr. Nagji" }
            ]
        },
        {
            batch: "Batch 2020",
            members: [
                { name: "Mr. Bharat Kumar" }, { name: "Mr. Love" }, { name: "Mr. Om Parkash" },
                { name: "Mr. Revachand" }, { name: "Mr. Nadeem Ali" }, { name: "Miss. Rabel" },
                { name: "Miss. Zahida" }
            ]
        },
        {
            batch: "Batch 2k21",
            members: [
                { name: "Miss Rameela" }, { name: "Miss. Sameeta" },
                  { name: "Mr. Satram Das" }, { name: "Mr. Mahadev" }
            ]
        },
        {
            batch: "Batch 2k22",
            members: [
                { name: "Mr. Mehtab Jawaro" }, { name: "Mr. Mahtab Chetan" }, { name: "Mr. Vijay Kumar" },
                { name: "Miss. Priyanka" }, { name: "Miss. Kanta" }, { name: "Miss. Bhavita Bai" },
                { name: "Miss. Marvi" }
            ]
        },
        {
            batch: "Batch 2k23",
            members: [
                { name: "Miss. Sandhya" }, { name: "Miss. Anjli" }, { name: "Miss. Bibi Ambreen" },
                { name: "Mr. Manzoor Ali" },
            ]
        },
        {
            batch: "Batch 2k24",
            members: [
                { name: "Miss. Marvi Junejo" }
            ]
             },
        // {
        //     batch: "Batch 2k25",
        //     members: [
        //         { name: "Mr. Bhaweesh Gul" }
        //     ]
        // }

    ];

    // --- SLIDER TIMER ---
    const [currentSlide, setCurrentSlide] = useState(0);
    useEffect(() => {
        if (aboutSliderImages.length <= 1) return;
        const slideInterval = setInterval(() => {
            setCurrentSlide((prev) => (prev === aboutSliderImages.length - 1 ? 0 : prev + 1));
        }, 6000); 
        return () => clearInterval(slideInterval);
    }, [aboutSliderImages.length]);

    useEffect(() => {
        if (currentSlide >= aboutSliderImages.length) setCurrentSlide(0);
    }, [currentSlide, aboutSliderImages.length]);

    return (
        <div className="content-entry-animation bg-gray-50 pb-20 min-h-screen">
            
            {/* PAGE TITLE */}
            <div className="text-center pt-8 pb-10">
                 <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-500 tracking-tight">
                    About <span className="text-[#004d00]">GECE Mithi</span>
                </h1>
            </div>

            {/* --- HISTORY & MISSION SECTION --- */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="bg-white rounded-2xl shadow-xl border-4 border-[#FFD700] overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#004d00] text-white p-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-center">History <span className="text-yellow-400">&  Mission</span></h2>
                    </div>
                    {/* Content */}
                    <div className="p-8">
                        <div className="text-gray-700 text-base leading-relaxed space-y-4 text-justify">
                            <p>
                                <strong>Government Elementary College of Education (GECE) Mithi</strong> was established in 1999. It is situated on the northern edge of Mithi city, near the DCO Office, adjacent to the scenic sand mound known as Gaddi Bhitt, along the Mithi–Naukot Road.
                            </p>
                            <p>
                                The college held its first session of PTC and CT courses in 2004–05. Over the years, it has also organized numerous refresher courses to enhance the teaching methodologies of educators across District Tharparkar.
                            </p>
                            <p>
                                In line with the National Education Policy 2009, the PTC and CT programs were replaced with the <strong>Associate Degree in Education (ADE)</strong> in January 2012. Later, in December 2016, the college was granted permission to launch <strong>B.Ed. (Hons.) Elementary</strong>, starting from the academic session 2017.
                            </p>
                            <p>
                                The college boasts a team of trained and dedicated faculty members who utilize modern, student-centered teaching methods to equip pre-service teachers with high-quality education.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            
            {/* --- NEW SECTION: 3 INFO CARDS (AFFILIATIONS, BENEFITS, ADVANTAGES) --- */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Card 1: Affiliations */}
                    <YellowBorderCard className="p-4 text-left">
                        <h3 className="text-lg font-bold text-[#004d00] mb-3 flex items-center gap-2">
                            🤝 Affiliations & Collaborations
                        </h3>
                        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                            GECE Mithi is affiliated with the <strong>University of Sindh, Jamshoro</strong>, and operates under the Teachers Training Institution, Hyderabad.
                        </p>
                        <p className="text-xs font-bold text-[#004d00] mb-2">Key Partners:</p>
                        <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1">
                            <li>Directorate of Curriculum, Assessment & Research (DCAR)</li>
                            <li>Sindh Teacher Education Development Authority (STEDA)</li>
                            <li>Provincial Institute of Teacher Education (PITE)</li>
                            <li>Aga Khan University – IED</li>
                            <li>Pakistan Reading Project (PRP)</li>
                        </ul>
                    </YellowBorderCard>

                    {/* Card 2: Scope of ADE & B.Ed */}
                    <YellowBorderCard className="p-4 text-left">
                        <h3 className="text-lg font-bold text-[#004d00] mb-3 flex items-center gap-2">
                            📘 Scope of ADE & B.Ed.
                        </h3>
                        <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1.5">
                            <li>Eligibility for PST, JST, EST, and SST jobs</li>
                            <li>Meets criteria for SPSC & Competitive Exams</li>
                            <li>Required for Teaching License (STEDA)</li>
                            <li>ADE graduates enter 5th sem of B.Ed.</li>
                            <li>Opens pathways to M.Phil. & M.Ed.</li>
                            <li>Recognized by HEC & Sindh Govt</li>
                            <li>Preferred in private & govt institutions</li>
                            <li>Roles as Teacher Trainer & Coordinator</li>
                            <li>Scope in curriculum & research</li>
                        </ul>
                    </YellowBorderCard>

                    {/* Card 3: Professional Advantages */}
                    <YellowBorderCard className="p-4 text-left">
                        <h3 className="text-lg font-bold text-[#004d00] mb-3 flex items-center gap-2">
                            🚀 Professional Advantages
                        </h3>
                        <ul className="list-disc pl-4 text-xs text-gray-700 space-y-1.5">
                            <li>HEC-recognized professional degree</li>
                            <li>Leads to STEDA-approved Teaching License</li>
                            <li>Strong foundation in pedagogy</li>
                            <li>Includes practical teaching exposure</li>
                            <li>Aligned with national education standards</li>
                            <li>Equips for inclusive & digital classrooms</li>
                            <li>Develops leadership & management skills</li>
                            <li>Builds capacity for educational research</li>
                            <li><strong>B.Ed. (Hons.) = A complete, future-ready degree.</strong></li>
                        </ul>
                    </YellowBorderCard>

                </div>
            </div>

            {/* --- SECTIONS --- */}

            {/* 1. PRINCIPALS */}
            <SectionDropdown title="Principals of GECE" icon="🏛️" isOpen={activeSection === 'principals'} onClick={() => toggleSection('principals')}> 
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-1/3 flex flex-col items-center justify-center">
                        <div className="bg-white p-1.5 rounded-xl shadow-md border-4 border-[#004d00] w-full max-w-xs">
                            <div className="rounded-lg overflow-hidden relative">
                                <img src={boardImage} alt="Incumbency Board" className="w-full h-auto object-fit" />
                                <div className="absolute bottom-0 left-0 w-full bg-black/80 text-white text-center py-1 text-[10px] font-bold uppercase tracking-wider">Official History Board</div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full content-center">
                            {principalsData.map((person, index) => <TeamCard key={person.id} person={person} showImage={true} className={index === 0 ? 'md:col-span-2 md:w-1/2 md:mx-auto w-full' : ''} />)}

                        </div>
                    </div>
                </div>
            </SectionDropdown>

            {/* 2. FACULTY */}
            <SectionDropdown title="Faculty Members" icon="👨‍🏫" isOpen={activeSection === 'faculty'} onClick={() => toggleSection('faculty')}>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
                    </div>
                ) : faculty.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {faculty.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((person) => <TeamCard key={person.id} person={person} showImage={false} />)}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No faculty members found.</p>
                    </div>
                )}
            </SectionDropdown>

            {/* 3. SUPPORTING STAFF */}
            <SectionDropdown title="Supporting Staff" icon="👥" isOpen={activeSection === 'supporting'} onClick={() => toggleSection('supporting')}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supportingStaffData.map((person) => <TeamCard key={person.id} person={person} showImage={true} />)}
                </div>
            </SectionDropdown>

            {/* 4. VISITING FACULTY */}
            <SectionDropdown title="Visiting Faculty" icon="🤝" isOpen={activeSection === 'visiting'} onClick={() => toggleSection('visiting')}>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
                    </div>
                ) : visitingFaculty.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {visitingFaculty.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((person) => <TeamCard key={person.id} person={person} showImage={false} />)}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No visiting faculty found.</p>
                    </div>
                )}
            </SectionDropdown>

            {/* 5. NON-TEACHING STAFF */}
            <SectionDropdown title="Non-Teaching Staff" icon="🛠️" isOpen={activeSection === 'nonTeaching'} onClick={() => toggleSection('nonTeaching')}>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
                    </div>
                ) : nonTeachingStaff.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {nonTeachingStaff.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)).map((person) => <TeamCard key={person.id} person={person} showImage={false} />)}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No non-teaching staff found.</p>
                    </div>
                )}
            </SectionDropdown>

            {/* 6. VOLUNTEER TEACHERS */}
            <SectionDropdown title="Volunteer Teachers" icon="🙋‍♂️" isOpen={activeSection === 'volunteers'} onClick={() => toggleSection('volunteers')}>
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
                    </div>
                ) : volunteerTeachers.length > 0 ? (
                    <div className="space-y-8">
                        {Object.entries(
                            volunteerTeachers.reduce((acc, teacher) => {
                                if (!acc[teacher.batch]) {
                                    acc[teacher.batch] = [];
                                }
                                acc[teacher.batch].push(teacher);
                                return acc;
                            }, {})
                        ).sort((a, b) => {
                            // Sort batches by year - descending order from 2k25 to 2k12
                            const batchOrder = ['Batch 2k30', 'Batch 2k29', 'Batch 2k28', 'Batch 2k27', 'Batch 2k26', 'Batch 2k25', 'Batch 2k24', 'Batch 2k23', 'Batch 2k22', 'Batch 2k21', 'Batch 2020', 'Batch 2k19', 'Batch 2k18', 'Batch 2k17', 'Batch 2k16', 'Batch 2k15', 'Batch 2k14', 'Batch 2k13', 'Batch 2k12'];
                            return batchOrder.indexOf(a[0]) - batchOrder.indexOf(b[0]);
                        }).map(([batch, teachers]) => (
                            <div key={batch} className="bg-white rounded-2xl border border-[#ffd200] p-4 shadow-sm">
                                <div className="mb-4 pb-2 border-b border-[#ffd200] flex items-center gap-2">
                                    <span className="text-xl">🎓</span>
                                    <h3 className="text-lg md:text-xl font-bold text-[#004d00] uppercase tracking-wide">{batch}</h3>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {teachers.sort((a, b) => a.name.localeCompare(b.name)).map((teacher, idx) => (
                                        <TeamCard key={teacher.id || idx} person={{ name: teacher.name, role: 'Volunteer Teacher', duration: teacher.batch }} showImage={false} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No volunteer teachers found.</p>
                    </div>
                )}
            </SectionDropdown>

        </div>
    );
};

export default AboutUs;