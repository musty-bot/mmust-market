import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import { theme } from '../theme'

export default function ListingCard({ item }) {
  const router = useRouter()
  const priceLabel = item.type === 'house' ? `Ksh ${item.price}/mo` : `Ksh ${item.price}`

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/listing/${item.id}`)}
    >
      <Image source={{ uri: item.images?.[0] }} style={styles.img} resizeMode="cover" />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.row}>
          <Text style={styles.price}>{priceLabel}</Text>
          <View style={[styles.badge, styles.badgeAccent]}>
            <Text style={styles.badgeText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.muted}>{item.location}</Text>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.surface, borderRadius: theme.radius, overflow: 'hidden', borderWidth: 1, borderColor: theme.border },
  img: { width: '100%', aspectRatio: 4 / 3, backgroundColor: theme.surface2 },
  body: { padding: 12 },
  title: { fontWeight: '700', fontSize: 15, marginBottom: 4, color: theme.text },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  price: { color: theme.accent, fontWeight: '800', fontSize: 15 },
  badge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999, backgroundColor: theme.surface2 },
  badgeAccent: { backgroundColor: 'rgba(57,255,20,0.12)', borderWidth: 1, borderColor: 'rgba(57,255,20,0.3)' },
  badgeText: { fontSize: 10, fontWeight: '700', color: theme.accent },
  muted: { color: theme.textMuted, fontSize: 12, marginTop: 6 },
})
