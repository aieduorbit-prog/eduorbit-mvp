import React, { useState } from 'react'
import { generateAIQuiz, exportQuizToPDF } from '../services/aiService'

export default function QuizGenerator() {
  const [subject, setSubject] = useState('Physics')
  const [chapter, setChapter] = useState('Light - Reflection and Refraction')
  const [grade, setGrade] = useState('10')
  const [difficulty, setDifficulty] = useState('Medium')
  const [qType, setQType] = useState('mcq')
  const [numQuestions, setNumQuestions] = useState('5')
  const [loading, setLoading] = useState(false)
  const [quizData, setQuizData] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    const data = await generateAIQuiz({ subject, chapter, grade, difficulty, qType, numQuestions })
    setQuizData(data)
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-indigo-400">⚡ Dynamic Test Paper Generator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Class</label>
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
            <label className="block text-xs font-semibold text-slate-400 mb-1">Difficulty Level</label>
            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">No. of Questions</label>
            <input type="number" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} min="1" max="25" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-slate-100 outline-none" />
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition">
          {loading ? 'Generating Paper...' : '✨ Generate Test Paper'}
        </button>
      </div>

      {quizData && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-left">
          <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-100">{quizData.title}</h3>
              <p className="text-xs text-indigo-400">{quizData.meta}</p>
            </div>
            <button onClick={() => exportQuizToPDF(quizData)} className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              📄 Download PDF
            </button>
          </div>

          <div className="space-y-4">
            {quizData.questions.map((q, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 p-4 rounded-lg">
                <p className="font-medium text-sm mb-2 text-slate-200"><span className="text-indigo-400 font-bold">Q{idx + 1}.</span> {q.question}</p>
                {q.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
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
  )
}
