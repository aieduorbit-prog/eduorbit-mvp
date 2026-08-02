import React from 'react'

export default function Login({ email, setEmail, password, setPassword, portalType, setPortalType, handleLogin, loading }) {
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
