import React, { createContext, useContext, useState, useCallback } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = sessionStorage.getItem('attendance_user')
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })

  const login = useCallback((account, password) => {
    const u = window.__mockAuth(account, password)
    if (u) {
      setUser(u)
      sessionStorage.setItem('attendance_user', JSON.stringify(u))
      return { ok: true, role: u.role }
    }
    return { ok: false }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    sessionStorage.removeItem('attendance_user')
  }, [])

  const updateCurrentUser = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, ...updates }
      sessionStorage.setItem('attendance_user', JSON.stringify(next))
      return next
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
