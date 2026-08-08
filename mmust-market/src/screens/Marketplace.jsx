import { useMemo, useState } from 'react'
import { products, houses, CATEGORIES } from '../data/mock.js'
import { ListingCard } from '../components/ListingCard.jsx'
import { useListings } from '../store/useListings.js'

export default function Marketplace() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')
  const { extra } = useListings()

  const all = useMemo(
    () => [...extra, ...products, ...houses],
    [extra]
  )

  const filtered = all.filter((x) => {
    const matchesCat = cat === 'All' || x.category === cat
    const q = query.toLowerCase()
    const matchesQuery =
      !q ||
      x.title.toLowerCase().includes(q) ||
      x.location.toLowerCase().includes(q) ||
      x.category.toLowerCase().includes(q)
    return matchesCat && matchesQuery
  })

  return (
    <div>
      <h1 className="page-title">Marketplace</h1>

      <div className="search-bar" style={{ marginBottom: 12 }}>
        <span>🔍</span>
        <input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="tag-row" style={{ flexWrap: 'nowrap', overflowX: 'auto' }}>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={'filter-chip ' + (cat === c ? 'active' : '')}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <span className="emoji">🔎</span>
          No listings found.
        </div>
      ) : (
        <div className="grid" style={{ marginTop: 8 }}>
          {filtered.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
