import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './screens/Home.jsx'
import Marketplace from './screens/Marketplace.jsx'
import Post from './screens/Post.jsx'
import Chats from './screens/Chats.jsx'
import Profile from './screens/Profile.jsx'
import ListingDetail from './screens/ListingDetail.jsx'
import ChatDetail from './screens/ChatDetail.jsx'
import Login from './screens/Login.jsx'
import Register from './screens/Register.jsx'
import SetPin from './screens/SetPin.jsx'
import { useAuth } from './store/AuthContext.jsx'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!user.pinSet) return <Navigate to="/set-pin" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return null

  // Not logged in -> auth screens only
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (!user.pinSet) {
    return (
      <Routes>
        <Route path="/set-pin" element={<SetPin />} />
        <Route path="*" element={<Navigate to="/set-pin" replace />} />
      </Routes>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/market" element={<Marketplace />} />
        <Route path="/post" element={<Post />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/listing/:id" element={<ListingDetail />} />
        <Route path="/chat/:id" element={<ChatDetail />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
