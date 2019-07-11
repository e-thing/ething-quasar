import WSwitch from '../../components/widgets/WSwitch'

export default {

  data (resource) {
    return {
      'state': resource.attr('state') ? 'on' : 'off'
    }
  },

  widgets: {
    'switch.state': {
      in: ['dashboard'],
    },
    'relay.switch': {
      in: ['dashboard', 'devicePage'],
      component: WSwitch,
      attributes: {
        attr: 'state',
        set (resource, value) {
          return resource.execute('setState', value)
        }
      },
      title: 'switch',
      description: 'toggle the device',
      minWidth: 60,
      minHeight: 60
    }
  }

}
