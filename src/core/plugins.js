import EThing from 'ething-js'
import {injectScript} from '../utils'


export default {
  install ({ EThingUI }) {

    function loadIndexJS (plugin) {
      // return a promise
      return new Promise((resolve, reject) => {
        var meta = EThingUI.get(plugin);

        if (meta.js_index) {
          var name = plugin.name()
          injectScript(EThing.config.serverUrl + '/api/plugins/' + name + '/index.js', (error) => {
              if (error) {
                  console.error('[meta] plugin ' + name + ' fail loading')
                  reject(this, error)
              } else {
                  console.log('[meta] plugin ' + name + ' loaded')
                  resolve(this)
              }
          })
        } else {
          resolve()
        }
      })
    }

    Object.assign(EThingUI, {

      plugins: [],

      findPlugin (name) {
        var i;
        for(i=0; i<this.plugins.length; i++) {
          var plugin = this.plugins[i];
          if (plugin.name() === name || plugin.type() === name) {
            return plugin;
          }
        }
        return null;
      },

      loadPlugins () {
        return EThing.Plugin.list().then(plugins => {
          EThingUI.plugins = plugins || [];

          // load index.js
          var pluginPromises = []

          plugins.forEach(plugin => {
            pluginPromises.push(loadIndexJS(plugin))
          })

          // load local plugin (for dev purpose)
          if (process.env.DEV) {
            //pluginPromises.push(import('../../../ething/ething/plugins/OpenWeatherMap/js/src/index.js'))
            //pluginPromises.push(import('../../../ething/ething/plugins/spotify/js/src/index.js'))
            //pluginPromises.push(import('../../../ething/ething/plugins/google/js/src/index.js'))
          }

          return Promise.all(pluginPromises)
        })
      }

    })
  }
}
