import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import FloatingCard from '../components/FloatingCard'
import PremiumButton from '../components/PremiumButton'
import { theme, shadows } from '../theme'

export default function ForgotPin() {
  const router = useRouter()
  const fade = useRef(new Animated.Value(0)).current
  const translate = useRef(new Animated.Value(30)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.spring(translate, { toValue: 0, tension: 50, friction: 10, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.bgGlow} />
      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: translate }] }]}>
        <View style={[styles.illustration, shadows.cardSoft]}>
          
        </View>

        <Text style={styles.title}>Forgot your PIN?</Text>
        <Text style={styles.subtitle}>
          Don't worry! Contact the administrator to reset your account and regain access to MMUST Market.
        </Text>

        <FloatingCard style={{ width: '100%', marginTop: 28, alignItems: 'center' }}>
          <Text style={styles.adminLabel}>Admin Contact</Text>
          <Text style={styles.adminValue}>mustafazaffar88@gmail.com</Text>
          <Text style={styles.adminValue}>+254 114 266 542</Text>
        </FloatingCard>

        <View style={{ width: '100%', gap: 14, marginTop: 28 }}>
          <PremiumButton title="Contact Admin" onPress={() => {
            const url = 'https://wa.me/254114266542'
            Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open WhatsApp.'))
          }} />
          <PremiumButton title="Back to Login" variant="outline" onPress={() => router.back()} />
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  bgGlow: {
    position: 'absolute', top: -80, left: -40, width: 220, height: 220, borderRadius: 110,
    backgroundColor: theme.secondary, opacity: 0.05,
  },
  content: { flex: 1, padding: 24, paddingTop: 80, maxWidth: theme.maxW, alignSelf: 'center', width: '100%', alignItems: 'center' },
  illustration: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: theme.surface,
    borderWidth: 1, borderColor: theme.border, alignItems: 'center', justifyContent: 'center',
  },
  emoji: { fontSize: 52 },
  title: { fontSize: 26, fontWeight: '800', color: theme.text, textAlign: 'center', marginTop: 28 },
  subtitle: { fontSize: 14, color: theme.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  adminLabel: { fontSize: 12, fontWeight: '700', color: theme.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  adminValue: { fontSize: 15, fontWeight: '600', color: theme.secondary, marginTop: 4 },
})
