import { useState, useEffect } from 'react'
import { View, Text, Image, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { getListing } from '../../data/mock'
import { useListings } from '../../context/ListingsContext'
import { useAuth } from '../../context/AuthContext'
import { screen as s } from '../../components/screenStyles'
import { theme } from '../../theme'

export default function ListingDetail() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { items } = useListings()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace('/login')
    else if (!user.pinSet) router.replace('/set-pin')
  }, [loading, user, router])

  const item = getListing(id) || items.find((x) => x.id === id)

  if (!item) {
    return (
      <View style={[s.container, { alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={{ fontSize: 40, color: theme.textMuted }}>Listing not found.</Text>
      </View>
    )
  }

  const priceLabel = item.type === 'house' ? `Ksh ${item.price}/mo` : `Ksh ${item.price}`

  const toInternational = (phone) => {
    const digits = String(phone).replace(/\D/g, '')
    if (digits.startsWith('0')) return '254' + digits.slice(1)
    if (digits.startsWith('254')) return digits
    return digits
  }

  const openWhatsApp = () => {
    const raw = String(item.phone || '').trim()
    if (!raw) {
      Alert.alert('No contact number', 'This listing does not have a WhatsApp number.')
      return
    }
    const number = toInternational(raw)
    const message = encodeURIComponent(`Hi, I'm interested in your listing: ${item.title} (Ksh ${item.price}). Is it still available?`)
    const url = `https://wa.me/${number}?text=${message}`
    Linking.openURL(url).catch(() => Alert.alert('Error', 'Could not open WhatsApp.'))
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 8 }}>
        <Text style={{ color: theme.accent, fontSize: 16 }}>← Back</Text>
      </TouchableOpacity>

      <Image source={{ uri: item.images?.[0] }} style={{ width: '100%', aspectRatio: 1, borderRadius: 14, backgroundColor: theme.surface2 }} resizeMode="cover" />

      {item.images?.length > 1 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 12 }}>
          {item.images.map((img, i) => (
            <Image key={i} source={{ uri: img }} style={{ width: 90, height: 90, borderRadius: 10, marginRight: 10, borderWidth: 1, borderColor: theme.border }} />
          ))}
        </ScrollView>
      )}

      <View style={s.section}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: theme.text }}>{item.title}</Text>
        <View style={s.row} >
          <Text style={{ fontSize: 22, fontWeight: '800', color: theme.accent }}>{priceLabel}</Text>
          <View style={[s.chip, s.chipActive]}>
            <Text style={{ color: '#04150a', fontWeight: '700' }}>{item.category}</Text>
          </View>
        </View>

        <View style={s.chipRow}>
          <View style={s.chip}><Text style={{ color: theme.text }}>{item.location}</Text></View>
          {item.condition && <View style={s.chip}><Text style={{ color: theme.text }}>{item.condition}</Text></View>}
          {item.type === 'house' && <View style={s.chip}><Text style={{ color: theme.text }}>{item.beds} bed</Text></View>}
        </View>

        <Text style={{ marginTop: 12, color: theme.text }}>{item.description}</Text>

        <View style={{ height: 1, backgroundColor: theme.border, marginVertical: 16 }} />

        <View style={s.row}>
          <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontWeight: '800', color: theme.accent }}>{item.seller?.[0] || 'S'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', color: theme.text }}>{item.seller}</Text>
            <Text style={s.muted}>{item.phone}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <TouchableOpacity style={[s.btn, { flex: 1 }]} onPress={() => Linking.openURL(`tel:${item.phone}`)}>
            <Text style={s.btnText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.btn, s.btnPrimary, { flex: 1 }]} onPress={openWhatsApp}>
            <Text style={s.btnTextDark}>WhatsApp</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}
