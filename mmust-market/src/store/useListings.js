import { useState } from 'react'

// Simple in-memory listings store with localStorage persistence fallback.
const KEY = 'mmust_listings'

export function useListings() {
  const [extra, setExtra] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]')
    } catch {
      return []
    }
  })

  const addListing = (listing) => {
    const item = {
      ...listing,
      id: 'u' + Date.now(),
      createdAt: Date.now(),
      userPosted: true,
    }
    const next = [item, ...extra]
    localStorage.setItem(KEY, JSON.stringify(next))
    setExtra(next)
    return item
  }

  return { extra, addListing }
}
