import React, { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AlignmentType, Document, HeadingLevel, Packer, PageOrientation, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import { db } from '../../firebase/firebase';
import logoImg from '../../assets/logo.png';
import AdmissionForm from './admissionform';

const getDisplayValue = (value) => {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    if (value && typeof value === 'object' && typeof value.toDate === 'function') {
        return value.toDate().toLocaleString();
    }
    if (value === null || value === undefined || value === '') return 'N/A';
    return String(value);
};

const getAdmissionRows = (application) => Object.entries(application)
    .filter(([key]) => key !== 'id')
    .map(([key, value]) => [key, getDisplayValue(value)]);

const getFileName = (application, extension) => {
    const identifier = application.cnic || application.candidateNo || application.id || 'application';
    const cleanIdentifier = String(identifier).replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${cleanIdentifier}_GECE_Admission.${extension}`;
};

const getGenderGroup = (gender) => {
    const normalizedGender = String(gender || '').trim().toLowerCase();
    if (['female', 'f', 'girl', 'girls'].includes(normalizedGender)) return 'Girls';
    if (['male', 'm', 'boy', 'boys'].includes(normalizedGender)) return 'Boys';
    return 'Other';
};

const meritListHeaders = ['Sr. No.', 'Roll #', 'Name', "Father's Name", 'Gender', 'Date of Birth', 'Domicile', 'HSC Marks', 'HSC Grade', 'HSC %', '50% of HSC', 'Entry Test Marks 50', 'Total %', 'Age on 27-11-2024'];

const getMeritListRows = (records) => records.map((application, index) => {
    const hscPercentage = Number.parseFloat(application.hsscPercentage) || 0;
    const hscHalf = Number.isFinite(hscPercentage) ? (hscPercentage / 2).toFixed(2) : '0.00';
    const entryTestMarks = application.entryTestMarks || application.entryTestScore || application.testMarks || '';
    const totalPercentage = application.totalPercentage || application.meritPercentage || (entryTestMarks ? (Number(hscHalf) + Number(entryTestMarks)).toFixed(2) : '');
    return [
        String(index + 1),
        getDisplayValue(application.rollNo || application.candidateNo || application.id),
        getDisplayValue(application.fullName),
        getDisplayValue(application.parentFullName),
        getGenderGroup(application.gender),
        `${getDisplayValue(application.dobDay)} ${getDisplayValue(application.dobMonth)} ${getDisplayValue(application.dobYear)}`,
        getDisplayValue(application.domicileCity),
        getDisplayValue(application.hsscObtainedMarks),
        getDisplayValue(application.hsscGrade),
        getDisplayValue(application.hsscPercentage),
        hscHalf,
        getDisplayValue(entryTestMarks),
        getDisplayValue(totalPercentage),
        getDisplayValue(application.age || application.ageOnDate)
    ];
});

const getListFileBaseName = (genderGroup) => `GECE_Merit_List_${genderGroup || 'All'}_${new Date().toISOString().slice(0, 10)}`;

const downloadAdmissionListWord = async (records, title, fileName) => {
    const rows = getMeritListRows(records);
    const cell = (text, bold = false) => new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text, bold, size: 16 })] })]
    });
    const table = new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
            new TableRow({ children: meritListHeaders.map(header => cell(header, true)) }),
            ...rows.map(row => new TableRow({ children: row.map(value => cell(value)) }))
        ]
    });
    const document = new Document({
        sections: [{
            properties: { page: { size: { orientation: PageOrientation.LANDSCAPE }, margin: { top: 720, right: 540, bottom: 720, left: 540 } } },
            children: [
                new Paragraph({ text: 'GOVERNMENT ELEMENTARY COLLEGE OF EDUCATION', heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: 'MITHI, DISTRICT THARPARKAR, SINDH', alignment: AlignmentType.CENTER }),
                new Paragraph({ text: title, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
                new Paragraph({ text: `Total candidates: ${records.length}`, alignment: AlignmentType.CENTER }),
                table
            ]
        }]
    });
    saveAs(await Packer.toBlob(document), fileName);
};

const downloadAdmissionListPdf = async (records, title, fileName) => {
    const document = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const pageWidth = document.internal.pageSize.getWidth();
    try {
        const logoData = await loadImageData(logoImg);
        document.addImage(logoData, 'PNG', 14, 8, 18, 18);
    } catch (imageError) {
        console.warn('Merit list PDF logo could not be loaded:', imageError);
    }
    document.setFont('helvetica', 'bold');
    document.setFontSize(12);
    document.text('GOVERNMENT OF SINDH', pageWidth / 2, 10, { align: 'center' });
    document.setFontSize(9);
    document.text('SCHOOL EDUCATION & LITERACY DEPARTMENT', pageWidth / 2, 15, { align: 'center' });
    document.text('TEACHERS TRAINING INSTITUTIONS SINDH, HYDERABAD', pageWidth / 2, 20, { align: 'center' });
    document.text('GOVERNMENT ELEMENTARY COLLEGE OF EDUCATION (M/W) MITHI THARPARKAR', pageWidth / 2, 25, { align: 'center' });
    document.setFontSize(11);
    document.text(`MERIT LIST B.ED (HONS) ELEMENTARY 2025-26 (${title.replace('ADMISSION LIST - ', '')})`, pageWidth / 2, 32, { align: 'center' });
    autoTable(document, {
        startY: 36,
        head: [meritListHeaders],
        body: getMeritListRows(records),
        theme: 'grid',
        styles: { fontSize: 5.5, cellPadding: 1.2, halign: 'center', valign: 'middle', lineColor: [0, 0, 0], lineWidth: 0.2 },
        headStyles: { fontSize: 5.5, fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: { 0: { cellWidth: 9 }, 1: { cellWidth: 13 }, 2: { cellWidth: 25 }, 3: { cellWidth: 27 }, 4: { cellWidth: 13 }, 5: { cellWidth: 19 }, 6: { cellWidth: 20 }, 7: { cellWidth: 14 }, 8: { cellWidth: 13 }, 9: { cellWidth: 11 }, 10: { cellWidth: 14 }, 11: { cellWidth: 17 }, 12: { cellWidth: 13 }, 13: { cellWidth: 18 } },
        margin: { left: 10, right: 10 }
    });
    document.save(fileName);
};

const loadImageData = (url) => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    }));

const AdmissionManagement = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [admissionActive, setAdmissionActive] = useState(false);
    const [savingStatus, setSavingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [pendingDelete, setPendingDelete] = useState(null);
    const [previewApplication, setPreviewApplication] = useState(null);

    const fetchApplications = async () => {
        setLoading(true);
        setError('');
        try {
            const snapshot = await getDocs(collection(db, 'admissions'));
            const records = snapshot.docs.map(applicationDoc => ({
                id: applicationDoc.id,
                ...applicationDoc.data()
            }));
            records.sort((first, second) => {
                const firstTime = first.submittedAt?.toDate?.()?.getTime?.() || 0;
                const secondTime = second.submittedAt?.toDate?.()?.getTime?.() || 0;
                return secondTime - firstTime;
            });
            setApplications(records);
        } catch (fetchError) {
            console.error('Error fetching admission applications:', fetchError);
            setError('Admission records could not be loaded.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmissionStatus = async () => {
        try {
            const statusSnapshot = await getDoc(doc(db, 'settings', 'admission_form'));
            setAdmissionActive(statusSnapshot.exists() && statusSnapshot.data()?.isActive === true);
        } catch (statusError) {
            console.error('Error fetching admission form status:', statusError);
        }
    };

    const toggleAdmissionStatus = async () => {
        setSavingStatus(true);
        try {
            const nextStatus = !admissionActive;
            await setDoc(doc(db, 'settings', 'admission_form'), {
                isActive: nextStatus,
                updatedAt: new Date()
            }, { merge: true });
            setAdmissionActive(nextStatus);
            setStatusMessage(nextStatus ? 'Admission form activated successfully.' : 'Admission form deactivated successfully.');
            window.setTimeout(() => setStatusMessage(''), 3000);
        } catch (statusError) {
            console.error('Error updating admission form status:', statusError);
            setStatusMessage('Admission form status could not be updated.');
            window.setTimeout(() => setStatusMessage(''), 3000);
        } finally {
            setSavingStatus(false);
        }
    };

    useEffect(() => {
        fetchApplications();
        fetchAdmissionStatus();
        const refreshTimer = window.setInterval(fetchApplications, 30000);
        return () => window.clearInterval(refreshTimer);
    }, []);

    const deleteApplication = async () => {
        if (!pendingDelete) return;
        try {
            await deleteDoc(doc(db, 'admissions', pendingDelete.id));
            setApplications(current => current.filter(application => application.id !== pendingDelete.id));
            setStatusMessage('Application deleted from Firebase successfully.');
        } catch (deleteError) {
            console.error('Error deleting admission application:', deleteError);
            setStatusMessage('Application could not be deleted.');
        } finally {
            setPendingDelete(null);
            window.setTimeout(() => setStatusMessage(''), 3000);
        }
    };

    const createLegacyApplicationPdf = async (application) => {
        if (application?.id || application?.candidateNo || application?.cnic) {
            setPreviewApplication(application);
            return;
        }

        const document = new jsPDF();
        const pageWidth = document.internal.pageSize.getWidth();
        const drawHeader = (pageTitle) => {
            document.setFillColor(0, 77, 0);
            document.rect(12, 10, pageWidth - 24, 22, 'F');
            document.setTextColor(255, 255, 255);
            document.setFontSize(14);
            document.setFont('helvetica', 'bold');
            document.text('GOVERNMENT ELEMENTARY COLLEGE OF EDUCATION', pageWidth / 2, 19, { align: 'center' });
            document.setFontSize(8);
            document.text('MITHI, DISTRICT THARPARKAR, SINDH', pageWidth / 2, 26, { align: 'center' });
            document.setTextColor(0, 0, 0);
            document.setFontSize(12);
            document.text(pageTitle, pageWidth / 2, 42, { align: 'center' });
            document.setFontSize(8);
            document.text(`Application ID: ${getDisplayValue(application.candidateNo)}`, 14, 49);
        };

        try {
            const logoData = await loadImageData(logoImg);
            document.addImage(logoData, 'PNG', 16, 13, 16, 16);
        } catch (imageError) {
            console.warn('Admission PDF logo could not be loaded:', imageError);
        }

        drawHeader('ADMISSION APPLICATION FORM - PAGE 1');
        document.setFontSize(10);
        document.setFont('helvetica', 'bold');
        document.text('1. CANDIDATE PERSONAL DETAILS', 14, 59);
        autoTable(document, {
            startY: 63,
            head: [['Field', 'Submitted Data']],
            body: [
                ['Candidate Name', getDisplayValue(application.fullName)],
                ['Date of Birth', `${getDisplayValue(application.dobDay)} ${getDisplayValue(application.dobMonth)} ${getDisplayValue(application.dobYear)}`],
                ['CNIC / Form-B', getDisplayValue(application.cnic)],
                ['Gender', getDisplayValue(application.gender)],
                ['Domicile', getDisplayValue(application.domicileCity)],
                ['City / Village', getDisplayValue(application.candidateCityVillage)],
                ['Country', getDisplayValue(application.candidateCountry)],
                ['Religion', getDisplayValue(application.religion)],
                ['Email', getDisplayValue(application.email)],
                ['Contact Number', getDisplayValue(application.contactNumber)],
                ['Postal Address', getDisplayValue(application.postalAddress)],
                ['Permanent Address', getDisplayValue(application.permanentAddress)]
            ],
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [0, 77, 0] },
            columnStyles: { 0: { cellWidth: 58 }, 1: { cellWidth: 125 } }
        });

        let nextY = document.lastAutoTable.finalY + 10;
        document.setFontSize(10);
        document.setFont('helvetica', 'bold');
        document.text('2. PARENT / GUARDIAN AND EMERGENCY DETAILS', 14, nextY);
        autoTable(document, {
            startY: nextY + 4,
            head: [['Field', 'Submitted Data']],
            body: [
                ['Guardian Name', getDisplayValue(application.parentFullName)],
                ['Guardian CNIC', getDisplayValue(application.parentCnic)],
                ['Guardian Contact', getDisplayValue(application.parentContact)],
                ['Guardian Occupation', getDisplayValue(application.parentOccupation)],
                ['Emergency Name', getDisplayValue(application.emergencyName)],
                ['Emergency Relationship', getDisplayValue(application.emergencyRelationship)],
                ['Emergency Contact', getDisplayValue(application.emergencyContact)]
            ],
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [0, 77, 0] },
            columnStyles: { 0: { cellWidth: 58 }, 1: { cellWidth: 125 } }
        });

        document.addPage();
        drawHeader('ADMISSION APPLICATION FORM - PAGE 2');
        document.setFontSize(10);
        document.setFont('helvetica', 'bold');
        document.text('3. ACADEMIC RECORD AND QUALIFICATIONS', 14, 59);
        autoTable(document, {
            startY: 63,
            head: [['Qualification', 'Institute', 'Board', 'Year', 'Obtained', 'Total', '%', 'Grade']],
            body: [
                ['Matriculation / SSC', application.sscInstitute, application.sscBoard, application.sscYear, application.sscObtainedMarks, application.sscTotalMarks, application.sscPercentage, application.sscGrade],
                ['Intermediate / HSSC', application.hsscInstitute, application.hsscBoard, application.hsscYear, application.hsscObtainedMarks, application.hsscTotalMarks, application.hsscPercentage, application.hsscGrade],
                ['Other Qualification', application.otherInstitute, '', application.otherYear, application.otherObtainedMarks, application.otherTotalMarks, application.otherPercentage, application.otherGrade]
            ].map(row => row.map(getDisplayValue)),
            styles: { fontSize: 7, cellPadding: 2 },
            headStyles: { fillColor: [0, 77, 0] },
            columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 32 }, 2: { cellWidth: 28 }, 3: { cellWidth: 17 }, 4: { cellWidth: 18 }, 5: { cellWidth: 18 }, 6: { cellWidth: 16 }, 7: { cellWidth: 16 } }
        });

        nextY = document.lastAutoTable.finalY + 12;
        document.setFontSize(10);
        document.text('4. SUBMISSION STATUS', 14, nextY);
        autoTable(document, {
            startY: nextY + 4,
            head: [['Document / Declaration', 'Status']],
            body: [
                ['SSC Certificate', getDisplayValue(application.checkSsc)],
                ['HSSC Certificate', getDisplayValue(application.checkHssc)],
                ['Applicant CNIC', getDisplayValue(application.checkCnicApplicant)],
                ['Parent CNIC', getDisplayValue(application.checkCnicParent)],
                ['Photographs', getDisplayValue(application.checkPhotos)],
                ['Domicile', getDisplayValue(application.checkDomicile)],
                ['Undertaking Accepted', getDisplayValue(application.undertaking)]
            ],
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [0, 77, 0] },
            columnStyles: { 0: { cellWidth: 100 }, 1: { cellWidth: 83 } }
        });

        document.setFontSize(9);
        document.text('Candidate Signature: ____________________', 20, 270);
        document.text('Guardian Signature: ____________________', 115, 270);
        document.save(getFileName(application, 'pdf'));
    };

    const downloadApplicationWord = (application) => {
        const rows = getAdmissionRows(application).map(([field, value]) => new TableRow({
            children: [new TableCell({ children: [new Paragraph({ text: field })] }), new TableCell({ children: [new Paragraph({ text: value })] })]
        }));
        const document = new Document({
            sections: [{
                children: [
                    new Paragraph({ text: 'GOVERNMENT ELEMENTARY COLLEGE OF EDUCATION', heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: 'ADMISSION APPLICATION FORM', heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
                    new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows })
                ]
            }]
        });
        Packer.toBlob(document).then(blob => saveAs(blob, getFileName(application, 'docx')));
    };

    const downloadAllWord = (genderGroup = null) => {
        const records = genderGroup ? applications.filter(application => getGenderGroup(application.gender) === genderGroup) : applications;
        const title = `ADMISSION LIST - ${genderGroup || 'ALL CANDIDATES'}`;
        downloadAdmissionListWord(records, title, `${getListFileBaseName(genderGroup)}.docx`);
    };

    const downloadAllPdf = (genderGroup = null) => {
        const records = genderGroup ? applications.filter(application => getGenderGroup(application.gender) === genderGroup) : applications;
        const title = `ADMISSION LIST - ${genderGroup || 'ALL CANDIDATES'}`;
        downloadAdmissionListPdf(records, title, `${getListFileBaseName(genderGroup)}.pdf`);
    };

    if (previewApplication) {
        return <AdmissionForm application={previewApplication} />;
    }

    return (
        <div className="space-y-6 animate-fade-in w-full">
            <div className="bg-[#004d00] px-6 py-4 rounded-lg border-b border-[#ffd200] flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Admission Applications</h3>
                    <p className="text-[10px] text-[#ffd200] mt-1">{applications.length} submitted application(s)</p>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-center gap-3 sm:min-w-[520px]">
                    <button
                        onClick={toggleAdmissionStatus}
                        disabled={savingStatus}
                        className="px-3 py-2 rounded font-bold text-xs border-2 border-red-700 bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {savingStatus ? 'Saving...' : admissionActive ? 'Deactivate Admission Form' : 'Activate Admission Form'}
                    </button>
                    <div className="flex max-w-full flex-col items-center gap-2">
                        <div className="flex flex-wrap justify-center gap-2">
                            <button onClick={() => downloadAllWord()} disabled={!applications.length} className="bg-[#ffd200] text-[#004d00] px-3 py-2 rounded font-bold text-xs disabled:opacity-50">
                                All List Word
                            </button>
                            <button onClick={() => downloadAllPdf()} disabled={!applications.length} className="bg-gray-700 text-white px-3 py-2 rounded font-bold text-xs disabled:opacity-50">
                                All List PDF
                            </button>
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button onClick={() => downloadAllWord('Boys')} disabled={!applications.some(application => getGenderGroup(application.gender) === 'Boys')} className="bg-blue-600 text-white px-3 py-2 rounded font-bold text-xs disabled:opacity-50">
                                Boys List Word
                            </button>
                            <button onClick={() => downloadAllPdf('Boys')} disabled={!applications.some(application => getGenderGroup(application.gender) === 'Boys')} className="bg-blue-800 text-white px-3 py-2 rounded font-bold text-xs disabled:opacity-50">
                                Boys List PDF
                            </button>
                            <button onClick={() => downloadAllWord('Girls')} disabled={!applications.some(application => getGenderGroup(application.gender) === 'Girls')} className="bg-pink-600 text-white px-3 py-2 rounded font-bold text-xs disabled:opacity-50">
                                Girls List Word
                            </button>
                            <button onClick={() => downloadAllPdf('Girls')} disabled={!applications.some(application => getGenderGroup(application.gender) === 'Girls')} className="bg-pink-800 text-white px-3 py-2 rounded font-bold text-xs disabled:opacity-50">
                                Girls List PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {statusMessage && (
                <div className="fixed right-4 bottom-4 z-50 rounded-lg border-2 border-[#ffd200] bg-[#004d00] px-5 py-3 text-sm font-bold text-white shadow-2xl">
                    {statusMessage}
                </div>
            )}

            {loading && <p className="p-8 text-center text-gray-500">Loading admission applications...</p>}
            {error && <p className="p-4 rounded border border-red-200 bg-red-50 text-red-700 text-sm">{error}</p>}
            {!loading && !error && applications.length === 0 && (
                <p className="p-8 text-center text-gray-500 border rounded-lg">No admission applications found.</p>
            )}

            <div className="space-y-4">
                {applications.map(application => (
                    <details key={application.id} className="bg-white rounded-lg border-2 border-[#ffd200] shadow-md overflow-hidden">
                        <summary className="cursor-pointer list-none p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-yellow-50">
                            <div>
                                <p className="font-bold text-[#004d00]">{getDisplayValue(application.fullName)}</p>
                                <p className="text-xs text-gray-500">CNIC: {getDisplayValue(application.cnic)} | Application ID: {getDisplayValue(application.candidateNo)}</p>
                            </div>
                            <div className="flex gap-2" onClick={(event) => event.preventDefault()}>
                                <button onClick={() => createLegacyApplicationPdf(application)} className="bg-red-600 text-white px-3 py-2 rounded text-xs font-bold hover:bg-red-700">
                                    Download Filled PDF
                                </button>
                                <button onClick={() => downloadApplicationWord(application)} className="bg-green-700 text-white px-3 py-2 rounded text-xs font-bold hover:bg-green-800">
                                    Word Form
                                </button>
                                <button
                                    onClick={(event) => { event.stopPropagation(); setPendingDelete(application); }}
                                    className="bg-red-700 text-white px-3 py-2 rounded text-xs font-bold hover:bg-red-800"
                                >
                                    Delete
                                </button>
                            </div>
                        </summary>
                        <div className="p-4 border-t bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {getAdmissionRows(application).map(([field, value]) => (
                                <div key={field} className="bg-white border rounded p-3">
                                    <p className="text-[10px] font-bold uppercase text-gray-500">{field}</p>
                                    <p className="text-sm text-gray-800 break-words">{value}</p>
                                </div>
                            ))}
                        </div>
                    </details>
                ))}
            </div>

            {pendingDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
                    <div className="w-full max-w-sm rounded-xl border-2 border-red-500 bg-white p-6 shadow-2xl">
                        <h4 className="text-lg font-extrabold text-gray-900">Delete Application?</h4>
                        <p className="mt-2 text-sm text-gray-600">
                            Delete {getDisplayValue(pendingDelete.fullName)} permanently from Firebase?
                        </p>
                        <div className="mt-5 flex justify-end gap-3">
                            <button onClick={() => setPendingDelete(null)} className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={deleteApplication} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700">
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdmissionManagement;
