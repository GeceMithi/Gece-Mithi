import React from 'react';

// === STATIC BATCHES DATA ===
const staticBatchesData = [
    {
        id: '2025',
        year: '2025',
        batch: '2025',
        students: [
            { name: 'Abdul Haleem', semester: '3rd Semester', fatherName: 'Imam Bux', surname: 'Soomro', status: 'Studying' },
            { name: 'Abdul Samad', semester: '3rd Semester', fatherName: 'Ghulam Mustafa', surname: 'Nohari', status: 'Studying' },
            { name: 'Abrar', semester: '3rd Semester', fatherName: 'Asadullah', surname: 'Nohri', status: 'Studying' },
            { name: 'Alka Kumari', semester: '3rd Semester', fatherName: 'Sarwan Kumar', surname: 'Brahman', status: 'Studying' },
            { name: 'Amanullah', semester: '3rd Semester', fatherName: 'Qamar-ul-Din', surname: 'Soomro', status: 'Studying' },
            { name: 'Aneela Bai', semester: '3rd Semester', fatherName: 'Kaloo', surname: 'Bheel', status: 'Studying' },
            { name: 'Anosha', semester: '3rd Semester', fatherName: 'Tota Ram', surname: 'Meghwar', status: 'Studying' },
            { name: 'Asma', semester: '3rd Semester', fatherName: 'Shah Nawaz', surname: 'Baloch', status: 'Studying' },
            { name: 'Azra Yaqoob', semester: '3rd Semester', fatherName: 'Muhammad Yaqoob', surname: 'Chandio', status: 'Studying' },
            { name: 'Benazir', semester: '3rd Semester', fatherName: 'Ghulam Hussain', surname: 'Charo', status: 'Studying' },
            { name: 'Bhavita Kumari', semester: '3rd Semester', fatherName: 'Ponjo Mal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Bhaweesh Kumar', semester: '3rd Semester', fatherName: 'Kheto Mal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Bhawita Bai', semester: '3rd Semester', fatherName: 'Nihal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Bheesham Kumar', semester: '3rd Semester', fatherName: 'Mevaram', surname: 'Meghwar', status: 'Studying' },
            { name: 'Bhomika Kumari', semester: '3rd Semester', fatherName: 'Tikam Das', surname: 'Malhi', status: 'Studying' },
            { name: 'Darshna Bai', semester: '3rd Semester', fatherName: 'Chando Mal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Devraj Singh', semester: '3rd Semester', fatherName: 'Bhan Singh', surname: 'Rajput', status: 'Studying' },
            { name: 'Havi Bai', semester: '3rd Semester', fatherName: 'Chander', surname: 'Meghwar', status: 'Studying' },
            { name: 'Hemavanti', semester: '3rd Semester', fatherName: 'Devji', surname: 'Bheel', status: 'Studying' },
            { name: 'Hidayatullah', semester: '3rd Semester', fatherName: 'Muhammad Ibrahim', surname: 'Nohri', status: 'Studying' },
            { name: 'Hitesh Kumar', semester: '3rd Semester', fatherName: 'Moroo Mal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Ishwar Kumar', semester: '3rd Semester', fatherName: 'Suresh Kumar', surname: 'Meghwar', status: 'Studying' },
            { name: 'Janta Bai', semester: '3rd Semester', fatherName: 'Khenpal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Kumkum', semester: '3rd Semester', fatherName: 'Ashok Kumar', surname: 'Malhi', status: 'Studying' },
            { name: 'Lavita', semester: '3rd Semester', fatherName: 'Hotchand', surname: 'Brahman', status: 'Studying' },
            { name: 'MadanLal', semester: '3rd Semester', fatherName: 'Ghemro', surname: 'Meghwar', status: 'Studying' },
            { name: 'Nizam Fatima', semester: '3rd Semester', fatherName: 'Mashooq Ali', surname: 'Bajeer', status: 'Studying' },
            { name: 'Noshad', semester: '3rd Semester', fatherName: 'Mohan', surname: 'Meghwar', status: 'Studying' },
            { name: 'Parshna', semester: '3rd Semester', fatherName: 'Shevo', surname: 'Meghwar', status: 'Studying' },
            { name: 'Piasi', semester: '3rd Semester', fatherName: 'Tanu', surname: 'Meghwar', status: 'Studying' },
            { name: 'Raksha Kumari', semester: '3rd Semester', fatherName: 'Tikam Das', surname: 'Malhi', status: 'Studying' },
            { name: 'Raveena', semester: '3rd Semester', fatherName: 'Tansukh Das', surname: 'Suthar', status: 'Studying' },
            { name: 'Rehmatullah', semester: '3rd Semester', fatherName: 'Muhammad Ramzan', surname: 'Rajar', status: 'Studying' },
            { name: 'Rizwana', semester: '3rd Semester', fatherName: 'Muhammad Yaseen', surname: 'Khaskheeli', status: 'Studying' },
            { name: 'Roshni', semester: '3rd Semester', fatherName: 'Vikram Kumar', surname: 'Maheshwari', status: 'Studying' },
            { name: 'Sandeep', semester: '3rd Semester', fatherName: 'Allam Das', surname: 'Meghwar', status: 'Studying' },
            { name: 'Saneela', semester: '3rd Semester', fatherName: 'Bhamar Lal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Sawan', semester: '3rd Semester', fatherName: 'Karoo', surname: 'Meghwar', status: 'Studying' },
            { name: 'Shahla', semester: '3rd Semester', fatherName: 'Muhammad Usman', surname: 'Junejo', status: 'Studying' },
            { name: 'Shams-ul-Din', semester: '3rd Semester', fatherName: 'Saifullah', surname: 'Junejo', status: 'Studying' },
            { name: 'Sineha', semester: '3rd Semester', fatherName: 'Chander Kumar', surname: 'Maheshwari', status: 'Studying' },
            { name: 'Soomar', semester: '3rd Semester', fatherName: 'Hassan', surname: 'Samejo', status: 'Studying' },
            { name: 'Urmila Kumari', semester: '3rd Semester', fatherName: 'Lalchand', surname: 'Mahraj', status: 'Studying' },
            { name: 'Veena Kumari', semester: '3rd Semester', fatherName: 'Jawahar Lal', surname: 'Meghwar', status: 'Studying' }
        ]
    },
    {
        id: '2024',
        year: '2024',
        batch: '2024',
        students: [
            { name: 'Abdul Karim', semester: 'Studying', fatherName: 'Saindad', surname: 'Sahar', status: 'Studying' },
            { name: 'Abdul Rauf', semester: 'Studying', fatherName: 'Hussain', surname: 'Bajeer', status: 'Studying' },
            { name: 'Aman', semester: 'Studying', fatherName: 'Dolat Ram', surname: 'Meghwar', status: 'Studying' },
            { name: 'Bhawna', semester: 'Studying', fatherName: 'Hotchand', surname: 'Meghwar', status: 'Studying' },
            { name: 'Chandni', semester: 'Studying', fatherName: 'Teerath', surname: 'Khatri', status: 'Studying' },
            { name: 'Dilkash', semester: 'Studying', fatherName: 'Ramesh', surname: 'Meghwar', status: 'Studying' },
            { name: 'Feroza', semester: 'Studying', fatherName: 'Mohammad-ul-Rahim', surname: 'Parha', status: 'Studying' },
            { name: 'Ghansham Kumar', semester: 'Studying', fatherName: 'Mano', surname: 'Meghwar', status: 'Studying' },
            { name: 'Gotam', semester: 'Studying', fatherName: 'Tharo Mal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Hansraj', semester: 'Studying', fatherName: 'Sooro', surname: 'Bheel', status: 'Studying' },
            { name: 'HishmatRai', semester: 'Studying', fatherName: 'Rano Mal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Jaimala', semester: 'Studying', fatherName: 'Surto', surname: 'Suther', status: 'Studying' },
            { name: 'Karshma', semester: 'Studying', fatherName: 'Jamon', surname: 'Meghwar', status: 'Studying' },
            { name: 'Kashafnaz', semester: 'Studying', fatherName: 'Abdul Razaque', surname: 'Nohari', status: 'Studying' },
            { name: 'Maria', semester: 'Studying', fatherName: 'Abdul Hafiz', surname: 'Junejo', status: 'Studying' },
            { name: 'MarviJunejo', semester: 'Studying', fatherName: 'Sahib Dino', surname: 'Junejo', status: 'Studying' },
            { name: 'Muhammad Yousif', semester: 'Studying', fatherName: 'Hyder', surname: 'Lanjo', status: 'Studying' },
            { name: 'Murk', semester: 'Studying', fatherName: 'Ali Muhammad', surname: 'Parha', status: 'Studying' },
            { name: 'Noman', semester: 'Studying', fatherName: 'Samiullah', surname: 'Junejo', status: 'Studying' },
            { name: 'Parvati', semester: 'Studying', fatherName: 'Hotchand', surname: 'Meghwar', status: 'Studying' },
            { name: 'Pooja', semester: 'Studying', fatherName: 'Ompirkash', surname: 'Meghwar', status: 'Studying' },
            { name: 'Pooja', semester: 'Studying', fatherName: 'Ramesh', surname: 'Meghwar', status: 'Studying' },
            { name: 'Reena', semester: 'Studying', fatherName: 'Essar Das', surname: 'Meghwar', status: 'Studying' },
            { name: 'Sabanaz', semester: 'Studying', fatherName: 'Abdul Razaque', surname: 'Nohari', status: 'Studying' },
            { name: 'Sapna', semester: 'Studying', fatherName: 'Karmoon Mal', surname: 'Meghwar', status: 'Studying' },
            { name: 'Suresh Kumar', semester: 'Studying', fatherName: 'Mahendro', surname: 'Meghwar', status: 'Studying' },
            { name: 'VineetaBai', semester: 'Studying', fatherName: 'Mevaram', surname: 'Meghwar', status: 'Studying' },
            { name: 'Vivek Kumar', semester: 'Studying', fatherName: 'MotiLal', surname: 'Meghwar', status: 'Studying' },
            { name: 'ZaharaBatool', semester: 'Studying', fatherName: 'Ali Muhammad', surname: 'Bajeer', status: 'Studying' }
        ]
    }
];

