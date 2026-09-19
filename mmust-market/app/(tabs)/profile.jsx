import { View, Text, TouchableOpacity, ScrollView, Alert, useState } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { useNetwork } from '../../context/NetworkContext'
import { screen as s } from '../../components/screenStyles'
import { theme } from '../../theme'
import { downloadApp, openDownloadedFile, openGitHubRelease } from '../../lib/download'

export default function Profile() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const isOnline = useNetwork()
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleDownload = async () => {
    if (!isOnline) {
      Alert.alert('No Connection', 'Please connect to the internet to download the app.')
      return
    }
    setDownloading(true)
    setProgress(0)
    const result = await downloadApp((p) => setProgress(p), isOnline)
    setDownloading(false)
    if (result.success) {
      Alert.alert('Download Complete', result.fileName + ' downloaded successfully.', [
        { text: 'Install', onPress: () => openDownloadedFile(result.uri) },
        { text: 'Later', style: 'cancel' },
      ])
    } else {
      Alert.alert('Download Failed', result.error || 'Could not download the app.')
    }
  }

  const items = [
    { label: 'My listings', sub: 'Items you posted', action: () => router.push('/my-listings') },
    { label: 'Saved', sub: 'Bookmarked items', action: () => {} },
    { label: 'Settings', sub: 'Account & privacy', action: () => {} },
    { label: 'Help & support', sub: 'FAQ, contact us', action: () => {} },
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

      <View style={[s.card, { marginTop: 16 }]}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 8 }}>Download App</Text>
        <Text style={{ color: theme.textMuted, fontSize: 13, marginBottom: 12 }}>Get the latest version of MMUST Market.</Text>
        {downloading ? (
          <View>
            <View style={{ height: 8, backgroundColor: theme.surface2, borderRadius: 4, overflow: 'hidden', marginBottom: 8 }}>
              <View style={{ height: '100%', width: progress + '%', backgroundColor: theme.accent, borderRadius: 4 }} />
            </View>
            <Text style={{ color: theme.textMuted, fontSize: 12, textAlign: 'center' }}>Downloading... {Math.round(progress)}%</Text>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity style={[s.btn, { flex: 1 }]} onPress={handleDownload}>
              <Text style={{ fontWeight: '700', color: '#04150a' }}>Download APK</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[s.btn, { flex: 1, borderColor: theme.border }]} onPress={openGitHubRelease}>
              <Text style={{ fontWeight: '700', color: theme.text }}>Releases</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <TouchableOpacity style={[s.btn, { marginTop: 20, borderColor: theme.danger }]} onPress={() => { logout(); router.replace('/login') }}>
        <Text style={{ fontWeight: '700', color: theme.danger }}>Log out</Text>
      </TouchableOpacity>

      <Text style={{ textAlign: 'center', color: theme.textMuted, fontSize: 12, marginTop: 16 }}>MMUST Market v1.0 · Campus marketplace</Text>
    </ScrollView>
  )
}
