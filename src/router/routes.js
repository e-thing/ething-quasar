
export default [
  {
    path: '/',
    component: () => import('layouts/default'),
    children: [
      {
        path: '',
        component: () => import('pages/index')
      },
      {
        path: 'data/:path*',
        component: () => import('pages/Data')
      },
      {
        path: 'devices',
        component: () => import('pages/Devices')
      },
      {
        path: 'table/:id',
        component: () => import('pages/Table')
      },
      {
        path: 'chart/:id',
        component: () => import('pages/Chart')
      },
      {
        path: 'text/:id',
        component: () => import('pages/Text')
      },
      {
        path: 'image/:id',
        component: () => import('pages/Image')
      },
      {
        path: 'resource/:id',
        component: () => import('pages/Resource')
      },
      {
        path: 'device/:id',
        component: () => import('pages/Device')
      },
      {
        path: 'dashboard',
        component: () => import('pages/Dashboard')
      },
      {
        path: 'test',
        component: () => import('pages/Test')
      }
    ]
  },

  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404')
  }
]
