import { useEffect } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import StudentHomePage from './pages/StudentHomePage'
import CoachHomePage from './pages/CoachHomePage'
import AdminHomePage from './pages/AdminHomePage'
import CoachPayPage from './pages/CoachPayPage'
import CoachSettingsPage from './pages/CoachSettingsPage'
import { useAuth } from './contexts/AuthContext'
import { mockStore } from './store/mockStore'

function PrivateRoute({ children, allowedRoles }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return
    if (user.role === 'student' && !mockStore.getStudent(user.id)) {
      logout()
      navigate('/', { replace: true })
    }
    if (user.role === 'coach' && !mockStore.getCoach(user.id)) {
      logout()
      navigate('/', { replace: true })
    }
  }, [user, logout, navigate])

  if (!user) return <Navigate to="/" replace />
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/student" element={<PrivateRoute allowedRoles={['student']}><StudentHomePage /></PrivateRoute>} />
      <Route path="/coach" element={<PrivateRoute allowedRoles={['coach']}><CoachHomePage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute allowedRoles={['admin']}><AdminHomePage /></PrivateRoute>} />
      <Route path="/admin/coach/:coachId/pay" element={<PrivateRoute allowedRoles={['admin']}><CoachPayPage /></PrivateRoute>} />
      <Route path="/admin/coach/:coachId/settings" element={<PrivateRoute allowedRoles={['admin']}><CoachSettingsPage /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
