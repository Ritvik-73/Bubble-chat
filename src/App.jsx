import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'

const App = () => {
  const { user } = useAuth()

  return (
    <Routes>
      <Route
        path ="/"
        element={user ? <Navigate to="/chat" /> : <Navigate to="/auth" />}
        />
      <Route
        path="/auth"
        element={user ? <Navigate to="/chat" /> : <AuthPage />}
        />
      <Route
        path="/chat"
        element={user ? <ChatPage /> : <Navigate to="/auth" />}
        />
    </Routes>
  )
}

export default App