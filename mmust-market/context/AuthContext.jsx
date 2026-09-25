import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { supabase, preloadAuthStorage } from '../lib/supabaseClient'
import { AppState } from 'react-native'

const AuthContext = createContext(null)
const INACTIVITY_TIMEOUT = 5 * 60 * 1000

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timedOut, setTimedOut] = useState(false)
  const [pendingPin, setPendingPin] = useState(null)
  const timerRef = useRef(null)
  const appState = useRef(AppState.currentState)

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const resetTimer = useCallback(() => {
    clearTimer()
    if (!user) return
    setTimedOut(false)
    timerRef.current = setTimeout(() => {
      setUser(null)
      setTimedOut(true)
    }, INACTIVITY_TIMEOUT)
  }, [user])

  useEffect(() => {
    let cancelled = false
    preloadAuthStorage().then(() => {
      if (cancelled) return
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session)
        if (data.session?.user) loadProfile(data.session.user.id)
        else setLoading(false)
      })
    })
    const { data: sub } = supabase.auth.onAuthStateChange(async (e, s) => {
      setSession(s)
      if (s?.user) await loadProfile(s.user.id)
      else { setUser(null); setLoading(false) }
    })
    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const isNetworkError = (err) => {
    if (!err) return false
    const msg = String(err.message || err.code || err.details || err || '').toLowerCase()
    return msg.includes('network') || 
           msg.includes('fetch') || 
           msg.includes('timeout') || 
           msg.includes('load failed') || 
           msg.includes('offline') ||
           msg.includes('failed to fetch') ||
           msg.includes('network request failed') ||
           msg.includes('networkerror') ||
           msg.includes('connection refused') ||
           msg.includes('econnrefused') ||
           msg.includes('socket hang up') ||
           msg.includes('timeout') ||
           msg.includes('eai_again') ||
           msg.includes('enotfound') ||
           msg.includes('etimedout')
  }

  const loadProfile = async (userId) => {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (error) {
        if (isNetworkError(error)) {
          setUser(null)
          setLoading(false)
          return
        }
        setUser(null)
        setLoading(false)
        return
      }
      const u = {
        id: userId,
        name: data?.name || 'Student',
        phone: data?.phone || '',
        pinSet: !!data?.pin_set,
        pin: data?.pin || '',
      }
      setUser(u)
      setLoading(false)
    } catch (err) {
      if (isNetworkError(err)) {
        setUser(null)
        setLoading(false)
        return
      }
      setUser(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    resetTimer()
    return clearTimer
  }, [user, resetTimer, clearTimer])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        clearTimer()
      } else if (nextState === 'active') {
        if (user) resetTimer()
      }
      appState.current = nextState
    })
    return () => subscription.remove?.()
  }, [user, resetTimer, clearTimer])

  const register = async (name, phone, password) => {
    const email = `${phone}@mmustmarket.local`
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, phone } },
    })
    if (error) throw error

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      if (data.user && !data.session) {
        throw new Error('Account created. Please check your email to confirm before logging in.')
      }
      throw signInError
    }
    await loadProfile(signInData.user.id)
    return user
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await loadProfile(data.user.id)
    return user
  }

  const loginWithPin = async (pin) => {
    if (!session?.user) throw new Error('Create MMUST Market account')
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
      if (error) {
        if (isNetworkError(error)) throw new Error('No connection, check internet')
        throw error
      }
      if (!data) throw new Error('Create MMUST Market account')
      if (data.pin !== pin) throw new Error('Invalid PIN')
      const u = { ...user, pinSet: true, pin: data.pin }
      setUser(u)
      setTimedOut(false)
      return u
    } catch (err) {
      if (isNetworkError(err)) throw new Error('No connection, check internet')
      throw err
    }
  }

  const setPin = async (pin) => {
    if (!session?.user) throw new Error('No session')
    try {
      const { error } = await supabase.from('profiles').update({ pin_set: true, pin }).eq('id', session.user.id)
      if (error) {
        if (isNetworkError(error)) throw new Error('No connection, check internet')
        throw error
      }
      const u = { ...user, pinSet: true, pin }
      setUser(u)
      return u
    } catch (err) {
      if (isNetworkError(err)) throw new Error('No connection, check internet')
      throw err
    }
  }

  const logout = async () => {
    clearTimer()
    setUser(null)
    setTimedOut(false)
    setPendingPin(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, setPin, logout, loginWithPin, markActivity: resetTimer, timedOut, session, pendingPin, setPendingPin }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
