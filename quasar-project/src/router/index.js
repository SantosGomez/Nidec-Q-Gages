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
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  Router.beforeEach((to, from, next) => {
    const authStore = useAuthStore()
    // Usamos el token del store o del localStorage
    const isAuthenticated = authStore.token || localStorage.getItem('token_qgage')
    const user = authStore.usuario

    // 1. REGLA DE ORO: Si no está logueado y no va al login, directo a login
    if (to.name !== 'login' && !isAuthenticated) {
      next({ name: 'login' })
    }

    // 2. Si ya está logueado e intenta ir al login, lo mandamos al inicio
    else if (to.name === 'login' && isAuthenticated) {
      next({ path: '/' })
    }

    // 3. CONTROL DE PERMISOS (Solo si ya pasó las reglas anteriores)
    else {
      // Si la ruta requiere Admin y el usuario no lo es...
      if (to.meta.requiereAdmin && user?.Rol !== 'Admin' && user?.Rol !== 'SuperAdmin') {
        next('/')
      }
      // Si la ruta requiere un permiso específico (ej. ver_gage) y no lo tiene...
      else if (to.meta.permiso && !user?.[to.meta.permiso]) {
        next('/')
      }
      // Si pasa todas las pruebas, lo dejamos entrar
      else {
        next()
      }
    }
  })

  return Router
})
