import { useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

export default function ResetPasswordModal({ open, name, onClose, onConfirm, targetId }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    setError('')
    if (!newPassword.trim()) {
      setError('請輸入新密碼')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('兩次密碼不一致')
      return
    }
    onConfirm(targetId, newPassword)
    setNewPassword('')
    setConfirmPassword('')
    onClose()
  }

  const handleClose = () => {
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    onClose()
  }

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%',
          maxWidth: 400,
          bgcolor: '#FFFFFF',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0F172A', mb: 2 }}>
          重設{name ?? ''}的密碼
        </Typography>
        <TextField fullWidth id="reset-new-password" label="新密碼" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} inputProps={{ id: 'reset-new-password' }} InputLabelProps={{ htmlFor: 'reset-new-password' }} sx={{ mb: 1.5 }} />
        <TextField fullWidth id="reset-confirm-password" label="確認密碼" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} inputProps={{ id: 'reset-confirm-password' }} InputLabelProps={{ htmlFor: 'reset-confirm-password' }} sx={{ mb: 1.5 }} />
        {error && <Typography color="error" sx={{ fontSize: 14, mb: 1 }}>{error}</Typography>}
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
          <Button onClick={handleClose} sx={{ color: '#64748B' }}>關閉</Button>
          <Button variant="contained" onClick={handleSubmit}>送出</Button>
        </Box>
      </Box>
    </Modal>
  )
}
