import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { useListings } from '../context/ListingsContext'
import { useAuth } from '../context/AuthContext'
import { useNetwork } from '../context/NetworkContext'
import { theme } from '../theme'
import { screen as s } from '../components/screenStyles'

export default function MyListings() {
  const router = useRouter()
  const { user } = useAuth()
  const isOnline = useNetwork()
  const { loadMyListings, deleteListing } = useListings()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  const refresh = async () => {
    setLoading(true)
    const data = await loadMyListings()
    setListings(data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
  }, [])

  const handleDelete = (item) => {
    Alert.alert('Delete listing', `Are you sure you want to delete "${item.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
           try {
             setDeletingId(item.id)
             await deleteListing(item.id, isOnline)
             setListings((prev) => prev.filter((l) => l.id !== item.id))
          } catch (e) {
            Alert.alert('Error', e.message || 'Failed to delete listing')
          } finally {
            setDeletingId(null)
          }
        },
      },
    ])
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.price}>KES {Number(item.price).toLocaleString()}</Text>
        <Text style={styles.meta}>{item.type} · {item.location}</Text>
        <View style={[styles.statusBadge, item.status === 'approved' ? styles.statusApproved : styles.statusPending]}>
          <Text style={[styles.statusText, item.status === 'approved' ? styles.statusTextApproved : styles.statusTextPending]}>
            {item.status}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => handleDelete(item)}
        disabled={deletingId === item.id}
      >
        <Text style={styles.deleteBtnText}>{deletingId === item.id ? '...' : 'Delete'}</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingHorizontal: 4 }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 16, color: theme.accent }}>Back</Text>
        </TouchableOpacity>
        <Text style={[s.brand, { fontSize: 18 }]}>My Listings</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme.accent} />
        </View>
      ) : listings.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>You haven't posted any listings yet.</Text>
          <TouchableOpacity style={styles.postBtn} onPress={() => router.replace('/(tabs)/post')}>
            <Text style={styles.postBtnText}>Post a listing</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 12 }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: theme.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: { fontSize: 15, fontWeight: '700', color: theme.text },
  price: { fontSize: 14, fontWeight: '800', color: theme.accent, marginTop: 4 },
  meta: { fontSize: 12, color: theme.textMuted, marginTop: 4 },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 8,
  },
  statusApproved: { backgroundColor: theme.accent },
  statusPending: { backgroundColor: theme.surface2 },
  statusText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  statusTextApproved: { color: '#04150a' },
  statusTextPending: { color: theme.textMuted },
  deleteBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: theme.radius,
    backgroundColor: theme.danger,
    borderWidth: 1,
    borderColor: theme.danger,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  deleteBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 48, gap: 16 },
  emptyText: { color: theme.textMuted, fontSize: 14, textAlign: 'center' },
  postBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: theme.radius,
    backgroundColor: theme.accent,
    borderWidth: 1,
    borderColor: theme.accent,
    alignItems: 'center',
  },
  postBtnText: { color: '#04150a', fontSize: 15, fontWeight: '700' },
})
