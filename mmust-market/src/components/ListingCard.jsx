import { useNavigate } from 'react-router-dom'

export function ListingCard({ item }) {
  const navigate = useNavigate()
  const priceLabel =
    item.type === 'house' ? `Ksh ${item.price}/mo` : `Ksh ${item.price}`

  return (
    <div className="card" onClick={() => navigate(`/listing/${item.id}`)}>
      <img
        className="card-img"
        src={item.images?.[0]}
        alt={item.title}
        loading="lazy"
      />
      <div className="card-body">
        <h3 className="card-title">{item.title}</h3>
        <div className="row">
          <span className="card-price">{priceLabel}</span>
          <span className="badge badge-accent">
            {item.category}
          </span>
        </div>
        <p className="muted" style={{ marginTop: 6 }}>
          {item.location}
        </p>
      </div>
    </div>
  )
}
