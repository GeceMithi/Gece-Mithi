import React, { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import PastPaperSection from '../academic/PastPaperSection';

const PastPaper = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPastPapers = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, 'academic_data'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);

                const papers = snapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        const category = String(data.category || data.type || '').toLowerCase();
                        const isPastPaper = category === 'past-papers' || category === 'past_paper';

                        if (!isPastPaper) return null;

                        const part = Number(data.part ?? data.year ?? 1);
                        const semester = Number(data.semester ?? 1);

                        return {
                            id: doc.id,
                            title: data.title || `Past Paper Part ${part} Semester ${semester}`,
                            description: '',
                            part,
                            semester,
                            fileUrl: data.fileUrl || data.url || '',
                            link: data.fileUrl || data.url || '',
                            createdAt: data.createdAt,
                        };
                    })
                    .filter(Boolean)
                    .sort((a, b) => a.part - b.part || a.semester - b.semester);

                const grouped = papers.reduce((acc, paper) => {
                    const partKey = `Part ${paper.part}`;
                    if (!acc[partKey]) {
                        acc[partKey] = {
                            part: paper.part,
                            partTitle: partKey,
                            items: [],
                        };
                    }

                    acc[partKey].items.push(paper);
                    return acc;
                }, {});

                setSections(Object.values(grouped));
            } catch (error) {
                console.error('Error fetching past papers from Firebase:', error);
                setSections([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPastPapers();
    }, []);

    return (
        <div className="content-entry-animation">
            <div className="text-center mb-12 pt-6">
                <h1 className="text-4xl font-extrabold text-yellow-500 tracking-tighter content-entry-animation sm:text-5xl">
                    Welcome to <span className="text-green-700"> B.Ed. (Hons)</span>
                </h1>
                <br />
                <h2 className="text-1xl md:text-2xl font-extrabold text-gray-800 tracking-tight mb-4">
                    Past Examination Papers
                </h2>
                <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4">
                    Access previous year question papers for all B.Ed (Hons) subjects across 8 semesters.
                </p>
            </div>

            {loading ? (
                <div className="text-center text-gray-600 py-10">Loading past papers...</div>
            ) : sections.length === 0 ? (
                <div className="text-center text-gray-600 py-10">No past papers uploaded yet.</div>
            ) : (
                <PastPaperSection sections={sections} />
            )}
        </div>
    );
};

export default PastPaper;