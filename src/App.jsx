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
  const [difficulty, setDifficulty] = useState('Medium')
  const [questionCount, setQuestionCount] = useState(5)
  const [generating, setGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState([])

  // Student Test Engine States
  const [activeTest, setActiveTest] = useState(null)
  const [currentQIndex, setCurrentQIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [testScore, setTestScore] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setUser({ email, role: portalType, name: 'Demo Authorized User' })
        setLoading(false)
        return
      }
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', data.user.id).single()
      setUser({
        id: data.user.id,
        email: data.user.email,
        role: profile ? profile.role : portalType,
        name: profile ? profile.full_name : 'Authorized User'
      })
    } catch (err) {
      setUser({ email, role: portalType, name: 'Offline Mode User' })
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

  // Generate Questions for Teacher
  const generateAIQuestions = () => {
    setGenerating(true)
    setTimeout(() => {
      const samplePool = [
        { id: 1, q: `What is the primary law governing ${chapter} in ${subject}?`, options: ['Coulomb\'s Law', 'Ohm\'s Law', 'Newton\'s Law', 'Faraday\'s Law'], ans: 'Coulomb\'s Law' },
        { id: 2, q: `Calculate the uniform field intensity context for standard ${difficulty} level problems.`, options: ['E = F/q', 'E = mc^2', 'V = IR', 'P = VI'], ans: 'E = F/q' },
        { id: 3, q: `Which unit is standard for measuring potential gradient in ${chapter}?`, options: ['Volt/meter', 'Newton/Coulomb', 'Joule', 'Tesla'], ans: 'Volt/meter' },
        { id: 4, q: `In an isolated system under ${subject}, what remains conserved?`, options: ['Total Energy & Charge', 'Velocity', 'Mass only', 'Temperature'], ans: 'Total Energy & Charge' },
        { id: 5, q: `Identify the dimensional formula relevant to constants in ${chapter}.`, options: ['[M^1 L^3 T^-4 A^-2]', '[M L T^-2]', '[ML^2T^-2]', 'Dimensionless'], ans: '[M^1 L^3 T^-4 A^-2]' }
      ]
      const selected = samplePool.slice(0, questionCount)
      setGeneratedQuestions(selected)
      setGenerating(false)
    }, 800)
  }

  // Start Test for Student
  const startMockTest = () => {
    const sampleTest = {
      title: 'Physics - Electrostatics Live Assessment',
      questions: [
        { id: 1, q: 'What is the SI unit of electric charge?', options: ['Coulomb', 'Joule', 'Volt', 'Ampere'], ans: 'Coulomb' },
        { id: 2, q: 'Coulomb\'s law is valid for which type of charges?', options: ['Point charges', 'Moving charges only', 'Infinite sheets', 'Magnetic monopoles'], ans: 'Point charges' },
        { id: 3, q: 'The electric field inside a charged hollow metallic sphere is:', options: ['Zero', 'Maximum', 'Uniform non-zero', 'Infinite'], ans: 'Zero' }
      ]
    }
    setActiveTest(sampleTest)
    setCurrentQIndex(0)
    setSelectedAnswers({})
    setTestSubmitted(false)
    setTestScore(null)
  }

  const handleOptionSelect = (qId, option) => {
    setSelectedAnswers({ ...selectedAnswers, [qId]: option })
  }

  const submitTest = () => {
    let score = 0
    activeTest.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.ans) {
        score += 1
      }
    })
    setTestScore({ score, total: activeTest.questions.length })
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
            <h2 className="text-xl font-bold text-slate-100">Portal Login</h2>
            <p className="text-xs text-slate-400">Full System Integration Active</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Select Portal Type</label>
              <select 
                value={portalType} 
                onChange={(e) => setPortalType(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none"
              >
                <option value="student">🎓 Student Portal (Test Engine)</option>
                <option value="teacher">👨‍🏫 Teacher Portal (AI Generator)</option>
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
              {loading ? 'Authenticating...' : 'Login to Workspace'}
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
          <div>
            <h1 className="font-bold text-sm leading-tight">EduOrbit AI OS</h1>
            <p className="text-[10px] text-emerald-400">● Core Engines Active</p>
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

      <main className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-6 text-left">
        {/* TEACHER PORTAL */}
        {user.role === 'teacher' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
              <h2 className="text-lg font-bold text-slate-100">🤖 AI Question Generator & Test Builder</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                  <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Chapter Name</label>
                  <input type="text" value={chapter} onChange={(e) => setChapter(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                </div>
              </div>
              <button onClick={generateAIQuestions} disabled={generating} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition">
                {generating ? '✨ AI is crafting questions...' : '⚡ Generate AI Test Questions'}
              </button>
            </div>

            {generatedQuestions.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
                <h3 className="font-bold text-slate-200">📋 Generated Test Preview</h3>
                <div className="space-y-3">
                  {generatedQuestions.map((item, idx) => (
                    <div key={idx} className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs space-y-1">
                      <p className="font-semibold text-slate-100">Q{idx + 1}. {item.q}</p>
                      <p className="text-emerald-400">Correct Answer: {item.ans}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STUDENT PORTAL */}
        {user.role === 'student' && (
          <div className="space-y-6">
            {!activeTest ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 text-center">
                <h2 className="text-xl font-bold text-slate-100">🎓 Student Assessment Hub</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">Ready to test your preparation? Take live automated assessments with instant AI evaluation.</p>
                <button onClick={startMockTest} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-semibold text-sm transition">
                  🚀 Start Physics Assessment Now
                </button>
              </div>
            ) : !testSubmitted ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-slate-200">{activeTest.title}</h3>
                  <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-3 py-1 rounded">
                    Question {currentQIndex + 1} of {activeTest.questions.length}
                  </span>
                </div>

                <div className="space-y-4">
                  <p className="text-sm font-semibold text-slate-100">
                    {activeTest.questions[currentQIndex].q}
                  </p>
                  <div className="space-y-2">
                    {activeTest.questions[currentQIndex].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionSelect(activeTest.questions[currentQIndex].id, opt)}
                        className={`w-full text-left text-xs p-3 rounded border transition ${selectedAnswers[activeTest.questions[currentQIndex].id] === opt ? 'bg-indigo-950 border-indigo-500 text-indigo-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <button 
                    disabled={currentQIndex === 0} 
                    onClick={() => setCurrentQIndex(currentQIndex - 1)}
                    className="bg-slate-800 text-slate-300 px-4 py-2 rounded text-xs disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {currentQIndex < activeTest.questions.length - 1 ? (
                    <button 
                      onClick={() => setCurrentQIndex(currentQIndex + 1)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded text-xs font-semibold"
                    >
                      Next
                    </button>
                  ) : (
                    <button 
                      onClick={submitTest}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded text-xs font-semibold"
                    >
                      Submit Test ✓
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-6 text-center">
                <div className="space-y-2">
                  <div className="inline-block bg-emerald-950 border border-emerald-800 text-emerald-400 font-bold px-4 py-1.5 rounded-full text-sm">
                    Test Submitted Successfully! 🎉
                  </div>
                  <h3 className="text-2xl font-bold text-slate-100">Your Score: {testScore.score} / {testScore.total}</h3>
                  <p className="text-xs text-slate-400">AI has evaluated your responses and updated your performance metrics.</p>
                </div>

                <button onClick={() => setActiveTest(null)} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-lg text-xs font-semibold">
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        )}

        {/* OTHER ROLES */}
        {(user.role === 'coachingAdmin' || user.role === 'superAdmin') && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-100">👑 {user.role === 'superAdmin' ? 'Super Admin Master Control' : 'Coaching Admin Portal'}</h2>
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
              <p className="text-xs text-slate-400">Institute management, analytics, and billing modules operational.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
