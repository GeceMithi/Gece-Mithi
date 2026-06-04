import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, getDocs } from "firebase/firestore";

const DynamicAboutUs = () => {
    const [faculty, setFaculty] = useState([]);
    const [visitingFaculty, setVisitingFaculty] = useState([]);
    const [nonTeachingStaff, setNonTeachingStaff] = useState([]);
    const [volunteerTeachers, setVolunteerTeachers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d00]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Faculty Members Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#004d00]">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Faculty Members</h3>
                {faculty.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {faculty.map((member) => (
                            <div key={member.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-lg text-gray-800">{member.name}</h4>
                                <p className="text-gray-600">{member.role}</p>
                                <p className="text-sm text-gray-500">{member.duration}</p>
                                {member.isActive && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        Active
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No faculty members found.</p>
                )}
            </div>

            {/* Visiting Faculty Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#004d00]">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Visiting Faculty</h3>
                {visitingFaculty.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visitingFaculty.map((member) => (
                            <div key={member.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-lg text-gray-800">{member.name}</h4>
                                <p className="text-gray-600">{member.role}</p>
                                <p className="text-sm text-gray-500">{member.duration}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No visiting faculty found.</p>
                )}
            </div>

            {/* Non-Teaching Staff Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#004d00]">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Non-Teaching Staff</h3>
                {nonTeachingStaff.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {nonTeachingStaff.map((member) => (
                            <div key={member.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-lg text-gray-800">{member.name}</h4>
                                <p className="text-gray-600">{member.role}</p>
                                <p className="text-sm text-gray-500">{member.duration}</p>
                                {member.isActive && (
                                    <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                        Active
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No non-teaching staff found.</p>
                )}
            </div>

            {/* Volunteer Teachers Section */}
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-[#004d00]">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Volunteer Teachers</h3>
                {volunteerTeachers.length > 0 ? (
                    <div className="space-y-6">
                        {Object.entries(
                            volunteerTeachers.reduce((acc, teacher) => {
                                if (!acc[teacher.batch]) {
                                    acc[teacher.batch] = [];
                                }
                                acc[teacher.batch].push(teacher);
                                return acc;
                            }, {})
                        ).map(([batch, teachers]) => (
                            <div key={batch} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h4 className="font-bold text-lg text-gray-800 mb-3">{batch}</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                    {teachers.map((teacher, index) => (
                                        <div key={teacher.id || index} className="bg-white p-2 rounded border border-gray-300 text-center">
                                            <p className="text-sm font-medium text-gray-700">{teacher.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No volunteer teachers found.</p>
                )}
            </div>
        </div>
    );
};

export default DynamicAboutUs;
