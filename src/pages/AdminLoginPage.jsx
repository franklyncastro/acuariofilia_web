import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Completa usuario y contraseña.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    if (authError) {
      setError('Usuario o contraseña incorrectos.')
      return
    }
    navigate('/admin')
  }

  return (
    <div className="admin-auth-screen">
      <form className="admin-auth-card" onSubmit={handleSubmit}>
        <div className="admin-auth-brand">
          <div className="brand-mark"><img src="/Logo.png" alt="logo" /></div>
          <div>
            
            <div className="admin-auth-title">Acuariofilia Punta Cana</div>
            <div className="admin-auth-subtitle">Panel de administración</div>
          </div>
        </div>

        <label className="field">
          <span>Usuario (correo)</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@acuariofiliapc.com"
            autoComplete="username"
          />
        </label>

        <label className="field">
          <span>Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </label>

        {error && <div className="admin-error">{error}</div>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>

        <a className="admin-back-link" href="/">
          Volver al sitio público
        </a>
      </form>
    </div>
  )
}
