import EThing from 'ething-js'

export default ({ app, router, Vue, store }) => {
  Vue.prototype.$ething = EThing
  window.EThing = EThing
}