export default function BatchesSection({ 
    title = "Batches", 
    subtitle = "View all batches",
    showHeader = true,
    className = "",
    batchSize = "default" // "small", "default", "large"
}) {
    // Size configurations
    const sizeClasses = {
        small: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        large: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
    };

    const cardSizeClasses = {
        small: "p-3 text-sm",
        default: "p-4",
        large: "p-6 text-lg"
    };

    return (
        <div className={`w-full ${className}`}>
            {showHeader && (
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-[#004d00] mb-2">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-gray-600">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className={`grid ${sizeClasses[batchSize]} gap-4`}>
                {staticBatchesData.map((batch) => (
                    <div 
                        key={batch.id} 
                        className={`bg-white rounded-lg shadow-md border border-gray-200 ${cardSizeClasses[batchSize]}`}
                    >
                        <div className="text-center">
                            <div className="bg-[#004d00] text-white rounded-t-lg -m-4 mb-3 p-2">
                                <h3 className="font-bold">
                                    {batchSize === 'small' ? batch.batch : `BATCH ${batch.batch}`}
                                </h3>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Students:</span>
                                    <span className="font-semibold text-[#004d00]">{batch.students.length}</span>
                                </div>
                                
                                {batchSize !== 'small' && (
                                    <>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Batch ID:</span>
                                            <span className="text-sm text-gray-800">{batch.id}</span>
                                        </div>
                                        
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                                                Active
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {staticBatchesData.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No batch data available</p>
                </div>
            )}
        </div>
    );
}
