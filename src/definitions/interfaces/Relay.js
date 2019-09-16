import WSwitch from '../../components/widgets/generic/Switch'

export default {

  badges (resource) {
    return {
      'state': {
        attributes () {
          return {
            clickable: true,
          }
        },
        listeners () {
          return {
            click (evt) {
              evt.stopPropagation()
              resource.execute('toggle')
            }
          }
        },
        zIndex: 10
      },
    }
  },

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
