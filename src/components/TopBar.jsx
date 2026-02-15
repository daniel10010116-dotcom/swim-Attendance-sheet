import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useAuth } from '../contexts/AuthContext'
import AdminPasswordModal from './AdminPasswordModal'

export default function TopBar({ title }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: '#FFFFFF', color: '#0F172A', boxShadow: '0 1px 0 #E2E8F0' }}>
        <Toolbar sx={{ minHeight: 56, px: 2 }}>
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
          <Button
            color="inherit"
            onClick={() => setPasswordModalOpen(true)}
            sx={{ color: '#64748B', mr: 1, '&:hover': { color: '#0D9488' } }}
          >
            更改帳號密碼
          </Button>
          {user?.name && (
            <Typography sx={{ fontSize: 14, color: '#475569', mr: 2 }}>
              {user.name}
            </Typography>
          )}
          <Button color="inherit" onClick={handleLogout} sx={{ color: '#64748B', '&:hover': { color: '#0D9488' } }}>
            登出
          </Button>
        </Toolbar>
      </AppBar>
      <AdminPasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </>
  )
}
