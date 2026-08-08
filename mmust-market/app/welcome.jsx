import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useRouter } from 'expo-router'
import PremiumButton from '../components/PremiumButton'
import { theme, shadows } from '../theme'

export default function Welcome() {
  const router = useRouter()
  const fadeUp = useRef(new Animated.Value(40)).current
  const fade = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(fadeUp, { toValue: 0, tension: 60, friction: 10, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.gradientBg} />
      <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: fadeUp }] }]}>
        <View style={styles.illustration}>
          <ImageCircle source={{ uri: 'https://picsum.photos/seed/mmust-student/400/400' }} style={[styles.studentCircle, styles.studentCircle1]} />
          <ImageCircle source={{ uri: 'https://picsum.photos/seed/mmust-package/400/400' }} style={[styles.studentCircle, styles.studentCircle2]} />
          <ImageCircle source={{ uri: 'https://picsum.photos/seed/mmust-hostel/400/400' }} style={[styles.studentCircle, styles.studentCircle3]} />
        </View>

        <Text style={styles.title}>Welcome to MMUST Market</Text>
        <Text style={styles.subtitle}>
          Buy, Sell, Find Houses and Connect with the MMUST Community.
        </Text>

        <View style={{ width: '100%', gap: 14, marginTop: 32 }}>
          <PremiumButton title="Create Account" onPress={() => router.push('/register')} />
        </View>

        <TouchableOpacity onPress={() => router.push('/login')} style={{ marginTop: 18 }}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>

        <Text style={styles.exclusive}>Exclusive for MMUST Students</Text>
      </Animated.View>
    </View>
  )
}

function ImageCircle({ source, style }) {
  return (
    <Image source={source} style={[styles.studentCircle, style, { resizeMode: 'cover' }]} />
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center', padding: 24 },
  gradientBg: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: theme.bg,
    opacity: 0.95,
  },
  content: { alignItems: 'center', width: '100%', maxWidth: theme.maxW },
  illustration: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 40, gap: 12 },
  studentCircle: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
    alignItems: 'center', justifyContent: 'center',
    ...shadows.cardSoft,
  },
  studentCircle1: {},
  studentCircle2: { marginTop: 24 },
  studentCircle3: { marginTop: 12 },
  title: { fontSize: 28, fontWeight: '800', color: theme.text, textAlign: 'center', lineHeight: 36 },
  subtitle: { fontSize: 15, color: theme.textMuted, textAlign: 'center', marginTop: 12, lineHeight: 22, paddingHorizontal: 8 },
  link: { color: theme.accent, fontSize: 15, fontWeight: '700', textAlign: 'center' },
  exclusive: { marginTop: 28, color: theme.textMuted, fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },
})
