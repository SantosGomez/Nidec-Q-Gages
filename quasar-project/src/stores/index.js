// src/stores/index.js
import { store } from 'quasar/wrappers'
import { createPinia } from 'pinia'

export default store((/* { ssrContext } */) => {
  const pinia = createPinia()
  // Aquí puedes agregar plugins de Pinia si luego los necesitas
  return pinia
})