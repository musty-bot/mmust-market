import { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../context/AuthContext'
import { theme } from '../theme'

export default function SetPin() {
  const router = useRouter()
  const { setPendingPin } = useAuth()
  const [pin, setPinState] = useState('')

  const press = (n) => {
    if (pin.length < 4) setPinState(pin + n)
  }
  const back = () => {
    setPinState(pin.slice(0, -1))
  }

  const pad = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const submit = () => {
    if (pin.length !== 4) return
    setPendingPin(pin)
    router.replace('/confirm-pin')
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>Set a PIN</Text>
        <Text style={styles.logoSub}>Secure your account</Text>
      </View>

      <Text style={styles.title}>Create PIN</Text>
      <View style={styles.dots}>
        {[0, 1, 2, 3].map((i) => (
          <View key={i} style={[styles.dot, i < pin.length && styles.dotFilled]} />
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
          <Text style={styles.keyText}>Next</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btn, styles.btnPrimary, pin.length !== 4 && styles.btnDisabled]}
        disabled={pin.length !== 4}
        onPress={submit}
      >
        <Text style={styles.btnTextDark}>Continue</Text>
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
})
