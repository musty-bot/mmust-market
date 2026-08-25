import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import FloatingCard from '../components/FloatingCard'
import PremiumButton from '../components/PremiumButton'
import { theme, shadows } from '../theme'

export default function Login() {
  const router = useRouter()
  const { loginWithPin, session } = useAuth()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const fade = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start()
  }, [])

  const press = (n) => {
    if (pin.length < 4) setPin(pin + n)
  }
  const back = () => setPin(pin.slice(0, -1))

  const pad = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const submit = async () => {
    if (pin.length !== 4) return
    if (!session?.user) {
      setError('Create an account to start using MMUST Market.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await loginWithPin(pin)
      router.replace('/')
    } catch (e) {
      setError(e.message)
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow1} />
      <View style={styles.bgGlow2} />
      <Animated.View style={[styles.content, { opacity: fade }]}>
        <View style={styles.logoWrap}>
          <View style={[styles.logoBox, shadows.card]}>
            <Text style={styles.logoText}>MMUST</Text>
            <Text style={styles.logoAccent}>Market</Text>
          </View>
        </View>

        <Text style={styles.welcomeBack}>Welcome Back</Text>
        <Text style={styles.subtitle}>Enter your 4-digit PIN to continue.</Text>

        <FloatingCard style={{ width: '100%', marginTop: 28, alignItems: 'center' }}>
          <View style={styles.dots}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
            ))}
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <View style={styles.pad}>
            {pad.map((n) => (
              <TouchableOpacity key={n} style={styles.key} onPress={() => press(n)}>
                <Text style={styles.keyText}>{n}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.key} onPress={back}>
              <Text style={styles.keyText}>⌫</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.key} onPress={() => press(0)}>
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.key, styles.keyOk]} onPress={submit}>
              <Text style={styles.keyText}>Next</Text>
            </TouchableOpacity>
          </View>
        </FloatingCard>

        <PremiumButton
          title={loading ? 'Verifying...' : 'Login'}
          onPress={submit}
          disabled={pin.length !== 4 || loading}
          loading={loading}
          style={{ marginTop: 24 }}
        />

        <View style={{ alignItems: 'center', gap: 10, marginTop: 18 }}>
          <TouchableOpacity onPress={() => router.replace('/forgot-pin')}>
            <Text style={styles.link}>Forgot PIN?</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  bgGlow1: {
    position: 'absolute', top: -100, right: -60, width: 240, height: 240, borderRadius: 120,
    backgroundColor: theme.accent, opacity: 0.04,
  },
  bgGlow2: {
    position: 'absolute', bottom: -80, left: -60, width: 200, height: 200, borderRadius: 100,
    backgroundColor: theme.secondary, opacity: 0.04,
  },
  content: { flex: 1, padding: 24, paddingTop: 60, maxWidth: theme.maxW, alignSelf: 'center', width: '100%', alignItems: 'center' },
  logoWrap: { marginBottom: 24 },
  logoBox: {
    width: 100, height: 100, borderRadius: 28, backgroundColor: theme.surface,
    borderWidth: 1, borderColor: theme.border, alignItems: 'center', justifyContent: 'center',
  },
  logoText: { fontSize: 22, fontWeight: '900', color: theme.text, letterSpacing: 0.5 },
  logoAccent: { fontSize: 18, fontWeight: '800', color: theme.accent, marginTop: 2 },
  welcomeBack: { fontSize: 26, fontWeight: '800', color: theme.text, textAlign: 'center', marginTop: 8 },
  subtitle: { fontSize: 14, color: theme.textMuted, textAlign: 'center', marginTop: 8 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 16 },
  dot: { width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: theme.border },
  dotFilled: { backgroundColor: theme.accent, borderColor: theme.accent },
  pad: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  key: {
    width: '31%',
    aspectRatio: 1.6,
    backgroundColor: theme.surface2,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  keyOk: { backgroundColor: theme.accent },
  keyText: { fontSize: 22, fontWeight: '700', color: theme.text },
  error: { color: theme.danger, fontSize: 13, marginTop: 12, fontWeight: '600' },
  link: { color: theme.accent, fontSize: 14, fontWeight: '700' },
})
