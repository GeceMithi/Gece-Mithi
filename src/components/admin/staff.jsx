import React, { useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, getDocs, orderBy } from "firebase/firestore";

export default function Staff() {
    const [staffList, setStaffList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const q = query(collection(db, "staff_members"), orderBy("createdAt", "asc"));
                const snapshot = await getDocs(q);
                setStaffList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("Error fetching staff:", error);
            }
            setLoading(false);
        };
        fetchStaff();
    }, []);

    // Data ko category ke hisab se alag alag karna (Group by Category)
    const visiting = staffList.filter(s => s.category === "Visiting Faculty");
    const volunteers = staffList.filter(s => s.category === "Volunteer Teacher");
    const nonTeaching = staffList.filter(s => s.category === "Non-Teaching Staff");

    // Single Card ka chota component (Reusable Design)
    const StaffCard = ({ member }) => (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-[#ffd200] hover:shadow-lg transition-shadow">
            {/* Dummy Avatar Profile Image */}
            <div className="w-20 h-20 bg-green-100 text-[#004d00] rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                {member.name.charAt(0)}
            </div>
            <h3 className="text-lg font-bold text-gray-800">{member.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{member.role}</p>
            <span className="mt-3 text-[10px] bg-yellow-100 text-yellow-800 font-bold px-3 py-1 rounded-full uppercase">
                {member.category}
            </span>
        </div>
    );

    if (loading) {
        return <div className="text-center py-20 text-[#004d00] font-bold">Loading Team Data...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto p-6 min-h-screen">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-extrabold text-[#004d00] uppercase border-b-4 border-yellow-400 inline-block pb-2">
                    Our Dedicated Team
                </h2>
            </div>

            {/* VISITING FACULTY SECTION */}
            {visiting.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-[#004d00]">Visiting Faculty</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {visiting.map(m => <StaffCard key={m.id} member={m} />)}
                    </div>
                </div>
            )}

            {/* VOLUNTEER TEACHERS SECTION */}
            {volunteers.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-yellow-500">Volunteer Teachers</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {volunteers.map(m => <StaffCard key={m.id} member={m} />)}
                    </div>
                </div>
            )}

            {/* NON-TEACHING STAFF SECTION */}
            {nonTeaching.length > 0 && (
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-blue-500">Non-Teaching Staff</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {nonTeaching.map(m => <StaffCard key={m.id} member={m} />)}
                    </div>
                </div>
            )}

        </div>
    );
}