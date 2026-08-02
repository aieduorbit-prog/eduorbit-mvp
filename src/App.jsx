import React, { useState } from 'react'

export default function App() {
  const [user, setUser] = useState(null) // Stores logged in user info
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [portalType, setPortalType] = useState('student') // Login portal type

  // Mock Database for Authentication
  const handleLogin = (e) => {
    e.preventDefault()
    
    // Super Admin Credentials
    if (portalType === 'superAdmin' && email === 'admin@eduorbit.com' && password === 'admin123') {
      setUser({ role: 'superAdmin', name: 'Platform Owner (Super Admin)' })
      return
    }
    // Coaching Admin Credentials
    if (portalType === 'coaching' && email === 'apex@coaching.com' && password === 'coaching123') {
      setUser({ role: 'coachingAdmin', name: 'Apex Coaching Institute' })
      return
    }
    // Teacher Credentials
    if (portalType === 'teacher' && email === 'teacher@coaching.com' && password === 'teacher123') {
      setUser({ role: 'teacher', name: 'Rohan Verma (Physics Faculty)' })
      return
    }
    // Student Credentials
    if (portalType === 'student' && email === 'student@coaching.com' && password === 'student123') {
      setUser({ role: 'student', name: 'Rahul Sharma (Class 10)' })
      return
    }

    alert('Invalid Email or Password! Check demo credentials below login form.')
  }

  const handleLogout = () => {
    setUser(null)
    setEmail('')
    setPassword('')
  }

  // LOGIN SCREEN COMPONENT
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-block bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-lg mb-2">
              EduOrbit AI OS
            </div>
            <h2 className="text-xl font-bold text-slate-100">Portal Login</h2>
            <p className="text-xs text-slate-400">Select your portal role and enter credentials</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Portal Type</label>
              <select 
                value={portalType} 
                onChange={(e) => setPortalType(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none"
              >
                <option value="student">🎓 Student Portal</option>
                <option value="teacher">👨‍🏫 Teacher Portal</option>
                <option value="coaching">🏫 Coaching Admin Portal</option>
                <option value="superAdmin">👑 Super Admin Portal (Platform Owner)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="Enter email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                required 
                placeholder="Enter password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none"
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition">
              Secure Login
            </button>
          </form>

          {/* Demo Login Instructions for Testing */}
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 text-left space-y-1">
            <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">🔑 Quick Demo Credentials:</p>
            <p><span className="text-indigo-400 font-semibold">Student:</span> student@coaching.com | student123</p>
            <p><span className="text-indigo-400 font-semibold">Teacher:</span> teacher@coaching.com | teacher123</p>
            <p><span className="text-indigo-400 font-semibold">Coaching Admin:</span> apex@coaching.com | coaching123</p>
            <p><span className="text-indigo-400 font-semibold">Super Admin:</span> admin@eduorbit.com | admin123</p>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD VIEW ACCORDING TO LOGGED IN USER ROLE
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">EO</div>
          <div>
            <h1 className="font-bold text-sm leading-tight">EduOrbit AI OS</h1>
            <p className="text-[10px] text-emerald-400">Authenticated Session</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
            👤 {user.name} <span className="text-indigo-400 font-bold">({user.role.toUpperCase()})</span>
          </span>
          <button onClick={handleLogout} className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 text-xs px-3 py-1.5 rounded-lg">
            Logout
          </button>
        </div>
      </header>

      {/* Role Dedicated Screen */}
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6 text-left">
        
        {/* 1. SUPER ADMIN ONLY SCREEN */}
        {user.role === 'superAdmin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">👑 Platform Master Super Admin Control</h2>
              <p className="text-xs text-slate-400">This view is EXCLUSIVELY accessible to Platform Owners.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <p className="text-xs text-slate-400">Total Coaching Software Clients</p>
                <p className="text-2xl font-bold mt-1 text-indigo-400">2 Institutes Active</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <p className="text-xs text-slate-400">Platform Revenue Metrics</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">₹45,000 / Month</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                <p className="text-xs text-slate-400">Cloud Storage & API Status</p>
                <p className="text-2xl font-bold mt-1 text-emerald-400">Healthy (Vercel + Supabase)</p>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-slate-200">Manage Licensed Coaching Classes</h3>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-indigo-400">[C-101]</span> Apex Coaching Institute (Delhi)
                  <p className="text-[10px] text-slate-400">Active Teachers: 4 | Active Students: 140</p>
                </div>
                <span className="bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded border border-emerald-800">License Active</span>
              </div>
            </div>
          </div>
        )}

        {/* 2. COACHING ADMIN ONLY SCREEN */}
        {user.role === 'coachingAdmin' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">🏫 Coaching Institute Owner Portal</h2>
              <p className="text-xs text-slate-400">Welcome, Apex Coaching Institute Admin!</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="font-semibold text-sm text-slate-200">Institute Management Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="bg-slate-950 border border-slate-800 p-4 rounded-lg text-left hover:border-indigo-500 transition">
                  <p className="font-bold text-sm text-indigo-400">👨‍🏫 Add / Manage Faculty</p>
                  <p className="text-xs text-slate-400 mt-1">Add teacher accounts and assign subjects/batches.</p>
                </button>
                <button className="bg-slate-950 border border-slate-800 p-4 rounded-lg text-left hover:border-indigo-500 transition">
                  <p className="font-bold text-sm text-emerald-400">📚 Manage Batches & Courses</p>
                  <p className="text-xs text-slate-400 mt-1">Configure Class 9, 10, 11-JEE, 12-NEET student rosters.</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. TEACHER ONLY SCREEN */}
        {user.role === 'teacher' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">👨‍🏫 Teacher Examination & Syllabus Portal</h2>
              <p className="text-xs text-slate-400">Generate tests, publish test links, and view automated evaluation results.</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
              <p className="text-sm font-semibold text-indigo-400">⚡ AI Exam Paper Generator Active</p>
              <p className="text-xs text-slate-300">Class 10 Physics - Light Reflection (Ready to Generate & Publish)</p>
            </div>
          </div>
        )}

        {/* 4. STUDENT ONLY SCREEN */}
        {user.role === 'student' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-100">🎓 Student AI Intelligence Dashboard</h2>
              <p className="text-xs text-slate-400">Welcome, Rahul Sharma!</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-red-900/40 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-red-400 mb-2">⚠️ Weak Topics</h3>
                <p className="text-xs text-slate-300">• Ray Diagrams Formula Application</p>
                <p className="text-xs text-slate-300">• Ohm's Law Numericals</p>
              </div>
              <div className="bg-slate-900 border border-emerald-900/40 p-5 rounded-xl">
                <h3 className="text-sm font-bold text-emerald-400 mb-2">✅ Strong Topics</h3>
                <p className="text-xs text-slate-300">• Refraction Index Calculations</p>
                <p className="text-xs text-slate-300">• Resistor Combinations</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
