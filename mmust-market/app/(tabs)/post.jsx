import { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { useListings } from '../../context/ListingsContext'
import { useAuth } from '../../context/AuthContext'
import { screen as s } from '../../components/screenStyles'
import { theme } from '../../theme'

export default function Post() {
  const router = useRouter()
  const { addListing } = useListings()
  const { user } = useAuth()
  const [type, setType] = useState('product')
  const [roomType, setRoomType] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    price: '',
    category: 'Electronics',
    location: '',
    phone: user?.phone || '',
    description: '',
  })

  const set = (k) => (v) => setForm({ ...form, [k]: v })

  const pickImage = async () => {
    if (images.length >= 3) return
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: false,
        quality: 0.85,
        selectionLimit: 1,
      })
      if (!result.canceled && result.assets?.[0]?.uri) {
        setImages([...images, result.assets[0].uri])
      }
    } catch (e) {
      Alert.alert('Error', 'Could not open gallery.')
    }
  }

  const removeImage = (idx) => {
    setImages(images.filter((_, i) => i !== idx))
  }

  const submit = async () => {
    if (!form.title.trim() || !form.price || submitting) return
    try {
      setSubmitting(true)
      await addListing({
        ...form,
        type,
        price: Number(form.price),
        seller: user?.name || 'You',
        phone: form.phone || user?.phone || '0700000000',
      }, images)
      router.replace('/market')
    } catch (e) {
      console.error('Submit error', e)
      Alert.alert('Error', e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const canAddMore = images.length < 3

  return (
    <ScrollView style={s.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <Text style={s.title}>Post a listing</Text>

      <View style={[s.card, { marginBottom: 16 }]}>
        <Text style={[s.label, { marginBottom: 8, color: theme.text }]}>Sell or rent?</Text>
        <View style={s.chipRow}>
          <TouchableOpacity style={[s.chip, type === 'product' && s.chipActive]} onPress={() => setType('product')}>
            <Text style={type === 'product' ? s.chipLabelActive : s.chipLabel}>Sell - Item / Ad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.chip, type === 'house' && s.chipActive]} onPress={() => setType('house')}>
            <Text style={type === 'house' ? s.chipLabelActive : s.chipLabel}>Rent - House</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={s.field}>
        <Text style={s.label}>Title</Text>
        <TextInput style={s.input} placeholder='' placeholderTextColor={theme.textMuted} value={form.title} onChangeText={set('title')} />
      </View>

      <View style={s.row}>
        <View style={[s.field, { flex: 1 }]}>
          <Text style={s.label}>{type === 'house' ? 'Rent (Ksh/mo)' : 'Price (Ksh)'}</Text>
          <TextInput style={s.input} keyboardType="numeric" placeholderTextColor={theme.textMuted} value={form.price} onChangeText={set('price')} />
        </View>
        <View style={[s.field, { flex: 1 }]}>
          <Text style={s.label}>{type === 'house' ? 'Room Type' : 'Category'}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[s.chipRow, { flexWrap: 'nowrap' }]}>
              {type === 'house' ? (
                ['Single Room', 'Bedsitter'].map((c) => (
                  <TouchableOpacity key={c} style={[s.chip, roomType === c && s.chipActive]} onPress={() => { setRoomType(c); setForm({ ...form, category: c }) }}>
                    <Text style={roomType === c ? s.chipLabelActive : s.chipLabel}>{c}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                ['Electronics', 'Books', 'Fashion', 'Other'].map((c) => (
                  <TouchableOpacity key={c} style={[s.chip, form.category === c && s.chipActive]} onPress={() => setForm({ ...form, category: c })}>
                    <Text style={form.category === c ? s.chipLabelActive : s.chipLabel}>{c}</Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      <View style={s.field}>
        <Text style={s.label}>Location</Text>
        <TextInput style={s.input} placeholder='' placeholderTextColor={theme.textMuted} value={form.location} onChangeText={set('location')} />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Contact phone</Text>
        <TextInput style={s.input} keyboardType="phone-pad" value={form.phone} onChangeText={set('phone')} />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Description</Text>
        <TextInput style={[s.input, { height: 96, textAlignVertical: 'top' }]} multiline value={form.description} onChangeText={set('description')} />
      </View>

      <View style={s.field}>
        <Text style={s.label}>Photos ({images.length}/3)</Text>
        <View style={styles.imageGrid}>
          {images.map((uri, idx) => (
            <View key={idx} style={styles.imageWrap}>
              <Image source={{ uri }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity style={styles.removeBtn} onPress={() => removeImage(idx)}>
                <Text style={styles.removeBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
          {images.length < 3 && (
            <TouchableOpacity style={styles.placeholder} onPress={pickImage}>
              <Text style={styles.placeholderText}>+</Text>
              <Text style={styles.placeholderSub}>Add photo</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity style={[s.btn, s.btnPrimary]} onPress={submit} disabled={submitting}>
        <Text style={s.btnTextDark}>{submitting ? 'Publishing...' : 'Publish listing for approval'}</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = {
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  imageWrap: { width: '31%', aspectRatio: 1, borderRadius: 12, overflow: 'hidden', position: 'relative' },
  imagePreview: { width: '100%', height: '100%', borderRadius: 12, borderWidth: 1, borderColor: theme.border },
  removeBtn: {
    position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center',
  },
  removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  placeholder: {
    width: '31%', aspectRatio: 1, borderRadius: 12, borderWidth: 1.5, borderColor: theme.border,
    backgroundColor: theme.surface2, alignItems: 'center', justifyContent: 'center',
  },
  placeholderText: { color: theme.textMuted, fontSize: 28, fontWeight: '300', marginBottom: 2 },
  placeholderSub: { color: theme.textMuted, fontSize: 11, fontWeight: '600' },
}
