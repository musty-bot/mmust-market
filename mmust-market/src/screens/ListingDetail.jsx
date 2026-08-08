import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing } from '../data/mock.js'
import { useListings } from '../store/useListings.js'

export default function ListingDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { extra } = useListings()
  const [sent, setSent] = useState(false)

  const item = getListing(id) || extra.find((x) => x.id === id)

  if (!item) {
    return <div className="empty"><span className="emoji">📭</span>Listing not found.</div>
  }

  const priceLabel =
    item.type === 'house' ? `Ksh ${item.price}/mo` : `Ksh ${item.price}`
  const chat = () => {
    setSent(true)
    setTimeout(() => navigate('/chats'), 800)
  }

  return (
    <div>
      <button className="icon-btn" onClick={() => navigate(-1)}>← Back</button>

      <img className="hero-img" src={item.images?.[0]} alt={item.title} style={{ borderRadius: 14, marginTop: 12 }} />

      {item.images?.length > 1 && (
        <div className="gallery" style={{ marginTop: 12 }}>
          {item.images.map((img, i) => (
            <img key={i} src={img} alt="" />
          ))}
        </div>
      )}

      <div className="section">
        <div className="row">
          <h1 style={{ fontSize: 22, margin: 0 }}>{item.title}</h1>
        </div>
        <div className="row" style={{ marginTop: 6 }}>
          <span className="card-price" style={{ fontSize: 22 }}>{priceLabel}</span>
          <span className="badge badge-accent">{item.category}</span>
        </div>

        <div className="tag-row">
          <span className="badge">📍 {item.location}</span>
          {item.condition && <span className="badge">🔧 {item.condition}</span>}
          {item.type === 'house' && <span className="badge">🛏 {item.beds} bed</span>}
        </div>

        <p style={{ marginTop: 12 }}>{item.description}</p>

        <div className="divider" />

        <div className="row">
          <div className="avatar">{item.seller?.[0] || 'S'}</div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0 }}>{item.seller}</h4>
            <p className="muted" style={{ margin: 0 }}>{item.phone}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <a className="btn btn-block" href={`tel:${item.phone}`}>📞 Call</a>
          <button className="btn btn-primary btn-block" onClick={chat} disabled={sent}>
            {sent ? 'Opening chat...' : '💬 Chat'}
          </button>
        </div>
      </div>
    </div>
  )
}
