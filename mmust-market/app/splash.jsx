import React, { useEffect, useRef } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { theme } from '../theme'

export default function Splash() {
  const router = useRouter()
  const fade = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(0.85)).current
  const glow = useRef(new Animated.Value(0)).current
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true

    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 60, friction: 10, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 1, duration: 2500, useNativeDriver: true }),
    ]).start(() => {
      if (!mounted.current) return
      Animated.sequence([
        Animated.delay(6000),
        Animated.timing(fade, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]).start(() => {
        if (!mounted.current) return
        router.replace('/welcome')
      })
    })

    return () => {
      mounted.current = false
    }
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoWrap,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        <View style={styles.logoBox}>
          <Animated.View style={[styles.glow, { opacity: glow }]} />
          <Text style={styles.logoText}>MMUST</Text>
          <Text style={styles.logoAccent}>Market</Text>
        </View>
        <Text style={styles.powered}>Powered by Musty Corporations</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
  },
  logoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
    height: 160,
    borderRadius: 40,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.border,
    ...{ shadowColor: theme.accent, shadowOpacity: 0.25, shadowRadius: 40, shadowOffset: { width: 0, height: 0 }, elevation: 16 },
  },
  glow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.accent,
    opacity: 0.3,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '900',
    color: theme.text,
    letterSpacing: 1,
    marginTop: -8,
  },
  logoAccent: {
    fontSize: 28,
    fontWeight: '800',
    color: theme.accent,
    letterSpacing: 0.5,
    marginTop: 2,
  },
  powered: {
    marginTop: 32,
    color: theme.textMuted,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
})
