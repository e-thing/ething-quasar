import EThing from 'ething-js'

export default ({ app, router, Vue, store }) => {
  Vue.prototype.$ething = EThing

  console.log('ething configuring ...')
  EThing.config.serverUrl = 'http://lebios.no-ip.org'
  EThing.auth.setBasicAuth('ething', 'admin');

  EThing.arbo.load(function(){
    console.log('ething arbo loaded !')
    store.commit('ething/update')
  })
}
