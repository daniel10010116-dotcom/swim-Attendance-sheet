/**
 * 依 plan/swimming-attendance-mvp-spec 的資料與登入模擬。
 * 使用 localStorage 跨分頁／視窗共用狀態，學生點名後教練頁能即時看到待確認。
 */

const STORAGE_KEY = 'attendance_store'

const defaultCoaches = [
  { id: 'c1', name: '王教練', account: 'coach1', password: '123' },
]
const defaultStudents = [
  { id: 's1', name: '小明', account: 'student1', password: '123', contact: '0912-345678' },
]
let adminCredentials = { account: 'admin', password: 'admin' }

// 學生－教練－課程：{ id, studentId, coachId, courseName, totalLessons, remainingLessons, salaryWhenDone }
let enrollments = [
  { id: 'e1', studentId: 's1', coachId: 'c1', courseName: '一對一游泳', totalLessons: 10, remainingLessons: 8, salaryWhenDone: 5000 },
]

// 待確認點名：{ id, enrollmentId, studentId, coachId, courseName, studentName, requestedAt }
let pendingAttendances = []

// 扣堂紀錄：{ id, enrollmentId, studentId, coachId, studentName, courseName, confirmedAt }
let attendanceRecords = []

// 教練累計薪水（依扣完堂的課程累加）
let coachEarned = { c1: 0 }

// 累計薪水明細：課堂數上完時記錄一筆，發薪後清除 { coachId, studentName, courseName, completedAt, amount }
let completedSalaryDetails = []

function loadFromStorage() {
  if (typeof window === 'undefined') return
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    if (Array.isArray(data.pendingAttendances)) pendingAttendances = data.pendingAttendances
    if (Array.isArray(data.enrollments)) enrollments = data.enrollments
    if (Array.isArray(data.attendanceRecords)) attendanceRecords = data.attendanceRecords
    if (data.coachEarned && typeof data.coachEarned === 'object') coachEarned = data.coachEarned
    if (Array.isArray(data.completedSalaryDetails)) completedSalaryDetails = data.completedSalaryDetails
    if (Array.isArray(data.coaches)) {
      defaultCoaches.length = 0
      defaultCoaches.push(...data.coaches)
    }
    if (Array.isArray(data.students)) {
      defaultStudents.length = 0
      defaultStudents.push(...data.students)
    }
    if (data.adminCredentials && typeof data.adminCredentials === 'object') {
      adminCredentials = data.adminCredentials
    }
  } catch (_) {}
}

