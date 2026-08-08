import React, { useRef } from 'react'
import { TouchableOpacity, Text, Animated, View } from 'react-native'
import { theme, shadows } from '../theme'

export default function PremiumButton({ title, onPress, variant = 'primary', disabled, loading, style }) {
  const scale = useRef(new Animated.Value(1)).current

  const pressIn = () => {
    Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, tension: 300, friction: 10 }).start()
  }
  const pressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start()
  }

  const isPrimary = variant === 'primary'
  const isSecondary = variant === 'secondary'
  const isOutline = variant === 'outline'

  const bg = isPrimary ? theme.accent : isSecondary ? theme.secondary : 'transparent'
  const textColor = isPrimary || isSecondary ? '#04150a' : theme.accent
  const borderColor = isOutline ? theme.accent : 'transparent'
  const shadow = isPrimary ? shadows.glow : isSecondary ? { shadowColor: theme.secondary, shadowOpacity: 0.3, shadowRadius: 16, shadowOffset: { width: 0, height: 0 }, elevation: 6 } : {}

  return (
    <Animated.View style={{ transform: [{ scale }], ...(style || {}) }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        disabled={disabled || loading}
        activeOpacity={0.9}
        style={[
          {
            backgroundColor: bg,
            borderWidth: isOutline ? 1.5 : 0,
            borderColor: borderColor,
            borderRadius: theme.radius,
            paddingVertical: 18,
            paddingHorizontal: 28,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: disabled || loading ? 0.5 : 1,
            ...shadow,
          },
        ]}
      >
        {loading ? (
          <Text style={{ color: textColor, fontSize: 16, fontWeight: '700' }}>Loading...</Text>
        ) : (
          <Text style={{ color: textColor, fontSize: 16, fontWeight: '700', letterSpacing: 0.3 }}>{title}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  )
}
