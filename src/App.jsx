import React, { useState } from 'react'
import { jsPDF } from "jspdf"

export default function App() {
  const [activeTab, setActiveTab] = useState('generator')
  
  // Shared Database State (Simulating Cloud Sync for MVP)
  const [publishedTests, setPublishedTests] = useState([
    { id: 'TEST-101', title: 'Physics: Light - Reflection & Refraction', class: 'Class 10', questionsCount: 5, status: 'Active' }
  ])
  const [studentSubmissions, setStudentSubmissions] = useState([
    { studentName: 'Rahul Sharma', testName: 'Physics: Light', score: '4/5', status: 'Evaluated & Sent to Parents' }
  ])

  // Test Generator State
  const [subject, setSubject] = useState('Physics')
  const [chapter, setChapter] = useState('Light - Reflection and Refraction')
  const [grade, setGrade] = useState('10')
  const [difficulty, setDifficulty] = useState('Medium')
  const [qType, setQType] = useState('mcq')
  const [numQuestions, setNumQuestions] = useState('5')
  const [loading, setLoading] = useState(false)
  const [quizData, setQuizData] = useState(null)
  const [publishMsg, setPublishMsg] = useState('')

  // Student Test Portal State
  const [testCodeInput, setTestCodeInput] = useState('')
  const [activeTest, setActiveTest] = useState(null)
  const [studentAnswers, setStudentAnswers] = useState({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [resultSummary, setResultSummary] = useState(null)

  const handleGenerate = () => {
    setLoading(true)
    setPublishMsg('')
    setTimeout(() => {
      const count = parseInt(numQuestions) || 5
      const questions = []

      for (let i = 1; i <= count; i++) {
        questions.push({
          id: i,
          type: qType.toUpperCase(),
          question: `[${subject} - ${chapter}] Q${i}: Standard ${difficulty} concept question?`,
          options: ["Core Principle A", "Secondary Theory B", "Practical App C", "Exception D"],
          correctAnswer: "Core Principle A"
        })
      }

      setQuizData({
        testId: `TEST-${Math.floor(100 + Math.random() * 900)}`,
        title: `${subject}: ${chapter}`,
        meta: `Class ${grade} | Level: ${difficulty} | Type: ${qType.toUpperCase()}`,
        questions
      })
      setLoading(false)
    }, 400)
  }

  const handlePublishTest = () => {
    if (!quizData) return;
    const newTest = {
      id: quizData.testId,
      title: quizData.title,
      class: `Class ${grade}`,
      questionsCount: quizData.questions.length,
      status: 'Active',
      questions: quizData.questions
    };
    setPublishedTests([newTest, ...publishedTests]);
    setPublishMsg(`🎉 Test successfully published! Live Test Code: ${quizData.testId}`);
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
      if (y > 260) { doc.addPage(); y = 20; }
      doc.setFontSize(11)
      doc.text(`Q${idx + 1}: ${q.question}`, 20, y)
      y += 8
      q.options.forEach((opt, oIdx) => {
        doc.setFontSize(10)
        doc.text(`   (${String.fromCharCode(65 + oIdx)}) ${opt}`, 25, y)
        y += 6
      })
      y += 4
    })
    doc.save(`${quizData.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.pdf`)
  }

  const handleStartTest = (test) => {
    setActiveTest(test);
    setStudentAnswers({});
    setTestSubmitted(false);
    setResultSummary(null);
  }

  const handleOptionSelect = (qId, option) => {
    setStudentAnswers({...studentAnswers, [qId]: option});
  }

  const handleSubmitTest = () => {
    let correctCount = 0;
    activeTest.questions.forEach((q) => {
      if (studentAnswers[q.id] === q.correctAnswer) correctCount++;
    });
    const scoreStr = `${correctCount}/${activeTest.questions.length}`;
    setTestSubmitted(true);
    setResultSummary({ score: scoreStr, correct: correctCount, total: activeTest.questions.length });

    // Auto update teacher submission ledger & mock parent notification
    setStudentSubmissions([
      { studentName: 'Current Logged Student', testName: activeTest.title, score: scoreStr, status: 'Evaluated & Sent to Parents via WhatsApp' },
      ...studentSubmissions
    ]);
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">EO</div>
            <div>
              <h1 className="font-bold text-sm leading-tight">EduOrbit AI OS</h1>
              <p className="text-[10px] text-slate-400">Automated Coaching Engine</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <span>📊</span> Teacher Dashboard
            </button>
            <button onClick={() => setActiveTab('generator')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'generator' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <span>⚡</span> AI Test Generator
            </button>
            <button onClick={() => setActiveTab('studentPortal')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'studentPortal' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <span>✍️</span> Student Test Portal
            </button>
            <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${activeTab === 'reports' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <span>📈</span> Parent Reports Ledger
            </button>
          </nav>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Automated Loop Active</p>
          <p className="text-[10px] text-emerald-400 mt-0.5">● Auto-Sync to Parents Enabled</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Nav */}
        <header className="bg-slate-900 border-b border-slate-800 p-3 flex justify-between items-center md:hidden overflow-x-auto">
          <span className="font-bold text-xs">EduOrbit OS</span>
          <div className="flex gap-1 text-[11px]">
            <button onClick={() => setActiveTab('dashboard')} className={`px-2 py-1 rounded ${activeTab === 'dashboard' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Dashboard</button>
            <button onClick={() => setActiveTab('generator')} className={`px-2 py-1 rounded ${activeTab === 'generator' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Create</button>
            <button onClick={() => setActiveTab('studentPortal')} className={`px-2 py-1 rounded ${activeTab === 'studentPortal' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Test Portal</button>
            <button onClick={() => setActiveTab('reports')} className={`px-2 py-1 rounded ${activeTab === 'reports' ? 'bg-indigo-600' : 'bg-slate-800'}`}>Reports</button>
          </div>
        </header>

        <main className="flex-1 p-6 max-w-5xl w-full mx-auto space-y-6">
          {/* TAB 1: TEACHER DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 text-left">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Teacher Control Center</h2>
                <p className="text-xs text-slate-400">Monitor active tests published to students and parent notification logs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <p className="text-xs text-slate-400">Published Tests</p>
                  <p className="text-2xl font-bold mt-1 text-indigo-400">{publishedTests.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <p className="text-xs text-slate-400">Student Submissions</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-400">{studentSubmissions.length}</p>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
                  <p className="text-xs text-slate-400">Parent Dispatch Status</p>
                  <p className="text-2xl font-bold mt-1 text-emerald-400">100% Delivered</p>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h3 className="font-semibold text-sm mb-3 text-slate-200">Active Tests Available to Students</h3>
                <div className="space-y-2">
                  {publishedTests.map((t, i) => (
                    <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-indigo-400">[{t.id}]</span> <span className="text-slate-200">{t.title}</span> ({t.class})
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800">Live for Test</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI TEST GENERATOR & PUBLISHER */}
          {activeTab === 'generator' && (
            <div className="space-y-6 text-left">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
                <h2 className="text-lg font-bold mb-4 text-indigo-400">⚡ AI Exam Creator & Publisher</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Class</label>
                    <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
                      {[...Array(12)].map((_, i) => <option key={i+1} value={i+1}>Class {i+1}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                    <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Chapter</label>
                    <input type="text" value={chapter} onChange={(e) => setChapter(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Question Type</label>
                    <select value={qType} onChange={(e) => setQType(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
                      <option value="mcq">MCQs (Auto-Evaluated)</option>
                      <option value="short">Short Answer</option>
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
                    <label className="block text-xs font-semibold text-slate-400 mb-1">No. of Questions</label>
                    <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} min="1" max="10" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
                  </div>
                </div>

                <button onClick={handleGenerate} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition">
                  {loading ? 'Generating Paper...' : '✨ Generate AI Test Paper'}
                </button>
              </div>

              {quizData && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-800 pb-4 gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-slate-100">{quizData.title} <span className="text-xs bg-indigo-950 text-indigo-400 px-2 py-0.5 rounded border border-indigo-800">{quizData.testId}</span></h3>
                      <p className="text-xs text-slate-400">{quizData.meta}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={exportPDF} className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
                        📄 PDF Download
                      </button>
                      <button onClick={handlePublishTest} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3 py-2 rounded-lg transition">
                        🚀 Publish to Students
                      </button>
                    </div>
                  </div>

                  {publishMsg && <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs rounded-lg font-semibold">{publishMsg}</div>}

                  <div className="space-y-3">
                    {quizData.questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                        <p className="font-medium text-sm text-slate-200"><span className="text-indigo-400 font-bold">Q{idx + 1}.</span> {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="bg-slate-900 border border-slate-800 p-2 text-xs rounded text-slate-300">
                              {String.fromCharCode(65 + oIdx)}. {opt} {opt === q.correctAnswer && <span className="text-emerald-400 font-bold">(Correct)</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: STUDENT TEST PORTAL */}
          {activeTab === 'studentPortal' && (
            <div className="space-y-6 text-left">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-lg font-bold text-slate-100 mb-2">✍️ Student Examination Portal</h2>
                <p className="text-xs text-slate-400 mb-4">Enter the Test Code provided by your teacher to attempt the live test.</p>
                
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Enter Test Code (e.g. TEST-101)" 
                    value={testCodeInput} 
                    onChange={(e) => setTestCodeInput(e.target.value.toUpperCase())}
                    className="bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none flex-1" 
                  />
                  <button 
                    onClick={() => {
                      const found = publishedTests.find(t => t.id === testCodeInput);
                      if (found) handleStartTest(found);
                      else alert("Invalid or inactive Test Code! Try TEST-101");
                    }} 
                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-5 py-2 rounded-lg"
                  >
                    Start Test
                  </button>
                </div>
              </div>

              {activeTest && !testSubmitted && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                    <h3 className="font-bold text-indigo-400">{activeTest.title}</h3>
                    <span className="text-xs text-slate-400">Total Questions: {activeTest.questions.length}</span>
                  </div>

                  <div className="space-y-5">
                    {activeTest.questions.map((q, idx) => (
                      <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg space-y-3">
                        <p className="text-sm font-medium text-slate-200">Q{idx + 1}. {q.question}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {q.options.map((opt, oIdx) => {
                            const isSelected = studentAnswers[q.id] === opt;
                            return (
                              <button 
                                key={oIdx}
                                onClick={() => handleOptionSelect(q.id, opt)}
                                className={`p-2.5 text-xs rounded text-left border transition ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white font-semibold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'}`}
                              >
                                {String.fromCharCode(65 + oIdx)}. {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button onClick={handleSubmitTest} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-lg transition">
                    Submit Test & Generate Instant Report
                  </button>
                </div>
              )}

              {testSubmitted && resultSummary && (
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center space-y-4">
                  <div className="inline-block bg-emerald-950 border border-emerald-800 text-emerald-400 p-3 rounded-full text-xl mb-2">🎉</div>
                  <h3 className="text-xl font-bold text-slate-100">Test Submitted Successfully!</h3>
                  <p className="text-sm text-slate-300">Your Score: <span className="text-indigo-400 font-bold text-lg">{resultSummary.score}</span></p>
                  <p className="text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded border border-emerald-900">
                    ✓ Evaluation report automatically dispatched to Teacher Dashboard and Parent's WhatsApp/SMS gateway!
                  </p>
                  <button onClick={() => setActiveTest(null)} className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg">
                    Back to Portal
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PARENT REPORTS LEDGER */}
          {activeTab === 'reports' && (
            <div className="space-y-4 text-left">
              <div>
                <h2 className="text-xl font-bold text-slate-100">Parent & Student Report Ledger</h2>
                <p className="text-xs text-slate-400">Automated dispatch records sent instantly upon test completion.</p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                {studentSubmissions.map((sub, i) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center text-xs gap-2">
                    <div>
                      <p className="font-bold text-slate-200">{sub.studentName} <span className="text-indigo-400 font-normal">({sub.testName})</span></p>
                      <p className="text-slate-400">Secured Score: <span className="text-emerald-400 font-bold">{sub.score}</span></p>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 px-2.5 py-1 rounded border border-emerald-800 font-medium">
                      {sub.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
