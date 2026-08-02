import React, { useState } from 'react'
import { jsPDF } from "jspdf"

export default function App() {
  const [activeTab, setActiveTab] = useState('generator')
  
  // Test Generator State
  const [subject, setSubject] = useState('Physics')
  const [chapter, setChapter] = useState('Light - Reflection and Refraction')
  const [grade, setGrade] = useState('10')
  const [difficulty, setDifficulty] = useState('Medium')
  const [qType, setQType] = useState('mcq')
  const [numQuestions, setNumQuestions] = useState('5')
  const [loading, setLoading] = useState(false)
  const [quizData, setQuizData] = useState(null)

  const handleGenerate = () => {
    setLoading(true)
    setTimeout(() => {
      const count = parseInt(numQuestions) || 5
      const questions = []

      for (let i = 1; i <= count; i++) {
        if (qType === 'mcq') {
          questions.push({
            id: i,
            type: 'MCQ',
            question: `[${subject} - ${chapter}] Q${i}: Standard ${difficulty} concept question for Class ${grade}?`,
            options: ["Option A: Core Principle", "Option B: Secondary Theory", "Option C: Practical Application", "Option D: Standard Exception"],
            correctAnswer: "Option A"
          })
        } else if (qType === 'short') {
          questions.push({
            id: i,
            type: 'Short Answer (2-3 Marks)',
            question: `[${subject}] Define and explain key concepts of ${chapter} (Q${i})?`,
            answerKey: `Model key points and core formulas for Class ${grade}.`
          })
        } else if (qType === 'long') {
          questions.push({
            id: i,
            type: 'Long Answer (5 Marks)',
            question: `[${subject}] Detailed derivation/explanation for ${chapter} (Question ${i})?`,
            answerKey: `Detailed evaluation criteria and key step-by-step points.`
          })
        } else {
          questions.push({
            id: i,
            type: 'Fill in the Blanks',
            question: `__________ is the fundamental principle behind ${chapter} in ${subject}.`,
            correctAnswer: "Core Term"
          })
        }
      }

      setQuizData({
        title: `${subject}: ${chapter}`,
        meta: `Class ${grade} | Level: ${difficulty.toUpperCase()} | Type: ${qType.toUpperCase()}`,
        questions
      })
      setLoading(false)
    }, 400)
  }

  const exportPDF = () => {
    if (!quizData) return
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text(quizData.title, 20, 20)
    doc.setFontSize(10)
    doc.text(quizData.meta, 20, 28)
    doc.line(20, 32, 190, 32)

    let y = 42
    quizData.questions.forEach((q, idx) => {
      if (y > 260) {
        doc.addPage()
        y = 20
      }
      doc.setFontSize(11)
      doc.text(`Q${idx + 1} [${q.type}]: ${q.question}`, 20, y)
      y += 8

      if (q.options) {
        q.options.forEach((opt, oIdx) => {
          doc.setFontSize(10)
          doc.text(`   (${String.fromCharCode(65 + oIdx)}) ${opt}`, 25, y)
          y += 6
        })
      } else if (q.answerKey) {
        doc.setFontSize(9)
        doc.text(`   [Answer Key]: ${q.answerKey}`, 25, y)
        y += 6
      }
      y += 4
    })

    doc.save(`${quizData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`)
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">EO</div>
            <div>
              <h1 className="font-bold text-sm leading-tight">EduOrbit AI OS</h1>
              <p className="text-[10px] text-slate-400">Default Coaching Academy</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <span>📊</span> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('generator')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'generator' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <span>⚡</span> AI Quiz Generator
            </button>
            <button 
              onClick={() => setActiveTab('students')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'students' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <span>🎓</span> Students
            </button>
          </nav>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Teacher Portal</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">● System Operational</p>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header Navigation */}
        <header className="bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center md:hidden">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded-md text-xs">EO</div>
            <span className="font-bold text-sm">EduOrbit AI OS</span>
          </div>
          <div className="flex gap-2 text-xs">
            <button onClick={() => setActiveTab('dashboard')} className={`px-2 py-1 rounded ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('generator')} className={`px-2 py-1 rounded ${activeTab === 'generator' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Generator</button>
            <button onClick={() => setActiveTab('students')} className={`px-2 py-1 rounded ${activeTab === 'students' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Students</button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-100">Welcome Back, TEACHER</h2>
              <p className="text-sm text-slate-400">EduOrbit OS is actively running automated AI Operations.</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">Total Students</p>
                  <p className="text-2xl font-bold mt-1 text-slate-100">2</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">Active Teachers</p>
                  <p className="text-2xl font-bold mt-1 text-slate-100">1</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <p className="text-xs text-slate-400 font-medium">System Status</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-400">100% Operational</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'generator' && (
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 text-indigo-400">⚡ Dynamic Test Paper Controls</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5 text-left">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Class</label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
                      {[...Array(12)].map((_, i) => (
                        <option key={i+1} value={i+1}>Class {i+1}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Chapter / Topic</label>
                    <input type="text" value={chapter} onChange={(e) => setChapter(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Question Type</label>
                    <select value={qType} onChange={(e) => setQType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
                      <option value="mcq">MCQs (Multiple Choice)</option>
                      <option value="short">Short Answer Questions</option>
                      <option value="long">Long Answer Questions</option>
                      <option value="fill">Fill in the Blanks</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Number of Questions</label>
                    <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} min="1" max="25" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                  </div>
                </div>

                <button onClick={handleGenerate} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition">
                  {loading ? 'Generating Paper...' : '✨ Generate Test Paper'}
                </button>
              </div>

              {quizData && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-left space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{quizData.title}</h3>
                      <p className="text-xs text-indigo-400">{quizData.meta}</p>
                    </div>
                    <button onClick={exportPDF} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                      📄 Download PDF
                    </button>
                  </div>

                  <div className="space-y-3">
                    {quizData.questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                        <p className="font-medium text-sm text-slate-200"><span className="text-indigo-400 font-bold">Q{idx + 1}.</span> {q.question}</p>
                        {q.options && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
                            {q.options.map((opt, oIdx) => (
                              <div key={oIdx} className="bg-slate-900 border border-slate-800 p-2 text-xs rounded text-slate-300">
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </div>
                            ))}
                          </div>
                        )}
                        {q.answerKey && (
                          <div className="mt-2 p-2 bg-slate-900/50 border border-slate-800 rounded text-xs text-slate-400">
                            <span className="text-emerald-400 font-semibold">Answer Key: </span>{q.answerKey}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-100">Students Roster</h2>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <p className="text-sm text-slate-400">Class 10 - Batch A (2 Enrolled)</p>
                <div className="mt-4 space-y-2">
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between text-sm">
                    <span>Rahul Sharma (Roll #101)</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between text-sm">
                    <span>Ananya Verma (Roll #102)</span>
                    <span className="text-emerald-400">Active</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
