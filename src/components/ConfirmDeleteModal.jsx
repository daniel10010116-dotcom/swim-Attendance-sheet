import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

export default function ConfirmDeleteModal({ open, title, description, onClose, onConfirm }) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
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
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: '#0F172A', mb: 1 }}>
          {title}
        </Typography>
        <Typography sx={{ fontSize: 14, color: '#64748B', mb: 3 }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onClose} sx={{ minWidth: 80, height: 40 }}>取消</Button>
          <Button variant="contained" color="error" onClick={handleConfirm} sx={{ minWidth: 100, height: 40 }}>確認刪除</Button>
        </Box>
      </Box>
    </Modal>
  )
}
