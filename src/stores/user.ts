import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
  username: string
  phone: string
  email?: string
}

export const useUserStore = defineStore('user', () => {
  const isLoggedIn = ref(false)
  const userInfo = ref<UserInfo | null>(null)
  const token = ref<string | null>(null)

  // 登录
  const login = (username: string, password: string) => {
    // 模拟登录验证（实际应该调用API）
    if (username && password) {
      isLoggedIn.value = true
      userInfo.value = {
        username,
        phone: '',
      }
      token.value = 'mock-token-' + Date.now()
      // 保存到localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return true
    }
    return false
  }

  // 注册
  const register = (username: string, phone: string, password: string, code: string) => {
    // 模拟注册（实际应该调用API）
    if (username && phone && password && code) {
      isLoggedIn.value = true
      userInfo.value = {
        username,
        phone,
      }
      token.value = 'mock-token-' + Date.now()
      // 保存到localStorage
      localStorage.setItem('token', token.value)
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return true
    }
    return false
  }

  // 退出登录
  const logout = () => {
    isLoggedIn.value = false
    userInfo.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  // 检查登录状态
  const checkLogin = () => {
    const savedToken = localStorage.getItem('token')
    const savedUserInfo = localStorage.getItem('userInfo')
    if (savedToken && savedUserInfo) {
      isLoggedIn.value = true
      token.value = savedToken
      userInfo.value = JSON.parse(savedUserInfo)
    }
  }

  // 初始化时检查登录状态
  checkLogin()

  return {
    isLoggedIn,
    userInfo,
    token,
    login,
    register,
    logout,
    checkLogin,
  }
})

