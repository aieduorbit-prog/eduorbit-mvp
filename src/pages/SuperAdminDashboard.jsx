import React, { useState, useEffect } from 'react'
import { supabase } from '../services/supabaseClient'

export default function SuperAdminDashboard({ user }) {
  const [coachings, setCoachings] = useState([])
  const [allClasses, setAllClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSuperAdminData()
  }, [])

  const fetchSuperAdminData = async () => {
    setLoading(true)
    try {
      // Fetch all user profiles (Coachings/Admins)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
      
      if (profilesError) throw profilesError

      // Fetch all classes created across all coachings
      const { data: classesData, error: classesError } = await supabase
        .from('classes')
        .select('*')

      if (classesError) throw classesError

      setCoachings(profilesData || [])
      setAllClasses(classesData || [])
    } catch (err) {
      console.error('Error fetching data:', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', color: '#fff', backgroundColor: '#121212', minHeight: '100vh' }}>
      <h1>Super Admin System Overview</h1>
      <p>Logged in as: {user?.email}</p>

      {loading ? (
        <p>Loading overall system data...</p>
      ) : (
        <>
          {/* System Statistics */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
            <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', flex: 1 }}>
              <h3>Total Registered Users</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{coachings.length}</p>
            </div>
            <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', flex: 1 }}>
              <h3>Total Classes Across Coachings</h3>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{allClasses.length}</p>
            </div>
          </div>

          {/* All Classes Data Stream */}
          <div style={{ background: '#1e1e1e', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>All Active Classes / Batches in System</h2>
            {allClasses.length === 0 ? (
              <p>No classes created in any coaching center yet.</p>
            ) : (
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #444' }}>
                    <th style={{ padding: '8px' }}>Class Name</th>
                    <th style={{ padding: '8px' }}>Section</th>
                    <th style={{ padding: '8px' }}>Created By (User ID)</th>
                  </tr>
                </thead>
                <tbody>
                  {allClasses.map((cls) => (
                    <tr key={cls.id} style={{ borderBottom: '1px solid #333' }}>
                      <td style={{ padding: '8px' }}>{cls.name}</td>
                      <td style={{ padding: '8px' }}>{cls.section || 'N/A'}</td>
                      <td style={{ padding: '8px' }}>{cls.created_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
