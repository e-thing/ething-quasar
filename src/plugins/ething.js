import EThing from 'ething-js'

export default {
  install ({ EThingUI, Vue }) {
    
    // make arbo reactive !
    var vm =  new Vue({
      data: {
        arbo: EThing.arbo
      }
    })
      
    Vue.prototype.$ething = EThing
    window.EThing = EThing
    EThingUI.EThing = EThing
  }
}
