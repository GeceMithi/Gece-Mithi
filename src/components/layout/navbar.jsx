import React, { useState, useMemo } from 'react';

// --- LOGO IMPORT ---
import logoImg from '../../assets/logo.png'; 

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
    
    // State for Mobile Dropdown (only one open at a time)
    const [openDropdown, setOpenDropdown] = useState(null);
    
    // State for Desktop Dropdowns with hover delays
    const [dropdownStates, setDropdownStates] = useState({});
    const [dropdownTimeouts, setDropdownTimeouts] = useState({});

    // Handle dropdown hover with delay
    const handleDropdownHover = (dropdownType, isEntering) => {
        if (dropdownTimeouts[dropdownType]) {
            clearTimeout(dropdownTimeouts[dropdownType]);
        }
        
        if (isEntering) {
            setDropdownStates(prev => ({ ...prev, [dropdownType]: true }));
        } else {
            const timeoutId = setTimeout(() => {
                setDropdownStates(prev => ({ ...prev, [dropdownType]: false }));
            }, 300);
            
            setDropdownTimeouts(prev => ({ ...prev, [dropdownType]: timeoutId }));
        }
    };

    // --- LINKS LIST ---
    const navItems = useMemo(() => ([
        { type: 'home', label: 'Home' },
        
        // "About" Dropdown
        { 
            type: 'about-dropdown', 
            label: 'About', 
            isDropdown: true,
            subItems: [
                { type: 'about', label: 'About College' },
                { type: 'trainings', label: 'In-Service Trainings' },
                        { type: 'batches', label: 'All Batches' },
                        { type: 'successStories', label: 'Success Stories' }
            ]
        },

        { type: 'outline', label: 'Outlines' },
        { type: 'notes', label: 'Notes' },
        { type: 'pastPaper', label: 'Past Papers' },
        { type: 'resources', label: 'Portfolios & Tools' },

        // "Portal" Dropdown
        {
            type: 'portal-dropdown',
            label: 'Login',
            isDropdown: true,
            subItems: [
                 { type: 'studentportal', label: 'Login' },
                { type: 'admission', label: 'Admission' }
            ]
        },

        { type: 'contact', label: 'Contact' },
    ]), []);

    const handleNavClick = (type) => {
        setContentType(type);
        setIsMenuOpen(false);
        setOpenDropdown(null);
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
                                onError={(e) => { e.target.src = 'https://placehold.co/100x100/004d00/white?text=LOGO'; }}
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
                            if (item.isDropdown) {
                                const isParentActive = item.subItems.some(sub => sub.type === contentType);

                                return (
                                    <div 
                                        key={item.type} 
                                        className="relative h-full flex items-center"
                                        onMouseEnter={() => handleDropdownHover(item.type, true)}
                                        onMouseLeave={() => handleDropdownHover(item.type, false)}
                                    >
                                        <div className={`px-3 py-2 font-bold text-[13px] lg:text-[14px] xl:text-[15px] transition-colors duration-200 cursor-pointer select-none whitespace-nowrap flex items-center gap-1 ${isParentActive ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-white hover:text-[#FFD700]'}`}>
                                            {item.label} 
                                            <span className={`text-[10px] transform transition-transform duration-150 ${dropdownStates[item.type] ? 'rotate-180' : ''}`}>▼</span>
                                        </div>
                                        
                                        {/* Dropdown Menu */}
                                        <div 
                                                className={`absolute top-full ${item.type === 'portal-dropdown' ? 'right-0' : 'left-0'} mt-1 w-[min(16rem,calc(100vw-2rem))] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-[#FFD700] border-b-4 border-b-[#FFD700] backdrop-blur-lg transition-opacity duration-200 ${dropdownStates[item.type] ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                                            onMouseEnter={() => handleDropdownHover(item.type, true)}
                                            onMouseLeave={() => handleDropdownHover(item.type, false)}
                                        >
                                            <div className="bg-gradient-to-r from-[#004d00] to-[#006400] p-3 border-b border-[#FFD700]">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-white rounded-full border border-[#FFD700] overflow-hidden p-0.5 shrink-0">
                                                        <img src={logoImg} alt="College logo" className="w-full h-full object-contain rounded-full" />
                                                    </div>
                                                    <span className="text-white text-sm font-semibold">{item.label} Menu</span>
                                                </div>
                                            </div>
                                            
                                            <div className="py-2">
                                                {item.subItems.map((subItem, index) => (
                                                    <div 
                                                        key={subItem.type}
                                                        onClick={() => handleNavClick(subItem.type)}
                                                        className={`relative px-4 py-3 text-sm font-medium cursor-pointer transition-all duration-150 ${contentType === subItem.type ? 'bg-gradient-to-r from-[#004d00]/10 to-[#006400]/10 text-[#004d00] border-l-4 border-[#FFD700]' : 'text-gray-700 hover:bg-gradient-to-r hover:from-[#004d00]/5 hover:to-[#006400]/5 hover:text-[#004d00] hover:border-l-4 hover:border-[#FFD700]'}`}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150 ${contentType === subItem.type ? 'bg-[#004d00] text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-[#004d00] group-hover:text-white'}`}>
                                                                {subItem.type === 'about' && <span className="text-xs">🏛️</span>}
                                                                {subItem.type === 'trainings' && <span className="text-xs">📚</span>}
                                                                {subItem.type === 'batches' && <span className="text-xs">👥</span>}
                                                                {subItem.type === 'outline' && <span className="text-xs">📋</span>}
                                                                {subItem.type === 'notes' && <span className="text-xs">📝</span>}
                                                                {subItem.type === 'pastPaper' && <span className="text-xs">📄</span>}
                                                                {subItem.type === 'resources' && <span className="text-xs">📚</span>}
                                                                {subItem.type === 'studentportal' && <span className="text-xs">🎓</span>}
                                                                {subItem.type === 'admission' && <span className="text-xs">📝</span>}
                                                                {subItem.type === 'successStories' && (
                                                                    <img src={logoImg} alt="College logo" className="w-5 h-5 object-contain rounded-full" />
                                                                )}
                                                            </div>
                                                            <div className="flex-1">
                                                                <div className="font-semibold">{subItem.label}</div>
                                                                {contentType === subItem.type && (
                                                                    <div className="text-xs text-[#004d00] mt-1">Currently viewing</div>
                                                                )}
                                                            </div>
                                                            {contentType === subItem.type && (
                                                                <svg className="w-4 h-4 text-[#FFD700]" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {index < item.subItems.length - 1 && (
                                                            <div className="absolute bottom-0 left-12 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="bg-gray-50 p-3 border-t border-gray-200">
                                                <div className="text-xs text-gray-500 text-center">
                                                    Explore our {item.label.toLowerCase()} section
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }

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
                <div className={`xl:hidden overflow-hidden transition-all duration-200 ease-in-out bg-[#003d00] border-t border-green-800 ${isMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="flex flex-col py-2">
                        {navItems.map(item => {
                            if (item.isDropdown) {
                                const isParentActive = item.subItems.some(sub => sub.type === contentType);
                                return (
                                    <div key={item.type} className="border-b border-green-800">
                                        <div 
                                            className={`w-full text-left px-4 py-3 flex justify-between items-center ${isParentActive ? 'text-[#FFD700]' : 'text-white'}`}
                                            onClick={() => setOpenDropdown(openDropdown === item.type ? null : item.type)}
                                        >
                                            {item.label}
                                            <span>{openDropdown === item.type ? '▲' : '▼'}</span>
                                        </div>
                                        
                                        <div className={`overflow-hidden transition-all duration-200 ${openDropdown === item.type ? 'max-h-[999px]' : 'max-h-0'}`}>
                                            <div className="bg-[#002b00] pl-6 pb-2">
                                                <div className="flex items-center gap-2 px-4 py-3 border-b border-green-800">
                                                    <div className="w-8 h-8 bg-white rounded-full border border-[#FFD700] overflow-hidden p-0.5 shrink-0">
                                                        <img src={logoImg} alt="College logo" className="w-full h-full object-contain rounded-full" />
                                                    </div>
                                                    <span className="text-xs font-semibold text-[#FFD700]">{item.label} Menu</span>
                                                </div>
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