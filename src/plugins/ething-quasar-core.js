import EThingUI from 'ething-quasar-core'

export default ({ app, router, Vue, store }) => {
  Vue.use(EThingUI, {
    router,
    store
  })

  // for debugging
  //require('../../../ething/ething/plugins/SSH/js/src')

}
