import EThing from 'ething-js'


export default ({EThingUI, Vue}) => {


    EThing.on('ConfigUpdated', function(evt) {
      console.log('[app] settings updated', evt)
      EThingUI.settings = evt.data.config
    })

    Object.assign(EThingUI, {

        /*
        settings
        */
        settings: {},

        loadSettings () {
          return EThing.settings.get().then(settings => {

            this.settings = settings

            return settings
          })
        },

    })

}
