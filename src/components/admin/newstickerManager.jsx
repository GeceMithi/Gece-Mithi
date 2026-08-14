import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

const NewsTickerManager = () => {
    const [text, setText] = useState('');
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const q = query(collection(db, 'newsTicker'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snapshot) => {
            const list = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setItems(list);
        }, (err) => {
            console.error('newsTicker onSnapshot error', err);
        });

        return () => unsub();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setLoading(true);
        try {
            await addDoc(collection(db, 'newsTicker'), { text: text.trim(), createdAt: serverTimestamp() });
            setText('');
        } catch (err) {
            console.error('Failed to add ticker item', err);
            alert('Failed to add item: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this ticker item?')) return;
        try {
            await deleteDoc(doc(db, 'newsTicker', id));
        } catch (err) {
            console.error('Failed to delete ticker item', err);
            alert('Delete failed: ' + err.message);
        }
    };

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold text-[#004d00] mb-3">News Ticker Manager</h3>
            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ticker message..." className="flex-1 p-2 border rounded" />
                <button type="submit" disabled={loading} className="bg-[#004d00] text-white px-4 py-2 rounded font-bold">{loading ? 'Adding...' : 'Add'}</button>
            </form>

            <div className="space-y-2">
                {items.length === 0 ? (
                    <div className="text-sm text-gray-500">No ticker items yet.</div>
                ) : (
                    items.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 border rounded">
                            <div className="text-sm text-gray-800">{item.text}</div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold">Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NewsTickerManager;
