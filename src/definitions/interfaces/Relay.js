import WSwitch from '../../components/widgets/generic/Switch'

export default {

  components (resource) {
    return {
      'relay.switch': {
        icon: 'mdi-lightbulb',
        component: 'widget',
        attributes () {
          return {
            widget: 'relay.switch',
            height: '80px'
          }
        },
        title: 'Switch',
      }
    }
  },

  widgets (resource) {
    return {
      'relay.switch': {
        component: WSwitch,
        attributes (options) {
          return {
            value: resource.attr('state'),
            set (value) {
              return resource.execute('setState', value)
            }
          }
        },
        title: 'switch',
        description: 'toggle the device',
        minWidth: 60,
        minHeight: 60
      }
    }
  }

}
