import React, { useState } from 'react';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        alert(`Login attempt: ${email}`);
        // Yahan baad mein API call aayega backend ke liye
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-[#ffd200]">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-6">Admin Panel</h2>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-green-500 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            className="w-full p-2 border rounded mt-1 focus:ring-2 focus:ring-green-500 outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                    >
                        Login to Edit Notice Board
                    </button>
                </form>
            </div>
        </div>
    );
}