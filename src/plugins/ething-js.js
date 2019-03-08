/*
Load the ething-js library
*/
import EThing from 'ething-js'

export default ({ Vue }) => {

    // make arbo reactive !
    var vm =  new Vue({
      data: {
        arbo: EThing.arbo
      }
    })

    Vue.prototype.$ething = EThing
    if (window) {
      window.EThing = EThing
    }
}
