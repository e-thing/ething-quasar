import EThing from 'ething-js'
import {injectScript} from '../utils'


export default {
  install ({ EThingUI }) {
    Object.assign(EThingUI, {

      // retrieve some information about the server, plugins, scopes ... etc
      loadPlugins () {
        // load plugins index.js file
        var plugins = this.plugins || {}

        var pluginPromises = []
        for (let name in plugins) {
          let plugin = plugins[name]
          if (plugin.js_index) {
            pluginPromises.push(new Promise(function(resolve, reject) {
              injectScript(EThing.config.serverUrl + '/api/plugin/' + name + '/index.js', (error) => {
                  if (error) {
                      console.error('[meta] plugin ' + name + ' fail loading')
                      reject()
                  } else {
                      console.log('[meta] plugin ' + name + ' loaded')
                      resolve()
                  }
              })
            }))
          }
        }

        return Promise.all(pluginPromises)
      }

    })
  }
}
