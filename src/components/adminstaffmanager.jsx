import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, deleteDoc, getDocs, doc, query, orderBy } from "firebase/firestore";

export default function AdminStaffManager() {
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Form States
    const [name, setName] = useState('');
    const [role, setRole] = useState('');
    const [category, setCategory] = useState('Visiting Faculty'); // Default
    const [duration, setDuration] = useState('');

    // Firebase se data fetch karna
    const fetchStaff = async () => {
        try {
            const q = query(collection(db, "staff_members"), orderBy("createdAt", "desc"));
            const snapshot = await getDocs(q);
            setStaff(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (error) { console.error("Error:", error); }
    };

    useEffect(() => { 
        fetchStaff(); 
    }, []);

    // Firebase mein data add karna
    const handleAdd = async (e) => {
        e.preventDefault();
        if(!name || !role || !duration) return alert("Naam, Role aur Duration dono likhna zaroori hain!");
        
        setLoading(true);
        try {
            await addDoc(collection(db, "staff_members"), {
                name: name,
                role: role,
                category: category,
                duration: duration,
                createdAt: new Date().toISOString()
            });
            console.log("Staff member added successfully");
            setName(''); setRole(''); setDuration(''); 
            await fetchStaff(); // Ensure data is refetched
            alert("✅ Staff Member Added!");
        } catch (error) { 
            console.error("Error adding staff member:", error);
            alert("❌ Error adding member!"); 
        }
        setLoading(false);
    };

    // Firebase se data delete karna
    const handleDelete = async (id) => {
        if(window.confirm("Kya aap is member ko delete karna chahte hain?")) {
            await deleteDoc(doc(db, "staff_members", id));
            fetchStaff();
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-[#ffd200]">
            <h2 className="text-xl font-bold text-[#004d00] mb-4 border-b pb-2">Manage Staff & Faculty</h2>
            
            {/* ADD STAFF FORM */}
            <form onSubmit={handleAdd} className="bg-gray-50 p-4 rounded-lg mb-6 border border-[#ffd200]">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            className="w-full p-2 border rounded font-medium text-black bg-white"
                        >
                            <option value="Visiting Faculty">Visiting Faculty</option>
                            <option value="Volunteer Teacher">Volunteer Teacher</option>
                            <option value="Non-Teaching Staff">Non-Teaching Staff</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Full Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Mr. Vishal" 
                            className="w-full p-2 border rounded text-black bg-white" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Role / Designation</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Lecturer in CS" 
                            className="w-full p-2 border rounded text-black bg-white" 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)} 
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-700 uppercase mb-1 block">Duration (e.g. 2023-2024)</label>
                        <input 
                            type="text" 
                            placeholder="e.g. 2023-2024" 
                            className="w-full p-2 border rounded text-black bg-white" 
                            value={duration} 
                            onChange={(e) => setDuration(e.target.value)} 
                        />
                    </div>
                </div>
                <button type="submit" disabled={loading} className="w-full bg-[#004d00] text-white font-bold py-2 rounded hover:bg-green-800">
                    {loading ? "Adding..." : "ADD MEMBER"}
                </button>
            </form>

            {/* LIST OF UPLOADED STAFF */}
            <h3 className="font-bold text-gray-800 mb-2">Current Staff List</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
                {staff.map((member) => (
                    <div key={member.id} className="flex justify-between items-center p-3 border rounded bg-white shadow-sm">
                        <div>
                            <span className="text-[10px] font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 uppercase mr-2">
                                {member.category}
                            </span>
                            <span className="font-bold text-gray-800">{member.name}</span>
                            <span className="text-gray-500 text-sm ml-2">({member.role})</span>
                            {member.duration && <span className="text-gray-400 text-xs ml-2">[{member.duration}]</span>}
                        </div>
                        <button onClick={() => handleDelete(member.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">🗑️</button>
                    </div>
                ))}
            </div>
        </div>
    );
}