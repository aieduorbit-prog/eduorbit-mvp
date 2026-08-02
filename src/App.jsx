import React, { useState, useEffect } from 'react'
import { supabase } from './services/supabaseClient'
import Login from './pages/Login'
import SuperAdminDashboard from './pages/SuperAdminDashboard'
import CoachingAdminDashboard from './pages/CoachingAdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import StudentDashboard from './pages/StudentDashboard'

export default function App() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null) // 'super_admin' | 'coaching_admin' | 'teacher' | 'student'
  const [loading, setLoading] = useState(true)

  // Auth Session Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchUserRole(session.user.id)
      else setLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchUserRole(session.user.id)
      else setLoading(false)
    })

    return () => authListener.subscription.unsubscribe()
  }, [])

  // Fetch Role from Database
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      
      if (error) throw error
      setRole(data?.role)
    } catch (err) {
      console.error('Error fetching role:', err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div style={{ color: '#fff', padding: '20px' }}>Loading...</div>

  // If not logged in, show Login
  if (!user) return <Login />

  // Render Dashboard based on Role
  switch (role) {
    case 'super_admin':
      return <SuperAdminDashboard user={user} />
    case 'coaching_admin':
      return <CoachingAdminDashboard user={user} />
    case 'teacher':
      return <TeacherDashboard user={user} />
    case 'student':
      return <StudentDashboard user={user} />
    default:
      return <div style={{ color: '#fff', padding: '20px' }}>Unauthorized or Role Not Found</div>
  }
}
