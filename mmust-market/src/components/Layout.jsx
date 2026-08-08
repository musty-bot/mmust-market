import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/AuthContext.jsx'

const tabs = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/market', icon: '🛒', label: 'Market' },
  { to: '/post', icon: '➕', label: 'Post' },
  { to: '/chats', icon: '💬', label: 'Chats' },
  { to: '/profile', icon: '👤', label: 'Profile' },
]

export default function Layout({ children }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="header">
        <div className="brand">
          MMUST<span>Market</span>
        </div>
        <button
          className="icon-btn"
          onClick={() => navigate('/profile')}
          aria-label="Profile"
        >
          {user?.name?.[0]?.toUpperCase() || '👤'}
        </button>
      </header>

      <main className="screen">{children}</main>

      <button
        className="fab"
        onClick={() => navigate('/post')}
        aria-label="Post listing"
      >
        +
      </button>

      <nav className="tab-bar">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.to === '/'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span className="tab-icon">{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
