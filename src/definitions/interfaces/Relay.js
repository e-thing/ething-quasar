import WSwitch from '../../components/widgets/WSwitch'

export default {

  icon: 'mdi-toggle-switch',

  data (resource) {
    return {
      'state': resource.attr('state') ? 'on' : 'off'
    }
  },

  widgets: {
    'relay.switch': {
      in: ['dashboard', 'devicePage'],
      component: WSwitch,
      attributes: {
        attr: 'state',
        set (resource, value) {
          return resource.setState(value)
        }
      },
      schema:{
        title: 'switch',
        description: 'toggle the device'
      },
      minWidth: 60,
      minHeight: 60
    }
  }

}
