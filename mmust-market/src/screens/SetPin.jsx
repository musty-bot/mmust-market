import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

export default function SetPin() {
  const { setPin } = useAuth()
  const navigate = useNavigate()
  const [pin, setPinState] = useState('')
  const [confirm, setConfirm] = useState('')

  const press = (n, which) => {
    if (which === 'pin' && pin.length < 4) setPinState(pin + n)
    if (which === 'confirm' && confirm.length < 4) setConfirm(confirm + n)
  }
  const back = (which) => {
    if (which === 'pin') setPinState(pin.slice(0, -1))
    else setConfirm(confirm.slice(0, -1))
  }

  const submit = () => {
    if (pin === confirm && pin.length === 4) {
      setPin(pin)
      navigate('/')
    }
  }

  const renderDots = (val) => (
    <div className="pin-dots">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className={'pin-dot ' + (i < val.length ? 'filled' : '')} />
      ))}
    </div>
  )

  const renderPad = (which) => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginTop: 12,
      }}
    >
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <button key={n} className="btn" onClick={() => press(n, which)}>
          {n}
        </button>
      ))}
      <button className="btn" onClick={() => back(which)}>
        ⌫
      </button>
      <button className="btn" onClick={() => press(0, which)}>
        0
      </button>
      <button className="btn" style={{ visibility: 'hidden' }}>
        ok
      </button>
    </div>
  )

  const match = pin.length === 4 && confirm.length === 4 && pin === confirm

  return (
    <div className="auth-wrap">
      <div className="auth-logo">
        <h1>Set a PIN</h1>
        <p>Secure your account</p>
      </div>

      <p className="page-title" style={{ textAlign: 'center' }}>Create PIN</p>
      {renderDots(pin)}
      {renderPad('pin')}

      <div className="divider" />

      <p className="page-title" style={{ textAlign: 'center' }}>Confirm PIN</p>
      {renderDots(confirm)}
      {renderPad('confirm')}

      {confirm.length === 4 && !match && (
        <p style={{ color: 'var(--danger)', textAlign: 'center' }}>
          PINs do not match
        </p>
      )}

      <button
        className="btn btn-primary btn-block"
        style={{ marginTop: 18 }}
        disabled={!match}
        onClick={submit}
      >
        Finish
      </button>
    </div>
  )
}
