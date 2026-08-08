import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { conversations } from '../data/chats.js'

export default function ChatDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const convo = conversations.find((c) => c.id === id)
  const [text, setText] = useState('')
  const [messages, setMessages] = useState(convo ? convo.messages : [])

  if (!convo) {
    return <div className="empty"><span className="emoji">💬</span>Chat not found.</div>
  }

  const send = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setMessages([...messages, { from: 'me', text: text.trim(), t: 'now' }])
    setText('')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <button className="icon-btn" onClick={() => navigate('/chats')}>←</button>
        <div className="avatar">{convo.name[0]}</div>
        <div>
          <h4 style={{ margin: 0 }}>{convo.name}</h4>
          <p className="muted" style={{ margin: 0, fontSize: 12 }}>{convo.listing}</p>
        </div>
      </div>

      <div className="chat-scroll" style={{ flex: 1, overflowY: 'auto' }}>
        {messages.map((m, i) => (
          <div
            key={i}
            className={'bubble ' + (m.from === 'me' ? 'me' : 'them')}
          >
            {m.text}
          </div>
        ))}
      </div>

      <form className="chat-input" onSubmit={send}>
        <input
          className="input"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary" type="submit">Send</button>
      </form>
    </div>
  )
}
