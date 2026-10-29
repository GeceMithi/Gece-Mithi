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
        <footer className="bg-[#004d00] text-gray-300 pt-10 pb-4 mt-14 font-sans border-t-2 border-[#FFD700]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Responsive Grid: Quick links, GECE Mithi, aur Map */}
                <div className="grid grid-cols-1 md:grid-cols-[180px_auto_350px] lg:grid-cols-[200px_1fr_400px] gap-8 md:gap-x-12 mb-8 items-start">
                    
                    {/* Column 1: Quick Links */}
                    <div className="w-fit">
                        <h3 className="text-[#FFD700] text-[22px] font-bold mb-5 uppercase tracking-wider">Quick Links</h3>
                        <ul className="space-y-3 text-base">
                            
                            <li 
                                onClick={() => handleLinkClick('home')}
                                className="hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Home
                            </li>

                            <li 
                                onClick={() => handleLinkClick('about')}
                                className="hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                About GECE
                            </li>

                            <li 
                                onClick={() => handleLinkClick('outline')}
                                className="hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Outlines
                            </li>

                            <li 
                                onClick={() => handleLinkClick('notes')}
                                className="hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Notes
                            </li>

                            <li 
                                onClick={() => handleLinkClick('contact')}
                                className="hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center w-fit cursor-pointer"
                            >
                                <span className="text-[#FFD700] mr-2 text-xs">➤</span>
                                Contact Us
                            </li>

                        </ul>
                    </div>

                    {/* Column 2: Contact Info (GECE Mithi) */}
                    <div className="max-w-md">
                        <h3 className="text-[#FFD700] text-[22px] font-bold mb-5 uppercase tracking-wider">GECE Mithi</h3>
                        <div className="space-y-3.5 text-base">
                            
                            {/* Address */}
                            <div className="flex items-start text-white">
                                <span className="text-red-500 mr-2.5 text-base select-none">📍</span>
                                <span>Govt. Elementary College of Education (M/W), Mithi, Tharparkar.</span>
                            </div>
                            
                            {/* Phone */}
                            <div className="flex items-start">
                                <span className="mr-2.5 text-base select-none">📞</span>
                                <div className="text-white">
                                    Principal:{' '}
                                    <a 
                                        href="tel:+923313708015" 
                                        style={{ color: '#FFD700' }} 
                                        className="font-bold hover:underline hover:!text-[#FFF] break-all transition-colors ml-1"
                                    >
                                        +92-331-3708015
                                    </a>
                                </div>
                            </div>
                            
                            {/* Email */}
                            <div className="flex items-start">
                                <span className="mr-2.5 text-base select-none">✉️</span>
                                <a 
                                    href="mailto:gecemithiedu@gmail.com"
                                    style={{ color: '#FFD700' }} 
                                    className="hover:underline hover:!text-[#FFF] break-all transition-colors"
                                >
                                    gecemithiedu@gmail.com
                                </a>
                            </div>

                        </div>
                    </div>

                    {/* Column 3: Google Map */}
                    <div className="w-full h-[280px] md:h-[273px] lg:w-[min(456px,38vw)]">
                        <iframe
                            title="Map to Govt. Elementary College of Education (M/W), Mithi"
                            src="https://www.google.com/maps?q=Govt.%20Elementary%20College%20of%20Education%20Mithi%20Tharparkar&output=embed"
                            className="w-full h-full border border-[#FFD700] rounded-none block"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>

                </div>

                {/* Bottom Copyright */}
                <div className="pt-4 border-t border-green-800 text-center text-xs md:text-sm text-gray-200">
                    <p>
                        Copyright ©2025 All rights reserved | Designed & Developed by 
                        <span 
                            onClick={() => {
                                const developerUrl = window.location.origin + '/?content=developer';
                                window.open(developerUrl, '_blank');
                            }}
                            className="text-[#FFD700] font-bold ml-1 cursor-pointer hover:underline"
                        >
                            SANDESH KHEMANI SUTHER
                        </span>
                    </p>
                </div>

            </div>
        </footer>
    );
};

export default Footer;