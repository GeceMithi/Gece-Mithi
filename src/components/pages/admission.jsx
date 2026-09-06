import React, { useEffect, useState } from 'react';
import logoImg from '../../assets/logo.png';
import { db } from '../../firebase/firebase';
import { addDoc, collection } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { 
  Document, 
  Packer, 
  Paragraph, 
  HeadingLevel, 
  AlignmentType 
} from 'docx';
import { saveAs } from 'file-saver';
import { 
  GraduationCap, 
  Printer, 
  CheckCircle2, 
  FileSpreadsheet, 
  FileText, 
  RotateCcw, 
  Loader2,
  ShieldCheck,
  User,
  Phone,
  BookOpen,
  BadgeCheck
} from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwpYT8YuwHro_wlBMVK0py-kAaCubzQLz-dDq7_9580SBuGQXHaPa3fbdIIvNqrlLChAg/exec";

const SINDH_CITIES = [
  'Mithi',
  'Islamkot',
  'Diplo',
  'Chachro',
  'Nagarparkar',
  'Dahli',
  'Kaloi',
  'Mirpurkhas',
  'Umerkot',
  'Hyderabad',
  'Karachi',
  'Sukkur',
  'Larkana',
  'Nawabshah (Shaheed Benazirabad)',
  'Badin',
  'Thatta',
  'Sujawal',
  'Sanghar',
  'Tando Allahyar',
  'Tando Muhammad Khan',
  'Matiari',
  'Jamshoro',
  'Kotri',
  'Dadu',
  'Kashmore',
  'Kandhkot',
  'Jacobabad',
  'Shikarpur',
  'Ghotki',
  'Khairpur',
  'Naushahro Feroze',
  'Qambar Shahdadkot',
  'Other / Outside Sindh'
];

const SINDH_BOARDS = [
  'BISE Mirpurkhas',
  'BISE Hyderabad',
  'BISE Sukkur',
  'BISE Larkana',
  'BISE Shaheed Benazirabad',
  'BSEK Karachi (Secondary)',
  'BIEK Karachi (Intermediate)',
  'Aga Khan University Examination Board (AKU-EB)',
  'Federal Board (FBISE Islamabad)',
  'Other / Equivalent'
];

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
];

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

