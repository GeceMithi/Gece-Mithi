import React from 'react';

const Developer = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-block bg-[#004d00] text-white px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                        Web Developer
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#004d00] mb-4">
                        SANDESH KHEMANI SUTHER
                    </h1>
                    <p className="text-gray-600 text-lg">Full Stack Web Developer</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#ffd200] mb-8">
                    <div className="bg-[#004d00] p-6">
                        <h2 className="text-2xl font-bold text-white">Contact Information</h2>
                    </div>
                    <div className="p-8">
                        <div className="space-y-6">
                            {/* Name */}
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                                <div className="w-12 h-12 bg-[#004d00] rounded-full flex items-center justify-center text-white mr-4">
                                    <span className="text-xl">👤</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Name</p>
                                    <p className="text-lg font-semibold text-gray-800">SANDESH KHEMANI SUTHER</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                                <div className="w-12 h-12 bg-[#004d00] rounded-full flex items-center justify-center text-white mr-4">
                                    <span className="text-xl">📞</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Phone</p>
                                    <a href="tel:+923313708015" className="text-lg font-semibold text-[#004d00] hover:underline">
                                        +92-336-1121841
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                                <div className="w-12 h-12 bg-[#004d00] rounded-full flex items-center justify-center text-white mr-4">
                                    <span className="text-xl">✉️</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Email</p>
                                    <a href="mailto:sandeshkhemani@gmail.com" className="text-lg font-semibold text-[#004d00] hover:underline">
                                        sandesh.suther@gmail.com
                                    </a>
                                </div>
                            </div>

                            {/* Website */}
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                                <div className="w-12 h-12 bg-[#004d00] rounded-full flex items-center justify-center text-white mr-4">
                                    <span className="text-xl">🌐</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Website</p>
                                    <a href="https://sandeshkhemani.vercel.app" target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-[#004d00] hover:underline">
                                        sandeshkhemani.vercel.app
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors">
                                <div className="w-12 h-12 bg-[#004d00] rounded-full flex items-center justify-center text-white mr-4">
                                    <span className="text-xl">📍</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-bold">Location</p>
                                    <p className="text-lg font-semibold text-gray-800">Mithi, Tharparkar, Sindh, Pakistan</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#ffd200] mb-8">
                    <div className="bg-[#004d00] p-6">
                        <h2 className="text-2xl font-bold text-white">Technical Skills</h2>
                    </div>
                    <div className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                             <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-[#ffd200]">
                                <p className="font-bold text-[#004d00]">HTML</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-[#ffd200]">
                                <p className="font-bold text-[#004d00]">React.js</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-[#ffd200]">
                                <p className="font-bold text-[#004d00]">Node.js</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-[#ffd200]">
                                <p className="font-bold text-[#004d00]">Firebase</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-[#ffd200]">
                                <p className="font-bold text-[#004d00]">MongoDB</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-[#ffd200]">
                                <p className="font-bold text-[#004d00]">Tailwind CSS</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center border-2 border-[#ffd200]">
                                <p className="font-bold text-[#004d00]">JavaScript</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Services Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-[#ffd200]">
                    <div className="bg-[#004d00] p-6">
                        <h2 className="text-2xl font-bold text-white">Services</h2>
                    </div>
                    <div className="p-8">
                        <ul className="space-y-3">
                            <li className="flex items-center text-gray-700">
                                <span className="text-[#FFD700] mr-3">✓</span>
                                Custom Web Application Development
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-[#FFD700] mr-3">✓</span>
                                Responsive Website Design
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-[#FFD700] mr-3">✓</span>
                                MERN Stack Development
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-[#FFD700] mr-3">✓</span>
                                Firebase Integration
                            </li>
                            <li className="flex items-center text-gray-700">
                                <span className="text-[#FFD700] mr-3">✓</span>
                                Cloudinary Media Management
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => window.history.back()}
                        className="bg-[#004d00] hover:bg-[#003800] text-white px-8 py-3 rounded-lg font-bold transition-colors"
                    >
                        ← Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Developer;
