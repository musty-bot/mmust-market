import { useState, useMemo } from 'react'
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { useListings } from '../../context/ListingsContext'
import ListingCard from '../../components/ListingCard'
import { screen as s } from '../../components/screenStyles'
import { theme } from '../../theme'
import { supabase } from '../../lib/supabaseClient'

export default function Market() {
  const { items, loading } = useListings()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('All')

  const filtered = items.filter((x) => {
    const matchesCat = cat === 'All' || x.category === cat
    const q = query.toLowerCase()
    const matchesQuery = !q || (x.title || '').toLowerCase().includes(q) || (x.location || '').toLowerCase().includes(q) || (x.category || '').toLowerCase().includes(q)
    return matchesCat && matchesQuery
  })

  if (loading) {
    return (
      <ScrollView style={s.container}>
        <Text style={s.title}>Marketplace</Text>
        <Text style={{ color: theme.textMuted, marginTop: 12 }}>Loading listings...</Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={s.title}>Marketplace</Text>

      <View style={s.search}>
        <Text style={{ color: theme.textMuted }}>Search</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search..."
          placeholderTextColor={theme.textMuted}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
        <View style={[s.chipRow, { flexWrap: 'nowrap' }]}>
          {['All', 'Electronics', 'Books', 'Fashion', 'Single Room', 'Bedsitter', 'Other'].map((c) => (
            <TouchableOpacity key={c} style={[s.chip, cat === c && s.chipActive]} onPress={() => setCat(c)}>
              <Text style={cat === c ? s.chipLabelActive : s.chipLabel}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={s.empty}>
          <Text style={{ fontSize: 40, color: theme.textMuted, fontWeight: '300' }}>No listings found.</Text>
        </View>
      ) : (
        <View style={s.grid}>
          {filtered.map((item) => (
            <View key={item.id} style={s.gridItem}>
              <ListingCard item={item} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
