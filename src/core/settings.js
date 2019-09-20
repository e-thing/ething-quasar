import EThing from 'ething-js'


export default ({EThingUI, Vue}) => {

    var timerId = null;

    EThing.on('signals/SettingsUpdated', function(evt) {
      console.log('[app] settings updated')

      if (timerId !== null) {
        clearTimeout(timerId)
      }
      timerId = setTimeout(() => {
        timerId = null
        EThingUI.loadSettings()
      }, 500)
    })

    Object.assign(EThingUI, {

        /*
        settings
        */
        settings: {},

        loadSettings () {
          return EThing.settings.get().then(settings => {

            Object.assign(this.settings, settings)

            return this.settings
          })
        },

    })

}
