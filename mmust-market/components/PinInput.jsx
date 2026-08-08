import React, { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { theme } from '../theme'

export default function PinInput({ value, length = 4 }) {
  const animatedValues = useRef(
    Array.from({ length }, () => new Animated.Value(0))
  ).current

  useEffect(() => {
    animatedValues.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i < value.length ? 1 : 0,
        useNativeDriver: true,
        tension: 180,
        friction: 12,
      }).start()
    })
  }, [value])

  return (
    <View style={styles.row}>
      {animatedValues.map((anim, i) => (
        <Animated.View
          key={i}
          style={[
            styles.circle,
            {
              borderColor: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [theme.border, theme.accent],
              }),
              backgroundColor: anim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: ['transparent', 'transparent', theme.accent],
              }),
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.dot,
              {
                opacity: anim,
                transform: [
                  {
                    scale: anim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          />
        </Animated.View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 16, justifyContent: 'center' },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#04150a',
  },
})
