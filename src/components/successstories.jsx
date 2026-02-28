import React from 'react';

const SuccessStories = () => {
    const stories = [
        { 
            id: 1, 
            name: "Sanjan Kumar", 
            role: "Alumni (2020)", 
            msg: "GECE Mithi gave me the confidence to teach anywhere. Today I am serving as a PST.", 
            img: "https://placehold.co/150x150/004d00/FFF?text=SK" 
        },
        { 
            id: 2, 
            name: "Aisha Bibi", 
            role: "Alumni (2021)", 
            msg: "The practical knowledge I gained here is unmatched. The faculty is very supportive.", 
            img: "https://placehold.co/150x150/004d00/FFF?text=AB" 
        },
        { 
            id: 3, 
            name: "Ali Raza", 
            role: "Student (Final Year)", 
            msg: "This portal helped me access notes easily. Proud to be a student here.", 
            img: "https://placehold.co/150x150/004d00/FFF?text=AR" 
        },
    ];

    return (
        <div className="content-entry-animation p-4">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900">Success <span className="text-[#004d00]">Stories</span></h1>
                <p className="text-gray-500 mt-2">Hear from our alumni and students.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story) => (
                    <div key={story.id} className="bg-white p-8 rounded-2xl shadow-lg border-t-4 border-[#FFD700] flex flex-col items-center text-center hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-green-600 mb-4">
                            <img src={story.img} alt={story.name} className="w-full h-full object-cover"/>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{story.name}</h3>
                        <span className="text-sm text-[#004d00] font-semibold mb-4">{story.role}</span>
                        <p className="text-gray-600 italic">"{story.msg}"</p>
                        
                        <button className="mt-6 text-sm font-bold text-[#004d00] hover:underline">
                            Read Full Story &rarr;
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuccessStories;