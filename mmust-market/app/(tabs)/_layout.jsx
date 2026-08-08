import { Tabs } from 'expo-router'
import { useAuth } from '../../context/AuthContext'
import { TabIcon, homeIconUri, marketIconUri, postIconUri, profileIconUri } from '../../components/TabIcons'
import { theme } from '../../theme'

export default function TabsLayout() {
  const { user, loading } = useAuth()

  if (loading) return null
  if (!user) {
    return null
  }
  if (!user.pinSet) {
    return null
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: '#090909',
          borderTopColor: theme.border,
          height: 64,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon source={homeIconUri} focused={focused} /> }}
      />
      <Tabs.Screen
        name="market"
        options={{ title: 'Market', tabBarIcon: ({ focused }) => <TabIcon source={marketIconUri} focused={focused} /> }}
      />
      <Tabs.Screen
        name="post"
        options={{ title: 'Post', tabBarIcon: ({ focused }) => <TabIcon source={postIconUri} focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon source={profileIconUri} focused={focused} /> }}
      />
    </Tabs>
  )
}
