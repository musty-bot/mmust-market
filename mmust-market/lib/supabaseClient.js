import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

export const SUPABASE_URL = 'https://pvrrnshblbbvtcnsartw.supabase.co'
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2cnJuc2hibGJidnRjbnNhcnR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NzEzNjgsImV4cCI6MjEwMDM0NzM2OH0.NxRqLFPcxHehkpZwQpOe8Wvbst9e3Mclm-W5hBh6-Gs'

const memory = {}
const AUTH_KEY = 'sb-pvrrnshblbbvtcnsartw-auth-token'

async function loadFromSecureStore() {
  try {
    const val = await SecureStore.getItemAsync(AUTH_KEY)
    if (val) memory[AUTH_KEY] = val
  } catch {}
}

async function saveToSecureStore(value) {
  try {
    if (value) await SecureStore.setItemAsync(AUTH_KEY, value)
  } catch {}
}

async function removeFromSecureStore() {
  try {
    await SecureStore.deleteItemAsync(AUTH_KEY)
  } catch {}
}

const isWeb = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

const storage = isWeb
  ? {
      getItem: (key) => {
        try {
          return localStorage.getItem(key)
        } catch {
          return null
        }
      },
      setItem: (key, value) => {
        try {
          localStorage.setItem(key, value)
        } catch {
          // ignore
        }
      },
      removeItem: (key) => {
        try {
          localStorage.removeItem(key)
        } catch {
          // ignore
        }
      },
    }
  : {
      getItem: (key) => memory[key] || null,
      setItem: (key, value) => {
        memory[key] = value
        saveToSecureStore(value)
      },
      removeItem: (key) => {
        delete memory[key]
        removeFromSecureStore()
      },
    }

export async function preloadAuthStorage() {
  await loadFromSecureStore()
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
  },
})
