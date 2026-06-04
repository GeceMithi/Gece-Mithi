import React, { useState } from 'react';
import BatchDropdown from './BatchDropdown';

const BatchSection = ({ batchesData = {}, onCreateBatch, onStatusUpdate }) => {
  const [activeBatch, setActiveBatch] = useState(null);
  const [newBatchYear, setNewBatchYear] = useState('');

  const toggleBatch = (year) => {
    setActiveBatch(activeBatch === year ? null : year);
  };

  const handleCreateBatch = () => {
    if (newBatchYear.trim() && onCreateBatch) {
      onCreateBatch(newBatchYear.trim());
      setNewBatchYear('');
    }
  };

  const years = Object.keys(batchesData || {}).reverse();

  return (
    <div className="p-8">
      {/* Add New Batch Section */}
      <div className="bg-white border-2 border-[#ffd200] rounded-lg p-4 mb-6 shadow-sm">
        <h4 className="font-bold text-lg text-[#004d00] mb-3">Add New Batch</h4>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Enter Batch Year (e.g., 2027)"
            value={newBatchYear}
            onChange={(e) => setNewBatchYear(e.target.value)}
            className="flex-1 p-3 border rounded text-base font-semibold focus:ring-2 focus:ring-[#004d00] outline-none"
            min="2012"
          />
          <button
            onClick={handleCreateBatch}
            disabled={!newBatchYear.trim()}
            className="bg-[#004d00] text-white px-6 py-3 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-base disabled:opacity-50"
          >
            Create Batch
          </button>
        </div>
      </div>

      {/* Existing Batches */}
      {years.map((year) => (
        <BatchDropdown 
          key={year}
          year={year} 
          students={batchesData[year]} 
          isOpen={activeBatch === year}
          toggleBatch={toggleBatch}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
};

export default BatchSection;