import EThing from 'ething-js'
import {injectScript} from '../utils'

export class Plugin {

  constructor(clsName, ui) {
    this._clsName = clsName;
    this._ui = ui
  }

  get type() {
    return this._clsName;
  }

  get name() {
    return this.meta.title;
  }

  get meta() {
    return this._ui.get(this);
  }

  get settings() {
    return this._ui.settings[this.name] || {}
  }

  get package() {
    return this.meta.package;
  }

  get version() {
    return this.meta.package.version;
  }

  load () {
    // return a promise
    return new Promise((resolve, reject) => {
      if (this.meta.js_index) {
        var name = this.name
        injectScript(EThing.config.serverUrl + '/api/plugin/' + name + '/index.js', (error) => {
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

}

export default {
  install ({ EThingUI }) {
    Object.assign(EThingUI, {

      // retrieve some information about the server, plugins, scopes ... etc
      loadPlugins () {
        // load plugins index.js file
        var plugins = this.plugins || {}
        var loadedPlugins = this.loadedPlugins || []

        var pluginPromises = []

        loadedPlugins.forEach(clsName => {
          let plugin = new Plugin(clsName, this)
          plugins[plugin.name] = plugin
          pluginPromises.push(plugin.load())
        })

        // load local plugin (for dev purpose)
        if (process.env.DEV) {
          //pluginPromises.push(import('../../../ething/ething/plugins/OpenWeatherMap/js/src/index.js'))
          //pluginPromises.push(import('../../../ething/ething/plugins/spotify/js/src/index.js'))
          //pluginPromises.push(import('../../../ething/ething/plugins/google/js/src/index.js'))
        }

        return Promise.all(pluginPromises)
      }

    })
  }
}
