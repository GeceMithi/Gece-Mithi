import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import InserviceTrainingCard from '../admin/InserviceTrainingCard';

// --- REUSABLE YELLOW BORDER CARD (Updated Hover Effect) ---
const YellowBorderCard = ({ children, className = "" }) => {
    // CHANGE 1: hover:scale-105 ko badal kar hover:scale-[1.01] kar diya hai
    // Is se zoom effect bohot halka ho jayega.
    return (
        <div className={`bg-white rounded-xl shadow-sm border border-[#004d00] border-b-4 border-b-[#FFD700] overflow-hidden hover:shadow-xl hover:scale-[1.01] transition-all duration-300 h-full ${className}`}>
            {children}
        </div>
    );
};

const Trainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const trainingSnap = await getDocs(collection(db, 'inservice_trainings'));
                setTrainings(trainingSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error('Error loading trainings:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrainings();
    }, []);

    return (
        <div className="content-entry-animation bg-gray-50 pb-20 min-h-screen pt-8">
            
            {/* --- 1. PAGE TITLE --- */}
            <div className="text-center pb-10 px-4">
                 <h1 className="text-3xl md:text-5xl font-extrabold text-yellow-500 tracking-tight">
                    In-Service <span className="text-[#004d00]">Trainings</span>
                </h1>
                <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                    Continuous Professional Development for Educators
                </p>
            </div>

            {/* --- 2. INTRODUCTION SECTION --- */}
            <div className="max-w-7xl mx-auto px-4 mb-12">
                <YellowBorderCard className="p-6 md:p-10">
                    <h2 className="text-2xl font-bold text-[#004d00] mb-4 flex items-center gap-2">
                        📚 Introduction of Trainings
                    </h2>
                    
                    <div className="text-gray-700 space-y-4 text-justify leading-relaxed text-sm md:text-base">
                        <p>
                            It is a known fact that <strong>Continuous Professional Development (CPD)</strong> of in-service teachers is essential for equipping them with new and innovative pedagogical advancements. Therefore, this college is providing various refreshers and in-service training programs to <strong>Junior Elementary School Teachers (JESTs)</strong> and <strong>Primary School Teachers (PSTs)</strong> currently working in public sector schools.
                        </p>
                        <p>
                            Various International Educational Organizations like <strong>USAID, UNICEF, CIDA, UNESCO, JICA, EUROPEAN UNION</strong> etc., in collaboration with the Education and Literacy Department, Government of Sindh, have executed in-service teachers training programs at this college.
                        </p>
                        
                        <div className="bg-green-50 p-4 rounded-lg border-l-4 border-[#004d00] my-4">
                            <h3 className="font-bold text-[#004d00] mb-2">Key Training Programs Executed:</h3>
                            <ul className="list-disc list-inside space-y-1">
                                <li>Induction Training Program</li>
                                <li>Sindh Elementary Teachers Training Program</li>
                                <li>Life Skills Based Training</li>
                                <li>Training of 12000 PSTs</li>
                                <li>Sindh Early Learning Enhancement Through Classroom Transformation</li>
                            </ul>
                        </div>

                        <p>
                            Besides evidence-based pedagogy, key educational aspects including <strong>Curriculum Development, Assessment, Action Research, School Management, Child Development, and Teaching & Assessment of Reading</strong> have been imparted to in-service teachers. There is a special integration of <strong>Information and Communication Technology (ICT)</strong>, enabling them to become skilled and competent educators.
                        </p>
                    </div>
                </YellowBorderCard>
            </div>

            {/* --- 3. DYNAMIC TRAINING PROGRAM LIST --- */}
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8 flex flex-col items-center gap-2 text-center">
                    <span className="text-3xl">🎓</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-green-900">List of Master Trainers</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-500">Loading training programs...</div>
                    ) : trainings.length ? (
                        trainings.map((training) => (
                            <InserviceTrainingCard
                                key={training.id}
                                prefix={training.prefix}
                                name={training.name}
                                profession={training.profession}
                                title={training.title}
                                date={training.date}
                                organizer={training.organizer}
                                venue={training.venue}
                                description={training.description}
                                imageUrl={training.image}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500">No trainers available yet.</div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Trainings;