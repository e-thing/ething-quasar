import EThing from 'ething-js'
import { LocalStorage, Notify } from 'quasar'
import qs from 'qs'
import * as utils from '../utils'
import * as components from '../components'
import * as form from '../boot/formSchema/core'
import promiseFinally from 'promise.prototype.finally'

import meta from './meta.js'
import socketio from './socketio.js'
import widget from './widget.js'
import event from './event.js'
import settings from './settings.js'
import storage from './storage.js'
import info from './info.js'
import plugins from './plugins.js'
import activity from './activity.js'
import notification from './notification.js'


// necessary for older browsers
promiseFinally.shim()


const AUTH_REFRESH_INTERVAL = 3600 * 1000


var EThingUI = {
  VERSION: process.env.VERSION,
  utils,
  components,
  EThing,
  form
}


var getParameterByName = utils.getParameterByName

EThingUI.kioskMode = process.env.KIOSK || getParameterByName('kiosk') === '1'
EThingUI.virtualKeyboardEnabled = process.env.VIRTUALKEYBOARD || getParameterByName('virtualkeyboard') === '1'


function registerComponents (Vue, components) {
  // register the components globally
  Object.keys(components).forEach(key => {
    const c = components[key]
    if (utils.isVueComponent(c)) {
      if (c.name !== undefined) {
        Vue.component(c.name, c)
      }
    }
    else if (utils.isPlainObject(c)) {
      // sub module
      registerComponents (Vue, c)
    }
  })
}


