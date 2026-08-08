import React from 'react'
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import ListingCard from '../../components/ListingCard'
import { screen as s } from '../../components/screenStyles'
import { theme } from '../../theme'
import { useListings } from '../../context/ListingsContext'

export default function Home() {
  const router = useRouter()
  const { items, loading } = useListings()
  const recent = items.slice(0, 4)

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <TouchableOpacity style={s.search} onPress={() => router.push('/market')} activeOpacity={0.8}>
        <Text style={{ color: theme.textMuted }}>Search</Text>
        <Text style={[s.searchInput, { color: theme.textMuted }]}>Search items, houses, books...</Text>
      </TouchableOpacity>

      <View style={s.section}>
        <View style={s.row}>
          <Text style={s.title}>Categories</Text>
        </View>
        <View style={s.chipRow}>
          <TouchableOpacity style={s.chip} onPress={() => router.push('/market')}><Text style={s.chipLabel}>Books</Text></TouchableOpacity>
          <TouchableOpacity style={s.chip} onPress={() => router.push('/market')}><Text style={s.chipLabel}>Electronics</Text></TouchableOpacity>
          <TouchableOpacity style={s.chip} onPress={() => router.push('/market')}><Text style={s.chipLabel}>Houses</Text></TouchableOpacity>
          <TouchableOpacity style={s.chip} onPress={() => router.push('/market')}><Text style={s.chipLabel}>Food</Text></TouchableOpacity>
        </View>
      </View>

      <View style={s.section}>
        <View style={s.row}>
          <Text style={s.title}>Latest</Text>
          <TouchableOpacity onPress={() => router.push('/market')}>
            <Text style={{ color: theme.accent, fontSize: 13 }}>See all →</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={{ color: theme.textMuted, marginTop: 12 }}>Loading...</Text>
        ) : recent.length === 0 ? (
          <Text style={{ color: theme.textMuted, marginTop: 12 }}>No listings yet.</Text>
        ) : (
          <View style={s.grid}>
            {recent.map((item) => (
              <View key={item.id} style={s.gridItem}>
                <ListingCard item={item} />
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={[s.card, { marginTop: 20, alignItems: 'center' }]}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>Sell or rent?</Text>
        <Text style={[s.muted, { marginVertical: 8, textAlign: 'center' }]}>
          Post in seconds to thousands of MMUST students.
        </Text>
        <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={() => router.push('/post')}>
          <Text style={s.btnTextDark}>Post a listing</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
