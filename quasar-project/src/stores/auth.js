import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref(JSON.parse(localStorage.getItem('user_qgage')) || null)
  const token = ref(localStorage.getItem('token_qgage') || null)

  function login(userData, userToken) {
    usuario.value = userData
    token.value = userToken
    localStorage.setItem('user_qgage', JSON.stringify(userData))
    localStorage.setItem('token_qgage', userToken)
  }

  function logout() {
    usuario.value = null
    token.value = null
    localStorage.removeItem('user_qgage')
    localStorage.removeItem('token_qgage')
  }

  return { usuario, token, login, logout }
})