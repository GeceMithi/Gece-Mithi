import React from 'react';

// Prop receive kiya: { setContentType }
const Footer = ({ setContentType }) => {
    
    // Link click handler function
    const handleLinkClick = (type) => {
        // Page ke top per scroll karein
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // Page content change karein
        setContentType(type);
    };

    return (
        <footer className="bg-[#003d00] text-gray-300 py-10 mt-20 font-sans border-t-4 border-[#FFD700]">
            <div className="max-w-screen-xl mx-auto px-6 lg:px-8">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    
                    {/* Column 1: Quick Links (Manual + Working Logic) */}
                    <div>
                        <h3 className="text-[#FFD700] text-xl font-bold mb-6 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3 text-[15px]">
                            
                            {/* Link 1: Home */}
                            <li 
                                onClick={() => handleLinkClick('home')}
                                className="hover:text-white hover:translate-x-2 transition-all duration-300 group flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Home
                            </li>

                            {/* Link 2: About GECE */}
                            <li 
                                onClick={() => handleLinkClick('about')}
                                className="hover:text-white hover:translate-x-2 transition-all duration-300 group flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                About GECE
                            </li>

                            {/* Link 3: Our Team (Ye bhi About section mein hi hai) */}
                            <li 
                                onClick={() => handleLinkClick('outline')}
                                className="hover:text-white hover:translate-x-2 transition-all duration-300 group flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Outlines
                            </li>

                            {/* Link 4: Notes */}
                            <li 
                                onClick={() => handleLinkClick('notes')}
                                className="hover:text-white hover:translate-x-2 transition-all duration-300 group flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Notes
                            </li>

                            {/* Link 5: Contact Us */}
                            <li 
                                onClick={() => handleLinkClick('contact')}
                                className="hover:text-white hover:translate-x-2 transition-all duration-300 group flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Contact Us
                            </li>

                        </ul>
                    </div>

                    {/* Column 2: Contact Info */}
                    <div>
                        <h3 className="text-[#FFD700] text-xl font-bold mb-6 uppercase tracking-wider">GECE Mithi</h3>
                        <div className="space-y-4 text-[15px]">
                            <div className="flex items-start">
                                <span className="text-[#FFD700] mr-3 mt-1 text-lg">📍</span>
                                <span>Govt. Elementary College of Education (M/W), Mithi, Tharparkar.</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-[#FFD700] mr-3 mt-1 text-lg">📞</span>
                                <span className="hover:text-white cursor-pointer">+92-331-3708015</span>
                            </div>
                            <div className="flex items-start">
                                <span className="text-[#FFD700] mr-3 mt-1 text-lg">✉️</span>
                                <span className="hover:text-white cursor-pointer">info@gecemithi.edu.pk</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Copyright */}
                <div className="pt-8 border-t border-green-800 text-center text-sm md:text-md lg:text-md">
                    <p>
                        Copyright ©2025 All rights reserved | Developed by 
                        <span className="text-[#FFD700] font-bold ml-1">SANDESH KHEMANI SUTHER</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;