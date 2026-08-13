import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? 'authed' : 'anon')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? 'authed' : 'anon')
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  if (status === 'checking') {
    return <div className="admin-loading">Verificando acceso…</div>
  }
  if (status === 'anon') {
    return <Navigate to="/admin/login" replace />
  }
  return children
}
