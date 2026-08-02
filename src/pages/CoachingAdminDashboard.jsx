import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export default function CoachingAdminDashboard({ user }) {
  const [classes, setClasses] = useState([])
  const [className, setClassName] = useState('')
  const [section, setSection] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  // Load existing classes
  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setClasses(data || [])
    } catch (err) {
      console.error('Error fetching classes:', err.message)
    }
  }

  // Add new class function
  const handleAddClass = async (e) => {
    e.preventDefault()
    if (!className) return
    setLoading(true)
    setMsg('')

    try {
      const { data, error } = await supabase
        .from('classes')
        .insert([{ name: className, section: section, created_by: user.id }])

      if (error) throw error

      setMsg('Class added successfully!')
      setClassName('')
      setSection('')
      fetchClasses() // Refresh class list
    } catch (err) {
      setMsg('Error: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#1e1e1e', minHeight: '100vh' }}>
      <h1>Coaching Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>

      {/* Add New Class Form */}
      <div style={{ background: '#2d2d2d', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Add New Class / Batch</h2>
        {msg && <p style={{ color: msg.includes('Error') ? 'red' : 'green' }}>{msg}</p>}
        
        <form onSubmit={handleAddClass} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Class/Batch Name (e.g. Class 10th A)"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
          />
          <input
            type="text"
            placeholder="Section (Optional)"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #555' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Adding...' : 'Add Class'}
          </button>
        </form>
      </div>

      {/* Display Classes List */}
      <div style={{ background: '#2d2d2d', padding: '15px', borderRadius: '8px' }}>
        <h2>All Classes / Batches</h2>
        {classes.length === 0 ? (
          <p>No classes added yet.</p>
        ) : (
          <ul style={{ listStyleType: 'square', paddingLeft: '20px' }}>
            {classes.map((c) => (
              <li key={c.id} style={{ margin: '8px 0' }}>
                <strong>{c.name}</strong> {c.section ? `(Section: ${c.section})` : ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
