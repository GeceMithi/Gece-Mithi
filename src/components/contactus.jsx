import React, { useState } from 'react';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendToWhatsApp = (e) => {
        e.preventDefault();
        
        const { name, subject, message } = formData;
        
        if (!name || !subject || !message) {
            alert("Please fill all fields");
            return;
        }

        // --- YAHAN APNA NUMBER DALEIN (Country code ke saath, bina + ke) ---
        const phoneNumber = "923313708015"; 

        const whatsappMessage = `*Name:* ${name}%0A*Subject:* ${subject}%0A*Message:* ${message}`;
        const url = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        window.open(url, '_blank');
    };

    return (
        <div className="content-entry-animation">
            
            {/* Header */}
            <div className="text-center mb-16 pt-8">
                <h1 className="text-4xl font-extrabold text-yellow-400 tracking-tighter sm:text-5xl">
                    Contact <span className="text-[#004d00]">GECE Mithi</span>
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Reach out to the college administration directly via WhatsApp.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Contact Info (Left Side) */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#ffd200] h-full">
                        <div className="space-y-8">
                             {/* Address */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-red-100 text-[#004d00] rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-800">College Address</h3>
                                    <p className="text-gray-600">
                                        Govt. Elementary College of Education (M/W),<br/>
                                        Mithi, District Tharparkar,<br/>
                                        Sindh, Pakistan.
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-bold text-gray-800">Contact Number</h3>
                                    <p className="text-gray-600">+92-331-3708015</p>
                                    <p className="text-xs text-gray-400">(Office Hours Only)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form (Right Side) */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-8 border border-[#ffd200]">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Message via WhatsApp</h3>
                    <form onSubmit={sendToWhatsApp} className="space-y-6">
                        
                        {/* Name Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                // Added 'text-gray-900' here
                                className="w-full px-4 py-3 rounded-lg border border-[#ffd200] text-gray-900 focus:ring-2 focus:ring-[#004d00] outline-none transition" 
                                placeholder="Enter your name" 
                                required
                            />
                        </div>

                        {/* Subject Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input 
                                type="text" 
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                // Added 'text-gray-900' here
                                className="w-full px-4 py-3 rounded-lg border border-[#ffd200] text-gray-900 focus:ring-2 focus:ring-[#004d00] outline-none transition" 
                                placeholder="Regarding Notes / Admission" 
                                required
                            />
                        </div>

                        {/* Message Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea 
                                rows="5" 
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                // Added 'text-gray-900' here
                                className="w-full px-4 py-3 rounded-lg border border-[#ffd200] text-gray-900 focus:ring-2 focus:ring-[#004d00] outline-none transition" 
                                placeholder="Write your message here..."
                                required
                            ></textarea>
                        </div>

                        {/* WhatsApp Button */}
                        <button 
                            type="submit" 
                            className="w-full bg-[#25D366] text-white font-bold py-4 rounded-xl hover:bg-[#20bd5a] transition duration-300 shadow-lg flex items-center justify-center gap-2"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                            </svg>
                            Send on WhatsApp
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;