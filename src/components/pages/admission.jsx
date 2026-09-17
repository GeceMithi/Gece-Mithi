import React, { useEffect, useState } from 'react';
import logoImg from '../../assets/logo.png';
import { db } from '../../firebase/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { 
  Document, 
  Packer, 
  Paragraph, 
  HeadingLevel, 
  AlignmentType 
} from 'docx';
import { useToast } from '../../contexts/ToastContext';
import { 
  GraduationCap, 
  Printer, 
  CheckCircle2, 
  RotateCcw, 
  Loader2,
  ShieldCheck,
  User,
  Phone,
  BookOpen,
  BadgeCheck
} from 'lucide-react';

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwpYT8YuwHro_wlBMVK0py-kAaCubzQLz-dDq7_9580SBuGQXHaPa3fbdIIvNqrlLChAg/exec";

const PAKISTAN_DISTRICTS = {
  'Sindh': [
    'Badin', 'Dadu', 'Ghotki', 'Hyderabad', 'Jacobabad', 'Jamshoro',
    'Kashmore', 'Karachi Central', 'Karachi East', 'Karachi South',
    'Karachi West', 'Keamari', 'Korangi', 'Malir', 'Kamber-Shahdadkot',
    'Khairpur', 'Larkana', 'Matiari', 'Mirpur Khas', 'Naushahro Feroze',
    'Qambar Shahdadkot', 'Sanghar', 'Shaheed Benazirabad', 'Shikarpur',
    'Sujawal', 'Sukkur', 'Tando Allahyar', 'Tando Muhammad Khan', 'Thatta',
    'Tharparkar', 'Umerkot'
  ]
};

const SINDH_CITIES = [
  'Other', 'Badin', 'Dadu', 'Ghotki', 'Hyderabad', 'Jacobabad', 'Jamshoro',
  'Karachi', 'Khairpur', 'Larkana', 'Matiari', 'Mirpur Khas', 'Mithi',
  'Islamkot', 'Diplo', 'Chachro', 'Nagarparkar', 'Naushahro Feroze', 'Sanghar',
  'Sukkur', 'Thatta', 'Umerkot'
];

