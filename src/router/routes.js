
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        redirect: 'dashboard',
      },
      {
        path: 'data/:path*',
        name: 'data',
        component: () => import('pages/Data')
      },
      {
        path: 'devices',
        name: 'devices',
        component: () => import('pages/Devices')
      },
      {
        path: 'table/:id',
        component: () => import('pages/Table'),
        meta: {
          back: true
        }
      },
      {
        path: 'flow/:id',
        component: () => import('pages/Flow'),
        meta: {
          back: true
        }
      },
      {
        path: 'chart/:id',
        component: () => import('pages/Chart'),
        meta: {
          back: true
        }
      },
      {
        path: 'chart',
        component: () => import('pages/Chart')
      },
      {
        path: 'text/:id',
        component: () => import('pages/Text'),
        meta: {
          back: true
        }
      },
      {
        path: 'image/:id',
        component: () => import('pages/Image'),
        meta: {
          back: true
        }
      },
      {
        path: 'resource/:id',
        component: () => import('pages/Resource'),
        meta: {
          back: true
        }
      },
      {
        path: 'create/:type',
        name: 'create',
        component: () => import('pages/Create'),
        meta: {
          back: true
        }
      },
      {
        path: 'device/:id',
        component: () => import('pages/Device'),
        meta: {
          back: true
        }
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('pages/Dashboard')
      },
      {
        path: 'settings',
        component: () => import('pages/Settings')
      },
      {
        path: 'flows',
        name: 'flows',
        component: () => import('pages/Flows')
      },
      {
        path: 'test',
        component: () => import('pages/Test')
      }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login')
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
