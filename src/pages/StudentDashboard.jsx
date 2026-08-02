import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export default function StudentDashboard({ user }) {
  const [availableTests, setAvailableTests] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTests()
  }, [])

  const fetchTests = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('tests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setAvailableTests(data || [])
    } catch (err) {
      console.error('Error fetching student tests:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h1>Student Dashboard</h1>
      <p>Logged in as: {user?.email}</p>

      <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px' }}>
        <h2>Available Tests</h2>

        {loading ? (
          <p>Loading tests...</p>
        ) : availableTests.length === 0 ? (
          <p>No tests available right now.</p>
        ) : (
          availableTests.map((t) => (
            <div key={t.id} style={{ borderBottom: '1px solid #333', padding: '15px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>{t.subject} - {t.chapter}</h3>
                <span style={{ padding: '4px 8px', background: '#333', borderRadius: '4px', fontSize: '12px' }}>
                  {t.difficulty}
                </span>
              </div>
              <p style={{ color: '#aaa', fontSize: '14px' }}>Questions / Test Paper:</p>
              <pre style={{ background: '#000', padding: '10px', borderRadius: '4px', whiteSpace: 'pre-wrap' }}>
                {t.questions}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
