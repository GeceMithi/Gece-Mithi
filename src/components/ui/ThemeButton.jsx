import React from 'react';

// --- THEME BUTTON COMPONENT ---
// Green button with yellow border - consistent theme across website
export const ThemeButton = ({ 
    children, 
    onClick, 
    type = 'button', 
    disabled = false, 
    className = '',
    variant = 'primary', // primary, secondary, outline
    size = 'md', // sm, md, lg
    icon = null,
    fullWidth = false
}) => {
    const baseClasses = 'font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5';
    
    const sizeClasses = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2.5 text-sm',
        lg: 'px-6 py-3 text-base'
    };
    
    const variantClasses = {
        primary: 'bg-[#004d00] text-white border-2 border-[#ffd200] hover:bg-[#003800] hover:border-[#ffeb3b]',
        secondary: 'bg-[#ffd200] text-[#004d00] border-2 border-[#004d00] hover:bg-[#ffeb3b] hover:border-[#003b00]',
        outline: 'bg-transparent text-[#004d00] border-2 border-[#ffd200] hover:bg-[#ffd200] hover:text-white'
    };
    
    const widthClass = fullWidth ? 'w-full' : '';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed transform-none' : '';
    
    const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`;
    
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            <span className="flex items-center justify-center gap-2">
                {icon && <span className="flex-shrink-0">{icon}</span>}
                {children}
            </span>
        </button>
    );
};

// --- THEME CARD COMPONENT ---
// Card with yellow border and green accents
export const ThemeCard = ({ 
    children, 
    className = '',
    hover = true,
    padding = 'md' // sm, md, lg
}) => {
    const paddingClasses = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6'
    };
    
    const hoverClasses = hover ? 'hover:shadow-2xl hover:scale-105 hover:-translate-y-1' : '';
    
    return (
        <div className={`bg-white rounded-xl shadow-lg border-2 border-[#ffd200] border-b-4 border-b-[#004d00] overflow-hidden transition-all duration-300 ${hoverClasses} ${paddingClasses[padding]} ${className}`}>
            {children}
        </div>
    );
};

// --- THEME INPUT COMPONENT ---
// Input with green focus and yellow border
export const ThemeInput = ({ 
    label, 
    type = 'text', 
    placeholder = '', 
    value, 
    onChange, 
    className = '',
    required = false,
    error = ''
}) => {
    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-3 py-2 border-2 border-[#ffd200] rounded-md focus:ring-2 focus:ring-[#004d00] focus:border-[#004d00] outline-none bg-white text-sm transition-colors ${error ? 'border-red-500' : ''}`}
            />
            {error && (
                <p className="text-xs text-red-600 font-medium">{error}</p>
            )}
        </div>
    );
};

// --- THEME BADGE COMPONENT ---
// Badge with green background and yellow text
export const ThemeBadge = ({ 
    children, 
    variant = 'primary', // primary, secondary, outline
    className = ''
}) => {
    const variantClasses = {
        primary: 'bg-[#004d00] text-[#ffd200]',
        secondary: 'bg-[#ffd200] text-[#004d00]',
        outline: 'bg-transparent text-[#004d00] border border-[#ffd200]'
    };
    
    return (
        <span className={`inline-block px-2 py-1 text-xs font-bold uppercase tracking-wide rounded ${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
};

// --- THEME NAVIGATION BUTTON ---
// Special button for navigation (like admin panel buttons)
export const ThemeNavButton = ({ 
    children, 
    onClick, 
    isActive = false, 
    isSpecial = false, // For special buttons like CONTENT MANAGER
    icon = null,
    className = ''
}) => {
    const baseClasses = 'w-full flex items-center px-4 py-3.5 rounded-lg text-sm font-bold transition-all duration-300 shadow-sm';
    
    let activeClasses = '';
    if (isActive) {
        if (isSpecial) {
            activeClasses = 'bg-[#ffeb3b] text-black border-3 border-[#f57c00] shadow-lg';
        } else {
            activeClasses = 'bg-[#ffd200] text-[#004d00]';
        }
    } else {
        activeClasses = 'bg-[#003b00] text-white border border-[#005a00] hover:bg-[#002a00] hover:border-[#004d00]';
    }
    
    return (
        <button
            onClick={onClick}
            className={`${baseClasses} ${activeClasses} ${className}`}
        >
            {icon && <span className="w-5 h-5 mr-3 flex-shrink-0">{icon}</span>}
            {children}
        </button>
    );
};
