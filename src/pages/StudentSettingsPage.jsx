import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { dataStore } from '../store/dataStore'

export default function StudentSettingsPage() {
  const { studentId } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [account, setAccount] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!studentId) return
    dataStore.getStudent(studentId).then((s) => {
      setStudent(s)
      setAccount(s?.account ?? '')
    })
  }, [studentId])

  if (student === null) return null
  if (!student) return <Navigate to="/admin" replace />

  const handleSave = async () => {
    try {
      await dataStore.updateStudentAccount(studentId, account.trim(), password.trim() || null)
      setPassword('')
      const updated = await dataStore.getStudent(studentId)
      if (updated) setAccount(updated.account ?? '')
    } catch (_) {}
  }

  return (
    <>
      <Box sx={{ bgcolor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', height: 56, display: 'flex', alignItems: 'center', px: 2 }}>
        <Button sx={{ color: '#0891B2', fontSize: 14, mr: 2 }} onClick={() => navigate('/admin')}>返回</Button>
        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>{student.name} － 帳號設定</Typography>
      </Box>
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 3, bgcolor: '#F8FAFC' }}>
        <Card sx={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <CardContent>
            <Typography sx={{ fontWeight: 600, fontSize: 16, mb: 2 }}>修改帳號／密碼</Typography>
            <TextField fullWidth id="student-settings-account" label="帳號" value={account} onChange={(e) => setAccount(e.target.value)} inputProps={{ id: 'student-settings-account' }} InputLabelProps={{ htmlFor: 'student-settings-account' }} sx={{ mb: 1.5 }} />
            <TextField fullWidth id="student-settings-password" label="新密碼（留空則不變）" type="password" value={password} onChange={(e) => setPassword(e.target.value)} inputProps={{ id: 'student-settings-password' }} InputLabelProps={{ htmlFor: 'student-settings-password' }} sx={{ mb: 2 }} />
            <Button variant="contained" onClick={handleSave} sx={{ minWidth: 100, height: 40 }}>儲存</Button>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
