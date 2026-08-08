import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider, useAuth } from '../context/AuthContext'
import { ListingsProvider } from '../context/ListingsContext'
import { View, Text } from 'react-native'
import { theme } from '../theme'
import { useRouter } from 'expo-router'
import { supabase } from '../lib/supabaseClient'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, padding: 24, backgroundColor: theme.bg, justifyContent: 'center' }}>
          <Text style={{ color: theme.danger, fontSize: 16, fontWeight: '700' }}>Something went wrong</Text>
          <Text style={{ color: theme.textMuted, marginTop: 8 }}>{String(this.state.error?.message || this.state.error)}</Text>
        </View>
      )
    }
    return this.props.children
  }
}

function RootGate() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = useRouter().pathname

  useEffect(() => {
    if (loading) return
    if (!user) {
      const publicRoutes = ['/splash', '/welcome', '/login', '/register', '/set-pin', '/confirm-pin', '/forgot-pin']
      if (!publicRoutes.includes(pathname)) {
        router.replace('/splash')
      }
    } else if (!user.pinSet && pathname !== '/set-pin' && pathname !== '/confirm-pin') {
      router.replace('/set-pin')
    }
  }, [loading, user, pathname, router])

  return null
}

function MaintenanceGate() {
  const router = useRouter()
  const pathname = useRouter().pathname
  const [maintenance, setMaintenance] = React.useState(false)

  useEffect(() => {
    let cancelled = false
    supabase.from('app_settings').select('*').then(({ data }) => {
      if (cancelled) return
      const settings = data?.reduce((a, b) => ({ ...a, [b.key]: b.value }), {}) || {}
      setMaintenance(settings.maintenance_mode === 'true')
    })
    return () => { cancelled = true }
  }, [])

  if (maintenance && pathname !== '/forgot-pin') {
    return (
      <View style={{ flex: 1, backgroundColor: theme.bg, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
        <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', marginTop: 16 }}>Under Maintenance</Text>
        <Text style={{ color: theme.textMuted, marginTop: 8, textAlign: 'center' }}>We will be back shortly.</Text>
      </View>
    )
  }
  return null
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ListingsProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="splash" />
            <Stack.Screen name="welcome" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="set-pin" />
            <Stack.Screen name="confirm-pin" />
            <Stack.Screen name="forgot-pin" />
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="listing/[id]" />
          </Stack>
          <MaintenanceGate />
          <RootGate />
        </ListingsProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
