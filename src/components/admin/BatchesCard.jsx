import React, { useState } from 'react';

const statusOptions = [
  'JEST (IBA)',
  'PST (IBA)',
  'PST (NTS)',
  'ECT (IBA)',
  'SST (SPSC)',
  'ASI (SPSC)',
  'EST (TL)',
  'Private Teacher',
  'Private Job',
  'Govt: Job in Health',
  'Web Developer/Web Designer',
  'Govt: Job in NADRA',
  'Job in Police',
  'Job in Revenue',
  'Auditor',
  'Business man',
  'Private Bank Job',
  'Visiting Teacher',
  'Visiting Teacher in GECE Mithi',
  'Studies in KU (Karachi University)',
  'For Further Studies in Foreign Country',
  'Waiting',
  'Waiting for Examination',
  'Studying in 3rd Semester',
  'Studying in 4th Semester',
  'Studying in 5th Semester',
  'Studying in 6th Semester',
  'Studying in 7th Semester',
  'Studying in 8th Semester',
  'ADE Complete',
  'ADE ongoing',
];

const StudentCard = ({ student, batchYear, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(student.status || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = async () => {
    if (!onStatusUpdate) return;
    if (!selectedStatus) return alert('Please select a status before updating.');
    if (selectedStatus === student.status) return alert('Please choose a different status.');

    try {
      setIsUpdating(true);
      await onStatusUpdate(batchYear, student.id, selectedStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white border border-[#ffd200] rounded-lg overflow-hidden flex flex-col shadow-sm hover:shadow-md transition h-full">
      <div className="p-5 flex-1 text-center flex flex-col items-center justify-center">
        <h4 className="font-bold text-gray-900 text-lg mb-1">{student.name}</h4>
        <p className="text-xs text-gray-500 mb-3 uppercase font-bold tracking-wider bg-gray-100 px-2 py-0.5 rounded-full">
          {student.status || 'STUDENT'}
        </p>
        {student.fname && (
          <div className="w-full">
            <div className="flex justify-center items-center space-x-4">
              <span className={`text-sm font-medium ${student.rel === 'S/o' ? 'text-[#004d00] font-bold' : 'text-gray-400'}`}>
                S/o
              </span>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className={`text-sm font-medium ${student.rel === 'D/o' ? 'text-[#004d00] font-bold' : 'text-gray-400'}`}>
                D/o
              </span>
            </div>
            <p className="text-sm text-gray-600 font-medium text-center mt-1">
              {student.fname}
            </p>
          </div>
        )}
        {student.surname && (
          <p className="text-sm text-[#004d00] font-extrabold uppercase mt-1 tracking-wide">
            {student.surname}
          </p>
        )}
      </div>

      {onStatusUpdate && (
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <label className="block text-left text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
            Update Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2 border rounded text-sm"
          >
            <option value="">Select Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={isUpdating}
            className="mt-3 w-full bg-[#004d00] text-white px-4 py-2 rounded-lg border border-[#ffd200] hover:bg-green-800 font-bold text-sm disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Save Status'}
          </button>
        </div>
      )}

      <div className="bg-[#004d00] text-white text-xs font-bold text-center py-2 uppercase tracking-wide mt-auto">
        BATCH {batchYear}
      </div>
    </div>
  );
};

export default StudentCard;