const SINDH_BOARDS = [
  'BISE Mirpurkhas',
  'BISE Hyderabad',
  'BISE Sukkur',
  'BISE Larkana',
  'BISE Shaheed Benazirabad',
  'BSEK / BIEK Karachi',
  'Federal Board (FBISE)',
  'Aga Khan Board (AKU-EB)',
  'Other / Equivalent'
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

export default function App({ initialApplication = null }) {
  const { showToast } = useToast();
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
    domicileCity: 'Tharparkar, Sindh',
    candidateCityVillage: 'Mithi',
    candidateCityVillageOther: '',
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

    sscInstitute: '',
    sscBoard: '',
    sscYear: '',
    sscObtainedMarks: '',
    sscTotalMarks: '850',
    sscPercentage: '',
    sscGrade: '',

    hsscInstitute: '',
    hsscBoard: '',
    hsscYear: '',
    hsscObtainedMarks: '',
    hsscTotalMarks: '1100',
    hsscPercentage: '',
    hsscGrade: '',

    otherInstitute: '',
    otherYear: '',
    otherObtainedMarks: '',
    otherTotalMarks: '',
    otherPercentage: '',
    otherGrade: '',

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
      const saved = sessionStorage.getItem('gece_print_admission');
      const application = initialApplication || (saved ? JSON.parse(saved) : null);
      if (application) {
        setFormData(prev => ({ ...prev, ...application }));
        setCandidateNo(application.candidateNo || '');
        window.setTimeout(() => window.print(), 500);
      }
    } catch (e) {
      console.error(e);
    }
  }, [initialApplication, isPrintPreview]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleMarksChange = (level, field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [`${level}${field}`]: value };
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
      showToast('Please check and accept the Undertaking before submitting.', 'warning');
      return;
    }

    setLoading(true);
    const generatedNo = `GECE-${Math.floor(10000 + Math.random() * 90000)}`;
    setCandidateNo(generatedNo);

    const payload = {
      ...formData,
      candidateCityVillage: formData.candidateCityVillage === 'Other' ? formData.candidateCityVillageOther.trim() : formData.candidateCityVillage,
      candidateNo: generatedNo
    };

    try {
      const normalize = (value) => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
      const duplicateSnapshot = await getDocs(query(
        collection(db, 'admissions'),
        where('cnic', '==', payload.cnic)
      ));
      const duplicateAdmission = duplicateSnapshot.docs.some((admissionDoc) => {
        const existing = admissionDoc.data();
        return [
          'fullName',
          'parentFullName',
          'dobDay',
          'dobMonth',
          'dobYear',
          'domicileCity',
          'candidateCityVillage',
          'contactNumber'
        ].every((field) => normalize(existing[field]) === normalize(payload[field]));
      });

      if (duplicateAdmission) {
        showToast('Your form is already submitted. If you find any mistake, please contact the administrator.', 'warning');
        return;
      }

      await addDoc(collection(db, 'admissions'), {
        ...payload,
        submittedAt: new Date()
      });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      } catch {
        // Firebase submission already succeeded; the optional sheet sync may fail.
      }
    } catch (err) {
      console.error('Admission submission failed:', err);
      showToast('There was a problem submitting your form. Please contact the administrator.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const printApplicationForm = () => {
    setSubmitted(false);
    setTimeout(() => window.print(), 200);
  };

  return (
    <div className="w-full min-h-screen bg-slate-200 font-sans text-slate-900 p-0 print:p-0 print:m-0 print:bg-white flex justify-center">
      <style>{`
        @page {
          size: A4 portrait;
          margin: 6mm 7mm;
        }
        @media print {
          html, body {
            width: 210mm;
            height: 297mm;
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .a4-one-page {
            width: 196mm !important;
            max-height: 284mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          input, select {
            border-color: #475569 !important;
            font-size: 8.5px !important;
            padding-top: 1px !important;
            padding-bottom: 1px !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
          }
        }

        @media screen and (max-width: 767px) {
          .responsive-form {
            font-size: 11px;
          }

          .responsive-form .personal-grid-row {
            grid-template-columns: 1fr;
            gap: 0.35rem;
            align-items: stretch;
          }

          .responsive-form .personal-grid-row > span,
          .responsive-form .personal-grid-row > span.text-right {
            grid-column: span 12;
            text-align: left;
          }

          .responsive-form .personal-grid-row > input,
          .responsive-form .personal-grid-row > select,
          .responsive-form .personal-grid-row > div {
            grid-column: span 12;
            min-width: 0;
            width: 100%;
          }

          .responsive-form .personal-grid-row > div.grid-cols-2 {
            grid-template-columns: 1fr;
          }

          .responsive-form .guardian-emergency-grid {
            grid-template-columns: 1fr;
          }

          .responsive-form .guardian-emergency-grid .w-20 {
            width: 5.5rem;
            flex-shrink: 0;
          }

          .responsive-form .academic-scroll {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .responsive-form .academic-scroll table {
            min-width: 680px;
          }

          .responsive-form .documents-grid {
            grid-template-columns: 1fr;
          }

          .responsive-form .signature-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }

          .responsive-form input,
          .responsive-form select,
          .responsive-form textarea {
            min-width: 0;
            max-width: 100%;
          }
        }

        @media screen and (min-width: 768px) {
          .admission-form-box {
            width: 100%;
            max-width: 210mm;
          }
        }

        @media screen and (min-width: 1440px) {
          .admission-form-box {
            max-width: 210mm;
          }
        }
      `}</style>

      {/* Main A4 Single Page Container */}
      <div className="admission-form-box a4-one-page w-full max-w-[210mm] bg-white border border-slate-300 shadow-xl p-3 sm:p-4 text-[10px] leading-tight">
        
        {submitted ? (
          <div className="text-center py-16 space-y-4 print:hidden">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Application Submitted!</h2>
            <div className="font-mono bg-slate-900 text-emerald-400 inline-block px-4 py-1.5 rounded-lg text-sm">
              Tracking ID: {candidateNo}
            </div>
            <div>
              <button
                type="button"
                onClick={printApplicationForm}
                className="bg-slate-900 text-white text-xs px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 mx-auto hover:bg-black"
              >
                <Printer className="w-4 h-4" /> Print 1-Page Admission Form
              </button>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-slate-500 underline block mx-auto pt-2"
            >
              Back to edit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="responsive-form flex flex-col justify-between h-full space-y-1.5">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 gap-2">
              <div className="w-14 h-16 shrink-0 flex items-center">
                <img src={logoImg} alt="Logo" className="w-full h-full object-contain" />
              </div>

              <div className="text-center flex-1">
                <span className="text-[8px] font-bold tracking-wider text-emerald-800 uppercase block">
                  Government of Sindh • School Education & Literacy Department
                </span>
                <h1 className="text-xs sm:text-sm font-black uppercase tracking-tight text-slate-950 font-serif">
                  Government Elementary College of Education, Mithi
                </h1>
                <p className="text-[8.5px] font-bold text-slate-700 uppercase">
                  District Tharparkar, Sindh
                </p>
                <div className="inline-block bg-slate-900 text-white text-[8.5px] font-bold px-2 py-0.5 rounded tracking-wide uppercase mt-0.5">
                  Admission Form • B.Ed. (Hons) 4-Year Program (Session 2026–2030)
                </div>
              </div>

              {/* Photo Box */}
              <div className="w-16 h-20 border border-dashed border-slate-500 rounded flex flex-col items-center justify-center text-center p-0.5 shrink-0 bg-slate-50">
                <User className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                <span className="text-[7px] font-bold leading-none uppercase">Affix Photo</span>
                <span className="text-[6px] text-slate-500 leading-tight">(Passport)</span>
              </div>
            </div>

            {/* 1. Personal Details */}
            <div className="border border-slate-400 rounded overflow-hidden">
              <div className="bg-slate-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 flex justify-between">
                <span>1. Candidate Personal Details</span>
                <span className="text-[7.5px] font-normal normal-case opacity-80">(As per Matriculation certificate)</span>
              </div>
              <div className="p-1.5 space-y-1">
                <div className="personal-grid-row grid grid-cols-12 gap-1.5 items-center">
                  <span className="col-span-2 font-bold text-[8.5px] uppercase">Full Name:</span>
                  <input
                    type="text"
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="FULL NAME"
                    className="col-span-4 uppercase border border-slate-300 rounded px-1.5 py-0.5 text-[8.5px] outline-none"
                  />

                  <span className="col-span-2 text-right font-bold text-[8.5px] uppercase">DOB:</span>
                  <div className="col-span-4 grid grid-cols-3 gap-1">
                    <select name="dobDay" value={formData.dobDay} onChange={handleChange} className="border border-slate-300 rounded px-1 py-0.5 text-[8px] bg-white">
                      <option value="">DD</option>
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select name="dobMonth" value={formData.dobMonth} onChange={handleChange} className="border border-slate-300 rounded px-1 py-0.5 text-[8px] bg-white">
                      <option value="">MM</option>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <input
                      type="number"
                      name="dobYear"
                      value={formData.dobYear}
                      onChange={handleChange}
                      placeholder="YYYY"
                      className="border border-slate-300 rounded px-1 py-0.5 text-[8px] text-center"
                    />
                  </div>
                </div>

                <div className="personal-grid-row grid grid-cols-12 gap-1.5 items-center">
                  <span className="col-span-2 font-bold text-[8.5px] uppercase">CNIC / Form-B:</span>
                  <input
                    type="text"
                    required
                    name="cnic"
                    value={formData.cnic}
                    onChange={handleChange}
                    placeholder="44301-XXXXXXX-X"
                    className="col-span-4 border border-slate-300 rounded px-1.5 py-0.5 text-[8.5px] font-mono outline-none"
                  />

                  <span className="col-span-2 text-right font-bold text-[8.5px] uppercase">Domicile:</span>
                  <select
                    name="domicileCity"
                    value={formData.domicileCity}
                    onChange={handleChange}
                    className="col-span-4 border border-slate-300 rounded px-1 py-0.5 text-[8px] bg-white outline-none"
                  >
                    {PAKISTAN_DISTRICTS.Sindh.map(d => (
                      <option key={d} value={`${d}, Sindh`}>{d}</option>
                    ))}
                  </select>
                </div>

                <div className="personal-grid-row grid grid-cols-12 gap-1.5 items-center">
                  <span className="col-span-2 font-bold text-[8.5px] uppercase">City / Village:</span>
                  <input
                    type="text"
                    name="candidateCityVillage"
                    value={formData.candidateCityVillage}
                    onChange={handleChange}
                    placeholder="Town / Village"
                    className="col-span-4 border border-slate-300 rounded px-1.5 py-0.5 text-[8.5px] outline-none"
                  />

                  <span className="col-span-2 text-right font-bold text-[8.5px] uppercase">Gender / Rel:</span>
                  <div className="col-span-4 grid grid-cols-2 gap-1">
                    <select name="gender" value={formData.gender} onChange={handleChange} className="border border-slate-300 rounded px-1 py-0.5 text-[8px] bg-white">
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      placeholder="Religion"
                      className="border border-slate-300 rounded px-1 py-0.5 text-[8px]"
                    />
                  </div>
                </div>

                <div className="personal-grid-row grid grid-cols-12 gap-1.5 items-center">
                  <span className="col-span-2 font-bold text-[8.5px] uppercase">Mobile No:</span>
                  <input
                    type="tel"
                    required
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="03XX-XXXXXXX"
                    className="col-span-4 border border-slate-300 rounded px-1.5 py-0.5 text-[8.5px] font-mono outline-none"
                  />

                  <span className="col-span-2 text-right font-bold text-[8.5px] uppercase">Email:</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="col-span-4 border border-slate-300 rounded px-1.5 py-0.5 text-[8px] outline-none"
                  />
                </div>

                <div className="grid grid-cols-12 gap-1.5 items-center">
                  <span className="col-span-2 font-bold text-[8.5px] uppercase">Permanent:</span>
                  <input
                    type="text"
                    required
                    name="permanentAddress"
                    value={formData.permanentAddress}
                    onChange={handleChange}
                    placeholder="Permanent Address"
                    className="col-span-10 border border-slate-300 rounded px-1.5 py-0.5 text-[8.5px] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2 & 3: Parent & Emergency In 1 Compact Grid */}
            <div className="guardian-emergency-grid grid grid-cols-2 gap-1.5">
              {/* Parent Details */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>2. Father / Guardian Details</span>
                </div>
                <div className="p-1.5 space-y-1 text-[8.5px]">
                  <div className="flex items-center gap-1">
                    <span className="w-20 font-bold uppercase">Name:</span>
                    <input
                      type="text"
                      required
                      name="parentFullName"
                      value={formData.parentFullName}
                      onChange={handleChange}
                      placeholder="Father's Full Name"
                      className="flex-1 uppercase border border-slate-300 rounded px-1 py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-20 font-bold uppercase">CNIC:</span>
                    <input
                      type="text"
                      required
                      name="parentCnic"
                      value={formData.parentCnic}
                      onChange={handleChange}
                      placeholder="44301-XXXXXXX-X"
                      className="flex-1 font-mono border border-slate-300 rounded px-1 py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-20 font-bold uppercase">Phone:</span>
                    <input
                      type="tel"
                      required
                      name="parentContact"
                      value={formData.parentContact}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      className="flex-1 font-mono border border-slate-300 rounded px-1 py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-20 font-bold uppercase">Occupation:</span>
                    <input
                      type="text"
                      name="parentOccupation"
                      value={formData.parentOccupation}
                      onChange={handleChange}
                      placeholder="e.g. Teacher / Advocate / Business"
                      className="flex-1 border border-slate-300 rounded px-1 py-0.5"
                    />
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border border-slate-400 rounded overflow-hidden">
                <div className="bg-slate-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>3. Emergency Contact Details</span>
                </div>
                <div className="p-1.5 space-y-1 text-[8.5px]">
                  <div className="flex items-center gap-1">
                    <span className="w-20 font-bold uppercase">Name:</span>
                    <input
                      type="text"
                      required
                      name="emergencyName"
                      value={formData.emergencyName}
                      onChange={handleChange}
                      placeholder="Contact Person Name"
                      className="flex-1 uppercase border border-slate-300 rounded px-1 py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-20 font-bold uppercase">Relation:</span>
                    <input
                      type="text"
                      required
                      name="emergencyRelationship"
                      value={formData.emergencyRelationship}
                      onChange={handleChange}
                      placeholder="Father / Brother / Uncle"
                      className="flex-1 border border-slate-300 rounded px-1 py-0.5"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-20 font-bold uppercase">Phone:</span>
                    <input
                      type="tel"
                      required
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      placeholder="03XX-XXXXXXX"
                      className="flex-1 font-mono border border-slate-300 rounded px-1 py-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Academic Record */}
            <div className="border border-slate-400 rounded overflow-hidden">
              <div className="bg-slate-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 flex items-center gap-1">
                <BookOpen className="w-3 h-3 text-emerald-400" />
                <span>4. Academic Record & Qualifications</span>
              </div>
              <div className="academic-scroll p-1">
                <table className="w-full text-left border-collapse border border-slate-300 text-[8px]">
                  <thead className="bg-slate-100 font-bold border-b border-slate-300 uppercase">
                    <tr>
                      <th className="p-1 border-r border-slate-300 w-[24%]">Certificate / Level</th>
                      <th className="p-1 border-r border-slate-300 w-[30%]">Institute & Board</th>
                      <th className="p-1 border-r border-slate-300 text-center w-[10%]">Passing Year</th>
                      <th className="p-1 border-r border-slate-300 text-center w-[12%]">Marks (Obt / Tot)</th>
                      <th className="p-1 border-r border-slate-300 text-center w-[12%] bg-emerald-50 text-emerald-900">Auto %</th>
                      <th className="p-1 text-center w-[12%]">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {/* Matric */}
                    <tr>
                      <td className="p-1 border-r border-slate-300 font-semibold bg-slate-50">Matriculation (SSC) *</td>
                      <td className="p-1 border-r border-slate-300 space-y-0.5">
                        <input
                          type="text"
                          required
                          name="sscInstitute"
                          value={formData.sscInstitute}
                          onChange={handleChange}
                          placeholder="School Name"
                          className="w-full p-0.5 border border-slate-300 rounded text-[8px]"
                        />
                        <select
                          name="sscBoard"
                          value={formData.sscBoard}
                          onChange={handleChange}
                          className="w-full p-0.5 border border-slate-300 rounded text-[7.5px] bg-white"
                        >
                          <option value="">Select Board</option>
                          {SINDH_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </td>
                      <td className="p-1 border-r border-slate-300 text-center">
                        <input
                          type="number"
                          required
                          name="sscYear"
                          value={formData.sscYear}
                          onChange={handleChange}
                          placeholder="YYYY"
                          className="w-full p-0.5 text-center border border-slate-300 rounded text-[8px]"
                        />
                      </td>
                      <td className="p-1 border-r border-slate-300">
                        <div className="flex gap-0.5 items-center">
                          <input
                            type="number"
                            name="sscObtainedMarks"
                            value={formData.sscObtainedMarks}
                            onChange={(e) => handleMarksChange('ssc', 'ObtainedMarks', e.target.value)}
                            placeholder="Obt"
                            className="w-1/2 p-0.5 text-center border border-slate-300 rounded text-[8px]"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            name="sscTotalMarks"
                            value={formData.sscTotalMarks}
                            readOnly
                            className="w-1/2 p-0.5 text-center bg-slate-100 border border-slate-300 rounded text-[8px] font-bold"
                          />
                        </div>
                      </td>
                      <td className="p-1 border-r border-slate-300 text-center font-bold text-emerald-800 bg-emerald-50/50">
                        {formData.sscPercentage || '0.00%'}
                      </td>
                      <td className="p-1 text-center">
                        <input
                          type="text"
                          required
                          name="sscGrade"
                          value={formData.sscGrade}
                          onChange={handleChange}
                          placeholder="Grade"
                          className="w-full p-0.5 text-center font-bold border border-slate-300 rounded text-[8px]"
                        />
                      </td>
                    </tr>

                    {/* Inter */}
                    <tr>
                      <td className="p-1 border-r border-slate-300 font-semibold bg-slate-50">Intermediate (HSSC) *</td>
                      <td className="p-1 border-r border-slate-300 space-y-0.5">
                        <input
                          type="text"
                          required
                          name="hsscInstitute"
                          value={formData.hsscInstitute}
                          onChange={handleChange}
                          placeholder="College Name"
                          className="w-full p-0.5 border border-slate-300 rounded text-[8px]"
                        />
                        <select
                          name="hsscBoard"
                          value={formData.hsscBoard}
                          onChange={handleChange}
                          className="w-full p-0.5 border border-slate-300 rounded text-[7.5px] bg-white"
                        >
                          <option value="">Select Board</option>
                          {SINDH_BOARDS.map(b => <option key={b} value={b}>{b}</option>)}
                        </select>
                      </td>
                      <td className="p-1 border-r border-slate-300 text-center">
                        <input
                          type="number"
                          required
                          name="hsscYear"
                          value={formData.hsscYear}
                          onChange={handleChange}
                          placeholder="YYYY"
                          className="w-full p-0.5 text-center border border-slate-300 rounded text-[8px]"
                        />
                      </td>
                      <td className="p-1 border-r border-slate-300">
                        <div className="flex gap-0.5 items-center">
                          <input
                            type="number"
                            name="hsscObtainedMarks"
                            value={formData.hsscObtainedMarks}
                            onChange={(e) => handleMarksChange('hssc', 'ObtainedMarks', e.target.value)}
                            placeholder="Obt"
                            className="w-1/2 p-0.5 text-center border border-slate-300 rounded text-[8px]"
                          />
                          <span>/</span>
                          <input
                            type="number"
                            name="hsscTotalMarks"
                            value={formData.hsscTotalMarks}
                            readOnly
                            className="w-1/2 p-0.5 text-center bg-slate-100 border border-slate-300 rounded text-[8px] font-bold"
                          />
                        </div>
                      </td>
                      <td className="p-1 border-r border-slate-300 text-center font-bold text-emerald-800 bg-emerald-50/50">
                        {formData.hsscPercentage || '0.00%'}
                      </td>
                      <td className="p-1 text-center">
                        <input
                          type="text"
                          required
                          name="hsscGrade"
                          value={formData.hsscGrade}
                          onChange={handleChange}
                          placeholder="Grade"
                          className="w-full p-0.5 text-center font-bold border border-slate-300 rounded text-[8px]"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. Documents Check & Declaration */}
            <div className="border border-slate-400 rounded overflow-hidden">
              <div className="bg-slate-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 flex justify-between">
                <span>5. Required Documents (Attested Copies) & Undertaking</span>
                <span className="text-[7px] text-emerald-300">Mandatory</span>
              </div>
              <div className="p-1.5 space-y-1 text-[7.5px] leading-tight text-slate-800">
                <div className="documents-grid grid grid-cols-3 gap-1">
                  <span className="flex items-center gap-1">☑ SSC Marks Sheet / Pass Cert</span>
                  <span className="flex items-center gap-1">☑ HSSC Marks Sheet / Pass Cert</span>
                  <span className="flex items-center gap-1">☑ Domicile & PRC Form-D</span>
                  <span className="flex items-center gap-1">☑ Candidate CNIC / Form-B</span>
                  <span className="flex items-center gap-1">☑ Guardian CNIC Copy</span>
                  <span className="flex items-center gap-1">☑ 02 Passport Size Photos</span>
                </div>

                <div className="pt-1 border-t border-slate-200">
                  <p className="text-[7.5px] text-slate-700 leading-none">
                    <strong>Declaration:</strong> I solemnly declare that all particulars entered are correct. If any detail is found incorrect, my admission may be canceled. I will adhere strictly to college rules & attendance.
                  </p>
                  <label className="flex items-center gap-1.5 font-bold text-slate-950 mt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      required
                      name="undertaking"
                      checked={formData.undertaking}
                      onChange={handleChange}
                      className="w-3 h-3 text-emerald-700"
                    />
                    <span>I solemnly accept and agree to all admission rules and terms. *</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Signature Section */}
            <div className="pt-4 pb-1">
              <div className="signature-grid grid grid-cols-3 gap-6 text-center text-[8px] font-bold text-slate-900">
                <div className="border-t border-slate-800 pt-1">Candidate Signature</div>
                <div className="border-t border-slate-800 pt-1">Parent / Guardian Signature</div>
                <div className="border-t border-slate-800 pt-1">Principal Signature & Stamp</div>
              </div>
            </div>

            {/* Screen View Button */}
            <div className="print:hidden pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2.5 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                Submit & Prepare Print Form
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}