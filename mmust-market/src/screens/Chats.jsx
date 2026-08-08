import { useNavigate } from 'react-router-dom'
import { conversations } from '../data/chats.js'

export default function Chats() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="page-title">Chats</h1>
      <div className="list">
        {conversations.map((c) => (
          <div
            key={c.id}
            className="chat-item"
            onClick={() => navigate(`/chat/${c.id}`)}
          >
            <div className="avatar">{c.name[0]}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="row">
                <h4 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.name}
                </h4>
                <span className="muted" style={{ fontSize: 11 }}>{c.time}</span>
              </div>
              <p className="muted" style={{ margin: '2px 0 0', fontSize: 13 }}>
                {c.listing} · {c.last}
              </p>
            </div>
            {c.unread > 0 && (
              <div
                style={{
                  background: 'var(--accent)',
                  color: '#04150a',
                  borderRadius: 999,
                  minWidth: 20,
                  height: 20,
                  padding: '0 6px',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: 800,
                  fontSize: 12,
                }}
              >
                {c.unread}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
