import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export default function TeacherDashboard({ user }) {
  const [subject, setSubject] = useState('')
  const [chapter, setChapter] = useState('')
  const [difficulty, setDifficulty] = useState('Medium')
  const [questions, setQuestions] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [savedTests, setSavedTests] = useState([])

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setSavedTests(data || [])
    } catch (err) {
      console.error('Error fetching tests:', err.message)
    }
  }

  const handleSaveTest = async (e) => {
    e.preventDefault()
    if (!subject || !chapter || !questions) return
    setLoading(true)
    setMsg('')

    try {
      const { error } = await supabase.from('tests').insert([
        {
          subject,
          chapter,
          difficulty,
          questions,
          created_by: user.id
        }
      ])

      if (error) throw error

      setMsg('Test paper saved successfully!')
      setSubject('')
      setChapter('')
      setQuestions('')
      fetchTests()
    } catch (err) {
      setMsg('Error saving test: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h1>Teacher Dashboard - AI Test Generator</h1>
      <p>Teacher Email: {user?.email}</p>

      {/* Create / Add Test Form */}
      <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Create & Save New Test</h2>
        {msg && <p style={{ color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}

        <form onSubmit={handleSaveTest} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="Subject (e.g. Physics)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #444' }}
            />
            <input
              type="text"
              placeholder="Chapter Name"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              required
              style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #444' }}
            />
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444' }}
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          <textarea
            placeholder="Paste or enter AI-generated test questions here..."
            value={questions}
            onChange={(e) => setQuestions(e.target.value)}
            rows={6}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #444' }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Saving Test...' : 'Save & Publish Test'}
          </button>
        </form>
      </div>

      {/* List Created Tests */}
      <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px' }}>
        <h2>Published Tests</h2>
        {savedTests.length === 0 ? (
          <p>No tests published yet.</p>
        ) : (
          savedTests.map((t) => (
            <div key={t.id} style={{ borderBottom: '1px solid #333', padding: '10px 0' }}>
              <h3>{t.subject} - {t.chapter} <span style={{ fontSize: '12px', color: '#888' }}>({t.difficulty})</span></h3>
              <pre style={{ background: '#000', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>{t.questions}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
