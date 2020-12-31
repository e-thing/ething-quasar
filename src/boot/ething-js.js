/*
Load the ething-js library
*/
import EThing from 'ething-js'

export default ({ Vue }) => {

    // make ething reactive !
    var vm =  new Vue({
      data: {
        ething: EThing
        //arbo: EThing.arbo
      }
    })

    Vue.prototype.$ething = EThing
    if (window) {
      window.EThing = EThing
    }
}
