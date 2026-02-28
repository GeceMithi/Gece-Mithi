// src/hooks/useSecurity.js
import { useEffect } from 'react';

const useSecurity = () => {
    useEffect(() => {
        // 1. Disable Right Click
        const handleContextMenu = (e) => {
            e.preventDefault();
            // Optional: Alert dikhana ho to uncomment karein
            // alert("Right click is disabled for security reasons."); 
        };

        // 2. Disable Keyboard Shortcuts (F12, Ctrl+Shift+I, Ctrl+U, etc.)
        const handleKeyDown = (e) => {
            // F12 (Inspect)
            if (e.key === 'F12') {
                e.preventDefault();
            }
            // Ctrl + Shift + I (Inspect)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
            }
            // Ctrl + Shift + J (Console)
            if (e.ctrlKey && e.shiftKey && e.key === 'J') {
                e.preventDefault();
            }
            // Ctrl + U (View Source)
            if (e.ctrlKey && e.key === 'u') {
                e.preventDefault();
            }
            // Ctrl + C (Copy - Optional, text selection rokne ke liye)
            // if (e.ctrlKey && e.key === 'c') {
            //     e.preventDefault();
            // }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
};

export default useSecurity;