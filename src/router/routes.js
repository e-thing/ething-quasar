
const routes = [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        redirect: 'dashboard',
      },
      {
        path: 'data',
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
        component: () => import('pages/Resource'),
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
        path: 'accounts',
        name: 'accounts',
        component: () => import('pages/Accounts')
      }
    ]
  },

  {
    path: '/login',
    name: 'login',
    component: () => import('pages/Login')
  },
]

if (process.env.DEV) {
  routes[0].children.push({
    path: 'test/:id*',
    component: () => import('pages/Test')
  })
}

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/404')
  })
}

export default routes
