import { StyleSheet } from 'react-native'
import { theme } from '../theme'

export const screen = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg, padding: 16, paddingBottom: 90 },
  header: {
    height: 56, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 8,
  },
  brand: { fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  title: { fontSize: 22, fontWeight: '800', marginVertical: 8, color: theme.text },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, height: 44,
    backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border, borderRadius: 999,
  },
  searchInput: { flex: 1, color: theme.text, padding: 0 },
  section: { marginTop: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  muted: { color: theme.textMuted, fontSize: 13 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  gridItem: { width: '47.5%' },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginTop: 12 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 999,
    borderWidth: 1, borderColor: theme.border, backgroundColor: theme.surface,
    fontSize: 13, fontWeight: '600',
  },
  chipActive: { backgroundColor: theme.accent, borderColor: theme.accent },
  chipLabel: { color: theme.text, fontSize: 13, fontWeight: '600' },
  chipLabelActive: { color: '#04150a', fontSize: 13, fontWeight: '600' },
  btn: {
    paddingVertical: 12, paddingHorizontal: 16, borderRadius: theme.radius, alignItems: 'center',
    backgroundColor: theme.surface2, borderWidth: 1, borderColor: theme.border,
  },
  btnPrimary: { backgroundColor: theme.accent, borderColor: theme.accent },
  btnText: { fontWeight: '700', fontSize: 15, color: theme.text },
  btnTextDark: { fontWeight: '700', fontSize: 15, color: '#04150a' },
  empty: { alignItems: 'center', padding: 48, color: theme.textMuted },
  card: { backgroundColor: theme.surface, borderRadius: theme.radius, padding: 16, borderWidth: 1, borderColor: theme.border },
  field: { marginBottom: 14 },
  label: { fontSize: 12, fontWeight: '600', color: theme.textMuted, marginBottom: 6, textTransform: 'uppercase' },
  input: {
    width: '100%', padding: 12, backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.border,
    borderRadius: theme.radius, color: theme.text,
  },
  fab: {
    position: 'absolute', right: 16, bottom: 80, width: 56, height: 56, borderRadius: 28,
    backgroundColor: theme.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: theme.accent,
  },
})
