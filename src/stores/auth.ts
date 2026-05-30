import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as authApi from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('auth_token'))

  const isLoggedIn = computed(() => !!token.value)

  function setToken(t: string | null) {
    token.value = t
    if (t) {
      localStorage.setItem('auth_token', t)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  async function login(erp: string, password: string) {
    const data = await authApi.login(erp, password)
    if (data && data.token) {
      setToken(data.token)
      return data
    }
    throw new Error('登录响应缺少 token')
  }

  async function register(erp: string, password: string, username: string, phone: string) {
    const data = await authApi.register(erp, password, username, phone)
    if (data && data.token) {
      setToken(data.token)
    }
    return data
  }

  function logout() {
    setToken(null)
  }

  return { token, isLoggedIn, login, logout, setToken, register }
})
