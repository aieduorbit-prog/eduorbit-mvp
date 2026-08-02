import React, { useState } from 'react'
import { jsPDF } from "jspdf"

export default function App() {
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
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="flex justify-between items-center py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm">EO</div>
            <div>
              <h1 className="font-bold text-lg leading-tight">EduOrbit AI OS</h1>
              <p className="text-xs text-slate-400">Dynamic Question Paper & Test Engine</p>
            </div>
          </div>
        </header>

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
    </div>
  )
}
