import React, { createContext, useContext, useState, useCallback } from 'react';
import ToastNotification from '../components/ui/ToastNotification';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        message: '',
        type: 'success',
        isVisible: false
    });

    const showToast = useCallback((message, type = 'success') => {
        setToast({
            message,
            type,
            isVisible: true
        });
    }, []);

    const hideToast = useCallback(() => {
        setToast(prev => ({
            ...prev,
            isVisible: false
        }));
    }, []);

    // Replace global alert function
    React.useEffect(() => {
        // Store original alert
        const originalAlert = window.alert;
        
        // Override alert with toast
        window.alert = (message) => {
            // Try to determine type based on message content
            let toastType = 'info';
            const lowerMessage = message.toLowerCase();
            
            if (lowerMessage.includes('success') || lowerMessage.includes('successfully') || lowerMessage.includes('uploaded')) {
                toastType = 'success';
            } else if (lowerMessage.includes('error') || lowerMessage.includes('failed') || lowerMessage.includes('failed to')) {
                toastType = 'error';
            } else if (lowerMessage.includes('warning') || lowerMessage.includes('please')) {
                toastType = 'warning';
            }
            
            showToast(message, toastType);
        };
        
        // Cleanup: restore original alert
        return () => {
            window.alert = originalAlert;
        };
    }, [showToast]);

    return (
        <ToastContext.Provider value={{ showToast, hideToast }}>
            {children}
            <ToastNotification
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </ToastContext.Provider>
    );
};

export default ToastContext;
