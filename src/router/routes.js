
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
        path: 'table/:id',
        component: () => import('pages/Table')
      },
      {
        path: 'text/:id',
        component: () => import('pages/Text')
      },
      {
        path: 'resource/:id',
        component: () => import('pages/Resource')
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
