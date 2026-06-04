import React, { useEffect, useState } from 'react';

const ToastNotification = ({ message, type = 'success', isVisible, onClose }) => {
    const [shouldShow, setShouldShow] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setShouldShow(true);
            // Auto close after 3 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 3000);
            return () => clearTimeout(timer);
        } else {
            setShouldShow(false);
        }
    }, [isVisible]);

    const handleClose = () => {
        setShouldShow(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    };

    if (!isVisible) return null;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-600 text-white border-green-700';
            case 'error':
                return 'bg-red-600 text-white border-red-700';
            case 'warning':
                return 'bg-yellow-500 text-white border-yellow-600';
            case 'info':
                return 'bg-blue-600 text-white border-blue-700';
            default:
                return 'bg-green-600 text-white border-green-700';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                );
            case 'info':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 transform ${
            shouldShow ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${getToastStyles()} min-w-[300px] max-w-md`}>
                <div className="flex-shrink-0">
                    {getIcon()}
                </div>
                <div className="flex-1 text-sm font-medium">
                    {message}
                </div>
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 ml-2 hover:opacity-75 transition-opacity"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default ToastNotification;
