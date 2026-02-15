/** Vercel：測試用，確認 /api/health 有被執行 */
export default function handler(req, res) {
  res.status(200).json({ ok: true, from: 'api/health.js' })
}
