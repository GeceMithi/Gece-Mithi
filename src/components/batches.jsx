import React, { useState } from 'react';

// === ICONS ===
const Icons = {
    Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    GradCap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 0 6 2.5 6 5s3-5 6-5v-5"></path></svg>,
    ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    ChevronUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
};

// === DATA ===
const batchesData = {
    // "2026": [
    //      { name: "Sandesh Khemani", rel: "S/o", fname: "Harchand Rai", surname: "Suthar", status: "Studying in 1st Semester" }
    // ],
    "2025": [
        { name: "Abdul Haleem", rel: "S/o", fname: "Imam Bux", surname: "Soomro", status: "Studying in 3rd Semester" },
        { name: "Abdul Samad", rel: "S/o", fname: "Ghulam Mustafa", surname: "Nohari", status: "Studying in 3rd Semester" },
        { name: "Abrar", rel: "S/o", fname: "Asadullah", surname: "Nohri", status: "Studying in 3rd Semester" },
        { name: "Alka Kumari", rel: "D/o", fname: "Sarwan Kumar", surname: "Brahman", status: "Studying in 3rd Semester" },
        { name: "Amanullah", rel: "S/o", fname: "Qamar-ul-Din", surname: "Soomro", status: "Studying in 3rd Semester" },
        { name: "Aneela Bai", rel: "D/o", fname: "Kaloo", surname: "Bheel", status: "Studying in 3rd Semester" },
        { name: "Anosha", rel: "D/o", fname: "Tota Ram", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Asma", rel: "D/o", fname: "Shah Nawaz", surname: "Baloch", status: "Studying in 3rd Semester" },
        { name: "Azra Yaqoob", rel: "D/o", fname: "Muhammad Yaqoob", surname: "Chandio", status: "Studying in 3rd Semester" },
        { name: "Benazir", rel: "D/o", fname: "Ghulam Hussain", surname: "Charo", status: "Studying in 3rd Semester" },
        { name: "Bhavita Kumari", rel: "D/o", fname: "Ponjo Mal", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Bhaweesh Kumar", rel: "S/o", fname: "Kheto Mal", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Bhawita Bai", rel: "D/o", fname: "Nihal", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Bheesham Kumar", rel: "S/o", fname: "Mevaram", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Bhomika Kumari", rel: "D/o", fname: "Tikam Das", surname: "Malhi", status: "Studying in 3rd Semester" },
        { name: "Darshna Bai", rel: "D/o", fname: "Chando Mal", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Devraj Singh", rel: "S/o", fname: "Bhan Singh", surname: "Rajput", status: "Studying in 3rd Semester" },
        { name: "Havi Bai", rel: "D/o", fname: "Chander", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Hemavanti", rel: "D/o", fname: "Devji", surname: "Bheel", status: "Studying in 3rd Semester" },
        { name: "Hidayatullah", rel: "S/o", fname: "Muhammad Ibrahim", surname: "Nohri", status: "Studying in 3rd Semester" },
        { name: "Hitesh Kumar", rel: "S/o", fname: "Moroo Mal", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Ishwar Kumar", rel: "S/o", fname: "Suresh Kumar", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Janta Bai", rel: "D/o", fname: "Khenpal", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Kumkum", rel: "D/o", fname: "Ashok Kumar", surname: "Malhi", status: "Studying in 3rd Semester" },
        { name: "Lavita", rel: "D/o", fname: "Hotchand", surname: "Brahman", status: "Studying in 3rd Semester" },
        { name: "MadanLal", rel: "S/o", fname: "Ghemro", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Nizam Fatima", rel: "D/o", fname: "Mashooq Ali", surname: "Bajeer", status: "Studying in 3rd Semester" },
        { name: "Noshad", rel: "S/o", fname: "Mohan", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Parshna", rel: "D/o", fname: "Shevo", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Piasi", rel: "D/o", fname: "Tanu", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Raksha Kumari", rel: "D/o", fname: "Tikam Das", surname: "Malhi", status: "Studying in 3rd Semester" },
        { name: "Raveena", rel: "D/o", fname: "Tansukh Das", surname: "Suthar", status: "Studying in 3rd Semester" },
        { name: "Rehmatullah", rel: "S/o", fname: "Muhammad Ramzan", surname: "Rajar", status: "Studying in 3rd Semester" },
        { name: "Rizwana", rel: "D/o", fname: "Muhammad Yaseen", surname: "Khaskheeli", status: "Studying in 3rd Semester" },
        { name: "Roshni", rel: "D/o", fname: "Vikram Kumar", surname: "Maheshwari", status: "Studying in 3rd Semester" },
        { name: "Sandeep", rel: "S/o", fname: "Allam Das", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Saneela", rel: "D/o", fname: "Bhamar Lal", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Sawan", rel: "S/o", fname: "Karoo", surname: "Meghwar", status: "Studying in 3rd Semester" },
        { name: "Shahla", rel: "D/o", fname: "Muhammad Usman", surname: "Junejo", status: "Studying in 3rd Semester" },
        { name: "Shams-ul-Din", rel: "S/o", fname: "Saifullah", surname: "Junejo", status: "Studying in 3rd Semester" },
        { name: "Sineha", rel: "D/o", fname: "Chander Kumar", surname: "Maheshwari", status: "Studying in 3rd Semester" },
        { name: "Soomar", rel: "S/o", fname: "Hassan", surname: "Samejo", status: "Studying in 3rd Semester" },
        { name: "Urmila Kumari", rel: "D/o", fname: "Lalchand", surname: "Mahraj", status: "Studying in 3rd Semester" },
        { name: "Veena Kumari", rel: "D/o", fname: "Jawahar Lal", surname: "Meghwar", status: "Studying in 3rd Semester" }
    ],
    "2024": [
        { name: "Abdul Karim", rel: "S/o", fname: "Saindad", surname: "Sahar", status: "Studying" },
        { name: "Abdul Rauf", rel: "S/o", fname: "Hussain", surname: "Bajeer", status: "Studying" },
        { name: "Aman", rel: "S/o", fname: "Dolat Ram", surname: "Meghwar", status: "Studying" },
        { name: "Bhawna", rel: "D/o", fname: "Hotchand", surname: "Meghwar", status: "Studying" },
        { name: "Chandni", rel: "D/o", fname: "Teerath", surname: "Khatri", status: "Studying" },
        { name: "Dilkash", rel: "D/o", fname: "Ramesh", surname: "Meghwar", status: "Studying" },
        { name: "Feroza", rel: "D/o", fname: "Mohammad-ul-Rahim", surname: "Parha", status: "Studying" },
        { name: "Ghansham Kumar", rel: "S/o", fname: "Mano", surname: "Meghwar", status: "Studying" },
        { name: "Gotam", rel: "S/o", fname: "Tharo Mal", surname: "Meghwar", status: "Studying" },
        { name: "Hansraj", rel: "S/o", fname: "Sooro", surname: "Bheel", status: "Studying" },
        { name: "HishmatRai", rel: "S/o", fname: "Rano Mal", surname: "Meghwar", status: "Studying" },
        { name: "Jaimala", rel: "D/o", fname: "Surto", surname: "Suther", status: "Studying" },
        { name: "Karshma", rel: "D/o", fname: "Jamon", surname: "Meghwar", status: "Studying" },
        { name: "Kashafnaz", rel: "D/o", fname: "Abdul Razaque", surname: "Nohari", status: "Studying" },
        { name: "Maria", rel: "D/o", fname: "Abdul Hafiz", surname: "Junejo", status: "Studying" },
        { name: "MarviJunejo", rel: "D/o", fname: "Sahib Dino", surname: "Junejo", status: "Studying" },
        { name: "Muhammad Yousif", rel: "S/o", fname: "Hyder", surname: "Lanjo", status: "Studying" },
        { name: "Murk", rel: "D/o", fname: "Ali Muhammad", surname: "Parha", status: "Studying" },
        { name: "Noman", rel: "S/o", fname: "Samiullah", surname: "Junejo", status: "Studying" },
        { name: "Parvati", rel: "D/o", fname: "Hotchand", surname: "Meghwar", status: "Studying" },
        { name: "Pooja", rel: "D/o", fname: "Ompirkash", surname: "Meghwar", status: "Studying" },
        { name: "Pooja", rel: "D/o", fname: "Ramesh", surname: "Meghwar", status: "Studying" },
        { name: "Reena", rel: "D/o", fname: "Essar Das", surname: "Meghwar", status: "Studying" },
        { name: "Sabanaz", rel: "D/o", fname: "Abdul Razaque", surname: "Nohari", status: "Studying" },
        { name: "Sapna", rel: "D/o", fname: "Karmoon Mal", surname: "Meghwar", status: "Studying" },
        { name: "Suresh Kumar", rel: "S/o", fname: "Mahendro", surname: "Meghwar", status: "Studying" },
        { name: "VineetaBai", rel: "D/o", fname: "Mevaram", surname: "Meghwar", status: "Studying" },
        { name: "Vivek Kumar", rel: "S/o", fname: "MotiLal", surname: "Meghwar", status: "Studying" },
        { name: "ZaharaBatool", rel: "D/o", fname: "Ali Muhammad", surname: "Bajeer", status: "Studying" },
        { name: "Abdul Ghaffar", rel: "S/o", fname: "Kamal", surname: "Bajeer", status: "----------" },
        { name: "Abdul Manan", rel: "S/o", fname: "Ghulam Rahim", surname: "Nohari", status: "----------" },
        { name: "Muhammad Yousif", rel: "S/o", fname: "Dodo", surname: "Sahar", status: "----------" },
        { name: "PoojaBai", rel: "D/o", fname: "JawaharLal", surname: "Meghwar", status: "----------" },
        { name: "Rajnesh Kumar", rel: "S/o", fname: "Suresh Kumar", surname: "Meghwar", status: "----------" },
        { name: "Razaullah", rel: "S/o", fname: "Sahib Dino", surname: "Junejo", status: "----------" },
        { name: "Sajida", rel: "D/o", fname: "w/o Manzoor Ali", surname: "Muslim Gujar", status: "----------" },
        { name: "Sanoon Bai", rel: "D/o", fname: "Sooran Singh", surname: "Rajput", status: "----------" },
        { name: "Sardar Singh", rel: "S/o", fname: "Alamchand", surname: "Bheel", status: "----------" },
        { name: "VarshaBai", rel: "D/o", fname: "QeematRai", surname: "Meghwar", status: "----------" },
        { name: "Zafarullah", rel: "S/o", fname: "Abdul Rauf", surname: "Meghwar", status: "----------" }
    ],
    "2023": [
        { name: "Akash", rel: "S/o", fname: "Leemon", surname: "Meghwar", status: "Studying" },
        { name: "Ambreen", rel: "D/o", fname: "Ghulam Muhammad", surname: "Junejo", status: "Studying" },
        { name: "Anjli Bai", rel: "D/o", fname: "Vasu", surname: "Malhi", status: "Studying" },
        { name: "Anoosha", rel: "D/o", fname: "Hishmat", surname: "Meghwar", status: "Studying" },
        { name: "Awais", rel: "S/o", fname: "Hishmat", surname: "Meghwar", status: "Studying" },
        { name: "Azeem", rel: "S/o", fname: "Muhammad Ramzan", surname: "Nohri", status: "Studying" },
        { name: "Bhawna Bai", rel: "D/o", fname: "Jhaman", surname: "Meghwar", status: "Studying" },
        { name: "Bibi Ambreen", rel: "D/o", fname: "Fida Hussain", surname: "Syed", status: "Studying" },
        { name: "Dileep Kumar", rel: "S/o", fname: "Panchoo", surname: "Meghwar", status: "Studying" },
        { name: "Hansa Kumari", rel: "D/o", fname: "Prem Kumar", surname: "Gujarati", status: "Studying" },
        { name: "Haresh", rel: "S/o", fname: "Khet Singh", surname: "Bheel", status: "Studying" },
        { name: "Hidayatullah", rel: "S/o", fname: "Muhammad Saifal", surname: "Charo", status: "Studying" },
        { name: "Iqra", rel: "D/o", fname: "Aijaz Ahmed", surname: "Ahmedi", status: "Studying" },
        { name: "Kashish", rel: "D/o", fname: "Sarjeet Kumar", surname: "Maharaj", status: "Studying" },
        { name: "Khalil ur Rehman", rel: "S/o", fname: "Muhammad Ramzan", surname: "Nohri", status: "Studying" },
        { name: "Lokesh Kumar", rel: "S/o", fname: "Bhooro Mal", surname: "Kolhi", status: "Studying" },
        { name: "Mukesh", rel: "S/o", fname: "Missri", surname: "Meghwar", status: "Studying" },
        { name: "Sagar Kumar", rel: "S/o", fname: "Pardeep Kumar", surname: "Darzi", status: "Studying" },
        { name: "Sandhya Bai", rel: "D/o", fname: "Prem Chand", surname: "Meghwar", status: "Studying" },
        { name: "Sanhiya", rel: "D/o", fname: "Ramesh Kumar", surname: "Malhi", status: "Studying" },
        { name: "Shamsha", rel: "D/o", fname: "Tota Ram", surname: "Meghwar", status: "Studying" },
        { name: "Shanker Lal", rel: "S/o", fname: "Amro", surname: "Meghwar", status: "Studying" },
        { name: "Subash Kumar", rel: "S/o", fname: "Hemoon", surname: "Meghwar", status: "Studying" },
        { name: "Tahira", rel: "D/o", fname: "Muhammad Yaqoob", surname: "Chandio", status: "Studying" },
        { name: "Veenta", rel: "D/o", fname: "Tharo", surname: "Meghwar", status: "Studying" },
        { name: "Vikram", rel: "S/o", fname: "Karnooji", surname: "Brahman", status: "Studying" },
        { name: "Walmik", rel: "S/o", fname: "Kheenraj", surname: "Bheel", status: "Studying" },
        { name: "Anam Bachani", rel: "D/o", fname: "Nisar Ahmed", surname: "Nohri", status: "" },
        { name: "Benta Bai", rel: "D/o", fname: "Jaimal Das", surname: "Meghwar", status: "" },
        { name: "Darshna", rel: "D/o", fname: "Devan", surname: "Meghwar", status: "" },
        { name: "Dolat Rai", rel: "S/o", fname: "Heera Lal", surname: "Meghwar", status: "Private Job" },
        { name: "Geeta", rel: "D/o", fname: "Bhamar Lal", surname: "Meghwar", status: "" },
        { name: "Gul Bahar", rel: "D/o", fname: "Muneer Ahmed", surname: "Nohri", status: "" },
        { name: "Kajal Kumari", rel: "D/o", fname: "Nand Lal", surname: "Luhana", status: "----------" },
        { name: "Madan Kumar", rel: "S/o", fname: "Achar Mal", surname: "Meghwar", status: "Private Teacher" },
        { name: "Manzoor Ali", rel: "S/o", fname: "Manthar", surname: "Otho", status: "Private Teacher" },
        { name: "Nadeem Akhter", rel: "S/o", fname: "Abdul Aziz", surname: "Sahar", status: "" },
        { name: "Parveen", rel: "D/o", fname: "Fazal-ul-Rehman", surname: "Bajeer", status: "---------" },
        { name: "Pirya", rel: "D/o", fname: "Mohan Lal", surname: "Suthar", status: "---------" },
        { name: "Pushpa", rel: "D/o", fname: "Loungo", surname: "Meghwar", status: "---------" },
        { name: "Ramla Noor", rel: "D/o", fname: "Raichand", surname: "Kolhi", status: "" },
        { name: "Raveena Bai", rel: "D/o", fname: "Jaimal", surname: "Meghwar", status: "---------" },
        { name: "Rozia –ul-Rehman", rel: "D/o", fname: "Atta-ul-Rehman", surname: "Bajeer", status: "" },
        { name: "Sapna", rel: "D/o", fname: "Jhando Mal", surname: "Meghwar", status: "---------" },
        { name: "Sulleman", rel: "S/o", fname: "Muhammad Ramzan", surname: "Chandio", status: "" },
        { name: "Suneeta", rel: "D/o", fname: "Devan", surname: "Meghwar", status: "---------" },
        { name: "Susheela Bai", rel: "D/o", fname: "Jaimal", surname: "Meghwar", status: "---------" }
    ],
    "2022": [
        { name: "Abdul Salam", rel: "S/o", fname: "Ghulam Rahim", surname: "Nohri", status: "Waiting" },
        { name: "Bhavita Bai", rel: "D/o", fname: "Debo", surname: "Meghwar", status: "Waiting" },
        { name: "Chander Kumar", rel: "S/o", fname: "Lal Chand", surname: "Maharaj", status: "Waiting" },
        { name: "Damni", rel: "D/o", fname: "Mukesh Kumar", surname: "Sonara", status: "Waiting" },
        { name: "Darshana Bai", rel: "D/o", fname: "BhorJi", surname: "Suthar", status: "Waiting" },
        { name: "Fareeda", rel: "D/o", fname: "Sawan", surname: "Bheel", status: "Waiting" },
        { name: "Harsha", rel: "D/o", fname: "Lajpat Rai", surname: "Maheshwari", status: "Waiting" },
        { name: "Hayat", rel: "S/o", fname: "Sajan", surname: "Meghwar", status: "Job in NADRA" },
        { name: "Jaimala", rel: "D/o", fname: "Jawher Lal", surname: "Maheshwari", status: "Waiting" },
        { name: "Janta Kumari", rel: "D/o", fname: "Chando Mal", surname: "Meghwar", status: "Waiting" },
        { name: "Jiya Kumari", rel: "D/o", fname: "Ghansham Das", surname: "Maheshwari", status: "Waiting" },
        { name: "Kanta", rel: "D/o", fname: "Bhagu", surname: "Meghwar", status: "Waiting" },
        { name: "Marvi", rel: "D/o", fname: "Taj Muhammad", surname: "Bajeer", status: "Waiting" },
        { name: "Mehtab", rel: "S/o", fname: "Jawaro", surname: "Meghwar", status: "Waiting" },
        { name: "Mehtab", rel: "S/o", fname: "Chetan", surname: "Meghwar", status: "Waiting" },
        { name: "Mehtab", rel: "S/o", fname: "Shanker", surname: "Guraro", status: "Waiting" },
        { name: "Muhammad Bachal", rel: "S/o", fname: "Abbas Ali", surname: "Soomro", status: "Private Teacher" },
        { name: "Mujeeb-ul-Rehman", rel: "S/o", fname: "Mehbob", surname: "Sameejo", status: "Waiting" },
        { name: "Naveeta Kumari", rel: "D/o", fname: "Nandlal", surname: "Malhi", status: "Waiting" },
        { name: "Nazeer Ahmed", rel: "S/o", fname: "Muhammad Tahir", surname: "Sameejo", status: "Waiting" },
        { name: "Nirmala", rel: "D/o", fname: "Karno Ji", surname: "Brahman", status: "Waiting" },
        { name: "Pardeep", rel: "S/o", fname: "Panju Mal", surname: "Meghwar", status: "----------" },
        { name: "Pardeep Kumar", rel: "S/o", fname: "Veenjhraj", surname: "Meghwar", status: "----------" },
        { name: "Piryanka", rel: "D/o", fname: "GulabRai", surname: "Meghwar", status: "Waiting" },
        { name: "Pooja Kumari", rel: "D/o", fname: "Ashok Kumar", surname: "Meghwar", status: "Waiting" },
        { name: "Reshman", rel: "D/o", fname: "Chetan", surname: "Meghwar", status: "----------" },
        { name: "Salochna", rel: "D/o", fname: "Jhaman Das", surname: "Malhi", status: "Waiting" },
        { name: "Saneela", rel: "D/o", fname: "Tejo", surname: "Meghwar", status: "-----------" },
        { name: "Shahid", rel: "S/o", fname: "Hamid", surname: "Janjhi", status: "Waiting" },
        { name: "Shanti", rel: "D/o", fname: "Kalo", surname: "Bheel", status: "Waiting" },
        { name: "Vijay Kumar", rel: "S/o", fname: "Kewal Ram", surname: "Harijan", status: "Waiting" },
        { name: "Bhawani Shanker", rel: "S/o", fname: "Bhuro Mal", surname: "Meghwar", status: "---------" }
    ],
    "2021": [
        { name: "Amrat", rel: "S/o", fname: "Sadawat", surname: "Meghwar", status: "Waiting" },
        { name: "Aroon", rel: "S/o", fname: "Chellaram", surname: "Suthar", status: "Waiting" },
        { name: "Asadullah", rel: "S/o", fname: "Amir Bux", surname: "Sahar", status: "Waiting" },
        { name: "Ganesh Das", rel: "S/o", fname: "Ramji", surname: "Bheel", status: "Waiting" },
        { name: "Lala Lajpat", rel: "S/o", fname: "Megho", surname: "Bheel", status: "Waiting" },
        { name: "Mahadev", rel: "S/o", fname: "Harish Chander", surname: "Meghwar", status: "Waiting" },
        { name: "Muhammad Ibrahim", rel: "S/o", fname: "Muhammad Aali", surname: "Samoon", status: "Waiting" },
        { name: "Muhammad Rafique", rel: "S/o", fname: "Muhammad Muharam", surname: "Samoon", status: "Waiting" },
        { name: "Neeraj Kumar", rel: "S/o", fname: "Tahal", surname: "Maharaj", status: "Waiting" },
        { name: "Prem", rel: "S/o", fname: "Punhoon", surname: "Meghwar", status: "Waiting" },
        { name: "Qeemat", rel: "S/o", fname: "Mehandro", surname: "Meghwar", status: "Waiting" },
        { name: "Sandesh Kumar", rel: "S/o", fname: "Harchand Rai", surname: "Suthar", status: "Waiting" },
        { name: "Santosh Kumar", rel: "S/o", fname: "Khushal", surname: "Meghwar", status: "Waiting" },
        { name: "Satram Das", rel: "S/o", fname: "Kewal Ram", surname: "Meghwar", status: "Waiting" },
        { name: "Satram Das", rel: "S/o", fname: "Premoon", surname: "Bheel", status: "Private Teacher" },
        { name: "Sooraj", rel: "S/o", fname: "Jhaman Das", surname: "Malhi", status: "Waiting" },
        { name: "Vikram", rel: "S/o", fname: "Jhaman Das", surname: "Meghwar", status: "Waiting" },
        { name: "Vikram Das", rel: "S/o", fname: "Bheru Lal", surname: "Meghwar", status: "Private Teacher" },
        { name: "Arzoo", rel: "D/o", fname: "Dolat Ram", surname: "Meghwar", status: "Waiting" },
        { name: "Dipeeka Kumari", rel: "D/o", fname: "Kirshan Lal", surname: "Maheshwari", status: "Waiting" },
        { name: "Geeta", rel: "D/o", fname: "Parshotam", surname: "Khatri", status: "Waiting" },
        { name: "Hemlata", rel: "D/o", fname: "Partab Rai", surname: "Meghwar", status: "Waiting" },
        { name: "Jannat", rel: "D/o", fname: "Muhammad Mubark", surname: "Junejo", status: "Waiting" },
        { name: "Janta", rel: "D/o", fname: "Santosh Kumar", surname: "Meghwar", status: "Waiting" },
        { name: "Kajal", rel: "D/o", fname: "Sanbhu Mal", surname: "Meghwar", status: "Waiting" },
        { name: "Karishma", rel: "D/o", fname: "Nand Lal", surname: "Lohana", status: "Waiting" },
        { name: "Leema", rel: "D/o", fname: "Vasdev", surname: "Malhi", status: "Waiting" },
        { name: "Ramila Bai", rel: "D/o", fname: "Sooro Mal", surname: "Bheel", status: "Waiting" },
        { name: "Samita", rel: "D/o", fname: "Khet Kumar", surname: "Meghwar", status: "Waiting" },
        { name: "Sanjna", rel: "D/o", fname: "Bheru Lal", surname: "Maheshwari", status: "Studies in KU" },
        { name: "Vandna", rel: "D/o", fname: "Kapil Dev", surname: "Brahman", status: "Waiting" },
        { name: "Vaneeta Kumari", rel: "D/o", fname: "Ramesh", surname: "Meghwar", status: "Waiting" },
        { name: "Vanita Kumari", rel: "D/o", fname: "Bhawani Shanker", surname: "Brahman", status: "Waiting" },
        { name: "Vineeta Kumari", rel: "D/o", fname: "Ramesh Kumar", surname: "Brahman", status: "Waiting" },
        { name: "Vishaka", rel: "D/o", fname: "Jaiparkash", surname: "Maheshwari", status: "Waiting" },
        { name: "Bheesham Kumar", rel: "S/o", fname: "Jamoon", surname: "Meghwar", status: "----------" },
        { name: "Kanwar", rel: "S/o", fname: "Motu Mal", surname: "Meghwar", status: "----------" },
        { name: "Umesha Kumari", rel: "D/o", fname: "Bhagwan Das", surname: "Maheshwari", status: "----------" },
        { name: "Vindna Kumari", rel: "D/o", fname: "Suneel Kumar", surname: "Brahman", status: "---------" }
    ],
    "2020": [
        { name: "Anmol", rel: "S/o", fname: "Vasdev", surname: "Maheshwari", status: "Private Teacher" },
        { name: "Asad Nawaz", rel: "S/o", fname: "Nawaz Ali", surname: "Bajeer", status: "Private Teacher" },
        { name: "Baber Ali", rel: "S/o", fname: "Sajan Khan", surname: "Bajeer", status: "Private Job" },
        { name: "Bhalu", rel: "S/o", fname: "Kachbo", surname: "Meghwar", status: "Private Job" },
        { name: "Bhart Kumar", rel: "S/o", fname: "Ramchand", surname: "Meghwar", status: "Private Job" },
        { name: "Darshna Bai", rel: "D/o", fname: "Sadhu", surname: "Meghwar", status: "Private Teacher" },
        { name: "Deepa", rel: "D/o", fname: "Pitamber", surname: "Guraro", status: "Private Teacher" },
        { name: "Gowskar", rel: "S/o", fname: "Ramesh Kumar", surname: "Maharaj", status: "Private Teacher" },
        { name: "Lekhraj", rel: "S/o", fname: "Panjoo", surname: "Meghwar", status: "Private Job" },
        { name: "Love", rel: "S/o", fname: "Sarwan", surname: "Meghwar", status: "Visiting Teacher" },
        { name: "Love Gir", rel: "S/o", fname: "Omparkash Gir", surname: "Goswami", status: "Private Job" },
        { name: "Muhammad Hayat", rel: "S/o", fname: "Allah Bux", surname: "Junejo", status: "Private Teacher" },
        { name: "Muhammad Ibrahim", rel: "S/o", fname: "Muhammad Yaqoob", surname: "Sahar", status: "PST (IBA)" },
        { name: "Nadeem Ali", rel: "S/o", fname: "Ghulam Rasool", surname: "Nohri", status: "Private Teacher" },
        { name: "Nimarta", rel: "D/o", fname: "Hitesh", surname: "Brahman", status: "Private Teacher" },
        { name: "Omparkash", rel: "S/o", fname: "Kheta Ram", surname: "Meghwar", status: "Private Job" },
        { name: "Reva Chand", rel: "S/o", fname: "Jalo", surname: "Suthar", status: "Private Teacher" },
        { name: "Roshni", rel: "D/o", fname: "Sadhu", surname: "Meghwar", status: "Private Teacher" },
        { name: "Saeeda", rel: "D/o", fname: "Allah Bux", surname: "Junejo", status: "Private Teacher" },
        { name: "Sajan", rel: "S/o", fname: "Bhamar Lal", surname: "Meghwar", status: "Private Teacher" },
        { name: "Akash", rel: "S/o", fname: "Bhomoon", surname: "Meghwar", status: "---------" },
        { name: "Amolakh", rel: "S/o", fname: "Bhaloo", surname: "Harijan", status: "---------" },
        { name: "Barkha", rel: "D/o", fname: "Girdhari", surname: "Malhi", status: "---------" },
        { name: "Bhagwanti", rel: "D/o", fname: "Kamlesh", surname: "Lohana", status: "---------" },
        { name: "Bilal", rel: "S/o", fname: "Umed Ali", surname: "Nohri", status: "---------" },
        { name: "Chandni", rel: "D/o", fname: "Chooni Lal", surname: "Malhi", status: "---------" },
        { name: "Dua", rel: "D/o", fname: "Muhammad Ilyas", surname: "Samoon", status: "---------" },
        { name: "Gotam", rel: "S/o", fname: "Chando", surname: "Kolhi", status: "---------" },
        { name: "Guriya", rel: "D/o", fname: "Prem", surname: "Lodha", status: "---------" },
        { name: "Haji Muhammad", rel: "S/o", fname: "Nasrullah", surname: "Samejo", status: "---------" },
        { name: "Jasta Kumari", rel: "D/o", fname: "Ashok Kumar", surname: "Harijan", status: "---------" },
        { name: "Kausar Javaid", rel: "D/o", fname: "Javaid Akhtar", surname: "Bajeer", status: "---------" },
        { name: "Kirshan Lal", rel: "S/o", fname: "Peru Mal", surname: "Meghwar", status: "---------" },
        { name: "Nand Lal", rel: "S/o", fname: "Togo Mal", surname: "Meghwar", status: "---------" },
        { name: "Noor Jahan", rel: "D/o", fname: "Ali Imran", surname: "Samoon", status: "---------" },
        { name: "Omparkash", rel: "S/o", fname: "Nand Lal", surname: "Suthar", status: "---------" },
        { name: "Pushpa", rel: "D/o", fname: "Mohan Lal", surname: "Bheel", status: "---------" },
        { name: "Rabel", rel: "D/o", fname: "Hishmat", surname: "Meghwar", status: "---------" },
        { name: "Ramesh Kumar", rel: "S/o", fname: "Ghaman", surname: "Bheel", status: "---------" },
        { name: "Santosh", rel: "S/o", fname: "Kalo", surname: "Bheel", status: "" },
        { name: "Sapna", rel: "D/o", fname: "Lajpat Rai", surname: "Suthar", status: "---------" },
        { name: "Umanullah", rel: "S/o", fname: "Muhammad Ramzan", surname: "Rajar", status: "---------" },
        { name: "Zahida", rel: "D/o", fname: "Haroon", surname: "Kunbher", status: "---------" }
    ],
    "2019": [
        { name: "Basheer Ahmed", rel: "S/o", fname: "Sobdar", surname: "Bajeer", status: "Job in Police" },
        { name: "Bhagwanti", rel: "D/o", fname: "Somoo Mal", surname: "Bheel", status: "PST (IBA)" },
        { name: "Chellaram", rel: "S/o", fname: "Takho", surname: "Kolhi", status: "PST(IBA)" },
        { name: "Darshan Kumar", rel: "S/o", fname: "Jairam Das", surname: "Darzi", status: "PST (IBA)" },
        { name: "Darshana Bai", rel: "D/o", fname: "Anbo", surname: "Suthar", status: "Private Teacher" },
        { name: "Devi Kumari", rel: "D/o", fname: "Suro Mal", surname: "Bheel", status: "Private Teacher" },
        { name: "Dileep Kumar", rel: "S/o", fname: "Vasdev", surname: "Malhi", status: "Private Job" },
        { name: "Din Muhammad", rel: "S/o", fname: "Niaz Ahmed", surname: "Dars", status: "Private Job" },
        { name: "Gul Naz", rel: "D/o", fname: "Abdul Razaque", surname: "Nohri", status: "PST (IBA)" },
        { name: "Imam Bux", rel: "S/o", fname: "Dodo", surname: "Samejo", status: "PST (IBA)" },
        { name: "Karooji", rel: "S/o", fname: "Guman Singh", surname: "Rajput", status: "Private Teacher" },
        { name: "Khalilullah", rel: "S/o", fname: "Muhammad Malook Khan", surname: "Nohri", status: "Job in Revenue" },
        { name: "Kishore Kumar", rel: "S/o", fname: "Raimal", surname: "Meghwar", status: "Private Teacher" },
        { name: "Nagji", rel: "S/o", fname: "Pancho", surname: "Bheel", status: "Private Teacher" },
        { name: "Nirmal Sharma", rel: "S/o", fname: "Dhanesh Kumar", surname: "Brahman", status: "Private Job" },
        { name: "Pawan Kumar", rel: "S/o", fname: "Kewal Ram", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Pirthvi Raj", rel: "S/o", fname: "Jaidev", surname: "Brahman", status: "Private Teacher" },
        { name: "Puja Bai", rel: "D/o", fname: "Anbo", surname: "Suthar", status: "Private Teacher" },
        { name: "Sandeep Kumar", rel: "S/o", fname: "Partab", surname: "Suthar", status: "Private Teacher" },
        { name: "Shahida", rel: "D/o", fname: "Allah Bux", surname: "Junejo", status: "PST (IBA)" },
        { name: "Shanker Lal", rel: "S/o", fname: "Khaku Mal", surname: "Meghwar", status: "Private Teacher" },
        { name: "Yasmeen", rel: "D/o", fname: "Saifullah", surname: "Nohri", status: "JEST (IBA)" },
        { name: "Abdul Rehman", rel: "S/o", fname: "Ghulam Muhammad", surname: "Halepoto", status: "---------" },
        { name: "Aisha Devi", rel: "D/o", fname: "Harchand Rai", surname: "Suthar", status: "---------" },
        { name: "Aneela Bai", rel: "D/o", fname: "Mohan Lal", surname: "Bheel", status: "---------" },
        { name: "Devi Bai", rel: "D/o", fname: "Sodho Mal", surname: "Bheel", status: "---------" },
        { name: "Faheem", rel: "S/o", fname: "Wali Muhammad", surname: "Sahar", status: "---------" },
        { name: "Kalpana Kumari", rel: "D/o", fname: "Ganesh Das", surname: "Suthar", status: "---------" },
        { name: "Karshama Kumari", rel: "D/o", fname: "Shanker Lal", surname: "Malhi", status: "---------" },
        { name: "Kaweeta Kumari", rel: "D/o", fname: "Devdas", surname: "Suthar", status: "---------" },
        { name: "Khatija", rel: "D/o", fname: "Ghulam Hussain", surname: "Charo", status: "---------" },
        { name: "Monika", rel: "D/o", fname: "Veso Mal", surname: "Suthar", status: "---------" },
        { name: "Moran Bai", rel: "D/o", fname: "Sodho Mal", surname: "Bheel", status: "---------" },
        { name: "Nirmla Devi", rel: "D/o", fname: "Mohan Lal", surname: "Bheel", status: "---------" },
        { name: "Partab Rai", rel: "S/o", fname: "Laloo Mal", surname: "Meghwar", status: "---------" },
        { name: "Patooji", rel: "S/o", fname: "Sobhraj", surname: "Meghwar", status: "---------" },
        { name: "Pirpula", rel: "D/o", fname: "Vishan Das", surname: "Meghwar", status: "---------" },
        { name: "Pushpa", rel: "D/o", fname: "Arjan", surname: "Suthar", status: "---------" },
        { name: "Raj Kumar", rel: "S/o", fname: "Malook", surname: "Bheel", status: "---------" },
        { name: "Sadhna Kumari Kella", rel: "D/o", fname: "Kirshan Kumar Kella", surname: "Maheshwari", status: "---------" },
        { name: "Shahzia", rel: "D/o", fname: "Obhayo", surname: "Junejo", status: "---------" },
        { name: "Sundri", rel: "D/o", fname: "Malji", surname: "Meghwar", status: "---------" },
        { name: "Taj Muhammad", rel: "S/o", fname: "Abdul Ghani", surname: "Samoon", status: "---------" },
        { name: "Tara Bai", rel: "D/o", fname: "Gumano", surname: "Bheel", status: "---------" }
    ],
    "2018": [
        { name: "Ahmed", rel: "S/o", fname: "Muhammad Sadique", surname: "Nohri", status: "SST (SPSC)" },
        { name: "Aroon Kumar", rel: "S/o", fname: "Mevaram", surname: "Meghwar", status: "Private Teacher" },
        { name: "Ashok", rel: "S/o", fname: "Dhano", surname: "Bheel", status: "JEST (IBA)" },
        { name: "Bakhtawar", rel: "D/o", fname: "Allah Bachayo", surname: "Kunbhar", status: "PST (IBA)" },
        { name: "Bharti", rel: "D/o", fname: "Rajesh Kumar", surname: "Maheshwari", status: "JEST (IBA)" },
        { name: "Chander Kumar", rel: "S/o", fname: "Natho", surname: "Bheel", status: "PST (IBA)" },
        { name: "Dasrat Kumar", rel: "S/o", fname: "Ravito", surname: "Jaipal", status: "EST (TL)" },
        { name: "Dharmendar", rel: "S/o", fname: "Jairam Das", surname: "Darzi", status: "PST (IBA)" },
        { name: "Geeta Bai", rel: "D/o", fname: "Preetam Das", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Haresh Kumar", rel: "S/o", fname: "Lajpat Rai", surname: "Suthar", status: "JEST (IBA)" },
        { name: "Jagdesh Kumar", rel: "S/o", fname: "Bhago", surname: "Meghwar", status: "Private Teacher" },
        { name: "Kajal", rel: "D/o", fname: "Kamlesh", surname: "Malhi", status: "Private Teacher" },
        { name: "Kamlesh Kumar", rel: "S/o", fname: "Govind Ram", surname: "Guraro", status: "PST (IBA)" },
        { name: "Keenjhar", rel: "D/o", fname: "Innayatullah", surname: "Bajeer", status: "Private Teacher" },
        { name: "Miandad", rel: "S/o", fname: "Rano Khan", surname: "Bajeer", status: "Private Teacher" },
        { name: "Payal Kumari", rel: "D/o", fname: "Kamlesh", surname: "Maheshwari", status: "Private Bank Job" },
        { name: "Pushpa", rel: "D/o", fname: "Prem", surname: "Meghwar", status: "Private Teacher" },
        { name: "Rakesh Kumar", rel: "S/o", fname: "Ramesh Kumar", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Rawal", rel: "S/o", fname: "Nek Muhammad", surname: "Junejo", status: "Private Teacher" },
        { name: "Ravi Shanker", rel: "S/o", fname: "Pamo", surname: "Harijan", status: "Private Teacher" },
        { name: "Sabheeta", rel: "D/o", fname: "Bhalji Ram", surname: "Sajnani", status: "Private Teacher" },
        { name: "Sakina", rel: "D/o", fname: "Allah Bachayo", surname: "Kunbhar", status: "PST (IBA)" },
        { name: "Shahzad Ali Shah", rel: "S/o", fname: "Muhammad Hashim", surname: "Syed", status: "PST (IBA)" },
        { name: "Sunderta", rel: "D/o", fname: "Bhalji Ram", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Yasmeen", rel: "D/o", fname: "Mumtaz Ali", surname: "Jessar", status: "Foreign Studies" },
        { name: "Anand Kumar", rel: "S/o", fname: "Kheto Ji", surname: "Suthar", status: "---------" },
        { name: "Asif Ali", rel: "S/o", fname: "Saleh Muhammad", surname: "Bajeer", status: "---------" },
        { name: "Asma", rel: "D/o", fname: "Muhammad Ilyas", surname: "Samoon", status: "---------" },
        { name: "Bhawita Kumari", rel: "D/o", fname: "Tikam", surname: "Suthar", status: "---------" },
        { name: "Bilal Hussain", rel: "S/o", fname: "Wali Muhammad", surname: "Mangrio", status: "---------" },
        { name: "Dhelan", rel: "S/o", fname: "Ranji", surname: "Meghwar", status: "---------" },
        { name: "Ghulam Hyder", rel: "S/o", fname: "Hamad Allah", surname: "Samoon", status: "---------" },
        { name: "Jeewat", rel: "S/o", fname: "Leemoon", surname: "Meghwar", status: "---------" },
        { name: "Jhaman", rel: "S/o", fname: "Pirago", surname: "Meghwar", status: "---------" },
        { name: "Komal", rel: "D/o", fname: "Heman Das", surname: "Lohana", status: "---------" },
        { name: "Marvi", rel: "D/o", fname: "Subash", surname: "Kotak", status: "---------" },
        { name: "Muskan Deep", rel: "D/o", fname: "Kishore Kumar", surname: "Maheshwari", status: "---------" },
        { name: "Nazeeran", rel: "D/o", fname: "Ali Muhammad", surname: "Junejo", status: "---------" },
        { name: "Neelam", rel: "D/o", fname: "Halo Mal", surname: "Meghwar", status: "---------" },
        { name: "Pirya Kumari", rel: "D/o", fname: "Rameshwar", surname: "Suthar", status: "---------" }
    ],
    "2017": [
        { name: "Aneel Kumar", rel: "S/o", fname: "Mohan Lal", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Bhagchand", rel: "S/o", fname: "Leemoon Mal", surname: "Meghwar", status: "Private Job" },
        { name: "Chander Kumar", rel: "S/o", fname: "Kewal Ram", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Danish Kumar", rel: "S/o", fname: "Moolchand", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Darshana Kumari", rel: "D/o", fname: "Preetam Das", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Deewan Das", rel: "S/o", fname: "Tharo Mal", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Devi", rel: "D/o", fname: "Hemraj", surname: "Khatri", status: "JEST (IBA)" },
        { name: "Dileep Kumar", rel: "S/o", fname: "Arjan", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Geeta Bai", rel: "D/o", fname: "Preetam Das", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Haque Nawaz", rel: "S/o", fname: "Rabdino", surname: "Jhanji", status: "Private Teacher" },
        { name: "Kanwar Lal", rel: "S/o", fname: "Somji Mal", surname: "Meghwar", status: "Private Teacher" },
        { name: "Kishore", rel: "S/o", fname: "Hameer Chand", surname: "Malani", status: "EST (TL)" },
        { name: "Komal Bai", rel: "D/o", fname: "Bheru Lal", surname: "Suthar", status: "EST (TL)" },
        { name: "Manoj Kumar", rel: "S/o", fname: "Kheemchand", surname: "Darzi", status: "Private Job" },
        { name: "Mehtab Dharmani", rel: "D/o", fname: "Issar Das", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Muhammad Rizwan", rel: "S/o", fname: "Payaro", surname: "Sand", status: "PST (IBA)" },
        { name: "Pardeep Kumar", rel: "S/o", fname: "Khaju Mal", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Preetam Das", rel: "S/o", fname: "Togo", surname: "Meghwar", status: "Private Teacher" },
        { name: "Rukesh", rel: "S/o", fname: "Kahoo Mal", surname: "Meghwar", status: "Private Teacher" },
        { name: "Sadaf ul Zehra", rel: "D/o", fname: "Ramzan", surname: "Muslim Bajeer", status: "JEST (IBA)" },
        { name: "Shaoor", rel: "S/o", fname: "Bilawal", surname: "Nohri", status: "JEST (IBA)" },
        { name: "Allah Dino", rel: "S/o", fname: "Muhammad Muslim", surname: "Muslim Charo", status: "JEST (IBA)" },
        { name: "Amrat (Late)", rel: "D/o", fname: "Nazir Ahmed", surname: "Jumani", status: "Private Teacher" },
        { name: "Anand", rel: "S/o", fname: "Adu Mal", surname: "Harijan", status: "PST (IBA)" },
        { name: "Asma", rel: "D/o", fname: "Sahib Dino", surname: "Junejo", status: "JEST (IBA)" },
        { name: "Darshana Kumari", rel: "D/o", fname: "Harish Kumar", surname: "Brahman", status: "PST (IBA)" },
        { name: "Gordhan", rel: "S/o", fname: "Sarwan", surname: "Bheel", status: "JEST (IBA)" },
        { name: "Jalpana Kumari", rel: "D/o", fname: "Hareesh Kumar", surname: "Maheshwari", status: "ECT (IBA)" },
        { name: "Madan Lal", rel: "S/o", fname: "Sajan Das", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Mala Kumari", rel: "D/o", fname: "Moti Lal", surname: "Joshi", status: "PST (IBA)" },
        { name: "Monika", rel: "D/o", fname: "Nand Lal", surname: "Khatri", status: "Private Teacher" },
        { name: "Muhammad Saleem", rel: "S/o", fname: "Wali Muhammad", surname: "Sahar", status: "JEST (IBA)" },
        { name: "Najma", rel: "D/o", fname: "Sahib Dino", surname: "Junejo", status: "JEST (IBA)" },
        { name: "Nazeeran", rel: "D/o", fname: "Muhammad Sajan", surname: "Charo", status: "JEST (IBA)" },
        { name: "Pandhi", rel: "S/o", fname: "Muhammad Mubark", surname: "Junejo", status: "JEST (IBA)" },
        { name: "Shahnaz Baby", rel: "D/o", fname: "Moula Bux", surname: "Junejo", status: "JEST (IBA)" },
        { name: "Vinesh Kumar", rel: "S/o", fname: "Biraj Lal", surname: "Maharaj", status: "JEST (IBA)" },
        { name: "Abdul Razaque", rel: "S/o", fname: "Ali Muhammad", surname: "Nohri", status: "---------" },
        { name: "Danish Kumar", rel: "S/o", fname: "Haroo Mal", surname: "Meghwar", status: "---------" },
        { name: "Girdhari", rel: "S/o", fname: "Bhamro", surname: "Meghwar", status: "---------" },
        { name: "Love Kumar", rel: "S/o", fname: "Hero", surname: "Meghwar", status: "---------" },
        { name: "Mahwish Gul", rel: "D/o", fname: "Shahid Ali", surname: "Bughia", status: "---------" },
        { name: "Mukesh", rel: "S/o", fname: "Pato Mal", surname: "Meghwar", status: "---------" },
        { name: "Nazish Niaz", rel: "D/o", fname: "Niaz Hussain", surname: "Jarwar", status: "---------" },
        { name: "Pooja Kumari", rel: "D/o", fname: "Pirbhu Lal", surname: "Malhi", status: "---------" },
        { name: "Tanweer", rel: "S/o", fname: "Muhammad Ramzan", surname: "Bajeer", status: "---------" },
        { name: "Teerath Kumar", rel: "S/o", fname: "Chaman Lal", surname: "Meghwar", status: "---------" },
        { name: "Tofique Ahmed", rel: "S/o", fname: "Inayatullah", surname: "Nohri", status: "---------" }
    ],
    "2016": [
        { name: "Aboubakar", rel: "S/o", fname: "Habibullah", surname: "Samejo", status: "JEST (IBA)" },
        { name: "Aneel Kumar", rel: "S/o", fname: "Harchand", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Aneel Kumar", rel: "S/o", fname: "Somoon Mal", surname: "Hindu Bheel", status: "PST (IBA)" },
        { name: "Bhagwanti", rel: "D/o", fname: "Somoon Mal", surname: "Bheel", status: "PST (IBA)" },
        { name: "Bhawna", rel: "D/o", fname: "Vishan Das", surname: "Lohana", status: "JEST (IBA)" },
        { name: "Bhem Chand", rel: "S/o", fname: "Dhano", surname: "Kolhi", status: "Private Teacher" },
        { name: "Hamid Ali", rel: "S/o", fname: "Muhammad Muslim", surname: "Muslim Bajeer", status: "PST (IBA)" },
        { name: "Jai Parda", rel: "S/o", fname: "Jai Dev", surname: "Maheshwari", status: "Private Teacher" },
        { name: "Kanchan", rel: "D/o", fname: "Heman", surname: "Maheshwari", status: "Private Teacher" },
        { name: "Karim Bux", rel: "S/o", fname: "Gul Sher", surname: "Junejo", status: "JEST (IBA)" },
        { name: "Keenjhar", rel: "D/o", fname: "Innayatullah", surname: "Muslim Bajeer", status: "Private Teacher" },
        { name: "Kirshan", rel: "S/o", fname: "Kaloo", surname: "Bheel", status: "Govt:Job in NADRA" },
        { name: "Lalan", rel: "S/o", fname: "Muhammad Usman", surname: "Junejo", status: "PST (IBA)" },
        { name: "Marfat", rel: "S/o", fname: "Muhammad Anwer", surname: "Junejo", status: "PST (IBA)" },
        { name: "Marvi", rel: "D/o", fname: "Kaloo", surname: "Bheel", status: "PST (IBA)" },
        { name: "Meena Kumari", rel: "D/o", fname: "Gunesh Das", surname: "Suthar", status: "Private Teacher" },
        { name: "Muhammad Missri", rel: "S/o", fname: "Allah Dino", surname: "Muslim Bajeer", status: "JEST (IBA)" },
        { name: "Mukesh", rel: "S/o", fname: "Jairam", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Mumtaz Ali", rel: "S/o", fname: "Muhammad Manthar", surname: "Bajeer", status: "PST (IBA)" },
        { name: "Munwar Ali", rel: "S/o", fname: "Qurban Ali", surname: "Soomro", status: "PST (IBA)" },
        { name: "Parpula Kumari", rel: "D/o", fname: "Tara Chand", surname: "Maheshwari", status: "PST (IBA)" },
        { name: "Pooja Bai", rel: "D/o", fname: "Dasrat Gir", surname: "Goswami", status: "PST (IBA)" },
        { name: "Poonam Kumari", rel: "D/o", fname: "Subash", surname: "Lohana", status: "JEST (IBA)" },
        { name: "Sadam Hussain", rel: "S/o", fname: "Akber Ali", surname: "Dars", status: "PST (IBA)" },
        { name: "Saeed Ahmed Shah", rel: "S/o", fname: "Sadique Ali Shah", surname: "Syed", status: "JEST (IBA)" },
        { name: "Safia", rel: "D/o", fname: "Shadi", surname: "Dars", status: "Private Teacher" },
        { name: "Saifullah", rel: "S/o", fname: "Sikandar Ali", surname: "Samejo", status: "JEST (IBA)" },
        { name: "Sateesh Kumar", rel: "S/o", fname: "Jairam Dars", surname: "Maheshwari", status: "PST (IBA)" },
        { name: "Savita Bai", rel: "D/o", fname: "Somoon Mal", surname: "Bheel", status: "PST (IBA)" },
        { name: "Shahid Habib", rel: "S/o", fname: "Habibullah", surname: "Muslim Bajeer", status: "PST (IBA)" },
        { name: "Taravanti", rel: "D/o", fname: "Somoon Mal", surname: "Bheel", status: "JEST (IBA)" },
        { name: "Urmila", rel: "D/o", fname: "Kaloo", surname: "Bheel", status: "PST (IBA)" },
        { name: "Vandna Kumari", rel: "D/o", fname: "Naresh Kumar", surname: "Brahman", status: "JEST (IBA)" },
        { name: "Veena Kumari", rel: "D/o", fname: "Bheru Lal", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Vikram", rel: "S/o", fname: "Veenjhraj", surname: "Meghwar", status: "Private Job" },
        { name: "Azra", rel: "D/o", fname: "Anwer Adil", surname: "Junejo", status: "---------" },
        { name: "Fazilat", rel: "D/o", fname: "Muhammad Mattaro", surname: "Junejo", status: "---------" },
        { name: "Jasoda", rel: "D/o", fname: "Verso", surname: "Bheel", status: "---------" },
        { name: "Kaleemullah", rel: "S/o", fname: "Piyaro", surname: "Sand", status: "---------" },
        { name: "Madhu Kumari", rel: "D/o", fname: "Hargoon", surname: "Lohana", status: "---------" },
        { name: "Miandad", rel: "S/o", fname: "Qazi Khan", surname: "Samejo", status: "---------" },
        { name: "Neeta Kumari", rel: "D/o", fname: "Nand Lal", surname: "Maheshwari", status: "---------" },
        { name: "Pardeep Kumar", rel: "S/o", fname: "Yudister", surname: "Maheshwari", status: "---------" },
        { name: "Shaista Parveen", rel: "D/o", fname: "Muhammad Juman", surname: "Bajeer", status: "---------" }
    ],
    "2015": [
         { name: "Abdul Manan", rel: "S/o", fname: "Muhammad Ali", surname: "Junejo", status: "Private Teacher" },
         { name: "Abdul Qadir", rel: "S/o", fname: "Habibullah", surname: "Kunbhar", status: "JEST (IBA)" },
         { name: "Allah Dino", rel: "S/o", fname: "Muhammad Muslim", surname: "Muslim Charo", status: "JEST (IBA)" },
         { name: "Anand", rel: "S/o", fname: "Adu Mal", surname: "Harijan", status: "JEST (IBA)" },
         { name: "Asma", rel: "D/o", fname: "Sahib Dino", surname: "Junejo", status: "JEST (IBA)" },
         { name: "Darshan Kumar", rel: "S/o", fname: "Jairam Das", surname: "Darzi", status: "PST (IBA)" },
         { name: "Geeta Kumari", rel: "D/o", fname: "Greesh Kumar", surname: "Maheshwari", status: "Private Teacher" },
         { name: "Gordhan", rel: "S/o", fname: "Sarwan", surname: "Bheel", status: "JEST (IBA)" },
         { name: "Hoat Chand", rel: "S/o", fname: "Bhero", surname: "Guraro", status: "JEST (IBA)" },
         { name: "Mir Muhammad", rel: "S/o", fname: "Muhammad Mushtaque", surname: "Junejo", status: "JEST (IBA)" },
         { name: "Muhammad Aslam", rel: "S/o", fname: "Abdul Latif", surname: "Muslim Charo", status: "Business man" },
         { name: "Muhammad Saleem", rel: "S/o", fname: "Wali Muhammad", surname: "Sahar", status: "JEST (IBA)" },
         { name: "Muhammad Sharif", rel: "S/o", fname: "Muhammad Ashraf", surname: "Samejo", status: "JEST (IBA)" },
         { name: "Muhammad Shuaib", rel: "S/o", fname: "Kaloo", surname: "Junejo", status: "JEST (IBA)" },
         { name: "Munwar Ali", rel: "S/o", fname: "Muhammad Mubarak", surname: "Halepoto", status: "PST (IBA)" },
         { name: "Najma", rel: "D/o", fname: "Sahib Dino", surname: "Junejo", status: "JEST (IBA)" },
         { name: "Nazeeran", rel: "D/o", fname: "Muhammad Sajan", surname: "Charo", status: "JEST (IBA)" },
         { name: "Piranka Pooja", rel: "D/o", fname: "Ashok Kumar", surname: "Maheshwari", status: "Private Teacher" },
         { name: "Parsram", rel: "S/o", fname: "Kheem Chand", surname: "Meghwar", status: "Private Teacher" },
         { name: "Ramila", rel: "D/o", fname: "Sardar Singh", surname: "Bheel", status: "JEST (IBA)" },
         { name: "Rozia", rel: "D/o", fname: "Ghulam Hussain", surname: "Charo", status: "JEST (IBA)" },
         { name: "Shahnaz Baby", rel: "D/o", fname: "Mola Bux", surname: "Junejo", status: "JEST (IBA)" },
         { name: "Suman", rel: "D/o", fname: "Dileep Kumar", surname: "Kothari", status: "Private Teacher" },
         { name: "Durpati", rel: "D/o", fname: "Deyo Mal", surname: "Malhi", status: "---------" },
         { name: "Sanjha", rel: "D/o", fname: "Ishwar Lal", surname: "Sharma", status: "---------" },
         { name: "Sapna Devi", rel: "D/o", fname: "Harchand Rai", surname: "Suthar", status: "---------" }
    ],
    "2014": [
        { name: "Aneeta", rel: "D/o", fname: "Damoon Mal", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Aneeta Kumari", rel: "D/o", fname: "Suresh Kumar", surname: "Maheshwari", status: "Private Teacher" },
        { name: "Ashok Kumar", rel: "S/o", fname: "Gajo Mal", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Chander Kumar", rel: "S/o", fname: "Saroop Chand", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Darshan Kumar", rel: "S/o", fname: "Pirbhu", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Gul Sanoober", rel: "D/o", fname: "Muhammad Hashim", surname: "Hingorjo", status: "JEST (IBA)" },
        { name: "Innam ur Rehman", rel: "S/o", fname: "Ghulam Akber", surname: "Nohari", status: "Private Job" },
        { name: "Jalpana Kumari", rel: "D/o", fname: "Hareesh Kumar", surname: "Maheshwari", status: "ECT (IBA)" },
        { name: "Kumari Jaimala", rel: "D/o", fname: "Girdhari", surname: "Dharmani", status: "JEST (IBA)" },
        { name: "Madan Lal", rel: "S/o", fname: "Sajan Das", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Mala", rel: "D/o", fname: "Bheesham Kumar", surname: "Maheshwari", status: "JEST (IBA)" },
        { name: "Mithan Kumar", rel: "S/o", fname: "Moti", surname: "Darzi", status: "Private Job" },
        { name: "Pandhi", rel: "S/o", fname: "Muhammad Mubarak", surname: "Junejo", status: "JEST (IBA)" },
        { name: "Parpula Bai", rel: "D/o", fname: "Jaidev", surname: "Maheshwari", status: "Private Teacher" },
        { name: "Sangita Kumari", rel: "D/o", fname: "Santosh Kumar", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Sattar", rel: "S/o", fname: "Bachayo", surname: "Manghabiar", status: "PST (IBA)" },
        { name: "Savita", rel: "D/o", fname: "Mahadev", surname: "Suthar", status: "---------" },
        { name: "Shanti Kumari", rel: "D/o", fname: "Madan Lal", surname: "Brahman", status: "JEST (IBA)" },
        { name: "Vinesh Kumar", rel: "S/o", fname: "Birj Lal", surname: "Maharaj", status: "JEST (IBA)" },
        { name: "Himat Kumar", rel: "S/o", fname: "Kelash", surname: "Maheshwari", status: "---------" },
        { name: "Savita", rel: "D/o", fname: "Mahadev", surname: "Suthar", status: "---------" }
    ],
    "2013": [
        { name: "Akash", rel: "S/o", fname: "Sanbhu Mal", surname: "Meghwar", status: "JEST" },
        { name: "Aroona Kumari", rel: "D/o", fname: "Kelash Kumar", surname: "Mahehswari", status: "JEST (IBA)" },
        { name: "Attaullah", rel: "S/o", fname: "Abdul Wahid", surname: "Junejo", status: "JEST (IBA)" },
        { name: "Darshna Kumari", rel: "D/o", fname: "Harish Kumar", surname: "Brahman", status: "PST (IBA)" },
        { name: "Jaimala", rel: "D/o", fname: "Heman", surname: "Maheshwari", status: "Private Teacher" },
        { name: "Monika", rel: "D/o", fname: "Nand Lal", surname: "Khatri", status: "Private Teacher" },
        { name: "Narsingh", rel: "S/o", fname: "Ranjho", surname: "Bheel", status: "PST (NTS)" },
        { name: "Parvaiz Ali", rel: "S/o", fname: "Imam-ul-Din", surname: "Dars", status: "Private Teacher" },
        { name: "Qeemat Rai", rel: "S/o", fname: "Sahoo Mal", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Reena Kumari", rel: "D/o", fname: "Vesso Mal", surname: "Suthar", status: "JEST (IBA)" },
        { name: "Sandesh", rel: "S/o", fname: "Hishmat Rai", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Santosh Kumar", rel: "S/o", fname: "Nangram", surname: "Meghwar", status: "PST (IBA)" },
        { name: "Sarfarz Ali", rel: "S/o", fname: "Muhammad Hashim", surname: "Hingorjo", status: "ASI (SPSC)" },
        { name: "Savita", rel: "D/o", fname: "Suro Mal", surname: "Bheel", status: "PST(IBA)" },
        { name: "Shamshad Bano", rel: "D/o", fname: "Muhammad Mubarak", surname: "Junejo", status: "PST(NTS)" },
        { name: "Teena Kumari", rel: "D/o", fname: "Rajesh Kumar", surname: "Maheshwari", status: "Private Teacher" },
        { name: "Arif Hussain Shah", rel: "S/o", fname: "Madad Ali Shah", surname: "Syed", status: "---------" },
        { name: "Bharti Devi", rel: "D/o", fname: "Vikram", surname: "Mahehswari", status: "---------" },
        { name: "Ghulam Mustafa Shah", rel: "S/o", fname: "Iqbal Shah", surname: "Syed", status: "---------" },
        { name: "Joshna Kumari", rel: "D/o", fname: "Vikram Kumar", surname: "Maheshwari", status: "---------" },
        { name: "Komal Kumari", rel: "D/o", fname: "Parkash", surname: "Maheshwari", status: "---------" },
        { name: "Neesha Kumari", rel: "D/o", fname: "Nand Lal", surname: "Maheshwari", status: "---------" },
        { name: "Pirkash", rel: "S/o", fname: "Tilok Chand", surname: "Suthar", status: "---------" },
        { name: "Sakina", rel: "D/o", fname: "Ramzan", surname: "Bajeer", status: "---------" },
        { name: "Sapna Kumari", rel: "D/o", fname: "Subash Chander", surname: "Maheshwari", status: "---------" },
        { name: "Shobha", rel: "D/o", fname: "Dr.Ram Rattan", surname: "Vaswani", status: "---------" }
    ],
    "2012": [
        { name: "Ahsas", rel: "S/o", fname: "Bilawal", surname: "Nohari", status: "JEST (IBA)" },
        { name: "Amrat", rel: "S/o", fname: "Nazir Ahmed", surname: "Jumani", status: "Private Teacher" },
        { name: "Aneeta Kumari", rel: "D/o", fname: "Akji", surname: "Meghwar", status: "PST(NTS)" },
        { name: "Asif Ali", rel: "S/o", fname: "Ghulam Rasool", surname: "Baber", status: "JEST (IBA)" },
        { name: "Bhawna Kumari", rel: "D/o", fname: "Dasrat Kumar", surname: "Brahman", status: "PST" },
        { name: "Bilawal Ali", rel: "S/o", fname: "Muhammmad Ibrahim", surname: "Kunbhar", status: "PST (IBA)" },
        { name: "Dasrat Kumar", rel: "S/o", fname: "Damoon Mal", surname: "Meghwar", status: "Auditor" },
        { name: "Dhanesh Kumar", rel: "S/o", fname: "Chander Kumar", surname: "Maheshwari", status: "PST (NTS)" },
        { name: "Dileep", rel: "S/o", fname: "Parbato", surname: "Meghwar", status: "---------" },
        { name: "Gul Mahammad", rel: "S/o", fname: "Muhammad Siddique", surname: "Khoram Nohari", status: "JEST (IBA)" },
        { name: "Kalpna", rel: "D/o", fname: "Dr.Satram Das", surname: "Khatri", status: "PST (IBA)" },
        { name: "Kanta Kumari", rel: "D/o", fname: "Chetan", surname: "Brahman", status: "PST" },
        { name: "Kaweeta Bai", rel: "D/o", fname: "Chahno", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Kiltar", rel: "S/o", fname: "Ramoon Mal", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Kumari Jai Laleeta", rel: "D/o", fname: "Girdhari", surname: "Meghwar", status: "JEST (IBA)" },
        { name: "Mala Kumari", rel: "D/o", fname: "Moti Lal", surname: "Joshi", status: "PST (IBA)" },
        { name: "Mansoor Ali", rel: "S/o", fname: "Ghulam Rasool", surname: "Baber", status: "JEST (IBA)" },
        { name: "Muhammad Iqbal", rel: "S/o", fname: "Muhammad Amen", surname: "Dars", status: "PST (IBA)" },
        { name: "Neeta", rel: "D/o", fname: "Dr.Satram Das", surname: "Khatri", status: "ECT (IBA)" },
        { name: "Nehchal Das", rel: "S/o", fname: "Nihal Chand", surname: "Harijan", status: "PST (NTS)" },
        { name: "Prem Lata", rel: "D/o", fname: "Dr.Satram Das", surname: "Khatri", status: "PST (NTS)" },
        { name: "Tamana", rel: "D/o", fname: "Damoon Mal", surname: "Meghwar", status: "PST (NTS)" },
        { name: "Vasdev", rel: "S/o", fname: "Togo Ram", surname: "Bheel", status: "Govt:Job in Health" },
        { name: "Vijanti Mala", rel: "D/o", fname: "Teerath Das", surname: "Khatri", status: "PST (NTS)" },
        { name: "Vijanti Mala", rel: "D/o", fname: "Dr.Satram Das", surname: "Khatri", status: "ECT (IBA)" },
        { name: "Devan", rel: "S/o", fname: "Padoo Mal", surname: "Meghwar", status: "---------" },
        { name: "Savatri Bai", rel: "D/o", fname: "Harchand", surname: "Meghwar", status: "---------" }
    ]
};

// === BATCHES COMPONENT ===
const Batches = () => {
    const [activeBatch, setActiveBatch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const toggleBatch = (year) => {
        if (activeBatch === year) {
            setActiveBatch(null);
        } else {
            setActiveBatch(year);
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold text-[#004d00] mb-8 text-center uppercase tracking-wide flex items-center justify-center gap-3">
                <Icons.GradCap /> Passed Students History (2012-2026)
            </h2>

            {/* Search Bar */}
            <div className="sticky top-20 z-40 bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-8 max-w-xl mx-auto flex items-center gap-3">
                <div className="text-gray-400"><Icons.Search /></div>
                <input 
                    type="text" 
                    placeholder="Search any student by Name..." 
                    className="w-full bg-transparent text-gray-700 outline-none font-medium placeholder-gray-400"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* ACCORDION LIST */}
            <div className="space-y-4">
                {Object.keys(batchesData).reverse().map((year) => {
                    const students = batchesData[year].filter(s => 
                        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        s.fname.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                    
                    if (students.length === 0 && searchTerm) return null;

                    const isOpen = activeBatch === year || searchTerm.length > 0; 

                    return (
                        <div key={year} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                            
                            {/* HEADER (UPDATED STYLE: Dark Green with Yellow Icon) */}
                            <button 
                                onClick={() => toggleBatch(year)}
                                className={`w-full flex items-center justify-between p-5 text-left transition-colors bg-[#004d00] text-white hover:bg-[#003d00]`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-2 rounded-full bg-white/10 text-yellow-400">
                                        <Icons.GradCap />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white">BATCH {year}</h3>
                                        <p className="text-xs text-green-200">{students.length} Students</p>
                                    </div>
                                </div>
                                <div className="text-white">
                                    {isOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                </div>
                            </button>

                            {/* BODY (Cards Grid) */}
                            {isOpen && (
                                <div className="p-6 bg-gray-50 border-t border-gray-100 animate-fade-in">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                        {students.map((student, index) => (
                                            <div key={index} className="bg-white border border-green-700 rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition h-full">
                                                
                                                {/* Card Content */}
                                                <div className="p-5 flex-1 text-center flex flex-col items-center justify-center">
                                                    
                                                    {/* Student Name */}
                                                    <h4 className="font-bold text-gray-900 text-lg mb-1">{student.name}</h4>
                                                    
                                                    {/* Status */}
                                                    <p className="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wider bg-gray-100 px-2 py-0.5 rounded-full">
                                                        {student.status || "STUDENT"}
                                                    </p>
                                                    
                                                    {/* S/o Father Name (UPDATED SIZE) */}
                                                    {student.fname && (
                                                        <p className="text-sm text-gray-600 font-medium">
                                                            {student.rel || "S/o"} {student.fname}
                                                        </p>
                                                    )}

                                                    {/* Surname on NEW LINE (UPDATED SIZE & BOLD) */}
                                                    {student.surname && (
                                                        <p className="text-sm text-[#004d00] font-extrabold uppercase mt-1 tracking-wide">
                                                            {student.surname}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Green Bottom Bar (Fixed) */}
                                                <div className="bg-[#004d00] text-white text-xs font-bold text-center py-2 uppercase tracking-wide mt-auto">
                                                    BATCH {year}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Batches;