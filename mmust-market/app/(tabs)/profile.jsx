import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { screen as s } from '../../components/screenStyles'
import { theme } from '../../theme'

export default function Profile() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const items = [
    { label: 'My listings', sub: 'Items you posted' },
    { label: 'Saved', sub: 'Bookmarked items' },
    { label: 'Settings', sub: 'Account & privacy' },
    { label: 'Help & support', sub: 'FAQ, contact us' },
  ]

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={s.title}>Profile</Text>

      <View style={[s.card, { flexDirection: 'row', alignItems: 'center', gap: 14 }]}>
        <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: theme.accent }}>{user?.name?.[0]?.toUpperCase() || 'MM'}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 18, fontWeight: '700', color: theme.text }}>{user?.name || 'Student'}</Text>
          <Text style={s.muted}>{user?.phone}</Text>
          <View style={[s.chip, s.chipActive, { marginTop: 6, alignSelf: 'flex-start' }]}>
            <Text style={{ color: '#04150a', fontWeight: '700', fontSize: 11 }}>MMUST Student</Text>
          </View>
        </View>
      </View>

      <View style={[s.card, { marginTop: 16, padding: 0, overflow: 'hidden' }]}>
        {items.map((it, i) => (
          <TouchableOpacity
            key={it.label}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderBottomColor: theme.border }}
            onPress={it.action}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {it.icon ? <Text style={{ fontSize: 22 }}>{it.icon}</Text> : <View style={{ width: 22 }} />}
            <View>
              <Text style={{ fontWeight: '600', fontSize: 15, color: theme.text }}>{it.label}</Text>
              <Text style={{ color: theme.textMuted, fontSize: 12 }}>{it.sub}</Text>
            </View>
            </View>
            <Text style={{ color: theme.textMuted }}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[s.btn, { marginTop: 20, borderColor: theme.danger }]}
        onPress={() => { logout(); router.replace('/login') }}
      >
        <Text style={{ fontWeight: '700', color: theme.danger }}>Log out</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', color: theme.textMuted, fontSize: 12, marginTop: 16 }}>MMUST Market v1.0 · Campus marketplace</Text>
    </ScrollView>
  )
}