export default function App({ initialApplication = null }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [candidateNo, setCandidateNo] = useState('');
  const isPrintPreview = Boolean(initialApplication) || new URLSearchParams(window.location.search).get('printApplication') === '1';

  const [formData, setFormData] = useState({
    fullName: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    cnic: '',
    gender: '',
    domicileCity: '',
    candidateCityVillage: '',
    candidateCountry: 'Pakistan',
    religion: '',
    email: '',
    
    postalAddress: '',
    permanentAddress: '',
    contactNumber: '',

    parentFullName: '',
    parentCnic: '',
    parentContact: '',
    parentOccupation: '',

    emergencyName: '',
    emergencyRelationship: '',
    emergencyContact: '',

    // Matriculation (SSC)
    sscInstitute: '',
    sscBoard: '',
    sscYear: '',
    sscObtainedMarks: '',
    sscTotalMarks: '850',
    sscPercentage: '',
    sscGrade: '',

    // Intermediate (HSSC)
    hsscInstitute: '',
    hsscBoard: '',
    hsscYear: '',
    hsscObtainedMarks: '',
    hsscTotalMarks: '1100',
    hsscPercentage: '',
    hsscGrade: '',

    // Other Qualification
    otherInstitute: '',
    otherYear: '',
    otherObtainedMarks: '',
    otherTotalMarks: '',
    otherPercentage: '',
    otherGrade: '',

    // Pre-Ticked Required Documents
    checkSsc: true,
    checkHssc: true,
    checkCnicApplicant: true,
    checkCnicParent: true,
    checkPhotos: true,
    checkDomicile: true,

    undertaking: false
  });

  useEffect(() => {
    if (!isPrintPreview) return;

    try {
      const savedApplication = sessionStorage.getItem('gece_print_admission');
      const application = initialApplication || (savedApplication ? JSON.parse(savedApplication) : null);
      if (application) {
        setFormData(prev => ({ ...prev, ...application }));
        setCandidateNo(application.candidateNo || '');
        window.setTimeout(() => window.print(), 700);
      }
    } catch (error) {
      console.error('Could not prepare filled admission print form:', error);
    }
  }, [initialApplication, isPrintPreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Helper function to auto calculate percentage & grade
  const handleMarksChange = (level, field, value) => {
    setFormData(prev => {
      const updated = {
        ...prev,
        [`${level}${field}`]: value
      };

      const obt = parseFloat(field === 'ObtainedMarks' ? value : updated[`${level}ObtainedMarks`]);
      const tot = parseFloat(field === 'TotalMarks' ? value : updated[`${level}TotalMarks`]);

      if (!isNaN(obt) && !isNaN(tot) && tot > 0) {
        const percentage = ((obt / tot) * 100).toFixed(2);
        updated[`${level}Percentage`] = `${percentage}%`;
        
        if (percentage >= 80) updated[`${level}Grade`] = 'A-1';
        else if (percentage >= 70) updated[`${level}Grade`] = 'A';
        else if (percentage >= 60) updated[`${level}Grade`] = 'B';
        else if (percentage >= 50) updated[`${level}Grade`] = 'C';
        else if (percentage >= 40) updated[`${level}Grade`] = 'D';
        else updated[`${level}Grade`] = 'E';
      } else {
        updated[`${level}Percentage`] = '';
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.undertaking) {
      alert('Please check and accept the Undertaking before submitting.');
      return;
    }

    setLoading(true);
    const generatedNo = `GECE-${Math.floor(10000 + Math.random() * 90000)}`;
    setCandidateNo(generatedNo);

    const payload = {
      ...formData,
      candidateNo: generatedNo
    };

    try {
      await addDoc(collection(db, 'admissions'), {
        ...payload,
        submittedAt: new Date()
      });

      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Keep the secondary Google Sheet sync from blocking the Firebase success flow.
      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8'
          },
          body: JSON.stringify(payload)
        });
      } catch (syncError) {
        console.error('Secondary admission sync failed:', syncError);
      }
    } catch (err) {
      console.error('Submission error:', err);
      alert('Application could not be submitted. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const printApplicationForm = () => {
    setSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => window.print(), 250);
  };

  const getCnicFileName = (extension) => {
    const cleanCnic = (formData.cnic || 'Candidate').trim().replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${cleanCnic}_GECE_Admission.${extension}`;
  };

  const downloadExcel = () => {
    const data = [
      {
        "Application ID": candidateNo,
        "Full Name": formData.fullName,
        "Father's Name": formData.parentFullName,
        "CNIC / Form-B": formData.cnic,
        "Date of Birth": `${formData.dobDay} ${formData.dobMonth} ${formData.dobYear}`.trim(),
        "Gender": formData.gender,
        "Religion": formData.religion,
        "Domicile": formData.domicileCity,
        "Candidate Contact": formData.contactNumber,
        "Email Address": formData.email,
        "Postal Address": formData.postalAddress,
        "Permanent Address": formData.permanentAddress,
        "Guardian CNIC": formData.parentCnic,
        "Guardian Phone": formData.parentContact,
        "Guardian Occupation": formData.parentOccupation,
        "Emergency Person": formData.emergencyName,
        "Emergency Relationship": formData.emergencyRelationship,
        "Emergency Contact": formData.emergencyContact,
        "SSC Institute": formData.sscInstitute,
        "SSC Board": formData.sscBoard,
        "SSC Passing Year": formData.sscYear,
        "SSC Marks": `${formData.sscObtainedMarks}/${formData.sscTotalMarks}`,
        "SSC Percentage": formData.sscPercentage,
        "SSC Grade": formData.sscGrade,
        "HSSC Institute": formData.hsscInstitute,
        "HSSC Board": formData.hsscBoard,
        "HSSC Passing Year": formData.hsscYear,
        "HSSC Marks": `${formData.hsscObtainedMarks}/${formData.hsscTotalMarks}`,
        "HSSC Percentage": formData.hsscPercentage,
        "HSSC Grade": formData.hsscGrade,
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admission_Portal_Data");
    XLSX.writeFile(workbook, getCnicFileName('xlsx'));
  };

  const downloadWordDoc = () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: "GOVERNMENT ELEMENTARY COLLEGE OF EDUCATION (GECE) MITHI",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            text: `B.Ed. (Hons) Undergraduate Admission Record | ID: ${candidateNo}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
          new Paragraph({ text: "1. APPLICANT PERSONAL DATA", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: `Full Name: ${formData.fullName}` }),
          new Paragraph({ text: `Father's / Guardian's Name: ${formData.parentFullName}` }),
          new Paragraph({ text: `CNIC / B-Form: ${formData.cnic}` }),
          new Paragraph({ text: `Date of Birth: ${formData.dobDay} ${formData.dobMonth} ${formData.dobYear}` }),
          new Paragraph({ text: `Gender: ${formData.gender} | Religion: ${formData.religion}` }),
          new Paragraph({ text: `Domicile: ${formData.domicileCity}` }),
          new Paragraph({ text: `Contact: ${formData.contactNumber} | Email: ${formData.email}` }),
          new Paragraph({ text: `Postal Address: ${formData.postalAddress}` }),
          new Paragraph({ text: `Permanent Address: ${formData.permanentAddress}`, spacing: { after: 200 } }),

          new Paragraph({ text: "2. PARENT & EMERGENCY DATA", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: `Guardian CNIC: ${formData.parentCnic}` }),
          new Paragraph({ text: `Guardian Contact: ${formData.parentContact}` }),
          new Paragraph({ text: `Emergency Person: ${formData.emergencyName} (${formData.emergencyRelationship}) - ${formData.emergencyContact}`, spacing: { after: 200 } }),

          new Paragraph({ text: "3. ACADEMIC CREDENTIALS", heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ text: `Matriculation (SSC): ${formData.sscInstitute} | Board: ${formData.sscBoard} | Year: ${formData.sscYear} | Marks: ${formData.sscObtainedMarks}/${formData.sscTotalMarks} | Percentage: ${formData.sscPercentage} | Grade: ${formData.sscGrade}` }),
          new Paragraph({ text: `Intermediate (HSSC): ${formData.hsscInstitute} | Board: ${formData.hsscBoard} | Year: ${formData.hsscYear} | Marks: ${formData.hsscObtainedMarks}/${formData.hsscTotalMarks} | Percentage: ${formData.hsscPercentage} | Grade: ${formData.hsscGrade}`, spacing: { after: 300 } }),

          new Paragraph({
            text: "Official Undertaking: I solemnly affirm that all details submitted are genuine and subject to collegiate verification.",
            spacing: { before: 200 }
          })
        ]
      }]
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, getCnicFileName('docx'));
    });
  };

  return (
    <div className="w-full min-h-screen bg-slate-100 font-sans text-slate-900 antialiased p-0 m-0 print:bg-white">
      <style>{`
        @media screen and (max-width: 767px) {
          .admission-print-sheet {
            width: calc(100% - 1rem);
            margin: 0.5rem auto;
            padding: 0.75rem !important;
            border-radius: 0.75rem;
          }

          .form-section-front,
          .form-section-back {
            width: 100%;
            min-height: 0;
          }

          .form-section-front > div:first-child {
            flex-wrap: wrap;
            justify-content: center;
          }

          .form-section-front > div:first-child > div:nth-child(2) {
            order: 3;
            flex-basis: 100%;
          }

          .form-section-front > div:first-child img {
            max-width: 4.5rem;
          }

          .admission-print-sheet label {
            width: auto !important;
            min-width: 5.5rem;
            font-size: 0.6rem;
          }

          .admission-print-sheet input,
          .admission-print-sheet select {
            min-width: 0;
            max-width: 100%;
          }

          .admission-print-sheet .flex.items-center.gap-2,
          .admission-print-sheet .flex.items-center.gap-1\.5 {
            align-items: stretch;
            flex-wrap: wrap;
          }

          .admission-print-sheet .flex.items-center.gap-2 > label,
          .admission-print-sheet .flex.items-center.gap-1\.5 > label {
            flex-basis: 100%;
            text-align: left;
          }

          .admission-print-sheet table,
          .admission-print-sheet thead,
          .admission-print-sheet tbody,
          .admission-print-sheet tr,
          .admission-print-sheet td {
            display: block;
            width: 100% !important;
          }

          .admission-print-sheet table {
            border: 0;
          }

          .admission-print-sheet thead {
            display: none;
          }

          .admission-print-sheet tbody tr {
            margin-bottom: 0.75rem;
            border: 1px solid #cbd5e1;
            border-radius: 0.75rem;
            overflow: hidden;
            background: #fff;
          }

          .admission-print-sheet tbody td {
            display: grid;
            grid-template-columns: minmax(7rem, 36%) 1fr;
            align-items: center;
            gap: 0.5rem;
            border-right: 0;
            border-bottom: 1px solid #e2e8f0;
            padding: 0.65rem;
          }

          .admission-print-sheet tbody td:last-child {
            border-bottom: 0;
          }

          .admission-print-sheet tbody td::before {
            font-size: 0.65rem;
            font-weight: 800;
            color: #334155;
            text-transform: uppercase;
          }

          .admission-print-sheet tbody tr:nth-child(1) td:nth-child(1)::before { content: 'Qualification'; }
          .admission-print-sheet tbody tr:nth-child(2) td:nth-child(1)::before { content: 'Qualification'; }
          .admission-print-sheet tbody tr:nth-child(3) td:nth-child(1)::before { content: 'Qualification'; }
          .admission-print-sheet tbody td:nth-child(2)::before { content: 'Institute / Board'; }
          .admission-print-sheet tbody td:nth-child(3)::before { content: 'Passing Year'; }
          .admission-print-sheet tbody td:nth-child(4)::before { content: 'Obtained Marks'; }
          .admission-print-sheet tbody td:nth-child(5)::before { content: 'Total Marks'; }
          .admission-print-sheet tbody td:nth-child(6)::before { content: 'Percentage'; }
          .admission-print-sheet tbody td:nth-child(7)::before { content: 'Grade'; }

          .admission-print-sheet tbody td:first-child {
            display: block;
          }

          .admission-print-sheet tbody td:first-child::before {
            display: block;
            margin-bottom: 0.35rem;
          }
        }

        @page {
          size: A4 portrait;
          margin: 8mm;
        }

        @media print {
          html,
          body {
            width: 210mm;
            min-height: 297mm;
            margin: 0;
            background: #fff;
          }

          .admission-print-sheet {
            width: 194mm;
            min-height: 281mm;
            margin: 0;
            padding: 0;
            border: none !important;
            box-shadow: none !important;
          }

          .form-section-front,
          .form-section-back {
            width: 248.7mm;
            min-height: 360mm;
            box-sizing: border-box;
            zoom: 0.78;
            break-inside: avoid;
            page-break-inside: avoid;
            overflow: hidden;
          }

          .form-section-front {
            break-after: page;
            page-break-after: always;
          }

          .form-section-back {
            break-before: page;
            page-break-before: always;
          }
        }
      `}</style>
      
      {/* Main Sheet Container */}
      <div className="admission-print-sheet max-w-5xl mx-auto my-6 bg-white rounded-2xl shadow-xl border border-slate-200/80 p-6 sm:p-8 print:m-0 print:p-0 print:border-none print:shadow-none print:rounded-none">
        
        {submitted ? (
          <div className="w-full text-center py-12 space-y-6 print:hidden">
            <div className="w-20 h-20 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Application Successfully Submitted</h2>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
                Your admission dossier has been indexed. Please download your verified copies or print the hard copy for physical submission.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 bg-slate-900 text-emerald-400 px-6 py-2.5 rounded-xl text-base font-mono font-bold shadow-md border border-slate-800">
                Application Tracking ID: {candidateNo}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl max-w-xl mx-auto space-y-3 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Official Document Exports (CNIC: {formData.cnic})
              </span>
              <button
                type="button"
                onClick={printApplicationForm}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-950 text-white font-semibold py-3.5 px-4 rounded-xl text-xs shadow-md transition"
              >
                <Printer className="w-4 h-4" /> Download Filled PDF Form
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-semibold underline pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Submit another candidate form
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full">
            
            {/* ========================================================================= */}
            {/* PAGE 1: FRONT SIDE (Header, 1. Personal, 2. Parent, 3. Emergency Contact) */}
            {/* ========================================================================= */}
            <div className="form-section-front">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b-2 border-slate-950 pb-2.5 gap-3">
                
                {/* Logo */}
                <div className="w-22 h-26 sm:w-24 sm:h-28 shrink-0 flex items-center justify-start">
                  <img 
                    src={logoImg} 
                    alt="GECE Official Emblem" 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Center Titles */}
                <div className="text-center flex-1 px-1 flex flex-col justify-center">
                  <span className="text-[9.5px] sm:text-[11px] font-extrabold uppercase tracking-widest text-emerald-800 font-sans">
                    Government of Sindh • School Education & Literacy Department
                  </span>
                  <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tight text-slate-950 uppercase font-serif leading-none mt-1">
                    Government Elementary College of Education
                  </h1>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider mt-0.5 font-sans">
                    Mithi, District Tharparkar, Sindh
                  </p>
                  <div className="mt-1.5 inline-block bg-slate-950 text-white text-[11px] sm:text-xs font-black px-3.5 py-0.5 rounded tracking-wider uppercase">
                    Application for Admission to B.Ed. (Hons) 4-Year Program
                  </div>
                  <span className="text-[8.5px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
                    Session 2026–2030 • (Fill all credentials in capital letters)
                  </span>
                </div>

                {/* Photograph Box */}
                <div className="w-22 h-28 sm:w-24 sm:h-32 border-2 border-dashed border-slate-400 bg-slate-50/70 rounded-lg flex flex-col items-center justify-center text-center p-1.5 shrink-0 select-none shadow-sm relative overflow-hidden">
                  <div className="w-5 h-5 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-500 mb-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-slate-800 leading-tight uppercase">
                    Affix Recent<br />Photograph
                  </span>
                  <span className="text-[7px] text-slate-500 mt-0.5 font-medium">
                    (Passport Size)
                  </span>
                </div>

              </div>

              {/* 1. PERSONAL DETAILS */}
              <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm bg-white print:border-slate-800 mt-2">
                <div className="bg-slate-950 text-white font-extrabold text-xs uppercase px-3 py-1.5 tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1. Candidate Personal Details</span>
                  </div>
                  <span className="text-[9.5px] text-slate-300 font-normal normal-case">
                    As per Matriculation Record
                  </span>
                </div>

                <div className="p-3 space-y-2.5 text-xs">
                  
                  {/* Full Name & DOB */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                        Candidate Name *
                      </label>
                      <input
                        type="text"
                        required
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="ENTER FULL NAME"
                        className="flex-1 uppercase font-medium border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 md:text-right text-[10.5px]">
                        Date of Birth *
                      </label>
                      <div className="flex-1 grid grid-cols-3 gap-1">
                        <select
                          name="dobDay"
                          value={formData.dobDay}
                          onChange={handleChange}
                          className="border border-slate-300 rounded-md px-1 py-1.5 bg-white font-medium text-[11px] outline-none"
                        >
                          <option value="">DD</option>
                          {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select
                          name="dobMonth"
                          value={formData.dobMonth}
                          onChange={handleChange}
                          className="border border-slate-300 rounded-md px-1 py-1.5 bg-white font-medium text-[10px] outline-none"
                        >
                          <option value="">Month</option>
                          {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <input
                          type="number"
                          required
                          name="dobYear"
                          value={formData.dobYear}
                          onChange={handleChange}
                          placeholder="YYYY"
                          className="border border-slate-300 rounded-md px-1.5 py-1.5 font-medium text-xs text-center outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CNIC & Domicile */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                        CNIC / Form-B *
                      </label>
                      <input
                        type="text"
                        required
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="44301-XXXXXXX-X"
                        className="flex-1 font-mono tracking-wider border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 md:text-right text-[10.5px]">
                        Domicile (District) *
                      </label>
                      <select
                        required
                        name="domicileCity"
                        value={formData.domicileCity}
                        onChange={handleChange}
                        className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 bg-white font-medium text-xs outline-none print:border-slate-500"
                      >
                        <option value="">SELECT DISTRICT / CITY</option>
                        {SINDH_CITIES.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* City / Village & Country */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                        City / Village *
                      </label>
                      <select
                        required
                        name="candidateCityVillage"
                        value={formData.candidateCityVillage}
                        onChange={handleChange}
                        className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 bg-white font-medium text-xs outline-none print:border-slate-500"
                      >
                        <option value="">SELECT CITY / VILLAGE</option>
                        {SINDH_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 md:text-right text-[10.5px]">
                        Country *
                      </label>
                      <input
                        type="text"
                        required
                        name="candidateCountry"
                        value={formData.candidateCountry}
                        onChange={handleChange}
                        className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>
                  </div>

                  {/* Religion & Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                        Religion *
                      </label>
                      <select
                        name="religion"
                        value={formData.religion}
                        onChange={handleChange}
                        className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 bg-white font-medium text-xs outline-none"
                      >
                        <option value="">SELECT RELIGION</option>
                        <option value="Muslim">Muslim</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 md:text-right text-[10.5px]">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="candidate@example.com"
                        className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>
                  </div>

                  {/* Contact Number & Gender */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleChange}
                        placeholder="03XX-XXXXXXX"
                        className="flex-1 font-mono border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 md:text-right text-[10.5px]">
                        Gender *
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="flex-1 border border-slate-300 rounded-md px-2 py-1.5 bg-white font-medium text-xs outline-none print:border-slate-500"
                      >
                        <option value="">SELECT GENDER</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Postal Address */}
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                      Postal Address *
                    </label>
                    <input
                      type="text"
                      required
                      name="postalAddress"
                      value={formData.postalAddress}
                      onChange={handleChange}
                      placeholder="Current Mailing / Postal Address (For Official Communication)"
                      className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                    />
                  </div>

                  {/* Permanent Address */}
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                      Permanent Addr *
                    </label>
                    <input
                      type="text"
                      required
                      name="permanentAddress"
                      value={formData.permanentAddress}
                      onChange={handleChange}
                      placeholder="Permanent Village / Town / Tehsil / District Address"
                      className="flex-1 bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                    />
                  </div>

                </div>
              </div>

              {/* 2. PARENT / GUARDIAN DETAILS */}
              <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm bg-white print:border-slate-800 mt-2">
                <div className="bg-slate-950 text-white font-extrabold text-xs uppercase px-3 py-1.5 tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>2. Parent / Guardian Details</span>
                  </div>
                </div>

                <div className="p-3 space-y-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="parentFullName"
                      value={formData.parentFullName}
                      onChange={handleChange}
                      placeholder="Father's / Guardian's Full Name (As per CNIC)"
                      className="flex-1 uppercase border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                        Guardian CNIC *
                      </label>
                      <input
                        type="text"
                        required
                        name="parentCnic"
                        value={formData.parentCnic}
                        onChange={handleChange}
                        placeholder="XXXXX-XXXXXXX-X"
                        className="flex-1 font-mono tracking-wider border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 md:text-right text-[10.5px]">
                        Contact # *
                      </label>
                      <input
                        type="tel"
                        required
                        name="parentContact"
                        value={formData.parentContact}
                        onChange={handleChange}
                        placeholder="03XX-XXXXXXX"
                        className="flex-1 font-mono border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-2">
                      <label className="font-bold text-slate-800 uppercase shrink-0 w-32 text-[10.5px]">
                        Occupation
                      </label>
                      <input
                        type="text"
                        name="parentOccupation"
                        value={formData.parentOccupation}
                        onChange={handleChange}
                        placeholder="e.g. Govt Service / Teacher / Landlord"
                        className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                      />
                    </div>

                  </div>
                </div>
              </div>

              {/* 3. EMERGENCY CONTACT DETAILS */}
              <div className="border border-slate-300 rounded-lg overflow-hidden shadow-sm bg-white print:border-slate-800 mt-2">
                <div className="bg-slate-950 text-white font-extrabold text-xs uppercase px-3 py-1.5 tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span>3. Emergency Contact Details</span>
                  </div>
                  <span className="text-[9.5px] font-normal normal-case opacity-80">
                    Person to be notified immediately
                  </span>
                </div>

                <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  <div className="flex items-center gap-1.5">
                    <label className="font-bold text-slate-800 uppercase shrink-0 w-20 text-[10px]">
                      Person Name *
                    </label>
                    <input
                      type="text"
                      required
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="flex-1 uppercase border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="font-bold text-slate-800 uppercase shrink-0 w-20 md:text-right text-[10px]">
                      Relationship *
                    </label>
                    <input
                      type="text"
                      required
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleChange}
                      placeholder="e.g. Father/Brother"
                      className="flex-1 border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="font-bold text-slate-800 uppercase shrink-0 w-20 md:text-right text-[10px]">
                      Contact # *
                    </label>
                    <input
                      type="tel"
                      required
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      className="flex-1 font-mono border border-slate-300 rounded-md px-2.5 py-1.5 text-xs outline-none print:border-slate-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Border */}
              <div className="pt-2 border-t-2 border-slate-950 mt-auto"></div>

            </div>

            {/* ========================================================================= */}
            {/* PAGE 2: BACK SIDE (4. Academic, 5. Checklist, 6. Undertaking, Signatures) */}
            {/* ========================================================================= */}
            <div className="form-section-back">
              
              {/* 4. ACADEMIC RECORD & QUALIFICATIONS (With Auto %) */}
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white print:border-slate-800">
                <div className="bg-slate-950 text-white font-extrabold text-xs uppercase px-4 py-2 tracking-wider flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>4. Academic Record & Qualifications</span>
                </div>

                <div className="p-3.5">
                  <table className="w-full text-left text-xs border-collapse border border-slate-300">
                    <thead className="bg-slate-100 font-bold text-slate-900 border-b border-slate-300 uppercase text-[9.5px] tracking-wider">
                      <tr>
                        <th className="p-2.5 border-r border-slate-300 w-1/5">Certificate / Degree</th>
                        <th className="p-2.5 border-r border-slate-300 w-1/4">Institute & Board / University</th>
                        <th className="p-2.5 border-r border-slate-300 text-center w-14">Passing Year</th>
                        <th className="p-2.5 border-r border-slate-300 text-center w-20">Obtained Marks</th>
                        <th className="p-2.5 border-r border-slate-300 text-center w-20">Total Marks</th>
                        <th className="p-2.5 border-r border-slate-300 text-center w-16 bg-emerald-50/70 text-emerald-950">Auto %</th>
                        <th className="p-2.5 text-center w-14">Grade</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      
                      {/* Matric */}
                      <tr>
                        <td className="p-3 border-r border-slate-300 font-semibold bg-slate-50/50 text-[11px]">
                          Matriculation / SSC *
                        </td>
                        <td className="p-2 border-r border-slate-300 space-y-1.5">
                          <input
                            type="text"
                            required
                            name="sscInstitute"
                            value={formData.sscInstitute}
                            onChange={handleChange}
                            placeholder="School Name"
                            className="w-full p-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-900"
                          />
                          {formData.sscBoard === 'Other / Equivalent' || !SINDH_BOARDS.includes(formData.sscBoard) && formData.sscBoard !== '' ? (
                            <input
                              type="text"
                              name="sscBoard"
                              value={formData.sscBoard === 'Other / Equivalent' ? '' : formData.sscBoard}
                              onChange={handleChange}
                              placeholder="Type board name"
                              autoFocus
                              className="w-full p-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            <select
                              name="sscBoard"
                              value={formData.sscBoard}
                              onChange={handleChange}
                              className="w-full p-1.5 border border-slate-300 rounded-lg text-[11px] bg-white font-medium outline-none focus:ring-1 focus:ring-slate-900"
                            >
                              <option value="">Select Board</option>
                              {SINDH_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          )}
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            required
                            name="sscYear"
                            value={formData.sscYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            name="sscObtainedMarks"
                            value={formData.sscObtainedMarks}
                            onChange={(e) => handleMarksChange('ssc', 'ObtainedMarks', e.target.value)}
                            placeholder="Obtained"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            name="sscTotalMarks"
                            value={formData.sscTotalMarks}
                            readOnly
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs bg-slate-100 font-bold outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300 bg-emerald-50/40">
                          <input
                            type="text"
                            readOnly
                            name="sscPercentage"
                            value={formData.sscPercentage}
                            placeholder="0.00%"
                            className="w-full p-1.5 text-center font-bold text-emerald-800 bg-transparent border-none text-xs outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            name="sscGrade"
                            value={formData.sscGrade}
                            onChange={handleChange}
                            placeholder="Grade"
                            className="w-full p-1.5 text-center font-bold border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                      </tr>

                      {/* Intermediate */}
                      <tr>
                        <td className="p-3 border-r border-slate-300 font-semibold bg-slate-50/50 text-[11px]">
                          Intermediate / HSSC *
                        </td>
                        <td className="p-2 border-r border-slate-300 space-y-1.5">
                          <input
                            type="text"
                            required
                            name="hsscInstitute"
                            value={formData.hsscInstitute}
                            onChange={handleChange}
                            placeholder="College Name"
                            className="w-full p-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-900"
                          />
                          {formData.hsscBoard === 'Other / Equivalent' || !SINDH_BOARDS.includes(formData.hsscBoard) && formData.hsscBoard !== '' ? (
                            <input
                              type="text"
                              name="hsscBoard"
                              value={formData.hsscBoard === 'Other / Equivalent' ? '' : formData.hsscBoard}
                              onChange={handleChange}
                              placeholder="Type board name"
                              autoFocus
                              className="w-full p-1.5 border border-slate-300 rounded-lg text-xs outline-none focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            <select
                              name="hsscBoard"
                              value={formData.hsscBoard}
                              onChange={handleChange}
                              className="w-full p-1.5 border border-slate-300 rounded-lg text-[11px] bg-white font-medium outline-none focus:ring-1 focus:ring-slate-900"
                            >
                              <option value="">Select Board</option>
                              {SINDH_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                            </select>
                          )}
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            required
                            name="hsscYear"
                            value={formData.hsscYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            name="hsscObtainedMarks"
                            value={formData.hsscObtainedMarks}
                            onChange={(e) => handleMarksChange('hssc', 'ObtainedMarks', e.target.value)}
                            placeholder="Obtained"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            name="hsscTotalMarks"
                            value={formData.hsscTotalMarks}
                            readOnly
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs bg-slate-100 font-bold outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300 bg-emerald-50/40">
                          <input
                            type="text"
                            readOnly
                            name="hsscPercentage"
                            value={formData.hsscPercentage}
                            placeholder="0.00%"
                            className="w-full p-1.5 text-center font-bold text-emerald-800 bg-transparent border-none text-xs outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            required
                            name="hsscGrade"
                            value={formData.hsscGrade}
                            onChange={handleChange}
                            placeholder="Grade"
                            className="w-full p-1.5 text-center font-bold border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                      </tr>

                      {/* Additional Qualification */}
                      <tr>
                        <td className="p-3 border-r border-slate-300 font-semibold bg-slate-50/50 text-[11px]">
                          Any Other Diploma / Degree
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="text"
                            name="otherInstitute"
                            value={formData.otherInstitute}
                            onChange={handleChange}
                            placeholder="Institute / Board (Optional)"
                            className="w-full p-1.5 border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            name="otherYear"
                            value={formData.otherYear}
                            onChange={handleChange}
                            placeholder="YYYY"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            name="otherObtainedMarks"
                            value={formData.otherObtainedMarks}
                            onChange={(e) => handleMarksChange('other', 'ObtainedMarks', e.target.value)}
                            placeholder="Obtained"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300">
                          <input
                            type="number"
                            name="otherTotalMarks"
                            value={formData.otherTotalMarks}
                            onChange={(e) => handleMarksChange('other', 'TotalMarks', e.target.value)}
                            placeholder="Total"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                        <td className="p-2 border-r border-slate-300 bg-emerald-50/40">
                          <input
                            type="text"
                            readOnly
                            name="otherPercentage"
                            value={formData.otherPercentage}
                            placeholder="0.00%"
                            className="w-full p-1.5 text-center font-bold text-emerald-800 bg-transparent border-none text-xs outline-none"
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="text"
                            name="otherGrade"
                            value={formData.otherGrade}
                            onChange={handleChange}
                            placeholder="Grade"
                            className="w-full p-1.5 text-center border border-slate-300 rounded-lg text-xs outline-none"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. REQUIRED DOCUMENTS (Pre-Checked) */}
              <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm bg-white print:border-slate-800 mt-2.5">
                <div className="bg-slate-950 text-white font-extrabold text-xs uppercase px-4 py-2 tracking-wider flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                    <span>5. REQUIRED DOCUMENTS</span>
                  </div>
                  <span className="text-[10px] font-normal normal-case opacity-80">
                    Attested photocopies attached
                  </span>
                </div>

                <div className="p-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-900 transition">
                    <input 
                      type="checkbox" 
                      name="checkSsc" 
                      checked={formData.checkSsc} 
                      onChange={handleChange} 
                      className="rounded text-slate-950 focus:ring-slate-900 accent-slate-950" 
                    />
                    <span>One copy of SSC / Matriculation Marks Sheet & Pass Certificate</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-900 transition">
                    <input 
                      type="checkbox" 
                      name="checkHssc" 
                      checked={formData.checkHssc} 
                      onChange={handleChange} 
                      className="rounded text-slate-950 focus:ring-slate-900 accent-slate-950" 
                    />
                    <span>One copy of HSSC / Intermediate Marks Sheet & Pass Certificate</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-900 transition">
                    <input 
                      type="checkbox" 
                      name="checkCnicApplicant" 
                      checked={formData.checkCnicApplicant} 
                      onChange={handleChange} 
                      className="rounded text-slate-950 focus:ring-slate-900 accent-slate-950" 
                    />
                    <span>One copy of Computerized CNIC / B-Form of Candidate</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-900 transition">
                    <input 
                      type="checkbox" 
                      name="checkCnicParent" 
                      checked={formData.checkCnicParent} 
                      onChange={handleChange} 
                      className="rounded text-slate-950 focus:ring-slate-900 accent-slate-950" 
                    />
                    <span>One copy of Computerized CNIC of Father / Guardian</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-900 transition">
                    <input 
                      type="checkbox" 
                      name="checkPhotos" 
                      checked={formData.checkPhotos} 
                      onChange={handleChange} 
                      className="rounded text-slate-950 focus:ring-slate-900 accent-slate-950" 
                    />
                    <span>Two recent passport-size photographs (with applicant's name on reverse)</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer hover:text-emerald-900 transition">
                    <input 
                      type="checkbox" 
                      name="checkDomicile" 
                      checked={formData.checkDomicile} 
                      onChange={handleChange} 
                      className="rounded text-slate-950 focus:ring-slate-900 accent-slate-950" 
                    />
                    <span>Domicile Certificate & PRC Form-D (District Tharparkar / Sindh)</span>
                  </label>
                </div>
              </div>

              {/* 6. SOLEMN UNDERTAKING & DECLARATION */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-50/70 text-xs print:bg-white mt-2.5">
                <div className="bg-slate-950 text-white font-extrabold text-xs uppercase px-4 py-2 text-center font-serif tracking-wider">
                  6. Solemn Undertaking & Declaration by Applicant & Guardian
                </div>
                
                <div className="p-4 space-y-2.5 leading-relaxed">
                  <p className="font-bold text-slate-900">I do hereby solemnly affirm and declare that:</p>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-700 pl-1 text-[11px]">
                    <li>The statements and particulars made in this application form and attached credentials are true, authentic, and complete in all respects. If any information is found incorrect or fake at any stage, my admission shall be summarily canceled.</li>
                    <li>I will strictly abide by the rules, regulations, attendance requirements, and code of conduct prescribed by GECE Mithi and the affiliating authority during the four-year B.Ed. (Hons) program.</li>
                    <li>I shall submit original verified certificates and migration certificate whenever demanded by the college administration.</li>
                  </ol>

                  <div className="pt-3 border-t border-slate-300 flex items-center justify-between">
                    <label className="flex items-center gap-2.5 cursor-pointer font-bold text-slate-950">
                      <input
                        type="checkbox"
                        required
                        name="undertaking"
                        checked={formData.undertaking}
                        onChange={handleChange}
                        className="w-4 h-4 text-emerald-800 rounded"
                      />
                      <span>I accept and agree to abide by all the terms, conditions and declarations above *</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Exact Balanced Bottom Signatures */}
              <div className="mt-auto pt-8 pb-2">
                <div className="grid grid-cols-3 gap-8 text-center text-xs font-bold text-slate-900">
                  
                  {/* Candidate Signature */}
                  <div className="flex flex-col items-center">
                    <div className="w-full border-t-2 border-slate-900 pt-2">
                      <span className="block text-xs font-bold tracking-tight">
                        Candidate Signature
                      </span>
                    </div>
                  </div>

                  {/* Parent / Guardian Signature */}
                  <div className="flex flex-col items-center">
                    <div className="w-full border-t-2 border-slate-900 pt-2">
                      <span className="block text-xs font-bold tracking-tight">
                        Parent / Guardian Signature
                      </span>
                    </div>
                  </div>

                  {/* Principal Signature & Stamp */}
                  <div className="flex flex-col items-center">
                    <div className="w-full border-t-2 border-slate-900 pt-2">
                      <span className="block text-xs font-bold tracking-tight">
                        Principal Signature & Stamp
                      </span>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Submit Button (Screen View Only) */}
            <div className="text-center print:hidden pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-800 via-slate-900 to-emerald-950 hover:opacity-95 text-white font-extrabold py-4 px-10 rounded-2xl shadow-xl transition-all duration-200 text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 disabled:opacity-50 active:scale-[0.99] border border-emerald-500/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Recording in Google Sheets Database...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    Submit B.Ed (Hons) Admission Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}