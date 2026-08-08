import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'

export default function ConfirmPin() {
  const router = useRouter()
  const { pendingPin, setPin } = useAuth()
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')

  const press = (n) => {
    if (confirm.length < 4) setConfirm(confirm + n)
  }
  const back = () => {
    setConfirm(confirm.slice(0, -1))
  }

  const pad = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const submit = async () => {
    setError('')
    if (confirm.length !== 4) {
      setError('Enter 4 digits')
      return
    }
    if (confirm !== pendingPin) {
      setError('PINs do not match')
      setConfirm('')
      return
    }
    try {
      await setPin(pendingPin)
      router.replace('/')
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>Confirm PIN</Text>
        <Text style={styles.logoSub}>Re-enter your PIN to confirm it.</Text>
      </View>

      <Text style={styles.title}>Confirm PIN</Text>
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i < confirm.length && styles.dotFilled]} />
        ))}
      </View>

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
          <Text style={styles.keyText}>Finish</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary, confirm.length !== 4 && styles.btnDisabled]}
        disabled={confirm.length !== 4}
        onPress={submit}
      >
        <Text style={styles.btnTextDark}>Finish</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: theme.bg },
  logo: { alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 28, fontWeight: '900', color: theme.text },
  logoSub: { color: theme.textMuted, marginTop: 4 },
  title: { textAlign: 'center', fontSize: 18, fontWeight: '700', marginVertical: 10, color: theme.text },
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
  btn: { padding: 14, borderRadius: theme.radius, alignItems: 'center', marginTop: 18 },
  btnPrimary: { backgroundColor: theme.accent },
  btnDisabled: { opacity: 0.4 },
  btnTextDark: { fontWeight: '700', color: '#04150a', fontSize: 15 },
  error: { color: theme.danger, textAlign: 'center', marginTop: 12, fontWeight: '600' },
})
