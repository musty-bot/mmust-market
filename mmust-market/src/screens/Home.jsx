import { useNavigate } from 'react-router-dom'
import { products, houses } from '../data/mock.js'
import { ListingCard } from '../components/ListingCard.jsx'

export default function Home() {
  const navigate = useNavigate()
  const recent = [...products, ...houses]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 4)

  return (
    <div>
      <div className="search-bar" onClick={() => navigate('/market')}>
        <span>Search</span>
        <input placeholder="Search items, hostels, books..." readOnly />
      </div>

      <div className="section">
        <div className="row">
          <h2 className="page-title" style={{ margin: 0 }}>Categories</h2>
        </div>
        <div className="tag-row">
          <button className="filter-chip" onClick={() => navigate('/market')}>Books</button>
          <button className="filter-chip" onClick={() => navigate('/market')}>Electronics</button>
          <button className="filter-chip" onClick={() => navigate('/market')}>Hostels</button>
          <button className="filter-chip" onClick={() => navigate('/market')}>Food</button>
        </div>
      </div>

      <div className="section">
        <div className="row">
          <h2 className="page-title" style={{ margin: 0 }}>Latest</h2>
          <button className="badge" onClick={() => navigate('/market')}>See all →</button>
        </div>
        <div className="grid">
          {recent.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div className="section card" style={{ padding: 16, textAlign: 'center' }}>
        <h3 style={{ margin: '0 0 6px' }}>Sell or rent?</h3>
        <p className="muted" style={{ margin: '0 0 12px' }}>
          Post in seconds to thousands of MMUST students.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/post')}>
          Post a listing
        </button>
      </div>
    </div>
  )
}
