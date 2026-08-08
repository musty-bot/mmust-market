import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const press = (n) => {
    if (pin.length < 4) setPin(pin + n)
  }
  const back = () => setPin(pin.slice(0, -1))

  const submit = () => {
    try {
      login(pin)
      navigate('/')
    } catch (e) {
      setError(e.message)
      setPin('')
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <h1>
          MMUST<span>Market</span>
        </h1>
        <p>Campus buy, sell & rent</p>
      </div>

      <p className="page-title" style={{ textAlign: 'center' }}>
        Enter your PIN
      </p>
      <div className="pin-dots">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={'pin-dot ' + (i < pin.length ? 'filled' : '')} />
        ))}
      </div>
      {error && (
        <p style={{ color: 'var(--danger)', textAlign: 'center' }}>{error}</p>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          marginTop: 16,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button key={n} className="btn" onClick={() => press(n)}>
            {n}
          </button>
        ))}
        <button className="btn" onClick={back}>
          ⌫
        </button>
        <button className="btn" onClick={() => press(0)}>
          0
        </button>
        <button className="btn btn-primary" onClick={submit} disabled={pin.length < 4}>
          ✓
        </button>
      </div>

      <p className="muted" style={{ textAlign: 'center', marginTop: 20 }}>
        New here? <Link to="/register" style={{ color: 'var(--accent)' }}>Create account</Link>
      </p>
      <p className="muted" style={{ textAlign: 'center', fontSize: 12, marginTop: 8 }}>
        Demo PIN: 1234
      </p>
    </div>
  )
}