EThingUI.install = ({ app, router, Vue, store }) => {

  if (EThingUI.__installed) { return }
  EThingUI.__installed = true

  // install error handler
  Vue.config.errorHandler = function (err, vm, info)  {
    let handler=null, current = vm
    if (vm) {
      if (vm.$options.errorHandler) {
        handler = vm.$options.errorHandler
      } else {
        while (current.$parent) {
          current = current.$parent
          if (handler = current.$options.errorHandler) break
        }
      }
    }
    if (handler) handler.call(current, err, vm, info)
    else console.error(err)
  }

  Object.assign(EThingUI, {

      router,
      store,

      getVueInstance () {
        return this.router.app
      },

      open (resource) {
        this.get(resource).open()
      }
  });

  // install sub modules
  var pp = [
    meta,
    socketio,
    widget,
    event,
    settings,
    storage,
    info,
    plugins,
    activity,
    notification
  ]

  pp.forEach(p => {
    var f = typeof p === 'function' ? p : p.install
    f({ EThingUI, Vue, router, store })
  })


  var serverUrl = null, dynamicServerUrl = false

  if (process.env.API === true) {
    var url = window.location.href
    var arr = url.split("/")
    serverUrl = arr[0] + "//" + arr[2]
  } else if (typeof process.env.API === 'string') {
    serverUrl = process.env.API
  } else {
    serverUrl = getParameterByName('server')
    if (!serverUrl) {
      serverUrl = LocalStorage.getItem('ething.server.url')
      dynamicServerUrl = true
    }
  }

  if (serverUrl) {
    EThing.config.serverUrl = serverUrl
  }

  if (!dynamicServerUrl) {
    EThingUI.autoLogin = /\/\/localhost/.test(EThing.config.serverUrl)
  }

  // make it globally available
  Vue.prototype.$ethingUI = EThingUI
  if (window) {
    // make it global to be accessible by the plugins !
    window.EThingUI = EThingUI
  }


  // register the components globally
  components && registerComponents(Vue, components)


  Object.assign(EThingUI, {
    dynamicServerUrl,

    getServerUrl () {
      return EThing.config.serverUrl
    },

    setServerUrl (url) {
      LocalStorage.set('ething.server.url', url)
      EThing.config.serverUrl = url
    },

    needAuth () {
      return dynamicServerUrl && !LocalStorage.getItem('ething.server.url')
    },

  })

  app.data = app.data || {}
  app.data.state = 'begin'
  app.data.error = false


  Object.assign(EThingUI, {

    reset () {
      app.data.state = 'begin'
      if (EThingUI.eventsSocket) EThingUI.eventsSocket.close()
      LocalStorage.remove('ething.auth.iat')
      if (this.authRefreshTimer) {
        clearInterval(this.authRefreshTimer)
      }
    },

    disconnect () {
      this.reset()

      router.app.$router.push({
        name: 'login',
        query: {
          redirect_uri: router.app.$router.currentRoute.path
        }
      })
    },

    logout () {
      var dfr = EThing.axios.request({
        method: 'get',
        url: EThing.config.serverUrl + '/auth/logout',
      })

      this.disconnect()

      return dfr
    },

    login (serverUrl, username, password) {

      return EThing.axios.request({
        method: 'post',
        url: serverUrl + '/auth/password',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
          login: username,
          password: password
        })
      }).then(response => {

        this.reset()

        this.setServerUrl(serverUrl)

        LocalStorage.set('ething.auth.iat', Date.now())

        // redirect
        var redirect = router.app.$route.query.redirect_uri || '/'
        if (redirect === '/login')
          redirect = '/'
        router.app.$router.replace(redirect)

      })
    },

    authRefreshTimer: null,

    authRefresh () {
      return EThing.axios.request({
        method: 'post',
        url: EThing.config.serverUrl + '/auth/refresh',
      }).then(() => {
        LocalStorage.set('ething.auth.iat', Date.now())
      })
    }
  })

  console.log('[app] ething configuring ...')

  EThing.axios.defaults.withCredentials = true

  // on unauthenticated request, start the auth process
  EThing.axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response) {
      var status = error.response.status

      if(status == 401 || status == 403){
        // reset the session
        EThingUI.disconnect()
      }
    }
    return Promise.reject(error);
  });

  router.beforeEach((to, from, next) => {

    //console.log('beforeEach', to, app.data.state);

    if (app.data.state === 'begin' && to.name !== 'login') {

      console.log('[app] begin...')

      // check if there is a stored session

      if (EThingUI.needAuth()) {
        console.warn('[app] no serverUrl found ! need to create a new session');

        next({
          name: 'login',
          replace: true,
          query: {
            redirect_uri: to.path
          }
        })

        return
      }

      // start init process

      app.data.state = 'initializing'

      console.log('[app] initializing...');

      EThingUI.initSockets()

      EThingUI.notifSocket.on('notification', function(evt) {
        //console.log('[app] notification received', evt)
        Notify.create({
          color: 'info',
          message: evt.msg,
          position: 'bottom-right',
          timeout: 15000,
          actions: [
            {
              icon: 'close',
              color: 'white',
              handler: () => {}
            }
          ],
        })
      })

      var appInstance = app.router.app
      window.app = appInstance
      window.quasar = appInstance.$q
      window.Vue = Vue

      var infoDfr = EThingUI.loadInfo()

      var metaDfr = EThingUI.loadMeta()

      var settingsDfr = EThingUI.loadSettings()

      var arboDfr = EThing.arbo.load(null, true).then( () => {
        console.log('[app] ething arbo loaded !')
        //store.commit('ething/update')
      })

      Promise.all([infoDfr, arboDfr, metaDfr, settingsDfr]).then(() => {
        return EThingUI.loadPlugins()
      }).then(() => {

        // everything went ok !
        app.data.state = 'ok'

        console.log('[app] ething loaded !')

        var sseReconnectFlag = false
        var sseNotification = null
        var sseNotificationType = null

        function sseConnectHandler () {

          if (sseNotification) {
            sseNotification()
          }

          if (sseReconnectFlag) {

            setTimeout( () => {
              router.go()
            }, 1000)

            // reload the resource !
            /*EThing.arbo.load(null, true).then( () => {
              console.log('[app] ething arbo reloaded !')
              store.commit('ething/update')
            })*/

            sseNotification = Notify.create({
              type: 'positive',
              color: 'positive',
              message: 'Reconnected to server !',
              icon: 'thumb_up',
              position: 'bottom-right',
              onDismiss () {
                sseNotification = null
              }
            })
            sseNotificationType = 'connected'
          }
        }

        function sseDisconnectHandler () {
          sseReconnectFlag = true

          if (sseNotificationType !== 'disconnected') {
            if (sseNotification) {
              sseNotification()
            }

            sseNotification = Notify.create({
              type: 'negative',
              color: 'negative',
              message: 'Lost connection to server !',
              icon: 'report_problem',
              position: 'bottom-right',
              timeout: 0,
              onDismiss () {
                sseNotification = null
              }
            })
            sseNotificationType = 'disconnected'
          }
        }

        EThingUI.on('ui.server.connected', sseConnectHandler);
        EThingUI.on('ui.server.disconnected', sseDisconnectHandler);

        EThingUI.eventsSocket.open()

        var iat = LocalStorage.getItem('ething.auth.iat')

        if (iat && Date.now() - iat > AUTH_REFRESH_INTERVAL) {
          EThingUI.authRefresh()
        }

        EThingUI.authRefreshTimer = setInterval(() => {
          EThingUI.authRefresh()
        }, AUTH_REFRESH_INTERVAL)

        EThingUI.emit('ui.loaded');

      }).catch( err => {
        console.error(err)
        // something went wrong !
        app.data.state = 'error'
        app.data.error = err
      })

    }

    next()

  })
}

export default EThingUI
