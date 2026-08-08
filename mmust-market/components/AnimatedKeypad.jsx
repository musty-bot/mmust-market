import React, { useRef } from 'react'
import { View, Text, TouchableOpacity, Animated } from 'react-native'
import { theme } from '../theme'

const KEYS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['del', '0', 'ok'],
]

export default function AnimatedKeypad({ onPress, onDelete, onOk, disabled }) {
  return (
    <View style={{ gap: 14 }}>
      {KEYS.map((row, ri) => (
        <View key={ri} style={{ flexDirection: 'row', gap: 14 }}>
          {row.map((k) => {
            const isDel = k === 'del'
            const isOk = k === 'ok'
            const press = () => {
              if (disabled) return
              if (isDel) onDelete?.()
              else if (isOk) onOk?.()
              else onPress?.(k)
            }
            return (
              <KeyBtn key={k} label={isDel ? '⌫' : isOk ? '→' : k} onPress={press} variant={isOk ? 'primary' : isDel ? 'ghost' : 'default'} />
            )
          })}
        </View>
      ))}
    </View>
  )
}

function KeyBtn({ label, onPress, variant }) {
  const scale = useRef(new Animated.Value(1)).current
  const pressIn = () => Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, tension: 300, friction: 10 }).start()
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start()

  const bg = variant === 'primary' ? theme.accent : variant === 'ghost' ? 'transparent' : theme.surface2
  const color = variant === 'primary' ? '#04150a' : theme.text
  const border = variant === 'ghost' ? undefined : { borderWidth: 1, borderColor: theme.border }

  return (
    <Animated.View style={{ flex: 1, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        activeOpacity={0.85}
        style={[
          {
            height: 62,
            borderRadius: 18,
            backgroundColor: bg,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: border?.borderWidth || 0,
            borderColor: border?.borderColor || 'transparent',
          },
        ]}
      >
        <Text style={{ color, fontSize: 24, fontWeight: '600' }}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  )
}
