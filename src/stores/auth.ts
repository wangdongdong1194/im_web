import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))
  const erp = ref<string | null>(localStorage.getItem('auth_erp'))

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

  async function login(erp: string, password: string) {
    const data = await authApi.login(erp, password)
    if (data && data.token) {
      setToken(data.token)
      setErp(erp)
      return data
    }
    throw new Error('登录响应缺少 token')
  }

  async function register(erp: string, password: string, username: string, phone: string) {
    const data = await authApi.register(erp, password, username, phone)
    if (data && data.token) {
      setToken(data.token)
      setErp(erp)
    }
    return data
  }

  function logout() {
    setToken(null)
    setErp(null)
  }

  return { token, erp, isLoggedIn, login, logout, setToken, setErp, register }
})
