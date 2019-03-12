import WDeviceMultiLabel from '../../components/widgets/WDeviceMultiLabel'

export default {

  icon: 'mdi-toggle-switch',

  data (resource) {
    return {
      'state': resource.attr('state') ? 'on' : 'off'
    }
  },

  widgets: {
    'switch.state': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceMultiLabel,
      attributes: {
        items: [{
          attr: 'state',
          map: [{
            key: true,
            value: 'On'
          },{
            key: false,
            value: 'Off'
          }]
        }]
      },
      schema: {
        title: 'state (label)',
        description: 'show the state of the switch'
      },
      minWidth: 100,
      minHeight: 100
    }
  }

}
