import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [portalType, setPortalType] = useState('student')
  const [loading, setLoading] = useState(false)

  // Database-backed Login Handler
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        alert("Login Failed: " + error.message + "\n(Tip: Ensure user exists in Supabase Auth or use demo mode)")
        setLoading(false)
        return
      }

      // 2. Fetch role profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      setUser({
        id: data.user.id,
        email: data.user.email,
        role: profile ? profile.role : portalType,
        name: profile ? profile.full_name : 'Authorized User'
      })
    } catch (err) {
      console.error(err)
      alert("An unexpected error occurred during login.")
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setEmail('')
    setPassword('')
  }

  // LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-block bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-lg mb-2">
              EduOrbit AI OS
            </div>
            <h2 className="text-xl font-bold text-slate-100">Cloud-Synced Portal Login</h2>
            <p className="text-xs text-slate-400">Connected live to Supabase Database</p>
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
                <option value="coachingAdmin">🏫 Coaching Admin Portal</option>
                <option value="superAdmin">👑 Super Admin Portal</option>
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

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition">
              {loading ? 'Authenticating...' : 'Secure Cloud Login'}
            </button>
          </form>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-400 text-left space-y-1">
            <p className="font-bold text-slate-300 border-b border-slate-800 pb-1 mb-1">💡 Note:</p>
            <p>Create test users directly in your Supabase Auth dashboard with matching roles in the <code className="text-indigo-400">profiles</code> table.</p>
          </div>
        </div>
      </div>
    )
  }

  // DASHBOARD VIEW FOR LOGGED IN USERS
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">EO</div>
          <div>
            <h1 className="font-bold text-sm leading-tight">EduOrbit AI OS</h1>
            <p className="text-[10px] text-emerald-400">● Database Connected</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300 hidden md:inline-block">
            👤 {user.email} <span className="text-indigo-400 font-bold">({user.role.toUpperCase()})</span>
          </span>
          <button onClick={handleLogout} className="bg-red-950 hover:bg-red-900 text-red-400 border border-red-800 text-xs px-3 py-1.5 rounded-lg">
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6 text-left">
        {user.role === 'superAdmin' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-100">👑 Super Admin Master Control</h2>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <p className="text-xs text-slate-400">Database Status: <span className="text-emerald-400 font-bold">Online & Synchronized</span></p>
            </div>
          </div>
        )}

        {user.role === 'coachingAdmin' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-100">🏫 Coaching Institute Admin Portal</h2>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <p className="text-xs text-slate-400">Manage batches, student rosters, and faculty from cloud database.</p>
            </div>
          </div>
        )}

        {user.role === 'teacher' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-100">👨‍🏫 Teacher Portal & Test Generator</h2>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <p className="text-xs text-slate-400">Create tests and sync them directly to Supabase storage.</p>
            </div>
          </div>
        )}

        {user.role === 'student' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-100">🎓 Student AI Intelligence Dashboard</h2>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <p className="text-xs text-slate-400">View real-time AI weak/strong topic reports fetched from cloud database.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
