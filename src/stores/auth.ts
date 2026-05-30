import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const erp = ref<string | null>(localStorage.getItem('auth_erp'))
  const username = ref<string | null>(localStorage.getItem('auth_username'))
  const phone = ref<string | null>(localStorage.getItem('auth_phone'))
  const email = ref<string | null>(localStorage.getItem('auth_email'))
  const nickname = ref<string | null>(localStorage.getItem('auth_nickname'))
  const bio = ref<string | null>(localStorage.getItem('auth_bio'))

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string | null) {
    token.value = t
    if (t) {
      localStorage.setItem('auth_token', t)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  function setErp(e: string | null) {
    erp.value = e
    if (e) {
      localStorage.setItem('auth_erp', e)
    } else {
      localStorage.removeItem('auth_erp')
    }
  }

  function setUsername(u: string | null) {
    username.value = u
    if (u) localStorage.setItem('auth_username', u)
    else localStorage.removeItem('auth_username')
  }

  function setPhone(p: string | null) {
    phone.value = p
    if (p) localStorage.setItem('auth_phone', p)
    else localStorage.removeItem('auth_phone')
  }

  function setEmail(e: string | null) {
    email.value = e
    if (e) localStorage.setItem('auth_email', e)
    else localStorage.removeItem('auth_email')
  }

  function setNickname(n: string | null) {
    nickname.value = n
    if (n) localStorage.setItem('auth_nickname', n)
    else localStorage.removeItem('auth_nickname')
  }

  function setBio(b: string | null) {
    bio.value = b
    if (b) localStorage.setItem('auth_bio', b)
    else localStorage.removeItem('auth_bio')
  }

  function setProfileFromResponse(data: any) {
    // try common shapes: data.user, data.profile, or data itself
    const user = data?.user ?? data?.profile ?? data ?? null
    if (!user) return
    if (user.username) setUsername(user.username)
    if (user.phone) setPhone(user.phone)
    if (user.email) setEmail(user.email)
    if (user.nickname) setNickname(user.nickname)
    if (user.bio) setBio(user.bio)
    // also set erp if provided
    if (user.erp) setErp(user.erp)
  }

  async function login(erp: string, password: string) {
    const data = await authApi.login(erp, password)
    if (data && data.token) {
      setToken(data.token)
      setErp(erp)
      setProfileFromResponse(data)
      return data
    }
    throw new Error('登录响应缺少 token')
  }

  async function register(erp: string, password: string, username: string, phone: string) {
    const data = await authApi.register(erp, password, username, phone)
    if (data && data.token) {
      setToken(data.token)
      setErp(erp)
      setProfileFromResponse(data)
    }
    return data
  }

  function logout() {
    setToken(null)
    setErp(null)
    setUsername(null)
    setPhone(null)
    setEmail(null)
    setNickname(null)
    setBio(null)
  }

  return {
    token,
    erp,
    username,
    phone,
    email,
    nickname,
    bio,
    isLoggedIn,
    login,
    logout,
    setToken,
    setErp,
    setUsername,
    setPhone,
    setEmail,
    setNickname,
    setBio,
    setProfileFromResponse,
    register,
  }
})
