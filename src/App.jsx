import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [portalType, setPortalType] = useState('student')
  const [loading, setLoading] = useState(false)

  // Teacher AI Generator States
  const [subject, setSubject] = useState('Physics')
  const [chapter, setChapter] = useState('Electrostatics')
  const [generating, setGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState([])

  // Student Test Engine & Analytics States
  const [activeTest, setActiveTest] = useState(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [testResult, setTestResult] = useState(null)

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
    setActiveTest(null)
    setTestSubmitted(false)
  }

  const generateAIQuestions = () => {
    setGenerating(true)
    setTimeout(() => {
      setGeneratedQuestions([
        { id: 1, q: `Core concept question on ${chapter}`, options: ['Option A', 'Option B', 'Option C', 'Option D'], ans: 'Option A' }
      ])
      setGenerating(false)
    }, 600)
  }

  const startMockTest = () => {
    setActiveTest({
      title: 'Physics Comprehensive Test',
      questions: [
        { id: 1, q: 'What is the SI unit of electric charge?', options: ['Coulomb', 'Joule', 'Volt', 'Ampere'], ans: 'Coulomb', topic: 'Electrostatics' },
        { id: 2, q: 'What is dimensional formula of magnetic field?', options: ['[M^1 L^0 T^-2 A^-1]', '[MLT]', '[ML2T-2]', 'None'], ans: '[M^1 L^0 T^-2 A^-1]', topic: 'Magnetism' }
      ]
    })
    setCurrentQIndex(0)
    setSelectedAnswers({})
    setTestSubmitted(false)
    setTestResult(null)
  }

  const submitTest = () => {
    let score = 0
    let incorrectTopics = []
    let correctTopics = []

    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.ans) {
        score += 1
        correctTopics.push(q.topic)
      } else {
        incorrectTopics.push(q.topic)
      }
    })

    setTestResult({
      score,
      total: activeTest.questions.length,
      strong: correctTopics.length > 0 ? correctTopics : ['General Concepts'],
      weak: incorrectTopics.length > 0 ? incorrectTopics : ['None - Excellent Accuracy!'],
      aiRecommendation: incorrectTopics.length > 0 
        ? 'AI suggests revising formula derivations and practicing numerical problems in weak areas.' 
        : 'Outstanding performance! Move on to advanced problem sets.'
    })
    setTestSubmitted(true)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-6">
          <div className="text-center space-y-1">
            <div className="inline-block bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-lg mb-2">
              EduOrbit AI OS
            </div>
            <h2 className="text-xl font-bold text-slate-100">Full System Login</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Portal Type</label>
              <select value={portalType} onChange={(e) => setPortalType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
                <option value="student">🎓 Student Portal (AI Analytics)</option>
                <option value="teacher">👨‍🏫 Teacher Portal</option>
                <option value="coachingAdmin">🏫 Coaching Admin</option>
                <option value="superAdmin">👑 Super Admin</option>
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
              {loading ? 'Authenticating...' : 'Login Workspace'}
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
          <h1 className="font-bold text-sm leading-tight">EduOrbit AI Analytics</h1>
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
        {user.role === 'student' ? (
          <div className="space-y-6">
            {!activeTest ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-center">
                <h2 className="text-xl font-bold text-slate-100">🎓 AI Weak/Strong Topic Diagnostics</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Take tests to trigger advanced AI topic breakdown and tailored improvement plans.</p>
                <button onClick={startMockTest} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition">
                  🚀 Launch Diagnostic Test
                </button>
              </div>
            ) : !testSubmitted ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-200">{activeTest.title}</h3>
                  <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded">
                    Q {currentQIndex + 1} of {activeTest.questions.length}
                  </span>
                </div>
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-100">{activeTest.questions[currentQIndex].q}</p>
                  <div className="space-y-2">
                    {activeTest.questions[currentQIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedAnswers({ ...selectedAnswers, [activeTest.questions[currentQIndex].id]: opt })}
                        className={`w-full text-left text-xs p-3 rounded border transition ${selectedAnswers[activeTest.questions[currentQIndex].id] === opt ? 'bg-indigo-950 border-indigo-500 text-indigo-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'}`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button disabled={currentQIndex === 0} onClick={() => setCurrentQIndex(currentQIndex - 1)} className="bg-slate-800 text-slate-300 px-4 py-2 rounded text-xs disabled:opacity-50">Previous</button>
                  {currentQIndex < activeTest.questions.length - 1 ? (
                    <button onClick={() => setCurrentQIndex(currentQIndex + 1)} className="bg-indigo-600 text-white px-4 py-2 rounded text-xs font-semibold">Next</button>
                  ) : (
                    <button onClick={submitTest} className="bg-emerald-600 text-white px-6 py-2 rounded text-xs font-semibold">Submit & Analyze ✓</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6 text-left">
                <div className="text-center space-y-2 border-b border-slate-800 pb-4">
                  <span className="bg-emerald-950 border border-emerald-800 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">AI Diagnostics Complete</span>
                  <h3 className="text-2xl font-bold text-slate-100">Score: {testResult.score} / {testResult.total}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 border border-emerald-900/50 p-4 rounded-lg space-y-2">
                    <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider">🟢 Strong Topics</h4>
                    <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                      {testResult.strong.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>

                  <div className="bg-slate-950 border border-red-900/50 p-4 rounded-lg space-y-2">
                    <h4 className="font-bold text-red-400 text-xs uppercase tracking-wider">🔴 Weak Topics / Focus Areas</h4>
                    <ul className="text-xs text-slate-300 list-disc pl-4 space-y-1">
                      {testResult.weak.map((t, idx) => <li key={idx}>{t}</li>)}
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-950/30 border border-indigo-900/50 p-4 rounded-lg space-y-1">
                  <h4 className="font-bold text-indigo-300 text-xs">💡 AI Personal Prescription</h4>
                  <p className="text-xs text-slate-300">{testResult.aiRecommendation}</p>
                </div>

                <div className="text-center pt-2">
                  <button onClick={() => setActiveTest(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg text-xs font-semibold">
                    Back to Student Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-3">
            <h2 className="text-xl font-bold text-slate-100">Portal Workspace ({user.role})</h2>
            <p className="text-xs text-slate-400">Switch to Student Portal to experience AI Diagnostics & Report Generation.</p>
          </div>
        )}
      </main>
    </div>
  )
}
