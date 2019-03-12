import WDeviceMultiLabel from '../../components/widgets/WDeviceMultiLabel'

export default {

  icon: 'mdi-door',

  data (resource) {
    return {
      'state': resource.attr('state') ? 'opened' : 'closed'
    }
  },

  widgets: {
    'door.state': {
      in: ['dashboard', 'devicePage'],
      component: WDeviceMultiLabel,
      attributes: {
        items: [{
          attr: 'state',
          map: [{
            key: true,
            value: 'opened'
          },{
            key: false,
            value: 'closed'
          }]
        }]
      },
      schema: {
        title: 'state (label)',
        description: 'show the door state'
      },
      minWidth: 100,
      minHeight: 100
    }
  }

}
