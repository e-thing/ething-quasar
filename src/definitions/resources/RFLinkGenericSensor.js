import {get} from '../../plugins/ething.meta'
import { extend } from 'quasar'


export default {

  dynamic (resource) {

    var interfaces = resource.types().filter(t => /^interfaces\//.test(t))

    var meta = extend(true, {}, this)

    interfaces.forEach(interfaceName => {

      var interfaceMeta = get(interfaceName)

      extend(true, meta, interfaceMeta)

    })

    return meta
  }

}
