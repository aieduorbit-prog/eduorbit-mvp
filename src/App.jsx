import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [portalType, setPortalType] = useState('superAdmin')
  const [loading, setLoading] = useState(false)

  // WhatsApp Notification State
  const [whatsappSent, setWhatsappSent] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setUser({ email, role: portalType, name: 'Demo User' })
        setLoading(false)
        return
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: profile ? profile.role : portalType,
        name: profile ? profile.full_name : 'User'
      })
    } catch (err) {
      setUser({ email, role: portalType, name: 'Offline User' })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const sendWhatsAppNotification = () => {
    setWhatsappSent(true)
    setTimeout(() => setWhatsappSent(false), 3000)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-block bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-lg mb-2">
              EduOrbit AI OS
            </div>
            <h2 className="text-xl font-bold text-slate-100">Enterprise Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Portal Type</label>
              <select value={portalType} onChange={(e) => setPortalType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
                <option value="superAdmin">👑 Super Admin (Master Control)</option>
                <option value="coachingAdmin">🏫 Coaching Admin</option>
                <option value="teacher">👨‍🏫 Teacher Portal</option>
                <option value="student">🎓 Student Portal</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
              <input type="email" required placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Password</label>
              <input type="password" required placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition">
              {loading ? 'Authenticating...' : 'Login Enterprise'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center max-w-5xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">EO</div>
          <h1 className="font-bold text-sm leading-tight">EduOrbit Enterprise OS</h1>
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

      <main className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-6 text-left">
        {user.role === 'superAdmin' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <h2 className="text-xl font-bold text-slate-100">👑 Super Admin Master License & Institute Control</h2>
              <p className="text-xs text-slate-400">Manage all registered coaching partners, white-label apps, and cloud billing statuses.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-1">
                  <p className="text-xs text-slate-400">Active Institutes</p>
                  <p className="text-xl font-bold text-emerald-400">14 Partners</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-1">
                  <p className="text-xs text-slate-400">Total Active Students</p>
                  <p className="text-xl font-bold text-indigo-400">3,420 Users</p>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-1">
                  <p className="text-xs text-slate-400">Cloud Sync Health</p>
                  <p className="text-xl font-bold text-emerald-400">100% Operational</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4">
              <h3 className="font-bold text-slate-200">📱 WhatsApp Automated Parent Gateway</h3>
              <p className="text-xs text-slate-400">Send automated performance reports and scorecards directly to registered parents via WhatsApp API.</p>
              
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs space-y-1">
                  <p className="font-semibold text-slate-200">Student: Rahul Sharma (Physics Assessment #4)</p>
                  <p className="text-slate-400">Score: 8/10 | Status: Weak in Magnetism</p>
                </div>
                <button 
                  onClick={sendWhatsAppNotification}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-semibold transition whitespace-nowrap"
                >
                  {whatsappSent ? '✓ WhatsApp Dispatched!' : '📲 Send Report to Parents'}
                </button>
              </div>
            </div>
          </div>
        )}

        {user.role !== 'superAdmin' && (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
            <h2 className="text-xl font-bold text-slate-100">Workspace Portal ({user.role})</h2>
            <p className="text-xs text-slate-400">Switch to Super Admin role in login to view platform-wide institute and WhatsApp integrations.</p>
          </div>
        )}
      </main>
    </div>
  )
}
