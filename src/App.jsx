import React, { useState } from 'react'

export default function App() {
  const [role, setRole] = useState('superAdmin') // 'superAdmin', 'coachingAdmin', 'teacher', 'student'
  
  // Syllabus & Class Continuity State
  const [syllabus, setSyllabus] = useState([
    { id: 1, subject: 'Physics', chapter: 'Light - Reflection', status: 'Completed', progress: 100 },
    { id: 2, subject: 'Physics', chapter: 'Electricity', status: 'In Progress', progress: 60 },
    { id: 3, subject: 'Maths', chapter: 'Quadratic Equations', status: 'Pending', progress: 0 }
  ])

  // Super Admin Management Data
  const [clients, setClients] = useState([
    { id: 'C-101', name: 'Apex Coaching Institute', location: 'Delhi', activeClasses: 8, totalStudents: 140, plan: 'Pro' },
    { id: 'C-102', name: 'Bright Mind Academy', location: 'Mumbai', activeClasses: 4, totalStudents: 65, plan: 'Basic' }
  ])

  // Student AI Report Demo
  const [studentReport, setStudentReport] = useState({
    name: 'Rahul Sharma',
    weakTopics: ['Ray Diagrams', 'Ohm\'s Law Application'],
    strongTopics: ['Refraction Index', 'Resistor Combinations'],
    aiSuggestion: 'Focus 45 mins daily on Ray Diagrams. Practice 10 numericals on Ohm\'s Law before next Sunday.',
    nextWeekPlan: ['Mon: Optics Formula Review', 'Wed: 15-min Practice Quiz', 'Fri: Doubts Clearing with Teacher']
  })

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Role Selector & Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">EO</div>
            <div>
              <h1 className="font-bold text-sm leading-tight">EduOrbit AI OS</h1>
              <p className="text-[10px] text-emerald-400">Multi-Portal Engine</p>
            </div>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <label className="block text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-1">Switch Portal Mode</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-slate-200 outline-none">
              <option value="superAdmin">👑 Super Admin (Our Control)</option>
              <option value="coachingAdmin">🏫 Coaching Admin Panel</option>
              <option value="teacher">👨‍🏫 Teacher Portal & Syllabus</option>
              <option value="student">🎓 Student AI Portal</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-[11px] text-slate-400">
          <p className="font-semibold text-slate-200">Active Role: <span className="text-indigo-400">{role.toUpperCase()}</span></p>
        </div>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6 text-left">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 p-3 border border-slate-800 rounded-lg flex justify-between items-center mb-4">
          <span className="font-bold text-xs">EduOrbit AI OS</span>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="bg-slate-950 text-xs border border-slate-700 rounded p-1">
            <option value="superAdmin">Super Admin</option>
            <option value="coachingAdmin">Coaching Admin</option>
            <option value="teacher">Teacher</option>
            <option value="student">Student AI</option>
          </select>
        </div>

        {/* 1. SUPER ADMIN PANEL (Hamare Control Ke Liye) */}
        {role === 'superAdmin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">👑 Platform Master Super Admin Panel</h2>
              <p className="text-xs text-slate-400">Manage all registered Coaching Institutes, active licenses, and global metrics.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <p className="text-xs text-slate-400">Total Client Institutes</p>
                <p className="text-2xl font-bold mt-1 text-indigo-400">{clients.length}</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <p className="text-xs text-slate-400">Total Onboarded Students</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">205</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <p className="text-xs text-slate-400">System Infrastructure</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">Healthy (Cloud Active)</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-sm text-slate-200">Registered Coaching Clients</h3>
                <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded-lg">+ Onboard New Coaching</button>
              </div>

              <div className="space-y-2">
                {clients.map((c, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center text-xs gap-2">
                    <div>
                      <span className="font-bold text-indigo-400">[{c.id}]</span> <span className="font-semibold text-slate-200">{c.name}</span> ({c.location})
                      <p className="text-[11px] text-slate-400 mt-0.5">Classes: {c.activeClasses} | Enrolled Students: {c.totalStudents}</p>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-1 rounded border border-emerald-800 font-medium">Plan: {c.plan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. COACHING ADMIN PANEL */}
        {role === 'coachingAdmin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">🏫 Coaching Institute Admin Panel</h2>
              <p className="text-xs text-slate-400">Manage institute teachers, batches, and overall academic status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                <h3 className="font-semibold text-sm text-indigo-400">Teachers Management</h3>
                <p className="text-xs text-slate-400">Active Faculty Members: 4</p>
                <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded">Manage Faculty Access</button>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                <h3 className="font-semibold text-sm text-emerald-400">Batches & Rosters</h3>
                <p className="text-xs text-slate-400">Active Batches: Class 9, Class 10, Class 11-JEE</p>
                <button className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded">Create New Batch</button>
              </div>
            </div>
          </div>
        )}

        {/* 3. TEACHER PORTAL & SYLLABUS CONTINUATION */}
        {role === 'teacher' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">👨‍🏫 Teacher Portal & Syllabus Tracker</h2>
              <p className="text-xs text-slate-400">Track class progression and auto-continue syllabus testing.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="font-semibold text-sm text-slate-200">Live Class Syllabus Progress</h3>
              <div className="space-y-3">
                {syllabus.map((s) => (
                  <div key={s.id} className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="text-xs">
                      <p className="font-semibold text-slate-200">{s.subject}: {s.chapter}</p>
                      <p className="text-slate-400">Status: <span className="text-indigo-400">{s.status}</span> ({s.progress}%)</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-3 py-1.5 rounded">
                        ⚡ Generate Test from Current Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. STUDENT AI PORTAL */}
        {role === 'student' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">🎓 Student AI Intelligence Dashboard</h2>
              <p className="text-xs text-slate-400">Welcome, {studentReport.name}! Your automated AI weak/strong area analysis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-red-900/40 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Weak Areas (Needs Revision)</h3>
                <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
                  {studentReport.weakTopics.map((w, idx) => <li key={idx}>{w}</li>)}
                </ul>
              </div>

              <div className="bg-slate-900 border border-emerald-900/40 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-emerald-400 mb-2">✅ Strong Areas (Mastered)</h3>
                <ul className="list-disc list-inside text-xs space-y-1 text-slate-300">
                  {studentReport.strongTopics.map((st, idx) => <li key={idx}>{st}</li>)}
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 border border-indigo-800 p-5 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-indigo-400">🤖 AI Recommended Improvement Action Plan</h3>
              <p className="text-xs text-slate-200 bg-slate-950 p-3 rounded border border-slate-800 leading-relaxed">
                "{studentReport.aiSuggestion}"
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-200">🗓️ Next Week AI Study Schedule</h3>
              <div className="space-y-2">
                {studentReport.nextWeekPlan.map((plan, i) => (
                  <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs text-indigo-300">
                    {plan}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
