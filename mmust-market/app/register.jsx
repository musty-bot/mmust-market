import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import FloatingCard from '../components/FloatingCard'
import PremiumButton from '../components/PremiumButton'
import { theme } from '../theme'

export default function Register() {
  const router = useRouter()
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const fade = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start()
  }, [])

  const handleRegister = async () => {
    if (!name.trim() || !phone.trim() || !password) return
    setSubmitting(true)
    setError('')
    try {
      await register(name.trim(), phone.trim(), password)
      router.replace('/')
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow} />
      <Animated.View style={[styles.content, { opacity: fade }]}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Join MMUST students buying and selling.</Text>

        <FloatingCard style={{ width: '100%', marginTop: 28 }}>
          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor={theme.textMuted} value={name} onChangeText={setName} />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="07XXXXXXXX" placeholderTextColor={theme.textMuted} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput style={styles.input} placeholder="" placeholderTextColor={theme.textMuted} value={password} onChangeText={setPassword} secureTextEntry />
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PremiumButton
            title={submitting ? 'Creating...' : 'Create Account'}
            onPress={handleRegister}
            disabled={!name.trim() || !phone.trim() || !password || submitting}
            loading={submitting}
            style={{ marginTop: 18 }}
          />
        </FloatingCard>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  bgGlow: {
    position: 'absolute', top: -120, left: -80, width: 300, height: 300, borderRadius: 150,
    backgroundColor: theme.accent, opacity: 0.06,
  },
  content: { flex: 1, padding: 24, paddingTop: 60, maxWidth: theme.maxW, alignSelf: 'center', width: '100%' },
  title: { fontSize: 26, fontWeight: '800', color: theme.text, lineHeight: 34 },
  subtitle: { fontSize: 14, color: theme.textMuted, marginTop: 8, lineHeight: 20 },
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: theme.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    width: '100%', padding: 16, backgroundColor: theme.surface2, borderRadius: theme.radiusSm,
    borderWidth: 1, borderColor: theme.border, color: theme.text, fontSize: 16,
  },
  error: { color: theme.danger, fontSize: 13, marginTop: 10, fontWeight: '600' },
  link: { color: theme.accent, fontSize: 14, fontWeight: '700' },
  muted: { color: theme.textMuted, fontSize: 14 },
})
