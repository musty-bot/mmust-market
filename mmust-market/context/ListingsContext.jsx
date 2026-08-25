import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import * as FileSystem from 'expo-file-system/legacy'

const ListingsContext = createContext(null)
const BUCKET = 'listing-images'

export async function uploadListingImages(imageUris, isOnline) {
  if (!isOnline) throw new Error('No internet connection')
  if (!imageUris?.length) return []
  const results = []
  for (let i = 0; i < imageUris.length; i++) {
    const uri = imageUris[i]
    const ext = uri.split('.').pop() || 'jpg'
    const path = `${Date.now()}_${i}.${ext}`
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 })
    const binary = atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let j = 0; j < binary.length; j++) {
      bytes[j] = binary.charCodeAt(j)
    }
    console.log('Uploading', path, 'bytes', bytes.length)
    const { error } = await supabase.storage.from(BUCKET).upload(path, bytes.buffer, {
      contentType: `image/${ext === 'png' ? 'png' : 'jpeg'}`,
      upsert: true,
    })
    if (error) {
      console.error('Upload error', error)
      throw error
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    results.push(data.publicUrl)
  }
  return results
}

export function ListingsProvider({ children }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)
  const { user } = useAuth()

  const loadSettings = async () => {
    try {
      const { data } = await supabase.from('app_settings').select('*')
      const settings = data?.reduce((a, b) => ({ ...a, [b.key]: b.value }), {}) || {}
      const val = settings.auto_approve === 'true'
      setAutoApprove(val)
      console.log('Auto-approve setting:', val)
      return val
    } catch (e) {
      console.error('Failed to load settings', e)
      return false
    }
  }

  const loadListings = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const loadMyListings = async () => {
    if (!user?.id) return []
    const { data } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    return data || []
  }

  const deleteListing = async (id, isOnline) => {
    if (!isOnline) throw new Error('No internet connection')
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      setAutoApprove(false)
      return
    }
    loadListings()
    loadSettings()
  }, [user])

  const addListing = async (listing, imageUris = [], isOnline) => {
    if (!isOnline) throw new Error('No internet connection')
    let images = listing.images || []
    if (imageUris.length > 0) {
      images = await uploadListingImages(imageUris, isOnline)
    }

    const shouldAutoApprove = autoApprove
    const status = shouldAutoApprove ? 'approved' : 'pending'

    const { data, error } = await supabase
      .from('listings')
      .insert({
        ...listing,
        images,
        user_id: user?.id,
        status,
        approved_at: shouldAutoApprove ? new Date().toISOString() : null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single()
    if (error) throw error
    if (shouldAutoApprove) {
      loadListings()
    }
    return data
  }

  return (
    <ListingsContext.Provider value={{ items, addListing, deleteListing, loadMyListings, loading, refresh: loadListings, autoApprove }}>
      {children}
    </ListingsContext.Provider>
  )
}

export function useListings() {
  const ctx = useContext(ListingsContext)
  if (!ctx) throw new Error('useListings must be used within ListingsProvider')
  return ctx
}
