import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const items = [
    { label: 'My listings', sub: 'Items you posted', icon: '📦' },
    { label: 'Saved', sub: 'Bookmarked items', icon: '🔖' },
    { label: 'My chats', sub: 'Messages', icon: '💬', action: () => navigate('/chats') },
    { label: 'Settings', sub: 'Account & privacy', icon: '⚙️' },
    { label: 'Help & support', sub: 'FAQ, contact us', icon: '❓' },
  ]

  return (
    <div>
      <h1 className="page-title">Profile</h1>

      <div className="card" style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'center' }}>
        <div className="avatar" style={{ width: 60, height: 60, fontSize: 24 }}>
          {user?.name?.[0]?.toUpperCase() || '👤'}
        </div>
        <div>
          <h3 style={{ margin: 0 }}>{user?.name || 'Student'}</h3>
          <p className="muted" style={{ margin: 0 }}>{user?.phone}</p>
          <span className="badge badge-accent" style={{ marginTop: 6, display: 'inline-block' }}>
            MMUST Student
          </span>
        </div>
      </div>

      <div className="section list" style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)' }}>
        {items.map((it) => (
          <div
            key={it.label}
            className="list-item"
            style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}
            onClick={it.action}
          >
            <div className="row" style={{ gap: 12 }}>
              <span style={{ fontSize: 22 }}>{it.icon}</span>
              <div>
                <h4>{it.label}</h4>
                <p>{it.sub}</p>
              </div>
            </div>
            <span className="muted">›</span>
          </div>
        ))}
      </div>

      <button
        className="btn btn-danger btn-block"
        style={{ marginTop: 20 }}
        onClick={() => {
          logout()
          navigate('/login')
        }}
      >
        Log out
      </button>

      <p className="muted" style={{ textAlign: 'center', marginTop: 16, fontSize: 12 }}>
        MMUST Market v1.0 · Campus marketplace
      </p>
    </div>
  )
}
