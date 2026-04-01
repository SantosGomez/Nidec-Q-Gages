const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: 'index', component: () => import('pages/IndexPage.vue') },
      { path: '/', component: () => import('pages/IndexPage.vue') },
      { path: 'GageMaster', component: () => import('pages/GageMasterPage.vue') },
      // { path: 'GageForm', component: () => import ('pages/GagesFormPage.vue') },
      // { path: 'CalibracionForm', component: () => import ('pages/CalibracionFormPage.vue') },
      { path: 'Calibracion', component: () => import ('pages/CalibracionPage.vue') },
      { path: 'checkout', component: () => import ('pages/PrestamosPage.vue') },
      { path: 'Procedimientos', component: () => import ('pages/ProcedimientoPage.vue') },
      { path: 'Usuarios', component: () => import ('pages/UsuarioPage.vue') },
      { path: 'Reports', component: () => import ('pages/ReportsPage.vue') },
      {path: 'login', component:() => import ('pages/LoginPage.vue')},
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
