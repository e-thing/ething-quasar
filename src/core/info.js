import EThing from 'ething-js'


export default {
  install ({ EThingUI }) {
    Object.assign(EThingUI, {

      // contains some information about the server
      info: {},

      // store informations about loaded plugins
      plugins: {},

      // list the available scopes (used in api key)
      scopes: {},


      // retrieve some information about the server, plugins, scopes ... etc
      loadInfo () {
        var p = EThing.request({
          url: 'utils/info',
          dataType: 'json',
        })

        return p.then(data => {
          console.log('[meta] ething info loaded !')
          var loadedPlugins = data.plugins
          delete data.plugins
          Object.assign(this, data, {loadedPlugins})
        }).catch(err => {
          console.error('[meta] ething info error !')
        })
      }

    })
  }
}
