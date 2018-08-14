import {meta} from '../../plugins/ething.meta'


export default {

  widgets: {
    'sensors': {
      label: 'sensor values',
      description: 'show all the sensors values',
      type: 'WGenericSensor'
    }

  },

  dynamic (resource) {

    var interfaces = resource.types().filter(t => /^interfaces\//.test(t))

    // copy
    var m = {}

    interfaces.forEach(interfaceName => {
      // extend
      meta.mergeClass(m, meta.get(interfaceName, true))
    })

    return m
  }

}