function saveToStorage() {
  if (typeof window === 'undefined') return
  try {
    const data = {
      pendingAttendances,
      enrollments,
      attendanceRecords,
      coachEarned,
      completedSalaryDetails,
      coaches: defaultCoaches,
      students: defaultStudents,
      adminCredentials,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (_) {}
}

// 初次載入時從 localStorage 還原（與其他分頁同步）
if (typeof window !== 'undefined') loadFromStorage()

function getEnrollment(id) {
  loadFromStorage()
  return enrollments.find((e) => e.id === id)
}

function getEnrollmentsByStudent(studentId) {
  loadFromStorage()
  return enrollments.filter((e) => e.studentId === studentId && defaultCoaches.some((c) => c.id === e.coachId))
}

function getEnrollmentsByCoach(coachId) {
  loadFromStorage()
  return enrollments.filter((e) => e.coachId === coachId && defaultStudents.some((s) => s.id === e.studentId))
}

function getPendingByCoach(coachId) {
  loadFromStorage()
  return pendingAttendances.filter((p) => p.coachId === coachId)
}

function getPendingByEnrollment(enrollmentId) {
  loadFromStorage()
  return pendingAttendances.find((p) => p.enrollmentId === enrollmentId)
}

function getStudents() {
  loadFromStorage()
  return [...defaultStudents]
}

function getCoaches() {
  loadFromStorage()
  return [...defaultCoaches]
}

function getStudent(id) {
  loadFromStorage()
  return defaultStudents.find((s) => s.id === id)
}

function getCoach(id) {
  loadFromStorage()
  return defaultCoaches.find((c) => c.id === id)
}

function auth(account, password) {
  loadFromStorage()
  if (account === adminCredentials.account && password === adminCredentials.password) {
    return { id: 'admin', name: '管理員', account, role: 'admin' }
  }
  const coach = defaultCoaches.find((c) => c.account === account && c.password === password)
  if (coach) return { id: coach.id, name: coach.name, account: coach.account, role: 'coach' }
  const student = defaultStudents.find((s) => s.account === account && s.password === password)
  if (student) return { id: student.id, name: student.name, account: student.account, role: 'student' }
  return null
}

function requestAttendance(enrollmentId) {
  const enr = getEnrollment(enrollmentId)
  if (!enr || enr.remainingLessons <= 0) return { ok: false }
  if (getPendingByEnrollment(enrollmentId)) return { ok: false }
  const student = getStudent(enr.studentId)
  const id = 'pa' + Date.now()
  pendingAttendances.push({
    id,
    enrollmentId,
    studentId: enr.studentId,
    coachId: enr.coachId,
    courseName: enr.courseName,
    studentName: student?.name ?? '',
    requestedAt: new Date().toISOString(),
  })
  saveToStorage()
  return { ok: true }
}

function confirmAttendance(pendingId) {
  const idx = pendingAttendances.findIndex((p) => p.id === pendingId)
  if (idx === -1) return { ok: false }
  const p = pendingAttendances[idx]
  const enr = getEnrollment(p.enrollmentId)
  if (!enr || enr.remainingLessons <= 0) {
    pendingAttendances.splice(idx, 1)
    return { ok: false }
  }
  enr.remainingLessons -= 1
  if (enr.remainingLessons === 0) {
    coachEarned[p.coachId] = (coachEarned[p.coachId] || 0) + (enr.salaryWhenDone || 0)
    completedSalaryDetails.push({
      coachId: p.coachId,
      studentName: p.studentName,
      courseName: p.courseName,
      completedAt: new Date().toISOString(),
      amount: enr.salaryWhenDone || 0,
    })
  }
  attendanceRecords.push({
    id: 'ar' + Date.now(),
    enrollmentId: p.enrollmentId,
    studentId: p.studentId,
    coachId: p.coachId,
    studentName: p.studentName,
    courseName: p.courseName,
    confirmedAt: new Date().toISOString(),
  })
  pendingAttendances.splice(idx, 1)
  saveToStorage()
  return { ok: true }
}

function getAttendanceRecords(coachId, startDate, endDate) {
  loadFromStorage()
  let list = attendanceRecords.filter((r) => r.coachId === coachId)
  if (startDate) {
    const s = new Date(startDate).toISOString().slice(0, 10)
    list = list.filter((r) => r.confirmedAt.slice(0, 10) >= s)
  }
  if (endDate) {
    const e = new Date(endDate).toISOString().slice(0, 10)
    list = list.filter((r) => r.confirmedAt.slice(0, 10) <= e)
  }
  return list
}

function getCoachEarned(coachId) {
  loadFromStorage()
  return coachEarned[coachId] || 0
}

function getCompletedSalaryDetails(coachId) {
  loadFromStorage()
  return completedSalaryDetails.filter((d) => d.coachId === coachId)
}

function getCompletedEnrollmentsForCoach(coachId) {
  loadFromStorage()
  return enrollments.filter((e) => e.coachId === coachId && e.remainingLessons === 0)
}

function createCoach(name, account, password) {
  const trimmedAccount = (account || '').trim()
  if (!trimmedAccount) return null
  if (defaultCoaches.some((c) => c.account === trimmedAccount)) return null
  if (trimmedAccount === adminCredentials.account) return null
  if (defaultStudents.some((s) => s.account === trimmedAccount)) return null
  const id = 'c' + Date.now()
  defaultCoaches.push({ id, name, account: trimmedAccount, password })
  coachEarned[id] = 0
  saveToStorage()
  return id
}

function createStudent(name, account, password, contact = '') {
  const trimmedAccount = (account || '').trim()
  if (!trimmedAccount) return null
  if (defaultStudents.some((s) => s.account === trimmedAccount)) return null
  if (trimmedAccount === adminCredentials.account) return null
  if (defaultCoaches.some((c) => c.account === trimmedAccount)) return null
  const id = 's' + Date.now()
  defaultStudents.push({ id, name, account: trimmedAccount, password, contact: contact || '' })
  saveToStorage()
  return id
}

function assignStudentToCoach(studentId, coachId, courseName, totalLessons, salaryWhenDone) {
  const id = 'e' + Date.now()
  enrollments.push({
    id,
    studentId,
    coachId,
    courseName: courseName || '課程',
    totalLessons,
    remainingLessons: totalLessons,
    salaryWhenDone,
  })
  saveToStorage()
  return id
}

function resetStudentPassword(studentId, newPassword) {
  const s = defaultStudents.find((x) => x.id === studentId)
  if (s) {
    s.password = newPassword
    saveToStorage()
  }
  return !!s
}

function deleteStudent(studentId) {
  const i = defaultStudents.findIndex((x) => x.id === studentId)
  if (i === -1) return false
  defaultStudents.splice(i, 1)
  enrollments = enrollments.filter((e) => e.studentId !== studentId)
  pendingAttendances = pendingAttendances.filter((p) => p.studentId !== studentId)
  saveToStorage()
  return true
}

function confirmPayCoach(coachId) {
  const earned = coachEarned[coachId] || 0
  coachEarned[coachId] = 0
  completedSalaryDetails = completedSalaryDetails.filter((d) => d.coachId !== coachId)
  enrollments = enrollments.filter((e) => !(e.coachId === coachId && e.remainingLessons === 0))
  saveToStorage()
  return earned
}

function updateCoachAccount(coachId, account, password) {
  const c = defaultCoaches.find((x) => x.id === coachId)
  if (!c) return false
  const trimmedAccount = (account != null && account !== '') ? String(account).trim() : null
  if (trimmedAccount !== null && trimmedAccount !== c.account) {
    if (defaultCoaches.some((x) => x.id !== coachId && x.account === trimmedAccount)) return false
    if (defaultStudents.some((s) => s.account === trimmedAccount)) return false
    if (trimmedAccount === adminCredentials.account) return false
    c.account = trimmedAccount
  }
  if (password != null && password !== '') c.password = password
  saveToStorage()
  return true
}

function deleteCoach(coachId) {
  const i = defaultCoaches.findIndex((x) => x.id === coachId)
  if (i === -1) return false
  defaultCoaches.splice(i, 1)
  delete coachEarned[coachId]
  completedSalaryDetails = completedSalaryDetails.filter((d) => d.coachId !== coachId)
  enrollments = enrollments.filter((e) => e.coachId !== coachId)
  pendingAttendances = pendingAttendances.filter((p) => p.coachId !== coachId)
  attendanceRecords = attendanceRecords.filter((r) => r.coachId !== coachId)
  saveToStorage()
  return true
}

function updateAdminAccount(newAccount, newPassword) {
  if (!newAccount || !newAccount.trim()) return false
  adminCredentials.account = newAccount.trim()
  if (newPassword != null && newPassword !== '') adminCredentials.password = newPassword
  saveToStorage()
  return true
}

function updateStudentAccount(studentId, newAccount, newPassword) {
  const s = defaultStudents.find((x) => x.id === studentId)
  if (!s) return false
  const trimmedAccount = (newAccount != null && newAccount !== '') ? String(newAccount).trim() : null
  if (trimmedAccount !== null && trimmedAccount !== s.account) {
    if (defaultStudents.some((x) => x.id !== studentId && x.account === trimmedAccount)) return false
    if (defaultCoaches.some((c) => c.account === trimmedAccount)) return false
    if (trimmedAccount === adminCredentials.account) return false
    s.account = trimmedAccount
  }
  if (newPassword != null && newPassword !== '') s.password = newPassword
  saveToStorage()
  return true
}

export const mockStore = {
  auth,
  getEnrollment,
  getEnrollmentsByStudent,
  getEnrollmentsByCoach,
  getPendingByCoach,
  getPendingByEnrollment,
  getStudents,
  getCoaches,
  getStudent,
  getCoach,
  requestAttendance,
  confirmAttendance,
  getAttendanceRecords,
  getCoachEarned,
  getCompletedSalaryDetails,
  getCompletedEnrollmentsForCoach,
  createCoach,
  createStudent,
  assignStudentToCoach,
  resetStudentPassword,
  deleteStudent,
  confirmPayCoach,
  updateCoachAccount,
  deleteCoach,
  updateAdminAccount,
  updateStudentAccount,
}

// 供登入用
if (typeof window !== 'undefined') {
  window.__mockAuth = auth
  window.__mockStore = mockStore
}
