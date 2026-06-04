import React, { useState } from 'react';
import StudentCard from './BatchesCard'; // Import the card we made above

// Shared Icons
const ChevronDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const ChevronUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>;
const GradCap = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 0 6 2.5 6 5s3-5 6-5v-5"></path></svg>;

const BatchDropdown = ({ year, students = [], isOpen, toggleBatch, onStatusUpdate }) => {
  return (
    <div className="bg-[#004d00] rounded-lg shadow-sm overflow-hidden border border-[#ffd200] mb-4">
      {/* HEADER */}
      <button 
        onClick={() => toggleBatch(year)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors bg-[#004d00] text-white hover:bg-[#003800]"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-full bg-white/10 text-yellow-400">
            <GradCap />
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">BATCH {year}</h3>
            <p className="text-xs text-green-200">{students.length} Students</p>
          </div>
        </div>
        <div className="text-white">
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      {/* BODY (Grid) */}
      {isOpen && (
        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {students.map((student, index) => (
              <StudentCard key={index} student={student} batchYear={year} onStatusUpdate={onStatusUpdate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchDropdown;
