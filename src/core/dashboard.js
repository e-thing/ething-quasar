import EThing from 'ething-js'
import { uid } from 'quasar'


const LAYOUT_FILENAME = ".dashboard.json"


export default {
  install ({ EThingUI }) {

    var _file = null;
    var _silent = false;

    function init () {
      var files = EThing.arbo.glob(LAYOUT_FILENAME).filter(r => r instanceof EThing.File)
      var file = null
      if (files.length) {
        file = files[0]
      }
      registerFile(file)
      return loadContent()
    }

    function _onFileUpdated () {
      if (!_silent) {
        loadContent()
      }
    }

    function registerFile (file) {
      if (_file) {
        _file.off('updated', _onFileUpdated)
      }
      _file = file
      if (file) file.on('updated', _onFileUpdated)
    }

    function loadContent () {
      if (_file) {
        return _file.read().then( config => {

          if(typeof config == 'string') {
            try{
              config = JSON.parse(config);
            }
            catch(e){
              config = {}
            }
          }

          EThingUI.dashboard.config = config
          EThingUI.emit('ui.dashboard.config');

          return config
        })
      }
    }

    function save (conf) {
      var etag = uid()
      conf.etag = etag
      if (!_file) {
        // create the file if not found !
        EThing.File.create({
					name: LAYOUT_FILENAME
				}).then( (file) => {
          registerFile(file)
					return _save(file, conf)
				})

      } else {
        _save(_file, conf)
      }
      return etag
    }

    function _save (file, config) {
      _silent = true
      return file.write( JSON.stringify(config, null, 4) ).then(() => {
        EThingUI.dashboard.config = config
        EThingUI.emit('ui.dashboard.config');
      }).finally(() => {
        _silent = false
      })
    }

    Object.assign(EThingUI, {
      dashboard: {
        init,
        save,
        config: {}
      }
    })
  }
}
