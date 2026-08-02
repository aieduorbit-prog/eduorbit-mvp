import React from 'react'
import QuizGenerator from './components/QuizGenerator'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center py-4 mb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 text-white font-bold p-2 rounded-lg text-sm">EO</div>
            <div>
              <h1 className="font-bold text-lg leading-none">EduOrbit AI OS</h1>
              <p className="text-xs text-slate-400">Next-Gen Exam & Test Engine</p>
            </div>
          </div>
        </header>

        <QuizGenerator />
      </div>
    </div>
  )
}
