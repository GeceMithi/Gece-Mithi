import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

// === ICONS ===
const Icons = {
    Search: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    GradCap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 0 6 2.5 6 5s3-5 6-5v-5"></path></svg>,
    ChevronDown: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>,
    ChevronUp: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
};

// === BATCHES DATA ===
// All batch data is loaded dynamically from Firestore. No static batch fallback is included.

// === BATCHES COMPONENT ===
const Batches = () => {
    const [activeBatch, setActiveBatch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [remoteBatchesData, setRemoteBatchesData] = useState({});
    const [loading, setLoading] = useState(true);

    const toggleBatch = (year) => {
        if (activeBatch === year) {
            setActiveBatch(null);
        } else {
            setActiveBatch(year);
        }
    };

    const normalizeYearId = (yearId) => {
        const raw = String(yearId || '').trim();
        const match2k = /^2k(\d{2})$/i.exec(raw);
        if (match2k) return `20${match2k[1]}`;
        if (/^\d{4}$/.test(raw)) return raw;
        return null;
    };

    const displayBatchYear = (year) => {
        const normalized = normalizeYearId(year);
        if (normalized && normalized.length === 4 && normalized.startsWith('20')) {
            return `2k${normalized.slice(2)}`;
        }
        return year;
    };

    useEffect(() => {

        const fetchRemoteBatches = async () => {
            setLoading(true);
            try {
                const snap = await getDocs(collection(db, 'batches'));
                const remote = {};

                console.log('[Batches] Firestore batches docs:', snap.docs.map(d => d.id));

                snap.forEach((d) => {
                    const normalizedYear = normalizeYearId(d.id);
                    const numericYear = Number(normalizedYear);

                    if (normalizedYear && Number.isFinite(numericYear) && numericYear >= 2012) {
                        remote[normalizedYear] = d.data()?.students || [];
                    }
                });

                console.log('[Batches] Filtered years:', Object.keys(remote));

                setRemoteBatchesData(remote);
            } catch (e) {
                console.error('Error fetching batches:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchRemoteBatches();
    }, []);

    const effectiveBatchesData = remoteBatchesData;

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
            <h2 className="text-3xl font-extrabold text-[#004d00] mb-8 text-center uppercase tracking-wide flex items-center justify-center gap-3">
                <Icons.GradCap /> Batches Students History (2k12 to Current)
            </h2>

            {loading ? (
                <div className="flex flex-col items-center justify-center min-h-[30vh] text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#004d00] border-t-transparent mb-6"></div>
                    <p className="text-lg font-semibold text-[#004d00]">Loading batch data...</p>
                    <p className="text-sm text-gray-600 mt-2">Please wait while student records are loaded</p>
                </div>
            ) : (
                <>
                    <div className="sticky top-20 z-40 bg-white p-4 rounded-lg shadow-md border border-[#ffd200] mb-8 max-w-xl mx-auto flex items-center gap-3">
                        <div className="text-gray-400"><Icons.Search /></div>
                        <input
                            type="text"
                            placeholder="Search any student by Name..."
                            className="w-full bg-transparent text-gray-700 outline-none font-medium placeholder-gray-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="space-y-4">
                        {Object.keys(effectiveBatchesData).length === 0 ? (
                            <div className="bg-white rounded-lg border border-[#ffd200] shadow-sm p-8 text-center text-gray-600">
                                No batch data found. Please try again later.
                            </div>
                        ) : (
                            Object.keys(effectiveBatchesData)
                                .sort((a, b) => Number(b) - Number(a))
                                .map((year) => {
                                    const students = (effectiveBatchesData[year] || [])
                                        .filter((s) =>
                                            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                            s.fname.toLowerCase().includes(searchTerm.toLowerCase())
                                        )
                                        .sort((a, b) => a.name.localeCompare(b.name));

                                    if (students.length === 0 && searchTerm) return null;

                                    const isOpen = activeBatch === year || searchTerm.length > 0;

                                    return (
                                        <div key={year} className="bg-[#004d00] rounded-lg shadow-sm overflow-hidden border border-[#ffd200] mb-4">
                                            <button
                                                onClick={() => toggleBatch(year)}
                                                className="w-full flex items-center justify-between p-5 text-left transition-colors bg-[#004d00] text-white hover:bg-[#003d00]"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="p-2 rounded-full bg-white/10 text-yellow-400">
                                                        <Icons.GradCap />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-bold text-lg text-white">BATCH {displayBatchYear(year)}</h3>
                                                        <p className="text-xs text-green-200">{students.length} Students</p>
                                                    </div>
                                                </div>
                                                <div className="text-white">
                                                    {isOpen ? <Icons.ChevronUp /> : <Icons.ChevronDown />}
                                                </div>
                                            </button>

                                            {isOpen && (
                                                <div className="p-6 bg-gray-50 border-t border-gray-100">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                        {students.map((student, index) => (
                                                            <div key={index} className="bg-white border border-[#ffd200] rounded-lg overflow-hidden flex flex-col shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 h-full transform">
                                                                <div className="p-5 flex-1 text-center flex flex-col items-center justify-center">
                                                                    <h4 className="font-bold text-gray-900 text-lg mb-1">{student.name}</h4>
                                                                    <p className="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wider bg-gray-100 px-2 py-0.5 rounded-full">
                                                                        {student.status || 'STUDENT'}
                                                                    </p>
                                                                    {student.fname && (
                                                                        <p className="text-sm text-gray-600 font-medium">
                                                                            {student.rel || 'S/o'} {student.fname}
                                                                        </p>
                                                                    )}
                                                                    {student.surname && (
                                                                        <p className="text-sm text-[#004d00] font-extrabold uppercase mt-1 tracking-wide">
                                                                            {student.surname}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div className="bg-[#004d00] text-white text-xs font-bold text-center py-2 uppercase tracking-wide mt-auto">
                                                                    BATCH {displayBatchYear(year)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Batches;