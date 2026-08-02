import React, { useState } from 'react';

export default function ClassManager() {
  const [classes, setClasses] = useState([
    { id: '1', name: 'Physics Class 12th', teacher: 'Dr. Sharma', students: 45 },
    { id: '2', name: 'Chemistry Batch A', teacher: 'Prof. Verma', students: 30 }
  ]);
  const [className, setClassName] = useState('');
  const [teacher, setTeacher] = useState('');

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!className || !teacher) return;
    
    const newClass = {
      id: Date.now().toString(),
      name: className,
      teacher: teacher,
      students: 0
    };
    
    setClasses([...classes, newClass]);
    setClassName('');
    setTeacher('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Class & Sub-Admin Control</h2>
        <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20">
          Active Management
        </span>
      </div>
      
      {/* Add New Class Form */}
      <form onSubmit={handleAddClass} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input 
          type="text" 
          placeholder="New Class Name" 
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 outline-none flex-1 text-sm"
        />
        <input 
          type="text" 
          placeholder="Assigned Teacher/Admin" 
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          className="bg-slate-800 text-white px-4 py-2 rounded-lg border border-slate-700 outline-none flex-1 text-sm"
        />
        <button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all">
          + Add Class
        </button>
      </form>

      {/* Classes Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="py-2">Class Name</th>
              <th className="py-2">Class Admin</th>
              <th className="py-2">Students</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-b border-slate-800/50">
                <td className="py-3 font-semibold text-white">{cls.name}</td>
                <td className="py-3">{cls.teacher}</td>
                <td className="py-3">{cls.students} Enrolled</td>
                <td className="py-3">
                  <button 
                    onClick={() => alert(`Opening ${cls.name} Admin Portal`)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-all"
                  >
                    Open Class Admin →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
