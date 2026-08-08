import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES } from '../data/mock.js'
import { useListings } from '../store/useListings.js'
import { useAuth } from '../store/AuthContext.jsx'

export default function Post() {
  const navigate = useNavigate()
  const { addListing } = useListings()
  const { user } = useAuth()

  const [type, setType] = useState('product')
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    location: '',
    phone: user?.phone || '',
    description: '',
  })

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const [submitting, setSubmitting] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price || submitting) return
    setSubmitting(true)
    try {
      await addListing({
        ...form,
        type,
        price: Number(form.price),
        seller: user?.name || 'You',
        phone: form.phone || user?.phone || '0700000000',
        images: [`https://picsum.photos/seed/${Date.now()}/600/600`],
      })
      navigate('/market')
    } catch (e) {
      console.error('Submit error', e)
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Post a listing</h1>

      <div className="tag-row">
        <button
          className={'filter-chip ' + (type === 'product' ? 'active' : '')}
          onClick={() => setType('product')}
        >
          🛒 Item / Ad
        </button>
        <button
          className={'filter-chip ' + (type === 'house' ? 'active' : '')}
          onClick={() => setType('house')}
        >
          🏠 Hostel / House
        </button>
      </div>

      <form onSubmit={submit}>
        <div className="field">
          <label>Title</label>
          <input
            className="input"
            placeholder={type === 'house' ? 'e.g. Single room near gate' : 'e.g. HP Laptop i5'}
            value={form.title}
            onChange={set('title')}
          />
        </div>

        <div className="row" style={{ gap: 12 }}>
          <div className="field" style={{ flex: 1 }}>
            <label>{type === 'house' ? 'Rent (Ksh/mo)' : 'Price (Ksh)'}</label>
            <input
              className="input"
              type="number"
              placeholder="0"
              value={form.price}
              onChange={set('price')}
            />
          </div>
          <div className="field" style={{ flex: 1 }}>
            <label>Category</label>
            <select className="select" value={form.category} onChange={set('category')}>
              {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>Location</label>
          <input
            className="input"
            placeholder="e.g. Main Campus, Milimani"
            value={form.location}
            onChange={set('location')}
          />
        </div>

        <div className="field">
          <label>Contact phone</label>
          <input
            className="input"
            placeholder="07XXXXXXXX"
            value={form.phone}
            onChange={set('phone')}
          />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea
            className="textarea"
            placeholder="Describe condition, reason for selling, etc."
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? 'Publishing...' : 'Publish listing'}
        </button>
      </form>
    </div>
  )
}
