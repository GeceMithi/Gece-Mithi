import React, { useState, useMemo } from 'react';

// --- LOGO IMPORT ---
import logoImg from '../assets/logo.png'; 

// --- REUSABLE NAV BUTTON (For standard links) ---
const NavButton = ({ type, currentType, label, onClick, isMobile = false }) => {
    const isActive = currentType === type;
    
    // Desktop Styling
    const baseClasses = "px-3 py-2 font-bold text-[13px] lg:text-[14px] xl:text-[15px] transition-colors duration-200 cursor-pointer select-none whitespace-nowrap";
    const activeClasses = "text-[#FFD700] border-b-2 border-[#FFD700]"; 
    const inactiveClasses = "text-white hover:text-[#FFD700]";

    // Mobile Styling
    const mobileClasses = `block w-full text-left px-4 py-3 border-b border-green-800 ${isActive ? 'text-[#FFD700] bg-green-900' : 'text-white'}`;

    return (
        <div 
            className={isMobile ? mobileClasses : `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`} 
            onClick={onClick}
        >
            {label}
        </div>
    );
};

const Navbar = ({ contentType, setContentType }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // State for About Dropdown (Mobile)
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    // --- LINKS LIST ---
    const navItems = useMemo(() => ([
        { type: 'home', label: 'Home' },
        
        // "About" ab Dropdown ban gaya hai
        { 
            type: 'about-dropdown', 
            label: 'About', 
            isDropdown: true,
            subItems: [
                { type: 'about', label: 'About College' },
                { type: 'trainings', label: 'In-Service Trainings' },
                { type: 'batches', label: 'All Batches' }

            ]
        },

        { type: 'outline', label: 'Outlines' },
        { type: 'notes', label: 'Notes' },
        { type: 'pastPaper', label: 'Past Papers' },
        // { type: 'portfolio', label: 'Portfolios' },
        { type: 'tools', label: 'Tools' },
                { type: 'studentportal', label: 'Portal' },
        { type: 'contact', label: 'Contact' },
    ]), []);

    const handleNavClick = (type) => {
        setContentType(type);
        setIsMenuOpen(false);
        setIsAboutOpen(false); // Close dropdown on selection
    };

    return (
        <div className="sticky top-0 w-full z-50 font-sans bg-[#004d00] shadow-md border-b-4 border-[#FFD700]">
            
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
                
                <div className="flex items-center justify-between h-20 md:h-24 gap-4">
                    
                    {/* --- Logo Section --- */}
                    <div 
                        className="flex items-center cursor-pointer gap-3 shrink-0" 
                        onClick={() => handleNavClick('home')}
                    >
                        <div className="w-10 h-10 md:w-14 md:h-14 bg-white rounded-full shrink-0 flex items-center justify-center border-2 border-[#FFD700] overflow-hidden p-0.5">
                             <img 
                                src={logoImg} 
                                alt="Logo" 
                                className="w-full h-full object-contain rounded-full" 
                                onError={(e) => {e.target.src='https://placehold.co/100x100/004d00/white?text=LOGO'}}
                             />
                        </div>
                        
                        <div className="flex flex-col justify-center">
                            <span className="text-sm md:text-lg lg:text-xl font-bold text-white tracking-wide leading-tight uppercase whitespace-nowrap">
                                Govt. Elementary College
                            </span>
                            <span className="text-[10px] md:text-xs lg:text-sm text-[#FFD700] font-semibold tracking-wider uppercase whitespace-nowrap">
                                Of Education (M/W) Mithi
                            </span>
                            <span className="text-[9px] text-gray-300 hidden sm:block whitespace-nowrap">
                                Education & Literacy Dept, Govt. of Sindh
                            </span>
                        </div>
                    </div>

                    {/* Spacer (Mobile Only) */}
                    <div className="grow xl:hidden"></div>

                    {/* --- Hamburger Button (Mobile Only) --- */}
                    <button 
                        className="xl:hidden p-2 text-black bg-yellow-500 hover:text-black transition focus:outline-none border border-green-700 rounded ml-2"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            )}
                        </svg>
                    </button>

                    {/* --- DESKTOP MENU --- */}
                    <div className="hidden xl:flex items-center space-x-1 ml-auto h-full">
                        {navItems.map(item => {
                            // 1. DROPDOWN LOGIC FOR DESKTOP (About)
                            if (item.isDropdown) {
                                // Check if parent or any child is active to highlight parent
                                const isParentActive = item.subItems.some(sub => sub.type === contentType);

                                return (
                                    <div key={item.type} className="relative group h-full flex items-center">
                                        <div className={`px-3 py-2 font-bold text-[13px] lg:text-[14px] xl:text-[15px] transition-colors duration-200 cursor-pointer select-none whitespace-nowrap flex items-center gap-1 ${isParentActive ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-white hover:text-[#FFD700]'}`}>
                                            {item.label} 
                                            <span className="text-[10px] transform group-hover:rotate-180 transition-transform">▼</span>
                                        </div>
                                        
                                        {/* Dropdown Menu */}
                                        <div className="absolute top-full left-0 mt-0 w-56 bg-white rounded-b-md shadow-xl overflow-hidden hidden group-hover:block border-t-4 border-[#FFD700]">
                                            {item.subItems.map(subItem => (
                                                <div 
                                                    key={subItem.type}
                                                    onClick={() => handleNavClick(subItem.type)}
                                                    className={`block px-4 py-3 text-sm font-bold cursor-pointer border-b border-[#ffd200] transition-colors ${contentType === subItem.type ? 'bg-green-100 text-[#004d00]' : 'text-gray-700 hover:bg-green-50 hover:text-[#004d00]'}`}
                                                >
                                                    {subItem.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }

                            // 2. NORMAL LINKS FOR DESKTOP
                            return (
                                <NavButton
                                    key={item.type}
                                    type={item.type}
                                    currentType={contentType}
                                    label={item.label}
                                    onClick={() => handleNavClick(item.type)}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* --- MOBILE MENU --- */}
                <div className={`xl:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#003d00] border-t border-green-800 ${isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col py-2">
                        {navItems.map(item => {
                            // 1. DROPDOWN LOGIC FOR MOBILE (About)
                            if (item.isDropdown) {
                                const isParentActive = item.subItems.some(sub => sub.type === contentType);
                                return (
                                    <div key={item.type} className="border-b border-green-800">
                                        <div 
                                            className={`w-full text-left px-4 py-3 flex justify-between items-center ${isParentActive ? 'text-[#FFD700]' : 'text-white'}`}
                                            onClick={() => setIsAboutOpen(!isAboutOpen)}
                                        >
                                            {item.label}
                                            <span>{isAboutOpen ? '▲' : '▼'}</span>
                                        </div>
                                        
                                        {/* Mobile Submenu */}
                                        <div className={`overflow-hidden transition-all duration-300 ${isAboutOpen ? 'max-h-40' : 'max-h-0'}`}>
                                            <div className="bg-[#002b00] pl-6 pb-2">
                                                {item.subItems.map(subItem => (
                                                    <div 
                                                        key={subItem.type}
                                                        className={`w-full text-left px-4 py-3 border-l-2 ${contentType === subItem.type ? 'text-[#FFD700] border-[#FFD700] font-bold' : 'text-gray-300 hover:text-white border-transparent'}`}
                                                        onClick={() => handleNavClick(subItem.type)}
                                                    >
                                                        {subItem.label}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

                            // 2. NORMAL LINKS FOR MOBILE
                            return (
                                <NavButton
                                    key={item.type}
                                    type={item.type}
                                    currentType={contentType}
                                    label={item.label}
                                    isMobile={true}
                                    onClick={() => handleNavClick(item.type)}
                                />
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Navbar;