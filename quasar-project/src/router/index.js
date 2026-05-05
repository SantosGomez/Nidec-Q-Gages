import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'
import { useAuthStore } from 'src/stores/auth'
/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
  // 1. REINSTALAMOS LA LÓGICA DE HISTORY (Esto quita los errores de 'undefined' y 'unused')
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // 2. CORRECCIÓN DE ESLINT: Quitamos 'from' porque no se está usando
  Router.beforeEach((to) => { 
    const authStore = useAuthStore()
    const isAuthenticated = authStore.token || localStorage.getItem('token_qgage')
    const user = authStore.usuario

    // REGLA DE ORO: Si no está logueado y no va al login
    if (to.name !== 'login' && !isAuthenticated) {
      return { name: 'login' }
    }

    // Si ya está logueado e intenta ir al login
    if (to.name === 'login' && isAuthenticated) {
      return { path: '/' }
    }

    // CONTROL DE PERMISOS
    if (to.meta.requiereAdmin && user?.Rol !== 'Admin' && user?.Rol !== 'SuperAdmin') {
      return '/'
    }

    if (to.meta.permiso && !user?.[to.meta.permiso]) {
      return '/'
    }

    return true 
  })

  return Router
})