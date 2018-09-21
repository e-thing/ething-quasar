import EThing from 'ething-js'
import { LocalStorage, Notify } from 'quasar'
import { ethingUI } from 'ething-quasar-core'
import qs from 'qs'

console.log('ethingUI:', ethingUI)

const AUTH_REFRESH_INTERVAL = 3600 * 1000

export var UI = {
  VERSION: process.env.VERSION
}

var getParameterByName = ethingUI.utils.getParameterByName

UI.kioskMode = getParameterByName('kiosk') === '1'

export default ({ app, router, Vue, store }) => {

  EThing.on('Notified', function(evt) {
    console.log(evt)
    Notify.create({
      type: 'info',
      message: evt.data.message,
      detail: evt.data.subject,
      position: 'bottom-right',
      timeout: 15000,
      actions: [
        {
          label: 'Close',
          handler: () => {}
        }
      ],
    })
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
      serverUrl = LocalStorage.get.item('ething.server.url')
      dynamicServerUrl = true
    }
  }

  if (serverUrl) {
    EThing.config.serverUrl = serverUrl
  }

  if (!dynamicServerUrl) {
    UI.autoLogin = /\/\/localhost/.test(EThing.config.serverUrl)
  }

  Vue.prototype.$ui = window.UI = UI

  Object.assign(UI, {
    dynamicServerUrl,

    getServerUrl () {
      return EThing.config.serverUrl
    },

    setServerUrl (url) {
      LocalStorage.set('ething.server.url', url)
      EThing.config.serverUrl = url
    },

    needAuth () {
      return dynamicServerUrl && !LocalStorage.get.item('ething.server.url')
    },

    open (resource, more) {
      var route = ethingUI.route(resource, more)
      if (route) {
        router.app.$router.push(route)
      }
    },

  })

  app.data = app.data || {}
  app.data.state = 'begin'
  app.data.error = false

  Object.assign(UI, {

    reset () {
      app.data.state = 'begin'
      SSE.stop()
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
      return EThing.axios.request({
        method: 'get',
        url: EThing.config.serverUrl + '/auth/logout',
      }).finally(() => {
        this.disconnect()
      })
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

  console.log('ething configuring ...')

  EThing.axios.defaults.withCredentials = true

  // on unauthenticated request, start the auth process
  EThing.axios.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    if (error.response) {
      var status = error.response.status

      if(status == 401 || status == 403){
        // reset the session
        UI.disconnect()
      }
    }
    return Promise.reject(error);
  });

  router.beforeEach((to, from, next) => {

    //console.log('beforeEach', to, app.data.state);

    if (app.data.state === 'begin' && to.name !== 'login') {

      console.log('begin...')

      // check if there is a stored session

      if (UI.needAuth()) {
        console.warn('no serverUrl found ! need to create a new session');

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

      console.log('initializing...');

      var appInstance = app.router.app
      window.app = appInstance
      window.quasar = appInstance.$q
      window.Vue = Vue

      var metaDfr = ethingUI.meta.loadDefinitions()

      var arboDfr = EThing.arbo.load(null, true).then( () => {
        console.log('ething arbo loaded !')
        store.commit('ething/update')
      })

      Promise.all([arboDfr, metaDfr]).then( () => {

        // everything went ok !
        app.data.state = 'ok'

        console.log('ething loaded !')

        var sseReconnectFlag = false

        ethingUI.sse.onconnect = function(){
          if (sseReconnectFlag) {
            // reload the resource !
            EThing.arbo.load(null, true).then( () => {
              console.log('ething arbo reloaded !')
              store.commit('ething/update')
            })
          }
        }

        ethingUI.sse.ondisconnect = function(){
          sseReconnectFlag = true
        }

        ethingUI.sse.start()

        var iat = LocalStorage.get.item('ething.auth.iat')

        if (iat && Date.now() - iat > AUTH_REFRESH_INTERVAL) {
          UI.authRefresh()
        }

        UI.authRefreshTimer = setInterval(() => {
          UI.authRefresh()
        }, AUTH_REFRESH_INTERVAL)

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
