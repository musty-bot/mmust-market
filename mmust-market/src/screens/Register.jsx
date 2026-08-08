import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    register(name.trim(), phone.trim())
    navigate('/set-pin')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <h1>
          MMUST<span>Market</span>
        </h1>
        <p>Create your account</p>
      </div>

      <form onSubmit={submit}>
        <div className="field">
          <label>Full Name</label>
          <input
            className="input"
            placeholder="e.g. Brian Otieno"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label>Phone Number</label>
          <input
            className="input"
            placeholder="07XXXXXXXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <button className="btn btn-primary btn-block" type="submit">
          Continue
        </button>
      </form>

      <p className="muted" style={{ textAlign: 'center', marginTop: 18 }}>
        Already have an account?{' '}
        <Link to="/login" style={{ color: 'var(--accent)' }}>Login</Link>
      </p>
    </div>
  )
}
