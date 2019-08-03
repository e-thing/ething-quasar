import WDeviceMultiLabel from '../../components/widgets/WDeviceMultiLabel'

export default {

  data (resource) {
    return {
      'state': resource.attr('state') ? 'opened' : 'closed'
    }
  },

  /*widgets: {
    'door.state': {
      in: ['dashboard'],
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
      title: 'state',
      description: 'show the door state',
      minWidth: 100,
      minHeight: 100
    }
  }*/

}
