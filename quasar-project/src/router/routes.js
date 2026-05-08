const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/IndexPage.vue') 
      },
      { 
        path: 'GageMaster', 
        component: () => import('pages/GageMasterPage.vue'),
        meta: { permiso: 'ver_gage' } // Requiere este permiso en el store
      },
      { 
        path: 'Calibracion', 
        component: () => import('pages/CalibracionPage.vue'),
        meta: { permiso: 'ver_calibracion' }
      },
      { 
        path: 'checkout', 
        component: () => import('pages/PrestamosPage.vue') 
        // Si todos pueden entrar a préstamos, se deja sin meta
      },
      { 
        path: 'Procedimientos', 
        component: () => import('pages/ProcedimientoPage.vue'),
        meta: { permiso: 'ver_procedimientos' }
      },
      { 
        path: 'Usuarios', 
        component: () => import('pages/UsuarioPage.vue'),
        meta: { requiereAdmin: true } // Solo para Admin/SuperAdmin
      },
      { 
        path: 'Reports', 
        component: () => import('pages/ReportsPage.vue'),
        meta: { permiso: 'ver_reportes' }
      },
      {
        path: 'InfoApoyo',
        component: () => import('pages/InfoApoyoPage.vue'),
        meta: { requiereAdmin: true } // Solo para Admin/SuperAdmin
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', name: 'login', component: () => import('pages/LoginPage.vue') },
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
