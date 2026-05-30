import axios from 'axios'

// Central axios instance with JSON defaults and token injection
const api = axios.create({
  baseURL: 'http://localhost:3003', // adjust as needed
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers || {}
    // prefer Authorization header
    ;(config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`
  }
  return config
})

function extractMessage(err: any, fallback = '请求失败') {
  return err?.response?.data?.message || err?.response?.data || err?.message || fallback
}

export async function login(erp: string, password: string) {
  try {
    const res = await api.post('/api/login', { erp, password })
    return res.data
  } catch (err: any) {
    throw new Error(extractMessage(err, '登录失败'))
  }
}

export async function register(erp: string, password: string, username: string, phone: string) {
  try {
    const res = await api.post('/api/register', { erp, password, username, phone })
    return res.data
  } catch (err: any) {
    throw new Error(extractMessage(err, '注册失败'))
  }
}
