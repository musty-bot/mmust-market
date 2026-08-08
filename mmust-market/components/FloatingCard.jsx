import React from 'react'
import { View, StyleSheet } from 'react-native'
import { theme, shadows } from '../theme'

export default function FloatingCard({ children, style }) {
  return (
    <View style={[styles.card, shadows.cardSoft, style]}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.border,
  },
})
