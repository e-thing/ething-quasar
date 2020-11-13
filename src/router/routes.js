import ResourceList from '../components/ResourceList'
import EThingUI from '../core'

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
        path: 'explore',
        name: 'explore',
        component: ResourceList,
        props: (route) => {
          var props = {
            tree: true,
          };
          var resources = route.query.resources

          if (typeof route.query.deviceMenu != 'undefined') {

            props.defaultSort = 'location'

            var deviceMenuItems = EThingUI.menu.devices

            if (route.query.deviceMenu==='other') {
              var filters = deviceMenuItems.map(item => EThingUI.resource.typeFilter(item.types))

              resources = r => {
                if (EThingUI.isSubclass(r, 'resources/Device')) {
                  var pass = true
                  for (var i in filters) {
                    if (filters[i](r)) {
                      pass = false
                      break;
                    }
                  }
                  return pass
                }
              }

              props.createTypes = 'resources/Device'

            } else if (route.query.deviceMenu==='all') {
              resources = "resources/Device"
            } else {
              resources = deviceMenuItems[route.query.deviceMenu].types
            }
          }

          props.resources = resources

          return props
        }
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
        name: 'chart',
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
        path: 'resourceEdit/:id',
        name: 'resourceEdit',
        component: () => import('pages/ResourceEdit'),
        meta: {
          back: true
        }
      },
      {
        path: 'resourceEdit/:type',
        name: 'resourceCreate',
        component: () => import('pages/ResourceEdit'),
        meta: {
          back: true
        }
      },
      {
        path: 'resource/:id',
        name: 'resourceMain',
        component: () => import('pages/ResourceMain'),
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
        path: 'system',
        redirect: {
          name: 'system',
          params: {
            panel: 'settings'
          }
        },
      },
      {
        path: 'system/:panel?',
        name: 'system',
        component: () => import('pages/System'),
        props: true
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
